import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/hashtags',
  shortName: 'Generador de Hashtags',
  title: 'Generador de Hashtags Gratis para Sorteos en Instagram y TikTok',
  description:
    'Descubre combinaciones de hashtags de alto alcance y baja competencia para multiplicar la participación orgánica en tus sorteos y promociones.',
  keywords: [
    'generador de hashtags gratis',
    'hashtags para sorteos instagram',
    'hashtags virales tiktok',
    'giveaway hashtag generator',
  ],
  faqs: [
    {
      q: '¿Cuántos hashtags conviene usar en un sorteo de Instagram o TikTok?',
      a: 'Se recomienda usar entre 5 y 10 hashtags bien segmentados combinando etiquetas de nicho, ubicación y sorteo para maximizar alcance real.',
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
