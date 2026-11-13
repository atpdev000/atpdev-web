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
  const path = "/apps/cie10/terms";
  const title = lang === "es" ? "Términos y Condiciones - CIE-10 App" : await translateText("Terms & Conditions - CIE-10 App", lang);
  return {
    title,
    description: "Términos y Condiciones de uso para la aplicación CIE10 - Códigos y Enfermedades. Información sobre el uso de referencias médicas, licencias y responsabilidad.",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
    },
  };
}

export default async function Cie10TermsPage({
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
            {lang === "es" ? "Condiciones de Uso" : "Terms of Use"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            {lang === "es" ? "Términos y Condiciones" : "Terms & Conditions"}
          </h1>
          <p className="text-neutral-400 mt-2">
            CIE10 - Códigos y Enfermedades (Android & iOS App) • {lang === "es" ? "Vigente desde Agosto 2026" : "Effective August 2026"}
          </p>
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              1. {lang === "es" ? "Propósito Educativo y De Consulta" : "Educational & Reference Purpose"}
            </h2>
            <p>
              {lang === "es"
                ? "La aplicación CIE-10 ha sido concebida exclusivamente como una guía de consulta rápida, estudio y referencia académica de la Clasificación Internacional de Enfermedades de la OMS. No constituye un dispositivo médico ni un sistema de diagnóstico automático."
                : "The CIE-10 application is provided exclusively as a reference, academic study, and quick consultation guide for the WHO International Classification of Diseases. It does not constitute a medical device or automated diagnostic system."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              2. {lang === "es" ? "Limitación de Responsabilidad Clínica" : "Limitation of Clinical Liability"}
            </h2>
            <p>
              {lang === "es"
                ? "El usuario o profesional de la salud asume la responsabilidad total del uso del código asignado en la práctica médica real. ATP Dev y sus desarrolladores no se hacen responsables de errores de codificación o decisiones clínicas tomadas a partir de la información de la app."
                : "Users and healthcare professionals assume full responsibility for code selection in medical practice. ATP Dev and its developers are not liable for coding errors or clinical decisions made based on app information."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              3. {lang === "es" ? "Funcionalidad Premium y Recompensas" : "Premium Features & Rewards"}
            </h2>
            <p>
              {lang === "es"
                ? "Los desbloqueos temporales obtenidos al visualizar anuncios de recompensa otorgan acceso ilimitado durante el tiempo estipulado (ej. 10 minutos). Las compras únicas de acceso ilimitado están sujetas a las políticas de facturación de Google Play Store y Apple App Store."
                : "Temporary unlocks obtained by watching rewarded ads grant unlimited access for the specified duration (e.g. 10 minutes). One-time unlimited access purchases are subject to Google Play Store and Apple App Store billing policies."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              4. {lang === "es" ? "Propiedad Intelectual" : "Intellectual Property"}
            </h2>
            <p>
              {lang === "es"
                ? "El diseño de la interfaz, el logotipo, el código fuente y las herramientas interactivas son propiedad intelectual de ATP Dev (Percy Acha Taipe). Los nombres y códigos de diagnósticos pertenecen a la OMS."
                : "The interface design, logo, source code, and interactive tools are intellectual property of ATP Dev (Percy Acha Taipe). Diagnostic titles and codes belong to the WHO."}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`/${lang}/apps/cie10`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← {lang === "es" ? "Volver a CIE-10 App" : "Back to CIE-10 App"}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            <Link href="/apps/cie10/privacy" className="hover:underline">
              {lang === "es" ? "Privacidad" : "Privacy"}
            </Link>
            <span>•</span>
            <Link href="/apps/cie10/credits" className="hover:underline">
              {lang === "es" ? "Créditos" : "Credits"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
