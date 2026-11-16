import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Insertar Números de Página en PDF Online | MasterAtPDF",
  description: "Enumera las páginas de tus informes, tesis o contratos en PDF eligiendo posición, tipografía, margen y formato.",
  alternates: {
    canonical: "/tools/page-numbers",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
