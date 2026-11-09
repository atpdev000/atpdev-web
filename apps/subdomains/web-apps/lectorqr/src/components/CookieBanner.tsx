'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('lectorqr_cookie_consent');
      if (consent) {
        setAccepted(true);
      } else {
        setAccepted(false);
      }
    } catch {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('lectorqr_cookie_consent', 'accepted');
    } catch {}
    setAccepted(true);
  };

  if (accepted !== false) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white font-display">Aviso de Privacidad y Cookies</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Utilizamos cookies propias y de terceros (Google AdSense y analítica) para ofrecerte la mejor experiencia, procesar tus códigos QR localmente y mostrar publicidad personalizada.{' '}
            <Link href="/politica-de-cookies" className="text-cyan-400 hover:underline">
              Más información
            </Link>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleAccept}
          className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
        >
          Aceptar Todas
        </button>
        <Link
          href="/politica-de-privacidad"
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all text-center"
        >
          Políticas
        </Link>
      </div>
    </div>
  );
}

export default CookieBanner;
