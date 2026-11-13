import Link from "next/link";
import { cookies } from "next/headers";
import { translateText, getSiteConfig } from "@atpdev/database";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { GlowWrapper } from "@/components/GlowWrapper";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === 'es' ? "Política de Privacidad" : await translateText("Política de Privacidad", lang);
  const description = lang === 'es' ? "Política de privacidad y protección de datos de los servicios y aplicaciones de ATP Dev." : await translateText("Política de privacidad y protección de datos de los servicios y aplicaciones de ATP Dev.", lang);
  
  const BASE_URL = "https://www.atpdev.dev";
  const path = "/privacy";
  const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
  
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${lang === 'es' ? '' : '/' + lang}${path}`,
      languages: {
        "x-default": `${BASE_URL}${path}`,
        ...Object.fromEntries(
          supportedLocales.map(l => [l, `${BASE_URL}${l === 'es' ? '' : '/' + l}${path}`])
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

export default async function PrivacyPolicy({
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
    title: await t("Política de Privacidad"),
    updated: await t("Última actualización: Agosto 2026"),
    h1: await t("1. Información que recopilamos"),
    p1: await t("Al utilizar este sitio web o contactarnos a través de nuestros formularios, podemos recopilar la siguiente información:"),
    li1_1: await t("Nombre completo"),
    li1_2: await t("Dirección de correo electrónico"),
    li1_3: await t("Información sobre tu proyecto o mensaje"),
    li1_4: await t("Datos de uso anónimos a través de herramientas de analítica web (Google Analytics)."),
    h2: await t("2. Uso de la información"),
    p2: await t("La información recopilada se utiliza exclusivamente para:"),
    li2_1: await t("Responder a tus consultas de desarrollo de software, colaboraciones o propuestas."),
    li2_2: await t("Mejorar la experiencia de usuario en nuestro sitio web."),
    li2_3: await t("Cumplir con las políticas de Google AdSense en nuestros subdominios."),
    h3: await t("3. Uso de Cookies y Publicidad de Terceros (Google AdSense)"),
    p3: await t("Este sitio web y sus plataformas asociadas utilizan cookies y tecnologías de seguimiento de terceros, incluido Google AdSense, para publicar anuncios basados en las visitas anteriores del usuario a este sitio web o a otros sitios web de Internet."),
    li3_1: await t("Proveedores externos: Proveedores de terceros, incluido Google, utilizan cookies para publicar anuncios cuando visitas nuestro sitio web."),
    li3_2: await t("Cookie de DoubleClick / DART: El uso de cookies de publicidad permite a Google y a sus socios publicar anuncios basados en tus visitas a este y otros sitios de Internet."),
    li3_3: await t("Inhabilitación voluntaria: Puedes inhabilitar la publicidad personalizada en cualquier momento visitando la Configuración de Anuncios de Google (https://adssettings.google.com/) o mediante el portal de la Digital Advertising Alliance (https://www.aboutads.info/choices/)."),
    h4: await t("4. Seguridad de tus datos y Normativa Aplicable"),
    p4: await t("Operamos bajo los principios de licitud, consentimiento y finalidad conforme a la Ley N° 29733 (Ley de Protección de Datos Personales) y estándares internacionales como el RGPD. Tus datos personales jamás serán comercializados ni transferidos a terceros no autorizados."),
    h5: await t("5. Contacto y Derechos ARCO"),
    p5: await t("Para ejercer tus derechos de Acceso, Rectificación, Cancelación u Oposición (ARCO), o para consultas sobre esta Política de Privacidad, puedes escribirnos directamente a:"),
  };

  const linkPath = lang === "es" ? "/" : `/${lang}`;
  const enableGlow = config?.enable_glow_effect !== false;

  return (
    <main className="main">
    <GlowWrapper enabled={enableGlow} className="w-full text-[var(--text-color)] transition-colors duration-500 min-h-screen py-16 px-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--tertiary)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 glass-panel neon-border p-8 md:p-12 rounded-3xl shadow-2xl">
        <Link href={linkPath} className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 mb-8 font-semibold transition-colors magnetic-element">
          <ArrowLeft size={18} /> {texts.back}
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl border border-[var(--primary)]/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black title-gradient">{texts.title}</h1>
        </div>
        
        <p className="text-sm font-semibold opacity-60 mb-12 uppercase tracking-widest">{texts.updated}</p>
        
        <div className="space-y-10 leading-relaxed opacity-90">
          
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h1}</h2>
            <p className="mb-4">{texts.p1}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{texts.li1_1}</li>
              <li>{texts.li1_2}</li>
              <li>{texts.li1_3}</li>
              <li>{texts.li1_4}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h2}</h2>
            <p className="mb-4">{texts.p2}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{texts.li2_1}</li>
              <li>{texts.li2_2}</li>
              <li>{texts.li2_3}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h3}</h2>
            <p className="mb-4">{texts.p3}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{texts.li3_1}</li>
              <li>{texts.li3_2}</li>
              <li>{texts.li3_3}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h4}</h2>
            <p>{texts.p4}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h5}</h2>
            <p>{texts.p5} <a href={`mailto:${config?.email || 'hello@atpdev.dev'}`} className="text-[var(--primary)] hover:underline font-semibold magnetic-element inline-block px-2">{config?.email || 'hello@atpdev.dev'}</a></p>
          </section>

        </div>
      </div>
    </GlowWrapper>
    </main>
  );
}
