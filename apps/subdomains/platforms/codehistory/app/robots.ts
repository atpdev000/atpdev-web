import type { MetadataRoute } from 'next';

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
        disallow: ['/api/', '/studio/', '/oauth2callback/'],
      },
    ],
    sitemap: 'https://codehistory.atpdev.dev/sitemap.xml',
  };
}

