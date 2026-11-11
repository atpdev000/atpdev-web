import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const routes = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/sorteos/nuevo', priority: 0.95, freq: 'daily' as const },
    { path: '/apps/sorteo-instagram', priority: 0.95, freq: 'daily' as const },
    { path: '/herramientas/ruleta', priority: 0.95, freq: 'daily' as const },
    { path: '/herramientas/lista', priority: 0.95, freq: 'daily' as const },
    { path: '/herramientas/dados', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/moneda', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/numeros', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/equipos', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/amigo-invisible', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/raspa-gana', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/trivia', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/bases-legales', priority: 0.85, freq: 'weekly' as const },
    { path: '/herramientas/engagement', priority: 0.85, freq: 'weekly' as const },
    { path: '/herramientas/hashtags', priority: 0.85, freq: 'weekly' as const },
    { path: '/verificar', priority: 0.9, freq: 'daily' as const },
    { path: '/sorteos/extension-install', priority: 0.85, freq: 'weekly' as const },
    { path: '/planes', priority: 0.85, freq: 'weekly' as const },
    { path: '/blog', priority: 0.9, freq: 'daily' as const },
    { path: '/quienes-somos', priority: 0.8, freq: 'monthly' as const },
    { path: '/contacto', priority: 0.8, freq: 'monthly' as const },
    { path: '/terminos-y-condiciones', priority: 0.5, freq: 'monthly' as const },
    { path: '/politica-de-privacidad', priority: 0.5, freq: 'monthly' as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticEntries, ...blogEntries];
}
