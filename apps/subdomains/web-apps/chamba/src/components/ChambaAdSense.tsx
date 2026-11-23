"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const EXCLUDED_ROUTES =
  /^\/(?:politica-de-privacidad|terminos-y-condiciones|cookies|politica-de-cookies|admin|contacto|publicar-empleo|login|auth)(?:\/|$)/i;

/**
 * Carga Google AdSense únicamente en rutas de contenido editorial y convocatorias.
 * Usa un tag <script> nativo en <head> para evitar la advertencia data-nscript de next/script.
 */
export function ChambaAdSense({ clientId }: { clientId: string }) {
  const pathname = usePathname() || "";
  const isExcluded = !clientId || EXCLUDED_ROUTES.test(pathname);
  const normalizedClient = clientId?.startsWith("ca-") ? clientId : `ca-${clientId}`;

  useEffect(() => {
    if (isExcluded || typeof document === "undefined") return;
    if (document.querySelector('[data-page-type="not-found"]')) return;

    const scriptId = "google-adsense-loader";
    if (document.getElementById(scriptId)) return;

    const existing = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedClient}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [isExcluded, normalizedClient, pathname]);

  return null;
}

export default ChambaAdSense;
