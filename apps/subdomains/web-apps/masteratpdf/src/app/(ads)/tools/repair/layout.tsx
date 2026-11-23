import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reparar PDF Dañado o Corrupto Online | MasterAtPDF',
  description: 'Recupera páginas y reconstruye tablas XRef o streams dañados de archivos PDF que no abren correctamente.',
  alternates: {
    canonical: '/tools/repair',
  },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

