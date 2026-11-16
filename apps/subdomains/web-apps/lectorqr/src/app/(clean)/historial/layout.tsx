import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Historial Local de Códigos QR Escaneados y Generados | Lector QR Pro",
  description: "Consulta, filtra y exporta en formato CSV o JSON los códigos QR escaneados y creados en tu dispositivo con privacidad total.",
  alternates: {
    canonical: "/historial",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
