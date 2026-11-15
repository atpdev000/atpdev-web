import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Calculadora de Engagement Rate para Instagram y TikTok | Sorteos Pro",
  description: "Mide la tasa real de interacción de cualquier cuenta o publicación antes de lanzar un sorteo o colaboración con influencers.",
  alternates: {
    canonical: "/herramientas/engagement",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
