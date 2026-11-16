import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Control de Inventario Gastronómico y Mermas | Perú Sabor",
  description: "Gestiona tu almacén de insumos gastronómicos, precios por kilo/litro, porcentajes de merma y alertas de stock para cocina profesional.",
  alternates: {
    canonical: "/inventario",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
