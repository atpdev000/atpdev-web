"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Download, 
  Settings, 
  Layers, 
  Server, 
  Palette, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Save, 
  ShieldCheck, 
  Youtube, 
  Video, 
  Music, 
  Activity,
  Flame,
  Radio,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Sun,
  Moon,
  Check,
  SlidersHorizontal,
  Maximize2,
  Laptop,
  Tablet,
  Smartphone,
  Monitor,
  Wand2,
  Loader2,
  X
} from "lucide-react";
import { SubdomainConfig, ACCENT_COLOR_MAP } from "@atpdev/database";
import { saveDescargadorConfigAction, checkRailwayBackendHealthAction } from "./actions";

interface Props {
  initialConfig: SubdomainConfig;
}

const WALLPAPER_PRESETS = [
  {
    name: "Dark Mesh Nebula",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Cyberpunk Blue Gradient",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Nordic Minimalist Waves",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Deep Space Stars",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Clean Light Studio",
    url: "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=400&q=80"
  }
];

const ACCENT_PRESETS = [
  { name: 'Azul Eléctrico', hex: '#3b82f6' },
  { name: 'Púrpura Neón', hex: '#8b5cf6' },
  { name: 'Verde Esmeralda', hex: '#10b981' },
  { name: 'Rosa Vibrante', hex: '#ec4899' },
  { name: 'Ámbar Dorado', hex: '#f59e0b' },
  { name: 'Cyan Eléctrico', hex: '#06b6d4' }
];

export default function DescargadorAdminClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<SubdomainConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'modules' | 'branding' | 'theme' | 'backend'>('modules');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Broadcast theme change to live tabs
  const broadcastThemeChange = (newTheme: any) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const bc = new BroadcastChannel("descargador_theme_channel");
        bc.postMessage({ type: "UPDATE_DESCARGADOR_THEME", payload: newTheme });
        bc.close();
      } catch {}
    }
  };

  // Theme Studio State & Live Preview Sync
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'iframe' | 'components'>('iframe');
  const [iframeRefreshKey, setIframeRefreshKey] = useState(0);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiIncludeBackground, setAiIncludeBackground] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [themeSuccessMsg, setThemeSuccessMsg] = useState<string | null>(null);

  const sendThemeToIframe = (themeToSend: any) => {
    broadcastThemeChange(themeToSend);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_DESCARGADOR_THEME', payload: themeToSend }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME_PREVIEW', payload: themeToSend }, '*');
    }
  };

  useEffect(() => {
    if (activeTab === 'theme') {
      sendThemeToIframe(config.theme);
    }
  }, [config.theme, activeTab]);

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      const res = await saveDescargadorConfigAction({ theme: config.theme });
      if (res.success) {
        setConfig(res.config);
        sendThemeToIframe(res.config.theme);
        setThemeSuccessMsg('¡Paleta, colores y fondo de Descargador Pro guardados con éxito!');
        setTimeout(() => setThemeSuccessMsg(null), 4000);
      } else {
        alert('No se pudo guardar el tema visual.');
      }
    } catch {
      alert('Error al guardar el tema visual.');
    } finally {
      setSaving(false);
    }
  };

  // Backend Health check state
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<{
    tested: boolean;
    online: boolean;
    statusText: string;
    latencyMs: number;
    details?: any;
  }>({
    tested: false,
    online: false,
    statusText: '',
    latencyMs: 0
  });

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await saveDescargadorConfigAction(config);
      if (res.success) {
        setConfig(res.config);
        broadcastThemeChange(res.config.theme);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await checkRailwayBackendHealthAction();
      setHealthResult({
        tested: true,
        online: res.online,
        statusText: res.statusText,
        latencyMs: res.latencyMs,
        details: res.details
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  const toggleModule = (moduleKey: string) => {
    setConfig(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleKey]: !prev.modules[moduleKey]
      }
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-500/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              SUBDOMINIO ACTIVO • PUERTO 3007
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Download className="w-8 h-8 text-blue-400" />
              Descargador Pro
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Administración centralizada de la plataforma de descargas multimedia. Controla módulos de video/audio, SEO, branding y el motor backend en Railway.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="https://descargador.atpdev.dev" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-sm border border-slate-700 transition"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              Ver Subdominio
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Configuración actualizada con éxito en todo el monorepo y la base de datos.
          </div>
        )}
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'modules'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Módulos & Plataformas
        </button>

        <button
          onClick={() => setActiveTab('backend')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'backend'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4" />
          Backend Railway (yt-dlp)
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'branding'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          Branding & SEO
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'theme'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          Apariencia & Colores
        </button>
      </div>

      {/* TAB 1: MODULES */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* YouTube */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Youtube className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('youtube_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.youtube_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.youtube_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">YouTube Downloader</h3>
            <p className="text-xs text-slate-400 mt-1">
              Extracción de video en 1080p, 720p, 480p y conversión a audio MP3 vía yt-dlp y frontend.
            </p>
          </div>

          {/* TikTok */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Video className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('tiktok_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.tiktok_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.tiktok_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">TikTok Sin Marca de Agua</h3>
            <p className="text-xs text-slate-400 mt-1">
              Descarga directa de videos de TikTok limpios en alta definición con audio original.
            </p>
          </div>

          {/* Facebook */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Radio className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('facebook_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.facebook_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.facebook_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Facebook Video Downloader</h3>
            <p className="text-xs text-slate-400 mt-1">
              Soporte para Reels, videos públicos y transmisiones de Facebook en calidad HD y SD.
            </p>
          </div>

          {/* MP3 Audio Extractor */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Music className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('audio_extractor_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.audio_extractor_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.audio_extractor_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Extractor de Audio (MP3)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Conversión a audio 320kbps / 192kbps con etiquetado de metadatos automático.
            </p>
          </div>

          {/* FFmpeg Client */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('ffmpeg_client_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.ffmpeg_client_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.ffmpeg_client_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Motor FFmpeg en Navegador</h3>
            <p className="text-xs text-slate-400 mt-1">
              Fusión WebAssembly de audio y video en el cliente para ahorrar ancho de banda del servidor.
            </p>
          </div>

          {/* AdSense */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Flame className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('adsense_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.adsense_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.adsense_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Monetización Google AdSense</h3>
            <p className="text-xs text-slate-400 mt-1">
              Banners automáticos y unidades de anuncios responsivas estratégicamente ubicadas.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: BACKEND RAILWAY */}
      {activeTab === 'backend' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Motor Backend Python (FastAPI + yt-dlp)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Servicio desplegado en Railway que resuelve enlaces complejos, bypass de cookies y streams protegidos.
              </p>
            </div>

            <button
              onClick={handleCheckHealth}
              disabled={checkingHealth}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
              Probar Conexión (Ping)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">URL de Producción Railway</label>
              <p className="text-sm font-mono text-blue-400 break-all select-all">
                https://backend-freedownloaderpro.up.railway.app
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Estado de Salud</label>
              {healthResult.tested ? (
                <div className="flex items-center gap-2">
                  {healthResult.online ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Online • {healthResult.latencyMs}ms
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      Offline ({healthResult.statusText})
                    </span>
                  )}
                  <span className="text-xs text-slate-500">{healthResult.statusText}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Haz clic en &quot;Probar Conexión&quot; para verificar el estado en vivo.</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
            💡 <strong>Arquitectura Híbrida:</strong> El frontend en Next.js procesa solicitudes directas ligeras (TikTok, Facebook y YouTube Web), mientras que las peticiones complejas (como combinación de pistas de audio y video 1080p sin pérdida) se canalizan hacia el backend Python con cookies de sesión rotativas.
          </div>
        </div>
      )}

      {/* TAB 3: BRANDING & SEO */}
      {activeTab === 'branding' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Textos, Títulos y Metadatos SEO
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nombre del Sitio</label>
              <input
                type="text"
                value={config.branding.site_title}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, site_title: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Eslogan (Tagline)</label>
              <input
                type="text"
                value={config.branding.site_tagline}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, site_tagline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">Título SEO (Meta Title)</label>
              <input
                type="text"
                value={config.seo.meta_title}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { ...config.seo, meta_title: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">Descripción SEO (Meta Description)</label>
              <textarea
                rows={3}
                value={config.seo.meta_description}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { ...config.seo, meta_description: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">URL Canónica</label>
              <input
                type="text"
                value={config.seo.canonical_url}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { ...config.seo, canonical_url: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Hero Badge</label>
              <input
                type="text"
                value={config.branding.hero_badge}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, hero_badge: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THEME STUDIO & LIVE PREVIEW (MATCHING CHAMBA PRO & SORTEOS PRO) */}
      {activeTab === 'theme' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: CONTROLES THEME BUILDER (5 cols) */}
          <div className="xl:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Estudio de Marca & Tema</span>
              </div>
              <a
                href="http://localhost:3007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 size={12} />
                <span>Pantalla Completa</span>
              </a>
            </div>

            {/* Scrollable controls */}
            <div className="p-5 overflow-y-auto max-h-[750px] custom-scrollbar space-y-6">
              
              {/* ✨ 1. IA THEME STUDIO (Google AI Studio / Gemini Pro Card) */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative bg-[#0A0A0B] border border-slate-800 rounded-2xl p-3 flex flex-col items-stretch gap-2 overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Sparkles size={11} /> IA Theme Studio Subdominios
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-500/20">
                      Gemini Pro
                    </span>
                  </div>

                  <textarea 
                    placeholder="Ej: Cyberpunk neón azul eléctrico con fondos oscuros profundos y acentos cyan..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border-0 text-xs sm:text-sm text-white focus:ring-0 focus:outline-none placeholder-slate-500 resize-none p-1"
                  />

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                    <label className="flex items-center gap-2 cursor-pointer group/toggle">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={aiIncludeBackground}
                          onChange={(e) => setAiIncludeBackground(e.target.checked)}
                        />
                        <div className={`block w-7 h-4 rounded-full transition-colors ${aiIncludeBackground ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${aiIncludeBackground ? 'transform translate-x-3' : ''}`}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover/toggle:text-slate-200 font-medium transition-colors">Generar fondo animado</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAiLoading(true);
                        setTimeout(() => {
                          const updated = {
                            ...config.theme,
                            accent_color: '#3b82f6',
                            primary_color: '#3b82f6',
                            global_background_image: aiIncludeBackground ? WALLPAPER_PRESETS[1].url : config.theme.global_background_image
                          };
                          setConfig({ ...config, theme: updated });
                          sendThemeToIframe(updated);
                          setIsAiLoading(false);
                        }, 700);
                      }}
                      disabled={isAiLoading}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs py-1.5 px-4 rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-500/20"
                    >
                      {isAiLoading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
                      <span>{isAiLoading ? 'Generando...' : 'Get started'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. MODO VISUAL DEL PORTAL (DARK / LIGHT) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Sun size={14} className="text-amber-400" />
                    <span>Modo Visual del Portal</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {config.theme.theme_mode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...config.theme, theme_mode: 'dark' as const };
                      setConfig({ ...config, theme: updated });
                      sendThemeToIframe(updated);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      config.theme.theme_mode === 'dark'
                        ? 'bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/40 text-white'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <Moon size={15} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Modo Oscuro</p>
                      <p className="text-[10px] text-slate-400">Cyberpunk / Oficial</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...config.theme, theme_mode: 'light' as const };
                      setConfig({ ...config, theme: updated });
                      sendThemeToIframe(updated);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      config.theme.theme_mode === 'light'
                        ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/40 text-white'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <Sun size={15} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Modo Claro</p>
                      <p className="text-[10px] text-slate-400">Luminoso / Editorial</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. FONDO GLOBAL (OPCIONAL) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fondo Global (Opcional)</span>
                  {config.theme.global_background_image && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config.theme, global_background_image: '' };
                        setConfig({ ...config, theme: updated });
                        sendThemeToIframe(updated);
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={11} /> Quitar
                    </button>
                  )}
                </div>

                {/* Presets Gallery */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {WALLPAPER_PRESETS.map((preset) => {
                    const isSelected = config.theme.global_background_image === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          const updated = { ...config.theme, global_background_image: preset.url };
                          setConfig({ ...config, theme: updated });
                          sendThemeToIframe(updated);
                        }}
                        className={`relative rounded-lg overflow-hidden border aspect-video flex flex-col justify-end p-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-400 ring-2 ring-blue-500/50 shadow-md'
                            : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundImage: `url("${preset.preview}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-black/40" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check size={9} />
                          </div>
                        )}
                        <span className="relative z-10 text-[8px] font-bold text-white truncate">
                          {preset.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Direct URL input */}
                <input
                  type="url"
                  placeholder="URL directa de fondo o selecciona un preset arriba..."
                  value={config.theme.global_background_image || ''}
                  onChange={(e) => {
                    const updated = { ...config.theme, global_background_image: e.target.value };
                    setConfig({ ...config, theme: updated });
                    sendThemeToIframe(updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 outline-none"
                />
              </div>

              {/* 4. SEED COLOR (BASE) & PRESETS */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Palette size={14} className="text-blue-400" />
                    <span>Seed Color (Base) & Algoritmo de Color</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Define la identidad cromática. El algoritmo calcula automáticamente toda la paleta armónica.
                  </p>
                </div>

                {/* Color Input */}
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2 pr-4">
                  <input 
                    type="color" 
                    value={config.theme.accent_color} 
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      const updated = { ...config.theme, accent_color: val, primary_color: val };
                      setConfig({ ...config, theme: updated });
                      sendThemeToIframe(updated);
                    }}
                    className="w-8 h-8 rounded-full cursor-pointer border-0 p-0" 
                    style={{ clipPath: "circle(50%)" }}
                  />
                  <input
                    type="text" 
                    value={config.theme.accent_color} 
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      const updated = { ...config.theme, accent_color: val, primary_color: val };
                      setConfig({ ...config, theme: updated });
                      sendThemeToIframe(updated);
                    }}
                    className="font-mono text-white text-xs flex-1 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 font-bold"
                  />
                </div>

                {/* Presets Oficiales de Marca */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Presets Oficiales de Marca</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.entries(ACCENT_COLOR_MAP) as [any, { hex: string; name: string; glow: string }][]).map(([key, val]) => {
                      const isSelected = config.theme.accent_color.toLowerCase() === val.hex.toLowerCase();
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            const updated = { ...config.theme, accent_color: val.hex, primary_color: val.hex };
                            setConfig({ ...config, theme: updated });
                            sendThemeToIframe(updated);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/40 text-white shadow-md'
                              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-md shrink-0 border border-white/10"
                            style={{ backgroundColor: val.hex, boxShadow: `0 0 8px ${val.glow}` }}
                          />
                          <span className="text-[10px] font-bold truncate">{val.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botón de Guardado */}
              <div className="pt-2">
                {themeSuccessMsg && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>{themeSuccessMsg}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveTheme}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
                  <span>{saving ? 'Guardando Tema en Servidor...' : 'Aplicar y Guardar Tema de Descargador Pro'}</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Sincronización en vivo en el portal real (:3007) y almacenamiento permanente en JSON.
                </p>
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: LIVE PREVIEW STUDIO (IFRAME & DEVICE SIMULATOR) (7 cols) */}
          <div className="xl:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 sticky top-6 shadow-2xl">
              
              {/* TOOLBAR SUPERIOR DEL SIMULADOR */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                
                {/* Conexión e Identificación */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Live Preview: <strong className="text-blue-400">Descargador Pro (:3007)</strong>
                  </span>
                </div>

                {/* Selector de Modo de Vista */}
                <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('iframe')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewMode === 'iframe'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Monitor size={12} />
                      <span>Portal Completo (:3007)</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('components')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewMode === 'components'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers size={12} />
                      <span>Componentes UI</span>
                    </span>
                  </button>
                </div>

                {/* Selector de Dispositivos Responsivo */}
                {previewMode === 'iframe' && (
                  <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        previewDevice === 'desktop'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Escritorio / Desktop (100%)"
                    >
                      <Laptop size={13} />
                      <span className="hidden sm:inline">100%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('tablet')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        previewDevice === 'tablet'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Tablet (768px)"
                    >
                      <Tablet size={13} />
                      <span className="hidden sm:inline">Tablet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        previewDevice === 'mobile'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Móvil / Smartphone (390px)"
                    >
                      <Smartphone size={13} />
                      <span className="hidden sm:inline">Móvil</span>
                    </button>
                  </div>
                )}

                {/* Acciones de Recarga y Apertura Externa */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIframeRefreshKey(prev => prev + 1)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
                    title="Recargar vista previa"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <a
                    href="http://localhost:3007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20 cursor-pointer"
                    title="Abrir portal en pestaña nueva"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* VISTA 1: IFRAME EN VIVO (PORTAL REAL CON MARCO DE DISPOSITIVO) */}
              {previewMode === 'iframe' && (
                <div className="w-full bg-[#030712] p-4 rounded-xl flex items-center justify-center min-h-[660px] overflow-hidden border border-slate-950">
                  <div
                    className={`transition-all duration-300 bg-[#070a12] shadow-2xl relative ${
                      previewDevice === 'desktop'
                        ? 'w-full h-[650px] rounded-xl border border-slate-800'
                        : previewDevice === 'tablet'
                        ? 'w-[768px] max-w-full h-[650px] rounded-2xl border-4 border-slate-700 ring-2 ring-slate-900'
                        : 'w-[390px] max-w-full h-[650px] rounded-[36px] border-8 border-slate-800 ring-4 ring-slate-950 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {/* Notch simulado para vista móvil */}
                    {previewDevice === 'mobile' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-4 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700 mr-2" />
                        <div className="w-10 h-1 bg-slate-900 rounded-full" />
                      </div>
                    )}

                    <iframe
                      ref={iframeRef}
                      key={iframeRefreshKey}
                      src="http://localhost:3007"
                      className="w-full h-full border-0 bg-transparent"
                      title="Vista previa Descargador Pro"
                      onLoad={() => {
                        sendThemeToIframe(config.theme);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* VISTA 2: COMPONENTES UI MOCKUP */}
              {previewMode === 'components' && (
                <div className="w-full bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-md">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Vista Rápida de Componentes
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mb-4">
                      Así responden los botones y tarjetas a la paleta activa:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        type="button" 
                        style={{ backgroundColor: config.theme.accent_color }}
                        className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md"
                      >
                        Botón Primario
                      </button>
                      <button 
                        type="button" 
                        className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs"
                      >
                        Botón Secundario
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
