import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, Database, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad — MasterAtPDF Pro',
  description:
    'Política de privacidad, procesamiento local de documentos PDF en el navegador y uso de cookies publicitarias de Google AdSense en MasterAtPDF Pro.',
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
          Última actualización: Noviembre 2026 • Titular: ATP DEV (pdf.atpdev.dev)
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-ink-2">
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Database className="w-4 h-4 text-brand" />
            <h2>1. Procesamiento local en tu navegador</h2>
          </div>
          <p>
            MasterAtPDF Pro ejecuta las operaciones de unión, división, compresión, rotación y conversión de documentos PDF directamente en tu navegador mediante WebAssembly y PDF.js. Los documentos seleccionados no se suben ni almacenan en servidores externos de ATP DEV.
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
            .
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <h2>3. Contacto</h2>
          </div>
          <p>
            Para consultas sobre privacidad o soporte técnico escríbenos a{' '}
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
