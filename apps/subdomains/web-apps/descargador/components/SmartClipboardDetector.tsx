'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Platform } from './PlatformTabs'
import { detectPlatformFromUrl, DetectedUrlInfo } from '@/lib/clipboardDetector'
import { Sparkles, CheckCircle2, ArrowRight, X, Download } from 'lucide-react'
import { usePlatform } from '@/hooks/usePlatform'
import { readNativeClipboard } from '@/lib/nativeBridge'
import { useHistoryStore } from '@/hooks/useDownloadHistory'

interface SmartClipboardDetectorProps {
  activePlatform?: Platform
  onDetected: (info: DetectedUrlInfo, autoSearch: boolean) => void
}

export default function SmartClipboardDetector({ activePlatform, onDetected }: SmartClipboardDetectorProps) {
  const { isNative } = usePlatform()
  const [detectedToast, setDetectedToast] = useState<{
    info: DetectedUrlInfo
    isAutoSearching: boolean
    needsUserConfirmation: boolean
  } | null>(null)
  
  // Cache en memoria para URLs ya procesadas o descartadas en la sesión
  const processedUrls = useRef<Set<string>>(new Set())
  const lastClipboardRaw = useRef<string>('')
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((info: DetectedUrlInfo, autoSearching: boolean, needsConfirmation: boolean) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    setDetectedToast({ info, isAutoSearching: autoSearching, needsUserConfirmation: needsConfirmation })
    toastTimeoutRef.current = setTimeout(() => {
      setDetectedToast(null)
    }, needsConfirmation ? 8000 : 4500)
  }, [])

  const handleDetectedUrl = useCallback((rawText: string, isFromAutoCheck = true) => {
    if (!rawText || typeof rawText !== 'string') return false
    const trimmed = rawText.trim()
    
    // Si el contenido del portapapeles es exactamente idéntico al último verificado, ignorar
    if (lastClipboardRaw.current === trimmed) {
      return false
    }
    
    const info = detectPlatformFromUrl(rawText)
    if (!info) return false

    // 1. Verificar si la URL ya fue procesada o descartada en esta sesión
    if (processedUrls.current.has(info.url)) {
      return false
    }

    // 2. Control inteligente: Verificar si la URL ya fue descargada anteriormente en el historial
    const history = useHistoryStore.getState().history
    const isAlreadyDownloaded = history.some(item => {
      if (item.status !== 'completed' || !item.originalUrl) return false
      const hClean = item.originalUrl.trim().toLowerCase()
      const currentClean = info.url.trim().toLowerCase()
      return hClean === currentClean || currentClean.includes(hClean) || hClean.includes(currentClean)
    })

    if (isAlreadyDownloaded) {
      console.log('⚡ SmartDetect: La URL ya fue descargada previamente, no se recargará automáticamente:', info.url)
      // Marcar como procesada para no volver a evaluar en cada focus
      processedUrls.current.add(info.url)
      lastClipboardRaw.current = trimmed
      return false
    }

    // Registrar como evaluado
    lastClipboardRaw.current = trimmed
    processedUrls.current.add(info.url)

    // 3. Control de cambio de pestaña: Si el usuario está en otra pestaña (ej. WhatsApp) y el enlace es de Facebook
    const isDifferentPlatform = activePlatform && activePlatform !== info.platform

    if (isDifferentPlatform && isFromAutoCheck) {
      // No cambiar de pestaña agresivamente: mostrar sugerencia interactiva con botón
      showToast(info, false, true)
      return true
    }

    // Si coincide con la pestaña actual o el usuario hizo Paste explícito
    const toolsEl = document.getElementById('herramientas')
    if (toolsEl) {
      toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    showToast(info, true, false)
    onDetected(info, true)
    return true
  }, [activePlatform, onDetected, showToast])

  // 1. GLOBAL PASTE LISTENER (Ctrl+V explícito en cualquier lugar)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      
      const pastedData = e.clipboardData?.getData('text')
      if (pastedData) {
        const detected = detectPlatformFromUrl(pastedData)
        if (detected) {
          if (!isInput) {
            e.preventDefault()
          }
          // En pegado manual explícito, resetear para procesarlo siempre
          lastClipboardRaw.current = ''
          processedUrls.current.delete(detected.url)
          handleDetectedUrl(pastedData, false)
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handleDetectedUrl])

  // 2. WINDOW FOCUS / APP RESUME LISTENER (Lectura silenciosa al volver a la app)
  useEffect(() => {
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

    const onFocus = () => {
      checkClipboardSilently()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkClipboardSilently()
      }
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)

    const timer = setTimeout(() => {
      checkClipboardSilently()
    }, 600)

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      clearTimeout(timer)
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
              ⚡ ENLACE DETECTADO
            </span>
            <span className="text-xs font-bold text-white truncate">
              {detectedToast.info.platformName}
            </span>
          </div>

          <p className="text-xs text-slate-300 truncate font-mono">
            {detectedToast.info.url}
          </p>

          {detectedToast.needsUserConfirmation ? (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  const info = detectedToast.info
                  setDetectedToast(null)
                  onDetected(info, true)
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ir y Descargar</span>
              </button>
              <button
                onClick={() => setDetectedToast(null)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
              >
                Ignorar
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Enlace detectado. Obteniendo opciones de descarga...</span>
            </p>
          )}
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
