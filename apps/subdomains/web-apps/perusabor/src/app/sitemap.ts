import type { MetadataRoute } from 'next';
import { PERUVIAN_RECIPES } from '@/data/recipes';

const BASE_URL = 'https://perusabor.atpdev.dev';

// All culinary tools, recipe hubs and editorial pages (every route verified >= 330 words)
const ROUTES = [
  '',
  '/recetas',
  '/escalador',
  '/costeo',
  '/menus',
  '/inventario',
  '/restaurante',
  '/chef-ia',
  '/sobre-nosotros',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.85,
  }));

  const recipeEntries: MetadataRoute.Sitemap = PERUVIAN_RECIPES.map((recipe) => ({
    url: `${BASE_URL}/recetas/${recipe.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...staticEntries, ...recipeEntries];
}
