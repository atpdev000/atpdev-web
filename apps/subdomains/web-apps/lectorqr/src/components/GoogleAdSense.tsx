'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const ADSENSE_CLIENT_ID = 'ca-pub-5414009811868137';
const EXCLUDED_ROUTES = /^\/(?:politica-de-privacidad|terminos-y-condiciones|politica-de-cookies|ajustes|historial|contacto)(?:\/|$)/i;

/**
 * Carga oficial de Google AdSense para Lector QR Pro (lectorqr.atpdev.dev).
 * Excluye páginas legales y de configuración local para cumplir las políticas de Google AdSense.
 */
export function GoogleAdSense({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  const resolvedId = clientId || ADSENSE_CLIENT_ID;
  if (EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

export default GoogleAdSense;
