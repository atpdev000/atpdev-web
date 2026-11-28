"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  SUPPORTED_LANGUAGES,
  LanguageOption,
  TranslationKey,
  TRANSLATIONS,
} from '@/lib/translations';
import { getUiTranslation, UiKey } from '@/lib/i18nUi';
import { AutoPageTranslator } from '@/components/AutoPageTranslator';

interface LanguageContextType {
  lang: string;
  setLanguage: (code: string) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  tUi: (key: UiKey) => string;
  translateDynamic: (text: string) => Promise<string>;
  currentOption: LanguageOption;
  supportedLanguages: LanguageOption[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DYNAMIC_CACHE_KEY = 'sorteos_translation_cache_v2';

export const getInitialLanguage = (): string => {
  if (typeof window === 'undefined') return 'es';
  try {
    // 1. Parámetro explícito en la URL (?lang=en, ?lang=pt, etc.)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang')?.toLowerCase().trim();
    if (urlLang && SUPPORTED_LANGUAGES.some((l) => l.code === urlLang)) {
      return urlLang;
    }

    // 2. Preferencia guardada por el usuario en localStorage
    const savedLang = localStorage.getItem('sorteos_lang');
    if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
      return savedLang;
    }

    // 3. Cookie persistente
    const match = document.cookie.match(/sorteos_lang=([a-z]{2})/);
    if (match && match[1] && SUPPORTED_LANGUAGES.some((l) => l.code === match[1])) {
      return match[1];
    }

    // 4. Idioma del navegador
    if (typeof navigator !== 'undefined') {
      const browserLangs = navigator.languages || [navigator.language];
      for (const raw of browserLangs) {
        if (!raw) continue;
        const code = raw.split('-')[0].toLowerCase();
        if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
          return code;
        }
      }
    }
  } catch {}
  return 'es';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializamos en 'es' para garantizar 0 errores de hidratación SSR y sincronizamos al montar
  const [lang, setLang] = useState<string>('es');
  const [dynamicCache, setDynamicCache] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const activeLang = getInitialLanguage();
      setLang(activeLang);
      localStorage.setItem('sorteos_lang', activeLang);
      document.cookie = `sorteos_lang=${activeLang}; path=/; max-age=31536000; SameSite=Lax`;

      const cached = localStorage.getItem(DYNAMIC_CACHE_KEY);
      if (cached) {
        setDynamicCache(JSON.parse(cached));
      }
    } catch (err) {
      console.warn('Could not load language settings from localStorage', err);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      const isArabic = lang === 'ar';
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    }
  }, [lang]);

  const handleSetLanguage = useCallback((code: string) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === code)) return;
    setLang(code);
    try {
      localStorage.setItem('sorteos_lang', code);
      document.cookie = `sorteos_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (err) {
      console.warn('Could not save language to storage', err);
    }
  }, []);

  const currentOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const langDict = TRANSLATIONS[lang];
      if (langDict && langDict[key]) {
        return langDict[key];
      }
      const defaultDict = TRANSLATIONS.es;
      if (defaultDict && defaultDict[key]) {
        return defaultDict[key];
      }
      return fallback || key;
    },
    [lang]
  );

  const tUi = useCallback(
    (key: UiKey): string => {
      return getUiTranslation(lang, key);
    },
    [lang]
  );

  const translateDynamic = useCallback(
    async (text: string): Promise<string> => {
      if (!text || lang === 'es') return text;

      const cacheKey = `${lang}:::${text}`;
      if (dynamicCache[cacheKey]) {
        return dynamicCache[cacheKey];
      }

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang: lang }),
        });

        if (!res.ok) return text;
        const data = await res.json();
        const translated = data.translated || text;

        setDynamicCache((prev) => {
          const next = { ...prev, [cacheKey]: translated };
          try {
            localStorage.setItem(DYNAMIC_CACHE_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });

        return translated;
      } catch {
        return text;
      }
    },
    [lang, dynamicCache]
  );

  const value = useMemo(
    () => ({
      lang,
      setLanguage: handleSetLanguage,
      t,
      tUi,
      translateDynamic,
      currentOption,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isRTL: currentOption.direction === 'rtl',
    }),
    [lang, handleSetLanguage, t, tUi, translateDynamic, currentOption]
  );

  return (
    <LanguageContext.Provider value={value}>
      <AutoPageTranslator lang={lang} />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
