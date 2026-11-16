import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Generador de Bases Legales para Sorteos y Promociones | Sorteos Pro",
  description: "Redacta las bases legales y términos de participación para tus sorteos en Instagram, TikTok, Facebook o YouTube en minutos.",
  alternates: {
    canonical: "/herramientas/bases-legales",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
