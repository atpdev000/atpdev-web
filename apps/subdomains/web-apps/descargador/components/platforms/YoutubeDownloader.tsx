'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { formatBytes } from '@/lib/utils';
import { usePlatform, detectNativePlatform } from '@/hooks/usePlatform';
import { useNotifications } from '@/hooks/useNotifications';
import { useDownloadHistory } from '@/hooks/useDownloadHistory';
import { useAdMobInterstitial } from '@/hooks/useAdMobInterstitial';
import { useAdMobRewarded } from '@/hooks/useAdMobRewarded';
import { useProPlan } from '@/hooks/useProPlan';
import ProModal from '@/components/ProModal';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { useI18n } from '@/lib/i18n/context';
import { Music, Film } from 'lucide-react';
import { NativeWhatsAppStatus, saveNativeMediaFile, downloadAndCombineNative, readNativeClipboard } from '@/lib/nativeBridge';
import { extractUrlFromText } from '@/lib/clipboardDetector';
import { extractYoutubeNativeWithDiagnostics } from '@/lib/nativeYoutubeExtractor';

interface VideoFormat {
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
  recommended_audio?: {
    url: string
    quality: string
    size: string
    format: string
  }
}

interface DownloadResponse {
  status: string
  platform: string
  title: string
  thumbnail: string
  video_url: string
  duration: number
  width?: number
  height?: number
  method: string
  formats?: VideoFormat[]
  channel?: string
  viewCount?: number
  statistics?: {
    combined_formats: number
    video_only_formats: number
    audio_only_formats: number
    has_recommended_audio: boolean
  }
}

const predefinedQualities: { value: string, label: string, ext?: string, isPro?: boolean }[] = [
  { label: '2160p (4K UHD)', value: '2160p', ext: 'mp4', isPro: true },
  { label: '1440p (2K QHD)', value: '1440p', ext: 'mp4', isPro: true },
  { label: '1080p (Full HD)', value: '1080p', ext: 'mp4', isPro: true },
  { label: '720p (HD)', value: '720p', ext: 'mp4', isPro: false },
  { label: '480p (SD)', value: '480p', ext: 'mp4', isPro: false },
  { value: '360p', label: '360p (MP4)', ext: 'mp4', isPro: false },
  { value: '240p', label: '240p (MP4)', ext: 'mp4', isPro: false },
  { value: '144p', label: '144p (MP4)', ext: 'mp4', isPro: false }
]

function formatUserFriendlyError(rawMsg: string): string {
  if (!rawMsg) return 'Error al procesar la descarga'
  if (rawMsg.includes('403') || rawMsg.includes('Forbidden') || rawMsg.includes('access denied')) {
    return 'YouTube restringió temporalmente este formato. Por favor selecciona otra calidad (como 720p o 480p) o vuelve a intentar en unos segundos.'
  }
  if (rawMsg.includes('Sign in to confirm') || rawMsg.includes('bot')) {
    return 'YouTube solicitó verificación temporal. Por favor reintenta la descarga ahora.'
  }
  if (rawMsg.includes('ffmpeg') || rawMsg.includes('combinando')) {
    return 'No se pudo combinar este flujo específico. Por favor prueba con otra calidad o descarga simple.'
  }
  if (rawMsg.length > 140) {
    return rawMsg.substring(0, 140) + '...'
  }
  return rawMsg
}

export interface DownloaderProps {
  initialUrl?: string
  autoSearch?: boolean
}

export default function YoutubeDownloader({ initialUrl, autoSearch }: DownloaderProps = {}) {
  const { t } = useI18n()
  const { isNative } = usePlatform()
  const { scheduleNotification } = useNotifications()
  const { addToHistory } = useDownloadHistory()
  const { showInterstitial } = useAdMobInterstitial()
  const { showRewarded } = useAdMobRewarded()
  const { plan, isPro } = useProPlan()

  const [url, setUrl] = useState(initialUrl || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInfo, setVideoInfo] = useState<DownloadResponse | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadDetails, setDownloadDetails] = useState('')
  const [downloadCompletedInfo, setDownloadCompletedInfo] = useState<{
    title: string;
    filename: string;
    filePath?: string;
  } | null>(null)

  const [isProModalOpen, setIsProModalOpen] = useState(false)
  const [targetProQuality, setTargetProQuality] = useState('1080p')

  const [originalUrl, setOriginalUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'simple' | 'combined'>('simple');

  const isProQuality = (quality: string) => ['1080p', '1440p', '2160p'].includes(quality)

  // 🔄 CAMBIAR TAB + ANUNCIO
  const handleTabChange = async (tab: 'simple' | 'combined') => {
    if (isNative) {
      await showInterstitial()
    }
    setActiveTab(tab)
  }

  const processUrl = async (urlToFetch: string) => {
    const cleanTargetUrl = extractUrlFromText(urlToFetch) || urlToFetch.trim()
    if (!cleanTargetUrl || (!cleanTargetUrl.includes('youtube.com') && !cleanTargetUrl.includes('youtu.be'))) {
      setError('Por favor, ingresa un enlace válido de YouTube')
      return
    }

    setUrl(cleanTargetUrl)
    setIsLoading(true)
    setError(null)
    setVideoInfo(null)
    setDownloadProgress(0)

    try {
      let nativeDebugError: string | undefined
      const runningNative = isNative || detectNativePlatform()
      const capObj = typeof window !== 'undefined' ? (window as any).Capacitor : undefined
      console.info(
        '[FTYYoutube] processUrl start ' +
          JSON.stringify({
            cleanTargetUrl,
            isNativeState: isNative,
            runningNative,
            platform: capObj?.getPlatform?.() || 'unknown',
            hasAndroidBridge: typeof window !== 'undefined' && Boolean((window as any).androidBridge),
          })
      )

      // 📱 Plan A (Móvil): Extraer directo desde el dispositivo para usar la IP del usuario
      if (runningNative) {
        try {
          const { result: nativeData, debugError } = await extractYoutubeNativeWithDiagnostics(cleanTargetUrl)
          nativeDebugError = debugError
          if (nativeData && nativeData.formats && nativeData.formats.length > 0) {
            console.info('[FTYYoutube] Native extraction OK:', nativeData.formats.length)
            setVideoInfo(nativeData)
            setOriginalUrl(cleanTargetUrl)
            return
          }
          console.warn('[FTYYoutube] Native extraction empty/failed:', debugError)
        } catch (nativeExtractErr: any) {
          nativeDebugError = nativeExtractErr?.message || 'Error en extracción nativa'
          console.warn('⚠️ [FTYYoutube] Extracción nativa falló, recurriendo al servidor...', nativeExtractErr)
        }
      }

      // 🌐 Plan B (Web o fallback desde móvil): Servidor Hetzner
      const response = await fetch('/api/download/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: cleanTargetUrl,
          clientIsNative: runningNative,
          clientDiagnostic: nativeDebugError || null,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const baseError = data.error || 'Error al procesar el video'
        throw new Error(nativeDebugError ? `[Diagnóstico Móvil: ${nativeDebugError}]\n\n${baseError}` : baseError)
      }

      if (data.status === 'success') {
        setVideoInfo(data)
        setOriginalUrl(cleanTargetUrl);
      } else {
        throw new Error(data.message || 'Error desconocido')
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el video')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await readNativeClipboard()
      if (text) {
        const clean = extractUrlFromText(text) || text.trim()
        setUrl(clean)
        processUrl(clean)
      }
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    processUrl(url)
  }

  useEffect(() => {
    if (initialUrl) {
      const clean = extractUrlFromText(initialUrl) || initialUrl.trim()
      setUrl(clean)
      if (autoSearch) {
        processUrl(clean)
      }
    }
  }, [initialUrl, autoSearch])



  // ✅ FUNCIÓN PARA VERIFICAR SI LA COMBINACIÓN ESTÁ SOPORTADA POR EL MOTOR FFmpeg
  const isCombinationAllowed = (quality: string): boolean => {
    const allowedCombinationQualities = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p']
    return allowedCombinationQualities.includes(quality)
  }

  // ✅ FUNCIÓN MEJORADA PARA DESCARGA COMBINADA CON STREAMING BINARIO REAL Y CONTROL PRO
  const downloadCombined = async (quality: string) => {
    // 🔒 Control de Suscripción PRO para alta calidad combinada (1080p, 1440p, 2160p)
    if (isProQuality(quality) && !isPro) {
      setTargetProQuality(quality)
      setIsProModalOpen(true)
      return
    }

    if (!isCombinationAllowed(quality)) {
      setError("La combinación no está disponible para " + quality)
      return
    }

    const { format } = findBestFormatForQuality(quality, false)
    if (!format) {
      setError(`No se encontró formato para calidad ${quality}`)
      return
    }

    // Siempre mantener el flujo dentro de downloadCombined (no redirigir a descarga simple sin audio)
    const isProgressiveWithAudio = !!format.hasAudio && !format.url?.includes('.m3u8')

    const cleanTitle = (videoInfo?.title || 'video').replace(/[/\\?%*:|"<>]/g, '_').trim()
    const defaultFilename = `${cleanTitle}_${quality}.mp4`
    const audioCandidate = format.recommended_audio?.url ? format.recommended_audio : findBestAudioFormat()

    const startDownload = async () => {
      const downloadId = 'dl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
      setDownloading(`combined-${quality}`)
      setDownloadProgress(1)
      setDownloadDetails('Iniciando descarga en el servidor...')

      let pollActive = true
      const pollProgress = async () => {
        while (pollActive) {
          try {
            const res = await fetch(`/api/download/youtube/progress?id=${downloadId}`)
            if (res.ok) {
              const data = await res.json()
              if (data.status === 'downloading' && typeof data.percent === 'number') {
                setDownloadProgress(data.percent)
                const parts = []
                if (data.speed) parts.push(data.speed)
                if (data.eta) parts.push(`ETA: ${data.eta}`)
                setDownloadDetails(parts.length > 0 ? parts.join(' • ') : 'Descargando flujo...')
              } else if (data.status === 'merging') {
                setDownloadProgress(99)
                setDownloadDetails('Combinando audio y video con FFmpeg...')
              } else if (data.status === 'completed') {
                setDownloadProgress(100)
                setDownloadDetails('Guardando archivo...')
              }
            }
          } catch {
            // ignore poll error
          }
          await new Promise((r) => setTimeout(r, 400))
        }
      }
      pollProgress()

      try {
        console.log('🎬 Iniciando descarga combinada con streaming binario real...', quality)

        // 📱 PRIORIDAD 1 (MÓVIL): Combinador nativo si la URL se extrajo en el dispositivo o no está atada a IP del servidor
        const isDeviceExtracted = videoInfo?.method === 'native_device'
        const isIpBound = !isDeviceExtracted && format.url && format.url.includes('googlevideo.com')
        if (isNative && format.url && format.url.startsWith('http') && !isIpBound) {
          console.log('📱 [Android] Descargando y combinando nativamente con MediaMuxer...')
          pollActive = false
          setDownloadDetails('Descargando y combinando en tu dispositivo...')
          setDownloadProgress(35)
          try {
            const nativeRes = await downloadAndCombineNative(
              format.url,
              isProgressiveWithAudio ? undefined : (audioCandidate?.url || undefined),
              defaultFilename,
              false
            )
            setDownloadProgress(100)
            setDownloadDetails('¡Guardado en la Galería!')
            scheduleNotification('Descarga Completada', `Guardado en Galería (${defaultFilename})`)
            await Toast.show({
              text: `✅ ¡Descarga completada! Guardado en Galería (Descargador Pro).`,
              duration: 'long'
            }).catch(() => {})
            addToHistory({
              title: videoInfo?.title || defaultFilename,
              platform: 'youtube',
              thumbnail: videoInfo?.thumbnail || '',
              originalUrl: originalUrl || url,
              status: 'completed',
              format: quality.toUpperCase(),
              filePath: nativeRes.uri,
              mimeType: 'video/mp4'
            })
            setDownloadCompletedInfo({
              title: videoInfo?.title || defaultFilename,
              filename: defaultFilename,
              filePath: nativeRes.uri
            })
            setTimeout(() => setDownloadCompletedInfo(null), 8000)
            return
          } catch (nativeErr: any) {
            console.warn('⚠️ Combinador nativo falló, recurriendo al servidor...', nativeErr)
            pollActive = true
            pollProgress()
          }
        }

      const response = await fetch('/api/download/youtube/combined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-plan': plan
        },
        body: JSON.stringify({
          url: originalUrl || url,
          quality: quality,
          video_url: format.url,
          audio_url: isProgressiveWithAudio ? undefined : audioCandidate?.url,
          video_itag: format.itag,
          audio_itag: isProgressiveWithAudio ? undefined : ((audioCandidate as any)?.itag || (format.recommended_audio as any)?.itag || 140),
          is_pro: isPro,
          plan: plan,
          downloadId,
          filename: defaultFilename
        })
      })

      if (!response.ok) {
        // ✅ MEJORADO: Leer como texto primero para evitar error de JSON si devuelve binario
        const errorText = await response.text().catch(() => 'Error de red')
        let errorMsg = `Error ${response.status}: Ha fallado el servidor de descargas`
        try {
          const errorData = JSON.parse(errorText)
          errorMsg = errorData.error || errorMsg
          if (response.status === 403 || errorData.code === 'PRO_REQUIRED') {
            setTargetProQuality(quality)
            setIsProModalOpen(true)
            return
          }
        } catch {
          errorMsg = errorText.substring(0, 100) || errorMsg
        }

        // 🔄 Fallback automático: Combinar usando URLs directas a través del proxy
        const fallbackAudioUrl = (format.recommended_audio as any)?.url || findBestAudioFormat()?.url
        if (format.url && fallbackAudioUrl) {
          console.log('🔄 Intentando fallback con Proxy Combiner...')
          setDownloadDetails('Servidor ocupado. Combinando flujos de audio y video...')
          await downloadCombinedWithProxy(format.url, fallbackAudioUrl, defaultFilename, quality)
          return
        }

        const cleanMsg = formatUserFriendlyError(errorMsg)
        if (isNative) {
          Dialog.alert({ title: 'Error en la descarga', message: cleanMsg }).catch(() => {})
        }
        setError(cleanMsg)
        return
      }

      // Verificar que la respuesta sea binaria y no un error JSON
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Respuesta inválida del servidor')
      }

      const cd = response.headers.get('content-disposition') || ''
      let filename = `youtube_combined_${quality}_${Date.now()}.mp4`
      const utfMatch = cd.match(/filename\*=UTF-8''([^;\r\n"']+)/i)
      const match = utfMatch || cd.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i)
      if (match && match[1]) {
        try { filename = decodeURIComponent(match[1]) } catch { filename = match[1] }
      }

      // Detener polling una vez que el servidor entregó el archivo y comienza el stream del cliente
      pollActive = false
      setDownloadDetails('Finalizando descarga...')
      await downloadStream(response, filename, `combined-${quality}`)

    } catch (error) {
      console.error('❌ Error en descarga combinada:', error)
      const rawMsg = error instanceof Error ? error.message : 'Error en la descarga combinada'
      const msg = formatUserFriendlyError(rawMsg)
      if (isNative) {
        Dialog.alert({ title: 'Error en la descarga', message: msg }).catch(() => {})
      }
      setError(msg)
    } finally {
      pollActive = false
      setTimeout(() => {
        setDownloading(null)
        setDownloadProgress(0)
        setDownloadDetails('')
      }, 1500)
    }
  }

  if (isNative && !isPro) {
    Toast.show({ text: `Preparando descarga de ${quality}...`, duration: 'short' }).catch(() => {})
    showRewarded(startDownload).catch(() => {
      startDownload()
    })
  } else {
    startDownload()
  }
}

  // ✅ FUNCIÓN PARA COMBINACIÓN CON PROXY (FALLBACK)
  const downloadCombinedWithProxy = async (videoUrl: string, audioUrl: string, filename: string, quality: string) => {
    try {
      console.log('🎵 Combinando con URLs separadas (proxy fallback)...')

      // Enviar ambas URLs al proxy para combinación
      const response = await fetch('/api/download/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_url: videoUrl,
          audio_url: audioUrl,
          filename: filename,
          quality: quality,
          isCombined: true
        })
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Error de red')
        let errorMsg = 'Error en combinación por proxy'
        try {
          const errorData = JSON.parse(errorText)
          errorMsg = errorData.error || errorMsg
        } catch {
          errorMsg = errorText.substring(0, 100) || errorMsg
        }
        throw new Error(errorMsg)
      }

      console.log('✅ Archivo combinado recibido del proxy, iniciando flujo de descarga...')
      await downloadStream(response, filename, `combined-${quality}`)

    } catch (error) {
      console.error('❌ Error en combinación por proxy:', error)
      throw error
    }
  }

  // ✅ DESCARGA SIMPLE (SIN COMBINAR) - AHORA USANDO BACKEND ROBUSTO
  const handleSimpleDownload = async (quality: string, fileExt: string = 'mp4') => {
    const { format } = findBestFormatForQuality(quality, true)

    if (!format) {
      setError(`No se encontró la calidad ${quality} disponible`)
      return
    }

    const cleanTitle = (videoInfo?.title || 'video').replace(/[/\\?%*:|"<>]/g, '_').trim()
    const defaultFilename = `${cleanTitle}_${quality}.${fileExt}`

    const startSimpleDownload = async () => {
      const downloadId = 'dl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
      setDownloadProgress(1)
      setDownloading(`simple-${quality}`)
      setDownloadDetails('Iniciando descarga en el servidor...')

      let pollActive = true
      const pollProgress = async () => {
        while (pollActive) {
          try {
            const res = await fetch(`/api/download/youtube/progress?id=${downloadId}`)
            if (res.ok) {
              const data = await res.json()
              if (data.status === 'downloading' && typeof data.percent === 'number') {
                setDownloadProgress(data.percent)
                const parts = []
                if (data.speed) parts.push(data.speed)
                if (data.eta) parts.push(`ETA: ${data.eta}`)
                setDownloadDetails(parts.length > 0 ? parts.join(' • ') : 'Descargando video...')
              } else if (data.status === 'completed') {
                setDownloadProgress(100)
                setDownloadDetails('Guardando video...')
              }
            }
          } catch {
            // ignore
          }
          await new Promise((r) => setTimeout(r, 400))
        }
      }
      pollProgress()

      try {
        console.log('📥 Iniciando descarga simple...', quality)

        // 🚀 PRIORIDAD 1: Si tenemos la URL directa del stream en el cliente (extraída en dispositivo o no atada a IP del servidor)
        const isDeviceExtracted = videoInfo?.method === 'native_device'
        const isIpBound = !isDeviceExtracted && format.url && format.url.includes('googlevideo.com')
        if (format.url && format.url.startsWith('http') && !isIpBound) {
          if (isNative) {
            try {
              console.log('📱 [Android] Descargando flujo directo nativamente...')
              pollActive = false
              setDownloadDetails('Descargando archivo directamente...')
              setDownloadProgress(35)
              const nativeRes = await downloadAndCombineNative(
                format.url,
                undefined,
                defaultFilename,
                false
              )
              setDownloadProgress(100)
              setDownloadDetails('¡Guardado en la Galería!')
              scheduleNotification('Descarga Completada', `Guardado en Galería (${defaultFilename})`)
              await Toast.show({
                text: `✅ ¡Descarga completada! Guardado en Galería.`,
                duration: 'long'
              }).catch(() => {})
              addToHistory({
                title: videoInfo?.title || defaultFilename,
                platform: 'youtube',
                thumbnail: videoInfo?.thumbnail || '',
                originalUrl: originalUrl || url,
                status: 'completed',
                format: quality.toUpperCase(),
                filePath: nativeRes.uri,
                mimeType: 'video/mp4'
              })
              setDownloadCompletedInfo({
                title: videoInfo?.title || defaultFilename,
                filename: defaultFilename,
                filePath: nativeRes.uri
              })
              setTimeout(() => setDownloadCompletedInfo(null), 8000)
              return
            } catch (nativeErr) {
              console.warn('⚠️ Descarga directa nativa falló, intentando fetch stream...', nativeErr)
            }

            try {
              const directRes = await fetch(format.url)
              if (directRes.ok && directRes.body) {
                pollActive = false
                await downloadStream(directRes, defaultFilename, `simple-${quality}`)
                return
              }
            } catch (fetchErr) {
              console.warn('⚠️ Fetch stream falló...', fetchErr)
            }
          }

          // Fallback vía proxy seguro
          try {
            console.log('🔄 Descargando mediante proxy...')
            setDownloadDetails('Descargando archivo mediante proxy...')
            const proxyRes = await fetch(`/api/download/proxy?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(defaultFilename)}`)
            if (proxyRes.ok && proxyRes.body) {
              pollActive = false
              await downloadStream(proxyRes, defaultFilename, `simple-${quality}`)
              return
            }
          } catch (proxyErr) {
            console.warn('⚠️ Descarga por proxy falló, intentando servidor...', proxyErr)
          }
        }

        // ✅ USAR EL ENDPOINT DEL BACKEND COMO RESPALDO
        const response = await fetch('/api/download/youtube/combined', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: originalUrl,
            quality: quality,
            video_url: format.url,
            video_itag: format.itag, // ENVIAR SOLO VIDEO_ITAG
            audio_itag: null,        // DESHABILITAR AUDIO
            format_type: fileExt,
            downloadId,
            filename: defaultFilename
          })
        })

        if (!response.ok) {
          // ✅ MEJORADO: Leer como texto primero
          const errorText = await response.text().catch(() => 'Error de red')
          let errorMsg = 'Error en descarga simple del servidor'
          try {
            const errorData = JSON.parse(errorText)
            errorMsg = errorData.error || errorMsg
          } catch {
            errorMsg = errorText.substring(0, 100) || errorMsg
          }

          // 🔄 Fallback automático para descarga simple mediante proxy
          if (format.url) {
            console.log('🔄 Intentando descarga simple mediante proxy fallback...')
            setDownloadDetails('Descargando archivo mediante proxy seguro...')
            const proxyRes = await fetch(`/api/download/proxy?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(defaultFilename)}`)
            if (proxyRes.ok) {
              pollActive = false
              setDownloadDetails('Finalizando...')
              await downloadStream(proxyRes, defaultFilename, `simple-${quality}`)
              return
            }
          }

          const cleanMsg = formatUserFriendlyError(errorMsg)
          if (isNative) {
            Dialog.alert({ title: 'Error en la descarga', message: cleanMsg }).catch(() => {})
          }
          setError(cleanMsg)
          return
        }

        // Verificar que la respuesta sea binaria y no un error JSON
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Respuesta inválida del servidor')
        }

        const cd = response.headers.get('content-disposition') || ''
        let filename = defaultFilename
        const utfMatch = cd.match(/filename\*=UTF-8''([^;\r\n"']+)/i)
      const match = utfMatch || cd.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i)
        if (match && match[1]) {
          try { filename = decodeURIComponent(match[1]) } catch { filename = match[1] }
        }

        pollActive = false
        setDownloadDetails('Finalizando...')
        await downloadStream(response, filename, `simple-${quality}`)

      } catch (error) {
        console.error('❌ Error en descarga simple backend:', error)
        const rawMsg = error instanceof Error ? error.message : 'Error en descarga simple'
        const msg = formatUserFriendlyError(rawMsg)
        if (isNative) {
          Dialog.alert({ title: 'Error en la descarga', message: msg }).catch(() => {})
        }
        setError(msg)
      } finally {
        pollActive = false
        setTimeout(() => {
          setDownloading(null)
          setDownloadProgress(0)
          setDownloadDetails('')
        }, 1500)
      }
    }

    if (isNative && !isPro) {
      Toast.show({ text: `Preparando descarga de ${quality}...`, duration: 'short' }).catch(() => {})
      showRewarded(startSimpleDownload).catch(() => {
        startSimpleDownload()
      })
    } else {
      startSimpleDownload()
    }
  }


  // ✅ LECTOR DE STREAM PARA PROGRESO EN TIEMPO REAL
  const downloadStream = async (response: Response, filename: string, quality: string) => {
    // Tracking de progreso
    const totalStr = response.headers.get('Content-Length') || response.headers.get('X-File-Size')
    const total = totalStr ? parseInt(totalStr, 10) : 0
    let loaded = 0
    const startTime = Date.now()

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No se pudo establecer el flujo de datos')

    const chunks: Uint8Array[] = []
    setDownloadProgress(2)
    setDownloadDetails('Iniciando transferencia...')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      chunks.push(value)
      loaded += value.length

      const elapsedSec = (Date.now() - startTime) / 1000
      const speedBps = elapsedSec > 0 ? loaded / elapsedSec : 0
      const speedText = speedBps > 1024 * 1024
        ? `${(speedBps / (1024 * 1024)).toFixed(1)} MB/s`
        : `${Math.round(speedBps / 1024)} KB/s`

      if (total > 0) {
        const progress = Math.round((loaded / total) * 100)
        setDownloadProgress(Math.min(progress, 99)) // Nunca mostrar 100% hasta que termine el stream
        const remainingBytes = Math.max(total - loaded, 0)
        const etaSec = speedBps > 0 ? Math.round(remainingBytes / speedBps) : 0
        const etaText = etaSec > 0 ? `ETA: ${Math.floor(etaSec / 60)}:${String(etaSec % 60).padStart(2, '0')}` : ''
        setDownloadDetails(`${speedText} • ${formatBytes(loaded)} / ${formatBytes(total)} ${etaText ? '• ' + etaText : ''}`)
      } else {
        setDownloadProgress((prev) => Math.min(prev + 2, 95))
        setDownloadDetails(`${speedText} • ${formatBytes(loaded)} transferidos`)
      }
    }

    const blob = new Blob(chunks as any, { type: (response.headers.get('Content-Type') as string) || 'video/mp4' })

    if (blob.size === 0) {
      throw new Error('El archivo recibido está vacío (0 bytes). Por favor intenta nuevamente.')
    }

    setDownloadProgress(100)

    // Detectar si es audio o video
    // Detectar si es audio o video
    const isAudio = filename.toLowerCase().includes('audio') || filename.toLowerCase().includes('.mp3') || filename.toLowerCase().includes('.m4a')

    if (isNative) {
      // 📱 NATIVE: Guardar usando saveNativeMediaFile por fragmentos seguros y MediaStore
      try {
        console.log(`💾 Iniciando guardado nativo seguro de ${formatBytes(blob.size)}...`);
        setDownloadDetails('Guardando archivo en el teléfono...');

        const saveRes = await saveNativeMediaFile(blob, filename, isAudio, (chunkPct) => {
          setDownloadProgress(chunkPct);
        });

        const savedUri = saveRes.uri;
        const typeFolder = isAudio ? 'DescargadorPro Audio' : 'DescargadorPro Video';

        scheduleNotification('Descarga Completada', `Guardado en ${typeFolder}/${filename}`);

        await Toast.show({
          text: `✅ ¡Descarga completada! Guardado en ${isAudio ? 'Música' : 'Galería'} (${typeFolder}).`,
          duration: 'long'
        }).catch(() => {});

        addToHistory({
          title: videoInfo?.title || filename,
          platform: 'youtube',
          thumbnail: videoInfo?.thumbnail || '',
          originalUrl: originalUrl || url,
          status: 'completed',
          format: quality.replace(/^combined-|^simple-|^audio-/, '').toUpperCase(),
          fileSize: formatBytes(blob.size),
          duration: videoInfo?.duration ? String(videoInfo.duration) : undefined,
          filePath: savedUri, // URI REAL para reproducción
          mimeType: isAudio ? 'audio/mpeg' : 'video/mp4'
        });

        setDownloadCompletedInfo({
          title: videoInfo?.title || filename,
          filename,
          filePath: savedUri
        });
        setTimeout(() => setDownloadCompletedInfo(null), 8000);

        setDownloading(null);
        setDownloadProgress(0);
      } catch (error: any) {
        console.error('Error en guardado nativo:', error);
        setDownloading(null);
        setDownloadProgress(0);

        await Toast.show({
          text: `❌ Error al guardar archivo: ${error.message || 'Error desconocido'}`,
          duration: 'long'
        }).catch(() => {});

        await Dialog.alert({
          title: 'Error al Guardar',
          message: `No se pudo guardar el archivo. ${error.message || 'Error desconocido'}`
        });
      }
    } else {
      // 🌐 WEB: Método clásico
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 10000)

      console.log(`✅ Descarga completada: ${filename} (${formatBytes(blob.size)})`)
      setDownloadCompletedInfo({
        title: videoInfo?.title || filename,
        filename,
        filePath: 'Descargas'
      })
      setTimeout(() => setDownloadCompletedInfo(null), 8000)
      scheduleNotification('Descarga Completada', `${filename} se ha guardado correctamente.`)

      addToHistory({
        title: videoInfo?.title || filename,
        platform: 'youtube',
        thumbnail: videoInfo?.thumbnail || '',
        originalUrl: originalUrl || url,
        status: 'completed',
        format: quality.replace(/^combined-|^simple-|^audio-/, '').toUpperCase(),
        fileSize: formatBytes(blob.size)
      })
    }
  }

  // ✅ FUNCIÓN PRINCIPAL DE DESCARGA (Backend - Combinado)
  const downloadThroughBackend = async (
    downloadUrl: string,
    filename: string,
    quality?: string,
    isAudio: boolean = false
  ) => {
    // 📺 ANUNCIO BONIFICADO para descargas combinadas (Backend)
    showRewarded(async () => {
      try {
        setDownloading(quality || (isAudio ? 'audio' : 'video'))
        setDownloadProgress(0)

        console.log('⬇️ Iniciando descarga...', { quality, filename, isAudio, downloadUrl: downloadUrl?.substring(0, 100) })

        // ✅ VERIFICACIÓN CRÍTICA: Asegurar que la URL sea válida
        if (!downloadUrl || !downloadUrl.startsWith('http')) {
          console.error('❌ URL inválida para descarga:', downloadUrl)
          throw new Error(`URL de descarga inválida: ${downloadUrl}. Por favor, intenta con otra calidad.`)
        }

        // ✅ SOLICITAR PERMISOS DE ALMACENAMIENTO (Android)
        if (isNative) {
          try {
            // Solicitar permiso de escritura en almacenamiento público
            const status = await Filesystem.checkPermissions();
            if (status.publicStorage !== 'granted') {
              const request = await Filesystem.requestPermissions();
              if (request.publicStorage !== 'granted') {
                throw new Error('Permiso de almacenamiento denegado. No se puede guardar el video.');
              }
            }
          } catch (e) {
            console.error('Error verificando permisos de almacenamiento:', e);
            // Continuamos, algunos Android nuevos no requieren esto explícitamente para Downloads
          }
        }

        const progressInterval = setInterval(() => {
          setDownloadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 800)

        const response = await fetch('/api/download/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: downloadUrl,
            filename: filename,
            quality: quality,
            isAudio: isAudio,
            thumbnailUrl: videoInfo?.thumbnail // ✅ Enviar miniatura para incrustar
          })
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))

          if (response.status === 408) {
            throw new Error(`TIMEOUT: ${errorData.error || 'El servidor tardó demasiado en responder'} `)
          }

          throw new Error(errorData.error || `Error ${response.status} `)
        }

        const blob = await response.blob()

        if (blob.size === 0) {
          throw new Error('El archivo recibido está vacío')
        }

        console.log('✅ Descarga exitosa:', blob.size, 'bytes')
        setDownloadProgress(100)

        if (isNative) {
          // 📱 NATIVE: Guardar usando saveNativeMediaFile por fragmentos seguros y MediaStore
          try {
            const saveRes = await saveNativeMediaFile(blob, filename, isAudio);
            const savedUri = saveRes.uri;
            const typeFolder = isAudio ? 'DescargadorPro Audio' : 'DescargadorPro Video';

            scheduleNotification('Descarga Completada', `Guardado en ${typeFolder}/${filename}`);

            await Toast.show({
              text: `✅ ¡Descarga completada! Guardado en ${isAudio ? 'Música' : 'Galería'} (${typeFolder}).`,
              duration: 'long'
            }).catch(() => {});

            addToHistory({
              title: videoInfo?.title || filename,
              platform: 'youtube',
              thumbnail: videoInfo?.thumbnail || '',
              originalUrl: downloadUrl,
              status: 'completed',
              format: quality,
              fileSize: formatBytes(blob.size),
              duration: videoInfo?.duration ? String(videoInfo.duration) : undefined,
              filePath: savedUri,
              mimeType: isAudio ? 'audio/mpeg' : 'video/mp4'
            });

            setDownloadCompletedInfo({
              title: videoInfo?.title || filename,
              filename,
              filePath: savedUri
            });
            setTimeout(() => setDownloadCompletedInfo(null), 8000);

          } catch (writeError: any) {
            console.error('Error guardando archivo nativo:', writeError);
            await Dialog.alert({
              title: 'Error Guardando',
              message: `No se pudo guardar el archivo en el dispositivo: ${writeError.message}`
            });
            throw writeError;
          }

        } else {
          // 🌐 WEB: Método clásico
          const blobUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = filename
          link.style.display = 'none'

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)

          // WEB History Update
          scheduleNotification('Descarga Completada', `${filename} se ha descargado correctamente.`)
          const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
          addToHistory({
            title: videoInfo?.title || filename,
            platform: 'youtube',
            thumbnail: videoInfo?.thumbnail || '',
            originalUrl: downloadUrl,
            status: 'completed',
            format: quality,
            fileSize: formatBytes(blob.size),
            duration: videoInfo?.duration ? String(videoInfo.duration) : undefined,
            // Web no tiene acceso directo a file system standard
            mimeType: mimeType
          })
        }
      } catch (error) {
        console.error('❌ Error en descarga:', error)

        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

        if (errorMessage.includes('TIMEOUT') && quality && ['1440p', '2160p', '1080p'].includes(quality)) {
          setError(`⚠️ ${errorMessage} Recomendamos intentar con 720p o 480p.`)
        } else {
          setError(errorMessage)
        }

        if (!errorMessage.includes('TIMEOUT') && downloadUrl && downloadUrl.startsWith('http')) {
          // ✅ NO HACEMOS DESCARGA DIRECTA PARA YOUTUBE PORQUE DA 403 (IP BINDING)
          console.warn('⚠️ Se detectó falla en proxy. La descarga directa está deshabilitada para evitar 403 Forbidden de YouTube.')
          setError('El servidor de YouTube bloqueó la descarga (403). Intenta con otra calidad o espera unos minutos.')
        }

        setDownloading(null)
        setDownloadProgress(0)
      }
    });
  }

  // ✅ DESCARGA DE AUDIO - USANDO STREAMING ROBUSTO
  const handleAudioDownload = async () => {
    const audioFormat = findBestAudioFormat()

    if (!audioFormat) {
      setError('No se encontró formato de audio disponible')
      return
    }

    const cleanTitle = (videoInfo?.title || 'audio').replace(/[/\\?%*:|"<>]/g, '_').trim()
    const ext = audioFormat.format.toLowerCase().includes('mp3') ? 'mp3' : 'm4a'
    const defaultFilename = `${cleanTitle}.${ext}`

    const startAudioDownload = async () => {
      const downloadId = 'dl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
      setDownloading(`audio-${audioFormat.itag}`)
      setDownloadProgress(1)
      setDownloadDetails('Extrayendo audio en el servidor...')

      let pollActive = true
      const pollProgress = async () => {
        while (pollActive) {
          try {
            const res = await fetch(`/api/download/youtube/progress?id=${downloadId}`)
            if (res.ok) {
              const data = await res.json()
              if (data.status === 'downloading' && typeof data.percent === 'number') {
                setDownloadProgress(data.percent)
                const parts = []
                if (data.speed) parts.push(data.speed)
                if (data.eta) parts.push(`ETA: ${data.eta}`)
                setDownloadDetails(parts.length > 0 ? parts.join(' • ') : 'Descargando audio...')
              } else if (data.status === 'completed') {
                setDownloadProgress(100)
                setDownloadDetails('Guardando audio...')
              }
            }
          } catch {
            // ignore
          }
          await new Promise((r) => setTimeout(r, 400))
        }
      }
      pollProgress()

      try {
        console.log('🎵 Descargando audio:', audioFormat.itag)

        // 📱 PRIORIDAD 1 (MÓVIL): Descarga directa nativa a biblioteca de Música si se extrajo en dispositivo o no está atada a IP del servidor
        const isDeviceExtracted = videoInfo?.method === 'native_device'
        const isIpBound = !isDeviceExtracted && audioFormat.url && audioFormat.url.includes('googlevideo.com')
        if (isNative && audioFormat.url && audioFormat.url.startsWith('http') && !isIpBound) {
          console.log('📱 [Android] Descargando audio directamente en el dispositivo...')
          pollActive = false
          setDownloadDetails('Descargando archivo de audio...')
          setDownloadProgress(35)
          try {
            const nativeRes = await downloadAndCombineNative(
              undefined,
              audioFormat.url,
              defaultFilename,
              true
            )
            setDownloadProgress(100)
            setDownloadDetails('¡Guardado en Música!')
            scheduleNotification('Descarga Completada', `Guardado en Música (${defaultFilename})`)
            await Toast.show({
              text: `✅ ¡Audio guardado en tu biblioteca de Música!`,
              duration: 'long'
            }).catch(() => {})
            addToHistory({
              title: videoInfo?.title || defaultFilename,
              platform: 'youtube',
              thumbnail: videoInfo?.thumbnail || '',
              originalUrl: originalUrl || url,
              status: 'completed',
              format: 'AUDIO',
              filePath: nativeRes.uri,
              mimeType: 'audio/mpeg'
            })
            setDownloadCompletedInfo({
              title: videoInfo?.title || defaultFilename,
              filename: defaultFilename,
              filePath: nativeRes.uri
            })
            setTimeout(() => setDownloadCompletedInfo(null), 8000)
            return
          } catch (nativeErr) {
            console.warn('⚠️ Descarga nativa de audio falló, intentando servidor...', nativeErr)
          }
        }

        const response = await fetch('/api/download/youtube/combined', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: originalUrl, // USAR ESTADO originalUrl
            quality: 'audio',
            audio_url: audioFormat.url,
            video_itag: null,
            audio_itag: audioFormat.itag,
            format_type: ext,
            downloadId,
            filename: defaultFilename
          })
        })

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Error de red')
          let errorMsg = `Error ${response.status}: Ha fallado el servidor de descargas`
          try {
            const errorData = JSON.parse(errorText)
            errorMsg = errorData.error || errorMsg
          } catch {
            errorMsg = errorText.substring(0, 100) || errorMsg
          }

          // 🔄 Fallback automático: Descargar audio directamente o mediante proxy
          if (audioFormat.url && audioFormat.url.startsWith('http')) {
            try {
              console.log('🔄 Intentando descarga de audio mediante proxy fallback...')
              setDownloadDetails('Descargando audio mediante enlace directo...')
              const proxyRes = await fetch(`/api/download/proxy?url=${encodeURIComponent(audioFormat.url)}&filename=${encodeURIComponent(defaultFilename)}&isAudio=true`)
              if (proxyRes.ok && proxyRes.body) {
                pollActive = false
                await downloadStream(proxyRes, defaultFilename, `audio-${audioFormat.itag}`)
                return
              }
            } catch (fallbackErr) {
              console.warn('Fallback de audio también falló:', fallbackErr)
            }
          }

          const cleanMsg = formatUserFriendlyError(errorMsg)
          if (isNative) {
            Dialog.alert({ title: 'Error en la descarga', message: cleanMsg }).catch(() => {})
          }
          setError(cleanMsg)
          return
        }
        // Verificar que la respuesta sea binaria y no un error JSON
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Respuesta inválida del servidor')
        }

        const cd = response.headers.get('content-disposition') || ''
        let filename = defaultFilename
        const utfMatch = cd.match(/filename\*=UTF-8''([^;\r\n"']+)/i)
      const match = utfMatch || cd.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i)
        if (match && match[1]) {
          try { filename = decodeURIComponent(match[1]) } catch { filename = match[1] }
        }

        pollActive = false
        setDownloadDetails('Finalizando...')
        await downloadStream(response, filename, `audio-${audioFormat.itag}`)
      } catch (error: any) {
        console.error('❌ Error en descarga de audio backend:', error)
        const rawMsg = error.message || 'Error en descarga de audio'
        const msg = formatUserFriendlyError(rawMsg)
        if (isNative) {
          Dialog.alert({ title: 'Error en la descarga', message: msg }).catch(() => {})
        }
        setError(msg)
      } finally {
        pollActive = false
        setTimeout(() => {
          setDownloading(null)
          setDownloadProgress(0)
          setDownloadDetails('')
        }, 1500)
      }
    }

    if (isNative && !isPro) {
      Toast.show({ text: 'Preparando descarga de audio...', duration: 'short' }).catch(() => {})
      showRewarded(startAudioDownload).catch(() => {
        startAudioDownload()
      })
    } else {
      startAudioDownload()
    }
  }

  // ✅ FUNCIONES AUXILIARES
  const findBestFormatForQuality = (qualityLabel: string, preferVideoOnly: boolean = false): {
    format: VideoFormat | null,
    hasAudio: boolean,
    hasRecommendedAudio: boolean
  } => {
    if (!videoInfo?.formats || !Array.isArray(videoInfo.formats) || videoInfo.formats.length === 0) {
      return { format: null, hasAudio: false, hasRecommendedAudio: false };
    }

    const targetHeight = parseInt(qualityLabel.match(/\d+/)?.[0] || '0');

    const getH = (f: VideoFormat): number => {
      if (typeof f.height === 'number' && f.height > 0) return f.height;
      const resStr = (f.quality || '') + (f.resolution || '');
      const match = resStr.match(/(\d+)p/) || resStr.match(/x(\d+)/) || resStr.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    };

    const isA = (f: VideoFormat) =>
      (f.hasAudio === true && f.hasVideo === false) ||
      f.quality?.toLowerCase().includes('audio only') ||
      f.format?.toLowerCase().includes('mp3') ||
      f.format?.toLowerCase().includes('m4a');

    const videos = videoInfo.formats.filter(f => f.url && f.url.startsWith('http') && !isA(f));

    if (videos.length === 0) {
      return { format: null, hasAudio: false, hasRecommendedAudio: false };
    }

    const getNominalRes = (f: VideoFormat): number => {
      if (typeof f.width === 'number' && typeof f.height === 'number' && f.width > 0 && f.height > 0) {
        return Math.min(f.width, f.height);
      }
      return getH(f);
    };

    const tolerance = Math.max(36, Math.round(targetHeight * 0.12));
    const isHls = (f: VideoFormat) =>
      f.url.includes('.m3u8') || f.url.includes('manifest/hls') || (f.format || '').toLowerCase().includes('m3u8');

    const matchingRes = videos.filter(f => {
      const r = getNominalRes(f);
      if (r > 0) return Math.abs(r - targetHeight) <= tolerance;
      return (f.quality + (f.resolution || '')).toLowerCase().includes(qualityLabel.toLowerCase());
    });

    const rankCandidate = (f: VideoFormat): number => {
      let score = 0;
      if (!isHls(f)) score += 100;
      if ((f.format || '').toLowerCase() === 'mp4') score += 50;
      if ((f.codec || '').toLowerCase().includes('avc1')) score += 30;
      if (preferVideoOnly ? !f.hasAudio : !!f.hasAudio) score += 25;
      if (preferVideoOnly && !f.hasAudio && !isHls(f)) score += 20;
      if (!preferVideoOnly && !isHls(f) && !f.hasAudio) score += 10;
      const diff = Math.abs(getNominalRes(f) - targetHeight);
      return score - diff * 0.1;
    };

    const ranked = [...matchingRes].sort((a, b) => rankCandidate(b) - rankCandidate(a));
    const best = ranked[0] || null;

    return {
      format: best || null,
      hasAudio: !!best?.hasAudio,
      hasRecommendedAudio: !!best?.recommended_audio || !!findBestAudioFormat()
    };
  }

  const findBestAudioFormat = (): VideoFormat | null => {
    if (!videoInfo?.formats) return null
    const validFormats = videoInfo.formats.filter(f => f.url && f.url.startsWith('http'))

    const audioFormats = validFormats.filter(f =>
      f.quality.toLowerCase().includes('audio') ||
      f.format.toLowerCase().includes('mp3') ||
      f.format.toLowerCase().includes('m4a') ||
      (f.hasAudio === true && f.hasVideo === false)
    )

    audioFormats.sort((a, b) => {
      const score = (f: VideoFormat) => {
        let s = 0
        if (String(f.itag) === '140') s += 1000
        if (f.format?.toLowerCase() === 'm4a') s += 500
        if (f.format?.toLowerCase() === 'mp3') s += 400
        const kbps = parseInt(f.quality.match(/\d+/)?.[0] || '0')
        return s + kbps
      }
      return score(b) - score(a)
    })

    return audioFormats[0] || null
  }

  const isQualityAvailable = (quality: string): boolean => {
    const { format } = findBestFormatForQuality(quality, activeTab === 'simple')
    return format !== null && format.url !== undefined && format.url.startsWith('http')
  }

  const getFormatInfo = (quality: string, videoOnly: boolean = false): {
    type: string,
    size: string,
    hasAudio: boolean,
    canCombine: boolean,
    combinationAllowed: boolean
  } => {
    const { format, hasAudio, hasRecommendedAudio } = findBestFormatForQuality(quality, videoOnly)

    if (!format) return {
      type: 'No disponible',
      size: 'N/A',
      hasAudio: false,
      canCombine: false,
      combinationAllowed: false
    }

    let typeText = 'Video'
    let canCombine = false
    const combinationAllowed = isCombinationAllowed(quality)

    if (hasAudio) {
      typeText = 'Video + Audio'
      canCombine = false
    } else if (hasRecommendedAudio && combinationAllowed) {
      typeText = 'Video (audio separado)'
      canCombine = true
    } else if (hasRecommendedAudio && !combinationAllowed) {
      typeText = 'Video (audio separado)'
      canCombine = false
    } else {
      typeText = 'Video (sin audio)'
      canCombine = false
    }

    return {
      type: typeText,
      size: format.size || 'N/A',
      hasAudio: hasAudio,
      canCombine: canCombine,
      combinationAllowed: combinationAllowed
    }
  }

  const ProgressBar = ({ progress, quality, details }: { progress: number, quality: string, details?: string }) => (
    <div className="w-full min-w-[170px] py-1">
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-1.5 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 h-3 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-1 text-[9px] text-white font-bold"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        >
          {progress >= 15 && `${Math.round(progress)}%`}
        </div>
      </div>
      <div className="text-xs text-gray-700 dark:text-slate-200 text-center font-medium">
        {progress < 100 ? (
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 dark:text-slate-200 px-0.5">
              <span>Descargando {quality}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{Math.round(progress)}%</span>
            </div>
            {details && (
              <div className="text-[11px] text-gray-600 dark:text-slate-300 font-medium mt-0.5">
                {details}
              </div>
            )}
          </div>
        ) : (
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
            <span>✅</span> ¡Descarga completada!
          </span>
        )}
      </div>
    </div>
  )

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')} `
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} `
  }

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M vistas`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K vistas`
    }
    return `${count} vistas`
  }

  const availableQualities = predefinedQualities.filter(quality =>
    isQualityAvailable(quality.value)
  )



  // ✅ COMPONENTE DE PESTAÑAS
  const TabButton = ({ active, onClick, children }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${active
        ? 'bg-red-600 text-white border-b-2 border-red-700 shadow-sm'
        : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700/70'
        }`}
    >
      {children}
    </button>
  )

  return (
    <>


      <div className={`${isNative ? 'p-1 sm:p-4 bg-transparent border-0 shadow-none' : 'bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-lg p-3 sm:p-6 md:p-8 border border-gray-200/80 dark:border-slate-800'} transition-colors`}>
        <div className="text-center mb-6">
          <div className="bg-red-100 dark:bg-red-950/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-md">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t.downloader.youtubeTitle}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300">
            {t.downloader.youtubeSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError(null)
                  setVideoInfo(null)
                }}
                onPaste={(e) => {
                  const text = e.clipboardData?.getData('text')
                  if (text) {
                    const clean = extractUrlFromText(text) || text.trim()
                    setUrl(clean)
                    setTimeout(() => processUrl(clean), 50)
                  }
                }}
                placeholder="https://www.youtube.com/watch?v=abc123 o https://youtu.be/abc123"
                className="w-full px-4 py-3.5 pr-24 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none transition-all shadow-sm font-medium"
                required
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors border border-red-200/50 dark:border-red-800/40 cursor-pointer"
              >
                {t.downloader.pasteBtn}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] flex items-center justify-center shadow-lg shadow-red-500/25 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t.downloader.searchingBtn}
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t.downloader.searchBtn}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Error: {error}</span>
              </div>
            </div>
          )}
        </form>

        {videoInfo && (
          <div className="mt-4 sm:mt-6 p-2.5 sm:p-4 md:p-6 bg-green-50/90 dark:bg-slate-800/90 rounded-2xl border border-green-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-green-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800 dark:text-emerald-300">¡Video listo para descargar!</h3>
              </div>
              <span className="text-xs bg-green-200 dark:bg-emerald-900/60 text-green-800 dark:text-emerald-200 px-2 py-1 rounded-full border border-transparent dark:border-emerald-700/50">
                {videoInfo.method}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {videoInfo.thumbnail && (
                <div className="md:col-span-1">
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm leading-tight">{videoInfo.title}</h4>

                <div className="text-xs text-gray-600 dark:text-slate-300 space-y-2">
                  {videoInfo.channel && (
                    <p className="flex items-center">
                      <svg className="h-3 w-3 mr-1 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {videoInfo.channel}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <p className="flex items-center">
                      <svg className="h-3 w-3 mr-1 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ⏱️ {formatDuration(videoInfo.duration)}
                    </p>

                    {videoInfo.viewCount && (
                      <p className="flex items-center">
                        <svg className="h-3 w-3 mr-1 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {formatViewCount(videoInfo.viewCount)}
                      </p>
                    )}
                  </div>

                  <p className="text-green-600 dark:text-emerald-400 font-medium">
                    ✅ {availableQualities.length} calidades disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE AUDIO */}
            <div className="mb-6 pt-4 border-t border-slate-200 dark:border-slate-700/60">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Descargar Solo Audio (MP3 / M4A)</span>
              </h4>
              <div className="flex flex-col items-center">
                {downloading?.startsWith('audio-') ? (
                  <div className="w-full max-w-md">
                    <ProgressBar progress={downloadProgress} quality="Audio" details={downloadDetails} />
                  </div>
                ) : (
                  <button
                    onClick={handleAudioDownload}
                    disabled={!!downloading}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-md shadow-purple-600/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto cursor-pointer"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Descargar Audio de Alta Calidad (MP3/M4A)
                  </button>
                )}
              </div>
            </div>

            {/* PESTAÑAS DE VIDEO */}
            <div className="mb-4 pt-4 border-t border-slate-200 dark:border-slate-700/60">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Descargar Video con Audio</span>
              </h4>

              {/* NAVEGACIÓN DE PESTAÑAS */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-slate-700">
                <TabButton
                  active={activeTab === 'simple'}
                  onClick={() => handleTabChange('simple')}
                >
                  🎬 Solo Video (Sin Combinar)
                </TabButton>
                <TabButton
                  active={activeTab === 'combined'}
                  onClick={() => handleTabChange('combined')}
                >
                  🎵 Video con Audio (Combinado)
                </TabButton>
              </div>

              {/* CONTENIDO DE PESTAÑAS */}
              {activeTab === 'simple' && (
                <div>
                  <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-700/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Solo Video (Sin Audio)</span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-300 text-sm mt-2">
                      Descarga solo el video sin audio. Útil si quieres el video original sin procesar.
                    </p>
                  </div>

                  {/* MOBILE: Simplified Layout - Only Quality + Action */}
                  <div className={isNative ? 'block space-y-2' : 'block md:hidden space-y-2'}>
                    {predefinedQualities.map((quality) => {
                      const isAvailable = isQualityAvailable(quality.value)
                      const isDownloading = downloading === `simple-${quality.value}`
                      const formatInfo = getFormatInfo(quality.value, true)

                      return (
                        <div key={quality.value} className={`flex items-center justify-between gap-2 border rounded-xl p-2 sm:p-2.5 overflow-hidden ${isAvailable ? 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800' : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 opacity-60'} `}>
                          <div className="flex-1 min-w-0 pr-1">
                            <p className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm truncate">{quality.label}</p>
                            {!isAvailable && <p className="text-[10px] text-red-500 dark:text-rose-400 mt-0.5">No disponible</p>}
                          </div>

                          {isDownloading ? (
                            <div className="flex flex-col items-end shrink-0 min-w-[95px] max-w-[125px]">
                              <div className="w-20 sm:w-24 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 transition-all duration-300"
                                  style={{ width: `${Math.min(Math.max(downloadProgress, 0), 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                                {Math.round(downloadProgress)}%
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSimpleDownload(quality.value, quality.ext || 'mp4')}
                              disabled={!isAvailable || downloading !== null}
                              className={`shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg font-bold text-xs whitespace-nowrap active:opacity-75 touch-manipulation cursor-pointer ${isAvailable && !downloading
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                                : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed'
                                }`}
                            >
                              {isAvailable ? 'Descargar' : 'N/A'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* DESKTOP: Table Layout */}
                  <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 dark:border-slate-700">
                    <table className="w-full border-collapse bg-white dark:bg-slate-900/85">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-slate-800">
                          <th className="border-b border-r border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">File type</th>
                          <th className="border-b border-r border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">Format</th>
                          <th className="border-b border-r border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">Peso</th>
                          <th className="border-b border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predefinedQualities.map((quality) => {
                          const isAvailable = isQualityAvailable(quality.value)
                          const isDownloading = downloading === `simple-${quality.value}`
                          const formatInfo = getFormatInfo(quality.value, true)

                          return (
                            <tr key={quality.value} className={`border-b last:border-b-0 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors ${!isAvailable ? 'opacity-55' : ''}`}>
                              <td className="border-r border-gray-200 dark:border-slate-800 px-4 py-3 text-gray-800 dark:text-slate-100 font-medium">
                                {quality.label}
                                {!isAvailable && (
                                  <span className="text-xs text-red-500 dark:text-rose-400 ml-2">(No disponible)</span>
                                )}
                              </td>
                              <td className="border-r border-gray-200 dark:border-slate-800 px-4 py-3 text-gray-600 dark:text-slate-300">
                                <div className="flex items-center">
                                  {formatInfo.type}
                                  {formatInfo.hasAudio && (
                                    <span className="ml-2 text-green-600 dark:text-emerald-400" title="Incluye audio">🎵</span>
                                  )}
                                </div>
                              </td>
                              <td className="border-r border-gray-200 dark:border-slate-800 px-4 py-3 text-gray-600 dark:text-slate-300">
                                {formatInfo.size}
                              </td>
                              <td className="px-4 py-3">
                                {isDownloading ? (
                                  <div className="w-full">
                                    <ProgressBar progress={downloadProgress} quality={quality.value} details={downloadDetails} />
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSimpleDownload(quality.value, quality.ext || 'mp4')}
                                    disabled={!isAvailable || downloading !== null}
                                    className={`py-2 px-4 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center w-full cursor-pointer ${isAvailable && !downloading
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                      : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-transparent dark:border-slate-700 cursor-not-allowed'
                                      }`}
                                  >
                                    {isAvailable ? (
                                      <>
                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download
                                      </>
                                    ) : (
                                      'No disponible'
                                    )}
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'combined' && (
                <div>
                  {/* Banner Estado Plan PRO vs Gratis */}
                  {isPro ? (
                    <div className="bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-emerald-950/60 dark:to-slate-900 border border-emerald-300 dark:border-emerald-700/60 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center space-x-3 text-emerald-800 dark:text-emerald-200">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-xl shrink-0">
                          👑
                        </div>
                        <div>
                          <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Membresía PRO Activa ({plan.toUpperCase()})</p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">Tienes acceso ilimitado a descargas combinadas en 1080p, 2K y 4K con FFmpeg acelerado.</p>
                        </div>
                      </div>
                      <Link
                        href="/planes"
                        className="text-xs font-bold text-emerald-800 dark:text-emerald-100 hover:text-emerald-900 bg-emerald-200/60 dark:bg-emerald-800/60 hover:bg-emerald-200 dark:hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
                      >
                        Gestionar Plan
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/30 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center space-x-3 text-amber-900 dark:text-amber-200">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-xl shrink-0">
                          ✨
                        </div>
                        <div>
                          <p className="font-bold text-sm text-amber-900 dark:text-amber-200">Descargas Gratis hasta 720p HD</p>
                          <p className="text-xs text-amber-700 dark:text-amber-300">Las calidades 1080p Full HD, 2K y 4K con audio integrado requieren el Plan PRO.</p>
                        </div>
                      </div>
                      <Link
                        href="/planes"
                        className="text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-3.5 py-1.5 rounded-lg transition-all shadow-sm whitespace-nowrap self-start sm:self-auto inline-flex items-center gap-1"
                      >
                        👑 Ver Planes PRO
                      </Link>
                    </div>
                  )}

                  {/* MOBILE: Simplified Layout - Only Quality + Action */}
                  <div className={isNative ? 'block space-y-2' : 'block md:hidden space-y-2'}>
                    {predefinedQualities.map((quality) => {
                      const isAvailable = isQualityAvailable(quality.value)
                      const isDownloading = downloading === `combined-${quality.value}`
                      const isProTier = isProQuality(quality.value)
                      const isLocked = isProTier && !isPro

                      return (
                        <div key={quality.value} className={`flex items-center justify-between gap-2 border rounded-xl p-2 sm:p-2.5 overflow-hidden ${isAvailable ? (isProTier ? 'border-amber-200 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800') : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 opacity-60'}`}>
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm leading-tight truncate">{quality.label}</p>
                              {isProTier && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700 shrink-0">
                                  👑 PRO
                                </span>
                              )}
                              {!isProTier && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shrink-0">
                                  Gratis
                                </span>
                              )}
                            </div>
                            {!isAvailable && <p className="text-[10px] text-red-500 mt-0.5">No disponible para este video</p>}
                            {isAvailable && isLocked && (
                              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">🔒 Requiere Plan PRO</p>
                            )}
                          </div>

                          {isDownloading ? (
                            <div className="flex flex-col items-end shrink-0 min-w-[95px] max-w-[125px]">
                              <div className="w-20 sm:w-24 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300"
                                  style={{ width: `${Math.min(Math.max(downloadProgress, 0), 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold mt-0.5">
                                {Math.round(downloadProgress)}%
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (isLocked) {
                                  setTargetProQuality(quality.value)
                                  setIsProModalOpen(true)
                                } else {
                                  downloadCombined(quality.value)
                                }
                              }}
                              disabled={!isAvailable || !!downloading}
                              className={`shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg font-bold text-xs whitespace-nowrap active:opacity-75 touch-manipulation cursor-pointer ${
                                !isAvailable
                                  ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed'
                                  : isLocked
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white'
                                  : isProTier
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {!isAvailable
                                ? 'N/A'
                                : isLocked
                                ? '👑 Desbloquear'
                                : isProTier
                                ? '⚡ Descargar'
                                : 'Descargar'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* DESKTOP: Table Layout */}
                  <div className={isNative ? 'hidden' : 'hidden md:block overflow-x-auto rounded-lg border border-gray-300 dark:border-slate-700'}>
                    <table className="w-full border-collapse bg-white dark:bg-slate-900/85">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-slate-800">
                          <th className="border-b border-r border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">Resolución</th>
                          <th className="border-b border-r border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">Formato</th>
                          <th className="border-b border-r border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">Nivel / Acceso</th>
                          <th className="border-b border-gray-300 dark:border-slate-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predefinedQualities.map((quality) => {
                          const isAvailable = isQualityAvailable(quality.value)
                          const isDownloading = downloading === `combined-${quality.value}`
                          const isProTier = isProQuality(quality.value)
                          const isLocked = isProTier && !isPro

                          return (
                            <tr key={quality.value} className={`border-b last:border-b-0 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors ${!isAvailable ? 'opacity-55' : isProTier ? 'bg-amber-50/20 dark:bg-amber-950/15' : ''}`}>
                              <td className="border-r border-gray-200 dark:border-slate-800 px-4 py-3 text-gray-800 dark:text-slate-100 font-medium">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span>{quality.label}</span>
                                  {isProTier && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                      👑 PRO
                                    </span>
                                  )}
                                  {!isProTier && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 dark:bg-emerald-900/50 text-green-700 dark:text-emerald-300 border border-transparent dark:border-emerald-700/50">
                                      Gratis
                                    </span>
                                  )}
                                  {!isAvailable && (
                                    <span className="text-xs text-red-500 dark:text-rose-400 ml-1">(No disponible)</span>
                                  )}
                                </div>
                              </td>
                              <td className="border-r border-gray-200 dark:border-slate-800 px-4 py-3 text-gray-600 dark:text-slate-300">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-xs text-gray-800 dark:text-slate-200">MP4</span>
                                  <span className="text-green-600 dark:text-emerald-400 text-xs font-medium" title="Audio y video combinados">
                                    🔊 Video + Audio
                                  </span>
                                </div>
                              </td>
                              <td className="border-r border-gray-200 dark:border-slate-800 px-4 py-3 text-gray-600 dark:text-slate-300 text-xs">
                                {isLocked ? (
                                  <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                                    🔒 Requiere Plan PRO
                                  </span>
                                ) : isProTier ? (
                                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                    ✨ PRO Desbloqueado
                                  </span>
                                ) : (
                                  <span className="text-gray-600 dark:text-slate-300">
                                    100% Libre / Sin límites
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isDownloading ? (
                                  <div className="w-full">
                                    <ProgressBar progress={downloadProgress} quality={quality.value} details={downloadDetails} />
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isLocked) {
                                        setTargetProQuality(quality.value)
                                        setIsProModalOpen(true)
                                      } else {
                                        downloadCombined(quality.value)
                                      }
                                    }}
                                    disabled={!isAvailable || !!downloading}
                                    className={`py-2 px-4 rounded-lg font-bold transition-all text-xs flex items-center justify-center w-full shadow-sm cursor-pointer ${
                                      !isAvailable
                                        ? 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-transparent dark:border-slate-700 cursor-not-allowed'
                                        : isLocked
                                        ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white'
                                        : isProTier
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                  >
                                    {!isAvailable ? (
                                      'No disponible'
                                    ) : isLocked ? (
                                      <>
                                        <span className="mr-1.5">👑</span>
                                        Desbloquear {quality.value} PRO
                                      </>
                                    ) : isProTier ? (
                                      <>
                                        <span className="mr-1.5">⚡</span>
                                        Descargar PRO ({quality.value})
                                      </>
                                    ) : (
                                      <>
                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Descargar Gratis
                                      </>
                                    )}
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN DE EJEMPLOS */}
        {/* EJEMPLOS */}
        <div className="mt-6 p-4 bg-red-50/80 dark:bg-slate-800/60 rounded-xl border border-red-200/80 dark:border-slate-700/80 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm font-bold text-red-800 dark:text-slate-200">
              {t.downloader.examplesHeader} YouTube:
            </p>
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400 space-y-1 break-all font-mono">
            <div>• https://www.youtube.com/watch?v=dQw4w9WgXcQ</div>
            <div>• https://youtu.be/dQw4w9WgXcQ</div>
            <div>• https://www.youtube.com/embed/dQw4w9WgXcQ</div>
          </div>
        </div>

        {/* CONSEJOS */}
        <div className="mt-4 p-4 bg-gray-50/70 dark:bg-slate-800/40 rounded-xl border border-gray-200/80 dark:border-slate-700/60 transition-colors">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400">
            <svg className="h-4 w-4 text-gray-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t.downloader.supportedFormats}</span>
          </div>
        </div>
      </div>

      {/* 👑 MODAL PRO / BLOQUEO Y DESBLOQUEO */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        targetQuality={targetProQuality}
        onDownloadFallback={() => {
          setIsProModalOpen(false)
          downloadCombined('720p')
        }}
      />

      {/* 📥 FLOATING ACTIVE DOWNLOAD BAR (Garantiza visibilidad en cualquier parte de la pantalla) */}
      {downloading && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-bold text-slate-100 truncate">
                Descargando: {videoInfo?.title || 'video'}
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold text-emerald-400 shrink-0 ml-2">
              {Math.round(downloadProgress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 transition-all duration-300"
              style={{ width: `${Math.min(Math.max(downloadProgress, 1), 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
            <span className="truncate">{downloadDetails || 'Descarga en segundo plano...'}</span>
            <span className="text-emerald-400 font-semibold shrink-0 ml-2">Segundo plano activo</span>
          </div>
        </div>
      )}

      {/* ✅ FLOATING DOWNLOAD COMPLETED NOTIFIER */}
      {downloadCompletedInfo && !downloading && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-emerald-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-400/50 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="text-xl shrink-0">✅</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">¡Descarga Completada con Éxito!</p>
                <p className="text-[11px] text-emerald-200 truncate">{isNative ? 'Guardado en Galería/Música: ' : 'Guardado en tu carpeta de Descargas: '}{downloadCompletedInfo.filename}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDownloadCompletedInfo(null)}
              className="ml-2 px-2.5 py-1 text-xs font-semibold bg-emerald-700/60 hover:bg-emerald-600 rounded-lg text-white shrink-0"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}
