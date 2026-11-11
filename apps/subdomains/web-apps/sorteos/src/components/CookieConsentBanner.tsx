'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Check } from 'lucide-react';

export function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('sorteos_cookie_consent');
      if (consent) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            ad_storage: consent === 'all' ? 'granted' : 'denied',
            ad_user_data: consent === 'all' ? 'granted' : 'denied',
            ad_personalization: consent === 'all' ? 'granted' : 'denied',
            analytics_storage: 'granted',
          });
        }
      } else {
        const timer = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage unavailable
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('sorteos_cookie_consent', type);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: type === 'all' ? 'granted' : 'denied',
          ad_user_data: type === 'all' ? 'granted' : 'denied',
          ad_personalization: type === 'all' ? 'granted' : 'denied',
          analytics_storage: 'granted',
        });
      }
      setShow(false);
    } catch {
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <aside aria-label="Aviso de Cookies y Privacidad" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md p-5 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 border border-pink-200 dark:border-pink-800/40 font-bold">
            <Cookie size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
              <span>Aviso de Privacidad & Cookies</span>
              <ShieldCheck size={13} className="text-pink-600 dark:text-pink-400" />
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">
              Utilizamos cookies técnicas y de publicidad personalizada (Google AdSense) para optimizar la experiencia y mantener las herramientas de sorteo 100% gratuitas. Puedes consultar nuestra{' '}
              <Link href="/politica-de-privacidad" className="text-pink-600 dark:text-pink-400 font-semibold hover:underline">
                Política de Privacidad
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => handleAccept('essential')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Solo esenciales
          </button>
          <button
            onClick={() => handleAccept('all')}
            className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            <Check size={12} />
            <span>Aceptar todas</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
