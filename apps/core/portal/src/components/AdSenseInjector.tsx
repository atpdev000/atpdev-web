'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export function AdSenseInjector({
    adsenseId,
    clientId,
    lang,
}: {
    adsenseId?: string | null
    clientId?: string | null
    lang?: string
}) {
    const pathname = usePathname() || ''
    const resolvedId = (adsenseId || clientId || 'ca-pub-5414009811868137').trim()

    // Políticas de Google AdSense: No inyectar scripts publicitarios en pantallas legales, de contacto, rutas noindex o idiomas no indexables.
    const isExcludedUtilityPage = /(?:^|\/)(?:privacy|terms|cookies|politica-de-cookies|contacto|contact|credits|cv)\/?$/i.test(pathname)
    const isNonIndexableLocale =
        (lang ? !['es', 'en'].includes(lang) : false) ||
        /^\/(?:ru|hi|zh|fr|de|pt|ja)(?:\/|$)/i.test(pathname)

    if (isExcludedUtilityPage || isNonIndexableLocale || !resolvedId) {
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
