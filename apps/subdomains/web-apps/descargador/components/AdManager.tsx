'use client'

import { usePlatform } from '@/hooks/usePlatform'
import { useProPlan } from '@/hooks/useProPlan'
import AdMobBanner from '@/components/AdMobBanner'
import { useEffect, useState } from 'react'

export default function AdManager() {
  const { isNative } = usePlatform()
  const { isPro } = useProPlan()
  const [mounted, setMounted] = useState(false)

  // Refrescar anuncios de Ezoic al montar en cliente (solo en producción externa y usuarios no pro)
  useEffect(() => {
    setMounted(true)
    if (isPro) return

    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost'
    ) {
      if (!isNative && (window as any).ezstandalone?.showAds) {
        (window as any).ezstandalone.cmd = (window as any).ezstandalone.cmd || []
        ;(window as any).ezstandalone.cmd.push(function () {
          ;(window as any).ezstandalone?.showAds()
        })
      }
    }
  }, [isNative, isPro])

  if (!mounted || isPro) return null

  return (
    <>
      {/* APP: Mostrar AdMob solo si es nativo y el usuario no es PRO */}
      {isNative && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
          <AdMobBanner />
        </div>
      )}
    </>
  )
}
