'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('masteratpdf_cookie_consent');
      if (!saved) {
        setVisible(true);
      } else if (saved === 'granted' && typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleChoice = (choice: 'granted' | 'denied') => {
    try {
      localStorage.setItem('masteratpdf_cookie_consent', choice);
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('consent', 'update', {
          ad_storage: choice,
          ad_user_data: choice,
          ad_personalization: choice,
          analytics_storage: choice,
        });
      }
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de consentimiento de cookies"
      className="fixed bottom-4 inset-x-4 z-50 max-w-3xl mx-auto p-4 rounded-2xl bg-slate-900/95 text-slate-100 border border-slate-700 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
    >
      <p className="leading-relaxed text-slate-300">
        Tus archivos PDF se procesan 100% en tu navegador. Usamos cookies propias y de Google AdSense para personalizar anuncios y medir el tráfico. Más información en nuestra{' '}
        <Link href="/privacidad" className="text-indigo-400 underline font-semibold">
          Política de Privacidad
        </Link>.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => handleChoice('denied')}
          className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-semibold"
        >
          Solo necesarias
        </button>
        <button
          type="button"
          onClick={() => handleChoice('granted')}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors font-bold"
        >
          Aceptar todas
        </button>
      </div>
    </div>
  );
}
