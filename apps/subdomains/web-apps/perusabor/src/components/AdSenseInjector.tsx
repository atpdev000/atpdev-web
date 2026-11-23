'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const EXCLUDED_ROUTES =
  /^\/(?:privacidad|politica-de-privacidad|terminos|terminos-y-condiciones|cookies|politica-de-cookies|contacto|login|admin)(?:\/|$)/i;

export function AdSenseInjector({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  const rawId = clientId || 'ca-pub-5414009811868137';
  const resolvedId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;
  const isExcluded = EXCLUDED_ROUTES.test(pathname);

  useEffect(() => {
    if (isExcluded || typeof document === 'undefined') return;
    if (document.querySelector('[data-page-type="not-found"]')) return;

    const scriptId = 'perusabor-adsense';
    if (document.getElementById(scriptId)) return;

    const existing = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );
    if (existing) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [isExcluded, resolvedId, pathname]);

  return null;
}

export default AdSenseInjector;
