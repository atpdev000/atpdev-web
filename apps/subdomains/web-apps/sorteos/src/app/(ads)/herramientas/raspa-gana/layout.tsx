import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tarjetas Raspa y Gana Digitales Interactivas | Sorteos Pro",
  description: "Crea dinámicas de Raspa y Gana digitales para premiar clientes, seguidores o participantes en vivo.",
  alternates: {
    canonical: "/herramientas/raspa-gana",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
