import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { SorteosThemeListener } from "@/components/SorteosThemeListener";
import { SorteosGlowWrapper } from "@/components/SorteosGlowWrapper";
import { SorteosCustomCursor } from "@/components/SorteosCustomCursor";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { getSubdomainConfig } from "@atpdev/database";
import { 
  SITE_URL, 
  SITE_NAME, 
  SITE_TITLE, 
  SITE_DESCRIPTION, 
  CONTACT_EMAIL,
  GA_MEASUREMENT_ID,
  CLARITY_ID
} from "@/lib/siteConfig";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070a12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

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
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "sorteos instagram",
    "hacer sorteo instagram gratis",
    "app sorteos gratis",
    "sorteo instagram comentarios gratis",
    "sorteos tiktok gratis",
    "sorteos youtube comentarios",
    "sorteos facebook gratis",
    "ruleta aleatoria online",
    "ruleta de nombres gratis",
    "sorteo de nombres online",
    "sorteo lista excel",
    "amigo invisible online gratis",
    "amigo secreto online",
    "generador de equipos al azar",
    "generador de numeros aleatorios",
    "tirar dados virtuales 3d",
    "lanzar moneda cara o cruz",
    "raspa y gana digital",
    "sorteo certificado sha-256",
    "random name picker",
    "wheel of names online",
    "instagram giveaway picker free",
    "secret santa generator"
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_ES",
    alternateLocale: ["en_US", "pt_BR", "fr_FR", "de_DE", "it_IT"],
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Plataforma de Sorteos Verificables`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          other: {
            "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          },
        }
      : {}),
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getSubdomainConfig("sorteos");
  const theme = config.theme || ({} as any);
  const gaId = config.seo?.google_analytics_id || GA_MEASUREMENT_ID;
  const clarityId = config.seo?.microsoft_clarity_id || CLARITY_ID;
  const accentHex = theme.accent_color || theme.primary_color || "#d91a7a";
  const neonThickness = theme.neon_thickness || "4px";
  const neonGlow = neonThickness === "2px" ? "10px" : neonThickness === "4px" ? "18px" : neonThickness === "6px" ? "26px" : "36px";
  const radiusScale = theme.radius_scale === 'none' ? '0px' : theme.radius_scale === 'small' ? '0.75rem' : theme.radius_scale === 'medium' ? '1rem' : '1.5rem';
  const defaultMode = theme.theme_mode === 'light' ? 'light' : 'dark';
  const bgImage = theme.global_background_image || '';

  let isLightAccent = false;
  try {
    const c = accentHex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    isLightAccent = lum > 0.65;
  } catch {}
  const btnTextColor = isLightAccent ? '#09090b' : '#ffffff';

  return (
    <html
      lang="es"
      className={`${defaultMode} ${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
      data-server-theme={defaultMode}
      suppressHydrationWarning
    >
      <head>
        {/* Core Resource Hints & DNS Prefetches */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />

        {/* Unified Structured Data (Schema.org @graph): WebSite, SoftwareApplication, Organization & FAQPage */}
        <script
          id="ld-json-schema"
          key="ld-json-schema"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  alternateName: ["SorteosPro", "Sorteos Pro Online"],
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  inLanguage: ["es", "en", "pt", "fr", "de", "it", "ru", "zh", "ja", "hi", "ar"],
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${SITE_URL}/#app`,
                  name: SITE_NAME,
                  applicationCategory: "UtilitiesApplication",
                  operatingSystem: "All",
                  isAccessibleForFree: true,
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  featureList: [
                    "Sorteo de comentarios en Instagram, TikTok, YouTube, Facebook, X y Threads",
                    "Ruleta aleatoria online personalizable con algoritmo CSPRNG",
                    "Sorteo por lista de nombres con pegado Ctrl+V desde Excel y capturas OCR",
                    "Organizador de Amigo Invisible / Amigo Secreto con enlaces privados por WhatsApp",
                    "Generador de equipos y grupos aleatorios equilibrados",
                    "Certificados públicos verificables con hash SHA-256 inmutable",
                  ],
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
                {
                  "@type": "ItemList",
                  "@id": `${SITE_URL}/#tools`,
                  name: "Herramientas Gratuitas de Sorteos Pro",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Sorteo en Instagram Gratis", url: `${SITE_URL}/apps/sorteo-instagram` },
                    { "@type": "ListItem", position: 2, name: "Ruleta Aleatoria Online", url: `${SITE_URL}/herramientas/ruleta` },
                    { "@type": "ListItem", position: 3, name: "Sorteo por Lista de Nombres", url: `${SITE_URL}/herramientas/lista` },
                    { "@type": "ListItem", position: 4, name: "Amigo Invisible / Amigo Secreto", url: `${SITE_URL}/herramientas/amigo-invisible` },
                    { "@type": "ListItem", position: 5, name: "Generador de Equipos al Azar", url: `${SITE_URL}/herramientas/equipos` },
                    { "@type": "ListItem", position: 6, name: "Generador de Números Aleatorios", url: `${SITE_URL}/herramientas/numeros` },
                    { "@type": "ListItem", position: 7, name: "Dados Virtuales 3D", url: `${SITE_URL}/herramientas/dados` },
                    { "@type": "ListItem", position: 8, name: "Lanzar Moneda Cara o Cruz", url: `${SITE_URL}/herramientas/moneda` },
                    { "@type": "ListItem", position: 9, name: "Raspa y Gana Digital", url: `${SITE_URL}/herramientas/raspa-gana` },
                    { "@type": "ListItem", position: 10, name: "Trivia Interactiva en Vivo", url: `${SITE_URL}/herramientas/trivia` },
                    { "@type": "ListItem", position: 11, name: "Generador de Bases Legales", url: `${SITE_URL}/herramientas/bases-legales` },
                    { "@type": "ListItem", position: 12, name: "Calculadora de Engagement", url: `${SITE_URL}/herramientas/engagement` },
                    { "@type": "ListItem", position: 13, name: "Generador de Hashtags", url: `${SITE_URL}/herramientas/hashtags` },
                  ],
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  legalName: "ATP DEV",
                  url: SITE_URL,
                  sameAs: ["https://atpdev.dev"],
                  logo: `${SITE_URL}/icon.svg`,
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer support",
                    email: CONTACT_EMAIL,
                    availableLanguage: ["Spanish", "English", "Portuguese", "French", "German", "Italian"],
                  },
                },
                {
                  "@type": "FAQPage",
                  "@id": `${SITE_URL}/#faq`,
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "¿Cómo hacer un sorteo gratis en Instagram, TikTok, YouTube o Facebook?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Ingresa a Sorteos Pro, pega el enlace de tu publicación o importa los comentarios, configura filtros de duplicados y menciones, y ejecuta el sorteo gratis con algoritmo CSPRNG y certificado público SHA-256.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "¿Puedo pegar una lista desde Excel o una captura de pantalla para hacer un sorteo?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Sí. En Sorteo de Nombres, Ruleta Aleatoria, Amigo Invisible y Generador de Equipos puedes presionar Ctrl+V para pegar filas copiadas de Excel o una captura de pantalla con OCR automático que ordena los participantes al instante.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "¿Cómo funciona el algoritmo de sorteos y por qué es 100% transparente?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Utilizamos generadores de números aleatorios criptográficamente seguros (Web Crypto API CSPRNG) con cálculo de hash SHA-256 público y certificado inmutable anti-fraude que cualquier participante puede auditar.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "¿Las herramientas de ruleta aleatoria, amigo invisible y equipos son gratis sin registro?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Sí, las 13 herramientas interactivas (Ruleta, Lista de Nombres, Amigo Invisible, Equipos, Números, Dados 3D, Moneda, Raspa y Gana, Trivia, Bases Legales, Engagement y Hashtags) son 100% gratuitas y funcionan directo en el navegador sin crear cuenta.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />

        {/* Dynamic Subdomain Theme Custom Properties (SSR Hydration) */}
        <style id="sorteos-ssr-theme" dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${accentHex} !important;
              --accent-primary: ${accentHex} !important;
              --primary-contrast: ${btnTextColor} !important;
              --accent-purple: ${accentHex} !important;
              --accent-pink: ${theme.secondary_color || '#ec4899'} !important;
              --secondary: ${theme.secondary_color || '#ec4899'};
              --tertiary: ${theme.tertiary_color || '#f59e0b'};
              --neutral: ${theme.neutral_color || '#070a12'};
              --neon-thickness: ${neonThickness} !important;
              --neon-glow: ${neonGlow} !important;
              --radius-scale: ${radiusScale};
              ${theme.font_headline ? `--font-space: "${theme.font_headline}", sans-serif; --font-heading: "${theme.font_headline}", sans-serif;` : ''}
              ${theme.font_body ? `--font-inter: "${theme.font_body}", sans-serif; --font-body: "${theme.font_body}", sans-serif;` : ''}
              ${theme.font_label ? `--font-mono: "${theme.font_label}", monospace; --font-label: "${theme.font_label}", monospace;` : ''}
            }
            .bg-pink-600,
            .bg-pink-500,
            .bg-\\[\\#d91a7a\\],
            .btn-pro-primary,
            button.bg-\\[\\#d91a7a\\],
            a.btn-pro-primary {
              background-color: ${accentHex} !important;
              border-color: ${accentHex} !important;
              color: ${btnTextColor} !important;
            }
            .btn-pro-primary *,
            .bg-\\[\\#d91a7a\\] *,
            .bg-pink-600 *,
            .bg-pink-500 * {
              color: ${btnTextColor} !important;
              stroke: ${btnTextColor} !important;
            }
            .hover\\:bg-\\[\\#c2186b\\]:hover,
            .hover\\:bg-\\[\\#d91a7a\\]:hover,
            .hover\\:bg-pink-600:hover,
            .hover\\:bg-pink-700:hover {
              background-color: ${accentHex} !important;
              filter: brightness(0.9) !important;
            }
            .text-pink-600,
            .text-pink-500,
            .text-pink-400,
            .text-\\[\\#d91a7a\\] {
              color: ${accentHex} !important;
            }
            .border-pink-600,
            .border-pink-500,
            .border-\\[\\#d91a7a\\] {
              border-color: ${accentHex} !important;
            }
            ${bgImage ? `
            body,
            .dark body,
            body[data-has-custom-bg="true"],
            .dark body[data-has-custom-bg="true"] {
              background-image: url("${bgImage}") !important;
              background-size: cover !important;
              background-position: center !important;
              background-attachment: fixed !important;
              background-repeat: no-repeat !important;
            }
            ` : ''}
          `
        }} />

        {/* Dynamically Load Google Fonts ONLY if customized outside standard next/font bundle */}
        {(() => {
          const defaultFonts = ['Space Grotesk', 'Inter', 'IBM Plex Mono'];
          const customFonts = [theme.font_headline, theme.font_body, theme.font_label]
            .filter((f: any): f is string => Boolean(f) && !defaultFonts.includes(f as string));
          if (customFonts.length === 0) return null;
          return (
            <link
              id="sorteos-ssr-fonts"
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?${customFonts.map((f: string) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&')}&display=swap`}
            />
          );
        })()}

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
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
              gtag('set', 'ads_data_redaction', true);
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
                window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
              `
            }}
          />
        )}

        {/* Google AdSense gestionado por GoogleAdSense (excluye rutas legales, auth y panel privado) */}
      </head>
      <body
        suppressHydrationWarning
        data-interaction={theme.glow_style || "spotlight-border"}
        data-cursor={theme.cursor_effect || "cursor-default"}
        data-has-custom-bg={bgImage ? "true" : "false"}
        style={bgImage ? {
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        } : undefined}
        className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#070a12] dark:text-zinc-100 antialiased selection:bg-pink-500 selection:text-white transition-colors duration-200"
      >
        <Script
          id="theme-lang-init"
          src="/theme-init.js"
          strategy="beforeInteractive"
        />
        <AnalyticsTracker />
        <SorteosThemeListener />
        <SorteosCustomCursor />
        <LanguageProvider>
          {/* Top Announcement Bar if configured */}
          {config.branding?.announcement_enabled && (
            <div 
              className="announcement-bar relative overflow-hidden text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2.5 border-b print:hidden transition-colors"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentHex} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${accentHex} 30%, transparent)`,
                color: `var(--text-main, #ffffff)`
              }}
            >
              <span>{config.branding.announcement_text || '🎉 Sorteos ilimitados con Ruleta, Dados, Moneda, Equipos y Números 100% gratis.'}</span>
            </div>
          )}
          <Navbar />
          <SorteosGlowWrapper className="flex-1 flex flex-col">
            <main className="flex-1">
              {children}
            </main>
          </SorteosGlowWrapper>
          <Footer />
          <CookieConsentBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
