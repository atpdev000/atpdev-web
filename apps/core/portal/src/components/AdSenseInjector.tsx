"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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

    useEffect(() => {
        if (isExcluded) return;
        if (typeof document === "undefined") return;
        // Never load AdSense on 404 / Not Found error screens
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
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanId}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
    }, [cleanId, isExcluded, pathname]);

    return null;
}
