import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

export const metadata: Metadata = {
  metadataBase: new URL('https://perusabor.atpdev.dev'),
  alternates: {
    canonical: '/',
  },
  title: 'Perú Sabor Inteligente — Gastronomía Peruana, Chef IA & Gestión de Restaurantes',
  description: 'Descubre, documenta, prepara, costea y gestiona la gastronomía peruana. Fichas técnicas, cálculo de porciones, menús, compras, inventario y asistente Chef IA Perú.',
  keywords: [
    'gastronomia peruana',
    'recetas peruanas',
    'chef ia peru',
    'ficha tecnica restaurante',
    'ceviche peruano',
    'lomo saltado',
    'costeo de recetas',
    'escalador de porciones',
    'gestion de restaurantes'
  ],
  authors: [{ name: 'Perú Sabor Inteligente Team', url: 'https://www.atpdev.dev' }],
  openGraph: {
    title: 'Perú Sabor Inteligente — Gastronomía Peruana, Chef IA & Gestión de Restaurantes',
    description: 'Descubre, documenta, prepara, costea y gestiona la gastronomía peruana con fichas técnicas, escalador de porciones y asistente Chef IA.',
    url: 'https://perusabor.atpdev.dev',
    siteName: 'Perú Sabor Inteligente',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: 'https://www.atpdev.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Perú Sabor Inteligente — Gastronomía Peruana & Costeo Técnico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perú Sabor Inteligente — Gastronomía Peruana & Chef IA',
    description: 'Fichas técnicas de cocina peruana, costeo Food Cost, escalador de porciones e inventario gastronómico.',
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
      '@id': 'https://perusabor.atpdev.dev/#webapp',
      name: 'Perú Sabor Inteligente',
      url: 'https://perusabor.atpdev.dev',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      inLanguage: 'es-PE',
      description: 'Plataforma técnica de gastronomía peruana: recetario estandarizado en gramos, calculadora de Food Cost, escalador de porciones y gestión de cocina.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PEN' },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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
      <body className="bg-[#faf9f6] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 min-h-screen flex flex-col antialiased selection:bg-red-500 selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}

