import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Contacto y Soporte Técnico',
  description:
    'Comunícate con el equipo de ingeniería y soporte de Sorteos Pro (ATP Dev) para consultas técnicas, alianzas o facturación.',
  alternates: {
    canonical: `${SITE_URL}/contacto`,
  },
  openGraph: {
    title: `Contacto y Soporte | ${SITE_NAME}`,
    description: 'Soporte técnico, consultas empresariales y activación de licencias de Sorteos Pro.',
    url: `${SITE_URL}/contacto`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
