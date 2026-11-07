// app/api/download/tiktok/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { findYtDlpBinary } from '@/lib/server/binaries'

export const maxDuration = 80;

function isValidTiktokUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  return (
    clean.includes('tiktok.com') ||
    clean.includes('vm.tiktok.com') ||
    clean.includes('vt.tiktok.com') ||
    clean.includes('douyin.com')
  )
}

// Resuelve redirecciones cortas (ej: vm.tiktok.com, vt.tiktok.com, tiktok.com/t/)
async function resolveTikTokRedirect(url: string): Promise<string> {
  let cleanUrl = url.trim()
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl
  }

  // Si ya tiene el ID de video o foto canonical
  const directMatch = cleanUrl.match(/\/(video|photo|v)\/(\d+)/i)
  if (directMatch) {
    return cleanUrl.split('?')[0]
  }

  try {
    let current = cleanUrl
    for (let hop = 0; hop < 5; hop++) {
      const res = await fetch(current, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      })

      const loc = res.headers.get('location')
      if (loc) {
        const nextUrl = loc.startsWith('http') ? loc : new URL(loc, current).toString()
        console.log(`🔀 [TikTok Redirect Hop ${hop + 1}]: ${current} -> ${nextUrl}`)

        const match = nextUrl.match(/\/(video|photo|v)\/(\d+)/i)
        if (match) {
          const canonical = nextUrl.split('?')[0]
          console.log(`🎯 [TikTok] Canonical URL detectada: ${canonical}`)
          return canonical
        }

        if (nextUrl.includes('tiktok.com/?') || nextUrl === 'https://www.tiktok.com/' || nextUrl === 'https://m.tiktok.com/') {
          break
        }
        current = nextUrl
      } else {
        // Si no hay cabecera location, intentar leer si el HTML contiene og:url o canonical
        try {
          const html = await res.text()
          const ogMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
                          html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                          html.match(/https?:\/\/(?:www\.)?tiktok\.com\/@[^/]+\/video\/\d+/i)
          if (ogMatch && (ogMatch[1] || ogMatch[0])) {
            const extracted = (ogMatch[1] || ogMatch[0]).split('?')[0]
            if (extracted.includes('/video/') || extracted.includes('/photo/')) {
              console.log(`🎯 [TikTok] Canonical extraída de HTML: ${extracted}`)
              return extracted
            }
          }
        } catch {}
        break
      }
    }
  } catch (err: any) {
    console.warn('⚠️ [TikTok] Error resolviendo redirección manual:', err.message)
  }

  return cleanUrl
}

function extractWithYtDlp(targetUrl: string): Promise<any> {
  return new Promise((resolve) => {
    try {
      const binPath = findYtDlpBinary()
      if (!binPath) return resolve(null)

      const args = [
        '--socket-timeout', '14',
        '--dump-json',
        '--no-warnings',
        '--no-check-certificates',
        '--geo-bypass',
        targetUrl
      ]

      console.log(`🚀 [TikTok yt-dlp] Ejecutando extractor para: ${targetUrl}`)
      const proc = spawn(binPath, args)
      let stdout = ''
      let isDone = false

      const timer = setTimeout(() => {
        if (!isDone) {
          isDone = true
          try { proc.kill('SIGKILL') } catch {}
          resolve(null)
        }
      }, 15000)

      proc.stdout.on('data', (d) => { stdout += d.toString() })
      proc.on('error', (err) => {
        if (isDone) return
        isDone = true
        clearTimeout(timer)
        console.warn('⚠️ [TikTok yt-dlp] Error de proceso:', err.message)
        resolve(null)
      })
      proc.on('close', (code) => {
        if (isDone) return
        isDone = true
        clearTimeout(timer)
        if (code === 0 && stdout) {
          try {
            const data = JSON.parse(stdout)
            const directUrl = data.url
            const formats = Array.isArray(data.formats) ? data.formats : []
            const bestVideo = formats.slice().reverse().find((f: any) => f.vcodec !== 'none' && f.url && f.url.startsWith('http'))
            const bestAudio = formats.slice().reverse().find((f: any) => (f.vcodec === 'none' || f.acodec !== 'none') && f.url && f.url.startsWith('http'))

            const videoUrl = directUrl || bestVideo?.url
            if (videoUrl) {
              resolve({
                title: data.title || 'Video de TikTok',
                thumbnail: data.thumbnail || '',
                duration: formatDuration(data.duration),
                author: data.uploader || '@tiktokuser',
                author_avatar: data.thumbnail,
                no_watermark_url: videoUrl,
                watermark_url: undefined,
                audio_url: bestAudio?.url || data.url,
                size: formatFileSize(bestVideo?.filesize || 15000000),
                watermark_size: formatFileSize(16000000),
                audio_size: formatFileSize(bestAudio?.filesize || 2000000),
                method: 'yt_dlp'
              })
              return
            }
          } catch {}
        }
        resolve(null)
      })
    } catch {
      resolve(null)
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json().catch(() => ({}))

    if (!url || !isValidTiktokUrl(url)) {
      return NextResponse.json(
        { error: 'URL de TikTok inválida. Ejemplo: https://www.tiktok.com/@usuario/video/1234567890 o https://vt.tiktok.com/...' },
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

// Función principal para obtener datos reales de TikTok con multi-tier extractors
async function getTikTokVideoInfo(resolvedUrl: string, originalUrl: string): Promise<any> {
  const urlsToTry = Array.from(new Set([resolvedUrl, originalUrl].filter(Boolean)))

  for (const targetUrl of urlsToTry) {
    // 🚀 TIER 1A: TikWM API oficial GET (Soporta HD sin marca de agua y audio limpio)
    try {
      console.log(`🌐 [TikTok] Intentando extracción con TikWM GET para: ${targetUrl}`)
      const tikwmUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}&hd=1`
      const tikwmRes = await fetch(tikwmUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      })

      if (tikwmRes.ok) {
        const data = await tikwmRes.json()
        if (data && data.code === 0 && data.data) {
          const item = data.data
          const noWatermark = item.hdplay || item.play
          if (noWatermark) {
            console.log(`✅ [TikTok TikWM GET] Video encontrado: "${item.title}" por ${item.author?.nickname}`)
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
              method: 'tikwm_get'
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('⚠️ [TikTok] TikWM GET falló:', e.message)
    }

    // 🚀 TIER 1B: TikWM API oficial POST
    try {
      console.log(`🌐 [TikTok] Intentando TikWM POST para: ${targetUrl}`)
      const postParams = new URLSearchParams({ url: targetUrl, hd: '1' })
      const tikwmPostRes = await fetch('https://www.tikwm.com/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        body: postParams.toString(),
        signal: AbortSignal.timeout(10000)
      })

      if (tikwmPostRes.ok) {
        const data = await tikwmPostRes.json()
        if (data && data.code === 0 && data.data) {
          const item = data.data
          const noWatermark = item.hdplay || item.play
          if (noWatermark) {
            console.log(`✅ [TikTok TikWM POST] Video encontrado: "${item.title}" por ${item.author?.nickname}`)
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
              method: 'tikwm_post'
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('⚠️ [TikTok] TikWM POST falló:', e.message)
    }

    // 🚀 TIER 2: Extractor nativo yt-dlp (Bypasea restricciones y soporta cualquier URL)
    try {
      const ytData = await extractWithYtDlp(targetUrl)
      if (ytData) {
        console.log(`✅ [TikTok yt-dlp] Video encontrado: "${ytData.title}"`)
        return ytData
      }
    } catch (e: any) {
      console.warn('⚠️ [TikTok] yt-dlp falló:', e.message)
    }

    // 🚀 TIER 3: Cloudflare Worker tdownv4
    try {
      console.log(`🌐 [TikTok] Intentando tdownv4 worker...`)
      const tdownRes = await fetch(`https://tdownv4.sl-bjs.workers.dev/?down=${encodeURIComponent(targetUrl)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      })

      if (tdownRes.ok) {
        const data = await tdownRes.json()
        if (data && data.download_url) {
          console.log(`✅ [TikTok tdownv4] Éxito con: "${data.title}"`)
          return {
            title: data.title || 'Video de TikTok',
            thumbnail: data.author?.avatar || '',
            duration: formatDuration(data.author?.duration || 0),
            author: data.author?.nickname || data.author?.username || '@tiktokuser',
            author_avatar: data.author?.avatar,
            no_watermark_url: data.download_url,
            watermark_url: undefined,
            audio_url: data.author?.audio_url,
            size: formatFileSize(15000000),
            watermark_size: formatFileSize(16000000),
            audio_size: formatFileSize(2000000),
            method: 'tdownv4_worker'
          }
        }
      }
    } catch (e: any) {
      console.warn('⚠️ [TikTok] tdownv4 falló:', e.message)
    }

    // 🚀 TIER 4: Tiklydown API
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

  // ⛔ NUNCA devolver datos mock/falsos
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
