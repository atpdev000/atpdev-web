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
  const path = "/apps/cie10/credits";
  const title = lang === "es" ? "Créditos y Fuentes - CIE-10 App" : await translateText("Credits & Sources - CIE-10 App", lang);
  return {
    title,
    description: "Información sobre la Clasificación Internacional de Enfermedades (CIE-10), fuentes oficiales OMS y créditos del desarrollador.",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
    },
  };
}

export default async function Cie10CreditsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = "es" } = await params;

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 background-blur-xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
            {lang === "es" ? "Información Oficial" : "Official Information"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            {lang === "es" ? "Créditos y Fuentes Médicas" : "Credits & Medical Sources"}
          </h1>
          <p className="text-neutral-400 mt-2">
            CIE10 - Códigos y Enfermedades (Android App)
          </p>
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {lang === "es" ? "Organización Mundial de la Salud (OMS / WHO)" : "World Health Organization (WHO)"}
            </h2>
            <p>
              La Clasificación Internacional de Enfermedades (CIE-10) es una norma internacional de diagnóstico mantenida y publicada por la <strong>Organización Mundial de la Salud (OMS)</strong>. Esta aplicación utiliza la base de datos oficial codificada para facilitar la búsqueda médica y asistencial.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {lang === "es" ? "Desarrollo y Arquitectura" : "Development & Architecture"}
            </h2>
            <p>
              Desarrollado y mantenido de forma independiente por <strong>Percy Acha Taipe (ATP Dev)</strong>. Diseñado en Android Kotlin nativo con Jetpack Compose y sincronización remota OTA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {lang === "es" ? "Descargo de Responsabilidad Médica" : "Medical Disclaimer"}
            </h2>
            <p className="text-sm bg-neutral-900/60 p-4 rounded-xl border border-white/5 text-neutral-400">
              Esta aplicación está destinada únicamente como una herramienta de referencia y consulta informativa para profesionales de la salud y estudiantes. No reemplaza el juicio clínico profesional ni proporciona diagnósticos médicos.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← {lang === "es" ? "Volver a ATP Dev" : "Back to ATP Dev"}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            <Link href="/apps/cie10/privacy" className="hover:underline">
              {lang === "es" ? "Privacidad" : "Privacy"}
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
