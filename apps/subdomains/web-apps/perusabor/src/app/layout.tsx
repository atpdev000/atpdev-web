import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
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
  other: {
    'google-adsense-account': 'ca-pub-5414009811868137',
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#faf9f6] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 min-h-screen flex flex-col antialiased selection:bg-red-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

