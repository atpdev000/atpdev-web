import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/dados',
  shortName: 'Dados Virtuales 3D',
  title: 'Tirar Dados Virtuales 3D Online Gratis — Lanzador al Azar',
  description:
    'Lanza de 1 a 6 dados virtuales 3D online con suma automática, sonido, historial y entropía criptográfica CSPRNG ideal para juegos de mesa, clases y desempates en vivo.',
  keywords: [
    'tirar dados online',
    'dados virtuales 3d gratis',
    'lanzar dados al azar',
    'simulador de dados online',
    'roll dice online free',
  ],
  faqs: [
    {
      q: '¿Cuántos dados virtuales puedo lanzar al mismo tiempo?',
      a: 'Puedes lanzar desde 1 hasta 6 dados simultáneamente con cálculo automático de la suma e historial de tiradas.',
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
