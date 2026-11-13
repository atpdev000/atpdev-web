import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/', '/oauth2callback/'],
      },
    ],
    sitemap: 'https://almaniq.atpdev.dev/sitemap.xml',
  };
}
