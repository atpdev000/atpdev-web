import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Google-InspectionTool',
          'Mediapartners-Google',
          'AdsBot-Google',
          'AdsBot-Google-Mobile',
          'Screaming Frog SEO Spider',
        ],
        allow: ['/', '/api/bases-doc/'],
        disallow: ['/api/ai/', '/api/admin/', '/admin/'],
      },
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'PetalBot',
          'Bytespider',
          'Amazonbot'
        ],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: ['/', '/api/bases-doc/'],
        disallow: ['/api/ai/', '/api/admin/', '/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
