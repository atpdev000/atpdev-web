import Link from "next/link";
import { Mail, MapPin, Clock, ShieldCheck, MessageSquare, Globe, ArrowLeft } from "lucide-react";
import { getSiteConfig, translateText } from "@atpdev/database";
import { getUiDictionary } from "@/utils/i18n-ui";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlowWrapper } from "@/components/GlowWrapper";

export async function buildContactMetadata(lang: string, routeSegment: "contacto" | "contact") {
  const BASE_URL = "https://www.atpdev.dev";
  const indexableLocales = ["es", "en"];
  const shouldIndex = indexableLocales.includes(lang);

  const titleEs = "Contacto Oficial y Soporte Técnico — ATP Dev";
  const descEs =
    "Canales oficiales de contacto, soporte de aplicaciones web y móviles, consultoría Full Stack e información editorial de ATP Dev (Percy Acha Taipe).";
  const title = lang === "es" ? titleEs : await translateText(titleEs, lang);
  const description = lang === "es" ? descEs : await translateText(descEs, lang);

  const canonicalPath = lang === "es" ? "/contacto" : "/en/contact";
  const currentUrl =
    lang === "es" ? `${BASE_URL}/${routeSegment}` : `${BASE_URL}/${lang}/${routeSegment}`;

  return {
    title,
    description,
    robots: {
      index: shouldIndex,
      follow: true,
    },
    alternates: {
      canonical: shouldIndex ? `${BASE_URL}${canonicalPath}` : currentUrl,
      languages: {
        "x-default": `${BASE_URL}/contacto`,
        es: `${BASE_URL}/contacto`,
        en: `${BASE_URL}/en/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonicalPath}`,
    },
  };
}

export default async function ContactPageView({ lang = "es" }: { lang?: string }) {
  const config = await getSiteConfig();
  const isEn = lang !== "es" && lang !== "pt";
  const prefix = lang === "es" ? "" : `/${lang}`;
  const dict = getUiDictionary(lang);
  const t = async (text: string) => (lang === "es" ? text : await translateText(text, lang));
  const enableGlow = config?.enable_glow_effect !== false;

  const copy = {
    back: await t("Volver al inicio"),
    badge: await t("Canal Institucional • ATP Dev Perú"),
    title: await t("Contacto y Soporte Técnico"),
    subtitle: await t(
      "¿Tienes consultas sobre nuestras aplicaciones web, reporte de errores, cumplimiento editorial o solicitudes de consultoría en ingeniería de software? Comunícate directamente con nuestro equipo."
    ),
    emailTitle: await t("Correo Electrónico Institucional"),
    emailDesc: await t(
      "Para soporte técnico de cualquiera de las plataformas del ecosistema ATP Dev, reportes de privacidad, avisos de derechos de autor o propuestas comerciales:"
    ),
    opsTitle: await t("Titularidad y Horario Operativo"),
    opsOwnerLabel: await t("Titular responsable:"),
    opsOwnerVal: "Ing. Percy Acha Taipe (ATP Dev)",
    opsLocationLabel: await t("Sede operativa:"),
    opsLocationVal: "Lima, Perú (GMT-5)",
    opsHoursLabel: await t("Horario de atención:"),
    opsHoursVal: await t("Lunes a Viernes de 9:00 a 18:00 (GMT-5)"),
    opsSlaLabel: await t("Tiempo estimado de respuesta:"),
    opsSlaVal: await t("24 a 48 horas hábiles"),
    scopeTitle: await t("Alcance de Atención por Plataforma"),
    scopeDesc: await t(
      "Atendemos consultas sobre el portal principal atpdev.dev, herramientas de cálculo laboral (Chamba), utilidades documentales y QR (MasterAtPDF y Lector QR Pro), herramientas de sorteos, recetario técnico (Perú Sabor), almanaques educativos y aplicaciones móviles publicadas en Google Play."
    ),
    interactiveTitle: await t("Formulario Interactivo y Canales Directos"),
    interactiveDesc: await t(
      "Si prefieres enviarnos un mensaje detallado o cotización mediante el formulario web interactivo, puedes hacerlo desde la sección de contacto de la página principal."
    ),
    interactiveCta: await t("Ir al formulario interactivo"),
    privacyCta: await t("Leer Política de Privacidad"),
    aboutCta: await t("Conocer Sobre Mí"),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)", color: "var(--text-color)" }}>
      <Navbar />
      <main className="main flex-1 pt-8">
        <GlowWrapper enabled={enableGlow} className="w-full min-h-screen py-16 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <Link
              href={prefix || "/"}
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 font-semibold transition-colors"
            >
              <ArrowLeft size={18} /> {copy.back}
            </Link>

            <header className="space-y-3 border-b pb-6" style={{ borderColor: "var(--glass-border)" }}>
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ borderColor: "var(--glass-border)", color: "var(--accent-text)" }}
              >
                <MessageSquare size={14} /> {copy.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-black title-gradient">{copy.title}</h1>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {copy.subtitle}
              </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="glass-panel neon-border p-6 rounded-2xl space-y-4"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Mail size={20} className="text-[var(--primary)]" />
                  <h2>{copy.emailTitle}</h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {copy.emailDesc}
                </p>
                <a
                  href="mailto:contacto@atpdev.dev"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border hover:opacity-90 transition-opacity"
                  style={{ borderColor: "var(--glass-border)", color: "var(--accent-text)" }}
                >
                  <Mail size={16} /> contacto@atpdev.dev
                </a>
              </div>

              <div
                className="glass-panel neon-border p-6 rounded-2xl space-y-4"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Clock size={20} className="text-[var(--primary)]" />
                  <h2>{copy.opsTitle}</h2>
                </div>
                <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  <li className="flex items-start gap-2">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                    <span>
                      <strong style={{ color: "var(--text-color)" }}>{copy.opsOwnerLabel}</strong> {copy.opsOwnerVal}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                    <span>
                      <strong style={{ color: "var(--text-color)" }}>{copy.opsLocationLabel}</strong> {copy.opsLocationVal}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                    <span>
                      <strong style={{ color: "var(--text-color)" }}>{copy.opsHoursLabel}</strong> {copy.opsHoursVal}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                    <span>
                      <strong style={{ color: "var(--text-color)" }}>{copy.opsSlaLabel}</strong> {copy.opsSlaVal}
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section
              className="glass-panel neon-border p-6 md:p-8 rounded-2xl space-y-4"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <h2 className="text-xl font-bold">{copy.scopeTitle}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {copy.scopeDesc}
              </p>
              <h2 className="text-xl font-bold pt-2">{copy.interactiveTitle}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {copy.interactiveDesc}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`${prefix}/#contact`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--btn-primary-bg)" }}
                >
                  {copy.interactiveCta}
                </a>
                <Link
                  href={`${prefix}/privacy`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border hover:opacity-90 transition-opacity"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  {copy.privacyCta}
                </Link>
                <Link
                  href={`${prefix}/sobre-mi`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border hover:opacity-90 transition-opacity"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  {copy.aboutCta}
                </Link>
              </div>
            </section>
          </div>
        </GlowWrapper>
      </main>
      <Footer config={config} ui={dict} lang={lang} />
    </div>
  );
}

