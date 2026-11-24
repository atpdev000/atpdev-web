import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobPostings } from "@atpdev/database";
import { JobCard } from "@/components/JobCard";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { MapPin, ChevronRight, Briefcase, ArrowLeft } from "lucide-react";
import { ChambaAdSense } from "@/components/ChambaAdSense";
import { getChambaAdsenseSettings } from "@/lib/adsenseConfig";
import { SITE_URL } from "@/lib/siteConfig";

export const revalidate = 1800; // Sincronizado con sitemap.ts
export const dynamicParams = true;

// Lista canónica de regiones peruanas y sus slugs
export const REGIONES_MAP: Record<string, { name: string; label: string; description: string }> = {
  "lima": {
    name: "Lima",
    label: "Lima Metropolitana",
    description: "Convocatorias de trabajo en ministerios, organismos públicos descentralizados, municipalidades y sedes centrales corporativas en Lima Metropolitana."
  },
  "callao": {
    name: "Callao",
    label: "Callao (Provincia Constitucional)",
    description: "Convocatorias de empleo vigentes en el Callao: Gobierno Regional del Callao, municipalidades distritales, sector portuario, Diresa Callao, DREC y aduanas."
  },
  "arequipa": {
    name: "Arequipa",
    label: "Arequipa",
    description: "Oportunidades laborales y convocatorias CAS en el Gobierno Regional de Arequipa, municipalidades provinciales, minería y sector comercial del sur."
  },
  "cusco": {
    name: "Cusco",
    label: "Cusco",
    description: "Bolsa de trabajo pública y privada en Cusco: Gobierno Regional, DDC Cusco, turismo, salud, educación y proyectos de desarrollo."
  },
  "la-libertad": {
    name: "La Libertad",
    label: "La Libertad (Trujillo)",
    description: "Convocatorias vigentes en Trujillo y provincias de La Libertad: GORE La Libertad, agroindustria, servicios de salud y entidades judiciales."
  },
  "piura": {
    name: "Piura",
    label: "Piura",
    description: "Ofertas de trabajo en el norte peruano: GORE Piura, Municipalidades, sector pesquero, petrolero y proyectos de infraestructura."
  },
  "junin": {
    name: "Junín",
    label: "Junín (Huancayo)",
    description: "Convocatorias de empleo en Huancayo y la sierra central: salud (DIRESA), educación (UGELs), minería y administración pública."
  },
  "puno": {
    name: "Puno",
    label: "Puno",
    description: "Convocatorias CAS y empleo formal en Puno y Juliaca: GORE Puno, sector tributario, salud, educación y desarrollo agrario."
  },
  "lambayeque": {
    name: "Lambayeque",
    label: "Lambayeque (Chiclayo)",
    description: "Bolsa de trabajo y concursos públicos en Chiclayo: sector agroindustrial, GORE Lambayeque y administración de justicia."
  },
  "san-martin": {
    name: "San Martín",
    label: "San Martín (Tarapoto / Moyobamba)",
    description: "Oportunidades laborales en San Martín: GORE, sector ambiental, salud, educación y agroexportación en la selva alta."
  },
  "ancash": {
    name: "Áncash",
    label: "Áncash (Huaraz / Chimbote)",
    description: "Convocatorias en Huaraz y Chimbote: GORE Áncash, canon minero, pesca, salud y entidades judiciales."
  },
  "ica": {
    name: "Ica",
    label: "Ica",
    description: "Plazas de empleo en Ica, Chincha, Pisco y Nazca: agroexportación, logística y convocatorias del Gobierno Regional."
  },
  "cajamarca": {
    name: "Cajamarca",
    label: "Cajamarca",
    description: "Convocatorias CAS en Cajamarca: sector minero, desarrollo rural, salud (DIRESA) y educación."
  },
  "loreto": {
    name: "Loreto",
    label: "Loreto (Iquitos)",
    description: "Empleos y convocatorias públicas en Iquitos y la cuenca amazónica: GORE Loreto, salud fluvial y proyectos sociales."
  },
  "ayacucho": {
    name: "Ayacucho",
    label: "Ayacucho",
    description: "Convocatorias públicas en Huamanga y provincias de Ayacucho: GORE, municipalidades, agricultura y servicios de salud."
  },
  "huanuco": {
    name: "Huánuco",
    label: "Huánuco",
    description: "Bolsa de trabajo en Huánuco y Tingo María: convocatorias CAS, educación y administración pública."
  },
  "tacna": {
    name: "Tacna",
    label: "Tacna",
    description: "Oportunidades laborales en Tacna: comercio transfronterizo, ZofraTacna, GORE Tacna y sector público."
  },
  "ucayali": {
    name: "Ucayali",
    label: "Ucayali (Pucallpa)",
    description: "Convocatorias de trabajo en Pucallpa: sector forestal, administración regional y convocatorias CAS del Estado."
  },
  "apurimac": {
    name: "Apurímac",
    label: "Apurímac (Abancay / Andahuaylas)",
    description: "Convocatorias en Abancay y Andahuaylas: minería, salud pública y Gobierno Regional de Apurímac."
  },
  "amazonas": {
    name: "Amazonas",
    label: "Amazonas (Chachapoyas)",
    description: "Convocatorias vigentes en Chachapoyas, Bagua y Condorcanqui: salud intercultural, educación y desarrollo rural."
  },
  "huancavelica": {
    name: "Huancavelica",
    label: "Huancavelica",
    description: "Plazas públicas en Huancavelica: convocatorias CAS para docentes, personal de salud e ingenieros."
  },
  "moquegua": {
    name: "Moquegua",
    label: "Moquegua (Ilo)",
    description: "Ofertas laborales en Moquegua e Ilo: minería de cobre, sector portuario y convocatorias del Estado."
  },
  "pasco": {
    name: "Pasco",
    label: "Pasco (Cerro de Pasco / Oxapampa)",
    description: "Convocatorias de empleo en Pasco: minería, sector agroforestal y plazas públicas regionales."
  },
  "tumbes": {
    name: "Tumbes",
    label: "Tumbes",
    description: "Empleos en el extremo norte: acuicultura, aduanas, GORE Tumbes y sector público."
  },
  "madre-de-dios": {
    name: "Madre de Dios",
    label: "Madre de Dios (Puerto Maldonado)",
    description: "Convocatorias públicas y privadas en Puerto Maldonado: conservación ambiental y sector público."
  },
  "remoto": {
    name: "Nacional / Remoto",
    label: "Nacional / Teletrabajo",
    description: "Convocatorias con modalidad 100% remota o cobertura a nivel nacional para postulantes de todo el Perú."
  }
};

export async function generateStaticParams() {
  return Object.keys(REGIONES_MAP).map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const regionKey = region.toLowerCase();
  const regionInfo = REGIONES_MAP[regionKey];
  if (!regionInfo) return { robots: { index: false, follow: false } };
  const adsSettings = getChambaAdsenseSettings();

  const allJobs = await getJobPostings();
  const todayIso = new Date().toISOString().split("T")[0];
  const activeRegionJobsCount = allJobs.filter((job) => {
    if (job.status !== "Vigente") return false;
    if (job.end_date && job.end_date.trim() < todayIso) return false;
    const jobRegion = (job.region || "").toLowerCase();
    if (regionKey === "remoto") {
      return jobRegion.includes("remoto") || jobRegion.includes("nacional") || jobRegion.includes("teletrabajo");
    }
    if (regionKey === "lima") {
      return jobRegion.includes("lima") || jobRegion.includes("callao");
    }
    return jobRegion.includes(regionInfo.name.toLowerCase());
  }).length;
  const hasEnoughRegionJobs = activeRegionJobsCount >= 5;

  const title = `Chamba en ${regionInfo.name} 2026 — Ofertas de Trabajo y Convocatorias`;
  const description = `Encuentra chamba y convocatorias de trabajo vigentes en ${regionInfo.name}, Perú. Convocatorias del Estado (CAS 1057, 728) y sector privado con bases oficiales en PDF.`;
  const canonicalUrl = `${SITE_URL}/empleos/en/${region}`;

  return {
    title,
    description,
    robots: {
      index: hasEnoughRegionJobs,
      follow: true,
    },
    ...(hasEnoughRegionJobs && adsSettings.enabled && adsSettings.clientId
      ? { other: { "google-adsense-account": adsSettings.clientId } }
      : {}),
    keywords: [
      `chamba en ${regionInfo.name.toLowerCase()}`,
      `trabajo en ${regionInfo.name.toLowerCase()}`,
      `empleos ${regionInfo.name.toLowerCase()}`,
      `convocatorias ${regionInfo.name.toLowerCase()} 2026`,
      `trabajo en el estado ${regionInfo.name.toLowerCase()}`,
      `convocatorias cas ${regionInfo.name.toLowerCase()}`,
      "chamba pro",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "chamba pro",
      locale: "es_PE",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `Convocatorias de Trabajo y Chamba en ${regionInfo.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function RegionJobsPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionKey = region.toLowerCase();
  const regionInfo = REGIONES_MAP[regionKey];

  if (!regionInfo) {
    notFound();
  }

  const allJobs = await getJobPostings();
  const todayIso = new Date().toISOString().split("T")[0];

  // Filtrar convocatorias vigentes que correspondan a la región
  const regionJobs = allJobs.filter((job) => {
    if (job.status !== "Vigente") return false;
    if (job.end_date && job.end_date.trim() < todayIso) return false;

    const jobRegion = (job.region || "").toLowerCase();
    if (regionKey === "remoto") {
      return jobRegion.includes("remoto") || jobRegion.includes("nacional") || jobRegion.includes("teletrabajo");
    }
    if (regionKey === "lima") {
      return jobRegion.includes("lima") || jobRegion.includes("callao");
    }
    return jobRegion.includes(regionInfo.name.toLowerCase());
  });

  const totalVacancies = regionJobs.reduce((acc, curr) => acc + (curr.vacancies_count || 1), 0);

  // Convocatorias nacionales/remotas vigentes de respaldo para evitar páginas vacías (Soft 404 / AdSense Zero-Results Policy)
  const fallbackNationalJobs =
    regionJobs.length === 0
      ? allJobs
          .filter((job) => {
            if (job.status !== "Vigente") return false;
            if (job.end_date && job.end_date.trim() < todayIso) return false;
            return true;
          })
          .slice(0, 6)
      : [];

  // Structured Data: BreadcrumbList
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
        name: regionInfo.name,
        item: `${SITE_URL}/empleos/en/${region}`,
      },
    ],
  };

  // Structured Data: ItemList
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Convocatorias de trabajo vigentes en ${regionInfo.name}`,
    itemListElement: regionJobs.slice(0, 15).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${job.title} — ${job.entity_name}`,
      url: `${SITE_URL}/empleos/${job.slug}`,
    })),
  };

  // Structured Data: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Dónde encontrar convocatorias de trabajo vigentes en ${regionInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `En Chamba Pro agrupamos diariamente las ofertas de empleo y convocatorias CAS en ${regionInfo.name} con bases oficiales de Gobiernos Regionales, municipalidades, DIRESA, UGELs y empresas privadas.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Qué entidades públicas contratan personal en ${regionInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `En ${regionInfo.name} convocan periódicamente el Gobierno Regional, municipalidades provinciales y distritales, EsSalud, Poder Judicial, Ministerio Público, SUNAT y los sectores de Salud y Educación.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Cómo postular a empleos del Estado en ${regionInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Ingresa a la convocatoria de tu interés en Chamba Pro, descarga las bases en PDF con los requisitos y cronograma, y envía tu postulación a través de la mesa de partes digital o portal oficial de la entidad convocante.`,
        },
      },
    ],
  };

  const adsSettings = getChambaAdsenseSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {regionJobs.length >= 5 && adsSettings.enabled && adsSettings.clientId ? (
        <ChambaAdSense clientId={adsSettings.clientId} />
      ) : null}
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/empleos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Convocatorias</Link>
        <ChevronRight size={12} />
        <span className="text-slate-900 dark:text-white font-semibold">{regionInfo.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
          <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>Bolsa de Trabajo Regional Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          Convocatorias en <span className="text-emerald-600 dark:text-emerald-400">{regionInfo.label}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {regionInfo.description} Consulta convocatorias públicas reguladas por SERVIR, bases oficiales y remuneraciones con postulación directa sin intermediarios.
        </p>

        {/* Counter Summary Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm">
            <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold mr-1">{regionJobs.length}</strong> convocatorias vigentes
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm">
            <strong className="text-amber-600 dark:text-amber-400 text-sm font-bold mr-1">{totalVacancies}</strong> plazas disponibles
          </div>
          <Link
            href={`/empleos?region=${encodeURIComponent(regionInfo.name)}`}
            className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Filtros avanzados</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Job Listings Grid */}
      <div className="space-y-6">
        {regionJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionJobs.slice(0, 3).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* In-Feed Native Ad Slot */}
              <div className="col-span-full">
                <AdBannerSlot type="in-feed" />
              </div>

              {regionJobs.slice(3, 24).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {regionJobs.length > 24 && (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Mostrando las primeras <strong>24</strong> de <strong>{regionJobs.length}</strong> convocatorias vigentes en <strong>{regionInfo.name}</strong>.
                </p>
                <div>
                  <Link
                    href={`/empleos?region=${encodeURIComponent(regionInfo.name)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <span>Explorar todas las {regionJobs.length} plazas con buscador y filtros</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-3 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Briefcase size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Sin convocatorias exclusivas en {regionInfo.name} hoy — Mostrando plazas Nacionales Vigentes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Mientras las entidades locales de {regionInfo.name} publican nuevas bases, puedes postular desde tu región a estas convocatorias vigentes de alcance nacional y teletrabajo:
              </p>
            </div>

            {fallbackNationalJobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fallbackNationalJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            <div className="text-center pt-2">
              <Link
                href="/empleos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs font-display hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <ArrowLeft size={14} />
                <span>Explorar todas las convocatorias en Perú</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* AdSense Leaderboard Slot — Solo se muestra cuando hay contenido real en la región (AdSense Policy) */}
      {regionJobs.length >= 5 && (
        <div className="pt-6">
          <AdBannerSlot type="leaderboard" />
        </div>
      )}

      {/* Guía Regional de Empleo Público y Postulación en la Región */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
          Guía de Postulación a Convocatorias Públicas y Privadas en la Región {regionInfo.name}
        </h2>
        <p>
          El mercado laboral institucional en <strong>{regionInfo.label}</strong> abarca procesos de selección convocados por el Gobierno Regional (GORE {regionInfo.name}), Direcciones Regionales de Salud (DIRESA / Redes de Salud), Direcciones Regionales de Educación (DRE y UGEL provinciales), Municipalidades Provinciales y Distritales, Cortes Superiores de Justicia, sedes desconcentradas de ministerios (MIDIS, MTC, MIDAGRI, MINJUS, SUNAT, SUNARP, EsSalud) y empresas privadas de alcance regional. Todas las plazas estatales bajo los regímenes <strong>D.L. N.° 1057 (CAS)</strong>, <strong>D.L. N.° 728</strong>, <strong>D.L. N.° 276</strong> y <strong>Ley N.° 30057 (SERVIR)</strong> se difunden de manera obligatoria conforme al Decreto Supremo N.° 003-2018-TR.
        </p>
        <p>
          Para postular con éxito a una plaza en <strong>{regionInfo.name}</strong>, descarga siempre las bases integradas en PDF y verifica la modalidad de recepción del expediente: mesa de partes presencial en la sede institucional o mesa de partes virtual (sistema web o correo institucional habilitado dentro del horario oficial del cronograma). Recuerda foliarlo de atrás hacia adelante o según lo indiquen las bases, firmar cada anexo obligatorio y respaldar toda experiencia general y específica con constancias de trabajo, contratos u órdenes de servicio acompañadas de su respectiva conformidad. Utiliza gratuitamente nuestra <Link href="/calculadora-sueldo" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Calculadora Salarial</Link>, el <Link href="/match-cv" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Analizador de Compatibilidad de CV</Link> y el <Link href="/simulador-entrevista-ia" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Simulador de Entrevista CAS</Link> para preparar tu postulación.
        </p>
        <p>
          Asimismo, ten presente que todas las convocatorias públicas en el departamento de <strong>{regionInfo.name}</strong> contemplan bonificaciones de ley sobre el puntaje final o en la entrevista personal para licenciados de las Fuerzas Armadas (10% según Ley N.° 29248), personas con discapacidad acreditadas ante CONADIS (15% según Ley N.° 29973) y deportistas calificados de alto nivel, siempre que el postulante lo declare en su ficha curricular y adjunte el documento oficial correspondiente.
        </p>
      </section>
    </div>
  );
}
