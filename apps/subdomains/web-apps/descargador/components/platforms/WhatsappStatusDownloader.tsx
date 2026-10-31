'use client'

import { useState, useEffect } from 'react'
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
  Play
} from 'lucide-react'

interface StatusItem {
  id: string
  name: string
  uri: string
  type: 'image' | 'video'
  size?: string
  date?: string
}

// Muestras demostrativas para navegación web y emulador
const DEMO_STATUSES: StatusItem[] = [
  {
    id: 'demo-1',
    name: 'estado_viaje_montana.jpg',
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    size: '1.2 MB',
    date: 'Hace 15 min'
  },
  {
    id: 'demo-2',
    name: 'estado_playa_sunset.jpg',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    size: '850 KB',
    date: 'Hace 1 hora'
  },
  {
    id: 'demo-3',
    name: 'estado_cafe_manana.jpg',
    uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    size: '920 KB',
    date: 'Hace 3 horas'
  },
  {
    id: 'demo-4',
    name: 'clip_evento_amigos.mp4',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    size: '3.4 MB',
    date: 'Hace 4 horas'
  },
  {
    id: 'demo-5',
    name: 'clip_mascota_jugando.mp4',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    type: 'video',
    size: '4.8 MB',
    date: 'Hace 6 horas'
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

  // Rutas conocidas donde WhatsApp almacena los estados vistos en Android
  const WHATSAPP_PATHS = [
    'Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
    'WhatsApp/Media/.Statuses',
    'Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
    'WhatsApp Business/Media/.Statuses'
  ]

  const scanStatuses = async () => {
    setLoading(true)

    if (!isNative) {
      // Simulación fluida para navegador web
      setTimeout(() => {
        setStatuses(DEMO_STATUSES)
        setLoading(false)
        setHasScanned(true)
      }, 600)
      return
    }

    // Modo Nativo en Teléfono Android
    try {
      try {
        const perm = await Filesystem.checkPermissions()
        if (perm.publicStorage !== 'granted') {
          await Filesystem.requestPermissions()
        }
      } catch (e) {
        console.warn('Permiso storage warning:', e)
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
                const fullPath = `${basePath}/${fileName}`
                discovered.push({
                  id: `wa-${fileName}`,
                  name: fileName,
                  uri: fullPath,
                  type: isImg ? 'image' : 'video',
                  size: 'Estado HD',
                  date: 'Detectado hoy'
                })
              }
            }
          }
        } catch (dirErr) {
          // Directorio no accesible o no existe para esta versión de WhatsApp
        }
      }

      if (discovered.length > 0) {
        setStatuses(discovered)
      } else {
        // Fallback a demostración con mensaje guiado
        setStatuses(DEMO_STATUSES)
      }
    } catch (err) {
      console.error('Error escaneando estados:', err)
      setStatuses(DEMO_STATUSES)
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
              from: item.uri,
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
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.806-5.768-5.806zm3.374 8.211c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.001-.482-1.674-.693-2.736-2.42-2.82-2.53-.083-.11-.676-.901-.676-1.718 0-.818.431-1.218.583-1.385.153-.166.333-.208.444-.208.111 0 .222.002.319.006.102.005.239-.039.373.283.144.346.49 1.196.533 1.284.043.088.072.19.014.305-.058.115-.087.188-.173.289-.087.102-.183.228-.261.306-.087.087-.178.182-.077.355.101.173.45 1.742 1.488 2.666.804.717 1.48.939 1.69.1.043.21-.043.324-.117.41-.074.086-.168.201-.255.302-.087.1-.174.143-.246.216z"/>
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
                Detecta y guarda fotos y videos de estados vistos en tu teléfono sin pedir permiso.
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
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-slate-800 p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No se detectaron estados recientes
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 max-w-md mx-auto mt-2">
            Abre tu aplicación de WhatsApp en el celular, visualiza los estados que quieras guardar y luego pulsa el botón Actualizar.
          </p>
          <button
            onClick={scanStatuses}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar Lista de Estados
          </button>
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
