'use client';

import { usePathname } from 'next/navigation';
import { ADSENSE_CLIENT_ID } from '@/lib/siteConfig';

const EXCLUDED_ROUTES =
  /^\/(?:politica-de-privacidad|terminos-y-condiciones|cookies|politica-de-cookies|login|registro|recuperar-password|restablecer-password|dashboard|admin|auth|contacto|verificar|certificados|sorteos\/extension-install)(?:\/|$)/i;

/**
 * Componente oficial de Google AdSense para Sorteos Pro.
 * Carga adsbygoogle.js exclusivamente en páginas editoriales y herramientas con >= 350 palabras.
 */
export function GoogleAdSense({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  const rawId = clientId || ADSENSE_CLIENT_ID;
  if (!rawId || EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  const cleanClientId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;

  return (
    <script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClientId}`}
      crossOrigin="anonymous"
    />
  );
}

export default GoogleAdSense;
