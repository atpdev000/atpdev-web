import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Jugar Trivia en Vivo | Sorteos Pro Live Arena',
  description: 'Únete a la sala de juego en vivo, responde preguntas a contrarreloj y compite por los mejores puestos del ranking tipo Kahoot.',
  keywords: [
    'jugar trivia en vivo',
    'sala de trivia interactiva',
    'trivia online ranking',
    'juego de preguntas kahoot',
    'sorteos pro live'
  ],
  alternates: {
    canonical: `${SITE_URL}/trivia/jugar`,
  },
  openGraph: {
    title: `Jugar Trivia en Vivo | ${SITE_NAME}`,
    description: 'Únete a la partida en vivo, suma puntos por rapidez y racha, y gana cupones y premios.',
    url: `${SITE_URL}/trivia/jugar`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function TriviaJugarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
