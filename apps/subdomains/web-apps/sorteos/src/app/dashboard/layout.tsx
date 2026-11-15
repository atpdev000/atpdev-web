import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Panel de Control | Sorteos Pro",
  description: "Panel de Control | Sorteos Pro",
  alternates: {
    canonical: "/dashboard",
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
