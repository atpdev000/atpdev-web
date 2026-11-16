import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convertir Word (DOCX) a PDF Online sin Perder Formato | MasterAtPDF",
  description: "Transforma documentos de Microsoft Word (.docx) a formato PDF estándar conservando estructura, tablas y tipografías.",
  alternates: {
    canonical: "/tools/word-to-pdf",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
