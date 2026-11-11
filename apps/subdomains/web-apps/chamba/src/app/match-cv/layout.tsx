import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Evaluador de Perfil y Compatibilidad Curricular CAS / 728 / 276 Perú 2026',
  description:
    'Coteja tu Currículum Vitae contra los Términos de Referencia y requisitos mínimos de las convocatorias oficiales del Estado (CAS 1057, D.L. 728, 276) y sector privado antes de postular.',
  keywords: [
    'cotejo curricular cas peru',
    'evaluar cv convocatoria cas',
    'filtro curricular cas servir',
    'compatibilidad perfil laboral estado',
    'requisitos minimos bases cas',
  ],
  alternates: {
    canonical: `${SITE_URL}/match-cv`,
  },
  openGraph: {
    title: 'Evaluador de Perfil Curricular para Convocatorias del Estado | chamba pro',
    description:
      'Verifica si tu CV cumple el perfil mínimo y experiencia exigida en las Bases CAS, 728 y 276 antes de enviar tu expediente.',
    url: `${SITE_URL}/match-cv`,
    siteName: 'chamba pro',
    locale: 'es_PE',
    type: 'website',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Evaluador de Compatibilidad Curricular CAS y Empleo Público',
  url: `${SITE_URL}/match-cv`,
  operatingSystem: 'All',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PEN',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Evaluador Curricular',
      item: `${SITE_URL}/match-cv`,
    },
  ],
};

export default function MatchCvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

