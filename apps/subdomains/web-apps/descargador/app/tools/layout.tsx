import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Herramientas de Descarga - FTY Downloader Pro',
  description: 'Utiliza nuestras herramientas profesionales para descargar videos de Facebook en HD y TikTok sin marca de agua. Rápido, seguro y 100% gratuito.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}