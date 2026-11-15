import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Generador Inteligente de Hashtags para Sorteos Virales | Sorteos Pro",
  description: "Encuentra combinaciones de hashtags de alto alcance y baja saturación para maximizar la participación en tus sorteos.",
  alternates: {
    canonical: "/herramientas/hashtags",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
