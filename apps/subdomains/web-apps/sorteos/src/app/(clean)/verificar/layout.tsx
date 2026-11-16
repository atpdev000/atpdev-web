import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Verificador Criptográfico de Sorteos (SHA-256) | Sorteos Pro",
  description: "Comprueba la autenticidad e inmutabilidad de cualquier certificado emitido por Sorteos Pro mediante su código o hash SHA-256.",
  alternates: {
    canonical: "/verificar",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
