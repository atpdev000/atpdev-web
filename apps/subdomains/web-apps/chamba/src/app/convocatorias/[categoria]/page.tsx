import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobPostings } from "@atpdev/database";
import { JobCard } from "@/components/JobCard";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { Briefcase, ChevronRight, Scale, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SITE_URL } from "@/lib/siteConfig";

export const revalidate = 3600; // 1 hora de caché en CDN
export const dynamicParams = true;

export const CATEGORIAS_MAP: Record<string, { 
  name: string; 
  label: string; 
  sector_match: string;
  description: string;
  benefits: string[];
}> = {
  "cas": {
    name: "CAS 1057",
    label: "Convocatorias CAS (D.L. 1057)",
    sector_match: "CAS 1057",
    description: "Convocatorias de trabajo bajo el régimen especial de Contratación Administrativa de Servicios (CAS) en ministerios, municipalidades, gobiernos regionales y organismos autónomos del Estado Peruano.",
    benefits: [
      "Jornada máxima de 48 horas semanales",
      "30 días de vacaciones remuneradas al año",
      "Aguinaldos de Fiestas Patrias y Navidad según Ley de Presupuesto",
      "Cobertura de salud mediante EsSalud y aportes a ONP/AFP"
    ]
  },
  "728": {
    name: "D.L. 728",
    label: "Convocatorias D.L. 728 (Planilla Estatal)",
    sector_match: "D.L. 728",
    description: "Plazas de empleo bajo el régimen laboral de la actividad privada (D.L. 728) aplicadas en entidades públicas como EsSalud, BCRP, SUNAT, empresas estatales y el Poder Judicial, con estabilidad y beneficios completos.",
    benefits: [
      "Gratificaciones legales completas (1 sueldo en julio y 1 en diciembre)",
      "Depósito semestral de Compensación por Tiempo de Servicios (CTS)",
      "Asignación familiar equivalente al 10% de la RMV",
      "Protección contra despido arbitrario e indemnización de ley"
    ]
  },
  "privado": {
    name: "Sector Privado",
    label: "Empleos en el Sector Privado",
    sector_match: "Privado",
    description: "Bolsa de trabajo en empresas privadas verificadas de telecomunicaciones, banca, minería, consumo masivo y tecnología en todo el territorio nacional con RUC activo y contratación directa.",
    benefits: [
      "Ingreso directo a planilla formal privada",
      "Beneficios de ley CTS, gratificaciones completas y seguro vida ley",
      "Oportunidades de línea de carrera y capacitación corporativa",
      "Bonificaciones por desempeño y utilidades empresariales"
    ]
  },
  "practicas": {
    name: "Prácticas",
    label: "Prácticas Pre y Profesionales",
    sector_match: "Prácticas",
    description: "Convocatorias oficiales de prácticas preprofesionales y profesionales en entidades del Estado y empresas privadas según el Decreto Legislativo N° 1401 y la Ley 28518.",
    benefits: [
      "Subvención económica mensual no menor a la RMV",
      "Media subvención adicional cada 6 meses continuos de prácticas",
      "Seguro médico privado cubierto al 100% por la entidad",
      "Certificación formal de experiencia laboral para convocatorias públicas"
    ]
  },
  "locacion": {
    name: "Locación de Servicios",
    label: "Locación de Servicios y Fondos de Apoyo Gerencial (FAG)",
    sector_match: "Locación / FAG",
    description: "Términos de Referencia (TDR) y convocatorias de servicios por terceros, consultorías independientes y Fondo de Apoyo Gerencial para asesores y especialistas del Estado.",
    benefits: [
      "Honorarios competitivos según especialización y mercado",
      "Flexibilidad en la ejecución de metas y entregables técnicos",
      "Oportunidad de brindar consultoría de alto nivel a ministerios y GOREs",
      "Compatibilidad con asesorías privadas permitidas por ley"
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIAS_MAP).map((categoria) => ({ categoria }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const catInfo = CATEGORIAS_MAP[categoria.toLowerCase()];
  if (!catInfo) return {};

  const title = `Convocatorias ${catInfo.name} 2026 — Empleos y Trabajo en Perú`;
  const description = `Consulta convocatorias vigentes de ${catInfo.name} en el Estado Peruano y sector privado. Bases oficiales en PDF, requisitos, cronograma y salarios.`;
  const canonicalUrl = `${SITE_URL}/convocatorias/${categoria}`;

  return {
    title,
    description,
    keywords: [
      `convocatorias ${catInfo.name.toLowerCase()} 2026`,
      `trabajo ${catInfo.name.toLowerCase()}`,
      `empleos ${catInfo.name.toLowerCase()} peru`,
      `chamba ${catInfo.name.toLowerCase()}`,
      "bases oficiales",
      "postulacion estado peruano",
      "chamba pro"
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
          alt: `Convocatorias de Trabajo ${catInfo.name} Perú`,
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

export default async function ConvocatoriaCategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const catKey = categoria.toLowerCase();
  const catInfo = CATEGORIAS_MAP[catKey];

  if (!catInfo) {
    notFound();
  }

  const allJobs = await getJobPostings();
  const todayIso = new Date().toISOString().split("T")[0];

  const matchedJobs = allJobs.filter((job) => {
    if (job.status !== "Vigente") return false;
    if (job.end_date && job.end_date < todayIso) return false;
    const sector = (job.sector_type || "").toLowerCase();
    return sector.includes(catInfo.sector_match.toLowerCase());
  });

  const totalVacancies = matchedJobs.reduce((acc, curr) => acc + (curr.vacancies_count || 1), 0);

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
        name: catInfo.name,
        item: `${SITE_URL}/convocatorias/${categoria}`,
      },
    ],
  };

  // Structured Data: ItemList
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Convocatorias vigentes ${catInfo.name} en Perú`,
    itemListElement: matchedJobs.slice(0, 15).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${job.title} — ${job.entity_name}`,
      url: `${SITE_URL}/empleos/${job.slug}`,
    })),
  };

  // Structured Data: FAQPage for Google Rich Accordions
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cuáles son los principales beneficios del régimen ${catInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: catInfo.benefits.join('. ') + '.',
        },
      },
      {
        "@type": "Question",
        name: `¿Cómo postular a las convocatorias de ${catInfo.name} en el Estado Peruano?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Para postular a una plaza bajo ${catInfo.name}, descarga las bases oficiales y cronograma en PDF desde Chamba Pro, prepara tu CV documentado y anexos de ley, e ingresa al portal institucional de postulación en la fecha señalada.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Es gratuito el proceso de postulación a empleos de ${catInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sí, todos los procesos de selección bajo ${catInfo.name} en el Estado Peruano son 100% gratuitos y se rigen por los principios de mérito y transparencia de SERVIR.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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
        <span className="text-slate-900 dark:text-white font-semibold">{catInfo.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
          <Scale size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>Régimen Laboral Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          Convocatorias <span className="text-emerald-600 dark:text-emerald-400">{catInfo.name}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {catInfo.description}
        </p>

        {/* Benefits Pill Grid */}
        <div className="pt-2">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2.5">
            Derechos y Beneficios Laborales Clave:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
            {catInfo.benefits.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Counter Summary Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm">
            <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold mr-1">{matchedJobs.length}</strong> convocatorias vigentes
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm">
            <strong className="text-amber-600 dark:text-amber-400 text-sm font-bold mr-1">{totalVacancies}</strong> plazas disponibles
          </div>
          <Link
            href={`/comparador-regimenes`}
            className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Comparar con otros regímenes</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Job Listings Grid */}
      <div className="space-y-6">
        {matchedJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedJobs.slice(0, 3).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* In-Feed Native Ad Slot */}
              <div className="col-span-full">
                <AdBannerSlot type="in-feed" />
              </div>

              {matchedJobs.slice(3, 24).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {matchedJobs.length > 24 && (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Mostrando las primeras <strong>24</strong> de <strong>{matchedJobs.length}</strong> convocatorias vigentes de <strong>{catInfo.name}</strong>.
                </p>
                <div>
                  <Link
                    href={`/empleos?regimen=${encodeURIComponent(catInfo.sector_match)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <span>Explorar todas las {matchedJobs.length} plazas con buscador y filtros</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Briefcase size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              No hay convocatorias activas de {catInfo.name} en este momento
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Las entidades públicas renuevan sus ofertas constantemente. Revisa otras modalidades o explora todas las vacantes vigentes.
            </p>
            <div className="pt-2">
              <Link
                href="/empleos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs font-display hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <ArrowLeft size={14} />
                <span>Ver todas las convocatorias en Perú</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* AdSense Leaderboard Slot */}
      <div className="pt-6">
        <AdBannerSlot type="leaderboard" />
      </div>
    </div>
  );
}
