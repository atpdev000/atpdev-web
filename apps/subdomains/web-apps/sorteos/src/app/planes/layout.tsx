import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Planes y Precios Transparentes — Sorteos Pro",
  description: "Conoce los planes Gratuito, Creator y Business de Sorteos Pro para creadores de contenido, marcas y agencias de marketing.",
  alternates: {
    canonical: "/planes",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
