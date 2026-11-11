import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Search, Briefcase, Users, ShieldCheck, ExternalLink, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { getOrganizations, OrganizationItem, OrganizationCategory } from '@atpdev/database';
import OrganizationsClient from './OrganizationsClient';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 1800; // 30 minutos

export const metadata: Metadata = {
  title: 'Directorio de Entidades Públicas y Organizaciones del Estado',
  description: 'Explora más de 120 instituciones públicas, ministerios, municipalidades y organismos autónomos de Perú con convocatorias CAS, 728 y prácticas vigentes.',
  alternates: {
    canonical: `${SITE_URL}/organizaciones`,
  },
  openGraph: {
    title: 'Directorio de Organizaciones y Entidades del Estado Perú | chamba pro',
    description: 'Encuentra convocatorias vigentes en INEI, SUNAT, MINEDU, ESSALUD, Poder Judicial, ONPE y más de 120 entidades públicas verificadas.',
    url: `${SITE_URL}/organizaciones`,
    siteName: 'chamba pro',
    locale: 'es_PE',
    type: 'website',
  }
};

export default async function OrganizacionesPage() {
  const organizations = await getOrganizations();
  const totalJobs = organizations.reduce((acc, o) => acc + o.jobCount, 0);
  const totalVacancies = organizations.reduce((acc, o) => acc + o.vacanciesCount, 0);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Organizaciones y Entidades',
        item: `${SITE_URL}/organizaciones`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Directorio de Entidades Públicas con Convocatorias en Perú',
    description: 'Directorio de instituciones públicas y ministerios del Estado con convocatorias CAS y 728 vigentes.',
    numberOfItems: organizations.length,
    itemListElement: organizations.slice(0, 30).map((org, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: org.name,
      url: `${SITE_URL}/empleos?q=${encodeURIComponent(org.name)}`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-white pb-20 selection:bg-emerald-500 selection:text-white">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Organizaciones</span>
        </nav>

        {/* Hero Banner */}
        <header className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-sm text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold tracking-wide uppercase">
              <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Directorio Oficial de Empleadores Públicos • Perú</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              Instituciones y Entidades con <span className="text-emerald-600 dark:text-emerald-400">Convocatorias Vigentes</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Explora las convocatorias activas de ministerios, cortes de justicia, municipalidades y entidades del Estado con postulación directa y oficial.
            </p>

            {/* Quick Action: Publicar Convocatoria */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/publicar-empleo"
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>¿Eres de Recursos Humanos? Publica tu convocatoria</span>
                <ChevronRight size={14} className="text-emerald-600 dark:text-emerald-400" />
              </Link>
            </div>
          </div>

          {/* Key Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto text-left">
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Entidades Registradas</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
                {organizations.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">En todo el territorio nacional</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <Briefcase size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Procesos Activos</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">
                {totalJobs}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Convocatorias CAS, 728 y 276</p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <Users size={14} className="text-sky-600 dark:text-sky-400" />
                <span>Total Vacantes</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-sky-600 dark:text-sky-300 mt-1">
                {totalVacancies.toLocaleString('es-PE')}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Puestos y plazas disponibles</p>
            </div>
          </div>
        </header>

        {/* Top Banner AdSlot */}
        <AdBannerSlot type="leaderboard" className="my-6" />

        {/* Interactive Client Search & Filter Component */}
        <OrganizationsClient initialOrganizations={organizations} />

        {/* Mid-page Billboard AdSlot */}
        <AdBannerSlot type="billboard" className="my-8" />

        {/* Informational Guidance Section (E-E-A-T) */}
        <section className="mt-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Guía de Postulación en Entidades del Estado Peruano
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recomendaciones oficiales para postulaciones exitosas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>1. Revisa las Bases y el Cronograma</span>
              </h3>
              <p>
                Cada entidad pública emite un cronograma estricto. La fecha de registro de hoja de vida y carga de anexos suele durar únicamente 1 o 2 días hábiles según la normativa SERVIR.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>2. Anexos y Declaraciones Juradas</span>
              </h3>
              <p>
                Descarga los formatos oficiales de la convocatoria respectiva (Anexos de no tener impedimentos para contratar con el Estado, Ley 27588, REDAM y antecedentes). Fírmalos con huella dactilar si lo exigen.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>3. Postulación 100% Gratuita</span>
              </h3>
              <p>
                Todas las convocatorias del Estado peruano son completamente gratuitas. chamba pro jamás cobrará por acceder a las bases ni por postular a una plaza oficial del sector público.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
