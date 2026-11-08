import type { Metadata, Viewport } from "next";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AdSenseInjector from "@/components/AdSenseInjector";
import LivePreviewListener from "@/components/LivePreviewListener";
import { getSiteConfig, translateText } from "@atpdev/database";
import { Providers } from "@/components/providers";
import CustomCursor from "@/components/CustomCursor";
import "../globals.css";

const BASE_URL = "https://www.atpdev.dev";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];

export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

function localeToOgLocale(lang: string) {
  const map: Record<string, string> = {
    es: "es_PE", en: "en_US", ru: "ru_RU", hi: "hi_IN",
    zh: "zh_CN", fr: "fr_FR", de: "de_DE", pt: "pt_PT", ja: "ja_JP",
  };
  return map[lang] ?? "es_PE";
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang = 'es' } = await params;
  const config = await getSiteConfig();

  const titleBase = "Percy Acha Taipe | ATP Dev – Android & Fullstack Developer";
  const descBase = config?.bio_short ?? "Ingeniero de Sistemas. Android, Next.js, Supabase e IA. Apps en Google Play. Disponible para proyectos freelance.";
  
  const title = lang === 'es' ? titleBase : await translateText(titleBase, lang);
  const description = lang === 'es' ? descBase : await translateText(descBase, lang);

  const path = lang === 'es' ? '' : `/${lang}`;
  
  const languages: Record<string, string> = {
    'x-default': BASE_URL,
  };
  supportedLocales.forEach(loc => {
    languages[loc] = `${BASE_URL}${loc === 'es' ? '' : '/' + loc}`;
  });

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: "%s | ATP Dev",
    },
    description,
    keywords: [
      "Percy Acha Taipe", "ATP Dev", "Android Developer", "Fullstack Developer",
      "Next.js", "Kotlin", "Supabase", "Inteligencia Artificial", "Portafolio", "Freelance Perú",
    ],
    authors: [{ name: "Percy Acha Taipe", url: BASE_URL }],
    creator: "Percy Acha Taipe",
    publisher: "ATP Dev",
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "xLX9HT_roi66Iips-tYL5paIvBDDP_EftOni_R9KyYw",
    },
    openGraph: {
      type: "website",
      locale: localeToOgLocale(lang),
      url: `${BASE_URL}${path}`,
      siteName: "ATP Dev – Portafolio",
      title,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "ATP Dev – Portafolio Profesional de Percy Acha Taipe",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@atpdev",
      creator: "@atpdev",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

// Map radius string to CSS scale value
function getRadiusValue(scale: string) {
  switch (scale) {
    case "none": return "0rem";
    case "small": return "0.25rem";
    case "medium": return "0.75rem";
    case "full": return "9999px";
    default: return "0.75rem";
  }
}

// Normalize legacy glow_style values to current CSS selectors
function normalizeGlowStyle(raw: string | undefined | null): string {
  if (!raw) return 'spotlight-border';
  // Map old single-word values to the current compound names
  const mapped = raw
    .split(',')
    .map(s => s.trim())
    .map(s => {
      if (s === 'spotlight' || s === 'border') return 'spotlight-border';
      if (s === 'full') return 'spotlight-full';
      return s;
    })
    .join(' ');
  return mapped || 'spotlight-border';
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang = 'es' } = await params;
  const config = await getSiteConfig();

  // Valores por defecto
  const fontHeadline = config?.font_headline || "Hanken Grotesk";
  const fontBody = config?.font_body || "Inter";
  const fontLabel = config?.font_label || "JetBrains Mono";
  
  const primary = config?.primary_color || "#0052FF";
  const secondary = config?.secondary_color || "#1A1A1A";
  const tertiary = config?.tertiary_color || "#262626";
  const neutral = config?.neutral_color || "#8A8A8A";
  
  const isDark = (config?.theme_mode || "dark") === "dark";
  const background = isDark ? "#0A0A0A" : "#F9FAFB";
  const foreground = isDark ? "#EDEDED" : "#111827";

  const radiusValue = getRadiusValue(config?.radius_scale || "medium");

  // Crear URL de Google Fonts dinámicamente
  const fonts = Array.from(new Set([fontHeadline, fontBody, fontLabel]));
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`;

  return (
    <html lang={lang} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsUrl} rel="stylesheet" />
        
        {/* Google AdSense moved to AdSenseInjector component */}

        {/* JSON-LD Schema (Pro SEO) - Native script for SSR */}
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "name": config?.full_name || "Percy Acha Taipe",
                  "alternateName": "ATP Dev",
                  "url": BASE_URL,
                  "image": config?.avatar_url || OG_IMAGE,
                  "jobTitle": await translateText("Fullstack & Android Developer", lang),
                  "sameAs": [
                    config?.github_url,
                    config?.linkedin_url
                  ].filter(Boolean)
                },
                {
                  "@type": "WebSite",
                  "name": "ATP Dev",
                  "url": BASE_URL,
                  "description": await translateText("Portafolio Profesional de Percy Acha Taipe, Ingeniero de Sistemas y Desarrollador.", lang)
                }
              ]
            })
          }}
        />

        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: #f2f2f2;
              --foreground: #1a1a1a;
              --primary: ${primary};
              --secondary: ${secondary};
              --tertiary: ${tertiary};
              --neutral: ${neutral};
              --radius-scale: ${radiusValue};
              --font-heading: '${fontHeadline}', sans-serif;
              --font-body: '${fontBody}', sans-serif;
              --font-label: '${fontLabel}', monospace;
              --neon-thickness: ${(config as any)?.neon_thickness || '4px'};
              --neon-glow: ${(config as any)?.neon_thickness === '2px' ? '10px' : (config as any)?.neon_thickness === '6px' ? '26px' : (config as any)?.neon_thickness === '8px' ? '36px' : '18px'};
              ${config?.global_background_image ? `--global-bg-image: url('${config.global_background_image}');` : ''}
              
              /* Liquid Glass Light */
              --bg1: color-mix(in srgb, var(--primary) 15%, #ffffff);
              --bg2: color-mix(in srgb, var(--secondary) 15%, #f8f9fa);
              --bg3: color-mix(in srgb, var(--tertiary) 15%, #ffffff);
              --glass-bg: rgba(255, 255, 255, 0.4);
              --glass-border: rgba(255, 255, 255, 0.6);
              --pill-bg: rgba(255, 255, 255, 0.55);
              --text-color: #1a1a1a;
            }
            [data-theme="dark"] {
              --background: #0A0A0A;
              --foreground: #EDEDED;
              
              /* Liquid Glass Dark (Color-mixed with black for depth) */
              --bg1: color-mix(in srgb, var(--primary) 12%, #000000);
              --bg2: color-mix(in srgb, var(--secondary) 12%, #020202);
              --bg3: color-mix(in srgb, var(--tertiary) 12%, #000000);
              --glass-bg: rgba(20, 20, 30, 0.45);
              --glass-border: rgba(255, 255, 255, 0.15);
              --pill-bg: rgba(255, 255, 255, 0.18);
              --text-color: #ffffff;
            }

            @media (prefers-color-scheme: dark) {
              :root:not([data-theme="light"]) {
                --background: #0A0A0A;
                --foreground: #EDEDED;
                --bg1: color-mix(in srgb, var(--primary) 12%, #000000);
                --bg2: color-mix(in srgb, var(--secondary) 12%, #020202);
                --bg3: color-mix(in srgb, var(--tertiary) 12%, #000000);
                --glass-bg: rgba(20, 20, 30, 0.45);
                --glass-border: rgba(255, 255, 255, 0.15);
                --pill-bg: rgba(255, 255, 255, 0.18);
                --text-color: #ffffff;
              }
            }

            body {
              background-color: var(--background);
              background-image: var(--global-bg-image, none);
              background-size: cover;
              background-attachment: fixed;
              background-position: center;
            }
          `
        }} />
      </head>
      <body className={`font-sans antialiased min-h-screen`} data-interaction={normalizeGlowStyle(config?.glow_style)} suppressHydrationWarning>

        {/* Consent Mode v2 Default (Must be loaded before GA4/AdSense) */}
        <Script id="consent-mode-default">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
          });
          gtag('set', 'ads_data_redaction', true);
        `}</Script>

        {/* Google Analytics 4 & Google Tag (GTM / GA4) */}
        {config?.ga4_id && (
          <>
            <Script 
              id="google-tag-script"
              async 
              src={
                config.ga4_id.startsWith('GTM-')
                  ? `https://www.googletagmanager.com/gtm.js?id=${config.ga4_id}`
                  : `https://www.googletagmanager.com/gtag/js?id=${config.ga4_id}`
              }
              strategy="afterInteractive"
            />
            <Script id="google-tag-config" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${config.ga4_id.startsWith('G-') ? `gtag('config', '${config.ga4_id}');` : ''}
            `}</Script>
          </>
        )}

        <Providers>
          <CustomCursor glowStyle={normalizeGlowStyle(config?.glow_style)} />
          <LivePreviewListener />
          <AnalyticsTracker />
          <AdSenseInjector adsenseId={config?.adsense_id || null} />
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
