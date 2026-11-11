import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administración Interna — Chamba Pro',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
