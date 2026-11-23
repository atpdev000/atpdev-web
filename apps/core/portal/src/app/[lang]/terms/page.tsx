import Link from "next/link";
import { cookies } from "next/headers";
import { translateText, getSiteConfig } from "@atpdev/database";
import { Scale, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { GlowWrapper } from "@/components/GlowWrapper";
import Navbar from "@/components/Navbar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === 'es' ? "Términos de Servicio" : await translateText("Términos de Servicio", lang);
  const description = lang === 'es' ? "Términos de servicio y condiciones de uso aplicables a todos los sitios web y subdominios de ATP Dev." : await translateText("Términos de servicio y condiciones de uso aplicables a todos los sitios web y subdominios de ATP Dev.", lang);
  
  const BASE_URL = "https://www.atpdev.dev";
  const path = "/terms";
  const indexableLocales = ['es', 'en'];
  const shouldIndex = indexableLocales.includes(lang);
  
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === 'es' ? '' : '/' + lang}${path}`,
      languages: {
        "x-default": `${BASE_URL}${path}`,
        ...Object.fromEntries(
          indexableLocales.map(l => [l, `${BASE_URL}${l === 'es' ? '' : '/' + l}${path}`])
        )
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${lang === 'es' ? '' : '/' + lang}${path}`,
    },
  };
}

export default async function TermsOfService({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = 'es' } = await params;
  const config = await getSiteConfig();

  const t = async (text: string) => {
    if (lang === "es") return text;
    return await translateText(text, lang);
  };

  const texts = {
    back: await t("Volver al inicio"),
    title: await t("Términos de Servicio"),
    updated: await t("Última actualización: Noviembre 2026"),
    h1: await t("1. Aceptación de los Términos e Identidad del Operador"),
    p1: await t("Al acceder y utilizar el sitio web www.atpdev.dev y sus aplicaciones asociadas bajo el ecosistema ATP Dev, operado por el Ing. Percy Acha Taipe desde Lima, Perú, aceptas cumplir estos Términos de Servicio y toda la normativa aplicable. Si no estás de acuerdo con alguna disposición, te solicitamos abstenerte de utilizar nuestros servicios en línea."),
    h2: await t("2. Propiedad Intelectual y Licencias"),
    p2: await t("Todo el contenido editorial, artículos técnicos, guías de ingeniería, diseños de interfaz, marcas, logotipos y código fuente propietario publicados en ATP Dev pertenecen a Percy Acha Taipe, salvo aquellos componentes o bibliotecas de código abierto expresamente identificados bajo sus respectivas licencias (MIT, Apache 2.0 o GPL). Queda prohibida la extracción automatizada masiva (scraping) o reproducción comercial sin autorización previa por escrito."),
    h3: await t("3. Servicios de Desarrollo de Software y Consultoría"),
    p3: await t("Las solicitudes enviadas mediante nuestra página de contacto o formularios de presupuesto para desarrollo web Full Stack, aplicaciones móviles Android nativas o automatización con IA están sujetas a evaluación técnica y disponibilidad. El envío de una consulta es meramente informativo y los acuerdos comerciales formales se celebran mediante propuesta técnica aprobada por ambas partes."),
    h4: await t("4. Subdominios, Herramientas Web y Publicidad (Google AdSense)"),
    p4: await t("ATP Dev opera utilidades especializadas en subdominios dedicados (incluyendo calculadoras laborales, gestión documental PDF, lectores QR, herramientas gastronómicas y software educativo). Cada plataforma mantiene su propia página de transparencia, política de privacidad y términos específicos. Los sitios informativos financiados mediante publicidad muestran anuncios gestionados a través de Google AdSense respetando los controles de privacidad y cookies aplicables."),
    h5: await t("5. Uso Aceptable y Exactitud de Resultados Automatizados"),
    p5: await t("Nuestras herramientas de cálculo, referencia técnica o asistencia automatizada tienen carácter orientativo y de apoyo profesional. El usuario es responsable de verificar resultados críticos en ámbitos contables, legales, sanitarios o académicos antes de tomar decisiones vinculantes, así como de contar con los derechos sobre cualquier archivo procesado localmente en su navegador."),
    h6: await t("6. Limitación de Responsabilidad y Canal de Contacto"),
    p6: await t("ATP Dev trabaja continuamente para mantener la disponibilidad y seguridad técnica de sus servidores; sin embargo, no será responsable por interrupciones temporales de red, incompatibilidades de navegadores antiguos ni daños indirectos derivados del uso del sitio. Para consultas legales, avisos de derechos de autor o soporte técnico, escríbenos a"),
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
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--tertiary)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 glass-panel neon-border p-8 md:p-12 rounded-3xl shadow-2xl">
        <Link href={linkPath} className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 mb-8 font-semibold transition-colors magnetic-element">
          <ArrowLeft size={18} /> {texts.back}
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-[var(--tertiary)]/10 text-[var(--tertiary)] rounded-xl border border-[var(--tertiary)]/20">
            <Scale size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black title-gradient">{texts.title}</h1>
        </div>
        
        <p className="text-sm font-semibold opacity-60 mb-12 uppercase tracking-widest">{texts.updated}</p>
        
        <div className="space-y-10 leading-relaxed opacity-90">
          
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h1}</h2>
            <p className="mb-4">{texts.p1}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h2}</h2>
            <p className="mb-4">{texts.p2}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h3}</h2>
            <p>{texts.p3}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h4}</h2>
            <p>{texts.p4}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h5}</h2>
            <p>{texts.p5}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h6}</h2>
            <p>
              {texts.p6}{" "}
              <a href="mailto:contacto@atpdev.dev" className="text-[var(--primary)] hover:underline font-semibold">
                contacto@atpdev.dev
              </a>{" "}
              ({isEn ? "or visit our" : "o visita nuestra"}{" "}
              <Link href={`${prefix}/${isEn ? "contact" : "contacto"}`} className="text-[var(--primary)] hover:underline font-semibold">
                {isEn ? "Contact Page" : "página de Contacto"}
              </Link>
              ).
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
          <Link href={`${prefix}/blog`} className="hover:underline">{isEn ? "Articles" : "Artículos"}</Link>
          <Link href={`${prefix}/sobre-mi`} className="hover:underline">{isEn ? "About" : "Sobre Mí"}</Link>
          <Link href={`${prefix}/${isEn ? "contact" : "contacto"}`} className="hover:underline">{isEn ? "Contact" : "Contacto"}</Link>
          <Link href={`${prefix}/privacy`} className="hover:underline">{isEn ? "Privacy" : "Privacidad"}</Link>
          <Link href={`${prefix}/terms`} className="hover:underline">{isEn ? "Terms" : "Términos"}</Link>
        </div>
      </div>
    </footer>
    </div>
  );
}
