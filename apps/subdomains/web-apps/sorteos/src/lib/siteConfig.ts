/**
 * Configuración central de dominio y URLs para Sorteos Pro
 * Plataforma SaaS de Sorteos Verificables y Herramientas Gratuitas
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://sorteos.atpdev.pe')
).replace(/\/$/, '');

export const SITE_NAME = 'Sorteos Pro';
export const SITE_TITLE = 'Sorteos Pro — Sorteos en Redes y Ruleta Aleatoria';
export const SITE_DESCRIPTION = 'Crea sorteos transparentes y certificados para Instagram, TikTok y YouTube. Herramientas gratis de ruleta, lista de nombres, dados y números aleatorios.';
export const CONTACT_EMAIL = 'contacto@atpdev.pe';
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137';
export const ADSENSE_PUB_ID = process.env.ADSENSE_PUB_ID || 'pub-5414009811868137';
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'GTM-KGJN7SDL';
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'zak4lzyye9';
