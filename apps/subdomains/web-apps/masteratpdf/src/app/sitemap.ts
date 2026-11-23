import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://masteratpdf.atpdev.dev';
  const currentDate = new Date();

  const toolUrls: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...toolUrls,
  ];
}
