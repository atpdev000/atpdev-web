import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Organizador de Amigo Secreto / Invisible Online | Sorteos Pro",
  description: "Organiza tu sorteo de Amigo Secreto con reglas de exclusión, presupuesto sugerido y enlaces privados para cada participante.",
  alternates: {
    canonical: "/herramientas/amigo-invisible",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
