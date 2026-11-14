import { AdMob, AdLoadInfo, InterstitialAdPluginEvents } from '@capacitor-community/admob'
import { Capacitor } from '@capacitor/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useProPlan } from './useProPlan'

const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-5414009811868137/9123842162'

export function useAdMobInterstitial() {
  const [isLoaded, setIsLoaded] = useState(false)
  const isLoadedRef = useRef(false)
  const isLoadingRef = useRef(false)
  const { isPro } = useProPlan()

  const prepareNext = useCallback(async () => {
    if (!Capacitor.isNativePlatform() || isPro) return
    if (isLoadingRef.current || isLoadedRef.current) return
    try {
      isLoadingRef.current = true
      await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_UNIT_ID })
    } catch (e) {
      console.error('Interstitial prepare failed', e)
      isLoadingRef.current = false
    }
  }, [isPro])

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || isPro) return

    const loadedSub = AdMob.addListener(InterstitialAdPluginEvents.Loaded, (_info: AdLoadInfo) => {
      isLoadedRef.current = true
      isLoadingRef.current = false
      setIsLoaded(true)
    })

    const failedSub = AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
      console.warn('Interstitial failed to load:', err)
      isLoadedRef.current = false
      isLoadingRef.current = false
      setIsLoaded(false)
    })

    const dismissedSub = AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      isLoadedRef.current = false
      isLoadingRef.current = false
      setIsLoaded(false)
      setTimeout(() => {
        prepareNext()
      }, 800)
    })

    prepareNext()

    return () => {
      loadedSub.then((h) => h.remove()).catch(() => {})
      failedSub.then((h) => h.remove()).catch(() => {})
      dismissedSub.then((h) => h.remove()).catch(() => {})
    }
  }, [isPro, prepareNext])

  const showInterstitial = useCallback(async () => {
    if (!Capacitor.isNativePlatform() || isPro) return

    try {
      if (isLoadedRef.current) {
        isLoadedRef.current = false
        setIsLoaded(false)
        await AdMob.showInterstitial()
        setTimeout(() => {
          prepareNext()
        }, 800)
      } else {
        console.log('Interstitial not ready yet')
        prepareNext()
      }
    } catch (e) {
      console.error('Show interstitial failed', e)
      isLoadedRef.current = false
      setIsLoaded(false)
      prepareNext()
    }
  }, [isPro, prepareNext])

  return { showInterstitial, isLoaded }
}
