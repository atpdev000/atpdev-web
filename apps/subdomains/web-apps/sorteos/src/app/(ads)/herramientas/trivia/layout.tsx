import type { Metadata } from 'next';
import { buildToolJsonLd, buildToolMetadata, type ToolSeoConfig } from '@/lib/seoSchema';

const SEO: ToolSeoConfig = {
  slug: '/herramientas/trivia',
  shortName: 'Trivia Interactiva en Vivo',
  title: 'Generador de Trivias Online Gratis con PIN — Quiz en Vivo',
  description:
    'Crea trivias y quizzes interactivos con PIN de sala tipo Kahoot para directos, clases, eventos y sorteos. Ranking en tiempo real y exportación de ganadores gratis.',
  keywords: [
    'generador de trivias online',
    'crear trivia gratis con pin',
    'quiz interactivo en vivo',
    'trivia tipo kahoot gratis',
    'sorteo de preguntas y respuestas',
    'live trivia quiz maker free',
  ],
  faqs: [
    {
      q: '¿Cómo jugar una trivia en vivo con amigos o audiencia?',
      a: 'Crea tus preguntas en el editor, genera un PIN de sala y compártelo para que los participantes respondan desde su celular con ranking automático.',
    },
  ],
};

export const metadata: Metadata = buildToolMetadata(SEO);

export default function TriviaLayout({ children }: { children: React.ReactNode }) {
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
