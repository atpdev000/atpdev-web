import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Proteger y Encriptar PDF con Contraseña (AES) | MasterAtPDF",
  description: "Cifra tus archivos PDF confidenciales con contraseña de apertura y permisos de impresión directamente en tu navegador.",
  alternates: {
    canonical: "/tools/protect",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
