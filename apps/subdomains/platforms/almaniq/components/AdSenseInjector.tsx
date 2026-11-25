"use client";

import { usePathname } from "next/navigation";

const BLOCKED_PREFIXES = ["/privacy", "/terms", "/cookies", "/contact", "/about", "/studio", "/oauth2callback"];

export default function AdSenseInjector({ adsenseId }: { adsenseId: string | null }) {
  const pathname = usePathname() || "/";
  const rawId = adsenseId || "ca-pub-5414009811868137";
  const resolvedId = rawId.startsWith("ca-") ? rawId : `ca-${rawId}`;
  const isBlocked = BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isBlocked) {
    return null;
  }

  return (
    <script
      id="adsense-main-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${resolvedId}`}
      crossOrigin="anonymous"
    />
  );
}
