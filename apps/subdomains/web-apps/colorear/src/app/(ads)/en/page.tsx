import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Download, Layers, Printer, Ruler, Sparkles, ArrowRight } from 'lucide-react';
import { COLORING_CATEGORIES, COLORING_SHEETS } from '@/data/catalog';
import SheetCard from '@/components/SheetCard';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'Free 300 DPI Printable Coloring Pages & Amazon KDP Book Studio',
  description:
    'Download free 300 DPI printable coloring pages (US Letter 8.5×11" & A4), color online, or compile complete Amazon KDP coloring books with pure B&W line-art cleanup, blank verso pages, and exact spine cover PDFs.',
  keywords: [
    'free printable coloring pages pdf 300 dpi',
    'amazon kdp coloring book creator',
    'kdp spine width calculator coloring book',
    'bold and easy coloring pages pdf',
    'coloring book interior compiler 8.5x11',
  ],
  alternates: {
    canonical: 'https://colorear.atpdev.dev/en',
    languages: {
      es: 'https://colorear.atpdev.dev/',
      en: 'https://colorear.atpdev.dev/en',
      'x-default': 'https://colorear.atpdev.dev/',
    },
  },
  openGraph: {
    title: 'Colorear Pro — Free 300 DPI Coloring Pages & Amazon KDP Book Studio',
    description:
      'Print crisp 300 DPI coloring sheets free or build complete Amazon KDP paperbacks with blank anti-bleed backs and exact spine cover wraps.',
    url: 'https://colorear.atpdev.dev/en',
    locale: 'en_US',
    images: [{ url: 'https://colorear.atpdev.dev/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function EnglishHomePage() {
  const featured = COLORING_SHEETS.slice(0, 6);

  return (
    <div className="space-y-14 pb-10">
      {/* English SEO Hero */}
      <section className="studio-dot-grid border-b border-zinc-200 dark:border-slate-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-300 text-zinc-950 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free 300 DPI PDFs • Amazon KDP Coloring Book Studio</span>
            </span>

            <h1 className="font-display font-bold text-3xl sm:text-5xl text-zinc-900 dark:text-white tracking-tight leading-[1.08]">
              Free Printable Coloring Pages (300 DPI) &amp; Complete Amazon KDP Book Studio
            </h1>

            <p className="text-base text-zinc-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Print crisp black-and-white sheets for kids and classrooms, paint online with one click,
              or compile upload-ready Amazon KDP coloring books (8.5×11&quot;, 8.5×8.5&quot;, 6×9&quot;) with
              automatic blank verso pages, pure B&amp;W line-art cleanup, and exact spine-calculated paperback covers.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/estudio-kdp?lang=en"
                className="px-6 py-3.5 rounded-2xl text-sm font-bold btn-studio-primary inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Amazon KDP Studio</span>
              </Link>
              <Link
                href="/planes?lang=en"
                className="px-6 py-3.5 rounded-2xl text-sm font-bold btn-studio-sun inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>View KDP Credit Packs ($9)</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
            <div className="sheet-card rounded-2xl bg-white dark:bg-slate-900 p-4 space-y-1.5">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-sm text-zinc-900 dark:text-white">Pure #000 / #FFF Cleaner</h2>
              <p className="text-zinc-600 dark:text-slate-400">
                Strips gray AI haze from ChatGPT or Midjourney art into crisp printable outlines.
              </p>
            </div>
            <div className="sheet-card rounded-2xl bg-white dark:bg-slate-900 p-4 space-y-1.5">
              <Printer className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-sm text-zinc-900 dark:text-white">True 300 DPI &amp; Blank Backs</h2>
              <p className="text-zinc-600 dark:text-slate-400">
                Inserts automatic blank verso sheets so alcohol markers never bleed onto the next page.
              </p>
            </div>
            <div className="sheet-card rounded-2xl bg-white dark:bg-slate-900 p-4 space-y-1.5">
              <Ruler className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-sm text-zinc-900 dark:text-white">Exact KDP Spine Math</h2>
              <p className="text-zinc-600 dark:text-slate-400">
                Official white (0.002252&quot;) &amp; cream (0.0025&quot;) spine width + 0.125&quot; bleed wrap PDF.
              </p>
            </div>
            <div className="sheet-card rounded-2xl bg-white dark:bg-slate-900 p-4 space-y-1.5">
              <Download className="w-5 h-5 text-violet-600" />
              <h2 className="font-bold text-sm text-zinc-900 dark:text-white">Zero Watermarks</h2>
              <p className="text-zinc-600 dark:text-slate-400">
                Includes Title Page, &ldquo;This Book Belongs To&rdquo; page, and KDP 24-page minimum check.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner />
      </div>

      {/* Featured Free 300 DPI Sheets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              Featured Free 300 DPI Printable Coloring Sheets
            </h2>
            <p className="text-sm text-zinc-600 dark:text-slate-400">
              Download US Letter (8.5×11&quot;) or A4 PDFs instantly, paint online, or add them directly to your KDP book.
            </p>
          </div>
          <Link
            href="/dibujos?lang=en"
            className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Browse all {COLORING_SHEETS.length} sheets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((sheet) => (
            <SheetCard key={sheet.id} sheet={sheet} />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {COLORING_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/dibujos/${cat.slug}?lang=en`}
              className={`rounded-2xl border p-3.5 text-center transition-transform hover:-translate-y-0.5 ${cat.accentBg}`}
            >
              <span className={`font-display font-bold text-sm block ${cat.accentText}`}>
                {cat.shortName}
              </span>
              <span className="text-[11px] text-zinc-600 dark:text-slate-400 block mt-0.5">
                300 DPI PDF
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

