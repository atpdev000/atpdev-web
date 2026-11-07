import { Metadata } from 'next'
import { getSubdomainConfig } from '@atpdev/database'
import CopyrightClient from '@/components/legal/CopyrightClient'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'FTY Downloader Pro'
  return {
    title: `Política de Copyright y DMCA | ${siteTitle}`,
    description: `Información sobre derechos de autor, procedimiento de notificación DMCA y uso legítimo en ${siteTitle}.`,
  }
}

export default function CopyrightPage() {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'FTY Downloader Pro'
  const contactEmail = config?.contact?.email || 'contacto@atpdev.dev'

  return <CopyrightClient siteTitle={siteTitle} contactEmail={contactEmail} />
}
