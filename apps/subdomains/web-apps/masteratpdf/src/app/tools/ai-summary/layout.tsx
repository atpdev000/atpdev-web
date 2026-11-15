import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Resumidor Inteligente de Documentos PDF y Análisis Ejecutivo | MasterAtPDF",
  description: "Analiza contratos, papers académicos y reportes extensos en PDF extrayendo puntos clave, conclusiones y métricas principales.",
  alternates: {
    canonical: "/tools/ai-summary",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
