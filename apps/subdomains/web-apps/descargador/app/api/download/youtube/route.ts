// app/api/download/youtube/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

export const maxDuration = 60

function findYtDlpBinary(): string | null {
  const isWindows = process.platform === 'win32'
  const binaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp'

  const searchLocations = [
    path.join(process.cwd(), 'apps/subdomains/web-apps/descargador/bin', binaryName),
    path.join(process.cwd(), 'bin', binaryName),
    path.join('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/bin', binaryName),
    path.join('d:/PROYECTOS/PYTHON/Dowload APP WEB/downloader-api/node_modules/yt-dlp-exec/bin', binaryName),
    path.join(process.cwd(), 'node_modules/yt-dlp-exec/bin', binaryName),
  ]

  for (const location of searchLocations) {
    try {
      if (fs.existsSync(location)) {
        return location
      }
    } catch {
      // Continuar buscando
    }
  }

  return 'yt-dlp'
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

async function extractMetadata(url: string, binPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = [
      '--dump-json',
      '--no-warnings',
      '--no-check-certificates',
      '--geo-bypass',
      url
    ]

    console.log(`🚀 [YouTube Serverless] Ejecutando: ${binPath} con ${url}`)
    const ytProcess = spawn(binPath, args)

    let stdout = ''
    let stderr = ''

    ytProcess.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    ytProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    ytProcess.on('error', (err) => {
      reject(new Error(`No se pudo ejecutar el extractor (${err.message})`))
    })

    ytProcess.on('close', (code) => {
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
        rawInfo = await extractMetadata(cleanedUrl, bin)
      } catch (err: any) {
        console.warn('⚠️ [YouTube Serverless] Extractor local falló:', err.message)
        extractionError = err
      }
    }

    // Fallback a API externa si está configurada y local falló
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