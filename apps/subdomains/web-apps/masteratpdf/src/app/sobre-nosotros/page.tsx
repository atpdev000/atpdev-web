import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cpu, ShieldCheck, Lock, Layers, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Arquitectura Local WebAssembly — MasterAtPDF Pro',
  description:
    'Conoce la arquitectura de procesamiento PDF 100% en el navegador (WebAssembly y PDF.js), políticas de cero subida a servidores y equipo de ingeniería detrás de MasterAtPDF Pro.',
  alternates: { canonical: '/sobre-nosotros' },
  robots: { index: true, follow: true },
};

export default function SobreNosotrosPdfPage() {
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
          Sobre Nosotros: Procesamiento PDF Privado en el Navegador
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Ingeniería de software por Percy Acha Taipe (ATP DEV) • masteratpdf.atpdev.dev
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-ink-2">
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-ink font-bold text-base">
            <Lock className="w-4 h-4 text-brand" />
            <h2>1. Por qué creamos MasterAtPDF Pro</h2>
          </div>
          <p>
            La mayoría de las utilidades PDF tradicionales en internet obligan al usuario a subir contratos confidenciales, estados bancarios, historias clínicas o expedientes legales a servidores remotos desconocidos simplemente para unir dos páginas o comprimir un documento.
          </p>
          <p>
            <strong>MasterAtPDF Pro</strong> resuelve este riesgo de raíz: diseñamos una suite de 19 herramientas documentales que ejecutan todo el procesamiento binario directamente en la memoria RAM del navegador del usuario mediante <strong>WebAssembly, pdf-lib y PDF.js v5</strong>. Tus archivos jamás abandonan tu dispositivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Cpu className="w-4 h-4 text-brand" />
              <h2>2. Tecnología de Nivel Industrial</h2>
            </div>
            <p>
              Nuestros motores de manipulación de árboles de objetos PDF (XRef tables, streams FlateDecode, incrustación de fuentes estándar y renderizado rasterizado a 300 DPI) aprovechan múltiples hilos mediante Web Workers para procesar documentos de hasta 250 MB sin congelar la interfaz.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Award className="w-4 h-4 text-brand" />
              <h2>3. Autoría y Transparencia (ATP DEV)</h2>
            </div>
            <p>
              MasterAtPDF Pro es desarrollado y mantenido por <strong>Percy Acha Taipe</strong>, Ingeniero de Sistemas y fundador de <strong>ATP DEV</strong> en Lima, Perú. Nuestro servicio básico es 100 % gratuito y se sostiene de forma transparente mediante publicidad contextual no intrusiva de Google AdSense.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
