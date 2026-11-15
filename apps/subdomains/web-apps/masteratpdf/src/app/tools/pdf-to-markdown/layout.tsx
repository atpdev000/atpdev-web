import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convertir PDF a Markdown (.md) para Desarrolladores y LLMs | MasterAtPDF",
  description: "Transforma documentos técnicos, papers y manuales en PDF a formato Markdown estructurado con encabezados y listas.",
  alternates: {
    canonical: "/tools/pdf-to-markdown",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
