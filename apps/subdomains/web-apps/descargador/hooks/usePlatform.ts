import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';

export function usePlatform() {
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        // Check if running on native platform (Android or iOS)
        setIsNative(Capacitor.isNativePlatform());
    }, []);

    return { isNative };
}
