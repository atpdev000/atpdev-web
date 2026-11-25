'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('perusabor_cookie_consent');
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
      // ignore storage errors
    }
    const onDocClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest?.('a[href="#cookies-config"]');
      if (el) {
        ev.preventDefault();
        setVisible(true);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleChoice = (choice: 'granted' | 'denied') => {
    try {
      localStorage.setItem('perusabor_cookie_consent', choice);
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
      className="fixed bottom-4 inset-x-4 z-50 max-w-3xl mx-auto p-4 rounded-2xl bg-stone-900/95 text-stone-100 border border-stone-700 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
    >
      <p className="leading-relaxed text-stone-300">
        Utilizamos almacenamiento local para tus recetas y cookies propias y de terceros (Google AdSense) para mostrar anuncios relevantes y medir el rendimiento. Consulta nuestra{' '}
        <Link href="/privacidad" className="text-amber-400 underline font-semibold">
          Política de Privacidad
        </Link>.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => handleChoice('denied')}
          className="px-3 py-1.5 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800 transition-colors font-semibold"
        >
          Solo necesarias
        </button>
        <button
          type="button"
          onClick={() => handleChoice('granted')}
          className="px-3.5 py-1.5 rounded-lg bg-[#c22929] text-white hover:opacity-90 transition-opacity font-bold"
        >
          Aceptar todas
        </button>
      </div>
    </div>
  );
}
