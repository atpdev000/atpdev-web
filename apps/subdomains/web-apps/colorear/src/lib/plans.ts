export type ColorearPlanId = 'free' | 'creador' | 'editorial';
export type BillingCycle = 'one_time' | 'monthly' | 'annual';

export interface ColorearPlan {
  id: ColorearPlanId;
  mode: 'free' | 'payment' | 'subscription';
  credits: number;
  priceUsdMonthly: number;
  priceUsdAnnual: number;
  pricePenMonthly: number;
  pricePenAnnual: number;
  highlight: boolean;
  es: {
    name: string;
    badge: string;
    tagline: string;
    periodLabel: string;
    ctaLabel: string;
    features: string[];
  };
  en: {
    name: string;
    badge: string;
    tagline: string;
    periodLabel: string;
    ctaLabel: string;
    features: string[];
  };
}

export const WELCOME_FREE_CREDITS = 15;

export const COLOREAR_PLANS: ColorearPlan[] = [
  {
    id: 'free',
    mode: 'free',
    credits: WELCOME_FREE_CREDITS,
    priceUsdMonthly: 0,
    priceUsdAnnual: 0,
    pricePenMonthly: 0,
    pricePenAnnual: 0,
    highlight: false,
    es: {
      name: 'Plan Gratuito',
      badge: 'Familias y Docentes',
      tagline: 'Biblioteca imprimible 300 DPI, pizarra online y pruebas del Estudio KDP.',
      periodLabel: 'Para siempre • 15 créditos al registrarte',
      ctaLabel: 'Empezar gratis',
      features: [
        'Descarga ilimitada de láminas PDF 300 DPI (Carta y A4)',
        'Coloreador interactivo en pantalla sin marcas de agua',
        '15 créditos de bienvenida al crear cuenta + cuota gratuita diaria',
        'Carga masiva de hasta 60 dibujos propios al Estudio KDP',
        'Compilador PDF Interior 300 DPI + Portada con lomo exacto',
      ],
    },
    en: {
      name: 'Free Plan',
      badge: 'Families & Teachers',
      tagline: 'Free 300 DPI printable library, online coloring canvas, and KDP Studio starter.',
      periodLabel: 'Forever free • 15 welcome credits on signup',
      ctaLabel: 'Start for free',
      features: [
        'Unlimited 300 DPI PDF downloads (US Letter & A4)',
        'Interactive click-to-fill online coloring canvas',
        '15 welcome AI credits on signup + fair daily free quota',
        'Bulk upload up to 60 of your own drawings to KDP Studio',
        '300 DPI KDP Interior PDF + Full-wrap Cover & Spine calculator',
      ],
    },
  },
  {
    id: 'creador',
    mode: 'payment',
    credits: 120,
    priceUsdMonthly: 9,
    priceUsdAnnual: 9,
    pricePenMonthly: 29,
    pricePenAnnual: 29,
    highlight: true,
    es: {
      name: 'Pack Creador KDP',
      badge: 'Más popular • Pago único',
      tagline: 'Publica tus primeros 3 libros completos en Amazon KDP sin suscripciones obligatorias.',
      periodLabel: 'Pago único • 120 créditos IA sin caducidad',
      ctaLabel: 'Comprar Pack Creador',
      features: [
        '120 créditos IA HD sin límite diario ni caducidad',
        'Motor prioritario de ilustración (sin tope diario por IP)',
        'Limpieza automática blanco/negro puro 300 DPI para KDP',
        'Reversos en blanco anti-traspaso + portada completa calculada',
        'Pago seguro con tarjeta (Stripe USD) o Yape / Plin (S/ 29)',
      ],
    },
    en: {
      name: 'KDP Creator Pack',
      badge: 'Most Popular • One-Time',
      tagline: 'Publish your first 3 complete Amazon KDP coloring books with zero subscriptions.',
      periodLabel: 'One-time payment • 120 non-expiring credits',
      ctaLabel: 'Buy Creator Pack',
      features: [
        '120 HD AI credits that never expire (no daily cap)',
        'Priority illustration engine bypasses IP rate limits',
        'Automatic pure B&W 300 DPI KDP line-art cleaner',
        'Automatic anti-bleed blank verso pages + exact spine cover PDF',
        'Instant Stripe card checkout ($9 USD) or Yape / Plin (S/ 29)',
      ],
    },
  },
  {
    id: 'editorial',
    mode: 'subscription',
    credits: 400,
    priceUsdMonthly: 19,
    priceUsdAnnual: 182,
    pricePenMonthly: 59,
    pricePenAnnual: 564,
    highlight: false,
    es: {
      name: 'Estudio Editorial Pro',
      badge: 'Catálogo KDP & Agencias',
      tagline: 'Para autores y equipos que publican colecciones mensuales en español e inglés.',
      periodLabel: '400 créditos IA prioritarios cada mes',
      ctaLabel: 'Activar Estudio Pro',
      features: [
        '400 créditos IA prioritarios recargados cada mes',
        'Planificador editorial KDP ilimitado (ES / EN + 7 keywords)',
        'Compilación rápida de lotes hasta 60 páginas por libro',
        'Asesoría técnica en márgenes, sangrado y transparencia IA KDP',
        'Cancela en cualquier momento • Ahorra 20% en plan anual',
      ],
    },
    en: {
      name: 'Editorial Studio Pro',
      badge: 'KDP Publishers & Teams',
      tagline: 'Built for prolific authors publishing monthly bilingual coloring book series.',
      periodLabel: '400 priority AI credits every month',
      ctaLabel: 'Activate Studio Pro',
      features: [
        '400 priority AI credits refilled every month',
        'Unlimited KDP book outlines, blurbs & 7 backend keywords',
        'Fast batch compilation up to 60 illustrations per book',
        'Priority support for KDP trim, bleed & spine validation',
        'Cancel anytime • Save 20% with annual billing',
      ],
    },
  },
];

export function getPlanById(planId: string): ColorearPlan | undefined {
  return COLOREAR_PLANS.find((p) => p.id === planId);
}

