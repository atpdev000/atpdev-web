import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sorteo por Lista de Nombres o Participantes al Azar | Sorteos Pro",
  description: "Ingresa o importa tu lista de participantes desde Excel/CSV y elige ganadores y suplentes al azar sin sesgos.",
  alternates: {
    canonical: "/herramientas/lista",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
