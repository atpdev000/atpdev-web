import type { Metadata } from 'next'
import './globals.css'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import CookieBanner from '@/components/CookieBanner'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://codehistory.atpdev.dev'),
  title: 'code-history | Efemérides e Historia de la Programación',
  description:
    'Archivo diario de efemérides sobre programación, lenguajes de software, sistemas operativos y pioneros de la computación. Proyecto educativo de ATP Dev.',
  alternates: {
    canonical: 'https://codehistory.atpdev.dev',
  },
  openGraph: {
    title: 'code-history | Efemérides e Historia de la Programación',
    description: 'Archivo diario de efemérides sobre programación, lenguajes de software, sistemas operativos y pioneros de la computación.',
    url: 'https://codehistory.atpdev.dev',
    siteName: 'CodeHistory',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: 'https://www.atpdev.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodeHistory — Efemérides e Historia de la Programación',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'code-history | Efemérides e Historia de la Programación',
    description: 'Archivo diario de efemérides sobre ingeniería de software, compiladores y sistemas operativos.',
    images: ['https://www.atpdev.dev/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

const rootJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://codehistory.atpdev.dev/#website',
      name: 'CodeHistory',
      url: 'https://codehistory.atpdev.dev',
      inLanguage: 'es',
      description: 'Archivo diario de efemérides sobre ingeniería de software, lenguajes de programación, sistemas operativos y pioneros de la computación.',
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <Script
          id="consent-mode-default"
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
              gtag('set', 'ads_data_redaction', true);
            `,
          }}
        />
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
