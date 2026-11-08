import { Metadata } from 'next'
import { getSubdomainConfig } from '@atpdev/database'
import TermsClient from '@/components/legal/TermsClient'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'Descargador Pro'
  return {
    title: `Términos de Servicio | ${siteTitle}`,
    description: `Términos y condiciones de uso de ${siteTitle}. Normas de uso aceptable, limitaciones de responsabilidad y doctrina de uso justo.`,
  }
}

export default function TermsPage() {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'Descargador Pro'
  const contactEmail = config?.contact?.email || 'contacto@atpdev.dev'

  return <TermsClient siteTitle={siteTitle} contactEmail={contactEmail} />
}

