import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convertir Páginas PDF a Imágenes JPG de Alta Resolución | MasterAtPDF",
  description: "Extrae y renderiza cada página de tu archivo PDF como imágenes JPG o PNG nítidas de hasta 300 DPI en tu navegador.",
  alternates: {
    canonical: "/tools/pdf-to-jpg",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
