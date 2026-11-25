import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'Lector QR Pro • Escáner de Códigos QR, Barras & Generador 100% Online',
  description: 'Lector y escáner profesional de códigos QR y códigos de barras en tiempo real. Decodifica collages y múltiples códigos QR a la vez, enlaces, Wi-Fi, contactos vCard, WhatsApp, genera códigos con marcos personalizados y descarga en HD.',
  keywords: [
    'lector qr', 
    'escanear qr online', 
    'escanear multiples qr',
    'generador qr gratis', 
    'lector codigos de barra', 
    'escanear wifi qr', 
    'qr pro', 
    'atp dev'
  ],
  authors: [{ name: 'ATP DEV Perú' }],
  metadataBase: new URL('https://lectorqr.atpdev.dev'),
  alternates: {
    canonical: 'https://lectorqr.atpdev.dev',
  },
  openGraph: {
    title: 'Lector QR Pro • Escáner y Generador de Códigos QR',
    description: 'Decodificación instantánea de múltiples códigos QR por cámara o imagen. Generador con marcos, formas y logos.',
    url: 'https://lectorqr.atpdev.dev',
    siteName: 'Lector QR Pro',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: 'https://www.atpdev.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lector QR Pro — Escáner y Generador de Códigos QR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lector QR Pro • Escáner y Generador de Códigos QR',
    description: 'Escáner óptico en el navegador y generador vectorial de códigos QR con corrección Reed-Solomon.',
    images: ['https://www.atpdev.dev/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

const rootJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://lectorqr.atpdev.dev/#webapp',
      name: 'Lector QR Pro',
      url: 'https://lectorqr.atpdev.dev',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      inLanguage: 'es-PE',
      description: 'Escáner óptico de códigos QR y códigos de barras 100% en el navegador y generador de códigos QR vectoriales SVG/PNG.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#090d16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" 
          rel="stylesheet" 
        />
        <Script
          id="google-consent-default"
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
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
