import type { MetadataRoute } from 'next';
import { COMPUTING_MONTHS } from '@/lib/computing-archive';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://codehistory.atpdev.dev';
  const lastModified = new Date('2026-11-15');

  const monthlyArchiveRoutes: MetadataRoute.Sitemap = COMPUTING_MONTHS.map((month) => ({
    url: `${baseUrl}/archivo/${month.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/archivo`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...monthlyArchiveRoutes,
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
