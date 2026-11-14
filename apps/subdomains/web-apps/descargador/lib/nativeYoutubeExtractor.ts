import { CapacitorHttp } from '@capacitor/core'
import { NativeWhatsAppStatus } from '@/lib/nativeBridge'

export interface NativeYoutubeFormat {
  quality: string
  format: string
  resolution: string
  size: string
  url: string
  codec?: string
  hasAudio?: boolean
  hasVideo?: boolean
  width?: number
  height?: number
  itag?: string | number
  fps?: number | null
  recommended_audio?: {
    url: string
    quality: string
    size: string
    format: string
    itag?: string | number
  }
}

export interface NativeYoutubeResult {
  status: 'success'
  platform: 'youtube'
  title: string
  thumbnail: string
  video_url: string
  duration: number
  width?: number
  height?: number
  uploader?: string
  channel?: string
  viewCount?: number
  method: 'native_device'
  formats: NativeYoutubeFormat[]
  statistics: {
    combined_formats: number
    video_only_formats: number
    audio_only_formats: number
    has_recommended_audio: boolean
  }
}

export interface NativeExtractionOutcome {
  result: NativeYoutubeResult | null
  debugError?: string
}

interface InnerTubeClientProfile {
  name: string
  userAgent: string
  context: {
    client: Record<string, unknown>
  }
}

const INNERTUBE_CLIENTS: InnerTubeClientProfile[] = [
  {
    name: 'ANDROID',
    userAgent: 'com.google.android.youtube/20.10.38 (Linux; U; Android 15) gzip',
    context: {
      client: {
        clientName: 'ANDROID',
        clientVersion: '20.10.38',
        androidSdkVersion: 35,
        osName: 'Android',
        osVersion: '15',
        hl: 'es',
        gl: 'US',
      },
    },
  },
  {
    name: 'IOS',
    userAgent: 'com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X;)',
    context: {
      client: {
        clientName: 'IOS',
        clientVersion: '20.10.4',
        deviceMake: 'Apple',
        deviceModel: 'iPhone16,2',
        osName: 'iPhone',
        osVersion: '18.3.2.22D82',
        hl: 'es',
        gl: 'US',
      },
    },
  },
  {
    name: 'ANDROID_VR',
    userAgent:
      'com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip',
    context: {
      client: {
        clientName: 'ANDROID_VR',
        clientVersion: '1.60.19',
        deviceMake: 'Oculus',
        deviceModel: 'Quest 3',
        androidSdkVersion: 32,
        osName: 'Android',
        osVersion: '12L',
        hl: 'es',
        gl: 'US',
      },
    },
  },
]

function formatByteSize(bytesNum?: number | string | null): string {
  const bytes = typeof bytesNum === 'string' ? parseInt(bytesNum, 10) : Number(bytesNum)
  if (!bytes || isNaN(bytes) || bytes <= 0) return 'Auto'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`
  }
  return `${mb.toFixed(1)} MB`
}

export function extractYoutubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const v = urlObj.searchParams.get('v')
    if (v) return v
    const parts = urlObj.pathname.split('/').filter(Boolean)
    if (urlObj.hostname.includes('youtu.be') && parts[0]) {
      return parts[0]
    }
    const markerIdx = parts.findIndex((p) => p === 'shorts' || p === 'live' || p === 'embed')
    if (markerIdx !== -1 && parts[markerIdx + 1]) {
      return parts[markerIdx + 1]
    }
  } catch {
    // Fallback regex below
  }
  const match = url.match(/(?:v=|youtu\.be\/|\/shorts\/|\/live\/|\/embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function parseMime(mimeType: string = '') {
  const [containerPart] = mimeType.split(';')
  const cleanMime = (containerPart || '').trim().toLowerCase()
  const codecsMatch = mimeType.match(/codecs="([^"]+)"/i)
  const codec = codecsMatch ? codecsMatch[1] : undefined
  const isVideo = cleanMime.startsWith('video/')
  const isAudioOnly = cleanMime.startsWith('audio/')
  const ext = cleanMime.includes('webm')
    ? 'webm'
    : cleanMime.includes('audio/mp4')
    ? 'm4a'
    : cleanMime.includes('mp4')
    ? 'mp4'
    : isAudioOnly
    ? 'm4a'
    : 'mp4'
  return { isVideo, isAudioOnly, ext, codec }
}

function mapInnerTubePayload(payload: any, videoId: string, sourceLabel: string): NativeYoutubeResult | null {
  if (payload?.playabilityStatus?.status !== 'OK') {
    return null
  }

  const combinedRaw: any[] = payload?.streamingData?.formats || []
  const adaptiveRaw: any[] = payload?.streamingData?.adaptiveFormats || []
  const allRaw = [
    ...combinedRaw.map((f) => ({ ...f, _combined: true })),
    ...adaptiveRaw.map((f) => ({ ...f, _combined: false })),
  ].filter((f) => typeof f?.url === 'string' && f.url.startsWith('http'))

  if (allRaw.length === 0) {
    return null
  }

  const cleanWatchUrl = `https://www.youtube.com/watch?v=${videoId}`
  const details = payload?.videoDetails || {}
  const thumbs: any[] = details?.thumbnail?.thumbnails || []
  const bestThumb =
    thumbs[thumbs.length - 1]?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  const rawAudioList = allRaw.filter((f) => parseMime(f.mimeType).isAudioOnly)
  rawAudioList.sort((a, b) => {
    const score = (item: any) => {
      const parsed = parseMime(item.mimeType)
      let s = 0
      if (String(item.itag) === '140') s += 100
      if (parsed.ext === 'm4a') s += 50
      if (parsed.codec?.includes('mp4a')) s += 30
      return s + (Number(item.bitrate) || 0) / 100000
    }
    return score(b) - score(a)
  })
  const bestAudioRaw = rawAudioList[0] || null
  const bestAudioMapped = bestAudioRaw
    ? {
        url: bestAudioRaw.url as string,
        quality: bestAudioRaw.bitrate
          ? `${Math.round(Number(bestAudioRaw.bitrate) / 1000)}kbps`
          : '128kbps',
        size: formatByteSize(bestAudioRaw.contentLength),
        format: parseMime(bestAudioRaw.mimeType).ext,
        itag: String(bestAudioRaw.itag || ''),
      }
    : undefined

  const mappedFormats: NativeYoutubeFormat[] = allRaw.map((f) => {
    const parsed = parseMime(f.mimeType)
    const hasVideo = parsed.isVideo
    const hasAudio = parsed.isAudioOnly || Boolean(f._combined) || Boolean(f.audioQuality)
    const height = typeof f.height === 'number' ? f.height : undefined
    const width = typeof f.width === 'number' ? f.width : undefined
    const qualityLabel = parsed.isAudioOnly
      ? `Audio ${f.bitrate ? Math.round(Number(f.bitrate) / 1000) + 'kbps' : parsed.ext.toUpperCase()}`
      : f.qualityLabel || (height ? `${height}p` : f.quality || 'HD')
    const resolution = parsed.isAudioOnly
      ? 'Audio Only'
      : width && height
      ? `${width}x${height}`
      : height
      ? `${height}p`
      : qualityLabel

    return {
      quality: qualityLabel,
      format: parsed.ext,
      resolution,
      size: formatByteSize(f.contentLength),
      url: f.url,
      codec: parsed.codec,
      hasAudio,
      hasVideo,
      width,
      height,
      itag: String(f.itag || ''),
      fps: f.fps || null,
      recommended_audio: hasVideo && !hasAudio ? bestAudioMapped : undefined,
    }
  })

  mappedFormats.sort((a, b) => {
    const rank = (item: NativeYoutubeFormat) => {
      let s = 0
      if (item.format === 'mp4') s += 40
      if (item.codec?.includes('avc1')) s += 30
      if (item.hasVideo && item.hasAudio) s += 15
      return s + (item.height || 0) * 0.01
    }
    return rank(b) - rank(a)
  })

  const combinedCount = mappedFormats.filter((f) => f.hasAudio && f.hasVideo).length
  const videoOnlyCount = mappedFormats.filter((f) => f.hasVideo && !f.hasAudio).length
  const audioOnlyCount = mappedFormats.filter((f) => f.hasAudio && !f.hasVideo).length
  const maxVideo = mappedFormats.find((f) => f.hasVideo)

  console.log(
    `✅ [NativeYouTube:${sourceLabel}] "${details.title || videoId}" (${mappedFormats.length} formatos)`
  )

  return {
    status: 'success',
    platform: 'youtube',
    title: details.title || 'Video de YouTube',
    thumbnail: bestThumb,
    video_url: cleanWatchUrl,
    duration: Number(details.lengthSeconds || 0),
    width: maxVideo?.width,
    height: maxVideo?.height,
    uploader: details.author || '@youtube',
    channel: details.author || '@youtube',
    viewCount: Number(details.viewCount || 0),
    method: 'native_device',
    formats: mappedFormats,
    statistics: {
      combined_formats: combinedCount,
      video_only_formats: videoOnlyCount,
      audio_only_formats: audioOnlyCount,
      has_recommended_audio: !!bestAudioMapped,
    },
  }
}

async function fetchEmbedVisitorData(videoId: string): Promise<string | undefined> {
  try {
    const res = await CapacitorHttp.get({
      url: `https://www.youtube.com/embed/${videoId}`,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'x-cap-user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      responseType: 'text',
      connectTimeout: 8000,
      readTimeout: 8000,
    })
    const html = typeof res.data === 'string' ? res.data : JSON.stringify(res.data || '')
    const match = html.match(/"visitorData":"([^"]+)"/)
    return match ? match[1] : undefined
  } catch {
    return undefined
  }
}

/**
 * Attempts device-side YouTube extraction via the native Java plugin first, then
 * falls back to CapacitorHttp with visitorData, returning diagnostics on failure.
 */
export async function extractYoutubeNativeWithDiagnostics(
  inputUrl: string
): Promise<NativeExtractionOutcome> {
  const videoId = extractYoutubeVideoId(inputUrl)
  if (!videoId) {
    return { result: null, debugError: 'videoId inválido' }
  }

  const reasons: string[] = []

  // 1. Native Java plugin (raw HttpURLConnection on Android JVM)
  try {
    if (typeof NativeWhatsAppStatus?.extractYoutubeInfo === 'function') {
      const nativeRes = await NativeWhatsAppStatus.extractYoutubeInfo({ videoId })
      if (nativeRes?.payloadJson) {
        const parsed = JSON.parse(nativeRes.payloadJson)
        const mapped = mapInnerTubePayload(parsed, videoId, `Java-${nativeRes.clientUsed || 'native'}`)
        if (mapped) {
          return { result: mapped }
        }
        reasons.push(`Java(${nativeRes.clientUsed}): sin formatos válidos`)
      }
    }
  } catch (javaErr: any) {
    reasons.push(`JavaPlugin: ${javaErr?.message || String(javaErr)}`)
  }

  // 2. CapacitorHttp fallback (works even on APKs without the updated Java plugin)
  const visitorData = await fetchEmbedVisitorData(videoId)

  for (const profile of INNERTUBE_CLIENTS) {
    try {
      const clientContext: Record<string, unknown> = {
        ...profile.context.client,
        ...(visitorData ? { visitorData } : {}),
      }

      const response = await CapacitorHttp.post({
        url: 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': profile.userAgent,
          'x-cap-user-agent': profile.userAgent,
          ...(visitorData ? { 'X-Goog-Visitor-Id': visitorData } : {}),
        },
        data: {
          videoId,
          context: { client: clientContext },
          contentCheckOk: true,
          racyCheckOk: true,
        },
        responseType: 'json',
        connectTimeout: 12000,
        readTimeout: 15000,
      })

      if (response.status < 200 || response.status >= 300) {
        reasons.push(`CapHttp-${profile.name}: HTTP ${response.status}`)
        continue
      }

      const payload = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
      const playStatus = payload?.playabilityStatus?.status
      if (playStatus !== 'OK') {
        reasons.push(
          `CapHttp-${profile.name}: ${playStatus || 'UNKNOWN'} (${payload?.playabilityStatus?.reason || ''})`
        )
        continue
      }

      const mapped = mapInnerTubePayload(payload, videoId, `CapHttp-${profile.name}`)
      if (mapped) {
        return { result: mapped }
      }
      reasons.push(`CapHttp-${profile.name}: 0_urls`)
    } catch (err: any) {
      reasons.push(`CapHttp-${profile.name}: ${err?.message || String(err)}`)
    }
  }

  return {
    result: null,
    debugError: reasons.join(' | ') || 'Sin respuesta de clientes nativos',
  }
}

export async function extractYoutubeNative(inputUrl: string): Promise<NativeYoutubeResult | null> {
  const { result } = await extractYoutubeNativeWithDiagnostics(inputUrl)
  return result
}
