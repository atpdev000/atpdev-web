'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Platform } from './PlatformTabs'
import { detectPlatformFromUrl, extractUrlFromText, DetectedUrlInfo } from '@/lib/clipboardDetector'
import { Sparkles, CheckCircle2, X } from 'lucide-react'
import { readNativeClipboard } from '@/lib/nativeBridge'
import { useHistoryStore } from '@/hooks/useDownloadHistory'
import { usePlatform } from '@/hooks/usePlatform'

interface SmartClipboardDetectorProps {
  activePlatform?: Platform
  allowYoutube?: boolean
  onDetected: (info: DetectedUrlInfo, autoSearch: boolean) => void
}

export default function SmartClipboardDetector({ activePlatform, allowYoutube, onDetected }: SmartClipboardDetectorProps) {
  const { isPlayStore } = usePlatform()
  const youtubeAllowed = allowYoutube ?? !isPlayStore
  const [detectedToast, setDetectedToast] = useState<{
    info: DetectedUrlInfo
    isAutoSearching: boolean
  } | null>(null)

  const onDetectedRef = useRef(onDetected)
  useEffect(() => {
    onDetectedRef.current = onDetected
  }, [onDetected])

  const activePlatformRef = useRef(activePlatform)
  useEffect(() => {
    activePlatformRef.current = activePlatform
  }, [activePlatform])

  const lastProcessedUrl = useRef<string>('')
  const lastProcessedTime = useRef<number>(0)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((info: DetectedUrlInfo, autoSearching: boolean) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    setDetectedToast({ info, isAutoSearching: autoSearching })
    toastTimeoutRef.current = setTimeout(() => {
      setDetectedToast(null)
    }, 4500)
  }, [])

  const handleDetectedUrl = useCallback((rawText: string, isFromAutoCheck = true) => {
    if (!rawText || typeof rawText !== 'string') return false

    const info = detectPlatformFromUrl(rawText, { allowYoutube: youtubeAllowed })
    if (!info) return false
    if (!youtubeAllowed && info.platform === 'youtube') return false

    const now = Date.now()

    if (isFromAutoCheck) {
      // 1. Verificar si esta URL ya fue descargada anteriormente en el historial
      // Si ya fue descargada (status === 'completed'), NO volver a autocargar automáticamente
      const history = useHistoryStore.getState().history || []
      const isAlreadyDownloaded = history.some(item => {
        if (item.status !== 'completed' || !item.originalUrl) return false
        const hClean = (extractUrlFromText(item.originalUrl) || item.originalUrl).trim().toLowerCase()
        const currentClean = info.url.trim().toLowerCase()
        if (hClean.length < 12) return false
        return hClean === currentClean || currentClean.includes(hClean) || hClean.includes(currentClean)
      })

      if (isAlreadyDownloaded) {
        console.log('⚡ SmartDetect: La URL ya fue descargada previamente, no se recargará automáticamente:', info.url)
        return false
      }

      // 2. Evitar re-disparo múltiple por eventos simultáneos (focus + visibilitychange)
      if (lastProcessedUrl.current === info.url && now - lastProcessedTime.current < 3500) {
        return false
      }

      // 3. Si esta misma URL ya fue autocargada en la sesión actual y el usuario sigue en esa misma pestaña,
      // no reiniciar el componente al cerrar anuncios o diálogos de permisos
      if (lastProcessedUrl.current === info.url && activePlatformRef.current === info.platform) {
        return false
      }
    }

    lastProcessedUrl.current = info.url
    lastProcessedTime.current = now

    // Scroll suave hacia la sección de descarga en web
    const toolsEl = document.getElementById('herramientas')
    if (toolsEl) {
      toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    showToast(info, true)
    onDetectedRef.current(info, true)
    return true
  }, [showToast, youtubeAllowed])

  // 1. GLOBAL PASTE LISTENER (Ctrl+V o pegado manual explícito en cualquier lugar)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')

      const pastedData = e.clipboardData?.getData('text')
      if (pastedData) {
        const detected = detectPlatformFromUrl(pastedData)
        if (detected) {
          // Si pega dentro de un input de la misma plataforma, el propio input ya ejecuta onPaste -> processUrl
          if (isInput && activePlatformRef.current === detected.platform) {
            lastProcessedUrl.current = detected.url
            lastProcessedTime.current = Date.now()
            return
          }
          e.preventDefault()
          handleDetectedUrl(pastedData, false)
        }
      }
    }

    const handleManualPasteEvent = (e: Event) => {
      const customEv = e as CustomEvent<{ text?: string }>
      const text = customEv.detail?.text
      if (text) {
        handleDetectedUrl(text, false)
      }
    }

    window.addEventListener('paste', handlePaste)
    window.addEventListener('smart-clipboard-manual-paste', handleManualPasteEvent as EventListener)
    return () => {
      window.removeEventListener('paste', handlePaste)
      window.removeEventListener('smart-clipboard-manual-paste', handleManualPasteEvent as EventListener)
    }
  }, [handleDetectedUrl])

  // 2. WINDOW FOCUS / APP RESUME LISTENER (Lectura automática al abrir o volver a la app en Android y Web)
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    const checkClipboardSilently = async () => {
      try {
        const text = await readNativeClipboard()
        if (text) {
          handleDetectedUrl(text, true)
        }
      } catch (err) {
        console.warn('Silent clipboard check:', err)
      }
    }

    // En Android 10-15 (especialmente Xiaomi HyperOS / MIUI / Samsung OneUI), el acceso al portapapeles
    // requiere que la ventana haya completado la transición de foco (150ms - 700ms tras resume/visibilitychange)
    const triggerMultiStageCheck = () => {
      checkClipboardSilently()
      timers.push(setTimeout(checkClipboardSilently, 250))
      timers.push(setTimeout(checkClipboardSilently, 700))
    }

    const onFocus = () => {
      triggerMultiStageCheck()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerMultiStageCheck()
      }
    }

    const onResume = () => {
      triggerMultiStageCheck()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)
    document.addEventListener('resume', onResume)
    window.addEventListener('resume', onResume)

    // Chequeo inicial al montar la app
    timers.push(setTimeout(checkClipboardSilently, 150))
    timers.push(setTimeout(checkClipboardSilently, 600))
    timers.push(setTimeout(checkClipboardSilently, 1300))

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      document.removeEventListener('resume', onResume)
      window.removeEventListener('resume', onResume)
      timers.forEach(clearTimeout)
    }
  }, [handleDetectedUrl])

  if (!detectedToast) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full mx-4 sm:mx-0 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-4 shadow-2xl shadow-blue-500/20 text-white flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
              ⚡ SMART DETECT
            </span>
            <span className="text-xs font-bold text-white truncate">
              {detectedToast.info.platformName}
            </span>
          </div>

          <p className="text-xs text-slate-300 truncate font-mono">
            {detectedToast.info.url}
          </p>

          <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Enlace detectado. Obteniendo opciones de descarga...</span>
          </p>
        </div>

        <button
          onClick={() => setDetectedToast(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
