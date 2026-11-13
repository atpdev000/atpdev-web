"use client";

import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Wand2, Type, Square, ChevronDown, Sparkles, Loader2, Palette, X, Eye, Zap, Laptop, Tablet, Smartphone, RefreshCw, ExternalLink, Monitor, Layers, AlertCircle } from "lucide-react";
import { suggestThemeWithAI } from "./actions";
import { OFFICIAL_APP_URLS, useResolvedPreviewUrl } from "@/lib/preview-url";

// ==========================================
// COLOR MATH UTILITIES (Simulating MD3)
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
export function ThemeBuilder({ initialConfig }: { initialConfig: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'iframe' | 'components'>('iframe');
  const [iframeRefreshKey, setIframeRefreshKey] = useState(0);

  const officialEnvPortal = process.env.NEXT_PUBLIC_PORTAL_URL;
  const officialPortalUrl =
    officialEnvPortal && !officialEnvPortal.includes("localhost")
      ? officialEnvPortal
      : OFFICIAL_APP_URLS.portal;
  const {
    previewUrl: portalUrl,
    source: previewSource,
    isOnline: isServerOnline,
  } = useResolvedPreviewUrl("http://localhost:3000", officialPortalUrl, isOpen, iframeRefreshKey);

  // States
  const [mode, setMode] = useState(initialConfig?.theme_mode || "dark");
  const [seedColor, setSeedColor] = useState(initialConfig?.seed_color || "#0052FF");
  const [colorTheme, setColorTheme] = useState(initialConfig?.color_theme || "vibrant");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiIncludeBackground, setAiIncludeBackground] = useState(true);

  const [primary, setPrimary] = useState(initialConfig?.primary_color || "#0052FF");
  const [secondary, setSecondary] = useState(initialConfig?.secondary_color || "#1A1A1A");
  const [tertiary, setTertiary] = useState(initialConfig?.tertiary_color || "#262626");
  const [neutral, setNeutral] = useState(initialConfig?.neutral_color || "#8A8A8A");

  const [fontHeadline, setFontHeadline] = useState(initialConfig?.font_headline || "Hanken Grotesk");
  const [fontBody, setFontBody] = useState(initialConfig?.font_body || "Inter");
  const [fontLabel, setFontLabel] = useState(initialConfig?.font_label || "JetBrains Mono");
  const [radiusScale, setRadiusScale] = useState(initialConfig?.radius_scale || "medium");
  const [mouseEffects, setMouseEffects] = useState<string[]>(() => {
    if (!initialConfig?.glow_style) return ["spotlight-border"];
    const arr = initialConfig.glow_style.split(',').map((s: string) => s.trim());
    return arr.map((s: string) => (s === 'spotlight' ? 'spotlight-border' : s));
  });
  const [neonThickness, setNeonThickness] = useState(initialConfig?.neon_thickness || "4px");

  const [globalBackgroundImage, setGlobalBackgroundImage] = useState(initialConfig?.global_background_image || "");
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
    if (isOpen && iframeRef.current && iframeRef.current.contentWindow) {
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
    }
  }, [mode, primary, secondary, tertiary, neutral, fontHeadline, fontBody, fontLabel, radiusScale, globalBackgroundImage, mouseEffects, neonThickness, isOpen]);

  // Listen to Gradient Builder events
  useEffect(() => {
    const handleGradientMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'GRADIENT_GENERATED') {
         setGlobalBackgroundImage(e.data.payload);
         setShowGradientBuilder(false);
      }
      if (e.data && e.data.type === 'GRADIENT_GENERATED_SILENTLY') {
         setGlobalBackgroundImage(e.data.payload);
      }
    };
    window.addEventListener("message", handleGradientMessage);
    return () => window.removeEventListener("message", handleGradientMessage);
  }, []);

  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block";
  
  const getThemeCircleStyle = (tKey: string) => {
    if (tKey === "vibrant") return { background: `linear-gradient(135deg, ${primary} 50%, ${tertiary} 50%)` };
    if (tKey === "monochrome") return { background: `linear-gradient(135deg, ${primary} 50%, ${neutral} 50%)` };
    if (tKey === "analogous") return { background: `linear-gradient(135deg, ${primary} 50%, ${secondary} 50%)` };
    return { background: `conic-gradient(from 0deg, #FF0055, #FFCC00, #00FF66, #00CCFF, #9900FF, #FF0055)` };
  };

  // The hidden inputs remain in the DOM whether modal is open or closed, so the form works.
  const hiddenInputs = (
    <>
      <input type="hidden" name="theme_mode" value={mode} />
      <input type="hidden" name="seed_color" value={seedColor} />
      <input type="hidden" name="color_theme" value={colorTheme} />
      <input type="hidden" name="primary_color" value={primary} />
      <input type="hidden" name="secondary_color" value={secondary} />
      <input type="hidden" name="tertiary_color" value={tertiary} />
      <input type="hidden" name="neutral_color" value={neutral} />
      <input type="hidden" name="font_headline" value={fontHeadline} />
      <input type="hidden" name="font_body" value={fontBody} />
      <input type="hidden" name="font_label" value={fontLabel} />
      <input type="hidden" name="radius_scale" value={radiusScale} />
      <input type="hidden" name="glow_style" value={mouseEffects.join(',')} />
      <input type="hidden" name="neon_thickness" value={neonThickness} />
      <input type="checkbox" name="enable_glow_effect" checked={!mouseEffects.includes('none')} readOnly className="hidden" />
      {/* Hidden input to submit the global background base64 image */}
      <input type="hidden" name="global_background_image" value={globalBackgroundImage} />
    </>
  );

  return (
    <>
      {hiddenInputs}

      {/* LAUNCHER CARD (Shown in the grid) */}
      <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 h-full flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>
        <Palette size={32} className="text-blue-500 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Diseñador de Tema</h2>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 mb-6">Configura colores, tipografías y estética global AAA para todo tu portal.</p>
        
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
        >
          <Wand2 size={14} />
          Abrir Diseñador
        </button>
      </div>

      {/* FULLSCREEN MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          
          {/* LOAD FONTS DYNAMICALLY */}
          <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fontHeadline.replace(/ /g, '+')}:wght@700;900&family=${fontBody.replace(/ /g, '+')}:wght@400;500&family=${fontLabel.replace(/ /g, '+')}:wght@400;600&display=swap`} />

          {/* LEFT PANEL: CONTROLS */}
          <div className="w-full max-w-[400px] h-full bg-[#111] border-r border-gray-800 flex flex-col shadow-2xl relative z-10">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-blue-500" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Theme Builder</h2>
              </div>
              <button onClick={() => setIsOpen(false)} type="button" className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* ✨ AI PROMINENT BUTTON (Google AI Studio Aesthetic) */}
              <div className="relative group">
                {/* Glow effect similar to Google AI Studio */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative bg-[#0A0A0B] border border-gray-800 rounded-2xl p-2 flex flex-col items-stretch gap-2 overflow-hidden shadow-2xl">
                  
                  {/* Top info */}
                  <div className="px-3 pt-2 pb-1 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={10} /> IA Theme Studio
                    </span>
                  </div>

                  {/* Input area */}
                  <div className="flex-1 w-full flex flex-col px-3 pb-2">
                    <textarea 
                      placeholder="Ej: Cyberpunk neón oscuro con luces rojas intensas..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={2}
                      className="w-full bg-transparent border-0 text-sm text-white focus:ring-0 focus:outline-none placeholder-gray-600 resize-none"
                    />
                  </div>

                  {/* Actions area: Toggle and Button */}
                  <div className="flex justify-between items-center px-3 pb-2 border-t border-gray-800/50 pt-2">
                    {/* Toggle */}
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

                    {/* Submit button inline-like */}
                    <button
                      type="button"
                      onClick={async () => {
                        setIsAiLoading(true);
                        try {
                          const res = await suggestThemeWithAI(mode as "light" | "dark", aiPrompt, aiIncludeBackground);
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
                              }, '*');
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

              {/* MODE */}
              <div>
                <label className={labelClass}>Mode</label>
                <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-gray-800">
                  <button
                    type="button"
                    onClick={() => setMode("light")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${mode === "light" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("dark")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${mode === "dark" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>

              {/* GRADIENT GLOBAL BACKGROUND */}
              <div>
                <label className={labelClass}>Fondo Global (Opcional)</label>
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
                    className={`flex-1 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      mode === "dark" ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <Moon size={14} className={mode === "dark" ? "text-blue-400" : ""} /> Modo Oscuro
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("light")}
                    className={`flex-1 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      mode === "light" ? "bg-blue-500/20 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <Sun size={14} className={mode === "light" ? "text-yellow-400" : ""} /> Modo Claro
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
                          
                          // Handle mutual exclusivity for border effects (sharing ::before)
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
                onClick={() => setIsOpen(false)} type="button"
                className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors shadow-lg"
              >
                Cerrar Panel
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: LIVE PREVIEW (ACTUAL PORTAL) */}
          <div className="flex-1 relative bg-[#070a12] hidden md:flex flex-col overflow-hidden">
            {/* Top Toolbar */}
            <div className="h-14 border-b border-gray-800 bg-[#0c0c0e]/95 px-6 flex items-center justify-between z-10 backdrop-blur shrink-0 gap-4">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${isServerOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-2">
                  <Eye size={14} className={isServerOnline ? "text-emerald-400" : "text-amber-400"} />
                  <span>{isServerOnline ? 'Live Preview:' : 'Conectando:'}</span>
                  <strong className="text-blue-400 font-semibold lowercase">
                    {previewSource === 'local' ? 'localhost:3000' : portalUrl.replace(/^https?:\/\//, '')}
                  </strong>
                </span>
              </div>

              {/* View Mode Selector: Iframe vs Components */}
              <div className="flex items-center p-1 rounded-xl bg-black border border-gray-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => setPreviewMode('iframe')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === 'iframe'
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor size={13} />
                  <span>Portal Completo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('components')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === 'components'
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers size={13} />
                  <span>Componentes UI</span>
                </button>
              </div>

              {/* Selector de Dispositivos Responsivo */}
              {previewMode === 'iframe' && (
                <div className="flex items-center p-1 rounded-xl bg-black border border-gray-800 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewDevice === 'desktop'
                        ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Laptop / Desktop (100%)"
                  >
                    <Laptop size={14} />
                    <span>100%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewDevice === 'tablet'
                        ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Tablet (768px)"
                  >
                    <Tablet size={14} />
                    <span>Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewDevice === 'mobile'
                        ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Móvil (390px)"
                  >
                    <Smartphone size={14} />
                    <span>Móvil</span>
                  </button>
                </div>
              )}

              {/* Acciones de Recarga y Apertura Externa */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIframeRefreshKey(prev => prev + 1);
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors border border-transparent hover:border-gray-700 cursor-pointer"
                  title="Recargar vista previa"
                >
                  <RefreshCw size={15} />
                </button>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20 cursor-pointer"
                  title="Abrir portal en pestaña nueva"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>

            {/* Viewport de Previsualización Centrado */}
            <div className="flex-1 w-full bg-[#030712] p-4 md:p-6 flex items-center justify-center overflow-hidden">
              {previewMode === 'iframe' ? (
                <div
                  className={`transition-all duration-300 bg-[#070a12] shadow-2xl relative ${
                    previewDevice === 'desktop'
                      ? 'w-full h-full rounded-2xl border border-gray-800'
                      : previewDevice === 'tablet'
                      ? 'w-[768px] max-w-full h-full max-h-[92vh] rounded-2xl border-4 border-gray-700 ring-4 ring-black'
                      : 'w-[390px] max-w-full h-full max-h-[844px] rounded-[44px] border-[10px] border-[#18181b] ring-4 ring-black relative overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)]'
                  }`}
                >
                  {/* Notch simulado para vista móvil */}
                  {previewDevice === 'mobile' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-[#18181b] rounded-b-2xl z-20 flex items-center justify-center pointer-events-none">
                      <div className="w-3 h-3 rounded-full bg-black border border-gray-800 mr-3" />
                      <div className="w-12 h-1 bg-gray-900 rounded-full" />
                    </div>
                  )}

                  {isServerOnline === null ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#070b14] space-y-3">
                      <Loader2 size={24} className="text-blue-400 animate-spin" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Conectando vista previa del Portal...</h4>
                        <p className="text-xs text-slate-400 max-w-xs mt-1">Cargando {portalUrl.replace(/^https?:\/\//, '')}.</p>
                      </div>
                    </div>
                  ) : isServerOnline === false ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#070b14] space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Vista previa oficial temporalmente inaccesible</h4>
                        <p className="text-xs text-slate-400 max-w-xs mt-1">
                          Ni localhost :3000 ni {portalUrl} respondieron. Usa Componentes UI o reintenta.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewMode('components')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
                        >
                          <Layers size={13} />
                          <span>Ver Componentes UI Interactivos</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIframeRefreshKey(prev => prev + 1);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={13} />
                          <span>Reintentar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <iframe 
                      ref={iframeRef}
                      key={`${portalUrl}-${iframeRefreshKey}`}
                      src={portalUrl}
                      className="w-full h-full border-0 bg-transparent"
                      title="Portal Live Preview"
                      onLoad={() => {
                        if (iframeRef.current && iframeRef.current.contentWindow) {
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
                        }
                      }}
                    />
                  )}
                </div>
              ) : (
                /* Componentes UI Simulados de Alta Fidelidad del Portal ATP DEV */
                <div className="w-full max-w-2xl bg-[#090d16] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 overflow-y-auto max-h-[85vh] custom-scrollbar"
                  style={{
                    backgroundColor: mode === 'dark' ? '#090d16' : '#ffffff',
                    color: mode === 'dark' ? '#f8fafc' : '#0f172a',
                    fontFamily: `"${fontBody}", sans-serif`,
                    backgroundImage: globalBackgroundImage ? `url(${globalBackgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Top Bar Mock */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md"
                        style={{ backgroundColor: primary }}>
                        ⚡
                      </div>
                      <span className="font-extrabold text-sm tracking-wider" style={{ fontFamily: `"${fontHeadline}", sans-serif` }}>
                        ATP DEV PORTAL
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold"
                      style={{ backgroundColor: `${primary}15`, color: primary, borderColor: `${primary}40` }}>
                      {mode === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
                    </span>
                  </div>

                  {/* Hero Showcase Card */}
                  <div className="p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-xl space-y-4"
                    style={{
                      backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.9)',
                      borderColor: `${primary}40`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: `0 0 30px ${primary}25`
                    }}
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                        Arquitectura Cloud & Microservicios
                      </span>
                      <h3 className="text-2xl font-black leading-tight" style={{ fontFamily: `"${fontHeadline}", sans-serif`, color: mode === 'dark' ? '#ffffff' : '#0f172a' }}>
                        Transformación Digital y Ecosistema de Subdominios
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-400">
                        Control central de temas cromáticos HSL, efectos neón {neonThickness} y sincronización en tiempo real.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        className="py-2.5 px-5 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                        style={{
                          backgroundColor: primary,
                          boxShadow: `0 0 18px ${primary}60`
                        }}
                      >
                        <Zap size={14} />
                        <span>Acción Primaria Neón</span>
                      </button>
                      <button
                        type="button"
                        className="py-2.5 px-4 rounded-xl font-bold text-xs border transition-all flex items-center gap-2 cursor-pointer"
                        style={{
                          backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
                          borderColor: `${primary}40`,
                          color: mode === 'dark' ? '#f8fafc' : '#0f172a'
                        }}
                      >
                        <span>Explorar Módulos</span>
                      </button>
                    </div>
                  </div>

                  {/* Subdomain Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: 'Chamba Pro', port: ':3005', color: '#10b981', desc: 'Empleos & CAS' },
                      { name: 'Sorteos Pro', port: ':3006', color: '#8b5cf6', desc: 'Ruleta y Sorteos' },
                      { name: 'Descargador', port: ':3007', color: '#3b82f6', desc: 'Videos HD 1080p' },
                      { name: 'Interactivo', port: ':3008', color: '#ec4899', desc: 'Tarjetas Mágicas' },
                    ].map(sub => (
                      <div key={sub.name} className="p-3.5 rounded-xl border transition-all space-y-1"
                        style={{
                          backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc',
                          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                          <span className="text-[9px] font-mono text-slate-400">{sub.port}</span>
                        </div>
                        <p className="text-xs font-bold leading-tight mt-1">{sub.name}</p>
                        <p className="text-[10px] text-slate-400">{sub.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
      />
    </>
  );
}
