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
  authors: [{ name: 'Perú Sabor Inteligente Team' }],
  icons: {
    icon: '/icon.svg',
  },
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}

