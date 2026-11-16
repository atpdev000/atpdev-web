import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guías Técnicas de Códigos QR, Seguridad QRishing y Formatos 2D | Lector QR Pro',
  description:
    'Guía técnica completa sobre corrección de errores Reed-Solomon (L, M, Q, H), creación de códigos QR para Wi-Fi y vCard, prevención de QRishing y compatibilidad de impresión.',
  alternates: {
    canonical: '/guias',
  },
};

export default function GuiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
