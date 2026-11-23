import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Censurar y Ocultar Texto Confidencial en PDF | MasterAtPDF',
  description: 'Elimina de forma permanente datos sensibles, DNI, montos o información confidencial de documentos PDF.',
  alternates: {
    canonical: '/tools/redact',
  },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

