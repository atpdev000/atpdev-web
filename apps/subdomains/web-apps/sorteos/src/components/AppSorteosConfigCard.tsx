"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Users, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Edit3, 
  Check, 
  Upload, 
  HelpCircle, 
  Star,
  Hash,
  AtSign,
  UserX,
  Gift,
  Flame,
  Disc,
  Layers,
  CircleDot
} from 'lucide-react';
import { SocialNetwork, GiveawayRules } from '@/lib/types';
import { playCountdownTick, isAudioMuted, toggleAudioMute } from '@/lib/soundEffects';

export interface AppSorteosConfigCardProps {
  network: SocialNetwork;
  authorName?: string;
  authorHandle?: string;
  giveawayTitle: string;
  onUpdateTitle: (title: string) => void;
  rules: GiveawayRules;
  onChangeRules: (rules: GiveawayRules) => void;
  eligibleCount: number;
  totalCommentsCount: number;
  onExecute: () => void;
  isDrawing: boolean;
  onBack: () => void;
}

export const COLOR_PALETTES = [
  { id: 'magenta', hex: '#d91a7a', label: 'Magenta AppSorteos', bgClass: 'from-[#d91a7a] to-[#a8145f]' },
  { id: 'crimson', hex: '#dc2626', label: 'Rojo Carmesí', bgClass: 'from-red-600 to-rose-700' },
  { id: 'purple', hex: '#7c3aed', label: 'Púrpura Neón', bgClass: 'from-purple-600 to-indigo-700' },
  { id: 'darkviolet', hex: '#4c1d95', label: 'Violeta Profundo', bgClass: 'from-violet-900 to-purple-950' },
  { id: 'blue', hex: '#2563eb', label: 'Azul Eléctrico', bgClass: 'from-blue-600 to-sky-700' },
  { id: 'cyan', hex: '#0284c7', label: 'Cyan Océano', bgClass: 'from-cyan-600 to-blue-700' },
  { id: 'slate', hex: '#475569', label: 'Gris Pizarra', bgClass: 'from-slate-600 to-zinc-700' },
  { id: 'orange', hex: '#ea580c', label: 'Naranja Fuego', bgClass: 'from-orange-600 to-amber-600' },
  { id: 'emerald', hex: '#059669', label: 'Verde Esmeralda', bgClass: 'from-emerald-600 to-teal-700' },
  { id: 'lime', hex: '#65a30d', label: 'Verde Lima', bgClass: 'from-lime-600 to-green-700' },
  { id: 'gold', hex: '#d97706', label: 'Dorado Premium', bgClass: 'from-amber-600 to-yellow-600' }
];

export const AppSorteosConfigCard: React.FC<AppSorteosConfigCardProps> = ({
  network,
  authorName = 'Creador Oficial',
  authorHandle = '',
  giveawayTitle,
  onUpdateTitle,
  rules,
  onChangeRules,
  eligibleCount,
  totalCommentsCount,
  onExecute,
  isDrawing,
  onBack
}) => {
  // Editing Title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(giveawayTitle);

  // Branding States
  const [selectedColor, setSelectedColor] = useState<string>(rules.themeColor || '#d91a7a');
  const [customLogo, setCustomLogo] = useState<string | null>(rules.customLogoUrl || null);
  const [animationType, setAnimationType] = useState<'countdown' | 'wheel' | 'card' | 'lottery'>(
    rules.animationType || 'countdown'
  );

  // Audio State
  const [muted, setMuted] = useState(false);

  // Advanced Filter Toggles
  const [hasMinMentions, setHasMinMentions] = useState(rules.minMentions > 0);
  const [hasHashtag, setHasHashtag] = useState(Boolean(rules.requiredHashtag));
  const [hasRequiredMention, setHasRequiredMention] = useState(Boolean(rules.requiredMention));
  const [hasBonusChances, setHasBonusChances] = useState(Boolean(rules.bonusChances));
  const [hasExcludeBlocked, setHasExcludeBlocked] = useState(rules.blockedUsers.length > 0);
  const [blockedInput, setBlockedInput] = useState(rules.blockedUsers.join(', '));

  // Prizes Toggle
  const [hasPrizes, setHasPrizes] = useState(Boolean(rules.hasPrizes));
  const [prizesList, setPrizesList] = useState<string[]>(
    rules.prizes && rules.prizes.length > 0 ? rules.prizes : ['Premio Principal #1']
  );

  // Phone Preview Animation Cycle
  const [previewNumber, setPreviewNumber] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FAQ Modal Toggle
  const [showFaqModal, setShowFaqModal] = useState(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  // Update temp title when prop changes
  useEffect(() => {
    setTempTitle(giveawayTitle);
  }, [giveawayTitle]);

  // Sync selectedColor with rules.themeColor
  useEffect(() => {
    if (rules.themeColor) {
      setSelectedColor(rules.themeColor);
    }
  }, [rules.themeColor]);

  // Animated countdown preview cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewNumber((prev) => (prev > 1 ? prev - 1 : 3));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const activePalette = COLOR_PALETTES.find((c) => c.hex === selectedColor) || COLOR_PALETTES[0];

  const handleToggleMute = () => {
    const next = toggleAudioMute();
    setMuted(next);
    if (!next) {
      playCountdownTick(false);
    }
  };

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    onChangeRules({
      ...rules,
      themeColor: hex
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomLogo(reader.result);
        onChangeRules({
          ...rules,
          customLogoUrl: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateWinners = (delta: number) => {
    const nextVal = Math.max(1, Math.min(50, rules.winnersCount + delta));
    const nextPrizes = [...prizesList];
    while (nextPrizes.length < nextVal) {
      nextPrizes.push(`Premio #${nextPrizes.length + 1}`);
    }
    setPrizesList(nextPrizes);
    onChangeRules({
      ...rules,
      winnersCount: nextVal,
      prizes: nextPrizes
    });
  };

  const handleUpdateSubstitutes = (delta: number) => {
    const nextVal = Math.max(0, Math.min(20, rules.substitutesCount + delta));
    onChangeRules({
      ...rules,
      substitutesCount: nextVal
    });
  };

  const handleToggleDuplicates = () => {
    const next = !rules.excludeDuplicates;
    onChangeRules({
      ...rules,
      excludeDuplicates: next
    });
  };

  const handleTogglePrizes = () => {
    const next = !hasPrizes;
    setHasPrizes(next);
    onChangeRules({
      ...rules,
      hasPrizes: next,
      prizes: next ? prizesList : []
    });
  };

  const handlePrizeNameChange = (index: number, val: string) => {
    const updated = [...prizesList];
    updated[index] = val;
    setPrizesList(updated);
    onChangeRules({
      ...rules,
      prizes: updated
    });
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ─── 1. HEADER CON AVATAR & TÍTULO EDITABLE (Screenshot 2 Top) ─────── */}
      <div className="text-center space-y-3">
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 shadow-lg">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-black text-white font-display overflow-hidden">
              {authorName.charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
            {network.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-pink-500 text-slate-900 dark:text-white font-bold text-center text-lg focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white cursor-pointer transition-colors"
                title="Guardar título"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                {giveawayTitle || `Sorteo de @${(authorName || 'Creador Oficial').replace(/^@+/, '')}`}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                title="Editar nombre del sorteo"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">
          {eligibleCount} participantes listos de {totalCommentsCount} comentarios cargados
        </p>
      </div>

      {/* ─── 2. TARJETA PRINCIPAL DE CONFIGURACIÓN (Estilo AppSorteos) ────────── */}
      <div 
        className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-10 text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 transition-all duration-300"
      >
        {/* Ganadores Stepper */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-base sm:text-lg font-black font-display tracking-wide block text-slate-900 dark:text-white">
              Ganadores
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Número de ganadores principales
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-full p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              type="button"
              onClick={() => handleUpdateWinners(-1)}
              disabled={rules.winnersCount <= 1}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center font-black text-xl hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-sm"
              aria-label="Disminuir ganadores"
            >
              −
            </button>
            <span className="w-8 text-center font-black font-display text-2xl text-slate-900 dark:text-white select-none">
              {rules.winnersCount}
            </span>
            <button
              type="button"
              onClick={() => handleUpdateWinners(1)}
              disabled={rules.winnersCount >= 50}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center font-black text-xl hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-sm"
              aria-label="Aumentar ganadores"
            >
              +
            </button>
          </div>
        </div>

        {/* Suplentes Stepper */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="max-w-xs sm:max-w-md">
            <span className="text-base sm:text-lg font-black font-display tracking-wide block text-slate-900 dark:text-white">
              Suplentes
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Evita repetir el sorteo si un ganador no cumple las reglas.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-full p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <button
              type="button"
              onClick={() => handleUpdateSubstitutes(-1)}
              disabled={rules.substitutesCount <= 0}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center font-black text-xl hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-sm"
              aria-label="Disminuir suplentes"
            >
              −
            </button>
            <span className="w-8 text-center font-black font-display text-2xl text-slate-900 dark:text-white select-none">
              {rules.substitutesCount}
            </span>
            <button
              type="button"
              onClick={() => handleUpdateSubstitutes(1)}
              disabled={rules.substitutesCount >= 20}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center font-black text-xl hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-sm"
              aria-label="Aumentar suplentes"
            >
              +
            </button>
          </div>
        </div>

        {/* Filtrar Duplicados ⭐ Toggle */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black font-display tracking-wide text-slate-900 dark:text-white">
                Filtrar Duplicados
              </span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Permitir una sola participación por persona.
            </p>
          </div>

          {/* iOS Toggle Switch */}
          <button
            type="button"
            onClick={handleToggleDuplicates}
            className={`w-14 h-8 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
              rules.excludeDuplicates ? 'bg-[#d91a7a]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            aria-label="Alternar filtrado de duplicados"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                rules.excludeDuplicates ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Premios Toggle */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-base sm:text-lg font-black font-display tracking-wide block text-slate-900 dark:text-white">
                Premios
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ¿Quieres definir premios para cada ganador?
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePrizes}
              className={`w-14 h-8 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                hasPrizes ? 'bg-[#d91a7a]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Alternar definición de premios"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  hasPrizes ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Lista de premios expandible */}
          {hasPrizes && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Premios asignados a los {rules.winnersCount} ganadores:
              </span>
              <div className="space-y-2">
                {Array.from({ length: rules.winnersCount }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold w-16 text-slate-500">
                      #{idx + 1}:
                    </span>
                    <input
                      type="text"
                      value={prizesList[idx] || `Premio #${idx + 1}`}
                      onChange={(e) => handlePrizeNameChange(idx, e.target.value)}
                      placeholder={`Ej: Gift card $50, Producto, etc.`}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:border-[#d91a7a]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. ELEGIR ANIMACIÓN (Screenshot 3 Phone Mockup) ───────────────── */}
      <div 
        className="rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${selectedColor} 0%, #1e1b4b 160%)`
        }}
      >
        <div className="text-center space-y-2 max-w-md mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            Elegir animación
          </h3>
          <p className="text-xs text-white/80 leading-relaxed font-medium">
            Animaciones únicas que coinciden con tu identidad de marca y hacen que la experiencia de tus clientes sea inolvidable.
          </p>
        </div>

        {/* Animation Mode Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
          {[
            { id: 'countdown' as const, label: 'Cuenta 3D', icon: CircleDot },
            { id: 'wheel' as const, label: 'Ruleta', icon: Disc },
            { id: 'card' as const, label: 'Cartas', icon: Layers },
            { id: 'lottery' as const, label: 'Bolillero', icon: Sparkles }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                setAnimationType(mode.id);
                onChangeRules({ ...rules, animationType: mode.id });
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer font-bold text-xs ${
                animationType === mode.id
                  ? 'bg-white text-slate-900 shadow-lg scale-105 ring-2 ring-white/50'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <mode.icon className="w-5 h-5" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Phone Mockup Interactive Preview (Screenshot 3) */}
        <div className="max-w-[280px] sm:max-w-[310px] mx-auto bg-white rounded-[40px] p-4 shadow-2xl border-4 border-slate-900/10 text-slate-900 relative aspect-[9/16] flex flex-col justify-between overflow-hidden">
          {/* Top Speaker / Dynamic Island */}
          <div className="w-24 h-4 bg-slate-900/10 rounded-full mx-auto" />

          {/* Sound Mute/Unmute Float Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm border border-slate-200"
            title={muted ? "Activar Sonido" : "Silenciar"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-pink-600" />}
          </button>

          {/* Logo or Brand Watermark */}
          <div className="text-center pt-4">
            {customLogo ? (
              <img
                src={customLogo}
                alt="Logo del sorteo"
                className="max-h-10 max-w-[160px] mx-auto object-contain"
              />
            ) : (
              <div className="inline-flex items-center gap-1.5 font-black font-display text-slate-900 text-sm">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>Sorteos Pro</span>
              </div>
            )}
          </div>

          {/* Central Animated Graphic Preview (Adapts to selected animation mode) */}
          {animationType === 'countdown' && (
            <div className="my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* Pulsing Sunburst / Rays */}
                <div 
                  className="absolute inset-0 rounded-full border-4 border-dashed animate-spin-slow opacity-60"
                  style={{ borderColor: selectedColor }}
                />
                
                {/* Outer Glow Ring */}
                <div 
                  className="w-28 h-28 rounded-full border-4 flex items-center justify-center shadow-lg transition-colors"
                  style={{ borderColor: selectedColor, backgroundColor: `${selectedColor}10` }}
                >
                  {/* Inner Number */}
                  <span 
                    className="text-5xl font-black font-display tracking-tight transition-transform scale-110"
                    style={{ color: selectedColor }}
                  >
                    {previewNumber}
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Cuenta Regresiva 3D
              </div>
            </div>
          )}

          {animationType === 'wheel' && (
            <div className="my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* Top Ticker Needle */}
                <div className="absolute -top-2 z-20 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-amber-500 drop-shadow-md" />
                
                {/* Spinning Wheel */}
                <div 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl relative overflow-hidden animate-[spin_4s_linear_infinite]"
                  style={{
                    boxShadow: `0 0 20px ${selectedColor}40`,
                    background: `conic-gradient(
                      ${selectedColor} 0deg 45deg,
                      #f59e0b 45deg 90deg,
                      #8b5cf6 90deg 135deg,
                      #06b6d4 135deg 180deg,
                      ${selectedColor} 180deg 225deg,
                      #ec4899 225deg 270deg,
                      #10b981 270deg 315deg,
                      #3b82f6 315deg 360deg
                    )`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-white/50" />
                    <div className="w-full h-[1px] bg-white/50 rotate-45" />
                    <div className="w-full h-[1px] bg-white/50 rotate-90" />
                    <div className="w-full h-[1px] bg-white/50 rotate-[135deg]" />
                  </div>
                </div>

                {/* Center Hub */}
                <div 
                  className="absolute z-10 w-10 h-10 rounded-full bg-white shadow-md border-2 flex items-center justify-center"
                  style={{ borderColor: selectedColor }}
                >
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                </div>
              </div>

              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Ruleta de la Suerte
              </div>
            </div>
          )}

          {animationType === 'card' && (
            <div className="my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center perspective-500">
                {/* Left Card */}
                <div 
                  className="absolute w-18 h-26 rounded-xl shadow-md border border-white/80 transform -rotate-12 -translate-x-6 transition-all duration-300 flex flex-col items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, #1e1b4b 0%, ${selectedColor} 100%)`,
                  }}
                >
                  <span className="text-lg font-black font-display opacity-40">?</span>
                </div>

                {/* Right Card */}
                <div 
                  className="absolute w-18 h-26 rounded-xl shadow-md border border-white/80 transform rotate-12 translate-x-6 transition-all duration-300 flex flex-col items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${selectedColor} 0%, #1e1b4b 100%)`,
                  }}
                >
                  <span className="text-lg font-black font-display opacity-40">?</span>
                </div>

                {/* Center Card */}
                <div 
                  className="relative z-10 w-20 h-28 rounded-xl shadow-xl border-2 border-amber-300 flex flex-col items-center justify-between p-2 text-white animate-pulse"
                  style={{
                    background: `linear-gradient(135deg, ${selectedColor} 0%, #312e81 100%)`,
                    boxShadow: `0 8px 20px -4px ${selectedColor}60`
                  }}
                >
                  <div className="flex justify-between w-full text-[8px] font-mono text-amber-300">
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                    <Trophy className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-[9px] font-bold font-mono tracking-wider text-amber-200 uppercase">
                    WINNER
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Cartas Misteriosas 3D
              </div>
            </div>
          )}

          {animationType === 'lottery' && (
            <div className="my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* Glass Sphere Container */}
                <div 
                  className="w-30 h-30 rounded-full border-4 border-slate-300/80 relative overflow-hidden shadow-xl flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85), rgba(230,230,245,0.4) 40%, ${selectedColor}25 100%)`,
                    boxShadow: `inset 0 0 15px rgba(255,255,255,0.8), 0 0 20px ${selectedColor}30`
                  }}
                >
                  {/* Highlight */}
                  <div className="absolute top-1.5 left-3 w-8 h-4 bg-white/70 rounded-full transform -rotate-30 blur-[1px]" />

                  {/* Bouncing Balls */}
                  <div className="relative w-22 h-22">
                    <div className="absolute top-1 left-2 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-slate-900 font-bold text-[9px] flex items-center justify-center shadow-md animate-bounce">
                      7
                    </div>
                    <div className="absolute bottom-1.5 left-3 w-7 h-7 rounded-full bg-gradient-to-tr from-pink-600 to-rose-300 text-white font-bold text-[9px] flex items-center justify-center shadow-md animate-pulse">
                      21
                    </div>
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-300 text-white font-bold text-[9px] flex items-center justify-center shadow-md animate-bounce" style={{ animationDelay: '0.2s' }}>
                      58
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-300 text-white font-bold text-[9px] flex items-center justify-center shadow-md animate-pulse" style={{ animationDelay: '0.3s' }}>
                      42
                    </div>
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-lg text-white font-bold text-xs flex items-center justify-center border border-white"
                      style={{ backgroundColor: selectedColor }}
                    >
                      ★
                    </div>
                  </div>
                </div>

                {/* Base Stand */}
                <div className="absolute -bottom-1 w-14 h-2.5 bg-slate-400 rounded-b-md shadow-sm" />
              </div>

              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Bolillero de Lotería
              </div>
            </div>
          )}

          {/* Bottom Phone Bar */}
          <div className="text-center pb-2">
            <span className="text-[10px] font-mono text-slate-400">
              Certificado CSPRNG SHA-256
            </span>
            <div className="w-28 h-1 bg-slate-900/20 rounded-full mx-auto mt-2" />
          </div>
        </div>

        {/* ─── 4. PALETA DE COLORES & LOGO (Screenshot 4 Top) ──────────────── */}
        <div className="pt-4 border-t border-white/20 space-y-4 max-w-xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              Color de Marca del Sorteo
            </span>
            <p className="text-[11px] text-white/70">
              Personaliza el color del escenario, tarjetas y certificados
            </p>
          </div>

          {/* Swatches Grid */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.id}
                type="button"
                onClick={() => handleColorChange(palette.hex)}
                className={`w-10 h-10 rounded-2xl transition-all cursor-pointer relative flex items-center justify-center ${
                  selectedColor === palette.hex
                    ? 'ring-4 ring-white scale-110 shadow-lg'
                    : 'hover:scale-105 opacity-90 hover:opacity-100'
                }`}
                style={{ backgroundColor: palette.hex }}
                title={palette.label}
              >
                {selectedColor === palette.hex && (
                  <Check className="w-5 h-5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>

          {/* Logo Upload Section */}
          <div className="pt-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-sm font-bold">
              <span>Logo</span>
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            </div>
            <p className="text-[11px] text-white/70">
              Tamaño recomendado (180x50px)
            </p>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-white/90 transition-all active:scale-95 cursor-pointer shadow-md inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{customLogo ? 'Cambiar Logo' : 'Subir'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. FILTROS AVANZADOS (Estilo AppSorteos) ────────────────────────── */}
      <div 
        className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-10 text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 transition-all duration-300"
      >
        <div className="text-center space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Filtros avanzados
          </h3>
          <button
            type="button"
            onClick={() => setShowFaqModal(true)}
            className="text-xs text-[#d91a7a] hover:underline transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold"
          >
            <span>¿Alguna duda con los filtros? Haz click aquí</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Mínimo de Menciones Toggle */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-base font-black font-display block text-slate-900 dark:text-white">
                  Mínimo de Menciones
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Exige que cada comentario etiquete a 1 o más amigos
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !hasMinMentions;
                  setHasMinMentions(next);
                  onChangeRules({ ...rules, minMentions: next ? 1 : 0 });
                }}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                  hasMinMentions ? 'bg-[#d91a7a]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Alternar filtro de menciones mínimas"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    hasMinMentions ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasMinMentions && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Cantidad de menciones requeridas:
                </span>
                <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 rounded-xl p-1">
                  {[1, 2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => onChangeRules({ ...rules, minMentions: cnt })}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        rules.minMentions === cnt
                          ? 'bg-[#d91a7a] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtrar por #Hashtag Toggle */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-base font-black font-display block text-slate-900 dark:text-white">
                  Filtrar por #Hashtag
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Válido solo para comentarios que incluyan un hashtag específico
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !hasHashtag;
                  setHasHashtag(next);
                  onChangeRules({ ...rules, requiredHashtag: next ? '#sorteopro' : '' });
                }}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                  hasHashtag ? 'bg-[#d91a7a]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Alternar filtro por hashtag"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    hasHashtag ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasHashtag && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={rules.requiredHashtag || ''}
                  onChange={(e) => onChangeRules({ ...rules, requiredHashtag: e.target.value })}
                  placeholder="Ej: #sorteopro o #aniversario"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:border-[#d91a7a]"
                />
              </div>
            )}
          </div>

          {/* Filtrar por @Mención ⭐ Toggle */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black font-display text-slate-900 dark:text-white">
                    Filtrar por @Mención
                  </span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Exige mencionar a una cuenta obligatoria (ej: patrocinador o marca)
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !hasRequiredMention;
                  setHasRequiredMention(next);
                  onChangeRules({ ...rules, requiredMention: next ? '@atpdev' : '' });
                }}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                  hasRequiredMention ? 'bg-[#d91a7a]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Alternar filtro por mención específica"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    hasRequiredMention ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasRequiredMention && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={rules.requiredMention || ''}
                  onChange={(e) => onChangeRules({ ...rules, requiredMention: e.target.value })}
                  placeholder="Ej: @tu_marca o @patrocinador"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:border-[#d91a7a]"
                />
              </div>
            )}
          </div>

          {/* Bonus & Chances Extra ⭐ Toggle */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black font-display text-slate-900 dark:text-white">
                  Bonus & Chances Extra
                </span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Otorga más probabilidades de ganar a quienes comentaron varias veces
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !hasBonusChances;
                setHasBonusChances(next);
                onChangeRules({ ...rules, bonusChances: next });
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                hasBonusChances ? 'bg-[#d91a7a]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Alternar bonus y chances extra"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  hasBonusChances ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Excluir Participantes ⭐ Toggle */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black font-display text-slate-900 dark:text-white">
                    Excluir Participantes
                  </span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Bloquea cuentas bots, organizadores o ganadores anteriores
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !hasExcludeBlocked;
                  setHasExcludeBlocked(next);
                  onChangeRules({
                    ...rules,
                    blockedUsers: next ? ['bot_spammer_3000'] : []
                  });
                }}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                  hasExcludeBlocked ? 'bg-[#d91a7a]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Alternar exclusión de participantes"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    hasExcludeBlocked ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasExcludeBlocked && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={blockedInput}
                  onChange={(e) => {
                    setBlockedInput(e.target.value);
                    const list = e.target.value
                      .split(/[\s,]+/)
                      .map((u) => u.trim().replace(/^@/, ''))
                      .filter(Boolean);
                    onChangeRules({ ...rules, blockedUsers: list });
                  }}
                  placeholder="Ej: cuenta_bot, usuario_anterior, organizador (separados por coma)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:border-[#d91a7a]"
                />
                <span className="text-[10px] text-slate-400 block">
                  Escribe los usuarios que deseas vetar del sorteo separados por comas.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 6. BOTÓN GIGANTE FINAL DE EJECUCIÓN (Action Footer) ───────────── */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-colors cursor-pointer border border-slate-300 dark:border-white/10"
        >
          Regresar a Comentarios
        </button>

        <button
          type="button"
          disabled={isDrawing || eligibleCount === 0}
          onClick={onExecute}
          className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#d91a7a] hover:bg-[#c2146c] text-white font-black font-display text-lg tracking-wide transition-all shadow-xl shadow-pink-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer flex items-center justify-center gap-3"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span>{isDrawing ? 'Sorteando...' : '¡Comenzar Sorteo!'}</span>
        </button>
      </div>

      {/* Modal Explicativo de Filtros */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <h4 className="text-lg font-bold font-display flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-600" />
              <span>Guía de Filtros de Sorteos Pro</span>
            </h4>
            <div className="text-xs space-y-3 text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
              <p>
                <strong>Filtrar Duplicados:</strong> Deja exactamente 1 participación por persona, sin importar cuántos comentarios haya hecho.
              </p>
              <p>
                <strong>Menciones:</strong> Cuenta los @usuarios dentro de cada comentario. Si exiges 2, los comentarios con solo 1 o 0 menciones serán descartados.
              </p>
              <p>
                <strong>#Hashtag:</strong> Verifica que el texto del comentario contenga el hashtag que definiste.
              </p>
              <p>
                <strong>Excluir:</strong> Bloquea cuentas específicas para que nunca salgan ganadoras (por ejemplo, organizadores o patrocinadores).
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowFaqModal(false)}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
