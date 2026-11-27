'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  Paintbrush,
  BookOpen,
  Check,
  Loader2,
  Printer,
  Share2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { ColoringCategory, ColoringSheet, svgToDataUrl } from '@/data/catalog';
import { buildSingleSheetPdf, triggerPdfDownload } from '@/lib/kdpPdfBuilder';
import InteractiveColoringModal from './InteractiveColoringModal';
import InlineNotice from './InlineNotice';
import SheetCard from './SheetCard';

interface SheetDetailClientProps {
  sheet: ColoringSheet;
  category: ColoringCategory;
  related: ColoringSheet[];
}

export default function SheetDetailClient({ sheet, category, related }: SheetDetailClientProps) {
  const [downloading, setDownloading] = useState<'8.5x11' | 'a4' | null>(null);
  const [paintOpen, setPaintOpen] = useState(false);
  const [addedToKdp, setAddedToKdp] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'info' | 'error'; title: string; message: string } | null>(
    null
  );

  const previewUrl = svgToDataUrl(sheet.svg);

  const handleDownloadPdf = async (trim: '8.5x11' | 'a4') => {
    setDownloading(trim);
    try {
      const bytes = await buildSingleSheetPdf(previewUrl, sheet.title, trim, {
        threshold: 185,
        boldness: 0,
        addFrame: false,
        pureBlackWhite: false,
      });
      triggerPdfDownload(bytes, `${sheet.id}-${trim}-300dpi.pdf`);
      setNotice({
        tone: 'success',
        title: `PDF 300 DPI (${trim === 'a4' ? 'A4' : 'Carta 8.5×11"'}) descargado`,
        message: 'Listo para imprimir con trazos negros puros sobre papel blanco sin manchas grises.',
      });
    } catch {
      setNotice({
        tone: 'error',
        title: 'No se pudo generar el PDF',
        message: 'Inténtalo nuevamente en unos segundos.',
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleAddToKdp = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('colorear_kdp_queue') || '[]');
      const next = [
        ...existing,
        {
          id: `${sheet.id}-${Date.now()}`,
          title: sheet.title,
          imageSrc: previewUrl,
        },
      ].slice(0, 60);
      localStorage.setItem('colorear_kdp_queue', JSON.stringify(next));
      setAddedToKdp(true);
      setNotice({
        tone: 'success',
        title: 'Añadido a tu libro en el Estudio KDP',
        message: `"${sheet.title}" ya está en tu cola editorial. Abre Estudio KDP para armar tu libro completo.`,
      });
      setTimeout(() => setAddedToKdp(false), 3000);
    } catch {}
  };

  const handleCopyShare = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : `https://colorear.atpdev.dev/dibujos/${category.slug}/${sheet.id}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  return (
    <>
      <div className="space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href={`/dibujos/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a {category.name}</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-zinc-700 dark:text-slate-300 hover:bg-zinc-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Enlace copiado' : 'Compartir lámina'}</span>
          </button>
        </div>

        {notice && (
          <InlineNotice
            tone={notice.tone}
            title={notice.title}
            message={notice.message}
            onClose={() => setNotice(null)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Vista previa grande */}
          <div className="lg:col-span-6 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-6">
            <div className="aspect-[8.5/11] w-full max-w-[440px] mx-auto rounded-2xl bg-white border-2 border-zinc-900 overflow-hidden flex items-center justify-center p-2 shadow-inner">
              <img
                src={previewUrl}
                alt={`${sheet.title} — dibujo para colorear en PDF 300 DPI`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Ficha y acciones */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/dibujos/${category.slug}`}
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${category.accentBg} ${category.accentText}`}
                >
                  {category.shortName}
                </Link>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300">
                  Edad: {sheet.ageRange}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Dificultad: {sheet.difficulty}
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
                {sheet.title} para Colorear e Imprimir en PDF
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-300 leading-relaxed">
                {sheet.description} Lámina original con trazos negros cerrados lista para imprimir a{' '}
                <strong>300 DPI reales</strong> en hoja Carta (8.5×11&quot;) o A4 sin marca de agua, o para
                colorear directamente desde el navegador.
              </p>
            </div>

            {/* Botones principales */}
            <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={downloading !== null}
                  onClick={() => handleDownloadPdf('8.5x11')}
                  className="py-3.5 px-4 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {downloading === '8.5x11' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>PDF Carta 8.5×11&quot;</span>
                </button>

                <button
                  type="button"
                  disabled={downloading !== null}
                  onClick={() => handleDownloadPdf('a4')}
                  className="py-3.5 px-4 rounded-2xl text-sm font-bold border-2 border-zinc-900 dark:border-slate-600 bg-zinc-900 dark:bg-slate-800 text-white hover:bg-zinc-800 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {downloading === 'a4' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Printer className="w-4 h-4" />
                  )}
                  <span>PDF A4 (300 DPI)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaintOpen(true)}
                  className="py-3 px-4 rounded-2xl text-sm font-bold btn-studio-sun flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Paintbrush className="w-4 h-4" />
                  <span>Pintar online ahora</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToKdp}
                  className="py-3 px-4 rounded-2xl text-sm font-bold border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedToKdp ? <Check className="w-4 h-4 text-emerald-600" /> : <BookOpen className="w-4 h-4" />}
                  <span>{addedToKdp ? 'Guardado en Estudio KDP' : 'Enviar al Estudio KDP'}</span>
                </button>
              </div>
            </div>

            {/* Datos de impresión + valor educativo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-900/70 p-4 space-y-1.5">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span>Consejo de impresión</span>
                </h2>
                <p className="text-zinc-600 dark:text-slate-400 leading-relaxed">
                  {category.printingTip}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-900/70 p-4 space-y-1.5">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Valor educativo</span>
                </h2>
                <p className="text-zinc-600 dark:text-slate-400 leading-relaxed">
                  {category.educationalBenefit}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {sheet.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Láminas relacionadas */}
        {related.length > 0 && (
          <section className="space-y-5 pt-4 border-t border-zinc-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
                Más dibujos de {category.shortName} para colorear
              </h2>
              <Link
                href={`/dibujos/${category.slug}`}
                className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
              >
                Ver categoría completa →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <SheetCard key={item.id} sheet={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <InteractiveColoringModal
        isOpen={paintOpen}
        title={sheet.title}
        imageSrc={previewUrl}
        onClose={() => setPaintOpen(false)}
      />
    </>
  );
}

