import { Metadata } from 'next'
import { getSubdomainConfig } from '@atpdev/database'
import PrivacyClient from '@/components/legal/PrivacyClient'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'Descargador Pro'
  return {
    title: `Política de Privacidad | ${siteTitle}`,
    description: `Conoce cómo protegemos tu privacidad, nuestra política de cookies y el tratamiento seguro de datos en ${siteTitle} conforme a RGPD y Google AdSense.`,
  }
}

export default function PrivacyPage() {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'Descargador Pro'
  const contactEmail = config?.contact?.email || 'contacto@atpdev.dev'

  return <PrivacyClient siteTitle={siteTitle} contactEmail={contactEmail} />
}

