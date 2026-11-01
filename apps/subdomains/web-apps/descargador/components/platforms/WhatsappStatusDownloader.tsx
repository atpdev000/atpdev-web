'use client'

import { useState, useEffect, useCallback } from 'react'
import { Capacitor, registerPlugin } from '@capacitor/core'
import { usePlatform } from '@/hooks/usePlatform'
import { useNotifications } from '@/hooks/useNotifications'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'
import { useAdMobRewarded } from '@/hooks/useAdMobRewarded'
import { Toast } from '@capacitor/toast'
import { Share } from '@capacitor/share'
import { 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  Film, 
  Share2, 
  Play, 
  ShieldCheck, 
  ExternalLink,
  FolderLock,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

// Interface del Plugin Nativo de Android para WhatsApp
interface WhatsAppStatusPluginInterface {
  checkPermission(): Promise<{ granted: boolean; isAllFiles: boolean; sdkVersion: number }>
  requestPermission(): Promise<{ openedSettings?: boolean; type?: string }>
  getStatuses(options?: { appType?: 'all' | 'whatsapp' | 'business' }): Promise<{
    statuses: Array<{
      id: string
      name: string
      path: string
      type: 'image' | 'video'
      app: 'whatsapp' | 'business'
      sizeBytes: number
      sizeFormatted: string
      date: string
      thumbnail?: string
    }>
    count: number
  }>
  saveToGallery(options: { filePath: string }): Promise<{ success: boolean; uri: string; fileName: string }>
  openWhatsApp(options?: { target?: 'whatsapp' | 'business' }): Promise<{ success: boolean; package?: string }>
}

const WhatsAppStatus = registerPlugin<WhatsAppStatusPluginInterface>('WhatsAppStatus')

interface StatusItem {
  id: string
  name: string
  path: string
  uri: string
  type: 'image' | 'video'
  app: 'whatsapp' | 'business'
  sizeFormatted: string
  date: string
  thumbnail?: string
}

// Datos de demostración exclusivos para navegador desktop de PC
const DEMO_STATUSES: StatusItem[] = [
  {
    id: 'demo-1',
    name: 'estado_vacaciones.jpg',
    path: '',
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    app: 'whatsapp',
    sizeFormatted: '1.2 MB',
    date: 'Hoy, 10:30',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'demo-2',
    name: 'estado_playa.jpg',
    path: '',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    app: 'whatsapp',
    sizeFormatted: '850 KB',
    date: 'Hoy, 09:15',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
  }
]

export default function WhatsappStatusDownloader() {
  const { isNative } = usePlatform()
  const { scheduleNotification } = useNotifications()
  const { addToHistory } = useDownloadHistory()
  const { showRewarded } = useAdMobRewarded()

  // SnapNosh Style: Selector WhatsApp Normal vs WhatsApp Business
  const [selectedApp, setSelectedApp] = useState<'whatsapp' | 'business'>('whatsapp')
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos'>('all')

  const [statuses, setStatuses] = useState<StatusItem[]>([])
  const [loading, setLoading] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<StatusItem | null>(null)

  // 1. Escanear estados reales usando el plugin nativo
  const scanStatuses = useCallback(async (appTypeToScan = selectedApp) => {
    setLoading(true)

    // Modo Web (Navegador de PC)
    if (!isNative) {
      setTimeout(() => {
        setStatuses(DEMO_STATUSES)
        setPermissionGranted(true)
        setLoading(false)
      }, 400)
      return
    }

    // Modo Nativo en Teléfono Android
    try {
      // Verificar permiso de almacenamiento
      let isGranted = true
      try {
        const permCheck = await WhatsAppStatus.checkPermission()
        isGranted = permCheck.granted
        setPermissionGranted(isGranted)
      } catch (err) {
        console.warn('Error verificando permisos WhatsApp:', err)
      }

      if (!isGranted) {
        setStatuses([])
        setLoading(false)
        return
      }

      // Obtener estados de la app seleccionada (whatsapp o business)
      const res = await WhatsAppStatus.getStatuses({ appType: appTypeToScan })
      
      const mapped: StatusItem[] = (res.statuses || []).map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        uri: item.thumbnail || Capacitor.convertFileSrc(item.path),
        type: item.type,
        app: item.app,
        sizeFormatted: item.sizeFormatted,
        date: item.date,
        thumbnail: item.thumbnail
      }))

      setStatuses(mapped)
    } catch (err) {
      console.error('Error escaneando estados de WhatsApp:', err)
      setStatuses([])
    } finally {
      setLoading(false)
    }
  }, [isNative, selectedApp])

  // 2. Solicitar permiso de almacenamiento (All Files Access en Android 11+)
  const handleRequestPermission = async () => {
    try {
      await WhatsAppStatus.requestPermission()
    } catch (err) {
      console.warn('Error solicitando permisos:', err)
    }
  }

  // 3. Abrir WhatsApp o WhatsApp Business
  const handleOpenWhatsApp = async (app: 'whatsapp' | 'business') => {
    try {
      if (isNative) {
        await WhatsAppStatus.openWhatsApp({ target: app })
      } else {
        window.open('https://web.whatsapp.com', '_blank')
      }
    } catch {
      window.open('whatsapp://app', '_blank')
    }
  }

  // 4. Guardar Estado en Galería de forma 100% profesional
  const handleSaveStatus = async (item: StatusItem) => {
    showRewarded(async () => {
      setSavingId(item.id)
      try {
        if (isNative) {
          // Guardado nativo a través de MediaStore de Android
          await WhatsAppStatus.saveToGallery({ filePath: item.path })

          try {
            await Toast.show({
              text: '¡Estado guardado en tu Galería! 🎉',
              duration: 'short',
              position: 'bottom'
            })
          } catch {}

          scheduleNotification(
            '¡Estado Guardado! 🎉',
            `${item.name} se guardó correctamente en tu galería.`
          )
        } else {
          // Descarga directa en navegador Web
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
          thumbnail: item.thumbnail || item.uri,
          originalUrl: item.uri,
          status: 'completed',
          format: item.type === 'video' ? 'Video MP4' : 'Foto HD',
          fileSize: item.sizeFormatted || 'HD',
          mimeType: item.type === 'video' ? 'video/mp4' : 'image/jpeg'
        })
      } catch (err) {
        console.error('Error guardando estado:', err)
        try {
          await Toast.show({
            text: 'Error al guardar estado en galería',
            duration: 'short'
          })
        } catch {}
      } finally {
        setSavingId(null)
      }
    })
  }

  // 5. Compartir Estado
  const handleShare = async (item: StatusItem) => {
    try {
      if (isNative && item.path) {
        await Share.share({
          title: 'Estado de WhatsApp',
          text: 'Descargado con FTY Downloader Pro',
          url: item.path,
          dialogTitle: 'Compartir Estado'
        })
      } else if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Estado de WhatsApp',
          text: 'Descargado con FTY Downloader Pro',
          url: item.uri
        })
      } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Mira este estado: ' + item.name)}`, '_blank')
      }
    } catch {
      // Cancelado por el usuario
    }
  }

  // Auto-refresco al cambiar de pestaña o volver a la app tras conceder permisos
  useEffect(() => {
    scanStatuses(selectedApp)

    const handleFocus = () => {
      scanStatuses(selectedApp)
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [selectedApp, scanStatuses])

  // Filtrado de estados (Todos, Fotos, Videos)
  const filteredStatuses = statuses.filter(s => {
    if (activeFilter === 'images') return s.type === 'image'
    if (activeFilter === 'videos') return s.type === 'video'
    return true
  })

  const imageCount = statuses.filter(s => s.type === 'image').length
  const videoCount = statuses.filter(s => s.type === 'video').length

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* BARRA SUPERIOR PROFESIONAL ESTILO SNAPNOSH */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-gray-200/80 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Toggle WhatsApp Normal vs WhatsApp Business */}
        <div className="flex items-center bg-gray-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setSelectedApp('whatsapp')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedApp === 'whatsapp'
                ? 'bg-[#25D366] text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setSelectedApp('business')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedApp === 'business'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>WA Business</span>
          </button>
        </div>

        {/* Acciones Rápidas: Actualizar y Abrir WA */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => scanStatuses(selectedApp)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Actualizar Estados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#25D366]' : ''}`} />
            <span>{loading ? 'Buscando...' : 'Actualizar'}</span>
          </button>

          <button
            onClick={() => handleOpenWhatsApp(selectedApp)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-bold transition-all cursor-pointer active:scale-95"
            title="Abrir WhatsApp para ver más estados"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir App</span>
          </button>
        </div>
      </div>

      {/* FILTROS DE TIPO: TODOS / FOTOS / VIDEOS */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#25D366] text-white shadow-md shadow-emerald-500/20'
                : 'bg-gray-100 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Todos ({statuses.length})
          </button>

          <button
            onClick={() => setActiveFilter('images')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'images'
                ? 'bg-[#25D366] text-white shadow-md shadow-emerald-500/20'
                : 'bg-gray-100 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Fotos ({imageCount})
          </button>

          <button
            onClick={() => setActiveFilter('videos')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'videos'
                ? 'bg-[#25D366] text-white shadow-md shadow-emerald-500/20'
                : 'bg-gray-100 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Videos ({videoCount})
          </button>
        </div>

        <span className="text-[11px] font-mono text-gray-400 dark:text-slate-500 hidden sm:inline">
          {filteredStatuses.length} detectados
        </span>
      </div>

      {/* TARJETA DE SOLICITUD DE PERMISO (Solo si no está concedido en Android) */}
      {!permissionGranted && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Permiso de Acceso a Archivos Necesario</h4>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Para detectar y guardar los estados de {selectedApp === 'whatsapp' ? 'WhatsApp' : 'WhatsApp Business'}, concede el acceso a los archivos.
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestPermission}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Conceder Acceso</span>
          </button>
        </div>
      )}

      {/* ESTADO DE CARGA */}
      {loading && statuses.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="aspect-[9/16] bg-gray-200 dark:bg-slate-800/60 rounded-2xl animate-pulse flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ))}
        </div>
      )}

      {/* CUADRÍCULA DE FOTOS Y VIDEOS DIRECTA */}
      {filteredStatuses.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {filteredStatuses.map((item) => {
            const isSaving = savingId === item.id

            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-900 border border-gray-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visualizador de Contenido */}
                <div 
                  onClick={() => setSelectedPreview(item)}
                  className="relative aspect-[9/16] bg-black overflow-hidden cursor-pointer"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : item.type === 'image' ? (
                    <img
                      src={item.uri}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    </div>
                  )}

                  {/* Icono de Reproducción para Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-[#25D366]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Badges superiores: Tipo y Tamaño */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                      {item.type === 'image' ? <ImageIcon className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {item.type === 'image' ? 'FOTO' : 'VIDEO'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white/90 backdrop-blur-md font-mono">
                      {item.sizeFormatted}
                    </span>
                  </div>

                  {/* Fecha de visualización en la esquina inferior del thumbnail */}
                  <div className="absolute bottom-1.5 left-2 pointer-events-none">
                    <span className="text-[9px] font-medium text-white/80 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Botones de Acción directos */}
                <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => handleSaveStatus(item)}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className={`w-3.5 h-3.5 ${isSaving ? 'animate-bounce' : ''}`} />
                    <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                  </button>

                  <button
                    onClick={() => handleShare(item)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Compartir"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : !loading && (
        /* ESTADO VACÍO ELEGANTE */
        <div className="text-center py-10 bg-white/90 dark:bg-slate-900/60 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] mx-auto flex items-center justify-center mb-3">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>

          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No hay estados vistos recientemente
          </h3>
          <p className="text-xs text-gray-600 dark:text-slate-400 max-w-sm mx-auto mt-1.5">
            Abre {selectedApp === 'whatsapp' ? 'WhatsApp' : 'WhatsApp Business'}, mira los estados de tus contactos y luego presiona "Actualizar".
          </p>
          
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => handleOpenWhatsApp(selectedApp)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir {selectedApp === 'whatsapp' ? 'WhatsApp' : 'WA Business'}</span>
            </button>
            <button
              onClick={() => scanStatuses(selectedApp)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar Estados</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL VISOR EN PANTALLA COMPLETA */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="relative max-w-md w-full max-h-[92vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">
            <div className="p-3.5 flex items-center justify-between text-white border-b border-slate-800/80 bg-slate-900/50">
              <span className="font-bold text-xs truncate max-w-[200px]">{selectedPreview.name}</span>
              <button
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-xs font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex items-center justify-center bg-black p-2 min-h-[300px]">
              {selectedPreview.type === 'image' ? (
                <img
                  src={selectedPreview.thumbnail || selectedPreview.uri}
                  alt={selectedPreview.name}
                  className="max-h-[68vh] w-auto object-contain rounded-xl"
                />
              ) : (
                <video
                  src={selectedPreview.uri}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[68vh] w-full rounded-xl"
                />
              )}
            </div>

            <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center justify-end gap-2.5">
              <button
                onClick={() => handleShare(selectedPreview)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>
              <button
                onClick={() => {
                  handleSaveStatus(selectedPreview)
                  setSelectedPreview(null)
                }}
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Guardar en Galería</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
