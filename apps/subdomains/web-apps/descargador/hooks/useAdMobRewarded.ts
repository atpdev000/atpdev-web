import { useEffect, useState, useCallback } from 'react'
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobError } from '@capacitor-community/admob'
import { usePlatform } from './usePlatform'
import { useProPlan } from './useProPlan'

const REWARDED_AD_UNIT_ID = 'ca-app-pub-5414009811868137/6153794392'

export function useAdMobRewarded() {
  const { isNative } = usePlatform()
  const { isPro } = useProPlan()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Inicializar AdMob (si no se ha hecho globalmente y no es PRO)
  useEffect(() => {
    if (isNative && !isPro) {
      AdMob.initialize().catch((err) => console.error('Fallo al inicializar AdMob', err))
    }
  }, [isNative, isPro])

  const loadRewarded = useCallback(async () => {
    if (!isNative || isPro) return
    if (isLoading || isLoaded) return

    try {
      setIsLoading(true)
      const options: RewardAdOptions = {
        adId: REWARDED_AD_UNIT_ID
      }

      await AdMob.prepareRewardVideoAd(options)
    } catch (error) {
      console.error('Error cargando Rewarded Ad:', error)
      setIsLoading(false)
    }
  }, [isNative, isPro, isLoading, isLoaded])

  // Listeners
  useEffect(() => {
    if (!isNative || isPro) return

    const loadedListener = AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log('💰 Rewarded Ad Loaded')
      setIsLoaded(true)
      setIsLoading(false)
    })

    const failedToLoadListener = AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
      console.error('💰 Rewarded Ad Failed to Load:', error)
      setIsLoading(false)
      setIsLoaded(false)
    })

    const dismissedListener = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('💰 Rewarded Ad Dismissed')
      setIsLoaded(false)
    })

    loadRewarded()

    return () => {
      loadedListener.then((h) => h.remove())
      failedToLoadListener.then((h) => h.remove())
      dismissedListener.then((h) => h.remove())
    }
  }, [isNative, isPro, loadRewarded])

  // Mostrar anuncio y ejecutar callback
  const showRewarded = async (onReward: () => void) => {
    // Si el usuario es PRO o está en Web, descarga directa e inmediata sin ningún anuncio ni espera
    if (!isNative || isPro) {
      onReward()
      return
    }

    if (isLoaded) {
      let executed = false
      let safetyTimeout: any = null

      const executeOnce = () => {
        if (!executed) {
          executed = true
          if (safetyTimeout) clearTimeout(safetyTimeout)
          onReward()
        }
      }

      const dismissedListener = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        console.log('💰 Rewarded Ad Dismissed -> Iniciando descarga en primer plano')
        setIsLoaded(false)
        executeOnce()
        dismissedListener.then((h) => h.remove())
        setTimeout(() => loadRewarded(), 1000)
      })

      const rewardedListener = AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem) => {
        console.log('🎁 Usuario recompensado:', rewardItem)
        rewardedListener.then((h) => h.remove())
      })

      const failedListener = AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
        console.warn('💰 Error mostrando Rewarded:', error)
        executeOnce()
        failedListener.then((h) => h.remove())
      })

      safetyTimeout = setTimeout(() => {
        console.log('⏱️ Timeout de seguridad de Rewarded -> liberando descarga')
        executeOnce()
      }, 45000)

      try {
        await AdMob.showRewardVideoAd()
      } catch (e) {
        console.error('Error mostrando Rewarded:', e)
        executeOnce()
      }
    } else {
      console.log('⚠️ Rewarded no listo previamente, ejecutando acción directa...')
      loadRewarded()
      onReward()
    }
  }

  return {
    showRewarded,
    isLoaded,
    loadRewarded
  }
}
