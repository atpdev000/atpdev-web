import type { Metadata } from 'next'
import './globals.css'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import CookieBanner from '@/components/CookieBanner'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://almaniq.atpdev.dev'),
  title: 'Almaniq | Curiosidades, Historia Universal y Tendencias Globales',
  description:
    'Almanaque digital de historia universal, hitos científicos, curiosidades culturales y tendencias verificadas día a día. Editado por ATP Dev.',
  alternates: {
    canonical: 'https://almaniq.atpdev.dev',
  },
  openGraph: {
    title: 'Almaniq | Curiosidades, Historia Universal y Tendencias Globales',
    description: 'Almanaque digital de historia universal, hitos científicos, curiosidades culturales y tendencias verificadas día a día.',
    url: 'https://almaniq.atpdev.dev',
    siteName: 'Almaniq',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: 'https://www.atpdev.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Almaniq — Historia Universal y Efemérides Verificadas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Almaniq | Historia Universal y Efemérides',
    description: 'Almanaque digital de historia universal, ciencia y cultura editado por ATP Dev.',
    images: ['https://www.atpdev.dev/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
}

const rootJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://almaniq.atpdev.dev/#website',
      name: 'Almaniq',
      url: 'https://almaniq.atpdev.dev',
      inLanguage: 'es',
      description: 'Almanaque digital de historia universal, hitos científicos, curiosidades culturales y efemérides verificadas.',
      publisher: { '@id': 'https://www.atpdev.dev/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.atpdev.dev/#organization',
      name: 'ATP Dev',
      url: 'https://www.atpdev.dev',
      logo: 'https://www.atpdev.dev/og-image.png',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        {/* Consent Mode v2 Default (Must be loaded before GA4/AdSense) */}
        <Script id="consent-mode-default" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
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
        `}} />

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script 
              id="ga4-script"
              async 
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
            `}} />
          </>
        )}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        <AnalyticsTracker />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
