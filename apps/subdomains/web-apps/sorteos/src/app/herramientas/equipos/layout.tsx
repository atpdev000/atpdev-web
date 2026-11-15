import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Generador de Equipos y Grupos Aleatorios Equilibrados | Sorteos Pro",
  description: "Divide cualquier lista de personas o jugadores en equipos balanceados al instante para torneos, trabajo o estudio.",
  alternates: {
    canonical: "/herramientas/equipos",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
