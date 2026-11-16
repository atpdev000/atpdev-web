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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
        <AnalyticsTracker />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
