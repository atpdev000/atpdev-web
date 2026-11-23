"use client";

import { usePathname } from "next/navigation";

const EXCLUDED_ROUTES =
  /^\/(?:politica-de-privacidad|terminos-y-condiciones|cookies|politica-de-cookies|admin|contacto|publicar-empleo|login|auth)(?:\/|$)/i;

/**
 * Carga Google AdSense únicamente en rutas de contenido editorial y convocatorias.
 * Renderiza un tag <script> nativo visible en SSR HTML sin la advertencia data-nscript.
 */
export function ChambaAdSense({ clientId }: { clientId: string }) {
  const pathname = usePathname() || "";
  if (!clientId || EXCLUDED_ROUTES.test(pathname)) {
    return null;
  }

  const normalizedClient = clientId.startsWith("ca-") ? clientId : `ca-${clientId}`;

  return (
    <script
      id="google-adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedClient}`}
      crossOrigin="anonymous"
    />
  );
}

export default ChambaAdSense;
