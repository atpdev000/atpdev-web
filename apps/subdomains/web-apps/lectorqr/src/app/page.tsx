'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CameraScanner from '../components/CameraScanner';
import ScanResultCard from '../components/ScanResultCard';
import { ScannedCode } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  QrCode, 
  History, 
  Wifi, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import jsQR from 'jsqr';
import { playScanSuccessBeep } from '../lib/sound';
import { parseScannedContent } from '../lib/parser';

export default function HomePage() {
  const [activeResult, setActiveResult] = useState<ScannedCode | null>(null);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [recentScans, setRecentScans] = useState<ScannedCode[]>([]);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState<boolean>(false);

  // Cargar historial reciente
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lectorqr_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentScans(parsed.slice(0, 3));
        }
      }
    } catch (e) {
      console.warn('Error reading history', e);
    }
  }, [activeResult]);

  const handleScanSuccess = useCallback((code: ScannedCode) => {
    setActiveResult(code);
    setIsScanningActive(false);

    // Guardar en localStorage
    try {
      const stored = localStorage.getItem('lectorqr_history');
      let history: ScannedCode[] = [];
      if (stored) {
        history = JSON.parse(stored);
      }
      const filtered = history.filter((item) => item.rawText !== code.rawText);
      const updated = [code, ...filtered].slice(0, 100);
      localStorage.setItem('lectorqr_history', JSON.stringify(updated));
      setRecentScans(updated.slice(0, 3));

      // Comprobar apertura automática si está habilitada
      const autoOpen = localStorage.getItem('lectorqr_auto_open') === 'true';
      if (autoOpen && code.type === 'url' && code.parsedData.url) {
        window.open(code.parsedData.url, '_blank');
      }
    } catch (e) {
      console.warn('Error saving to history', e);
    }
  }, []);

  // Función para procesar un archivo de imagen arrastrado o pegado
  const decodeImageFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        // 1. Probar BarcodeDetector nativo
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          try {
            const detector = new (window as any).BarcodeDetector({
              formats: ['qr_code', 'ean_13', 'code_128', 'data_matrix', 'aztec', 'pdf417'],
            });
            const barcodes = await detector.detect(canvas);
            if (barcodes && barcodes.length > 0) {
              playScanSuccessBeep();
              const parsed = parseScannedContent(barcodes[0].rawValue, barcodes[0].format.toUpperCase());
              handleScanSuccess(parsed);
              return;
            }
          } catch (e) {
            // fallback a jsQR
          }
        }

        // 2. jsQR Fallback
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          playScanSuccessBeep();
          const parsed = parseScannedContent(code.data, 'QR_CODE');
          handleScanSuccess(parsed);
        } else {
          alert('No se detectó ningún código QR o de barras en la imagen. Intenta con una imagen más nítida.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [handleScanSuccess]);

  // Listener global de Drag & Drop en toda la ventana
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingGlobal(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      // Verificar si salió de la ventana
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDraggingGlobal(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingGlobal(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        decodeImageFile(file);
      }
    };

    // Listener para pegar capturas de pantalla con Ctrl+V
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            decodeImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, [decodeImageFile]);

  const handleNewScan = () => {
    setActiveResult(null);
    setIsScanningActive(true);
  };

  const handleToggleFavorite = (id: string) => {
    try {
      const stored = localStorage.getItem('lectorqr_history');
      if (stored) {
        const history: ScannedCode[] = JSON.parse(stored);
        const updated = history.map((item) => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        );
        localStorage.setItem('lectorqr_history', JSON.stringify(updated));
        setRecentScans(updated.slice(0, 3));
      }
    } catch (e) {
      console.warn('Error toggling favorite', e);
    }
  };

  return (
    <div className="space-y-10 py-2 sm:py-6 relative">
      
      {/* Overlay Universal de Arrastrar y Soltar */}
      {isDraggingGlobal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-cyan-400 p-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-bounce mb-4 shadow-[0_0_30px_#22d3ee]">
            <Upload className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display text-center">
            Suelta la imagen aquí para decodificar
          </h2>
          <p className="text-sm text-cyan-300 font-medium mt-2 text-center max-w-md">
            Lector QR Pro procesará automáticamente el código QR o código de barras contenido en tu archivo.
          </p>
        </div>
      )}

      {/* Header Title & Status Badge */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>Motor Dual BarcodeDetector + jsQR a 60 FPS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
          Lector y Escáner de <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Códigos QR</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-medium">
          Apunta tu cámara, arrastra una imagen desde tu ordenador o pega una captura con <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">Ctrl+V</kbd>.
        </p>
      </div>

      {/* Main Scanner or Result Display */}
      <div className="w-full flex justify-center">
        {activeResult ? (
          <ScanResultCard
            code={activeResult}
            onNewScan={handleNewScan}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <CameraScanner
            onScanSuccess={handleScanSuccess}
            isScanningActive={isScanningActive}
          />
        )}
      </div>

      {/* Quick Recent Scans preview */}
      {!activeResult && recentScans.length > 0 && (
        <div className="max-w-lg mx-auto bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Escaneos Recientes
              </h3>
            </div>
            <Link
              href="/historial"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentScans.map((scan) => (
              <button
                key={scan.id}
                type="button"
                onClick={() => {
                  setActiveResult(scan);
                  setIsScanningActive(false);
                }}
                className="w-full text-left p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between gap-3 transition-all cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 font-mono">
                      {scan.type}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(scan.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 truncate mt-0.5 group-hover:text-white">
                    {scan.rawText}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Highlights & Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6">
        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl space-y-3 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Decodificación Ultrarrápida
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Procesamiento en tiempo real con aceleración por hardware mediante <code className="text-blue-400 bg-slate-800/50 px-1 py-0.5 rounded">BarcodeDetector</code> nativo y fallback garantizado en cualquier dispositivo.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl space-y-3 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Wifi className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Acciones Inteligentes con 1 Toque
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Copia contraseñas Wi-Fi directamente, descarga contactos en formato <code className="text-cyan-400 bg-slate-800/50 px-1 py-0.5 rounded">.vcf</code>, inicia chats en WhatsApp o abre enlaces seguros al instante.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl space-y-3 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Privacidad Total en el Navegador
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Tus fotos, capturas de pantalla y transmisiones de cámara nunca salen de tu dispositivo. Todo el análisis de visión se procesa de forma 100% local en tu memoria RAM.
          </p>
        </div>
      </div>

      {/* Generator CTA Banner */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400 font-mono">
            <QrCode className="w-4 h-4" />
            <span>Estudio Creativo QR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display">
            ¿Necesitas crear tu propio código QR?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Personaliza colores de primer plano y fondo, añade marcos con texto (ESCÁNAME), iconos de WhatsApp o Wi-Fi, y exporta en PNG ultra nítido 1024x1024 o SVG vectorial.
          </p>
        </div>
        <Link
          href="/generar"
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generar Código QR</span>
        </Link>
      </div>

    </div>
  );
}
