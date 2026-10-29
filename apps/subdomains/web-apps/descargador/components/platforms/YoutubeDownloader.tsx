'use client'

import { useState } from 'react'
import Link from 'next/link'

import { formatBytes } from '@/lib/utils';
import { usePlatform } from '@/hooks/usePlatform';
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
  { label: '720p (HD Gratis)', value: '720p', ext: 'mp4', isPro: false },
  { label: '480p (.mp4)', value: '480p', ext: 'mp4', isPro: false },
  { value: '360p', label: '360p (.mp4)', ext: 'mp4', isPro: false },
  { value: '240p', label: '240p (.mp4)', ext: 'mp4', isPro: false },
  { value: '144p', label: '144p (.mp4)', ext: 'mp4', isPro: false }
]

export default function YoutubeDownloader() {
  const { isNative } = usePlatform()
  const { scheduleNotification } = useNotifications()
  const { addToHistory } = useDownloadHistory()
  const { showInterstitial } = useAdMobInterstitial()
  const { showRewarded } = useAdMobRewarded()
  const { plan, isPro } = useProPlan()

  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInfo, setVideoInfo] = useState<DownloadResponse | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadDetails, setDownloadDetails] = useState('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Por favor, ingresa un enlace válido de YouTube')
      return
    }

    setIsLoading(true)
    setError(null)
    setVideoInfo(null)
    setDownloadProgress(0)

    try {
      const response = await fetch('/api/download/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el video')
      }

      if (data.status === 'success') {
        console.log('📦 [DATA DEBUG] Respuesta completa del servidor:', data);
        console.log(`📊 [DATA DEBUG] Total formatos recibidos: ${data.formats?.length || 0}`);

        if (data.formats?.length > 0) {
          console.table(data.formats.map((f: any) => ({
            q: f.quality,
            res: f.resolution,
            url: f.url ? 'SI' : 'NO',
            audio: f.hasAudio,
            video: f.hasVideo
          })));
        }

        setVideoInfo(data)
        setOriginalUrl(url);
        setUrl('')
      } else {
        throw new Error(data.message || 'Error desconocido')
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el video')
    } finally {
      setIsLoading(false)
    }
  }



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

      const response = await fetch('/api/download/youtube/combined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-plan': plan
        },
        body: JSON.stringify({
          url: originalUrl || url,
          quality: quality,
          video_itag: format.itag,
          audio_itag: (format.recommended_audio as any)?.itag || 140,
          is_pro: isPro,
          plan: plan,
          downloadId
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
        setError(errorMsg)
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
      const match = cd.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i)
      if (match && match[1]) {
        try { filename = decodeURIComponent(match[1]) } catch { filename = match[1] }
      }

      // Detener polling una vez que el servidor entregó el archivo y comienza el stream del cliente
      pollActive = false
      setDownloadDetails('Finalizando descarga...')
      await downloadStream(response, filename, `combined-${quality}`)

    } catch (error) {
      console.error('❌ Error en descarga combinada:', error)
      setError(error instanceof Error ? error.message : 'Error en la descarga combinada')
    } finally {
      pollActive = false
      setTimeout(() => {
        setDownloading(null)
        setDownloadProgress(0)
        setDownloadDetails('')
      }, 1500)
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

      const blob = await response.blob()

      if (blob.size === 0) {
        throw new Error('El archivo combinado está vacío')
      }

      console.log('✅ Archivo combinado recibido:', blob.size, 'bytes')

      // Verificar headers por si hubo fallback
      const combinedStatus = response.headers.get('X-Combined-Status')
      if (combinedStatus === 'video_only_with_audio_available') {
        const msg = 'Se descargó solo el video debido a límites del servidor. Intenta con 720p para tener audio.'
        setError(msg)
        if (isNative) {
          scheduleNotification('Descarga Parcial', msg)
        }
      } else {
        scheduleNotification('Descarga Completada', `El video ${filename} se ha guardado correctamente.`)
        addToHistory({
          title: videoInfo?.title || filename,
          platform: 'youtube',
          thumbnail: videoInfo?.thumbnail,
          status: 'completed',
          format: quality
        })

      }

      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
      console.log('✅ Combinación por proxy completada')

    } catch (error) {
      console.error('❌ Error en combinación por proxy:', error)
      throw error
    }
  }

  // ✅ DESCARGA SIMPLE (SIN COMBINAR) - AHORA USANDO BACKEND ROBUSTO
  const handleSimpleDownload = async (quality: string, fileExt: string = 'mp4') => {
    // 📺 ANUNCIO INTERSTICIAL (Normal) para descargas simples
    if (isNative) {
      await showInterstitial();
    }

    const { format } = findBestFormatForQuality(quality, true)

    if (!format) {
      setError(`No se encontró la calidad ${quality} disponible`)
      return
    }

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
      console.log('📥 Iniciando descarga simple con motor del backend...', quality)

      // ✅ USAR EL MISMO ENDPOINT DE COMBINACIÓN PERO PARA UN SOLO ITAG
      const response = await fetch('/api/download/youtube/combined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: originalUrl,
          quality: quality,
          video_itag: format.itag, // ENVIAR SOLO VIDEO_ITAG
          audio_itag: null,        // DESHABILITAR AUDIO
          format_type: fileExt,
          downloadId
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
        setError(errorMsg)
        return
      }

      // Verificar que la respuesta sea binaria y no un error JSON
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Respuesta inválida del servidor')
      }

      const cd = response.headers.get('content-disposition') || ''
      let filename = `youtube_simple_${quality}_${Date.now()}.${fileExt}`
      const match = cd.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i)
      if (match && match[1]) {
        try { filename = decodeURIComponent(match[1]) } catch { filename = match[1] }
      }

      pollActive = false
      setDownloadDetails('Finalizando...')
      await downloadStream(response, filename, `simple-${quality}`)

    } catch (error) {
      console.error('❌ Error en descarga simple backend:', error)
      setError(error instanceof Error ? error.message : 'Error en descarga simple')
    } finally {
      pollActive = false
      setTimeout(() => {
        setDownloading(null)
        setDownloadProgress(0)
        setDownloadDetails('')
      }, 1500)
    }
  }


  // ✅ LECTOR DE STREAM PARA PROGRESO EN TIEMPO REAL
  const downloadStream = async (response: Response, filename: string, quality: string) => {
    // Tracking de progreso
    const totalStr = response.headers.get('Content-Length') || response.headers.get('X-File-Size')
    const total = totalStr ? parseInt(totalStr, 10) : 0
    let loaded = 0

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No se pudo establecer el flujo de datos')

    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      chunks.push(value)
      loaded += value.length

      if (total > 0) {
        const progress = Math.round((loaded / total) * 100)
        setDownloadProgress(Math.min(progress, 99)) // Nunca mostrar 100% hasta que termine el stream
      } else {
        // Si no sabemos el total, simular un progreso lento para que el usuario vea actividad
        setDownloadProgress((prev) => Math.min(prev + 1, 95))
      }
    }

    const blob = new Blob(chunks as any, { type: (response.headers.get('Content-Type') as string) || 'video/mp4' })

    setDownloadProgress(100)

    // Detectar si es audio o video
    // Detectar si es audio o video
    const isAudio = filename.toLowerCase().includes('audio') || filename.toLowerCase().includes('.mp3') || filename.toLowerCase().includes('.m4a')

    if (isNative) {
      // 📱 NATIVE: Guardar usando Filesystem en chunks para evitar OOM y mantener ruta personalizada
      try {
        console.log(`💾 Iniciando guardado por chunks de ${formatBytes(blob.size)}...`);

        // 1. Definir ruta y crear directorios
        const baseFolder = 'Download/FTYdownloaderPro/download';
        const typeFolder = isAudio ? 'FTYdownloaderPro Audio' : 'FTYdownloaderPro Video';
        const finalPath = `${baseFolder}/${typeFolder}/${filename}`;

        try {
          await Filesystem.mkdir({
            path: `${baseFolder}/${typeFolder}`,
            directory: Directory.ExternalStorage,
            recursive: true
          });
        } catch (e) {
          // Ignorar si ya existe
        }

        // 2. Función helper para convertir chunk a base64
        const blobToBase64 = (blob: Blob): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        };

        // 3. Escribir archivo por chunks (5MB)
        const CHUNK_SIZE = 1024 * 1024 * 5;
        const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);

        // Eliminar archivo si existe
        try {
          await Filesystem.deleteFile({
            path: finalPath,
            directory: Directory.ExternalStorage
          });
        } catch (e) { }

        // Loop de escritura
        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, blob.size);
          const chunk = blob.slice(start, end);
          const base64Chunk = await blobToBase64(chunk);

          if (i === 0) {
            // Primer chunk: Crear archivo
            await Filesystem.writeFile({
              path: finalPath,
              data: base64Chunk,
              directory: Directory.ExternalStorage
            });
          } else {
            // Siguientes chunks: Append
            await Filesystem.appendFile({
              path: finalPath,
              data: base64Chunk,
              directory: Directory.ExternalStorage
            });
          }

          // Log progreso interno
          if (i % 5 === 0 || i === totalChunks - 1) {
            console.log(`💾 Guardando chunk ${i + 1}/${totalChunks}`);
          }
        }

        // 4. Obtener URI final
        const uriResult = await Filesystem.getUri({
          path: finalPath,
          directory: Directory.ExternalStorage
        });

        const savedUri = uriResult.uri;
        console.log('✅ Archivo guardado correctamente en:', savedUri);

        scheduleNotification('Descarga Completada', `Guardado en ${typeFolder}/${filename}`);

        addToHistory({
          title: videoInfo?.title || filename,
          platform: 'youtube',
          thumbnail: videoInfo?.thumbnail || '',
          originalUrl: originalUrl,
          status: 'completed',
          format: quality,
          fileSize: formatBytes(blob.size),
          duration: videoInfo?.duration ? String(videoInfo.duration) : undefined,
          filePath: savedUri, // URI REAL para reproducción
          mimeType: isAudio ? 'audio/mpeg' : 'video/mp4'
        });

        setDownloading(null);
        setDownloadProgress(0);
      } catch (error: any) {
        console.error('Error en guardado por chunks:', error);
        setDownloading(null);
        setDownloadProgress(0);

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
      scheduleNotification('Descarga Completada', `${filename} se ha guardado correctamente.`)

      addToHistory({
        title: videoInfo?.title || filename,
        platform: 'youtube',
        thumbnail: videoInfo?.thumbnail || '',
        status: 'completed',
        format: quality,
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
          // 📱 NATIVE: Guardar usando Filesystem
          try {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
              const base64Data = (reader.result as string).split(',')[1];
              // Definir carpetas personalizadas dentro de Download (carpeta pública)
              const baseFolder = 'Download/FTYdownloaderPro/download';
              const typeFolder = isAudio ? 'FTYdownloaderPro Audio' : 'FTYdownloaderPro Video';
              const finalPath = `${baseFolder}/${typeFolder}/${filename}`;

              let savedUri = '';

              try {
                // 1. Guardar archivo fisicamente en la ruta solicitada
                const result = await Filesystem.writeFile({
                  path: finalPath,
                  data: base64Data,
                  directory: Directory.ExternalStorage, // ⚠️ Changed from Documents
                  recursive: true
                });
                savedUri = result.uri;
                console.log('[DEBUG-PATH] Guardado EXITO en:', savedUri);

                // 2. Intentar indexar en Galería (solo videos)
                if (!isAudio) {
                  try {
                    // Nota: Media.saveVideo suele mover el archivo.
                    // Si queremos mantener la estructura personalizada, mejor confiamos en que
                    // Android escanee Documents eventualmente, o usamos un plugin de scanner.
                    // Por ahora, solo guardamos ahí.
                  } catch (e) {
                    console.warn('No se pudo indexar', e);
                  }
                }

                scheduleNotification('Descarga Completada', `Guardado en ${typeFolder}/${filename}`);

              } catch (writeErr: any) {
                console.error('[DEBUG-PATH] Fallo escritura carpetas:', writeErr);
                await Dialog.alert({
                  title: 'Error Guardando',
                  message: `No se pudo crear la carpeta ${typeFolder}.\n${writeErr.message}`
                });
                throw writeErr;
              }

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
                filePath: savedUri, // USAMOS LA URI REAL
                mimeType: mimeType
              })
            };
          } catch (writeError: any) {
            console.error('Error guardando archivo nativo:', writeError);
            await Dialog.alert({
              title: 'Error Crítico',
              message: `Fallo al iniciar guardado: ${writeError.message}`
            });
            throw new Error('No se pudo guardar el archivo en el dispositivo');
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
      const ext = audioFormat.format.toLowerCase().includes('mp3') ? 'mp3' : 'm4a'
      console.log('🎵 Descargando audio:', audioFormat.itag)

      const response = await fetch('/api/download/youtube/combined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: originalUrl, // USAR ESTADO originalUrl
          quality: 'audio',
          video_itag: null,
          audio_itag: audioFormat.itag,
          format_type: ext,
          downloadId
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
        setError(errorMsg)
        return
      }
      // Verificar que la respuesta sea binaria y no un error JSON
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Respuesta inválida del servidor')
      }

      const cd = response.headers.get('content-disposition') || ''
      let filename = `audio_${audioFormat.itag}_${Date.now()}.${ext}`
      const match = cd.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i)
      if (match && match[1]) {
        try { filename = decodeURIComponent(match[1]) } catch { filename = match[1] }
      }

      pollActive = false
      setDownloadDetails('Finalizando...')
      await downloadStream(response, filename, `audio-${audioFormat.itag}`)
    } catch (error: any) {
      console.error('❌ Error en descarga de audio backend:', error)
      setError(error.message || 'Error en descarga de audio')
    } finally {
      pollActive = false
      setTimeout(() => {
        setDownloading(null)
        setDownloadProgress(0)
        setDownloadDetails('')
      }, 1500)
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

    // 1. Priorizar según preferencia
    let best = null;

    if (preferVideoOnly) {
      // Intentar encontrar uno que NO tenga audio (DASH/Video Only)
      best = videos.find(f => !f.hasAudio && getH(f) === targetHeight);
      if (best) return { format: best, hasAudio: false, hasRecommendedAudio: !!best.recommended_audio };

      // Si no hay video solo, caer al con audio
      best = videos.find(f => getH(f) === targetHeight);
    } else {
      // Modo normal: Priorizar el que ya tiene audio (Combined)
      best = videos.find(f => f.hasAudio && getH(f) === targetHeight);
      if (best) return { format: best, hasAudio: true, hasRecommendedAudio: false };

      // Si no hay con audio, caer al video solo
      best = videos.find(f => getH(f) === targetHeight);
    }

    if (best) return { format: best, hasAudio: !!best.hasAudio, hasRecommendedAudio: !!best.recommended_audio };

    // 3. Fallback por texto (ej: si dice 1080 en el nombre)
    best = videos.find(f => (f.quality + (f.resolution || '')).toLowerCase().includes(qualityLabel.toLowerCase()));
    if (best) return { format: best, hasAudio: !!best.hasAudio, hasRecommendedAudio: !!best.recommended_audio };

    // 4. Fallback al más cercano
    const sorted = [...videos].sort((a, b) => getH(b) - getH(a));
    if (targetHeight > 1080) {
      best = sorted.find(f => getH(f) >= targetHeight * 0.85);
    } else {
      best = sorted.find(f => getH(f) <= targetHeight) || sorted[0];
    }

    return {
      format: best || null,
      hasAudio: !!best?.hasAudio,
      hasRecommendedAudio: !!best?.recommended_audio
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
      const getV = (q: string) => parseInt(q.match(/\d+/)?.[0] || '0')
      return getV(b.quality) - getV(a.quality)
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
      <div className="w-full bg-gray-200 rounded-full h-3 mb-1.5 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 h-3 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-1 text-[9px] text-white font-bold"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        >
          {progress >= 15 && `${Math.round(progress)}%`}
        </div>
      </div>
      <div className="text-xs text-gray-700 text-center font-medium">
        {progress < 100 ? (
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 px-0.5">
              <span>Descargando {quality}</span>
              <span className="text-emerald-700 font-bold">{Math.round(progress)}%</span>
            </div>
            {details && (
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                {details}
              </div>
            )}
          </div>
        ) : (
          <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
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
      onClick={onClick}
      className={`px - 4 py - 2 font - semibold rounded - t - lg transition - colors ${active
        ? 'bg-red-600 text-white border-b-2 border-red-700'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } `}
    >
      {children}
    </button>
  )

  return (
    <>


      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
        <div className="text-center mb-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Descargar de YouTube
          </h2>
          <p className="text-gray-600">
            Pega el enlace del video de YouTube
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError(null)
                setVideoInfo(null)
              }}
              placeholder="https://www.youtube.com/watch?v=abc123 o https://youtu.be/abc123"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar Video
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
          <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800">¡Video listo para descargar!</h3>
              </div>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
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
                <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">{videoInfo.title}</h4>

                <div className="text-xs text-gray-600 space-y-2">
                  {videoInfo.channel && (
                    <p className="flex items-center">
                      <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {videoInfo.channel}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <p className="flex items-center">
                      <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ⏱️ {formatDuration(videoInfo.duration)}
                    </p>

                    {videoInfo.viewCount && (
                      <p className="flex items-center">
                        <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {formatViewCount(videoInfo.viewCount)}
                      </p>
                    )}
                  </div>

                  <p className="text-green-600 font-medium">
                    ✅ {availableQualities.length} calidades disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE AUDIO */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4"># Descargar Solo Audio</h4>
              <div className="flex flex-col items-center">
                {downloading?.startsWith('audio-') ? (
                  <div className="w-full max-w-md">
                    <ProgressBar progress={downloadProgress} quality="Audio" details={downloadDetails} />
                  </div>
                ) : (
                  <button
                    onClick={handleAudioDownload}
                    disabled={!!downloading}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Descargar Audio (MP3/M4A)
                  </button>
                )}
              </div>
            </div>

            {/* PESTAÑAS DE VIDEO */}
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-4">## Descargar Video</h4>

              {/* NAVEGACIÓN DE PESTAÑAS */}
              <div className="flex space-x-2 mb-6 border-b">
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
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 text-orange-800">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Solo Video (Sin Audio)</span>
                    </div>
                    <p className="text-orange-700 text-sm mt-2">
                      Descarga solo el video sin audio. Útil si quieres el video original sin procesar.
                    </p>
                  </div>

                  {/* MOBILE: Simplified Layout - Only Quality + Action */}
                  <div className="block md:hidden space-y-2">
                    {predefinedQualities.map((quality) => {
                      const isAvailable = isQualityAvailable(quality.value)
                      const isDownloading = downloading === `simple-${quality.value}`
                      const formatInfo = getFormatInfo(quality.value, true)

                      return (
                        <div key={quality.value} className={`flex items-center gap-3 border rounded-lg p-3 ${isAvailable ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'} `}>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{quality.label}</p>
                            {!isAvailable && <p className="text-xs text-red-500">No disponible</p>}
                          </div>

                          {isDownloading ? (
                            <div className="flex flex-col items-end min-w-[130px]">
                              <div className="w-28 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 transition-all duration-300"
                                  style={{ width: `${Math.min(Math.max(downloadProgress, 0), 100)}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-blue-600 font-bold mt-1">
                                {Math.round(downloadProgress)}%
                              </span>
                              {downloadDetails && (
                                <span className="text-[9px] text-gray-500 text-right truncate max-w-[130px]">
                                  {downloadDetails}
                                </span>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSimpleDownload(quality.value, quality.ext || 'mp4')}
                              disabled={!isAvailable || downloading !== null}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${isAvailable && !downloading
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">File type</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Format</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Peso</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predefinedQualities.map((quality) => {
                          const isAvailable = isQualityAvailable(quality.value)
                          const isDownloading = downloading === `simple-${quality.value}`
                          const formatInfo = getFormatInfo(quality.value, true)

                          return (
                            <tr key={quality.value} className={`hover:bg-gray-50 ${!isAvailable ? 'opacity-50' : ''}`}>
                              <td className="border border-gray-300 px-4 py-3 text-gray-800 font-medium">
                                {quality.label}
                                {!isAvailable && (
                                  <span className="text-xs text-red-500 ml-2">(No disponible)</span>
                                )}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-gray-600">
                                <div className="flex items-center">
                                  {formatInfo.type}
                                  {formatInfo.hasAudio && (
                                    <span className="ml-2 text-green-600" title="Incluye audio">🎵</span>
                                  )}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-gray-600">
                                {formatInfo.size}
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                {isDownloading ? (
                                  <div className="w-full">
                                    <ProgressBar progress={downloadProgress} quality={quality.value} details={downloadDetails} />
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleSimpleDownload(quality.value, quality.ext || 'mp4')}
                                    disabled={!isAvailable || downloading !== null}
                                    className={`py-2 px-4 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center w-full ${isAvailable && !downloading
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                    <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-300 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center space-x-3 text-emerald-800">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                          👑
                        </div>
                        <div>
                          <p className="font-bold text-sm text-emerald-900">Membresía PRO Activa ({plan.toUpperCase()})</p>
                          <p className="text-xs text-emerald-700">Tienes acceso ilimitado a descargas combinadas en 1080p, 2K y 4K con FFmpeg acelerado.</p>
                        </div>
                      </div>
                      <Link
                        href="/planes"
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-200/60 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
                      >
                        Gestionar Plan
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center space-x-3 text-amber-900">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl shrink-0">
                          ✨
                        </div>
                        <div>
                          <p className="font-bold text-sm text-amber-900">Descargas Gratis hasta 720p HD</p>
                          <p className="text-xs text-amber-700">Las calidades 1080p Full HD, 2K y 4K con audio integrado requieren el Plan PRO.</p>
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
                  <div className={isNative ? 'block' : 'block md:hidden space-y-2'}>
                    {predefinedQualities.map((quality) => {
                      const isAvailable = isQualityAvailable(quality.value)
                      const isDownloading = downloading === `combined-${quality.value}`
                      const isProTier = isProQuality(quality.value)
                      const isLocked = isProTier && !isPro

                      return (
                        <div key={quality.value} className={`flex items-center gap-3 border rounded-lg p-3 ${isAvailable ? (isProTier ? 'border-amber-200 bg-amber-50/30' : 'border-gray-300 bg-white') : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{quality.label}</p>
                              {isProTier && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                  👑 PRO
                                </span>
                              )}
                              {!isProTier && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                                  Gratis
                                </span>
                              )}
                            </div>
                            {!isAvailable && <p className="text-xs text-red-500">No disponible para este video</p>}
                            {isAvailable && isLocked && (
                              <p className="text-xs text-amber-700 font-medium mt-0.5">🔒 Requiere Plan PRO</p>
                            )}
                          </div>

                          {isDownloading ? (
                            <div className="flex flex-col items-end min-w-[140px]">
                              <div className="w-28 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300"
                                  style={{ width: `${Math.min(Math.max(downloadProgress, 0), 100)}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-green-700 font-bold mt-1">
                                {Math.round(downloadProgress)}%
                              </span>
                              {downloadDetails && (
                                <span className="text-[9px] text-gray-500 font-medium text-right max-w-[140px] truncate">
                                  {downloadDetails}
                                </span>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (isLocked) {
                                  setTargetProQuality(quality.value)
                                  setIsProModalOpen(true)
                                } else {
                                  downloadCombined(quality.value)
                                }
                              }}
                              disabled={!isAvailable || !!downloading}
                              className={`px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition-all shadow-sm ${
                                !isAvailable
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                                ? '⚡ Descargar PRO'
                                : 'Descargar Gratis'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* DESKTOP: Table Layout */}
                  <div className={isNative ? 'hidden' : 'hidden md:block overflow-x-auto'}>
                    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Resolución</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Formato</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Nivel / Acceso</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predefinedQualities.map((quality) => {
                          const isAvailable = isQualityAvailable(quality.value)
                          const isDownloading = downloading === `combined-${quality.value}`
                          const isProTier = isProQuality(quality.value)
                          const isLocked = isProTier && !isPro

                          return (
                            <tr key={quality.value} className={`hover:bg-gray-50 ${!isAvailable ? 'opacity-50' : isProTier ? 'bg-amber-50/20' : ''}`}>
                              <td className="border border-gray-300 px-4 py-3 text-gray-800 font-medium">
                                <div className="flex items-center gap-2">
                                  <span>{quality.label}</span>
                                  {isProTier && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                      👑 PRO
                                    </span>
                                  )}
                                  {!isProTier && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700">
                                      Gratis
                                    </span>
                                  )}
                                  {!isAvailable && (
                                    <span className="text-xs text-red-500 ml-1">(No disponible)</span>
                                  )}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-xs">MP4</span>
                                  <span className="text-green-600 text-xs font-medium" title="Audio y video combinados">
                                    🔊 Video + Audio
                                  </span>
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-gray-600 text-xs">
                                {isLocked ? (
                                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                                    🔒 Requiere Plan PRO
                                  </span>
                                ) : isProTier ? (
                                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                    ✨ PRO Desbloqueado
                                  </span>
                                ) : (
                                  <span className="text-gray-600">
                                    100% Libre / Sin límites
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                {isDownloading ? (
                                  <div className="w-full">
                                    <ProgressBar progress={downloadProgress} quality={quality.value} details={downloadDetails} />
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (isLocked) {
                                        setTargetProQuality(quality.value)
                                        setIsProModalOpen(true)
                                      } else {
                                        downloadCombined(quality.value)
                                      }
                                    }}
                                    disabled={!isAvailable || !!downloading}
                                    className={`py-2 px-4 rounded-lg font-bold transition-all text-xs flex items-center justify-center w-full shadow-sm ${
                                      !isAvailable
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm font-semibold text-red-800">
              Ejemplos de YouTube:
            </p>
          </div>
          <div className="text-xs text-red-700 space-y-1 break-all">
            <div className="font-mono">• https://www.youtube.com/watch?v=dQw4w9WgXcQ</div>
            <div className="font-mono">• https://youtu.be/dQw4w9WgXcQ</div>
            <div className="font-mono">• https://www.youtube.com/embed/dQw4w9WgXcQ</div>
          </div>
        </div>

        {/* CONSEJOS */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>💡 <strong>Consejo:</strong> Para videos largos o alta calidad, prueba con 720p o 480p para mejor rendimiento.</span>
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
    </>
  )
}