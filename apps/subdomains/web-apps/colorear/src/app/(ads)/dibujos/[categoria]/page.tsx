import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import {
  COLORING_CATEGORIES,
  getCategoryBySlug,
  getSheetsByCategory,
} from '@/data/catalog';
import CategoryGalleryClient from '@/components/CategoryGalleryClient';
import AdBanner from '@/components/AdBanner';

export function generateStaticParams() {
  return COLORING_CATEGORIES.map((cat) => ({ categoria: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const cat = getCategoryBySlug(categoria);
  if (!cat) return { title: 'Categoría no encontrada' };

  return {
    title: cat.headline,
    description: cat.metaDescription,
    alternates: {
      canonical: `https://colorear.atpdev.dev/dibujos/${cat.slug}`,
    },
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const cat = getCategoryBySlug(categoria);
  if (!cat) notFound();

  const sheets = getSheetsByCategory(cat.slug);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cat.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="space-y-4 max-w-3xl">
        <Link
          href="/dibujos"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a todas las categorías</span>
        </Link>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
          {cat.headline}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-300 leading-relaxed">
          {cat.intro}
        </p>
      </div>

      <CategoryGalleryClient sheets={sheets} />

      <AdBanner />

      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              Beneficios educativos y creativos
            </h2>
            <p>{cat.educationalBenefit}</p>
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              Consejo de impresión a 300 DPI
            </h2>
            <p>{cat.printingTip}</p>
          </div>
        </div>

        <div className="pt-5 border-t border-zinc-200 dark:border-slate-800 space-y-4">
          <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
            Preguntas frecuentes sobre {cat.shortName.toLowerCase()}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cat.faqs.map((faq) => (
              <div key={faq.question} className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{faq.question}</h3>
                <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            ¿Quieres crear un libro completo de <strong>{cat.shortName}</strong> listo para Amazon KDP?
          </p>
          <Link
            href="/estudio-kdp"
            className="px-4 py-2.5 rounded-xl text-xs font-bold btn-studio-primary inline-flex items-center gap-1.5 shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Crear libro en Estudio KDP</span>
          </Link>
        </div>
      </section>

      <nav className="space-y-3" aria-label="Otras categorías">
        <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
          Explora otras colecciones gratuitas
        </h2>
        <div className="flex flex-wrap gap-2">
          {COLORING_CATEGORIES.filter((c) => c.slug !== cat.slug).map((other) => (
            <Link
              key={other.slug}
              href={`/dibujos/${other.slug}`}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-zinc-800 dark:text-slate-200 hover:border-blue-500"
            >
              {other.shortName}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

