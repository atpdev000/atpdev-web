export type Locale = 'es' | 'en' | 'pt';

export interface LocaleInfo {
  code: Locale;
  name: string;
  flag: string;
  nativeName: string;
}

export const LOCALES: Record<Locale, LocaleInfo> = {
  es: {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  pt: {
    code: 'pt',
    name: 'Português',
    nativeName: 'Português',
    flag: '🇧🇷'
  }
};

export const DEFAULT_LOCALE: Locale = 'es';
