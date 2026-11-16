"use client";

import React, { useState, useEffect } from 'react';
import { 
  Hash, Sparkles, Copy, Check, RefreshCw, Sliders, ShieldCheck, 
  Download, Volume2, VolumeX, Maximize2, Minimize2, Share2, Tv 
} from 'lucide-react';
import { generateNumbers, generateSha256Hash } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { ExportResultHub } from '@/components/ExportResultHub';
import { 
  playBallBounce, playWinnerFanfare, isAudioMuted, toggleAudioMute 
} from '@/lib/soundEffects';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';

const BALL_GRADIENTS = [
  'from-amber-400 via-yellow-500 to-amber-600 text-amber-950 shadow-amber-500/30',
  'from-purple-500 via-violet-600 to-indigo-700 text-white shadow-purple-500/30',
  'from-pink-500 via-rose-500 to-pink-700 text-white shadow-pink-500/30',
  'from-cyan-400 via-sky-500 to-blue-600 text-slate-950 shadow-cyan-500/30',
  'from-emerald-400 via-teal-500 to-emerald-700 text-emerald-950 shadow-emerald-500/30',
  'from-orange-400 via-amber-500 to-red-600 text-white shadow-orange-500/30',
];

export default function NumerosPage() {
  const { t } = useLanguage();
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(5);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [results, setResults] = useState<number[]>([7, 23, 42, 68, 91]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [auditHash, setAuditHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggleSound = () => {
    setMuted(toggleAudioMute());
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleStartDraw = () => {
    setError('');
    if (min >= max) {
      setError('El valor mínimo debe ser estrictamente menor que el valor máximo.');
      return;
    }
    if (!allowDuplicates && quantity > max - min + 1) {
      setError(`No es posible generar ${quantity} números únicos en un rango de ${max - min + 1} valores.`);
      return;
    }

    setShowCountdown(true);
  };

  const executeGeneration = async () => {
    setShowCountdown(false);
    setIsGenerating(true);
    setShowConfetti(false);

    try {
      const nums = generateNumbers(min, max, quantity, allowDuplicates);
      if (sortOrder === 'asc') nums.sort((a, b) => a - b);
      if (sortOrder === 'desc') nums.sort((a, b) => b - a);

      setResults(nums);
      const hash = await generateSha256Hash(`numbers-${min}-${max}-${quantity}-${nums.join(',')}-${Date.now()}`);
      setAuditHash(hash);
      setShowConfetti(true);
      playBallBounce();
      playWinnerFanfare();
    } catch (err: any) {
      setError(err.message || 'Error al generar números');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + results.map((n, i) => `${i + 1},${n}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sorteos_pro_numeros_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyPreset = (pMin: number, pMax: number, pQty: number, pUniq: boolean) => {
    setMin(pMin);
    setMax(pMax);
    setQuantity(pQty);
    setAllowDuplicates(!pUniq);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />
      {showConfetti && <ConfettiEffect />}

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title="Extrayendo Bolas Aleatorias 3D"
        onComplete={executeGeneration}
      />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Hash className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          {t('numbers_title')}
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
          {t('numbers_desc')}
        </p>

        {/* Small Audio & Screen Controls */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-600" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-pink-600" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {results.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('btn_export')}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLiveStream(true)}
                className="py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>{t('btn_live_mode')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Config Card */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{t('options_config_title')}</span>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{t('quick_presets_label')}</span>
            <button
              type="button"
              onClick={() => applyPreset(1, 100, 1, true)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs text-slate-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer"
            >
              1 al 100 (1 ganador)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(1, 50, 6, true)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs text-slate-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer"
            >
              Lotería (6/50)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(1, 75, 5, true)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs text-slate-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer"
            >
              Bingo (75)
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="numero-minimo" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">{t('numbers_min')}:</label>
            <input
              id="numero-minimo"
              name="numeroMinimo"
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50 dark:focus:ring-pink-900/20 transition-colors shadow-xs"
            />
          </div>
          <div>
            <label htmlFor="numero-maximo" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">{t('numbers_max')}:</label>
            <input
              id="numero-maximo"
              name="numeroMaximo"
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50 dark:focus:ring-pink-900/20 transition-colors shadow-xs"
            />
          </div>
          <div>
            <label htmlFor="numero-cantidad" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">{t('numbers_qty')}:</label>
            <input
              id="numero-cantidad"
              name="numeroCantidad"
              type="number"
              min={1}
              max={1000}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50 dark:focus:ring-pink-900/20 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Options Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!allowDuplicates}
              onChange={(e) => setAllowDuplicates(!e.target.checked)}
              className="w-4 h-4 rounded text-pink-600 bg-white dark:bg-[#1e293b] border-slate-300 dark:border-white/20 focus:ring-pink-500"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{t('numbers_duplicates')}</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{t('numbers_sort_order')}:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#d91a7a]"
            >
              <option value="none">{t('numbers_order_none')}</option>
              <option value="asc">{t('numbers_order_asc')}</option>
              <option value="desc">{t('numbers_order_desc')}</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleStartDraw}
            className="bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 text-white font-bold text-base sm:text-lg py-3.5 px-12 rounded-xl shadow-md hover:shadow-lg shadow-pink-500/20 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? t('numbers_generating') : t('numbers_btn_generate')}</span>
          </button>
        </div>
      </div>

      {/* Results Display with 3D Spheres */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Esferas Extraídas ({results.length})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ExportResultHub
                variant="numbers"
                numbers={results}
                min={min}
                max={max}
                auditHash={auditHash}
                buttonText="Exportar Todo (PDF, Word, Excel, Imagen)"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t('btn_copied') : t('btn_copy')}</span>
              </button>
            </div>
          </div>

          {/* 3D Spheres Ball Stage */}
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center py-6 bg-slate-50 dark:bg-[#1e293b]/50 rounded-2xl border border-slate-100 dark:border-white/10">
            {results.map((num, idx) => {
              const gradient = BALL_GRADIENTS[idx % BALL_GRADIENTS.length];
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-center justify-center animate-in zoom-in-75 duration-300"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* 3D Ball Sphere */}
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${gradient} shadow-lg flex items-center justify-center relative p-1 border-2 border-white/60 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all select-none`}
                  >
                    {/* Specular 3D Reflection Highlight */}
                    <div className="absolute top-1.5 left-3 w-6 h-3 rounded-full bg-white/70 blur-[1px] rotate-[-20deg]" />

                    {/* Inner White Ring Center */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 shadow-inner border border-black/5 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-black font-display text-slate-900 font-mono-num tracking-tight">
                        {num}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-2">
                    Bola #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Verification Hash */}
          {auditHash && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">Hash Criptográfico SHA-256:</span>
              </div>
              <span className="text-slate-500 dark:text-zinc-400 break-all">{auditHash}</span>
            </div>
          )}
        </div>
      )}

      {/* AdSense Ad Placement */}
      <div className="pt-6">
        <AdBanner format="horizontal" />
      </div>

      {/* Live Stream Stage */}
      {results.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title="Extracción de Números de Lotería"
          winner={`Números: ${results.slice(0, 5).join(' - ')}${results.length > 5 ? '...' : ''}`}
          auditHash={auditHash}
          platform="Números Criptográficos"
          onReroll={handleStartDraw}
        />
      )}

      {/* Winner Export Modal */}
      {results.length > 0 && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={`Números: ${results.join(' - ')}`}
          drawTitle="Sorteo de Números"
          auditHash={auditHash}
          platform="Lotería de Números"
        />
      )}
    </div>
  );
}
