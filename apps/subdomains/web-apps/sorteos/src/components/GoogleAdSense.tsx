'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ADSENSE_CLIENT_ID } from '@/lib/siteConfig';

const EXCLUDED_ROUTES =
  /^\/(?:politica-de-privacidad|terminos-y-condiciones|cookies|politica-de-cookies|login|registro|recuperar-password|restablecer-password|dashboard|admin|auth|contacto|verificar|sorteos\/extension-install)(?:\/|$)/i;

/**
 * Componente oficial de Google AdSense para Sorteos Pro.
 * Inyecta <script> nativo sin atributo data-nscript y excluye páginas legales, de autenticación y paneles privados.
 */
export function GoogleAdSense({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  const rawId = clientId || ADSENSE_CLIENT_ID;
  const isExcluded = !rawId || EXCLUDED_ROUTES.test(pathname);
  const cleanClientId = rawId?.startsWith('ca-') ? rawId : `ca-${rawId}`;

  useEffect(() => {
    if (isExcluded || typeof document === 'undefined') return;
    if (document.querySelector('[data-page-type="not-found"]')) return;

    const scriptId = 'google-adsense-script';
    if (document.getElementById(scriptId)) return;

    const existing = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );
    if (existing) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClientId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [cleanClientId, isExcluded, pathname]);

  return null;
}

export default GoogleAdSense;
