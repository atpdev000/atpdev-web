import type { Metadata } from "next";
import Link from "next/link";
import { translateText } from "@atpdev/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang = "es" } = await params;
  const BASE_URL = "https://www.atpdev.dev";
  const path = "/apps/cie10/privacy";
  const title = lang === "es" ? "Política de Privacidad - CIE-10 App" : await translateText("Privacy Policy - CIE-10 App", lang);
  return {
    title,
    description: "Política de Privacidad oficial para la aplicación móvil CIE10 - Códigos y Enfermedades (Android e iOS). Cumplimiento AdMob, Gemini IA y privacidad de datos de salud.",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
    },
  };
}

export default async function Cie10PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = "es" } = await params;

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 background-blur-xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            {lang === "es" ? "Legal y Transparencia" : "Legal & Transparency"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            {lang === "es" ? "Política de Privacidad" : "Privacy Policy"}
          </h1>
          <p className="text-neutral-400 mt-2">
            CIE10 - Códigos y Enfermedades (Android & iOS App) • {lang === "es" ? "Última actualización: Agosto 2026" : "Last updated: August 2026"}
          </p>
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              1. {lang === "es" ? "Tratamiento de Datos y Consultas Médicas" : "Data Processing & Medical Queries"}
            </h2>
            <p>
              {lang === "es" 
                ? "La aplicación CIE-10 NO recopila, almacena ni comparte información médica ni historial de salud personal del usuario. Todas las búsquedas de códigos y enfermedades se realizan de manera local en el dispositivo o mediante consultas anonimizadas."
                : "The CIE-10 app DOES NOT collect, store, or share medical information or personal health history from users. All searches for codes and diseases are conducted locally on your device or via anonymized queries."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              2. {lang === "es" ? "Publicidad y Google AdMob" : "Advertising & Google AdMob"}
            </h2>
            <p>
              {lang === "es"
                ? "Utilizamos Google AdMob para mostrar anuncios publicitarios (banners, intersticiales y videos bonificados). Google AdMob puede utilizar identificadores publicitarios del dispositivo (ID de publicidad de Android / IDFA de iOS) para mostrar anuncios contextuales y personalizados de acuerdo con las políticas de privacidad de Google."
                : "We use Google AdMob to display advertisements (banners, interstitials, and rewarded videos). Google AdMob may use device advertising identifiers (Android Advertising ID / iOS IDFA) to serve contextual and personalized ads in compliance with Google Privacy Policies."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              3. {lang === "es" ? "Asistente IA (Google Gemini API)" : "AI Assistant (Google Gemini API)"}
            </h2>
            <p>
              {lang === "es"
                ? "El asistente inteligente opcional procesa los síntomas ingresados a través de la API segura de Google Gemini para sugerir códigos CIE-10 relevantes. Las preguntas enviadas no están vinculadas a la identidad del usuario ni se utilizan para crear perfiles personales."
                : "The optional AI Assistant processes symptoms submitted via the secure Google Gemini API to suggest relevant ICD-10 codes. Queries submitted are not linked to user identity nor used to create personal profiles."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              4. {lang === "es" ? "Almacenamiento Local y Preferencias" : "Local Storage & User Preferences"}
            </h2>
            <p>
              {lang === "es"
                ? "Tus enfermedades favoritas, configuraciones de color de acento y modo visual se guardan exclusivamente de manera local en tu dispositivo utilizando preferencias cifradas. No requerimos registro de cuenta ni recolección de correo electrónico para usar las funciones principales."
                : "Your favorite diseases, accent color settings, and visual theme preferences are stored exclusively on your local device using encrypted preferences. Account creation or email collection is not required to use core features."}
            </p>
          </section>

          <section className="bg-neutral-900/60 p-5 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-2">
              {lang === "es" ? "Contacto y Soporte" : "Contact & Support"}
            </h3>
            <p className="text-sm text-neutral-400">
              {lang === "es"
                ? "Si tienes alguna duda sobre esta política de privacidad, puedes contactarnos directamente a través de nuestro portal oficial "
                : "If you have questions regarding this privacy policy, feel free to contact us via our official portal "}
              <a href="https://www.atpdev.dev" className="text-emerald-400 hover:underline">ATP Dev</a>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`/${lang}/apps/cie10`}
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← {lang === "es" ? "Volver a CIE-10 App" : "Back to CIE-10 App"}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            <Link href="/apps/cie10/credits" className="hover:underline">
              {lang === "es" ? "Créditos" : "Credits"}
            </Link>
            <span>•</span>
            <Link href="/apps/cie10/terms" className="hover:underline">
              {lang === "es" ? "Términos" : "Terms"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
