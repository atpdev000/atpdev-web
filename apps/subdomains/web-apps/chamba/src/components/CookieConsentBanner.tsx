'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Check } from 'lucide-react';

export function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('chamba_cookie_consent');
      if (consent) {
        // Notificar a Google Consent Mode v2 si ya existe consentimiento previo
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            'ad_storage': consent === 'all' ? 'granted' : 'denied',
            'ad_user_data': consent === 'all' ? 'granted' : 'denied',
            'ad_personalization': consent === 'all' ? 'granted' : 'denied',
            'analytics_storage': 'granted',
          });
        }
      } else {
        // Mostrar con un leve delay estético para no afectar el First Contentful Paint
        const timer = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Ignore localStorage unavailable
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('chamba_cookie_consent', type);
      // Actualizar Google Consent Mode v2 según elección del usuario
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'ad_storage': type === 'all' ? 'granted' : 'denied',
          'ad_user_data': type === 'all' ? 'granted' : 'denied',
          'ad_personalization': type === 'all' ? 'granted' : 'denied',
          'analytics_storage': 'granted',
        });
      }
      setShow(false);
    } catch (e) {
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <aside aria-label="Aviso de Cookies y Privacidad" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/40 font-bold">
            <Cookie size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
              <span>Aviso de Privacidad & Cookies</span>
              <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Utilizamos cookies técnicas y de publicidad (Google AdSense) para optimizar tu experiencia y mantener la plataforma 100% gratuita. Puedes consultar nuestra{' '}
              <Link href="/politica-de-privacidad" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                Política de Privacidad
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => handleAccept('essential')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Solo esenciales
          </button>
          <button
            onClick={() => handleAccept('all')}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <Check size={12} />
            <span>Aceptar todas</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
