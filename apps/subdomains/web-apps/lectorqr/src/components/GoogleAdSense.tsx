'use client';

import { useEffect } from 'react';

interface GoogleAdSenseProps {
  clientId?: string;
}

/**
 * Google AdSense Script Loader
 * Inyecta el script de AdSense en el cliente sin causar advertencias de data-nscript en Next.js
 */
export function GoogleAdSense({ clientId = 'pub-5414009811868137' }: GoogleAdSenseProps) {
  useEffect(() => {
    if (!clientId || typeof window === 'undefined') return;

    const cleanClientId = clientId.startsWith('ca-') ? clientId : `ca-${clientId}`;

    const existing = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (existing) return;

    try {
      const script = document.createElement('script');
      script.id = 'google-adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    } catch {
      // Ignorar si hay bloqueadores de anuncios
    }
  }, [clientId]);

  return null;
}
export default GoogleAdSense;

