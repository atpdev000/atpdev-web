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
  Instagram,
  Twitter,
  FileText,
  Share2,
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
  X,
  Mail,
  Phone,
  Search,
  Bell,
  Megaphone
} from "lucide-react";
import { SubdomainConfig, SubdomainTheme, ACCENT_COLOR_MAP } from "@atpdev/database";
import { saveDescargadorConfigAction, checkRailwayBackendHealthAction } from "./actions";
import UnifiedThemeStudio from "@/components/theme/UnifiedThemeStudio";

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
  const [activeTab, setActiveTab] = useState<'modules' | 'branding' | 'theme' | 'backend' | 'seo' | 'contact'>('modules');
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
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          try {
            const bc = new BroadcastChannel("descargador_theme_channel");
            bc.postMessage({ type: "UPDATE_DESCARGADOR_CONFIG", payload: res.config });
            bc.close();
          } catch {}
        }
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
            activeTab === 'branding'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          Textos & Hero
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
            activeTab === 'seo'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Search className="w-4 h-4" />
          SEO & Metadatos
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
            activeTab === 'contact'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Mail className="w-4 h-4" />
          Contacto & Canales
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
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

          {/* Instagram */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Instagram className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('instagram_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.instagram_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.instagram_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Instagram Video & Reels</h3>
            <p className="text-xs text-slate-400 mt-1">
              Descarga de publicaciones, Reels, Stories y audios de Instagram en alta definición.
            </p>
          </div>

          {/* Twitter / X */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-white border border-slate-700 flex items-center justify-center">
                <span className="font-black text-xl">𝕏</span>
              </div>
              <button
                onClick={() => toggleModule('twitter_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.twitter_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.twitter_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Twitter / 𝕏 Video & GIF</h3>
            <p className="text-xs text-slate-400 mt-1">
              Extracción directa de clips y GIFs animados en formatos MP4 de alta tasa de bits.
            </p>
          </div>

          {/* Threads */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/80 text-white border border-zinc-700 flex items-center justify-center">
                <span className="font-bold text-xl">@</span>
              </div>
              <button
                onClick={() => toggleModule('threads_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.threads_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.threads_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Threads Video Downloader</h3>
            <p className="text-xs text-slate-400 mt-1">
              Soporte para videos y publicaciones multimedia de la red social Threads de Meta.
            </p>
          </div>

          {/* WhatsApp Status Saver (Mobile Exclusivo) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('whatsapp_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.whatsapp_enabled ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.whatsapp_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <h3 className="text-base font-bold text-white">WhatsApp Estados (Solo Teléfonos)</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Móvil</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Detector y guardador automático de fotos y videos de estados de WhatsApp vistos en el celular.
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
            <h3 className="mt-4 text-base font-bold text-white">Monetización Google AdSense & Ezoic</h3>
            <p className="text-xs text-slate-400 mt-1">
              Banners automáticos y unidades de anuncios responsivas estratégicamente ubicadas.
            </p>
          </div>

          {/* AdMob (Mobile) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('admob_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.admob_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.admob_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Google AdMob (App Android)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Banners nativos en pie de pantalla e Interstitials entre descargas en APK/Play Store.
            </p>
          </div>

          {/* Blog & SEO Guides */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <button
                onClick={() => toggleModule('blog_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.blog_enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.blog_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Blog & Guías Técnicas SEO</h3>
            <p className="text-xs text-slate-400 mt-1">
              Sección con 9 tutoriales especializados para posicionamiento orgánico en Google.
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

      {/* TAB 3: BRANDING & HERO */}
      {activeTab === 'branding' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Identidad de Marca, Hero y Anuncios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nombre del Sitio (Branding)</label>
              <input
                type="text"
                value={config.branding.site_title || ''}
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
                value={config.branding.site_tagline || ''}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, site_tagline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">Hero Badge (Píldora Superior)</label>
              <input
                type="text"
                value={config.branding.hero_badge || ''}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, hero_badge: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Hero Título (Prefijo)</label>
              <input
                type="text"
                value={config.branding.hero_title_prefix || ''}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, hero_title_prefix: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Hero Título (Destacado Neón)</label>
              <input
                type="text"
                value={config.branding.hero_title_highlight || ''}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, hero_title_highlight: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">Descripción del Hero</label>
              <textarea
                rows={3}
                value={config.branding.hero_description || ''}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, hero_description: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* Barra de Anuncios */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Barra de Notificaciones Superior</span>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig({
                    ...config,
                    branding: { ...config.branding, announcement_enabled: !config.branding.announcement_enabled }
                  })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.branding.announcement_enabled ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                    config.branding.announcement_enabled ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Ej: ⚡ Descargas ilimitadas en máxima calidad sin marcas de agua."
                value={config.branding.announcement_text || ''}
                onChange={(e) => setConfig({
                  ...config,
                  branding: { ...config.branding, announcement_text: e.target.value }
                })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEO & METADATOS */}
      {activeTab === 'seo' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            Optimización en Motores de Búsqueda (SEO)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">Título SEO (Meta Title)</label>
              <input
                type="text"
                value={config.seo.meta_title || ''}
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
                value={config.seo.meta_description || ''}
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
                value={config.seo.canonical_url || ''}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { ...config.seo, canonical_url: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Palabras Clave (Separadas por comas)</label>
              <input
                type="text"
                value={Array.isArray(config.seo.keywords) ? config.seo.keywords.join(', ') : ''}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { 
                    ...config.seo, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) 
                  }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACTO & CANALES */}
      {activeTab === 'contact' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Canales de Atención, Soporte y Contacto Oficial
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Email Oficial de Soporte</label>
              <input
                type="email"
                value={config.contact?.email || ''}
                onChange={(e) => setConfig({
                  ...config,
                  contact: { ...config.contact, email: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">WhatsApp de Soporte</label>
              <input
                type="text"
                value={config.contact?.whatsapp || ''}
                onChange={(e) => setConfig({
                  ...config,
                  contact: { ...config.contact, whatsapp: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">URL del Centro de Ayuda / Soporte</label>
              <input
                type="text"
                value={config.contact?.support_url || ''}
                onChange={(e) => setConfig({
                  ...config,
                  contact: { ...config.contact, support_url: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Canal de Telegram (Opcional)</label>
              <input
                type="text"
                placeholder="https://t.me/atpdev"
                value={config.contact?.telegram_channel_url || ''}
                onChange={(e) => setConfig({
                  ...config,
                  contact: { ...config.contact, telegram_channel_url: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Canal de WhatsApp (Opcional)</label>
              <input
                type="text"
                placeholder="https://whatsapp.com/channel/..."
                value={config.contact?.whatsapp_channel_url || ''}
                onChange={(e) => setConfig({
                  ...config,
                  contact: { ...config.contact, whatsapp_channel_url: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THEME STUDIO UNIFICADO NIVEL DIOS */}
      {activeTab === 'theme' && (
        <UnifiedThemeStudio
          subdomain="descargador"
          subdomainTitle="Descargador Pro"
          port="3007"
          localUrl="http://localhost:3007"
          theme={config.theme}
          presets={ACCENT_PRESETS}
          onSaveTheme={async (newTheme: SubdomainTheme) => {
            const updated = { ...config, theme: newTheme };
            setConfig(updated);
            const res = await saveDescargadorConfigAction({ theme: newTheme });
            if (res.success) {
              setConfig(res.config);
              return true;
            }
            return false;
          }}
          saving={saving}
        />
      )}
    </div>
  );
}
