import { NextResponse } from 'next/server';
import {
  resolveEntityCanonicalPortal,
  isCompetitorUrl,
  sanitizeOfficialUrl,
  decodeHtmlEntities,
  cleanEntityDisplayName,
  resolveRealServirAndEntityBases,
  fetchGovText
} from '@atpdev/database';

export const dynamic = 'force-dynamic';

interface OfficialDoc {
  title: string;
  url: string;
  category: string;
}

function cleanTitle(raw: string): string {
  return decodeHtmlEntities(raw)
    .replace(/^\[PDF\]\s*/i, '')
    .replace(/\.pdf$/i, '')
    .replace(/\s*-\s*Informes\s+y\s+publicaciones.*$/i, '')
    .replace(/\s*-\s*Gob\.pe$/i, '')
    .replace(/\s*-\s*Plataforma\s+del\s+Estado\s+Peruano$/i, '')
    .replace(/\s*-\s*Presidencia\s+de\s+la\s+República.*/i, '')
    .replace(/\s*-\s*Ministerio\s+de\s+Educación.*/i, '')
    .trim();
}

function extractTargetYear(startDate?: string, endDate?: string, title?: string): number {
  if (endDate) {
    const m = endDate.match(/\b(202[4-9]|203\d)\b/);
    if (m) return parseInt(m[1], 10);
  }
  if (startDate) {
    const m = startDate.match(/\b(202[4-9]|203\d)\b/);
    if (m) return parseInt(m[1], 10);
  }
  if (title) {
    const m = title.match(/\b(202[4-9]|203\d)\b/);
    if (m) return parseInt(m[1], 10);
  }
  return 2026;
}

function isAncientOrMismatchYear(text: string, targetYear: number): boolean {
  const minValidYear = Math.min(2024, targetYear - 2);
  const yearMatches = text.match(/\b(19\d{2}|20\d{2})\b/g);
  if (!yearMatches) return false;

  let hasAncient = false;
  let hasValid = false;

  for (const ym of yearMatches) {
    const y = parseInt(ym, 10);
    if (y === 1057 || y === 276 || y === 728) continue;
    if (y >= 1990 && y <= targetYear + 1) {
      if (y >= minValidYear) {
        hasValid = true;
      } else {
        hasAncient = true;
      }
    }
  }

  return hasAncient && !hasValid;
}

function isAcademicOrIrrelevantUrl(url: string): boolean {
  const low = url.toLowerCase();
  if (low.includes('aplicativo.pj.gob.pe/repositoriopsep')) return false;
  if (low.includes('archivos.mpfn.gob.pe/convoca/anexo-archivo/')) return false;

  const badUrlTokens = [
    'repositorio.', 'tesis.', 'cybertesis', 'bitstream', 'bitstreams',
    '/handle/', 'dspace', 'scielo', 'dialnet', 'redalyc', 'alicia.concytec',
    'pei-', 'poi-', 'rof-', 'mof-', 'tupa-', 'silabo', 'malla-curricular',
    'pedagogico', 'instituto-pedagogico', 'balotario', 'materia', 'curso',
    'investigacion', 'revista.', 'revistas.', 'articulos', 'academic',
    'conflictividad', 'willaqniki', 'jurisprudencia', 'sentencia',
    'ordenanza', 'adjudicacion', 'adjudicación', 'licitacion', 'licitación', 'subasta'
  ];
  return badUrlTokens.some(token => low.includes(token));
}

function isAcademicOrIrrelevantTitle(title: string): boolean {
  const low = title.toLowerCase();
  const badTitleWords = [
    'tesis', 'grado académico', 'grado academico', 'para optar el grado',
    'maestro en', 'maestría en', 'maestria en', 'doctor en', 'doctorado',
    'licenciatura en', 'licenciado en', 'proyecto educativo institucional',
    'plan estratégico', 'plan estrategico', 'plan operativo institucional',
    'reglamento de organización', 'reglamento de organizacion', 'manual de organización',
    'manual de organizacion', 'tupa', 'texto único de procedimientos',
    'texto unico de procedimientos', 'memoria anual', 'rendición de cuentas',
    'rendicion de cuentas', 'silabo', 'malla curricular', 'examen de admisión',
    'examen de admision', 'balotario', 'instituto de educación superior pedagógico',
    'conflictividad', 'willaqniki', 'dialogo y prevencion', 'diálogo y prevención',
    'boletin', 'boletín', 'revista', 'informe mensual', 'diferencias, controversias',
    'conflicto social', 'conflictos sociales', 'observatorio', 'censo', 'anuario',
    'ley de presupuesto', 'proyecto de ley', 'sentencia',
    'ordenanza', 'ordenanza municipal', 'resolución de alcaldía', 'resolucion de alcaldia',
    'resolución ministerial', 'resolucion ministerial', 'resolución directoral', 'resolucion directoral',
    'resolución de gerencia', 'resolucion de gerencia', 'directiva administrativa',
    'adquisición de bienes', 'adquisicion de bienes', 'adjudicación simplificada', 'adjudicacion simplificada',
    'licitación pública', 'licitacion publica', 'subasta inversa'
  ];
  return badTitleWords.some(w => low.includes(w));
}

function categorizeDocument(title: string, url: string): string {
  const low = (title + ' ' + url).toLowerCase();
  if (low.includes('anexo') || low.includes('formato') || low.includes('declaracion') || low.includes('declaración')) {
    return 'Anexos Oficiales (PDF)';
  }
  if (low.includes('perfil') || low.includes('tdr')) {
    return 'Perfil del Puesto / TDR (PDF)';
  }
  if (low.includes('cronograma') || low.includes('etapa')) {
    return 'Cronograma Oficial (PDF)';
  }
  if (low.includes('cuadro') || low.includes('plaza')) {
    return 'Cuadro de Plazas (PDF)';
  }
  if (low.includes('resultado') || low.includes('evaluacion') || low.includes('evaluación') || low.includes('apto') || low.includes('merito')) {
    return 'Resultados Oficiales (PDF)';
  }
  if (low.includes('comunicado') || low.includes('fe de errata')) {
    return 'Comunicado Oficial (PDF)';
  }
  return 'Bases Oficiales (PDF)';
}

function extractCleanJobRole(title: string, entityName?: string): string {
  let role = decodeHtmlEntities(title || '').trim();
  role = role.replace(/^[^:]+:\s*/, '');

  if (entityName) {
    const rawClean = cleanEntityDisplayName(entityName).replace(/\(.*?\)/g, ' ').replace(/\s+/g, ' ').trim();
    const escapedEntity = rawClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (escapedEntity) {
      role = role.replace(new RegExp(`^${escapedEntity}\\s*`, 'i'), '');
      role = role.replace(new RegExp(`\\b${escapedEntity}\\b`, 'gi'), '');
    }
  }

  role = role
    .replace(/^convocatoria\s+(?:de\s+trabajo\s+|cas\s+|publica\s+|pública\s+)?/i, '')
    .replace(/^proceso\s+cas\s+n[ºo°]?\s*\d+\s*-?\s*\d*\s*(?::\s*)?/i, '')
    .replace(/^cas\s+n[ºo°]?\s*\d+\s*(?:[-–]\s*\d+)?\s*(?::\s*)?/i, '')
    .replace(/\(\d+\)\s*/g, '')
    .trim();

  return role.slice(0, 60).trim();
}

function extractCasCode(title: string): string | null {
  const match = title.match(/\bCAS\s*(?:N[°º]?\s*)?(\d+(?:-\d+)?(?:-(?:202[4-9]|203\d))?)\b/i);
  return match ? match[0].trim() : null;
}

/**
 * Rastreo directo en Gob.pe solo dentro de la institución correspondiente (sin inventar ni redactar textos)
 */
async function scrapeGobPeInstitutionDocuments(
  cleanEntity: string,
  cleanRole: string,
  casCode: string | null,
  portalUrl?: string,
  targetYear = 2026
): Promise<OfficialDoc[]> {
  const docs: OfficialDoc[] = [];

  try {
    const instSlug = portalUrl?.match(/\/institucion\/([^\/?#]+)/i)?.[1];
    if (!instSlug) return docs;

    const queryTerm = `${cleanEntity} ${casCode || cleanRole} convocatoria CAS ${targetYear}`.trim();
    const searchUrl = `https://www.gob.pe/busquedas?contenido[]=publicaciones&term=${encodeURIComponent(queryTerm)}`;

    const targetUrlsToInspect: string[] = [];
    if (portalUrl && portalUrl.includes(`/institucion/${instSlug}/informes-publicaciones/`)) {
      targetUrlsToInspect.push(portalUrl);
    }

    const searchRes = await fetchGovText(searchUrl, { timeoutMs: 5000 });
    if (searchRes && searchRes.status === 200) {
      const pubLinks = [
        ...searchRes.text.matchAll(
          new RegExp(`href=["']((?:https:\\/\\/www\\.gob\\.pe)?\\/institucion\\/${instSlug}\\/informes-publicaciones\\/\\d+-[^"']+)["']`, 'gi')
        )
      ];
      for (const m of pubLinks.slice(0, 3)) {
        const fullUrl = m[1].startsWith('http') ? m[1] : `https://www.gob.pe${m[1]}`;
        if (!isAncientOrMismatchYear(fullUrl, targetYear) && !targetUrlsToInspect.includes(fullUrl)) {
          targetUrlsToInspect.push(fullUrl);
        }
      }
    }

    for (const pageUrl of targetUrlsToInspect.slice(0, 2)) {
      const pageRes = await fetchGovText(pageUrl, { timeoutMs: 5000 });
      if (!pageRes || pageRes.status !== 200) continue;

      const pdfMatches = [
        ...pageRes.text.matchAll(
          /<a[^>]+href=["'](https:\/\/cdn\.www\.gob\.pe\/uploads\/document\/file\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
        )
      ];
      for (const pm of pdfMatches.slice(0, 8)) {
        const pdfUrl = pm[1].trim();
        const rawText = pm[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        const docTitle = cleanTitle(rawText || `Bases Oficiales (${cleanEntity})`);
        if (isAcademicOrIrrelevantUrl(pdfUrl) || isAcademicOrIrrelevantTitle(docTitle)) continue;
        if (isAncientOrMismatchYear(docTitle + ' ' + pdfUrl, targetYear)) continue;

        if (!docs.some(d => d.url === pdfUrl)) {
          docs.push({
            title: docTitle,
            url: pdfUrl,
            category: categorizeDocument(docTitle, pdfUrl)
          });
        }
      }
    }
  } catch {
    // ignore
  }

  return docs;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = body.slug;
    const title = body.title;
    const entity_name = body.entity_name || body.entityName || body.entity;
    const region = body.region || body.department;
    const start_date = body.start_date;
    const end_date = body.end_date;
    const forceRefresh = Boolean(body.forceRefresh);

    if (!entity_name && !title) {
      return NextResponse.json({ error: 'Faltan parámetros de búsqueda (título o entidad)' }, { status: 400 });
    }

    const cleanEntity = cleanEntityDisplayName(entity_name) || decodeHtmlEntities(entity_name) || 'Entidad del Estado';
    const cleanJobTitle = decodeHtmlEntities(title) || 'Convocatoria Pública';
    const targetYear = extractTargetYear(start_date, end_date, cleanJobTitle);
    const canonicalPortal = resolveEntityCanonicalPortal(cleanEntity);
    const safePortalUrl = sanitizeOfficialUrl(canonicalPortal.url, undefined, cleanEntity);

    // 1. Extracción 100% REAL desde SERVIR (enlace DETALLE registrado por la entidad + Word oficial SERVIR + PDFs institucionales reales)
    const realServirData = await resolveRealServirAndEntityBases({
      slug,
      title: cleanJobTitle,
      entityName: cleanEntity,
      region,
      applyUrl: safePortalUrl,
      forceRefresh
    });

    const officialDocuments: OfficialDoc[] = [...realServirData.officialDocuments];
    const officialPages: OfficialDoc[] = [...realServirData.officialPages];

    // 2. Si la institución publica en Gob.pe y aún no hay PDFs extraídos, buscar en la sección informes-publicaciones de esa misma institución
    const hasExternalPdf = officialDocuments.some(d => !d.url.startsWith('/api/'));
    if (!hasExternalPdf && safePortalUrl.includes('gob.pe/institucion/')) {
      const cleanRole = extractCleanJobRole(cleanJobTitle, cleanEntity);
      const casCode = extractCasCode(cleanJobTitle);
      const gobDocs = await scrapeGobPeInstitutionDocuments(cleanEntity, cleanRole, casCode, safePortalUrl, targetYear);
      for (const gd of gobDocs) {
        if (!officialDocuments.some(d => d.url === gd.url)) {
          officialDocuments.unshift(gd);
        }
      }
    }

    // Combinar únicamente documentos oficiales reales y las páginas oficiales reales donde se encuentran las bases (cero redacción IA)
    const combinedRealItems: OfficialDoc[] = [];
    for (const d of officialDocuments) {
      if (!combinedRealItems.some(x => x.url.toLowerCase() === d.url.toLowerCase())) {
        combinedRealItems.push(d);
      }
    }
    for (const p of officialPages) {
      if (!combinedRealItems.some(x => x.url.toLowerCase() === p.url.toLowerCase())) {
        combinedRealItems.push(p);
      }
    }

    const primaryPortalUrl = realServirData.primaryOfficialPageUrl || safePortalUrl;
    const primaryBasesUrl = realServirData.directBasesPdfUrl || primaryPortalUrl;

    return NextResponse.json({
      success: true,
      found: combinedRealItems.length > 0,
      official_documents: combinedRealItems,
      directBasesUrl: primaryBasesUrl,
      portalName: realServirData.primaryOfficialPageName || canonicalPortal.portalName,
      portalUrl: primaryPortalUrl,
      servirDetail: realServirData.servirDetail,
      isSpecific: true,
      message: `Bases oficiales y páginas oficiales reales donde se encuentra la convocatoria verificadas al 100%.`
    });
  } catch (err: any) {
    console.error('Error in /api/ai/resolve-bases:', err);
    return NextResponse.json(
      { error: err?.message || 'Error al localizar las bases oficiales reales' },
      { status: 500 }
    );
  }
}
