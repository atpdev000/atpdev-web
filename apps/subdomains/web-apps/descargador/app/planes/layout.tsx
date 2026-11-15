import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planes PRO y Licencias sin Anuncios | Descargador Pro',
  description: 'Activa o adquiere tu licencia Descargador Pro para disfrutar de una experiencia 100% libre de publicidad y soporte prioritario.',
  alternates: {
    canonical: '/planes',
  },
}

export default function PlanesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
