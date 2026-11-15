import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contacto y Soporte Técnico | Lector QR Pro",
  description: "Comunícate con el equipo de desarrollo de Lector QR Pro (ATP DEV) para soporte técnico, reporte de errores o consultas institucionales.",
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
