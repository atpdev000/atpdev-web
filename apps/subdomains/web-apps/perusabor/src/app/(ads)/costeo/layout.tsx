import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Calculadora de Costeo de Recetas y Food Cost (PEPS) | Perú Sabor",
  description: "Calcula el costo real por plato, margen bruto, precio sugerido de carta con IGV y recargo de servicios para restaurantes en Perú.",
  alternates: {
    canonical: "/costeo",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
