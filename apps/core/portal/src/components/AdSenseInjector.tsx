"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function AdSenseInjector({ adsenseId }: { adsenseId: string | null }) {
  const pathname = usePathname();

  if (!adsenseId) return null;

  // Evitar inyectar AdSense en la landing page o en páginas legales/créditos (política AdSense: sin anuncios en páginas sin contenido editorial)
  const isLandingPage = pathname === "/" || /^\/[a-z]{2}\/?$/i.test(pathname);
  const isExcludedUtilityPage = /(?:^|\/)(?:privacy|terms|credits)\/?$/i.test(pathname);

  if (isLandingPage || isExcludedUtilityPage) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
