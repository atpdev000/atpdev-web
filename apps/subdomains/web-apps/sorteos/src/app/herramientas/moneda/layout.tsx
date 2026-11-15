import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Lanzar Moneda al Aire Online (Cara o Cruz Certificado) | Sorteos Pro",
  description: "Toma decisiones rápidas con nuestro simulador de cara o cruz impulsado por aleatoriedad criptográfica de navegador.",
  alternates: {
    canonical: "/herramientas/moneda",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
