'use client'

import { useState } from 'react'

import { getFacebookInfo, FacebookVideoInfo } from '@/lib/platforms/facebook';
import { formatBytes } from '@/lib/utils';
import { usePlatform } from '@/hooks/usePlatform';
import { useNotifications } from '@/hooks/useNotifications';
import { useDownloadHistory } from '@/hooks/useDownloadHistory';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Media } from '@capacitor-community/media'
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { useAdMobRewarded } from '@/hooks/useAdMobRewarded';

interface VideoFormat {
  quality: string
  format: string
  resolution: string
  size: string
  url: string
  hasAudio?: boolean
  hasVideo?: boolean
}

// Opciones de calidad con IDs únicos
const facebookQualities = [
  { id: 'hd-1080p', label: 'HD (1080p) .mp4', value: 'HD', ext: 'mp4' },
  { id: 'dash-896p', label: 'DASH Video (896p) .mp4', value: 'DASH_896', ext: 'mp4' },
  { id: 'dash-768p', label: 'DASH Video (768p) .mp4', value: 'DASH_768', ext: 'mp4' },
  { id: 'dash-640p', label: 'DASH Video (640p) .mp4', value: 'DASH_640', ext: 'mp4' },
  { id: 'sd-480p', label: 'SD (480p) .mp4', value: 'SD', ext: 'mp4' },
  { id: 'audio-only', label: 'Audio Only .m4a', value: 'DASH audio', ext: 'm4a' }
]

export default function FacebookDownloader() {
  const { isNative } = usePlatform()
  const { scheduleNotification } = useNotifications()
  const { addToHistory } = useDownloadHistory()
  const { showRewarded } = useAdMobRewarded()
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInfo, setVideoInfo] = useState<FacebookVideoInfo | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const [originalUrl, setOriginalUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
      setError('Por favor, ingresa un enlace válido de Facebook')
      return
    }

    setIsLoading(true)
    setError(null)
    setVideoInfo(null)
    setDownloadProgress(0)

    try {
      const data = await getFacebookInfo(url)
      setVideoInfo(data)
      setOriginalUrl(url);
      setUrl('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el video')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ FUNCIÓN PARA DESCARGAR VIDEO CON PROXY
  const handleVideoDownload = async (qualityId: string, qualityValue: string, fileExt: string = 'mp4') => {
    // 📺 ANUNCIO BONIFICADO
    showRewarded(async () => {
      try {
        setDownloading(qualityId)
        setDownloadProgress(0)

        console.log('🎬 Iniciando descarga con proxy...', qualityValue)

        // Encontrar el formato específico
        const format = findFormatForQuality(qualityValue)

        if (!format || !format.url) {
          setError(`No se encontró la calidad ${qualityValue} disponible`)
          return
        }

        const filename = `facebook_${qualityValue.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`

        // Usar proxy para descarga
        await downloadWithProxy(format.url, filename, qualityValue)

      } catch (error) {
        console.error('❌ Error en descarga de video:', error)
        setError(`Error al descargar ${qualityValue}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      } finally {
        setDownloading(null)
        setDownloadProgress(0)
      }
    });
  }

  // ✅ FUNCIÓN PARA DESCARGAR AUDIO CON PROXY
  const handleAudioDownload = async () => {
    // 📺 ANUNCIO BONIFICADO - Audio también paga 😉
    showRewarded(async () => {
      try {
        setDownloading('audio-only')
        setDownloadProgress(0)

        console.log('🎵 Iniciando descarga de audio con proxy...')

        // Buscar formato de audio
        const audioFormat = findBestAudioFormat()
        if (audioFormat && audioFormat.url) {
          const filename = `facebook_audio_${Date.now()}.m4a`
          await downloadWithProxy(audioFormat.url, filename, 'audio')
        } else {
          throw new Error('No se encontró formato de audio disponible')
        }

      } catch (error) {
        console.error('❌ Error en descarga de audio:', error)
        setError(`Error al descargar audio: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      } finally {
        setDownloading(null)
        setDownloadProgress(0)
      }
    });
  }

  // ✅ FUNCIÓN PRINCIPAL QUE USA EL PROXY (SIN NUEVAS PESTAÑAS)
  const downloadWithProxy = async (downloadUrl: string, filename: string, quality: string) => {
    try {
      setDownloadProgress(0)

      console.log('⬇️ Iniciando descarga mediante proxy...', {
        quality,
        filename
      })

      if (isNative) {
        try {
          const status = await Filesystem.checkPermissions();
          if (status.publicStorage !== 'granted') {
            const request = await Filesystem.requestPermissions();
            if (request.publicStorage !== 'granted') throw new Error('Permiso denegado');
          }
        } catch (e) {
          console.error('Error storage permissions:', e);
        }
      }

      // Simular progreso inicial
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval)
            return 80
          }
          return prev + 5
        })
      }, 500)

      // Llamar al proxy de Facebook
      const isAudio = quality === 'audio'; // ✅ Definir isAudio
      const response = await fetch('/api/download/facebook/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: downloadUrl,
          filename: filename,
          isAudio: isAudio, // ✅ Identificar si es audio
          thumbnailUrl: isAudio ? null : videoInfo?.thumbnail // ⚠️ No enviar thumb en audio para evitar timeout en proxy
        })
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorText = await response.text();
        let errorDetail = 'Error desconocido';

        try {
          const errorData = JSON.parse(errorText);
          errorDetail = errorData.error || errorText;
        } catch {
          errorDetail = errorText;
        }

        throw new Error(errorDetail || `Error ${response.status}`)
      }

      // Verificar que la respuesta tenga contenido
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        throw new Error('El archivo recibido está vacío');
      }

      const blob = await response.blob()

      if (blob.size === 0) {
        throw new Error('El archivo recibido está vacío')
      }

      console.log('✅ Descarga exitosa mediante proxy:', {
        size: blob.size,
        type: blob.type
      })

      if (isNative) {
        // 📱 NATIVE: Usar Chunked Write para Facebook
        try {
          console.log(`💾 FB: Iniciando guardado por chunks de ${formatBytes(blob.size)}...`);

          const baseFolder = 'Download/FTYdownloaderPro/download';
          const typeFolder = isAudio ? 'FTYdownloaderPro Audio' : 'FTYdownloaderPro Video';
          const finalPath = `${baseFolder}/${typeFolder}/${filename}`;

          // Asegurar directorio
          try {
            await Filesystem.mkdir({
              path: `${baseFolder}/${typeFolder}`,
              directory: Directory.ExternalStorage,
              recursive: true
            });
          } catch (e) { }

          // Helper blobToBase64
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

          const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB chunks
          const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);

          try {
            await Filesystem.deleteFile({ path: finalPath, directory: Directory.ExternalStorage });
          } catch (e) { }

          for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, blob.size);
            const chunk = blob.slice(start, end);
            const base64Chunk = await blobToBase64(chunk);

            if (i === 0) {
              await Filesystem.writeFile({ path: finalPath, data: base64Chunk, directory: Directory.ExternalStorage });
            } else {
              await Filesystem.appendFile({ path: finalPath, data: base64Chunk, directory: Directory.ExternalStorage });
            }

            // Progreso real de escritura (opcional, pero ayuda visualmente)
            const writeProgress = Math.round(((i + 1) / totalChunks) * 100);
            setDownloadProgress(writeProgress);

            if (i % 5 === 0) console.log(`💾 FB Chunk ${i + 1}/${totalChunks}`);
          }

          const uriResult = await Filesystem.getUri({ path: finalPath, directory: Directory.ExternalStorage });

          console.log('✅ FB Guardado en:', uriResult.uri);
          scheduleNotification('Descarga Completada', `Guardado en ${typeFolder}/${filename}`);

          if (isNative) {
            await Toast.show({
              text: '✅ Descarga completada correctamente',
              duration: 'short',
              position: 'bottom'
            });
          }

          addToHistory({
            title: videoInfo?.title || filename,
            platform: 'facebook',
            thumbnail: videoInfo?.thumbnail || '',  // ✅ Miniatura correcta
            originalUrl: url,
            status: 'completed',
            format: quality,
            fileSize: formatBytes(blob.size),
            duration: videoInfo?.duration ? String(videoInfo.duration) : undefined,
            filePath: uriResult.uri, // ✅ URI REAL para playback
            mimeType: isAudio ? 'audio/mp4' : 'video/mp4'
          });

          // Limpieza
          setTimeout(() => {
            setDownloading(null);
            setDownloadProgress(0);
          }, 2000);

        } catch (error: any) {
          console.error('Error guardando FB nativo:', error);
          await Dialog.alert({
            title: 'Error al Guardar',
            message: `No se pudo guardar el archivo.\n${error.message}`
          });
          setDownloading(null);
          setDownloadProgress(0);
        }

      } else {
        // 🌐 WEB
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        link.style.display = 'none'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)

        // WEB Notification & History
        scheduleNotification('Descarga Completada', `El video ${filename} se ha guardado correctamente.`)
        addToHistory({
          title: filename,
          platform: 'facebook',
          thumbnail: '',
          originalUrl: url,
          status: 'completed',
          format: quality,
          fileSize: formatBytes(blob.size),
          duration: undefined,
        })
      }

      // Limpieza general
      setTimeout(() => {
        setDownloading(null)
        setDownloadProgress(0)
      }, 5000)

    } catch (error) {
      console.error('❌ Error en descarga con proxy:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido en la descarga')
      setDownloading(null)
      setDownloadProgress(0)
    }
  }

  // ✅ FUNCIONES AUXILIARES
  const findFormatForQuality = (quality: string): VideoFormat | null => {
    if (!videoInfo?.formats) return null

    const validFormats = videoInfo.formats.filter(format =>
      format.url && format.url.startsWith('http')
    )

    // Mapeo de calidades a patrones de búsqueda
    const qualityPatterns: { [key: string]: string[] } = {
      'HD': ['hd', '1080p', '1920x1080'],
      'DASH_896': ['896', '896x', '896p'],
      'DASH_768': ['768', '768x', '768p'],
      'DASH_640': ['640', '640x', '640p'],
      'SD': ['sd', '480p', '640x480'],
      'DASH audio': ['audio', 'm4a', 'dash audio']
    }

    const patterns = qualityPatterns[quality] || [quality.toLowerCase()]

    // Buscar formato que coincida con los patrones
    const foundFormat = validFormats.find(format =>
      patterns.some(pattern =>
        format.quality.toLowerCase().includes(pattern) ||
        format.resolution.toLowerCase().includes(pattern) ||
        format.format.toLowerCase().includes(pattern)
      )
    )

    return foundFormat || null
  }

  const findBestAudioFormat = (): VideoFormat | null => {
    if (!videoInfo?.formats) return null

    const validFormats = videoInfo.formats.filter(format =>
      format.url && format.url.startsWith('http')
    )

    // Log para depuración
    console.log('🔍 Buscando formato de audio entre:', validFormats.map(f => ({ q: f.quality, f: f.format, a: f.hasAudio, v: f.hasVideo })));

    // 1. Intentar encontrar explícitamente audio only
    const audioFormats = validFormats.filter(format =>
      format.quality?.toLowerCase().includes('audio') ||
      format.format?.toLowerCase().includes('audio') ||
      format.resolution?.toLowerCase().includes('audio') ||
      (format.hasAudio === true && format.hasVideo === false)
    )

    if (audioFormats.length > 0) {
      console.log('✅ Formato de audio encontrado:', audioFormats[0]);
      return audioFormats[0];
    }

    // 2. Si no hay "solo audio", buscar cualquiera que parezca ser m4a/mp3 en el format note
    const fallbackAudio = validFormats.find(format =>
      format.format?.toLowerCase().includes('m4a') ||
      format.format?.toLowerCase().includes('mp3')
    );

    if (fallbackAudio) {
      console.log('⚠️ Usando fallback audio:', fallbackAudio);
      return fallbackAudio;
    }

    // 3. Fallback FINAL: Usar el formato mp4 más pequeño disponible (peor es nada) - probablemente sea 240p o SD
    // Ordenar por tamaño aproximado si es posible, o simplemente tomar el último
    console.log('⚠️ Usando Last Resort (formato más pequeño) para audio');
    const sortedByRes = [...validFormats].sort((a, b) => {
      const resA = parseInt(a.resolution?.split('x')[0] || '1000');
      const resB = parseInt(b.resolution?.split('x')[0] || '1000');
      return resA - resB;
    });

    return sortedByRes[0] || validFormats[validFormats.length - 1] || null;
  }



  const isQualityAvailable = (qualityValue: string): boolean => {
    const format = findFormatForQuality(qualityValue)
    return format !== null && format.url !== undefined && format.url.startsWith('http')
  }

  const getFormatInfo = (qualityValue: string): {
    type: string,
    size: string,
    hasAudio: boolean
  } => {
    const format = findFormatForQuality(qualityValue)

    if (!format) return {
      type: 'No disponible',
      size: 'N/A',
      hasAudio: false
    }

    let typeText = 'Video'
    if (format.quality.includes('audio') || !format.hasVideo) {
      typeText = 'Audio'
    } else if (format.hasVideo && !format.hasAudio) {
      typeText = 'Video (sin audio)'
    } else {
      typeText = 'Video + Audio'
    }

    return {
      type: typeText,
      size: format.size || 'N/A',
      hasAudio: format.hasAudio || false
    }
  }

  const ProgressBar = ({ progress, quality }: { progress: number, quality: string }) => (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-600 text-center">
        {progress < 100 ? `Descargando ${quality}: ${progress}%` : '✅ Descarga completada'}
      </div>
    </div>
  )

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M vistas`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K vistas`
    }
    return `${count} vistas`
  }

  const availableQualities = facebookQualities.filter(quality =>
    isQualityAvailable(quality.value)
  )



  return (
    <>


      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Descargar de Facebook
          </h2>
          <p className="text-gray-600">
            Pega el enlace del video de Facebook
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
              placeholder="https://www.facebook.com/watch/?v=123456 o https://fb.watch/abc123"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center"
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
                {videoInfo.method || 'facebook'}
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
                  {videoInfo.uploader && (
                    <p className="flex items-center">
                      <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {videoInfo.uploader}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <p className="flex items-center">
                      <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ⏱️ {formatDuration(videoInfo.duration)}
                    </p>

                    {videoInfo.view_count && (
                      <p className="flex items-center">
                        <svg className="h-3 w-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {formatViewCount(videoInfo.view_count)}
                      </p>
                    )}
                  </div>

                  <p className="text-green-600 font-medium">
                    ✅ {availableQualities.length} formatos disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* BOTÓN DE AUDIO SEPARADO */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4"># Audio</h4>
              <div className="flex flex-col items-center">
                {downloading === 'audio-only' ? (
                  <div className="w-full max-w-md">
                    <ProgressBar progress={downloadProgress} quality="Audio" />
                  </div>
                ) : (
                  <button
                    onClick={handleAudioDownload}
                    disabled={!!downloading || !isQualityAvailable('DASH audio')}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Descargar Audio (M4A)
                  </button>
                )}
              </div>
            </div>

            {/* FORMATOS DE VIDEO */}
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-4">## Video</h4>
              <p className="text-gray-600 mb-4">- Calidades Disponibles</p>

              {/* MOBILE: Simplified Layout - Quality + Action */}
              <div className={isNative ? 'block' : 'block md:hidden space-y-2'}>
                {facebookQualities
                  .filter(q => q.id !== 'audio-only')
                  .map((quality) => {
                    const isAvailable = isQualityAvailable(quality.value)
                    const isDownloading = downloading === quality.id

                    return (
                      <div key={quality.id} className={`flex items-center gap-3 border rounded-lg p-3 ${isAvailable ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                        {/* Quality Label */}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{quality.label}</p>
                          {!isAvailable && <p className="text-xs text-red-500">No disponible</p>}
                        </div>

                        {/* Action Button */}
                        {isDownloading ? (
                          <div className="w-24 text-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto" />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleVideoDownload(quality.id, quality.value, quality.ext)}
                            disabled={!isAvailable || !!downloading}
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
              <div className={isNative ? 'hidden' : 'hidden md:block overflow-x-auto'}>
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Calidad</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Formato</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Peso</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facebookQualities
                      .filter(q => q.id !== 'audio-only')
                      .map((quality) => {
                        const isAvailable = isQualityAvailable(quality.value)
                        const isDownloading = downloading === quality.id
                        const formatInfo = getFormatInfo(quality.value)

                        return (
                          <tr key={quality.id} className={`hover:bg-gray-50 ${!isAvailable ? 'opacity-50' : ''}`}>
                            <td className="border border-gray-300 px-4 py-3 text-gray-800 font-medium">
                              {quality.label}
                              {!isAvailable && (
                                <span className="text-xs text-red-500 ml-2">(No disponible)</span>
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">
                              {quality.ext.toUpperCase()}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">
                              {formatInfo.type}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">
                              {formatInfo.size}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              {isDownloading ? (
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleVideoDownload(quality.id, quality.value, quality.ext)}
                                  disabled={!isAvailable || !!downloading}
                                  className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors ${isAvailable && !downloading
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                  {isAvailable ? 'Descargar' : 'No disponible'}
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
          </div>
        )}


        {/* SECCIÓN DE EJEMPLOS */}
        < div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200" >
          <div className="flex items-center space-x-2 mb-2">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm font-semibold text-blue-800">
              Ejemplos de Facebook:
            </p>
          </div>
          <div className="text-xs text-blue-700 space-y-1 break-all">
            <div className="font-mono">• https://www.facebook.com/watch/?v=123456789</div>
            <div className="font-mono">• https://fb.watch/abc123def/</div>
            <div className="font-mono">• https://www.facebook.com/username/videos/123456789</div>
          </div>
        </div >

        {/* INFORMACIÓN ADICIONAL */}
        < div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200" >
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Formatos soportados: MP4, M4A. Calidades desde 480p hasta 1080p y DASH</span>
          </div>
        </div >
      </div >
    </>
  )
}