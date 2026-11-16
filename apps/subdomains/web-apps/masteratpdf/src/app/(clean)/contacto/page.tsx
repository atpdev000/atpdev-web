import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, ShieldCheck, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto y Soporte Técnico — MasterAtPDF Pro',
  description:
    'Canales oficiales de soporte técnico, reporte de compatibilidad de documentos PDF y consultas de privacidad en MasterAtPDF Pro (ATP DEV).',
  alternates: { canonical: '/contacto' },
  robots: { index: true, follow: true },
};

export default function ContactoPdfPage() {
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
          Contacto y Soporte Técnico
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Atención directa del equipo de ingeniería de ATP DEV para usuarios de MasterAtPDF Pro.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed text-ink-2">
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center gap-2 text-ink font-bold text-base">
            <Mail className="w-4 h-4 text-brand" />
            <h2>Soporte por Correo Electrónico</h2>
          </div>
          <p>
            Si tienes dudas sobre compatibilidad con un estándar PDF específico (PDF/A, formularios AcroForm, cifrado AES) o consultas legales y de privacidad:
          </p>
          <a
            href="mailto:contacto@atpdev.dev"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand/10 text-brand font-bold text-xs hover:bg-brand/20 transition-colors"
          >
            contacto@atpdev.dev
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center gap-2 text-ink font-bold text-base">
            <Clock className="w-4 h-4 text-brand" />
            <h2>Información Institucional</h2>
          </div>
          <ul className="space-y-2 text-xs">
            <li><strong>Responsable:</strong> Percy Acha Taipe — ATP DEV</li>
            <li><strong>Sede operativa:</strong> Lima, Perú</li>
            <li><strong>Tiempo de respuesta:</strong> 24 a 48 horas hábiles</li>
            <li><strong>Portal principal:</strong> <a href="https://www.atpdev.dev/contacto" className="text-brand underline font-semibold">www.atpdev.dev/contacto</a></li>
          </ul>
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-surface border border-line space-y-4 text-sm leading-relaxed text-ink-2">
        <div className="flex items-center gap-2 text-ink font-bold text-base">
          <ShieldCheck className="w-4 h-4 text-brand" />
          <h2>Alcance de Soporte y Garantía de Procesamiento Local</h2>
        </div>
        <p>
          MasterAtPDF Pro ejecuta el ensamblaje, división, compresión y protección de archivos PDF íntegramente en la memoria del navegador mediante WebAssembly y PDF-lib sin subir tus documentos confidenciales a servidores externos. Si algún archivo presenta particularidades estructurales (como tablas XRef dañadas o fuentes embebidas no estándar), puedes escribirnos indicando el navegador y versión de sistema operativo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-bg border border-line space-y-1.5">
            <h3 className="font-bold text-ink">Herramientas principales disponibles</h3>
            <p>
              Accede directamente a las utilidades para <Link href="/tools/merge" className="text-brand font-semibold underline">Unir PDF</Link>, <Link href="/tools/split" className="text-brand font-semibold underline">Dividir páginas</Link>, <Link href="/tools/compress" className="text-brand font-semibold underline">Comprimir tamaño</Link> o <Link href="/tools/protect" className="text-brand font-semibold underline">Proteger con contraseña</Link>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bg border border-line space-y-1.5">
            <h3 className="font-bold text-ink">Documentación legal y privacidad</h3>
            <p>
              Para solicitudes relacionadas con privacidad, publicidad o cumplimiento de licencias, consulta nuestra <Link href="/privacidad" className="text-brand font-semibold underline">Política de Privacidad</Link> y nuestros <Link href="/terminos" className="text-brand font-semibold underline">Términos de Uso</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
