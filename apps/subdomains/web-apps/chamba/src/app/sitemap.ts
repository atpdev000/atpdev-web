import { MetadataRoute } from 'next';
import { getJobPostings } from '@atpdev/database';
import { SITE_URL } from '@/lib/siteConfig';
import { getAllGuias } from '@/data/guias';
import { isEnrichedJobPosting } from '@/lib/jobQuality';

export const dynamic = 'force-dynamic';

const REGION_MATCH_MAP: Record<string, string> = {
  lima: 'lima',
  arequipa: 'arequipa',
  'la-libertad': 'la libertad',
  piura: 'piura',
  remoto: 'remoto',
};

const CATEGORIA_MATCH_MAP: Record<string, string> = {
  cas: 'cas',
  '728': '728',
  privado: 'privado',
  practicas: 'prácticas',
  locacion: 'locación',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobPostings();
  const guias = getAllGuias();
  const baseUrl = SITE_URL;

  const todayIso = new Date().toISOString().split('T')[0];

  const activeJobs = jobs.filter((job) => {
    if (job.status !== 'Vigente') return false;
    const isExpired = Boolean(job.end_date && job.end_date.trim() < todayIso);
    return !isExpired;
  });

  const enrichedJobs = activeJobs.filter(isEnrichedJobPosting);

  const jobUrls = enrichedJobs.map((job) => ({
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

  // Only high-depth editorial & Pillar tool routes (>= 350 words)
  const toolUrls = [
    '/empleos',
    '/guias',
    '/calculadora-sueldo',
    '/crear-cv-cas',
    '/plantillas-anexos',
    '/preguntas-entrevista-cas',
    '/comparador-regimenes',
    '/match-cv',
    '/simulador-entrevista-ia',
    '/quienes-somos',
    '/organizaciones',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  // Only index regions with >= 5 enriched active jobs so regional landing pages are always content-rich
  const regionUrls = Object.entries(REGION_MATCH_MAP)
    .filter(([regionKey, regionName]) => {
      const count = enrichedJobs.filter((job) => {
        const jobRegion = (job.region || '').toLowerCase();
        if (regionKey === 'remoto') {
          return jobRegion.includes('remoto') || jobRegion.includes('nacional') || jobRegion.includes('teletrabajo');
        }
        if (regionKey === 'lima') {
          return jobRegion.includes('lima') || jobRegion.includes('callao');
        }
        return jobRegion.includes(regionName);
      }).length;
      return count >= 5;
    })
    .map(([region]) => ({
      url: `${baseUrl}/empleos/en/${region}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

  const categoriaUrls = Object.entries(CATEGORIA_MATCH_MAP)
    .filter(([, sectorMatch]) =>
      enrichedJobs.filter((job) => (job.sector_type || '').toLowerCase().includes(sectorMatch)).length >= 3
    )
    .map(([cat]) => ({
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
