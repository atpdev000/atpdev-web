'use client';

import React, { useState } from 'react';
import { Download, Paintbrush, PlusCircle, Check, Loader2 } from 'lucide-react';
import { ColoringSheet, svgToDataUrl } from '@/data/catalog';
import { buildSingleSheetPdf, triggerPdfDownload } from '@/lib/kdpPdfBuilder';
import InteractiveColoringModal from './InteractiveColoringModal';

interface SheetCardProps {
  sheet: ColoringSheet;
  onAddedToStudio?: (title: string) => void;
}

export default function SheetCard({ sheet, onAddedToStudio }: SheetCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [paintOpen, setPaintOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const previewUrl = svgToDataUrl(sheet.svg);

  const handleDownloadPdf = async (trim: '8.5x11' | 'a4' = '8.5x11') => {
    setDownloading(true);
    try {
      const bytes = await buildSingleSheetPdf(previewUrl, sheet.title, trim, {
        threshold: 185,
        boldness: 0,
        addFrame: false,
        pureBlackWhite: false,
      });
      triggerPdfDownload(bytes, `${sheet.id}-${trim}-300dpi.pdf`);
    } finally {
      setDownloading(false);
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
      setAdded(true);
      onAddedToStudio?.(sheet.title);
      setTimeout(() => setAdded(false), 2500);
    } catch {}
  };

  return (
    <>
      <article className="sheet-card rounded-2xl bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
        <div className="p-3 bg-zinc-50 dark:bg-slate-950/70 border-b border-zinc-200 dark:border-slate-800">
          <div className="aspect-[8.5/11] w-full rounded-xl bg-white overflow-hidden border border-zinc-200 flex items-center justify-center p-1">
            <img
              src={previewUrl}
              alt={`${sheet.title} — lámina para colorear gratis`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300">
                {sheet.ageRange}
              </span>
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-slate-400">
                {sheet.difficulty}
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white leading-snug">
              {sheet.title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
              {sheet.description}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaintOpen(true)}
                className="py-2 px-2.5 rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 hover:bg-yellow-50 dark:hover:bg-slate-700 text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Paintbrush className="w-3.5 h-3.5 text-amber-500" />
                <span>Pintar</span>
              </button>

              <button
                type="button"
                disabled={downloading}
                onClick={() => handleDownloadPdf('8.5x11')}
                className="py-2 px-2.5 rounded-xl text-xs font-bold btn-studio-primary flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>PDF 300 DPI</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToKdp}
              className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Añadido al Estudio KDP</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Enviar al Estudio KDP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      <InteractiveColoringModal
        isOpen={paintOpen}
        title={sheet.title}
        imageSrc={previewUrl}
        onClose={() => setPaintOpen(false)}
      />
    </>
  );
}

