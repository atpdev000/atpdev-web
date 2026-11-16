import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, Calendar, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, FileText, Search } from 'lucide-react';
import { getAllGuias } from '@/data/guias';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Guías Laborales y Consejos para Convocatorias del Estado Perú 2026',
  description: 'Colección de guías especializadas, normatividad laboral y consejos prácticos para postular y ganar convocatorias CAS, 728 y 276 en el Estado peruano.',
  alternates: {
    canonical: `${SITE_URL}/guias`,
  },
  openGraph: {
    title: 'Guías Laborales y Convocatorias CAS 2026 | Chamba Pro',
    description: 'Guías paso a paso para elaborar tu CV SERVIR, preparar entrevistas laborales y conocer tus derechos en el sector público.',
    url: `${SITE_URL}/guias`,
    siteName: 'chamba pro',
    type: 'website',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default function GuiasIndexPage() {
  const guias = getAllGuias();

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
        name: 'Guías Laborales',
        item: `${SITE_URL}/guias`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Guías Laborales Oficiales para el Estado Peruano',
    description: 'Manuales, normatividad y guías prácticas para postular a convocatorias públicas en Perú.',
    numberOfItems: guias.length,
    itemListElement: guias.map((guia, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: guia.title,
      url: `${SITE_URL}/guias/${guia.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-transparent">
        <div className="absolute inset-0 bg-radial-at-c from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
            <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Guías Laborales</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold">
              <BookOpen size={13} />
              <span>Centro de Conocimiento y Empleo Público</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              Guías Oficiales para <span className="text-emerald-700 dark:text-emerald-400">Trabajar en el Estado</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Artículos formativos, análisis normativo de la legislación laboral peruana (CAS, SERVIR, D.L. 728 y 276) y consejos prácticos elaborados por especialistas para maximizar tus posibilidades de éxito en concursos públicos.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-white/10 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Guías Especializadas</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">6 Guías Exhaustivas</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Normatividad Aplicable</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">D.L. 1057 / 728 / 276</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Enfoque Metodológico</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">SERVIR & STAR</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Actualización</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Vigente Convocatorias 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Artículos y Manuales de Postulación</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecciona una guía para acceder al contenido completo, cuadros explicativos y preguntas frecuentes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guias.map((guia) => (
            <article
              key={guia.slug}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] transition-all duration-300 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Category & Read Time */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold">
                    {guia.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Clock size={12} />
                    {guia.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  <Link href={`/guias/${guia.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {guia.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {guia.description}
                </p>
              </div>

              {/* Footer details */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                  Actualizado {guia.updatedAt}
                </span>

                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Leer Guía
                  <ArrowRight size={13} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Educational Banner for Quality and E-E-A-T */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-mono font-bold uppercase tracking-wider">
              Compromiso Editorial Chamba Pro
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Información Verificada y Conforme a la Normatividad Peruana
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Todos los artículos de nuestra sección de Guías Laborales son elaborados y revisados rigurosamente tomando como fuente la normativa de SERVIR, el Ministerio de Trabajo y Promoción del Empleo (MTPE) y los pronunciamientos del Tribunal del Servicio Civil.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/empleos"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-display flex items-center gap-2 transition-all shadow-md"
              >
                <Search size={14} />
                Explorar Convocatorias Vigentes
              </Link>
              <Link
                href="/crear-cv-cas"
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs font-display flex items-center gap-2 transition-all border border-slate-200 dark:border-white/10 shadow-sm"
              >
                <FileText size={14} />
                Generar CV Formato SERVIR
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
