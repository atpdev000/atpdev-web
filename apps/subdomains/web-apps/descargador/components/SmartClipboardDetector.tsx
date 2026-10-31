'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Platform } from './PlatformTabs'
import { detectPlatformFromUrl, DetectedUrlInfo } from '@/lib/clipboardDetector'
import { Sparkles, CheckCircle2, ArrowRight, X, ClipboardPaste } from 'lucide-react'
import { usePlatform } from '@/hooks/usePlatform'

interface SmartClipboardDetectorProps {
  onDetected: (info: DetectedUrlInfo, autoSearch: boolean) => void
}

export default function SmartClipboardDetector({ onDetected }: SmartClipboardDetectorProps) {
  const { isNative } = usePlatform()
  const [detectedToast, setDetectedToast] = useState<{
    info: DetectedUrlInfo
    isAutoSearching: boolean
  } | null>(null)
  
  const lastProcessedUrl = useRef<string>('')
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

  const handleDetectedUrl = useCallback((rawText: string, autoSearch = true) => {
    const info = detectPlatformFromUrl(rawText)
    if (!info) return false

    // Avoid repeatedly processing the identical URL on rapid focus
    if (lastProcessedUrl.current === info.url) return false
    lastProcessedUrl.current = info.url

    // Scroll to downloader section smoothly
    const toolsEl = document.getElementById('herramientas')
    if (toolsEl) {
      toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    showToast(info, autoSearch)
    onDetected(info, autoSearch)
    return true
  }, [onDetected, showToast])

  // 1. GLOBAL PASTE LISTENER (Ctrl+V anywhere on web or mobile browser)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing into an active input/textarea
      const target = e.target as HTMLElement
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      
      const pastedData = e.clipboardData?.getData('text')
      if (pastedData) {
        const detected = detectPlatformFromUrl(pastedData)
        if (detected) {
          if (!isInput) {
            e.preventDefault()
          }
          handleDetectedUrl(pastedData, true)
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handleDetectedUrl])

  // 2. WINDOW FOCUS / APP RESUME LISTENER
  useEffect(() => {
    const checkClipboardSilently = async () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
          // In some browsers, readText requires explicit user permission
          const text = await navigator.clipboard.readText()
          if (text) {
            handleDetectedUrl(text, true)
          }
        }
      } catch (err) {
        // Expected when user hasn't granted clipboard-read permission yet
      }
    }

    const onFocus = () => {
      checkClipboardSilently()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkClipboardSilently()
      }
    })

    // Check once upon mounting
    checkClipboardSilently()

    return () => {
      window.removeEventListener('focus', onFocus)
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
