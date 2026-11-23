'use client';

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137';

/**
 * Carga Google AdSense mediante un elemento <script> nativo en las rutas bajo (ads)/layout.tsx.
 * Visible en el HTML SSR para Mediapartners-Google y libre del atributo data-nscript de next/script.
 */
export function AdSenseInjector() {
  return (
    <script
      id="masteratpdf-adsense-script"
      async
      src={ADSENSE_SRC}
      crossOrigin="anonymous"
    />
  );
}
