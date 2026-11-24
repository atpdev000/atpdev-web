import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Clock, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';
import ContactoFormClient from './ContactoFormClient';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Canal de Contacto, Soporte Editorial y Alianzas',
  description: 'Contáctanos para reportar alertas de fraude en convocatorias, solicitar soporte o coordinar la publicación verificada de vacantes institucionales en Perú.',
  alternates: {
    canonical: `${SITE_URL}/contacto`,
  },
  openGraph: {
    title: 'Canal de Contacto & Soporte — Chamba Pro',
    description: 'Comunícate con el equipo editorial de Chamba Pro. Atención de consultas sobre convocatorias y reporte de enlaces.',
    url: `${SITE_URL}/contacto`,
    type: 'website',
    siteName: 'chamba pro',
    locale: 'es_PE',
    images: [`${SITE_URL}/opengraph-image`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canal de Contacto & Soporte — Chamba Pro',
    description: 'Atención a usuarios, reportes y alianzas institucionales en Chamba Pro.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

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
      name: 'Contacto y Soporte',
      item: `${SITE_URL}/contacto`,
    },
  ],
};

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contacto Chamba Pro',
  url: `${SITE_URL}/contacto`,
  description: 'Canal oficial de atención al usuario y soporte editorial de Chamba Pro.',
  mainEntity: {
    '@type': 'Organization',
    name: 'chamba pro',
    url: SITE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contacto@atpdev.dev',
      contactType: 'customer support',
      availableLanguage: ['es'],
      areaServed: 'PE',
    },
  },
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al inicio de Chamba Pro</span>
        </Link>

        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-mono font-semibold">
            <Mail size={14} />
            <span>Atención al Usuario y Transparencia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Canal de Contacto, Soporte y Alianzas
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            ¿Tienes dudas sobre una convocatoria, detectaste una alerta de fraude o representas a una institución que desea publicar sus vacantes verificadas? Nuestro equipo editorial te responderá a la brevedad.
          </p>
        </div>

        {/* Main Grid: Form + Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Direct Info Cards */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center font-bold">
                <Mail size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Correo Editorial</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Consultas de usuarios y soporte:</p>
              <a href="mailto:contacto@atpdev.dev" className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline block font-semibold">
                contacto@atpdev.dev
              </a>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tiempo de Respuesta</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Atendemos consultas de lunes a viernes en un plazo promedio menor a 24 horas hábiles.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center font-bold">
                <MapPin size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ubicación & Cobertura</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Lima, Perú. Cobertura informativa de las 25 regiones y portales oficiales del Estado.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form Client Component */}
          <ContactoFormClient />
        </div>

        {/* Editorial Support & Anti-Fraud Protocol Section */}
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h2>Protocolo Editorial de Verificación de Convocatorias y Prevención de Fraude Laboral</h2>
          </div>
          <p>
            En <strong>Chamba Pro</strong> revisamos diariamente las bases oficiales publicadas por ministerios, organismos técnicos especializados, gobiernos regionales, municipalidades y empresas públicas o privadas del Perú. Si detectas un enlace institucional caído, una modificación en el cronograma de evaluación curricular o cualquier intento de cobro indebido por parte de terceros ajenos a las entidades convocantes, repórtalo inmediatamente indicando el número de proceso CAS / 728 y la institución involucrada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white">Atención a Postulantes y Profesionales</h3>
              <p>
                Recuerda que Chamba Pro es un portal informativo y de herramientas laborales (<Link href="/calculadora-sueldo" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Calculadora de Sueldo Neto</Link>, <Link href="/crear-cv-cas" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Generador de CV CAS</Link> y <Link href="/plantillas-anexos" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Plantillas de Anexos</Link>). No recibimos expedientes de postulación por correo: toda postulación debe enviarse directamente en la mesa de partes virtual o plataforma oficial de la entidad empleadora.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white">Privacidad, Derechos ARCO y Alianzas Institucionales</h3>
              <p>
                Las oficinas de Recursos Humanos u Oficinas de Talento Humano que deseen difundir gratuitamente sus convocatorias oficiales pueden solicitar su verificación institucional desde nuestra sección <Link href="/publicar-empleo" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Publicar Empleo</Link>. Todas las comunicaciones están protegidas bajo nuestra <Link href="/politica-de-privacidad" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Política de Privacidad</Link> y la Ley N° 29733.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 md:col-span-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Tiempos de Respuesta y Rectificación de Bases Integradas</h3>
              <p>
                Nuestro equipo técnico procesa solicitudes de actualización de cronogramas, fe de erratas, comunicados de reprogramación de entrevistas personales y publicación de resultados preliminares o finales en un plazo máximo de 24 horas hábiles. Para agilizar la validación, adjunta el enlace directo al portal de transparencia estándar o sede digital GOB.PE de la entidad convocante.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
