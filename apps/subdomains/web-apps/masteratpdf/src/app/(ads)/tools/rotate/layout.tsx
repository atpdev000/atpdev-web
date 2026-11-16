import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Rotar Páginas de un PDF Online Permanente | MasterAtPDF",
  description: "Gira páginas individuales o todo un documento PDF a 90°, 180° o 270° y guarda el archivo corregido al instante.",
  alternates: {
    canonical: "/tools/rotate",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
