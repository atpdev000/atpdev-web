// components/Ads/AdDisplay.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AdProps {
  adSlot: string
  width?: number
  height?: number
}

export default function AdDisplay({ adSlot, width = 300, height = 600 }: AdProps) {
  const adRef = useRef<HTMLModElement>(null)
  const [isLocalhost, setIsLocalhost] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    setIsLocalhost(isLocal)

    if (isLocal) return

    // Solo empujar el anuncio si el contenedor tiene ancho real
    try {
      const ins = adRef.current
      if (ins && ins.clientWidth > 0 && !ins.getAttribute('data-adsbygoogle-status')) {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (e) {
      // Ignorar errores de tamaño no crítico de AdSense
    }
  }, [])

  if (isLocalhost) {
    return (
      <div className="w-full my-4 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 text-center text-xs text-slate-500 font-mono">
        [Google AdSense Slot: {adSlot}] (Pausado en Localhost)
      </div>
    )
  }

  return (
    <div className="w-full my-4 overflow-hidden flex justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client="ca-pub-5414009811868137"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
