import { MetadataRoute } from 'next';
import { getProjects } from '@atpdev/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://www.atpdev.dev';
  // Enfocar el sitemap en idiomas principales y URLs con contenido real (evitando páginas legales finas y traducciones masivas de bajo valor)
  const langs = ['en'];
  const allLangs = ['es', ...langs];

  const buildAlternates = (path: string) => {
    const languages: Record<string, string> = {
      "x-default": `${BASE_URL}${path}`
    };
    allLangs.forEach(l => {
      const prefix = l === 'es' ? '' : `/${l}`;
      languages[l] = `${BASE_URL}${prefix}${path}`;
    });
    return { languages };
  };
  
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: buildAlternates(''),
    },
    {
      url: `${BASE_URL}/sobre-mi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: buildAlternates('/sobre-mi'),
    },
  ];

  const langRoutes: MetadataRoute.Sitemap = langs.flatMap(lang => [
    {
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: buildAlternates(''),
    },
    {
      url: `${BASE_URL}/${lang}/sobre-mi`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: buildAlternates('/sobre-mi'),
    },
  ]);

  // Dynamic projects routes (solo fichas de producto, excluyendo subpáginas legales/créditos con noindex)
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const allProjects = await getProjects();
    const projects = allProjects.filter(p => p.status !== 'Privado');
    
    const esProjectRoutes = projects.filter(p => p.slug).map(p => ({
      url: `${BASE_URL}/apps/${p.slug}`,
      lastModified: new Date(p.created_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: buildAlternates(`/apps/${p.slug}`),
    }));

    const otherLangProjectRoutes = langs.flatMap(lang => 
      projects.filter(p => p.slug).map(p => ({
        url: `${BASE_URL}/${lang}/apps/${p.slug}`,
        lastModified: new Date(p.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: buildAlternates(`/apps/${p.slug}`),
      }))
    );

    projectRoutes = [...esProjectRoutes, ...otherLangProjectRoutes];
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  return [...mainRoutes, ...langRoutes, ...projectRoutes];
}
