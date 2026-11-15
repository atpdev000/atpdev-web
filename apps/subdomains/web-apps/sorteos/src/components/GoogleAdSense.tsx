'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { ADSENSE_CLIENT_ID } from '@/lib/siteConfig';

const EXCLUDED_ROUTES = /^\/(?:politica-de-privacidad|terminos-y-condiciones|login|registro|recuperar-password|restablecer-password|dashboard|admin|auth|contacto)(?:\/|$)/i;

/**
 * Componente oficial de Google AdSense para Sorteos Pro.
 * Excluye páginas legales, de autenticación y paneles privados para cumplir las políticas de Google AdSense.
 */
export function GoogleAdSense({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  const rawId = clientId || ADSENSE_CLIENT_ID;
  if (!rawId || EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  const cleanClientId = rawId.startsWith('ca-')
    ? rawId
    : `ca-${rawId}`;

  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

export default GoogleAdSense;
