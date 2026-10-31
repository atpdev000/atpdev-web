"use client";

import { useEffect } from "react";

// Development safeguard: Suppress false-positive React 19 inline script warnings
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Encountered a script tag while rendering React component") ||
        args[0].includes("Scripts inside React components are never executed"))
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function DescargadorThemeListener() {
  useEffect(() => {
    const applyThemeMode = (mode: "light" | "dark") => {
      if (mode === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        document.body?.classList.add("light");
        document.body?.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
        document.body?.classList.add("dark");
        document.body?.classList.remove("light");
      }
    };

    const applyPayload = (payload: any, forceMode = false) => {
      if (!payload || typeof payload !== "object") return;

      const accent = payload.accent_color || payload.primary || payload.primary_color;
      const mode = payload.theme_mode || payload.mode;
      const bgImage = payload.global_background_image !== undefined 
        ? payload.global_background_image 
        : payload.globalBackgroundImage;

      // 1. Dynamic accent color
      if (accent) {
        document.documentElement.style.setProperty("--accent-primary", accent);
        document.documentElement.style.setProperty("--primary", accent);

        let dynamicStyle = document.getElementById("descargador-live-accent") as HTMLStyleElement;
        if (!dynamicStyle) {
          dynamicStyle = document.createElement("style");
          dynamicStyle.id = "descargador-live-accent";
          document.head.appendChild(dynamicStyle);
        }
        dynamicStyle.innerHTML = `
          :root, .dark {
            --accent-primary: ${accent} !important;
            --primary: ${accent} !important;
          }
        `;
      }

      // 2. Dark / Light mode:
      // Only change mode if forceMode is true (from CMS live preview) or if user hasn't set manual preference
      if (mode === "light" || mode === "dark") {
        const saved = localStorage.getItem("descargador_theme");
        if (forceMode || !saved) {
          applyThemeMode(mode);
        }
      }

      // 3. Custom Background Image
      if (bgImage !== undefined) {
        let bgStyle = document.getElementById("descargador-live-bg") as HTMLStyleElement;
        if (!bgStyle) {
          bgStyle = document.createElement("style");
          bgStyle.id = "descargador-live-bg";
          document.head.appendChild(bgStyle);
        }

        if (bgImage && bgImage.trim() !== "") {
          document.body.setAttribute("data-has-custom-bg", "true");
          document.body.style.backgroundImage = `url("${bgImage}")`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundAttachment = "fixed";
          document.body.style.backgroundRepeat = "no-repeat";

          bgStyle.innerHTML = `
            body,
            .dark body,
            body[data-has-custom-bg="true"],
            .dark body[data-has-custom-bg="true"] {
              background-image: url("${bgImage}") !important;
              background-size: cover !important;
              background-position: center !important;
              background-attachment: fixed !important;
              background-repeat: no-repeat !important;
            }
          `;
        } else {
          document.body.setAttribute("data-has-custom-bg", "false");
          document.body.style.backgroundImage = "";
          bgStyle.innerHTML = "";
        }
      }
    };

    // Initial check on mount: User's localStorage takes priority!
    try {
      const saved = localStorage.getItem("descargador_theme") as 'light' | 'dark' | null;
      if (saved === "light" || saved === "dark") {
        applyThemeMode(saved);
      } else {
        const serverTheme = document.documentElement.getAttribute("data-server-theme") as 'light' | 'dark' | null;
        const initial = serverTheme || (document.documentElement.classList.contains("dark") ? "dark" : "light");
        applyThemeMode(initial);
      }
    } catch {}

    // Check theme from API to keep colors & background in sync without overriding user's manual mode
    const checkApiTheme = async () => {
      try {
        const res = await fetch("/api/theme", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.theme) {
          applyPayload(data.theme, false);
        }
      } catch {}
    };
    checkApiTheme();

    // Listen to custom event when user clicks ThemeToggle
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<"light" | "dark">;
      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        applyThemeMode(customEvent.detail);
      }
    };
    window.addEventListener("descargador_theme_mode_change", handleCustomChange);

    // Listen to postMessage from CMS admin preview iframe
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === "UPDATE_DESCARGADOR_THEME" || e.data.type === "UPDATE_THEME_PREVIEW") {
        applyPayload(e.data.payload || {}, true);
      }
    };
    window.addEventListener("message", handleMessage);

    // Listen to BroadcastChannel from other tabs or admin
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel("descargador_theme_channel");
        bc.onmessage = (event) => {
          if (event.data && (event.data.type === "UPDATE_DESCARGADOR_THEME" || event.data.type === "UPDATE_THEME_PREVIEW")) {
            applyPayload(event.data.payload || {}, false);
          }
        };
      } catch {}
    }

    return () => {
      window.removeEventListener("descargador_theme_mode_change", handleCustomChange);
      window.removeEventListener("message", handleMessage);
      if (bc) {
        bc.close();
      }
    };
  }, []);

  return null;
}

export default DescargadorThemeListener;
