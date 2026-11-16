import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Lanzar Dados Virtuales 3D Online al Azar | Sorteos Pro",
  description: "Simulador de dados virtuales con generador criptográfico CSPRNG para juegos de rol, dinámicas y sorteos rápidos.",
  alternates: {
    canonical: "/herramientas/dados",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
