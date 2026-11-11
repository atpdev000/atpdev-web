import { MetadataRoute } from 'next'
import { FEATURES } from '@/lib/featureFlags'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://descargador.atpdev.dev'
    const disallowRules = ['/api/', '/admin/']
    if (!FEATURES.YOUTUBE_ENABLED) {
        disallowRules.push('/tools/youtube')
    }

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: disallowRules,
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
