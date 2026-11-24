import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@atpdev/database";

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
  const title =
    lang === "es"
      ? `Política de Privacidad - ${project.title}`
      : `Privacy Policy - ${project.title}`;
  return {
    title,
    description:
      lang === "es"
        ? `Política de Privacidad oficial para la aplicación ${project.title}. Transparencia de datos, publicidad y privacidad.`
        : `Official Privacy Policy for ${project.title}. Data transparency, local processing, advertising, and user privacy rights.`,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
      languages: {
        es: `${BASE_URL}${path}`,
        en: `${BASE_URL}/en${path}`,
        "x-default": `${BASE_URL}${path}`,
      },
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

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              2. {lang === "es" ? "Publicidad, Consentimiento y Servicios de Google" : "Advertising, Consent & Google Services"}
            </h2>
            <p>
              {legalConfig.has_admob !== false
                ? lang === "es"
                  ? "Para mantener la aplicación accesible de manera gratuita, podemos mostrar anuncios a través de Google AdMob o Google AdSense bajo Google Consent Mode v2. Dichos servicios pueden emplear identificadores anónimos del dispositivo o cookies técnicas conforme a las políticas de privacidad de Google."
                  : "To keep the application accessible for free, we may display ads via Google AdMob or Google AdSense under Google Consent Mode v2. These services may use anonymous device identifiers or technical cookies in strict compliance with Google Privacy Policies."
                : lang === "es"
                  ? `${project.title} opera en un entorno limpio centrado en la productividad del usuario. Cualquier integración futura o analítica agregada respeta estrictamente las señales de Google Consent Mode v2 y nunca comparte identificadores personales con redes de terceros sin consentimiento explícito.`
                  : `${project.title} operates in a clean environment focused on user productivity. Any aggregated analytics or external service integration strictly respects Google Consent Mode v2 signals and never shares personal identifiers with third-party networks without explicit user consent.`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              3. {lang === "es" ? "Procesamiento de Datos e Inteligencia Artificial" : "Data Processing & Artificial Intelligence"}
            </h2>
            <p>
              {legalConfig.has_ai !== false
                ? lang === "es"
                  ? "Las herramientas asistidas por Inteligencia Artificial procesan las consultas a través de canales cifrados hacia la API segura de Google Gemini. Ninguna información enviada se asocia a la identidad real del usuario ni se utiliza para elaboración de perfiles comerciales."
                  : "AI-assisted tools process queries over encrypted channels via the secure Google Gemini API. Submitted data is never associated with personal user identity nor used for commercial profiling."
                : lang === "es"
                  ? `Todos los algoritmos de cálculo, validación y transformación de datos dentro de ${project.title} se ejecutan de forma determinista y local en la memoria del dispositivo o navegador del usuario, sin enviar tus entradas de trabajo a modelos externos de inteligencia artificial.`
                  : `All calculation, validation, and data transformation algorithms within ${project.title} execute deterministically and locally in your device or browser memory, without transmitting your working inputs to external artificial intelligence models.`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              4. {lang === "es" ? "Almacenamiento Local, Seguridad y Derechos del Usuario (Ley N° 29733 / RGPD)" : "Local Storage, Security & User Rights (Law No. 29733 / GDPR)"}
            </h2>
            <p className="mb-3">
              {lang === "es"
                ? "Las preferencias, configuraciones del tema y elementos guardados se almacenan localmente en tu dispositivo para garantizar un funcionamiento rápido, privado e ininterrumpido bajo transporte cifrado HTTPS / TLS 1.3."
                : "Your preferences, theme settings, and saved items are stored locally on your device to ensure fast, private, and uninterrupted performance over encrypted HTTPS / TLS 1.3 transport."}
            </p>
            <p>
              {lang === "es"
                ? `De conformidad con la Ley N° 29733 de Protección de Datos Personales del Perú y el Reglamento General de Protección de Datos (RGPD / GDPR), los usuarios de ${project.title} pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO), así como gestionar o revocar su consentimiento de cookies y publicidad personalizada en cualquier momento desde los controles de privacidad de su dispositivo o navegador.`
                : `In accordance with Peruvian Personal Data Protection Law No. 29733 and the General Data Protection Regulation (GDPR), users of ${project.title} may exercise their rights of access, rectification, erasure, and objection, as well as manage or revoke cookie and personalized advertising consent at any time via their device or browser privacy controls.`}
            </p>
            <p className="mt-3">
              {lang === "es"
                ? `Asimismo, ${project.title} aplica el principio de minimización de datos y aislamiento de permisos del sistema operativo: cualquier acceso opcional a almacenamiento local, cámara, red o sensores se ejecuta estrictamente bajo acción explícita del usuario en primer plano, sin telemetría oculta en segundo plano ni transferencia de archivos personales a terceros no autorizados.`
                : `Furthermore, ${project.title} enforces strict data minimization and operating-system permission sandboxing: any optional access to local device storage, camera hardware, network sockets, or sensors executes exclusively upon explicit foreground user interaction, with zero hidden background telemetry, zero cross-app tracking, and zero transfer of personal files or credentials to unauthorized external servers. All diagnostic logs and crash reports remain anonymized and strictly limited to maintaining stability, security, and compatibility across operating system updates, while users retain complete control to clear local application cache or revoke runtime permissions at any moment.`}
            </p>
          </section>

          <section className="bg-neutral-900/60 p-5 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-2">
              {lang === "es" ? "Contacto y Soporte Oficial" : "Official Contact & Support"}
            </h3>
            <p className="text-sm text-neutral-400">
              {lang === "es"
                ? "Si tienes consultas sobre la privacidad o tratamiento de datos de este proyecto, puedes escribir directamente a contacto@atpdev.dev o visitar el portal principal de "
                : "If you have questions regarding this project's privacy or data handling, email contacto@atpdev.dev or visit "}
              <a href="https://www.atpdev.dev/contacto" className="text-emerald-400 hover:underline">ATP Dev</a>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`${lang === "es" ? "" : `/${lang}`}/apps/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← {lang === "es" ? `Volver a ${project.title}` : `Back to ${project.title}`}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            {legalConfig.has_terms !== false && (
              <Link href={`${lang === "es" ? "" : `/${lang}`}/apps/${slug}/terms`} className="hover:underline">
                {lang === "es" ? "Términos" : "Terms"}
              </Link>
            )}
            {legalConfig.has_credits !== false && (
              <>
                <span>•</span>
                <Link href={`${lang === "es" ? "" : `/${lang}`}/apps/${slug}/credits`} className="hover:underline">
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
