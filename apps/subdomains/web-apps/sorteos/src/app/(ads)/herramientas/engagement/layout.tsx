import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/engagement',
  shortName: 'Calculadora de Engagement',
  title: 'Calculadora de Engagement Rate Gratis (Instagram, TikTok y YouTube)',
  description:
    'Calcula la tasa real de engagement de cualquier perfil o publicación en Instagram, TikTok o YouTube antes de lanzar un sorteo o colaboración con creadores.',
  keywords: [
    'calculadora de engagement instagram',
    'calcular engagement rate tiktok',
    'medir interaccion redes sociales gratis',
    'instagram engagement rate calculator',
  ],
  faqs: [
    {
      q: '¿Qué porcentaje de engagement se considera bueno en Instagram y TikTok?',
      a: 'Generalmente entre 2% y 5% es un engagement saludable en Instagram, y superior al 6% en TikTok, dependiendo del tamaño de la audiencia.',
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
