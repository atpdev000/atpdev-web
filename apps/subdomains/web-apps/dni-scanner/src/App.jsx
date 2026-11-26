import React, { useState, useEffect } from 'react';
import Scanner from './components/scanner/Scanner';
import {
  FileText, Camera as CameraIcon, Download, CheckCircle2,
  Sparkles, Sliders, RefreshCw, Sun, Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { generatePDF, generateWord, downloadCardPNG } from './utils/exportUtils';
import Editor from './components/editor/Editor';
import { Capacitor } from '@capacitor/core';

function App() {
  const isNative = Capacitor.isNativePlatform();
  const [isDark, setIsDark] = useState(true);
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dni_theme');
      if (saved === 'light') {
        setIsDark(false);
        document.body.classList.add('light-theme');
      } else {
        setIsDark(true);
        document.body.classList.remove('light-theme');
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    try {
      if (nextDark) {
        document.body.classList.remove('light-theme');
        localStorage.setItem('dni_theme', 'dark');
      } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('dni_theme', 'light');
      }
    } catch {}
  };

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
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
        isDark ? 'bg-[#090d16] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Header */}
      <nav
        className={`p-5 flex items-center justify-between border-b backdrop-blur-xl sticky top-0 z-40 transition-colors ${
          isDark
            ? 'border-white/10 bg-slate-950/85'
            : 'border-slate-200 bg-white/95 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              DNI Scanner <span className={isDark ? 'text-sky-400' : 'text-blue-600'}>Master</span>
            </h1>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              Escáner DNI Online • PDF A4 Real
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNative && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar modo claro u oscuro"
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-amber-400'
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          {(dniData?.front || dniData?.back) && (
            <button
              onClick={reset}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              Nuevo Escaneo
            </button>
          )}
        </div>
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
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                  isDark
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <Sparkles size={14} /> Eliminación 100% de fondo sin servidores
              </div>
              <h2
                className={`text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400'
                    : 'bg-gradient-to-r from-blue-700 via-sky-600 to-emerald-600'
                }`}
              >
                Escanea tu DNI en PDF A4 Oficial
              </h2>
              <p className={`text-sm max-w-sm mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Escanea ambas caras, elimina mesas o sombras con perspectiva exacta y descarga una hoja A4 a tamaño real lista para imprimir.
              </p>
            </div>

            {/* Steps Guide */}
            <div
              className={`rounded-3xl p-6 border space-y-4 transition-colors ${
                isDark
                  ? 'bg-slate-900/60 border-white/10 shadow-xl'
                  : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>1</div>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Foto del anverso (frontal)</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Detección automática de las 4 esquinas del DNI</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-700'}`}>2</div>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Foto del reverso (posterior)</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Ajusta con la lupa de precisión si lo deseas</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>3</div>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Exporta en PDF A4 o Word</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Escala física real 1:1 (85.6 × 54 mm) lista para trámites</p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => openScanner('front')}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
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
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="shrink-0" />
                <div>
                  <p className="font-bold text-sm">DNI Procesado con Éxito</p>
                  <p className={`text-xs ${isDark ? 'text-emerald-300/80' : 'text-emerald-700'}`}>Fondo 100% eliminado • Escala oficial ISO</p>
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
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Anverso (Frente)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCardPNG(dniData.front, "DNI-Anverso.png")}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isDark ? 'text-slate-300 hover:text-white bg-white/5' : 'text-slate-700 hover:text-slate-900 bg-slate-200/70'
                      }`}
                      title="Descargar solo esta cara en PNG"
                    >
                      Descargar PNG
                    </button>
                    <button
                      onClick={() => setEditingSide('front')}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                        isDark ? 'text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20' : 'text-blue-700 hover:text-blue-800 bg-blue-100 hover:bg-blue-200'
                      }`}
                    >
                      <Sliders size={13} /> AJUSTAR
                    </button>
                  </div>
                </div>

                <div
                  className={`aspect-[1.586/1] rounded-2xl overflow-hidden border-2 p-2 flex items-center justify-center ${
                    isDark ? 'border-white/10 shadow-2xl bg-slate-900/60' : 'border-slate-200 shadow-md bg-white'
                  }`}
                >
                  <img
                    src={dniData.front}
                    className="w-full h-full object-contain drop-shadow-xl"
                    alt="Anverso del DNI escaneado"
                  />
                </div>
              </div>

              {/* Back Card */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Reverso (Atrás)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCardPNG(dniData.back, "DNI-Reverso.png")}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isDark ? 'text-slate-300 hover:text-white bg-white/5' : 'text-slate-700 hover:text-slate-900 bg-slate-200/70'
                      }`}
                      title="Descargar solo esta cara en PNG"
                    >
                      Descargar PNG
                    </button>
                    <button
                      onClick={() => setEditingSide('back')}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                        isDark ? 'text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20' : 'text-blue-700 hover:text-blue-800 bg-blue-100 hover:bg-blue-200'
                      }`}
                    >
                      <Sliders size={13} /> AJUSTAR
                    </button>
                  </div>
                </div>

                <div
                  className={`aspect-[1.586/1] rounded-2xl overflow-hidden border-2 p-2 flex items-center justify-center ${
                    isDark ? 'border-white/10 shadow-2xl bg-slate-900/60' : 'border-slate-200 shadow-md bg-white'
                  }`}
                >
                  <img
                    src={dniData.back}
                    className="w-full h-full object-contain drop-shadow-xl"
                    alt="Reverso del DNI escaneado"
                  />
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="mt-auto space-y-3 pt-4">
              <div className="flex gap-3">
                <button
                  onClick={handleExportWord}
                  className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors border shadow-lg active:scale-95 cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border-white/5'
                      : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  }`}
                >
                  <Download size={18} /> Word (.docx)
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
                >
                  <FileText size={18} /> PDF A4 Oficial
                </button>
              </div>

              <button
                onClick={reset}
                className={`w-full py-3 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
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
      <footer
        className={`p-4 text-center text-xs space-y-2 border-t transition-colors ${
          isDark ? 'text-slate-400 border-slate-900' : 'text-slate-600 border-slate-200 bg-white'
        }`}
      >
        <div>DNI Scanner Master • Recorte Cuadrilátero &amp; Exportación A4 Oficial</div>
        <nav aria-label="Enlaces legales" className="flex flex-wrap justify-center gap-4 text-[11px] font-medium">
          <a href="/sobre-nosotros.html" className={isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-700'}>Sobre Nosotros</a>
          <a href="/privacidad.html" className={isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-700'}>Privacidad</a>
          <a href="/cookies.html" className={isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-700'}>Política de Cookies</a>
          <a href="#cookies-config" className={isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-700'}>Configurar Cookies</a>
          <a href="/terminos.html" className={isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-700'}>Términos de Uso</a>
          <a href="/contacto.html" className={isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-700'}>Contacto</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;
