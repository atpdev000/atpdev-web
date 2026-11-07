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
  Megaphone,
  Upload,
  FileUp,
  DollarSign,
  DownloadCloud
} from "lucide-react";
import { SubdomainConfig, SubdomainTheme, ACCENT_COLOR_MAP } from "@atpdev/database";
import { 
  saveDescargadorConfigAction, 
  checkRailwayBackendHealthAction,
  checkBackendHealthAction,
  syncBuiltApkAction,
  uploadApkFileAction
} from "./actions";
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
  const [activeTab, setActiveTab] = useState<'modules' | 'monetization' | 'apk' | 'branding' | 'seo' | 'contact' | 'backend' | 'theme'>('modules');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // APK Management State
  const [syncingApk, setSyncingApk] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);
  const [apkNotice, setApkNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSyncBuiltApk = async () => {
    setSyncingApk(true);
    setApkNotice(null);
    try {
      const res = await syncBuiltApkAction();
      setApkNotice({ text: res.message, ok: res.success });
      if (res.success && res.fileSize) {
        setConfig(prev => ({
          ...prev,
          apk: {
            ...(prev.apk || {}),
            enabled: true,
            file_url: '/downloads/FTYdownloaderPro.apk',
            file_size: res.fileSize
          }
        }));
      }
    } catch (err: any) {
      setApkNotice({ text: err.message || 'Error al sincronizar APK', ok: false });
    } finally {
      setSyncingApk(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingApk(true);
    setApkNotice(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadApkFileAction(fd);
      setApkNotice({ text: res.message, ok: res.success });
      if (res.success && res.fileSize) {
        setConfig(prev => ({
          ...prev,
          apk: {
            ...(prev.apk || {}),
            enabled: true,
            file_url: '/downloads/FTYdownloaderPro.apk',
            file_size: res.fileSize
          }
        }));
      }
    } catch (err: any) {
      setApkNotice({ text: err.message || 'Error al subir archivo APK', ok: false });
    } finally {
      setUploadingApk(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
    targetUrl?: string;
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

  const handleCheckHealth = async (targetUrl?: string) => {
    setCheckingHealth(true);
    const backendConfig = config.backend || {};
    const urlToTest = targetUrl || backendConfig.active_url || backendConfig.render_url || 'https://snapnosh-backend.onrender.com';
    try {
      const res = await checkBackendHealthAction(urlToTest, 10000);
      setHealthResult({
        tested: true,
        online: res.online,
        statusText: res.statusText,
        latencyMs: res.latencyMs,
        targetUrl: res.targetUrl || urlToTest,
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
          Módulos
        </button>

        <button
          onClick={() => setActiveTab('monetization')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
            activeTab === 'monetization'
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Publicidad & AdSense
        </button>

        <button
          onClick={() => setActiveTab('apk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
            activeTab === 'apk'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          App Android (APK)
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
          onClick={() => setActiveTab('backend')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
            activeTab === 'backend'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4" />
          Motor Backend (Render / Railway)
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
        </div>
      )}

      {/* TAB: PUBLICIDAD & ADSENSE */}
      {activeTab === 'monetization' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Configuración de Monetización, Google AdSense & AdMob
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Controla los IDs de anunciantes, bloques de anuncios y códigos de verificación sin tocar el código fuente.
              </p>
            </div>

            <a
              href="https://adsense.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              Consola AdSense
            </a>
          </div>

          {/* Tarjeta Google AdSense Web */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google AdSense (Web)</h3>
                  <p className="text-xs text-slate-400">Anuncios automáticos y unidades de display en la versión web</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleModule('adsense_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.adsense_enabled ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.adsense_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">ID de Editor AdSense (Client ID)</label>
                <input
                  type="text"
                  placeholder="ca-pub-5414009811868137"
                  value={config.monetization?.adsense_client_id || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    monetization: { ...config.monetization, adsense_client_id: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Código de Verificación Ezoic</label>
                <input
                  type="text"
                  placeholder="wStjwIfmHCWL7mcvHPkYWJi6FeTviZ"
                  value={config.monetization?.ezoic_verification_code || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    monetization: { ...config.monetization, ezoic_verification_code: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tarjeta Google AdMob (App Android) */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google AdMob (App Android / APK)</h3>
                  <p className="text-xs text-slate-400">Publicidad nativa para la aplicación móvil instalada en teléfonos</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleModule('admob_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.modules.admob_enabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.modules.admob_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">ID de Aplicación AdMob (App ID)</label>
                <input
                  type="text"
                  placeholder="ca-app-pub-5414009811868137~8923412091"
                  value={config.monetization?.admob_app_id || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    monetization: { ...config.monetization, admob_app_id: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">ID de Banner Inferior</label>
                <input
                  type="text"
                  placeholder="ca-app-pub-5414009811868137/1029384756"
                  value={config.monetization?.admob_banner_id || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    monetization: { ...config.monetization, admob_banner_id: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">ID de Interstitial (Descargas)</label>
                <input
                  type="text"
                  placeholder="ca-app-pub-5414009811868137/5647382910"
                  value={config.monetization?.admob_interstitial_id || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    monetization: { ...config.monetization, admob_interstitial_id: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Archivo app-ads.txt Info */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Archivo <strong>app-ads.txt</strong> activo y verificado en <code className="text-slate-300">/app-ads.txt</code></span>
            </div>
            <a
              href="https://descargador.atpdev.dev/app-ads.txt"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              Ver Archivo
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* TAB: APP ANDROID & GESTIÓN APK */}
      {activeTab === 'apk' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                Gestión y Distribución del APK Android
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Controla la versión pública, el archivo instalable y la subida directa de nuevos builds para tus usuarios.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Botón de descarga en la web:</span>
              <button
                type="button"
                onClick={() => setConfig({
                  ...config,
                  apk: { ...(config.apk || {}), enabled: !config.apk?.enabled }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.apk?.enabled !== false ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.apk?.enabled !== false ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Notificación de resultado APK */}
          {apkNotice && (
            <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
              apkNotice.ok
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {apkNotice.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
              <span>{apkNotice.text}</span>
            </div>
          )}

          {/* Tarjeta de Estado del APK Actual */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <DownloadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    FTYdownloaderPro.apk
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {config.apk?.version || 'v1.2.0'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tamaño actual: <strong className="text-white">{config.apk?.file_size || '10.8 MB'}</strong> • Ruta pública: <code className="text-indigo-400">/downloads/FTYdownloaderPro.apk</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={config.apk?.file_url || '/downloads/FTYdownloaderPro.apk'}
                  download
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar APK
                </a>
              </div>
            </div>

            {/* Acciones de actualización del archivo APK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              {/* Acción 1: Sincronizar build local */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                    Sincronizar Build de Android
                  </span>
                  <span className="text-[10px] text-slate-400">Automático</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Copia el archivo compilado más reciente (<code className="text-slate-300">app-debug.apk</code>) a la carpeta pública de descargas.
                </p>
                <button
                  type="button"
                  onClick={handleSyncBuiltApk}
                  disabled={syncingApk}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition disabled:opacity-50"
                >
                  {syncingApk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  {syncingApk ? 'Sincronizando...' : 'Sincronizar Último Build'}
                </button>
              </div>

              {/* Acción 2: Subir archivo manual */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    Subir APK Manualmente
                  </span>
                  <span className="text-[10px] text-slate-400">.apk</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sube directamente un archivo APK firmado o compilado desde tu computadora al servidor.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".apk"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingApk}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  {uploadingApk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
                  {uploadingApk ? 'Subiendo APK...' : 'Seleccionar y Subir APK'}
                </button>
              </div>
            </div>
          </div>

          {/* Metadatos y Versión del APK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Versión Pública</label>
              <input
                type="text"
                placeholder="v1.2.0"
                value={config.apk?.version || ''}
                onChange={(e) => setConfig({
                  ...config,
                  apk: { ...(config.apk || {}), version: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">URL del Enlace a Google Play Store (Opcional)</label>
              <input
                type="text"
                placeholder="https://play.google.com/store/apps/details?id=com.ftydownloader.pro"
                value={config.apk?.playstore_url || ''}
                onChange={(e) => setConfig({
                  ...config,
                  apk: { ...(config.apk || {}), playstore_url: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">Notas de la Versión / Novedades</label>
              <textarea
                rows={3}
                placeholder="Ej: Nueva versión con reproductor integrado estilo WhatsApp, descargas en 4K y solución de guardado."
                value={config.apk?.release_notes || ''}
                onChange={(e) => setConfig({
                  ...config,
                  apk: { ...(config.apk || {}), release_notes: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BACKEND RENDER & RAILWAY */}
      {activeTab === 'backend' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          {/* Encabezado del Tab */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Motor Backend Python (Render & Railway)
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      (config.backend?.provider || 'render') === 'render'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : (config.backend?.provider === 'railway')
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {(config.backend?.provider || 'render') === 'render' ? '🟣 Render Activo' : (config.backend?.provider === 'railway' ? '🚂 Railway Activo' : '🖥️ VPS Custom')}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configuración centralizada del motor FastAPI + yt-dlp. Alterna dinámicamente entre Render y Railway sin tocar código.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

          {/* 1. Selector de Proveedor Activo */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Selecciona el Proveedor Backend Activo</span>
              <span className="text-[10px] text-slate-500 font-normal lowercase">(las descargas del sitio usarán este motor)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opción 1: Render */}
              <div
                onClick={() => {
                  const renderUrl = config.backend?.render_url || 'https://snapnosh-backend.onrender.com';
                  setConfig({
                    ...config,
                    backend: {
                      ...(config.backend || {}),
                      provider: 'render',
                      active_url: renderUrl
                    }
                  });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  (config.backend?.provider || 'render') === 'render'
                    ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                      🟣
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Render Cloud</h3>
                      <span className="text-[10px] text-emerald-400 font-semibold">Motor en Producción</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="backend_provider"
                    checked={(config.backend?.provider || 'render') === 'render'}
                    onChange={() => {}}
                    className="accent-purple-500 mt-1 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Servicio Docker desplegado en Render (FastAPI + yt-dlp + Deno). Procesa streams y descargas de alta resolución.
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-purple-300 truncate max-w-[200px]">
                    {config.backend?.render_url || 'https://snapnosh-backend.onrender.com'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckHealth(config.backend?.render_url || 'https://snapnosh-backend.onrender.com');
                    }}
                    className="text-purple-400 hover:underline font-semibold"
                  >
                    Ping
                  </button>
                </div>
              </div>

              {/* Opción 2: Railway */}
              <div
                onClick={() => {
                  const railwayUrl = config.backend?.railway_url || 'https://backend-freedownloaderpro.up.railway.app';
                  setConfig({
                    ...config,
                    backend: {
                      ...(config.backend || {}),
                      provider: 'railway',
                      active_url: railwayUrl
                    }
                  });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  config.backend?.provider === 'railway'
                    ? 'bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                      🚂
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Railway App</h3>
                      <span className="text-[10px] text-blue-400 font-semibold">Servidor Secundario</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="backend_provider"
                    checked={config.backend?.provider === 'railway'}
                    onChange={() => {}}
                    className="accent-blue-500 mt-1 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Servicio en Railway. Se puede usar como motor principal o como réplica de respaldo automático si Render duerme.
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-blue-300 truncate max-w-[200px]">
                    {config.backend?.railway_url || 'https://backend-freedownloaderpro.up.railway.app'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckHealth(config.backend?.railway_url || 'https://backend-freedownloaderpro.up.railway.app');
                    }}
                    className="text-blue-400 hover:underline font-semibold"
                  >
                    Ping
                  </button>
                </div>
              </div>

              {/* Opción 3: Servidor VPS Propio */}
              <div
                onClick={() => {
                  const customUrl = config.backend?.custom_url || '';
                  setConfig({
                    ...config,
                    backend: {
                      ...(config.backend || {}),
                      provider: 'custom',
                      active_url: customUrl
                    }
                  });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  config.backend?.provider === 'custom'
                    ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                      🖥️
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">VPS / Custom</h3>
                      <span className="text-[10px] text-amber-400 font-semibold">Servidor Propio</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="backend_provider"
                    checked={config.backend?.provider === 'custom'}
                    onChange={() => {}}
                    className="accent-amber-500 mt-1 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Conexión a un VPS propio (DigitalOcean, Hetzner, AWS o servidor local) ejecutando la imagen Docker de FastAPI.
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-amber-300 truncate max-w-[200px]">
                    {config.backend?.custom_url || 'Sin URL asignada'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (config.backend?.custom_url) handleCheckHealth(config.backend.custom_url);
                      else alert('Por favor ingresa primero la URL del servidor VPS.');
                    }}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Ping
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Edición de URLs y Parámetros de Red */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              Parámetros de Conexión & URLs de los Servicios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* URL Render */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">URL del Backend Render</label>
                  <button
                    type="button"
                    onClick={() => {
                      const defUrl = 'https://snapnosh-backend.onrender.com';
                      setConfig(prev => ({
                        ...prev,
                        backend: {
                          ...(prev.backend || {}),
                          render_url: defUrl,
                          active_url: (prev.backend?.provider || 'render') === 'render' ? defUrl : prev.backend?.active_url
                        }
                      }));
                    }}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    Restablecer por defecto
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.backend?.render_url || 'https://snapnosh-backend.onrender.com'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig(prev => ({
                        ...prev,
                        backend: {
                          ...(prev.backend || {}),
                          render_url: val,
                          active_url: (prev.backend?.provider || 'render') === 'render' ? val : prev.backend?.active_url
                        }
                      }));
                    }}
                    placeholder="https://snapnosh-backend.onrender.com"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-purple-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCheckHealth(config.backend?.render_url || 'https://snapnosh-backend.onrender.com')}
                    disabled={checkingHealth}
                    className="px-3 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* URL Railway */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">URL del Backend Railway</label>
                  <button
                    type="button"
                    onClick={() => {
                      const defUrl = 'https://backend-freedownloaderpro.up.railway.app';
                      setConfig(prev => ({
                        ...prev,
                        backend: {
                          ...(prev.backend || {}),
                          railway_url: defUrl,
                          active_url: prev.backend?.provider === 'railway' ? defUrl : prev.backend?.active_url
                        }
                      }));
                    }}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Restablecer por defecto
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.backend?.railway_url || 'https://backend-freedownloaderpro.up.railway.app'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig(prev => ({
                        ...prev,
                        backend: {
                          ...(prev.backend || {}),
                          railway_url: val,
                          active_url: prev.backend?.provider === 'railway' ? val : prev.backend?.active_url
                        }
                      }));
                    }}
                    placeholder="https://backend-freedownloaderpro.up.railway.app"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCheckHealth(config.backend?.railway_url || 'https://backend-freedownloaderpro.up.railway.app')}
                    disabled={checkingHealth}
                    className="px-3 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* URL VPS Custom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">URL de Servidor VPS Propio / Custom</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.backend?.custom_url || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig(prev => ({
                        ...prev,
                        backend: {
                          ...(prev.backend || {}),
                          custom_url: val,
                          active_url: prev.backend?.provider === 'custom' ? val : prev.backend?.active_url
                        }
                      }));
                    }}
                    placeholder="http://123.45.67.89:8000 o https://api.midominio.com"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (config.backend?.custom_url) handleCheckHealth(config.backend.custom_url);
                      else alert('Por favor escribe la URL de tu VPS antes de probar.');
                    }}
                    disabled={checkingHealth}
                    className="px-3 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Timeout en segundos */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tiempo de Espera Máximo (Timeout)</label>
                <select
                  value={config.backend?.timeout_seconds || 30}
                  onChange={(e) => {
                    const secs = parseInt(e.target.value, 10);
                    setConfig(prev => ({
                      ...prev,
                      backend: {
                        ...(prev.backend || {}),
                        timeout_seconds: secs
                      }
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value={15}>15 segundos (Red ultra rápida)</option>
                  <option value={30}>30 segundos (Recomendado para Render)</option>
                  <option value={60}>60 segundos (Videos 4K pesados o cold-start)</option>
                </select>
              </div>
            </div>

            {/* Fallback Automático Toggle */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Fallback Automático de Alta Disponibilidad
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Si Render está en modo suspensión o Railway experimenta fallas, conmuta automáticamente entre proveedores para que el usuario nunca vea error.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfig(prev => ({
                    ...prev,
                    backend: {
                      ...(prev.backend || {}),
                      auto_fallback_enabled: prev.backend?.auto_fallback_enabled === false ? true : false
                    }
                  }));
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.backend?.auto_fallback_enabled !== false ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.backend?.auto_fallback_enabled !== false ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* 3. Tarjeta de Diagnóstico y Monitoreo en Vivo */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Diagnóstico de Salud en Tiempo Real
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Realiza un ping HTTP real al servicio FastAPI y verifica el estado de yt-dlp y los endpoints disponibles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCheckHealth(config.backend?.render_url || 'https://snapnosh-backend.onrender.com')}
                  disabled={checkingHealth}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition disabled:opacity-50"
                >
                  Probar Render
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckHealth(config.backend?.railway_url || 'https://backend-freedownloaderpro.up.railway.app')}
                  disabled={checkingHealth}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold transition disabled:opacity-50"
                >
                  Probar Railway
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckHealth()}
                  disabled={checkingHealth}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin text-blue-400' : ''}`} />
                  Probar Activo
                </button>
              </div>
            </div>

            {healthResult.tested ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3">
                    {healthResult.online ? (
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/50" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                    )}
                    <div>
                      <span className="text-xs font-mono text-slate-300 font-bold block">
                        {healthResult.targetUrl || config.backend?.active_url || 'https://snapnosh-backend.onrender.com'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {healthResult.statusText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      healthResult.online
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {healthResult.online ? `OPERACIONAL • ${healthResult.latencyMs}ms` : 'SIN RESPUESTA'}
                    </span>
                  </div>
                </div>

                {healthResult.details && typeof healthResult.details === 'object' && (
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>API: <strong className="text-white">{healthResult.details.name || 'FastAPI Backend'}</strong></span>
                      <span>Versión: <code className="text-blue-400">{healthResult.details.version || 'v2.0'}</code></span>
                      <span>Estado: <span className="text-emerald-400 uppercase font-bold">{healthResult.details.status || 'OK'}</span></span>
                    </div>
                    {healthResult.details.endpoints && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-400 block mb-1">Rutas y Extractor yt-dlp Detectados:</span>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                          {Object.entries(healthResult.details.endpoints).map(([key, val]: any) => (
                            <span key={key} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                              {key}: {typeof val === 'string' ? val : JSON.stringify(val)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                Haz clic en <strong>Probar Render</strong>, <strong>Probar Railway</strong> o <strong>Probar Activo</strong> para verificar la conectividad y latencia en vivo.
              </div>
            )}
          </div>

          {/* Nota de Arquitectura Híbrida */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong>Arquitectura Híbrida Inteligente:</strong> El frontend en Next.js resuelve de forma nativa enlaces públicos ligeros (TikTok, Facebook y YouTube básico), mientras que las peticiones complejas (como combinación de pistas de audio y video 1080p sin pérdida o streams protegidos) se delegan al motor FastAPI en Render o Railway con cookies de sesión activas.
            </div>
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
