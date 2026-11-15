'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export function AdSenseInjector({
    adsenseId,
    clientId,
}: {
    adsenseId?: string | null
    clientId?: string | null
}) {
    const pathname = usePathname() || ''
    const resolvedId = (adsenseId || clientId || 'ca-pub-5414009811868137').trim()

    // Políticas de Google AdSense: No inyectar scripts publicitarios en pantallas puramente legales o sin contenido editorial (ej. Política de Privacidad, Términos, Créditos, CV imprimible).
    const isExcludedUtilityPage = /(?:^|\/)(?:privacy|terms|credits|cv)\/?$/i.test(pathname)

    if (isExcludedUtilityPage || !resolvedId) {
        return null
    }

    return (
        <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    )
}

export default AdSenseInjector
