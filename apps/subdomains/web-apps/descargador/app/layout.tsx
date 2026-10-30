// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import AdManager from '@/components/AdManager'
import ServerWarmup from '@/components/ServerWarmup'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6'
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://descargador.atpdev.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Descargador Pro - Descargar Videos de Facebook HD, TikTok Sin Marca de Agua y YouTube ✅ Gratis',
  description:
    '🚀 La herramienta más rápida para descargar videos de Facebook en HD y TikTok sin marca de agua. Descargador Pro: 100% gratis, seguro y en alta calidad. MP4 y MP3.',
  keywords: `descargar videos tiktok sin marca de agua, facebook downloader hd, descargar videos facebook, tiktok downloader no watermark, descargar videos de tiktok gratis, bajar videos de facebook, convertir video a mp3, descargar mp4 gratis, bajar videos online, downloader online`,
  authors: [{ name: 'ATP DEV', url: siteUrl }],
  creator: 'ATP DEV',
  publisher: 'Descargador Pro',
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl
  },
  other: {
    'ezoic-site-verification': 'wStjwIfmHCWL7mcvHPkYWJi6FeTviZ',
    'google-adsense-account': 'ca-pub-5414009811868137'
  },
  openGraph: {
    title: 'Descargador Pro - Descargar Videos de Facebook HD, TikTok y YouTube ✅ Gratis',
    description:
      'La herramienta más rápida para descargar videos de Facebook en HD y TikTok sin marca de agua. 100% gratis, seguro y en alta calidad.',
    url: siteUrl,
    siteName: 'Descargador Pro',
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
    title: 'Descargador Pro - Descargar Videos de Facebook HD, TikTok y YouTube ✅ Gratis',
    description:
      'La herramienta más rápida para descargar videos de Facebook en HD y TikTok sin marca de agua. 100% gratis, seguro y en alta calidad.',
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
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Scripts de Ezoic y consentimiento cargados solo en producción para evitar error 403 en localhost */}
        {process.env.NODE_ENV === 'production' && (
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
        {children}
      </body>
    </html>
  )
}