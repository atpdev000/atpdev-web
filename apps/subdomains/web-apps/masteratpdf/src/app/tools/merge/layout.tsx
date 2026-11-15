import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Unir PDF Online Gratis — Combinar Archivos PDF Localmente | MasterAtPDF",
  description: "Une y combina múltiples documentos PDF en un solo archivo de forma 100% privada en tu navegador sin subir documentos a servidores externos.",
  alternates: {
    canonical: "/tools/merge",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
