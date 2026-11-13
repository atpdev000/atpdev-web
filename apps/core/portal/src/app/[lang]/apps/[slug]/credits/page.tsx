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
  if (!project) return {};

  const BASE_URL = "https://www.atpdev.dev";
  const path = `/apps/${slug}/credits`;
  const title = lang === "es" ? `Créditos y Fuentes - ${project.title}` : await translateText(`Credits & Sources - ${project.title}`, lang);
  return {
    title,
    description: `Créditos oficiales y atribuciones para la aplicación ${project.title}.`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
    },
  };
}

export default async function DynamicAppCreditsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang = "es", slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return notFound();

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

  if (legalConfig.has_credits === false) {
    return notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 background-blur-xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
            {lang === "es" ? "Atribuciones" : "Attributions"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            {lang === "es" ? `Créditos y Fuentes` : `Credits & Sources`}
          </h1>
          <p className="text-neutral-400 mt-2">
            {project.title} • ATP Dev Enterprise
          </p>
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {lang === "es" ? "Desarrollador Principal" : "Lead Developer"}
            </h2>
            <p>
              Desarrollado y diseñado de forma independiente por <strong>Percy Acha Taipe (ATP Dev)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {lang === "es" ? "Tecnologías y Librerías" : "Technologies & Libraries"}
            </h2>
            <p className="text-sm bg-neutral-900/60 p-4 rounded-xl border border-white/5 text-neutral-400">
              {project.stack.join(" • ")}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`/${lang}/apps/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← {lang === "es" ? `Volver a ${project.title}` : `Back to ${project.title}`}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            {legalConfig.has_privacy !== false && (
              <Link href={`/apps/${slug}/privacy`} className="hover:underline">
                {lang === "es" ? "Privacidad" : "Privacy"}
              </Link>
            )}
            {legalConfig.has_terms !== false && (
              <>
                <span>•</span>
                <Link href={`/apps/${slug}/terms`} className="hover:underline">
                  {lang === "es" ? "Términos" : "Terms"}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
