import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lectorqr.atpdev.dev';
  const lastModified = new Date();

  // Only high-value content and primary tool routes in sitemap (exclude legal/settings/local-history utilities)
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/generar`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guias`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ];
}
