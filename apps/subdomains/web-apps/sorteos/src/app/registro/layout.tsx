import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Crear Cuenta | Sorteos Pro",
  description: "Crear Cuenta | Sorteos Pro",
  alternates: {
    canonical: "/registro",
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
