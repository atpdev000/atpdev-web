import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Inter, Fira_Code, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AdSenseInjector from "@/components/AdSenseInjector";
import LivePreviewListener from "@/components/LivePreviewListener";
import { getSiteConfig, translateText } from "@atpdev/database";
import { Providers } from "@/components/providers";
import CustomCursor from "@/components/CustomCursor";
import "../globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const BUILTIN_FONT_MAP: Record<string, string> = {
  "Hanken Grotesk": "var(--font-hanken), 'Hanken Grotesk', sans-serif",
  "Inter": "var(--font-inter), 'Inter', sans-serif",
  "Fira Code": "var(--font-fira-code), 'Fira Code', monospace",
  "JetBrains Mono": "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
};

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

  // Mapear fuentes integradas con next/font/google (cero render-blocking / cero CLS)
  const fonts = Array.from(new Set([fontHeadline, fontBody, fontLabel]));
  const customFonts = fonts.filter(f => !BUILTIN_FONT_MAP[f]);
  const googleFontsUrl = customFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${customFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`
    : null;

  const resolveFontFamily = (name: string, fallback: string) =>
    BUILTIN_FONT_MAP[name] || `'${name}', ${fallback}`;

  const schemaImage =
    config?.avatar_url && !config.avatar_url.startsWith('data:')
      ? config.avatar_url
      : OG_IMAGE;

  const clarityId =
    (config as any)?.microsoft_clarity_id ||
    process.env.NEXT_PUBLIC_CLARITY_ID ||
    "zak4lzyye9";

  return (
    <html
      lang={lang}
      className={`scroll-smooth ${hankenGrotesk.variable} ${interFont.variable} ${firaCode.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={googleFontsUrl} rel="stylesheet" />
          </>
        )}
        
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
                  "image": schemaImage,
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
              --font-heading: ${resolveFontFamily(fontHeadline, 'sans-serif')};
              --font-body: ${resolveFontFamily(fontBody, 'sans-serif')};
              --font-label: ${resolveFontFamily(fontLabel, 'monospace')};
              --neon-thickness: ${(config as any)?.neon_thickness || '4px'};
              --neon-glow: ${(config as any)?.neon_thickness === '2px' ? '10px' : (config as any)?.neon_thickness === '6px' ? '26px' : (config as any)?.neon_thickness === '8px' ? '36px' : '18px'};
              ${config?.global_background_image && !config.global_background_image.startsWith('data:') ? `--global-bg-image: url('${config.global_background_image}');` : ''}
              
              /* Liquid Glass Light */
              --bg1: color-mix(in srgb, var(--primary) 15%, #ffffff);
              --bg2: color-mix(in srgb, var(--secondary) 15%, #f8f9fa);
              --bg3: color-mix(in srgb, var(--tertiary) 15%, #ffffff);
              --glass-bg: rgba(255, 255, 255, 0.72);
              --glass-border: rgba(0, 0, 0, 0.08);
              --pill-bg: rgba(255, 255, 255, 0.78);
              --text-color: #111827;
              --text-muted: #4b5563;
              --accent-text: color-mix(in srgb, var(--primary) 82%, #000000);
              --tertiary-text: color-mix(in srgb, var(--tertiary) 82%, #000000);
              --badge-blue-text: #1d4ed8;
              --badge-green-text: #15803d;
              --badge-purple-text: #7e22ce;
              --badge-amber-text: #b45309;
              --badge-rose-text: #be123c;
              --btn-blue-text: #1d4ed8;
            }
            [data-theme="dark"] {
              --background: #0A0A0A;
              --foreground: #EDEDED;
              
              /* Liquid Glass Dark (Color-mixed with black for depth) */
              --bg1: color-mix(in srgb, var(--primary) 12%, #000000);
              --bg2: color-mix(in srgb, var(--secondary) 12%, #020202);
              --bg3: color-mix(in srgb, var(--tertiary) 12%, #000000);
              --glass-bg: rgba(20, 20, 30, 0.55);
              --glass-border: rgba(255, 255, 255, 0.15);
              --pill-bg: rgba(255, 255, 255, 0.14);
              --text-color: #ffffff;
              --text-muted: #cbd5e1;
              --accent-text: color-mix(in srgb, var(--primary) 62%, #ffffff);
              --tertiary-text: color-mix(in srgb, var(--tertiary) 62%, #ffffff);
              --badge-blue-text: #93c5fd;
              --badge-green-text: #86efac;
              --badge-purple-text: #d8b4fe;
              --badge-amber-text: #fcd34d;
              --badge-rose-text: #fda4af;
              --btn-blue-text: #93c5fd;
            }

            @media (prefers-color-scheme: dark) {
              :root:not([data-theme="light"]) {
                --background: #0A0A0A;
                --foreground: #EDEDED;
                --bg1: color-mix(in srgb, var(--primary) 12%, #000000);
                --bg2: color-mix(in srgb, var(--secondary) 12%, #020202);
                --bg3: color-mix(in srgb, var(--tertiary) 12%, #000000);
                --glass-bg: rgba(20, 20, 30, 0.55);
                --glass-border: rgba(255, 255, 255, 0.15);
                --pill-bg: rgba(255, 255, 255, 0.14);
                --text-color: #ffffff;
                --text-muted: #cbd5e1;
                --accent-text: color-mix(in srgb, var(--primary) 62%, #ffffff);
                --tertiary-text: color-mix(in srgb, var(--tertiary) 62%, #ffffff);
                --badge-blue-text: #93c5fd;
                --badge-green-text: #86efac;
                --badge-purple-text: #d8b4fe;
                --badge-amber-text: #fcd34d;
                --badge-rose-text: #fda4af;
                --btn-blue-text: #93c5fd;
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
              strategy="lazyOnload"
            />
            <Script id="google-tag-config" strategy="lazyOnload">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${config.ga4_id.startsWith('G-') ? `gtag('config', '${config.ga4_id}');` : ''}
            `}</Script>
          </>
        )}

        {/* Microsoft Clarity Behavioral Analytics */}
        {clarityId && (
          <Script
            id="microsoft-clarity-init"
            strategy="lazyOnload"
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
