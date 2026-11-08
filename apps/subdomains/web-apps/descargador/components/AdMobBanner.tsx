'use client'

import { useEffect, useState } from 'react'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'
import { Capacitor } from '@capacitor/core'
import { useProPlan } from '@/hooks/useProPlan'

export default function AdMobBanner() {
  const [isNative, setIsNative] = useState(false)
  const { isPro } = useProPlan()

  useEffect(() => {
    const native = Capacitor.isNativePlatform()
    setIsNative(native)

    if (!native) return

    // Si el usuario es PRO, asegurar que cualquier banner activo se oculte de inmediato
    if (isPro) {
      AdMob.hideBanner().catch(() => {})
      return
    }

    const initializeAdMob = async () => {
      try {
        await AdMob.initialize({})

        const bannerOptions = {
          adId: 'ca-app-pub-5414009811868137/6834744262', // PROD Banner ID
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        }

        await AdMob.showBanner(bannerOptions)
      } catch (e) {
        console.error('AdMob Banner failure', e)
      }
    }

    initializeAdMob()

    return () => {
      if (Capacitor.isNativePlatform()) {
        AdMob.hideBanner().catch(() => {})
      }
    }
  }, [isPro])

  if (!isNative || isPro) return null

  return (
    <div style={{ height: '60px', width: '100%', backgroundColor: 'transparent' }}>
      {/* Spacer para el banner ad solo cuando está activo para usuarios gratuitos */}
    </div>
  )
}
