import type { MetadataRoute } from 'next';

const BASE_URL = 'https://masteratpdf.atpdev.dev';

const TOOL_SLUGS = [
  'merge',
  'split',
  'compress',
  'organize',
  'rotate',
  'page-numbers',
  'watermark',
  'protect',
  'unlock',
  'jpg-to-pdf',
  'pdf-to-jpg',
  'word-to-pdf',
  'pdf-to-word',
  'pdf-to-excel',
  'pdf-to-ppt',
  'pdf-to-text',
  'pdf-to-markdown',
  'ocr',
  'ai-summary',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/sobre-nosotros`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terminos`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    ...TOOL_SLUGS.map((slug) => ({
      url: `${BASE_URL}/tools/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];
}

