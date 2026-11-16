import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Generador de Números Aleatorios sin Repetición | Sorteos Pro",
  description: "Genera números aleatorios dentro de cualquier rango con opción de exclusión, ordenamiento y prueba de entropía.",
  alternates: {
    canonical: "/herramientas/numeros",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
