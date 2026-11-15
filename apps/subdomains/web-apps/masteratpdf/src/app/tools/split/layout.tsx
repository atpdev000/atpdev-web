import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dividir PDF y Extraer Páginas Online Gratis | MasterAtPDF",
  description: "Separa páginas individuales o divide un documento PDF por rangos directamente en tu navegador con tecnología WebAssembly.",
  alternates: {
    canonical: "/tools/split",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
