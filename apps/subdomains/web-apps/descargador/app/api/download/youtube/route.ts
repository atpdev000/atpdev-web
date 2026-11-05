// app/api/download/youtube/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { findYtDlpBinary } from '@/lib/server/binaries'

export const maxDuration = 60

function getCookiesArg(): string[] {
  // 1. Archivo físico cookies.txt en el proyecto o bin
  const candidatePaths = [
    path.join(process.cwd(), 'cookies.txt'),
    path.join(process.cwd(), 'apps', 'subdomains', 'web-apps', 'descargador', 'bin', 'cookies.txt'),
    path.join(process.cwd(), 'apps', 'subdomains', 'web-apps', 'descargador', 'cookies.txt'),
    path.join(process.cwd(), 'bin', 'cookies.txt')
  ]

  for (const cp of candidatePaths) {
    try {
      if (fs.existsSync(cp)) {
        console.log(`🍪 [YouTube] Usando archivo de cookies local: ${cp}`)
        return ['--cookies', cp]
      }
    } catch {}
  }

  // 2. Variable de entorno YOUTUBE_COOKIES o YT_COOKIES (texto Netscape o Base64)
  const envCookies = process.env.YOUTUBE_COOKIES || process.env.YT_COOKIES
  if (envCookies) {
    try {
      const cookieFile = path.join(os.tmpdir(), 'yt_cookies.txt')
      const isBase64 = envCookies.startsWith('data:') || (/^[A-Za-z0-9+/=]+$/.test(envCookies.trim()) && envCookies.length > 100)
      const content = isBase64
        ? Buffer.from(envCookies.trim(), 'base64').toString('utf-8')
        : envCookies
      fs.writeFileSync(cookieFile, content, 'utf-8')
      console.log('🍪 [YouTube] Cookies cargadas desde variable de entorno')
      return ['--cookies', cookieFile]
    } catch (e: any) {
      console.warn('⚠️ [YouTube] Error cargando cookies desde variable:', e.message)
    }
  }

  return []
}

function formatBytes(bytes: number): string {
  if (!bytes || isNaN(bytes)) return 'Auto'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`
  }
  return `${mb.toFixed(1)} MB`
}

function cleanYoutubeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const videoId = urlObj.searchParams.get('v')
    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const parts = urlObj.pathname.split('/').filter(Boolean)
      if (parts[0]) {
        return `https://www.youtube.com/watch?v=${parts[0]}`
      }
    }
    if (url.includes('/shorts/')) {
      const parts = urlObj.pathname.split('/').filter(Boolean)
      const shortsIndex = parts.indexOf('shorts')
      if (shortsIndex !== -1 && parts[shortsIndex + 1]) {
        return `https://www.youtube.com/watch?v=${parts[shortsIndex + 1]}`
      }
    }
    const idx = url.indexOf('&')
    return idx !== -1 ? url.substring(0, idx) : url
  } catch {
    return url.split('&')[0]
  }
}

function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const v = urlObj.searchParams.get('v')
    if (v) return v
    if (url.includes('youtu.be/')) {
      const parts = urlObj.pathname.split('/').filter(Boolean)
      if (parts[0]) return parts[0]
    }
    if (url.includes('/shorts/')) {
      const parts = urlObj.pathname.split('/').filter(Boolean)
      const idx = parts.indexOf('shorts')
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    }
    const match = url.match(/(?:v=|\/|be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  } catch {
    const match = url.match(/(?:v=|\/|be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  }
}

async function extractWithInvidious(url: string): Promise<any> {
  const videoId = extractVideoId(url)
  if (!videoId) return null

  const invidiousHosts = [
    'https://yt.chocolatemoo53.com',
    'https://invidious.projectsegfau.lt',
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de'
  ]

  for (const host of invidiousHosts) {
    try {
      console.log(`🌐 [YouTube Invidious Fallback] Consultando: ${host}/api/v1/videos/${videoId}`)
      const res = await fetch(`${host}/api/v1/videos/${videoId}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(6000)
      })
      if (!res.ok) continue
      const data = await res.json()
      if (!data || !data.title || !(data.adaptiveFormats?.length || data.formatStreams?.length)) {
        continue
      }

      const rawAdaptive = data.adaptiveFormats || []
      const rawStreams = data.formatStreams || []
      const all = [...rawStreams, ...rawAdaptive]

      const formats = all.filter((f: any) => f.url || f.itag).map((f: any) => {
        const isVideo = f.type ? f.type.startsWith('video/') : !!f.resolution
        const isAudio = f.type ? f.type.startsWith('audio/') : !f.resolution
        const height = f.resolution ? parseInt(f.resolution.replace('p', '')) : (f.qualityLabel ? parseInt(f.qualityLabel) : null)

        // Usar stream proxy de Invidious para eludir 403 Forbidden por bloqueo de IP
        const streamUrl = f.url || (f.itag ? `${host}/latest_version?id=${videoId}&itag=${f.itag}` : '')

        return {
          format_id: String(f.itag || ''),
          url: streamUrl,
          direct_url: f.url,
          ext: f.container || (isAudio ? 'm4a' : 'mp4'),
          height: height,
          width: null,
          resolution: f.resolution || (height ? `${height}p` : (isAudio ? 'Audio' : null)),
          format_note: f.qualityLabel || (height ? `${height}p` : (isAudio ? (f.audioQuality || 'Audio') : null)),
          filesize: f.clen ? parseInt(f.clen) : null,
          vcodec: isVideo ? (f.encoding || 'h264') : 'none',
          acodec: isAudio ? (f.encoding || 'aac') : (rawStreams.includes(f) ? 'aac' : 'none'),
          fps: f.fps || null
        }
      })

      console.log(`✅ [YouTube Invidious Fallback] Éxito con ${host}: "${data.title}" (${formats.length} formatos)`)
      return {
        id: videoId,
        title: data.title,
        thumbnail: data.videoThumbnails?.find((t: any) => t.quality === 'maxres')?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration: data.lengthSeconds || 0,
        uploader: data.author,
        channel: data.author,
        view_count: data.viewCount || 0,
        formats
      }
    } catch (e: any) {
      console.warn(`⚠️ [YouTube Invidious Fallback] ${host} falló:`, e.message)
    }
  }
  return null
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

    console.log(`🚀 [YouTube Serverless] Ejecutando: ${binPath} con ${url} (player_client=${playerClient})`)
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
        const errorMsg = stderr || `Proceso terminó con código ${code}`
        reject(new Error(errorMsg))
      }
    })
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    let { url, quality = '1080p', format_type = 'mp4' } = body

    if (!url) {
      return NextResponse.json({ error: 'URL es requerida' }, { status: 400 })
    }

    const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)/
    if (!youtubeRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL de YouTube inválida. Ingresa un enlace de youtube.com o youtu.be' },
        { status: 400 }
      )
    }

    const cleanedUrl = cleanYoutubeUrl(url)
    console.log('🎬 [YouTube Serverless] Procesando URL:', cleanedUrl)

    const bin = findYtDlpBinary()
    let rawInfo: any = null
    let extractionError: any = null

    if (bin) {
      try {
        // Intento 1 con clientes visionos,ios (bypasea el bloqueo bot de datacenters como Render)
        rawInfo = await extractMetadata(cleanedUrl, bin, 'visionos,ios')
      } catch (err: any) {
        console.warn('⚠️ [YouTube Serverless] Intento 1 falló:', err.message)
        try {
          console.log('🔄 [YouTube Serverless] Reintentando con cliente alternativo (ios,mweb)...')
          rawInfo = await extractMetadata(cleanedUrl, bin, 'ios,mweb')
        } catch (retryErr: any) {
          console.error('❌ [YouTube Serverless] Reintento ios,mweb falló:', retryErr.message)
          extractionError = retryErr
        }
      }
    }

    // Fallback 1 a Invidious API resolver de alta velocidad (bypasea 100% bloqueos de IP en datacenters)
    if (!rawInfo) {
      try {
        console.log('🔄 [YouTube] Intentando fallback con Invidious API...')
        rawInfo = await extractWithInvidious(cleanedUrl)
        if (rawInfo) {
          console.log('🎉 [YouTube] Fallback con Invidious exitoso')
        }
      } catch (invidiousErr: any) {
        console.error('❌ [YouTube] Invidious fallback falló:', invidiousErr.message)
      }
    }

    // Fallback 2 a API externa Python si está configurada
    const PYTHON_API_URL = process.env.PYTHON_API_URL?.replace(/\/$/, '')
    if (!rawInfo && PYTHON_API_URL) {
      try {
        console.log('🔄 [YouTube] Intentando fallback con API externa:', PYTHON_API_URL)
        const extRes = await fetch(`${PYTHON_API_URL}/api/v1/youtube/download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanedUrl, quality, format_type })
        })
        if (extRes.ok) {
          const extData = await extRes.json()
          return NextResponse.json(extData)
        }
      } catch (extErr: any) {
        console.error('❌ [YouTube] Fallback externo también falló:', extErr.message)
      }
    }

    if (!rawInfo) {
      return NextResponse.json(
        {
          error: extractionError
            ? `Error procesando video de YouTube: ${extractionError.message}`
            : 'No se pudo extraer la información del video de YouTube.'
        },
        { status: 500 }
      )
    }

    // Procesar formatos de video y audio
    const rawFormats = rawInfo.formats || []

    // Encontrar mejor pista de audio recomendada (preferir m4a itag 140)
    const audioCandidates = rawFormats.filter(
      (f: any) => f.url && f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none')
    )
    const bestAudio =
      audioCandidates.find((f: any) => f.ext === 'm4a' && String(f.format_id) === '140') ||
      audioCandidates.find((f: any) => f.ext === 'm4a') ||
      audioCandidates[0] ||
      null

    const mappedFormats = rawFormats
      .filter((f: any) => f.url && ((f.acodec && f.acodec !== 'none') || (f.vcodec && f.vcodec !== 'none')))
      .map((f: any) => {
        const hasAudio = !!(f.acodec && f.acodec !== 'none')
        const hasVideo = !!(f.vcodec && f.vcodec !== 'none')
        const height = f.height || parseInt(f.resolution?.match(/\d+/)?.[0] || '0')
        const width = f.width || null
        const resolution = width && height ? `${width}x${height}` : height ? `${height}p` : f.resolution || 'HD'
        const qualityLabel = f.format_note || (height ? `${height}p` : resolution)

        const fileSizeStr = f.filesize
          ? formatBytes(f.filesize)
          : f.filesize_approx
          ? `~${formatBytes(f.filesize_approx)}`
          : 'Auto'

        return {
          quality: qualityLabel,
          format: f.ext || 'mp4',
          resolution,
          size: fileSizeStr,
          url: f.url,
          codec: f.vcodec !== 'none' ? f.vcodec : f.acodec,
          hasAudio,
          hasVideo,
          width,
          height,
          itag: String(f.format_id),
          fps: f.fps || null,
          recommended_audio:
            hasVideo && !hasAudio && bestAudio
              ? {
                  url: bestAudio.url,
                  quality: bestAudio.format_note || '128k',
                  size: bestAudio.filesize ? formatBytes(bestAudio.filesize) : '3.5 MB',
                  format: bestAudio.ext || 'm4a',
                  itag: String(bestAudio.format_id)
                }
              : undefined
        }
      })

    // Contadores de estadísticas
    const combinedCount = mappedFormats.filter((f: any) => f.hasAudio && f.hasVideo).length
    const videoOnlyCount = mappedFormats.filter((f: any) => f.hasVideo && !f.hasAudio).length
    const audioOnlyCount = mappedFormats.filter((f: any) => f.hasAudio && !f.hasVideo).length

    const responseData = {
      status: 'success',
      platform: 'youtube',
      title: rawInfo.title || 'Video de YouTube',
      thumbnail: rawInfo.thumbnail || `https://img.youtube.com/vi/${rawInfo.id}/hqdefault.jpg`,
      video_url: cleanedUrl,
      duration: rawInfo.duration || 0,
      width: rawInfo.width,
      height: rawInfo.height,
      uploader: rawInfo.uploader || rawInfo.channel || '@youtube',
      channel: rawInfo.uploader || rawInfo.channel,
      viewCount: rawInfo.view_count || 0,
      method: 'serverless_ytdlp',
      formats: mappedFormats,
      statistics: {
        combined_formats: combinedCount,
        video_only_formats: videoOnlyCount,
        audio_only_formats: audioOnlyCount,
        has_recommended_audio: !!bestAudio
      }
    }

    console.log(`✅ [YouTube Serverless] Extraído con éxito: "${responseData.title}" (${mappedFormats.length} formatos)`)
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('💥 [YouTube Serverless] Error inesperado:', error)
    return NextResponse.json(
      { error: 'Error interno al procesar el video: ' + (error.message || 'Error desconocido') },
      { status: 500 }
    )
  }
}