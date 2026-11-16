"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dices, RefreshCw, Trophy, Sparkles, Volume2, VolumeX, 
  Maximize2, Minimize2, Share2, Tv 
} from 'lucide-react';
import { rollDice } from '@/lib/randomEngine';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { playDiceSound, playWinnerFanfare, isAudioMuted, toggleAudioMute } from '@/lib/soundEffects';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';

const renderDotsForFace = (val: number) => {
  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 items-center justify-items-center select-none">
      {val === 1 && (
        <div className="col-start-2 row-start-2 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-red-600 shadow-inner" />
      )}
      {val === 2 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 3 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-2 row-start-2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-red-600 shadow-inner" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 4 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 5 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-2 row-start-2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-red-600 shadow-inner" />
          <div className="col-start-1 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 6 && (
        <>
          <div className="col-start-1 row-start-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-1 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-2 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-3 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
        </>
      )}
    </div>
  );
};

interface Dice3DCardProps {
  value: number;
  isRolling: boolean;
  index: number;
}

const Dice3DCard: React.FC<Dice3DCardProps> = ({ value, isRolling, index }) => {
  return (
    <div
      role="img"
      aria-label={`Dado ${index + 1} con valor ${value}`}
      className={`relative select-none transition-all duration-300 ${
        isRolling
          ? 'animate-dice-shake scale-105'
          : 'hover:scale-105 hover:-translate-y-1'
      }`}
    >
      {/* 3D Dice Realistic Body with depth shadows and glossy face */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-slate-50 to-zinc-200 dark:from-white dark:via-zinc-100 dark:to-zinc-200 border-2 border-white/90 shadow-[0_12px_28px_-4px_rgba(0,0,0,0.22),0_4px_10px_-2px_rgba(0,0,0,0.12)] p-3 sm:p-3.5 ring-1 ring-slate-900/10">
        {renderDotsForFace(value)}
      </div>
      {/* Bottom 3D Ground Shadow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 sm:w-18 h-2.5 bg-black/15 dark:bg-black/40 rounded-full blur-[3px] pointer-events-none" />
    </div>
  );
};

export default function DadosPage() {
  const { t } = useLanguage();
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceValues, setDiceValues] = useState<number[]>([3, 4]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [history, setHistory] = useState<{ values: number[]; total: number }[]>([
    { values: [3, 4], total: 7 },
  ]);
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

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();

    // Visual scramble effect while rolling
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 60;
      setDiceValues(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
      if (elapsed >= 700) {
        clearInterval(interval);
      }
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const results = rollDice(diceCount);
      setDiceValues(results);
      const total = results.reduce((a, b) => a + b, 0);
      setHistory((prev) => [{ values: results, total }, ...prev.slice(0, 9)]);
      setIsRolling(false);
      playDiceSound();

      if (results.every((r) => r === 6) || total === diceCount * 6) {
        playWinnerFanfare();
      }
    }, 750);
  };

  const totalSum = diceValues.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Dices className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          {t('dice_title')}
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          {t('dice_desc')}
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
            className="py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{t('btn_live_mode')}</span>
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-10 space-y-6 border border-slate-200 dark:border-white/10 shadow-sm text-center relative overflow-visible">
        {/* Dice Count Selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mr-2">{t('dice_count_label')}</span>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isRolling}
              aria-label={`Seleccionar ${num} ${num === 1 ? 'dado' : 'dados'}`}
              onClick={() => {
                setDiceCount(num);
                setDiceValues(Array.from({ length: num }, () => 1));
              }}
              className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer ${
                diceCount === num
                  ? 'bg-[#d91a7a] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* 3D Dice Display Stage */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-8 px-4 sm:px-8 min-h-[180px] bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
          {diceValues.map((val, idx) => (
            <Dice3DCard
              key={idx}
              value={val}
              isRolling={isRolling}
              index={idx}
            />
          ))}
        </div>

        {/* Total Badge */}
        <div>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 shadow-xs">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">{t('dice_total_sum')}</span>
            <span className="text-4xl font-extrabold font-display text-amber-900 dark:text-amber-300 font-mono-num">
              {totalSum}
            </span>
          </div>
        </div>

        {/* Roll Action Button */}
        <div>
          <button
            type="button"
            disabled={isRolling}
            onClick={handleRoll}
            className="bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 text-white font-bold text-base sm:text-lg py-3.5 px-12 rounded-xl shadow-md hover:shadow-lg shadow-pink-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? t('dice_rolling') : t('dice_btn_roll')}</span>
          </button>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            {t('dice_history')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-zinc-300 flex items-center gap-2"
              >
                <span className="text-pink-600 dark:text-pink-400 font-bold text-sm">{item.total}</span>
                <span className="text-slate-400 dark:text-zinc-500">[{item.values.join(', ')}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AdSense Ad Placement */}
      <div className="pt-6">
        <AdBanner format="horizontal" />
      </div>

      {/* Live Stream Stage */}
      <LiveStreamStage
        isOpen={showLiveStream}
        onClose={() => setShowLiveStream(false)}
        title="Lanzamiento de Dados 3D"
        winner={`Suma Total: ${totalSum} (${diceValues.join(' + ')})`}
        platform="Dados 3D Sorteos Pro"
        onReroll={handleRoll}
      />

      {/* Card Export */}
      <WinnerExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        winnerName={`Suma: ${totalSum} [${diceValues.join(', ')}]`}
        drawTitle="Tirada de Dados 3D"
        platform="Dados Criptográficos"
      />
    </div>
  );
}
