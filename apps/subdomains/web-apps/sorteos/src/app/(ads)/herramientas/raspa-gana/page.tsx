"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, Volume2, VolumeX, Gift, Check, Palette } from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import ConfettiEffect from '@/components/ConfettiEffect';
import { playCelebrationSound, isAudioMuted, toggleAudioMute } from '@/lib/soundEffects';

const DEFAULT_PRIZES = [
  '🎉 ¡PRIMER PREMIO! $100 USD en efectivo',
  '🎁 Cupón 50% de Descuento Especial',
  '📱 Auriculares Bluetooth Pro',
  '☕ 1 Mes de Suscripción Premium Gratis',
  '🍀 ¡Gracias por participar! Sigue intentando',
  '⭐ Premio Sorpresa: Envío Gratis en tu compra'
];

export default function RaspaGanaPage() {
  const [prizesList, setPrizesList] = useState<string[]>(DEFAULT_PRIZES);
  const [currentPrize, setCurrentPrize] = useState<string>(DEFAULT_PRIZES[0]);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [scratchPercent, setScratchPercent] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);
  const [customPrizeInput, setCustomPrizeInput] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());
    initCanvas();
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset dimensions
    canvas.width = 440;
    canvas.height = 240;

    // Background silver metallic scratch layer
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#94a3b8');
    gradient.addColorStop(0.3, '#cbd5e1');
    gradient.addColorStop(0.5, '#e2e8f0');
    gradient.addColorStop(0.7, '#94a3b8');
    gradient.addColorStop(1, '#64748b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative pattern and text
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.fillText('✨ RASPA AQUÍ CON EL CURSOR O DEDO ✨', canvas.width / 2, 110);
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('¡Descubre tu premio sorpresa!', canvas.width / 2, 140);

    setIsRevealed(false);
    setShowConfetti(false);
    setScratchPercent(0);
  };

  const handleResetCard = () => {
    // Pick random prize from list
    const randomPrize = prizesList[Math.floor(Math.random() * prizesList.length)];
    setCurrentPrize(randomPrize);
    initCanvas();
  };

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentPixels = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparentPixels += 4;
      }

      const percent = Math.min(100, Math.round((transparentPixels / totalPixels) * 100));
      setScratchPercent(percent);

      if (percent >= 45 && !isRevealed) {
        setIsRevealed(true);
        // Clear canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setShowConfetti(true);
        playCelebrationSound();
      }
    } catch {
      // noop
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const handleAddCustomPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrizeInput.trim()) return;
    setPrizesList((prev) => [customPrizeInput.trim(), ...prev]);
    setCustomPrizeInput('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ConfettiEffect active={showConfetti} />
      <ToolSwitcher />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
          <Gift className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Raspa y Gana Virtual
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
          Tarjeta interactiva de rasca y gana para dinámicas digitales, directos en vivo y premios instantáneos.
        </p>

        {/* Audio control */}
        <div className="flex justify-center items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setMuted(toggleAudioMute())}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-pink-600" />}
          </button>
        </div>
      </div>

      {/* Scratch Card Center Area */}
      <div className="max-w-md mx-auto space-y-4">
        {/* The Card Container */}
        <div className="relative w-full aspect-[11/6] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 dark:border-amber-500/40 bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 p-1 flex items-center justify-center select-none">
          {/* Underlying Hidden Prize */}
          <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0f172a] flex flex-col items-center justify-center text-center p-4">
            <Trophy className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
              ¡Resultado Revelado!
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 leading-snug">
              {currentPrize}
            </div>
          </div>

          {/* Canvas Scratch Overlay */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10 transition-opacity"
            style={{ opacity: isRevealed ? 0 : 1, pointerEvents: isRevealed ? 'none' : 'auto' }}
          />
        </div>

        {/* Progress Bar & Actions */}
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-zinc-400 mb-1">
              <span>Raspado:</span>
              <span className="font-bold">{scratchPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-150"
                style={{ width: `${scratchPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetCard}
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-600/20 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nueva Tarjeta</span>
          </button>
        </div>
      </div>

      {/* Prize Configuration */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-600" />
          <span>Configurar Lista de Premios para la Tarjeta</span>
        </h2>

        <form onSubmit={handleAddCustomPrize} className="flex gap-2">
          <input
            type="text"
            value={customPrizeInput}
            onChange={(e) => setCustomPrizeInput(e.target.value)}
            placeholder="Añadir nuevo premio (ej: 1x Camiseta Oficial)..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
          >
            Añadir
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {prizesList.map((p, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-xs text-slate-700 dark:text-zinc-300 flex items-center gap-1.5"
            >
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
