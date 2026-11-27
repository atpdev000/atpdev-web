import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COLORING_CATEGORIES, COLORING_SHEETS } from '@/data/catalog';
import CategoryGalleryClient from '@/components/CategoryGalleryClient';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'Biblioteca de Dibujos para Colorear en PDF Gratis (300 DPI)',
  description:
    'Explora 7 categorías de dibujos para colorear gratis listos para imprimir en PDF 300 DPI: dinosaurios, animales kawaii, mandalas fáciles, unicornios, espacio, vehículos y cultura peruana.',
  alternates: { canonical: 'https://colorear.atpdev.dev/dibujos' },
};

export default function DibujosIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <header className="max-w-3xl space-y-3">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white">
          Biblioteca gratuita de dibujos para colorear en PDF
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-300 leading-relaxed">
          Todas las láminas están dibujadas con trazos negros limpios sobre fondo blanco puro. Puedes
          pintarlas directamente en tu pantalla o descargarlas en formato PDF 300 DPI para imprimir en
          casa o en el colegio.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLORING_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/dibujos/${cat.slug}`}
            className={`rounded-2xl border p-5 flex flex-col justify-between gap-3 transition-transform hover:-translate-y-0.5 ${cat.accentBg}`}
          >
            <div className="space-y-1.5">
              <h2 className={`font-display font-bold text-lg ${cat.accentText}`}>{cat.name}</h2>
              <p className="text-xs text-zinc-700 dark:text-slate-300 leading-relaxed">{cat.intro}</p>
            </div>
            <span className={`text-xs font-bold inline-flex items-center gap-1 ${cat.accentText}`}>
              <span>Ver láminas y descargar PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <AdBanner />

      <section className="space-y-5">
        <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
          Todas las láminas disponibles ({COLORING_SHEETS.length})
        </h2>
        <CategoryGalleryClient sheets={COLORING_SHEETS} />
      </section>
    </div>
  );
}

