import { AdMob, AdOptions, AdLoadInfo, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';

export function useAdMobInterstitial() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        // Prepare ad on mount
        const prepareInterstitial = async () => {
            try {
                AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
                    setIsLoaded(true);
                });

                await AdMob.prepareInterstitial({
                    adId: 'ca-app-pub-5414009811868137/9123842162' // PROD Interstitial ID
                    // isTesting: true
                });
            } catch (e) {
                console.error('Interstitial prepare failed', e);
            }
        };

        prepareInterstitial();

        return () => {
            // Cleanup listeners if needed
            // AdMob.removeAllListeners().catch(console.error);
        };
    }, []);

    const showInterstitial = async () => {
        if (!Capacitor.isNativePlatform()) return;

        try {
            if (isLoaded) {
                await AdMob.showInterstitial();
                // Reset loaded state and prepare next ad
                setIsLoaded(false);
                await AdMob.prepareInterstitial({
                    adId: 'ca-app-pub-5414009811868137/9123842162'
                });
            } else {
                console.log('Interstitial not ready yet');
            }
        } catch (e) {
            console.error('Show interstitial failed', e);
        }
    };

    return { showInterstitial, isLoaded };
}
