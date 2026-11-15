import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Organizar, Reordenar y Eliminar Páginas PDF | MasterAtPDF",
  description: "Arrastra, reordena, clona o elimina páginas específicas de cualquier archivo PDF con vista previa instantánea en el navegador.",
  alternates: {
    canonical: "/tools/organize",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
