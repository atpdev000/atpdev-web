import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/lista',
  shortName: 'Sorteo por Lista de Nombres',
  title: 'Sorteo de Nombres al Azar Gratis (Pegar Excel, Word, PDF y OCR)',
  description:
    'Elige ganadores y suplentes al azar desde una lista de nombres gratis. Pega directamente desde Excel o una captura con Ctrl+V, elimina duplicados y descarga certificado SHA-256.',
  keywords: [
    'sorteo de nombres gratis',
    'sortear nombres al azar',
    'sorteo lista excel online',
    'elegir ganador aleatorio lista',
    'random name picker online',
    'name draw generator',
  ],
  faqs: [
    {
      q: '¿Cómo sortear una lista de nombres copiada desde Excel?',
      a: 'Copia las celdas en Excel y presiona Ctrl+V en el campo de participantes. Sorteos Pro limpia automáticamente los números de fila y mantiene intacto el formato "APELLIDOS, Nombres".',
    },
    {
      q: '¿Puedo elegir varios ganadores y suplentes en un solo sorteo?',
      a: 'Sí. Abre las Opciones Avanzadas para elegir cuántos ganadores titulares y suplentes deseas, activar filtro de duplicados y cuenta regresiva 3D.',
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
