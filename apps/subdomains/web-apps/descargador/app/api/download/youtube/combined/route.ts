// app/api/download/youtube/combined/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { getYtDlpWithFfmpeg } from '@/lib/server/binaries'

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
    const ffmpegBin = ffmpeg || 'ffmpeg'

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
    // combinamos directamente con FFmpeg sin pasar por el bot verification de YouTube!
    if (video_url || (isAudioOnly && audio_url)) {
      console.log('⚡ [YouTube Engine] Utilizando combinación ultra rápida directa con FFmpeg...')
      if (downloadId && globalThis.__downloadProgressMap) {
        globalThis.__downloadProgressMap.set(downloadId, {
          percent: 30,
          status: 'merging',
          speed: 'FFmpeg Fast-Merge',
          updatedAt: Date.now()
        })
      }

      const mergeArgs: string[] = []
      if (video_url) {
        mergeArgs.push(
          '-headers', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.youtube.com/\r\n',
          '-i', video_url
        )
      }
      if (audio_url && !isAudioOnly) {
        mergeArgs.push(
          '-headers', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.youtube.com/\r\n',
          '-i', audio_url
        )
      } else if (isAudioOnly && audio_url) {
        mergeArgs.push(
          '-headers', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.youtube.com/\r\n',
          '-i', audio_url
        )
      }

      if (isAudioOnly) {
        if (finalExt === 'mp3') {
          mergeArgs.push('-c:a', 'libmp3lame', '-b:a', '192k')
        } else {
          mergeArgs.push('-c:a', 'copy')
        }
      } else {
        mergeArgs.push(
          '-c:v', 'copy',
          audio_url ? '-c:a' : '-c:a',
          audio_url ? 'aac' : 'copy'
        )
      }

      mergeArgs.push('-movflags', '+faststart', '-y', realFile)

      await new Promise<void>((resolve, reject) => {
        const proc = spawn(ffmpegBin, mergeArgs, { windowsHide: true })
        let stderr = ''
        proc.stderr.on('data', (d) => {
          stderr += d.toString()
          if (downloadId && globalThis.__downloadProgressMap) {
            const cur = globalThis.__downloadProgressMap.get(downloadId)
            globalThis.__downloadProgressMap.set(downloadId, {
              percent: Math.min((cur?.percent || 30) + 10, 95),
              status: 'merging',
              speed: 'FFmpeg Processing',
              updatedAt: Date.now()
            })
          }
        })
        proc.on('close', (code) => {
          if (code === 0 && fs.existsSync(realFile)) {
            if (downloadId && globalThis.__downloadProgressMap) {
              globalThis.__downloadProgressMap.set(downloadId, {
                percent: 100,
                status: 'completed',
                updatedAt: Date.now()
              })
            }
            resolve()
          } else {
            console.error('❌ FFmpeg direct merge error:', stderr.slice(-300))
            reject(new Error(`FFmpeg falló con código ${code}: ${stderr.slice(-300)}`))
          }
        })
        proc.on('error', (err) => reject(err))
      })

    } else {
      // 🛠️ MÉTODO 2: Descarga completa mediante yt-dlp usando clientes anti-bot (visionos)
      let formatArg = ''
      if (isAudioOnly) {
        if (audio_itag) {
          formatArg = `${audio_itag}/bestaudio[ext=m4a]/bestaudio/best`
        } else {
          formatArg = 'bestaudio[ext=m4a]/bestaudio/best'
        }
      } else if (video_itag && audio_itag) {
        formatArg = `${video_itag}+${audio_itag}/${video_itag}+bestaudio/bestvideo[height<=${targetHeight}]+bestaudio/best[height<=${targetHeight}]/best`
      } else if (video_itag && !audio_itag) {
        formatArg = `${video_itag}/bestvideo[height<=${targetHeight}]/best`
      } else {
        formatArg = `bestvideo[height<=${targetHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${targetHeight}]+bestaudio/best[height<=${targetHeight}]/best`
      }

      const tempOutputPattern = `${tempFileBase}.%(ext)s`
      const nodeBin = process.execPath || 'node'
      const cookieArgs = getCookiesArg()
      const ytArgs: string[] = [
        ...ffmpegArgs,
        '--js-runtimes', `node:${nodeBin}`,
        '--newline',
        '--no-playlist',
        '--no-warnings',
        '--no-part',
        '--no-check-certificates',
        '--geo-bypass',
        '--extractor-args', 'youtube:player_client=visionos',
        ...cookieArgs,
        '-f', formatArg,
        '-o', tempOutputPattern,
      ]

      if (isAudioOnly) {
        ytArgs.push('-x', '--audio-format', finalExt)
      } else {
        ytArgs.push('--merge-output-format', 'mp4')
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
          console.log('🧹 [YouTube Engine] Archivo temporal limpiado:', realFile)
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
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
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