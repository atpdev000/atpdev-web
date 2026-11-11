'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function CookieConsentBanner() {
  const { locale } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('descargador_cookie_consent');
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
        const timer = setTimeout(() => setShow(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignorar entornos donde localStorage no esté disponible
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('descargador_cookie_consent', type);
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

  const content = {
    es: {
      title: 'Aviso de Privacidad y Cookies',
      desc: 'Utilizamos cookies técnicas y de publicidad personalizada (Google AdSense) para optimizar tu experiencia y mantener la plataforma 100% gratuita. Consulta nuestra',
      policy: 'Política de Cookies',
      essential: 'Solo esenciales',
      acceptAll: 'Aceptar todas',
    },
    en: {
      title: 'Privacy and Cookies Notice',
      desc: 'We use technical and personalized advertising cookies (Google AdSense) to optimize your experience and keep the tool free. Review our',
      policy: 'Cookie Policy',
      essential: 'Essential only',
      acceptAll: 'Accept all',
    },
    pt: {
      title: 'Aviso de Privacidade e Cookies',
      desc: 'Usamos cookies técnicos e de publicidade personalizada (Google AdSense) para otimizar sua experiência e manter a ferramenta gratuita. Veja nossa',
      policy: 'Política de Cookies',
      essential: 'Apenas essenciais',
      acceptAll: 'Aceitar todas',
    },
  }[locale as 'es' | 'en' | 'pt'] || {
    title: 'Aviso de Privacidad y Cookies',
    desc: 'Utilizamos cookies técnicas y de publicidad personalizada (Google AdSense) para optimizar tu experiencia y mantener la plataforma 100% gratuita. Consulta nuestra',
    policy: 'Política de Cookies',
    essential: 'Solo esenciales',
    acceptAll: 'Aceptar todas',
  };

  return (
    <aside
      aria-label="Aviso de Cookies y Privacidad"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/40 font-bold">
            <Cookie size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{content.title}</span>
              <ShieldCheck size={13} className="text-blue-500" />
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {content.desc}{' '}
              <Link href="/legal/cookies" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                {content.policy}
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => handleAccept('essential')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            {content.essential}
          </button>
          <button
            onClick={() => handleAccept('all')}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <Check size={12} />
            <span>{content.acceptAll}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CookieConsentBanner;

