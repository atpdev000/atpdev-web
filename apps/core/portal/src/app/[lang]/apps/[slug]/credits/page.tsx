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
  const path = `/apps/${slug}/credits`;
  const title =
    lang === "es"
      ? `Créditos y Fuentes - ${project.title}`
      : `Credits & Sources - ${project.title}`;
  return {
    title,
    description:
      lang === "es"
        ? `Créditos oficiales, arquitectura y atribuciones de código abierto para la aplicación ${project.title}.`
        : `Official credits, software architecture, and open-source attributions for the ${project.title} application.`,
    robots: {
      index: true,
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
              {lang === "es" ? "Desarrollador Principal y Dirección de Arquitectura" : "Lead Developer & Architecture Direction"}
            </h2>
            <p>
              {lang === "es"
                ? `${project.title} ha sido concebido, diseñado y desarrollado por Percy Acha Taipe (Ingeniero de Sistemas y fundador de ATP Dev en Lima, Perú), aplicando principios de arquitectura limpia (Clean Architecture), diseño centrado en la accesibilidad WCAG 2.1 AA, rendimiento optimizado y privacidad por diseño.`
                : `${project.title} was conceived, designed, and engineered by Percy Acha Taipe (Systems Engineer and founder of ATP Dev in Lima, Peru), applying Clean Architecture principles, WCAG 2.1 AA accessibility, runtime performance optimization, and privacy by design.`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {lang === "es" ? "Tecnologías, Motores y Librerías de Código Abierto" : "Technologies, Engines & Open-Source Libraries"}
            </h2>
            <p className="text-sm bg-neutral-900/60 p-4 rounded-xl border border-white/5 text-neutral-400 mb-3">
              {project.stack.join(" • ")}
            </p>
            <p>
              {lang === "es"
                ? `Agradecemos a las comunidades de código abierto y mantenedores de los ecosistemas utilizados en la pila tecnológica de ${project.title}. Todas las bibliotecas de terceros integradas se emplean respetando estrictamente sus respectivas licencias públicas (MIT, Apache 2.0 y BSD), conservando los avisos de derechos de autor correspondientes.`
                : `We acknowledge the open-source communities and maintainers behind the ecosystems powering ${project.title}. All integrated third-party libraries are used in strict compliance with their respective public licenses (MIT, Apache 2.0, and BSD), preserving all applicable copyright notices.`}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {lang === "es" ? "Infraestructura, Seguridad y Reconocimientos" : "Infrastructure, Security & Acknowledgements"}
            </h2>
            <p>
              {lang === "es"
                ? `La distribución digital, pruebas de regresión automatizadas, validación criptográfica de paquetes y documentación técnica de ${project.title} forman parte del ecosistema de software de ATP Dev (www.atpdev.dev). Si deseas reportar una atribución adicional, colaborar en la mejora técnica o realizar consultas sobre licenciamiento, comunícate con nuestro equipo en contacto@atpdev.dev.`
                : `Digital distribution, automated regression testing, cryptographic package verification, and technical documentation for ${project.title} are maintained as part of the ATP Dev software ecosystem (www.atpdev.dev). To report an attribution notice, contribute technical feedback, or inquire about licensing, contact our team at contacto@atpdev.dev.`}
            </p>
            <p className="mt-3">
              {lang === "es"
                ? `Estándares de Ingeniería y Auditoría de Dependencias: Cada versión de producción de ${project.title} pasa por análisis estático de tipos, auditoría de vulnerabilidades en árbol de dependencias (CVE scanning), optimización de recursos gráficos vectoriales (SVG / WebP) y pruebas de compatibilidad multiplataforma en dispositivos móviles y navegadores modernos. Todos los iconos vectoriales (Lucide Icons), tipografías web optimizadas y módulos de interfaz cumplen con licencias permisivas de distribución comercial y académica.`
                : `Engineering Standards & Dependency Auditing: Every production release of ${project.title} undergoes static type analysis, dependency tree vulnerability auditing (CVE scanning), vector and WebP asset optimization, and cross-platform compatibility testing across mobile devices and modern web browsers. All vector icon sets (Lucide Icons), web fonts, and UI runtime modules comply with permissive commercial and academic distribution licenses.`}
            </p>
            <p className="mt-3">
              {lang === "es"
                ? `Gobernanza de Código Abierto y Transparencia Técnica: En cumplimiento con las cláusulas de atribución de las licencias MIT, Apache License 2.0, BSD-3-Clause e ISC que respaldan los compiladores, entornos de ejecución, motores de renderizado y bibliotecas criptográficas utilizadas en ${project.title}, ATP Dev mantiene la trazabilidad completa de versiones en su repositorio centralizado de integración continua. Ningún componente propietario de terceros ha sido incorporado sin la debida autorización o licencia de uso correspondiente, garantizando la integridad legal, técnica y operativa de la aplicación en entornos personales, educativos y corporativos.`
                : `Open-Source Governance & Technical Transparency: In full compliance with the attribution clauses of the MIT, Apache License 2.0, BSD-3-Clause, and ISC licenses governing the compilers, runtime environments, rendering engines, and cryptographic libraries integrated into ${project.title}, ATP Dev maintains complete version traceability within its centralized continuous integration and deployment pipeline. No proprietary third-party software component or copyrighted asset has been bundled without proper authorization or licensing, ensuring complete legal, technical, and operational integrity across personal, academic, and enterprise production environments worldwide.`}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`${lang === "es" ? "" : `/${lang}`}/apps/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← {lang === "es" ? `Volver a ${project.title}` : `Back to ${project.title}`}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            {legalConfig.has_privacy !== false && (
              <Link href={`${lang === "es" ? "" : `/${lang}`}/apps/${slug}/privacy`} className="hover:underline">
                {lang === "es" ? "Privacidad" : "Privacy"}
              </Link>
            )}
            {legalConfig.has_terms !== false && (
              <>
                <span>•</span>
                <Link href={`${lang === "es" ? "" : `/${lang}`}/apps/${slug}/terms`} className="hover:underline">
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
