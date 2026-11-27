import type { Metadata } from 'next';
import PlanesClient from '@/components/PlanesClient';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'Planes y Paquetes de Créditos — Colorear Pro & Estudio KDP',
  description:
    'Usa gratis la biblioteca de dibujos PDF 300 DPI y el compilador KDP, o activa paquetes de créditos Pro (Stripe USD o Yape/Plin S/) para producción intensiva en Amazon KDP.',
  alternates: { canonical: 'https://colorear.atpdev.dev/planes' },
};

export default function PlanesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      <PlanesClient />
      <AdBanner />
    </div>
  );
}
