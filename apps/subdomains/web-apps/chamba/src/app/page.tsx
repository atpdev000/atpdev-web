import type { Metadata } from "next";
import Link from "next/link";
import { getJobPostings, getSubdomainConfig } from "@atpdev/database";
import { JobSearchHero } from "@/components/JobSearchHero";
import { JobCard } from "@/components/JobCard";
import { RegionesGrid } from "@/components/RegionesGrid";
import WhatsAppSubscribeWidget from "@/components/WhatsAppSubscribeWidget";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { AdLateralRail } from "@/components/AdLateralRail";
import { ShieldCheck, Building2, MapPin, ArrowRight, CheckCircle2, Calculator, HelpCircle, FileText, UserCheck, FileSpreadsheet, Scale, ChevronDown, BookOpen, Clock } from "lucide-react";
import { SITE_URL } from "@/lib/siteConfig";
import { getAllGuias } from "@/data/guias";

export const metadata: Metadata = {
  title: {
    absolute: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
  },
  description: "Convocatorias de trabajo y chamba en Perú 2026: plazas CAS 1057, 728 y sector privado. Bases oficiales, requisitos y salarios en portales del Estado.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
    description: "Convocatorias de trabajo y chamba en Perú 2026: plazas CAS 1057, 728 y sector privado. Bases oficiales, requisitos y salarios en portales del Estado.",
    url: SITE_URL,
    siteName: "chamba pro",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
    description: "Convocatorias de trabajo y chamba en Perú 2026: plazas CAS 1057, 728 y sector privado. Bases oficiales, requisitos y salarios en portales del Estado.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [jobs, config] = await Promise.all([
    getJobPostings(),
    getSubdomainConfig("chamba")
  ]);
  const todayIso = new Date().toISOString().split("T")[0];

  // Solo convocatorias vigentes (aprobadas y no vencidas) en la portada
  const activeJobs = jobs.filter(j => j.status === 'Vigente' && (!j.end_date || j.end_date >= todayIso));

  // Priorizar convocatorias recién aprobadas / creadas en el CMS y convocatorias destacadas
  const sortedActive = [...activeJobs].sort((a, b) => {
    const isCmsA = a.id?.startsWith('job-cms-') || a.id?.startsWith('job-admin-');
    const isCmsB = b.id?.startsWith('job-cms-') || b.id?.startsWith('job-admin-');
    if (isCmsA && !isCmsB) return -1;
    if (!isCmsA && isCmsB) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const dateA = a.created_at || a.start_date || '';
    const dateB = b.created_at || b.start_date || '';
    return dateB.localeCompare(dateA);
  });

  const featuredJobs = sortedActive.slice(0, 12);

  const totalVacancies = activeJobs.reduce((acc, curr) => acc + curr.vacancies_count, 0);

  return (
    <div className="space-y-16 pb-20 relative">
      {/* Lateral Skyscraper Ads (Visible on widescreen displays >= 1540px without affecting reading flow) */}
      <AdLateralRail />

      {/* Hero Section */}
      <JobSearchHero 
        totalJobs={activeJobs.length} 
        totalVacancies={totalVacancies} 
        branding={config.branding}
        accentColor={config.theme?.accent_color}
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Quick Filter Categories */}
        {/* Quick Filter Categories */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>Modalidades de Contratación</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Explorar por Régimen Laboral y Sector
              </h2>
            </div>
            <Link 
              href="/empleos" 
              className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
            >
              <span>Ver todas las vacantes</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Link
              href="/convocatorias/cas"
              className="p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-3 group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                  CAS
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  Estado
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  D.L. 1057 (CAS)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 text-pretty">Convocatorias del Estado y Gobiernos&nbsp;Regionales</p>
              </div>
            </Link>

            <Link
              href="/convocatorias/728"
              className="p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-3 group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  728
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  Planilla
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  D.L. 728 (Planilla)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 text-pretty">Estabilidad laboral con beneficios de&nbsp;ley</p>
              </div>
            </Link>

            <Link
              href="/convocatorias/privado"
              className="p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-3 group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  PRIV
                </span>
                <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  Corporativo
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Sector Privado
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 text-pretty">Banca, telecomunicaciones e industrias&nbsp;verificadas</p>
              </div>
            </Link>

            <Link
              href="/empleos/en/lima"
              className="p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-3 group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <MapPin size={18} />
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  Capital
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  Lima & Callao
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">Sedes centrales de ministerios e instituciones</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Job Listings Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Actualizado hoy • Convocatorias 100% verificadas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                <span>Convocatorias Destacadas</span>
                <span className="text-emerald-600 dark:text-emerald-400">y Plazas Vigentes</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Oportunidades laborales validadas con RUC activo y derivación directa a los portales oficiales de SERVIR, Gob.pe y entidades públicas y privadas del Perú.
              </p>
            </div>
            <Link
              href="/empleos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto shrink-0"
            >
              <span>Explorar todas</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                {jobs.length}
              </span>
              <ArrowRight size={13} className="text-slate-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.slice(0, 3).map(job => (
              <JobCard key={job.id} job={job} />
            ))}

            {/* In-Feed Native Ad Slot */}
            <div className="col-span-full">
              <AdBannerSlot type="in-feed" />
            </div>

            {featuredJobs.slice(3).map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* Regional Department Grid Section */}
        <section>
          <RegionesGrid />
        </section>

        {/* WhatsApp & Telegram Subscriptions Banner */}
        <section>
          <WhatsAppSubscribeWidget 
            whatsappEnabled={config.modules?.whatsapp_channel_enabled ?? true}
            telegramEnabled={config.modules?.telegram_channel_enabled ?? true}
            whatsappUrl={config.contact?.whatsapp_channel_url || (config.contact?.whatsapp ? `https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}` : undefined)}
            telegramUrl={config.contact?.telegram_channel_url || 'https://t.me/chambapro_peru'}
          />
        </section>

        {/* High Utility Tools Banner (Calculadora, Examen CAS, Entrevista IA, Generador CV, Comparador, Plantillas) */}
        {/* High Utility Tools Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <Link
            href="/calculadora-sueldo"
            className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shrink-0 shadow-xs shadow-teal-500/10 group-hover:scale-105 transition-transform duration-200">
                  <Calculator size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Calculadora de Sueldo Neto
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                Calcula tu salario líquido y aportes obligatorios de AFP, ONP y 5ta categoría en CAS 1057 y 728.
              </p>
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 pt-4">
              <span>Calcular salario</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/preguntas-entrevista-cas"
            className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shrink-0 shadow-xs shadow-amber-500/10 group-hover:scale-105 transition-transform duration-200">
                  <HelpCircle size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Examen & Preguntas CAS
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                Balotarios interactivos basados en Ley 27444, Contrataciones del Estado y Ética Pública.
              </p>
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 pt-4">
              <span>Practicar examen</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/simulador-entrevista-ia"
            className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold shrink-0 shadow-xs shadow-sky-500/10 group-hover:scale-105 transition-transform duration-200">
                  <UserCheck size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Simulador de Entrevista Técnica
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                Entrena tus respuestas ante jurados evaluadores de ministerios, SUNAT, Poder Judicial y gobiernos regionales.
              </p>
            </div>
            <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 pt-4">
              <span>Iniciar simulación técnica</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/crear-cv-cas"
            className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shrink-0 shadow-xs shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
                  <FileSpreadsheet size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Generador CV Formato SERVIR
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                Genera tu Ficha Resumen de Hoja de Vida estandarizada para postulaciones públicas en PDF y Word.
              </p>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 pt-4">
              <span>Crear CV oficial</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/comparador-regimenes"
            className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-orange-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold shrink-0 shadow-xs shadow-orange-500/10 group-hover:scale-105 transition-transform duration-200">
                  <Scale size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Comparador de Regímenes
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                Compara lado a lado derechos de CTS, Gratificación y Vacaciones entre CAS, D.L. 728 y 276.
              </p>
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 pt-4">
              <span>Ver comparativa</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/plantillas-anexos"
            className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-rose-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold shrink-0 shadow-xs shadow-rose-500/10 group-hover:scale-105 transition-transform duration-200">
                  <FileText size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Plantillas & Anexos CAS
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                Descarga formatos editables de Declaraciones Juradas, Anexo de No Impedimento y Bonificaciones.
              </p>
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 pt-4">
              <span>Descargar formatos</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </section>

        {/* Why Chamba Pro Trust Section */}
        <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 shadow-xs">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Transparencia y Seguridad Laboral</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Garantía de Veracidad y Acceso Libre a Convocatorias
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Sin cobros ni registros:</strong> Acceso 100% abierto a las bases oficiales de cada convocatoria.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Derivación directa:</strong> Enlace al portal institucional oficial de la entidad o empresa contratante.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Filtro antifraude:</strong> Validación rigurosa de RUC y datos de contacto oficiales.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Bases en PDF:</strong> Acceso a documentos oficiales de requerimiento, cronograma y anexos.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Guías Laborales Section (E-E-A-T & High Quality Content) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={13} />
                <span>Centro Editorial y Guías Oficiales</span>
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
                Guías de Postulación y Normatividad Laboral Perú
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Manuales elaborados conforme a directrices de SERVIR y la legislación laboral pública (D.L. 1057, 728 y 276).
              </p>
            </div>
            <Link
              href="/guias"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold shrink-0 hover:translate-x-1 transition-all"
            >
              <span>Ver todas las guías</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {getAllGuias().slice(0, 3).map((guia) => (
              <article
                key={guia.slug}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-emerald-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                      {guia.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Clock size={11} />
                      {guia.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    <Link href={`/guias/${guia.slug}`}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {guia.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {guia.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Actualizado {guia.updatedAt}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Leer <ArrowRight size={11} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Semantic FAQ Section for SEO & AdSense Content Quality */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={13} />
              <span>Preguntas Frecuentes de Postulantes</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Todo lo que necesitas saber sobre convocatorias y empleo en el Perú
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Respuestas oficiales sobre el proceso de postulación, regímenes laborales del Estado y uso de nuestras herramientas gratuitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Dónde encontrar convocatorias de trabajo y empleo formal en el Estado?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6 text-pretty">
                En chamba pro reunimos diariamente las convocatorias públicas vigentes reguladas por la Autoridad Nacional del Servicio Civil (SERVIR), Ministerios, Municipalidades y Gobiernos Regionales, así como vacantes de empresas privadas&nbsp;verificadas, con enlaces directos a las bases oficiales en PDF.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Cuál es la diferencia entre un contrato CAS 1057 y D.L. 728?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6 text-pretty">
                El régimen CAS (D.L. 1057) es el contrato más extendido en el Estado con aguinaldos fijos en julio/diciembre. El régimen 728 es el de la actividad privada con gratificaciones completas (1 sueldo en julio y diciembre) y depósito de CTS. Puedes compararlos al detalle en nuestro <Link href="/comparador-regimenes" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">Comparador de Regímenes&nbsp;Laborales</Link>.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Es gratuito postular a los empleos mostrados en chamba pro?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6 text-pretty">
                Sí, el acceso y la postulación son 100% gratuitos y sin cobros sorpresa. Chamba Pro no cobra por consultar bases oficiales ni exige registros obligatorios; te conectamos directamente al portal institucional de la entidad (SUNAT, MINEDU, Poder Judicial, etc.).
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Cómo preparar mi CV y declaraciones juradas para convocatorias públicas?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                Para postular al Estado debes presentar tu Ficha Resumen de Hoja de Vida y Anexos según el formato exigido en las bases. Puedes generar tu documento en minutos con nuestro <Link href="/crear-cv-cas" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">Generador de CV Formato CAS</Link> y descargar declaraciones juradas en <Link href="/plantillas-anexos" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">Plantillas de Anexos</Link>.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Structured Data: ItemList Schema & FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: featuredJobs.map((job, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${job.title} — ${job.entity_name}`,
              url: `${SITE_URL}/empleos/${job.slug}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Dónde encontrar convocatorias de trabajo y chamba formal en el Estado?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "En chamba pro reunimos diariamente las convocatorias públicas vigentes reguladas por la Autoridad Nacional del Servicio Civil (SERVIR), Ministerios, Municipalidades y Gobiernos Regionales, con enlaces directos a las bases oficiales.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuál es la diferencia entre un contrato CAS 1057 y D.L. 728?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "El régimen CAS (D.L. 1057) otorga aguinaldos y seguro social en el sector público, mientras que el D.L. 728 concede gratificaciones legales completas y depósito semestral de CTS según el régimen laboral de la actividad privada.",
                },
              },
              {
                "@type": "Question",
                name: "¿Es gratuito postular a los empleos mostrados en chamba pro?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, el acceso y la postulación son 100% gratuitos. Chamba Pro no solicita registros obligatorios ni cobra tarifas; cada convocatoria te redirige al portal oficial de la entidad convocante.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cómo preparar mi CV y declaraciones juradas para convocatorias públicas?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Puedes utilizar de manera gratuita nuestro Generador de CV formato SERVIR y la sección de Plantillas de Anexos para descargar formatos editables de declaraciones juradas exigidas por las entidades del Estado.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
