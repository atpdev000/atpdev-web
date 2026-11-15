import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Recetario Maestro Peruano — Fichas Técnicas y Costeo | Perú Sabor",
  description: "Recetas clásicas de la gastronomía peruana con gramajes exactos, técnicas culinarias de precisión, puntos críticos y costeo por porción.",
  alternates: {
    canonical: "/recetas",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
