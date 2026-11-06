// app/api/download/youtube/combined/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'
import dns from 'dns'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { getYtDlpWithFfmpeg, findFfmpegBinary, getSafeContentDisposition } from '@/lib/server/binaries'

try {
  dns.setDefaultResultOrder('ipv6first')
} catch {}

async function downloadStreamToDisk(
  sourceUrl: string,
  destPath: string,
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'identity',
    'Range': 'bytes=0-',
    'Referer': 'https://www.youtube.com/',
    'Origin': 'https://www.youtube.com',
    'Sec-Fetch-Dest': 'video',
    'Sec-Fetch-Mode': 'cors'
  }

  const res = await fetch(sourceUrl, { headers, redirect: 'follow', signal: AbortSignal.timeout(120000) })
  if (!res.ok) {
    throw new Error(`Error ${res.status} al descargar stream (${sourceUrl.slice(0, 60)}...)`)
  }
  if (!res.body) {
    throw new Error('No se recibió cuerpo de respuesta multimedia desde YouTube')
  }

  const total = parseInt(res.headers.get('content-length') || '0', 10)
  let loaded = 0
  const fileStream = fs.createWriteStream(destPath)
  const reader = res.body.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    fileStream.write(value)
    loaded += value.length
    if (onProgress) {
      onProgress(loaded, total)
    }
  }

  fileStream.end()
  await new Promise<void>((resolve, reject) => {
    fileStream.on('finish', resolve)
    fileStream.on('error', reject)
  })
}

async function extractMetadata(url: string, binPath: string, playerClient = 'visionos,ios'): Promise<any> {
  const nodeBin = process.execPath || 'node'
  const cookieArgs = getCookiesArg()

  return new Promise((resolve, reject) => {
    const args = [
      '--force-ipv4',
      '--socket-timeout', '10',
      '--dump-json',
      '--js-runtimes', `node:${nodeBin}`,
      '--no-warnings',
      '--no-check-certificates',
      '--geo-bypass',
      '--extractor-args', `youtube:player_client=${playerClient}`,
      ...cookieArgs,
      url
    ]

    console.log(`🚀 [YouTube Serverless] Extrayendo metadatos: ${binPath} con ${url} (player_client=${playerClient})`)
    const ytProcess = spawn(binPath, args)

    let stdout = ''
    let stderr = ''
    let isDone = false

    const timer = setTimeout(() => {
      if (!isDone) {
        isDone = true
        try { ytProcess.kill('SIGKILL') } catch {}
        reject(new Error(`Timeout de 14s extrayendo con ${playerClient}`))
      }
    }, 14000)

    ytProcess.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    ytProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    ytProcess.on('error', (err) => {
      if (isDone) return
      isDone = true
      clearTimeout(timer)
      reject(new Error(`No se pudo ejecutar el extractor (${err.message})`))
    })

    ytProcess.on('close', (code) => {
      if (isDone) return
      isDone = true
      clearTimeout(timer)
      if (code === 0 && stdout) {
        try {
          const parsed = JSON.parse(stdout)
          resolve(parsed)
        } catch (e: any) {
          reject(new Error(`JSON de respuesta inválido: ${e.message}`))
        }
      } else {
        reject(new Error(stderr || `Extractor terminó con código ${code}`))
      }
    })
  })
}

export const maxDuration = 300 // 5 minutos máximo para descargas grandes

function getCookiesArg(): string[] {
  const candidatePaths = [
    path.join(process.cwd(), 'cookies.txt'),
    path.join(process.cwd(), 'apps', 'subdomains', 'web-apps', 'descargador', 'bin', 'cookies.txt'),
    path.join(process.cwd(), 'apps', 'subdomains', 'web-apps', 'descargador', 'cookies.txt'),
    path.join(process.cwd(), 'bin', 'cookies.txt')
  ]

  for (const cp of candidatePaths) {
    try {
      if (fs.existsSync(cp)) {
        return ['--cookies', cp]
      }
    } catch {}
  }

  const envCookies = process.env.YOUTUBE_COOKIES || process.env.YT_COOKIES
  if (envCookies) {
    try {
      const cookieFile = path.join(os.tmpdir(), 'yt_cookies.txt')
      const isBase64 = envCookies.startsWith('data:') || (/^[A-Za-z0-9+/=]+$/.test(envCookies.trim()) && envCookies.length > 100)
      const content = isBase64
        ? Buffer.from(envCookies.trim(), 'base64').toString('utf-8')
        : envCookies
      fs.writeFileSync(cookieFile, content, 'utf-8')
      return ['--cookies', cookieFile]
    } catch {}
  }

  return []
}

function cleanUrl(inputUrl: string): string {
  try {
    const urlObj = new URL(inputUrl)
    const videoId = urlObj.searchParams.get('v')
    if (videoId) return `https://www.youtube.com/watch?v=${videoId}`

    // Detectar YouTube Shorts (/shorts/ID)
    const shortsMatch = urlObj.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/)
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/watch?v=${shortsMatch[1]}`
    }

    // Detectar enlaces cortos youtu.be/ID
    if (urlObj.hostname.includes('youtu.be')) {
      const parts = urlObj.pathname.split('/').filter(Boolean)
      if (parts[0]) {
        return `https://www.youtube.com/watch?v=${parts[0]}`
      }
    }

    return inputUrl.split(/[?&]/)[0]
  } catch {
    return inputUrl.split(/[?&]/)[0]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      url,
      quality = '1080p',
      format_type = 'mp4',
      video_itag,
      audio_itag,
      downloadId,
      video_url,
      audio_url,
      filename: customFilename
    } = body

    if (!url && !video_url && !audio_url) {
      return NextResponse.json({ error: 'URL o enlaces de medios son requeridos' }, { status: 400 })
    }

    if (!globalThis.__downloadProgressMap) {
      globalThis.__downloadProgressMap = new Map()
    }

    if (downloadId) {
      globalThis.__downloadProgressMap.set(downloadId, {
        percent: 0,
        status: 'starting',
        updatedAt: Date.now()
      })
    }

    const cleanedUrl = url ? cleanUrl(url) : (video_url || '')
    const { ytDlp, ffmpeg, ffmpegArgs, binDir } = getYtDlpWithFfmpeg()
    const ffmpegBin = findFfmpegBinary() || ffmpeg || 'ffmpeg'

    console.log('🎬 [YouTube Combined Engine] Iniciando descarga real...', {
      url: cleanedUrl,
      quality,
      format_type,
      video_itag,
      audio_itag,
      hasDirectVideo: !!video_url,
      hasDirectAudio: !!audio_url,
      downloadId,
      binDir,
      ffmpegLocation: ffmpeg
    })

    const isAudioOnly = quality === 'audio' || (!video_itag && !!audio_itag) || (!video_url && !!audio_url) || format_type === 'mp3' || format_type === 'm4a'
    const targetHeight = parseInt(quality.match(/\d+/)?.[0] || '1080')
    const finalExt = isAudioOnly ? (format_type === 'mp3' ? 'mp3' : 'm4a') : 'mp4'

    // 🔒 Validación de suscripción PRO para descargas combinadas en alta calidad (> 720p)
    const authPlan = request.headers.get('x-user-plan') || body.plan
    const isProUser = authPlan === 'pro' || authPlan === 'business' || body.is_pro === true

    // Las descargas combinadas (video + audio) mayores a 720p (1080p, 1440p, 2160p) requieren PRO
    const isCombinedHighRes = targetHeight > 720 && !isAudioOnly && audio_itag !== null
    if (isCombinedHighRes && !isProUser) {
      console.warn(`🔒 [YouTube Engine] Intento de descarga combinada ${quality} sin Plan PRO activo.`)
      return NextResponse.json({
        error: `Las descargas combinadas en alta calidad (${quality}) requieren suscripción al Plan PRO. Actualiza tu cuenta en /planes para desbloquear 1080p, 2K y 4K con máxima velocidad.`,
        code: 'PRO_REQUIRED',
        upgrade_url: '/planes'
      }, { status: 403 })
    }

    const tempDir = os.tmpdir()
    const tempFileBase = path.join(tempDir, `ytdl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`)
    const expectedFile = `${tempFileBase}.${finalExt}`
    let realFile = expectedFile

    // 🚀 MÉTODO 1: Si el cliente ya nos envió las URLs directas extraídas (signed googlevideo.com URLs),
    // intentamos descargarlas a disco de forma concurrente y combinarlas ultra rápido con FFmpeg local
    let method1Done = false
    if (video_url || (isAudioOnly && audio_url)) {
      console.log('⚡ [YouTube Engine] Intentando combinación ultra rápida de streams directos...')
      const tempVideoFile = path.join(tempDir, `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.tmp`)
      const tempAudioFile = path.join(tempDir, `a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.tmp`)

      try {
        if (downloadId && globalThis.__downloadProgressMap) {
          globalThis.__downloadProgressMap.set(downloadId, {
            percent: 25,
            status: 'downloading',
            speed: 'Descargando flujos...',
            updatedAt: Date.now()
          })
        }

        if (isAudioOnly && audio_url) {
          await downloadStreamToDisk(audio_url, tempAudioFile)
          if (finalExt === 'mp3') {
            if (downloadId && globalThis.__downloadProgressMap) {
              globalThis.__downloadProgressMap.set(downloadId, {
                percent: 85,
                status: 'merging',
                speed: 'Convirtiendo a MP3...',
                updatedAt: Date.now()
              })
            }
            await new Promise<void>((resolve, reject) => {
              const proc = spawn(ffmpegBin, ['-i', tempAudioFile, '-c:a', 'libmp3lame', '-b:a', '192k', '-y', realFile], { windowsHide: true })
              let stderr = ''
              proc.stderr.on('data', (d) => { stderr += d.toString() })
              proc.on('close', (code) => {
                if (code === 0 && fs.existsSync(realFile)) resolve()
                else reject(new Error(`FFmpeg MP3 error (${code}): ${stderr.slice(-200)}`))
              })
              proc.on('error', reject)
            })
          } else {
            await fs.promises.copyFile(tempAudioFile, realFile)
          }
        } else if (video_url && audio_url) {
          // Descargar video y audio en paralelo directamente con fetch nativo
          let vLoaded = 0, vTotal = 0
          let aLoaded = 0, aTotal = 0

          const updateDualProgress = () => {
            if (downloadId && globalThis.__downloadProgressMap) {
              const totalBytes = vTotal + aTotal
              const loadedBytes = vLoaded + aLoaded
              const pct = totalBytes > 0
                ? Math.min(30 + Math.round((loadedBytes / totalBytes) * 50), 80)
                : 35
              globalThis.__downloadProgressMap.set(downloadId, {
                percent: pct,
                status: 'downloading',
                speed: `Descargando: ${(loadedBytes / (1024 * 1024)).toFixed(1)} MB`,
                updatedAt: Date.now()
              })
            }
          }

          await Promise.all([
            downloadStreamToDisk(video_url, tempVideoFile, (l, t) => {
              vLoaded = l; vTotal = t; updateDualProgress()
            }),
            downloadStreamToDisk(audio_url, tempAudioFile, (l, t) => {
              aLoaded = l; aTotal = t; updateDualProgress()
            })
          ])

          if (downloadId && globalThis.__downloadProgressMap) {
            globalThis.__downloadProgressMap.set(downloadId, {
              percent: 85,
              status: 'merging',
              speed: 'Combinando audio y video...',
              updatedAt: Date.now()
            })
          }

          // Combinar archivos locales con FFmpeg (operación instantánea en disco local)
          const mergeArgs = [
            '-i', tempVideoFile,
            '-i', tempAudioFile,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-movflags', '+faststart',
            '-y', realFile
          ]

          await new Promise<void>((resolve, reject) => {
            const proc = spawn(ffmpegBin, mergeArgs, { windowsHide: true })
            let stderr = ''
            proc.stderr.on('data', (d) => {
              stderr += d.toString()
              if (downloadId && globalThis.__downloadProgressMap) {
                const cur = globalThis.__downloadProgressMap.get(downloadId)
                globalThis.__downloadProgressMap.set(downloadId, {
                  percent: Math.min((cur?.percent || 85) + 3, 98),
                  status: 'merging',
                  speed: 'FFmpeg Processing',
                  updatedAt: Date.now()
                })
              }
            })
            proc.on('close', (code) => {
              if (code === 0 && fs.existsSync(realFile)) {
                resolve()
              } else {
                console.error('❌ FFmpeg local merge error:', stderr.slice(-300))
                reject(new Error(`FFmpeg falló con código ${code}: ${stderr.slice(-300)}`))
              }
            })
            proc.on('error', (err) => reject(err))
          })
        } else if (video_url) {
          // Solo video (video progresivo o formato simple)
          await downloadStreamToDisk(video_url, tempVideoFile)
          await fs.promises.copyFile(tempVideoFile, realFile)
        }

        if (fs.existsSync(realFile) && fs.statSync(realFile).size > 0) {
          method1Done = true
          if (downloadId && globalThis.__downloadProgressMap) {
            globalThis.__downloadProgressMap.set(downloadId, {
              percent: 100,
              status: 'completed',
              updatedAt: Date.now()
            })
          }
        }
      } catch (streamErr: any) {
        console.warn('⚠️ [YouTube Engine] Descarga directa de stream falló (' + streamErr.message + '), pasando automáticamente al motor yt-dlp...')
      } finally {
        try { if (fs.existsSync(tempVideoFile)) fs.unlinkSync(tempVideoFile) } catch {}
        try { if (fs.existsSync(tempAudioFile)) fs.unlinkSync(tempAudioFile) } catch {}
      }
    }

    if (!method1Done && cleanedUrl && cleanedUrl.startsWith('http')) {
      // 🚀 MÉTODO 2: Extracción fresca con cliente anti-bloqueo iOS/visionOS + descarga directa a disco y merge FFmpeg
      console.log('🚀 [YouTube Engine] Método 2: Extrayendo streams frescos con cliente anti-bloqueo (visionos,ios)...')
      const tempVideoFile = path.join(tempDir, `v_m2_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.tmp`)
      const tempAudioFile = path.join(tempDir, `a_m2_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.tmp`)

      try {
        if (downloadId && globalThis.__downloadProgressMap) {
          globalThis.__downloadProgressMap.set(downloadId, {
            percent: 15,
            status: 'downloading',
            speed: 'Conectando con YouTube...',
            updatedAt: Date.now()
          })
        }

        const metadata = await extractMetadata(cleanedUrl, ytDlp, 'visionos,ios')
        const formats: any[] = metadata.formats || []

        if (isAudioOnly) {
          const aFormat = formats.find((f: any) =>
            (audio_itag ? String(f.format_id) === String(audio_itag) : false) ||
            (f.acodec !== 'none' && f.vcodec === 'none' && String(f.format_id) === '140')
          ) || formats.find((f: any) => f.acodec !== 'none' && f.vcodec === 'none')

          if (aFormat?.url) {
            await downloadStreamToDisk(aFormat.url, tempAudioFile)
            if (finalExt === 'mp3') {
              await new Promise<void>((resolve, reject) => {
                const proc = spawn(ffmpegBin, ['-i', tempAudioFile, '-c:a', 'libmp3lame', '-b:a', '192k', '-y', realFile], { windowsHide: true })
                let stderr = ''
                proc.stderr.on('data', (d) => { stderr += d.toString() })
                proc.on('close', (code) => {
                  if (code === 0 && fs.existsSync(realFile)) resolve()
                  else reject(new Error(`FFmpeg MP3 error (${code}): ${stderr.slice(-200)}`))
                })
                proc.on('error', reject)
              })
            } else {
              await fs.promises.copyFile(tempAudioFile, realFile)
            }
            if (fs.existsSync(realFile) && fs.statSync(realFile).size > 0) {
              method1Done = true
            }
          }
        } else {
          // Seleccionar formato de video según resolución solicitada
          const vFormat = formats.find((f: any) =>
            (video_itag ? String(f.format_id) === String(video_itag) : false) ||
            (f.vcodec !== 'none' && f.height === targetHeight)
          ) || formats.find((f: any) => f.vcodec !== 'none' && f.height && f.height <= targetHeight) || formats.find((f: any) => f.vcodec !== 'none')

          // Seleccionar mejor formato de audio
          const aFormat = formats.find((f: any) =>
            (audio_itag ? String(f.format_id) === String(audio_itag) : false) ||
            (f.acodec !== 'none' && f.vcodec === 'none' && String(f.format_id) === '140')
          ) || formats.find((f: any) => f.acodec !== 'none' && f.vcodec === 'none')

          if (vFormat?.url && aFormat?.url) {
            console.log(`⚡ [YouTube Engine M2] Streams encontrados (Video: ${vFormat.format_id} ${vFormat.height}p, Audio: ${aFormat.format_id}). Descargando...`)
            let vLoaded = 0, vTotal = 0
            let aLoaded = 0, aTotal = 0

            const updateDualProgress = () => {
              if (downloadId && globalThis.__downloadProgressMap) {
                const totalBytes = vTotal + aTotal
                const loadedBytes = vLoaded + aLoaded
                const pct = totalBytes > 0
                  ? Math.min(25 + Math.round((loadedBytes / totalBytes) * 55), 80)
                  : 35
                globalThis.__downloadProgressMap.set(downloadId, {
                  percent: pct,
                  status: 'downloading',
                  speed: `Descargando: ${(loadedBytes / (1024 * 1024)).toFixed(1)} MB`,
                  updatedAt: Date.now()
                })
              }
            }

            await Promise.all([
              downloadStreamToDisk(vFormat.url, tempVideoFile, (l, t) => {
                vLoaded = l; vTotal = t; updateDualProgress()
              }),
              downloadStreamToDisk(aFormat.url, tempAudioFile, (l, t) => {
                aLoaded = l; aTotal = t; updateDualProgress()
              })
            ])

            if (downloadId && globalThis.__downloadProgressMap) {
              globalThis.__downloadProgressMap.set(downloadId, {
                percent: 85,
                status: 'merging',
                speed: 'Combinando audio y video con FFmpeg...',
                updatedAt: Date.now()
              })
            }

            const mergeArgs = [
              '-i', tempVideoFile,
              '-i', tempAudioFile,
              '-c:v', 'copy',
              '-c:a', 'aac',
              '-movflags', '+faststart',
              '-y', realFile
            ]

            await new Promise<void>((resolve, reject) => {
              const proc = spawn(ffmpegBin, mergeArgs, { windowsHide: true })
              let stderr = ''
              proc.stderr.on('data', (d) => { stderr += d.toString() })
              proc.on('close', (code) => {
                if (code === 0 && fs.existsSync(realFile)) resolve()
                else reject(new Error(`FFmpeg merge error (${code}): ${stderr.slice(-200)}`))
              })
              proc.on('error', reject)
            })

            if (fs.existsSync(realFile) && fs.statSync(realFile).size > 0) {
              method1Done = true
              if (downloadId && globalThis.__downloadProgressMap) {
                globalThis.__downloadProgressMap.set(downloadId, {
                  percent: 100,
                  status: 'completed',
                  updatedAt: Date.now()
                })
              }
            }
          }
        }
      } catch (err: any) {
        console.warn('⚠️ [YouTube Engine] Método 2 falló (' + err.message + '), pasando a yt-dlp directo...')
      } finally {
        try { if (fs.existsSync(tempVideoFile)) fs.unlinkSync(tempVideoFile) } catch {}
        try { if (fs.existsSync(tempAudioFile)) fs.unlinkSync(tempAudioFile) } catch {}
      }
    }

    if (!method1Done) {
      // 🛠️ MÉTODO 3: Fallback de descarga completa mediante yt-dlp usando cliente visionos,ios
      console.log('🚀 [YouTube Engine] Ejecutando motor de descarga robusta yt-dlp (Método 3)...')
      let formatArg = ''
      if (isAudioOnly) {
        if (audio_itag) {
          formatArg = `${audio_itag}/bestaudio[ext=m4a]/bestaudio/best`
        } else {
          formatArg = 'bestaudio[ext=m4a]/bestaudio/best'
        }
      } else if (video_itag && audio_itag) {
        formatArg = `${video_itag}+${audio_itag}/${video_itag}+bestaudio[ext=m4a]/bestvideo[height<=${targetHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${targetHeight}]+bestaudio/best`
      } else if (video_itag && !audio_itag) {
        formatArg = `${video_itag}/bestvideo[height<=${targetHeight}][ext=mp4]/bestvideo[height<=${targetHeight}]/best`
      } else {
        formatArg = `bestvideo[height<=${targetHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${targetHeight}]+bestaudio[ext=m4a]/bestvideo[height<=${targetHeight}]+bestaudio/best`
      }

      const tempOutputPattern = `${tempFileBase}.%(ext)s`
      const nodeBin = process.execPath || 'node'
      const cookieArgs = getCookiesArg()
      const ytArgs: string[] = [
        ...ffmpegArgs,
        '--force-ipv4',
        '--socket-timeout', '15',
        '--js-runtimes', `node:${nodeBin}`,
        '--newline',
        '--no-playlist',
        '--no-warnings',
        '--no-part',
        '--no-check-certificates',
        '--geo-bypass',
        '--extractor-args', 'youtube:player_client=visionos,ios',
        ...cookieArgs,
        '-f', formatArg,
        '-o', tempOutputPattern,
      ]

      if (isAudioOnly) {
        ytArgs.push('-x', '--audio-format', finalExt)
      } else {
        ytArgs.push('--merge-output-format', 'mp4')
        ytArgs.push('--postprocessor-args', 'ffmpeg:-c:a aac -b:a 192k')
      }

      ytArgs.push(cleanedUrl)

      console.log('🚀 [YouTube Engine] Ejecutando comando yt-dlp:', ytDlp, ytArgs.join(' '))

      await new Promise<void>((resolve, reject) => {
        const proc = spawn(ytDlp, ytArgs, {
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'pipe']
        })

        const parseProgress = (chunk: Buffer | string) => {
          const text = chunk.toString()
          const lines = text.split(/[\r\n]+/)
          for (const line of lines) {
            if (line.includes('[download]') && line.includes('%')) {
              process.stdout.write(`\r${line.trim()}`)

              if (downloadId && globalThis.__downloadProgressMap) {
                const pMatch = line.match(/\[download\]\s+([\d\.]+)%/i)
                const speedMatch = line.match(/at\s+([^\s]+)/i)
                const etaMatch = line.match(/ETA\s+([^\s\r\n]+)/i)

                if (pMatch) {
                  const percent = Math.min(Math.max(parseFloat(pMatch[1]) || 0, 0), 100)
                  globalThis.__downloadProgressMap.set(downloadId, {
                    percent,
                    speed: speedMatch ? speedMatch[1] : undefined,
                    eta: etaMatch ? etaMatch[1] : undefined,
                    status: percent >= 100 ? 'merging' : 'downloading',
                    updatedAt: Date.now()
                  })
                }
              }
            } else if (line.includes('[Merger]') || line.includes('ffmpeg') || line.includes('Destination')) {
              if (downloadId && globalThis.__downloadProgressMap) {
                const current = globalThis.__downloadProgressMap.get(downloadId)
                globalThis.__downloadProgressMap.set(downloadId, {
                  percent: Math.max(current?.percent || 90, 95),
                  status: 'merging',
                  updatedAt: Date.now()
                })
              }
            }
          }
        }

        let stderr = ''
        proc.stderr.on('data', (d) => {
          stderr += d.toString()
          parseProgress(d)
        })
        proc.stdout.on('data', (d) => {
          parseProgress(d)
        })

        proc.on('close', (code) => {
          if (code === 0) {
            if (downloadId && globalThis.__downloadProgressMap) {
              globalThis.__downloadProgressMap.set(downloadId, {
                percent: 100,
                status: 'completed',
                updatedAt: Date.now()
              })
            }
            resolve()
          } else {
            if (downloadId && globalThis.__downloadProgressMap) {
              globalThis.__downloadProgressMap.set(downloadId, {
                percent: 0,
                status: 'error',
                updatedAt: Date.now()
              })
            }
            console.error('❌ [YouTube Engine] Error en yt-dlp stderr:', stderr)
            reject(new Error(stderr || `yt-dlp finalizó con código ${code}`))
          }
        })

        proc.on('error', (err) => {
          reject(err)
        })
      })

      // Encontrar el archivo generado por yt-dlp
      if (!fs.existsSync(realFile)) {
        const files = fs.readdirSync(tempDir).filter(f => f.startsWith(path.basename(tempFileBase)))
        if (files.length > 0) {
          realFile = path.join(tempDir, files[0])
        } else {
          throw new Error('El archivo procesado no fue encontrado en el disco temporal')
        }
      }
    }

    const stat = await fs.promises.stat(realFile)
    if (stat.size === 0) {
      try { await fs.promises.unlink(realFile) } catch {}
      throw new Error('El archivo descargado tiene tamaño 0')
    }

    console.log(`✅ [YouTube Engine] Archivo generado exitosamente: ${realFile} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`)

    const nodeStream = fs.createReadStream(realFile)
    const cleanup = () => {
      try {
        if (fs.existsSync(realFile)) {
          fs.unlinkSync(realFile)
          console.log('🧹 [YouTube Engine] Transmisión enviada con éxito al cliente. Temporal del servidor liberado:', realFile)
        }
      } catch (e) {
        console.warn('Advertencia limpiando archivo temporal:', e)
      }
    }

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => {
          controller.enqueue(chunk)
        })
        nodeStream.on('end', () => {
          controller.close()
          cleanup()
        })
        nodeStream.on('error', (err) => {
          controller.error(err)
          cleanup()
        })
      },
      cancel() {
        nodeStream.destroy()
        cleanup()
      }
    })

    const downloadFilename = customFilename || (isAudioOnly
      ? `audio_${quality}_${Date.now()}.${finalExt}`
      : `youtube_combined_${quality}_${Date.now()}.mp4`)

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': isAudioOnly ? (finalExt === 'mp3' ? 'audio/mpeg' : 'audio/mp4') : 'video/mp4',
        'Content-Disposition': getSafeContentDisposition(downloadFilename),
        'Content-Length': stat.size.toString(),
        'X-File-Size': stat.size.toString(),
        'X-Combined': 'true',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })

  } catch (error: any) {
    console.error('💥 [YouTube Combined] Error:', error)
    let errorMsg = error?.message || 'Error desconocido al procesar el video'
    if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
      errorMsg = 'YouTube restringió temporalmente este formato específico. Por favor reintenta con 720p o vuelve a intentarlo en unos instantes.'
    }
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'YouTube Combined Engine Activo con yt-dlp y ffmpeg nativo',
    endpoint: 'POST /api/download/youtube/combined'
  })
}