import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos de Uso — MasterAtPDF Pro',
  description:
    'Términos y condiciones de uso de las herramientas PDF locales de MasterAtPDF Pro.',
  robots: { index: false, follow: true },
};

export default function TerminosPage() {
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
          Términos de Uso
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Última actualización: Noviembre 2026 • Ecosistema ATP DEV
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-ink-2">
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <FileText className="w-4 h-4 text-brand" />
            <h2>1. Alcance del servicio</h2>
          </div>
          <p>
            MasterAtPDF Pro pone a disposición herramientas web gratuitas para manipular archivos PDF en el dispositivo del usuario. Recomendamos conservar respaldo de tus documentos originales antes de realizar compresiones o conversiones.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Scale className="w-4 h-4 text-brand" />
            <h2>2. Uso responsable y contacto</h2>
          </div>
          <p>
            El usuario es responsable de los documentos que procesa y de contar con los derechos necesarios sobre su contenido. Para consultas técnicas o soporte puedes escribir a{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-brand font-semibold underline">
              contacto@atpdev.dev
            </a>{' '}
            o en{' '}
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
