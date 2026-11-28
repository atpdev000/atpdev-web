import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/numeros',
  shortName: 'Generador de Números Aleatorios',
  title: 'Generador de Números Aleatorios Online Gratis (Sin Repetición)',
  description:
    'Genera números al azar dentro de cualquier rango para rifas, bingos y sorteos. Algoritmo criptográfico CSPRNG con opción sin repetidos, orden ascendente y exportación certificada.',
  keywords: [
    'generador de numeros aleatorios',
    'numeros al azar online gratis',
    'sorteo de numeros para rifa',
    'numero aleatorio sin repetir',
    'random number generator online',
  ],
  faqs: [
    {
      q: '¿Puedo generar varios números aleatorios sin que se repitan?',
      a: 'Sí. Marca la opción sin repetición para obtener tickets únicos en rifas, bingos o sorteos numerados.',
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
