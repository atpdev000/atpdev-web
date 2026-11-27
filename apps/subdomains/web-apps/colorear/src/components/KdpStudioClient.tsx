'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  BookOpen,
  Ruler,
  Sliders,
  Loader2,
  Copy,
  Check,
  ImagePlus,
  Layers,
  Eye,
} from 'lucide-react';
import {
  KDP_TRIM_SPECS,
  KdpTrimSize,
  LineArtOptions,
  processImageToLineArt300Dpi,
} from '@/lib/lineArtProcessor';
import {
  buildKdpFullWrapCoverPdf,
  buildKdpInteriorPdf,
  calculateKdpSpine,
  KdpBookPageInput,
  triggerPdfDownload,
} from '@/lib/kdpPdfBuilder';
import { COLORING_SHEETS, svgToDataUrl } from '@/data/catalog';
import InlineNotice from './InlineNotice';
import { useAuth } from '@/context/AuthContext';

interface PlannedPage {
  pageNumber: number;
  title: string;
  prompt: string;
}

type StudioTab = 'planner' | 'pages' | 'interior' | 'cover';

export default function KdpStudioClient() {
  const { setUserCreditsLocal } = useAuth();
  const [activeTab, setActiveTab] = useState<StudioTab>('planner');
  const [notice, setNotice] = useState<{ tone: 'info' | 'warning' | 'error' | 'success'; title: string; message: string } | null>(null);

  // Paso 1: Planificador IA
  const [topic, setTopic] = useState('Animalitos Tiernos en Situaciones Cotidianas');
  const [ageGroup, setAgeGroup] = useState('Niños de 4 a 8 años');
  const [style, setStyle] = useState('kawaii');
  const [language, setLanguage] = useState('Español');
  const [plannedCount, setPlannedCount] = useState(12);
  const [planning, setPlanning] = useState(false);
  const [plannedPages, setPlannedPages] = useState<PlannedPage[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [generatingPromptIdx, setGeneratingPromptIdx] = useState<number | null>(null);

  // Metadatos del libro
  const [bookTitle, setBookTitle] = useState('Animalitos Tiernos: Libro para Colorear');
  const [subtitle, setSubtitle] = useState('Ilustraciones Bold & Easy con Reverso Anti-Traspaso');
  const [authorName, setAuthorName] = useState('Ediciones Creativas');
  const [backBlurb, setBackBlurb] = useState(
    'Disfruta horas de creatividad y calma con ilustraciones de trazos gruesos diseñadas para lápices, crayolas y plumones. Cada lámina incluye reverso en blanco para proteger tus dibujos.'
  );

  // Paso 2: Páginas del libro + limpieza line-art
  const [pages, setPages] = useState<KdpBookPageInput[]>([]);
  const [trimSize, setTrimSize] = useState<KdpTrimSize>('8.5x11');
  const [lineArt, setLineArt] = useState<LineArtOptions>({
    threshold: 185,
    boldness: 0,
    addFrame: true,
    caption: '',
    pureBlackWhite: true,
  });
  const [showTitlesOnPages, setShowTitlesOnPages] = useState(false);
  const [selectedPreviewIdx, setSelectedPreviewIdx] = useState<number>(0);
  const [cleanedPreviewUrl, setCleanedPreviewUrl] = useState<string | null>(null);
  const [cleaningPreview, setCleaningPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paso 3: Interior PDF
  const [includeBleed, setIncludeBleed] = useState(false);
  const [includeBlankVerso, setIncludeBlankVerso] = useState(true);
  const [includeBelongsToPage, setIncludeBelongsToPage] = useState(true);
  const [includeCopyrightPage, setIncludeCopyrightPage] = useState(true);
  const [aiDisclosureNote, setAiDisclosureNote] = useState(true);
  const [buildingPdf, setBuildingPdf] = useState(false);
  const [buildProgress, setBuildProgress] = useState<string>('');

  // Paso 4: Portada y Lomo KDP
  const [paperType, setPaperType] = useState<'white' | 'cream'>('white');
  const [coverBgHex, setCoverBgHex] = useState('#2563EB');
  const [coverAccentHex, setCoverAccentHex] = useState('#FACC15');
  const [coverArtIndex, setCoverArtIndex] = useState<number>(0);
  const [buildingCover, setBuildingCover] = useState(false);

  // Cargar cola guardada desde la biblioteca o inicio
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('colorear_kdp_queue') || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        setPages(saved);
      }
    } catch {}
  }, []);

  const persistPages = (next: KdpBookPageInput[]) => {
    setPages(next);
    try {
      localStorage.setItem('colorear_kdp_queue', JSON.stringify(next.slice(0, 60)));
    } catch {}
  };

  // Actualizar vista previa limpia del filtro Line-Art cuando cambia página o ajustes
  useEffect(() => {
    if (activeTab !== 'pages' || pages.length === 0) return;
    const safeIdx = Math.min(selectedPreviewIdx, pages.length - 1);
    const target = pages[safeIdx];
    if (!target) return;

    let cancelled = false;
    setCleaningPreview(true);
    processImageToLineArt300Dpi(
      target.imageSrc,
      trimSize,
      {
        ...lineArt,
        caption: showTitlesOnPages ? target.title : undefined,
      },
      0.32
    )
      .then((url) => {
        if (!cancelled) setCleanedPreviewUrl(url);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCleaningPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, pages, selectedPreviewIdx, trimSize, lineArt, showTitlesOnPages]);

  // Calcular total de páginas del manuscrito interior (respetando mínimo 24 de Amazon KDP)
  const frontMatterCount =
    1 + (includeCopyrightPage ? 1 : includeBelongsToPage ? 1 : 0) + (includeBelongsToPage ? 2 : 0);
  const artPagesTotal = pages.length * (includeBlankVerso ? 2 : 1);
  const estimatedInteriorPages = Math.max(24, frontMatterCount + artPagesTotal);
  const spineDims = calculateKdpSpine(trimSize, estimatedInteriorPages, paperType);

  const handlePlanBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setNotice({
        tone: 'warning',
        title: 'Indica una temática',
        message: 'Escribe sobre qué trata tu libro (ej.: "Dinosaurios en el espacio" o "Mandalas florales").',
      });
      return;
    }
    setNotice(null);
    setPlanning(true);
    try {
      const res = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          ageGroup,
          style,
          language,
          pageCount: plannedCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ tone: 'error', title: 'Error al planificar', message: data.error || 'Intenta nuevamente.' });
        return;
      }
      setBookTitle(data.bookTitle || bookTitle);
      setSubtitle(data.subtitle || subtitle);
      if (data.backBlurb) setBackBlurb(data.backBlurb);
      setKeywords(Array.isArray(data.keywords) ? data.keywords : []);
      setPlannedPages(Array.isArray(data.pages) ? data.pages : []);
      setNotice({
        tone: 'success',
        title: `Plan de ${data.pages?.length || 0} páginas listo`,
        message: 'Ahora puedes generar cada página con IA aquí mismo o copiar los prompts para tu flujo externo.',
      });
    } catch {
      setNotice({ tone: 'error', title: 'Error de red', message: 'No se pudo conectar con el planificador.' });
    } finally {
      setPlanning(false);
    }
  };

  const handleGeneratePlannedPage = async (item: PlannedPage, idx: number) => {
    setGeneratingPromptIdx(idx);
    setNotice(null);
    try {
      const res = await fetch('/api/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: item.prompt,
          style,
          aspect: trimSize === '8.5x8.5' ? 'square' : 'portrait',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          tone: res.status === 429 ? 'warning' : 'error',
          title: 'No se pudo generar la ilustración',
          message: data.error || 'Inténtalo de nuevo en unos segundos.',
        });
        return;
      }
      if (typeof data.creditsRemaining === 'number') {
        setUserCreditsLocal(data.creditsRemaining);
      }
      const nextPages = [
        ...pages,
        {
          id: `kdp-ia-${Date.now()}-${idx}`,
          title: item.title,
          imageSrc: data.imageDataUrl,
        },
      ].slice(0, 60);
      persistPages(nextPages);
      setNotice({
        tone: 'success',
        title: `Ilustración "${item.title}" añadida`,
        message:
          typeof data.creditsRemaining === 'number'
            ? `Ahora tienes ${nextPages.length} página(s) en tu libro (-1 crédito • saldo: ${data.creditsRemaining}). Revísalas en "2. Páginas y Line-Art".`
            : `Ahora tienes ${nextPages.length} página(s) en tu libro. Revísalas en la pestaña "2. Páginas y Line-Art".`,
      });
    } catch {
      setNotice({ tone: 'error', title: 'Error de red', message: 'No pudimos generar la imagen.' });
    } finally {
      setGeneratingPromptIdx(null);
    }
  };

  const handleUploadImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) {
      setNotice({
        tone: 'warning',
        title: 'Archivo no compatible',
        message: 'Sube imágenes PNG, JPG, SVG o WebP.',
      });
      return;
    }

    const readers = valid.map(
      (file) =>
        new Promise<KdpBookPageInput>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
              imageSrc: String(reader.result || ''),
            });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((loaded) => {
      const next = [...pages, ...loaded].slice(0, 60);
      persistPages(next);
      setNotice({
        tone: 'success',
        title: `${loaded.length} imagen(es) cargada(s)`,
        message: 'Se aplicará limpieza a blanco y negro puro y escalado a 300 DPI al exportar tu PDF.',
      });
    });
  };

  const handleLoadSampleBook = () => {
    const sample = COLORING_SHEETS.slice(0, 12).map((s) => ({
      id: `sample-${s.id}`,
      title: s.title,
      imageSrc: svgToDataUrl(s.svg),
    }));
    persistPages(sample);
    setBookTitle('Gran Libro de Colorear: Animales, Dinosaurios y Fantasía');
    setSubtitle('12 Ilustraciones de Muestra • 300 DPI Listo para KDP');
    setActiveTab('pages');
    setNotice({
      tone: 'success',
      title: '12 páginas de muestra cargadas',
      message: 'Ya puedes probar la limpieza line-art, el compilador PDF interior 300 DPI y la portada con lomo exacto.',
    });
  };

  const movePage = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= pages.length) return;
    const clone = [...pages];
    const [item] = clone.splice(index, 1);
    clone.splice(target, 0, item);
    persistPages(clone);
    setSelectedPreviewIdx(target);
  };

  const removePage = (index: number) => {
    const clone = pages.filter((_, i) => i !== index);
    persistPages(clone);
    setSelectedPreviewIdx((prev) => Math.max(0, Math.min(prev, clone.length - 1)));
  };

  const handleExportInteriorPdf = async () => {
    if (pages.length === 0) {
      setNotice({
        tone: 'warning',
        title: 'Tu libro aún no tiene ilustraciones',
        message: 'Genera páginas con IA, sube tus dibujos o carga el pack de muestra antes de exportar el PDF.',
      });
      return;
    }

    setBuildingPdf(true);
    setBuildProgress('Preparando documento PDF a 300 DPI...');
    setNotice(null);
    try {
      const { pdfBytes, totalPages } = await buildKdpInteriorPdf(
        pages,
        {
          bookTitle,
          subtitle,
          authorName,
          trimSize,
          includeBleed,
          includeBlankVerso,
          includeBelongsToPage,
          includeCopyrightPage,
          aiDisclosureNote,
          lineArtOptions: {
            ...lineArt,
            caption: showTitlesOnPages ? '1' : undefined,
          },
        },
        (curr, total, label) => setBuildProgress(`${label} (${Math.round((curr / total) * 100)}%)`)
      );

      const safeFile = (bookTitle || 'libro-colorear-kdp')
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-')
        .slice(0, 45);
      triggerPdfDownload(pdfBytes, `${safeFile}-interior-kdp-${trimSize}-${totalPages}p-300dpi.pdf`);
      setNotice({
        tone: 'success',
        title: `PDF Interior KDP descargado (${totalPages} páginas)`,
        message: `Configurado en ${KDP_TRIM_SPECS[trimSize].label} a 300 DPI reales. Ahora puedes generar tu portada en el Paso 4 usando exactamente ${totalPages} páginas.`,
      });
    } catch (err: any) {
      setNotice({
        tone: 'error',
        title: 'Error al compilar el PDF',
        message: err?.message || 'Ocurrió un error al procesar las imágenes.',
      });
    } finally {
      setBuildingPdf(false);
      setBuildProgress('');
    }
  };

  const handleExportCoverPdf = async () => {
    setBuildingCover(true);
    setNotice(null);
    try {
      const frontImg = pages[coverArtIndex]?.imageSrc || svgToDataUrl(COLORING_SHEETS[3].svg);
      const pdfBytes = await buildKdpFullWrapCoverPdf({
        bookTitle,
        subtitle,
        authorName,
        backBlurb,
        trimSize,
        totalInteriorPages: estimatedInteriorPages,
        paperType,
        bgColorHex: coverBgHex,
        accentColorHex: coverAccentHex,
        frontImageSrc: frontImg,
      });

      const safeFile = (bookTitle || 'portada-kdp')
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-')
        .slice(0, 45);
      triggerPdfDownload(
        pdfBytes,
        `${safeFile}-portada-fullwrap-kdp-${trimSize}-${estimatedInteriorPages}p.pdf`
      );
      setNotice({
        tone: 'success',
        title: 'Portada Full-Wrap KDP descargada',
        message: `Medidas exactas: ${spineDims.fullWidthIn}" × ${spineDims.fullHeightIn}" (lomo de ${spineDims.spineWidthIn}" / ${spineDims.spineWidthMm} mm, sangrado 0.125" incluido).`,
      });
    } catch (err: any) {
      setNotice({
        tone: 'error',
        title: 'No se pudo generar la portada',
        message: err?.message || 'Error inesperado al crear el PDF de portada.',
      });
    } finally {
      setBuildingCover(false);
    }
  };

  const TABS: Array<{ id: StudioTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'planner', label: '1. Planificador IA', icon: Sparkles },
    { id: 'pages', label: `2. Páginas y Line-Art (${pages.length})`, icon: Sliders },
    { id: 'interior', label: '3. Interior PDF 300 DPI', icon: BookOpen },
    { id: 'cover', label: '4. Portada y Lomo KDP', icon: Ruler },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
            Estudio de Libros para Colorear — Amazon KDP
          </h1>
          <p className="text-sm text-zinc-600 dark:text-slate-300 leading-relaxed">
            Planifica tu libro con IA, limpia ilustraciones a blanco y negro puro, escala a 300 DPI
            reales y descarga el manuscrito interior con reversos en blanco + portada completa con
            cálculo exacto del lomo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleLoadSampleBook}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-zinc-50 dark:hover:bg-slate-800 text-xs font-bold text-zinc-800 dark:text-slate-200 cursor-pointer"
          >
            Cargar 12 páginas de prueba
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('pages');
              setTimeout(() => fileInputRef.current?.click(), 50);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold btn-studio-primary inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Subir mis imágenes (ChatGPT / Canva)</span>
          </button>
        </div>
      </div>

      {notice && (
        <InlineNotice
          tone={notice.tone}
          title={notice.title}
          message={notice.message}
          onClose={() => setNotice(null)}
        />
      )}

      {/* Navegación por pasos del flujo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-2.5 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white border-zinc-900 dark:border-blue-400 shadow-[0_3px_0_#1e3a8a]'
                  : 'bg-white dark:bg-slate-900 text-zinc-800 dark:text-slate-200 border-zinc-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 1: PLANIFICADOR IA ==================== */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handlePlanBook}
            className="lg:col-span-5 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4"
          >
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              Planificador de estructura KDP
            </h2>
            <p className="text-xs text-zinc-600 dark:text-slate-400">
              Genera el título SEO, subtítulo, contraportada, 7 palabras clave y la lista coherente de
              escenas para que tu libro mantenga un mismo estilo de principio a fin.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                Nicho o temática del libro
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej.: Capibaras relajados, Dinosaurios médicos, Animales del Perú..."
                className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Público / edad
                </label>
                <input
                  type="text"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3 py-2 text-xs text-zinc-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Idioma del libro
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3 py-2 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="Español">Español</option>
                  <option value="Inglés (Amazon.com)">Inglés (Amazon.com)</option>
                  <option value="Bilingüe Español / Inglés">Bilingüe ES / EN</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Estilo consistente
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3 py-2 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="kawaii">Kawaii Bold &amp; Easy</option>
                  <option value="cozy">Cozy Friends (Viral)</option>
                  <option value="infantil">Infantil 3–5 años</option>
                  <option value="mandala">Mandalas Simétricos</option>
                  <option value="realista">Botánico / Cuento</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Ilustraciones ({plannedCount})
                </label>
                <input
                  type="range"
                  min={6}
                  max={40}
                  step={2}
                  value={plannedCount}
                  onChange={(e) => setPlannedCount(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={planning}
              className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {planning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creando plan de libro con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar plan y {plannedCount} prompts</span>
                </>
              )}
            </button>
          </form>

          <div className="lg:col-span-7 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-5">
            {plannedPages.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-blue-600 mx-auto" />
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                  Tu estructura editorial aparecerá aquí
                </h3>
                <p className="text-xs text-zinc-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Pulsa &quot;Generar plan&quot; para obtener título, palabras clave de Amazon KDP y
                  prompts listos para generar dibujos aquí mismo o copiarlos a tu herramienta favorita.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 border-b border-zinc-200 dark:border-slate-800 pb-4">
                  <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                    {bookTitle}
                  </h3>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">{subtitle}</p>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {plannedPages.map((p, idx) => (
                    <div
                      key={p.pageNumber}
                      className="rounded-2xl border border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-950 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                          {p.pageNumber}. {p.title}
                        </span>
                        <p className="text-[11px] text-zinc-600 dark:text-slate-400 line-clamp-2">
                          {p.prompt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(p.prompt);
                            setCopiedIdx(idx);
                            setTimeout(() => setCopiedIdx(null), 1800);
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] font-bold text-zinc-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedIdx === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>Copiar</span>
                        </button>
                        <button
                          type="button"
                          disabled={generatingPromptIdx !== null}
                          onClick={() => handleGeneratePlannedPage(p, idx)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold btn-studio-primary inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {generatingPromptIdx === idx ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>Generar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: PÁGINAS Y LIMPIEZA LINE-ART ==================== */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleUploadImages(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-3xl border-2 border-dashed border-blue-400 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 p-6 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleUploadImages(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />
              <ImagePlus className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                Arrastra tus ilustraciones aquí o haz clic para subir (hasta 60 páginas)
              </p>
              <p className="text-xs text-zinc-600 dark:text-slate-400">
                Compatible con dibujos de ChatGPT, Midjourney, Canva o PNG/JPG escaneados.
              </p>
            </div>

            {pages.length === 0 ? (
              <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-8 text-center space-y-3">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  Todavía no tienes páginas cargadas en tu libro
                </p>
                <p className="text-xs text-zinc-600 dark:text-slate-400">
                  Sube imágenes desde tu dispositivo, genéralas desde el Planificador IA o prueba con
                  las 12 láminas de muestra.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPreviewIdx(idx)}
                    className={`rounded-2xl border-2 p-2.5 bg-white dark:bg-slate-900 cursor-pointer space-y-2 transition-all ${
                      selectedPreviewIdx === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/20'
                        : 'border-zinc-200 dark:border-slate-800 hover:border-zinc-400'
                    }`}
                  >
                    <div className="aspect-[8.5/11] rounded-xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center p-1">
                      <img src={p.imageSrc} alt={p.title} className="w-full h-full object-contain" />
                    </div>
                    <input
                      type="text"
                      value={p.title}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const clone = [...pages];
                        clone[idx] = { ...clone[idx], title: e.target.value };
                        persistPages(clone);
                      }}
                      className="w-full text-[11px] font-bold bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-lg px-2 py-1 text-zinc-900 dark:text-white"
                    />
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-slate-400">
                        Lámina #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => movePage(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Mover arriba"
                          className="p-1 rounded bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePage(idx, 1)}
                          disabled={idx === pages.length - 1}
                          aria-label="Mover abajo"
                          className="p-1 rounded bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePage(idx)}
                          aria-label="Quitar página"
                          className="p-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel derecho: Limpiador Line-Art en vivo */}
          <div className="lg:col-span-5 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-5 space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Limpiador Line-Art 300 DPI</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                Vista en vivo
              </span>
            </div>

            <div className="aspect-[8.5/11] w-full max-w-[300px] mx-auto rounded-2xl bg-white border-2 border-zinc-900 overflow-hidden flex items-center justify-center relative">
              {cleaningPreview && (
                <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              )}
              {cleanedPreviewUrl ? (
                <img
                  src={cleanedPreviewUrl}
                  alt="Vista previa procesada a blanco y negro puro"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs text-zinc-400 p-4 text-center">
                  Selecciona o sube una ilustración para inspeccionar la limpieza en blanco y negro.
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs pt-2 border-t border-zinc-200 dark:border-slate-800">
              <label className="flex items-center justify-between font-bold text-zinc-800 dark:text-slate-200 cursor-pointer">
                <span>Forzar blanco y negro puro (#000 / #FFF)</span>
                <input
                  type="checkbox"
                  checked={lineArt.pureBlackWhite}
                  onChange={(e) => setLineArt({ ...lineArt, pureBlackWhite: e.target.checked })}
                  className="accent-blue-600 w-4 h-4"
                />
              </label>

              {lineArt.pureBlackWhite && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between font-semibold text-zinc-700 dark:text-slate-300">
                      <span>Umbral de contraste (limpia grises)</span>
                      <span>{lineArt.threshold}</span>
                    </div>
                    <input
                      type="range"
                      min={110}
                      max={235}
                      value={lineArt.threshold}
                      onChange={(e) => setLineArt({ ...lineArt, threshold: Number(e.target.value) })}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-zinc-700 dark:text-slate-300 block">
                      Refuerzo de grosor de línea
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 0 as const, label: 'Original' },
                        { val: 1 as const, label: 'Medio (+1)' },
                        { val: 2 as const, label: 'Grueso (+2)' },
                      ].map((b) => (
                        <button
                          key={b.val}
                          type="button"
                          onClick={() => setLineArt({ ...lineArt, boldness: b.val })}
                          className={`py-1.5 rounded-lg border font-bold cursor-pointer ${
                            lineArt.boldness === b.val
                              ? 'bg-zinc-900 dark:bg-blue-600 text-white border-zinc-900'
                              : 'bg-zinc-50 dark:bg-slate-950 text-zinc-700 dark:text-slate-300 border-zinc-200 dark:border-slate-700'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <label className="flex items-center justify-between font-semibold text-zinc-700 dark:text-slate-300 cursor-pointer">
                <span>Marco rectangular limpio KDP</span>
                <input
                  type="checkbox"
                  checked={lineArt.addFrame}
                  onChange={(e) => setLineArt({ ...lineArt, addFrame: e.target.checked })}
                  className="accent-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between font-semibold text-zinc-700 dark:text-slate-300 cursor-pointer">
                <span>Imprimir título debajo de cada lámina</span>
                <input
                  type="checkbox"
                  checked={showTitlesOnPages}
                  onChange={(e) => setShowTitlesOnPages(e.target.checked)}
                  className="accent-blue-600 w-4 h-4"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('interior')}
              className="w-full py-3 rounded-xl text-xs font-bold btn-studio-primary cursor-pointer"
            >
              Continuar al Paso 3: Exportar Interior PDF →
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: INTERIOR PDF KDP ==================== */}
      {activeTab === 'interior' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-5">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              Configuración del Manuscrito Interior (300 DPI)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Título en portada interior
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Autor o sello editorial
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                Tamaño de recorte (Trim Size)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(KDP_TRIM_SPECS).map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setTrimSize(spec.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      trimSize === spec.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40'
                        : 'border-zinc-200 dark:border-slate-800 bg-zinc-50 dark:bg-slate-950'
                    }`}
                  >
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                      {spec.label}
                    </span>
                    <span className="text-[11px] text-zinc-600 dark:text-slate-400 block mt-0.5">
                      {spec.widthPx300} × {spec.heightPx300} px a 300 DPI
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-slate-800 text-xs">
              <label className="flex items-center justify-between gap-3 font-semibold text-zinc-800 dark:text-slate-200 cursor-pointer">
                <span>Insertar reverso en blanco detrás de cada dibujo (anti-traspaso de plumones)</span>
                <input
                  type="checkbox"
                  checked={includeBlankVerso}
                  onChange={(e) => setIncludeBlankVerso(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between gap-3 font-semibold text-zinc-800 dark:text-slate-200 cursor-pointer">
                <span>Incluir página &quot;Este libro para colorear pertenece a...&quot;</span>
                <input
                  type="checkbox"
                  checked={includeBelongsToPage}
                  onChange={(e) => setIncludeBelongsToPage(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between gap-3 font-semibold text-zinc-800 dark:text-slate-200 cursor-pointer">
                <span>Incluir página de Derechos de Autor y nota editorial</span>
                <input
                  type="checkbox"
                  checked={includeCopyrightPage}
                  onChange={(e) => setIncludeCopyrightPage(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between gap-3 font-semibold text-zinc-800 dark:text-slate-200 cursor-pointer">
                <span>Añadir sangrado exterior KDP (Bleed +0.125&quot;)</span>
                <input
                  type="checkbox"
                  checked={includeBleed}
                  onChange={(e) => setIncludeBleed(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between gap-3 font-semibold text-zinc-800 dark:text-slate-200 cursor-pointer">
                <span>Nota transparente de asistencia digital / IA en página legal</span>
                <input
                  type="checkbox"
                  checked={aiDisclosureNote}
                  onChange={(e) => setAiDisclosureNote(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 shrink-0"
                />
              </label>
            </div>
          </div>

          {/* Resumen técnico y descarga */}
          <div className="lg:col-span-5 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-5">
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Resumen listo para Amazon KDP</span>
            </h3>

            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-slate-800">
                <dt className="text-zinc-500 dark:text-slate-400">Ilustraciones activas</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">{pages.length} dibujos</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-slate-800">
                <dt className="text-zinc-500 dark:text-slate-400">Total de páginas del PDF</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">
                  {estimatedInteriorPages} páginas (mín. KDP: 24)
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-slate-800">
                <dt className="text-zinc-500 dark:text-slate-400">Resolución de exportación</dt>
                <dd className="font-bold text-emerald-700 dark:text-emerald-400">300 DPI reales</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-slate-800">
                <dt className="text-zinc-500 dark:text-slate-400">Tamaño final con sangrado</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">
                  {(KDP_TRIM_SPECS[trimSize].widthIn + (includeBleed ? 0.125 : 0)).toFixed(3)}&quot; ×{' '}
                  {(KDP_TRIM_SPECS[trimSize].heightIn + (includeBleed ? 0.25 : 0)).toFixed(3)}&quot;
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-zinc-500 dark:text-slate-400">Grosor estimado del lomo</dt>
                <dd className="font-bold text-blue-700 dark:text-blue-400">
                  {spineDims.spineWidthIn}&quot; ({spineDims.spineWidthMm} mm)
                </dd>
              </div>
            </dl>

            {buildProgress && (
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3.5 py-2.5 text-xs font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{buildProgress}</span>
              </div>
            )}

            <button
              type="button"
              disabled={buildingPdf || pages.length === 0}
              onClick={handleExportInteriorPdf}
              className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {buildingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {buildingPdf ? 'Compilando PDF 300 DPI...' : 'Descargar Interior PDF para KDP'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cover')}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold btn-studio-sun cursor-pointer"
            >
              Ir al Paso 4: Generar Portada Full-Wrap →
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: PORTADA Y LOMO KDP ==================== */}
      {activeTab === 'cover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              Calculadora de Lomo y Portada KDP
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Tipo de papel KDP
                </label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value as 'white' | 'cream')}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3 py-2 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="white">Papel Blanco (0.002252&quot;/pág)</option>
                  <option value="cream">Papel Crema (0.0025&quot;/pág)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Páginas interiores
                </label>
                <div className="rounded-xl border border-zinc-200 dark:border-slate-800 bg-zinc-100 dark:bg-slate-950 px-3 py-2 text-xs font-bold text-zinc-900 dark:text-white">
                  {estimatedInteriorPages} pág.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Color principal
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-2.5 py-1.5">
                  <input
                    type="color"
                    value={coverBgHex}
                    onChange={(e) => setCoverBgHex(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-zinc-800 dark:text-slate-200">
                    {coverBgHex}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Color de banda título
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-2.5 py-1.5">
                  <input
                    type="color"
                    value={coverAccentHex}
                    onChange={(e) => setCoverAccentHex(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-zinc-800 dark:text-slate-200">
                    {coverAccentHex}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                Texto de contraportada
              </label>
              <textarea
                rows={4}
                value={backBlurb}
                onChange={(e) => setBackBlurb(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 p-3 text-xs text-zinc-900 dark:text-white"
              />
            </div>

            {pages.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 dark:text-slate-200 block">
                  Ilustración destacada en portada
                </label>
                <select
                  value={coverArtIndex}
                  onChange={(e) => setCoverArtIndex(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3 py-2 text-xs text-zinc-900 dark:text-white"
                >
                  {pages.map((p, idx) => (
                    <option key={p.id} value={idx}>
                      Lámina #{idx + 1}: {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              disabled={buildingCover}
              onClick={handleExportCoverPdf}
              className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {buildingCover ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{buildingCover ? 'Generando Portada PDF...' : 'Descargar Portada Full-Wrap PDF'}</span>
            </button>
          </div>

          {/* Vista previa visual del Full Wrap */}
          <div className="lg:col-span-7 sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                Medidas exactas de portada completa (Full-Wrap)
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                {spineDims.fullWidthIn}&quot; × {spineDims.fullHeightIn}&quot;
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-3">
                <span className="text-[11px] text-zinc-500 dark:text-slate-400 block">Ancho Total</span>
                <strong className="text-sm text-zinc-900 dark:text-white">{spineDims.fullWidthIn}&quot;</strong>
              </div>
              <div className="rounded-xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-3">
                <span className="text-[11px] text-zinc-500 dark:text-slate-400 block">Alto Total</span>
                <strong className="text-sm text-zinc-900 dark:text-white">{spineDims.fullHeightIn}&quot;</strong>
              </div>
              <div className="rounded-xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-3">
                <span className="text-[11px] text-zinc-500 dark:text-slate-400 block">Lomo Exacto</span>
                <strong className="text-sm text-blue-700 dark:text-blue-400">
                  {spineDims.spineWidthMm} mm
                </strong>
              </div>
              <div className="rounded-xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-3">
                <span className="text-[11px] text-zinc-500 dark:text-slate-400 block">Píxeles 300 DPI</span>
                <strong className="text-xs text-zinc-900 dark:text-white">
                  {spineDims.fullWidthPx300}×{spineDims.fullHeightPx300}
                </strong>
              </div>
            </div>

            {/* Esquema visual Contraportada | Lomo | Portada */}
            <div
              className="rounded-2xl p-4 border-2 border-dashed border-rose-400 dark:border-rose-700 grid grid-cols-11 gap-2 min-h-[290px]"
              style={{ backgroundColor: coverBgHex }}
            >
              {/* Contraportada */}
              <div className="col-span-5 rounded-xl bg-white/95 p-3.5 flex flex-col justify-between text-zinc-900 border border-zinc-900/20">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Contraportada
                  </span>
                  <p className="text-[11px] leading-relaxed text-zinc-700 line-clamp-6">
                    {backBlurb}
                  </p>
                </div>
                <div className="ml-auto w-24 h-12 rounded border border-dashed border-zinc-400 bg-zinc-50 flex items-center justify-center text-[9px] text-zinc-500 font-semibold">
                  Zona ISBN KDP
                </div>
              </div>

              {/* Lomo */}
              <div className="col-span-1 rounded-lg bg-black/20 border border-white/25 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white/90 [writing-mode:vertical-rl] rotate-180">
                  Lomo {spineDims.spineWidthMm}mm
                </span>
              </div>

              {/* Portada */}
              <div className="col-span-5 rounded-xl p-3 flex flex-col justify-between gap-2 border border-white/20 bg-black/10">
                <div
                  className="rounded-lg p-2 text-center border border-zinc-900"
                  style={{ backgroundColor: coverAccentHex }}
                >
                  <p className="font-display font-bold text-xs text-zinc-950 leading-tight line-clamp-2">
                    {bookTitle}
                  </p>
                  <p className="text-[9px] text-zinc-800 truncate mt-0.5">{subtitle}</p>
                </div>

                <div className="flex-1 rounded-lg bg-white border border-zinc-900 p-1.5 flex items-center justify-center overflow-hidden">
                  <img
                    src={pages[coverArtIndex]?.imageSrc || svgToDataUrl(COLORING_SHEETS[3].svg)}
                    alt="Ilustración de portada"
                    className="max-h-36 w-auto object-contain"
                  />
                </div>

                <p className="text-center text-[10px] font-bold text-white truncate">{authorName}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-slate-400 leading-relaxed">
              El borde punteado rojo representa el sangrado exterior de 0.125&quot;.{' '}
              {spineDims.spineTextAllowed
                ? 'Tu libro supera 79 páginas: Amazon KDP permite imprimir texto sobre el lomo.'
                : 'Nota KDP: Amazon solo permite texto impreso en el lomo a partir de 79 páginas; por debajo de ese total el lomo debe ir limpio (sin texto).'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

