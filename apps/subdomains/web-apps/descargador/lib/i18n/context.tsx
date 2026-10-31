"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Locale, LOCALES, DEFAULT_LOCALE, LocaleInfo } from './config';
import { translations, TranslationSchema } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationSchema;
  currentLocaleInfo: LocaleInfo;
  availableLocales: LocaleInfo[];
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('descargador_lang') as Locale | null;
      if (saved && (saved === 'es' || saved === 'en' || saved === 'pt')) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      } else {
        // Detect from browser
        const navLang = navigator.language.toLowerCase();
        let detected: Locale = DEFAULT_LOCALE;
        if (navLang.startsWith('pt')) detected = 'pt';
        else if (navLang.startsWith('en')) detected = 'en';
        else if (navLang.startsWith('es')) detected = 'es';
        
        setLocaleState(detected);
        document.documentElement.lang = detected;
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('descargador_lang', newLocale);
      document.documentElement.lang = newLocale;
    } catch {}
  };

  const currentLocaleInfo = LOCALES[locale] || LOCALES[DEFAULT_LOCALE];
  const t = translations[locale] || translations[DEFAULT_LOCALE];
  const availableLocales = useMemo(() => Object.values(LOCALES), []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, currentLocaleInfo, availableLocales }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback if accessed outside provider during SSR
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: translations[DEFAULT_LOCALE],
      currentLocaleInfo: LOCALES[DEFAULT_LOCALE],
      availableLocales: Object.values(LOCALES)
    };
  }
  return context;
}
