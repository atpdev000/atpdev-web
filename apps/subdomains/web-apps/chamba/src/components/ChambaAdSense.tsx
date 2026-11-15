"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const EXCLUDED_ROUTES =
  /^\/(?:politica-de-privacidad|terminos-y-condiciones|admin|contacto|publicar-empleo)(?:\/|$)/i;

/**
 * Carga Google AdSense únicamente en rutas de contenido editorial y convocatorias.
 * Excluye explícitamente páginas legales, administrativas, de contacto y publicación.
 */
export function ChambaAdSense({ clientId }: { clientId: string }) {
  const pathname = usePathname() || "";
  if (!clientId || EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  const normalizedClient = clientId.startsWith("ca-") ? clientId : `ca-${clientId}`;

  return (
    <Script
      id="google-adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

export default ChambaAdSense;

