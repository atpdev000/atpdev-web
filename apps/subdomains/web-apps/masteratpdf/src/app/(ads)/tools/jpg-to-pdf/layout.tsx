import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convertir Imágenes JPG y PNG a PDF Online | MasterAtPDF",
  description: "Convierte fotografías, escaneos y capturas en formato JPG, PNG o WebP en un documento PDF multipágina limpio y ordenado.",
  alternates: {
    canonical: "/tools/jpg-to-pdf",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
