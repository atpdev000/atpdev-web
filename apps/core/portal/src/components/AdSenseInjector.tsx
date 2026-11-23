"use client";

import { usePathname } from "next/navigation";

// Non-content / utility / policy paths where AdSense must NEVER be injected
const EXCLUDED_SEGMENTS = [
    "/privacy",
    "/privacidad",
    "/terms",
    "/terminos",
    "/cookies",
    "/contacto",
    "/contact",
    "/credits",
    "/cv",
    "/login",
    "/auth",
    "/admin",
    "/404",
];

interface AdSenseInjectorProps {
    adsenseId?: string | null;
    clientId?: string | null;
    lang?: string;
}

export default function AdSenseInjector({ adsenseId, clientId }: AdSenseInjectorProps) {
    const pathname = usePathname();

    const rawId =
        adsenseId ||
        clientId ||
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
        "ca-pub-5414009811868137";
    const cleanId = rawId.startsWith("ca-") ? rawId : `ca-${rawId}`;

    const isExcluded = EXCLUDED_SEGMENTS.some(
        (segment) =>
            pathname === segment ||
            pathname?.endsWith(segment) ||
            pathname?.includes(`${segment}/`)
    );

    if (isExcluded) {
        return null;
    }

    // Native lowercase <script> tag renders in SSR HTML for Mediapartners-Google
    // and is hoisted to <head> by React 19 without next/script's data-nscript attribute.
    return (
        <script
            id="adsense-main-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanId}`}
            crossOrigin="anonymous"
        />
    );
}
