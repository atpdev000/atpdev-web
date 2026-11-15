'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const EXCLUDED_ROUTES = /^\/(?:privacidad|terminos)(?:\/|$)/i;

export function AdSenseInjector() {
  const pathname = usePathname() || '';
  if (EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  return (
    <Script
      id="perusabor-adsense"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
