import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleAdSense from '../components/GoogleAdSense';
import CookieBanner from '../components/CookieBanner';

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
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        {/* Google AdSense Script */}
        <GoogleAdSense clientId="pub-5414009811868137" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black antialiased">
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
