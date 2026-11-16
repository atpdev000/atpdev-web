import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Configuración del Escáner Óptico y Privacidad | Lector QR Pro",
  description: "Personaliza el comportamiento del motor de lectura QR, sonido de confirmación, apertura inteligente de enlaces y almacenamiento local.",
  alternates: {
    canonical: "/ajustes",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
