import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Escalador No Lineal de Recetas e Insumos | Perú Sabor",
  description: "Escala recetas peruanas desde 4 hasta 200 porciones ajustando sal, picante, espesantes y mermas de cocción con precisión técnica.",
  alternates: {
    canonical: "/escalador",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
