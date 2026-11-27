'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Undo2, RotateCcw, Download, Printer, Eraser, Paintbrush } from 'lucide-react';
import { buildSingleSheetPdf, triggerPdfDownload } from '@/lib/kdpPdfBuilder';

interface InteractiveColoringModalProps {
  isOpen: boolean;
  title: string;
  imageSrc: string;
  onClose: () => void;
}

const CRAYON_PALETTE = [
  { name: 'Rojo Carmín', hex: '#EF4444' },
  { name: 'Naranja Mandarina', hex: '#F97316' },
  { name: 'Amarillo Sol', hex: '#FACC15' },
  { name: 'Verde Hoja', hex: '#22C55E' },
  { name: 'Verde Bosque', hex: '#15803D' },
  { name: 'Turquesa', hex: '#06B6D4' },
  { name: 'Azul Cielo', hex: '#38BDF8' },
  { name: 'Azul Cobalto', hex: '#2563EB' },
  { name: 'Morado Uva', hex: '#8B5CF6' },
  { name: 'Rosa Chicle', hex: '#EC4899' },
  { name: 'Durazno', hex: '#FDBA74' },
  { name: 'Marrón Tierra', hex: '#92400E' },
  { name: 'Gris Suave', hex: '#94A3B8' },
  { name: 'Blanco (Borrador)', hex: '#FFFFFF' },
];

function hexToRgba(hex: string): [number, number, number, number] {
  const c = hex.replace('#', '');
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
    255,
  ];
}

export default function InteractiveColoringModal({
  isOpen,
  title,
  imageSrc,
  onClose,
}: InteractiveColoringModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FACC15');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadOriginalToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const targetW = 720;
      const ratio = img.height / img.width;
      const targetH = Math.round(targetW * ratio);
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);
      setHistory([ctx.getImageData(0, 0, targetW, targetH)]);
      setLoading(false);
    };
    img.onerror = () => setLoading(false);
    img.src = imageSrc;
  };

  useEffect(() => {
    if (!isOpen) return;
    loadOriginalToCanvas();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  // Relleno rápido por inundación (flood-fill iterativo respetando trazos negros)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const startX = Math.floor((e.clientX - rect.left) * scaleX);
    const startY = Math.floor((e.clientY - rect.top) * scaleY);
    if (startX < 0 || startY < 0 || startX >= canvas.width || startY >= canvas.height) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;
    const startIdx = (startY * w + startX) * 4;

    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    // No pintar encima de líneas negras de tinta
    if (startR < 80 && startG < 80 && startB < 80) return;

    const [fillR, fillG, fillB, fillA] = hexToRgba(selectedColor);
    if (
      Math.abs(startR - fillR) < 8 &&
      Math.abs(startG - fillG) < 8 &&
      Math.abs(startB - fillB) < 8
    ) {
      return;
    }

    const visited = new Uint8Array(w * h);
    const stack: number[] = [startX, startY];
    const tolerance = 48;

    const matchesStart = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Proteger trazos oscuros
      if (r < 95 && g < 95 && b < 95) return false;
      return (
        Math.abs(r - startR) <= tolerance &&
        Math.abs(g - startG) <= tolerance &&
        Math.abs(b - startB) <= tolerance
      );
    };

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      const pos = y * w + x;
      if (visited[pos]) continue;
      const idx = pos * 4;
      if (!matchesStart(idx)) continue;

      visited[pos] = 1;
      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = fillA;

      stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }

    ctx.putImageData(imgData, 0, 0);
    setHistory((prev) => [...prev.slice(-14), imgData]);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const nextHistory = history.slice(0, -1);
    ctx.putImageData(nextHistory[nextHistory.length - 1], 0, 0);
    setHistory(nextHistory);
  };

  const handleDownloadColoredPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}-coloreado.png`;
    a.click();
  };

  const handleDownloadBlankPdf = async () => {
    setExporting(true);
    try {
      const bytes = await buildSingleSheetPdf(imageSrc, title, '8.5x11', {
        threshold: 185,
        boldness: 0,
        addFrame: false,
        pureBlackWhite: false,
      });
      triggerPdfDownload(bytes, `${title.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}-300dpi.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-zinc-900 dark:border-slate-700 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-yellow-300 border border-zinc-900 text-zinc-900 shrink-0">
              <Paintbrush className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base sm:text-lg text-zinc-900 dark:text-white truncate">
                {title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-slate-400">
                Elige un color y haz clic dentro de cualquier zona blanca para pintarla.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar estudio de coloreado"
            className="p-2 rounded-xl border border-zinc-200 dark:border-slate-700 text-zinc-600 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Lienzo interactivo */}
          <div className="lg:col-span-8 bg-zinc-100 dark:bg-slate-950 rounded-2xl p-3 flex items-center justify-center border border-zinc-200 dark:border-slate-800 min-h-[360px]">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-h-[65vh] w-auto max-w-full rounded-xl bg-white shadow-md cursor-crosshair border border-zinc-300"
            />
          </div>

          {/* Paleta y acciones */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
                Paleta de crayolas
              </span>
              <div className="grid grid-cols-7 lg:grid-cols-4 gap-2">
                {CRAYON_PALETTE.map((swatch) => {
                  const active = selectedColor === swatch.hex;
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      title={swatch.name}
                      onClick={() => setSelectedColor(swatch.hex)}
                      className={`h-10 rounded-xl border-2 cursor-pointer transition-transform ${
                        active
                          ? 'scale-110 border-zinc-900 dark:border-white ring-2 ring-blue-500'
                          : 'border-zinc-300 dark:border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {swatch.hex === '#FFFFFF' && (
                        <Eraser className="w-4 h-4 text-zinc-500 mx-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 text-xs font-bold text-zinc-800 dark:text-slate-200 flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
                <span>Deshacer</span>
              </button>
              <button
                type="button"
                onClick={loadOriginalToCanvas}
                className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 text-xs font-bold text-zinc-800 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDownloadColoredPng}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Guardar dibujo pintado (PNG)</span>
              </button>
              <button
                type="button"
                disabled={exporting}
                onClick={handleDownloadBlankPdf}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold btn-studio-sun flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Printer className="w-4 h-4" />
                <span>{exporting ? 'Generando PDF 300 DPI...' : 'Imprimir lámina en blanco (PDF)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

