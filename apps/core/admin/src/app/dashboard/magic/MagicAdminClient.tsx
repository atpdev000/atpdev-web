"use client";

import { useState } from "react";
import { 
  Sparkles, 
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
  Heart, 
  Music, 
  Share2, 
  Camera, 
  Download, 
  Link as LinkIcon, 
  Check, 
  Wand2, 
  Smartphone, 
  Tv, 
  DollarSign, 
  FileText, 
  Search, 
  ShieldCheck, 
  Activity,
  Layers3,
  Sun,
  Moon
} from "lucide-react";
import { SubdomainConfig, SubdomainTheme } from "@atpdev/database";
import { saveMagicConfigAction, checkMagicBackendHealthAction } from "./actions";
import UnifiedThemeStudio from "@/components/theme/UnifiedThemeStudio";

interface Props {
  initialConfig: SubdomainConfig;
}

const ACCENT_PRESETS = [
  { name: 'Rosa Mágico (Oficial)', hex: '#ec4899' },
  { name: 'Violeta Neón', hex: '#8b5cf6' },
  { name: 'Cyan Eléctrico', hex: '#06b6d4' },
  { name: 'Fucsia Mágico', hex: '#d946ef' },
  { name: 'Ámbar / Dorado', hex: '#f59e0b' },
  { name: 'Verde Esmeralda', hex: '#10b981' }
];

export default function MagicAdminClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<SubdomainConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'modules' | 'branding' | 'theme' | 'backend'>('modules');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'dark' | 'light'>(
    (initialConfig.theme?.theme_mode === 'light' ? 'light' : 'dark')
  );

  // Backend Health state
  const [backendUrl, setBackendUrl] = useState("https://s.ftydownloader.com");
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<{
    tested: boolean;
    online: boolean;
    statusText: string;
    latencyMs: number;
    details?: any;
  } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await saveMagicConfigAction(config);
      if (res.success) {
        setConfig(res.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving magic config:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestHealth = async () => {
    setCheckingHealth(true);
    try {
      const result = await checkMagicBackendHealthAction(backendUrl);
      setHealthResult({
        tested: true,
        online: result.online,
        statusText: result.statusText,
        latencyMs: result.latencyMs,
        details: result.details
      });
    } catch (err: any) {
      setHealthResult({
        tested: true,
        online: false,
        statusText: err?.message || 'Error de verificación',
        latencyMs: 0
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  const updateModule = (key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [key]: value
      }
    }));
  };

  const updateBranding = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [key]: value
      }
    }));
  };

  const updateTheme = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value
      }
    }));
  };

  const updateSEO = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-950/60 via-purple-950/40 to-slate-900 border border-pink-500/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CMS Subdominio • Puerto {config.devPort || 3008}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{config.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                LIVE
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl">
              Panel central de administración para tarjetas interactivas, generador de mensajes mágicos, acortador Upstash Redis y monetización integrada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="https://magic.atpdev.dev" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700/60 transition shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-pink-400" />
              <span>Abrir Web Oficial</span>
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-pink-500/20 transition disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Guardando..." : saveSuccess ? "¡Guardado!" : "Guardar Cambios"}</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === 'modules'
              ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Módulos & Plantillas</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === 'theme'
              ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Theme Studio Neón</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === 'branding'
              ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Branding & Textos</span>
        </button>

        <button
          onClick={() => setActiveTab('backend')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === 'backend'
              ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Acortador Redis & Health</span>
        </button>
      </div>

      {/* Tab 1: Módulos & Plantillas */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Funciones de Plantillas */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Generador y Plantillas</h3>
                <p className="text-xs text-slate-400">Control de herramientas interactivas habilitadas</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'templates_enabled', label: 'Catálogo de Plantillas (+30 plantillas)', desc: 'Galaxia de amor, Ruleta, Carta Encantada, Rompecabezas', icon: <Heart className="w-4 h-4 text-pink-400" /> },
                { id: 'audio_upload_enabled', label: 'Música & Audio Dedicado', desc: 'Permite adjuntar audio o enlaces de música en las tarjetas', icon: <Music className="w-4 h-4 text-purple-400" /> },
                { id: 'custom_photos_enabled', label: 'Fotos y Collage Interactivo', desc: 'Permite subir fotos de pareja, recuerdos y amigos', icon: <Camera className="w-4 h-4 text-cyan-400" /> },
                { id: 'whatsapp_share_enabled', label: 'Compartir Directo en WhatsApp', desc: 'Genera el mensaje interactivo formateado con emojis', icon: <Share2 className="w-4 h-4 text-emerald-400" /> },
                { id: 'html_download_enabled', label: 'Descarga de Archivo HTML', desc: 'Permite descargar la tarjeta interactiva como archivo local', icon: <Download className="w-4 h-4 text-blue-400" /> },
                { id: 'url_shortener_enabled', label: 'Acortador de Enlaces Upstash Redis', desc: 'Genera links cortos limpios (ej: s.ftydownloader.com/XYZ)', icon: <LinkIcon className="w-4 h-4 text-amber-400" /> },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={Boolean(config.modules?.[item.id] ?? true)}
                      onChange={(e) => updateModule(item.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Monetización y Anuncios */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Monetización y Redes de Anuncios</h3>
                <p className="text-xs text-slate-400">Activa o pausa redes publicitarias en Web y App</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'admob_enabled', label: 'Google AdMob (Android App)', desc: 'Banners, Interstitial y Rewarded Ads en APK móvil', icon: <Smartphone className="w-4 h-4 text-emerald-400" /> },
                { id: 'adsense_enabled', label: 'Google AdSense (Web)', desc: 'Banners inteligentes en la versión web de escritorio y móvil', icon: <Globe className="w-4 h-4 text-blue-400" /> },
                { id: 'adsterra_enabled', label: 'Adsterra Native & Banner 728x90', desc: 'Anuncios nativos de alta conversión en plantillas', icon: <Tv className="w-4 h-4 text-amber-400" /> },
                { id: 'ezoic_enabled', label: 'Ezoic Smart Ads', desc: 'Optimización automatizada de ubicaciones de anuncios', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={Boolean(config.modules?.[item.id] ?? true)}
                      onChange={(e) => updateModule(item.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Theme Studio Neón Unificado Nivel Dios */}
      {activeTab === 'theme' && (
        <UnifiedThemeStudio
          subdomain="magic"
          subdomainTitle="Interactivo Magic"
          port="3008"
          localUrl="http://localhost:3008"
          productionUrl="https://magic.atpdev.dev"
          theme={config.theme}
          presets={ACCENT_PRESETS}
          onSaveTheme={async (newTheme: SubdomainTheme) => {
            const updated = { ...config, theme: newTheme };
            setConfig(updated);
            const res = await saveMagicConfigAction(updated);
            return res.success;
          }}
          saving={saving}
        />
      )}

      {/* Tab 3: Branding & Textos */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-400" />
              <span>Textos de Portada y Hero Section</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Título del Sitio
                </label>
                <input
                  type="text"
                  value={config.branding?.site_title || ''}
                  onChange={(e) => updateBranding('site_title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Lema / Tagline
                </label>
                <input
                  type="text"
                  value={config.branding?.site_tagline || ''}
                  onChange={(e) => updateBranding('site_tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Hero Badge Superior
                </label>
                <input
                  type="text"
                  value={config.branding?.hero_badge || ''}
                  onChange={(e) => updateBranding('hero_badge', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Texto Destacado del Título
                </label>
                <input
                  type="text"
                  value={config.branding?.hero_title_highlight || ''}
                  onChange={(e) => updateBranding('hero_title_highlight', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Descripción Principal (Hero Description)
              </label>
              <textarea
                rows={3}
                value={config.branding?.hero_description || ''}
                onChange={(e) => updateBranding('hero_description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Barra de Anuncios Superior (Announcement Bar)
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={Boolean(config.branding?.announcement_enabled)}
                    onChange={(e) => updateBranding('announcement_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>
              <input
                type="text"
                value={config.branding?.announcement_text || ''}
                onChange={(e) => updateBranding('announcement_text', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm"
                placeholder="🪄 Nuevo: Más de 30 plantillas listas para WhatsApp..."
              />
            </div>
          </div>

          {/* SEO Meta */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              <span>Optimización SEO y Posicionamiento Google</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={config.seo?.meta_title || ''}
                  onChange={(e) => updateSEO('meta_title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  URL Canónica
                </label>
                <input
                  type="text"
                  value={config.seo?.canonical_url || ''}
                  onChange={(e) => updateSEO('canonical_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={config.seo?.meta_description || ''}
                onChange={(e) => updateSEO('meta_description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Backend & Redis Acortador */}
      {activeTab === 'backend' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Servicio Acortador Upstash Redis</h3>
                  <p className="text-xs text-slate-400">Monitoreo de latencia y estado de redirección</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 font-mono">
                Upstash Redis Serverless
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Endpoint del Acortador
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white font-mono text-sm"
                  placeholder="https://s.ftydownloader.com"
                />
                <button
                  onClick={handleTestHealth}
                  disabled={checkingHealth}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-pink-400 ${checkingHealth ? 'animate-spin' : ''}`} />
                  <span>{checkingHealth ? 'Probando...' : 'Verificar Salud'}</span>
                </button>
              </div>
            </div>

            {/* Health Result */}
            {healthResult && healthResult.tested && (
              <div className={`p-4 rounded-xl border ${healthResult.online ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-red-950/30 border-red-500/30 text-red-300'} space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {healthResult.online ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <span>{healthResult.online ? 'Servidor Conectado y Operativo' : 'Servidor Inaccesible o con Error'}</span>
                  </div>
                  {healthResult.latencyMs > 0 && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700">
                      {healthResult.latencyMs} ms
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-300">
                  Respuesta: <code className="font-mono text-white">{healthResult.statusText}</code>
                </div>
                {healthResult.details && (
                  <pre className="p-3 rounded-lg bg-black/40 text-[11px] font-mono text-slate-300 overflow-x-auto">
                    {JSON.stringify(healthResult.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
