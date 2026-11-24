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
              3. {lang === "es" ? "Limitación de Responsabilidad y Disponibilidad Técnica" : "Limitation of Liability & Technical Availability"}
            </h2>
            <p>
              {lang === "es"
                ? `ATP Dev desarrolla y mantiene ${project.title} siguiendo estándares de ingeniería de software de producción, cifrado en tránsito HTTPS y validación continua. No obstante, el software se proporciona «tal cual» (as-is) sin garantías implícitas de disponibilidad ininterrumpida frente a cortes de red de terceros, mantenimiento programado o incompatibilidades específicas de hardware del dispositivo del usuario. ATP Dev no se responsabiliza por daños directos, indirectos o lucro cesante derivados del uso inadecuado de la aplicación.`
                : `ATP Dev develops and maintains ${project.title} following production software engineering standards, encrypted HTTPS transport, and continuous validation. However, the software is provided "as-is" without implied warranties of uninterrupted availability against third-party network outages, scheduled maintenance, or device-specific hardware incompatibilities. ATP Dev is not liable for any direct, indirect, or consequential damages resulting from improper use of the application.`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              4. {lang === "es" ? "Privacidad, Actualizaciones y Jurisdicción Aplicable" : "Privacy, Updates & Governing Law"}
            </h2>
            <p>
              {lang === "es"
                ? `El tratamiento de datos técnicos, almacenamiento local y preferencias de consentimiento se rige por la Política de Privacidad oficial de ${project.title} y la Ley N° 29733 de Protección de Datos Personales del Perú, en armonía con el Reglamento General de Protección de Datos (RGPD). ATP Dev se reserva el derecho de publicar actualizaciones evolutivas, parches de seguridad y mejoras funcionales en cualquier momento. Para soporte técnico, consultas legales o notificaciones sobre propiedad intelectual, escribe a contacto@atpdev.dev.`
                : `The processing of technical data, local storage, and consent preferences is governed by the official Privacy Policy of ${project.title}, Peruvian Personal Data Protection Law No. 29733, and GDPR standards. ATP Dev reserves the right to release feature updates, security patches, and functional improvements at any time. For technical support, legal inquiries, or intellectual property notices, contact us at contacto@atpdev.dev.`}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`${lang === "es" ? "" : `/${lang}`}/apps/${slug}`}
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
