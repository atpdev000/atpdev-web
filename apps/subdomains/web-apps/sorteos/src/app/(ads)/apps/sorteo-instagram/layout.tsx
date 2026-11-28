import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/apps/sorteo-instagram',
  shortName: 'Sorteo en Instagram Gratis',
  title: 'Sorteo de Comentarios en Instagram Gratis y Certificado SHA-256',
  description:
    'Haz tu sorteo en Instagram gratis entre comentarios de publicaciones y Reels. Filtra menciones, hashtags, usuarios duplicados y genera un certificado público verificable al instante.',
  keywords: [
    'sorteo instagram gratis',
    'hacer sorteo en instagram comentarios',
    'app sorteo instagram gratis',
    'sorteo reels instagram certificado',
    'instagram comment picker free',
    'instagram giveaway picker',
  ],
  parentLabel: 'Aplicaciones',
  parentPath: '/sorteos/nuevo',
  faqs: [
    {
      q: '¿Cómo hacer un sorteo de comentarios en Instagram gratis?',
      a: 'Pega el enlace de tu publicación o Reel público, elige cuántos ganadores y suplentes deseas, aplica filtros de menciones o duplicados y genera el resultado certificado.',
    },
    {
      q: '¿Es seguro hacer sorteos de Instagram en Sorteos Pro?',
      a: 'Sí. Nunca solicitamos la contraseña de tu cuenta de Instagram y cada sorteo emite un certificado público con huella criptográfica SHA-256.',
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
