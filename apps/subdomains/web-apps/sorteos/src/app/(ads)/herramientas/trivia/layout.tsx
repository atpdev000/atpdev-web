import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Generador de Trivias Online — Crea Quiz y Cuestionarios Personalizados',
  description: 'Crea tus quiz, cuestionarios y trivias online para capturar leads, entregar cupones de descuento y realizar sorteos automáticos 100% verificables.',
  keywords: [
    'generador de trivias',
    'crear trivia online',
    'crear quiz online gratis',
    'cuestionarios para sorteos',
    'captura de leads trivia',
    'sorteo de preguntas y respuestas',
    'trivia para tiendas online',
    'widget trivia shopify'
  ],
  alternates: {
    canonical: `${SITE_URL}/herramientas/trivia`,
  },
  openGraph: {
    title: `Generador de Trivias Online | ${SITE_NAME}`,
    description: 'Crea tus quiz y cuestionarios personalizados, captura leads y entrega premios con sorteos automáticos.',
    url: `${SITE_URL}/herramientas/trivia`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function TriviaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
