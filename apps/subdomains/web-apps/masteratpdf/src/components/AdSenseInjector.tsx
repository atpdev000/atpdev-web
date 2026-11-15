'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const EXCLUDED_ROUTES = /^\/(?:privacidad|terminos|contacto)(?:\/|$)/i;

export function AdSenseInjector() {
  const pathname = usePathname() || '';
  const isExcluded = EXCLUDED_ROUTES.test(pathname);

  return (
    <>
      <Script
        id="google-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
      {!isExcluded && (
        <Script
          id="masteratpdf-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
