"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  ListOrdered, 
  Trash2, 
  Upload, 
  Settings, 
  Trophy, 
  RotateCcw, 
  Copy, 
  Share2, 
  Tv, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  Check,
  RefreshCw
} from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import ConfettiEffect from '@/components/ConfettiEffect';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { ListFileImporter } from '@/components/ListFileImporter';
import { playWheelTick, playWinnerFanfare } from '@/lib/soundEffects';
import { generateSha256Hash } from '@/lib/randomEngine';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';

export default function SorteoListaPage() {
  const { t } = useLanguage();
  const [title, setTitle] = useState<string>('Sorteo por Nombres al Azar');
  const [rawText, setRawText] = useState<string>(
    'Valeria Gómez\nDiego Martínez\nCamila Rodríguez\nLucas Fernández\nElena Castillo\nJuan Pérez\nDaniela Sánchez\nRoberto Navarro'
  );
  const [winnersCount, setWinnersCount] = useState<number>(1);
  const [substitutesCount, setSubstitutesCount] = useState<number>(2);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [useCountdown, setUseCountdown] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Drawing & Results State
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [auditHash, setAuditHash] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Audio & Fullscreen
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar participantes exportados desde Trivias u otras herramientas
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sorteo_imported_names');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRawText(parsed.join('\n'));
          setTitle('Sorteo Oficial - Aprobados de Trivia');
        }
      }
    } catch (e) {
      console.error('Error al cargar nombres importados:', e);
    }
  }, []);

  // Parse lines into participants
  const getCleanParticipants = (): string[] => {
    let list = rawText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (removeDuplicates) {
      list = Array.from(new Set(list));
    }
    return list;
  };

  const participants = getCleanParticipants();

  const handleImportedNames = (newNames: string[]) => {
    setRawText(newNames.join('\n'));
    playWheelTick();
  };

  const handleToggleSound = () => {
    setMuted(!muted);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleStartDraw = () => {
    if (participants.length === 0) return;
    setWinners([]);
    setSubstitutes([]);
    setAuditHash(null);

    if (useCountdown) {
      setShowCountdown(true);
    } else {
      executeDraw();
    }
  };

  const executeDraw = async () => {
    setShowCountdown(false);
    setIsDrawing(true);

    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selectedWinners = shuffled.slice(0, Math.min(winnersCount, shuffled.length));
    const remaining = shuffled.slice(selectedWinners.length);
    const selectedSubstitutes = remaining.slice(0, Math.min(substitutesCount, remaining.length));

    const timestamp = new Date().toISOString();
    const hash = await generateSha256Hash(`${timestamp}|WINNERS:${selectedWinners.join(',')}|TOTAL:${participants.length}`);

    setWinners(selectedWinners);
    setSubstitutes(selectedSubstitutes);
    setAuditHash(hash);
    setIsDrawing(false);
    playWinnerFanfare();
  };

  const handleCopyWinners = () => {
    const text = `🏆 Ganadores de ${title || 'Sorteo'}:\n${winners.map((w, i) => `${i + 1}. ${w}`).join('\n')}${
      substitutes.length > 0 ? `\n\n👥 Suplentes:\n${substitutes.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : ''
    }\n\nVerificado con Sorteos Pro`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />
      <ConfettiEffect active={winners.length > 0 && !isDrawing} />

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title="Eligiendo Ganadores de la Lista"
        onComplete={executeDraw}
      />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <ListOrdered className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          {t('names_title')}
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          {t('names_desc')}
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
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Form Card (Exact AppSorteos Structure) */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
          {/* Título Input */}
          <div className="space-y-1.5">
            <label htmlFor="draw-title" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
              {t('wizard_campaign_title_label')}
            </label>
            <input
              id="draw-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('names_title_placeholder')}
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#d91a7a] dark:focus:border-purple-500 focus:ring-4 focus:ring-pink-50 dark:focus:ring-purple-900/30 transition-all text-sm shadow-xs"
            />
          </div>

          {/* Participantes Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="participants-text" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                {t('teams_participants_label')}
              </label>
              {participants.length > 0 && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="text-xs text-slate-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('btn_restart')}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                id="participants-text"
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={t('names_participants_placeholder')}
                className="w-full p-4 pb-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#d91a7a] dark:focus:border-purple-500 focus:ring-4 focus:ring-pink-50 dark:focus:ring-purple-900/30 transition-all resize-none text-sm leading-relaxed shadow-xs"
              />
              {/* Bottom right counter */}
              <span className="absolute bottom-3 right-4 text-sm font-semibold text-pink-600 dark:text-pink-400 bg-white/95 dark:bg-[#0f172a]/95 px-1.5 py-0.5 rounded select-none pointer-events-none">
                {participants.length}
              </span>
            </div>

            {/* Opciones Avanzadas Toggle */}
            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{t('options_advanced_toggle')}</span>
              </button>
            </div>

            {/* Subida Universal: Word, Excel, PDF, CSV, TXT e Imagen OCR */}
            <ListFileImporter onImport={handleImportedNames} currentCount={participants.length} />
          </div>

          {/* Opciones Avanzadas (Ganadores, Suplentes, Duplicados) */}
          {showAdvanced && (
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="space-y-1.5">
                <label htmlFor="winners-count" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  {t('wizard_winners_count')}:
                </label>
                <input
                  id="winners-count"
                  type="number"
                  min={1}
                  max={Math.max(1, participants.length)}
                  value={winnersCount}
                  onChange={(e) => setWinnersCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#d91a7a] dark:focus:border-purple-500 focus:ring-2 focus:ring-pink-50 dark:focus:ring-purple-900/30"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="substitutes-count" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  {t('wizard_substitutes_count')}:
                </label>
                <input
                  id="substitutes-count"
                  type="number"
                  min={0}
                  max={Math.max(0, participants.length - winnersCount)}
                  value={substitutesCount}
                  onChange={(e) => setSubstitutesCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#d91a7a] dark:focus:border-purple-500 focus:ring-2 focus:ring-pink-50 dark:focus:ring-purple-900/30"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-[#1e293b] text-pink-600 focus:ring-pink-500"
                  />
                  <span>{t('wizard_exclude_duplicates')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={useCountdown}
                    onChange={(e) => setUseCountdown(e.target.checked)}
                    className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-[#1e293b] text-pink-600 focus:ring-pink-500"
                  />
                  <span>Cuenta regresiva 3D con audio</span>
                </label>
              </div>
            </div>
          )}

          {/* Centered Large Comenzar Button */}
          <div className="pt-4 text-center">
            <button
              type="button"
              disabled={participants.length === 0 || isDrawing}
              onClick={handleStartDraw}
              className="bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg py-3.5 px-12 rounded-xl shadow-md hover:shadow-lg shadow-pink-500/25 transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDrawing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sorteando...</span>
                </>
              ) : (
                <span>{t('btn_start')}</span>
              )}
            </button>
          </div>
        </div>

        {/* Results Card */}
        {winners.length > 0 && (
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 border border-pink-200 dark:border-pink-500/30 shadow-lg space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Trophy Squircle */}
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                ¡Felicidades a los Ganadores!
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                {title} • Sorteo certificado y verificado
              </p>
            </div>

            {/* Winners List */}
            <div className="space-y-2 max-w-md mx-auto text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                🏆 Ganador(es) Titular(es):
              </span>
              <div className="space-y-2">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-pink-50/70 dark:bg-pink-500/10 border border-pink-200/80 dark:border-pink-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white font-display">{winner}</span>
                    </div>
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Substitutes List */}
            {substitutes.length > 0 && (
              <div className="space-y-2 max-w-md mx-auto text-left pt-2 border-t border-slate-100 dark:border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  👥 Suplentes de Reserva:
                </span>
                <div className="space-y-1.5">
                  {substitutes.map((sub, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-700 dark:text-zinc-300 font-semibold">#{index + 1} {sub}</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Suplente</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cryptographic SHA-256 Audit Card */}
            {auditHash && (
              <div className="max-w-md mx-auto p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-zinc-400 break-all text-left">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 block mb-0.5">{t('audit_hash_label')}</span>
                {auditHash}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyWinners}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('btn_copied') : t('btn_copy')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="py-2.5 px-4 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('btn_export')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLiveStream(true)}
                className="py-2.5 px-4 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-pink-700 dark:text-purple-300 border border-pink-200 dark:border-purple-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Tv className="w-4 h-4" />
                <span>{t('btn_live_mode')}</span>
              </button>

              <button
                type="button"
                onClick={handleStartDraw}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('btn_restart')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AdSense Ad Placement */}
      <div className="pt-6">
        <AdBanner format="horizontal" />
      </div>

      {/* Live Stream Stage */}
      {winners.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title={title}
          winner={winners[0]}
          substitutes={substitutes}
          auditHash={auditHash || ''}
          platform="Sorteo por Nombres"
          onReroll={handleStartDraw}
        />
      )}

      {/* Winner Export Modal */}
      {winners.length > 0 && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={winners[0]}
          drawTitle={title}
          auditHash={auditHash || ''}
          platform="Sorteo por Nombres"
        />
      )}
    </div>
  );
}
