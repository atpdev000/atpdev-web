import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, Database, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad — MasterAtPDF Pro',
  description:
    'Política de privacidad, procesamiento local de documentos PDF en el navegador y uso de cookies publicitarias de Google AdSense en MasterAtPDF Pro.',
  alternates: { canonical: '/privacidad' },
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
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
          Política de Privacidad
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Última actualización: Noviembre 2026 • Titular: ATP DEV (masteratpdf.atpdev.dev)
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-ink-2">
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Database className="w-4 h-4 text-brand" />
            <h2>1. Procesamiento local en tu navegador</h2>
          </div>
          <p>
            MasterAtPDF Pro ejecuta las operaciones de unión, división, recorte, rotación, numeración, marca de agua, firma visual y extracción básica directamente en tu navegador mediante WebAssembly y PDF.js. En las herramientas que utilizan el motor auxiliar de conversión (cifrado AES-256, desbloqueo avanzado, OCR en servidor o conversión Office de alta fidelidad), el archivo se procesa de forma efímera y se elimina automáticamente tras finalizar la solicitud.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Cookie className="w-4 h-4 text-brand" />
            <h2>2. Cookies y Google AdSense</h2>
          </div>
          <p>
            Este sitio utiliza Google AdSense para mostrar anuncios y financiar la gratuidad de la suite. Google y sus socios pueden utilizar cookies para mostrar anuncios personalizados o no personalizados según visitas previas.
          </p>
          <p>
            Puedes gestionar tus preferencias publicitarias en{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold underline"
            >
              Configuración de anuncios de Google
            </a>{' '}
            o consultar las{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold underline"
            >
              políticas de publicidad de Google
            </a>
            , gestionar cookies de terceros en{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold underline"
            >
              aboutads.info/choices
            </a>{' '}
            y conocer cómo Google usa los datos de sitios web que emplean sus servicios en{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold underline"
            >
              policies.google.com/technologies/partner-sites
            </a>
            .
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <h2>3. Seguridad en tránsito, ciclo de vida efímero y derechos del usuario</h2>
          </div>
          <p>
            Todas las conexiones hacia <strong>masteratpdf.atpdev.dev</strong> se realizan exclusivamente bajo cifrado <strong>HTTPS / TLS 1.3</strong> con cabeceras de seguridad HSTS. En las herramientas que se ejecutan en la memoria local del navegador mediante WebAssembly y PDF.js, los bytes del archivo jamás abandonan el dispositivo del usuario. En las operaciones asistidas por nuestro motor de conversión avanzada (PyMuPDF C++ y FastAPI), cada archivo recibe un identificador temporal único (UUID), se procesa en un directorio aislado sin indexación ni acceso público y es eliminado automáticamente por tareas de limpieza en segundo plano inmediatamente después de completarse la solicitud.
          </p>
          <p>
            No creamos perfiles basados en el contenido de tus documentos, no vendemos datos a terceros ni utilizamos tus archivos PDF para entrenar modelos de inteligencia artificial. De conformidad con la <strong>Ley N° 29733 (Ley de Protección de Datos Personales del Perú)</strong> y el <strong>Reglamento General de Protección de Datos (RGPD / GDPR)</strong>, puedes ejercer tus derechos de información, acceso, rectificación, cancelación y oposición (ARCO), así como revocar tu consentimiento de cookies publicitarias en cualquier momento desde el banner de privacidad o escribiendo a{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-brand font-semibold underline">
              contacto@atpdev.dev
            </a>{' '}
            o mediante{' '}
            <a
              href="https://www.atpdev.dev/contacto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold underline"
            >
              www.atpdev.dev/contacto
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

