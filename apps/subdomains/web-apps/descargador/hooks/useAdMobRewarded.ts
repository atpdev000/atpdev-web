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
            };

            await AdMob.prepareRewardVideoAd(options);
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
        });

        // Cargar inicial
        loadRewarded();

        return () => {
            loadedListener.then(h => h.remove());
            failedToLoadListener.then(h => h.remove());
            dismissedListener.then(h => h.remove());
        };
    }, [isNative, loadRewarded]);

    // Mostrar anuncio y ejecutar callback cuando el anuncio se complete y cierre
    const showRewarded = async (onReward: () => void) => {
        if (!isNative) {
            onReward(); // En web ejecuta directo
            return;
        }

        if (isLoaded) {
            let executed = false;
            let safetyTimeout: any = null;

            const executeOnce = () => {
                if (!executed) {
                    executed = true;
                    if (safetyTimeout) clearTimeout(safetyTimeout);
                    onReward();
                }
            };

            // Escuchar cuando el anuncio es cerrado por el usuario (Dismissed)
            // Esto garantiza que el WebView de la app esté 100% activo en PRIMER PLANO
            // evitando que Android congele las descargas pesadas o interrumpa sockets TCP.
            const dismissedListener = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                console.log('💰 Rewarded Ad Dismissed -> Iniciando acción en primer plano');
                setIsLoaded(false);
                executeOnce();
                dismissedListener.then(h => h.remove());
                // Pre-cargar el siguiente anuncio para la próxima descarga
                setTimeout(() => loadRewarded(), 1000);
            });

            // Si el evento Rewarded se dispara antes
            const rewardedListener = AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem) => {
                console.log('🎁 Usuario recompensado:', rewardItem);
                rewardedListener.then(h => h.remove());
            });

            const failedListener = AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
                console.warn('💰 Error mostrando Rewarded:', error);
                executeOnce();
                failedListener.then(h => h.remove());
            });

            // Timeout de seguridad por si AdMob no emite Dismissed (45s)
            safetyTimeout = setTimeout(() => {
                console.log('⏱️ Timeout de seguridad de Rewarded -> liberando acción');
                executeOnce();
            }, 45000);

            try {
                await AdMob.showRewardVideoAd();
            } catch (e) {
                console.error('Error mostrando Rewarded:', e);
                executeOnce();
            }
        } else {
            console.log('⚠️ Rewarded no listo previamente, ejecutando acción directa...');
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
