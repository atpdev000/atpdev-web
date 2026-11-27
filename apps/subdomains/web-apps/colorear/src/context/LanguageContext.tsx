'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export type AppLang = 'es' | 'en';

interface LanguageContextValue {
  lang: AppLang;
  isEn: boolean;
  setLang: (next: AppLang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  isEn: false,
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const [lang, setLangState] = useState<AppLang>('es');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryLang = params.get('lang');
      if (queryLang === 'en' || pathname === '/en' || pathname.startsWith('/en/')) {
        setLangState('en');
        localStorage.setItem('colorear_lang', 'en');
        document.documentElement.lang = 'en';
        return;
      }
      if (queryLang === 'es') {
        setLangState('es');
        localStorage.setItem('colorear_lang', 'es');
        document.documentElement.lang = 'es';
        return;
      }
      const saved = localStorage.getItem('colorear_lang');
      if (saved === 'en' || saved === 'es') {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, [pathname]);

  const setLang = (next: AppLang) => {
    setLangState(next);
    try {
      localStorage.setItem('colorear_lang', next);
      document.documentElement.lang = next;
    } catch {}
  };

  const toggleLang = () => setLang(lang === 'es' ? 'en' : 'es');

  return (
    <LanguageContext.Provider value={{ lang, isEn: lang === 'en', setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

