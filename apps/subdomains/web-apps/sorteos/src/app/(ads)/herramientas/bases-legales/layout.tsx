import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/bases-legales',
  shortName: 'Generador de Bases Legales',
  title: 'Generador de Bases Legales para Sorteos Gratis (Instagram y TikTok)',
  description:
    'Crea las bases legales y términos y condiciones para tus sorteos en Instagram, TikTok, YouTube o Facebook en segundos cumpliendo las políticas de Meta.',
  keywords: [
    'generador bases legales sorteo',
    'terminos y condiciones sorteo instagram',
    'plantilla bases legales sorteo gratis',
    'giveaway terms and conditions generator',
  ],
  faqs: [
    {
      q: '¿Incluye el descargo obligatorio exigido por Instagram y Meta?',
      a: 'Sí. El documento generado incorpora automáticamente la cláusula oficial de exoneración de responsabilidad frente a Instagram, Facebook, TikTok y YouTube.',
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
