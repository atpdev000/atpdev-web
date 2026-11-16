import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat, ShieldCheck, Scale, Sparkles, ArrowLeft, BookOpen, Calculator, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Metodología Culinaria — Perú Sabor Inteligente',
  description:
    'Conoce la misión editorial, metodología de estandarización gastronómica, fórmulas de costeo PEPS y equipo de ingeniería detrás de Perú Sabor Inteligente (ATP DEV).',
  alternates: { canonical: '/sobre-nosotros' },
  robots: { index: true, follow: true },
};

export default function SobreNosotrosPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c22929]/10 text-[#c22929] text-xs font-bold">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Transparencia Editorial e Ingeniería Gastronómica</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          Sobre Nosotros: Ingeniería y Tradición en la Cocina Peruana
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Desarrollado y mantenido por Percy Acha Taipe (ATP DEV) • Lima, Perú
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <BookOpen className="w-4 h-4 text-[#c22929]" />
            <h2>1. Nuestra Misión Editorial y Técnica</h2>
          </div>
          <p>
            <strong>Perú Sabor Inteligente</strong> nació con un propósito claro: transformar los recetarios informales basados en medidas ambiguas (&ldquo;una pizca&rdquo;, &ldquo;al ojo&rdquo;) en <strong>fichas técnicas gastronómicas deterministas</strong> aptas tanto para cocineros caseros exigentes como para restaurantes, dark kitchens y estudiantes de gastronomía peruana.
          </p>
          <p>
            Cada receta publicada en nuestra plataforma documenta pesos brutos y pesos netos en gramos y mililitros, porcentajes de merma de limpieza y cocción, temperaturas críticas de seguridad alimentaria (norma sanitaria DIGESA / MINSA para pescados, mariscos y carnes), tiempos exactos de reducción y sustituciones verificadas para peruanos en el exterior.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
              <Calculator className="w-4 h-4 text-[#c22929]" />
              <h2>2. Escalado No Lineal y Costeo Real</h2>
            </div>
            <p>
              A diferencia de las calculadoras convencionales que multiplican todos los ingredientes por igual, nuestro motor de escalado aplica factores de corrección culinaria para sal, ajíes, especias, grasas de sellado y líquidos de evaporación cuando pasas de 4 a 50 o 200 raciones.
            </p>
            <p>
              Además, nuestra herramienta de <strong>Food Cost</strong> integra el cálculo de IGV (18%), recargo al consumo y matriz de ingeniería de menú (BCG) para proteger el margen operativo del restaurante.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
              <Award className="w-4 h-4 text-[#c22929]" />
              <h2>3. Responsable del Proyecto (E-E-A-T)</h2>
            </div>
            <p>
              Perú Sabor Inteligente forma parte del ecosistema tecnológico de <strong>ATP DEV</strong>, dirigido por <strong>Percy Acha Taipe</strong>, Ingeniero de Sistemas y Arquitecto de Software Full-Stack en Lima, Perú.
            </p>
            <p>
              Todos los cálculos de merma, inventario y costeo se ejecutan localmente en tu navegador sin almacenar fórmulas secretas ni costos privados de tu negocio en servidores de terceros.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-stone-900 dark:text-stone-100">¿Deseas proponer una ficha técnica regional o reportar una mejora?</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Nuestro equipo revisa continuamente los precios referenciales de mercados mayoristas y técnicas regionales.
            </p>
          </div>
          <Link
            href="/contacto"
            className="px-4 py-2.5 rounded-xl bg-[#c22929] text-white font-bold text-xs hover:opacity-90 transition-opacity shrink-0"
          >
            Contactar al Equipo
          </Link>
        </div>
      </section>
    </main>
  );
}
