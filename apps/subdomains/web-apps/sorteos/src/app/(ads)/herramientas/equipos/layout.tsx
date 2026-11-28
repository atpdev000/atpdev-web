import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/equipos',
  shortName: 'Generador de Equipos al Azar',
  title: 'Generador de Equipos y Grupos Aleatorios Gratis (Equilibrados)',
  description:
    'Divide listas de estudiantes, jugadores o colegas en equipos balanceados al instante. Pega tu lista desde Excel o captura con Ctrl+V, asigna capitanes y exporta resultados a CSV/PDF.',
  keywords: [
    'generador de equipos al azar',
    'hacer grupos aleatorios online',
    'dividir personas en equipos gratis',
    'sorteo de equipos equilibrados',
    'random team generator',
    'group maker online',
  ],
  faqs: [
    {
      q: '¿Cómo dividir una lista de alumnos en grupos equilibrados?',
      a: 'Pega el listado desde Excel o captura con Ctrl+V, elige si dividir por número de equipos o integrantes por grupo y pulsa Generar Equipos.',
    },
    {
      q: '¿Se pueden elegir capitanes y exportar los equipos formados?',
      a: 'Sí. Puedes sortear un capitán por equipo con 1 clic y exportar todos los grupos a CSV, WhatsApp, PDF o imagen.',
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
