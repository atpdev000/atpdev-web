// app/api/download/youtube/combined/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { POST as getYoutubeInfo } from '../route'

const PYTHON_API_URL = process.env.PYTHON_API_URL?.replace(/\/$/, '')

// Función para mapear calidad a itag
const mapQualityToItag = (quality: string) => {
  const qNum = parseInt(quality.match(/\d+/)?.[0] || '1080')

  const qualityMap: { [key: number]: { video: number; audio: number } } = {
    144: { video: 160, audio: 140 },
    240: { video: 133, audio: 140 },
    360: { video: 134, audio: 140 },
    480: { video: 135, audio: 140 },
    720: { video: 136, audio: 140 },
    1080: { video: 137, audio: 140 },
    1440: { video: 271, audio: 140 },
    2160: { video: 313, audio: 140 }
  }

  return qualityMap[qNum] || qualityMap[1080]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { url, quality = '1080p', format_type = 'mp4' } = body
    const { video_itag: reqVideoItag, audio_itag: reqAudioItag } = body

    console.log('🎬 [YouTube Combined] Iniciando descarga combinada...')
    console.log('📋 [YouTube Combined] Parámetros:', { url, quality, format_type, reqVideoItag, reqAudioItag })

    if (!url) {
      return NextResponse.json({ error: 'URL es requerida' }, { status: 400 })
    }

    const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)/
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: 'URL de YouTube inválida' }, { status: 400 })
    }

    const cleanUrl = (inputUrl: string): string => {
      try {
        const urlObj = new URL(inputUrl)
        const videoId = urlObj.searchParams.get('v')
        if (videoId) return `https://www.youtube.com/watch?v=${videoId}`
        return inputUrl.split('&')[0]
      } catch {
        return inputUrl.split('&')[0]
      }
    }

    const cleanedUrl = cleanUrl(url)

    const itags = {
      video: reqVideoItag !== undefined && reqVideoItag !== null ? reqVideoItag : mapQualityToItag(quality).video,
      audio: reqAudioItag !== undefined ? reqAudioItag : mapQualityToItag(quality).audio
    }

    // Si hay un backend Python remoto explícitamente configurado (que no sea localhost ni railway caído)
    const isRemotePython =
      PYTHON_API_URL &&
      !PYTHON_API_URL.includes('localhost') &&
      !PYTHON_API_URL.includes('up.railway.app')

    if (isRemotePython) {
      try {
        console.log('🔗 [YouTube Combined] Conectando a backend remoto:', PYTHON_API_URL)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000)

        const combineResponse = await fetch(`${PYTHON_API_URL}/api/v1/combiner/youtube/combine`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: cleanedUrl,
            quality: quality,
            video_itag: itags.video,
            audio_itag: itags.audio
          }),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (combineResponse.ok) {
          const responseHeaders = new Headers()
          const headersToForward = [
            'Content-Type',
            'Content-Length',
            'Content-Disposition',
            'X-File-Size',
            'X-Video-Itag',
            'X-Audio-Itag'
          ]
          headersToForward.forEach((h) => {
            const val = combineResponse.headers.get(h)
            if (val) responseHeaders.set(h, val)
          })
          if (!responseHeaders.has('Content-Type')) {
            responseHeaders.set('Content-Type', 'video/mp4')
          }
          return new Response(combineResponse.body, {
            status: 200,
            headers: responseHeaders
          })
        }
      } catch (err: any) {
        console.warn('⚠️ [YouTube Combined] Backend remoto no respondió, usando extracción local:', err.message)
      }
    }

    // Modo Serverless / Local In-Process
    return await handleServerlessCombination(request, cleanedUrl, quality, format_type, itags.video, itags.audio)
  } catch (error: any) {
    console.error('💥 [YouTube Combined] Error general:', error)
    return NextResponse.json(
      {
        error: 'Error en descarga combinada: ' + error.message,
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

async function handleServerlessCombination(
  request: NextRequest,
  url: string,
  quality: string,
  format_type: string,
  videoItag?: number | string,
  audioItag?: number | string
) {
  try {
    console.log('🔄 [YouTube Combined] Ejecutando estrategia serverless in-process...')

    // Obtener información directamente invocando el handler serverless
    const reqInternal = new NextRequest(new URL('/api/download/youtube', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, quality, format_type })
    })

    const infoResponse = await getYoutubeInfo(reqInternal)

    if (!infoResponse.ok) {
      const errorData = await infoResponse.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error obteniendo información del video')
    }

    const videoData = await infoResponse.json()
    const formats = videoData.formats || []

    // 1. Buscar coincidencia exacta por itag
    let bestVideo: any = null
    let bestAudio: any = null

    if (videoItag) {
      bestVideo = formats.find((f: any) => String(f.itag) === String(videoItag))
    }

    if (audioItag && audioItag !== 'null') {
      bestAudio = formats.find((f: any) => String(f.itag) === String(audioItag))
    }

    // 2. Si no se encontró por itag, buscar por resolución / calidad numérica
    const targetHeight = parseInt(quality.match(/\d+/)?.[0] || '1080')

    if (!bestVideo) {
      const candidates = formats.filter((f: any) => {
        if (!f.hasVideo) return false
        const h = f.height || parseInt(f.resolution?.match(/\d+/)?.[0] || '0')
        return h === targetHeight
      })
      bestVideo = candidates[0] || null
    }

    if (!bestAudio && audioItag !== 'null') {
      const audioCandidates = formats.filter((f: any) => f.hasAudio && !f.hasVideo)
      bestAudio = audioCandidates.find((f: any) => f.format === 'm4a') || audioCandidates[0] || null
    }

    // 3. Si no hay formatos separados, verificar si existe un formato progresivo directo
    if (!bestVideo && !bestAudio) {
      const combinedFormats = formats.filter((f: any) => f.hasVideo && f.hasAudio && f.url)
      const bestCombined =
        combinedFormats.find((f: any) => f.quality?.includes(quality) || f.resolution?.includes(quality)) ||
        combinedFormats[0]

      if (bestCombined) {
        return NextResponse.json({
          status: 'success',
          download_url: bestCombined.url,
          filename: `youtube_${quality}_${Date.now()}.${format_type}`,
          title: videoData.title,
          combined: false,
          method: 'existing_combined',
          quality: quality,
          file_size: bestCombined.size || 0
        })
      }
    }

    // 4. Si encontramos ambos, retornar para combinación en proxy o cliente
    if (bestVideo && bestAudio) {
      return NextResponse.json({
        status: 'success',
        video_url: bestVideo.url,
        audio_url: bestAudio.url,
        filename: `youtube_${quality}_${Date.now()}.mp4`,
        title: videoData.title,
        combined: true,
        method: 'proxy_combination',
        quality: quality,
        video_quality: bestVideo.quality || bestVideo.resolution,
        audio_quality: bestAudio.quality,
        video_size: bestVideo.size || 0,
        audio_size: bestAudio.size || 0
      })
    }

    // 5. Si solo se encontró video
    if (bestVideo) {
      return NextResponse.json({
        status: 'success',
        download_url: bestVideo.url,
        filename: `youtube_${quality}_${Date.now()}.mp4`,
        title: videoData.title,
        combined: false,
        method: 'video_only',
        quality: quality,
        warning: 'Este video no incluye audio separado disponible',
        video_quality: bestVideo.quality || bestVideo.resolution,
        video_size: bestVideo.size || 0
      })
    }

    throw new Error(`No se encontró formato compatible para ${quality}`)
  } catch (err: any) {
    console.error('💥 [YouTube Combined] Error en combinación serverless:', err)
    return NextResponse.json(
      { error: 'Error procesando combinación: ' + err.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'YouTube Combined Serverless API está activa y lista',
    endpoint: 'POST /api/download/youtube/combined'
  })
}