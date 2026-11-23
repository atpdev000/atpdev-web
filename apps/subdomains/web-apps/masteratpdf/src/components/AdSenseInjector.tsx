'use client';

import { useEffect } from 'react';

const ADSENSE_SCRIPT_ID = 'masteratpdf-adsense';
const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137';

export function AdSenseInjector() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(ADSENSE_SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.src = ADSENSE_SRC;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, []);

  return null;
}
