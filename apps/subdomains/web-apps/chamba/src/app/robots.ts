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
        ],
        allow: '/',
        disallow: ['/api/', '/admin/'],
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
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
