import { NextResponse } from 'next/server';
import { resolveEntityCanonicalPortal, isCompetitorUrl, sanitizeOfficialUrl } from '@atpdev/database';

export const dynamic = 'force-dynamic';

interface OfficialDoc {
  title: string;
  url: string;
  category: string;
}

function cleanTitle(raw: string): string {
  return raw
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
  const minValidYear = targetYear - 1; // Permite publicaciones de fines del año anterior

  // Detectar años en rutas o títulos ej: /2013/, _2013., -2013-, Julio 2013
  const yearMatches = text.match(/\b(19\d{2}|20\d{2})\b/g);
  if (!yearMatches) return false;

  let hasAncient = false;
  let hasValid = false;

  for (const ym of yearMatches) {
    const y = parseInt(ym, 10);
    // Filtrar leyes o decretos típicos del estado (ej. Ley 27444, D.L. 1057, Ley 30057)
    if (y === 1057 || y === 276 || y === 728) continue;
    if (y >= 1990 && y <= targetYear + 1) {
      if (y >= minValidYear) {
        hasValid = true;
      } else {
        hasAncient = true;
      }
    }
  }

  // Si contiene un año viejo (como 2013, 2015, 2018) y no contiene el año de la convocatoria, es inválido
  if (hasAncient && !hasValid) {
    return true;
  }

  return false;
}

function isAcademicOrIrrelevantUrl(url: string): boolean {
  const low = url.toLowerCase();
  // Excepción legítima: Repositorio del Sistema PSEP del Poder Judicial
  if (low.includes('aplicativo.pj.gob.pe/repositoriopsep')) return false;

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
    'licitación pública', 'licitacion publica', 'subasta inversa', 'fe de erratas', 'fe de errata'
  ];
  return badTitleWords.some(w => low.includes(w));
}

function hasHiringSignal(title: string, url: string, description?: string): boolean {
  const low = (title + ' ' + url + ' ' + (description || '')).toLowerCase();

  const hiringKeywords = [
    'bases',
    'convocatoria',
    'proceso cas',
    'concurso cas',
    'concurso publico',
    'concurso público',
    'seleccion de personal',
    'selección de personal',
    'proceso de seleccion',
    'proceso de selección',
    'concurso de meritos',
    'concurso de méritos',
    'contratacion cas',
    'contratación cas',
    'contratacion administrativa',
    'contratación administrativa',
    'cas transitorio',
    'cas confianza',
    'personal cas',
    'locacion de servicios',
    'locación de servicios',
    'locador de servicios',
    'anexo',
    'cronograma',
    'perfil de puesto',
    'perfil del puesto',
    'tdr',
    'terminos de referencia',
    'términos de referencia',
    'termino de referencia',
    'término de referencia',
    'comunicado cas',
    'evaluacion curricular',
    'evaluación curricular',
    'personal apto',
    'cuadro de merito',
    'cuadro de mérito',
    'postulacion',
    'postulación',
    'inscripcion cas',
    'inscripción cas',
    'hoja de vida cas',
    'formato de postulacion',
    'formato de postulación',
    'plazas vacantes',
    'puesto vacante',
    'plazas presupuestadas',
    'contratacion laboral',
    'contratación laboral'
  ];

  if (hiringKeywords.some(k => low.includes(k))) return true;
  if (/\bcas\b/i.test(title) || /\bcas\b/i.test(url)) return true;
  if (/\bbases\b/i.test(title) || /\btdr\b/i.test(title) || /\bcronograma\b/i.test(title)) return true;

  return false;
}

function isEntityAffiliated(itemUrl: string, itemTitle: string, entityName: string, portalUrl?: string): boolean {
  const lowUrl = itemUrl.toLowerCase();
  const lowTitle = itemTitle.toLowerCase();
  const entNorm = (entityName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Si el portal oficial canónico tiene un subdirectorio o dominio específico (ej: institucion/anin o institucion/ugelpaucardelsarasara)
  if (portalUrl && portalUrl.includes('/institucion/')) {
    const slugMatch = portalUrl.match(/\/institucion\/([^\/?#]+)/);
    if (slugMatch && slugMatch[1] && lowUrl.includes(slugMatch[1])) {
      return true;
    }
  }

  // Si la entidad es local (UGEL, Municipalidad, DRE, Hospital regional)
  const isRegionalOrLocal = entNorm.includes('ugel') || entNorm.includes('municipalidad') || entNorm.includes('hospital');
  if (isRegionalOrLocal) {
    // Descartar entidades centrales completamente ajenas
    const foreignBodies = ['pcm.gob.pe', 'congreso.gob.pe', 'tc.gob.pe', 'defensoria.gob.pe', 'mef.gob.pe', 'minjus.gob.pe'];
    if (foreignBodies.some(fb => lowUrl.includes(fb))) {
      return false;
    }
  }

  // Comprobar coincidencia de palabras clave distintivas de la entidad
  const entityKeywords = entNorm.split(/\s+/).filter(w => w.length >= 4 && !['para', 'este', 'como', 'esta', 'peru', 'general'].includes(w));
  const matchesKeyword = entityKeywords.some(k => lowTitle.includes(k) || lowUrl.includes(k));

  return matchesKeyword;
}

function categorizeDocument(title: string, url: string): string {
  const low = (title + ' ' + url).toLowerCase();
  if (low.includes('anexo') || low.includes('formato') || low.includes('declaracion') || low.includes('declaración')) {
    return 'Anexos y Formatos';
  }
  if (low.includes('solicitud') || low.includes('inscripcion') || low.includes('inscripción')) {
    return 'Inscripción y Registro';
  }
  if (low.includes('cronograma') || low.includes('etapa')) {
    return 'Cronograma';
  }
  if (low.includes('resultado') || low.includes('evaluacion') || low.includes('evaluación') || low.includes('apto') || low.includes('merito')) {
    return 'Resultados';
  }
  if (low.includes('comunicado') || low.includes('fe de errata')) {
    return 'Comunicados';
  }
  return 'Bases Oficiales (PDF)';
}

function extractCleanJobRole(title: string, entityName?: string): string {
  let role = (title || '').trim();

  // 1. Quitar prefijo con dos puntos si existe ej: "MINSA: Médico General" -> "Médico General"
  role = role.replace(/^[^:]+:\s*/, '');

  // 2. Si empieza o contiene el nombre de la entidad (o sus palabras clave), quitarlo
  if (entityName) {
    const rawClean = entityName.replace(/\(.*?\)/g, ' ').replace(/\s+/g, ' ').trim();
    const escapedEntity = rawClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    role = role.replace(new RegExp(`^${escapedEntity}\\s*`, 'i'), '');
    role = role.replace(new RegExp(`\\b${escapedEntity}\\b`, 'gi'), '');

    // Quitar palabras de la entidad de 3 o más caracteres
    const words = rawClean.split(/\s+/).filter(w => w.length >= 3);
    for (const w of words) {
      role = role.replace(new RegExp(`\\b${w}\\b`, 'gi'), '');
    }
  }

  // 3. Quitar verbos iniciales, preposiciones y conectores típicos
  role = role
    .replace(/^(?:del?|de\s+la|los?|las?|en|para)\s+/i, '')
    .replace(/^(?:solicita|busca|requiere|necesita|convoca|contratara|contratará)\s+/i, '')
    .replace(/^(?:del?|de\s+la|los?|las?|en|para|un|una|a)\s+/i, '')
    .replace(/^convocatoria\s+(?:de\s+trabajo\s+|cas\s+|publica\s+|pública\s+)?/i, '')
    .replace(/^proceso\s+cas\s+n[ºo°]?\s*\d+\s*-?\s*\d*\s*(?::\s*)?/i, '')
    .replace(/^cas\s+n[ºo°]?\s*\d+\s*(?:[-–]\s*\d+)?\s*(?::\s*)?/i, '')
    .replace(/\(\d+\)\s*/g, ''); // Quitar número de vacantes ej "(1) " o "(30) "

  // 4. Quitar sufijos de mes/año y convocatoria al final
  role = role
    .replace(/\s*[-–]\s*convocatoria\s+.*$/i, '')
    .replace(/\s*[-–]\s*bases.*$/i, '')
    .replace(/\s*[-–]\s*(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|setiembre|septiembre|octubre|noviembre|diciembre)\s*(?:202[0-9]|203[0-9])?.*$/i, '')
    .replace(/\s*[-–]\s*202[0-9].*$/i, '')
    .replace(/^[:\s,.-]+|[:\s,.-]+$/g, '')
    .trim();

  // Limpiar conectores sueltos al inicio tras la remoción
  role = role.replace(/^(?:del?|de\s+la|para|solicita)\s+/i, '').trim();

  return role.slice(0, 60).trim();
}

function extractCasCode(title: string): string | null {
  const match = title.match(/\bCAS\s*(?:N[°º]?\s*)?(\d+(?:-\d+)?(?:-(?:202[4-9]|203\d))?)\b/i);
  return match ? match[0].trim() : null;
}

function extractCleanEntitySearch(entityName: string, searchPattern?: string): string {
  if (searchPattern) {
    return `(${searchPattern})`;
  }
  const clean = (entityName || '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  return `"${clean}"`;
}

export async function POST(req: Request) {
  try {
    const { title, entity_name, start_date, end_date } = await req.json();

    if (!entity_name && !title) {
      return NextResponse.json({ error: 'Faltan parámetros de búsqueda (título o entidad)' }, { status: 400 });
    }

    const targetYear = extractTargetYear(start_date, end_date, title);
    const canonicalPortal = resolveEntityCanonicalPortal(entity_name || '');
    const safePortalUrl = sanitizeOfficialUrl(canonicalPortal.url, undefined, entity_name);
    const apiKey = process.env.FIRECRAWL_API_KEY;

    const officialDocuments: OfficialDoc[] = [];
    let directBasesUrl: string | undefined = undefined;

    // Detectar si la entidad es una universidad o una entidad del gobierno general
    const entUpper = (entity_name || '').toUpperCase();
    const isEntityUniversity = Boolean(
      entUpper.includes('UNIVERSIDAD') ||
      /\b(UNI|UNMSM|UNAJMA|UNAAT|UNCP|UNAS|UNALM|UNT|UNSA|UNSAAC|UNSCH|UNP|UNAP|UNC|UNAC|UNSM)\b/.test(entUpper)
    );

    const cleanJobRole = extractCleanJobRole(title || '', entity_name);
    const casCode = extractCasCode(title || '');
    const entityTerms = extractCleanEntitySearch(entity_name || '', canonicalPortal.searchPattern);

    if (apiKey) {
      try {
        const domainFilter = isEntityUniversity
          ? '(site:gob.pe OR site:edu.pe)'
          : 'site:gob.pe';

        // Excluir años obsoletos para evitar que Firecrawl traiga PDFs del 2013, 2014, etc.
        const ancientYearsExclusion = '-2011 -2012 -2013 -2014 -2015 -2016 -2017 -2018 -2019 -2020 -2021 -2022 -2023 -2024';
        const negativeKeywords = '-tesis -repositorio -bitstream -cybertesis -PEI -POI -TUPA -silabo -scielo -dialnet -willaqniki -conflictividad -boletin -revista -ordenanza -licitacion -subasta';

        let primaryQuery = '';
        if (canonicalPortal.url.includes('/institucion/')) {
          const matchSlug = canonicalPortal.url.match(/\/institucion\/([^\/?#]+)/);
          if (matchSlug && matchSlug[1]) {
            const roleOrCas = casCode || (cleanJobRole ? `"${cleanJobRole}"` : '');
            primaryQuery = `site:gob.pe/institucion/${matchSlug[1]}/ ${targetYear} ${roleOrCas} (bases OR convocatoria OR CAS) ${ancientYearsExclusion} ${negativeKeywords}`;
          }
        }

        if (!primaryQuery) {
          const roleQuery = cleanJobRole ? `"${cleanJobRole}"` : '';
          const casQuery = casCode ? `"${casCode}"` : '';
          primaryQuery = `${domainFilter} ${entityTerms} ${casQuery || roleQuery} ${targetYear} (bases OR convocatoria OR CAS) filetype:pdf ${ancientYearsExclusion} ${negativeKeywords}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        let firecrawlRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: primaryQuery,
            limit: 6
          })
        }).catch(err => {
          console.warn('Firecrawl primary search error:', err.message);
          return null;
        });

        clearTimeout(timeoutId);

        let items: any[] = [];
        if (firecrawlRes && firecrawlRes.ok) {
          const firecrawlData: any = await firecrawlRes.json().catch(() => null);
          items = firecrawlData?.data || [];
        }

        // Si no arrojó resultados y tenemos rol limpio, hacer un pase flexible enfocado en el año objetivo
        if (items.length === 0 && (cleanJobRole || casCode)) {
          const flexibleRole = casCode ? `"${casCode}"` : `"${cleanJobRole}"`;
          const fallbackQuery = `${entityTerms} ${flexibleRole} ${targetYear} (bases OR convocatoria OR CAS) filetype:pdf ${ancientYearsExclusion} ${negativeKeywords}`;
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 7000);

          const fallbackRes = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            signal: controller2.signal,
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: fallbackQuery,
              limit: 5
            })
          }).catch(() => null);

          clearTimeout(timeoutId2);

          if (fallbackRes && fallbackRes.ok) {
            const fbData: any = await fallbackRes.json().catch(() => null);
            items = fbData?.data || [];
          }
        }

        const seenUrls = new Set<string>();

        for (const item of items) {
          const itemUrl = (item.url || '').trim();
          const itemTitle = cleanTitle(item.title || 'Documento Oficial');
          const itemDesc = item.description || '';

          if (!itemUrl || isCompetitorUrl(itemUrl)) continue;
          if (seenUrls.has(itemUrl.toLowerCase())) continue;
          seenUrls.add(itemUrl.toLowerCase());

          // FILTRO 1: Descartar documentos con años antiguos o desfasados (ej: 2013)
          if (isAncientOrMismatchYear(itemTitle + ' ' + itemUrl + ' ' + itemDesc, targetYear)) {
            continue;
          }

          // FILTRO 2: Descartar tesis y repositorios académicos
          if (isAcademicOrIrrelevantUrl(itemUrl)) continue;
          if (isAcademicOrIrrelevantTitle(itemTitle)) continue;

          const lowUrl = itemUrl.toLowerCase();

          // FILTRO 3: Entidades de gobierno (UGEL, Municipalidades, Ministerios, GORE) NO publican en repositorios universitarios .edu.pe
          if (!isEntityUniversity && lowUrl.includes('.edu.pe')) continue;

          // FILTRO 4: Exigir señal positiva de contratación / convocatoria
          if (!hasHiringSignal(itemTitle, itemUrl, itemDesc)) continue;

          // FILTRO 5: Exigir afiliación institucional (no mostrar documentos de PCM/Congreso para una UGEL)
          if (!isEntityAffiliated(itemUrl, itemTitle, entity_name, safePortalUrl)) {
            continue;
          }

          const isPdf = lowUrl.includes('.pdf') || lowUrl.includes('drive.google.com') || lowUrl.includes('docs.google.com');
          const isGovPublication = lowUrl.includes('.gob.pe/institucion/') && lowUrl.includes('/informes-publicaciones/');
          const isGov = lowUrl.includes('.gob.pe') || (isEntityUniversity && lowUrl.includes('.edu.pe')) || lowUrl.includes('.mil.pe');

          if (isPdf || isGovPublication || isGov) {
            const category = categorizeDocument(itemTitle, itemUrl);
            officialDocuments.push({
              title: itemTitle,
              url: itemUrl,
              category
            });

            if (!directBasesUrl && isPdf) {
              directBasesUrl = itemUrl;
            }
          }
        }
      } catch (searchErr) {
        console.warn('Firecrawl AI search error:', searchErr);
      }
    }

    // Incluir siempre el portal oficial institucional verificado
    if (safePortalUrl && !isCompetitorUrl(safePortalUrl)) {
      const alreadyHasPortal = officialDocuments.some(d => d.url.toLowerCase() === safePortalUrl.toLowerCase());
      if (!alreadyHasPortal) {
        officialDocuments.push({
          title: `Portal Oficial de Convocatorias - ${canonicalPortal.portalName || entity_name}`,
          url: safePortalUrl,
          category: 'Portal Oficial'
        });
      }
    }

    const hasExternalDocs = officialDocuments.some(d => d.category !== 'Portal Oficial');

    return NextResponse.json({
      success: true,
      found: hasExternalDocs,
      official_documents: officialDocuments,
      directBasesUrl: directBasesUrl || safePortalUrl,
      portalName: canonicalPortal.portalName,
      portalUrl: safePortalUrl,
      isSpecific: canonicalPortal.isSpecific,
      message: hasExternalDocs
        ? `Se localizaron ${officialDocuments.length} documentos y bases oficiales verificadas para ${targetYear}.`
        : `No se encontraron PDFs desactualizados. Consulta directamente las bases vigentes en ${canonicalPortal.portalName}.`
    });
  } catch (err: any) {
    console.error('Error in /api/ai/resolve-bases:', err);
    return NextResponse.json(
      { error: err?.message || 'Error al resolver bases oficiales con IA' },
      { status: 500 }
    );
  }
}
