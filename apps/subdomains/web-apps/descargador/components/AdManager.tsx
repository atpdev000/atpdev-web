'use client'

import Script from 'next/script'
import { usePlatform } from '@/hooks/usePlatform'
import AdMobBanner from '@/components/AdMobBanner'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AdManager() {
    const { isNative } = usePlatform()
    const pathname = usePathname()

    // 🔄 Refrescar anuncios de Ezoic al cambiar de página
    useEffect(() => {
        if (!isNative && typeof window !== 'undefined' && window.ezstandalone?.showAds) {
            window.ezstandalone.cmd.push(function () {
                window.ezstandalone?.showAds();
            });
        }
    }, [pathname, isNative]);

    return (
        <>
            {/* WEB: Ezoic Script se carga en el layout.tsx directamente */}

            {/* APP: Mostrar AdMob solo si ES nativo */}
            {isNative && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
                    <AdMobBanner />
                </div>
            )}
        </>
    )
}
