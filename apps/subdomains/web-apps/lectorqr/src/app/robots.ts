import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Mediapartners-Google', 'Google-Display-Ads-Bot'],
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://lectorqr.atpdev.dev/sitemap.xml',
  };
}

