import type { MetadataRoute } from 'next';
import { COLORING_CATEGORIES, COLORING_SHEETS } from '@/data/catalog';

const BASE = 'https://colorear.atpdev.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const coreRoutes = [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${BASE}/en`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${BASE}/dibujos`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/estudio-kdp`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${BASE}/guias`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE}/planes`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE}/cuenta`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE}/sobre-nosotros`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/contacto`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/privacidad`, priority: 0.4, changeFrequency: 'yearly' as const },
    { url: `${BASE}/terminos`, priority: 0.4, changeFrequency: 'yearly' as const },
    { url: `${BASE}/cookies`, priority: 0.4, changeFrequency: 'yearly' as const },
  ];

  const categoryRoutes = COLORING_CATEGORIES.map((cat) => ({
    url: `${BASE}/dibujos/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const sheetRoutes = COLORING_SHEETS.map((sheet) => ({
    url: `${BASE}/dibujos/${sheet.category}/${sheet.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [
    ...coreRoutes.map((r) => ({ ...r, lastModified: now })),
    ...categoryRoutes,
    ...sheetRoutes,
  ];
}
