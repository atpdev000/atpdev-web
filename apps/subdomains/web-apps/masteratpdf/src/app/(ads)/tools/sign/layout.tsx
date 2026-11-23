import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Firmar PDF Online con Firma Visual | MasterAtPDF',
  description: 'Dibuja, escribe o sube tu firma y colócala en cualquier página de tu documento PDF al instante.',
  alternates: {
    canonical: '/tools/sign',
  },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

