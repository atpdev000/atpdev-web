/**
 * Configuración central de dominio y URLs para Sorteos Pro
 * Plataforma SaaS de Sorteos Verificables y Herramientas Gratuitas
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://sorteos.atpdev.dev')
).replace(/\/$/, '');

export const SITE_NAME = 'Sorteos Pro';
export const SITE_TITLE = 'Sorteos Pro — Sorteos Gratis en Instagram, Ruleta Aleatoria y Lista de Nombres';
export const SITE_DESCRIPTION =
  'Haz sorteos gratis y certificados en Instagram, TikTok, YouTube y Facebook con hash SHA-256. Incluye ruleta aleatoria, lista de nombres (Excel y capturas OCR), amigo invisible, equipos y dados 3D sin registro.';
export const CONTACT_EMAIL = 'contacto@atpdev.dev';
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137';
export const ADSENSE_PUB_ID = process.env.ADSENSE_PUB_ID || 'pub-5414009811868137';
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'GTM-KGJN7SDL';
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'zak4lzyye9';
