import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sorteo de Comentarios en Instagram Gratis y Certificado | Sorteos Pro",
  description: "Elige ganadores de comentarios en Instagram con filtros de menciones, hashtags, duplicados y certificado público auditable.",
  alternates: {
    canonical: "/apps/sorteo-instagram",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
