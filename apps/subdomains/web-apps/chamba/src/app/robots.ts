import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Mediapartners-Google', 'Google-Display-Ads-Bot'],
        allow: '/',
      },
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Google-InspectionTool',
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
  };
}
