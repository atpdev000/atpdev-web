import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { 
  Briefcase, ShieldCheck, Search, PlusCircle, Globe, Award, 
  Calculator, FileText, HelpCircle, Bot, FileSpreadsheet, Scale,
  Mail, ExternalLink, Lock, Building2, Compass, BookOpen, Sparkles
} from "lucide-react";
import { HeaderNav } from "@/components/HeaderNav";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ChambaThemeListener } from "@/components/ChambaThemeListener";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { getSubdomainConfig } from "@atpdev/database";
import { SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
    template: "%s | chamba pro",
  },
  description:
    "Convocatorias de trabajo y chamba en Perú 2026: plazas CAS 1057, 728 y sector privado. Bases oficiales, requisitos y salarios en portales del Estado.",
  keywords: [
    "chamba",
    "chamba peru",
    "empleos",
    "empleos peru",
    "trabajo",
    "trabajo peru",
    "bolsa de trabajo",
    "convocatorias de trabajo",
    "convocatorias de trabajo 2026",
    "trabajo en el estado",
    "convocatorias cas 2026",
    "portal de empleo peru",
    "servir convocatorias",
    "sunat empleos",
    "minedu convocatorias",
    "essalud convocatorias",
    "empleos lima",
    "trabajo lima",
    "trabajo remoto peru",
    "ofertas laborales peru",
    "chamba pro"
  ],
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
    description: "Convocatorias de trabajo y chamba en Perú 2026: plazas CAS 1057, 728 y sector privado. Bases oficiales, requisitos y salarios en portales del Estado.",
    url: SITE_URL,
    siteName: "chamba pro",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "chamba pro — Convocatorias de Trabajo, Empleos y Chamba en Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
    description: "Convocatorias de trabajo y chamba en Perú 2026: plazas CAS 1057, 728 y sector privado. Bases oficiales, requisitos y salarios en portales del Estado.",
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
      "google-adsense-account": "ca-pub-5414009811868137",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getSubdomainConfig("chamba");
  const theme = config.theme || ({} as any);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5414009811868137";
  const gaId = config.seo?.google_analytics_id || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "GTM-KGJN7SDL";
  const clarityId = config.seo?.microsoft_clarity_id || "zak4lzyye9";
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const accentHex = theme.accent_color || theme.primary_color || "#10b981";
  const glowStyle = theme.glow_style || "spotlight-border";
  const neonThickness = theme.neon_thickness || "4px";
  const neonGlow = neonThickness === "2px" ? "10px" : neonThickness === "4px" ? "18px" : neonThickness === "6px" ? "26px" : "36px";
  const radiusScale = theme.radius_scale === 'none' ? '0px' : theme.radius_scale === 'small' ? '0.375rem' : theme.radius_scale === 'medium' ? '1rem' : '9999px';

  return (
    <html lang="es" className={`${theme.theme_mode === 'light' ? 'light' : 'dark'} ${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Core Web Vitals Resource Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Dynamic Subdomain Theme Custom Properties */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --accent-emerald: ${accentHex};
              --accent-primary: ${accentHex};
              --primary: ${accentHex};
              --secondary: ${theme.secondary_color || '#0f172a'};
              --tertiary: ${theme.tertiary_color || '#1e293b'};
              --neutral: ${theme.neutral_color || '#64748b'};
              --neon-thickness: ${neonThickness};
              --neon-glow: ${neonGlow};
              --radius-scale: ${radiusScale};
              ${theme.font_headline ? `--font-space: "${theme.font_headline}", sans-serif; --font-heading: "${theme.font_headline}", sans-serif;` : ''}
              ${theme.font_body ? `--font-inter: "${theme.font_body}", sans-serif; --font-body: "${theme.font_body}", sans-serif;` : ''}
              ${theme.font_label ? `--font-mono: "${theme.font_label}", monospace; --font-label: "${theme.font_label}", monospace;` : ''}
            }
          `
        }} />
        {/* Dynamically Load Google Fonts if customized */}
        {(theme.font_headline || theme.font_body || theme.font_label) && (
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?${[theme.font_headline, theme.font_body, theme.font_label].filter((f): f is string => Boolean(f)).map((f: string) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&')}&display=swap`}
          />
        )}
        {/* Google Consent Mode v2 Default Signals (AdSense & GA4 Compliance) */}
        <script
          id="google-consent-mode-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'granted',
                'wait_for_update': 500
              });
            `
          }}
        />

        {/* Google Analytics 4 (GA4) & Google Tag (GTM) */}
        {gaId && (
          <>
            <Script
              async
              src={
                gaId.startsWith('GTM-')
                  ? `https://www.googletagmanager.com/gtm.js?id=${gaId}`
                  : `https://www.googletagmanager.com/gtag/js?id=${gaId}`
              }
              strategy="afterInteractive"
            />
            <Script id="google-tags-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${gaId.startsWith('G-') ? `gtag('config', '${gaId}', { page_path: window.location.pathname });` : ''}
                ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ''}
              `}
            </Script>
          </>
        )}
        {/* Microsoft Clarity Behavioral Analytics */}
        {clarityId && (
          <Script
            id="microsoft-clarity-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
              `
            }}
          />
        )}
        {/* Google AdSense Script Inyección Oficial */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
        {/* Google Sitelinks Searchbox & WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "chamba pro",
              alternateName: "Chamba Pro Perú",
              url: SITE_URL,
              description: "Buscador de convocatorias CAS 1057, D.L. 728, 276 y sector privado en Perú con enlace directo a fuentes oficiales.",
              inLanguage: "es-PE",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/empleos?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Organization Schema (E-E-A-T & Google Knowledge Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "chamba pro",
              legalName: "ATP DEV",
              url: SITE_URL,
              logo: `${SITE_URL}/icon.svg`,
              sameAs: ["https://atpdev.dev"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "contacto@atpdev.dev",
                availableLanguage: ["Spanish"],
              },
            }),
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-600 selection:text-white transition-colors">
        <ChambaThemeListener />
        <AnalyticsTracker />
        <div className="min-h-screen flex flex-col">
        {/* Top Announcement Bar */}
        {config.branding?.announcement_enabled && (
          <div 
            className="announcement-bar relative overflow-hidden bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-200/80 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 text-xs py-2 px-4 text-center flex items-center justify-center gap-2 print:hidden"
          >
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-900 dark:text-emerald-300">
              Convocatorias Oficiales Perú 2026:
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              {config.branding.announcement_text || "Postulación directa con bases en PDF verificadas en SERVIR y portales institucionales"}
            </span>
          </div>
        )}

        {/* Global Navigation Header (iLovePDF High-Contrast & Spacious Design) */}
        <HeaderNav />

        {/* Main Content Area */}
        <main className="min-h-[calc(100vh-180px)]">{children}</main>

        {/* Global Footer (Google AdSense & E-E-A-T Compliant) */}
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 py-16 px-4 sm:px-6 lg:px-8 mt-20 text-slate-600 dark:text-slate-400 text-xs transition-colors">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Col 1: Brand & Transparencia */}
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center font-bold font-display shadow-sm">
                    ch
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-sm font-display">chamba pro — atpdev.dev</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Plataforma Agregadora de Empleos y Convocatorias en Perú</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-md">
                  Chamba Pro es una iniciativa tecnológica independiente desarrollada por <strong>ATP DEV</strong>. Nuestro objetivo es acercar las convocatorias de trabajo transparentes a todo el Perú, combatiendo fraudes y redirigiendo 100% a las fuentes oficiales de SERVIR y empresas verificadas.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <Link href="/convocatorias/cas" className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-emerald-500/10 border border-slate-300 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:bg-emerald-500/20 transition-colors">CAS 1057</Link>
                  <Link href="/convocatorias/728" className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-emerald-500/10 border border-slate-300 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:bg-emerald-500/20 transition-colors">D.L. 728</Link>
                  <Link href="/convocatorias/privado" className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-emerald-500/10 border border-slate-300 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:bg-emerald-500/20 transition-colors">Sector Privado</Link>
                  <Link href="/convocatorias/practicas" className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-emerald-500/10 border border-slate-300 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:bg-emerald-500/20 transition-colors">Prácticas</Link>
                  <Link href="/convocatorias/locacion" className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-emerald-500/10 border border-slate-300 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:bg-emerald-500/20 transition-colors">Locación</Link>
                </div>
              </div>

              {/* Col 2: Herramientas Gratuitas */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider font-mono">
                  Herramientas Gratuitas
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link href="/guias" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <BookOpen size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Guías Laborales y Manuales CAS</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/match-cv" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Recomendador de CV con IA</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculadora-sueldo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Calculadora de Sueldo Neto CAS
                    </Link>
                  </li>
                  <li>
                    <Link href="/crear-cv-cas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Creador de CV para el Estado
                    </Link>
                  </li>
                  <li>
                    <Link href="/simulador-entrevista-ia" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Simulador de Entrevista con IA
                    </Link>
                  </li>
                  <li>
                    <Link href="/comparador-regimenes" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Comparador CAS vs 728 vs 276
                    </Link>
                  </li>
                  <li>
                    <Link href="/plantillas-anexos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Descarga de Anexos SERVIR
                    </Link>
                  </li>
                  <li>
                    <Link href="/preguntas-entrevista-cas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Preguntas de Examen CAS
                    </Link>
                  </li>
                  <li>
                    <Link href="/organizaciones" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Building2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Directorio de Entidades del Estado</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/publicar-empleo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <PlusCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Publicar Convocatoria (RRHH)</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Legal & Cumplimiento Google AdSense */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider font-mono">
                  Marco Legal y Transparencia
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link href="/politica-de-privacidad" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Política de Privacidad</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terminos-y-condiciones" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Scale size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Términos y Condiciones</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Mail size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Contacto y Soporte</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/quienes-somos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Quiénes Somos y Manifiesto</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/empleos?regimen=CAS" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Convocatorias del Estado (CAS)
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            {/* Regional Linking Hub for Programmatic SEO */}
            <div className="border-t border-slate-200 dark:border-slate-900/80 pt-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Chamba y Convocatorias por Región en Perú
                </span>
                <Link href="/empleos" className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Ver todas las ofertas →
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <Link href="/empleos/en/lima" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lima</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/arequipa" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Arequipa</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/callao" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Callao</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/cusco" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cusco</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/la-libertad" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">La Libertad (Trujillo)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/piura" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Piura</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/lambayeque" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lambayeque (Chiclayo)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/junin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Junín (Huancayo)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ancash" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Áncash (Chimbote/Huaraz)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ica" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ica</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/cajamarca" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cajamarca</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/puno" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Puno</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/san-martin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">San Martín (Tarapoto)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/loreto" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Loreto (Iquitos)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/huanuco" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Huánuco</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ayacucho" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ayacucho</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/tacna" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tacna</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/moquegua" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Moquegua</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/tumbes" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tumbes</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ucayali" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ucayali (Pucallpa)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/pasco" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pasco</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/amazonas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Amazonas</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/apurimac" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Apurímac</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/huancavelica" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Huancavelica</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/madre-de-dios" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Madre de Dios</Link>
              </div>
            </div>

            {/* Bottom Bar: Disclaimer Legal No Gubernamental */}
            <div className="border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center md:text-left">
              <p>
                © {new Date().getFullYear()} <strong>chamba pro</strong> — Desarrollado por <a href="https://atpdev.dev" target="_blank" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold">ATP DEV</a>. Todos los derechos reservados.
              </p>
              <p className="max-w-xl text-[10px] leading-relaxed">
                <strong>Aviso Legal:</strong> Chamba Pro es un agregador privado e independiente de ofertas de empleo. No somos una entidad gubernamental ni representamos a SERVIR. Toda postulación se realiza de forma gratuita y directa en los portales oficiales de cada institución. Cumplimiento de la Ley N° 29733.
              </p>
            </div>
          </div>
        </footer>

        {/* Global Regulatory Cookie Consent Banner */}
        <CookieConsentBanner />
        </div>
      </body>
    </html>
  );
}
