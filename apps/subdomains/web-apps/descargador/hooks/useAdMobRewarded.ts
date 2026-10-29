import { useEffect, useState, useCallback } from 'react';
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobError } from '@capacitor-community/admob';
import { usePlatform } from './usePlatform';

const REWARDED_AD_UNIT_ID = 'ca-app-pub-5414009811868137/6153794392'; // ID proporcionado por el usuario

export function useAdMobRewarded() {
    const { isNative } = usePlatform();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Inicializar AdMob (si no se ha hecho globalmente)
    useEffect(() => {
        if (isNative) {
            AdMob.initialize().catch(err => console.error('Fallo al inicializar AdMob', err));
        }
    }, [isNative]);

    const loadRewarded = useCallback(async () => {
        if (!isNative) return;
        if (isLoading || isLoaded) return;

        try {
            setIsLoading(true);
            const options: RewardAdOptions = {
                adId: REWARDED_AD_UNIT_ID,
                // isTesting: true // Descomentar para pruebas si es necesario (generalmente usa IDs de prueba)
            };

            await AdMob.prepareRewardVideoAd(options);
            // El evento onRewardedVideoAdLoaded manejará el estado isLoaded
        } catch (error) {
            console.error('Error cargando Rewarded Ad:', error);
            setIsLoading(false);
        }
    }, [isNative, isLoading, isLoaded]);

    // Listeners
    useEffect(() => {
        if (!isNative) return;

        const loadedListener = AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
            console.log('💰 Rewarded Ad Loaded');
            setIsLoaded(true);
            setIsLoading(false);
        });

        const failedToLoadListener = AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
            console.error('💰 Rewarded Ad Failed to Load:', error);
            setIsLoading(false);
            setIsLoaded(false);
        });

        const dismissedListener = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            console.log('💰 Rewarded Ad Dismissed');
            setIsLoaded(false);
            // Opcional: Recargar automáticamente
            // loadRewarded(); 
        });

        // Cargar inicial
        loadRewarded();

        return () => {
            loadedListener.then(h => h.remove());
            failedToLoadListener.then(h => h.remove());
            dismissedListener.then(h => h.remove());
        };
    }, [isNative, loadRewarded]);

    // Mostrar anuncio y ejecutar callback si el usuario recibe la recompensa
    const showRewarded = async (onReward: () => void) => {
        if (!isNative) {
            onReward(); // En web ejecuta directo
            return;
        }

        if (isLoaded) {
            // Listener temporal para la recompensa específica de esta llamada
            const rewardListenerPromise = AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem) => {
                console.log('🎁 Usuario recompensado:', rewardItem);
                onReward();
                rewardListenerPromise.then(h => h.remove());
            });

            try {
                await AdMob.showRewardVideoAd();
            } catch (e) {
                console.error('Error mostrando Rewarded:', e);
                // Si falla al mostrar, podemos decidir si dejarlo pasar o no. 
                // Generalmente mejor no bloquear al usuario si falla el anuncio.
                rewardListenerPromise.then(h => h.remove());
                onReward();
            }
        } else {
            console.log('⚠️ Rewarded no listo, intentando cargar para la próxima...');
            loadRewarded();
            onReward(); // Si no está listo, dejamos pasar al usuario (mejor UX)
        }
    };

    return {
        showRewarded,
        isLoaded,
        loadRewarded
    };
}
