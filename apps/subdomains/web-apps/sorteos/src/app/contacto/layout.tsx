import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contacto y Soporte Técnico — Sorteos Pro",
  description: "Comunícate con el equipo de ingeniería y soporte de Sorteos Pro (ATP DEV) para consultas técnicas, alianzas o facturación.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
