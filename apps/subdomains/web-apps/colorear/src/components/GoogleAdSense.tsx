'use client';

import { usePathname } from 'next/navigation';

const ADSENSE_CLIENT_ID = 'ca-pub-5414009811868137';
const EXCLUDED_ROUTES =
  /^\/(?:privacidad|terminos|cookies|contacto|sobre-nosotros|login|admin)(?:\/|$)/i;

export default function GoogleAdSense({ clientId }: { clientId?: string } = {}) {
  const pathname = usePathname() || '';
  if (EXCLUDED_ROUTES.test(pathname)) return null;
  const resolvedId = (clientId || ADSENSE_CLIENT_ID).startsWith('ca-')
    ? clientId || ADSENSE_CLIENT_ID
    : `ca-${clientId}`;

  return (
    <script
      id="colorear-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`}
      crossOrigin="anonymous"
    />
  );
}

