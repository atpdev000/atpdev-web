import Link from 'next/link';
import WhatsAppSubscribeWidget from '@/components/WhatsAppSubscribeWidget';
import { getSubdomainConfig } from '@atpdev/database';
import { ShieldCheck, CheckCircle2, Award, ExternalLink, Zap, Users, Lock } from 'lucide-react';

import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Quiénes Somos & Garantía de Transparencia',
  description: 'Misión de Chamba Pro: agregador nacional de empleo en Perú con enlace directo a fuentes oficiales del Estado, sin cobros y con total transparencia.',
  alternates: {
    canonical: `${SITE_URL}/quienes-somos`,
  },
  openGraph: {
    title: 'Quiénes Somos & Garantía de Transparencia — Chamba Pro',
    description: 'Conoce la misión y valores de transparencia de Chamba Pro.',
    url: `${SITE_URL}/quienes-somos`,
    type: 'website',
  },
};

export default async function QuienesSomosPage() {
  const config = await getSubdomainConfig('chamba');

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
        name: 'Quiénes Somos',
        item: `${SITE_URL}/quienes-somos`,
      },
    ],
  };

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Quiénes Somos — Chamba Pro',
    url: `${SITE_URL}/quienes-somos`,
    description: 'Manifiesto de transparencia, misión editorial y lucha contra el fraude laboral en convocatorias en Perú.',
    mainEntity: {
      '@type': 'Organization',
      name: 'chamba pro',
      legalName: 'ATP DEV',
      url: SITE_URL,
      foundingLocation: 'Perú',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Schemas for E-E-A-T */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold font-mono">
            <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Manifiesto de Transparencia y Servicio al Postulante</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Conectando el Talento Profesional con el <span className="text-emerald-600 dark:text-emerald-400">Sector Público y Privado</span>
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Chamba Pro</strong> nace con un propósito claro: eliminar las estafas laborales, los enlaces caídos y la falta de información clara en el mercado laboral peruano. Agregamos y verificamos convocatorias de las 25 regiones del país con acceso 100% libre, gratuito y sin intermediarios.
          </p>
        </div>

        {/* 4 Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">100% Enlaces Directos a Portales Oficiales</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              En Chamba Pro jamás intermediamos postulaciones ni cobramos por ver las bases. Cada convocatoria incluye enlaces verificados directamente al portal institucional correspondiente (SUNAT, ONPE, RENIEC, MINEDU, BCRP, Gobiernos Regionales y Ministerios).
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Seguridad y Cero Cobros al Postulante</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ninguna convocatoria del Estado peruano bajo los regímenes CAS 1057, 728 o 276 requiere pago de trámites ni comisiones. Promovemos activamente la prevención de fraudes laborales y alertamos ante cualquier cobro indebido.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Estandarización y Verificación Rigurosa</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Procesamos las bases oficiales en PDF y comunicados oficiales diariamente para extraer de forma estructurada los requisitos, cronogramas de postulación, remuneración y anexos de postulación de cada plaza.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cobertura Descentralizada y Nacional</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Monitoreamos municipalidades provinciales y distritales, redes de salud, UGELs y organismos autónomos desde Tacna hasta Loreto, garantizando oportunidades de acceso equitativo en todas las regiones del país.
            </p>
          </div>

        </div>

        {/* Sección de Prueba Social y Transparencia */}
        <div className="p-8 md:p-12 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 shadow-lg text-center space-y-6">
          <Award size={48} className="text-emerald-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Compromiso con la Meritocracia y el Servicio Civil</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chamba Pro es una iniciativa informativa independiente alineada con las buenas prácticas de transparencia del Servicio Civil (SERVIR) y la Ley N° 29733 de Protección de Datos Personales.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/empleos"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-sm"
            >
              Explorar Convocatorias Vigentes →
            </Link>
            <Link
              href="/crear-cv-cas"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
            >
              Generador de CV Formato SERVIR
            </Link>
          </div>
        </div>

        {/* WhatsApp & Telegram Widget */}
        <WhatsAppSubscribeWidget 
          whatsappEnabled={config.modules?.whatsapp_channel_enabled ?? true}
          telegramEnabled={config.modules?.telegram_channel_enabled ?? true}
          whatsappUrl={config.contact?.whatsapp_channel_url || (config.contact?.whatsapp ? `https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}` : undefined)}
          telegramUrl={config.contact?.telegram_channel_url || 'https://t.me/chambapro_peru'}
        />

      </div>
    </div>
  );
}
