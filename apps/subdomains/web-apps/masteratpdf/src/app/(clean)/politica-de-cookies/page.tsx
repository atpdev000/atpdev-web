import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies — MasterAtPDF Pro',
  description:
    'Política oficial de cookies de MasterAtPDF Pro: cookies técnicas esenciales, Consent Mode v2 y cookies de Google AdSense sin almacenar tus archivos PDF.',
  alternates: { canonical: '/politica-de-cookies' },
  robots: { index: true, follow: true },
};

export default function PoliticaCookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3 border-b border-line pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a MasterAtPDF Pro
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Política de Cookies
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Última actualización: 16 de noviembre de 2026 · Titular: ATP DEV (masteratpdf.atpdev.dev)
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-ink-2">
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Cookie className="w-4 h-4 text-brand" />
            <h2>1. Qué son las cookies y su alcance en MasterAtPDF</h2>
          </div>
          <p>
            Las cookies son pequeños archivos de texto guardados en tu navegador para recordar ajustes técnicos (como el modo oscuro/claro y tu elección de privacidad en Google Consent Mode v2). Ninguna cookie ni almacenamiento local lee ni envía el contenido de los archivos PDF que procesas con WebAssembly y PDF.js dentro de tu equipo.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <h2>2. Categorías de cookies empleadas</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Cookies técnicas esenciales:</strong> preservan tus preferencias de interfaz y el consentimiento configurado, manteniendo por defecto señales restrictivas hasta tu autorización.
            </li>
            <li>
              <strong>Cookies de Google AdSense:</strong> Google y sus socios utilizan cookies publicitarias para mostrar anuncios relevantes o no personalizados según tu consentimiento, permitiendo ofrecer las 23 herramientas PDF de forma gratuita.
            </li>
            <li>
              <strong>Cookies analíticas agregadas:</strong> únicamente tras consentimiento, miden rendimiento y estabilidad del servicio web sin asociar documentos ni datos personales.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Settings className="w-4 h-4 text-brand" />
            <h2>3. Cómo gestionar o bloquear las cookies</h2>
          </div>
          <p>
            MasterAtPDF respeta las señales por defecto de Google Consent Mode v2 y te permite elegir en todo momento mediante la configuración de tu navegador cómo gestionar las cookies y datos de sitios:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros y datos de sitios.</li>
            <li><strong>Mozilla Firefox:</strong> Ajustes &gt; Privacidad y seguridad &gt; Cookies y datos guardados del sitio.</li>
            <li><strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear cookies y administración de datos web.</li>
            <li><strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</li>
          </ul>
          <p>
            Además, puedes administrar la personalización de anuncios de Google en{' '}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand font-semibold underline">
              adssettings.google.com
            </a>
            , revisar el uso de información por sitios asociados en{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-brand font-semibold underline">
              policies.google.com/technologies/partner-sites
            </a>{' '}
            u optar por la exclusión global en{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-brand font-semibold underline">
              www.aboutads.info/choices/
            </a>
            . Recuerda que tus PDFs nunca dependen de cookies para su procesamiento documental. Puedes restablecer o revocar tu elección de Google Consent Mode v2 (`ad_storage`, `ad_user_data`, `ad_personalization` y `analytics_storage`) borrando los datos de sitio en tu navegador para que el aviso de consentimiento vuelva a mostrarse de inmediato. Revisa nuestra{' '}
            <Link href="/privacidad" className="text-brand font-semibold underline">
              Política de Privacidad
            </Link>{' '}
            o contáctanos en{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-brand font-semibold underline">
              contacto@atpdev.dev
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

