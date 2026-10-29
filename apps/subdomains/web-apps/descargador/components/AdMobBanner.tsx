'use client'

import { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export default function AdMobBanner() {
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());

        const initializeAdMob = async () => {
            if (!Capacitor.isNativePlatform()) return;

            try {
                await AdMob.initialize({
                    // initializeForTesting: true, // Use for testing
                });

                const bannerOptions = {
                    adId: 'ca-app-pub-5414009811868137/6834744262', // PROD Banner ID
                    adSize: BannerAdSize.ADAPTIVE_BANNER,
                    position: BannerAdPosition.BOTTOM_CENTER,
                    margin: 0,
                };

                await AdMob.showBanner(bannerOptions);
            } catch (e) {
                console.error('AdMob Banner failure', e);
            }
        };

        initializeAdMob();

        // Clean up on unmount? 
        // Usually banners stick around, but we might want to hide it if component unmounts.
        // effective for SPA navigation.
        return () => {
            if (Capacitor.isNativePlatform()) {
                AdMob.hideBanner().catch(console.error);
            }
        };
    }, []);

    if (!isNative) return null;

    return (
        <div style={{ height: '60px', width: '100%', backgroundColor: 'transparent' }}>
            {/* Spacer for the banner ad to not overlap content */}
        </div>
    );
}
