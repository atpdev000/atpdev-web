import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['*', 'Googlebot', 'Mediapartners-Google', 'Google-Display-Ads-Bot'],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://masteratpdf.atpdev.dev/sitemap.xml',
  };
}
