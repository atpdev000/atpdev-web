import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Lector QR Pro • Escáner de Códigos QR y de Barras Ultrarrápido',
  description: 'Lector y escáner profesional de códigos QR y códigos de barras en tiempo real. Decodifica enlaces, Wi-Fi, contactos vCard, WhatsApp, genera códigos personalizados y guarda tu historial sin límites.',
  keywords: ['lector qr', 'escanear qr online', 'generador qr gratis', 'lector codigos de barra', 'escanear wifi qr', 'qr pro', 'atp dev'],
  authors: [{ name: 'ATP DEV Perú' }],
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
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
