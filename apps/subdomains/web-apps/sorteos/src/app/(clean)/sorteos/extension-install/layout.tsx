import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Asistente de Extensión para Navegador | Sorteos Pro",
  description: "Guía técnica opcional para conectar la extensión oficial de Sorteos Pro en navegadores compatibles.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/sorteos/extension-install",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
