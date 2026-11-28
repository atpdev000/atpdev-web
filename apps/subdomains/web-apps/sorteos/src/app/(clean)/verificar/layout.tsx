import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Verificador Criptográfico de Certificados SHA-256',
  description:
    'Verifica en tiempo real la autenticidad e inmutabilidad de cualquier certificado emitido por Sorteos Pro ingresando su código oficial o hash SHA-256.',
  alternates: {
    canonical: `${SITE_URL}/verificar`,
  },
  openGraph: {
    title: `Verificador Oficial de Sorteos SHA-256 | ${SITE_NAME}`,
    description:
      'Audita cualquier certificado de sorteo y confirma que los ganadores fueron elegidos sin manipulación.',
    url: `${SITE_URL}/verificar`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
