import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Generador de Códigos QR Personalizados (WiFi, vCard, URL) | Lector QR Pro",
  description: "Crea códigos QR de alta resolución en PNG y SVG para enlaces, redes WiFi, tarjetas de contacto vCard, WhatsApp y texto libre 100% en tu navegador.",
  alternates: {
    canonical: "/generar",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
