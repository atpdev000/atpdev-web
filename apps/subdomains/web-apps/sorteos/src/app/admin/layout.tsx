import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Administración | Sorteos Pro",
  description: "Administración | Sorteos Pro",
  alternates: {
    canonical: "/admin",
  },
  robots: { index: false, follow: false },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
