import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';

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
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const check = () => {
            const nativeCheck = detectNativePlatform();
            if (nativeCheck) {
                setIsNative(true);
            }
            return nativeCheck;
        };
        if (!check()) {
            const timer = setTimeout(check, 200);
            return () => clearTimeout(timer);
        }
    }, []);

    return { isNative };
}
