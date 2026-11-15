import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Simulador de Rentabilidad e Ingeniería de Menú (Matriz BCG) | Perú Sabor",
  description: "Analiza la rentabilidad de tu restaurante con matriz de ingeniería de menú (platos Estrella, Caballo, Puzzle y Perro) y punto de equilibrio.",
  alternates: {
    canonical: "/restaurante",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
