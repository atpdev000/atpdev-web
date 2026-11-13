import type { MetadataRoute } from 'next';

const BASE_URL = 'https://perusabor.atpdev.dev';

const ROUTES = [
  '',
  '/recetas',
  '/escalador',
  '/costeo',
  '/menus',
  '/inventario',
  '/restaurante',
  '/chef-ia',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}

