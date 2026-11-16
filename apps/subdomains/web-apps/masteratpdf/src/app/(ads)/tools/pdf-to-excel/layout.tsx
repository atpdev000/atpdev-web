import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convertir Tablas de PDF a Excel (XLSX / CSV) | MasterAtPDF",
  description: "Detecta y exporta tablas financieras, inventarios y listados desde documentos PDF hacia hojas de cálculo Excel.",
  alternates: {
    canonical: "/tools/pdf-to-excel",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
