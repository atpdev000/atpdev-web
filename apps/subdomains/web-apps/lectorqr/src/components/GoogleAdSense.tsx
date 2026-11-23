'use client';

import { usePathname } from 'next/navigation';

const ADSENSE_CLIENT_ID = 'ca-pub-5414009811868137';
const EXCLUDED_ROUTES =
  /^\/(?:privacidad|politica-de-privacidad|terminos|terminos-y-condiciones|cookies|politica-de-cookies|contacto|login|admin)(?:\/|$)/i;

/**
 * Carga oficial de Google AdSense para Lector QR Pro (lectorqr.atpdev.dev).
 * Renderiza <script> nativo en SSR HTML sin atributo data-nscript y excluye rutas legales/utilitarias.
 */
export function GoogleAdSense({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  const rawId = clientId || ADSENSE_CLIENT_ID;
  const resolvedId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;
  if (EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  return (
    <script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`}
      crossOrigin="anonymous"
    />
  );
}

export default GoogleAdSense;
