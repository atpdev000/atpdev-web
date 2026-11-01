import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';

export function usePlatform() {
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const cap = (window as any).Capacitor;
        const nativeCheck = Boolean(
            Capacitor.isNativePlatform() ||
            cap?.isNativePlatform?.() ||
            cap?.getPlatform?.() === 'android' ||
            cap?.getPlatform?.() === 'ios'
        );
        console.log('[usePlatform] isNative:', nativeCheck, 'Capacitor.getPlatform():', Capacitor.getPlatform(), 'window.Capacitor:', Boolean(cap));
        setIsNative(nativeCheck);
    }, []);

    return { isNative };
}
