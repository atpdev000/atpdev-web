'use client'

import { useState, useEffect } from 'react'
import { Megaphone, X } from 'lucide-react'

interface AnnouncementBarProps {
  initialText?: string
  initialEnabled?: boolean
}

export default function AnnouncementBar({ initialText, initialEnabled }: AnnouncementBarProps) {
  const [text, setText] = useState(initialText || '')
  const [enabled, setEnabled] = useState(initialEnabled ?? false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Escuchar broadcast del Admin en vivo
    let bc: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('descargador_theme_channel')
        bc.onmessage = (event) => {
          if (event.data?.type === 'UPDATE_DESCARGADOR_CONFIG' && event.data.payload?.branding) {
            const b = event.data.payload.branding
            if (b.announcement_text !== undefined) setText(b.announcement_text)
            if (b.announcement_enabled !== undefined) setEnabled(Boolean(b.announcement_enabled))
          }
        }
      } catch {}
    }

    // Comprobar con la API
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (data?.branding) {
          if (data.branding.announcement_text) setText(data.branding.announcement_text)
          if (data.branding.announcement_enabled !== undefined) setEnabled(Boolean(data.branding.announcement_enabled))
        }
      })
      .catch(() => {})

    return () => {
      if (bc) bc.close()
    }
  }, [])

  if (!enabled || !text || dismissed) return null

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-sm z-50 transition-all">
      <div className="container mx-auto flex items-center justify-center gap-2 pr-8 text-center">
        <Megaphone className="w-4 h-4 shrink-0 text-amber-300 animate-pulse hidden sm:inline-block" />
        <span className="leading-tight">{text}</span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
        aria-label="Cerrar anuncio"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

