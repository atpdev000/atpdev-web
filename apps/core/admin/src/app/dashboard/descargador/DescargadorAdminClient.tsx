"use client";

import { useState } from "react";
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
  Radio
} from "lucide-react";
import { SubdomainConfig } from "@atpdev/database";
import { saveDescargadorConfigAction, checkRailwayBackendHealthAction } from "./actions";

interface Props {
  initialConfig: SubdomainConfig;
}

export default function DescargadorAdminClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<SubdomainConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'modules' | 'branding' | 'theme' | 'backend'>('modules');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

      {/* TAB 4: THEME */}
      {activeTab === 'theme' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-400" />
            Personalización de Color y Estilos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Color Primario (Hex)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.theme.accent_color}
                  onChange={(e) => setConfig({
                    ...config,
                    theme: { ...config.theme, accent_color: e.target.value, primary_color: e.target.value }
                  })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={config.theme.accent_color}
                  onChange={(e) => setConfig({
                    ...config,
                    theme: { ...config.theme, accent_color: e.target.value, primary_color: e.target.value }
                  })}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Modo de Tema</label>
              <select
                value={config.theme.theme_mode}
                onChange={(e) => setConfig({
                  ...config,
                  theme: { ...config.theme, theme_mode: e.target.value as any }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 outline-none"
              >
                <option value="dark">Oscuro (Dark Mode)</option>
                <option value="light">Claro (Light Mode)</option>
                <option value="system">Adaptativo al Sistema</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
