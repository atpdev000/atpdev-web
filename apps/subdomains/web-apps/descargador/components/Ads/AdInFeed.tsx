// components/Ads/AdInFeed.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AdInFeedProps {
  adSlot: string
}

export default function AdInFeed({ adSlot }: AdInFeedProps) {
  const adRef = useRef<HTMLModElement>(null)
  const [isLocalhost, setIsLocalhost] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    setIsLocalhost(isLocal)

    if (isLocal) return

    try {
      const ins = adRef.current
      if (ins && ins.clientWidth > 0 && !ins.getAttribute('data-adsbygoogle-status')) {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (e) {
      // Ignorar errores de layout de AdSense
    }
  }, [])

  if (isLocalhost) {
    return (
      <div className="w-full my-4 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 text-center text-xs text-slate-500 font-mono">
        [AdSense In-Feed: {adSlot}] (Pausado en Localhost)
      </div>
    )
  }

  return (
    <div className="w-full my-4 overflow-hidden flex justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5414009811868137"
        data-ad-slot={adSlot}
        data-ad-format="fluid"
        data-ad-layout-key="-fg+5n+6t-e7+bf"
      />
    </div>
  )
}
