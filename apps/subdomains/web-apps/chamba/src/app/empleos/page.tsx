import type { Metadata } from "next";
import { getJobPostings, getSubdomainConfig } from "@atpdev/database";
import { JobCard } from "@/components/JobCard";
import { JobFilterClient } from "@/components/JobFilterClient";
import WhatsAppSubscribeWidget from "@/components/WhatsAppSubscribeWidget";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { Search, Filter, Briefcase } from "lucide-react";
import { SITE_URL } from "@/lib/siteConfig";

export const revalidate = 1800; // 30 minutos de caché en CDN

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q?.trim();
  const region = params.region?.trim();
  const regimen = params.regimen?.trim();

  let title = "Buscador de Convocatorias de Trabajo Perú 2026";
  if (q) {
    title = `Convocatorias de "${q}" en Perú 2026 | chamba pro`;
  } else if (region && regimen) {
    title = `Convocatorias ${regimen} en ${region} 2026 | chamba pro`;
  } else if (region) {
    title = `Convocatorias de Trabajo en ${region} 2026 | chamba pro`;
  } else if (regimen) {
    title = `Convocatorias ${regimen} Perú 2026 | chamba pro`;
  }

  return {
    title,
    description: "Encuentra convocatorias de trabajo vigentes en Perú: CAS, 728, 276 y locación de servicios en ministerios, municipalidades y entidades públicas.",
    alternates: {
      canonical: `${SITE_URL}/empleos`,
    },
    robots: {
      index: !q,
      follow: true,
      googleBot: {
        index: !q,
        follow: true,
      },
    },
    openGraph: {
      title,
      description: "Encuentra convocatorias de trabajo vigentes en Perú: CAS, 728, 276 y locación de servicios en el Estado.",
      url: `${SITE_URL}/empleos`,
      type: "website",
    },
  };
}

export default async function EmpleosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const region = params.region || "";
  const regimen = params.regimen || "";
  const categoria = params.categoria || "";
  const educacion = params.educacion || "";
  const sueldo = params.sueldo || "";
  const sort = params.sort || "ending_soon";
  const hideExpired = params.hide_expired !== "false"; // Por defecto true para no mostrar ofertas vencidas

  const [allJobs, config] = await Promise.all([
    getJobPostings(),
    getSubdomainConfig("chamba")
  ]);
  const todayIso = new Date().toISOString().split("T")[0];

  const parseSalaryNumber = (s: string) => {
    const num = s.replace(/[,.]/g, "").match(/\d+/g);
    return num ? Math.max(...num.map(Number)) : 0;
  };

  // 1. Lógica de Filtrado (Solo convocatorias aprobadas y vigentes)
  const filteredJobs = allJobs.filter((job) => {
    if (job.status !== 'Vigente') {
      return false;
    }
    // Si hideExpired está activo, ocultamos las convocatorias cerradas
    if (hideExpired && job.end_date && job.end_date < todayIso) {
      return false;
    }
    if (q) {
      const qLow = q.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(qLow);
      const matchEntity = job.entity_name.toLowerCase().includes(qLow);
      const matchDesc = job.description.toLowerCase().includes(qLow);
      const matchPlazas = Boolean(job.plazas && job.plazas.some(p => 
        p.title.toLowerCase().includes(qLow) || 
        (p.education && p.education.toLowerCase().includes(qLow)) ||
        (p.cas_code && p.cas_code.toLowerCase().includes(qLow))
      ));
      if (!matchTitle && !matchEntity && !matchDesc && !matchPlazas) return false;
    }
    if (region) {
      const rLow = region.toLowerCase();
      const jobRLow = job.region.toLowerCase();
      const isMatch = jobRLow.includes(rLow) || rLow.includes(jobRLow) || jobRLow.includes("nacional");
      if (!isMatch) return false;
    }
    if (regimen) {
      const regLow = regimen.toLowerCase();
      const jobRegLow = job.sector_type.toLowerCase();
      const isMatch = jobRegLow.includes(regLow) || regLow.includes(jobRegLow);
      if (!isMatch) return false;
    }
    if (categoria && job.category.toLowerCase() !== categoria.toLowerCase()) return false;
    if (educacion && job.education_level.toLowerCase() !== educacion.toLowerCase()) return false;
    if (sueldo) {
      const val = job.salary_max || parseSalaryNumber(job.salary_text);
      if (sueldo === "1000-3000" && (val < 1000 || val > 3000)) return false;
      if (sueldo === "3000-6000" && (val < 3000 || val > 6000)) return false;
      if (sueldo === "6000-15000" && val < 6000) return false;
    }
    return true;
  });

  // 2. Lógica de Ordenamiento Inteligente
  filteredJobs.sort((a, b) => {
    if (sort === "ending_soon") {
      // Las no vencidas primero, priorizando convocatorias del CMS / reclutadores
      const aExpired = a.end_date && a.end_date < todayIso;
      const bExpired = b.end_date && b.end_date < todayIso;
      if (aExpired && !bExpired) return 1;
      if (!aExpired && bExpired) return -1;
      const isCmsA = a.id?.startsWith('job-cms-') || a.id?.startsWith('job-admin-');
      const isCmsB = b.id?.startsWith('job-cms-') || b.id?.startsWith('job-admin-');
      if (isCmsA && !isCmsB) return -1;
      if (!isCmsA && isCmsB) return 1;
      return (a.end_date || "9999").localeCompare(b.end_date || "9999");
    }
    if (sort === "recent") {
      const dateA = a.created_at || a.start_date || "";
      const dateB = b.created_at || b.start_date || "";
      return dateB.localeCompare(dateA);
    }
    if (sort === "vacancies_desc") {
      return (b.vacancies_count || 1) - (a.vacancies_count || 1);
    }
    if (sort === "salary_desc") {
      return (b.salary_max || parseSalaryNumber(b.salary_text)) - (a.salary_max || parseSalaryNumber(a.salary_text));
    }
    return 0;
  });

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
        name: "Convocatorias de Trabajo",
        item: `${SITE_URL}/empleos`,
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Convocatorias y Empleos Vigentes en Perú",
    description: "Lista de convocatorias de trabajo en el Estado (CAS, 728, 276) y sector privado.",
    numberOfItems: filteredJobs.length,
    itemListElement: filteredJobs.slice(0, 30).map((job, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `${job.title} — ${job.entity_name}`,
      url: `${SITE_URL}/empleos/${job.slug}`,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* JSON-LD Schemas for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {/* Page Title Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <Briefcase size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>Búsqueda Oficial de Convocatorias en Perú</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          Buscador de Ofertas y Convocatorias Laborales
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Filtra por institución, régimen laboral (CAS 1057, D.L. 728, 276), departamento geográfico, nivel educativo y rango salarial.
        </p>
      </div>

      {/* Top Billboard Ad Slot */}
      <AdBannerSlot type="leaderboard" />

      {/* Main Grid: Filters Sidebar + Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Interactive Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-4 sm:p-5 rounded-2xl space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <JobFilterClient
              initialQ={q}
              initialRegion={region}
              initialRegimen={regimen}
              initialCategoria={categoria}
              initialEducacion={educacion}
              initialSueldo={sueldo}
              initialSort={sort}
              initialHideExpired={hideExpired}
            />
          </div>

          <AdBannerSlot type="sidebar" />
        </div>

        {/* Results Container */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span>Mostrando <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{filteredJobs.length}</strong> de {allJobs.length} convocatorias activas</span>
            {filteredJobs.length === 0 && <span className="text-amber-600 dark:text-amber-400 font-semibold">Sin resultados exactos</span>}
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl text-center space-y-3 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Search size={36} className="text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No se encontraron convocatorias</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Intenta ajustar los criterios de búsqueda o restablecer los filtros seleccionados para ver más resultados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp / Telegram Subscription Widget */}
      <WhatsAppSubscribeWidget 
        whatsappEnabled={config.modules?.whatsapp_channel_enabled ?? true}
        telegramEnabled={config.modules?.telegram_channel_enabled ?? true}
        whatsappUrl={config.contact?.whatsapp_channel_url || (config.contact?.whatsapp ? `https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}` : undefined)}
        telegramUrl={config.contact?.telegram_channel_url || 'https://t.me/chambapro_peru'}
      />
    </div>
  );
}
