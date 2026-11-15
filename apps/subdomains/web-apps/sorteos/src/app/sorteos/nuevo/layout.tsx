import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Crear Sorteo Online Certificado con Hash SHA-256 | Sorteos Pro",
  description: "Crea un sorteo transparente de comentarios, listas o redes sociales con certificado criptográfico SHA-256 verificable en tiempo real.",
  alternates: {
    canonical: "/sorteos/nuevo",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
