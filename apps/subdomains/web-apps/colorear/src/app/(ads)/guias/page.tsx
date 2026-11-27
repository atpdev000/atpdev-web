import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'Guía Técnica Amazon KDP: 300 DPI, Sangrado, Lomo e Impuestos desde Perú y LATAM',
  description:
    'Manual práctico sin humo para crear libros para colorear en Amazon KDP: medidas exactas 8.5×11", sangrado 0.125", cálculo del lomo, declaración IA y regalías reales.',
  alternates: { canonical: 'https://colorear.atpdev.dev/guias' },
};

export default function GuiasKdpPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <header className="space-y-3">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
          Guía completa para crear libros para colorear en Amazon KDP sin rechazos técnicos
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-300 leading-relaxed">
          Esta guía resume los requisitos reales que exige la imprenta bajo demanda de Amazon Kindle
          Direct Publishing (KDP) y las buenas prácticas para publicar libros duraderos de calidad.
        </p>
      </header>

      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 text-sm text-zinc-700 dark:text-slate-300 leading-relaxed">
        <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
          1. Tamaños recomendados y resolución real a 300 DPI
        </h2>
        <p>
          Amazon KDP exige un mínimo de <strong>300 DPI (puntos por pulgada)</strong> en todas las
          ilustraciones interiores y de portada. Los tres formatos con mejor aceptación en libros de
          colorear son:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <strong>8.5 × 11 pulgadas (2550 × 3300 px)</strong>: el formato estándar para niños y
            cuadernos escolares de actividades.
          </li>
          <li>
            <strong>8.5 × 8.5 pulgadas (2550 × 2550 px)</strong>: formato cuadrado muy popular en
            estilos <em>Bold &amp; Easy</em> y <em>Cozy Coloring</em>.
          </li>
          <li>
            <strong>6 × 9 pulgadas (1800 × 2700 px)</strong>: tamaño compacto práctico para mandalas y
            cuadernos de viaje.
          </li>
        </ul>
      </section>

      <AdBanner />

      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 text-sm text-zinc-700 dark:text-slate-300 leading-relaxed">
        <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
          2. Reverso en blanco, mínimo de páginas y fórmula oficial del lomo
        </h2>
        <p>
          En libros de tapa blanda (<em>Paperback</em>), Amazon KDP exige un mínimo de{' '}
          <strong>24 páginas interiores</strong>. Para evitar que los plumones de agua o alcohol
          traspasen y dañen la siguiente lámina, coloca siempre una página trasera en blanco después de
          cada ilustración (un libro de 30 ilustraciones termina con ~64 páginas totales).
        </p>
        <div className="rounded-2xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-4 text-xs space-y-1.5">
          <p className="font-bold text-zinc-900 dark:text-white">Fórmulas oficiales de lomo KDP:</p>
          <p>• Papel interior blanco (B/N): <code>páginas × 0.002252 pulgadas</code></p>
          <p>• Papel interior crema (B/N): <code>páginas × 0.0025 pulgadas</code></p>
          <p>
            • Ancho total de portada = <code>0.125&quot; + ancho + lomo + ancho + 0.125&quot;</code>
          </p>
          <p>• Alto total de portada = <code>0.125&quot; + alto + 0.125&quot;</code></p>
        </div>
        <p>
          Importante: Amazon solo permite texto impreso sobre el lomo si tu libro tiene{' '}
          <strong>79 páginas o más</strong>.
        </p>
      </section>

      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 text-sm text-zinc-700 dark:text-slate-300 leading-relaxed">
        <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
          3. Regalías reales, declaración de IA e impuestos desde Perú / LATAM
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 space-y-1.5">
            <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Buenas prácticas para durar en KDP</span>
            </p>
            <p className="text-emerald-900/90 dark:text-emerald-200/90">
              Prioriza calidad sobre volumen: publica pocos libros bien revisados, elimina fondos
              grises con umbral B/N puro y declara honestamente el uso de contenido generado con IA en
              el panel de Amazon KDP.
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 space-y-1.5">
            <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Cálculo realista de ganancia neta</span>
            </p>
            <p className="text-amber-900/90 dark:text-amber-200/90">
              En un libro de $9.99 USD Amazon calcula el 60% de regalía menos el costo de impresión
              (~$2.80–$3.00). Desde países sin tratado fiscal con EE. UU. (como Perú), la retención
              W-8BEN sobre ventas en Amazon.com es del 30%.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/estudio-kdp"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold btn-studio-primary"
          >
            <BookOpen className="w-4 h-4" />
            <span>Preparar mi primer PDF en el Estudio KDP</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
