import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/sorteos/nuevo',
  shortName: 'Crear Sorteo Certificado',
  title: 'Crear Sorteo Online Gratis y Certificado (Instagram, TikTok, YouTube)',
  description:
    'Crea sorteos multi-red en Instagram, TikTok, YouTube, Facebook, X y Threads con filtros de menciones, hashtags, exclusión de duplicados y certificado SHA-256 auditable.',
  keywords: [
    'crear sorteo online gratis',
    'sorteo multi red social',
    'sorteo comentarios tiktok youtube facebook',
    'sorteo certificado sha-256',
    'multi platform giveaway picker',
  ],
  parentLabel: 'Sorteos',
  parentPath: '/',
  faqs: [
    {
      q: '¿Qué redes sociales soporta el asistente de sorteos?',
      a: 'Soporta Instagram, TikTok, YouTube, Facebook, X (Twitter) y Threads, incluso combinando comentarios de varias publicaciones en un solo sorteo multi-red.',
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
