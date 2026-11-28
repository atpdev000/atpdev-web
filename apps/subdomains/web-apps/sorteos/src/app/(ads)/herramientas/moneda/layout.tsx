import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/moneda',
  shortName: 'Lanzar Moneda Cara o Cruz',
  title: 'Lanzar Moneda Online Gratis — Cara o Cruz / Cara o Sello',
  description:
    'Tira una moneda virtual al aire (Cara o Cruz / Cara o Sello) con probabilidad exacta 50/50 mediante Web Crypto API, historial estadístico y animación 3D.',
  keywords: [
    'lanzar moneda online',
    'cara o cruz online gratis',
    'cara o sello virtual',
    'volado moneda online',
    'flip a coin online',
  ],
  faqs: [
    {
      q: '¿La moneda virtual tiene exactamente 50% de probabilidad para cada cara?',
      a: 'Sí. Cada lanzamiento se genera de forma independiente con entropía criptográfica del navegador sin memoria de tiradas anteriores.',
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
