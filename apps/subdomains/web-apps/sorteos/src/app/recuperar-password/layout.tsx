import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Sorteos Pro",
  description: "Recuperar Contraseña | Sorteos Pro",
  alternates: {
    canonical: "/recuperar-password",
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
