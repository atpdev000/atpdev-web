"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ChambaThemeToggle({ className = "" }: { className?: string }) {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial preference from localStorage or document class
    const saved = localStorage.getItem("chamba_theme_mode");
    if (saved === "light" || saved === "dark") {
      setThemeMode(saved);
      applyTheme(saved);
    } else {
      const isDocLight = document.documentElement.classList.contains("light");
      const initial = isDocLight ? "light" : "dark";
      setThemeMode(initial);
    }

    // Listen to theme changes from iframe or custom events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "chamba_theme_mode" && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeMode(e.newValue);
        applyTheme(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const applyTheme = (mode: "dark" | "light") => {
    if (mode === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    applyTheme(next);
    localStorage.setItem("chamba_theme_mode", next);
    
    // Dispatch custom event for any listening components
    window.dispatchEvent(new CustomEvent("chamba_theme_mode_change", { detail: next }));
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Cambiando tema"
        className={`w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 opacity-60 ${className}`}
      >
        <Moon size={15} />
      </button>
    );
  }

  const isLight = themeMode === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isLight ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
      aria-label={isLight ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
      className={`relative group p-2 rounded-xl border transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 ${
        isLight
          ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600 hover:text-amber-700 shadow-slate-200/50"
          : "bg-white/5 hover:bg-white/10 border-white/10 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/30 shadow-black/40"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun size={16} className="transition-transform duration-300 rotate-0 scale-100 animate-in fade-in zoom-in" />
        ) : (
          <Moon size={16} className="transition-transform duration-300 -rotate-12 scale-100 animate-in fade-in zoom-in" />
        )}
      </div>
      <span className="sr-only">
        {isLight ? "Modo Oscuro" : "Modo Claro"}
      </span>
    </button>
  );
}
