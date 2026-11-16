'use client';

import Script from 'next/script';

const ADSENSE_CLIENT_ID = 'ca-pub-5414009811868137';

/**
 * Carga oficial de Google AdSense para Lector QR Pro (lectorqr.atpdev.dev).
 * Renderizado exclusivamente bajo el grupo de rutas de contenido público (ads).
 */
export function GoogleAdSense({ clientId }: { clientId?: string } = {}) {
  const rawId = clientId || ADSENSE_CLIENT_ID;
  const resolvedId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;

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
