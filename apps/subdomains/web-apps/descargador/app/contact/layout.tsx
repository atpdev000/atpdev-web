import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto y Soporte Técnico | Descargador Pro',
  description: 'Comunícate con el equipo de ingeniería de Descargador Pro (ATP DEV) para soporte técnico, consultas sobre licencias o reportes DMCA.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
