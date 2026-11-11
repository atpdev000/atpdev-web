import React, { useState } from 'react';
import Scanner from './components/scanner/Scanner';
import {
  FileText, Camera as CameraIcon, Download, CheckCircle2,
  Loader2, Image as ImageIcon, Upload, ArrowRight, Sparkles, Sliders, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePDF, generateWord, downloadCardPNG } from './utils/exportUtils';
import Editor from './components/editor/Editor';
import { Capacitor } from '@capacitor/core';

function App() {
  const isNative = Capacitor.isNativePlatform();
  const [showScanner, setShowScanner] = useState(false);
  const [scannerConfig, setScannerConfig] = useState({ step: 'front' });
  const [editingSide, setEditingSide] = useState(null); // 'front' | 'back' | null

  // Processed DNI images (perspective-corrected & filtered)
  const [dniData, setDniData] = useState({ front: null, back: null });

  // Original uncropped photos
  const [rawImages, setRawImages] = useState({ front: null, back: null });

  // Saved natural corners
  const [cornersData, setCornersData] = useState({ front: null, back: null });

  // Applied filter per side
  const [filtersData, setFiltersData] = useState({ front: 'magic', back: 'magic' });

  const [status, setStatus] = useState('idle'); // 'idle' | 'captured' | 'exporting'

  const handleCapture = (captureResult) => {
    setShowScanner(false);
    setDniData({
      front: captureResult.front,
      back: captureResult.back
    });
    setRawImages({
      front: captureResult.rawFront || captureResult.front,
      back: captureResult.rawBack || captureResult.back
    });
    setCornersData({
      front: captureResult.cornersFront || null,
      back: captureResult.cornersBack || null
    });
    setFiltersData({
      front: captureResult.filterFront || 'magic',
      back: captureResult.filterBack || 'magic'
    });
    setStatus('captured');
  };

  const openScanner = (step = 'front') => {
    setScannerConfig({ step });
    setShowScanner(true);
  };

  const handleExportPDF = async () => {
    if (dniData.front && dniData.back) {
      await generatePDF(dniData.front, dniData.back);
    }
  };

  const handleExportWord = async () => {
    if (dniData.front && dniData.back) {
      await generateWord(dniData.front, dniData.back);
    }
  };

  const reset = () => {
    setDniData({ front: null, back: null });
    setRawImages({ front: null, back: null });
    setCornersData({ front: null, back: null });
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <nav className="p-5 flex items-center justify-between border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">DNI Master Scanner</h1>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
              Recorte Inteligente HD
            </span>
          </div>
        </div>
        {(dniData?.front || dniData?.back) && (
          <button
            onClick={reset}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            Nuevo Escaneo
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
        {status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-center gap-8 py-6"
          >
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                <Sparkles size={14} /> Eliminación 100% de fondo sin servidores
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Convierte tu DNI a Digital
              </h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Escanea ambas caras, elimina mesas o dedos con perspectiva exacta y descarga un PDF A4 listo para imprimir.
              </p>
            </div>

            {/* Steps Guide */}
            <div className="bg-slate-900/60 rounded-3xl p-6 border border-white/5 space-y-4 shadow-xl">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Foto del anverso (frontal)</p>
                  <p className="text-xs text-slate-400">La IA detecta las 4 esquinas del DNI</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Foto del reverso (posterior)</p>
                  <p className="text-xs text-slate-400">Ajusta con la lupa de precisión si lo deseas</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Exporta en PDF A4 o Word</p>
                  <p className="text-xs text-slate-400">Escala física real 1:1 lista para trámites</p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => openScanner('front')}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <CameraIcon size={24} /> EMPEZAR ESCANEO
            </button>
          </motion.div>
        )}

        {status === 'captured' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-6 py-2"
          >
            <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="shrink-0" />
                <div>
                  <p className="font-bold text-sm">DNI Procesado con Éxito</p>
                  <p className="text-xs text-emerald-300/80">Fondo 100% eliminado • Escala oficial ISO</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase bg-emerald-500/20 px-2.5 py-1 rounded-full">
                HD
              </span>
            </div>

            {/* DNI Cards Showcase */}
            <div className="grid grid-cols-1 gap-5">
              {/* Front Card */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Anverso (Frente)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCardPNG(dniData.front, "DNI-Anverso.png")}
                      className="text-[11px] text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg transition-colors"
                      title="Descargar solo esta cara en PNG"
                    >
                      Descargar PNG
                    </button>
                    <button
                      onClick={() => setEditingSide('front')}
                      className="text-xs text-blue-400 font-bold hover:text-blue-300 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Sliders size={13} /> AJUSTAR
                    </button>
                  </div>
                </div>

                <div className="aspect-[1.586/1] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-900/60 p-2 flex items-center justify-center">
                  <img
                    src={dniData.front}
                    className="w-full h-full object-contain drop-shadow-xl"
                    alt="DNI Front"
                  />
                </div>
              </div>

              {/* Back Card */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Reverso (Atrás)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCardPNG(dniData.back, "DNI-Reverso.png")}
                      className="text-[11px] text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg transition-colors"
                      title="Descargar solo esta cara en PNG"
                    >
                      Descargar PNG
                    </button>
                    <button
                      onClick={() => setEditingSide('back')}
                      className="text-xs text-blue-400 font-bold hover:text-blue-300 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Sliders size={13} /> AJUSTAR
                    </button>
                  </div>
                </div>

                <div className="aspect-[1.586/1] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-900/60 p-2 flex items-center justify-center">
                  <img
                    src={dniData.back}
                    className="w-full h-full object-contain drop-shadow-xl"
                    alt="DNI Back"
                  />
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="mt-auto space-y-3 pt-4">
              <div className="flex gap-3">
                <button
                  onClick={handleExportWord}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors border border-white/5 shadow-lg active:scale-95"
                >
                  <Download size={18} /> Word (.docx)
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all active:scale-95"
                >
                  <FileText size={18} /> PDF A4 Oficial
                </button>
              </div>

              <button
                onClick={reset}
                className="w-full py-3 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Escanear otro documento
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Full-Featured Editor Modal */}
      {editingSide && (
        <Editor
          image={rawImages[editingSide] || dniData[editingSide]}
          initialCorners={cornersData[editingSide]}
          initialFilter={filtersData[editingSide] || 'magic'}
          title={`Ajustar ${editingSide === 'front' ? 'Anverso' : 'Reverso'}`}
          onConfirm={({ processedImage, rawImage, corners, filter }) => {
            setDniData(prev => ({ ...prev, [editingSide]: processedImage }));
            setRawImages(prev => ({ ...prev, [editingSide]: rawImage }));
            setCornersData(prev => ({ ...prev, [editingSide]: corners }));
            setFiltersData(prev => ({ ...prev, [editingSide]: filter }));
            setEditingSide(null);
          }}
          onCancel={() => setEditingSide(null)}
        />
      )}

      {/* Camera / Scanner Modal */}
      {showScanner && (
        <Scanner
          initialStep={scannerConfig.step}
          initialImages={dniData}
          initialRawImages={rawImages}
          onCapture={handleCapture}
          onCancel={() => setShowScanner(false)}
        />
      )}

      {/* Footer */}
      <footer className="p-4 text-center text-slate-600 text-xs">
        DNI Master Scanner • Recorte Cuadrilátero & Filtros Pro
      </footer>
    </div>
  );
}

export default App;
