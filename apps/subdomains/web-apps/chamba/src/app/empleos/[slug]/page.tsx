import { getJobPostingBySlug, getJobPostings, isCompetitorUrl, sanitizeOfficialUrl } from "@atpdev/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { 
  ShieldCheck, MapPin, Building2, ExternalLink, Clock, FileText, CheckCircle2, 
  ArrowLeft, Share2, Sparkles, Send, Check, AlertCircle, ChevronRight, Layers, Users, Calendar
} from "lucide-react";
import { CvMatcherTool } from "@/components/CvMatcherTool";
import { EntityLogo } from "@/components/EntityLogo";
import { JobCard } from "@/components/JobCard";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { PlazasList } from "@/components/PlazasList";
import { JobCountdownClock } from "@/components/JobCountdownClock";
import { AiBasesResolver } from "@/components/AiBasesResolver";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamicParams = true;
export const revalidate = 86400; // 24 horas - optimizado para CDN y rastreo de Googlebot

export async function generateStaticParams() {
  const jobs = await getJobPostings();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const job = await getJobPostingBySlug(decodedSlug, { skipRemoteEnrichment: true }) || await getJobPostingBySlug(slug, { skipRemoteEnrichment: true });
  if (!job) return {};

  const pageUrl = `${SITE_URL}/empleos/${slug}`;
  const ogImage = job.entity_logo || `${SITE_URL}/opengraph-image`;

  const rawTitle = `${job.title} — ${job.entity_name}`;
  const title = rawTitle.length > 56
    ? `${rawTitle.slice(0, 53).trim()}...`
    : rawTitle;

  const fallbackDesc = `Convocatoria de ${job.title} en ${job.entity_name}. Consulta bases oficiales, requisitos y remuneración en Chamba Pro.`;
  const rawDesc = job.description?.replace(/[\r\n\t]+/g, ' ').trim() || fallbackDesc;
  const description = rawDesc.length > 155
    ? `${rawDesc.slice(0, 152).trim()}...`
    : rawDesc;

  return {
    title,
    description,
    keywords: [
      job.title,
      job.entity_name,
      job.region,
      job.sector_type,
      "convocatorias cas 2026",
      "trabajo peru",
      "bases oficiales",
      "chamba pro",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "article",
      siteName: "chamba pro",
      locale: "es_PE",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${job.title} — ${job.entity_name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const job = await getJobPostingBySlug(decodedSlug) || await getJobPostingBySlug(slug);
  const allJobs = await getJobPostings();

  if (!job) {
    notFound();
  }

  // Related jobs
  const relatedJobs = allJobs
    .filter(j => j.id !== job.id && (j.category === job.category || j.sector_type === job.sector_type))
    .slice(0, 3);

  // Mapeo canónico según especificación estricta de Google Search Central
  let employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN" | "OTHER" = "FULL_TIME";
  if (job.sector_type === "CAS 1057" || job.sector_type === "Locación / FAG") {
    employmentType = "CONTRACTOR";
  } else if (job.sector_type === "Prácticas") {
    employmentType = "INTERN";
  } else {
    employmentType = "FULL_TIME";
  }

  // Detección de teletrabajo / remoto para Google for Jobs
  const isRemoteJob = Boolean(
    job.region?.toLowerCase().includes("remoto") ||
    job.title?.toLowerCase().includes("remoto") ||
    job.description?.toLowerCase().includes("trabajo remoto") ||
    job.description?.toLowerCase().includes("teletrabajo")
  );

  // Extracción robusta de salario para Google for Jobs Rich Snippet
  const rawSalaryNums = (job.salary_text || '').replace(/[,.]/g, ' ').match(/\d+/g)?.map(Number).filter(n => n >= 800 && n <= 50000);
  const fallbackSalaryMin = rawSalaryNums && rawSalaryNums.length > 0 ? Math.min(...rawSalaryNums) : undefined;
  const fallbackSalaryMax = rawSalaryNums && rawSalaryNums.length > 0 ? Math.max(...rawSalaryNums) : undefined;
  const resolvedSalaryMin = job.salary_min || fallbackSalaryMin;
  const resolvedSalaryMax = job.salary_max || fallbackSalaryMax || resolvedSalaryMin;

  // Formato ISO 8601 estricto para fechas y cálculo de expiración
  const isoDatePosted = job.start_date
    ? (job.start_date.includes("T") ? job.start_date : `${job.start_date}T00:00:00.000Z`)
    : new Date(job.created_at || Date.now()).toISOString();

  // Si la convocatoria fue marcada como finalizada o la fecha ya pasó, validThrough DEBE estar en el pasado
  let isoValidThrough = job.end_date
    ? (job.end_date.includes("T") ? job.end_date : `${job.end_date}T23:59:59.000Z`)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  if (job.status === 'Finalizado') {
    isoValidThrough = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  }

  // Descripción formateada en HTML estructurado para tarjetas enriquecidas de Google for Jobs
  const reqListHtml = (job.requirements && job.requirements.length > 0)
    ? `<h3>Requisitos del puesto:</h3><ul>${job.requirements.map(r => `<li>${r.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}</ul>`
    : '';
  const plazasHtml = (job.plazas && job.plazas.length > 0)
    ? `<h3>Plazas disponibles:</h3><ul>${job.plazas.slice(0, 8).map(p => `<li><strong>${p.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong>${p.education ? ` - ${p.education.replace(/</g, '&lt;').replace(/>/g, '&gt;')}` : ''} (${p.vacancies || 1} vacante(s))</li>`).join('')}</ul>`
    : '';
  const benefitsHtml = (job.benefits && job.benefits.length > 0)
    ? `<h3>Beneficios:</h3><ul>${job.benefits.map(b => `<li>${b.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}</ul>`
    : '';
  const formattedHtmlDescription = `<p>${(job.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n+/g, '<br/>')}</p>${plazasHtml}${reqListHtml}${benefitsHtml}<p><strong>Régimen:</strong> ${job.sector_type} | <strong>Remuneración:</strong> ${job.salary_text} | <strong>Ubicación:</strong> ${job.region}, Perú</p><p>Consulte bases y cronograma oficial en Chamba Pro (atpdev.dev).</p>`;

  // Google for Jobs JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: formattedHtmlDescription,
    identifier: {
      "@type": "PropertyValue",
      name: job.entity_name,
      value: job.id,
    },
    datePosted: isoDatePosted,
    validThrough: isoValidThrough,
    employmentType,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: job.entity_name,
      sameAs: job.apply_url || SITE_URL,
      logo: job.entity_logo || `${SITE_URL}/icon.svg`,
    },
    ...(isRemoteJob
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: "PE",
          },
        }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: `${job.entity_name}, ${job.region}`,
              addressLocality: job.region,
              addressRegion: job.region,
              addressCountry: "PE",
            },
          },
        }),
    industry: job.category || (job.sector_type?.includes("CAS") ? "Administración Pública y Estado" : "Servicios"),
    educationRequirements: job.education_level ? {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: job.education_level,
    } : {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Secundaria, Técnico o Universitario según bases oficiales",
    },
    experienceRequirements: {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: 12,
    },
    baseSalary: resolvedSalaryMin ? {
      "@type": "MonetaryAmount",
      currency: "PEN",
      value: {
        "@type": "QuantitativeValue",
        value: resolvedSalaryMin,
        minValue: resolvedSalaryMin,
        maxValue: resolvedSalaryMax || resolvedSalaryMin,
        unitText: "MONTH",
      },
    } : undefined,
  };

  // BreadcrumbList JSON-LD Schema for Google Rich Results
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Convocatorias",
        item: `${SITE_URL}/empleos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: job.title,
        item: `${SITE_URL}/empleos/${job.slug}`,
      },
    ],
  };

  // Extraer año objetivo de la convocatoria para validar que no sea un documento de años anteriores (ej: 2013)
  const jobYear = Number(
    job.end_date?.match(/\b(202[4-9]|203\d)\b/)?.[0] || 
    job.start_date?.match(/\b(202[4-9]|203\d)\b/)?.[0] || 
    job.title?.match(/\b(202[4-9]|203\d)\b/)?.[0] || 
    2026
  );

  const isValidBasesUrl = (url?: string): boolean => {
    if (!url || !url.startsWith('http') || isCompetitorUrl(url)) return false;
    const low = url.toLowerCase();
    // Descartar si menciona años antiguos (< jobYear - 1)
    const yearMatches = low.match(/\b(19\d{2}|20\d{2})\b/g);
    if (yearMatches) {
      const minValid = jobYear - 1;
      let hasAncient = false;
      let hasValid = false;
      for (const ym of yearMatches) {
        const y = parseInt(ym, 10);
        if (y === 1057 || y === 276 || y === 728) continue;
        if (y >= 1990 && y <= jobYear + 1) {
          if (y >= minValid) hasValid = true;
          else hasAncient = true;
        }
      }
      if (hasAncient && !hasValid) return false;
    }
    // Descartar tesis, boletines e informes de conflictividad
    if (
      low.includes('willaqniki') || 
      low.includes('conflictividad') || 
      low.includes('tesis') || 
      low.includes('repositorio.') || 
      low.includes('cybertesis') ||
      low.includes('bitstream')
    ) {
      return false;
    }
    return true;
  };

  // 1. Enlace a bases oficiales (PDF, Google Drive o documento específico)
  const candidateBases = (job.bases_pdf_url && isValidBasesUrl(job.bases_pdf_url))
    ? job.bases_pdf_url
    : (job.plazas?.find(p => p.bases_url && isValidBasesUrl(p.bases_url) && (
        p.bases_url.toLowerCase().includes('.pdf') || 
        p.bases_url.includes('drive.google.com') || 
        p.bases_url.includes('docs.google.com')
      ))?.bases_url);

  const cleanBasesUrl = candidateBases
    ? sanitizeOfficialUrl(candidateBases, job.apply_url, job.entity_name, job.sector_type)
    : undefined;

  const lowBases = (cleanBasesUrl || '').toLowerCase();
  const isBasesDoc = Boolean(
    cleanBasesUrl && (
      lowBases.includes('.pdf') ||
      lowBases.includes('drive.google.com') ||
      lowBases.includes('docs.google.com') ||
      lowBases.includes('archivos.mpfn.gob.pe') ||
      lowBases.includes('descargar_tdr') ||
      lowBases.includes('descargar_bases') ||
      lowBases.includes('/anexo-archivo/')
    )
  );

  // 2. Enlace oficial para postulación / portal de empleo de la entidad
  let cleanApplyUrl = sanitizeOfficialUrl(
    job.apply_url,
    cleanBasesUrl,
    job.entity_name,
    job.sector_type
  );

  const hasMultiplePlazas = Boolean(job.plazas && job.plazas.length > 1);
  const distinctPlazaBases = hasMultiplePlazas
    ? Array.from(new Set(job.plazas!.map(p => p.bases_url).filter(Boolean)))
    : [];
  const hasDistinctPlazaBases = distinctPlazaBases.length > 1;

  // En el caso de MINEDU, dirigir a la convocatoria específica si tiene idReq único, o al portal general
  if (job.entity_name?.toUpperCase().includes('MINEDU') || job.entity_name?.toUpperCase().includes('EDUCACI')) {
    const mineduIdMatch = cleanBasesUrl?.match(/idReq=(\d+)/i);
    if (mineduIdMatch && !hasDistinctPlazaBases) {
      cleanApplyUrl = `https://postulacioncas.minedu.gob.pe/PostulacionCas/Home/Convocatoria/${mineduIdMatch[1]}`;
    } else {
      cleanApplyUrl = 'https://postulacioncas.minedu.gob.pe/PostulacionCas/';
    }
  }

  const isSameAction = cleanBasesUrl === cleanApplyUrl;

  // Determinar si la convocatoria ya finalizó (por estado o por fecha vencida)
  let isDateExpired = false;
  if (job.end_date) {
    const cleanDate = job.end_date.trim();
    let target = 0;
    if (cleanDate.includes('-')) {
      const parts = cleanDate.split('-').map(Number);
      if (parts.length >= 3) {
        if (parts[0] > 1000) {
          target = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1, 23, 59, 59).getTime();
        } else {
          target = new Date(parts[2], (parts[1] || 1) - 1, parts[0] || 1, 23, 59, 59).getTime();
        }
      }
    } else if (cleanDate.includes('/')) {
      const parts = cleanDate.split('/').map(Number);
      if (parts.length >= 3) {
        if (parts[0] > 1000) {
          target = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1, 23, 59, 59).getTime();
        } else {
          target = new Date(parts[2], (parts[1] || 1) - 1, parts[0] || 1, 23, 59, 59).getTime();
        }
      }
    }
    if (!target || isNaN(target)) {
      target = new Date(cleanDate).getTime();
    }
    if (target && !isNaN(target) && target < Date.now()) {
      isDateExpired = true;
    }
  }

  const isFinalized = job.status === 'Finalizado' || isDateExpired;

  if (isFinalized && jsonLd) {
    jsonLd.validThrough = (job.end_date && isDateExpired)
      ? (job.end_date.includes("T") ? job.end_date : `${job.end_date}T23:59:59.000Z`)
      : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  }

  return (
    <>
      {/* Google for Jobs JSON-LD Direct Server-Side Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* BreadcrumbList JSON-LD Direct Server-Side Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 sm:pb-8">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link href="/empleos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Convocatorias</Link>
          <ChevronRight size={12} />
          <span className="text-slate-800 dark:text-slate-200 truncate max-w-[250px] sm:max-w-[400px] font-semibold">{job.title}</span>
        </nav>

        {/* Banner de Revisión Editorial si la convocatoria aún está pendiente */}
        {job.status === 'Pendiente' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-amber-500 dark:text-amber-400 shrink-0 animate-pulse" />
              <div>
                <strong className="text-slate-900 dark:text-white block sm:inline">Modo Vista Previa Editorial: </strong>
                <span>Esta solicitud se encuentra <strong>en revisión por ATPDev</strong> y aún no se lista públicamente.</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold tracking-wider shrink-0 uppercase">
              Pendiente de Moderación
            </span>
          </div>
        )}

        {/* Banner de Convocatoria Finalizada con opciones para el postulante */}
        {isFinalized && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block sm:inline">Convocatoria Finalizada: </strong>
                <span>El plazo de postulación ha concluido. Te sugerimos explorar otras convocatorias vigentes.</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
              {job.entity_name && (
                <Link
                  href={`/empleos?q=${encodeURIComponent(job.entity_name)}`}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 text-[11px] font-bold tracking-wider uppercase transition-colors"
                >
                  Más de {job.entity_name}
                </Link>
              )}
              <Link
                href="/empleos"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Explorar convocatorias activas</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Main Convocatoria Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <EntityLogo entityName={job.entity_name} logoUrl={job.entity_logo} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{job.entity_name}</span>
                  {job.entity_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">
                      <ShieldCheck size={12} />
                      <span>RUC Verificado</span>
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1 leading-snug">
                  {job.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isFinalized && job.status === 'Vigente' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                  CONVOCATORIA VIGENTE
                </span>
              ) : job.status === 'Pendiente' ? (
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold">
                  EN REVISIÓN EDITORIAL
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                  CONVOCATORIA FINALIZADA
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold">
                {job.sector_type}
              </span>
            </div>
          </div>

          {/* Institutional Metadata Grid (As seen in PortalTrabajos reference!) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-white/10 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono block text-[10px] uppercase">Institución</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold block truncate">{job.entity_name}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono block text-[10px] uppercase">Vacantes</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold block">{job.vacancies_count} Vacantes</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono block text-[10px] uppercase">Ubicación</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold block">{job.region}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono block text-[10px] uppercase">Publicado</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold block font-mono">{job.start_date}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono block text-[10px] uppercase">Vigente Hasta</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold block font-mono">{job.end_date}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono block text-[10px] uppercase">Salario / Remuneración</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block">{job.salary_text}</span>
            </div>
          </div>

          {/* Large Visual Countdown Clock (Semáforo de Cierre) */}
          <JobCountdownClock endDate={job.end_date} status={isFinalized ? 'Finalizado' : job.status} size="lg" />

          {/* Social Share & Direct Apply Quick Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Compartir:</span>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${job.title} - ${job.entity_name} en Chamba Pro: ${SITE_URL}/empleos/${job.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all font-semibold hover:scale-105"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/empleos/${job.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all font-semibold hover:scale-105"
              >
                Facebook
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`${SITE_URL}/empleos/${job.slug}`)}&text=${encodeURIComponent(`${job.title} - ${job.entity_name} en Chamba Pro`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-all font-semibold hover:scale-105"
              >
                Telegram
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/empleos/${job.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-600/30 transition-all font-semibold hover:scale-105"
              >
                LinkedIn
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Botón de Bases Oficiales en PDF si existe documento */}
              {cleanBasesUrl && isBasesDoc && (
                <a
                  href={
                    hasDistinctPlazaBases
                      ? '#plazas-convocadas'
                      : cleanBasesUrl.includes('drive.google.com/file/d/')
                        ? cleanBasesUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/file/d/$1/preview')
                        : cleanBasesUrl
                  }
                  target={hasDistinctPlazaBases ? undefined : '_blank'}
                  rel={hasDistinctPlazaBases ? undefined : 'nofollow noopener noreferrer'}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <FileText size={16} />
                  <span>
                    {hasDistinctPlazaBases
                      ? `Ver Plazas y Bases (${job.plazas!.length} Puestos)`
                      : 'Descargar Bases (PDF)'}
                  </span>
                  <ExternalLink size={13} />
                </a>
              )}

              {/* Botón para postulación en portal oficial */}
              {(!isBasesDoc || !isSameAction) && (
                <a
                  href={cleanApplyUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs ${
                    isBasesDoc
                      ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{job.official_portal_name ? `Postular en ${job.official_portal_name.replace(/Gob\.pe Convocatorias de Trabajo\s*/i, '').replace(/ - Portal Oficial/i, '')}` : 'Ver Oferta Oficial y Postular'}</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Details Body */}
          <div className="lg:col-span-2 space-y-8">

            {/* Documentos y Etapas Oficiales del Concurso (Localización con IA / Directorio Canónico) */}
            <AiBasesResolver
              key={job.id || job.slug}
              jobTitle={job.title}
              entityName={job.entity_name}
              startDate={job.start_date}
              endDate={job.end_date}
              initialDocuments={job.official_documents}
              canonicalPortalUrl={cleanApplyUrl}
              canonicalPortalName={job.official_portal_name || job.entity_name}
            />
            
            {/* Plazas y Bases Oficiales Individuales (PortalTrabajos / Gob.pe) */}
            <PlazasList
              plazas={
                job.plazas && job.plazas.length > 0
                  ? job.plazas
                  : [
                      {
                        cas_code: job.title.match(/CAS\s*N[ºo°]?\s*\d+/i)?.[0] || 'CAS Nº 01',
                        title: job.title,
                        education: job.requirements.find(r => /formaci[oó]n|t[ií]tulo|bachiller|egresad|estudios|secundaria|t[eé]cnico/i.test(r)) || `Nivel académico requerido: ${job.education_level}`,
                        experience: job.requirements.find(r => /experiencia/i.test(r)) || 'Experiencia laboral acreditada en el sector público o privado.',
                        salary: job.salary_text,
                        bases_url: job.bases_pdf_url || job.apply_url
                      }
                    ]
              }
              entityName={job.entity_name}
              defaultApplyUrl={job.apply_url}
              globalBasesPdfUrl={
                hasDistinctPlazaBases ? undefined : (
                  (job.bases_pdf_url && (
                    job.bases_pdf_url.toLowerCase().includes('.pdf') ||
                    job.bases_pdf_url.toLowerCase().includes('drive.google.com') ||
                    job.bases_pdf_url.toLowerCase().includes('docs.google.com')
                  )) ? job.bases_pdf_url : (
                    job.plazas?.find(p => p.bases_url && (
                      p.bases_url.toLowerCase().includes('.pdf') ||
                      p.bases_url.toLowerCase().includes('drive.google.com') ||
                      p.bases_url.toLowerCase().includes('docs.google.com')
                    ))?.bases_url || job.bases_pdf_url
                  )
                )
              }
              anexosUrl={job.anexos_url}
            />

            {/* Visor Oficial de Bases Incrustado (Si existe PDF o Google Drive) */}
            {cleanBasesUrl && isBasesDoc && (
              <div className="p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <FileText className="text-emerald-600 dark:text-emerald-400" size={22} />
                    <div>
                      <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                        Documento Oficial de Bases {hasDistinctPlazaBases ? `- ${job.plazas![0].title}` : 'del Concurso'}
                      </h2>
                      {hasDistinctPlazaBases && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Visualizando bases del puesto 1. Cada plaza de la lista superior dispone de su propia descarga oficial de bases y TDR en PDF.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={
                        cleanBasesUrl.includes('drive.google.com/file/d/')
                          ? cleanBasesUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/uc?export=download&id=$1')
                          : cleanBasesUrl
                      }
                      target="_blank"
                      download
                      rel="nofollow noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold font-mono transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-white/10"
                    >
                      <span>📥 Descargar PDF</span>
                    </a>
                    <a
                      href={
                        cleanBasesUrl.includes('drive.google.com/file/d/')
                          ? cleanBasesUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/file/d/$1/preview')
                          : cleanBasesUrl
                      }
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-display transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Pantalla Completa</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Visualización oficial directa del documento emitido por <b className="text-slate-900 dark:text-white">{job.entity_name}</b>:
                </p>

                {cleanBasesUrl.includes('drive.google.com') || cleanBasesUrl.includes('docs.google.com') ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 h-[560px] bg-slate-950 relative shadow-xl">
                    <iframe
                      src={
                        cleanBasesUrl.includes('drive.google.com/file/d/')
                          ? cleanBasesUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/file/d/$1/preview')
                          : cleanBasesUrl
                      }
                      className="w-full h-full border-0"
                      title={`Bases Oficiales - ${job.title}`}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 h-[560px] bg-slate-900 relative shadow-xl">
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(cleanBasesUrl)}&embedded=true`}
                        className="w-full h-full border-0 bg-white"
                        title={`Visor Oficial de Bases - ${job.title}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-mono">
                        {hasDistinctPlazaBases
                          ? `Visualizando puesto 1. Selecciona otras especialidades en la lista de plazas arriba.`
                          : `¿Prefieres abrir o descargar el archivo original en tu dispositivo?`}
                      </span>
                      <a
                        href={cleanBasesUrl}
                        target="_blank"
                        download
                        rel="nofollow noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <FileText size={14} />
                        <span>Abrir / Descargar PDF Oficial</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Technical Job Profile Table */}
            <div className="p-6 sm:p-8 rounded-2xl space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <FileText className="text-emerald-600 dark:text-emerald-400" size={22} />
                <span>Ficha Técnica del Puesto</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">PUESTO:</span>
                  <span className="font-bold text-slate-900 dark:text-white block">{job.title}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">TIPO DE CONTRATO / RÉGIMEN:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400 block">{job.sector_type}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">NIVEL EDUCATIVO REQUERIDO:</span>
                  <span className="font-bold text-sky-700 dark:text-sky-400 block">{job.education_level}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">MODALIDAD DE TRABAJO:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block">Presencial / Descentralizado</span>
                </div>
              </div>
            </div>

            {/* Requisitos Desglosados */}
            <div className="p-6 sm:p-8 rounded-2xl space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={22} />
                <span>Requisitos de Postulación</span>
              </h2>

              <div className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ODPE / Desglose de Plazas Descentralizadas (Si aplica) */}
            {job.odpe_vacancies && job.odpe_vacancies.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="text-sky-600 dark:text-sky-400" size={22} />
                    <span>Desglose de Vacantes por ODPE / Provincia</span>
                  </h2>
                  <span className="text-xs font-mono text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800 font-bold">
                    {job.odpe_vacancies.length} Sedes Descentralizadas
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Selecciona la ODPE o sede de tu preferencia para conocer el número de vacantes requeridas y la fecha límite de postulación específica:
                </p>

                <div className="max-h-80 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {job.odpe_vacancies.map((odpe, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                      <div>
                        <strong className="text-slate-900 dark:text-white block text-sm">{odpe.odpe}</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Plazo: {odpe.deadline}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 flex-shrink-0">
                        {odpe.count} plazas
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guía Paso a Paso & Detalles de Postulación */}
            <div className="p-6 sm:p-8 rounded-2xl space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <Sparkles className="text-amber-500 dark:text-amber-400" size={22} />
                <span>¿Cómo Postular? Pasos e Instructivo Oficial</span>
              </h2>

              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Para postular correctamente a esta convocatoria, debes realizar tu registro en el sistema oficial de la institución antes de la fecha límite:
                </p>

                {job.steps_to_apply && job.steps_to_apply.length > 0 ? (
                  <div className="space-y-3 font-mono text-xs">
                    {job.steps_to_apply.map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-900/80 border border-emerald-200 dark:border-white/10 text-emerald-800 dark:text-emerald-300">
                        {step}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ol className="space-y-3 text-xs font-mono">
                    <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200">1ro. Ingresar al enlace oficial de postulación.</li>
                    <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200">2do. Registrarse e iniciar sesión con tu documento de identidad (DNI).</li>
                    <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200">3ro. Adjuntar tu currículum vitae documentado en formato PDF.</li>
                  </ol>
                )}

                {/* Primary Redirection Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-center space-y-4 mt-6 shadow-xl text-white">
                  <h3 className="font-display font-bold text-lg text-white">
                    Postula en la Plataforma Oficial de {job.entity_name}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Haz clic en el siguiente botón para acceder directamente al sistema de postulación oficial ({job.official_portal_name || "Portal Oficial"}):
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={cleanApplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-brand-gradient w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-black font-display text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="text-white drop-shadow-sm font-black tracking-wide">[ POSTULAR AHORA EN ENLACE OFICIAL ]</span>
                      <ExternalLink size={16} className="text-white drop-shadow-sm" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* AI CV Matcher Tool */}
            <CvMatcherTool requirements={job.requirements} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Bases PDF Download & Viewer Card */}
            <div className="p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 font-display font-bold">
                <FileText size={20} />
                <span>Bases Oficiales (PDF & Google Drive)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualiza o descarga el documento oficial de bases del concurso, cronograma y anexos emitidos por {job.entity_name}.
              </p>
              
              <div className="space-y-2 pt-1">
                {(() => {
                  const plazaDirectDoc = job.plazas?.find(p => p.bases_url && (
                    p.bases_url.toLowerCase().includes('.pdf') ||
                    p.bases_url.toLowerCase().includes('drive.google.com') ||
                    p.bases_url.toLowerCase().includes('docs.google.com')
                  ));

                  const rawPdfUrl = 
                    (job.bases_pdf_url && job.bases_pdf_url.startsWith('http') && !isCompetitorUrl(job.bases_pdf_url))
                      ? job.bases_pdf_url
                      : (plazaDirectDoc?.bases_url && plazaDirectDoc.bases_url.startsWith('http') && !isCompetitorUrl(plazaDirectDoc.bases_url) 
                          ? plazaDirectDoc.bases_url 
                          : ((job.plazas && job.plazas[0]?.bases_url && job.plazas[0].bases_url.startsWith('http') && !isCompetitorUrl(job.plazas[0].bases_url)) 
                              ? job.plazas[0].bases_url 
                              : job.apply_url));

                  const pdfTargetUrl = sanitizeOfficialUrl(
                    rawPdfUrl,
                    cleanApplyUrl,
                    job.entity_name,
                    job.sector_type
                  );

                  const lowUrl = (pdfTargetUrl || '').toLowerCase();
                  const isDoc = (
                    lowUrl.includes('.pdf') ||
                    lowUrl.includes('drive.google.com') ||
                    lowUrl.includes('docs.google.com') ||
                    lowUrl.includes('archivos.mpfn.gob.pe') ||
                    lowUrl.includes('/anexo-archivo/') ||
                    lowUrl.includes('descargar_tdr') ||
                    lowUrl.includes('descargar_bases') ||
                    lowUrl.includes('download') ||
                    lowUrl.includes('.docx') ||
                    lowUrl.includes('.doc') ||
                    lowUrl.includes('.xlsx') ||
                    lowUrl.includes('.xls')
                  );

                  return (
                    <>
                      {isDoc ? (
                        <>
                          <a
                            href={
                              hasDistinctPlazaBases
                                ? '#plazas-convocadas'
                                : pdfTargetUrl
                            }
                            target={hasDistinctPlazaBases ? undefined : '_blank'}
                            rel={hasDistinctPlazaBases ? undefined : 'nofollow noopener noreferrer'}
                            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                          >
                            <FileText size={16} />
                            <span>
                              {hasDistinctPlazaBases
                                ? `VER ${job.plazas!.length} BASES INDIVIDUALES`
                                : 'ABRIR BASES OFICIALES EN PDF'}
                            </span>
                            <ExternalLink size={14} />
                          </a>

                          {hasDistinctPlazaBases ? (
                            <a
                              href="#plazas-convocadas"
                              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              <span>📋 Elegir entre las {job.plazas!.length} Plazas</span>
                            </a>
                          ) : (
                            <a
                              href={
                                pdfTargetUrl.includes('drive.google.com/file/d/')
                                  ? pdfTargetUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/uc?export=download&id=$1')
                                  : pdfTargetUrl
                              }
                              target="_blank"
                              download
                              rel="nofollow noopener noreferrer"
                              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              <span>📥 Descargar Archivo Directo</span>
                            </a>
                          )}

                          {/* Visor interactivo incrustado solo para Google Drive / Docs */}
                          {(pdfTargetUrl.includes('drive.google.com') || pdfTargetUrl.includes('docs.google.com')) && (
                            <details className="group/preview pt-1">
                              <summary className="cursor-pointer text-xs font-mono text-emerald-400 hover:text-emerald-300 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center justify-between transition-colors list-none select-none">
                                <span className="flex items-center gap-2">
                                  <FileText size={14} className="text-emerald-400" />
                                  <span>Visualizar documento aquí</span>
                                </span>
                                <span className="text-[10px] text-slate-400 group-open/preview:rotate-180 transition-transform">▼</span>
                              </summary>
                              <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 h-80 bg-slate-950/90">
                                <iframe
                                  src={
                                    pdfTargetUrl.includes('drive.google.com/file/d/')
                                      ? pdfTargetUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/file/d/$1/preview')
                                      : pdfTargetUrl
                                  }
                                  className="w-full h-full border-0"
                                  title="Visor de Bases Oficiales"
                                  loading="lazy"
                                />
                              </div>
                            </details>
                          )}
                        </>
                      ) : (
                        <a
                          href={pdfTargetUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                          <ExternalLink size={16} />
                          <span>
                            {lowUrl.includes('bumeran') || lowUrl.includes('computrabajo') || lowUrl.includes('postul')
                              ? 'POSTULAR EN PORTAL OFICIAL'
                              : 'VER CONVOCATORIA EN PORTAL OFICIAL'}
                          </span>
                        </a>
                      )}

                      {/* Documentos complementarios oficiales emitidos por la institución */}
                      {job.cuadro_plazas_url && !isCompetitorUrl(job.cuadro_plazas_url) && (
                        <a
                          href={job.cuadro_plazas_url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>📊 Cuadro de Distribución de Plazas</span>
                          <ExternalLink size={13} />
                        </a>
                      )}

                      {job.cronograma_url && !isCompetitorUrl(job.cronograma_url) && (
                        <a
                          href={job.cronograma_url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>📅 Cronograma Oficial del Concurso</span>
                          <ExternalLink size={13} />
                        </a>
                      )}

                      {job.anexos_url && !isCompetitorUrl(job.anexos_url) && (
                        <a
                          href={job.anexos_url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>📝 Anexos y Formatos de Postulación</span>
                          <ExternalLink size={13} />
                        </a>
                      )}

                      {job.guia_postulante_url && !isCompetitorUrl(job.guia_postulante_url) && (
                        <a
                          href={job.guia_postulante_url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>📘 Guía del Postulante / Instructivo</span>
                          <ExternalLink size={13} />
                        </a>
                      )}

                      {job.resultados_url && !isCompetitorUrl(job.resultados_url) && (
                        <a
                          href={job.resultados_url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>📋 Ver Resultados Oficiales</span>
                          <ExternalLink size={13} />
                        </a>
                      )}

                      {(() => {
                        const targetPortal = hasDistinctPlazaBases
                          ? cleanApplyUrl
                          : (job.fuente_url && !isCompetitorUrl(job.fuente_url) ? job.fuente_url : cleanApplyUrl);
                        if (!targetPortal) return null;
                        return (
                          <a
                            href={targetPortal}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/10 text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white font-mono text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-sm font-bold"
                          >
                            <span>🔗 Ver Portal Institucional Oficial</span>
                            <ExternalLink size={13} />
                          </a>
                        );
                      })()}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Institutional Guarantee Box */}
            <div className="p-6 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                <ShieldCheck size={16} />
                <span>Garantía de Transparencia</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Chamba Pro es una plataforma agregadora verificada. No solicitamos dinero, cobros ni datos personales. Todo trámite de postulación es 100% gratuito y directo en la web oficial del Estado.
              </p>
            </div>

            {/* Sidebar Ad / Sponsor Slot */}
            <AdBannerSlot type="sidebar" />

          </div>
        </div>

        {/* Bottom Horizontal Ad Slot */}
        <AdBannerSlot type="billboard" />

        {/* Other Related Convocatorias Grid */}
        {relatedJobs.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-white/10">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Otras convocatorias que te pueden interesar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((rJob) => (
                <JobCard key={rJob.id} job={rJob} />
              ))}
            </div>
          </div>
        )}

        {/* Sticky Mobile Action Bar (Fixed bottom CTA on mobile devices) */}
        <div 
          id="mobile-job-cta"
          className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden bg-white/95 dark:bg-[#070a12]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.7)]"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
        >
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block truncate">
                {job.salary_text}
              </span>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold block truncate">
                {job.entity_name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {cleanBasesUrl && isBasesDoc && (
                <a
                  href={hasDistinctPlazaBases ? '#plazas-convocadas' : cleanBasesUrl}
                  target={hasDistinctPlazaBases ? undefined : '_blank'}
                  rel={hasDistinctPlazaBases ? undefined : 'nofollow noopener noreferrer'}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold font-mono text-xs border border-slate-200 dark:border-white/10 flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <FileText size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Bases</span>
                </a>
              )}
              <a
                href={cleanApplyUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="btn-brand-gradient px-4 py-2.5 rounded-xl text-white font-black font-display text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
              >
                <span>{isBasesDoc ? 'Postular' : 'Ver Oferta'}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
