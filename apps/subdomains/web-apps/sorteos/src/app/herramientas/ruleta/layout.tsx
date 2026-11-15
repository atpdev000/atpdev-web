import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ruleta Aleatoria Online Personalizable (CSPRNG) | Sorteos Pro",
  description: "Gira la ruleta aleatoria con física realista y entropía criptográfica Web Crypto API para sorteos en vivo, clases y eventos.",
  alternates: {
    canonical: "/herramientas/ruleta",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
