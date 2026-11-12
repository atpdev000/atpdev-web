"use client";

import Script from "next/script";

export default function AdSenseInjector({ adsenseId }: { adsenseId: string | null }) {
  if (!adsenseId) return null;

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
