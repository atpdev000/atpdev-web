import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AIModelData } from './aiModels';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yeeupdgjfrkkaurytyrs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_XtR6TNbQPLwkwCeUOYWKEQ_g-8IStIc';

// Singleton pattern – prevents "Multiple GoTrueClient instances" warning
const globalForSupabase = globalThis as unknown as { _supabase?: SupabaseClient };
export const supabase = globalForSupabase._supabase ?? createClient(supabaseUrl, supabaseKey);
if (process.env.NODE_ENV !== 'production') globalForSupabase._supabase = supabase;

export type LegalConfig = {
  has_privacy?: boolean;
  has_terms?: boolean;
  has_credits?: boolean;
  has_ai?: boolean;
  has_admob?: boolean;
  has_source_code?: boolean;
};

// Definición de Tipos
export type Project = {
  id: number;
  title: string;
  slug: string;
  category: string;
  originalCategory?: string; // preserved before translation for filtering
  metrics: string;
  description: string;
  long_description?: string;
  is_featured?: boolean;
  screenshots?: string[];
  stack: string[];
  image: string;
  demolink: string;
  playstore?: string;
  appstore?: string;
  status: string;
  github_repo?: string;
  github_stars?: number;
  github_language?: string;
  github_description?: string;
  github_is_private?: boolean;
  github_synced_at?: string;
  theme_config?: string; // JSON string with theme configuration
  legal_config?: string; // JSON string with legal & dynamic modules configuration
  created_at?: string;
};

// Datos que devuelve la API pública de GitHub para un repo
export type GithubRepoData = {
  stars: number;
  language: string | null;
  description: string | null;
  isPrivate: boolean;
  ogImage: string | null; // null si el repo es privado (no se puede generar la preview)
};

export * from './aiModels';
export * from './analytics';
export * from './jobs';
export * from './scraper';
export * from './organizations';
export * from './canonicalEntities';
export * from './servirRealExtractor';
export type SiteConfig = {
  id: number;
  // Hero
  hero_title: string;
  hero_subtitle: string;
  hero_typewriter: string[];
  // Tema y Colores
  theme_mode: string;
  seed_color: string;
  color_theme: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
  neutral_color: string;
  // Tipografía y Formas
  font_headline: string;
  font_body: string;
  font_label: string;
  radius_scale: string;
  // Perfil
  full_name: string;
  bio_short: string;
  bio_long: string;
  avatar_url: string;
  // Contacto
  email: string;
  phone: string;
  location: string;
  // Redes Sociales
  github_url: string;
  github_enabled: boolean;
  linkedin_url: string;
  linkedin_enabled: boolean;
  twitter_url: string;
  twitter_enabled: boolean;
  facebook_url: string;
  facebook_enabled: boolean;
  instagram_url: string;
  instagram_enabled: boolean;
  youtube_url: string;
  youtube_enabled: boolean;
  tiktok_url: string;
  tiktok_enabled: boolean;
  whatsapp_url: string;
  whatsapp_enabled: boolean;
  telegram_url: string;
  telegram_enabled: boolean;
  discord_url: string;
  discord_enabled: boolean;
  // Links especiales
  cv_url: string;
  credly_url: string;
  // Integraciones
  ga4_id: string;
  adsense_id: string;
  // Efectos visuales
  enable_glow_effect?: boolean;
  glow_style?: string;
  global_background_image?: string;
  // Timestamp
  updated_at?: string;
};

export type ProfileData = {
  id: number;
  name: string;
  birth_date: string;
  phone: string;
  city: string;
  age: number;
  degree: string;
  email: string;
  freelance_status: string;
  bio_short: string;
  bio_long: string;
  stats_clients: number;
  stats_projects: number;
  stats_hours: number;
  stats_students: number;
  created_at?: string;
};

export type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone?: string | null;
  message: string;
  status: string; // 'NUEVO', 'CONTACTADO', 'PENDIENTE', 'PERDIDO'
  created_at?: string;
};

export type Experience = {
  id: number;
  role: string;
  company: string;
  date_range: string;
  description: string;
  icon_key: string; // 'briefcase' | 'book' | 'laptop' | 'activity' | 'star'
  color_key: string; // 'blue' | 'purple' | 'emerald' | 'amber' | 'rose'
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

export type Skill = {
  id: number;
  category: string;
  icon_key: string;
  color_key: string;
  items: string[];
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

// =====================================================
// Funciones de Lectura (Para el Frontend)
// =====================================================
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  const projectsList = (data as Project[]) || [];
  if (!projectsList.some(p => p.slug === 'chamba-pro' || p.slug === 'empleos-pro')) {
    projectsList.unshift(STATIC_CHAMBA_PROJECT);
  }
  return projectsList;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
  if (!error && data) {
    return data as Project;
  }
  if (slug === 'chamba-pro' || slug === 'empleos-pro' || slug === 'chamba') {
    return STATIC_CHAMBA_PROJECT;
  }
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching project by slug:', error);
  }
  return null;
}

const STATIC_CHAMBA_PROJECT: Project = {
  id: 9991,
  title: "chamba pro — Agregador Informativo de Empleos y Convocatorias Perú",
  slug: "chamba-pro",
  category: "Web & SaaS Platform",
  metrics: "⚡ FTS & Google for Jobs",
  description: "Plataforma agregadora de ofertas laborales y convocatorias CAS 1057, 728, 276 y Sector Privado en el Perú con derivación 100% oficial y verificación RUC.",
  long_description: `# 💼 chamba pro — Agregador Informativo de Empleos y Convocatorias Perú

> **Plataforma Web Agregadora de Ofertas Laborales (empleos.atpdev.dev)** construida con Next.js 16 App Router, TypeScript, Tailwind CSS y arquitectura de derivación 100% oficial y transparente.

---

## ⚡ 1. ¿Qué es chamba pro?

**chamba pro** es una plataforma de **agregación informativa laboral para el mercado peruano**. A diferencia de las bolsas tradicionales que imponen registros forzosos o cobran comisiones por postulación, **chamba pro funciona como un motor de búsqueda ultra rápido y transparente**.

Cada oferta laboral o convocatoria publicada es verificada previamente y redirige directamente mediante el botón **"Ver oferta oficial"** a la fuente institucional oficial del Estado (SUNAT, MINEDU, BCRP, Poder Judicial, etc.) o al portal oficial de empleo de las empresas del sector privado.

---

## 🚀 2. Características Clave frente a la Competencia

| Función | Agregadores Tradicionales | **chamba pro** |
| :--- | :--- | :--- |
| **Experiencia de Usuario** | Directorios estáticos lentos con publicidad invasiva. | **Glassmorphic Dark Tech & Clean Light**, 60fps responsive. |
| **Buscador & Filtros** | Búsqueda básica por texto sin combinación de criterios. | **Buscador Instantáneo Multi-Faceta** (Región, Régimen CAS/728/276, Salario, Nivel Educativo). |
| **Optimización SEO** | Metadata básica sin esquema de datos. | **Google for Jobs Nativo (\`JobPosting\` JSON-LD)** para indexación prioritaria en Google. |
| **Pre-Evaluador de CV** | Ninguno. | **Herramienta IA de Compatibilidad CV** para calcular el porcentaje de alineación con los requisitos. |
| **Verificación RUC** | Cero filtro de fraudes. | **Insignia "Verificado" RUC** para validar instituciones oficiales y empresas registradas. |

---

## 🛠️ 3. Arquitectura Técnica y Stack

- **Framework Frontend:** Next.js 16 (App Router) + TypeScript Estricto.
- **Diseño & Estilos:** Tailwind CSS con tipografías Google Fonts (*Space Grotesk*, *Inter*, *IBM Plex Mono*).
- **Esquema SEO:** Inyección dinámica de \`schema.org/JobPosting\` con salarios, ubicaciones y vigencias en PEN.
- **Mapeo de Datos:** \`@atpdev/database\` con modelos de instituciones, regímenes laborales y conteo de vacantes.
`,
  is_featured: true,
  stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "PostgreSQL", "Google for Jobs JSON-LD", "Glassmorphism UI"],
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
  demolink: "https://empleos.atpdev.dev",
  status: "Activo",
  created_at: new Date().toISOString()
};

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const { data, error } = await supabase.from('site_config').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching site_config:', error);
    return null;
  }
  return data as SiteConfig;
}

export async function getProfileData(): Promise<ProfileData | null> {
  const { data, error } = await supabase.from('profile_data').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching profile_data:', error);
    return null;
  }
  return data as ProfileData;
}

export async function getAIModels(): Promise<AIModelData[]> {
  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching ai models:', error);
    return [];
  }
  return data as AIModelData[];
}

export async function createAIModel(model: Partial<AIModelData>): Promise<AIModelData | null> {
  const { data, error } = await adminSupabase
    .from('ai_models')
    .insert([model])
    .select()
    .single();

  if (error) {
    console.error('Error creating ai model:', error);
    return null;
  }
  return data;
}

export async function updateAIModel(id: string, updates: Partial<AIModelData>): Promise<AIModelData | null> {
  const { data, error } = await adminSupabase
    .from('ai_models')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating ai model:', error);
    return null;
  }
  return data;
}

export async function deleteAIModel(id: string): Promise<boolean> {
  const { error } = await adminSupabase
    .from('ai_models')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting ai model:', error);
    return false;
  }
  return true;
}

export async function reorderAIModels(modelIds: string[]): Promise<boolean> {
  let success = true;
  for (let i = 0; i < modelIds.length; i++) {
    const id = modelIds[i];
    const { error } = await adminSupabase
      .from('ai_models')
      .update({ order_index: i })
      .eq('id', id);
    if (error) {
      console.error(`Error reordering model ${id}:`, error);
      success = false;
    }
  }
  return success;
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
  return data as Experience[];
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
  return data as Skill[];
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await adminSupabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  return data as Lead[];
}

// Funciones de Escritura (Para el Admin Panel - Requiere permisos altos)
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const adminSupabase = createClient(supabaseUrl, adminKey || supabaseKey);

export async function updateSiteConfig(newConfig: Partial<SiteConfig>): Promise<boolean> {
  const { error } = await adminSupabase
    .from('site_config')
    .update(newConfig)
    .eq('id', 1);

  if (error) {
    console.error('Error updating site_config:', error);
    return false;
  }
  return true;
}

// Convierte un título en un slug URL-safe: "Lector QR Pro" -> "lector-qr-pro"
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<{ success: boolean, error?: string }> {
  let payload: Record<string, any> = { ...project };
  let attempts = 0;
  while (attempts < 5) {
    const { error } = await adminSupabase.from('projects').insert([payload]);
    if (!error) return { success: true };

    console.error('Error creating project attempt', attempts, error);
    const match = (error.message || '').match(/Could not find the '([^']+)' column/i) || (error.details || '').match(/Could not find the '([^']+)' column/i);
    if (match && match[1] && match[1] in payload) {
      const missingCol = match[1];
      console.warn(`Columna '${missingCol}' no existe en la tabla projects de Supabase. Removiendo automáticamente para guardar.`);
      delete payload[missingCol];
      attempts++;
      continue;
    }
    return { success: false, error: error.message || error.details || "Error desconocido en BD" };
  }
  return { success: false, error: "Máximo de reintentos alcanzado al guardar en BD" };
}

// =====================================================
// Autocompletado de proyectos desde GitHub
// =====================================================

export type GithubAutofillData = {
  title: string;
  description: string;
  long_description?: string;
  stack: string[];
  category: string;
  isPrivate: boolean;
  ogImage: string | null;
};

const CATEGORY_KEYWORDS: { keywords: string[]; category: string }[] = [
  { keywords: ['cie', 'cie10', 'medical', 'salud', 'health', 'doctor', 'medicine', 'enfermedad', 'medicina', 'hospital'], category: 'Medicina' },
  { keywords: ['game', 'juego', 'unity', 'godot', 'play', 'arcade', 'gamer'], category: 'Juegos' },
  { keywords: ['music', 'musica', 'audio', 'sound', 'song', 'mp3', 'spotify'], category: 'Musica' },
  { keywords: ['eco', 'clima', 'environment', 'medio ambiente', 'reciclaje', 'sostenible'], category: 'MedioAmbiente' },
  { keywords: ['finance', 'bank', 'banca', 'crypto', 'money', 'finanzas', 'presupuesto'], category: 'Finanzas' },
  { keywords: ['python', 'jupyter notebook', 'ai', 'ml', 'machine-learning', 'tensorflow', 'pytorch', 'gemini', 'openai'], category: 'IA' },
  { keywords: ['kotlin', 'java', 'android'], category: 'Android' },
  { keywords: ['swift', 'ios'], category: 'iOS' },
  { keywords: ['next.js', 'nextjs', 'react', 'vue', 'typescript', 'javascript', 'html', 'css'], category: 'Web' },
];

function guessCategory(languages: string[], topics: string[]): string {
  const haystack = [...languages, ...topics].map(s => s.toLowerCase());
  for (const rule of CATEGORY_KEYWORDS) {
    if (rule.keywords.some(kw => haystack.includes(kw))) return rule.category;
  }
  return 'Otro';
}

// "lector-qr-pro" -> "Lector Qr Pro"
function repoNameToTitle(repoName: string): string {
  return repoName
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Repo resumido, para el selector tipo "Import Project" de Vercel
export type GithubRepoSummary = {
  full_name: string;
  private: boolean;
  description: string | null;
  language: string | null;
  updated_at: string;
};

// =====================================================
// Subida manual de imagen (respaldo cuando no hay screenshot/GitHub disponible)
// =====================================================

const PROJECT_IMAGES_BUCKET = 'project-images';

// Sube un archivo de imagen al bucket público "project-images" de Supabase Storage
// y devuelve la URL pública para guardarla en el campo `image` del proyecto.
// El bucket debe existir y ser público (ver instrucciones en el mensaje que acompaña esto).
export async function uploadProjectImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string | null> {
  try {
    const ext = fileName.split('.').pop() || 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await adminSupabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(path, fileBuffer, { contentType, upsert: false });

    if (uploadError) {
      console.error('Error subiendo imagen a Storage:', uploadError);
      return null;
    }

    const { data } = adminSupabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Verificar si la URL pública realmente es accesible de forma pública
    try {
      const checkRes = await fetch(publicUrl, { method: 'HEAD' });
      if (!checkRes.ok) {
        console.warn(`Storage: La imagen se subió pero '${publicUrl}' devolvió ${checkRes.status}. El bucket '${PROJECT_IMAGES_BUCKET}' no es público. Usando respaldo base64.`);
        return null; // Retorna null para activar el fallback a base64 Data URL en actions.ts
      }
    } catch (e) {
      console.warn("Storage: No se pudo verificar la URL pública:", e);
    }

    return publicUrl;
  } catch (err) {
    console.error('Error uploading project image:', err);
    return null;
  }
}

// Sube un archivo APK a Supabase Storage y devuelve su URL pública
export async function uploadProjectApk(
  fileBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  try {
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `apks/${Date.now()}-${cleanName}`;

    const { error: uploadError } = await adminSupabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(path, fileBuffer, { contentType: 'application/vnd.android.package-archive', upsert: true });

    if (uploadError) {
      console.error('Error subiendo APK a Storage:', uploadError);
      return null;
    }

    const { data } = adminSupabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error('Error uploading project APK:', err);
    return null;
  }
}

// Sube un archivo IPA (iOS App Package) a Supabase Storage y devuelve su URL pública
export async function uploadProjectIpa(
  fileBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  try {
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `ipas/${Date.now()}-${cleanName}`;

    const { error: uploadError } = await adminSupabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(path, fileBuffer, { contentType: 'application/x-itunes-ipa', upsert: true });

    if (uploadError) {
      console.error('Error subiendo IPA a Storage:', uploadError);
      return null;
    }

    const { data } = adminSupabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error('Error uploading project IPA:', err);
    return null;
  }
}

// Genera una URL firmada para subir archivos pesados (APK, IPA) directamente desde el navegador con progreso en vivo
export async function getProjectSignedUploadUrl(
  fileName: string,
  folder: 'apks' | 'ipas' = 'apks'
): Promise<{ signedUrl: string; publicUrl: string; path: string } | { error: string }> {
  try {
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${folder}/${Date.now()}-${cleanName}`;

    const { data, error } = await adminSupabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data?.signedUrl) {
      console.error('Error creando signed upload URL:', error);
      return { error: error?.message || 'No se pudo generar la URL de subida.' };
    }

    const { data: pubData } = adminSupabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .getPublicUrl(path);

    return {
      signedUrl: data.signedUrl,
      publicUrl: pubData.publicUrl,
      path
    };
  } catch (err: any) {
    console.error('Error en getProjectSignedUploadUrl:', err);
    return { error: err.message || 'Error inesperado generando URL de subida.' };
  }
}


// =====================================================
// Screenshot real del sitio en vivo (tipo Vercel), NO del repo de GitHub
// =====================================================

// Usa Microlink (gratis, sin API key para uso básico) para tomar una captura
// real de la URL desplegada. A diferencia de la preview de GitHub, esto funciona
// para CUALQUIER proyecto (público o privado) porque no depende del repo,
// solo de que la URL esté accesible públicamente en internet.
// Devuelve { url } si funcionó, o { error } con el motivo real (no un mensaje genérico),
// para poder diagnosticar sin adivinar (rate limit, sitio caído, timeout, bloqueado, etc.)
export type ScreenshotOutcome = { url: string } | { error: string };

export async function fetchScreenshotFromUrl(siteUrl: string): Promise<ScreenshotOutcome> {
  const trimmed = siteUrl.trim();
  if (!trimmed || trimmed === '#') return { error: 'URL vacía.' };

  // Primer intento: domcontentloaded (rápido, no espera a que la red quede inactiva).
  // Si falla por timeout, reintentamos una vez con "load" antes de rendirnos.
  const strategies = ['domcontentloaded', 'load'] as const;

  let lastError = 'Error desconocido.';
  for (const waitUntil of strategies) {
    try {
      const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(trimmed)}&screenshot=true&meta=false&viewport.width=1280&viewport.height=800&waitUntil=${waitUntil}`;
      const res = await fetch(endpoint);
      const json: any = await res.json().catch(() => null);

      if (res.status === 429) {
        console.error('Microlink: límite de 50 capturas/día alcanzado.', json);
        return { error: 'Se alcanzó el límite gratuito de Microlink (50 capturas/día). Intenta más tarde o sube la imagen manual.' };
      }
      if (!res.ok) {
        const reason = json?.message || json?.error || res.statusText;
        console.error(`Microlink error (waitUntil=${waitUntil}):`, res.status, reason, json);
        lastError = `Microlink respondió ${res.status}: ${reason}`;
        continue; // probar la siguiente estrategia
      }
      if (json?.status !== 'success' || !json?.data?.screenshot?.url) {
        const reason = json?.message || 'respuesta inesperada de Microlink';
        console.error(`Microlink: no se pudo generar el screenshot (waitUntil=${waitUntil})`, json);
        lastError = `No se pudo generar la captura: ${reason}`;
        continue;
      }
      return { url: json?.data?.screenshot?.url as string };
    } catch (err) {
      console.error(`Error fetching screenshot (waitUntil=${waitUntil}):`, err);
      lastError = `Error de red al contactar Microlink: ${err instanceof Error ? err.message : String(err)}`;
    }
  }
  return { error: lastError };
}

// Toma el screenshot y lo guarda directo en el campo `image` del proyecto.
export async function updateProjectImageFromUrl(id: number, siteUrl: string): Promise<string | null> {
  const outcome = await fetchScreenshotFromUrl(siteUrl);
  if ('error' in outcome) return null;

  const { error } = await adminSupabase.from('projects').update({ image: outcome.url }).eq('id', id);
  if (error) {
    console.error('Error guardando screenshot:', error);
    return null;
  }
  return outcome.url;
}

// Lista los repos del dueño del GITHUB_TOKEN (públicos + privados), ordenados por
// actualización más reciente primero. Requiere GITHUB_TOKEN con scope "repo".
// A diferencia de fetchGithubAutofillData (que pide UN repo puntual), este endpoint
// (/user/repos) SIEMPRE necesita autenticación, incluso para listar tus repos públicos.
export async function listGithubRepos(): Promise<GithubRepoSummary[] | null> {
  if (!process.env.GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN no configurado: no se puede listar repos de GitHub.');
    return null;
  }
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    };
    const res = await fetch(
      'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner',
      { headers }
    );
    if (!res.ok) {
      console.error('Error listando repos de GitHub:', res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    return (data as any[]).map(r => ({
      full_name: r.full_name,
      private: !!r.private,
      description: r.description ?? null,
      language: r.language ?? null,
      updated_at: r.updated_at,
    }));
  } catch (err) {
    console.error('Error listing GitHub repos:', err);
    return null;
  }
}

// Trae toda la data necesaria para autocompletar el formulario del CMS:
// título sugerido, descripción, stack (por % de código), categoría sugerida.
// Funciona igual para repos públicos y privados, siempre que GITHUB_TOKEN tenga scope "repo".
export async function fetchGithubAutofillData(repoFullName: string): Promise<GithubAutofillData | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, langRes, topicsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repoFullName}`, { headers }),
      fetch(`https://api.github.com/repos/${repoFullName}/languages`, { headers }),
      fetch(`https://api.github.com/repos/${repoFullName}/topics`, {
        headers: { ...headers, Accept: 'application/vnd.github+json' },
      }),
    ]);

    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        console.error(
          `GitHub: repo "${repoFullName}" no encontrado o privado sin GITHUB_TOKEN con permiso "repo".`
        );
      }
      return null;
    }

    const repoData: any = await repoRes.json();
    const isPrivate = !!repoData.private;

    // Lenguajes ordenados de mayor a menor % de código (top 4 como stack sugerido)
    let stack: string[] = [];
    if (langRes.ok) {
      const langBytes = (await langRes.json()) as Record<string, number>;
      stack = Object.entries(langBytes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([lang]) => lang);
    } else if (repoData.language) {
      stack = [repoData.language];
    }

    const topics: string[] = topicsRes.ok ? ((await topicsRes.json()) as any).names ?? [] : [];

    return {
      title: repoNameToTitle(repoData.name),
      description: repoData.description ?? '',
      stack,
      category: guessCategory(stack, topics),
      isPrivate,
      ogImage: isPrivate ? null : `https://opengraph.githubassets.com/1/${repoFullName}`,
    };
  } catch (err) {
    console.error('Error fetching GitHub autofill data:', err);
    return null;
  }
}

// Consulta la API de GitHub.
// - Repos públicos: funciona sin token (60 req/hora por IP) o con GITHUB_TOKEN (5000 req/hora).
// - Repos privados: REQUIERE GITHUB_TOKEN con permiso "repo" (no solo "public_repo"),
//   generado en https://github.com/settings/tokens. Sin eso, GitHub devuelve 404 igual
//   que si el repo no existiera (así protege la privacidad).
export async function fetchGithubRepoData(repoFullName: string): Promise<GithubRepoData | null> {
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(`https://api.github.com/repos/${repoFullName}`, { headers });
    if (!res.ok) {
      if (res.status === 404) {
        console.error(
          `GitHub: repo "${repoFullName}" no encontrado o es privado sin GITHUB_TOKEN con permiso "repo".`
        );
      } else {
        console.error(`GitHub API error for ${repoFullName}:`, res.status, res.statusText);
      }
      return null;
    }
    const data: any = await res.json();
    const isPrivate = !!data.private;
    return {
      stars: data.stargazers_count ?? 0,
      language: data.language ?? null,
      description: data.description ?? null,
      isPrivate,
      // Imagen de "social preview" que GitHub genera automáticamente para cada repo público,
      // tipo la que Vercel usa como card. Para repos privados este servicio no puede
      // generarla sin sesión de navegador, así que devolvemos null y se sube manual.
      ogImage: isPrivate ? null : `https://opengraph.githubassets.com/1/${repoFullName}`,
    };
  } catch (err) {
    console.error('Error fetching GitHub repo data:', err);
    return null;
  }
}

// Trae los datos frescos de GitHub para un proyecto y los guarda cacheados en la fila.
// Se llama desde el CMS (botón "Sincronizar GitHub") o desde un cron/revalidate periódico.
export async function syncProjectGithubData(
  id: number,
  repoFullName: string,
  options: { overwriteImage?: boolean } = {}
): Promise<boolean> {
  const { overwriteImage = true } = options;
  const repoData = await fetchGithubRepoData(repoFullName);
  if (!repoData) return false;

  const updatePayload: Record<string, unknown> = {
    github_repo: repoFullName,
    github_stars: repoData.stars,
    github_language: repoData.language,
    github_description: repoData.description,
    github_is_private: repoData.isPrivate,
    github_synced_at: new Date().toISOString(),
  };

  // Solo pisamos la imagen si: GitHub pudo generar la preview (repo público) Y
  // no se pidió respetar una imagen ya capturada manualmente (screenshot real del sitio).
  if (repoData.ogImage && overwriteImage) {
    updatePayload.image = repoData.ogImage;
  }

  const { error } = await adminSupabase.from('projects').update(updatePayload).eq('id', id);

  if (error) {
    console.error('Error syncing GitHub data:', error);
    return false;
  }
  return true;
}

export async function deleteProject(id: number): Promise<boolean> {
  let targetId = id;
  if (targetId === 9991) {
    const { data: realProj } = await adminSupabase.from('projects').select('id').eq('slug', 'chamba-pro').single();
    if (realProj) targetId = realProj.id;
  }
  const { error } = await adminSupabase.from('projects').delete().eq('id', targetId);
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  return true;
}

export async function updateProjectStatus(id: number, status: string): Promise<boolean> {
  let targetId = id;
  if (targetId === 9991) {
    const { data: realProj } = await adminSupabase.from('projects').select('id').eq('slug', 'chamba-pro').single();
    if (realProj) targetId = realProj.id;
  }
  const { error } = await adminSupabase.from('projects').update({ status }).eq('id', targetId);
  if (error) {
    console.error('Error updating project status:', error);
    return false;
  }
  return true;
}

export async function updateProject(id: number, project: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<{ success: boolean, error?: string }> {
  let targetId = id;
  if (targetId === 9991 || project.slug === 'chamba-pro') {
    const { data: realProj } = await adminSupabase.from('projects').select('id').eq('slug', project.slug || 'chamba-pro').single();
    if (realProj) {
      targetId = realProj.id;
    }
  }

  let payload: Record<string, any> = { ...project };
  let attempts = 0;
  while (attempts < 5) {
    const { error } = await adminSupabase.from('projects').update(payload).eq('id', targetId);
    if (!error) return { success: true };

    console.error('Error updating project attempt', attempts, error);
    const match = (error.message || '').match(/Could not find the '([^']+)' column/i) || (error.details || '').match(/Could not find the '([^']+)' column/i);
    if (match && match[1] && match[1] in payload) {
      const missingCol = match[1];
      console.warn(`Columna '${missingCol}' no existe en la tabla projects de Supabase. Removiendo automáticamente para actualizar.`);
      delete payload[missingCol];
      attempts++;
      continue;
    }
    return { success: false, error: error.message || error.details || "Error desconocido en BD" };
  }
  return { success: false, error: "Máximo de reintentos alcanzado al actualizar en BD" };
}

export async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

  const { data, error } = await adminSupabase.storage
    .from('portfolio-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: publicUrlData } = adminSupabase.storage
    .from('portfolio-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>): Promise<boolean> {
  // We use adminSupabase so we can insert without complex RLS, or we can use regular supabase if we enable RLS inserts for public.
  // Since this comes from the public portal, using adminSupabase in a server action is safe and easier.
  const { error } = await adminSupabase.from('leads').insert([{
    ...lead,
    status: 'NUEVO'
  }]);

  if (error) {
    console.error('Error creating lead:', error);
    return false;
  }
  return true;
}

export async function updateLeadStatus(id: number, status: string): Promise<boolean> {
  const { error } = await adminSupabase.from('leads').update({ status }).eq('id', id);
  if (error) {
    console.error('Error updating lead status:', error);
    return false;
  }
  return true;
}

// =====================================================
// Funciones Admin: Experiencias
// =====================================================
export async function getAllExperiences(): Promise<Experience[]> {
  const { data, error } = await adminSupabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching all experiences:', error);
    return [];
  }
  return data as Experience[];
}

export async function createExperience(exp: Omit<Experience, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await adminSupabase.from('experiences').insert([exp]);
  if (error) { console.error('Error creating experience:', error); return false; }
  return true;
}

export async function updateExperience(id: number, exp: Partial<Omit<Experience, 'id' | 'created_at'>>): Promise<boolean> {
  const { error } = await adminSupabase.from('experiences').update(exp).eq('id', id);
  if (error) { console.error('Error updating experience:', error); return false; }
  return true;
}

export async function deleteExperience(id: number): Promise<boolean> {
  const { error } = await adminSupabase.from('experiences').delete().eq('id', id);
  if (error) { console.error('Error deleting experience:', error); return false; }
  return true;
}

// =====================================================
// Funciones Admin: Skills
// =====================================================
export async function getAllSkills(): Promise<Skill[]> {
  const { data, error } = await adminSupabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching all skills:', error);
    return [];
  }
  return data as Skill[];
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await adminSupabase.from('skills').insert([skill]);
  if (error) { console.error('Error creating skill:', error); return false; }
  return true;
}

export async function updateSkill(id: number, skill: Partial<Omit<Skill, 'id' | 'created_at'>>): Promise<boolean> {
  const { error } = await adminSupabase.from('skills').update(skill).eq('id', id);
  if (error) { console.error('Error updating skill:', error); return false; }
  return true;
}

export async function deleteSkill(id: number): Promise<boolean> {
  const { error } = await adminSupabase.from('skills').delete().eq('id', id);
  if (error) { console.error('Error deleting skill:', error); return false; }
  return true;
}

// ==========================================
// INFINITE I18N: TRANSLATION CACHE ENGINE
// ==========================================

import { translate as googleTranslate } from '@vitalets/google-translate-api';

/**
 * Traduce un texto dinámicamente y lo cachea en Supabase.
 * Si el idioma destino es "es" (español), devuelve el original sin traducir.
 * @param sourceText El texto original en español
 * @param targetLang Código del idioma (ej: "en", "ru", "hi")
 */
export async function translateText(sourceText: string, targetLang: string): Promise<string> {
  if (!sourceText) return sourceText;
  if (targetLang === 'es') return sourceText;

  // 1. Buscar en la base de datos de caché
  const { data: cached } = await supabase
    .from('translation_cache')
    .select('translated_text')
    .eq('source_text', sourceText)
    .eq('target_lang', targetLang)
    .single();

  if (cached && cached.translated_text) {
    return cached.translated_text; // Caché hit (0ms extra)
  }

  // 2. Si no está en caché, usamos la API gratuita de Google Translate
  try {
    const { text } = await googleTranslate(sourceText, { to: targetLang });

    // 3. Guardar asíncronamente en Supabase (fire and forget)
    // Usamos adminSupabase (service_role) para garantizar escritura en SSR/SSG saltando RLS
    adminSupabase.from('translation_cache').insert([
      { source_text: sourceText, target_lang: targetLang, translated_text: text }
    ]).then(({ error }) => {
      if (error && error.code !== '23505') { // Ignorar error de unique constraint (race condition)
        console.error('Error caching translation:', error);
      }
    });

    return text;
  } catch (error) {
    console.warn('Translation API rate limit/error (showing original text):', (error as any).message || error);
    // Fallback: devolver el texto original si falla la traducción
    return sourceText;
  }
}

// Exportar configuración de subdominios y sorteos
export * from './subdomains';
export * from './sorteos';
