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
  const path = `/apps/${slug}/terms`;
  const title = lang === "es" ? `Términos y Condiciones - ${project.title}` : await translateText(`Terms & Conditions - ${project.title}`, lang);
  return {
    title,
    description: `Términos y Condiciones de uso oficial para la aplicación ${project.title}.`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
    },
  };
}

export default async function DynamicAppTermsPage({
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

  if (legalConfig.has_terms === false) {
    return notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 background-blur-xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
            {lang === "es" ? "Condiciones de Uso" : "Terms of Use"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            {lang === "es" ? `Términos y Condiciones` : `Terms & Conditions`}
          </h1>
          <p className="text-neutral-400 mt-2">
            {project.title} • {lang === "es" ? "Vigente desde Agosto 2026" : "Effective August 2026"}
          </p>
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              1. {lang === "es" ? "Uso de la Aplicación" : "Application Use"}
            </h2>
            <p>
              {lang === "es"
                ? `Al utilizar la aplicación ${project.title}, el usuario acepta cumplir con los presentes términos de uso. La aplicación se ofrece como una herramienta de consulta e interacción digital.`
                : `By using the ${project.title} application, users agree to comply with these terms of use. The app is provided as a digital reference and tool.`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              2. {lang === "es" ? "Propiedad Intelectual" : "Intellectual Property"}
            </h2>
            <p>
              {lang === "es"
                ? `El código fuente, diseño, elementos gráficos y marcas asociadas a ${project.title} son propiedad intelectual de ATP Dev (Percy Acha Taipe), protegidos por las leyes de propiedad intelectual.`
                : `The source code, design, graphic assets, and trademarks associated with ${project.title} are the intellectual property of ATP Dev (Percy Acha Taipe).`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              3. {lang === "es" ? "Limitación de Responsabilidad" : "Limitation of Liability"}
            </h2>
            <p>
              {lang === "es"
                ? `ATP Dev no se responsabiliza por daños directos o indirectos derivados del uso inadecuado o interrupción del servicio de la aplicación.`
                : `ATP Dev is not liable for any direct or indirect damages resulting from inappropriate use or service interruptions of the app.`}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`/${lang}/apps/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← {lang === "es" ? `Volver a ${project.title}` : `Back to ${project.title}`}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            {legalConfig.has_privacy !== false && (
              <Link href={`/apps/${slug}/privacy`} className="hover:underline">
                {lang === "es" ? "Privacidad" : "Privacy"}
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
