import { MetadataRoute } from 'next';
import { getJobPostings } from '@atpdev/database';
import { SITE_URL } from '@/lib/siteConfig';
import { getAllGuias } from '@/data/guias';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobPostings();
  const guias = getAllGuias();
  const baseUrl = SITE_URL;

  const todayIso = new Date().toISOString().split('T')[0];

  // Google AdSense & Search Central: Solo indexar en el sitemap ofertas VIGENTES con alto valor real
  // Las ofertas finalizadas se excluyen del sitemap para no diluir el crawl budget con contenido expirado
  const activeJobs = jobs.filter((job) => {
    const isExpired = job.status === 'Finalizado' || (job.end_date && job.end_date.trim() < todayIso);
    return !isExpired;
  });

  const jobUrls = activeJobs.map((job) => ({
    url: `${baseUrl}/empleos/${job.slug}`,
    lastModified: new Date(job.created_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const guiasUrls = guias.map((guia) => ({
    url: `${baseUrl}/guias/${guia.slug}`,
    lastModified: new Date(guia.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  const toolUrls = [
    '/empleos',
    '/match-cv',
    '/guias',
    '/calculadora-sueldo',
    '/comparador-regimenes',
    '/crear-cv-cas',
    '/plantillas-anexos',
    '/preguntas-entrevista-cas',
    '/simulador-entrevista-ia',
    '/organizaciones',
    '/publicar-empleo',
    '/quienes-somos',
    '/politica-de-privacidad',
    '/terminos-y-condiciones',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route.includes('politica') || route.includes('terminos') ? 0.6 : 0.95,
  }));

  const regionUrls = [
    'lima', 'callao', 'arequipa', 'cusco', 'la-libertad', 'piura', 'junin', 'puno',
    'lambayeque', 'san-martin', 'ancash', 'ica', 'cajamarca', 'loreto',
    'ayacucho', 'huanuco', 'tacna', 'ucayali', 'apurimac', 'amazonas',
    'huancavelica', 'moquegua', 'pasco', 'tumbes', 'madre-de-dios', 'remoto'
  ].map((region) => ({
    url: `${baseUrl}/empleos/en/${region}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  const categoriaUrls = [
    'cas', '728', 'privado', 'practicas', 'locacion'
  ].map((cat) => ({
    url: `${baseUrl}/convocatorias/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    ...toolUrls,
    ...guiasUrls,
    ...regionUrls,
    ...categoriaUrls,
    ...jobUrls,
  ];
}
