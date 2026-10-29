'use client'

import { usePlatform } from '@/hooks/usePlatform'
import AdMobBanner from '@/components/AdMobBanner'
import { useEffect, useState } from 'react'

export default function AdManager() {
  const { isNative } = usePlatform()
  const [mounted, setMounted] = useState(false)

  // Refrescar anuncios de Ezoic al montar en cliente
  useEffect(() => {
    setMounted(true)
    if (!isNative && typeof window !== 'undefined' && (window as any).ezstandalone?.showAds) {
      (window as any).ezstandalone.cmd = (window as any).ezstandalone.cmd || []
      ;(window as any).ezstandalone.cmd.push(function () {
        ;(window as any).ezstandalone?.showAds()
      })
    }
  }, [isNative])

  if (!mounted) return null

  return (
    <>
      {/* APP: Mostrar AdMob solo si es nativo */}
      {isNative && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
          <AdMobBanner />
        </div>
      )}
    </>
  )
}
