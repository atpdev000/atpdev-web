"use client";

import { useEffect, useRef } from "react";

interface ThirdPartyScriptsProps {
  ga4Id?: string | null;
  clarityId?: string | null;
}

export default function ThirdPartyScripts({ ga4Id, clarityId }: ThirdPartyScriptsProps) {
  const loadedRef = useRef(false);

  useEffect(() => {
    const loadScripts = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      if (typeof w.gtag !== "function") {
        w.gtag = function () {
          w.dataLayer.push(arguments);
        };
      }
      w.gtag("js", new Date());
      if (ga4Id && ga4Id.startsWith("G-")) {
        w.gtag("config", ga4Id);
      }

      if (ga4Id) {
        const gScript = document.createElement("script");
        gScript.async = true;
        gScript.src = ga4Id.startsWith("GTM-")
          ? `https://www.googletagmanager.com/gtm.js?id=${ga4Id}`
          : `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
        document.head.appendChild(gScript);
      }

      if (clarityId) {
        (function (c: any, l: Document, a: string, r: string, i: string) {
          c[a] =
            c[a] ||
            function () {
              (c[a].q = c[a].q || []).push(arguments);
            };
          const t = l.createElement(r) as HTMLScriptElement;
          t.async = true;
          t.src = "https://www.clarity.ms/tag/" + i;
          const y = l.getElementsByTagName(r)[0];
          y?.parentNode?.insertBefore(t, y);
        })(w, document, "clarity", "script", clarityId);
      }
    };

    // Si ya otorgó consentimiento antes, cargar cuando el hilo principal esté libre
    const consent = typeof window !== "undefined" ? localStorage.getItem("cookie_consent") : null;
    if (consent === "accepted") {
      const w = window as any;
      const timer =
        typeof w.requestIdleCallback === "function"
          ? w.requestIdleCallback(loadScripts, { timeout: 2500 })
          : setTimeout(loadScripts, 1200);
      return () => {
        if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(timer);
        else clearTimeout(timer);
      };
    }

    // Cargar inmediatamente al primer gesto humano real o al aceptar cookies
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "touchstart"];
    const onInteract = () => {
      loadScripts();
      events.forEach((ev) => window.removeEventListener(ev, onInteract));
    };

    events.forEach((ev) => window.addEventListener(ev, onInteract, { once: true, passive: true }));
    window.addEventListener("atpdev:consent-accepted", onInteract, { once: true });

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onInteract));
      window.removeEventListener("atpdev:consent-accepted", onInteract);
    };
  }, [ga4Id, clarityId]);

  return null;
}
