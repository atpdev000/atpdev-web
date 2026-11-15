import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, ShieldCheck, ArrowLeft, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto y Soporte Gastronómico — Perú Sabor Inteligente',
  description:
    'Canales oficiales de contacto, soporte técnico y consultas editoriales de Perú Sabor Inteligente (ATP DEV).',
  alternates: { canonical: '/contacto' },
  robots: { index: true, follow: true },
};

export default function ContactoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c22929] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a Perú Sabor Inteligente
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          Contacto y Soporte Técnico
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Atención directa para chefs, emprendedores gastronómicos, estudiantes y usuarios de Perú Sabor.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-700 dark:text-stone-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Mail className="w-4 h-4 text-[#c22929]" />
            <h2>Correo Electrónico Institucional</h2>
          </div>
          <p className="leading-relaxed">
            Para soporte sobre las calculadoras de Food Cost, escalador de recetas, reporte de errores o consultas sobre privacidad y publicidad:
          </p>
          <a
            href="mailto:contacto@atpdev.dev"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c22929]/10 text-[#c22929] font-bold text-xs hover:bg-[#c22929]/20 transition-colors"
          >
            contacto@atpdev.dev
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Clock className="w-4 h-4 text-[#c22929]" />
            <h2>Horario y Responsable Legal</h2>
          </div>
          <ul className="space-y-2 text-xs leading-relaxed">
            <li><strong>Titular del sitio:</strong> Percy Acha Taipe — Ecosistema ATP DEV</li>
            <li><strong>Ubicación operativa:</strong> Lima, Perú (GMT-5)</li>
            <li><strong>Tiempo de respuesta habitual:</strong> 24 a 48 horas hábiles</li>
            <li><strong>Portal corporativo:</strong> <a href="https://www.atpdev.dev/#contact" className="text-[#c22929] underline font-semibold">www.atpdev.dev/#contact</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
