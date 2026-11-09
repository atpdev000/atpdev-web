'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Trash2, 
  ShieldCheck, 
  Info,
  Check,
  Sparkles
} from 'lucide-react';
import { playScanSuccessBeep } from '../../lib/sound';

export default function AjustesPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoOpenUrl, setAutoOpenUrl] = useState(false);
  const [autoCopy, setAutoCopy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sound = localStorage.getItem('lectorqr_sound');
      if (sound !== null) setSoundEnabled(sound === 'true');

      const vibration = localStorage.getItem('lectorqr_vibration');
      if (vibration !== null) setVibrationEnabled(vibration === 'true');

      const autoOpen = localStorage.getItem('lectorqr_auto_open');
      if (autoOpen !== null) setAutoOpenUrl(autoOpen === 'true');

      const copy = localStorage.getItem('lectorqr_auto_copy');
      if (copy !== null) setAutoCopy(copy === 'true');
    } catch (e) {
      console.warn('Error reading settings', e);
    }
  }, []);

  const saveSetting = (key: string, value: boolean, setter: (val: boolean) => void) => {
    setter(value);
    try {
      localStorage.setItem(key, String(value));
      setStatusMessage('Preferencias guardadas.');
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (e) {
      console.warn('Error saving setting', e);
    }
  };

  const handleTestSound = () => {
    playScanSuccessBeep();
  };

  const clearAllData = () => {
    if (window.confirm('¿Deseas restablecer todos los ajustes y borrar el historial de escaneos?')) {
      try {
        localStorage.removeItem('lectorqr_history');
        localStorage.removeItem('lectorqr_sound');
        localStorage.removeItem('lectorqr_vibration');
        localStorage.removeItem('lectorqr_auto_open');
        localStorage.removeItem('lectorqr_auto_copy');
        setSoundEnabled(true);
        setVibrationEnabled(true);
        setAutoOpenUrl(false);
        setAutoCopy(false);
        setStatusMessage('Datos y ajustes restablecidos con éxito.');
        setTimeout(() => setStatusMessage(null), 2500);
      } catch (e) {
        console.warn('Error clearing data', e);
      }
    }
  };

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-3xl mx-auto">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono mb-2">
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>Configuración del Escáner</span>
        </div>
        <h1 className="text-3xl font-black text-white font-display">
          Ajustes y Preferencias
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Personaliza la experiencia de escaneo, sonido, vibración y comportamiento automático.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Comportamiento al Escanear */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Respuesta y Feedback
          </h3>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Pitido de Detección</h4>
                <p className="text-xs text-slate-400 font-medium">
                  Reproduce un tono sintetizado (880 Hz) cuando se reconoce un código exitosamente.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestSound}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 cursor-pointer"
              >
                Probar
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => saveSetting('lectorqr_sound', e.target.checked, setSoundEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Vibration Toggle */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Vibración Háptica</h4>
                <p className="text-xs text-slate-400 font-medium">
                  Emite una breve vibración en dispositivos móviles compatibles al capturar un código.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => saveSetting('lectorqr_vibration', e.target.checked, setVibrationEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

        </div>

        {/* Automatizaciones */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Automatizaciones al Detectar
          </h3>

          {/* Auto-open URLs */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-400">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Apertura Automática de Enlaces</h4>
                <p className="text-xs text-slate-400 font-medium">
                  Abre la página web en una nueva pestaña tan pronto como la cámara capture la URL.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoOpenUrl}
                onChange={(e) => saveSetting('lectorqr_auto_open', e.target.checked, setAutoOpenUrl)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

        </div>

        {/* Privacidad y Datos */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Almacenamiento Local y Privacidad
          </h3>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white">Privacidad Garantizada al 100%</p>
              <p className="text-slate-400">
                Ninguna imagen, código escaneado o red Wi-Fi se envía a servidores externos. Todo el cómputo se realiza dentro del entorno seguro de tu navegador web.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={clearAllData}
              className="py-3 px-4 rounded-2xl bg-rose-950/40 border border-rose-900/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Restablecer Ajustes y Vaciar Todo</span>
            </button>
          </div>
        </div>

        {/* Acerca de la App */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Lector QR Pro Web</h4>
              <p className="text-[11px] text-slate-400 font-mono">Versión 1.0.0 • ATP DEV Suite</p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500 font-mono">
            Next.js 16 + Web Vision API
          </span>
        </div>

      </div>

    </div>
  );
}

