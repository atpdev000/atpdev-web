import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `Entrando a la Sala de Trivia | ${SITE_NAME}`,
  description: 'Sala de juego interactiva en vivo.',
};

export default function ShortPinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
