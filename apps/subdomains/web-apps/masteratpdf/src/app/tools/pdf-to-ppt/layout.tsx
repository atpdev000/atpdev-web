import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convertir PDF a Presentación PowerPoint (PPTX) | MasterAtPDF",
  description: "Convierte cada página de tu documento PDF en diapositivas listas para presentar en Microsoft PowerPoint.",
  alternates: {
    canonical: "/tools/pdf-to-ppt",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
