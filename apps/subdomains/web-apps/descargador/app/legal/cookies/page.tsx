import { Metadata } from 'next'
import { getSubdomainConfig } from '@atpdev/database'
import CookiesClient from '@/components/legal/CookiesClient'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'Descargador Pro'
  return {
    title: `Política de Cookies | ${siteTitle}`,
    description: `Conoce en detalle cómo ${siteTitle} utiliza cookies técnicas y almacenamiento local para brindarte la mejor experiencia.`,
  }
}

export default function CookiesPage() {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'Descargador Pro'
  const contactEmail = config?.contact?.email || 'contacto@atpdev.dev'

  return <CookiesClient siteTitle={siteTitle} contactEmail={contactEmail} />
}

