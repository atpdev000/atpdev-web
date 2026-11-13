import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Scale, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos de Uso — Perú Sabor Inteligente',
  description:
    'Condiciones de uso de las herramientas gastronómicas, costeo de recetas y contenido editorial de Perú Sabor Inteligente.',
  robots: { index: false, follow: true },
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c22929] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a Perú Sabor Inteligente
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          Términos de Uso
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Última actualización: Noviembre 2026 • Ecosistema ATP DEV
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <FileText className="w-4 h-4 text-[#c22929]" />
            <h2>1. Naturaleza informativa y técnica</h2>
          </div>
          <p>
            Perú Sabor Inteligente provee recetas documentadas, fichas técnicas culinarias, calculadoras de mermas, escalador de porciones y simuladores de food cost con fines educativos, informativos y de apoyo operativo en cocina.
          </p>
          <p>
            Los márgenes, rendimientos y sugerencias de sustitución de ingredientes dependen de precios locales de mercado, proveedores reales y protocolos sanitarios de cada establecimiento, por lo que deben validarse antes de decisiones comerciales críticas o consideraciones alimentarias de alergias.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <Scale className="w-4 h-4 text-[#c22929]" />
            <h2>2. Propiedad intelectual y uso permitido</h2>
          </div>
          <p>
            El diseño de interfaz, compilación editorial, calculadoras y código fuente pertenecen a ATP DEV. Se autoriza el uso libre para consulta personal, aprendizaje culinario y planificación de cocina; queda prohibida la redistribución automatizada masiva o scraping comercial del catálogo.
          </p>
          <p>
            Para consultas editoriales, correcciones o soporte técnico puedes comunicarte mediante{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-[#c22929] font-semibold underline">
              contacto@atpdev.dev
            </a>{' '}
            o en{' '}
            <a
              href="https://www.atpdev.dev/contacto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c22929] font-semibold underline"
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
