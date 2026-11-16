import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Asistente Culinario Chef IA Peruano — Técnicas y Sustituciones | Perú Sabor",
  description: "Consultor gastronómico inteligente especializado en cocina peruana, balance de sabores, sustituciones de insumos y técnicas de restaurante.",
  alternates: {
    canonical: "/chef-ia",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
