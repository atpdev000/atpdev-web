import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  Send,
  ShieldCheck,
  Clock,
  Users,
  HelpCircle,
  CheckCircle2,
  MessageSquare,
  Mail,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import PublicarFormClient from './PublicarFormClient';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Publicar Convocatoria u Oferta de Trabajo Oficial',
  description: 'Publica gratuitamente ofertas laborales y convocatorias CAS 1057, 728, 276 para instituciones del Estado y empresas privadas en Perú.',
  alternates: {
    canonical: `${SITE_URL}/publicar-empleo`,
  },
  openGraph: {
    title: 'Publicar Convocatoria de Trabajo en Perú | chamba pro',
    description: 'Difusión oficial para entidades públicas, municipalidades, ministerios y empresas en chamba pro.',
    url: `${SITE_URL}/publicar-empleo`,
    siteName: 'chamba pro',
    locale: 'es_PE',
    type: 'website',
  }
};

export default function PublicarEmpleoPage() {
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
        name: 'Publicar Oferta de Empleo',
        item: `${SITE_URL}/publicar-empleo`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-white pb-20 selection:bg-emerald-500 selection:text-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Publicar Oferta</span>
        </nav>

        {/* Hero Header */}
        <header className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold tracking-wide uppercase">
              <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Para Oficinas de Recursos Humanos (OGRH) y Reclutadores</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              Publica Convocatorias y Ofertas Laborales en <span className="text-emerald-600 dark:text-emerald-400">Chamba Pro</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Difunde formalmente tus procesos de selección CAS 1057, D.L. 728, D.L. 276, Locación de Servicios y convocatorias privadas.
              Conectamos a tu institución con profesionales y técnicos a nivel nacional con postulación directa a tu portal o mesa de partes.
            </p>
          </div>

          {/* Pillars Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/60">
                <Clock size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white font-display">Verificación Rápida</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Revisión editorial y activación oportuna.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/60">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white font-display">Derivación 100% Oficial</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Postulación directa a tu portal o mesa de partes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/60">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white font-display">Difusión Gratuita</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Cero costo para instituciones del Estado.</p>
              </div>
            </div>
          </div>
        </header>

        {/* Top Banner AdSlot */}
        <AdBannerSlot type="leaderboard" className="my-6" />

        {/* Formulario Principal */}
        <PublicarFormClient />

        {/* Mid Billboard AdSlot */}
        <AdBannerSlot type="billboard" className="my-8" />

        {/* Canal Alternativo de Envío Directo (Vía Rápida OGRH) */}
        <section className="rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
              <Sparkles size={14} />
              <span>Canal Directo para Oficinas de Personal</span>
            </div>
            <h2 className="text-lg font-bold font-display text-white">
              ¿Prefieres remitir las bases en PDF o enlace institucional directamente?
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Si tu entidad emite un concurso público con múltiples plazas o cronograma urgente, puedes enviar las bases a nuestro equipo de redacción para su inclusión prioritaria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:convocatorias@atpdev.dev?subject=Envio%20de%20Bases%20Oficiales%20-%20Convocatoria"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-display transition-all border border-white/20 flex items-center gap-2"
            >
              <Mail size={14} />
              <span>convocatorias@atpdev.dev</span>
            </a>
          </div>
        </section>

        {/* Preguntas Frecuentes para Publicadores */}
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold font-display text-base">
            <HelpCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span>Preguntas Frecuentes sobre la Publicación</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white">¿Tiene costo publicar una convocatoria pública?</h3>
              <p className="text-slate-600 dark:text-slate-400">
                No. En estricto cumplimiento con la transparencia laboral y la normativa SERVIR, la publicación y difusión de convocatorias del sector público es 100% gratuita.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white">¿Cómo postulan los candidatos?</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Los postulantes son derivados mediante enlace oficial directo a la página web o mesa de partes virtual de su institución. Chamba Pro no cobra a los postulantes ni retiene expedientes.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white">¿Qué documentos se deben adjuntar?</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Se requiere el enlace oficial a las Bases del Concurso (PDF en portal institucional o Google Drive oficial), cronograma de etapas y formatos de anexos/declaraciones juradas.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white">¿Cómo se actualizan los resultados o comunicados?</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Nuestro crawler indexa periódicamente las secciones de comunicados, listas de aptos y actas finales en el portal oficial de cada entidad registrada.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
