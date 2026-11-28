import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/ruleta',
  shortName: 'Ruleta Aleatoria Online',
  title: 'Ruleta Aleatoria Online Gratis — Ruleta de Nombres y Premios',
  description:
    'Gira nuestra ruleta aleatoria personalizable gratis y sin registro. Pega listas desde Excel o capturas con Ctrl+V, gira con física realista, algoritmo CSPRNG y modo pantalla completa para directos.',
  keywords: [
    'ruleta aleatoria online',
    'ruleta de nombres gratis',
    'ruleta para sorteos',
    'ruleta giratoria personalizable',
    'wheel of names free',
    'random wheel spinner',
  ],
  faqs: [
    {
      q: '¿La ruleta aleatoria online es realmente imparcial?',
      a: 'Sí. Antes de animar el giro, el índice ganador se calcula con Web Crypto API (CSPRNG), asignando exactamente la misma probabilidad a cada sector.',
    },
    {
      q: '¿Puedo importar nombres desde Excel o una foto a la ruleta?',
      a: 'Sí. Solo presiona Ctrl+V para pegar filas de Excel o una captura de pantalla (OCR automático), o sube un archivo .xlsx, .docx, PDF o CSV.',
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
