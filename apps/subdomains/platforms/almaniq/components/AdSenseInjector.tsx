"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const BLOCKED_PREFIXES = ["/privacy", "/terms", "/studio", "/oauth2callback"];

export default function AdSenseInjector({ adsenseId }: { adsenseId: string | null }) {
  const pathname = usePathname() || "/";

  if (!adsenseId) return null;
  if (BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
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
