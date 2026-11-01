'use client'

import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { usePlatform } from '@/hooks/usePlatform'
import { useNotifications } from '@/hooks/useNotifications'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'
import { useAdMobRewarded } from '@/hooks/useAdMobRewarded'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Toast } from '@capacitor/toast'
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  Film, 
  Share2, 
  CheckCircle2, 
  Eye, 
  Smartphone,
  ExternalLink,
  Info,
  Play,
  ShieldCheck,
  Lock
} from 'lucide-react'

interface StatusItem {
  id: string
  name: string
  uri: string
  nativePath?: string
  type: 'image' | 'video'
  size?: string
  date?: string
}

// Muestras demostrativas exclusivamente para navegador web en desktop
const DEMO_STATUSES: StatusItem[] = [
  {
    id: 'demo-1',
    name: 'estado_demo_1.jpg',
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    size: '1.2 MB',
    date: 'Demostración'
  },
  {
    id: 'demo-2',
    name: 'estado_demo_2.jpg',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    size: '850 KB',
    date: 'Demostración'
  }
]

export default function WhatsappStatusDownloader() {
  const { isNative } = usePlatform()
  const { scheduleNotification } = useNotifications()
  const { addToHistory } = useDownloadHistory()
  const { showRewarded } = useAdMobRewarded()

  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>('all')
  const [statuses, setStatuses] = useState<StatusItem[]>([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<StatusItem | null>(null)
  const [hasScanned, setHasScanned] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Rutas conocidas donde WhatsApp y WhatsApp Business almacenan los estados vistos en Android
  const WHATSAPP_PATHS = [
    'Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
    'WhatsApp/Media/.Statuses',
    'Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
    'WhatsApp Business/Media/.Statuses',
    'com.whatsapp/WhatsApp/Media/.Statuses'
  ]

  const requestStoragePermission = async () => {
    try {
      const res = await Filesystem.requestPermissions()
      if (res.publicStorage === 'granted') {
        setPermissionDenied(false)
        await scanStatuses()
      } else {
        setPermissionDenied(true)
      }
    } catch (e) {
      console.warn('Error al solicitar permisos:', e)
    }
  }

  const scanStatuses = async () => {
    setLoading(true)

    if (!isNative) {
      // Simulación fluida solo en navegador web de PC
      setTimeout(() => {
        setStatuses(DEMO_STATUSES)
        setLoading(false)
        setHasScanned(true)
      }, 500)
      return
    }

    // Modo Nativo en Teléfono Android Oficial
    try {
      try {
        const perm = await Filesystem.checkPermissions()
        if (perm.publicStorage !== 'granted') {
          const requested = await Filesystem.requestPermissions()
          if (requested.publicStorage !== 'granted') {
            setPermissionDenied(true)
          }
        } else {
          setPermissionDenied(false)
        }
      } catch (e) {
        console.warn('Permiso storage check warning:', e)
      }

      const discovered: StatusItem[] = []

      for (const basePath of WHATSAPP_PATHS) {
        try {
          const result = await Filesystem.readdir({
            path: basePath,
            directory: Directory.ExternalStorage
          })

          if (result && result.files) {
            for (const file of result.files) {
              const fileName = typeof file === 'string' ? file : file.name
              if (!fileName || fileName.startsWith('.') || fileName === '.nomedia') continue

              const isImg = /\.(jpg|jpeg|png|webp)$/i.test(fileName)
              const isVid = /\.(mp4|3gp|mov|mkv)$/i.test(fileName)

              if (isImg || isVid) {
                const fullRelativePath = `${basePath}/${fileName}`
                
                try {
                  // Obtener URI nativa y convertir a URL compatible con el WebView de Android
                  const uriResult = await Filesystem.getUri({
                    path: fullRelativePath,
                    directory: Directory.ExternalStorage
                  })
                  
                  const webviewUri = Capacitor.convertFileSrc(uriResult.uri)

                  discovered.push({
                    id: `wa-${fileName}`,
                    name: fileName,
                    uri: webviewUri,
                    nativePath: fullRelativePath,
                    type: isImg ? 'image' : 'video',
                    size: isVid ? 'Video' : 'Foto',
                    date: 'Visto hoy'
                  })
                } catch {
                  discovered.push({
                    id: `wa-${fileName}`,
                    name: fileName,
                    uri: fullRelativePath,
                    nativePath: fullRelativePath,
                    type: isImg ? 'image' : 'video',
                    size: isVid ? 'Video' : 'Foto',
                    date: 'Visto hoy'
                  })
                }
              }
            }
          }
        } catch {
          // Directorio no accesible o no existe para esta variante
        }
      }

      // En Android, mostrar únicamente estados REALES encontrados
      setStatuses(discovered)
    } catch (err) {
      console.error('Error escaneando estados reales:', err)
      setStatuses([])
    } finally {
      setLoading(false)
      setHasScanned(true)
    }
  }

  useEffect(() => {
    scanStatuses()
  }, [isNative])

  const handleSaveStatus = async (item: StatusItem) => {
    // 📺 Anuncio de video antes de guardar en galería
    showRewarded(async () => {
      setSavingId(item.id)
      try {
        const destDir = 'Download/FTYdownloaderPro/WhatsApp'
        const destPath = `${destDir}/${item.name}`

        if (isNative) {
          try {
            await Filesystem.mkdir({
              path: destDir,
              directory: Directory.ExternalStorage,
              recursive: true
            })
          } catch {}

          if (item.uri.startsWith('http')) {
            // Descargar vía proxy o fetch directo
            const res = await fetch(item.uri)
            const blob = await res.blob()
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = async () => {
              const base64 = (reader.result as string).split(',')[1]
              await Filesystem.writeFile({
                path: destPath,
                data: base64,
                directory: Directory.ExternalStorage
              })
            }
          } else {
            // Copiar archivo local de WhatsApp a la carpeta de descargas
            await Filesystem.copy({
              from: item.nativePath || item.uri,
              to: destPath,
              directory: Directory.ExternalStorage,
              toDirectory: Directory.ExternalStorage
            })
          }

          try {
            await Toast.show({
              text: '¡Estado guardado en tu galería!',
              duration: 'short',
              position: 'bottom'
            })
          } catch {}

          scheduleNotification(
            '¡Estado Guardado! 🎉',
            `El estado se guardó correctamente en tu galería.`
          )
        } else {
          // Navegador Web: Descarga directa
          const a = document.createElement('a')
          a.href = item.uri
          a.download = item.name
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }

        addToHistory({
          title: item.name,
          platform: 'whatsapp',
          thumbnail: item.uri,
          originalUrl: item.uri,
          status: 'completed',
          format: item.type === 'video' ? 'Video MP4' : 'Foto HD',
          fileSize: item.size || 'HD',
          mimeType: item.type === 'video' ? 'video/mp4' : 'image/jpeg'
        })

      } catch (err) {
        console.error('Error al guardar estado:', err)
      } finally {
        setSavingId(null)
      }
    })
  }

  const handleShare = async (item: StatusItem) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Estado de WhatsApp',
          text: 'Descargado con Descargador Pro',
          url: item.uri
        })
      } catch (e) {
        // Cancelado
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Mira este estado: ' + item.uri)}`, '_blank')
    }
  }

  const filteredStatuses = statuses.filter(s => {
    if (activeTab === 'images') return s.type === 'image'
    if (activeTab === 'videos') return s.type === 'video'
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Encabezado Especial WhatsApp */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">Descargar Estados de WhatsApp</h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-emerald-800 shadow-sm">
                  Exclusivo Móvil
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                Detecta y guarda fotos y videos de estados vistos en tu teléfono en máxima calidad.
              </p>
            </div>
          </div>

          <button
            onClick={scanStatuses}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Buscando...' : 'Actualizar Estados'}</span>
          </button>
        </div>

        {/* Guía rápida de 3 pasos */}
        <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-emerald-50">
          <div className="flex items-start gap-2 bg-black/10 backdrop-blur-sm p-2.5 rounded-xl">
            <span className="w-5 h-5 rounded-full bg-white text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
            <span>Abre WhatsApp y mira los estados de tus contactos.</span>
          </div>
          <div className="flex items-start gap-2 bg-black/10 backdrop-blur-sm p-2.5 rounded-xl">
            <span className="w-5 h-5 rounded-full bg-white text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
            <span>Regresa aquí; se detectarán automáticamente.</span>
          </div>
          <div className="flex items-start gap-2 bg-black/10 backdrop-blur-sm p-2.5 rounded-xl">
            <span className="w-5 h-5 rounded-full bg-white text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
            <span>Toca "Guardar" para tenerlo en tu galería en HD.</span>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas (Fotos vs Videos) */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Todos ({statuses.length})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'images'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Fotos ({statuses.filter(s => s.type === 'image').length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Videos ({statuses.filter(s => s.type === 'video').length})
          </button>
        </div>

        <span className="text-xs text-gray-500 dark:text-slate-400 font-mono hidden sm:inline">
          {filteredStatuses.length} disponibles
        </span>
      </div>

      {/* Cuadrícula de Estados */}
      {filteredStatuses.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredStatuses.map((item) => {
            const isSaving = savingId === item.id

            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Media Preview Box */}
                <div 
                  onClick={() => setSelectedPreview(item)}
                  className="relative aspect-[9/16] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.uri}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <video
                        src={item.uri}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Badges superiores */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                      {item.type === 'image' ? <ImageIcon className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {item.type === 'image' ? 'FOTO' : 'VIDEO'}
                    </span>
                    {item.size && (
                      <span className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white/90 backdrop-blur-md font-mono">
                        {item.size}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSaveStatus(item)}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className={`w-3.5 h-3.5 ${isSaving ? 'animate-bounce' : ''}`} />
                    <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                  </button>

                  <button
                    onClick={() => handleShare(item)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Compartir o repostear"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900/60 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 p-8 shadow-sm">
          {permissionDenied ? (
            <div>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Permiso de Almacenamiento Necesario
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                Para detectar y guardar los estados de WhatsApp en tu galería, la app necesita acceso al almacenamiento del dispositivo.
              </p>
              <button
                onClick={requestStoragePermission}
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                Conceder Permiso de Almacenamiento
              </button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No se detectaron estados recientes
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                Abre WhatsApp en tu teléfono, mira los estados de tus contactos y luego presiona "Actualizar Estados".
              </p>
              
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="whatsapp://"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir WhatsApp
                </a>
                <button
                  onClick={scanStatuses}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar Estados
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Visor de Pantalla Completa */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full max-h-[90vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 flex items-center justify-between text-white border-b border-slate-800">
              <span className="font-bold text-sm truncate">{selectedPreview.name}</span>
              <button
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex items-center justify-center bg-black p-2">
              {selectedPreview.type === 'image' ? (
                <img
                  src={selectedPreview.uri}
                  alt={selectedPreview.name}
                  className="max-h-[70vh] w-auto object-contain rounded-xl"
                />
              ) : (
                <video
                  src={selectedPreview.uri}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-full rounded-xl"
                />
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
              <button
                onClick={() => handleShare(selectedPreview)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
              <button
                onClick={() => {
                  handleSaveStatus(selectedPreview)
                  setSelectedPreview(null)
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Guardar en Galería
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
