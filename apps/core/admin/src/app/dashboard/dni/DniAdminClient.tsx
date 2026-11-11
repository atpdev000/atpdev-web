"use client";

import { useState } from "react";
import { 
  FileText, 
  Settings, 
  Layers, 
  Palette, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  Camera, 
  Download, 
  Wand2, 
  Cpu, 
  ScanLine,
  ScanText,
  Sliders,
  Maximize2,
  Share2
} from "lucide-react";
import { SubdomainConfig } from "@atpdev/database";
import { saveDniConfigAction } from "./actions";

interface Props {
  initialConfig: SubdomainConfig;
}

const ACCENT_PRESETS = [
  { name: 'Azul Eléctrico (Oficial)', hex: '#0284c7' },
  { name: 'Sky Cyan', hex: '#38bdf8' },
  { name: 'Verde Esmeralda', hex: '#10b981' },
  { name: 'Violeta Neón', hex: '#8b5cf6' },
  { name: 'Rosa Vibrante', hex: '#ec4899' },
  { name: 'Ámbar Dorado', hex: '#f59e0b' }
];

export default function DniAdminClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<SubdomainConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'modules' | 'branding' | 'theme' | 'seo'>('modules');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await saveDniConfigAction(config);
      if (res.success) {
        setConfig(res.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving DNI config:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateModule = (key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      modules: {
        ...(prev.modules || {}),
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
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 font-mono bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-full">
                Port 3012 • Subdomain: dni
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Subdomain
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              DNI Master Scanner Pro • Administración & CMS
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Control del motor de homografía cuadrilátera, modelos neuronales runonweb (BEN2 + OCR), exportación PDF A4 y branding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3012"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 border border-slate-700"
          >
            <span>Ver Local (3012)</span>
            <ExternalLink size={14} />
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={20} />
          <span className="text-sm font-bold">¡Configuración del subdominio DNI guardada correctamente!</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'modules' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Cpu size={16} /> Módulos & Motores de IA
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'branding' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Layers size={16} /> Branding & Textos
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'theme' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Palette size={16} /> Personalización & Tema
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'seo' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Globe size={16} /> SEO & Metadatos
        </button>
      </div>

      {/* TAB: MÓDULOS & MOTORES */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Motores de Eliminación de Fondo */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ScanLine size={18} className="text-sky-400" />
              Motores de Visión Computacional & Recorte
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Activa o desactiva los algoritmos disponibles para los usuarios en la web y app móvil.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-white">Homografía Geométrica 4-Puntos</span>
                  <span className="text-xs text-slate-400">Recorte cuadrilátero exacto con eliminación 100% de mesa (0MB, 20ms)</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.homography_enabled !== false}
                  onChange={(e) => updateModule('homography_enabled', e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-800/50 border border-purple-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-purple-300 flex items-center gap-1.5">
                    <Sparkles size={14} /> IA Local BEN2 (runonweb)
                  </span>
                  <span className="text-xs text-slate-400">Modelo neuronal de Midudev para siluetas complejas en WebGPU</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.runonweb_ben2_enabled !== false}
                  onChange={(e) => updateModule('runonweb_ben2_enabled', e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-800/50 border border-blue-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-blue-300 flex items-center gap-1.5">
                    <ScanText size={14} /> OCR Local PP-OCRv6 (runonweb)
                  </span>
                  <span className="text-xs text-slate-400">Extracción automática del número de DNI de 8 dígitos en navegador</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.runonweb_ocr_enabled !== false}
                  onChange={(e) => updateModule('runonweb_ocr_enabled', e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-white">Filtros de Escáner (Realce Mágico)</span>
                  <span className="text-xs text-slate-400">Eliminación de sombras de luz, blanqueo y binarizado</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.filters_enabled !== false}
                  onChange={(e) => updateModule('filters_enabled', e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card: Exportación y Formatos */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download size={18} className="text-emerald-400" />
              Formatos de Exportación & Descargas
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configura los formatos oficiales disponibles para el usuario final.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-white">Exportación PDF A4 Escala 1:1</span>
                  <span className="text-xs text-slate-400">Genera hoja A4 lista para trámites oficiales con anverso y reverso</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.pdf_export_enabled !== false}
                  onChange={(e) => updateModule('pdf_export_enabled', e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-white">Exportación Word (.docx)</span>
                  <span className="text-xs text-slate-400">Permite descargar un documento Word editable con ambas caras</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.word_export_enabled !== false}
                  onChange={(e) => updateModule('word_export_enabled', e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-white">Descarga de Imágenes PNG Transparentes</span>
                  <span className="text-xs text-slate-400">Descarga individual por cara con esquinas redondeadas limpias</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.png_download_enabled !== false}
                  onChange={(e) => updateModule('png_download_enabled', e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block text-white">Menú Compartir Nativo (Android / iOS)</span>
                  <span className="text-xs text-slate-400">Usa Capacitor Share para enviar por WhatsApp, Gmail, etc.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.modules?.native_share_enabled !== false}
                  onChange={(e) => updateModule('native_share_enabled', e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BRANDING & TEXTOS */}
      {activeTab === 'branding' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg max-w-3xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers size={18} className="text-blue-400" />
            Textos Principales & Hero
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Título del Sitio
              </label>
              <input
                type="text"
                value={config.branding?.site_title || ''}
                onChange={(e) => updateBranding('site_title', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Subtítulo / Tagline
              </label>
              <input
                type="text"
                value={config.branding?.site_tagline || ''}
                onChange={(e) => updateBranding('site_tagline', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Prefijo del Título Hero
                </label>
                <input
                  type="text"
                  value={config.branding?.hero_title_prefix || ''}
                  onChange={(e) => updateBranding('hero_title_prefix', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Palabra Destacada Hero
                </label>
                <input
                  type="text"
                  value={config.branding?.hero_title_highlight || ''}
                  onChange={(e) => updateBranding('hero_title_highlight', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Descripción Hero
              </label>
              <textarea
                rows={3}
                value={config.branding?.hero_description || ''}
                onChange={(e) => updateBranding('hero_description', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Texto de Anuncio / Badge Superior
              </label>
              <input
                type="text"
                value={config.branding?.announcement_text || ''}
                onChange={(e) => updateBranding('announcement_text', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: TEMA & PERSONALIZACIÓN */}
      {activeTab === 'theme' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg max-w-3xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette size={18} className="text-sky-400" />
            Paleta de Color & Estilos
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Color de Acento Predefinido
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACCENT_PRESETS.map((p) => {
                const isSelected = config.theme?.accent_color?.toLowerCase() === p.hex.toLowerCase();
                return (
                  <button
                    key={p.hex}
                    onClick={() => updateTheme('accent_color', p.hex)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${isSelected ? 'border-white bg-white/10' : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'}`}
                  >
                    <div className="w-5 h-5 rounded-full shadow" style={{ backgroundColor: p.hex }} />
                    <span className="text-xs font-bold text-white">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Modo de Tema
            </label>
            <div className="flex gap-4">
              {['dark', 'light', 'system'].map((m) => (
                <button
                  key={m}
                  onClick={() => updateTheme('theme_mode', m)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${config.theme?.theme_mode === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SEO & METADATOS */}
      {activeTab === 'seo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg max-w-3xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe size={18} className="text-emerald-400" />
            Optimización para Buscadores (SEO)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Meta Título (Google)
              </label>
              <input
                type="text"
                value={config.seo?.meta_title || ''}
                onChange={(e) => updateSEO('meta_title', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Meta Descripción
              </label>
              <textarea
                rows={3}
                value={config.seo?.meta_description || ''}
                onChange={(e) => updateSEO('meta_description', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                URL Canónica
              </label>
              <input
                type="text"
                value={config.seo?.canonical_url || ''}
                onChange={(e) => updateSEO('canonical_url', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
