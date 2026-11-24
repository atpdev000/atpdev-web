import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                disallow: '/',
            },
            {
                userAgent: 'Mediapartners-Google',
                disallow: '/',
            },
            {
                userAgent: 'Googlebot',
                disallow: '/',
            },
        ],
    }
}
