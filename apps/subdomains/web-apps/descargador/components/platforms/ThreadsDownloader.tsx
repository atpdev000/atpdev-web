'use client'

import { useState } from 'react'
import { formatBytes } from '@/lib/utils'
import { usePlatform } from '@/hooks/usePlatform'
import { useNotifications } from '@/hooks/useNotifications'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Media } from '@capacitor-community/media'
import { Dialog } from '@capacitor/dialog'
import { Toast } from '@capacitor/toast'
import { useAdMobRewarded } from '@/hooks/useAdMobRewarded'
import { AtSign, Sparkles, Download, Music, Film, AlertCircle } from 'lucide-react'

interface MediaFormat {
  quality: string
  format: string
  url: string
  size?: string
  isAudio?: boolean
}

interface ThreadsResponse {
  status: string
  title: string
  thumbnail: string
  duration: number
  uploader: string
  formats: MediaFormat[]
}

export default function ThreadsDownloader() {
  const { isNative } = usePlatform()
  const { scheduleNotification } = useNotifications()
  const { addToHistory } = useDownloadHistory()
  const { showRewarded } = useAdMobRewarded()

  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInfo, setVideoInfo] = useState<ThreadsResponse | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadDetails, setDownloadDetails] = useState('')

  const isValidThreadsUrl = (inputUrl: string) => {
    return inputUrl.includes('threads.net')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidThreadsUrl(url)) {
      setError('Por favor, ingresa un enlace válido de Threads (ej. threads.net/@usuario/post/...)')
      return
    }

    setIsLoading(true)
    setError(null)
    setVideoInfo(null)

    try {
      const response = await fetch('/api/download/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el video de Threads')
      }

      if (data.status === 'success' && data.formats?.length > 0) {
        setVideoInfo(data)
        setUrl('')
      } else {
        throw new Error(data.message || 'No se encontraron formatos de video')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el enlace de Threads')
    } finally {
      setIsLoading(false)
    }
  }

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
        setDownloadDetails(`${speedText} ${etaText ? '• ' + etaText : ''}`)
      } else {
        setDownloadProgress((prev) => Math.min(prev + 1, 95))
        setDownloadDetails(`${speedText} • ${formatBytes(loaded)}`)
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
        const filename = `threads_${Date.now()}.${ext}`

        console.log('🚀 Iniciando descarga de Threads con Proxy...', { filename });
        const response = await fetch('/api/download/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: format.url,
            filename,
            isAudio: format.isAudio,
            quality: format.quality
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Error en descarga: ${errText || response.statusText}`);
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
              text: '¡Video de Threads guardado con éxito!',
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
          title: videoInfo?.title || 'Video de Threads',
          platform: 'threads',
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
            placeholder="Pega el enlace del post de Threads aquí..."
            className="w-full px-4 py-3.5 pl-11 pr-24 rounded-xl border border-gray-200 focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all outline-none bg-white text-gray-800 shadow-sm"
            required
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <AtSign className="w-5 h-5 text-zinc-800" />
          </div>
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            Pegar
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-zinc-900 hover:bg-black disabled:opacity-50 transition-all duration-200 shadow-md flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analizando post...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Descargar de Threads</span>
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

      {/* Barra de progreso de descarga en tiempo real */}
      {downloading && (
        <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 animate-pulse" />
              <span>Descargando {downloading}...</span>
            </span>
            <span className="text-zinc-900 font-bold">{downloadProgress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-zinc-900 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>

          {downloadDetails && (
            <p className="text-xs text-gray-600 font-medium text-right">
              {downloadDetails}
            </p>
          )}
        </div>
      )}

      {/* Información del Post y Opciones de Formato */}
      {videoInfo && !downloading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden transition-all">
          <div className="p-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-xl overflow-hidden shadow-md shrink-0 bg-gray-100">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600';
                }}
              />
              <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-semibold">
                Threads
              </div>
            </div>

            <div className="flex-1 w-full text-center sm:text-left space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2 text-lg">
                  {videoInfo.title}
                </h3>
                <p className="text-xs text-zinc-600 font-semibold mt-1">
                  Por @{videoInfo.uploader}
                </p>
              </div>

              {/* Botones de Descarga */}
              <div className="space-y-2 pt-2">
                {videoInfo.formats.map((fmt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDownload(fmt)}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold flex items-center justify-between transition-all duration-200 ${
                      fmt.isAudio
                        ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-300'
                        : 'bg-zinc-900 hover:bg-black text-white shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {fmt.isAudio ? (
                        <Music className="w-4 h-4 text-zinc-700" />
                      ) : (
                        <Film className="w-4 h-4" />
                      )}
                      <span>{fmt.quality}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      {fmt.size && <span className="opacity-80">{fmt.size}</span>}
                      <Download className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
