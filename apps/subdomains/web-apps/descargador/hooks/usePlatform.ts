import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';
import { isPlayStoreBuild } from '@/lib/featureFlags';
import { NativeWhatsAppStatus } from '@/lib/nativeBridge';

export function detectNativePlatform(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    const cap = win.Capacitor;
    return Boolean(
        Capacitor.isNativePlatform() ||
        cap?.isNativePlatform?.() ||
        cap?.getPlatform?.() === 'android' ||
        cap?.getPlatform?.() === 'ios' ||
        win.androidBridge ||
        win.webkit?.messageHandlers?.bridge
    );
}

export function usePlatform() {
    const [isNative, setIsNative] = useState(() => {
        if (typeof window === 'undefined') return false;
        return detectNativePlatform();
    });
    const [isPlayStore, setIsPlayStore] = useState(() => isPlayStoreBuild());

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const nativeDetected = detectNativePlatform();
        if (nativeDetected) {
            setIsNative(true);
        }
        if (isPlayStoreBuild()) {
            setIsPlayStore(true);
        }

        if (nativeDetected && typeof NativeWhatsAppStatus?.getDistributionChannel === 'function') {
            NativeWhatsAppStatus.getDistributionChannel()
                .then((res) => {
                    if (res?.channel === 'playstore' || res?.extendedMediaAllowed === false) {
                        (window as any).__FTY_CHANNEL = 'playstore';
                        setIsPlayStore(true);
                    } else if (res?.channel === 'direct') {
                        (window as any).__FTY_CHANNEL = 'direct';
                    }
                })
                .catch(() => {});
        }

        if (!nativeDetected) {
            const timer = setTimeout(() => {
                if (detectNativePlatform()) {
                    setIsNative(true);
                }
            }, 200);
            return () => clearTimeout(timer);
        }
    }, []);

    return { isNative, isPlayStore };
}
