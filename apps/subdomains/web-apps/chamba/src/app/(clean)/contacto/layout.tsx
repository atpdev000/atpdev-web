import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Contacto y Atención al Usuario',
  description: 'Canal de atención al postulante, verificación de convocatorias, reporte de fraudes y consultas de soporte editorial de Chamba Pro.',
  alternates: {
    canonical: `${SITE_URL}/contacto`,
  },
  openGraph: {
    title: 'Contacto y Atención al Usuario | chamba pro',
    description: 'Canal de atención al postulante, verificación de convocatorias y reporte de fraudes de Chamba Pro.',
    url: `${SITE_URL}/contacto`,
    type: 'website',
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
