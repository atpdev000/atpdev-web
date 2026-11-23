"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const BLOCKED_PREFIXES = ["/privacy", "/terms", "/cookies", "/contact", "/about", "/studio", "/oauth2callback"];

export default function AdSenseInjector({ adsenseId }: { adsenseId: string | null }) {
  const pathname = usePathname() || "/";
  const rawId = adsenseId || "ca-pub-5414009811868137";
  const resolvedId = rawId.startsWith("ca-") ? rawId : `ca-${rawId}`;
  const isBlocked = BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (isBlocked || typeof document === "undefined") return;
    if (document.querySelector('[data-page-type="not-found"]')) return;

    const scriptId = "adsense-main-script";
    if (document.getElementById(scriptId)) return;

    const existing = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [isBlocked, resolvedId, pathname]);

  return (
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
  );
}
