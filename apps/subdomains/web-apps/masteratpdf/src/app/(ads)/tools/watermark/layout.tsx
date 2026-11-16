import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Añadir Marca de Agua a un PDF Online | MasterAtPDF",
  description: "Protege la autoría de tus documentos PDF insertando marcas de agua de texto personalizadas con control de opacidad y rotación.",
  alternates: {
    canonical: "/tools/watermark",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
