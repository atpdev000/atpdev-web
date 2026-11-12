// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import AdManager from '@/components/AdManager'
import ServerWarmup from '@/components/ServerWarmup'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import DescargadorThemeListener from '@/components/DescargadorThemeListener'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import { I18nProvider } from '@/lib/i18n/context'
import { getSubdomainConfig } from '@atpdev/database'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6'
}

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteUrl = config?.seo?.canonical_url || process.env.NEXT_PUBLIC_SITE_URL || 'https://descargador.atpdev.dev'
  const title = config?.seo?.meta_title || 'Descargador Pro - Descargar Videos de Facebook HD, TikTok Sin Marca de Agua e Instagram ✅ Gratis'
  const description = config?.seo?.meta_description || '🚀 La herramienta más rápida para descargar videos de Facebook en HD, TikTok sin marca de agua e Instagram. Descargador Pro: 100% gratis, seguro y en alta calidad. MP4 y MP3.'
  const keywords = Array.isArray(config?.seo?.keywords) && config.seo.keywords.length > 0
    ? config.seo.keywords.join(', ')
    : 'descargar videos tiktok sin marca de agua, facebook downloader hd, descargar videos facebook, tiktok downloader no watermark, descargar videos de tiktok gratis, bajar videos de facebook, convertir video a mp3, descargar mp4 gratis, bajar videos online, downloader online'

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    authors: [{ name: 'ATP DEV', url: siteUrl }],
    creator: 'ATP DEV',
    publisher: config?.branding?.site_title || 'Descargador Pro',
    manifest: '/manifest.json',
    alternates: {
      canonical: siteUrl
    },
    other: {
      'ezoic-site-verification': config?.monetization?.ezoic_verification_code || 'wStjwIfmHCWL7mcvHPkYWJi6FeTviZ',
      'google-adsense-account': config?.monetization?.adsense_client_id || 'ca-pub-5414009811868137'
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: config?.branding?.site_title || 'Descargador Pro',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Descargador Pro - Descargar Videos de Redes Sociales'
        }
      ],
      locale: 'es_PE',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    icons: {
      icon: [
        { url: '/icon.png', type: 'image/png', sizes: '192x192' },
        { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' }
      ],
      shortcut: '/favicon.ico',
      apple: [{ url: '/icons/icon-192.png', sizes: '180x180', type: 'image/png' }]
    },
    verification: {
      google: config?.seo?.google_search_console_token || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google6484540a375ccb54'
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = getSubdomainConfig('descargador')
  const theme = config?.theme || ({} as any)
  const serverTheme = theme.theme_mode === 'light' ? 'light' : 'dark'
  const customBg = theme.global_background_image
  const accentHex = theme.accent_color || theme.primary_color || '#3b82f6'
  const siteUrl = config?.seo?.canonical_url || process.env.NEXT_PUBLIC_SITE_URL || 'https://descargador.atpdev.dev'

  return (
    <html lang="es" className={serverTheme} data-server-theme={serverTheme} suppressHydrationWarning>
      <head>
        {/* Resource Hints optimizados para Core Web Vitals */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />

        {customBg && (
          <style dangerouslySetInnerHTML={{
            __html: `
              body,
              .dark body,
              body[data-has-custom-bg="true"],
              .dark body[data-has-custom-bg="true"] {
                background-image: url("${customBg}") !important;
                background-size: cover !important;
                background-position: center !important;
                background-attachment: fixed !important;
                background-repeat: no-repeat !important;
              }
            `
          }} />
        )}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --accent-primary: ${accentHex};
              --primary-hex: ${accentHex};
            }
          `
        }} />
      </head>
      <body className={`${inter.className} transition-colors duration-200 antialiased`} data-has-custom-bg={customBg ? "true" : "false"} suppressHydrationWarning>
        {/* Schema.org WebApplication & Organization JSON-LD (Ubicado en body para evitar mismatch de hidratación en React 19 / Turbopack) */}
        <script
          id="descargador-schema-webapp"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: config?.branding?.site_title || "Descargador Pro",
              alternateName: "Descargador de Videos HD y Música MP3 Gratis",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "All (Web, Android, iOS, Windows, macOS)",
              url: siteUrl,
              description: config?.seo?.meta_description || "Descarga videos y audios gratis de TikTok sin marca de agua, Facebook e Instagram en máxima calidad.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD"
              },
              creator: {
                "@type": "Organization",
                name: "ATP DEV",
                url: "https://atpdev.dev"
              }
            })
          }}
        />
        {/* Google Consent Mode v2 Default Signals (Privacy & AdSense Compliance) */}
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
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
            `
          }}
        />

        {/* Theme Initializer */}
        <Script
          id="descargador-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('descargador_theme');
                  var doc = document.documentElement;
                  if (saved === 'light') {
                    doc.classList.remove('dark');
                    doc.classList.add('light');
                    doc.setAttribute('data-theme', 'light');
                  } else if (saved === 'dark') {
                    doc.classList.remove('light');
                    doc.classList.add('dark');
                    doc.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `
          }}
        />

        {/* Descargador Ads Config */}
        <Script
          id="descargador-ads-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__DESCARGADOR_ADS_CONFIG__ = ${JSON.stringify({
              enabled: config?.monetization?.adsense_enabled !== false,
              clientId: config?.monetization?.adsense_client_id || 'ca-pub-5414009811868137',
              slots: {
                leaderboard: config?.monetization?.adsense_slot_header || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || '4095225502',
                'in-feed': config?.monetization?.adsense_slot_incontent || process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT || '9155980495',
                sidebar: config?.monetization?.adsense_slot_sidebar || process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '4095225502',
                billboard: config?.monetization?.adsense_slot_footer || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || '4095225502',
              }
            })};`
          }}
        />
        <DescargadorThemeListener />
        <I18nProvider>
          {/* Google Analytics & Google Tag (GA4 / GTM) */}
          {config?.seo?.google_analytics_id && (
            <>
              <Script
                strategy="afterInteractive"
                src={
                  config.seo.google_analytics_id.startsWith('GTM-')
                    ? `https://www.googletagmanager.com/gtm.js?id=${config.seo.google_analytics_id}`
                    : `https://www.googletagmanager.com/gtag/js?id=${config.seo.google_analytics_id}`
                }
              />
              <Script
                id="google-tag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${config.seo.google_analytics_id}', {
                      page_path: window.location.pathname,
                    });
                  `
                }}
              />
            </>
          )}

          {/* Microsoft Clarity (Heatmaps & Grabación de Sesiones) */}
          {config?.seo?.microsoft_clarity_id && (
            <Script
              id="microsoft-clarity-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${config.seo.microsoft_clarity_id}");
                `
              }}
            />
          )}

          {/* Google AdSense Oficial cargado dinámicamente desde el CMS Admin */}
          {config?.monetization?.adsense_enabled !== false && config?.modules?.adsense_enabled !== false && config?.monetization?.adsense_client_id && (
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.monetization.adsense_client_id}`}
              crossOrigin="anonymous"
            />
          )}

          {/* Scripts de Ezoic y consentimiento cargados solo en producción si Ezoic está habilitado en CMS */}
          {process.env.NODE_ENV === 'production' && config?.monetization?.ezoic_enabled === true && (
            <>
              <Script
                strategy="afterInteractive"
                src="https://cmp.gatekeeperconsent.com/min.js"
              />
              <Script
                strategy="afterInteractive"
                src="https://the.gatekeeperconsent.com/cmp.min.js"
              />
              <Script
                strategy="afterInteractive"
                src="//www.ezojs.com/ezoic/sa.min.js"
              />
              <Script
                id="ezoic-standalone-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.ezstandalone = window.ezstandalone || {};
                    ezstandalone.cmd = ezstandalone.cmd || [];
                  `
                }}
              />
            </>
          )}

          <AdManager />
          <ServerWarmup />
          <AnalyticsTracker />
          {children}
          <CookieConsentBanner />
        </I18nProvider>
      </body>
    </html>
  )
}