"use server";

import { revalidatePath } from "next/cache";
import { updateSiteConfig } from "@atpdev/database";
import { revalidatePortalCache } from "@/lib/revalidate-portal";

export async function saveSettings(formData: FormData) {
  const updates: Record<string, string | string[] | boolean> = {};

  // Text fields
  const textFields = [
    'hero_title', 'hero_subtitle', 'theme_mode', 'seed_color', 'color_theme', 'primary_color', 'secondary_color', 'tertiary_color', 'neutral_color', 'font_headline', 'font_body', 'font_label', 'radius_scale',
    'full_name', 'bio_short', 'bio_long', 'avatar_url',
    'email', 'phone', 'location',
    'github_url', 'linkedin_url', 'twitter_url', 'facebook_url',
    'instagram_url', 'youtube_url', 'tiktok_url', 'whatsapp_url',
    'telegram_url', 'discord_url',
    'cv_url', 'credly_url', 'ga4_id', 'adsense_id', 'glow_style', 'neon_thickness', 'global_background_image'
  ];

  for (const field of textFields) {
    const value = formData.get(field);
    if (value !== null) {
      updates[field] = value as string;
    }
  }

  // Boolean toggle fields (checkboxes)
  const toggleFields = [
    'github_enabled', 'linkedin_enabled', 'twitter_enabled', 'facebook_enabled',
    'instagram_enabled', 'youtube_enabled', 'tiktok_enabled', 'whatsapp_enabled',
    'telegram_enabled', 'discord_enabled', 'enable_glow_effect'
  ];

  for (const field of toggleFields) {
    updates[field] = formData.get(field) === 'on';
  }

  // Typewriter (comma separated)
  const typewriter = formData.get('hero_typewriter') as string;
  if (typewriter) {
    updates['hero_typewriter'] = typewriter.split(',').map(s => s.trim()).filter(Boolean);
  }

  const success = await updateSiteConfig(updates);

  if (success) {
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    await revalidatePortalCache();
  }
}

export async function suggestThemeWithAI(mode: "light" | "dark" = "dark", userPrompt: string = "", includeBackground: boolean = true) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "No hay GEMINI_API_KEY configurada." };
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
      Eres un experto en diseño UI/UX y director de arte digital.
      El usuario está configurando el tema de su portafolio web personal (un portal SaaS para desarrolladores).
      Necesito que generes una configuración visual COMPLETA para un tema en modo "${mode}".
      
      ${userPrompt ? `PREFERENCIA ESPECÍFICA DEL USUARIO: "${userPrompt}" (Asegúrate de que la paleta${includeBackground ? ' y el arte de fondo reflejen' : ' refleje'} exactamente esta vibra/estilo).` : `Genera un tema espectacular, profesional y moderno.`}
      
      Debes proveer:
      1. Paleta Sólida (4 colores para la interfaz).
         - primary: Color de acento principal.
         - secondary: Color secundario.
         - tertiary: Color terciario.
         - neutral: Color neutro.
      ${includeBackground ? `
      2. Arte de Fondo (Gradient Background).
         - type: "mesh", "aurora", "grainy", "flow" o "radial".
         - colors: Un arreglo de 3 a 5 colores HEX armónicos (distintos a los sólidos o variaciones) que se mezclarán en el fondo. Usa colores preferiblemente oscuros si es modo dark, o claros si es light.
         - distortion: un número del 1 al 100 (qué tan distorsionadas/mezcladas están las luces).
         - scale: un número del 1 al 100 (qué tan grande es el efecto).
         - contrast: un número del 80 al 150.
      3. Efecto de Interacción (Mouse Effect).
         - mouse_effect: "spotlight", "tilt", "ripple", "magnet", "glitch", "burst", o "none". (Elige el más adecuado para la "vibra" del diseño. Ej. "glitch" para cyberpunk, "spotlight" para profesional/elegante).
      ` : ''}

      Instrucciones Críticas:
      Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
      {
        "primary": "#HEX",
        "secondary": "#HEX",
        "tertiary": "#HEX",
        "neutral": "#HEX",
        "mouse_effect": "spotlight"${includeBackground ? `,
        "gradient": {
          "type": "mesh",
          "colors": ["#HEX", "#HEX", "#HEX"],
          "distortion": 50,
          "scale": 100,
          "contrast": 110
        }` : ''}
      }
    `;

    const response = await model.generateContent(prompt);
    let text = response.response.text().trim();
    // Limpieza robusta de Markdown
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    const parsed = JSON.parse(text);
    if (parsed.primary && parsed.secondary && parsed.tertiary && parsed.neutral && parsed.mouse_effect) {
      return { data: parsed };
    } else {
      throw new Error("Formato JSON incorrecto");
    }
  } catch (error) {
    console.error("Error en suggestThemeWithAI:", error);
    return { error: "Error al generar sugerencia de colores." };
  }
}
