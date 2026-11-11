/**
 * Utilidades de limpieza de texto y validación de URLs institucionales para Chamba Pro.
 * Diseñado para ser 100% seguro en el navegador (Client Components) sin dependencias de Node.js (fs, path).
 */

const AGGREGATOR_AND_COMPETITOR_DOMAINS = [
  'opcionempleo',
  'jooble',
  'convocatoriasdetrabajo',
  'portaltrabajos',
  'portaltrabajo',
  'convocatorias.pe',
  'convocatoria.pe',
  'convocatorias202',
  'convocatoriasperu',
  'deperu',
  'empleosperu',
  'chamba.pe',
  'chambasperu',
  'chambita',
  'bolsadetrabajo',
  'bolsatrabajo',
  'agendapublica',
  'postula.pe',
  'concursocashoy',
  'cas-peru',
  'basesconvocatorias',
  'convocatoriascas',
  'blogspot',
  'trabajaen',
  'buscojobs',
  'trovit',
  'mitula',
  'laborum',
];

export function decodeHtmlEntities(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/g, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return code > 0 ? String.fromCharCode(code) : _;
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return code > 0 ? String.fromCharCode(code) : _;
    })
    .replace(/P\uFFFDBLIC/gi, 'PÚBLIC')
    .replace(/NACI\uFFFDN/gi, 'NACIÓN')
    .replace(/EDUCACI\uFFFDN/gi, 'EDUCACIÓN')
    .replace(/DIRECCI\uFFFDN/gi, 'DIRECCIÓN')
    .replace(/ADMINISTRACI\uFFFDN/gi, 'ADMINISTRACIÓN')
    .replace(/GESTI\uFFFDN/gi, 'GESTIÓN')
    .replace(/REGI\uFFFDN/gi, 'REGIÓN')
    .replace(/PER\uFFFD/gi, 'PERÚ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanEntityDisplayName(raw?: string): string {
  const decoded = decodeHtmlEntities(raw);
  if (!decoded) return '';
  const ueMatch = decoded.match(/^UNIDAD\s+EJECUTORA(?:\s+N?[°º]?\s*\d+)?\s*:\s*["«']?([^"»']+)["»']?$/i);
  if (ueMatch && ueMatch[1] && ueMatch[1].trim().length >= 5) {
    return ueMatch[1].trim();
  }
  return decoded.replace(/^["']+|["']+$/g, '').trim();
}

export function isCompetitorUrl(url?: string): boolean {
  if (!url) return false;
  const low = url.toLowerCase().trim();

  // Enlaces directos a plataformas legítimas de empleo
  if (
    (low.includes('bumeran.com.pe/empleos/') ||
      low.includes('computrabajo.com.pe/ofertas-de-trabajo/') ||
      low.includes('hiringroom.com/jobs/')) &&
    !low.includes('convocatoriasdetrabajo') &&
    !low.includes('portaltrabajos') &&
    !low.includes('convocatorias.pe')
  ) {
    return false;
  }

  // Comprobar lista de agregadores
  if (AGGREGATOR_AND_COMPETITOR_DOMAINS.some((domain) => low.includes(domain))) {
    return true;
  }

  // Heurística de seguridad
  const isGovOrDoc =
    low.includes('.gob.pe') ||
    low.includes('.edu.pe') ||
    low.includes('.mil.pe') ||
    low.includes('drive.google.com') ||
    low.includes('docs.google.com') ||
    low.includes('atpdev.dev');

  if (!isGovOrDoc) {
    if (
      low.includes('convocatorias.') ||
      low.includes('convocatoria.') ||
      low.includes('deperu.com') ||
      low.includes('portaltrabajo') ||
      low.includes('chambasperu')
    ) {
      return true;
    }
  }

  return false;
}

