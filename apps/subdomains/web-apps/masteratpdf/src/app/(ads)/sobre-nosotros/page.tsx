import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cpu, ShieldCheck, Lock, Layers, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Arquitectura Híbrida WebAssembly — MasterAtPDF Pro',
  description:
    'Conoce la arquitectura híbrida de procesamiento PDF (WebAssembly, PDF.js v5 y PyMuPDF C++), estándares ISO 32000-2 y equipo de ingeniería detrás de MasterAtPDF Pro.',
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
          Sobre Nosotros: Ingeniería Documental y Arquitectura Híbrida PDF
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
            La mayoría de las utilidades PDF tradicionales en internet obligan al usuario a subir contratos confidenciales, estados bancarios, historias clínicas o expedientes legales a servidores remotos con políticas opacas de retención simplemente para unir dos páginas, numerar un informe o comprimir un documento escaneado.
          </p>
          <p>
            <strong>MasterAtPDF Pro</strong> resuelve este desafío técnico y de privacidad mediante una <strong>arquitectura híbrida de dos niveles</strong>: diseñamos una suite de 23 herramientas documentales en la que las operaciones estructurales rápidas se ejecutan en la memoria RAM del navegador mediante <strong>WebAssembly, pdf-lib y PDF.js v5</strong>. Para transformaciones de alta complejidad (como cifrado estándar ISO 32000 AES-256, reparación de tablas XREF corruptas, redacción binaria irrecuperable, conversión Office de alta fidelidad o reconocimiento óptico OCR), nuestro motor en <strong>FastAPI + PyMuPDF C++</strong> procesa el archivo de manera efímera en contenedores aislados por UUID y lo destruye automáticamente tras completarse la descarga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Cpu className="w-4 h-4 text-brand" />
              <h2>2. Tecnología de Nivel Industrial (ISO 32000-2)</h2>
            </div>
            <p>
              Nuestros motores de manipulación de árboles de objetos PDF (tablas de referencias cruzadas <code>xref</code>, flujos comprimidos FlateDecode, incrustación de fuentes tipográficas vectoriales y renderizado rasterizado hasta 300 DPI) aprovechan múltiples hilos mediante Web Workers y binarios compilados en C++ para procesar expedientes de hasta 250 MB sin bloquear la interfaz del usuario.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Award className="w-4 h-4 text-brand" />
              <h2>3. Autoría, Transparencia y Sostenibilidad (ATP DEV)</h2>
            </div>
            <p>
              MasterAtPDF Pro es desarrollado y mantenido por <strong>Percy Acha Taipe</strong>, Ingeniero de Sistemas y fundador del ecosistema tecnológico <strong>ATP DEV</strong> en Lima, Perú. Nuestro acceso a las 23 herramientas es 100 % gratuito, sin marcas de agua forzadas ni muros de pago sorpresivos, sosteniéndose de forma transparente mediante publicidad contextual no intrusiva de Google AdSense bajo estricto cumplimiento de Google Consent Mode v2.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-ink font-bold">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <h2>4. Seguridad Criptográfica y Censura Binaria Real</h2>
            </div>
            <p>
              A diferencia de editores básicos que solo superponen figuras gráficas sobre información privada, nuestras herramientas de seguridad implementan cifrado simétrico <strong>AES-256</strong> conforme al estándar PDF 2.0 y redacción definitiva (<em>True Binary Redaction</em>), eliminando físicamente tanto los glifos de texto como los píxeles de imágenes subyacentes para impedir cualquier extracción posterior.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Layers className="w-4 h-4 text-brand" />
              <h2>5. Documentación Práctica en Cada Herramienta</h2>
            </div>
            <p>
              Cada una de las 23 herramientas de la plataforma incluye una guía operativa paso a paso, recomendaciones técnicas sobre resolución y compresión, especificaciones del estándar ISO 32000-2 y respuestas a preguntas frecuentes para ayudar a estudiantes, abogados, contadores e ingenieros a obtener documentos óptimos al primer intento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
