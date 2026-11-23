import Link from "next/link";
import { translateText, getSiteConfig } from "@atpdev/database";
import { Cookie, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { GlowWrapper } from "@/components/GlowWrapper";
import Navbar from "@/components/Navbar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "es" ? "Política de Cookies" : await translateText("Política de Cookies", lang);
  const description = lang === "es"
    ? "Información sobre cookies técnicas, Consent Mode v2 y cookies de Google AdSense en ATP Dev."
    : await translateText("Información sobre cookies técnicas, Consent Mode v2 y cookies de Google AdSense en ATP Dev.", lang);

  const BASE_URL = "https://www.atpdev.dev";
  const path = "/cookies";
  const indexableLocales = ["es", "en"];
  const shouldIndex = indexableLocales.includes(lang);

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : "/" + lang}${path}`,
      languages: {
        "x-default": `${BASE_URL}${path}`,
        ...Object.fromEntries(
          indexableLocales.map((l) => [l, `${BASE_URL}${l === "es" ? "" : "/" + l}${path}`])
        ),
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${lang === "es" ? "" : "/" + lang}${path}`,
    },
  };
}

export default async function CookiesPolicyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = "es" } = await params;
  const config = await getSiteConfig();

  const t = async (text: string) => {
    if (lang === "es") return text;
    return await translateText(text, lang);
  };

  const texts = {
    back: await t("Volver al inicio"),
    title: await t("Política de Cookies"),
    updated: await t("Última actualización: Noviembre 2026"),
    h1: await t("1. ¿Qué son las cookies y cómo las usamos?"),
    p1: await t("Las cookies son pequeños archivos de texto que tu navegador almacena para recordar preferencias técnicas como el tema visual, la selección de idioma y el estado de tu consentimiento mediante Google Consent Mode v2."),
    h2: await t("2. Categorías de cookies en este sitio"),
    li2_1: await t("Cookies técnicas y de preferencia (esenciales): recuerdan tu modo claro/oscuro, idioma activo y elección en el banner de privacidad sin recopilar información personal identificable."),
    li2_2: await t("Cookies de medición anónima (Google Analytics 4 y Clarity): solo se habilitan cuando otorgas tu consentimiento explícito para evaluar estabilidad, velocidad y calidad de lectura."),
    li2_3: await t("Cookies publicitarias de terceros (Google AdSense): Google y sus socios utilizan cookies para publicar anuncios personalizados o no personalizados según el historial de navegación y tu elección de consentimiento."),
    h3: await t("3. Control de cookies, navegadores y exclusión voluntaria"),
    p3: await t("Nuestro banner de privacidad mantiene por defecto las señales publicitarias y analíticas restringidas bajo Google Consent Mode v2 hasta que confirmes tu preferencia. También puedes aceptar, rechazar o eliminar las cookies desde los ajustes de tu navegador web:"),
    li3_1: await t("Google Chrome: Configuración > Privacidad y seguridad > Cookies de terceros y datos de sitios."),
    li3_2: await t("Mozilla Firefox: Ajustes > Privacidad y seguridad > Protección mejorada contra rastreo y cookies."),
    li3_3: await t("Apple Safari: Preferencias > Privacidad > Bloquear cookies y administración de datos almacenados."),
    li3_4: await t("Microsoft Edge: Configuración > Cookies y permisos del sitio > Administrar y eliminar cookies."),
    p3_note: await t("Ten en cuenta que deshabilitar las cookies técnicas esenciales o el almacenamiento local puede restablecer tu preferencia de tema visual, idioma o volver a mostrar el aviso de consentimiento en futuras visitas. Para gestionar la personalización publicitaria directamente en Google puedes utilizar los enlaces oficiales indicados a continuación:"),
    h4: await t("4. Conservación, normativa aplicable (Ley 29733 / RGPD) y contacto"),
    p4: await t("Conservamos únicamente el registro local mínimo de tu preferencia de consentimiento en tu navegador sin perfilar ni comercializar datos personales. Para ejercer tus derechos ARCO o realizar consultas sobre el uso de cookies en www.atpdev.dev o cualquiera de nuestras plataformas asociadas, escríbenos a contacto@atpdev.dev."),
  };

  const linkPath = lang === "es" ? "/" : `/${lang}`;
  const prefix = lang === "es" ? "" : `/${lang}`;
  const isEn = lang !== "es" && lang !== "pt";
  const enableGlow = config?.enable_glow_effect !== false;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)", color: "var(--text-color)" }}>
      <Navbar />
      <main className="main flex-1 pt-8">
        <GlowWrapper enabled={enableGlow} className="w-full text-[var(--text-color)] transition-colors duration-500 min-h-screen py-16 px-6 relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10 glass-panel neon-border p-8 md:p-12 rounded-3xl shadow-2xl">
            <Link href={linkPath} className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 mb-8 font-semibold transition-colors">
              <ArrowLeft size={18} /> {texts.back}
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl border border-[var(--primary)]/20">
                <Cookie size={28} />
              </div>
              <h1 className="text-3xl md:text-5xl font-black title-gradient">{texts.title}</h1>
            </div>

            <p className="text-sm font-semibold opacity-60 mb-12 uppercase tracking-widest">{texts.updated}</p>

            <div className="space-y-10 leading-relaxed opacity-90">
              <section>
                <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h1}</h2>
                <p>{texts.p1}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h2}</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{texts.li2_1}</li>
                  <li>{texts.li2_2}</li>
                  <li>{texts.li2_3}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h3}</h2>
                <p className="mb-4">{texts.p3}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>{texts.li3_1}</li>
                  <li>{texts.li3_2}</li>
                  <li>{texts.li3_3}</li>
                  <li>{texts.li3_4}</li>
                </ul>
                <p className="mb-4">{texts.p3_note}</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] underline">
                      policies.google.com/technologies/partner-sites
                    </a>
                  </li>
                  <li>
                    <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] underline">
                      adssettings.google.com
                    </a>
                  </li>
                  <li>
                    <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] underline">
                      www.aboutads.info/choices/
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h4}</h2>
                <p>
                  {texts.p4}{" "}
                  <Link href={`${prefix}/privacy`} className="text-[var(--primary)] hover:underline font-semibold">
                    {isEn ? "Privacy Policy" : "Política de Privacidad"}
                  </Link>
                </p>
              </section>
            </div>
          </div>
        </GlowWrapper>
      </main>
      <footer className="border-t py-8 px-4 sm:px-6 text-sm" style={{ borderColor: "var(--glass-border)", color: "var(--text-muted)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATP Dev — Percy Acha Taipe.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href={`${prefix}/`} className="hover:underline">{isEn ? "Home" : "Inicio"}</Link>
            <Link href={`${prefix}/privacy`} className="hover:underline">{isEn ? "Privacy" : "Privacidad"}</Link>
            <Link href={`${prefix}/cookies`} className="hover:underline">{isEn ? "Cookie Policy" : "Política de Cookies"}</Link>
            <Link href={`${prefix}/terms`} className="hover:underline">{isEn ? "Terms" : "Términos"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

