'use client'

import { useState, useEffect } from 'react'
import { formatBytes } from '@/lib/utils'
import { usePlatform } from '@/hooks/usePlatform'
import { useNotifications } from '@/hooks/useNotifications'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Media } from '@capacitor-community/media'
import { Dialog } from '@capacitor/dialog'
import { Toast } from '@capacitor/toast'
import { useAdMobRewarded } from '@/hooks/useAdMobRewarded'
import { Sparkles, Download, Music, Film, AlertCircle, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface MediaFormat {
  quality: string
  format: string
  url: string
  size?: string
  isAudio?: boolean
  hasAudio?: boolean
  hasVideo?: boolean
}

interface TwitterResponse {
  status: string
  title: string
  thumbnail: string
  duration: number
  uploader: string
  formats: MediaFormat[]
}

export interface DownloaderProps {
  initialUrl?: string
  autoSearch?: boolean
}

export default function TwitterDownloader({ initialUrl, autoSearch }: DownloaderProps = {}) {
  const { t } = useI18n()
  const { isNative } = usePlatform()
  const { scheduleNotification } = useNotifications()
  const { addToHistory } = useDownloadHistory()
  const { showRewarded } = useAdMobRewarded()

  const [url, setUrl] = useState(initialUrl || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInfo, setVideoInfo] = useState<TwitterResponse | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadDetails, setDownloadDetails] = useState('')

  const isValidTwitterUrl = (inputUrl: string) => {
    return inputUrl.includes('twitter.com') || inputUrl.includes('x.com')
  }

  const processUrl = async (urlToFetch: string) => {
    if (!isValidTwitterUrl(urlToFetch)) {
      setError('Por favor, ingresa un enlace válido de Twitter o X (ej. x.com/usuario/status/...)')
      return
    }

    setIsLoading(true)
    setError(null)
    setVideoInfo(null)

    try {
      const response = await fetch('/api/download/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToFetch })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el video de Twitter / X')
      }

      if (data.status === 'success' && data.formats?.length > 0) {
        setVideoInfo(data)
      } else {
        throw new Error(data.message || 'No se encontraron formatos de video')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el enlace de Twitter / X')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    processUrl(url)
  }

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl)
      if (autoSearch) {
        processUrl(initialUrl)
      }
    }
  }, [initialUrl, autoSearch])

  const readStreamWithProgress = async (
    response: Response,
    defaultType: string
  ): Promise<Blob> => {
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
        setDownloadProgress(Math.min(progress, 99))
        const remainingBytes = Math.max(total - loaded, 0)
        const etaSec = speedBps > 0 ? Math.round(remainingBytes / speedBps) : 0
        const etaText = etaSec > 0 ? `ETA: ${Math.floor(etaSec / 60)}:${String(etaSec % 60).padStart(2, '0')}` : ''
        setDownloadDetails(`${speedText} • ${formatBytes(loaded)} / ${formatBytes(total)} ${etaText ? '• ' + etaText : ''}`)
      } else {
        setDownloadProgress((prev) => Math.min(prev + 2, 95))
        setDownloadDetails(`${speedText} • ${formatBytes(loaded)} transferidos`)
      }
    }

    setDownloadProgress(100)
    setDownloadDetails('Guardando archivo...')
    return new Blob(chunks as any, { type: response.headers.get('Content-Type') || defaultType })
  }

  const handleDownload = async (format: MediaFormat) => {
    showRewarded(async () => {
      try {
        setDownloading(format.quality)
        setDownloadProgress(1)
        setDownloadDetails('Conectando al servidor...')

        if (isNative) {
          try {
            const status = await Filesystem.checkPermissions();
            if (status.publicStorage !== 'granted') await Filesystem.requestPermissions();
          } catch (e) {
            console.error('Storage perm error', e);
          }
        }

        const ext = format.isAudio ? 'm4a' : 'mp4'
        const filename = `twitter_${Date.now()}.${ext}`

        console.log('🚀 Iniciando descarga de Twitter / X con Proxy...', { filename });
        const response = await fetch('/api/download/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: format.url,
            filename,
            isAudio: format.isAudio,
            quality: format.quality,
            thumbnailUrl: videoInfo?.thumbnail
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          let errorMessage = errText || response.statusText;
          let fallbackUrl = format.url;

          try {
            const errData = JSON.parse(errText);
            errorMessage = errData.error || errorMessage;
            if (errData.fallback_url) fallbackUrl = errData.fallback_url;
          } catch {}

          // Fallback para navegador web si el proxy de servidor es bloqueado por IP del CDN
          if (!isNative && fallbackUrl && fallbackUrl.startsWith('http')) {
            console.warn('⚠️ Proxy falló, activando enlace directo de respaldo...', { fallbackUrl });
            setDownloadDetails('Descargando enlace directo...');
            const a = document.createElement('a');
            a.href = fallbackUrl;
            a.download = filename;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            addToHistory({
              title: videoInfo?.title || 'Video de Twitter / X',
              platform: 'twitter',
              thumbnail: videoInfo?.thumbnail || '',
              originalUrl: url,
              status: 'completed',
              format: format.quality,
              fileSize: format.size || 'HD',
              mimeType: 'video/mp4'
            });
            return;
          }

          throw new Error(errorMessage);
        }

        const blob = await readStreamWithProgress(response, format.isAudio ? 'audio/mp4' : 'video/mp4')

        if (isNative) {
          try {
            const baseFolder = 'Download/FTYdownloaderPro/download';
            const typeFolder = format.isAudio ? 'FTYdownloaderPro Audio' : 'FTYdownloaderPro Video';
            const finalPath = `${baseFolder}/${typeFolder}/${filename}`;

            try {
              await Filesystem.mkdir({
                path: `${baseFolder}/${typeFolder}`,
                directory: Directory.ExternalStorage,
                recursive: true
              });
            } catch { }

            const blobToBase64 = (b: Blob): Promise<string> => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const res = reader.result as string;
                  resolve(res.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(b);
              });
            };

            const CHUNK_SIZE = 1024 * 1024 * 5;
            const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);

            try {
              await Filesystem.deleteFile({ path: finalPath, directory: Directory.ExternalStorage });
            } catch { }

            for (let i = 0; i < totalChunks; i++) {
              const start = i * CHUNK_SIZE;
              const end = Math.min(start + CHUNK_SIZE, blob.size);
              const chunk = blob.slice(start, end);
              const base64Chunk = await blobToBase64(chunk);

              await Filesystem.appendFile({
                path: finalPath,
                data: base64Chunk,
                directory: Directory.ExternalStorage
              });
            }

            if (!format.isAudio) {
              try {
                const fullUri = await Filesystem.getUri({
                  path: finalPath,
                  directory: Directory.ExternalStorage
                });
                await Media.saveVideo({ path: fullUri.uri });
              } catch (mediaErr) {
                console.warn('Media save warning:', mediaErr);
              }
            }

            await scheduleNotification(
              '¡Descarga completada!',
              `Tu archivo ${filename} se guardó en la carpeta de descargas`
            );

            await Toast.show({
              text: '¡Video de Twitter / X guardado con éxito!',
              duration: 'long'
            });

          } catch (nativeErr: any) {
            console.error('Error guardando en nativo:', nativeErr);
            throw new Error(`Error al guardar en el dispositivo: ${nativeErr.message}`);
          }
        } else {
          // Web
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }

        addToHistory({
          title: videoInfo?.title || 'Video de Twitter / X',
          platform: 'twitter',
          thumbnail: videoInfo?.thumbnail || '',
          originalUrl: url,
          status: 'completed',
          format: format.quality,
          fileSize: formatBytes(blob.size),
          mimeType: 'video/mp4'
        });

      } catch (err: any) {
        console.error('Error durante la descarga:', err);
        setError(err.message || 'Error al descargar el archivo');
      } finally {
        setDownloading(null);
        setDownloadProgress(0);
        setDownloadDetails('');
      }
    });
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      // Sin permisos
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulario de entrada */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.downloader.placeholderTwitter}
            className="w-full px-4 py-3.5 pl-11 pr-24 rounded-xl border border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 shadow-sm font-medium"
            required
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-800 dark:text-white font-black text-lg select-none">
            𝕏
          </div>
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-slate-200 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors border border-gray-200 dark:border-slate-600 cursor-pointer"
          >
            {t.downloader.pasteBtn}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-black/20 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t.downloader.searchingBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{t.downloader.searchBtn}</span>
            </>
          )}
        </button>
      </form>

      {/* Alerta de Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Información del Tweet y Opciones de Formato */}
      {videoInfo && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden transition-all">
          <div className="p-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="relative w-40 h-28 sm:w-52 sm:h-36 rounded-2xl overflow-hidden shadow-md shrink-0 bg-gray-100 group">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (videoInfo.thumbnail && !target.src.includes('/api/download/proxy/image')) {
                    target.src = `/api/download/proxy/image?url=${encodeURIComponent(videoInfo.thumbnail)}`;
                  }
                }}
              />
              <div className="absolute top-2 right-2 bg-black/85 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow">
                𝕏 Video
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <h3 className="font-extrabold text-gray-900 line-clamp-2 text-base sm:text-lg leading-snug">
                  {videoInfo.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-black inline-block" />
                  Publicado por @{videoInfo.uploader}
                </p>
              </div>

              {/* Barra de progreso de descarga en tiempo real */}
              {downloading && (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl shadow-sm space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-800">
                    <span className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                      <span>Descargando: {downloading}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black text-white font-extrabold text-xs shadow-sm">
                      {downloadProgress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="bg-black h-full rounded-full transition-all duration-300 ease-out shadow"
                      style={{ width: `${Math.max(downloadProgress, 3)}%` }}
                    />
                  </div>

                  {downloadDetails && (
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1 text-black font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Transfiriendo medios...
                      </span>
                      <span>{downloadDetails}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Lista de Calidades y Formatos Disponibles */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider pb-1">
                  <span>Formatos disponibles</span>
                  <span>{videoInfo.formats.length} opciones</span>
                </div>

                {videoInfo.formats.map((fmt, idx) => {
                  const isCurrentDownloading = downloading === fmt.quality;
                  const isAudio = !!fmt.isAudio;
                  const isMute = fmt.hasAudio === false && !isAudio;

                  return (
                    <div
                      key={idx}
                      className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrentDownloading
                          ? 'border-black bg-neutral-100 ring-2 ring-black/10'
                          : 'border-gray-200/80 bg-white hover:border-neutral-400 hover:shadow-sm'
                      }`}
                    >
                      {/* Información de calidad y tipo */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                            isAudio
                              ? 'bg-neutral-800 text-white'
                              : isMute
                              ? 'bg-orange-500 text-white'
                              : 'bg-black text-white'
                          }`}
                        >
                          {isAudio ? (
                            <Music className="w-5 h-5" />
                          ) : isMute ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Film className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-gray-900 text-sm sm:text-base">
                              {fmt.quality}
                            </span>

                            {/* Badge oficial de Audio/Video */}
                            {isAudio ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300">
                                <Music className="w-3 h-3 text-neutral-600" />
                                <span>Solo Audio</span>
                              </span>
                            ) : isMute ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                <VolumeX className="w-3 h-3 text-orange-600" />
                                <span>Solo Video (Sin audio)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Volume2 className="w-3 h-3 text-emerald-600" />
                                <span>Video + Audio</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                            <span className="uppercase tracking-wide font-semibold text-gray-600">
                              .{fmt.format?.toUpperCase() || 'MP4'}
                            </span>
                            {fmt.size && (
                              <>
                                <span>•</span>
                                <span>{fmt.size}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botón de acción */}
                      <button
                        onClick={() => handleDownload(fmt)}
                        disabled={!!downloading}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-200 shrink-0 shadow-sm ${
                          isCurrentDownloading
                            ? 'bg-black text-white cursor-wait opacity-90'
                            : downloading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : 'bg-black hover:bg-neutral-800 text-white active:scale-95'
                        }`}
                      >
                        {isCurrentDownloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Descargando...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Descargar</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
