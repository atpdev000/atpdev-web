"use client";

import React, { useState, useEffect } from 'react';
import { 
  Disc, 
  RotateCcw, 
  Share2, 
  Trophy, 
  Plus, 
  Trash2, 
  Tv,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { RouletteCanvas } from '@/components/RouletteCanvas';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import ConfettiEffect from '@/components/ConfettiEffect';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { ExportResultHub } from '@/components/ExportResultHub';
import { isAudioMuted, toggleAudioMute, playCardFlip } from '@/lib/soundEffects';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';
import { ListFileImporter } from '@/components/ListFileImporter';

const DEFAULT_OPTIONS = [
  'Premio Mayor 🎁',
  'Descuento 20% 🏷️',
  'Intenta de nuevo 🔄',
  'Camiseta Oficial 👕',
  'Envío Gratis 📦',
  'Tarjeta Regalo 💳',
  'Sigue participando ✨',
  'Cena Doble 🍕',
];

export default function RuletaPage() {
  const { t } = useLanguage();
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [newOption, setNewOption] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());

    // Cargar nombres importados desde Trivia u otras herramientas si existen
    try {
      const stored = localStorage.getItem('sorteo_imported_names');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setOptions(parsed);
        }
      }
    } catch (e) {
      console.error('Error al cargar opciones importadas en ruleta:', e);
    }
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

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      alert('La ruleta necesita al menos 2 opciones para girar.');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const setPreset = (presetOptions: string[]) => {
    setOptions(presetOptions);
    setWinner(null);
  };

  const handleWinnerSelected = (selected: string) => {
    setWinner(selected);
  };

  const handleImportOptions = (newOptions: string[], mode: 'replace' | 'append') => {
    if (mode === 'append') {
      setOptions((prev) => Array.from(new Set([...prev, ...newOptions])));
    } else {
      setOptions(newOptions.length >= 2 ? newOptions : [...newOptions, 'Opción 2']);
    }
    setWinner(null);
    playCardFlip();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />
      <ConfettiEffect active={winner !== null && !isSpinning} />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Disc className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          {t('roulette_title')}
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          {t('roulette_desc')}
        </p>

        {/* Small Audio & Screen Controls */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-pink-600 dark:text-pink-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-pink-700 dark:text-purple-300 border border-pink-200 dark:border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t('btn_export')}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLiveStream(true)}
            className="py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-pink-700 dark:text-purple-300 border border-pink-200 dark:border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{t('btn_live_mode')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Roulette Wheel Canvas */}
        <div className="interactive-card lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative">
          {winner && (
            <div className="w-full mb-6 p-4 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-center space-y-1 animate-in fade-in duration-200">
              <span className="text-xs font-bold uppercase text-pink-600 dark:text-pink-400 tracking-wider flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" /> {t('roulette_winner')}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {winner}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <ExportResultHub
                  variant="draw-list"
                  title="Sorteo de Ruleta Aleatoria"
                  winners={[winner]}
                  substitutes={[]}
                  totalParticipants={options.length}
                  buttonText="Exportar Resultado (PDF, Word, Excel, Imagen)"
                />
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/40 text-xs font-semibold text-pink-700 dark:text-pink-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Tarjeta Video</span>
                </button>
              </div>
            </div>
          )}

          <RouletteCanvas
            options={options}
            onWinnerSelected={handleWinnerSelected}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
        </div>

        {/* Right: Options Manager & Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="interactive-card bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">{t('options_config_title')}</h2>
              <button
                type="button"
                onClick={() => setOptions([])}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-white/5 dark:hover:bg-rose-950/30 text-slate-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300 text-xs font-bold border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Limpiar todas las opciones"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{t('quick_presets_label')}</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreset(['Sí ✅', 'No ❌', 'Tal vez 🤔'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 dark:hover:text-pink-400 border border-slate-200 dark:border-white/10 transition-colors font-medium cursor-pointer"
                >
                  Sí / No
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 dark:hover:text-pink-400 border border-slate-200 dark:border-white/10 transition-colors font-medium cursor-pointer"
                >
                  Números 1-10
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(['Pizza 🍕', 'Hamburguesa 🍔', 'Sushi 🍣', 'Tacos 🌮', 'Ensalada 🥗'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 dark:hover:text-pink-400 border border-slate-200 dark:border-white/10 transition-colors font-medium cursor-pointer"
                >
                  Comida
                </button>
              </div>
            </div>

            {/* Add Option Form */}
            <form onSubmit={handleAddOption} className="flex gap-2">
              <label htmlFor="new-option-input" className="sr-only">
                Escribe una nueva opción para la ruleta
              </label>
              <input
                id="new-option-input"
                name="newOption"
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder={t('roulette_placeholder')}
                aria-label={t('roulette_placeholder')}
                className="flex-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#d91a7a] dark:focus:border-purple-500 focus:ring-2 focus:ring-pink-50 dark:focus:ring-purple-900/30"
              />
              <button
                type="submit"
                disabled={!newOption.trim() || isSpinning}
                aria-label="Agregar opción a la ruleta"
                className="p-2.5 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] disabled:opacity-50 text-white font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>

            {/* Options List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-zinc-200"
                >
                  <span className="font-semibold truncate pr-2">{opt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    disabled={isSpinning}
                    aria-label={`Eliminar opción ${opt}`}
                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
              <span>{options.length} opciones en ruleta</span>
              <button
                type="button"
                onClick={() => setWinner(null)}
                className="hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Ganador</span>
              </button>
            </div>

            {/* Subida Universal: Word, Excel, PDF, CSV, TXT e Imagen OCR */}
            <ListFileImporter onImport={handleImportOptions} currentCount={options.length} />
          </div>
        </div>
      </div>

      {/* Live Stream Stage Modal */}
      <LiveStreamStage
        isOpen={showLiveStream}
        onClose={() => setShowLiveStream(false)}
        title="Ruleta de la Suerte Digital"
        winner={winner || options[0] || 'Premio de Ruleta'}
        platform="Ruleta Sorteos Pro"
      />

      {/* Story / Post Export Modal */}
      <WinnerExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        winnerName={winner || options[0] || 'Premio de Ruleta'}
        drawTitle="Ruleta de la Suerte"
        platform="Ruleta Digital"
      />

      {/* AdSense Ad Placement */}
      <div className="pt-6">
        <AdBanner format="horizontal" />
      </div>
    </div>
  );
}
