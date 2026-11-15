import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "OCR PDF Online — Reconocimiento Óptico de Texto en Documentos Escaneados | MasterAtPDF",
  description: "Extrae texto seleccionable de documentos PDF escaneados o fotografías mediante motor OCR neural ejecutado en tu navegador.",
  alternates: {
    canonical: "/tools/ocr",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
