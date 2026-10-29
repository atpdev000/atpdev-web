import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - Soporte FTY Downloader Pro',
  description: '¿Necesitas ayuda con tus descargas? Ponte en contacto con el equipo de soporte técnico de FTY Downloader Pro. Estamos para ayudarte.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}