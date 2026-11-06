// app/api/download/tiktok/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 80;

function isValidTiktokUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  return (
    clean.includes('tiktok.com') ||
    clean.includes('vm.tiktok.com') ||
    clean.includes('vt.tiktok.com')
  )
}

// Resuelve redirecciones cortas (ej: vm.tiktok.com, vt.tiktok.com, tiktok.com/t/)
async function resolveTikTokRedirect(url: string): Promise<string> {
  const cleanUrl = url.trim()
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return 'https://' + cleanUrl
  }

  if (cleanUrl.includes('/video/')) {
    return cleanUrl
  }

  try {
    const res = await fetch(cleanUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })
    if (res.url && res.url.includes('/video/')) {
      return res.url
    }
  } catch (err) {
    console.warn('⚠️ [TikTok] No se pudo resolver redirección:', err)
  }

  return cleanUrl
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json().catch(() => ({}))

    if (!url || !isValidTiktokUrl(url)) {
      return NextResponse.json(
        { error: 'URL de TikTok inválida. Ejemplo: https://www.tiktok.com/@usuario/video/1234567890 o https://vm.tiktok.com/...' },
        { status: 400 }
      )
    }

    const resolvedUrl = await resolveTikTokRedirect(url)
    console.log(`🎬 [TikTok] Procesando: ${url} -> ${resolvedUrl}`)

    // Intentar obtener información real del video sin marca de agua
    const videoData = await getTikTokVideoInfo(resolvedUrl, url)

    if (!videoData) {
      return NextResponse.json(
        { error: 'No se pudo obtener la información de este video de TikTok. Asegúrate de que el video sea público y que el enlace sea correcto.' },
        { status: 404 }
      )
    }

    const videoInfo = {
      status: 'success',
      platform: 'tiktok',
      title: videoData.title || 'Video de TikTok',
      thumbnail: videoData.thumbnail || '',
      duration: videoData.duration || '0:00',
      uploader: videoData.author || '@tiktokuser',
      uploader_avatar: videoData.author_avatar,
      video_url: resolvedUrl,
      method: videoData.method || 'tikwm_api',
      formats: [
        {
          quality: 'Sin Marca de Agua - HD',
          format: 'MP4',
          resolution: '1080x1920',
          size: videoData.size || '15.2 MB',
          url: videoData.no_watermark_url,
          hasAudio: true
        },
        ...(videoData.watermark_url ? [{
          quality: 'Con Marca de Agua',
          format: 'MP4',
          resolution: '1080x1920',
          size: videoData.watermark_size || '16.8 MB',
          url: videoData.watermark_url,
          hasAudio: true
        }] : []),
        ...(videoData.audio_url ? [{
          quality: 'Solo Audio',
          format: 'MP3',
          resolution: '128kbps',
          size: videoData.audio_size || '2.1 MB',
          url: videoData.audio_url,
          hasAudio: true
        }] : [])
      ]
    }

    return NextResponse.json(videoInfo)
  } catch (error) {
    console.error('💥 Error en API TikTok:', error)
    return NextResponse.json(
      { error: 'Error al procesar el video de TikTok: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}

// Función principal para obtener datos reales de TikTok
async function getTikTokVideoInfo(resolvedUrl: string, originalUrl: string): Promise<any> {
  const urlsToTry = Array.from(new Set([resolvedUrl, originalUrl].filter(Boolean)))

  for (const targetUrl of urlsToTry) {
    // 🚀 TIER 1: TikWM API oficial (Soporta HD sin marca de agua y audio limpio)
    try {
      console.log(`🌐 [TikTok] Intentando extracción con TikWM para: ${targetUrl}`)
      const tikwmUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}&hd=1`
      const tikwmRes = await fetch(tikwmUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(12000)
      })

      if (tikwmRes.ok) {
        const data = await tikwmRes.json()
        if (data && data.code === 0 && data.data) {
          const item = data.data
          const noWatermark = item.hdplay || item.play
          if (noWatermark) {
            console.log(`✅ [TikTok TikWM] Video encontrado: "${item.title}" por ${item.author?.nickname}`)
            return {
              title: item.title || 'Video de TikTok',
              thumbnail: item.cover,
              duration: formatDuration(item.duration),
              author: item.author?.nickname || `@${item.author?.unique_id}` || '@tiktokuser',
              author_avatar: item.author?.avatar,
              no_watermark_url: noWatermark,
              watermark_url: item.wmplay,
              audio_url: item.music,
              size: formatFileSize(item.hd_size || item.size || 15000000),
              watermark_size: formatFileSize(item.wm_size || item.size || 16000000),
              audio_size: formatFileSize(item.music_size || 2000000),
              method: 'tikwm_api'
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('⚠️ [TikTok] TikWM falló:', e.message)
    }

    // 🚀 TIER 2: Tiklydown API
    try {
      console.log(`🌐 [TikTok] Intentando alternativa Tiklydown...`)
      const tiklyRes = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      })

      if (tiklyRes.ok) {
        const data = await tiklyRes.json()
        if (data && (data.video || data.url)) {
          const videoUrl = data.video?.noWatermark || data.video?.watermark || data.url
          if (videoUrl) {
            console.log(`✅ [TikTok Tiklydown] Éxito con: "${data.title}"`)
            return {
              title: data.title || 'Video de TikTok',
              thumbnail: data.cover || data.thumbnail,
              duration: formatDuration(data.duration),
              author: data.author?.name || data.author || '@tiktokuser',
              author_avatar: data.author?.avatar,
              no_watermark_url: videoUrl,
              watermark_url: data.video?.watermark,
              audio_url: data.music?.play_url || data.music,
              size: formatFileSize(15000000),
              watermark_size: formatFileSize(16000000),
              audio_size: formatFileSize(2000000),
              method: 'tiklydown_api'
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('⚠️ [TikTok] Tiklydown falló:', e.message)
    }
  }

  // ⛔ NUNCA devolver datos mock/falsos (fotos de mar o barcos de picsum)
  return null
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 MB'
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const quality = searchParams.get('quality')

  if (!url || !isValidTiktokUrl(url)) {
    return NextResponse.json(
      { error: 'URL de TikTok inválida' },
      { status: 400 }
    )
  }

  try {
    const videoData = await getTikTokVideoInfo(url, url)
    if (!videoData) {
      return NextResponse.json(
        { error: 'No se pudo obtener el video solicitado' },
        { status: 404 }
      )
    }

    let downloadUrl = videoData.no_watermark_url
    if (quality === 'watermark' && videoData.watermark_url) {
      downloadUrl = videoData.watermark_url
    } else if (quality === 'audio' && videoData.audio_url) {
      downloadUrl = videoData.audio_url
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'No se encontró el enlace de descarga directo' },
        { status: 404 }
      )
    }

    return NextResponse.redirect(downloadUrl)
  } catch (error) {
    console.error('Error en descarga TikTok GET:', error)
    return NextResponse.json(
      { error: 'Error al procesar la descarga' },
      { status: 500 }
    )
  }
}
