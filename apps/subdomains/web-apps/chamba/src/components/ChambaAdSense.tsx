"use client";

import { usePathname } from "next/navigation";

const EXCLUDED_ROUTES =
  /^\/(?:politica-de-privacidad|terminos-y-condiciones|cookies|politica-de-cookies|admin|contacto|publicar-empleo|login|auth|quienes-somos|match-cv|comparador-regimenes|simulador-entrevista-ia|convocatorias\/(?:locacion|privado)|empleos\/en\/(?:callao|cusco|junin|puno|lambayeque|san-martin|ancash|ica|cajamarca|loreto|ayacucho|huanuco|tacna|ucayali|apurimac|amazonas|huancavelica|moquegua|pasco|tumbes|madre-de-dios|remoto))(?:\/|$)/i;

/**
 * Carga Google AdSense únicamente en rutas con contenido editorial denso (>= 350 palabras).
 * Excluye páginas legales, utilitarias y filtros regionales con pocas convocatorias.
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
