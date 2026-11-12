// Dynamic imports for fs and path are used inside server-guarded functions to support Next.js client bundling.

export interface SubdomainTheme {
  accent_color: string; // Hex color: e.g. '#10b981'
  accent_name: 'emerald' | 'cyan' | 'indigo' | 'purple' | 'amber' | 'blue' | 'monochrome' | 'custom';
  theme_mode: 'dark' | 'light' | 'system';
  radius_style: 'rounded-none' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  radius_scale?: 'none' | 'small' | 'medium' | 'full';
  seed_color?: string;
  color_theme?: 'vibrant' | 'monochrome' | 'analogous' | 'custom' | string;
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  neutral_color?: string;
  font_headline?: string;
  font_body?: string;
  font_label?: string;
  glow_style?: string;
  neon_thickness?: '2px' | '4px' | '6px' | '8px' | string;
  cursor_effect?: string;
  global_background_image?: string;
}

export interface SubdomainBranding {
  site_title: string;
  site_tagline: string;
  hero_badge: string;
  hero_title_prefix: string;
  hero_title_highlight: string;
  hero_description: string;
  logo_url: string;
  favicon_url: string;
  announcement_text?: string;
  announcement_enabled?: boolean;
}

export interface SubdomainSEO {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  canonical_url: string;
  google_analytics_id?: string;
  microsoft_clarity_id?: string;
  google_search_console_token?: string;
  google_indexing_enabled?: boolean;
  google_indexing_client_email?: string;
  google_indexing_private_key?: string;
}

export interface SubdomainModules {
  scraper_enabled?: boolean;
  public_submissions_enabled?: boolean;
  adsense_enabled?: boolean;
  salary_calculator_enabled?: boolean;
  regimes_comparator_enabled?: boolean;
  ai_simulator_enabled?: boolean;
  cv_generator_enabled?: boolean;
  whatsapp_channel_enabled?: boolean;
  telegram_channel_enabled?: boolean;
  [key: string]: boolean | undefined;
}

export interface SubdomainContact {
  email: string;
  whatsapp: string;
  whatsapp_channel_url?: string;
  telegram_channel_url?: string;
  support_url?: string;
}

export interface SubdomainAPK {
  enabled?: boolean;
  version?: string;
  file_url?: string;
  file_size?: string;
  release_notes?: string;
  playstore_url?: string;
  direct_download_enabled?: boolean;
}

export interface SubdomainMonetization {
  adsense_enabled?: boolean;
  adsense_client_id?: string;
  adsense_slot_header?: string;
  adsense_slot_incontent?: string;
  adsense_slot_sidebar?: string;
  adsense_slot_footer?: string;
  ezoic_enabled?: boolean;
  ezoic_verification_code?: string;
  admob_app_id?: string;
  admob_banner_id?: string;
  admob_interstitial_id?: string;
  admob_rewarded_id?: string;
}

export interface SubdomainBackend {
  provider?: 'render' | 'railway' | 'custom';
  render_url?: string;
  railway_url?: string;
  custom_url?: string;
  active_url?: string;
  auto_fallback_enabled?: boolean;
  timeout_seconds?: number;
}

export interface SubdomainPayments {
  enabled?: boolean;
  provider?: 'multi' | 'stripe' | 'paypal' | 'mercadopago' | 'whatsapp';
  currency?: string; // 'USD' | 'PEN'
  // Pro Creador
  pro_monthly_price?: number;
  pro_annual_price?: number;
  stripe_pro_monthly_url?: string;
  stripe_pro_annual_url?: string;
  mercadopago_pro_monthly_url?: string;
  mercadopago_pro_annual_url?: string;
  paypal_pro_monthly_url?: string;
  paypal_pro_annual_url?: string;
  // Business VIP
  business_monthly_price?: number;
  business_annual_price?: number;
  stripe_business_monthly_url?: string;
  stripe_business_annual_url?: string;
  paypal_business_monthly_url?: string;
  paypal_business_annual_url?: string;
  // WhatsApp VIP / Yape / Plin
  whatsapp_number?: string;
  whatsapp_message_pro?: string;
  whatsapp_message_business?: string;
  // Notificaciones & Cuentas de Cobro
  notification_email?: string;
  stripe_account_email?: string;
  mercadopago_account_email?: string;
  // Licencias / Códigos de activación
  license_keys?: string[];
}

export interface SubdomainConfig {
  id: string; // e.g. 'chamba'
  name: string; // e.g. 'Chamba Pro'
  slug: string; // e.g. 'chamba'
  subdomain: string; // e.g. 'empleos' (empleos.atpdev.dev)
  full_domain: string; // e.g. 'empleos.atpdev.dev'
  production_url?: string;
  devPort: number; // e.g. 3005
  category: string; // e.g. 'Convocatorias & Empleos Perú'
  status: 'active' | 'maintenance' | 'beta';
  theme: SubdomainTheme;
  branding: SubdomainBranding;
  seo: SubdomainSEO;
  modules: SubdomainModules;
  contact: SubdomainContact;
  apk?: SubdomainAPK;
  monetization?: SubdomainMonetization;
  backend?: SubdomainBackend;
  payments?: SubdomainPayments;
  updated_at?: string;
}

export const ACCENT_COLOR_MAP: Record<SubdomainTheme['accent_name'], { hex: string; name: string; glow: string }> = {
  purple:     { hex: '#8b5cf6', name: 'Púrpura Neón (Oficial)',      glow: 'rgba(139, 92, 246, 0.35)' },
  monochrome: { hex: '#ffffff', name: 'Blanco y Negro (Minimalista)', glow: 'rgba(255, 255, 255, 0.35)' },
  emerald:    { hex: '#10b981', name: 'Verde Esmeralda',            glow: 'rgba(16, 185, 129, 0.25)' },
  cyan:       { hex: '#06b6d4', name: 'Azul Cyan Eléctrico',         glow: 'rgba(6, 182, 212, 0.25)' },
  indigo:     { hex: '#6366f1', name: 'Índigo Corporativo',          glow: 'rgba(99, 102, 241, 0.25)' },
  amber:      { hex: '#f59e0b', name: 'Ámbar / Dorado Sunat',        glow: 'rgba(245, 158, 11, 0.25)' },
  blue:       { hex: '#3b82f6', name: 'Azul Estatal Clásico',        glow: 'rgba(59, 130, 246, 0.25)' },
  custom:     { hex: '#8b5cf6', name: 'Personalizado / IA',          glow: 'rgba(139, 92, 246, 0.25)' }
};

export const DEFAULT_CHAMBA_CONFIG: SubdomainConfig = {
  id: 'chamba',
  name: 'Chamba Pro',
  slug: 'chamba',
  subdomain: 'empleos',
  full_domain: 'empleos.atpdev.dev',
  devPort: 3005,
  category: 'Convocatorias & Empleos Perú',
  status: 'active',
  theme: {
    accent_color: '#10b981',
    accent_name: 'emerald',
    theme_mode: 'dark',
    radius_style: 'rounded-2xl',
    radius_scale: 'medium',
    seed_color: '#10b981',
    color_theme: 'vibrant',
    primary_color: '#10b981',
    secondary_color: '#0f172a',
    tertiary_color: '#1e293b',
    neutral_color: '#64748b',
    font_headline: 'Space Grotesk',
    font_body: 'Inter',
    font_label: 'IBM Plex Mono',
    glow_style: 'spotlight-border',
    neon_thickness: '4px',
    cursor_effect: 'cursor-ia',
    global_background_image: ''
  },
  branding: {
    site_title: 'chamba pro',
    site_tagline: 'Agregador de Convocatorias y Empleos Perú',
    hero_badge: 'Buscador Oficial de Empleos Perú 2026',
    hero_title_prefix: 'Encuentra tu próximo empleo en el Estado con',
    hero_title_highlight: 'Chamba Pro',
    hero_description: 'Monitoreo diario de convocatorias CAS 1057, D.L. 728, 276 y sector privado. Postulación directa en portales oficiales sin intermediarios.',
    logo_url: '/icon.svg',
    favicon_url: '/icon.svg',
    announcement_text: '🚀 Actualizado en tiempo real con convocatorias vigentes de SERVIR y entidades públicas.',
    announcement_enabled: true
  },
  seo: {
    meta_title: 'chamba pro — Buscador de Empleos y Convocatorias de Trabajo Perú',
    meta_description: 'El buscador de convocatorias CAS 1057, D.L. 728, 276 y sector privado en Perú. Revisa bases oficiales, requisitos, salarios y postula directamente.',
    keywords: [
      'convocatorias de trabajo',
      'empleos peru',
      'trabajo en el estado',
      'convocatorias cas 2026',
      'servir convocatorias'
    ],
    canonical_url: 'https://empleos.atpdev.dev',
    google_analytics_id: '',
    microsoft_clarity_id: '',
    google_search_console_token: ''
  },
  monetization: {
    adsense_enabled: true,
    adsense_client_id: 'ca-pub-5414009811868137',
    adsense_slot_header: '',
    adsense_slot_incontent: '',
    adsense_slot_sidebar: '',
    adsense_slot_footer: ''
  },
  modules: {
    scraper_enabled: true,
    public_submissions_enabled: true,
    adsense_enabled: true,
    salary_calculator_enabled: true,
    regimes_comparator_enabled: true,
    ai_simulator_enabled: true,
    cv_generator_enabled: true,
    whatsapp_channel_enabled: true,
    telegram_channel_enabled: true
  },
  contact: {
    email: 'contacto@atpdev.dev',
    whatsapp: '+51987654321',
    whatsapp_channel_url: 'https://whatsapp.com/channel/0029Vaexample',
    telegram_channel_url: 'https://t.me/chambapro_peru',
    support_url: 'https://atpdev.dev/contacto'
  },
  updated_at: new Date().toISOString()
};

function getSafeNodeModules() {
  try {
    if (typeof process === 'undefined' || !process.versions?.node || typeof eval === 'undefined') {
      return { fs: null, path: null };
    }
    const nodeReq = eval('require');
    return {
      fs: nodeReq('fs'),
      path: nodeReq('path')
    };
  } catch {
    return { fs: null, path: null };
  }
}

function getConfigFilePath(): string | null {
  try {
    const { fs: fsMod, path: pathMod } = getSafeNodeModules();
    if (!fsMod || !pathMod) return null;

    const cwd = process.cwd();
    const possiblePaths = [
      pathMod.resolve(cwd, 'packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../../packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../../../packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../../../../packages/database/src/subdomain_configs.json')
    ];

    for (const p of possiblePaths) {
      if (fsMod.existsSync(p)) return p;
    }
    for (const p of possiblePaths) {
      if (fsMod.existsSync(pathMod.dirname(p))) return p;
    }
    return possiblePaths[0];
  } catch {
    return null;
  }
}

export const DEFAULT_SORTEOS_CONFIG: SubdomainConfig = {
  id: 'sorteos',
  name: 'Sorteos Pro',
  slug: 'sorteos',
  subdomain: 'sorteos',
  full_domain: 'sorteos.atpdev.dev',
  devPort: 3006,
  category: 'Sorteos & Promociones SaaS Multi-Red',
  status: 'active',
  theme: {
    accent_color: '#d91a7a',
    accent_name: 'custom',
    theme_mode: 'light',
    radius_style: 'rounded-3xl',
    radius_scale: 'medium',
    seed_color: '#d91a7a',
    color_theme: 'appsorteos',
    primary_color: '#d91a7a',
    secondary_color: '#c2146c',
    tertiary_color: '#4f46e5',
    neutral_color: '#0f172a',
    font_headline: 'Inter',
    font_body: 'Inter',
    font_label: 'IBM Plex Mono',
    glow_style: 'none',
    neon_thickness: '2px',
    cursor_effect: 'default',
    global_background_image: ''
  },
  branding: {
    site_title: 'sorteos pro',
    site_tagline: 'Plataforma SaaS de Sorteos Verificables en Redes Sociales',
    hero_badge: 'Certificación Criptográfica SHA-256 • CSPRNG',
    hero_title_prefix: 'Sorteos Transparentes en Redes Sociales con',
    hero_title_highlight: 'Sorteos Pro',
    hero_description: 'Crea sorteos verificables en Instagram, Facebook y YouTube en menos de 3 minutos. Algoritmo no manipulable y 6 herramientas interactivas gratis.',
    logo_url: '/icon.svg',
    favicon_url: '/icon.svg',
    announcement_text: '🎉 Sorteos ilimitados con Ruleta, Dados, Moneda, Equipos y Números 100% gratis.',
    announcement_enabled: true
  },
  seo: {
    meta_title: 'Sorteos Pro — Plataforma SaaS de Sorteos Verificables en Redes Sociales',
    meta_description: 'Crea sorteos transparentes y certificados en Instagram, Facebook y YouTube. Herramientas gratis de ruleta, lista de nombres, dados y monedas con hash criptográfico anti-fraude.',
    keywords: [
      'sorteos instagram',
      'sorteo instagram comentarios',
      'sorteos facebook',
      'ruleta aleatoria',
      'sorteo certificado',
      'sorteos online'
    ],
    canonical_url: 'https://sorteos.atpdev.dev'
  },
  modules: {
    instagram_giveaways_enabled: true,
    facebook_giveaways_enabled: true,
    youtube_giveaways_enabled: true,
    standalone_tools_enabled: true,
    public_certificates_enabled: true,
    billing_stripe_enabled: true,
    superadmin_enabled: true
  },
  contact: {
    email: 'contacto@atpdev.dev',
    whatsapp: '+51987654321',
    support_url: 'https://sorteos.atpdev.dev/planes'
  },
  updated_at: new Date().toISOString()
};

export const DEFAULT_DESCARGADOR_CONFIG: SubdomainConfig = {
  id: 'descargador',
  name: 'Descargador Pro',
  slug: 'descargador',
  subdomain: 'descargador',
  full_domain: 'descargador.atpdev.dev',
  devPort: 3007,
  category: 'Descarga de Video & Audio Multiplataforma',
  status: 'active',
  theme: {
    accent_color: '#3b82f6',
    accent_name: 'blue',
    theme_mode: 'dark',
    radius_style: 'rounded-3xl',
    radius_scale: 'full',
    seed_color: '#3b82f6',
    color_theme: 'ocean',
    primary_color: '#3b82f6',
    secondary_color: '#1d4ed8',
    tertiary_color: '#60a5fa',
    neutral_color: '#64748b',
    font_headline: 'Space Grotesk',
    font_body: 'Inter',
    font_label: 'IBM Plex Mono',
    glow_style: 'full-border',
    neon_thickness: '4px',
    cursor_effect: 'cursor-trail',
    global_background_image: ''
  },
  branding: {
    site_title: 'descargador pro',
    site_tagline: 'Descarga Videos y Audios de Facebook, TikTok e Instagram en Alta Calidad',
    hero_badge: 'Motor Ultra Rápido • Sin Marcas de Agua • 1080p/4K',
    hero_title_prefix: 'Descarga videos y audios gratis con',
    hero_title_highlight: 'Descargador Pro',
    hero_description: 'La herramienta más potente para descargar contenido multimedia de Facebook HD, TikTok sin marca de agua, Instagram y Twitter en MP4 o MP3 al instante.',
    logo_url: '/icon.png',
    favicon_url: '/favicon.ico',
    announcement_text: '⚡ Descargas ilimitadas en máxima calidad sin marcas de agua.',
    announcement_enabled: true
  },
  seo: {
    meta_title: 'Descargador Pro — Descargar Videos de Facebook HD, TikTok Sin Marca de Agua e Instagram Gratis',
    meta_description: 'Descarga videos y música en MP4 y MP3 de TikTok sin marca de agua, Facebook en HD e Instagram en alta definición gratis y rápido.',
    keywords: [
      'descargar tiktok sin marca de agua',
      'descargar video facebook hd',
      'descargar reels instagram',
      'convertidor mp3',
      'bajar videos online'
    ],
    canonical_url: 'https://descargador.atpdev.dev'
  },
  modules: {
    youtube_enabled: false,
    tiktok_enabled: true,
    facebook_enabled: true,
    instagram_enabled: true,
    twitter_enabled: true,
    threads_enabled: true,
    audio_extractor_enabled: true,
    ffmpeg_client_enabled: true,
    adsense_enabled: true,
    admob_enabled: true,
    blog_enabled: true
  },
  contact: {
    email: 'contacto@atpdev.dev',
    whatsapp: '+51987654321',
    support_url: 'https://descargador.atpdev.dev/contact'
  },
  apk: {
    enabled: true,
    version: 'v1.2.0',
    file_url: '/downloads/FTYdownloaderPro.apk',
    file_size: '10.8 MB',
    release_notes: 'Descargas HD/4K sin marcas de agua, reproductor integrado en app tipo WhatsApp y solución de guardado.',
    playstore_url: '',
    direct_download_enabled: true
  },
  monetization: {
    adsense_client_id: 'ca-pub-5414009811868137',
    ezoic_verification_code: 'wStjwIfmHCWL7mcvHPkYWJi6FeTviZ',
    admob_app_id: 'ca-app-pub-5414009811868137~8923412091',
    admob_banner_id: 'ca-app-pub-5414009811868137/1029384756',
    admob_interstitial_id: 'ca-app-pub-5414009811868137/5647382910'
  },
  backend: {
    provider: 'render',
    render_url: 'https://snapnosh-backend.onrender.com',
    railway_url: 'https://backend-freedownloaderpro.up.railway.app',
    custom_url: '',
    active_url: 'https://snapnosh-backend.onrender.com',
    auto_fallback_enabled: true,
    timeout_seconds: 30
  },
  payments: {
    enabled: true,
    provider: 'multi',
    currency: 'USD',
    pro_monthly_price: 3.99,
    pro_annual_price: 47.90,
    stripe_pro_monthly_url: '',
    stripe_pro_annual_url: '',
    paypal_pro_monthly_url: '',
    paypal_pro_annual_url: '',
    business_monthly_price: 11.99,
    business_annual_price: 139.90,
    stripe_business_monthly_url: '',
    stripe_business_annual_url: '',
    paypal_business_monthly_url: '',
    paypal_business_annual_url: '',
    whatsapp_number: '+51987654321',
    whatsapp_message_pro: 'Hola ATP Dev, deseo activar el Plan Pro Creador para Descargador Pro. ¿Me brindas los datos de pago por Yape o Tarjeta?',
    whatsapp_message_business: 'Hola ATP Dev, deseo contratar el Plan Business VIP para mi agencia. ¿Me brindas la información de activación?',
    license_keys: ['PRO-ATP-2026', 'VIP-ATP-2026', 'DESCARGADOR-PRO-VIP']
  },
  updated_at: new Date().toISOString()
};

function getDefaultConfig(id: string): SubdomainConfig {
  if (id === 'sorteos') return { ...DEFAULT_SORTEOS_CONFIG };
  if (id === 'descargador') return { ...DEFAULT_DESCARGADOR_CONFIG };
  if (id === 'magic') return { ...DEFAULT_MAGIC_CONFIG };
  return { ...DEFAULT_CHAMBA_CONFIG };
}

export const DEFAULT_MAGIC_CONFIG: SubdomainConfig = {
  id: 'magic',
  name: 'Interactivo Magic',
  slug: 'magic',
  subdomain: 'magic',
  full_domain: 'magic.atpdev.dev',
  devPort: 3008,
  category: 'Mensajes Interactivos & Tarjetas Mágicas',
  status: 'active',
  theme: {
    accent_color: '#ec4899',
    accent_name: 'custom',
    theme_mode: 'dark',
    radius_style: 'rounded-3xl',
    radius_scale: 'full',
    seed_color: '#ec4899',
    color_theme: 'neon',
    primary_color: '#ec4899',
    secondary_color: '#8b5cf6',
    tertiary_color: '#f43f5e',
    neutral_color: '#0f172a',
    font_headline: 'Outfit',
    font_body: 'Outfit',
    font_label: 'IBM Plex Mono',
    glow_style: 'full-border',
    neon_thickness: '4px',
    cursor_effect: 'cursor-trail',
    global_background_image: ''
  },
  branding: {
    site_title: 'interactivo magic',
    site_tagline: 'Crea Mensajes Mágicos e Interactivos para Sorprender en WhatsApp',
    hero_badge: 'Tarjetas Interactivas • Propuestas • Felicitaciones Mágicas',
    hero_title_prefix: 'Crea mensajes y tarjetas interactivas únicas con',
    hero_title_highlight: 'Interactivo Magic',
    hero_description: 'Sorprende a tus seres queridos con galaxias interactivas, cartas animadas, juegos de amor y felicitaciones personalizadas listas para compartir en WhatsApp.',
    logo_url: '/logo.png',
    favicon_url: '/logo.png',
    announcement_text: '🪄 Más de 30 plantillas mágicas interactivas listas para compartir gratis.',
    announcement_enabled: true
  },
  seo: {
    meta_title: 'Interactivo Magic — Crea Mensajes Mágicos e Interactivos para WhatsApp',
    meta_description: 'Plataforma para crear mensajes interactivos, propuestas de amor, rompecabezas, flores virtuales y felicitaciones de cumpleaños para compartir por WhatsApp.',
    keywords: [
      'mensajes interactivos',
      'propuestas de amor',
      'tarjetas virtuales whatsapp',
      'felicitaciones interactivas',
      'sorpresa digital whatsapp',
      'galaxia de amor'
    ],
    canonical_url: 'https://magic.atpdev.dev'
  },
  modules: {
    templates_enabled: true,
    audio_upload_enabled: true,
    custom_photos_enabled: true,
    whatsapp_share_enabled: true,
    html_download_enabled: true,
    url_shortener_enabled: true,
    admob_enabled: true,
    adsense_enabled: true,
    ezoic_enabled: true
  },
  contact: {
    email: 'contacto@atpdev.dev',
    whatsapp: '+51987654321',
    support_url: 'https://atpdev.dev/contacto'
  },
  updated_at: new Date().toISOString()
};

export const DEFAULT_DNI_CONFIG: SubdomainConfig = {
  id: 'dni',
  name: 'DNI Master Scanner Pro',
  slug: 'dni',
  subdomain: 'dni',
  full_domain: 'dni.atpdev.dev',
  devPort: 3012,
  category: 'Escáner de Documentos & DNI a PDF',
  status: 'active',
  theme: {
    accent_color: '#0284c7',
    accent_name: 'blue',
    theme_mode: 'dark',
    radius_style: 'rounded-2xl',
    radius_scale: 'medium',
    seed_color: '#0284c7',
    color_theme: 'vibrant',
    primary_color: '#0284c7',
    secondary_color: '#38bdf8',
    tertiary_color: '#10b981',
    neutral_color: '#090d16',
    font_headline: 'Inter',
    font_body: 'Inter',
    font_label: 'Inter'
  },
  branding: {
    site_title: 'DNI Master Scanner Pro',
    site_tagline: 'Escáner Inteligente de DNI a PDF con Eliminación Total de Fondo',
    hero_badge: 'Escala 1:1 Oficial • Formato A4 • Recorte Cuadrilátero HD',
    hero_title_prefix: 'Escanea tu DNI y elimina el fondo al 100% con',
    hero_title_highlight: 'DNI Master',
    hero_description: 'Transforma fotos de tu DNI tomadas con el celular en un documento A4 oficial listo para trámites, sin sombras, con bordes redondeados y escala real.',
    logo_url: '/logo.svg',
    favicon_url: '/logo.svg',
    announcement_text: '✨ Nuevo motor de homografía y realce CamScanner activo.',
    announcement_enabled: true
  },
  seo: {
    meta_title: 'DNI Master Scanner Pro — Escanear DNI a PDF Formato A4',
    meta_description: 'Escanea ambas caras de tu DNI, elimina el fondo automáticamente con perspectiva inteligente y genera un PDF A4 oficial para imprimir o enviar.',
    keywords: [
      'escanear dni a pdf',
      'dni formato a4',
      'quitar fondo dni',
      'dni peru pdf',
      'scanner dni digital',
      'copia dni imprimir'
    ],
    canonical_url: 'https://dni.atpdev.dev'
  },
  modules: {
    pdf_export_enabled: true,
    word_export_enabled: true,
    adsense_enabled: true,
    filters_enabled: true
  },
  contact: {
    email: 'contacto@atpdev.dev',
    whatsapp: '+51987654321',
    support_url: 'https://atpdev.dev/contacto'
  },
  updated_at: new Date().toISOString()
};

let inMemoryConfigs: Record<string, SubdomainConfig> = {
  chamba: { ...DEFAULT_CHAMBA_CONFIG },
  sorteos: { ...DEFAULT_SORTEOS_CONFIG },
  descargador: { ...DEFAULT_DESCARGADOR_CONFIG },
  magic: { ...DEFAULT_MAGIC_CONFIG },
  dni: { ...DEFAULT_DNI_CONFIG }
};

export function listSubdomains(): SubdomainConfig[] {
  try {
    const { fs: fsMod } = getSafeNodeModules();
    if (!fsMod) return Object.values(inMemoryConfigs);
    const filePath = getConfigFilePath();
    if (filePath && fsMod.existsSync(filePath)) {
      const data = JSON.parse(fsMod.readFileSync(filePath, 'utf-8'));
      if (typeof data === 'object' && data !== null) {
        inMemoryConfigs = { ...inMemoryConfigs, ...data };
      }
    }
  } catch (err) {
    // Silently fallback to in-memory config in restricted environments
  }
  return Object.values(inMemoryConfigs);
}

export function getSubdomainConfig(id: string): SubdomainConfig {
  const fallback = getDefaultConfig(id);
  try {
    const { fs: fsMod } = getSafeNodeModules();
    if (!fsMod) return inMemoryConfigs[id] || fallback;
    const filePath = getConfigFilePath();
    if (filePath && fsMod.existsSync(filePath)) {
      const data = JSON.parse(fsMod.readFileSync(filePath, 'utf-8'));
      if (data && data[id]) {
        return { ...fallback, ...data[id] };
      }
    }
  } catch (err) {
    // Silently fallback to in-memory config
  }
  return inMemoryConfigs[id] || fallback;
}

export function saveSubdomainConfig(id: string, updates: Partial<SubdomainConfig>): { success: boolean; config: SubdomainConfig } {
  try {
    const current = getSubdomainConfig(id);
    const updated: SubdomainConfig = {
      ...current,
      ...updates,
      theme: { ...current.theme, ...(updates.theme || {}) },
      branding: { ...current.branding, ...(updates.branding || {}) },
      seo: { ...current.seo, ...(updates.seo || {}) },
      modules: { ...current.modules, ...(updates.modules || {}) },
      contact: { ...current.contact, ...(updates.contact || {}) },
      apk: { ...(current.apk || {}), ...(updates.apk || {}) },
      monetization: { ...(current.monetization || {}), ...(updates.monetization || {}) },
      backend: { ...(current.backend || {}), ...(updates.backend || {}) },
      payments: { ...(current.payments || {}), ...(updates.payments || {}) },
      updated_at: new Date().toISOString()
    };

    inMemoryConfigs[id] = updated;

    const { fs: fsMod, path: pathMod } = getSafeNodeModules();
    if (fsMod && pathMod) {
      const filePath = getConfigFilePath();
      if (filePath) {
        const dir = pathMod.dirname(filePath);
        if (!fsMod.existsSync(dir)) {
          fsMod.mkdirSync(dir, { recursive: true });
        }

        let all: Record<string, SubdomainConfig> = {};
        if (fsMod.existsSync(filePath)) {
          try {
            all = JSON.parse(fsMod.readFileSync(filePath, 'utf-8')) || {};
          } catch {}
        }
        all[id] = updated;

        fsMod.writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf-8');
      }
    }
    return { success: true, config: updated };
  } catch (err) {
    console.error(`Error saving config for subdomain ${id}:`, err);
    return { success: false, config: inMemoryConfigs[id] || getDefaultConfig(id) };
  }
}
