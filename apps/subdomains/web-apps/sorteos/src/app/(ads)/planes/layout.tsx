import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Planes y Precios Transparentes',
  description:
    'Conoce los planes Gratuito, Pro, Business y Enterprise de Sorteos Pro. Empieza gratis con 13 herramientas o escala tus sorteos en redes sociales con certificados SHA-256.',
  alternates: {
    canonical: `${SITE_URL}/planes`,
  },
  openGraph: {
    title: `Planes y Precios | ${SITE_NAME}`,
    description:
      'Empieza gratis o desbloquea sorteos masivos multi-red, filtros avanzados y exportación certificada.',
    url: `${SITE_URL}/planes`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
