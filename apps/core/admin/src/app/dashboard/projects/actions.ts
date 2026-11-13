"use server";
// Trigger dual deployment sync for Vercel admin & portal (All-Active Sync)

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  createProject as dbCreateProject,
  updateProjectStatus as dbUpdateProjectStatus,
  deleteProject as dbDeleteProject,
  getProjects as dbGetProjects,
  syncProjectGithubData,
  fetchGithubAutofillData,
  listGithubRepos,
  fetchScreenshotFromUrl,
  uploadProjectImage,
  uploadProjectApk,
  uploadProjectIpa,
  slugify,

  type GithubAutofillData,
  type GithubRepoSummary,
} from "@atpdev/database";

type AutofillResult = { error: string } | { data: GithubAutofillData };

export async function autofillFromGithub(repoFullName: string): Promise<AutofillResult> {
  if (!repoFullName.trim()) return { error: "Escribe el repo primero (usuario/repo)" };
  const data = await fetchGithubAutofillData(repoFullName.trim());
  if (!data) {
    return {
      error:
        "No se pudo leer ese repo. Verifica el nombre (usuario/repo) y que GITHUB_TOKEN tenga permiso 'repo' si es privado.",
    };
  }
  return { data };
}

export async function autofillProjectWithAI(repoFullName: string, domainType: "subruta" | "subdominio" | "externa" = "subruta"): Promise<AutofillResult> {
  if (!repoFullName.trim()) return { error: "Escribe el repo primero (usuario/repo)" };
  
  // 1. Obtener la data base de GitHub (lenguajes, desc)
  const data = await fetchGithubAutofillData(repoFullName.trim());
  if (!data) {
    return {
      error: "No se pudo leer ese repo. Verifica el nombre y tu GITHUB_TOKEN.",
    };
  }

  // 2. Intentar obtener el README.md para más contexto (API GitHub oficial con Token)
  let readme = "";
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github.v3.raw" };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const readmeRes = await fetch(`https://api.github.com/repos/${repoFullName}/readme`, { headers });
    if (readmeRes.ok) {
      readme = await readmeRes.text();
    } else {
      // Fallback a raw github
      const rawRes = await fetch(`https://raw.githubusercontent.com/${repoFullName}/main/README.md`, { headers });
      if (rawRes.ok) readme = await rawRes.text();
    }
  } catch (e) {
    console.warn("No se pudo obtener el README via API", e);
  }

  // 3. Llamar a Gemini para mejorar la data y generar la long_description
  if (!process.env.GEMINI_API_KEY) {
    console.warn("No hay GEMINI_API_KEY, devolviendo data normal.");
    return { data: { ...data, long_description: "" } as any };
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" }); // Usamos el modelo rápido

    const prompt = `
      Eres un Arquitecto de Producto Senior, Experto en SEO de Google y Diseñador UX/UI de Nivel Dios.
      Analiza este repositorio de GitHub y toma EL CONTROL TOTAL para transformarlo en una publicación de nivel profesional.

      DATOS DE GITHUB:
      Nombre repo: ${repoFullName}
      Título original: ${data.title}
      Descripción original: ${data.description}
      Lenguajes detectados: ${data.stack.join(", ")}
      Categoría sugerida inicial: ${data.category}
      
      README COMPLETO DEL PROYECTO:
      ${readme.substring(0, 5000)}
      
      REGLAS DE SELECCIÓN DE CATEGORÍA / NICHO (CRÍTICO):
      Debes clasificar el proyecto en la categoría/nicho MÁS ESPECÍFICO e impacto de negocio, NUNCA en la plataforma genérica si existe un nicho claro.
      - Si trata sobre códigos de diagnóstico, enfermedades, doctores, salud, CIE-10, CIE-11, medicina, farmacia -> DEBES elegir estrictamente: "Medicina".
      - Si trata sobre videojuegos, entretenimientos, motores de juego -> "Juegos".
      - Si trata sobre audio, música, reproductor -> "Musica".
      - Si trata sobre ecología, clima, sostenibilidad -> "MedioAmbiente".
      - Si trata sobre chatbots, LLMs, modelos de IA, visión artificial -> "IA".
      - Si trata sobre crypto, banca, contabilidad, pagos -> "Finanzas".
      - Si trata sobre gestión, tareas, notas, utilidades de trabajo -> "Productividad".
      - Si trata sobre redes sociales, chat, comunidad -> "Social".
      - Si no encaja en ninguna industria anterior -> "Herramientas" (o "Android" / "iOS" / "Web" si es una app genérica sin nicho industrial).
      Opciones exactas permitidas para "category": "Medicina", "Juegos", "Musica", "MedioAmbiente", "Herramientas", "IA", "Finanzas", "Productividad", "Social", "Android", "iOS", "Web", "Otro".

      REGLAS DE TEMA Y ESTÉTICA (PERSONALIZAR TEMA Y PORTADA):
      Debes crear una configuración visual ("theme_config") espectacular adaptada al nicho y vibe del proyecto:
      - Para "Medicina": Colores médicos/tecnológicos fluidos. Seed/Primary cyan/teal/emerald (#00E5FF, #06B6D4 o #10B981), fondo oscuro slate (#0F172A), fuentes "Hanken Grotesk" e "Inter", glow_style "spotlight-border,neon-harmonic,cursor-ia", neon_thickness "4px".
      - Para "Juegos": Colores gamer neón electrizante (#A855F7 o #EF4444), glow_style "electric,neon-multi,cursor-trail".
      - Para "IA": Púrpura/Índigo futurista (#6366F1 o #8B5CF6), glow_style "spotlight-border,neon-harmonic,cursor-ia".
      - Para otros: Selecciona un seed_color elegante y profesional que combine perfecto con el logo/vibe del proyecto.

      REGLAS DE SEO Y CONTENIDO EN BLOQUES (PROFUNDIDAD SENIOR DE ALTO IMPACTO - 3 A 4 FOTOS):
      1. Título: Máximo 4 palabras, ultra atractivo y profesional.
      2. Descripción corta: Máximo 110 caracteres, enfocada en la propuesta de valor principal.
      3. Extensión y Estructura: Genera un caso de estudio técnico exhaustivo y completo (al menos 5-6 secciones H2 con párrafos explicativos de 100-150 palabras cada uno).
      4. Slots de Imágenes Estratégicas: DEBES incluir EXACTAMENTE entre 3 y 4 bloques de tipo "image" distribuidos a lo largo del artículo para mantener alto engagement visual y aprobación en Google AdSense:
         - Slot 1 de imagen: Captura de la pantalla principal / interfaz de inicio de la aplicación.
         - Slot 2 de imagen: Captura de la funcionalidad estrella (ej. Búsqueda predictiva en tiempo real o uso principal).
         - Slot 3 de imagen: Diagrama de arquitectura técnica (Clean Architecture, Room DB, Coroutines, etc.).
         - Slot 4 de imagen: Captura de métricas de velocidad, interfaz de marcadores/favoritos o modo oscuro.
      5. Para tipo "image", incluye "alt" descriptivo optimizado para SEO, "url": "", y en "context" la instrucción precisa de qué foto subir.

      Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
      {
        "title": "Buscador Médico CIE-10 Pro",
        "description": "App móvil ultra rápida y 100% offline para la búsqueda de diagnósticos médicos CIE-10.",
        "category": "Medicina",
        "stack": ["Kotlin", "Android SDK", "Room Database", "Coroutines", "Clean Architecture"],
        "blocks": [
          { "type": "h2", "content": "El Reto: Acceso Instantáneo a Diagnósticos Médicos" },
          { "type": "p", "content": "Explicación técnica y necesidad del mercado..." },
          { "type": "image", "alt": "Interfaz Principal de la App", "url": "", "context": "Sube aquí una captura de pantalla de la interfaz de búsqueda principal" },
          { "type": "h2", "content": "Búsqueda Predictiva en Milisegundos" },
          { "type": "p", "content": "Detalles del motor de búsqueda..." },
          { "type": "image", "alt": "Demostración de Autocompletado", "url": "", "context": "Sube una captura mostrando la búsqueda predictiva con resultados instantáneos" },
          { "type": "h2", "content": "Arquitectura de Alto Rendimiento y Persistencia Local" },
          { "type": "p", "content": "Explicación de Clean Architecture y Room..." },
          { "type": "image", "alt": "Diagrama de Arquitectura", "url": "", "context": "Sube un diagrama del flujo de datos entre UI, ViewModel y Room DB" },
          { "type": "h2", "content": "Usabilidad, Accesibilidad Médica y Modo Oscuro" },
          { "type": "p", "content": "Detalles sobre diseño visual y fatiga de personal de salud..." },
          { "type": "image", "alt": "Pantalla de Favoritos y Marcadores", "url": "", "context": "Sube una captura de la lista de diagnósticos guardados o vista secundaria" }
        ],
        "theme_config": {
          "theme_mode": "dark",
          "seed_color": "#00E5FF",
          "color_theme": "custom",
          "primary_color": "#00E5FF",
          "secondary_color": "#0F172A",
          "tertiary_color": "#1E293B",
          "neutral_color": "#64748B",
          "font_headline": "Hanken Grotesk",
          "font_body": "Inter",
          "font_label": "JetBrains Mono",
          "radius_scale": "medium",
          "glow_style": "spotlight-border,neon-harmonic,cursor-ia",
          "neon_thickness": "4px"
        }
      }
    `;

    const response = await model.generateContent(prompt);
    let text = response.response.text().trim();
    if (text.startsWith("```json")) text = text.replace(/^```json/, "");
    if (text.startsWith("```")) text = text.replace(/^```/, "");
    if (text.endsWith("```")) text = text.replace(/```$/, "");
    text = text.trim();

    const aiData = JSON.parse(text || "{}");
    const blocksJSON = JSON.stringify(aiData.blocks || []);

    return {
      data: {
        ...data,
        title: aiData.title || data.title,
        description: aiData.description || data.description,
        long_description: blocksJSON,
        stack: Array.isArray(aiData.stack) ? aiData.stack : data.stack,
        category: aiData.category || data.category,
        theme_config: aiData.theme_config ? JSON.stringify(aiData.theme_config) : undefined,
      } as any,
    };
  } catch (error) {
    console.error("Error en Gemini AI autofill:", error);
    return { data: { ...data, long_description: "" } as any };
  }
}

export async function suggestGradientColorsWithAI(title: string, description: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "No hay GEMINI_API_KEY configurada." };
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
      Eres un experto en diseño web y teoría del color.
      Genera una paleta de 4 colores hexadecimales armónicos y estéticamente agradables para usar en un gradiente fluido de fondo, basándote en el contexto de este proyecto:

      TÍTULO: "${title}"
      DESCRIPCIÓN: "${description}"

      Instrucciones:
      Devuelve ÚNICAMENTE un objeto JSON con la propiedad "colors" que contenga un array de 4 strings hexadecimales (ej: ["#123456", "#654321", ...]).
      Asegúrate de que los colores combinen bien para un fondo oscuro moderno (estilo SaaS "Glassmorphism").
    `;

    const response = await model.generateContent(prompt);
    let text = response.response.text().trim();
    if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json/, "");
    if (text.startsWith("\`\`\`")) text = text.replace(/^\`\`\`/, "");
    if (text.endsWith("\`\`\`")) text = text.replace(/\`\`\`$/, "");
    
    const parsed = JSON.parse(text.trim());
    if (parsed.colors && Array.isArray(parsed.colors)) {
      return { colors: parsed.colors };
    } else {
      throw new Error("Formato JSON incorrecto");
    }
  } catch (error) {
    console.error("Error en suggestGradientColorsWithAI:", error);
    return { error: "Error al generar sugerencia de colores." };
  }
}

type ReposResult = { error: string } | { repos: GithubRepoSummary[] };

export async function getGithubRepos(): Promise<ReposResult> {
  const repos = await listGithubRepos();
  if (!repos) {
    return {
      error:
        "No se pudo listar tus repos. Revisa que GITHUB_TOKEN esté en tu .env.local con permiso 'repo'.",
    };
  }
  return { repos };
}

// Si el campo viene vacío, guardamos "#" (sin link, sin botón roto en el portal).
// Si escribiste el dominio sin protocolo (ej. "codehistory.atpdev.dev"), le agregamos https:// solo.
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

type ScreenshotResult = { error: string } | { imageUrl: string };

async function persistProjectImage(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const adminClient = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const safeExt = (fileName.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
      const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
      const { error } = await adminClient.storage
        .from("project-images")
        .upload(objectPath, buffer, { contentType, upsert: true });
      if (!error) {
        const { data } = adminClient.storage.from("project-images").getPublicUrl(objectPath);
        const headRes = await fetch(data.publicUrl, { method: "HEAD", signal: AbortSignal.timeout(8000) });
        if (headRes.ok) {
          return data.publicUrl;
        }
      }
    } catch (err) {
      console.warn("No se pudo subir imagen con service role:", err);
    }
  }
  return uploadProjectImage(buffer, fileName, contentType);
}

// Toma una captura real del sitio en vivo (no del repo). Se usa desde el botón
// "📸 Capturar del sitio" en el formulario, con lo que el usuario ya escribió en URL.
export async function captureScreenshot(siteUrl: string): Promise<ScreenshotResult> {
  const url = normalizeUrl(siteUrl);
  if (url === "#") {
    return { error: "Primero escribe la URL del sitio (Demo/Play Store) para poder capturarla." };
  }
  const outcome = await fetchScreenshotFromUrl(url);
  if ("error" in outcome) {
    return { error: outcome.error };
  }

  // Persistimos la captura en Supabase Storage (o Data URL si Storage falla) para evitar que la URL temporal de Microlink expire con 403.
  try {
    const imgRes = await fetch(outcome.url, { signal: AbortSignal.timeout(15000) });
    if (imgRes.ok) {
      const contentType = imgRes.headers.get("content-type") || "image/png";
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const ext = contentType.includes("jpeg") ? "jpg" : contentType.includes("webp") ? "webp" : "png";
      const permanentUrl = await persistProjectImage(buffer, `capture-${Date.now()}.${ext}`, contentType);
      if (permanentUrl) {
        return { imageUrl: permanentUrl };
      }
      if (buffer.length <= 2 * 1024 * 1024) {
        return { imageUrl: `data:${contentType};base64,${buffer.toString("base64")}` };
      }
    }
  } catch (err) {
    console.warn("No se pudo persistir captura en Storage; usando URL temporal:", err);
  }

  return { imageUrl: outcome.url };
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

// Recibe el archivo que el usuario seleccionó en el <input type="file"> del CMS
// y lo sube a Supabase Storage. Respaldo manual cuando no hay screenshot/GitHub.
export async function uploadImageFile(formData: FormData): Promise<ScreenshotResult> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecciona una imagen primero." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen (PNG, JPG, WEBP...)." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "La imagen pesa más de 5MB, usa una más liviana." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const imageUrl = await persistProjectImage(buffer, file.name, file.type);
  if (!imageUrl) {
    // Fallback inteligente: si Supabase Storage no está disponible o el bucket no es público,
    // convertimos la imagen a base64 Data URL para que se guarde y previsualice sin problemas.
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return { imageUrl: dataUrl };
  }
  return { imageUrl };
}

const MAX_APK_BYTES = 100 * 1024 * 1024; // 100MB

export async function uploadApkFile(formData: FormData): Promise<{ error?: string; apkUrl?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo APK primero." };
  }
  if (!file.name.toLowerCase().endsWith(".apk")) {
    return { error: "El archivo debe tener la extensión .apk" };
  }
  if (file.size > MAX_APK_BYTES) {
    return { error: "El APK pesa más de 100MB, usa un archivo más liviano." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const apkUrl = await uploadProjectApk(buffer, file.name);
  if (!apkUrl) {
    return { error: "No se pudo subir el APK a Supabase Storage." };
  }
  return { apkUrl };
}

const MAX_IPA_BYTES = 100 * 1024 * 1024; // 100MB

export async function uploadIpaFile(formData: FormData): Promise<{ error?: string; ipaUrl?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo IPA (iOS) primero." };
  }
  if (!file.name.toLowerCase().endsWith(".ipa") && !file.name.toLowerCase().endsWith(".zip")) {
    return { error: "El archivo de iOS debe tener extensión .ipa o .zip" };
  }
  if (file.size > MAX_IPA_BYTES) {
    return { error: "El archivo IPA pesa más de 100MB, usa un paquete más liviano." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ipaUrl = await uploadProjectIpa(buffer, file.name);
  if (!ipaUrl) {
    return { error: "No se pudo subir el archivo IPA a Supabase Storage." };
  }
  return { ipaUrl };
}

// Genera una URL prefirmada para subir APK directo a Supabase Storage con streaming y porcentaje en vivo
export async function getApkSignedUploadUrlAction(fileName: string): Promise<{ error?: string; signedUrl?: string; publicUrl?: string }> {
  if (!fileName || !fileName.toLowerCase().endsWith(".apk")) {
    return { error: "El archivo debe ser un .apk válido." };
  }
  const { getProjectSignedUploadUrl } = await import("@atpdev/database");
  const result = await getProjectSignedUploadUrl(fileName, "apks");
  if ("error" in result) {
    return { error: result.error };
  }
  return { signedUrl: result.signedUrl, publicUrl: result.publicUrl };
}

// Genera una URL prefirmada para subir IPA directo a Supabase Storage con streaming y porcentaje en vivo
export async function getIpaSignedUploadUrlAction(fileName: string): Promise<{ error?: string; signedUrl?: string; publicUrl?: string }> {
  if (!fileName || (!fileName.toLowerCase().endsWith(".ipa") && !fileName.toLowerCase().endsWith(".zip"))) {
    return { error: "El archivo debe ser un .ipa o .zip válido." };
  }
  const { getProjectSignedUploadUrl } = await import("@atpdev/database");
  const result = await getProjectSignedUploadUrl(fileName, "ipas");
  if ("error" in result) {
    return { error: result.error };
  }
  return { signedUrl: result.signedUrl, publicUrl: result.publicUrl };
}


export async function createProject(formData: FormData) {
  const domainType = (formData.get("domainType") as string) || "subruta";
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  
  let demolink = normalizeUrl(formData.get("demolink") as string || "");
  if (domainType === "subruta" || demolink === "#" || demolink.includes("/apps/")) {
    demolink = "";
  }
  
  const playstore = normalizeUrl(formData.get("playstore") as string || "");
  const appstore = normalizeUrl(formData.get("appstore") as string || "");
  const stack = (formData.get("stack") as string).split(',').map(s => s.trim());
  const status = formData.get("status") as string;
  const githubRepo = (formData.get("github_repo") as string || "").trim();

  // Si el usuario escribió un slug manual lo respetamos; si no, se autogenera del título.
  const manualSlug = (formData.get("slug") as string || "").trim();
  const slug = manualSlug ? slugify(manualSlug) : slugify(title);

  // Si ya capturaste un screenshot real del sitio (botón 📸), lo respetamos.
  // Si no, usamos un placeholder hasta que sincronices con GitHub o captures uno.
  const capturedImage = (formData.get("image") as string || "").trim();
  const image = capturedImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000";
  const metrics = "N/A"; // Default metric

  const long_description = formData.get("long_description") as string;
  const is_featured = formData.get("is_featured") === "true";
  const theme_config = formData.get("theme_config") as string || null;
  const legal_config = formData.get("legal_config") as string || null;

  const result = await dbCreateProject({
    title,
    slug,
    category,
    description,
    long_description,
    is_featured,
    demolink,
    playstore: playstore === "#" ? undefined : playstore,
    appstore: appstore === "#" ? undefined : appstore,
    stack,
    status,
    image,
    metrics,
    github_repo: githubRepo || undefined,
    theme_config: theme_config || undefined,
    legal_config: legal_config || undefined,
  });

  if (result.success) {
    // Si se indicó un repo de GitHub, traemos stars/lenguaje/descripción en segundo plano.
    // Si ya capturaste un screenshot real del sitio, le decimos a la sync que NO pise esa imagen.
    if (githubRepo) {
      const projects = await dbGetProjects();
      const created = projects.find(p => p.slug === slug);
      if (created) await syncProjectGithubData(created.id, githubRepo, { overwriteImage: !capturedImage });
    }
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout"); // Revalidate main portal too!
    return { success: true };
  } else {
    return { success: false, error: result.error };
  }
}

export async function syncGithub(id: number, repoFullName: string) {
  const success = await syncProjectGithubData(id, repoFullName);
  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/", "layout");
  }
  return success;
}

export async function updateProjectAction(id: number, formData: FormData) {
  const domainType = (formData.get("domainType") as string) || "subruta";
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  let demolink = normalizeUrl(formData.get("demolink") as string || "");
  if (domainType === "subruta" || demolink === "#" || demolink.includes("/apps/")) {
    demolink = "";
  }

  const playstore = normalizeUrl(formData.get("playstore") as string || "");
  const appstore = normalizeUrl(formData.get("appstore") as string || "");
  const stack = (formData.get("stack") as string).split(',').map(s => s.trim());
  const status = formData.get("status") as string;
  const githubRepo = (formData.get("github_repo") as string || "").trim();
  const manualSlug = (formData.get("slug") as string || "").trim();
  const capturedImage = (formData.get("image") as string || "").trim();

  const long_description = formData.get("long_description") as string;
  const is_featured = formData.get("is_featured") === "true";
  const theme_config = formData.get("theme_config") as string || null;
  const legal_config = formData.get("legal_config") as string || null;

  const { updateProject: dbUpdateProject } = await import("@atpdev/database");

  const result = await dbUpdateProject(id, {
    title,
    ...(manualSlug ? { slug: slugify(manualSlug) } : {}),
    category,
    description,
    long_description,
    is_featured,
    demolink,
    playstore: playstore === "#" ? undefined : playstore,
    appstore: appstore === "#" ? undefined : appstore,
    stack,
    status,
    github_repo: githubRepo || undefined,
    theme_config: theme_config || undefined,
    legal_config: legal_config || undefined,
    ...(capturedImage ? { image: capturedImage } : {}),
  });

  if (result.success && githubRepo) {
    await syncProjectGithubData(id, githubRepo, { overwriteImage: !capturedImage });
  }

  if (result.success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
  } else {
    return { success: false, error: result.error };
  }
}

export async function updateStatus(id: number, status: string) {
  const success = await dbUpdateProjectStatus(id, status);
  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
  }
  return success;
}

export async function deleteProject(id: number) {
  const success = await dbDeleteProject(id);
  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
  }
  return success;
}