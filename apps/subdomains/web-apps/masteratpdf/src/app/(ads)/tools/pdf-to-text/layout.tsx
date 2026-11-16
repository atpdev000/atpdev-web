import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Extraer Texto Plano (TXT) de un Archivo PDF | MasterAtPDF",
  description: "Extrae todo el texto indexado de cualquier documento PDF en formato TXT limpio para análisis o edición rápida.",
  alternates: {
    canonical: "/tools/pdf-to-text",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
