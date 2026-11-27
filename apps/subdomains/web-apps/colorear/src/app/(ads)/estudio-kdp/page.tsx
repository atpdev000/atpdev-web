import type { Metadata } from 'next';
import KdpStudioClient from '@/components/KdpStudioClient';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'Estudio Amazon KDP — Crea Libros para Colorear 300 DPI y Portadas',
  description:
    'Planifica libros para colorear con IA, limpia tus ilustraciones a blanco y negro puro, compila PDF interior 8.5×11" a 300 DPI con reversos en blanco y calcula el lomo exacto para Amazon KDP.',
  alternates: { canonical: 'https://colorear.atpdev.dev/estudio-kdp' },
};

export default function EstudioKdpPage() {
  return (
    <>
      <KdpStudioClient />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner />
      </div>
    </>
  );
}

