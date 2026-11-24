import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, ShieldCheck } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Política de Cookies — Chamba Pro',
  description:
    'Política oficial de cookies de Chamba Pro: cookies técnicas esenciales, Consent Mode v2, cookies publicitarias de Google AdSense y guía para gestionar preferencias.',
  alternates: {
    canonical: `${SITE_URL}/politica-de-cookies`,
  },
  openGraph: {
    title: 'Política de Cookies — Chamba Pro',
    description: 'Uso transparente de cookies técnicas y publicitarias en Chamba Pro.',
    url: `${SITE_URL}/politica-de-cookies`,
    type: 'website',
  },
};

export default function PoliticaCookiesPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al inicio de Chamba Pro</span>
        </Link>

        <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-mono font-semibold">
            <Cookie size={14} />
            <span>Transparencia & Consent Mode v2</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white">
            Política de Cookies de Chamba Pro
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Última actualización: 16 de noviembre de 2026 · Responsable: ATP DEV (Percy Acha Taipe) —{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-emerald-600 dark:text-emerald-400 underline">
              contacto@atpdev.dev
            </a>
          </p>
        </header>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              1. Qué son las cookies y para qué las utilizamos
            </h2>
            <p>
              Las cookies y tecnologías de almacenamiento local son pequeños archivos guardados en tu navegador que permiten recordar tus preferencias de tema visual (claro u oscuro), filtros de búsqueda y la decisión registrada en nuestro banner de consentimiento. En Chamba Pro (<code>chamba.atpdev.dev</code>) minimizamos el almacenamiento de datos y no vendemos tu historial de búsqueda laboral a terceros.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>2. Tipos de cookies presentes en Chamba Pro</span>
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Cookies técnicas y de preferencia
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Estrictamente necesarias para la estabilidad de navegación, recordar tu modo de visualización y almacenar el estado de consentimiento bajo Google Consent Mode v2 (con señales por defecto en <code>denied</code> hasta tu confirmación).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Cookies publicitarias de Google AdSense
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Proveedores terceros, incluido Google, utilizan cookies (como la cookie de DoubleClick/DART) para mostrar anuncios relevantes o no personalizados según tu consentimiento y financiar el acceso libre al portal de convocatorias públicas.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Cookies de medición agregada
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Solo se activan si aceptas cookies analíticas, permitiendo medir tiempos de carga, errores de página y uso de herramientas como el comparador de regímenes o calculadora CAS.
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Settings size={18} className="text-emerald-500" />
              <span>3. Cómo gestionar, rechazar o inhabilitar cookies</span>
            </h2>
            <p>
              Puedes desactivar la publicidad personalizada de Google en{' '}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline"
              >
                Configuración de Anuncios de Google
              </a>
              , conocer cómo emplea Google los datos en sitios asociados en{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline"
              >
                policies.google.com/technologies/partner-sites
              </a>{' '}
              o gestionar exclusiones globales en{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline"
              >
                www.aboutads.info/choices/
              </a>
              . También puedes bloquear o borrar cookies en Google Chrome, Mozilla Firefox, Apple Safari o Microsoft Edge desde sus ajustes de privacidad. Asimismo, en cumplimiento de la Ley N° 29733 de Protección de Datos Personales del Perú y del Reglamento General de Protección de Datos (RGPD), puedes restablecer tu elección bajo Google Consent Mode v2 (<code>ad_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code> y <code>analytics_storage</code>) limpiando los datos locales del sitio para que el aviso de consentimiento vuelva a mostrarse. Para más información, consulta nuestra{' '}
              <Link href="/politica-de-privacidad" className="text-emerald-600 dark:text-emerald-400 underline">
                Política de Privacidad
              </Link>{' '}
              y nuestros{' '}
              <Link href="/terminos-y-condiciones" className="text-emerald-600 dark:text-emerald-400 underline">
                Términos y Condiciones
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

