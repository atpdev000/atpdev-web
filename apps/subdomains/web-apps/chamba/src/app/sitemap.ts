import { MetadataRoute } from 'next';
import { getJobPostings } from '@atpdev/database';
import { SITE_URL } from '@/lib/siteConfig';
import { getAllGuias } from '@/data/guias';

// Revalidar el sitemap cada 30 minutos para que las nuevas convocatorias aprobadas entren a Google Search Console sin recompilar
export const revalidate = 1800;

const REGION_MATCH_MAP: Record<string, string> = {
  lima: 'lima',
  callao: 'callao',
  arequipa: 'arequipa',
  cusco: 'cusco',
  'la-libertad': 'la libertad',
  piura: 'piura',
  junin: 'junín',
  puno: 'puno',
  lambayeque: 'lambayeque',
  'san-martin': 'san martín',
  ancash: 'áncash',
  ica: 'ica',
  cajamarca: 'cajamarca',
  loreto: 'loreto',
  ayacucho: 'ayacucho',
  huanuco: 'huánuco',
  tacna: 'tacna',
  ucayali: 'ucayali',
  apurimac: 'apurímac',
  amazonas: 'amazonas',
  huancavelica: 'huancavelica',
  moquegua: 'moquegua',
  pasco: 'pasco',
  tumbes: 'tumbes',
  'madre-de-dios': 'madre de dios',
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

  // Google AdSense & Search Central: Solo indexar en el sitemap ofertas VIGENTES (excluyendo Pendientes y Finalizadas)
  // Evita el error crítico de Search Console: "La URL enviada está marcada como 'noindex'"
  const activeJobs = jobs.filter((job) => {
    if (job.status !== 'Vigente') return false;
    const isExpired = Boolean(job.end_date && job.end_date.trim() < todayIso);
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

  // Solo incluir en sitemap regiones que tengan al menos 1 convocatoria vigente (coherente con robots index de empleos/en/[region])
  const regionUrls = Object.entries(REGION_MATCH_MAP)
    .filter(([regionKey, regionName]) =>
      activeJobs.some((job) => {
        const jobRegion = (job.region || '').toLowerCase();
        if (regionKey === 'remoto') {
          return jobRegion.includes('remoto') || jobRegion.includes('nacional') || jobRegion.includes('teletrabajo');
        }
        if (regionKey === 'lima') {
          return jobRegion.includes('lima') || jobRegion.includes('callao');
        }
        return jobRegion.includes(regionName);
      })
    )
    .map(([region]) => ({
      url: `${baseUrl}/empleos/en/${region}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

  // Solo incluir en sitemap categorías con al menos 1 convocatoria vigente (coherente con robots index de convocatorias/[categoria])
  const categoriaUrls = Object.entries(CATEGORIA_MATCH_MAP)
    .filter(([, sectorMatch]) =>
      activeJobs.some((job) => (job.sector_type || '').toLowerCase().includes(sectorMatch))
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
