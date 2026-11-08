import { AdMob, AdLoadInfo, InterstitialAdPluginEvents } from '@capacitor-community/admob'
import { Capacitor } from '@capacitor/core'
import { useEffect, useState } from 'react'
import { useProPlan } from './useProPlan'

export function useAdMobInterstitial() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isPro } = useProPlan()

  useEffect(() => {
    // Si el usuario es PRO o no está en dispositivo nativo, no precargar anuncios
    if (!Capacitor.isNativePlatform() || isPro) return

    const prepareInterstitial = async () => {
      try {
        AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
          setIsLoaded(true)
        })

        await AdMob.prepareInterstitial({
          adId: 'ca-app-pub-5414009811868137/9123842162' // PROD Interstitial ID
        })
      } catch (e) {
        console.error('Interstitial prepare failed', e)
      }
    }

    prepareInterstitial()
  }, [isPro])

  const showInterstitial = async () => {
    // Si el usuario es PRO, nunca mostrar anuncios intersticiales
    if (!Capacitor.isNativePlatform() || isPro) return

    try {
      if (isLoaded) {
        await AdMob.showInterstitial()
        setIsLoaded(false)
        await AdMob.prepareInterstitial({
          adId: 'ca-app-pub-5414009811868137/9123842162'
        })
      } else {
        console.log('Interstitial not ready yet')
      }
    } catch (e) {
      console.error('Show interstitial failed', e)
    }
  }

  return { showInterstitial, isLoaded }
}
