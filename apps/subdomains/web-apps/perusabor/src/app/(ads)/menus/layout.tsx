import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Planificador de Menús Semanales y Lista de Compras | Perú Sabor",
  description: "Organiza tu carta o menú semanal peruano con consolidación automática de insumos, presupuesto estimado y balance nutricional.",
  alternates: {
    canonical: "/menus",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
