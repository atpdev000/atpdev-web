import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};
import { Outfit, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { 
  ShieldCheck, PlusCircle, Scale,
  Mail, Lock, Building2, BookOpen, FileCheck2
} from "lucide-react";
import { HeaderNav } from "@/components/HeaderNav";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ChambaThemeListener } from "@/components/ChambaThemeListener";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { getSubdomainConfig } from "@atpdev/database";
import { SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const publicSans = Public_Sans({
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

export async function generateMetadata(): Promise<Metadata> {
  const config = getSubdomainConfig("chamba");
  const defaultTitle =
    config.seo?.meta_title ||
    "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026";
  const defaultDescription =
    config.seo?.meta_description ||
    "Convocatorias de trabajo y chamba en Perú 2026: plazas CAS 1057, 728 y sector privado. Bases oficiales, requisitos y salarios en portales del Estado.";
  const customKeywords = Array.isArray(config.seo?.keywords) && config.seo.keywords.length > 0
    ? config.seo.keywords
    : [];
  const rawAdsense = config.monetization?.adsense_client_id?.trim();
  const validAdsense =
    rawAdsense && !rawAdsense.includes("0000000000")
      ? rawAdsense.startsWith("ca-")
        ? rawAdsense
        : `ca-${rawAdsense}`
      : process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5414009811868137";
  const gscToken =
    config.seo?.google_search_console_token ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: "%s | chamba pro",
    },
    description: defaultDescription,
    keywords: [
      ...new Set([
        ...customKeywords,
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
        "chamba pro",
      ]),
    ],
    alternates: {
      types: {
        "application/rss+xml": `${SITE_URL}/rss.xml`,
      },
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
      apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
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
      title: defaultTitle,
      description: defaultDescription,
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
      ...(gscToken ? { google: gscToken } : {}),
      other: {
        ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
          ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
          : {}),
        "google-adsense-account": validAdsense,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getSubdomainConfig("chamba");
  const theme = config.theme || ({} as Record<string, string | undefined>);
  const adsenseEnabled =
    config.modules?.adsense_enabled !== false &&
    config.monetization?.adsense_enabled !== false;
  const rawDbAdsense = config.monetization?.adsense_client_id?.trim();
  const validDbAdsense =
    rawDbAdsense && !rawDbAdsense.includes("0000000000")
      ? rawDbAdsense.startsWith("ca-")
        ? rawDbAdsense
        : `ca-${rawDbAdsense}`
      : "";
  const adsenseId =
    validDbAdsense ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
    "ca-pub-5414009811868137";
  const adSlotsConfig = {
    enabled: adsenseEnabled,
    clientId: adsenseId,
    slots: {
      leaderboard:
        config.monetization?.adsense_slot_header ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER ||
        "",
      "in-feed":
        config.monetization?.adsense_slot_incontent ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT ||
        "",
      sidebar:
        config.monetization?.adsense_slot_sidebar ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ||
        "",
      billboard:
        config.monetization?.adsense_slot_footer ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ||
        "",
    },
  };
  const gaId =
    config.seo?.google_analytics_id ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    "GTM-KGJN7SDL";
  const clarityId = config.seo?.microsoft_clarity_id || "zak4lzyye9";
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const accentHex = theme.accent_color || theme.primary_color || "#10b981";
  const neonThickness = theme.neon_thickness || "4px";
  const neonGlow = neonThickness === "2px" ? "10px" : neonThickness === "4px" ? "18px" : neonThickness === "6px" ? "26px" : "36px";
  const radiusScale = theme.radius_scale === 'none' ? '0px' : theme.radius_scale === 'small' ? '0.375rem' : theme.radius_scale === 'medium' ? '1rem' : '9999px';

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${theme.theme_mode === 'light' ? 'light' : 'dark'} ${outfit.variable} ${publicSans.variable} ${ibmPlexMono.variable}`}
    >
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
        {/* Dynamically Load Google Fonts only if customized outside standard next/font bundle */}
        {(() => {
          const defaultFonts = ['Space Grotesk', 'Inter', 'IBM Plex Mono'];
          const customFonts = [theme.font_headline, theme.font_body, theme.font_label]
            .filter((f): f is string => Boolean(f) && !defaultFonts.includes(f as string));
          if (customFonts.length === 0) return null;
          return (
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?${customFonts.map((f: string) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&')}&display=swap`}
            />
          );
        })()}

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
        {/* Organization & Google Business Profile Schema (E-E-A-T, Local SEO & Knowledge Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "EmploymentAgency"],
              name: "chamba pro — Convocatorias de Trabajo y Empleos en Perú",
              alternateName: ["Chamba Pro Perú", "ATP DEV Empleos"],
              legalName: "ATP DEV",
              url: SITE_URL,
              logo: `${SITE_URL}/icon.svg`,
              image: `${SITE_URL}/opengraph-image`,
              description: "Plataforma oficial de difusión de convocatorias CAS 1057, D.L. 728, D.L. 276, Ley 30057 y empleos en el Perú con descarga directa de bases oficiales en PDF y enlaces institucionales verificados.",
              areaServed: {
                "@type": "Country",
                name: "Perú",
                sameAs: "https://es.wikipedia.org/wiki/Per%C3%BA"
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lima",
                addressRegion: "Lima",
                addressCountry: "PE",
              },
              sameAs: ["https://atpdev.dev"],
              knowsAbout: [
                "Convocatorias CAS 1057",
                "Bases Oficiales de Convocatorias en PDF",
                "SERVIR Talento Perú",
                "Empleos en el Estado Peruano",
                "Convocatorias D.L. 728 y D.L. 276",
                "Prácticas Preprofesionales y Profesionales en el Estado"
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicios de Empleo y Convocatorias Oficiales en Perú",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Buscador de Convocatorias CAS 1057, 728 y 276 con Bases Oficiales en PDF",
                      url: `${SITE_URL}/empleos`
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Directorio de Portales Oficiales de Entidades del Estado Peruano",
                      url: `${SITE_URL}/organizaciones`
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Publicación Gratuita de Ofertas de Empleo y Convocatorias",
                      url: `${SITE_URL}/publicar-empleo`
                    }
                  }
                ]
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "contacto@atpdev.dev",
                areaServed: "PE",
                availableLanguage: ["Spanish"],
              },
            }),
          }}
        />
      </head>
      <body 
        suppressHydrationWarning={true}
        className="bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-white antialiased selection:bg-emerald-600 selection:text-white transition-colors"
      >
        {/* Anti-Extension Hydration Sanitizer: elimina atributos inyectados por extensiones del navegador (Bitdefender, UrbanVPN, LastPass, etc.) antes de la hidratación de React */}
        <Script
          id="anti-extension-hydration"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var badAttrs = ['bis_skin_checked', 'bis_register', 'cz-shortcut-listen', 'fdprocessedid'];
                function sanitize(el) {
                  if (!el || el.nodeType !== 1) return;
                  for (var i = 0; i < badAttrs.length; i++) {
                    if (el.hasAttribute(badAttrs[i])) el.removeAttribute(badAttrs[i]);
                  }
                  var attrs = el.attributes;
                  if (attrs) {
                    for (var j = attrs.length - 1; j >= 0; j--) {
                      var n = attrs[j].name;
                      if (n.indexOf('__processed_') === 0 || n.indexOf('bis_') === 0) {
                        el.removeAttribute(n);
                      }
                    }
                  }
                }
                if (typeof document !== 'undefined') {
                  sanitize(document.body);
                  var all = document.querySelectorAll('*');
                  for (var k = 0; k < all.length; k++) sanitize(all[k]);
                  try {
                    var obs = new MutationObserver(function(muts) {
                      for (var m = 0; m < muts.length; m++) {
                        var mut = muts[m];
                        if (mut.type === 'attributes') sanitize(mut.target);
                        else if (mut.type === 'childList') {
                          for (var p = 0; p < mut.addedNodes.length; p++) sanitize(mut.addedNodes[p]);
                        }
                      }
                    });
                    obs.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
                  } catch (e) {}
                }
              })();
            `
          }}
        />
        {/* Google Consent Mode v2 Default Signals (AdSense & GA4 Compliance) */}
        <Script
          id="google-consent-mode-default"
          strategy="beforeInteractive"
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
              id="google-tags-loader"
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

        {/* Google AdSense Configuration */}
        <Script
          id="chamba-ads-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__CHAMBA_ADS_CONFIG__ = ${JSON.stringify(adSlotsConfig)};`,
          }}
        />
        {adsenseEnabled && adsenseId && (
          <Script
            id="google-adsense-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
                    var s = document.createElement('script');
                    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}';
                    s.async = true;
                    s.crossOrigin = 'anonymous';
                    document.head.appendChild(s);
                  }
                })();
              `
            }}
          />
        )}

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
                  <div suppressHydrationWarning className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center font-bold font-display shadow-sm">
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
                      <FileCheck2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Evaluador Curricular de Convocatorias</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculadora-sueldo" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Calculadora de Sueldo Neto CAS
                    </Link>
                  </li>
                  <li>
                    <Link href="/crear-cv-cas" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Creador de CV para el Estado
                    </Link>
                  </li>
                  <li>
                    <Link href="/simulador-entrevista-ia" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Simulador de Entrevista Técnica CAS
                    </Link>
                  </li>
                  <li>
                    <Link href="/comparador-regimenes" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Comparador CAS vs 728 vs 276
                    </Link>
                  </li>
                  <li>
                    <Link href="/plantillas-anexos" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Descarga de Anexos SERVIR
                    </Link>
                  </li>
                  <li>
                    <Link href="/preguntas-entrevista-cas" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
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
                    <Link href="/empleos?regimen=CAS" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
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
                <Link href="/empleos/en/lima" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lima</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/arequipa" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Arequipa</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/callao" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Callao</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/cusco" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cusco</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/la-libertad" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">La Libertad (Trujillo)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/piura" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Piura</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/lambayeque" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lambayeque (Chiclayo)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/junin" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Junín (Huancayo)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ancash" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Áncash (Chimbote/Huaraz)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ica" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ica</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/cajamarca" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cajamarca</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/puno" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Puno</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/san-martin" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">San Martín (Tarapoto)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/loreto" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Loreto (Iquitos)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/huanuco" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Huánuco</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ayacucho" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ayacucho</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/tacna" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tacna</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/moquegua" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Moquegua</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/tumbes" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tumbes</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/ucayali" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ucayali (Pucallpa)</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/pasco" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pasco</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/amazonas" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Amazonas</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/apurimac" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Apurímac</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/huancavelica" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Huancavelica</Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link href="/empleos/en/madre-de-dios" className="py-1 px-1.5 inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Madre de Dios</Link>
              </div>
            </div>

            {/* Bottom Bar: Disclaimer Legal No Gubernamental */}
            <div className="border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium text-center md:text-left">
              <p>
                © {new Date().getFullYear()} <strong>chamba pro</strong> — Desarrollado por <a href="https://atpdev.dev" target="_blank" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold">ATP DEV</a>. Todos los derechos reservados.
              </p>
              <p className="max-w-md text-xs leading-relaxed text-pretty">
                <strong>Aviso Legal:</strong> Chamba Pro es un agregador privado e independiente de ofertas de empleo. No somos una entidad gubernamental ni representamos a SERVIR. Toda postulación se realiza de forma gratuita y directa en los portales oficiales de cada institución. Cumplimiento de la Ley&nbsp;N°&nbsp;29733.
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
