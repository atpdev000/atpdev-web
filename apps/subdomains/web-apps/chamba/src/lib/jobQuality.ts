import type { JobPosting } from '@atpdev/database';

const GENERIC_REQ_PATTERNS = [
  'perfil de formación académica especificado',
  'acreditar experiencia laboral general y específica según las bases',
  'acreditar experiencia laboral requerida según bases oficiales',
  'presentar la documentación requerida en el portal oficial',
  'según las bases oficiales',
  'presentar anexos y formatos oficiales requeridos',
];

function isGenericRequirementText(value: string): boolean {
  const low = value.toLowerCase().trim();
  if (!low || low.length < 18) return true;
  return GENERIC_REQ_PATTERNS.some((p) => low.includes(p));
}

function isDirectDocumentUrl(url?: string): boolean {
  if (!url) return false;
  const low = url.toLowerCase();
  return (
    low.includes('.pdf') ||
    low.includes('drive.google.com') ||
    low.includes('docs.google.com') ||
    low.includes('.doc') ||
    low.includes('descargar_tdr') ||
    low.includes('descargar_bases') ||
    low.includes('/anexo-archivo/') ||
    low.includes('archivos.mpfn.gob.pe')
  );
}

/**
 * Determines whether a job posting contains sufficient unique parsed data
 * (specific requirements, salary figures, multiple/detailed plazas, or direct
 * official documents) to be indexed and monetized as non-repetitive content.
 */
export function isEnrichedJobPosting(job: JobPosting): boolean {
  const realRequirements = (job.requirements || []).filter(
    (req) => Boolean(req) && !isGenericRequirementText(req)
  );
  if (realRequirements.length > 0) return true;

  const plazas = job.plazas || [];
  if (plazas.length > 1) return true;

  const hasRichPlaza = plazas.some((p) => {
    const pSal = String(p.salary || '').toLowerCase();
    const hasPlazaSalary = Boolean(pSal && !pSal.includes('según') && /\d/.test(pSal));
    const hasEdu = Boolean(p.education && !isGenericRequirementText(p.education) && p.education.length > 25);
    const hasExp = Boolean(p.experience && !isGenericRequirementText(p.experience) && p.experience.length > 25);
    return hasPlazaSalary || hasEdu || hasExp || isDirectDocumentUrl(p.bases_url);
  });
  if (hasRichPlaza) return true;

  const sal = String(job.salary_text || '').toLowerCase();
  const hasRealSalary =
    Boolean(job.salary_min && job.salary_min > 0) ||
    Boolean(sal && !sal.includes('según') && !sal.includes('por definir') && /\d/.test(sal));
  if (hasRealSalary) return true;

  const hasRealDocs =
    isDirectDocumentUrl(job.bases_pdf_url) ||
    (job.official_documents || []).some((doc) => isDirectDocumentUrl(doc.url));
  if (hasRealDocs) return true;

  const desc = String(job.description || '').trim();
  const lowDesc = desc.toLowerCase();
  if (
    desc.length > 280 &&
    !lowDesc.includes('convocatoria pública nacional') &&
    (!lowDesc.startsWith('convocatoria oficial ') || desc.length > 380)
  ) {
    return true;
  }

  return false;
}

