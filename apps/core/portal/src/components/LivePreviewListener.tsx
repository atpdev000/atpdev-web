"use client";

import { useEffect } from "react";

export default function LivePreviewListener() {
  useEffect(() => {
    // Safety net: ensure data-interaction is set on body after hydration
    // Next.js can strip data-* attributes from <body> during client-side hydration
    if (!document.body.getAttribute("data-interaction")) {
      // Try to read from the SSR-rendered attribute or use a sensible default
      document.body.setAttribute("data-interaction", "spotlight-border");
      console.log("[LivePreview] Set default data-interaction=spotlight-border");
    } else {
      console.log("[LivePreview] data-interaction already set:", document.body.getAttribute("data-interaction"));
    }

    const handleMessage = (event: MessageEvent) => {
      // Security Hardening: Ensure message comes from a trusted origin
      const trustedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3003",
        "https://atpdev.dev",
        "https://www.atpdev.dev",
        "https://admin.atpdev.dev",
        "https://admin.atpdev.pe",
      ];
      if (!trustedOrigins.includes(event.origin) && process.env.NODE_ENV === "production") {
         return; // Reject untrusted iframe messages
      }

      if (event.data?.type === "UPDATE_THEME_PREVIEW") {
        const payload = event.data.payload;
        const root = document.documentElement;

        if (payload.mode) {
          root.setAttribute("data-theme", payload.mode);
          root.style.colorScheme = payload.mode;
        }
        
        if (payload.primary) root.style.setProperty("--primary", payload.primary);
        if (payload.secondary) root.style.setProperty("--secondary", payload.secondary);
        if (payload.tertiary) root.style.setProperty("--tertiary", payload.tertiary);
        if (payload.neutral) root.style.setProperty("--neutral", payload.neutral);
        
        if (payload.fontHeadline) root.style.setProperty("--font-heading", `"${payload.fontHeadline}", sans-serif`);
        if (payload.fontBody) root.style.setProperty("--font-body", `"${payload.fontBody}", sans-serif`);
        if (payload.fontLabel) root.style.setProperty("--font-label", `"${payload.fontLabel}", monospace`);
        
        if (payload.radiusScale) {
          let radiusValue = "0.75rem";
          switch (payload.radiusScale) {
            case "none": radiusValue = "0rem"; break;
            case "small": radiusValue = "0.25rem"; break;
            case "medium": radiusValue = "0.75rem"; break;
            case "full": radiusValue = "9999px"; break;
          }
          root.style.setProperty("--radius-scale", radiusValue);
        }

        if (payload.globalBackgroundImage !== undefined) {
          if (payload.globalBackgroundImage) {
            root.style.setProperty("--global-bg-image", `url('${payload.globalBackgroundImage}')`);
          } else {
            root.style.removeProperty("--global-bg-image");
          }
        }

        if (payload.enableGlowEffect !== undefined) {
          root.style.setProperty("--glow-opacity", payload.enableGlowEffect ? "1" : "0");
        }
        
        if (payload.glowStyle) {
          const normalizedStyle = payload.glowStyle.replace(/,/g, ' ');
          document.body.setAttribute("data-interaction", normalizedStyle);
          console.log("[LivePreview] Updated data-interaction:", normalizedStyle);
        }

        if (payload.neonThickness) {
          root.style.setProperty("--neon-thickness", payload.neonThickness);
        }

        if (payload.neonGlow) {
          root.style.setProperty("--neon-glow", payload.neonGlow);
        }
        
        // Dynamically inject fonts if they are not loaded
        if (payload.fontHeadline || payload.fontBody || payload.fontLabel) {
          const fonts = [payload.fontHeadline, payload.fontBody, payload.fontLabel].filter(Boolean);
          const fontUrl = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`;
          
          let link = document.getElementById("live-preview-fonts") as HTMLLinkElement;
          if (!link) {
            link = document.createElement("link");
            link.id = "live-preview-fonts";
            link.rel = "stylesheet";
            document.head.appendChild(link);
          }
          link.href = fontUrl;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
