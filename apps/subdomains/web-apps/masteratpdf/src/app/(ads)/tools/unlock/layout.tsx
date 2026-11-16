import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Desbloquear PDF y Quitar Restricciones de Contraseña | MasterAtPDF",
  description: "Elimina la contraseña de tus propios documentos PDF protegidos para editarlos o imprimirlos sin restricciones.",
  alternates: {
    canonical: "/tools/unlock",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
