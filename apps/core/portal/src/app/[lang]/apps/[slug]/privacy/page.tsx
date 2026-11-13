import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, translateText } from "@atpdev/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang = "es", slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project || project.status === "Privado") return {};

  const BASE_URL = "https://www.atpdev.dev";
  const path = `/apps/${slug}/privacy`;
  const title = lang === "es" ? `Política de Privacidad - ${project.title}` : await translateText(`Privacy Policy - ${project.title}`, lang);
  return {
    title,
    description: `Política de Privacidad oficial para la aplicación ${project.title}. Transparencia de datos, publicidad y privacidad.`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
    },
  };
}

export default async function DynamicAppPrivacyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang = "es", slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project || project.status === "Privado") return notFound();

  let legalConfig = {
    has_privacy: true,
    has_terms: true,
    has_credits: true,
    has_ai: true,
    has_admob: true,
  };

  if (project.legal_config) {
    try {
      legalConfig = { ...legalConfig, ...JSON.parse(project.legal_config) };
    } catch {}
  }

  if (legalConfig.has_privacy === false) {
    return notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 background-blur-xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            {lang === "es" ? "Legal y Transparencia" : "Legal & Transparency"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            {lang === "es" ? `Política de Privacidad` : `Privacy Policy`}
          </h1>
          <p className="text-neutral-400 mt-2">
            {project.title} • {lang === "es" ? "Última actualización: Agosto 2026" : "Last updated: August 2026"}
          </p>
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              1. {lang === "es" ? "Tratamiento y Privacidad de Datos" : "Data Processing & Privacy"}
            </h2>
            <p>
              {lang === "es"
                ? `La aplicación ${project.title} respeta la privacidad de sus usuarios. No vendemos ni compartimos información personal sensible. Las funciones principales están diseñadas para operar de manera segura sin requerir registro obligatorio.`
                : `The ${project.title} application respects user privacy. We do not sell or share sensitive personal information. Core features are designed to operate securely without mandatory account registration.`}
            </p>
          </section>

          {legalConfig.has_admob !== false && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                2. {lang === "es" ? "Publicidad y Google AdMob" : "Advertising & Google AdMob"}
              </h2>
              <p>
                {lang === "es"
                  ? "Para mantener la aplicación accesible, podemos mostrar anuncios a través de Google AdMob. Google AdMob puede usar identificadores anónimos del dispositivo (ID de publicidad de Android / IDFA de iOS) para servir anuncios relevantes cumpliendo con las políticas de privacidad de Google."
                  : "To keep the application accessible, we may display ads via Google AdMob. Google AdMob may use anonymous device identifiers (Android Advertising ID / iOS IDFA) to serve relevant ads in compliance with Google Privacy Policies."}
              </p>
            </section>
          )}

          {legalConfig.has_ai !== false && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                3. {lang === "es" ? "Funcionalidades de Inteligencia Artificial (Google Gemini API)" : "AI Features (Google Gemini API)"}
              </h2>
              <p>
                {lang === "es"
                  ? "Las herramientas asistidas por Inteligencia Artificial procesan las consultas a través de la API segura de Google Gemini. Ninguna información enviada se asocia a la identidad real del usuario ni se utiliza para elaboración de perfiles."
                  : "AI-assisted tools process queries securely via the Google Gemini API. Submitted data is not associated with personal user identity nor used for profiling."}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              4. {lang === "es" ? "Almacenamiento Local" : "Local Storage"}
            </h2>
            <p>
              {lang === "es"
                ? "Las preferencias, configuraciones del tema y elementos guardados se almacenan localmente en tu dispositivo para garantizar el funcionamiento rápido e ininterrumpido."
                : "Your preferences, theme settings, and saved items are stored locally on your device to ensure fast and uninterrupted performance."}
            </p>
          </section>

          <section className="bg-neutral-900/60 p-5 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-2">
              {lang === "es" ? "Contacto y Soporte" : "Contact & Support"}
            </h3>
            <p className="text-sm text-neutral-400">
              {lang === "es"
                ? "Si tienes consultas sobre la privacidad de este proyecto, puedes contactar al desarrollador desde "
                : "If you have questions regarding this project's privacy, contact the developer at "}
              <a href="https://www.atpdev.dev" className="text-emerald-400 hover:underline">ATP Dev</a>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`/${lang}/apps/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← {lang === "es" ? `Volver a ${project.title}` : `Back to ${project.title}`}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            {legalConfig.has_terms !== false && (
              <Link href={`/apps/${slug}/terms`} className="hover:underline">
                {lang === "es" ? "Términos" : "Terms"}
              </Link>
            )}
            {legalConfig.has_credits !== false && (
              <>
                <span>•</span>
                <Link href={`/apps/${slug}/credits`} className="hover:underline">
                  {lang === "es" ? "Créditos" : "Credits"}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
