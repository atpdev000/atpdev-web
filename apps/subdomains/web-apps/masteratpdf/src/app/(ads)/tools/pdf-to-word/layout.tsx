import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convertir PDF a Word Editable (DOCX) Online | MasterAtPDF",
  description: "Extrae el contenido estructurado de tus archivos PDF hacia un documento Word (.docx) editable en segundos.",
  alternates: {
    canonical: "/tools/pdf-to-word",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
