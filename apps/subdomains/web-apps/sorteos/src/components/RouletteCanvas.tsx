"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getSecureRandomInt } from '@/lib/randomEngine';
import { playWheelTick, playWinnerFanfare } from '@/lib/soundEffects';

interface RouletteCanvasProps {
  options: string[];
  onWinnerSelected: (winner: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

// Paleta vibrante y contrastada de 12 colores de alta legibilidad
const PALETTE = [
  '#e11d48', // Carmesí / Rose
  '#8b5cf6', // Violeta Eléctrico
  '#f59e0b', // Ámbar Dorado
  '#059669', // Esmeralda Intenso
  '#0284c7', // Azul Cielo
  '#d946ef', // Fucsia Vibrante
  '#ea580c', // Naranja Mandarina
  '#0d9488', // Verde Azulado / Teal
  '#7c3aed', // Púrpura Profundo
  '#10b981', // Verde Menta
  '#2563eb', // Azul Real
  '#db2777', // Rosa Fuerte
];

export const RouletteCanvas: React.FC<RouletteCanvasProps> = ({
  options,
  onWinnerSelected,
  isSpinning,
  setIsSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotationRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Estados de física de la aguja / flapper
  const flapperAngleRef = useRef<number>(0);
  const lastPegPassedRef = useRef<number>(-1);
  const lastSoundTimeRef = useRef<number>(0);
  const marqueeOffsetRef = useRef<number>(0);
  const winningSectorIndexRef = useRef<number | null>(null);
  const pulseWinnerRef = useRef<number>(0);

  /**
   * Curva de desaceleración física hiperrealista:
   * - Fase 1: Impulso inicial de alta aceleración (human flick).
   * - Fase 2: Giro a máxima velocidad con inercia rotacional.
   * - Fase 3: Resistencia por fricción constante.
   * - Fase 4: Desaceleración dramática y prolongada en los últimos 2.5 segundos,
   *   donde la ruleta pasa clavija por clavija con tensión máxima.
   * - Fase 5: Micro-asentamiento elástico (rebound) al caer en el gajo ganador.
   */
  const dramaticEasing = (p: number): number => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;

    // Lanzamiento inicial con impulso (0.0 a 0.07)
    const tLaunch = 0.07;
    if (p < tLaunch) {
      const launchProgress = p / tLaunch;
      const speedAtLaunch = 5.2 * Math.pow(1 - tLaunch, 4.4);
      return 0.5 * speedAtLaunch * tLaunch * Math.pow(launchProgress, 2);
    }

    // Desaceleración hiperbólica con cola extendida (tensión máxima en el final)
    const tail = Math.pow(1 - p, 4.6);
    let val = 1 - tail;

    // Micro-rebote de asentamiento elástico en los últimos 40ms
    if (p > 0.96) {
      const settleProgress = (p - 0.96) / 0.04;
      const wobble = Math.sin(settleProgress * Math.PI) * 0.0006;
      val += wobble;
    }

    return val;
  };

  /**
   * Dibuja la ruleta completa con calidad Retina 4K, luces de casino,
   * clavijas 3D y aguja mecánica animada con flexión física.
   */
  const drawWheel = useCallback((rotation: number, pointerDeflection: number = 0, isCelebrating: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Soporte Retina HD
    const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;
    const displaySize = 380;
    if (canvas.width !== displaySize * dpr || canvas.height !== displaySize * dpr) {
      canvas.width = displaySize * dpr;
      canvas.height = displaySize * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const size = displaySize;
    const center = size / 2;
    const outerBezelRadius = center - 8;
    const wheelRadius = outerBezelRadius - 16;
    const numOptions = Math.max(options.length, 1);
    const arc = (2 * Math.PI) / numOptions;

    ctx.clearRect(0, 0, size, size);

    // ----------------------------------------------------
    // 1. Bisel Exterior de Casino (Aro Metálico + Luces LED)
    // ----------------------------------------------------
    ctx.save();
    // Sombra proyectada del bisel completo
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;

    // Aro exterior metálico oscuro / amatista
    const rimGrad = ctx.createLinearGradient(0, 0, size, size);
    rimGrad.addColorStop(0, '#1e1035');
    rimGrad.addColorStop(0.5, '#0f172a');
    rimGrad.addColorStop(1, '#2d154d');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(center, center, outerBezelRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Borde biselado dorado
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(center, center, outerBezelRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Luces LED perimetrales animadas (24 bombillas)
    const totalBulbs = 24;
    const bulbRadius = outerBezelRadius - 8;
    for (let b = 0; b < totalBulbs; b++) {
      const bulbAngle = (b * 2 * Math.PI) / totalBulbs;
      const bx = center + Math.cos(bulbAngle) * bulbRadius;
      const by = center + Math.sin(bulbAngle) * bulbRadius;

      // Efecto marquesina giratoria
      const bulbPhase = Math.floor((b + marqueeOffsetRef.current) % 3);
      const isLit = bulbPhase === 0 || isCelebrating;

      ctx.beginPath();
      ctx.arc(bx, by, isLit ? 3.5 : 2.2, 0, 2 * Math.PI);
      ctx.fillStyle = isLit ? '#fbbf24' : '#475569';
      if (isLit) {
        ctx.save();
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fill();
      }
    }

    // ----------------------------------------------------
    // 2. Gajos de la Ruleta (Sectores con relieve 3D)
    // ----------------------------------------------------
    ctx.save();
    options.forEach((opt, index) => {
      const angle = rotation + index * arc;
      const isWinner = isCelebrating && index === winningSectorIndexRef.current;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, wheelRadius, angle, angle + arc);
      ctx.closePath();

      // Gradiente radial para simular volumen y curvatura 3D
      const sectorGrad = ctx.createRadialGradient(center, center, 40, center, center, wheelRadius);
      const baseColor = PALETTE[index % PALETTE.length];
      sectorGrad.addColorStop(0, baseColor);
      sectorGrad.addColorStop(0.85, baseColor);
      sectorGrad.addColorStop(1, '#05070f'); // Oscurecimiento hacia el borde

      ctx.fillStyle = sectorGrad;
      ctx.fill();

      // Borde separador entre gajos (línea cromada sutil)
      ctx.lineWidth = isWinner ? 3.5 : 1.5;
      ctx.strokeStyle = isWinner ? '#fbbf24' : 'rgba(255, 255, 255, 0.35)';
      ctx.stroke();

      // Destello especial para el ganador
      if (isWinner) {
        ctx.save();
        ctx.fillStyle = `rgba(254, 240, 138, ${0.25 + 0.15 * Math.sin(pulseWinnerRef.current)})`;
        ctx.fill();
        ctx.restore();
      }

      // Texto de la opción con tipografía adaptativa
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';

      // Ajustar tamaño de fuente según cantidad de opciones
      let fontSize = 14;
      if (numOptions > 14) fontSize = 10;
      else if (numOptions > 8) fontSize = 12;

      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Truncar con elegancia si excede el espacio disponible
      const maxChars = numOptions > 10 ? 12 : 18;
      const label = opt.length > maxChars ? opt.substring(0, maxChars - 1) + '…' : opt;

      ctx.fillText(label, wheelRadius - 28, fontSize * 0.35);
      ctx.restore();
    });
    ctx.restore();

    // ----------------------------------------------------
    // 3. Clavijas Metálicas Doradas 3D (Pegs) en el perímetro
    // ----------------------------------------------------
    const pegRadius = wheelRadius - 3;
    for (let p = 0; p < numOptions; p++) {
      const pegAngle = rotation + p * arc;
      const px = center + Math.cos(pegAngle) * pegRadius;
      const py = center + Math.sin(pegAngle) * pegRadius;

      // Sombra proyectada de la clavija
      ctx.beginPath();
      ctx.arc(px + 1, py + 1.5, 3.8, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fill();

      // Cuerpo metálico de la clavija
      const pegGrad = ctx.createRadialGradient(px - 1, py - 1, 0.5, px, py, 3.5);
      pegGrad.addColorStop(0, '#ffffff'); // Brillo especular
      pegGrad.addColorStop(0.3, '#fde047'); // Dorado brillante
      pegGrad.addColorStop(0.85, '#d97706'); // Bronce
      pegGrad.addColorStop(1, '#78350f'); // Sombra oscura

      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, 2 * Math.PI);
      ctx.fillStyle = pegGrad;
      ctx.fill();
    }

    // ----------------------------------------------------
    // 4. Eje Central Multicapa (Rodamiento y Domo Cromado)
    // ----------------------------------------------------
    ctx.save();
    // Sombra del eje
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // Aro cromado exterior
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, 2 * Math.PI);
    const hubGrad = ctx.createLinearGradient(center - 32, center - 32, center + 32, center + 32);
    hubGrad.addColorStop(0, '#f8fafc');
    hubGrad.addColorStop(0.5, '#64748b');
    hubGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.restore();

    // Domo central oscuro con logotipo "PRO"
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    const innerHub = ctx.createRadialGradient(center - 6, center - 6, 2, center, center, 24);
    innerHub.addColorStop(0, '#ec4899');
    innerHub.addColorStop(0.6, '#be185d');
    innerHub.addColorStop(1, '#500724');
    ctx.fillStyle = innerHub;
    ctx.fill();
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Insignia central
    ctx.font = '900 11px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PRO', center, center);

    // ----------------------------------------------------
    // 5. Aguja Mecánica / Fieltro Superior (Con flexión física)
    // ----------------------------------------------------
    const pointerPivotX = center;
    const pointerPivotY = 8;

    ctx.save();
    ctx.translate(pointerPivotX, pointerPivotY);
    // Aplicar flexión angular física en función de las clavijas
    ctx.rotate(pointerDeflection);

    // Sombra dinámica de la aguja proyectada sobre la ruleta
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 6;

    // Aguja triangular dorada con punta rubí
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(0, 38); // Llega justo hasta la línea de clavijas
    ctx.closePath();

    const pointerGrad = ctx.createLinearGradient(-16, 0, 16, 38);
    pointerGrad.addColorStop(0, '#fef08a');
    pointerGrad.addColorStop(0.4, '#f59e0b');
    pointerGrad.addColorStop(0.85, '#dc2626');
    pointerGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = pointerGrad;
    ctx.fill();
    ctx.restore();

    // Borde blanco de alto contraste
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(0, 38);
    ctx.closePath();
    ctx.stroke();

    // Remache / Tornillo del pivote de la aguja
    ctx.beginPath();
    ctx.arc(0, 4, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore(); // Fin de la aguja
    ctx.restore(); // Fin de la escala Retina
  }, [options]);

  // Dibujado inicial
  useEffect(() => {
    drawWheel(currentRotationRef.current, 0, false);
  }, [drawWheel, options]);

  /**
   * Giro físico hiperrealista:
   * - 7.5 segundos de duración total con desaceleración dramática
   * - Aguja con detección de colisión peg-por-peg y retroceso elástico
   * - Sonidos sincronizados en milisegundos con cada salto de clavija
   */
  const spin = () => {
    if (isSpinning || options.length === 0) return;
    setIsSpinning(true);
    winningSectorIndexRef.current = null;

    // 1. Selección segura del ganador mediante CSPRNG
    const winnerIndex = getSecureRandomInt(0, options.length - 1);
    const numOptions = options.length;
    const arc = (2 * Math.PI) / numOptions;

    // Colocar el puntero cómodamente dentro del sector ganador (entre 25% y 75% del gajo)
    const inSectorOffset = (0.25 + Math.random() * 0.5) * arc;
    const pointerAngle = (3 * Math.PI) / 2; // 270° (las 12 en punto)

    // Vueltas completas de inercia (entre 7 y 10 vueltas completas para máxima emoción)
    const fullSpins = getSecureRandomInt(7, 10);

    // Calcular rotación objetivo exacta
    const currentRotNormalized = currentRotationRef.current % (2 * Math.PI);
    const targetSectorStart = pointerAngle - winnerIndex * arc - inSectorOffset;
    let deltaAngle = (targetSectorStart - currentRotNormalized) % (2 * Math.PI);
    if (deltaAngle < 0) deltaAngle += 2 * Math.PI;

    const startRotation = currentRotationRef.current;
    const targetRotation = startRotation + fullSpins * 2 * Math.PI + deltaAngle;

    // Duración dramática: 7.5 segundos (7500ms)
    const duration = 7500;
    const startTime = performance.now();

    let lastSnapTimestamp = 0;
    let lastPegIndex = -1;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Desaceleración dramática física
      const easedProgress = dramaticEasing(progress);
      const currentRotation = startRotation + (targetRotation - startRotation) * easedProgress;
      currentRotationRef.current = currentRotation;

      // Animar luces de marquesina alrededor del bisel
      marqueeOffsetRef.current = (marqueeOffsetRef.current + 0.35 * (1 - progress * 0.7)) % 24;

      // ----------------------------------------------------
      // Detección Física de Clavijas y Flexión de la Aguja
      // ----------------------------------------------------
      const normalizedRot = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const relativeToPointer = (pointerAngle - normalizedRot + 2 * Math.PI) % (2 * Math.PI);
      
      // Distancia a la clavija más cercana aproximándose al puntero
      const pegFraction = (relativeToPointer / arc) % 1;
      const currentPegIdx = Math.floor(relativeToPointer / arc);

      let deflection = 0;
      // Umbral angular donde la clavija contacta la aguja (~12° antes de superarla)
      const contactThreshold = 0.14; // radianes

      if (pegFraction > (1 - contactThreshold)) {
        // La clavija está empujando la aguja hacia la derecha (deflexión positiva)
        const pushProgress = (pegFraction - (1 - contactThreshold)) / contactThreshold;
        deflection = pushProgress * 0.35; // hasta 20 grados de inclinación
      } else {
        // La clavija acaba de superar la aguja: rebote elástico (snap back)
        if (currentPegIdx !== lastPegIndex) {
          lastPegIndex = currentPegIdx;
          lastSnapTimestamp = currentTime;

          // Sonido de clic con limitación de frecuencia a altas velocidades
          if (currentTime - lastSoundTimeRef.current > 32) {
            playWheelTick();
            lastSoundTimeRef.current = currentTime;
          }
        }

        // Simulación de oscilación elástica amortiguada del fieltro
        const timeSinceSnap = currentTime - lastSnapTimestamp;
        if (timeSinceSnap < 140) {
          const tSnapSec = timeSinceSnap / 1000;
          // Ecuación de oscilador armónico amortiguado: e^(-λt) * cos(ωt)
          deflection = -0.22 * Math.exp(-tSnapSec * 28) * Math.cos(tSnapSec * 50);
        }
      }

      flapperAngleRef.current = deflection;
      drawWheel(currentRotation, deflection, false);

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        // Fin del giro: Victoria y celebración
        setIsSpinning(false);
        winningSectorIndexRef.current = winnerIndex;
        playWinnerFanfare();
        onWinnerSelected(options[winnerIndex]);

        // Ciclo de pulsación del gajo ganador
        let celebFrame = 0;
        const celebrateWinner = () => {
          if (winningSectorIndexRef.current !== null && celebFrame < 90) {
            pulseWinnerRef.current += 0.15;
            drawWheel(targetRotation, 0, true);
            celebFrame++;
            requestAnimationFrame(celebrateWinner);
          }
        };
        celebrateWinner();
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Contenedor con brillo halo y profundidad 3D */}
      <div className="relative p-2.5 rounded-full bg-slate-900/60 dark:bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-pink-500/20 backdrop-blur-md">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Ruleta interactiva con física realista para sorteos aleatorios"
          className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full cursor-pointer select-none"
          onClick={() => {
            if (!isSpinning) spin();
          }}
        >
          Ruleta aleatoria interactiva de Sorteos Pro
        </canvas>
      </div>

      {/* Botón de Giro con Efecto Glow */}
      <button
        type="button"
        disabled={isSpinning || options.length === 0}
        onClick={spin}
        className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-lg font-display tracking-wide shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
          isSpinning || options.length === 0
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60 shadow-none'
            : 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:via-rose-500 hover:to-purple-500 text-white shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isSpinning ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Girando la Ruleta...</span>
          </>
        ) : (
          <>
            <span>🎯</span>
            <span>¡Girar Ruleta Ahora!</span>
          </>
        )}
      </button>
    </div>
  );
};

export default RouletteCanvas;
