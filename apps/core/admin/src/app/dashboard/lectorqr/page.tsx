'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  QrCode, 
  ExternalLink, 
  Scan, 
  Cpu, 
  Settings, 
  Save, 
  Sliders, 
  Wifi, 
  Globe, 
  User, 
  MessageSquare, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  BarChart3, 
  Sparkles, 
  Zap,
  Camera,
  Layers,
  Search
} from 'lucide-react';

interface DecoderFormat {
  id: string;
  name: string;
  category: '2D (QR & Matrices)' | '1D (Barras Comerciales)';
  description: string;
  enabled: boolean;
}

export default function LectorQRAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'formatos' | 'estudio' | 'telemetria' | 'ajustes'>('formatos');
  
  // Formatos soportados
  const [formats, setFormats] = useState<DecoderFormat[]>([
    { id: 'qr_code', name: 'QR Code Estándar (ISO/IEC 18004)', category: '2D (QR & Matrices)', description: 'Decodificación de URLs, Wi-Fi, vCard, texto y WhatsApp.', enabled: true },
    { id: 'data_matrix', name: 'Data Matrix', category: '2D (QR & Matrices)', description: 'Matrices compactas industriales y trazabilidad.', enabled: true },
    { id: 'aztec', name: 'Aztec Code', category: '2D (QR & Matrices)', description: 'Billetes de avión, transporte y tickets de eventos.', enabled: true },
    { id: 'pdf417', name: 'PDF-417', category: '2D (QR & Matrices)', description: 'Documentos de identidad nacional (DNI), pasaportes y licencias.', enabled: true },
    { id: 'ean_13', name: 'EAN-13 / UPC-A', category: '1D (Barras Comerciales)', description: 'Productos de supermercado, retail y comercio minorista.', enabled: true },
    { id: 'ean_8', name: 'EAN-8', category: '1D (Barras Comerciales)', description: 'Productos de empaque pequeño.', enabled: true },
    { id: 'code_128', name: 'Code 128 / Code 39', category: '1D (Barras Comerciales)', description: 'Envíos logísticos, encomiendas y almacenes.', enabled: true },
  ]);

  // Estudio Generador Settings
  const [defaultResolution, setDefaultResolution] = useState<'512' | '1024' | '2048'>('1024');
  const [defaultCorrection, setDefaultCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [allowCustomColors, setAllowCustomColors] = useState<boolean>(true);
  const [includeBranding, setIncludeBranding] = useState<boolean>(false);

  // Ajustes de Plataforma
  const [hardwareAcceleration, setHardwareAcceleration] = useState<boolean>(true);
  const [jsqrFallback, setJsqrFallback] = useState<boolean>(true);
  const [beepPitch, setBeepPitch] = useState<number>(880);
  const [maxHistoryLocal, setMaxHistoryLocal] = useState<number>(100);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const toggleFormat = (id: string) => {
    setFormats(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                Port 3010 • Subdomain: lectorqr
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Subdomain
              </span>
            </div>
            <h1 className="text-2xl font-black text-white font-display mt-1">
              Lector QR Pro • Administración & CMS
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Control de motores de visión computacional, formatos de códigos de barras, estudio generador y analítica.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://lectorqr.atpdev.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Ver App Web</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Configuración del motor de escaneo y estudio QR guardada exitosamente en el cluster.</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Escaneos Procesados</span>
            <Scan className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white font-display">48,290</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ +14.2% esta semana</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Tasa de Éxito Visión</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-display">99.85%</p>
          <span className="text-[11px] text-slate-400 font-medium">Detección nativa en hardware</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Códigos QR Generados</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white font-display">12,450</p>
          <span className="text-[11px] text-cyan-400 font-medium">Exportaciones en PNG y SVG</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Latencia de Captura</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-display">14 ms</p>
          <span className="text-[11px] text-slate-400 font-medium">Renderizado a 60 FPS</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('formatos')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'formatos'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Formatos de Visión ({formats.filter(f => f.enabled).length}/{formats.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('estudio')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'estudio'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Estudio Generador</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telemetria')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'telemetria'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Telemetría y Distribución</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ajustes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'ajustes'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Parámetros de Motor</span>
        </button>
      </div>

      {/* TAB 1: FORMATOS DE VISIÓN */}
      {activeTab === 'formatos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Formatos de Códigos Activos en el Escáner
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Habilita o deshabilita los analizadores que el motor BarcodeDetector y jsQR intentarán decodificar por fotograma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formats.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 font-mono">
                    {f.category}
                  </span>
                  <h4 className="text-sm font-bold text-white">{f.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{f.description}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={f.enabled}
                    onChange={() => toggleFormat(f.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ESTUDIO GENERADOR */}
      {activeTab === 'estudio' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Parámetros Predeterminados del Generador QR
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Define los valores iniciales para los usuarios cuando creen nuevos códigos en la web.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                Resolución Predeterminada de Exportación PNG:
              </label>
              <select
                value={defaultResolution}
                onChange={(e) => setDefaultResolution(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="512">512 x 512 px (Estándar Web)</option>
                <option value="1024">1024 x 1024 px (Alta Definición HD)</option>
                <option value="2048">2048 x 2048 px (Impresión Gigantografías Ultra HD)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                Nivel Predeterminado de Corrección de Errores:
              </label>
              <select
                value={defaultCorrection}
                onChange={(e) => setDefaultCorrection(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="L">L - 7% Recuperación</option>
                <option value="M">M - 15% Estándar (Recomendado)</option>
                <option value="Q">Q - 25% Alta Calidad</option>
                <option value="H">H - 30% Máxima (Ideal para Logotipos Centrales)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">Permitir Paletas de Color Personalizadas</h4>
                <p className="text-xs text-slate-400 font-medium">Permite a los usuarios elegir colores de primer plano y fondo.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCustomColors}
                  onChange={(e) => setAllowCustomColors(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELEMETRÍA Y DISTRIBUCIÓN */}
      {activeTab === 'telemetria' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Distribución de Tipos de Códigos Escaneados
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Proporción de contenido clasificado en la plataforma web y móvil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <Globe className="w-5 h-5 text-blue-400 mx-auto" />
              <p className="text-lg font-bold text-white">42%</p>
              <span className="text-[11px] text-slate-400 font-medium">Enlaces Web (URL)</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <Wifi className="w-5 h-5 text-emerald-400 mx-auto" />
              <p className="text-lg font-bold text-white">34%</p>
              <span className="text-[11px] text-slate-400 font-medium">Redes Wi-Fi</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <User className="w-5 h-5 text-purple-400 mx-auto" />
              <p className="text-lg font-bold text-white">12%</p>
              <span className="text-[11px] text-slate-400 font-medium">Contactos vCard</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <MessageSquare className="w-5 h-5 text-green-400 mx-auto" />
              <p className="text-lg font-bold text-white">8%</p>
              <span className="text-[11px] text-slate-400 font-medium">WhatsApp</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
              <Scan className="w-5 h-5 text-cyan-400 mx-auto" />
              <p className="text-lg font-bold text-white">4%</p>
              <span className="text-[11px] text-slate-400 font-medium">Código de Barras</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AJUSTES DE MOTOR */}
      {activeTab === 'ajustes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Ajustes de Rendimiento y Motor Web
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Configuración de aceleración nativa y síntesis sonora.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">Aceleración Nativa BarcodeDetector</h4>
                <p className="text-xs text-slate-400 font-medium">Utiliza la API de visión nativa de Chrome/Edge/Android.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hardwareAcceleration}
                  onChange={(e) => setHardwareAcceleration(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">Fallback Automático jsQR</h4>
                <p className="text-xs text-slate-400 font-medium">Decodificación por software en navegadores sin soporte nativo.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={jsqrFallback}
                  onChange={(e) => setJsqrFallback(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                Frecuencia del Tono de Audio (Hz):
              </label>
              <input
                type="number"
                value={beepPitch}
                onChange={(e) => setBeepPitch(Number(e.target.value))}
                min={200}
                max={2000}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-mono font-semibold focus:border-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Valor estándar: 880 Hz (A5 musical) para máxima inteligibilidad en altavoces móviles.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

