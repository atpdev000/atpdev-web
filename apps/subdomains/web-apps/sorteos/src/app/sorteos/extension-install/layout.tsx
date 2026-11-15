import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Extensión Chrome Oficial para Sorteos de Instagram | Sorteos Pro",
  description: "Instala la extensión oficial de Sorteos Pro para extraer comentarios reales de Instagram y Facebook sin entregar tus contraseñas.",
  alternates: {
    canonical: "/sorteos/extension-install",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
