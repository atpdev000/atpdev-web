import type { Metadata } from 'next'
import './globals.css'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import AdSenseInjector from '@/components/AdSenseInjector'

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-5414009811868137'

export const metadata: Metadata = {
  metadataBase: new URL('https://codehistory.atpdev.dev'),
  title: 'code-history | Efemérides e Historia de la Programación',
  description:
    'Archivo diario de efemérides sobre programación, lenguajes de software, sistemas operativos y pioneros de la computación. Proyecto educativo de ATP Dev.',
  alternates: {
    canonical: 'https://codehistory.atpdev.dev',
  },
  other: {
    'google-adsense-account': adsenseId,
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
      </head>
      <body>
        <AnalyticsTracker />
        <AdSenseInjector adsenseId={adsenseId} />
        {children}
      </body>
    </html>
  )
}
