"use client";

import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Wand2, Square, ChevronDown, Sparkles, Loader2, Palette, X, Eye, Zap, Laptop, RefreshCw, ExternalLink } from "lucide-react";
import { suggestThemeWithAI } from "../settings/actions";
import { OFFICIAL_APP_URLS, useResolvedPreviewUrl } from "@/lib/preview-url";

export type ProjectThemeConfig = {
  theme_mode: string;
  seed_color: string;
  color_theme: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
  neutral_color: string;
  font_headline: string;
  font_body: string;
  font_label: string;
  radius_scale: string;
  glow_style: string;
  neon_thickness: string;
  global_background_image: string;
};

// ==========================================
// COLOR MATH UTILITIES
// ==========================================
function hexToHSL(H: string) {
  let r = 0, g = 0, b = 0;
  if (H.length === 4) {
    r = parseInt(H[1] + H[1], 16);
    g = parseInt(H[2] + H[2], 16);
    b = parseInt(H[3] + H[3], 16);
  } else if (H.length === 7) {
    r = parseInt(H.substring(1, 3), 16);
    g = parseInt(H.substring(3, 5), 16);
    b = parseInt(H.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
  let h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return [h, s, l];
}

function HSLToHex(h: number, s: number, l: number) {
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

function generatePalette(seedHex: string, theme: string, mode: string) {
  if (theme === "custom") return null;
  const [h, s, l] = hexToHSL(seedHex);
  let p, sec, ter, neu;
  const isDark = mode === "dark";

  if (theme === "vibrant") {
    p = HSLToHex(h, Math.min(s * 1.2, 1), isDark ? 0.6 : 0.4);
    sec = HSLToHex(h, s * 0.3, isDark ? 0.1 : 0.95);
    ter = HSLToHex((h + 30) % 360, s * 0.5, isDark ? 0.15 : 0.9);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  } else if (theme === "monochrome") {
    p = seedHex;
    sec = HSLToHex(h, s * 0.1, isDark ? 0.1 : 0.95);
    ter = HSLToHex(h, s * 0.2, isDark ? 0.15 : 0.9);
    neu = HSLToHex(h, 0, isDark ? 0.5 : 0.6);
  } else if (theme === "analogous") {
    p = seedHex;
    sec = HSLToHex(h, s * 0.3, isDark ? 0.1 : 0.95);
    ter = HSLToHex((h + 60) % 360, s, isDark ? 0.6 : 0.4);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  } else {
    p = seedHex;
    sec = HSLToHex(h, 0.2, isDark ? 0.1 : 0.9);
    ter = HSLToHex((h + 45) % 360, 0.3, isDark ? 0.15 : 0.85);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  }

  return { primary: p, secondary: sec, tertiary: ter, neutral: neu };
}

// ==========================================
// COMPONENT
// ==========================================
export function ProjectThemeStudio({
  title,
  previewPath = "",
  initialConfig,
  onClose,
  onChange,
  onCoverGenerated
}: {
  title: string;
  previewPath?: string;
  initialConfig: string | null;
  onClose: () => void;
  onChange: (config: ProjectThemeConfig) => void;
  onCoverGenerated: (dataUrl: string) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeRefreshKey, setIframeRefreshKey] = useState(0);
  const officialEnvPortal = process.env.NEXT_PUBLIC_PORTAL_URL;
  const officialBaseUrl =
    officialEnvPortal && !officialEnvPortal.includes("localhost")
      ? officialEnvPortal
      : OFFICIAL_APP_URLS.portal;
  const { previewUrl: portalBaseUrl, source: previewSource } = useResolvedPreviewUrl(
    "http://localhost:3000",
    officialBaseUrl,
    true,
    iframeRefreshKey
  );
  const normalizedPath = previewPath
    ? previewPath.startsWith("/")
      ? previewPath
      : `/${previewPath}`
    : "";
  const portalUrl = `${portalBaseUrl.replace(/\/$/, "")}${normalizedPath}`;

  let parsedConfig: Partial<ProjectThemeConfig> = {};
  if (initialConfig) {
    try { parsedConfig = JSON.parse(initialConfig); } catch (e) {}
  }

  const [mode, setMode] = useState(parsedConfig.theme_mode || "auto");
  const [seedColor, setSeedColor] = useState(parsedConfig.seed_color || "#0052FF");
  const [colorTheme, setColorTheme] = useState(parsedConfig.color_theme || "vibrant");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiIncludeBackground, setAiIncludeBackground] = useState(true);

  const [primary, setPrimary] = useState(parsedConfig.primary_color || "#0052FF");
  const [secondary, setSecondary] = useState(parsedConfig.secondary_color || "#1A1A1A");
  const [tertiary, setTertiary] = useState(parsedConfig.tertiary_color || "#262626");
  const [neutral, setNeutral] = useState(parsedConfig.neutral_color || "#8A8A8A");

  const [fontHeadline, setFontHeadline] = useState(parsedConfig.font_headline || "Hanken Grotesk");
  const [fontBody, setFontBody] = useState(parsedConfig.font_body || "Inter");
  const [fontLabel, setFontLabel] = useState(parsedConfig.font_label || "JetBrains Mono");
  const [radiusScale, setRadiusScale] = useState(parsedConfig.radius_scale || "medium");
  const [mouseEffects, setMouseEffects] = useState<string[]>(() => {
    if (!parsedConfig.glow_style) return ["spotlight-border"];
    return parsedConfig.glow_style.split(',').map(s => s.trim() === 'spotlight' ? 'spotlight-border' : s.trim());
  });
  const [neonThickness, setNeonThickness] = useState(parsedConfig.neon_thickness || "4px");
  const [globalBackgroundImage, setGlobalBackgroundImage] = useState(parsedConfig.global_background_image || "");
  const [showGradientBuilder, setShowGradientBuilder] = useState(false);

  // Generate Palette automatically when mode/seed changes
  useEffect(() => {
    if (colorTheme !== "custom") {
      const palette = generatePalette(seedColor, colorTheme, mode);
      if (palette) {
        setPrimary(palette.primary);
        setSecondary(palette.secondary);
        setTertiary(palette.tertiary);
        setNeutral(palette.neutral);
      }
    }
  }, [seedColor, colorTheme, mode]);

  // Sync with Live Preview Iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: "UPDATE_THEME_PREVIEW",
          payload: {
            mode, primary, secondary, tertiary, neutral,
            fontHeadline, fontBody, fontLabel, radiusScale,
            globalBackgroundImage,
            glowStyle: mouseEffects.join(','),
            neonThickness,
            neonGlow: neonThickness === "2px" ? "10px" : neonThickness === "4px" ? "18px" : neonThickness === "6px" ? "26px" : "36px"
          }
        }, "*");
      } catch {}
    }
  }, [mode, primary, secondary, tertiary, neutral, fontHeadline, fontBody, fontLabel, radiusScale, globalBackgroundImage, mouseEffects, neonThickness, portalUrl]);

  // Sync changes to parent
  useEffect(() => {
    onChange({
      theme_mode: mode,
      seed_color: seedColor,
      color_theme: colorTheme,
      primary_color: primary,
      secondary_color: secondary,
      tertiary_color: tertiary,
      neutral_color: neutral,
      font_headline: fontHeadline,
      font_body: fontBody,
      font_label: fontLabel,
      radius_scale: radiusScale,
      glow_style: mouseEffects.join(','),
      neon_thickness: neonThickness,
      global_background_image: globalBackgroundImage
    });
  }, [mode, seedColor, colorTheme, primary, secondary, tertiary, neutral, fontHeadline, fontBody, fontLabel, radiusScale, mouseEffects, neonThickness, globalBackgroundImage, onChange]);

  // Listen to Gradient Builder events
  useEffect(() => {
    const handleGradientMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'GRADIENT_GENERATED') {
         setGlobalBackgroundImage(e.data.payload);
         onCoverGenerated(e.data.payload);
         setShowGradientBuilder(false);
      }
      if (e.data && e.data.type === 'GRADIENT_GENERATED_SILENTLY') {
         setGlobalBackgroundImage(e.data.payload);
         onCoverGenerated(e.data.payload);
      }
    };
    window.addEventListener("message", handleGradientMessage);
    return () => window.removeEventListener("message", handleGradientMessage);
  }, [onCoverGenerated]);

  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block";
  
  const getThemeCircleStyle = (tKey: string) => {
    if (tKey === "vibrant") return { background: `linear-gradient(135deg, ${primary} 50%, ${tertiary} 50%)` };
    if (tKey === "monochrome") return { background: `linear-gradient(135deg, ${primary} 50%, ${neutral} 50%)` };
    if (tKey === "analogous") return { background: `linear-gradient(135deg, ${primary} 50%, ${secondary} 50%)` };
    return { background: `conic-gradient(from 0deg, #FF0055, #FFCC00, #00FF66, #00CCFF, #9900FF, #FF0055)` };
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* LOAD FONTS DYNAMICALLY */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fontHeadline.replace(/ /g, '+')}:wght@700;900&family=${fontBody.replace(/ /g, '+')}:wght@400;500&family=${fontLabel.replace(/ /g, '+')}:wght@400;600&display=swap`} />

      {/* LEFT PANEL: CONTROLS */}
      <div className="w-full max-w-[400px] h-full bg-[#111] border-r border-gray-800 flex flex-col shadow-2xl relative z-10">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-blue-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Theme Studio</h2>
          </div>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* ✨ AI PROMINENT BUTTON (Google AI Studio Aesthetic) */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-[#0A0A0B] border border-gray-800 rounded-2xl p-2 flex flex-col items-stretch gap-2 overflow-hidden shadow-2xl">
              <div className="px-3 pt-2 pb-1 flex justify-between items-center">
                <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={10} /> IA Theme Studio
                </span>
              </div>

              <div className="flex-1 w-full flex flex-col px-3 pb-2">
                <textarea 
                  placeholder="Ej: Cyberpunk neón oscuro con luces rojas intensas..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-0 text-sm text-white focus:ring-0 focus:outline-none placeholder-gray-600 resize-none"
                />
              </div>

              <div className="flex justify-between items-center px-3 pb-2 border-t border-gray-800/50 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group/toggle">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={aiIncludeBackground}
                      onChange={(e) => setAiIncludeBackground(e.target.checked)}
                    />
                    <div className={`block w-7 h-4 rounded-full transition-colors ${aiIncludeBackground ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                    <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${aiIncludeBackground ? 'transform translate-x-3' : ''}`}></div>
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover/toggle:text-gray-300 font-medium transition-colors">Generar fondo animado</span>
                </label>

                <button
                  type="button"
                  onClick={async () => {
                    setIsAiLoading(true);
                    try {
                      const res = await suggestThemeWithAI(mode as "light" | "dark", aiPrompt || title, aiIncludeBackground);
                      if (res && res.data) {
                        setColorTheme("custom");
                        setPrimary(res.data.primary);
                        setSecondary(res.data.secondary);
                        setTertiary(res.data.tertiary);
                        setNeutral(res.data.neutral);
                        if (res.data.mouse_effect) {
                          setMouseEffects(res.data.mouse_effect.split(','));
                        }
                        
                        if (res.data.gradient && aiIncludeBackground && hiddenIframeRef.current && hiddenIframeRef.current.contentWindow) {
                          hiddenIframeRef.current.contentWindow.postMessage({
                            type: 'GENERATE_BACKGROUND_SILENTLY',
                            payload: res.data.gradient
                          }, window.location.origin);
                        }
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    setIsAiLoading(false);
                  }}
                  disabled={isAiLoading}
                  className="flex items-center justify-center gap-2 bg-[#1A66FF] hover:bg-[#1452CC] text-white font-medium text-xs py-1.5 px-4 rounded-full transition-all disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  {isAiLoading ? 'Generando...' : 'Get started'}
                </button>
              </div>
            </div>
          </div>

          {/* FONDO GLOBAL / PORTADA */}
          <div>
            <label className={labelClass}>Fondo Global / Portada</label>
            <button
              type="button"
              onClick={() => setShowGradientBuilder(true)}
              className={`w-full flex items-center justify-between border font-bold text-xs p-3 rounded-xl transition-all ${
                globalBackgroundImage 
                  ? 'bg-gradient-to-r from-pink-500/20 to-orange-500/20 border-pink-500/50 text-white' 
                  : 'bg-[#1A1A1A] border-gray-800 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-pink-500 to-orange-400 shadow-inner flex items-center justify-center text-white" />
                <span>{globalBackgroundImage ? "Fondo Activo" : "Diseñar Fondo Animado"}</span>
              </div>
              {globalBackgroundImage ? (
                <div 
                  onClick={(e) => { e.stopPropagation(); setGlobalBackgroundImage(""); }}
                  className="p-1 hover:bg-white/20 rounded-md"
                  title="Eliminar Fondo"
                >
                  <X size={14} className="text-white" />
                </div>
              ) : (
                <Sparkles size={14} className="text-gray-500" />
              )}
            </button>
          </div>

          {/* APARIENCIA / MODO TEMA */}
          <div>
            <label className={labelClass}>Modo Visual (Tema)</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("dark")}
                className={`flex-1 py-2.5 px-2 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                  mode === "dark" ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <Moon size={13} className={mode === "dark" ? "text-blue-400" : ""} /> Oscuro
              </button>
              <button
                type="button"
                onClick={() => setMode("light")}
                className={`flex-1 py-2.5 px-2 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                  mode === "light" ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <Sun size={13} className={mode === "light" ? "text-yellow-400" : ""} /> Claro
              </button>
              <button
                type="button"
                onClick={() => setMode("auto")}
                className={`flex-1 py-2.5 px-2 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                  mode === "auto" ? "bg-purple-500/20 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
                title="Detectar automáticamente el tema del sistema operativo (Windows/Mac/iOS/Android)"
              >
                <Laptop size={13} className={mode === "auto" ? "text-purple-400" : ""} /> Auto (S.O.)
              </button>
            </div>
          </div>

          {/* COLOR GENERATOR / SEED */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Seed Color (Base)</label>
              <div className="flex items-center gap-3 bg-[#1A1A1A] border border-gray-800 rounded-xl p-2 pr-4">
                <input 
                  type="color" value={seedColor} onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                  className="w-8 h-8 rounded-full cursor-pointer border-0 p-0" style={{ clipPath: "circle(50%)" }}
                />
                <input
                  type="text" value={seedColor} onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                  className="font-mono text-white text-sm flex-1 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="relative">
              <label className={labelClass}>Algoritmo de Color</label>
              <button
                type="button" onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl p-3 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full shadow-inner" style={getThemeCircleStyle(colorTheme)} />
                  <span className="text-sm font-bold text-white capitalize">{colorTheme}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {themeDropdownOpen && (
                <div className="absolute left-0 right-0 top-[72px] z-50 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-2xl p-1.5 space-y-1">
                  {[{ id: "vibrant", label: "Vibrant" }, { id: "monochrome", label: "Monochrome" }, { id: "analogous", label: "Analogous" }, { id: "custom", label: "Custom (IA)" }].map((themeOpt) => (
                    <button
                      key={themeOpt.id} type="button"
                      onClick={() => { setColorTheme(themeOpt.id); setThemeDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all ${colorTheme === themeOpt.id ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full" style={getThemeCircleStyle(themeOpt.id)} />
                        <span className="capitalize">{themeOpt.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLOR PALETTE PREVIEW */}
          <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-gray-800">
            <label className={labelClass}>Paleta Final</label>
            <div className="space-y-3 mt-4">
              {[
                { label: "Primary", val: primary, setVal: setPrimary },
                { label: "Secondary", val: secondary, setVal: setSecondary },
                { label: "Tertiary", val: tertiary, setVal: setTertiary },
                { label: "Neutral", val: neutral, setVal: setNeutral },
              ].map((c) => (
                <div key={c.label} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" value={c.val} onChange={(e) => c.setVal(e.target.value.toUpperCase())} disabled={colorTheme !== "custom"}
                      className="w-6 h-6 rounded-full cursor-pointer border-0 p-0 disabled:opacity-80 transition-transform group-hover:scale-110" style={{ clipPath: "circle(50%)" }}
                    />
                    <span className="text-[11px] font-bold text-gray-400">{c.label}</span>
                  </div>
                  <input
                    type="text" value={c.val} onChange={(e) => c.setVal(e.target.value.toUpperCase())} disabled={colorTheme !== "custom"}
                    className="font-mono text-xs font-bold text-gray-300 bg-[#111111] px-2 py-1.5 rounded-md border border-gray-800 focus:outline-none focus:border-blue-500 disabled:opacity-80 w-[72px] text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TIPOGRAFIA */}
          <div>
            <label className={labelClass}>Tipografías (Google Fonts)</label>
            <div className="space-y-3">
              {[
                { label: "Headline", val: fontHeadline, setVal: setFontHeadline, opts: ["Hanken Grotesk", "Inter", "Outfit", "Plus Jakarta Sans", "Syne"] },
                { label: "Body", val: fontBody, setVal: setFontBody, opts: ["Inter", "Roboto", "Open Sans", "DM Sans", "Manrope"] },
                { label: "Label", val: fontLabel, setVal: setFontLabel, opts: ["JetBrains Mono", "Fira Code", "Space Mono", "IBM Plex Mono"] },
              ].map((font) => (
                <div key={font.label} className="flex items-center gap-3 bg-[#1A1A1A] border border-gray-800 rounded-xl p-2 pr-3">
                  <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center shrink-0">
                    <span className="text-gray-400 text-sm" style={{ fontFamily: `"${font.val}", sans-serif` }}>Aa</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <select 
                      value={font.val} onChange={(e) => font.setVal(e.target.value)}
                      className="w-full bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer appearance-none truncate"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0px top 50%', backgroundSize: '.5rem auto' }}
                    >
                      {font.opts.map(opt => <option key={opt} value={opt} className="bg-[#1A1A1A]">{opt}</option>)}
                    </select>
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{font.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BORDER RADIUS */}
          <div>
            <label className={labelClass}>Bordes (Radius)</label>
            <div className="flex gap-2">
              {[
                { id: "none", class: "rounded-none" },
                { id: "small", class: "rounded-sm" },
                { id: "medium", class: "rounded-xl" },
                { id: "full", class: "rounded-full" },
              ].map((radius) => (
                <button
                  key={radius.id} type="button" onClick={() => setRadiusScale(radius.id)}
                  className={`flex-1 h-12 border rounded-xl flex items-center justify-center transition-all ${radiusScale === radius.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-[#1A1A1A] hover:border-gray-600'}`}
                >
                  <div className={`w-4 h-4 border-t-2 border-l-2 ${radiusScale === radius.id ? 'border-blue-400' : 'border-gray-500'} ${radius.class} translate-y-1 translate-x-1`}></div>
                </button>
              ))}
            </div>
          </div>

          {/* EFECTOS VISUALES */}
          <div>
            <label className={labelClass}>Laboratorio de Interacción (Mouse)</label>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
              {[
                { id: 'spotlight-border', label: 'Reflector Neón', icon: <Sparkles size={14} className="text-blue-400" /> },
                { id: 'full-border', label: 'Borde Neón Completo', icon: <Square size={14} className="text-emerald-400" /> },
                { id: 'spotlight-full', label: 'Relleno Neón', icon: <Sparkles size={14} className="text-purple-400" /> },
                { id: 'electric', label: 'Reflector Eléctrico', icon: <Zap size={14} className="text-amber-400" /> },
                { id: 'electric-full', label: 'Borde Eléctrico Completo', icon: <Zap size={14} className="text-amber-400" /> },
                { id: 'tilt', label: 'Inclinación 3D', icon: <div className="w-3 h-3 border border-green-400 transform rotate-12 skew-x-12" /> },
                { id: 'ripple', label: 'Ondas (Clic)', icon: <div className="w-3 h-3 rounded-full border border-cyan-400" /> },
                { id: 'burst', label: 'Explosión (Clic)', icon: <div className="w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_8px_2px_#fbbf24]" /> },
                { id: 'glitch', label: 'Texto Glitch', icon: <span className="text-red-400 font-mono text-[10px] font-bold">X</span> },
                { id: 'magnet', label: 'Magnetismo', icon: <div className="w-3 h-3 border-2 border-indigo-400 rounded-t-full" /> },
                { id: 'none', label: 'Ninguno', icon: <div className="w-3 h-1 bg-gray-500" /> }
              ].map(effect => {
                const isActive = mouseEffects.includes(effect.id) || (effect.id === 'none' && mouseEffects.length === 0);
                
                return (
                <button
                  key={effect.id}
                  type="button"
                  onClick={() => {
                    if (effect.id === 'none') {
                      setMouseEffects(['none']);
                      return;
                    }
                    setMouseEffects(prev => {
                      let next = prev.filter(e => e !== 'none' && e !== 'neon-multi' && e !== 'neon-harmonic');
                      
                      if (effect.id === 'spotlight-border') {
                        next = next.filter(e => e !== 'electric' && e !== 'full-border' && e !== 'electric-full');
                      } else if (effect.id === 'full-border') {
                        next = next.filter(e => e !== 'electric' && e !== 'spotlight-border' && e !== 'electric-full');
                      } else if (effect.id === 'electric') {
                        next = next.filter(e => e !== 'spotlight-border' && e !== 'full-border' && e !== 'electric-full');
                      } else if (effect.id === 'electric-full') {
                        next = next.filter(e => e !== 'spotlight-border' && e !== 'full-border' && e !== 'electric');
                      }

                      if (next.includes(effect.id)) {
                        next = next.filter(e => e !== effect.id);
                      } else {
                        next = [...next, effect.id];
                      }
                      
                      if (prev.includes('neon-multi') && (next.includes('spotlight-border') || next.includes('full-border') || next.includes('spotlight-full') || next.includes('electric') || next.includes('electric-full'))) {
                        next.push('neon-multi');
                      }
                      if (prev.includes('neon-harmonic') && (next.includes('spotlight-border') || next.includes('full-border') || next.includes('spotlight-full') || next.includes('electric') || next.includes('electric-full'))) {
                        next.push('neon-harmonic');
                      }
                      return next.length === 0 ? ['none'] : next;
                    });
                  }}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-800 last:border-0 ${isActive ? 'bg-blue-500/10' : 'hover:bg-[#222]'}`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-md border transition-all ${isActive ? 'bg-blue-500 border-blue-400' : 'bg-[#111] border-gray-700'}`}>
                    {isActive && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-md border ${isActive ? 'bg-blue-500/20 border-blue-500/50' : 'bg-[#111] border-gray-700'}`}>
                    {effect.icon}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{effect.label}</span>
                </button>
                );
              })}
            </div>

            {/* Sub-menu para Neón */}
            {(mouseEffects.includes('spotlight-border') || mouseEffects.includes('spotlight-full') || mouseEffects.includes('electric') || mouseEffects.includes('electric-full') || mouseEffects.includes('full-border')) && (
              <div className="mt-3 p-4 bg-[#1A1A1A] border border-blue-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-2"><Sparkles size={14}/> Estilo del Neón</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-3">
                  <button 
                    type="button" 
                    onClick={() => setMouseEffects(prev => prev.filter(e => e !== 'neon-multi' && e !== 'neon-harmonic'))}
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${!mouseEffects.includes('neon-multi') && !mouseEffects.includes('neon-harmonic') ? 'bg-blue-500/20 border-blue-400 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'bg-[#111] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    Monocolor
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMouseEffects(prev => [...prev.filter(e => e !== 'neon-multi' && e !== 'neon-harmonic'), 'neon-harmonic'])}
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${mouseEffects.includes('neon-harmonic') ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-[#111] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    Armónico (Contexto)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMouseEffects(prev => [...prev.filter(e => e !== 'neon-multi' && e !== 'neon-harmonic'), 'neon-multi'])}
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${mouseEffects.includes('neon-multi') ? 'bg-gradient-to-r from-red-500/20 via-green-500/20 to-blue-500/20 border-white text-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'bg-[#111] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    Multicolor
                  </button>
                </div>

                {/* Grosor del Borde Neón */}
                <div className="mt-4 pt-3 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-400">Grosor e Intensidad del Neón</span>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">{neonThickness}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "2px", label: "Fino" },
                      { id: "4px", label: "Medio" },
                      { id: "6px", label: "Grueso" },
                      { id: "8px", label: "Ultra" },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setNeonThickness(th.id)}
                        className={`py-1.5 text-[11px] font-bold rounded-md border transition-all ${
                          neonThickness === th.id
                            ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                            : "bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ESTILO DEL CURSOR */}
          <div>
            <label className={labelClass}>Cursor Animado Global</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), 'cursor-ia'])}
                className={`py-2.5 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all ${
                  (!mouseEffects.includes('cursor-dot') && !mouseEffects.includes('cursor-trail') && !mouseEffects.includes('cursor-bubbles') && !mouseEffects.includes('cursor-off')) ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center"><div className="w-1 h-1 bg-current rounded-full" /></div>
                Estudio IA
              </button>
              
              <button
                type="button"
                onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), 'cursor-dot'])}
                className={`py-2.5 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all ${
                  mouseEffects.includes('cursor-dot') ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-current rounded-full" /></div>
                Punto Neón
              </button>

              <button
                type="button"
                onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), 'cursor-trail'])}
                className={`py-2.5 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all ${
                  mouseEffects.includes('cursor-trail') ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center gap-0.5">
                  <div className="w-1 h-1 bg-current rounded-full opacity-30" />
                  <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                  <div className="w-2 h-2 bg-current rounded-full" />
                </div>
                Estela Neón
              </button>

              <button
                type="button"
                onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), 'cursor-bubbles'])}
                className={`py-2.5 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all ${
                  mouseEffects.includes('cursor-bubbles') ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center relative">
                  <div className="w-1 h-1 border border-current rounded-full absolute -top-1 left-0" />
                  <div className="w-2 h-2 border border-current rounded-full absolute bottom-0 right-0" />
                  <div className="w-1.5 h-1.5 bg-current rounded-full absolute top-0 right-0 opacity-50" />
                </div>
                Burbujas
              </button>

              <button
                type="button"
                onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), 'cursor-crosshair'])}
                className={`py-2.5 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all ${
                  mouseEffects.includes('cursor-crosshair') ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center relative">
                  <div className="w-full h-[1px] bg-current absolute top-1/2 left-0 -translate-y-1/2" />
                  <div className="h-full w-[1px] bg-current absolute left-1/2 top-0 -translate-x-1/2" />
                </div>
                Mira Láser
              </button>

              <button
                type="button"
                onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), 'cursor-pulse'])}
                className={`py-2.5 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all ${
                  mouseEffects.includes('cursor-pulse') ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-current opacity-70 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full border border-current opacity-30" />
                </div>
                Radar Pulso
              </button>
              
              <button
                type="button"
                onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), 'cursor-off'])}
                className={`py-2.5 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all col-span-3 ${
                  mouseEffects.includes('cursor-off') ? "bg-gray-700/50 border-gray-500 text-white" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
                </div>
                Nativo (OS)
              </button>
            </div>
          </div>

        </div>

        <div className="p-5 border-t border-gray-800 bg-[#171717]">
          <button 
            onClick={onClose} type="button"
            className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors shadow-lg"
          >
            Confirmar Diseño
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW (ACTUAL PORTAL) */}
      <div className="flex-1 relative bg-[#050505] hidden md:block">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-2 text-white bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold tracking-wider uppercase shadow-xl pointer-events-auto">
            <Eye size={14} className="text-emerald-400" />
            <span>
              Vista Previa en Vivo ({previewSource === 'local' ? 'Local :3000' : 'Portal Oficial'})
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-xl pointer-events-auto">
            <button
              type="button"
              onClick={() => setIframeRefreshKey((k) => k + 1)}
              className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Recargar vista previa"
            >
              <RefreshCw size={14} />
            </button>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-gray-300 hover:text-emerald-400 hover:bg-white/10 transition-colors"
              title="Abrir página oficial en nueva pestaña"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
        
        <iframe 
          ref={iframeRef}
          key={`${portalUrl}-${iframeRefreshKey}`}
          src={portalUrl}
          className="w-full h-full border-0"
          title="Portal Live Preview"
          onLoad={() => {
            const sendTheme = () => {
              if (iframeRef.current && iframeRef.current.contentWindow) {
                try {
                  iframeRef.current.contentWindow.postMessage({
                    type: "UPDATE_THEME_PREVIEW",
                    payload: {
                      mode, primary, secondary, tertiary, neutral,
                      fontHeadline, fontBody, fontLabel, radiusScale,
                      globalBackgroundImage,
                      glowStyle: mouseEffects.join(','),
                      neonThickness,
                      neonGlow: neonThickness === "2px" ? "10px" : neonThickness === "4px" ? "18px" : neonThickness === "6px" ? "26px" : "36px"
                    }
                  }, "*");
                } catch {}
              }
            };
            sendTheme();
            setTimeout(sendTheme, 350);
          }}
        />
      </div>

      {/* GRADIENT BUILDER OVERLAY */}
      {showGradientBuilder && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col p-4 md:p-10 backdrop-blur-md animate-in fade-in">
           <div className="flex justify-between items-center mb-6 bg-[#111] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-xl">
             <div className="flex flex-col">
               <h3 className="text-white font-bold text-lg flex items-center gap-2">
                 <Sparkles className="text-pink-500" /> Diseñador de Fondo Global
               </h3>
               <p className="text-gray-400 text-xs mt-1">Crea un fondo mágico. Cuando termines, haz clic en el botón verde <strong>"Usar como Portada"</strong> dentro del editor.</p>
             </div>
             <button onClick={() => setShowGradientBuilder(false)} className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-xl font-bold hover:bg-red-500/20 transition-all">
               Cancelar
             </button>
           </div>
           
           <iframe 
             src="/gradient-builder.html" 
             className="w-full flex-1 rounded-3xl border border-gray-800 shadow-2xl bg-black" 
             title="Gradient Builder Overlay"
           />
        </div>
      )}

      {/* HIDDEN IFRAME FOR SILENT AI GENERATION */}
      <iframe 
        ref={hiddenIframeRef}
        src="/gradient-builder.html"
        className="fixed top-[-10000px] left-[-10000px] w-[1600px] h-[1000px] opacity-0 pointer-events-none z-[-1]"
        aria-hidden="true"
        tabIndex={-1}
        title="Silent AI Gradient Builder"
      />
    </div>
  );
}
