import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/raspa-gana',
  shortName: 'Raspa y Gana Digital',
  title: 'Tarjetas Raspa y Gana Online Gratis — Personalizables',
  description:
    'Crea tarjetas virtuales de Raspa y Gana con premios personalizados para tus campañas, directos, ferias y dinámicas interactivas desde el navegador.',
  keywords: [
    'raspa y gana online gratis',
    'tarjeta rasca y gana virtual',
    'crear raspa y gana digital',
    'digital scratch card maker',
  ],
  faqs: [
    {
      q: '¿Puedo personalizar los premios de la tarjeta Raspa y Gana?',
      a: 'Sí. Agrega premios uno por uno o pega una lista completa desde Excel para generar tarjetas al azar al instante.',
    },
  ],
};

export const metadata: Metadata = buildToolMetadata(SEO);

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildToolJsonLd(SEO)) }}
      />
      {children}
    </>
  );
}
