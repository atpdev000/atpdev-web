'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('colorear_cookie_consent');
      if (!saved) {
        setVisible(true);
      } else if (
        (saved === 'accepted' || saved === 'granted') &&
        typeof (window as any).gtag === 'function'
      ) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        });
      }
    } catch {
      setVisible(true);
    }

    let gdprApplies = false;
    const w = window as any;
    const bindTcf = () => {
      if (typeof w.__tcfapi === 'function') {
        w.__tcfapi('addEventListener', 2, (tcData: any, success: boolean) => {
          if (success && tcData?.gdprApplies) {
            gdprApplies = true;
            setVisible(false);
          }
        });
      }
    };
    bindTcf();
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue = w.googlefc.callbackQueue || [];
    w.googlefc.callbackQueue.push({ CONSENT_DATA_READY: bindTcf });

    const onDocClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest?.('a[href="#cookies-config"]');
      if (el) {
        ev.preventDefault();
        if (gdprApplies && typeof w.googlefc?.showRevocationMessage === 'function') {
          w.googlefc.showRevocationMessage();
        } else {
          setVisible(true);
        }
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const updateConsent = (choice: 'accepted' | 'declined') => {
    const state = choice === 'accepted' ? 'granted' : 'denied';
    try {
      localStorage.setItem('colorear_cookie_consent', choice);
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('consent', 'update', {
          ad_storage: state,
          ad_user_data: state,
          ad_personalization: state,
          analytics_storage: state,
        });
      }
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-zinc-900 dark:border-slate-700 shadow-2xl space-y-3 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <p className="font-bold text-zinc-900 dark:text-white text-sm">Privacidad y Cookies</p>
          <p className="text-zinc-600 dark:text-slate-300 leading-relaxed">
            Usamos cookies propias y de Google AdSense para mantener gratuita la biblioteca de
            láminas. Puedes cambiar tu elección en cualquier momento desde{' '}
            <Link href="/cookies" className="text-blue-600 dark:text-blue-400 underline font-semibold">
              Política de Cookies
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => updateConsent('declined')}
          className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-slate-700 text-xs font-bold text-zinc-700 dark:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          Solo esenciales
        </button>
        <button
          type="button"
          onClick={() => updateConsent('accepted')}
          className="px-4 py-2 rounded-xl text-xs font-bold btn-studio-primary cursor-pointer"
        >
          Aceptar todo
        </button>
      </div>
    </div>
  );
}

