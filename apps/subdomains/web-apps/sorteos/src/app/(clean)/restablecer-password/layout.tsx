import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Restablecer Contraseña | Sorteos Pro",
  description: "Restablecer Contraseña | Sorteos Pro",
  alternates: {
    canonical: "/restablecer-password",
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
