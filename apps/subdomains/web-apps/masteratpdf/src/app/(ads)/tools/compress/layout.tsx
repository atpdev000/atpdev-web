import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Comprimir PDF Online sin Perder Calidad | MasterAtPDF",
  description: "Reduce el peso y tamaño de tus archivos PDF optimizando imágenes y flujos internos de forma 100% local en tu dispositivo.",
  alternates: {
    canonical: "/tools/compress",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
