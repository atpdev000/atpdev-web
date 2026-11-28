import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/amigo-invisible',
  shortName: 'Amigo Invisible Online',
  title: 'Amigo Invisible y Amigo Secreto Online Gratis (WhatsApp y Excel)',
  description:
    'Organiza tu sorteo de Amigo Invisible o Amigo Secreto gratis sin registro. Pega tu lista desde Excel o captura con Ctrl+V, configura presupuesto y envía tarjetas secretas por WhatsApp.',
  keywords: [
    'amigo invisible online gratis',
    'amigo secreto online',
    'sorteo amigo invisible whatsapp',
    'generador amigo secreto',
    'sorteo intercambio de regalos',
    'secret santa generator free',
  ],
  faqs: [
    {
      q: '¿Cómo hacer un sorteo de Amigo Invisible gratis sin que nadie vea los resultados?',
      a: 'Agrega o pega los nombres desde Excel o una captura con Ctrl+V, pulsa generar parejas secretas y comparte cada enlace o mensaje privado de WhatsApp de forma individual.',
    },
    {
      q: '¿Alguien puede sacarse a sí mismo en el sorteo de Amigo Secreto?',
      a: 'No. Nuestro algoritmo CSPRNG aplica permutación sin puntos fijos (derangement), garantizando matemáticamente que ningún participante se asigne a sí mismo.',
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
