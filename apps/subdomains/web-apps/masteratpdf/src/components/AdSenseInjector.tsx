'use client';

import Script from 'next/script';

export function AdSenseInjector() {
  return (
    <Script
      id="masteratpdf-adsense"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
