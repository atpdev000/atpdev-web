'use client';

import { usePathname } from 'next/navigation';

const EXCLUDED_ROUTES =
  /^\/(?:privacidad|politica-de-privacidad|terminos|terminos-y-condiciones|cookies|politica-de-cookies|contacto|sobre-nosotros|chef-ia|costeo|escalador|restaurante|login|admin)(?:\/|$)/i;

export function AdSenseInjector({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  const rawId = clientId || 'ca-pub-5414009811868137';
  const resolvedId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;
  if (EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  return (
    <script
      id="perusabor-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`}
      crossOrigin="anonymous"
    />
  );
}

export default AdSenseInjector;
