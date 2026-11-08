// lib/currency.ts

export interface CurrencyConfig {
  code: string;
  symbol: string;
  flag: string;
  name: string;
  monthlyPrice: number;
  annualTotal: number;
  paymentNotice: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  PEN: {
    code: 'PEN',
    symbol: 'S/.',
    flag: '🇵🇪',
    name: 'Soles (Perú)',
    monthlyPrice: 14.90,
    annualTotal: 149.00,
    paymentNotice: 'Paga con Yape, Plin, Tarjeta o Transferencia'
  },
  USD: {
    code: 'USD',
    symbol: 'US$',
    flag: '🇺🇸',
    name: 'USD (Dólares)',
    monthlyPrice: 3.99,
    annualTotal: 48.00,
    paymentNotice: 'Paga con Tarjeta Internacional o PayPal'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    name: 'Euros (Europa)',
    monthlyPrice: 3.99,
    annualTotal: 48.00,
    paymentNotice: 'Paga con Tarjeta o PayPal'
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    flag: '🇲🇽',
    name: 'Pesos (México)',
    monthlyPrice: 79.00,
    annualTotal: 799.00,
    paymentNotice: 'Paga con Tarjeta o PayPal'
  },
  COP: {
    code: 'COP',
    symbol: '$',
    flag: '🇨🇴',
    name: 'Pesos (Colombia)',
    monthlyPrice: 16900,
    annualTotal: 169000,
    paymentNotice: 'Paga con Tarjeta o PSE'
  },
  CLP: {
    code: 'CLP',
    symbol: '$',
    flag: '🇨🇱',
    name: 'Pesos (Chile)',
    monthlyPrice: 3900,
    annualTotal: 39000,
    paymentNotice: 'Paga con Tarjeta o Webpay'
  },
  ARS: {
    code: 'ARS',
    symbol: '$',
    flag: '🇦🇷',
    name: 'Pesos (Argentina)',
    monthlyPrice: 4900,
    annualTotal: 49000,
    paymentNotice: 'Paga con Tarjeta o Transferencia'
  }
};

/**
 * Detecta el país y moneda óptima usando timezone del navegador y lenguaje.
 */
export function detectDefaultCurrency(serverDetected?: string): CurrencyConfig {
  if (serverDetected && SUPPORTED_CURRENCIES[serverDetected]) {
    return SUPPORTED_CURRENCIES[serverDetected];
  }

  if (typeof window === 'undefined') return SUPPORTED_CURRENCIES.USD;

  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    if (tz.includes('lima') || tz.includes('peru')) return SUPPORTED_CURRENCIES.PEN;
    if (tz.includes('mexico') || tz.includes('monterrey') || tz.includes('tijuana') || tz.includes('cancun')) return SUPPORTED_CURRENCIES.MXN;
    if (tz.includes('bogota') || tz.includes('colombia')) return SUPPORTED_CURRENCIES.COP;
    if (tz.includes('santiago') || tz.includes('chile')) return SUPPORTED_CURRENCIES.CLP;
    if (tz.includes('buenos_aires') || tz.includes('argentina') || tz.includes('cordoba')) return SUPPORTED_CURRENCIES.ARS;
    if (tz.includes('madrid') || tz.includes('paris') || tz.includes('berlin') || tz.includes('rome')) return SUPPORTED_CURRENCIES.EUR;

    // Idioma del navegador
    const lang = (navigator.language || '').toLowerCase();
    if (lang === 'es-pe') return SUPPORTED_CURRENCIES.PEN;
    if (lang === 'es-mx') return SUPPORTED_CURRENCIES.MXN;
    if (lang === 'es-co') return SUPPORTED_CURRENCIES.COP;
    if (lang === 'es-cl') return SUPPORTED_CURRENCIES.CLP;
    if (lang === 'es-ar') return SUPPORTED_CURRENCIES.ARS;
    if (lang === 'es-es') return SUPPORTED_CURRENCIES.EUR;
    
    // Por defecto en Perú si la hora o locale es America del Sur
    if (tz.includes('america/')) {
      return SUPPORTED_CURRENCIES.USD;
    }
  } catch {}

  return SUPPORTED_CURRENCIES.USD;
}

/**
 * Formatea un precio para la moneda activa.
 */
export function formatPrice(amount: number, currency: CurrencyConfig): string {
  if (currency.code === 'PEN') {
    return `S/. ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
  }
  if (currency.code === 'USD') {
    return `${amount % 1 === 0 ? amount : amount.toFixed(2)}US$`;
  }
  if (currency.code === 'EUR') {
    return `${amount % 1 === 0 ? amount : amount.toFixed(2)}€`;
  }
  if (currency.code === 'COP' || currency.code === 'CLP' || currency.code === 'ARS') {
    return `$${amount.toLocaleString('es')} ${currency.code}`;
  }
  return `$${amount.toFixed(2)} ${currency.code}`;
}
