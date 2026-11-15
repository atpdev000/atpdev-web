import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Iniciar Sesión | Sorteos Pro",
  description: "Iniciar Sesión | Sorteos Pro",
  alternates: {
    canonical: "/login",
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
