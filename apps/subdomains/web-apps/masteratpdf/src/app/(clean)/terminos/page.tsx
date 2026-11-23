import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos de Uso — MasterAtPDF Pro',
  description:
    'Términos y condiciones de uso de las herramientas PDF locales de MasterAtPDF Pro.',
  alternates: { canonical: '/terminos' },
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
            <h2>1. Alcance del servicio y arquitectura híbrida de procesamiento</h2>
          </div>
          <p>
            MasterAtPDF Pro pone a disposición herramientas web gratuitas para manipular archivos PDF mediante una arquitectura híbrida: las operaciones estructurales rápidas (unión, división, rotación, recorte, numeración, marca de agua, firma visual y organización) pueden ejecutarse directamente en la memoria del navegador con WebAssembly y PDF.js, mientras que las conversiones avanzadas (Word, Excel, PowerPoint, cifrado AES-256, reparación estructural y OCR) se procesan de forma efímera y cifrada en nuestro motor de conversión, eliminándose automáticamente tras finalizar la descarga.
          </p>
          <p>
            Recomendamos encarecidamente conservar una copia de respaldo de los documentos originales antes de ejecutar compresiones, reducciones de DPI o eliminaciones de páginas.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Scale className="w-4 h-4 text-brand" />
            <h2>2. Uso responsable y propiedad intelectual</h2>
          </div>
          <p>
            El usuario es único responsable de los documentos que procesa y garantiza contar con los derechos de autor o licencias necesarias para unir, dividir, firmar o cifrar dichos archivos. Queda prohibido el uso de la plataforma para vulnerar protecciones legales de terceros sin autorización del titular.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <FileText className="w-4 h-4 text-brand" />
            <h2>3. Límites técnicos y compatibilidad</h2>
          </div>
          <p>
            Dado que el renderizado se ejecuta dentro de la memoria RAM asignada a la pestaña de tu navegador, el tamaño máximo recomendable para documentos con cientos de imágenes de alta resolución oscila entre 100 MB y 300 MB en escritorio. ATP DEV no garantiza compatibilidad con archivos PDF corruptos o cifrados con algoritmos propietarios fuera del estándar ISO 32000.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold">
            <Scale className="w-4 h-4 text-brand" />
            <h2>4. Publicidad, privacidad y contacto oficial</h2>
          </div>
          <p>
            Para financiar la gratuidad de la suite sin muros de pago ni marcas de agua en los documentos resultantes, las vistas principales muestran anuncios gestionados con Google AdSense según lo descrito en nuestra{' '}
            <Link href="/privacidad" className="text-brand font-semibold underline">Política de Privacidad</Link>.
          </p>
          <p>
            Para consultas técnicas, reporte de incidencias o soporte puedes escribir a{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-brand font-semibold underline">
              contacto@atpdev.dev
            </a>{' '}
            o usar nuestra{' '}
            <Link href="/contacto" className="text-brand font-semibold underline">
              página de Contacto
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

