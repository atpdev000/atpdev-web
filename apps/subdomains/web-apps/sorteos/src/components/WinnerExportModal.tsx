"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Copy, Check, X, Sparkles, Trophy, Share2, Camera, Film, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface WinnerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
  drawTitle?: string;
  auditHash?: string;
  platform?: string;
}

export const WinnerExportModal: React.FC<WinnerExportModalProps> = ({
  isOpen,
  onClose,
  winnerName,
  drawTitle = 'Sorteo Oficial',
  auditHash = 'a1b2c3d4e5f67890123456789abcdef0',
  platform = 'Sorteos Pro'
}) => {
  const { t } = useLanguage();
  const [format, setFormat] = useState<'story' | 'post'>('story');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = format === 'story' ? 1080 : 1080;
    const height = format === 'story' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // Background: Dark luxury galaxy gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#070a12');
    bgGrad.addColorStop(0.3, '#160d2b');
    bgGrad.addColorStop(0.7, '#0d1326');
    bgGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative radial glow in the center
    const radial = ctx.createRadialGradient(width / 2, height / 2 - (format === 'story' ? 100 : 0), 50, width / 2, height / 2, width * 0.7);
    radial.addColorStop(0, 'rgba(139, 92, 246, 0.28)');
    radial.addColorStop(0.5, 'rgba(236, 72, 153, 0.12)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // Decorative stars / sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const seed = 42;
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 197 + seed) % width);
      const sy = ((i * 311 + seed) % height);
      const sr = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer luxury gold/purple border frame
    const pad = 48;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2);

    // Header Badge: "SORTEOS PRO • CERTIFICADO OFICIAL"
    const topY = format === 'story' ? 240 : 160;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 14;
    ctx.fillText('✨ SORTEOS PRO • VERIFICADO 100% ✨', width / 2, topY);
    ctx.restore();

    // Draw Title / Platform
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(drawTitle.toUpperCase(), width / 2, topY + 60);

    // Subtitle
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Plataforma: ${platform}`, width / 2, topY + 105);

    // Center Card for Winner
    const cardW = width - 200;
    const cardH = format === 'story' ? 700 : 440;
    const cardY = format === 'story' ? topY + 220 : topY + 160;
    const cardX = (width - cardW) / 2;

    // Card background
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
    ctx.shadowBlur = 35;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 36);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Trophy icon / crown text
    const centerY = cardY + (format === 'story' ? 140 : 100);
    ctx.font = format === 'story' ? '80px sans-serif' : '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆', width / 2, centerY);

    // "GANADOR OFICIAL" label
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('¡FELICIDADES AL GANADOR!', width / 2, centerY + 65);

    // Winner Name (Large & Glowing)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `900 ${format === 'story' ? '68px' : '56px'} sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 25;
    const maxLen = 22;
    const displayName = winnerName.length > maxLen ? winnerName.substring(0, maxLen) + '...' : winnerName;
    ctx.fillText(displayName, width / 2, centerY + (format === 'story' ? 170 : 145));
    ctx.restore();

    // Verified Stamp in card
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText('✓ Selección Aleatoria Auditada Inmutable', width / 2, centerY + (format === 'story' ? 240 : 205));

    // Footer info
    const footerY = format === 'story' ? height - 320 : height - 170;
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`AUDIT HASH: ${auditHash.slice(0, 36)}...`, width / 2, footerY);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Certificado expedido el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, width / 2, footerY + 40);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('sorteospro.com', width / 2, footerY + 95);
  }, [format, winnerName, drawTitle, auditHash, platform]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawCard, 50);
    }
  }, [isOpen, format, drawCard]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);
    const link = document.createElement('a');
    link.download = `ganador-sorteo-${winnerName.replace(/\s+/g, '-').toLowerCase()}-${format}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setIsGenerating(false);
  };

  const handleDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof window === 'undefined' || !(canvas as any).captureStream || typeof MediaRecorder === 'undefined') {
      alert('Tu navegador no soporta grabación directa de video. Te recomendamos usar Google Chrome o Microsoft Edge.');
      return;
    }

    setIsRecordingVideo(true);
    setVideoProgress(5);

    try {
      const width = format === 'story' ? 720 : 720;
      const height = format === 'story' ? 1280 : 720;
      canvas.width = width;
      canvas.height = height;

      const stream = (canvas as any).captureStream(30);
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2500000 });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.start();

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');

      const totalFrames = 120; // 4 seconds at 30fps
      const confettiParticles: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number }> = [];
      const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#38bdf8', '#fbbf24'];

      for (let i = 0; i < 70; i++) {
        confettiParticles.push({
          x: Math.random() * width,
          y: Math.random() * height - height / 2,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 5 + 3,
          color: colors[i % colors.length],
          size: Math.random() * 8 + 4,
        });
      }

      for (let frame = 0; frame < totalFrames; frame++) {
        setVideoProgress(Math.round(((frame + 1) / totalFrames) * 90));

        // Draw background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#070a12');
        bgGrad.addColorStop(0.3, '#160d2b');
        bgGrad.addColorStop(0.7, '#0d1326');
        bgGrad.addColorStop(1, '#05070d');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const pad = 24;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

        // Header
        const topY = format === 'story' ? 140 : 90;
        ctx.textAlign = 'center';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('✨ SORTEOS PRO • VERIFICADO OFICIAL ✨', width / 2, topY);

        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(drawTitle.toUpperCase().slice(0, 32), width / 2, topY + 40);

        if (frame < 45) {
          // Phase 1: Countdown 3... 2... 1...
          const count = 3 - Math.floor(frame / 15);
          const phaseProgress = (frame % 15) / 15;
          const radius = 60 + phaseProgress * 20;

          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(236, 72, 153, ${1 - phaseProgress})`;
          ctx.lineWidth = 6;
          ctx.stroke();

          ctx.font = 'bold 80px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 30;
          ctx.fillText(String(count), width / 2, height / 2 + 28);
          ctx.restore();

          ctx.font = 'bold 20px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('SORTEANDO GANADOR OFICIAL...', width / 2, height / 2 + 120);
        } else {
          // Phase 2: Winner Reveal with Confetti
          const revealProgress = Math.min(1, (frame - 45) / 15);

          // Update & draw confetti
          for (const p of confettiParticles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y > height) p.y = -10;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
          }

          // Card
          const cardW = width - 80;
          const cardH = format === 'story' ? 480 : 320;
          const cardY = format === 'story' ? topY + 160 : topY + 110;
          const cardX = (width - cardW) / 2;

          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
          ctx.shadowBlur = 25 * revealProgress;
          ctx.beginPath();
          ctx.roundRect(cardX, cardY, cardW, cardH, 24);
          ctx.fill();
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();

          // Trophy
          const centerY = cardY + (format === 'story' ? 100 : 70);
          ctx.font = format === 'story' ? '60px sans-serif' : '48px sans-serif';
          ctx.fillText('🏆', width / 2, centerY);

          ctx.font = 'bold 20px sans-serif';
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('¡FELICIDADES AL GANADOR!', width / 2, centerY + 45);

          // Winner name
          ctx.save();
          ctx.font = `900 ${format === 'story' ? '46px' : '36px'} sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 20;
          const maxLen = 22;
          const displayName = winnerName.length > maxLen ? winnerName.substring(0, maxLen) + '...' : winnerName;
          ctx.fillText(displayName, width / 2, centerY + (format === 'story' ? 120 : 100));
          ctx.restore();

          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('✓ Selección Aleatoria Auditada Inmutable', width / 2, centerY + (format === 'story' ? 175 : 145));

          const footerY = format === 'story' ? height - 160 : height - 80;
          ctx.font = 'bold 15px monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`AUDIT: ${auditHash.slice(0, 24)}...`, width / 2, footerY);

          ctx.font = 'bold 18px sans-serif';
          ctx.fillStyle = '#a855f7';
          ctx.fillText('sorteospro.com', width / 2, footerY + 30);
        }

        // Wait 33ms per frame (~30fps)
        await new Promise((r) => setTimeout(r, 33));
      }

      setVideoProgress(95);

      await new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sorteo-animado-${winnerName.replace(/\s+/g, '-').toLowerCase()}-${format}.webm`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 10000);
          resolve();
        };
        recorder.stop();
      });

      setVideoProgress(100);
    } catch (err: any) {
      alert(`Error al generar video: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsRecordingVideo(false);
      setVideoProgress(0);
      drawCard();
    }
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.clipboard) return;
    try {
      setIsGenerating(true);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          alert('No se pudo copiar directo. Utiliza el botón de Descargar.');
        } finally {
          setIsGenerating(false);
        }
      });
    } catch {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-3xl max-w-2xl w-full border border-white/20 p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Compartir en Redes Sociales</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Tarjeta y Video Oficial del Ganador
          </h2>
          <p className="text-sm text-zinc-400">
            Descarga una imagen de alta resolución o un video animado listo para publicar en tus historias o feed.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormat('story')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              format === 'story'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/50'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <span>📱 Formato Story (9:16)</span>
          </button>
          <button
            type="button"
            onClick={() => setFormat('post')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              format === 'post'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/50'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <span>🖼️ Formato Post (1:1)</span>
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="flex justify-center items-center bg-black/40 rounded-2xl p-4 border border-white/5 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            className={`rounded-xl shadow-2xl transition-all border border-white/10 max-h-[380px] w-auto object-contain ${
              format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
            }`}
          />
          {isRecordingVideo && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
              <Film className="w-10 h-10 text-purple-400 animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white font-mono">Renderizando video animado ({videoProgress}%)</p>
                <p className="text-xs text-zinc-400 font-mono">Capturando fotogramas con confeti y sello oficial...</p>
              </div>
              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100" 
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={isGenerating || isRecordingVideo}
            onClick={handleDownload}
            className="btn-pro-primary flex-1 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Imagen (PNG)</span>
          </button>

          <button
            type="button"
            disabled={isGenerating || isRecordingVideo}
            onClick={handleDownloadVideo}
            className="py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:opacity-90 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isRecordingVideo ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Grabando ({videoProgress}%)</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>🎬 Video Story (.webm)</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isGenerating || isRecordingVideo}
            onClick={handleCopy}
            className="btn-pro-secondary py-3.5 px-5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('btn_copied') : t('btn_copy')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
