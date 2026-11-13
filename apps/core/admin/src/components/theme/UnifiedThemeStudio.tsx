"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Wand2, 
  Loader2, 
  Monitor, 
  Laptop, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Save, 
  SlidersHorizontal, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Type,
  MousePointer,
  Sparkle,
  Image as ImageIcon,
  Share2,
  Heart,
  Music,
  Download,
  Flame,
  Award,
  Video,
  Play,
  Zap,
  Square,
  Check,
  X
} from "lucide-react";
import { SubdomainTheme } from "@atpdev/database";
import { OFFICIAL_APP_URLS, useResolvedPreviewUrl } from "@/lib/preview-url";

export interface PresetColor {
  name: string;
  hex: string;
  glow?: string;
}

export interface UnifiedThemeStudioProps {
  subdomain: 'chamba' | 'sorteos' | 'descargador' | 'magic';
  subdomainTitle: string;
  port: string;
  localUrl: string;
  productionUrl?: string;
  theme: SubdomainTheme;
  presets: PresetColor[];
  onSaveTheme: (newTheme: SubdomainTheme) => Promise<boolean | void>;
  saving?: boolean;
}

// ==========================================
// WALLPAPERS / FONDOS ANIMADOS PRESETS
// ==========================================
export const WALLPAPER_PRESETS = [
  { name: 'Ninguno (Fondo Sólido / Gradiente CSS)', url: '' },
  { name: 'Cyberpunk Grid Neón', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Nebulosa Cósmica Púrpura', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Aurora Boreal Esmeralda', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Olas Abstractas Cyan & Azul', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Espacio Estelar Profundo', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Materia Oscura & Humo Mágico', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920&auto=format&fit=crop' }
];

// ==========================================
// COLOR MATH UTILITIES (HSL & ALGORITMO CROMÁTICO)
// ==========================================
function hexToHSL(H: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (!H || typeof H !== 'string') return [0, 0, 0];
  const cleaned = H.replace('#', '');
  if (cleaned.length === 3) {
    r = parseInt(cleaned[0] + cleaned[0], 16);
    g = parseInt(cleaned[1] + cleaned[1], 16);
    b = parseInt(cleaned[2] + cleaned[2], 16);
  } else if (cleaned.length >= 6) {
    r = parseInt(cleaned.substring(0, 2), 16);
    g = parseInt(cleaned.substring(2, 4), 16);
    b = parseInt(cleaned.substring(4, 6), 16);
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

function HSLToHex(h: number, s: number, l: number): string {
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

function generateHarmonicPalette(seedHex: string, algorithm: string, mode: 'dark' | 'light') {
  if (algorithm === "custom") return null;
  const [h, s, l] = hexToHSL(seedHex);
  const isDark = mode === "dark";
  let p = seedHex, sec = "", ter = "", neu = "";

  if (algorithm === "vibrant") {
    p = HSLToHex(h, Math.min(s * 1.2, 1), isDark ? 0.6 : 0.45);
    sec = HSLToHex(h, s * 0.35, isDark ? 0.08 : 0.95);
    ter = HSLToHex((h + 30) % 360, s * 0.7, isDark ? 0.18 : 0.90);
    neu = HSLToHex(h, 0.06, isDark ? 0.6 : 0.55);
  } else if (algorithm === "monochrome") {
    p = seedHex;
    sec = HSLToHex(h, s * 0.1, isDark ? 0.08 : 0.96);
    ter = HSLToHex(h, s * 0.25, isDark ? 0.15 : 0.90);
    neu = HSLToHex(h, 0, isDark ? 0.55 : 0.5);
  } else if (algorithm === "analogous") {
    p = seedHex;
    sec = HSLToHex(h, s * 0.3, isDark ? 0.08 : 0.95);
    ter = HSLToHex((h + 60) % 360, s, isDark ? 0.65 : 0.45);
    neu = HSLToHex(h, 0.05, isDark ? 0.55 : 0.55);
  } else {
    // Default: Harmonic
    p = seedHex;
    sec = HSLToHex(h, 0.25, isDark ? 0.09 : 0.92);
    ter = HSLToHex((h + 45) % 360, 0.4, isDark ? 0.16 : 0.86);
    neu = HSLToHex(h, 0.05, isDark ? 0.55 : 0.55);
  }

  return { primary: p, secondary: sec, tertiary: ter, neutral: neu };
}

export default function UnifiedThemeStudio({
  subdomain,
  subdomainTitle,
  port,
  localUrl,
  productionUrl,
  theme,
  presets,
  onSaveTheme,
  saving = false
}: UnifiedThemeStudioProps) {
  // Local state for interactive theme controls
  const [currentTheme, setCurrentTheme] = useState<SubdomainTheme>(theme);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'iframe' | 'components'>('iframe');
  const [iframeRefreshKey, setIframeRefreshKey] = useState(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const officialUrl = productionUrl || OFFICIAL_APP_URLS[subdomain] || localUrl;
  const {
    previewUrl: activePreviewUrl,
    source: previewSource,
    isOnline: isServerOnline,
  } = useResolvedPreviewUrl(localUrl, officialUrl, previewMode === 'iframe', iframeRefreshKey);

  // Gradient Builder Modal State
  const [showGradientBuilder, setShowGradientBuilder] = useState(false);

  // AI Prompt Studio state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null);

  // Synchronize incoming prop updates
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // Color values derived from seed color or current theme
  const activeSeedColor = currentTheme.seed_color || currentTheme.accent_color || currentTheme.primary_color || presets[0]?.hex || "#ec4899";
  const activeColorTheme = currentTheme.color_theme || "vibrant";
  const activeThemeMode = (currentTheme.theme_mode === 'light' ? 'light' : 'dark');

  // Calculated harmonic palette
  const generatedPalette = useMemo(() => {
    return generateHarmonicPalette(activeSeedColor, activeColorTheme, activeThemeMode) || {
      primary: currentTheme.primary_color || activeSeedColor,
      secondary: currentTheme.secondary_color || "#090d16",
      tertiary: currentTheme.tertiary_color || "#131a29",
      neutral: currentTheme.neutral_color || "#94a3b8"
    };
  }, [activeSeedColor, activeColorTheme, activeThemeMode, currentTheme]);

  // Listen to Gradient Builder events from iframe modal
  useEffect(() => {
    const handleGradientMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'GRADIENT_GENERATED') {
        updateThemeProp('global_background_image', e.data.payload);
        setShowGradientBuilder(false);
      }
      if (e.data && e.data.type === 'GRADIENT_GENERATED_SILENTLY') {
        updateThemeProp('global_background_image', e.data.payload);
      }
    };
    window.addEventListener("message", handleGradientMessage);
    return () => window.removeEventListener("message", handleGradientMessage);
  }, [currentTheme]);

  // Broadcast theme update to iframes via postMessage
  const broadcastThemeToIframe = (themeData: SubdomainTheme) => {
    const payload = {
      ...themeData,
      primary: themeData.primary_color || themeData.accent_color || activeSeedColor,
      primary_color: themeData.primary_color || themeData.accent_color || activeSeedColor,
      secondary: themeData.secondary_color || generatedPalette.secondary,
      secondary_color: themeData.secondary_color || generatedPalette.secondary,
      tertiary: themeData.tertiary_color || generatedPalette.tertiary,
      tertiary_color: themeData.tertiary_color || generatedPalette.tertiary,
      neutral: themeData.neutral_color || generatedPalette.neutral,
      neutral_color: themeData.neutral_color || generatedPalette.neutral,
      accent_color: themeData.accent_color || activeSeedColor,
      theme_mode: themeData.theme_mode,
      mode: themeData.theme_mode,
      glowStyle: themeData.glow_style,
      neonThickness: themeData.neon_thickness,
      fontHeadline: themeData.font_headline,
      fontBody: themeData.font_body,
      fontLabel: themeData.font_label,
      radiusScale: themeData.radius_scale
    };

    const targetAction = `UPDATE_${subdomain.toUpperCase()}_THEME`;

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: targetAction, payload }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME_PREVIEW', payload }, '*');
    }
    if (modalIframeRef.current && modalIframeRef.current.contentWindow) {
      modalIframeRef.current.contentWindow.postMessage({ type: targetAction, payload }, '*');
      modalIframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME_PREVIEW', payload }, '*');
    }
  };

  const updateThemeProp = <K extends keyof SubdomainTheme>(key: K, value: SubdomainTheme[K]) => {
    const updated = { ...currentTheme, [key]: value };
    setCurrentTheme(updated);
    broadcastThemeToIframe(updated);
  };

  const handleApplyPreset = (preset: PresetColor) => {
    const updated: SubdomainTheme = {
      ...currentTheme,
      seed_color: preset.hex,
      accent_color: preset.hex,
      primary_color: preset.hex
    };
    setCurrentTheme(updated);
    broadcastThemeToIframe(updated);
  };

  const handleSave = async () => {
    const success = await onSaveTheme(currentTheme);
    if (success !== false) {
      setSaveSuccessMsg(`¡Tema de ${subdomainTitle} guardado con éxito!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  // Quick AI Assistant Generator
  const handleGenerateAITheme = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      let pickedHex = presets[0]?.hex || "#ec4899";
      let pickedMode: 'dark' | 'light' = 'dark';
      let pickedAlgo = "vibrant";

      if (promptLower.includes('claro') || promptLower.includes('blanco') || promptLower.includes('luz')) {
        pickedMode = 'light';
      }
      if (promptLower.includes('azul') || promptLower.includes('cyan')) {
        pickedHex = '#06b6d4';
      } else if (promptLower.includes('verde') || promptLower.includes('esmeralda')) {
        pickedHex = '#10b981';
      } else if (promptLower.includes('morado') || promptLower.includes('violeta') || promptLower.includes('purpura')) {
        pickedHex = '#8b5cf6';
      } else if (promptLower.includes('oro') || promptLower.includes('amarillo') || promptLower.includes('dorado')) {
        pickedHex = '#f59e0b';
      } else if (promptLower.includes('rosa') || promptLower.includes('fucsia') || promptLower.includes('amor')) {
        pickedHex = '#ec4899';
      }

      const updated: SubdomainTheme = {
        ...currentTheme,
        seed_color: pickedHex,
        accent_color: pickedHex,
        primary_color: pickedHex,
        theme_mode: pickedMode,
        color_theme: pickedAlgo,
        global_background_image: promptLower.includes('fondo') || promptLower.includes('animado') ? WALLPAPER_PRESETS[1].url : currentTheme.global_background_image
      };

      setCurrentTheme(updated);
      broadcastThemeToIframe(updated);
      setAiLoading(false);
    }, 600);
  };

  // Mouse effects array handling
  const activeMouseEffects = useMemo(() => {
    if (!currentTheme.glow_style) return ['spotlight-border'];
    return currentTheme.glow_style.split(',').map(s => s.trim()).filter(Boolean);
  }, [currentTheme.glow_style]);

  const toggleMouseEffect = (effectId: string) => {
    let next: string[] = [];
    if (effectId === 'none') {
      next = ['none'];
    } else {
      next = activeMouseEffects.filter(e => e !== 'none');
      if (next.includes(effectId)) {
        next = next.filter(e => e !== effectId);
      } else {
        next.push(effectId);
      }
      if (next.length === 0) next = ['none'];
    }
    updateThemeProp('glow_style', next.join(','));
  };

  // Subdomain specialized component mock preview
  const renderSubdomainComponentPreview = () => {
    const isDark = activeThemeMode === 'dark';
    const primary = generatedPalette.primary;
    const bgCard = isDark ? '#0f172a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const textMuted = isDark ? '#94a3b8' : '#64748b';
    const borderCol = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    if (subdomain === 'magic') {
      return (
        <div className="space-y-4">
          <div 
            className="p-5 rounded-2xl border transition-all duration-300 shadow-xl space-y-3 relative overflow-hidden"
            style={{ 
              backgroundColor: bgCard, 
              borderColor: `${primary}50`,
              boxShadow: `0 8px 30px ${primary}20` 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: `${primary}18`, color: primary, borderColor: `${primary}40` }}>
                🪄 Plantilla Interactiva
              </span>
              <span className="text-xs font-bold" style={{ color: textMuted }}>30+ Mensajes</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md text-white font-bold"
                style={{ backgroundColor: primary }}>
                ❤️
              </div>
              <div>
                <h4 className="text-base font-extrabold leading-tight mb-1" style={{ color: textColor }}>
                  Galaxia de Amor & Recuerdos 3D
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                  Corazones flotantes, canción de Spotify de fondo y mensaje secreto con animación cósmica.
                </p>
              </div>
            </div>

            <div className="flex gap-1.5 mb-4 overflow-x-auto py-1">
              {['Todos', 'Amor', 'Juegos', 'Eventos'].map((c, i) => (
                <span 
                  key={c}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition"
                  style={{
                    backgroundColor: i === 0 ? primary : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                    color: i === 0 ? '#ffffff' : textColor,
                    border: `1px solid ${i === 0 ? 'transparent' : borderCol}`
                  }}
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                className="py-2.5 px-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md transition"
                style={{ backgroundColor: primary }}
              >
                <Sparkles size={14} />
                <span>Personalizar</span>
              </button>
              <button 
                type="button"
                className="py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 transition"
                style={{ 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', 
                  borderColor: borderCol,
                  color: textColor
                }}
              >
                <Share2 size={14} style={{ color: primary }} />
                <span>Compartir Link</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (subdomain === 'chamba') {
      return (
        <div className="space-y-4">
          <div 
            className="p-5 rounded-2xl border transition-all duration-300 shadow-xl space-y-3"
            style={{ 
              backgroundColor: bgCard, 
              borderColor: `${primary}50`,
              boxShadow: `0 8px 30px ${primary}20` 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border"
                style={{ backgroundColor: `${primary}18`, color: primary, borderColor: `${primary}40` }}>
                🟢 Convocatoria CAS Vigente
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: primary }}>S/. 6,500 Soles</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase" style={{ color: textMuted }}>MINISTERIO DE EDUCACIÓN (MINEDU)</span>
              <h4 className="text-sm font-extrabold" style={{ color: textColor }}>
                Especialista en Tecnologías Educativas e Inteligencia Artificial
              </h4>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: borderCol }}>
              <button 
                type="button" 
                className="flex-1 py-2 rounded-xl text-white font-bold text-xs font-mono shadow-md flex items-center justify-center gap-1.5"
                style={{ backgroundColor: primary }}
              >
                <span>Ver Bases & Postular</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (subdomain === 'descargador') {
      return (
        <div className="space-y-4">
          <div 
            className="p-5 rounded-2xl border transition-all duration-300 shadow-xl space-y-3"
            style={{ 
              backgroundColor: bgCard, 
              borderColor: `${primary}50`,
              boxShadow: `0 8px 30px ${primary}20` 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: `${primary}18`, color: primary, borderColor: `${primary}40` }}>
                🎬 Descargador Universal Pro
              </span>
              <span className="text-xs font-bold" style={{ color: primary }}>1080p Ultra HD</span>
            </div>

            <div className="p-2.5 rounded-xl border flex items-center gap-2" style={{ backgroundColor: isDark ? '#0e1422' : '#f8fafc', borderColor: borderCol }}>
              <Video size={16} style={{ color: primary }} />
              <span className="text-xs font-mono truncate" style={{ color: textMuted }}>https://www.tiktok.com/@user/video/7289...</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1 shadow" style={{ backgroundColor: primary }}>
                <Download size={13} />
                <span>Descargar MP4</span>
              </button>
              <button type="button" className="py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1" style={{ borderColor: borderCol, color: textColor }}>
                <Music size={13} style={{ color: primary }} />
                <span>Audio MP3 (320k)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default Sorteos
    return (
      <div className="space-y-4">
        <div 
          className="p-5 rounded-2xl border transition-all duration-300 shadow-xl space-y-3"
          style={{ 
            backgroundColor: bgCard, 
            borderColor: `${primary}50`,
            boxShadow: `0 8px 30px ${primary}20` 
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
              style={{ backgroundColor: `${primary}18`, color: primary, borderColor: `${primary}40` }}>
              🎰 Ruleta del Ganador
            </span>
            <span className="text-xs font-bold" style={{ color: textMuted }}>2,450 Participantes</span>
          </div>

          <div className="p-4 rounded-xl border text-center space-y-1" style={{ backgroundColor: isDark ? '#0e1422' : '#f8fafc', borderColor: borderCol }}>
            <Award size={28} className="mx-auto" style={{ color: primary }} />
            <h5 className="text-sm font-extrabold" style={{ color: textColor }}>@mariagarcia_peru</h5>
            <p className="text-[11px]" style={{ color: textMuted }}>Premio: PlayStation 5 Slim + FIFA 25</p>
          </div>

          <button type="button" className="w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow" style={{ backgroundColor: primary }}>
            <Sparkles size={14} />
            <span>Girar Ruleta & Sortear</span>
          </button>
        </div>
      </div>
    );
  };

  // Reusable Studio Controls Column
  const renderControlsColumn = () => (
    <div className="p-5 overflow-y-auto max-h-[750px] custom-scrollbar space-y-6">
      {/* 1. ASISTENTE IA THEME STUDIO (GEMINI PRO) */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#0A0A0B] border border-slate-800 rounded-2xl p-3.5 flex flex-col items-stretch gap-2 shadow-2xl">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Sparkles size={11} className="text-pink-400" /> Asistente IA Theme Studio
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-pink-950/60 text-pink-400 border border-pink-500/20">
              Gemini Pro
            </span>
          </div>

          <textarea 
            placeholder="Ej: Neón romántico violeta y fucsia con degradados cósmicos y fondos oscuros..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            rows={2}
            className="w-full bg-transparent border-0 text-xs sm:text-sm text-white focus:ring-0 focus:outline-none placeholder-slate-500 resize-none p-1"
          />

          <div className="flex justify-end items-center pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={handleGenerateAITheme}
              disabled={aiLoading || !aiPrompt.trim()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs py-1.5 px-4 rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-pink-500/20"
            >
              {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
              <span>{aiLoading ? 'Generando...' : 'Aplicar con IA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MODO VISUAL PREDETERMINADO (DARK / LIGHT) */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Sun size={14} className="text-amber-400" />
            <span>Modo Visual Predeterminado</span>
          </h4>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
            {activeThemeMode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => updateThemeProp('theme_mode', 'dark')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
              activeThemeMode === 'dark'
                ? 'bg-slate-900 border-pink-500 shadow-md ring-1 ring-pink-500/40 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
              <Moon size={15} className="text-pink-400" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Modo Oscuro</p>
              <p className="text-[10px] text-slate-400">Neón / Cyberpunk</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateThemeProp('theme_mode', 'light')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
              activeThemeMode === 'light'
                ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/40 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
              <Sun size={15} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Modo Claro</p>
              <p className="text-[10px] text-slate-400">Editorial / Luminoso</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. SEED COLOR & PRESETS DE MARCA */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Palette size={14} className="text-pink-400" />
            <span>Seed Color (Base) & Algoritmo Cromático</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Define la tonalidad de identidad. El algoritmo calcula automáticamente toda la paleta armónica.
          </p>
        </div>

        {/* Seed Color Input */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2 pr-4">
          <input 
            type="color" 
            value={activeSeedColor} 
            onChange={(e) => updateThemeProp('seed_color', e.target.value.toUpperCase())}
            className="w-8 h-8 rounded-full cursor-pointer border-0 p-0" 
            style={{ clipPath: "circle(50%)" }}
          />
          <input
            type="text" 
            value={activeSeedColor} 
            onChange={(e) => updateThemeProp('seed_color', e.target.value.toUpperCase())}
            className="font-mono text-white text-xs flex-1 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 font-bold"
          />
        </div>

        {/* Presets Oficiales de Marca */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Presets de Marca</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map(p => {
              const isSelected = activeSeedColor.toLowerCase() === p.hex.toLowerCase();
              return (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-pink-500 ring-1 ring-pink-500/40 text-white shadow-md'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.hex }} />
                  <span className="text-[11px] font-medium truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Algoritmo Cromático Selector */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Algoritmo Cromático</span>
          <select
            value={activeColorTheme}
            onChange={(e) => updateThemeProp('color_theme', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-pink-500"
          >
            <option value="vibrant">Vibrant (Contraste Neón & Alta Saturación)</option>
            <option value="harmonic">Harmonic (Armonía Clásica & Suave)</option>
            <option value="analogous">Analogous (Tonos Análogos / Gradiente Natural)</option>
            <option value="monochrome">Monochrome (Monocromático Estricto)</option>
          </select>
        </div>

        {/* Paleta Final Editable */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paleta Final</span>
          <div className="space-y-2">
            {[
              { label: 'Primary', val: currentTheme.primary_color || generatedPalette.primary, key: 'primary_color' as const },
              { label: 'Secondary', val: currentTheme.secondary_color || generatedPalette.secondary, key: 'secondary_color' as const },
              { label: 'Tertiary', val: currentTheme.tertiary_color || generatedPalette.tertiary, key: 'tertiary_color' as const },
              { label: 'Neutral', val: currentTheme.neutral_color || generatedPalette.neutral, key: 'neutral_color' as const }
            ].map(col => (
              <div key={col.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={col.val}
                    onChange={(e) => updateThemeProp(col.key, e.target.value.toUpperCase())}
                    className="w-5 h-5 rounded-full cursor-pointer border-0 p-0"
                    style={{ clipPath: "circle(50%)" }}
                  />
                  <span className="text-xs font-medium text-slate-300">{col.label}</span>
                </div>
                <input
                  type="text"
                  value={col.val}
                  onChange={(e) => updateThemeProp(col.key, e.target.value.toUpperCase())}
                  className="font-mono text-xs text-white bg-slate-950 px-2 py-1 rounded border border-slate-800 w-20 text-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FONDO GLOBAL & GRADIENT BUILDER INTERACTIVO */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <ImageIcon size={14} className="text-pink-400" />
            <span>Fondo Global (Opcional)</span>
          </h4>
          {currentTheme.global_background_image && (
            <button
              type="button"
              onClick={() => updateThemeProp('global_background_image', '')}
              className="text-[10px] text-rose-400 hover:text-rose-300"
            >
              Quitar Fondo
            </button>
          )}
        </div>

        {/* Botón Diseñar Fondo Animado (Modal Gradient Builder) */}
        <button
          type="button"
          onClick={() => setShowGradientBuilder(true)}
          className="w-full p-3 rounded-xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 shadow-sm" />
            <span>Diseñar Fondo Animado (Mesh Studio)</span>
          </div>
          <Sparkles size={14} className="text-pink-400" />
        </button>

        {/* Selector de Wallpapers Predefinidos */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Galería de Fondos Listos</span>
          <select
            value={currentTheme.global_background_image || ""}
            onChange={(e) => updateThemeProp('global_background_image', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-pink-500"
          >
            {WALLPAPER_PRESETS.map((w, idx) => (
              <option key={idx} value={w.url}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. TIPOGRAFÍAS (GOOGLE FONTS) */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <Type size={14} className="text-cyan-400" />
          <span>Tipografías (Google Fonts)</span>
        </h4>
        <div className="space-y-2.5">
          {[
            { label: 'Headline', val: currentTheme.font_headline || 'Space Grotesk', key: 'font_headline' as const, opts: ['Space Grotesk', 'Hanken Grotesk', 'Outfit', 'Inter', 'Syne', 'Orbitron'] },
            { label: 'Body', val: currentTheme.font_body || 'Inter', key: 'font_body' as const, opts: ['Inter', 'Roboto', 'DM Sans', 'Open Sans', 'Manrope'] },
            { label: 'Label', val: currentTheme.font_label || 'JetBrains Mono', key: 'font_label' as const, opts: ['JetBrains Mono', 'Fira Code', 'Space Mono', 'IBM Plex Mono'] }
          ].map(font => (
            <div key={font.label} className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl p-2 pr-3">
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                <span className="text-slate-400 text-xs font-bold">Aa</span>
              </div>
              <div className="flex-1 min-w-0">
                <select
                  value={font.val}
                  onChange={(e) => updateThemeProp(font.key, e.target.value)}
                  className="w-full bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
                >
                  {font.opts.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{font.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. BORDES (RADIUS) */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bordes (Radius)</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'rounded-none', label: 'none', class: 'rounded-none' },
            { id: 'rounded-xl', label: 'xl', class: 'rounded-xl' },
            { id: 'rounded-2xl', label: '2xl', class: 'rounded-2xl' },
            { id: 'rounded-3xl', label: '3xl', class: 'rounded-3xl' },
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => updateThemeProp('radius_style', r.id as any)}
              className={`h-11 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                (currentTheme.radius_style || 'rounded-3xl') === r.id
                  ? 'border-pink-500 bg-pink-500/15 text-white shadow-md'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-t-2 border-l-2 border-current ${r.class} translate-x-0.5 translate-y-0.5`} />
              <span className="text-[9px] font-mono mt-0.5">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 7. LABORATORIO DE INTERACCIÓN (MOUSE & CLIC) */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <Zap size={14} className="text-amber-400" />
          <span>Laboratorio de Interacción (Mouse)</span>
        </h4>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col divide-y divide-slate-800/80">
          {[
            { id: 'spotlight-border', label: 'Reflector Neón', icon: <Sparkles size={13} className="text-pink-400" /> },
            { id: 'full-border', label: 'Borde Neón Completo', icon: <Square size={13} className="text-purple-400" /> },
            { id: 'spotlight-full', label: 'Relleno Neón', icon: <Sparkles size={13} className="text-indigo-400" /> },
            { id: 'electric', label: 'Reflector Eléctrico', icon: <Zap size={13} className="text-amber-400" /> },
            { id: 'electric-full', label: 'Borde Eléctrico Completo', icon: <Zap size={13} className="text-yellow-400" /> },
            { id: 'tilt', label: 'Inclinación 3D', icon: <div className="w-2.5 h-2.5 border border-emerald-400 transform rotate-12 skew-x-12" /> },
            { id: 'ripple', label: 'Ondas (Clic)', icon: <div className="w-2.5 h-2.5 rounded-full border border-cyan-400" /> },
            { id: 'burst', label: 'Explosión (Clic)', icon: <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_6px_#fbbf24]" /> },
            { id: 'glitch', label: 'Texto Glitch', icon: <span className="text-rose-400 font-mono text-[9px] font-bold">X</span> },
            { id: 'magnet', label: 'Magnetismo', icon: <div className="w-2.5 h-2.5 border-2 border-blue-400 rounded-t-full" /> },
            { id: 'none', label: 'Ninguno', icon: <div className="w-2.5 h-0.5 bg-slate-500" /> }
          ].map(effect => {
            const isActive = activeMouseEffects.includes(effect.id) || (effect.id === 'none' && activeMouseEffects.length === 0);
            return (
              <button
                key={effect.id}
                type="button"
                onClick={() => toggleMouseEffect(effect.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  isActive ? 'bg-pink-500/10 text-white' : 'hover:bg-slate-800/60 text-slate-400'
                }`}
              >
                <div className={`w-4 h-4 flex items-center justify-center rounded border transition-all ${
                  isActive ? 'bg-pink-500 border-pink-400 text-white' : 'bg-slate-950 border-slate-700'
                }`}>
                  {isActive && <Check size={11} />}
                </div>
                <div className="w-5 h-5 flex items-center justify-center rounded bg-slate-950 border border-slate-800">
                  {effect.icon}
                </div>
                <span className="text-xs font-medium">{effect.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. ESTILO DEL NEÓN & INTENSIDAD */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <Sparkle size={14} className="text-pink-400" />
          <span>Estilo del Neón</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {['Monocolor', 'Armónico', 'Multicolor'].map(st => (
            <button
              key={st}
              type="button"
              className="py-2 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900 hover:border-pink-500/50 text-slate-300"
            >
              {st}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Grosor e Intensidad del Neón</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: '2px', label: 'Fino' },
              { id: '4px', label: 'Medio (4px)' },
              { id: '6px', label: 'Grueso' },
              { id: '8px', label: 'Ultra' }
            ].map(th => (
              <button
                key={th.id}
                type="button"
                onClick={() => updateThemeProp('neon_thickness', th.id)}
                className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  (currentTheme.neon_thickness || '4px') === th.id
                    ? 'bg-pink-500/15 border-pink-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 9. CURSOR ANIMADO GLOBAL */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <MousePointer size={14} className="text-emerald-400" />
          <span>Cursor Animado Global</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'cursor-trail', label: 'Estrellas Mágicas' },
            { id: 'spotlight', label: 'Spotlight Luz' },
            { id: 'bubbles', label: 'Burbujas' },
            { id: 'laser', label: 'Mira Láser' },
            { id: 'radar', label: 'Radar Pulso' },
            { id: 'none', label: 'Nativo (OS)' }
          ].map(cur => (
            <button
              key={cur.id}
              type="button"
              onClick={() => updateThemeProp('cursor_effect', cur.id)}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer text-xs font-medium ${
                (currentTheme.cursor_effect || 'cursor-trail') === cur.id
                  ? 'bg-pink-500/15 border-pink-500 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button: Guardar Cambios */}
      <div className="pt-2 sticky bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pb-1 z-10">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Guardando...' : `Guardar y Publicar Tema de ${subdomainTitle}`}</span>
        </button>
        {saveSuccessMsg && (
          <p className="text-xs text-center text-emerald-400 font-bold mt-2 animate-fadeIn">
            ✓ {saveSuccessMsg}
          </p>
        )}
      </div>
    </div>
  );

  // Reusable Preview Panel Column
  const renderPreviewColumn = (targetIframeRef: React.RefObject<HTMLIFrameElement | null>) => (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden">
      {/* Top Bar Preview Toolbar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isServerOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'}`} />
          <span className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
            <Eye size={13} className={isServerOnline ? "text-emerald-400" : "text-amber-400"} />
            <span>{previewMode === 'components' ? 'Simulación UI' : isServerOnline ? 'En Vivo:' : 'Conectando:'}</span>
            <strong className="text-pink-400 font-semibold lowercase">
              {previewSource === 'local' ? `:${port}` : activePreviewUrl.replace(/^https?:\/\//, '')}
            </strong>
          </span>
        </div>

        {/* View Mode Selector: Iframe vs Components */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setPreviewMode('iframe')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              previewMode === 'iframe'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={12} />
            <span>Portal Completo</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('components')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              previewMode === 'components'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={12} />
            <span>Componentes UI</span>
          </button>
        </div>

        {/* Device Switcher (Desktop / Tablet / Mobile) */}
        {previewMode === 'iframe' && (
          <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Escritorio (100%)"
            >
              <Laptop size={12} />
              <span className="hidden sm:inline">100%</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                previewDevice === 'tablet' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet (768px)"
            >
              <Tablet size={12} />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Móvil (390px)"
            >
              <Smartphone size={12} />
              <span className="hidden sm:inline">Móvil</span>
            </button>
          </div>
        )}

        {/* Actions: Reload & External & Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setIframeRefreshKey(prev => prev + 1);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Recargar vista previa"
          >
            <RefreshCw size={13} />
          </button>
          <a
            href={activePreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition"
            title="Abrir en pestaña nueva"
          >
            <ExternalLink size={13} />
          </a>
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition cursor-pointer"
            title={isFullScreen ? "Cerrar pantalla completa" : "Pantalla completa"}
          >
            {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="w-full flex-1 min-h-[580px] flex items-center justify-center rounded-xl overflow-hidden bg-[#030712] border border-slate-950 p-2 relative">
        {previewMode === 'iframe' ? (
          <div
            className={`transition-all duration-300 relative ${
              previewDevice === 'desktop'
                ? 'w-full h-[620px] rounded-xl border border-slate-800'
                : previewDevice === 'tablet'
                ? 'w-[768px] max-w-full h-[620px] rounded-2xl border-4 border-slate-700 ring-2 ring-slate-900'
                : 'w-[390px] max-w-full h-[620px] rounded-[36px] border-8 border-slate-800 ring-4 ring-slate-950 relative overflow-hidden shadow-2xl'
            }`}
          >
            {/* Simulated Mobile Notch */}
            {previewDevice === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-3.5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-700 mr-2" />
                <div className="w-8 h-1 bg-slate-900 rounded-full" />
              </div>
            )}

            {/* If server is NOT online or probing, show graceful connection overlay with instant UI fallback to prevent browser gray cloud */}
            {isServerOnline === null ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#070b14] space-y-3">
                <Loader2 size={24} className="text-pink-400 animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-white">Conectando vista previa de {subdomainTitle}...</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Cargando {activePreviewUrl.replace(/^https?:\/\//, '')}.
                  </p>
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
                    Ni localhost :{port} ni {activePreviewUrl} respondieron. Puedes usar Componentes UI simulados o reintentar.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('components')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 flex items-center gap-1.5 shadow-lg shadow-pink-500/20 cursor-pointer"
                  >
                    <Layers size={13} />
                    <span>Ver Componentes UI Simulados</span>
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
                ref={targetIframeRef as any}
                key={`${activePreviewUrl}-${iframeRefreshKey}`}
                src={activePreviewUrl}
                className="w-full h-full border-0 bg-transparent"
                title={`${subdomainTitle} Live Preview`}
                onLoad={() => broadcastThemeToIframe(currentTheme)}
              />
            )}
          </div>
        ) : (
          <div className="w-full max-w-lg p-3">
            {renderSubdomainComponentPreview()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Studio Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30 uppercase">
              Theme Studio Pro
            </span>
            <span className="text-xs text-slate-400">Subdominio: <strong className="text-white">{subdomain}.atpdev.dev</strong></span>
          </div>
          <h2 className="text-lg font-extrabold text-white mt-1">
            Personalización de Color, Estética & Experiencia
          </h2>
          <p className="text-xs text-slate-400">
            Ajusta la paleta de colores, modo visual ({activeThemeMode}), efectos neón y laboratorio de interacción con vista previa responsiva.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFullScreen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition cursor-pointer shadow-md"
        >
          <Maximize2 size={13} className="text-pink-400" />
          <span>Abrir Diseñador en Pantalla Completa</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Controls Studio */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-pink-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Estudio de Marca & Tema</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Puerto :{port}
            </span>
          </div>
          {renderControlsColumn()}
        </div>

        {/* Right: Live Preview Panel */}
        {renderPreviewColumn(iframeRef)}
      </div>

      {/* Fullscreen Modal Designer */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Diseñador de Tema en Pantalla Completa</h3>
                <p className="text-xs text-slate-400">Subdominio {subdomainTitle} ({subdomain}.atpdev.dev)</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFullScreen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
            <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col">
              {renderControlsColumn()}
            </div>
            <div className="lg:col-span-7 flex flex-col">
              {renderPreviewColumn(modalIframeRef)}
            </div>
          </div>
        </div>
      )}

      {/* GRADIENT BUILDER STUDIO OVERLAY */}
      {showGradientBuilder && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col p-4 md:p-10 backdrop-blur-md animate-in fade-in">
          <div className="flex justify-between items-center mb-6 bg-[#111] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Sparkles className="text-pink-500" /> Diseñador de Fondo Global ({subdomainTitle})
              </h3>
              <p className="text-gray-400 text-xs mt-1">Crea un fondo mágico. Cuando termines, haz clic en el botón verde <strong>"Usar como Portada"</strong> dentro del editor.</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowGradientBuilder(false)} 
              className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-xl font-bold hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          
          <iframe 
            src="/gradient-builder.html" 
            className="w-full flex-1 rounded-3xl border border-gray-800 shadow-2xl bg-black" 
            title="Gradient Builder"
          />
        </div>
      )}

      {/* HIDDEN IFRAME FOR SILENT AI BACKGROUND GENERATION */}
      <iframe 
        ref={hiddenIframeRef}
        src="/gradient-builder.html"
        className="fixed top-[-10000px] left-[-10000px] w-[1600px] h-[1000px] opacity-0 pointer-events-none z-[-1]"
        aria-hidden="true"
        tabIndex={-1}
        title="Gradient Builder Generator"
      />
    </div>
  );
}
