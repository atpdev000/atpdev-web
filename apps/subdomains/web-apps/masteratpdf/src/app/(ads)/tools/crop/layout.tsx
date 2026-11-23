import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recortar Márgenes de PDF Online | MasterAtPDF',
  description: 'Ajusta los márgenes y recorta el área visible de todas o algunas páginas de tu documento PDF en segundos.',
  alternates: {
    canonical: '/tools/crop',
  },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

