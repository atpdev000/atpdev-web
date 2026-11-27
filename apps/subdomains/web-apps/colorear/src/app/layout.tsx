import type { Metadata, Viewport } from 'next';
import { Fredoka, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://colorear.atpdev.dev'),
  title: {
    default: 'Colorear Pro — Dibujos para Colorear en PDF Gratis y Estudio Amazon KDP',
    template: '%s | Colorear Pro',
  },
  description:
    'Descarga dibujos para colorear gratis en PDF de 300 DPI, pinta online o crea libros completos listos para Amazon KDP (8.5×11", line-art limpio, reversos en blanco y portada con lomo exacto).',
  keywords: [
    'dibujos para colorear pdf',
    'hojas para colorear imprimir gratis',
    'mandalas faciles para imprimir',
    'dibujos de dinosaurios para colorear',
    'crear libros para colorear amazon kdp',
    'generador libros colorear ia 300 dpi',
    'calculadora lomo amazon kdp',
  ],
  authors: [{ name: 'ATP Dev Perú', url: 'https://www.atpdev.dev' }],
  alternates: {
    canonical: 'https://colorear.atpdev.dev',
  },
  openGraph: {
    title: 'Colorear Pro — Láminas Gratis en PDF y Estudio de Libros Amazon KDP',
    description:
      'Imprime láminas originales a 300 DPI gratis o arma libros completos listos para publicar en Amazon KDP con limpieza line-art y cálculo de lomo.',
    url: 'https://colorear.atpdev.dev',
    siteName: 'Colorear Pro',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: 'https://www.atpdev.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Colorear Pro — Láminas PDF 300 DPI y Estudio KDP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Colorear Pro — Dibujos PDF Gratis y Estudio Amazon KDP',
    description:
      'Láminas infantiles y mandalas gratis a 300 DPI + compilador de libros para colorear listos para Amazon KDP.',
    images: ['https://www.atpdev.dev/og-image.png'],
  },
};

const rootJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://colorear.atpdev.dev/#webapp',
      name: 'Colorear Pro',
      url: 'https://colorear.atpdev.dev',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'All',
      inLanguage: 'es-PE',
      description:
        'Biblioteca gratuita de dibujos para colorear en PDF 300 DPI y estudio profesional para crear libros de colorear listos para Amazon KDP.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${fredoka.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="colorear-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('colorear_theme');
                  if (t === 'dark') document.documentElement.classList.add('dark');
                } catch(e){}
              })();
            `,
          }}
        />
        <Script
          id="colorear-consent-v2"
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
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

