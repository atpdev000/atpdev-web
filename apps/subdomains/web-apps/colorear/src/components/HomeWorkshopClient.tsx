'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Download,
  Paintbrush,
  BookOpen,
  Loader2,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Layers,
  Ruler,
  Printer,
} from 'lucide-react';
import { COLORING_CATEGORIES, COLORING_SHEETS, svgToDataUrl } from '@/data/catalog';
import { buildSingleSheetPdf, triggerPdfDownload } from '@/lib/kdpPdfBuilder';
import { processImageToLineArt300Dpi } from '@/lib/lineArtProcessor';
import SheetCard from './SheetCard';
import InteractiveColoringModal from './InteractiveColoringModal';
import InlineNotice from './InlineNotice';
import AdBanner from './AdBanner';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const STYLE_OPTIONS = [
  { id: 'kawaii', label: 'Kawaii Bold & Easy' },
  { id: 'infantil', label: 'Infantil Simple' },
  { id: 'cozy', label: 'Cozy Friends' },
  { id: 'mandala', label: 'Mandala Simétrico' },
  { id: 'realista', label: 'Cuento Ilustrado' },
];

const QUICK_IDEAS = [
  'Un capibara tomando jugo de naranja con lentes de sol',
  'Un gatito astronauta flotando junto a planetas y estrellas',
  'Un dinosaurio amigable horneando cupcakes en una cocina',
  'Una llama andina con chullo frente a las montañas del Cusco',
];

export default function HomeWorkshopClient() {
  const { setUserCreditsLocal } = useAuth();
  const { isEn } = useLanguage();
  const defaultSheet = COLORING_SHEETS[0];
  const [prompt, setPrompt] = useState('Un osito tierno leyendo un libro gigante bajo un árbol');
  const [style, setStyle] = useState('kawaii');
  const [activeImage, setActiveImage] = useState<string>(svgToDataUrl(defaultSheet.svg));
  const [activeTitle, setActiveTitle] = useState<string>(defaultSheet.title);
  const [pureBwEnabled, setPureBwEnabled] = useState<boolean>(true);
  const [threshold, setThreshold] = useState<number>(185);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [paintOpen, setPaintOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [notice, setNotice] = useState<{ tone: 'info' | 'warning' | 'error' | 'success'; title: string; message: string } | null>(null);
  const [rawGeneratedSrc, setRawGeneratedSrc] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      setNotice({
        tone: 'warning',
        title: 'Describe tu dibujo',
        message: 'Escribe una escena sencilla (por ejemplo: "un perrito en bicicleta") para generar la lámina.',
      });
      return;
    }

    setNotice(null);
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), style, aspect: 'portrait' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          tone: res.status === 429 ? 'warning' : 'error',
          title: res.status === 429 ? 'Límite diario alcanzado' : 'No se pudo generar la ilustración',
          message: data.error || 'Intenta nuevamente en unos segundos.',
        });
        return;
      }

      if (typeof data.creditsRemaining === 'number') {
        setUserCreditsLocal(data.creditsRemaining);
      }
      setRawGeneratedSrc(data.imageDataUrl);
      const cleaned = await processImageToLineArt300Dpi(
        data.imageDataUrl,
        '8.5x11',
        {
          threshold,
          boldness: 0,
          addFrame: true,
          pureBlackWhite: pureBwEnabled,
        },
        0.38
      );
      setActiveImage(cleaned);
      setActiveTitle(prompt.trim().slice(0, 60));
      setNotice({
        tone: 'success',
        title: 'Lámina lista para imprimir o pintar',
        message:
          typeof data.creditsRemaining === 'number'
            ? `Ilustración generada y limpiada en blanco y negro puro (-1 crédito). Saldo restante: ${data.creditsRemaining} créditos.`
            : typeof data.remainingToday === 'number'
              ? `Ilustración generada y limpiada en blanco y negro puro. Te quedan ${data.remainingToday} generaciones gratuitas hoy.`
              : 'Ilustración generada y optimizada a blanco y negro puro.',
      });
    } catch {
      setNotice({
        tone: 'error',
        title: 'Error de conexión',
        message: 'No pudimos conectar con el generador. Revisa tu conexión e inténtalo de nuevo.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const reapplyLineArt = async (nextPureBw: boolean, nextThreshold: number) => {
    setPureBwEnabled(nextPureBw);
    setThreshold(nextThreshold);
    if (!rawGeneratedSrc) return;
    try {
      const cleaned = await processImageToLineArt300Dpi(
        rawGeneratedSrc,
        '8.5x11',
        {
          threshold: nextThreshold,
          boldness: 0,
          addFrame: true,
          pureBlackWhite: nextPureBw,
        },
        0.38
      );
      setActiveImage(cleaned);
    } catch {}
  };

  const handleDownloadActivePdf = async (trim: '8.5x11' | 'a4') => {
    setIsExporting(true);
    try {
      const source = rawGeneratedSrc || activeImage;
      const bytes = await buildSingleSheetPdf(source, activeTitle, trim, {
        threshold,
        boldness: 0,
        addFrame: Boolean(rawGeneratedSrc),
        pureBlackWhite: Boolean(rawGeneratedSrc && pureBwEnabled),
      });
      triggerPdfDownload(
        bytes,
        `${activeTitle.toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}-${trim}-300dpi.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendActiveToKdp = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('colorear_kdp_queue') || '[]');
      const next = [
        ...existing,
        {
          id: `ia-${Date.now()}`,
          title: activeTitle,
          imageSrc: rawGeneratedSrc || activeImage,
        },
      ].slice(0, 60);
      localStorage.setItem('colorear_kdp_queue', JSON.stringify(next));
      setNotice({
        tone: 'success',
        title: 'Enviado al Estudio KDP',
        message: `"${activeTitle}" se guardó en tu libro. Abre Estudio KDP para compilar tu PDF 300 DPI.`,
      });
    } catch {}
  };

  const visibleSheets =
    selectedCategory === 'todos'
      ? COLORING_SHEETS.slice(0, 9)
      : COLORING_SHEETS.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-16">
      {/* HERO: MESA DE DIBUJO INTERACTIVA */}
      <section className="studio-dot-grid border-b border-zinc-200 dark:border-slate-800 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Columna izquierda: generador real */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="font-display font-bold text-3xl sm:text-5xl text-zinc-900 dark:text-white tracking-tight leading-[1.08]">
                {isEn
                  ? 'Create 300 DPI printable coloring pages & Amazon KDP books'
                  : 'Crea dibujos para colorear en PDF y libros listos para Amazon KDP'}
              </h1>
              <p className="text-base text-zinc-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {isEn
                  ? 'Download free 300 DPI kids sheets and mandalas, paint online, or compile a complete 8.5×11" paperback with pure black outlines, blank verso backs, and exact spine-calculated cover.'
                  : 'Descarga láminas infantiles y mandalas gratis a 300 DPI, píntalos en pantalla o arma un libro completo 8.5×11" con trazos negros limpios, reversos en blanco y portada con cálculo exacto del lomo.'}
              </p>
            </div>

            {notice && (
              <InlineNotice
                tone={notice.tone}
                title={notice.title}
                message={notice.message}
                onClose={() => setNotice(null)}
              />
            )}

            <form
              onSubmit={handleGenerate}
              className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="coloring-prompt"
                  className="text-sm font-bold text-zinc-900 dark:text-white block"
                >
                  ¿Qué dibujo para colorear quieres crear hoy?
                </label>
                <textarea
                  id="coloring-prompt"
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej.: Un gatito chef haciendo pizza con ingredientes grandes..."
                  className="w-full rounded-2xl border-2 border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-blue-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {QUICK_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setPrompt(idea)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-zinc-700 dark:text-slate-300 border border-zinc-200 dark:border-slate-700 cursor-pointer transition-colors"
                  >
                    {idea.slice(0, 42)}...
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
                  Estilo del trazo
                </span>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStyle(opt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        style === opt.id
                          ? 'bg-zinc-900 dark:bg-blue-600 text-white border-zinc-900 dark:border-blue-500'
                          : 'bg-white dark:bg-slate-950 text-zinc-700 dark:text-slate-300 border-zinc-200 dark:border-slate-700 hover:border-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 py-3.5 px-5 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEn ? 'Drawing crisp outlines...' : 'Dibujando trazos limpios...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{isEn ? 'Generate free sheet' : 'Generar lámina gratis'}</span>
                    </>
                  )}
                </button>

                <Link
                  href="/estudio-kdp"
                  className="py-3.5 px-5 rounded-2xl text-sm font-bold btn-studio-sun flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isEn ? 'Open KDP Studio' : 'Abrir Estudio KDP'}</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Columna derecha: hoja en vivo lista para pintar o imprimir */}
          <div className="lg:col-span-5">
            <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {activeTitle}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                  300 DPI listos
                </span>
              </div>

              <div className="aspect-[8.5/11] w-full max-w-[340px] mx-auto rounded-2xl bg-white border-2 border-zinc-900 overflow-hidden shadow-inner flex items-center justify-center p-1.5 relative">
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-xs font-bold text-zinc-800">
                      Generando ilustración en blanco y negro...
                    </span>
                  </div>
                )}
                <img
                  src={activeImage}
                  alt={activeTitle}
                  className="w-full h-full object-contain"
                />
              </div>

              {rawGeneratedSrc && (
                <div className="rounded-xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      Limpieza Line-Art puro
                    </span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-zinc-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={pureBwEnabled}
                        onChange={(e) => reapplyLineArt(e.target.checked, threshold)}
                        className="accent-blue-600"
                      />
                      <span>B/N puro</span>
                    </label>
                  </div>
                  {pureBwEnabled && (
                    <input
                      type="range"
                      min={115}
                      max={235}
                      value={threshold}
                      onChange={(e) => reapplyLineArt(pureBwEnabled, Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                      aria-label="Umbral de contraste blanco y negro"
                    />
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaintOpen(true)}
                  className="py-2.5 px-3 rounded-xl border-2 border-zinc-900 dark:border-slate-600 bg-yellow-300 hover:bg-yellow-400 text-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Paintbrush className="w-4 h-4" />
                  <span>Pintar en pantalla</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadActivePdf('8.5x11')}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold btn-studio-primary flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Creando PDF...' : 'Descargar PDF'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadActivePdf('a4')}
                  className="text-zinc-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Descargar en A4
                </button>
                <button
                  type="button"
                  onClick={handleSendActiveToKdp}
                  className="text-blue-700 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                >
                  + Añadir a mi libro KDP
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE PUBLICITARIO ADSENSE RESPONSIVO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner />
      </div>

      {/* CAPA GRATUITA: BIBLIOTECA SEO POR CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              Biblioteca gratuita de dibujos para imprimir
            </h2>
            <p className="text-sm text-zinc-600 dark:text-slate-400 max-w-2xl">
              Elige una categoría para imprimir hojas sueltas en PDF 300 DPI o colorearlas directamente
              desde el celular, tablet o computadora.
            </p>
          </div>
          <Link
            href="/dibujos"
            className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Ver las {COLORING_SHEETS.length} láminas por categoría</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filtros rápidos + enlaces directos a las páginas SEO */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
              selectedCategory === 'todos'
                ? 'bg-zinc-900 dark:bg-blue-600 text-white border-zinc-900 dark:border-blue-500'
                : 'bg-white dark:bg-slate-900 text-zinc-700 dark:text-slate-300 border-zinc-200 dark:border-slate-700'
            }`}
          >
            Destacados ({COLORING_SHEETS.length})
          </button>
          {COLORING_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-zinc-900 dark:bg-blue-600 text-white border-zinc-900 dark:border-blue-500'
                  : 'bg-white dark:bg-slate-900 text-zinc-700 dark:text-slate-300 border-zinc-200 dark:border-slate-700 hover:border-zinc-400'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleSheets.map((sheet) => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              onAddedToStudio={(t) =>
                setNotice({
                  tone: 'success',
                  title: 'Añadido al Estudio KDP',
                  message: `"${t}" ya está en tu lista de páginas del Estudio KDP.`,
                })
              }
            />
          ))}
        </div>

        {/* Accesos directos SEO a los 7 hubs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {COLORING_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/dibujos/${cat.slug}`}
              className={`rounded-2xl border p-3.5 text-center transition-transform hover:-translate-y-0.5 ${cat.accentBg}`}
            >
              <span className={`font-display font-bold text-sm block ${cat.accentText}`}>
                {cat.shortName}
              </span>
              <span className="text-[11px] text-zinc-600 dark:text-slate-400 block mt-0.5">
                PDF gratis
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CAPA PRO: ESTUDIO AMAZON KDP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-zinc-950 text-white border-2 border-zinc-900 dark:border-slate-700 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-300 text-zinc-950 text-xs font-bold">
              Estudio para creadores de Amazon KDP
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl leading-tight">
              Resuelve en minutos lo que ChatGPT y Canva dejan a medias
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Sube tus ilustraciones o genéralas por lotes con estilo consistente. Nuestro compilador
              limpia fondos grises a blanco y negro puro, re-escala a 300 DPI reales, agrega páginas
              traseras en blanco anti-traspaso y genera tu portada completa con lomo calculado.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/estudio-kdp"
                className="px-6 py-3.5 rounded-2xl text-sm font-bold btn-studio-sun inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Abrir Estudio KDP ahora</span>
              </Link>
              <Link
                href="/planes"
                className="px-5 py-3.5 rounded-2xl text-sm font-bold border border-zinc-700 hover:bg-zinc-800 text-white inline-flex items-center gap-2"
              >
                <span>Ver planes y créditos</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-1.5">
              <Layers className="w-5 h-5 text-yellow-300" />
              <h3 className="font-bold text-sm text-white">Line-art blanco/negro</h3>
              <p className="text-zinc-400 leading-relaxed">
                Elimina manchas grises de la IA y deja trazos negros nítidos sobre blanco puro.
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-1.5">
              <Printer className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">300 DPI y reversos</h3>
              <p className="text-zinc-400 leading-relaxed">
                Exporta PDFs 8.5×11&quot;, 8.5×8.5&quot; o 6×9&quot; con reverso en blanco automático.
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-1.5">
              <Ruler className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-sm text-white">Portada y lomo exacto</h3>
              <p className="text-zinc-400 leading-relaxed">
                Fórmula oficial KDP (0.002252&quot; blanco / 0.0025&quot; crema) + sangrado 0.125&quot;.
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-1.5">
              <CheckCircle2 className="w-5 h-5 text-pink-400" />
              <h3 className="font-bold text-sm text-white">Sin marcas de agua</h3>
              <p className="text-zinc-400 leading-relaxed">
                Incluye página de pertenencia, derechos de autor y nota opcional de transparencia IA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GUÍA EDITORIAL Y FAQ PARA SEO & ADSENSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-10 space-y-6">
          <div className="space-y-2 max-w-3xl">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              Guía técnica para imprimir láminas y publicar libros para colorear sin errores
            </h2>
            <p className="text-sm text-zinc-600 dark:text-slate-400 leading-relaxed">
              Tanto si eres madre, padre o docente imprimiendo fichas escolares como si preparas tu
              primer libro de tapa blanda en Amazon KDP, la diferencia entre un resultado amateur y uno
              profesional está en tres variables técnicas: resolución real, limpieza del blanco y negro
              y márgenes de impresión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-600 dark:text-slate-300 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                Por qué 300 DPI reales importan al imprimir
              </h3>
              <p>
                Las pantallas trabajan a 72–96 píxeles por pulgada, pero una imprenta o impresora
                doméstica necesita 300 puntos por pulgada (2550×3300 píxeles en tamaño Carta 8.5×11&quot;).
                Cuando una imagen de baja resolución se estira en un editor simple, los bordes negros
                se pixelan y Amazon KDP marca advertencias de calidad durante la revisión previa.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                Limpieza de fondo blanco y reversos anti-traspaso
              </h3>
              <p>
                Muchas imágenes creadas con IA contienen un velo gris casi invisible que gasta tinta al
                imprimir y ensucia el papel. Nuestro filtro de umbral convierte el fondo en blanco puro
                (#FFFFFF) y las líneas en negro intenso (#000000). Además, en libros físicos es clave
                dejar el reverso en blanco detrás de cada ilustración para poder usar plumones o
                marcadores de alcohol sin arruinar el dibujo siguiente.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                Cálculo del lomo y políticas transparentes en KDP
              </h3>
              <p>
                En libros de tapa blanda (mínimo 24 páginas), el ancho total de la portada depende del
                número exacto de hojas interiores y del tipo de papel (blanco o crema) más 0.125&quot; de
                sangrado perimetral. Recuerda siempre revisar cada página antes de publicar y marcar la
                casilla correspondiente de contenido generado con IA cuando subas tu obra a Amazon KDP.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                ¿Las láminas de la biblioteca son realmente gratuitas?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
                Sí. Todas las categorías de nuestra biblioteca pública se pueden colorear online o
                descargar en PDF de 300 DPI sin crear cuenta ni pagar suscripciones.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                ¿Puedo subir mis propios dibujos hechos en ChatGPT o Midjourney al Estudio KDP?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
                Sí. El Estudio KDP acepta lotes de hasta 60 imágenes PNG, JPG o WebP desde tu equipo,
                las limpia a blanco y negro puro, agrega reversos en blanco y compila el PDF interior y
                la portada completa localmente en tu navegador.
              </p>
            </div>
          </div>
        </div>
      </section>

      <InteractiveColoringModal
        isOpen={paintOpen}
        title={activeTitle}
        imageSrc={activeImage}
        onClose={() => setPaintOpen(false)}
      />
    </div>
  );
}

