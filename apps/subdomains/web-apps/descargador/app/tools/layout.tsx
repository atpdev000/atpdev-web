import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Herramientas Multimedia de Respaldo | Descargador Pro',
  description: 'Explora nuestras utilidades especializadas para respaldar videos y audios públicos de Facebook, TikTok, Instagram, Twitter/X, Threads y WhatsApp en HD.',
  alternates: {
    canonical: '/tools',
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
