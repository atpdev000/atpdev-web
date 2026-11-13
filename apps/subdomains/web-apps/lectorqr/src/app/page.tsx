'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CameraScanner from '../components/CameraScanner';
import ScanResultCard from '../components/ScanResultCard';
import MultiScanResultCard from '../components/MultiScanResultCard';
import AdBanner from '../components/AdBanner';
import { ScannedCode } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  QrCode, 
  History, 
  Wifi, 
  ChevronRight,
  Upload,
  Layers,
  HelpCircle,
  Lock,
  Smartphone,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { decodeImageFiles } from '../lib/multiDecoder';
import { playScanSuccessBeep } from '../lib/sound';

export default function HomePage() {
  const [activeResult, setActiveResult] = useState<ScannedCode | null>(null);
  const [multiResults, setMultiResults] = useState<ScannedCode[] | null>(null);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [recentScans, setRecentScans] = useState<ScannedCode[]>([]);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState<boolean>(false);
  const [isProcessingDrop, setIsProcessingDrop] = useState<boolean>(false);

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
  }, [activeResult, multiResults]);

  // Manejar resultado de escaneo (sea 1 código o varios)
  const handleScanSuccess = useCallback((result: ScannedCode | ScannedCode[]) => {
    setIsScanningActive(false);

    if (Array.isArray(result)) {
      if (result.length === 1) {
        setActiveResult(result[0]);
        setMultiResults(null);
      } else {
        setMultiResults(result);
        setActiveResult(null);
      }

      // Guardar todos en historial
      try {
        const stored = localStorage.getItem('lectorqr_history');
        let history: ScannedCode[] = stored ? JSON.parse(stored) : [];
        const newCodes = result.filter(r => !history.some(h => h.rawText === r.rawText));
        const updated = [...newCodes, ...history].slice(0, 100);
        localStorage.setItem('lectorqr_history', JSON.stringify(updated));
        setRecentScans(updated.slice(0, 3));
      } catch (e) {
        console.warn('Error saving to history', e);
      }

    } else {
      setActiveResult(result);
      setMultiResults(null);

      // Guardar código individual en historial
      try {
        const stored = localStorage.getItem('lectorqr_history');
        let history: ScannedCode[] = stored ? JSON.parse(stored) : [];
        const filtered = history.filter((item) => item.rawText !== result.rawText);
        const updated = [result, ...filtered].slice(0, 100);
        localStorage.setItem('lectorqr_history', JSON.stringify(updated));
        setRecentScans(updated.slice(0, 3));

        // Auto apertura de URL si está habilitada
        const autoOpen = localStorage.getItem('lectorqr_auto_open') === 'true';
        if (autoOpen && result.type === 'url' && result.parsedData.url) {
          window.open(result.parsedData.url, '_blank');
        }
      } catch (e) {
        console.warn('Error saving to history', e);
      }
    }
  }, []);

  // Procesar archivos arrastrados o pegados (soporta múltiples QR en 1 imagen o varios archivos)
  const processFiles = useCallback(async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessingDrop(true);
    try {
      const detected = await decodeImageFiles(files);
      if (detected && detected.length > 0) {
        playScanSuccessBeep();
        handleScanSuccess(detected.length === 1 ? detected[0] : detected);
      } else {
        alert('No se detectó ningún código QR o de barras en la imagen. Intenta con una imagen más nítida o con mayor contraste.');
      }
    } catch (err) {
      console.warn('Error processing files', err);
    } finally {
      setIsProcessingDrop(false);
    }
  }, [handleScanSuccess]);

  // Listener global de Drag & Drop y Ctrl+V en toda la ventana
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingGlobal(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDraggingGlobal(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingGlobal(false);
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        processFiles(imageFiles);
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
  }, [processFiles]);

  const handleNewScan = () => {
    setActiveResult(null);
    setMultiResults(null);
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
    <div className="space-y-12 py-2 sm:py-6 relative">
      
      {/* Overlay Universal de Arrastrar y Soltar */}
      {isDraggingGlobal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-cyan-400 p-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-bounce mb-4 shadow-[0_0_30px_#22d3ee]">
            <Upload className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display text-center">
            Suelta la imagen o collage aquí para decodificar
          </h2>
          <p className="text-sm text-cyan-300 font-medium mt-2 text-center max-w-md">
            Lector QR Pro procesará automáticamente todos los códigos QR individuales contenidos en tu imagen.
          </p>
        </div>
      )}

      {/* Header Title & Status Badge */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-sm font-mono">
          <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>Motor Multi-QR y Visión Dual a 60 FPS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
          Lector y Escáner de <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Códigos QR</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-medium">
          Apunta tu cámara, arrastra imágenes con múltiples códigos o pega capturas de pantalla con <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">Ctrl+V</kbd>.
        </p>
      </div>

      {/* Indicador de procesamiento cuando se suelta imagen */}
      {isProcessingDrop && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
          <Layers className="w-4 h-4 animate-spin" />
          <span>Explorando y decodificando múltiples códigos QR en la cuadrícula...</span>
        </div>
      )}

      {/* Main Scanner or Result Display */}
      <div className="w-full flex justify-center">
        {multiResults && multiResults.length > 1 ? (
          <MultiScanResultCard
            codes={multiResults}
            onNewScan={handleNewScan}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : activeResult ? (
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
      {!activeResult && !multiResults && recentScans.length > 0 && (
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
                  setMultiResults(null);
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

      {/* Espacio Publicitario Oficial AdSense */}
      <AdBanner />

      {/* Highlights & Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl space-y-3 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Soporte para Múltiples Códigos
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Sube o arrastra imágenes que contengan cuadrículas de 12 o más códigos QR en una sola foto. Nuestro algoritmo escanea cada cuadrante individualmente.
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
            Tus fotos, capturas de pantalla y transmisiones de cámara nunca salen de tu dispositivo. Todo el cómputo se realiza de forma 100% local en tu memoria RAM.
          </p>
        </div>
      </div>

      {/* Generator CTA Banner */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400 font-mono">
            <QrCode className="w-4 h-4" />
            <span>Estudio Creativo QR estilo QR.io</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display">
            ¿Necesitas crear tu propio código QR?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Elige entre 15 tipos de contenido, agrega marcos con llamadas a la acción (ESCÁNAME), logotipos personalizados y descarga en PNG ultra nítido o SVG vectorial.
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

      {/* Educational & FAQ Section (Essential for Google AdSense Quality Compliance) */}
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-bold uppercase tracking-wider font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guía y Preguntas Frecuentes</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display">
            Todo lo que necesitas saber sobre Códigos QR
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Aprende cómo funcionan, sus estándares de seguridad y las ventajas de los códigos bidimensionales modernos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              ¿Cómo decodificar múltiples códigos QR en una imagen?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lector QR Pro cuenta con una tecnología de partición de cuadrícula en mosaico. Al subir una imagen con varios códigos (como un collage de 12 o 16 códigos), el motor escanea simultáneamente la imagen completa y cada cuadrante individual para extraer todos los resultados a la vez.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              ¿Qué es el QRishing y cómo protegerte?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              El <em>QRishing</em> es una técnica de phishing mediante la cual ciberdelincuentes sustituyen códigos QR legítimos por enlaces maliciosos. Lector QR Pro previsualiza la URL completa antes de abrirla para que verifiques siempre el dominio antes de navegar.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              ¿Qué formatos de códigos de barras son compatibles?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Además de códigos QR estándar (ISO/IEC 18004), la aplicación decodifica códigos comerciales 1D (EAN-13, EAN-8, UPC-A, Code 128, Code 39) y matrices 2D (Data Matrix, Aztec y PDF-417 de documentos de identidad).
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              ¿Los códigos generados caducan o tienen límite?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No. Todos los códigos generados en nuestro estudio son estáticos de acceso directo: la información está codificada directamente en los módulos. Funcionarán para siempre sin requerir suscripciones ni cuotas de mantenimiento.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
