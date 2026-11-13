'use client';

import UnifiedThemeStudio from "@/components/theme/UnifiedThemeStudio";
import { OFFICIAL_APP_URLS, useResolvedPreviewUrl } from "@/lib/preview-url";
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  JobPosting,
  SubdomainConfig,
  SubdomainTheme,
  ACCENT_COLOR_MAP,
  DEFAULT_CHAMBA_CONFIG
} from '@atpdev/database';
import { 
  Briefcase, Search, Star, ExternalLink, RefreshCw, Plus, 
  Trash2, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign,
  Building2, MapPin, Sparkles, FileText, Check, LayoutGrid, Radio,
  Clock, Mail, Phone, CheckCircle, XCircle, Globe, Upload, Image as ImageIcon,
  Eye, Pencil, X, Link2, Palette, Settings2, SlidersHorizontal, Layers, CheckSquare,
  Laptop, Tablet, Smartphone, Sun, Moon, Monitor, Wand2, Square, Zap, Loader2, ChevronDown, Maximize2
} from 'lucide-react';
import { suggestThemeWithAI } from '../settings/actions';
import { 
  toggleJobFeaturedAction, 
  updateJobStatusAction, 
  deleteJobAction, 
  triggerLiveScraperAction,
  saveJobAction,
  approveJobRequestAction,
  fetchAdminJobsAction,
  updateJobLogoAction,
  updateChambaConfigAction,
  pingGoogleIndexingManualAction,
  resolveOfficialBasesAdminAction
} from './actions';

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

const REGIONES_PERU = [
  'Nacional / Remoto',
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali'
];

const CATEGORIAS_EMPLEO = [
  'Administración y Gestión Pública',
  'Tecnología e Informática',
  'Salud y Medicina',
  'Educación y Docencia',
  'Derecho y Asesoría Legal',
  'Contabilidad y Finanzas',
  'Ingeniería y Construcción',
  'Atención al Ciudadano y Operativo',
  'Logística y Contrataciones del Estado',
  'Seguridad y Vigilancia',
  'Servicios Generales y Mantenimiento',
  'Otro'
];

const REGIMENES = [
  'CAS 1057',
  'D.L. 728',
  'D.L. 276',
  'Locación / FAG',
  'Prácticas',
  'Privado'
];

const NIVELES_EDUCATIVOS = [
  'Secundaria',
  'Técnico',
  'Egresado',
  'Bachiller',
  'Titulado',
  'Maestría / Doctorado'
];

function extractLogoFromDomain(urlOrDomain: string): string | null {
  try {
    if (!urlOrDomain) return null;
    const clean = urlOrDomain.trim();
    const withProtocol = clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
    const parsed = new URL(withProtocol);
    const domain = parsed.hostname.replace(/^www\./, '');
    if (!domain || !domain.includes('.')) return null;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

interface ChambaAdminClientProps {
  initialJobs: JobPosting[];
  initialConfig?: SubdomainConfig;
}

export default function ChambaAdminClient({ initialJobs, initialConfig }: ChambaAdminClientProps) {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [siteConfig, setSiteConfig] = useState<SubdomainConfig>(initialConfig || DEFAULT_CHAMBA_CONFIG);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'pending' | 'create' | 'theme' | 'settings' | 'scraper' | 'ads'>('list');

  // Theme Studio State & Live Preview Sync
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'iframe' | 'components'>('iframe');
  const [iframeRefreshKey, setIframeRefreshKey] = useState(0);
  const { previewUrl: chambaLiveUrl } = useResolvedPreviewUrl(
    'http://localhost:3005',
    OFFICIAL_APP_URLS.chamba,
    true,
    iframeRefreshKey
  );

  // Full Theme Builder states for Chamba Pro (matching Main Portal ThemeBuilder)
  const initialTheme = siteConfig.theme || ({} as any);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(initialTheme.theme_mode === 'light' ? 'light' : 'dark');
  const [seedColor, setSeedColor] = useState(initialTheme.seed_color || initialTheme.accent_color || '#10b981');
  const [colorTheme, setColorTheme] = useState<string>(initialTheme.color_theme || 'vibrant');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiIncludeBackground, setAiIncludeBackground] = useState(false);

  const [primary, setPrimary] = useState(initialTheme.primary_color || initialTheme.accent_color || '#10b981');
  const [secondary, setSecondary] = useState(initialTheme.secondary_color || '#0f172a');
  const [tertiary, setTertiary] = useState(initialTheme.tertiary_color || '#1e293b');
  const [neutral, setNeutral] = useState(initialTheme.neutral_color || '#64748b');

  const [fontHeadline, setFontHeadline] = useState(initialTheme.font_headline || 'Space Grotesk');
  const [fontBody, setFontBody] = useState(initialTheme.font_body || 'Inter');
  const [fontLabel, setFontLabel] = useState(initialTheme.font_label || 'IBM Plex Mono');
  const [radiusScale, setRadiusScale] = useState(initialTheme.radius_scale || 'medium');
  const [mouseEffects, setMouseEffects] = useState<string[]>(() => {
    if (!initialTheme.glow_style) return ['spotlight-border'];
    const arr = initialTheme.glow_style.split(',').map((s: string) => s.trim()).filter(Boolean);
    return arr.map((s: string) => (s === 'spotlight' ? 'spotlight-border' : s));
  });
  const [neonThickness, setNeonThickness] = useState(initialTheme.neon_thickness || '4px');
  const [globalBackgroundImage, setGlobalBackgroundImage] = useState(initialTheme.global_background_image || '');
  const [showGradientBuilder, setShowGradientBuilder] = useState(false);
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null);

  // Auto regenerate palette when seedColor, colorTheme, or themeMode changes
  useEffect(() => {
    if (colorTheme !== "custom") {
      const palette = generatePalette(seedColor, colorTheme, themeMode);
      if (palette) {
        setPrimary(palette.primary);
        setSecondary(palette.secondary);
        setTertiary(palette.tertiary);
        setNeutral(palette.neutral);
      }
    }
  }, [seedColor, colorTheme, themeMode]);

  // Compute live current theme object
  const currentTheme: SubdomainTheme = useMemo(() => ({
    accent_color: primary,
    accent_name: ((Object.keys(ACCENT_COLOR_MAP) as SubdomainTheme['accent_name'][]).find(
      k => ACCENT_COLOR_MAP[k]?.hex.toLowerCase() === primary.toLowerCase()
    )) || 'custom',
    theme_mode: themeMode,
    radius_scale: radiusScale as any,
    radius_style: radiusScale === 'none' ? 'rounded-none' : radiusScale === 'small' ? 'rounded-xl' : radiusScale === 'medium' ? 'rounded-2xl' : 'rounded-3xl',
    seed_color: seedColor,
    color_theme: colorTheme,
    primary_color: primary,
    secondary_color: secondary,
    tertiary_color: tertiary,
    neutral_color: neutral,
    font_headline: fontHeadline,
    font_body: fontBody,
    font_label: fontLabel,
    glow_style: mouseEffects.join(','),
    neon_thickness: neonThickness as any,
    cursor_effect: mouseEffects.find(e => e.startsWith('cursor-')) || 'cursor-ia',
    global_background_image: globalBackgroundImage
  }), [primary, themeMode, radiusScale, seedColor, colorTheme, secondary, tertiary, neutral, fontHeadline, fontBody, fontLabel, mouseEffects, neonThickness, globalBackgroundImage]);

  const sendThemeToIframe = (themeToSend: SubdomainTheme) => {
    const payload = {
      accent_color: themeToSend.accent_color,
      primary: themeToSend.accent_color || themeToSend.primary_color,
      primary_color: themeToSend.primary_color || themeToSend.accent_color,
      secondary: themeToSend.secondary_color,
      secondary_color: themeToSend.secondary_color,
      tertiary: themeToSend.tertiary_color,
      tertiary_color: themeToSend.tertiary_color,
      neutral: themeToSend.neutral_color,
      neutral_color: themeToSend.neutral_color,
      accent_name: themeToSend.accent_name,
      theme_mode: themeToSend.theme_mode,
      mode: themeToSend.theme_mode,
      radius_style: themeToSend.radius_style,
      radius_scale: themeToSend.radius_scale,
      radiusScale: themeToSend.radius_scale,
      font_headline: themeToSend.font_headline,
      fontHeadline: themeToSend.font_headline,
      font_body: themeToSend.font_body,
      fontBody: themeToSend.font_body,
      font_label: themeToSend.font_label,
      fontLabel: themeToSend.font_label,
      glow_style: themeToSend.glow_style,
      glowStyle: themeToSend.glow_style,
      neon_thickness: themeToSend.neon_thickness,
      neonThickness: themeToSend.neon_thickness,
      neonGlow: themeToSend.neon_thickness === "2px" ? "10px" : themeToSend.neon_thickness === "4px" ? "18px" : themeToSend.neon_thickness === "6px" ? "26px" : "36px",
      global_background_image: themeToSend.global_background_image,
      globalBackgroundImage: themeToSend.global_background_image,
      cursor_effect: themeToSend.cursor_effect
    };

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CHAMBA_THEME', payload }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME_PREVIEW', payload }, '*');
    }
    if (modalIframeRef.current && modalIframeRef.current.contentWindow) {
      modalIframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CHAMBA_THEME', payload }, '*');
      modalIframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME_PREVIEW', payload }, '*');
    }
  };

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

  // Sync to iframe whenever currentTheme changes or activeTab/modal changes
  useEffect(() => {
    if (activeTab === 'theme' || isStudioModalOpen) {
      sendThemeToIframe(currentTheme);
    }
  }, [currentTheme, activeTab, isStudioModalOpen]);

  const handleSaveTheme = async (themeToSave?: SubdomainTheme) => {
    const target = themeToSave || currentTheme;
    setIsSavingConfig(true);
    try {
      const res = await updateChambaConfigAction({ theme: target });
      if (res.success) {
        setSiteConfig(res.config);
        setConfigSuccessMsg('¡Paleta, tipografía y efectos visuales de Chamba Pro guardados con éxito!');
        setTimeout(() => setConfigSuccessMsg(null), 5000);
      } else {
        alert('No se pudo guardar el tema visual.');
      }
    } catch {
      alert('Error al guardar el tema visual.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await updateChambaConfigAction({
        branding: siteConfig.branding,
        seo: siteConfig.seo,
        monetization: siteConfig.monetization,
        modules: siteConfig.modules,
        contact: siteConfig.contact
      });
      if (res.success) {
        setSiteConfig(res.config);
        setConfigSuccessMsg('¡Configuración SEO, Google AdSense, Search Console y módulos de Chamba Pro guardados con éxito!');
        setTimeout(() => setConfigSuccessMsg(null), 5000);
      } else {
        alert('No se pudo guardar la configuración.');
      }
    } catch {
      alert('Error al guardar la configuración.');
    } finally {
      setIsSavingConfig(false);
    }
  };
  const [search, setSearch] = useState('');
  const [selectedRegimen, setSelectedRegimen] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastApprovedJob, setLastApprovedJob] = useState<{ id: string; title: string; slug: string } | null>(null);
  const [editingJob, setEditingJob] = useState<(Omit<JobPosting, 'requirements'> & { requirements?: string | string[] }) | null>(null);
  const [isEditingSaving, setIsEditingSaving] = useState(false);
  const [isResolvingRealBases, setIsResolvingRealBases] = useState(false);
  const [realBasesStatusMsg, setRealBasesStatusMsg] = useState<string | null>(null);
  const [manualIndexUrl, setManualIndexUrl] = useState('https://empleos.atpdev.dev/empleos');
  const [isPingingIndex, setIsPingingIndex] = useState(false);
  const [indexPingResult, setIndexPingResult] = useState<string | null>(null);

  // Logo Modes for Create and Edit Forms
  const [newLogoMode, setNewLogoMode] = useState<'upload' | 'web' | 'url'>('upload');
  const [newCustomWebDomain, setNewCustomWebDomain] = useState('');
  const [editLogoMode, setEditLogoMode] = useState<'upload' | 'web' | 'url'>('upload');
  const [editCustomWebDomain, setEditCustomWebDomain] = useState('');

  const handleLogoFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        callback(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = (job: JobPosting) => {
    setEditingJob({
      ...job,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : ((job.requirements as any) || '')
    });
    setEditLogoMode(job.entity_logo?.startsWith('data:') ? 'upload' : job.entity_logo ? 'web' : 'upload');
    setEditCustomWebDomain('');
  };

  const handleSaveEditedJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setIsEditingSaving(true);
    try {
      const parsedRequirements = Array.isArray(editingJob.requirements)
        ? editingJob.requirements
        : typeof (editingJob as any).requirements === 'string'
        ? (editingJob as any).requirements.split('\n').map((r: string) => r.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
        : [];

      const jobToSave: JobPosting = {
        ...editingJob,
        requirements: parsedRequirements
      };

      const res = await saveJobAction(jobToSave);
      if (res.success) {
        setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...jobToSave } : j));
        setModerationMessage(`¡Convocatoria "${editingJob.title}" actualizada con éxito!`);
        setEditingJob(null);
        setTimeout(() => setModerationMessage(null), 5000);
      } else {
        alert(res.error || 'Error al guardar los cambios.');
      }
    } catch {
      alert('Error de conexión al actualizar la convocatoria.');
    } finally {
      setIsEditingSaving(false);
    }
  };

  const refreshJobs = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const fresh = await fetchAdminJobsAction();
      if (fresh && Array.isArray(fresh)) {
        setJobs(fresh);
      }
    } catch (err: any) {
      // Solo reportar error ruidoso si fue una acción manual del usuario,
      // evitando que el refresco silencioso con build desactualizado (stale) dispare el modal de error de Next.js
      if (!silent) {
        console.error('Error refreshing jobs:', err);
      } else {
        console.warn('Refresco silencioso omitido (build en recarga o conexión):', err?.message || err);
      }
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Refrescar automáticamente cuando el usuario regresa a la pestaña del admin
    const handleFocus = () => refreshJobs(true);
    window.addEventListener('focus', handleFocus);

    // Intervalo prudencial cada 30 segundos
    const interval = setInterval(() => {
      refreshJobs(true);
    }, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'pending') {
      refreshJobs(false);
    }
  }, [activeTab]);

  const pendingJobs = jobs.filter(j => j.status === 'Pendiente');

  // New Job Form State (Full registration fields matching portal)
  const [newJob, setNewJob] = useState({
    title: '',
    entity_name: '',
    entity_ruc: '',
    sector_type: 'CAS 1057' as JobPosting['sector_type'],
    region: 'Lima',
    category: 'Administración y Gestión Pública',
    education_level: 'Bachiller' as JobPosting['education_level'],
    salary_text: 'S/. 3,500 Soles',
    salary_min: 3500,
    salary_max: 3500,
    vacancies_count: 1,
    description: '',
    requirements: '',
    apply_url: '',
    bases_pdf_url: '',
    entity_logo: '',
    contact_email: '',
    contact_phone: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    featured: false,
    entity_verified: true,
    status: 'Vigente' as JobPosting['status']
  });

  // Pagination and Origin Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOrigin, setFilterOrigin] = useState<'all' | 'cms'>('all');
  const pageSize = 50;

  const cmsCount = useMemo(() => {
    return jobs.filter(j => j.id.startsWith('job-cms-') || j.id.startsWith('job-admin-')).length;
  }, [jobs]);

  const finalizedCount = useMemo(() => {
    return jobs.filter(j => j.status === 'Finalizado').length;
  }, [jobs]);

  // Filter and Sort Jobs (Prioritize CMS / User-submissions at the top)
  const filteredJobs = useMemo(() => {
    return jobs
      .filter(j => {
        const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                            j.entity_name.toLowerCase().includes(search.toLowerCase()) ||
                            (j.entity_ruc && j.entity_ruc.includes(search));
        const matchRegimen = selectedRegimen === 'all' || j.sector_type === selectedRegimen;
        const matchStatus = selectedStatus === 'all' || j.status === selectedStatus;
        const isCms = j.id.startsWith('job-cms-') || j.id.startsWith('job-admin-');
        const matchOrigin = filterOrigin === 'all' || (filterOrigin === 'cms' && isCms);
        return matchSearch && matchRegimen && matchStatus && matchOrigin;
      })
      .sort((a, b) => {
        const isCmsA = a.id.startsWith('job-cms-') || a.id.startsWith('job-admin-');
        const isCmsB = b.id.startsWith('job-cms-') || b.id.startsWith('job-admin-');
        if (isCmsA && !isCmsB) return -1;
        if (!isCmsA && isCmsB) return 1;
        const dateA = a.created_at || a.start_date || '';
        const dateB = b.created_at || b.start_date || '';
        return dateB.localeCompare(dateA);
      });
  }, [jobs, search, selectedRegimen, selectedStatus, filterOrigin]);

  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRegimen, selectedStatus, filterOrigin]);

  // Actions
  const handleToggleFeatured = async (id: string, current: boolean) => {
    const next = !current;
    setJobs(prev => prev.map(j => j.id === id ? { ...j, featured: next } : j));
    await toggleJobFeaturedAction(id, next);
  };

  const handleUpdateStatus = async (id: string, status: 'Vigente' | 'Finalizado' | 'Pendiente') => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
    await updateJobStatusAction(id, status);
  };

  const handleApproveJob = async (id: string) => {
    setProcessingId(id);
    setModerationMessage(null);
    const target = jobs.find(j => j.id === id);
    try {
      const ok = await approveJobRequestAction(id, target?.entity_logo);
      if (ok) {
        const approvedItem: JobPosting = {
          ...(target || ({} as any)),
          id,
          status: 'Vigente',
          entity_verified: true,
          entity_logo: target?.entity_logo
        };
        // Colocar la recién aprobada en la posición #1 absoluta y cambiar a la pestaña 'list'
        setJobs(prev => [approvedItem, ...prev.filter(j => j.id !== id)]);
        if (target) {
          setLastApprovedJob({ id: target.id, title: target.title, slug: target.slug });
        }
        setModerationMessage(`¡Convocatoria "${target?.title || id}" aprobada y publicada en la posición #1 de Convocatorias!`);
        setActiveTab('list');
        setCurrentPage(1);
        setTimeout(() => setModerationMessage(null), 10000);
      } else {
        alert('No se pudo aprobar la convocatoria.');
      }
    } catch (err) {
      alert('Error al aprobar convocatoria.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectJob = async (id: string) => {
    if (!confirm('¿Estás seguro de rechazar y eliminar esta solicitud de convocatoria?')) return;
    setProcessingId(id);
    try {
      const ok = await deleteJobAction(id);
      if (ok) {
        setJobs(prev => prev.filter(j => j.id !== id));
        setModerationMessage('Solicitud rechazada y eliminada.');
        setTimeout(() => setModerationMessage(null), 5000);
      }
    } catch (err) {
      alert('Error al descartar la solicitud.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleAutoCaptureJobLogo = async (id: string, url: string) => {
    try {
      if (!url) {
        alert('Esta solicitud no tiene enlace web registrado para capturar logo.');
        return;
      }
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      const parsed = new URL(cleanUrl);
      const domain = parsed.hostname.replace(/^www\./, '');
      if (!domain || !domain.includes('.')) {
        alert('No se pudo identificar el dominio del sitio web.');
        return;
      }
      const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      setJobs(prev => prev.map(j => j.id === id ? { ...j, entity_logo: logoUrl } : j));
      await updateJobLogoAction(id, logoUrl);
      setModerationMessage('¡Logo oficial capturado exitosamente desde el sitio web!');
      setTimeout(() => setModerationMessage(null), 4000);
    } catch {
      alert('La URL del empleo no es válida para capturar el logo.');
    }
  };

  const handleUploadJobLogo = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, entity_logo: base64 } : j));
        await updateJobLogoAction(id, base64);
        setModerationMessage('¡Logo / afiche cargado y guardado exitosamente!');
        setTimeout(() => setModerationMessage(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    const target = jobs.find(j => j.id === id);
    if (!confirm(`¿Estás seguro de eliminar permanentemente la convocatoria "${target?.title || id}"?`)) return;
    setJobs(prev => prev.filter(j => j.id !== id));
    setModerationMessage(`Convocatoria "${target?.title || id}" eliminada exitosamente.`);
    setTimeout(() => setModerationMessage(null), 5000);
    await deleteJobAction(id);
  };

  const handleTriggerScraper = async () => {
    setIsScraping(true);
    setScrapeResult(null);
    try {
      const res = await triggerLiveScraperAction();
      setScrapeResult(`✅ Ingesta multicanal completada con éxito: ${res.count} convocatorias obtenidas.`);
      await refreshJobs(true);
    } catch (err: any) {
      setScrapeResult(`❌ Error en el scraper: ${err?.message || 'Error de conexión'}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.entity_name || !newJob.apply_url) {
      alert('Por favor completa los campos obligatorios: Título, Entidad y Enlace Oficial.');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const parsedRequirements = Array.isArray(newJob.requirements)
      ? newJob.requirements
      : typeof newJob.requirements === 'string'
      ? newJob.requirements.split('\n').map(r => r.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
      : [];

    const res = await saveJobAction({
      ...newJob,
      requirements: parsedRequirements,
      id: `job-cms-${Date.now()}`,
      created_at: new Date().toISOString()
    });

    setIsSaving(false);
    if (res.success) {
      setModerationMessage('¡Convocatoria publicada exitosamente en Chamba Pro!');
      setActiveTab('list');
      setCurrentPage(1);
      await refreshJobs(false);
      // Reset
      setNewJob({
        title: '',
        entity_name: '',
        entity_ruc: '',
        sector_type: 'CAS 1057',
        region: 'Lima',
        category: 'Administración y Gestión Pública',
        education_level: 'Bachiller',
        salary_text: 'S/. 3,500 Soles',
        salary_min: 3500,
        salary_max: 3500,
        vacancies_count: 1,
        description: '',
        requirements: '',
        apply_url: '',
        bases_pdf_url: '',
        entity_logo: '',
        contact_email: '',
        contact_phone: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        featured: false,
        entity_verified: true,
        status: 'Vigente'
      });
      setNewCustomWebDomain('');
      setTimeout(() => setModerationMessage(null), 5000);
    } else {
      alert(res.error || 'Error al guardar');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
            <ShieldCheck size={13} />
            <span>CHAMBA PRO CMS — EMPLEOS.ATPDEV.DEV</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Gestión de Convocatorias & Empleos Perú
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitoreo en tiempo real, ingestión con IA, control de anunciantes y derivación oficial sin intermediarios.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://empleos.atpdev.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs border border-white/10 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Ver Portal en Vivo</span>
          </a>
          <button
            onClick={() => setActiveTab('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={15} />
            <span>Publicar Convocatoria</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'list' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={15} />
            <span>Convocatorias ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'pending' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock size={15} className={pendingJobs.length > 0 ? 'text-amber-400 animate-pulse' : ''} />
            <span>Solicitudes Pendientes</span>
            {pendingJobs.length > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-[10px] shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                {pendingJobs.length}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px]">
                0
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'create' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus size={15} />
            <span>Crear Convocatoria</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'theme' 
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette size={15} className="text-purple-400" />
            <span>Theme Studio Chamba</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings2 size={15} className="text-blue-400" />
            <span>Configuración & Páginas</span>
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scraper' 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio size={15} />
            <span>Motor Scraper SERVIR</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ads' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign size={15} />
            <span>Google Ads & ads.txt</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => refreshJobs(false)}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
          title="Sincronizar y actualizar convocatorias en tiempo real"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-emerald-400' : ''} />
          <span>{isRefreshing ? 'Sincronizando...' : 'Sincronizar'}</span>
        </button>
      </div>

      {/* Banner Notifications */}
      {configSuccessMsg && (
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{configSuccessMsg}</span>
        </div>
      )}

      {moderationMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{moderationMessage}</span>
        </div>
      )}

      {/* TAB 1: LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por entidad o título de puesto..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="Vigente">Solo Vigentes</option>
                  <option value="Pendiente">Solo Pendientes</option>
                  <option value="Finalizado">Solo Finalizados</option>
                </select>

                <select
                  value={selectedRegimen}
                  onChange={e => setSelectedRegimen(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Todos los Regímenes</option>
                  <option value="CAS 1057">CAS 1057</option>
                  <option value="D.L. 728">D.L. 728</option>
                  <option value="D.L. 276">D.L. 276</option>
                  <option value="Locación / FAG">Locación / FAG</option>
                  <option value="Privado">Sector Privado</option>
                </select>
              </div>
            </div>

            {/* Quick Origin Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Filtrar por:</span>
              <button
                type="button"
                onClick={() => {
                  setFilterOrigin('all');
                  setSelectedStatus('all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  filterOrigin === 'all' && selectedStatus === 'all'
                    ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                Todas las Convocatorias ({jobs.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterOrigin('cms');
                  setSelectedStatus('all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  filterOrigin === 'cms' && selectedStatus === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                }`}
              >
                <Sparkles size={12} />
                <span>Aprobadas / Creadas en CMS ({cmsCount})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('Finalizado');
                  setFilterOrigin('all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedStatus === 'Finalizado'
                    ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                }`}
              >
                <span>🔴 Finalizadas ({finalizedCount})</span>
              </button>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Puesto / Entidad</th>
                  <th className="py-3 px-4">Régimen</th>
                  <th className="py-3 px-4">Región / Sueldo</th>
                  <th className="py-3 px-4">Vigencia</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Destacado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-mono text-xs">
                      No se encontraron convocatorias con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  paginatedJobs.map((job, idx) => {
                    const isCmsJob = job.id.startsWith('job-cms-') || job.id.startsWith('job-admin-');
                    const isRecentlyApproved = job.id === lastApprovedJob?.id;
                    const isFinalized = job.status === 'Finalizado';

                    return (
                      <tr 
                        key={`${job.id}-${idx}`} 
                        className={`hover:bg-slate-800/30 transition-colors ${
                          isRecentlyApproved
                            ? 'bg-emerald-950/30 border-l-4 border-l-emerald-400'
                            : isFinalized
                            ? 'bg-rose-950/10 border-l-4 border-l-rose-500/50 opacity-90'
                            : isCmsJob
                            ? 'bg-emerald-950/15 border-l-4 border-l-emerald-500/60'
                            : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-2.5">
                            {job.entity_logo ? (
                              <img
                                src={job.entity_logo}
                                alt=""
                                className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 shrink-0 border border-slate-700 shadow-sm"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                <Building2 size={13} className="text-slate-500" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="font-bold text-white truncate flex items-center gap-1.5" title={job.title}>
                                <span className="truncate">{job.title}</span>
                                {isRecentlyApproved && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-mono font-black shrink-0 animate-pulse">
                                    ¡RECIÉN APROBADA!
                                  </span>
                                )}
                                {isFinalized && (
                                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold shrink-0">
                                    FINALIZADA
                                  </span>
                                )}
                                {!isRecentlyApproved && !isFinalized && isCmsJob && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold shrink-0">
                                    CMS
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                                <Building2 size={12} className="text-emerald-400 shrink-0" />
                                <span className="truncate">{job.entity_name}</span>
                                {job.entity_verified && (
                                  <span title="RUC Verificado">
                                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                            {job.sector_type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300 font-medium flex items-center gap-1">
                            <MapPin size={11} className="text-slate-500" />
                            <span>{job.region}</span>
                          </div>
                          <div className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5">
                            {job.salary_text}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {job.end_date}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={job.status}
                            onChange={(e) => handleUpdateStatus(job.id, e.target.value as any)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-md border bg-slate-950 focus:outline-none transition-colors ${
                              job.status === 'Vigente'
                                ? 'text-emerald-400 border-emerald-500/30'
                                : job.status === 'Finalizado'
                                ? 'text-rose-400 border-rose-500/40 bg-rose-950/20'
                                : 'text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <option value="Vigente">🟢 Vigente</option>
                            <option value="Finalizado">🔴 Finalizado</option>
                            <option value="Pendiente">🟡 Pendiente</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleFeatured(job.id, job.featured)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              job.featured
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                                : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                            }`}
                            title={job.featured ? 'Quitar de portada' : 'Destacar en portada'}
                          >
                            <Star size={14} className={job.featured ? 'fill-amber-400' : ''} />
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1. Ver en Chamba Pro en Vivo (Ojito) */}
                            <a
                              href={`${chambaLiveUrl}/empleos/${job.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                              title="Ver convocatoria pública en Chamba Pro"
                            >
                              <Eye size={13} />
                            </a>

                            {/* 2. Editar Convocatoria (Lápiz) - DIRECTO AL LADO DEL OJITO */}
                            <button
                              type="button"
                              onClick={() => handleStartEdit(job)}
                              className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors cursor-pointer"
                              title="Editar convocatoria (Título, salario, vacantes, fechas, bases)"
                            >
                              <Pencil size={13} />
                            </button>

                            {/* 3. Eliminar Convocatoria (Tacho) - DIRECTO AL LADO DE EDITAR */}
                            <button
                              type="button"
                              onClick={() => handleDelete(job.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              title="Eliminar convocatoria definitivamente"
                            >
                              <Trash2 size={13} />
                            </button>

                            {/* 4. Portal Oficial Externo */}
                            <a
                              href={job.apply_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                              title="Abrir portal institucional de postulación"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-400">
              <div>
                Mostrando <span className="text-white font-bold">{(currentPage - 1) * pageSize + 1}</span> - <span className="text-white font-bold">{Math.min(currentPage * pageSize, filteredJobs.length)}</span> de <span className="text-emerald-400 font-bold">{filteredJobs.length}</span> convocatorias
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  « Primero
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  ‹ Anterior
                </button>

                <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-white font-bold">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  Siguiente ›
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  Último »
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: PENDING MODERATION QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/20 uppercase tracking-wider">
                <ShieldCheck size={12} />
                <span>Módulo de Moderación y Auditoría Editorial</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-display text-white flex items-center gap-2.5">
                <span>Solicitudes de Publicación Recibidas</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono">
                  {pendingJobs.length} pendientes
                </span>
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Coteja la autenticidad institucional (RUC en SUNAT y portal institucional) antes de habilitar la convocatoria en el portal público de Chamba Pro.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => refreshJobs(false)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white text-xs font-mono font-bold border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
                title="Sincronizar y cargar convocatorias recientes"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-emerald-400' : ''} />
                <span>{isRefreshing ? 'Sincronizando...' : 'Sincronizar Solicitudes'}</span>
              </button>

              <a
                href="https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-mono font-bold border border-amber-500/20 transition-all shadow-sm"
              >
                <span>Consultar RUC SUNAT</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {lastApprovedJob && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/50 text-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm font-display flex items-center gap-2">
                    <span>¡Convocatoria Aprobada y Publicada en Vivo!</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">En Línea</span>
                  </h4>
                  <p className="text-[11px] text-emerald-300/90 mt-0.5">
                    La convocatoria <strong className="text-white">"{lastApprovedJob.title}"</strong> ya está activa en el buscador y disponible para postulantes.
                  </p>
                </div>
              </div>
              <a
                href={`${chambaLiveUrl}/empleos/${lastApprovedJob.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black font-display transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Ver en Vivo en Chamba Pro</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}

          {moderationMessage && !lastApprovedJob && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-lg">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{moderationMessage}</span>
            </div>
          )}

          {pendingJobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="text-base font-bold text-white">No hay convocatorias pendientes de moderación</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Todas las solicitudes recibidas desde el formulario han sido verificadas y publicadas en vivo, o descartadas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingJobs.map((job, idx) => (
                <div 
                  key={`${job.id}-${idx}`} 
                  className="rounded-2xl bg-slate-900/60 border border-amber-500/25 p-5 sm:p-6 space-y-4 hover:border-amber-500/40 transition-all shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-start gap-4">
                      {/* Miniatura del Logo o Afiche */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-white/10 p-1.5 shrink-0 flex items-center justify-center relative overflow-hidden shadow-md">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
                        {job.entity_logo ? (
                          <img 
                            src={job.entity_logo} 
                            alt={job.entity_name} 
                            className="max-w-full max-h-full object-contain" 
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <Building2 size={24} />
                            <span className="text-[8px] font-mono mt-0.5 text-slate-500">Sin logo</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock size={11} />
                            <span>Pendiente de Aprobación</span>
                          </span>
                          {job.entity_logo ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-semibold flex items-center gap-1">
                              <Check size={10} />
                              <span>Logo Adjunto</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                              Escudo por defecto
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono font-semibold">
                            {job.sector_type}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono font-semibold">
                            {job.region}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {job.title}
                        </h4>
                        <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 flex-wrap">
                          <Building2 size={13} />
                          <span>{job.entity_name}</span>
                          {job.entity_ruc && (
                            <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                              RUC: {job.entity_ruc}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 space-y-1">
                      <div className="text-xs font-mono text-slate-400">
                        Remuneración: <span className="text-emerald-400 font-bold">{job.salary_text}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Vacantes: <span className="text-white font-bold">{job.vacancies_count}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Recibido: {job.created_at?.split('T')[0] || job.start_date}
                      </div>
                    </div>
                  </div>

                  {/* Detalle de Contacto y Validación */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-slate-950/70 p-4 rounded-xl border border-white/5">
                    <div className="space-y-1.5">
                      <div className="text-amber-400 font-bold text-[11px] flex items-center gap-1.5">
                        <Mail size={12} />
                        <span>Canales de Contacto Registrados:</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-slate-500">Email:</span>
                        {job.contact_email ? (
                          <a href={`mailto:${job.contact_email}`} className="text-emerald-400 hover:underline">
                            {job.contact_email}
                          </a>
                        ) : (
                          <span className="text-slate-500 italic">No proporcionado</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-slate-500">Teléfono:</span>
                        {job.contact_phone ? (
                          <a href={`https://wa.me/${job.contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                            <span>{job.contact_phone}</span>
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-slate-500 italic">No proporcionado</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                        <ExternalLink size={12} />
                        <span>Enlaces Oficiales Declarados:</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-slate-500 shrink-0">Portal:</span>
                        <a 
                          href={job.apply_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline truncate inline-flex items-center gap-1"
                        >
                          <span className="truncate">{job.apply_url}</span>
                          <ExternalLink size={10} className="shrink-0" />
                        </a>
                      </div>
                      {job.bases_pdf_url && (
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-slate-500 shrink-0">Bases:</span>
                          <a 
                            href={job.bases_pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline truncate inline-flex items-center gap-1"
                          >
                            <span className="truncate">{job.bases_pdf_url}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descripción corta */}
                  {job.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950/30 p-2.5 rounded-lg border border-white/5">
                      "{job.description}"
                    </p>
                  )}

                  {/* Acciones de Moderación */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>Portal Oficial</span>
                      </a>

                      <a
                        href={`${chambaLiveUrl}/empleos/${job.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-amber-500/30 transition-colors"
                        title="Ver cómo se verá la convocatoria en Chamba Pro"
                      >
                        <Eye size={12} />
                        <span>Vista Previa</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(job)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-cyan-500/30 transition-colors cursor-pointer"
                        title="Editar datos de la solicitud (vacantes, remuneración, bases, fechas)"
                      >
                        <Pencil size={12} />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1.5 border border-rose-500/30 transition-colors cursor-pointer"
                        title="Eliminar solicitud definitivamente"
                      >
                        <Trash2 size={12} />
                        <span>Eliminar</span>
                      </button>

                      {job.entity_ruc && (
                        <a
                          href="https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors hidden md:inline-flex"
                        >
                          <span>SUNAT: {job.entity_ruc}</span>
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {/* Captura Inteligente con 1 Clic desde el Portal */}
                      <button
                        type="button"
                        onClick={() => handleAutoCaptureJobLogo(job.id, job.apply_url)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        title="Capturar logo oficial en alta resolución desde el dominio del portal institucional"
                      >
                        <Globe size={12} />
                        <span>{job.entity_logo ? 'Recapturar Logo' : '🌐 Capturar Logo Web'}</span>
                      </button>

                      {/* Cargar o Reemplazar Logo desde Archivo Local */}
                      <label
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        title="Subir archivo de logo o afiche desde tu computadora"
                      >
                        <Upload size={12} />
                        <span>Subir Imagen</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(e) => handleUploadJobLogo(job.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        disabled={processingId === job.id}
                        onClick={() => handleRejectJob(job.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-display transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Rechazar</span>
                      </button>

                      <button
                        disabled={processingId === job.id}
                        onClick={() => handleApproveJob(job.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black font-display transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        <span>{processingId === job.id ? 'Aprobando...' : 'Aprobar y Publicar en Vivo'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE JOB FORM */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateJob} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-emerald-400" size={18} />
                <span>Publicar Nueva Convocatoria Laboral</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Completa los datos de la convocatoria. Las ofertas se indexan automáticamente en Google for Jobs mediante JSON-LD Schema.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors self-start sm:self-auto cursor-pointer"
            >
              Volver al Listado
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Título */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Título del Puesto / Código de Proceso *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. CAS N° 012-2026: Especialista en Contrataciones del Estado"
                value={newJob.title}
                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Entidad */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Entidad Pública o Empresa *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. MINISTERIO DE ECONOMÍA Y FINANZAS (MEF)"
                value={newJob.entity_name}
                onChange={e => setNewJob({ ...newJob, entity_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* RUC */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                <span>RUC de la Entidad (11 dígitos)</span>
                {newJob.entity_ruc && newJob.entity_ruc.length === 11 && (
                  <span className="text-emerald-400 text-[10px]">✓ 11 Dígitos</span>
                )}
              </label>
              <input
                type="text"
                maxLength={11}
                placeholder="Ej. 20131370645"
                value={newJob.entity_ruc}
                onChange={e => setNewJob({ ...newJob, entity_ruc: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Régimen */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Régimen Laboral *
              </label>
              <select
                value={newJob.sector_type}
                onChange={e => setNewJob({ ...newJob, sector_type: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {REGIMENES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Región */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Ubicación / Región *
              </label>
              <select
                value={newJob.region}
                onChange={e => setNewJob({ ...newJob, region: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {REGIONES_PERU.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            {/* LOGO INSTITUCIONAL COMPLETO */}
            <div className="sm:col-span-2 space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-200 font-bold flex items-center gap-2">
                    <ImageIcon size={15} className="text-emerald-400" />
                    <span>Logo Oficial o Afiche Institucional de la Entidad</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sube el logo de la entidad, captúralo automáticamente desde su portal web con 1 clic, o ingresa un enlace directo.
                  </p>
                </div>

                {/* Tabs de modo de carga */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setNewLogoMode('upload')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      newLogoMode === 'upload'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload size={12} />
                    <span>Subir Archivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewLogoMode('web');
                      if (newJob.apply_url && !newJob.entity_logo) {
                        const captured = extractLogoFromDomain(newJob.apply_url);
                        if (captured) setNewJob({ ...newJob, entity_logo: captured });
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      newLogoMode === 'web'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe size={12} />
                    <span>Capturar de Web</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewLogoMode('url')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      newLogoMode === 'url'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Link2 size={12} />
                    <span>Enlace URL</span>
                  </button>
                </div>
              </div>

              {/* Controles de acuerdo al modo */}
              {newLogoMode === 'upload' && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Upload size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Seleccionar archivo desde tu computadora</h4>
                      <p className="text-[10px] text-slate-400 font-mono">PNG, JPG, WebP o SVG (Máximo 2 MB)</p>
                    </div>
                  </div>
                  <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold font-mono border border-slate-700 cursor-pointer transition-colors shrink-0">
                    <span>Explorar Archivo...</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={(e) => handleLogoFileUpload(e, (b64) => setNewJob({ ...newJob, entity_logo: b64 }))}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {newLogoMode === 'web' && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Globe size={14} className="absolute left-3.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder={newJob.apply_url || "Ej: unajma.edu.pe, mef.gob.pe o bcp.com.pe"}
                      value={newCustomWebDomain}
                      onChange={(e) => setNewCustomWebDomain(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const target = newCustomWebDomain || newJob.apply_url;
                      if (!target) {
                        alert('Ingresa una URL o dominio web para capturar el logo.');
                        return;
                      }
                      const captured = extractLogoFromDomain(target);
                      if (captured) {
                        setNewJob({ ...newJob, entity_logo: captured });
                      } else {
                        alert('No se pudo identificar el dominio web.');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Sparkles size={13} />
                    <span>Capturar Logo Web</span>
                  </button>
                </div>
              )}

              {newLogoMode === 'url' && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <input
                    type="url"
                    placeholder="https://entidad.gob.pe/logo.png"
                    value={newJob.entity_logo}
                    onChange={(e) => setNewJob({ ...newJob, entity_logo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              )}

              {/* Vista Previa de Logo */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex items-center gap-3">
                  {newJob.entity_logo ? (
                    <img
                      src={newJob.entity_logo}
                      alt="Vista previa del logo"
                      className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-700 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                      <Building2 size={20} />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Vista Previa del Logo</span>
                      {newJob.entity_logo && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          ✓ Logo Cargado
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono truncate max-w-sm sm:max-w-md">
                      {newJob.entity_logo ? 'Este isotipo se mostrará en portada, buscador y Google Jobs' : 'Sin logo cargado (usará escudo institucional por defecto)'}
                    </div>
                  </div>
                </div>

                {newJob.entity_logo && (
                  <button
                    type="button"
                    onClick={() => setNewJob({ ...newJob, entity_logo: '' })}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Quitar logo"
                  >
                    <Trash2 size={12} />
                    <span>Quitar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Categoría Ocupacional *
              </label>
              <select
                value={newJob.category}
                onChange={e => setNewJob({ ...newJob, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIAS_EMPLEO.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Nivel Educativo */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Nivel Educativo Mínimo *
              </label>
              <select
                value={newJob.education_level}
                onChange={e => setNewJob({ ...newJob, education_level: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {NIVELES_EDUCATIVOS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Remuneración */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Remuneración Mensual en Soles *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. S/. 4,500 Soles o A convenir"
                value={newJob.salary_text}
                onChange={e => setNewJob({ ...newJob, salary_text: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Vacantes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Número de Vacantes *
              </label>
              <input
                type="number"
                min={1}
                required
                value={newJob.vacancies_count}
                onChange={e => setNewJob({ ...newJob, vacancies_count: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Requisitos */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Requisitos del Puesto (Un requisito por línea)
              </label>
              <textarea
                rows={3}
                placeholder="- Título Profesional en la especialidad solicitada&#10;- Experiencia laboral mínima de 2 años en el sector público&#10;- Conocimientos acreditados en SIGA/SIAF"
                value={newJob.requirements}
                onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
              />
            </div>

            {/* Descripción */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Descripción y Funciones Principales
              </label>
              <textarea
                rows={3}
                placeholder="Breve resumen del perfil requerido, funciones operativas del puesto y marco de contratación institucional..."
                value={newJob.description}
                onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Enlace Postulación */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Enlace Oficial de Postulación (Portal Institucional) *
              </label>
              <input
                type="url"
                required
                placeholder="https://convocatorias.entidad.gob.pe"
                value={newJob.apply_url}
                onChange={e => setNewJob({ ...newJob, apply_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Enlace Bases PDF */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Enlace a Bases Oficiales (PDF o Drive Directo)
              </label>
              <input
                type="url"
                placeholder="https://archivos.entidad.gob.pe/bases.pdf"
                value={newJob.bases_pdf_url}
                onChange={e => setNewJob({ ...newJob, bases_pdf_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Fecha Inicio */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Fecha de Publicación / Inicio
              </label>
              <input
                type="date"
                value={newJob.start_date}
                onChange={e => setNewJob({ ...newJob, start_date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Fecha Fin */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Fecha Límite de Postulación (Vigencia) *
              </label>
              <input
                type="date"
                required
                value={newJob.end_date}
                onChange={e => setNewJob({ ...newJob, end_date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Estado Inicial */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Estado Inicial de Publicación
              </label>
              <select
                value={newJob.status}
                onChange={e => setNewJob({ ...newJob, status: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="Vigente">🟢 Vigente (Visible en Chamba Pro)</option>
                <option value="Finalizado">🔴 Finalizado (Cerrado)</option>
                <option value="Pendiente">🟡 Pendiente (Revisión interna)</option>
              </select>
            </div>

            {/* Contacto Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Correo Institucional de Contacto (Opcional)
              </label>
              <input
                type="email"
                placeholder="rrhh@entidad.gob.pe"
                value={newJob.contact_email}
                onChange={e => setNewJob({ ...newJob, contact_email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Contacto Teléfono */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Teléfono o WhatsApp de Consultas (Opcional)
              </label>
              <input
                type="text"
                placeholder="(01) 611-1234 o +51 987654321"
                value={newJob.contact_phone}
                onChange={e => setNewJob({ ...newJob, contact_phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Destacado y Verificado */}
            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                <input
                  type="checkbox"
                  checked={newJob.featured}
                  onChange={e => setNewJob({ ...newJob, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
                <span>⭐ Destacar en la portada principal de Chamba Pro</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                <input
                  type="checkbox"
                  checked={newJob.entity_verified}
                  onChange={e => setNewJob({ ...newJob, entity_verified: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
                <span>✓ Marcar como RUC y Entidad Verificada</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
              <span>{isSaving ? 'Guardando Convocatoria...' : 'Publicar Convocatoria Ahora'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: LIVE SCRAPER ENGINE */}
      {activeTab === 'scraper' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="text-emerald-400" size={18} />
              <span>Motor de Ingesta & Web Scraper Multi-Canal</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Extrae automáticamente convocatorias en tiempo real desde SERVIR (Talento Perú) y portales institucionales de Estado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">ESTADO DEL MOTOR</div>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Operativo & Resiliente
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">CONVOCATORIAS DISPONIBLES</div>
              <div className="text-base font-bold text-white mt-1">
                {jobs.length} registros cargados
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">FRECUENCIA DE REVALIDACIÓN</div>
              <div className="text-base font-bold text-cyan-400 mt-1">
                Cada 30 minutos (Next.js ISR)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-emerald-400">⚡ Ejecución Manual</p>
            <p className="text-slate-400">
              Puedes forzar una sincronización inmediata para consultar las fuentes oficiales del Estado y actualizar las convocatorias del día.
            </p>
            <div className="pt-2">
              <button
                onClick={handleTriggerScraper}
                disabled={isScraping}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <RefreshCw size={14} className={isScraping ? 'animate-spin' : ''} />
                <span>{isScraping ? 'Consultando fuentes...' : 'Sincronizar Convocatorias Ahora'}</span>
              </button>
            </div>
            {scrapeResult && (
              <p className="mt-3 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                {scrapeResult}
              </p>
            )}
          </div>
        </div>
      )}

      {/* REUSABLE THEME CONTROLS SUITE (Used in both Inline tab and Fullscreen modal) */}
      {(() => null)()}
      
      {/* TAB: THEME STUDIO CHAMBA PRO (UNIFICADO NIVEL DIOS) */}
      {activeTab === 'theme' && (
        <UnifiedThemeStudio
          subdomain="chamba"
          subdomainTitle="Chamba Pro"
          port="3005"
          localUrl="http://localhost:3005"
          productionUrl={OFFICIAL_APP_URLS.chamba}
          theme={siteConfig.theme}
          presets={[
            { name: 'Esmeralda Pro (Oficial)', hex: '#10b981' },
            { name: 'Púrpura Elegante', hex: '#8b5cf6' },
            { name: 'Azul Corporativo', hex: '#3b82f6' },
            { name: 'Índigo Moderno', hex: '#6366f1' },
            { name: 'Ámbar Estado', hex: '#f59e0b' },
            { name: 'Cyan Tecnológico', hex: '#06b6d4' }
          ]}
          onSaveTheme={async (newTheme: SubdomainTheme) => {
            setIsSavingConfig(true);
            try {
              const res = await updateChambaConfigAction({ theme: newTheme });
              if (res.success) {
                setSiteConfig(res.config);
                setConfigSuccessMsg('¡Tema visual de Chamba Pro guardado y sincronizado con éxito!');
                setTimeout(() => setConfigSuccessMsg(null), 5000);
                return true;
              }
              return false;
            } catch {
              alert('Error al guardar el tema visual.');
              return false;
            } finally {
              setIsSavingConfig(false);
            }
          }}
          saving={isSavingConfig}
        />
      )}

      {/* TAB: CONFIGURACIÓN GENERAL Y GESTOR DE PÁGINAS DEL SUBDOMINIO */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Settings2 size={14} />
                <span>Gestor de Subdominio Chamba Pro</span>
              </span>
              <h3 className="text-xl font-black font-display text-white">
                Configuración del Sitio, Textos & Módulos
              </h3>
              <p className="text-xs text-slate-400">
                Edita los titulares de portada, eslogan, SEO y activa o pausa funcionalidades públicas de Chamba Pro.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSavingConfig}
              className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs font-display flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50 self-start md:self-auto"
            >
              {isSavingConfig ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
              <span>{isSavingConfig ? 'Guardando...' : 'Guardar Configuración'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 01. Identidad y Textos de Portada */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span>01. Identidad de Marca & Textos del Hero Banner</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre del Sitio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Nombre del Portal
                    </label>
                    <input
                      type="text"
                      required
                      value={siteConfig.branding.site_title}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, site_title: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Eslogan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Eslogan Institucional
                    </label>
                    <input
                      type="text"
                      required
                      value={siteConfig.branding.site_tagline}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, site_tagline: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Hero Badge */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Insignia Superior del Hero Banner
                    </label>
                    <input
                      type="text"
                      value={siteConfig.branding.hero_badge}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, hero_badge: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Hero Title Prefix */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Titular Principal (Prefijo)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.branding.hero_title_prefix}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, hero_title_prefix: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Hero Title Highlight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Titular (Palabra Resaltada)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.branding.hero_title_highlight}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, hero_title_highlight: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Hero Description */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Descripción del Hero en Portada
                    </label>
                    <textarea
                      rows={3}
                      value={siteConfig.branding.hero_description}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, hero_description: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Barra de Anuncios Superior */}
                  <div className="sm:col-span-2 space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                        <span>Barra de Anuncios Superior (Top Floating Notice)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-blue-400">
                        <input
                          type="checkbox"
                          checked={siteConfig.branding.announcement_enabled}
                          onChange={e => setSiteConfig({
                            ...siteConfig,
                            branding: { ...siteConfig.branding, announcement_enabled: e.target.checked }
                          })}
                          className="w-4 h-4 rounded text-blue-500 bg-slate-900 border-slate-700"
                        />
                        <span>Mostrar Anuncio</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Texto del anuncio..."
                      value={siteConfig.branding.announcement_text || ''}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, announcement_text: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 02. SEO & Contacto */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span>02. Metadatos SEO & Contacto de Soporte</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Título SEO para Google (Meta Title)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.seo.meta_title}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        seo: { ...siteConfig.seo, meta_title: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Meta Descripción para Motores de Búsqueda
                    </label>
                    <textarea
                      rows={2}
                      value={siteConfig.seo.meta_description}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        seo: { ...siteConfig.seo, meta_description: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <span>Token Google Search Console</span>
                      <span className="text-[10px] text-emerald-400 font-normal">(meta verification)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. gsc-verification-token..."
                      value={siteConfig.seo.google_search_console_token || ''}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        seo: { ...siteConfig.seo, google_search_console_token: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <span>ID Google Analytics 4 / GTM</span>
                      <span className="text-[10px] text-cyan-400 font-normal">(G-XXXX o GTM-XXXX)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX o GTM-KGJN7SDL"
                      value={siteConfig.seo.google_analytics_id || ''}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        seo: { ...siteConfig.seo, google_analytics_id: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <span>ID Microsoft Clarity (Mapas de Calor)</span>
                      <span className="text-[10px] text-amber-400 font-normal">(Ej. zak4lzyye9)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="zak4lzyye9"
                      value={siteConfig.seo.microsoft_clarity_id || ''}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        seo: { ...siteConfig.seo, microsoft_clarity_id: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Correo de Contacto de Chamba Pro
                    </label>
                    <input
                      type="email"
                      value={siteConfig.contact.email}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        contact: { ...siteConfig.contact, email: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      WhatsApp de Consultas / Soporte
                    </label>
                    <input
                      type="text"
                      value={siteConfig.contact.whatsapp}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        contact: { ...siteConfig.contact, whatsapp: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <span>Enlace Canal de WhatsApp</span>
                      <span className="text-[10px] text-emerald-400 font-normal">(/alertas)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://whatsapp.com/channel/..."
                      value={siteConfig.contact.whatsapp_channel_url || ''}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        contact: { ...siteConfig.contact, whatsapp_channel_url: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <span>Enlace Canal de Telegram</span>
                      <span className="text-[10px] text-sky-400 font-normal">(t.me/...)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://t.me/chambapro_peru"
                      value={siteConfig.contact.telegram_channel_url || ''}
                      onChange={e => setSiteConfig({
                        ...siteConfig,
                        contact: { ...siteConfig.contact, telegram_channel_url: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 03. Gestor de Módulos & Páginas Activas */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <SlidersHorizontal size={16} className="text-blue-400" />
                  <span>03. Gestor de Páginas & Módulos</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Activa o desactiva funcionalidades públicas según tus necesidades de operación o mantenimiento.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      key: 'whatsapp_channel_enabled',
                      label: 'Canal de Alertas WhatsApp',
                      desc: 'Muestra el botón y widget de suscripción directa a WhatsApp.',
                      badge: 'Comunidad'
                    },
                    {
                      key: 'telegram_channel_enabled',
                      label: 'Canal de Alertas Telegram',
                      desc: 'Muestra el botón de unión al canal oficial de Telegram.',
                      badge: 'Comunidad'
                    },
                    {
                      key: 'scraper_enabled',
                      label: 'Motor Scraper SERVIR',
                      desc: 'Ingesta automática diaria multicanal de convocatorias oficiales.',
                      badge: 'Automático'
                    },
                    {
                      key: 'public_submissions_enabled',
                      label: 'Recepción de Solicitudes (/publicar-empleo)',
                      desc: 'Permite que anunciantes registren ofertas para moderación.',
                      badge: 'Público'
                    },
                    {
                      key: 'salary_calculator_enabled',
                      label: 'Calculadora Laboral (/calculadora-sueldo)',
                      desc: 'Deducciones de ley en planilla vs CAS vs recibos por honorarios.',
                      badge: 'Herramienta'
                    },
                    {
                      key: 'regimes_comparator_enabled',
                      label: 'Comparador de Regímenes (/comparador-regimenes)',
                      desc: 'Guía legal oficial D.L. 1057 vs 728 vs 276.',
                      badge: 'Herramienta'
                    },
                    {
                      key: 'ai_simulator_enabled',
                      label: 'Simulador de Entrevistas IA (/simulador-entrevista-ia)',
                      desc: 'Entrenador de preguntas y respuestas con Inteligencia Artificial.',
                      badge: 'IA'
                    },
                    {
                      key: 'cv_generator_enabled',
                      label: 'Generador de Formatos CAS (/crear-cv-cas)',
                      desc: 'Plantillas oficiales de declaraciones juradas y anexos.',
                      badge: 'Formatos'
                    },
                    {
                      key: 'adsense_enabled',
                      label: 'Slots de Google AdSense',
                      desc: 'Visualización de banners publicitarios y monetización.',
                      badge: 'Monetización'
                    }
                  ].map((mod) => {
                    const isChecked = Boolean((siteConfig.modules as any)[mod.key]);
                    return (
                      <div
                        key={mod.key}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{mod.label}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                              {mod.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">{mod.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              setSiteConfig({
                                ...siteConfig,
                                modules: {
                                  ...siteConfig.modules,
                                  [mod.key]: e.target.checked
                                }
                              });
                            }}
                            className="sr-only"
                          />
                          <div className={`w-10 h-5.5 rounded-full transition-colors duration-200 ease-in-out flex items-center p-0.5 ${isChecked ? 'bg-blue-600 border border-blue-500 shadow-sm shadow-blue-500/20' : 'bg-slate-800 border border-slate-700'}`}>
                            <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ease-in-out shadow ${isChecked ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botón Guardar Inferior */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs font-display flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isSavingConfig ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
                  <span>{isSavingConfig ? 'Guardando Configuración...' : 'Guardar Toda la Configuración'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: GOOGLE ADSENSE, SEARCH CONSOLE & MONETIZATION */}
      {activeTab === 'ads' && (
        <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="text-emerald-400" size={18} />
                <span>Google AdSense, Search Console & Monetización</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Control en tiempo real de tu Publisher ID, bloques de anuncios (`AdBannerSlot`), `ads.txt` y verificación de Google Search Console.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingConfig}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-display flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              {isSavingConfig ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
              <span>{isSavingConfig ? 'Guardando...' : 'Guardar Cambios AdSense & SEO'}</span>
            </button>
          </div>

          {configSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{configSuccessMsg}</span>
            </div>
          )}

          {/* Switch Maestro y Publisher ID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-white block">Estado Maestro de Google AdSense</span>
                  <span className="text-[11px] text-slate-400">Habilita o pausa la inyección de scripts y bloques publicitarios en todo el portal.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={Boolean(siteConfig.modules?.adsense_enabled ?? true)}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setSiteConfig({
                        ...siteConfig,
                        modules: { ...siteConfig.modules, adsense_enabled: enabled },
                        monetization: { ...(siteConfig.monetization || {}), adsense_enabled: enabled }
                      });
                    }}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center p-0.5 ${siteConfig.modules?.adsense_enabled !== false ? 'bg-emerald-500' : 'bg-slate-800 border border-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow ${siteConfig.modules?.adsense_enabled !== false ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  Google AdSense Publisher ID (ca-pub-XXXXXXXXXXXX)
                </label>
                <input
                  type="text"
                  placeholder="ca-pub-5414009811868137"
                  value={siteConfig.monetization?.adsense_client_id || 'ca-pub-5414009811868137'}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      monetization: {
                        ...(siteConfig.monetization || {}),
                        adsense_client_id: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-500">
                  Se sincroniza automáticamente con la etiqueta meta <code className="text-slate-300">google-adsense-account</code> y con <code className="text-slate-300">/ads.txt</code>.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  Token de Verificación Google Search Console
                </label>
                <input
                  type="text"
                  placeholder="Pega aquí el código content de google-site-verification"
                  value={siteConfig.seo.google_search_console_token || ''}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      seo: { ...siteConfig.seo, google_search_console_token: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Slots Publicitarios */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <SlidersHorizontal size={15} /> IDs de Bloques de Anuncios (Ad Units / Slots)
              </span>
              <p className="text-[11px] text-slate-400">
                Si usas solo <strong>Auto Ads (Anuncios Automáticos)</strong>, puedes dejar estos campos en blanco para evitar espacios vacíos. Si creaste bloques manuales en AdSense, coloca sus números de `data-ad-slot` aquí:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300">Slot Leaderboard (Superior)</label>
                  <input
                    type="text"
                    placeholder="Ej. 1234567890"
                    value={siteConfig.monetization?.adsense_slot_header || ''}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        monetization: {
                          ...(siteConfig.monetization || {}),
                          adsense_slot_header: e.target.value.replace(/\D/g, ''),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300">Slot In-Feed (Entre Empleos)</label>
                  <input
                    type="text"
                    placeholder="Ej. 2345678901"
                    value={siteConfig.monetization?.adsense_slot_incontent || ''}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        monetization: {
                          ...(siteConfig.monetization || {}),
                          adsense_slot_incontent: e.target.value.replace(/\D/g, ''),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300">Slot Sidebar / Lateral (600px)</label>
                  <input
                    type="text"
                    placeholder="Ej. 3456789012"
                    value={siteConfig.monetization?.adsense_slot_sidebar || ''}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        monetization: {
                          ...(siteConfig.monetization || {}),
                          adsense_slot_sidebar: e.target.value.replace(/\D/g, ''),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300">Slot Billboard (Inferior)</label>
                  <input
                    type="text"
                    placeholder="Ej. 4567890123"
                    value={siteConfig.monetization?.adsense_slot_footer || ''}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        monetization: {
                          ...(siteConfig.monetization || {}),
                          adsense_slot_footer: e.target.value.replace(/\D/g, ''),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Vista Previa Dinámica de /ads.txt
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                El endpoint <a href="https://empleos.atpdev.dev/ads.txt" target="_blank" rel="noopener noreferrer" className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded underline">empleos.atpdev.dev/ads.txt</a> sirve automáticamente tu Publisher ID real:
              </p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-emerald-300 border border-slate-800">
                google.com, {(siteConfig.monetization?.adsense_client_id || 'pub-5414009811868137').trim().replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Endpoints SEO & Google Search Console
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rutas listas para enviar en Google Search Console (con protección anti-Soft 404, Consent Mode v2 y notificación automática IndexNow al aprobar convocatorias):
              </p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                <a href="https://empleos.atpdev.dev/sitemap.xml" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/50">/sitemap.xml</a>
                <a href="https://empleos.atpdev.dev/rss.xml" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/50">/rss.xml</a>
                <a href="https://empleos.atpdev.dev/robots.txt" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/50">/robots.txt</a>
                <a href="https://empleos.atpdev.dev/llms.txt" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/50">/llms.txt</a>
              </div>
            </div>
          </div>

          {/* Google for Jobs — Indexing API Instantánea (URL_UPDATED / URL_DELETED) */}
          <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Zap size={16} /> Google for Jobs — Indexing API Instantánea (URL_UPDATED / URL_DELETED)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Conecta tu Cuenta de Servicio (Service Account JSON) de Google Cloud con permisos de Propietario en Search Console para indexar nuevas convocatorias en menos de 5 minutos.
                </p>
              </div>
              <label className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold cursor-pointer shrink-0 flex items-center gap-1.5">
                <Upload size={13} />
                <span>Cargar JSON de Service Account</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const parsed = JSON.parse(String(ev.target?.result || '{}'));
                        if (parsed.client_email && parsed.private_key) {
                          setSiteConfig({
                            ...siteConfig,
                            seo: {
                              ...siteConfig.seo,
                              google_indexing_enabled: true,
                              google_indexing_client_email: parsed.client_email,
                              google_indexing_private_key: parsed.private_key,
                            },
                          });
                          setIndexPingResult(`✅ JSON cargado (${parsed.client_email}). Haz clic en "Guardar Cambios AdSense & SEO" arriba para persistirlo.`);
                        } else {
                          alert('El archivo JSON no contiene client_email o private_key de Google Cloud.');
                        }
                      } catch {
                        alert('Archivo JSON inválido.');
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Service Account Email (`client_email`)</label>
                <input
                  type="text"
                  placeholder="indexing-bot@tu-proyecto.iam.gserviceaccount.com"
                  value={siteConfig.seo.google_indexing_client_email || ''}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      seo: { ...siteConfig.seo, google_indexing_client_email: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Private Key (`-----BEGIN PRIVATE KEY-----`)</label>
                <input
                  type="password"
                  placeholder="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQE..."
                  value={siteConfig.seo.google_indexing_private_key || ''}
                  onChange={(e) =>
                    setSiteConfig({
                      ...siteConfig,
                      seo: { ...siteConfig.seo, google_indexing_private_key: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Probador Manual de Indexación Instantánea */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="text-[11px] font-mono text-slate-300 block">
                Notificar URL manualmente a Google Indexing API + IndexNow:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={manualIndexUrl}
                  onChange={(e) => setManualIndexUrl(e.target.value)}
                  placeholder="https://empleos.atpdev.dev/empleos/..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  disabled={isPingingIndex}
                  onClick={async () => {
                    setIsPingingIndex(true);
                    setIndexPingResult(null);
                    try {
                      const res = await pingGoogleIndexingManualAction(manualIndexUrl, 'URL_UPDATED');
                      setIndexPingResult(res.message);
                    } catch (err: any) {
                      setIndexPingResult(`Error: ${err?.message || 'Fallo al notificar'}`);
                    } finally {
                      setIsPingingIndex(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-display cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  {isPingingIndex ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  <span>Indexar URL Ahora</span>
                </button>
              </div>
              {indexPingResult && (
                <p className="text-[11px] font-mono text-emerald-300 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg">
                  {indexPingResult}
                </p>
              )}
            </div>
          </div>
        </form>
      )}

      {/* MODAL DE EDICIÓN PROFESIONAL DE CONVOCATORIA */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white">
                    Editar Convocatoria Laboral
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    ID: {editingJob.id} • Slug: {editingJob.slug}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulario Completo de Edición */}
            <form onSubmit={handleSaveEditedJob} className="space-y-6">
              {/* SECCIÓN 1: DATOS DEL PUESTO Y ENTIDAD */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <span>01.</span> Información del Puesto & Entidad Convocante
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Título */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Título de la Convocatoria / Puesto *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingJob.title}
                      onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Entidad */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Entidad Pública o Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingJob.entity_name}
                      onChange={(e) => setEditingJob({ ...editingJob, entity_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* RUC */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      RUC SUNAT (11 dígitos para verificación)
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="Ej. 20131370645"
                      value={editingJob.entity_ruc || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, entity_ruc: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Régimen */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Régimen Laboral *
                    </label>
                    <select
                      value={editingJob.sector_type}
                      onChange={(e) => setEditingJob({ ...editingJob, sector_type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
                    >
                      {REGIMENES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Región */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Región / Sede Geográfica *
                    </label>
                    <select
                      value={editingJob.region}
                      onChange={(e) => setEditingJob({ ...editingJob, region: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {REGIONES_PERU.map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>

                  {/* Área / Categoría */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Área o Categoría Profesional
                    </label>
                    <select
                      value={editingJob.category || 'Administración y Gestión Pública'}
                      onChange={(e) => setEditingJob({ ...editingJob, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {CATEGORIAS_EMPLEO.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nivel Educativo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Nivel Educativo Mínimo
                    </label>
                    <select
                      value={editingJob.education_level || 'Bachiller'}
                      onChange={(e) => setEditingJob({ ...editingJob, education_level: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {NIVELES_EDUCATIVOS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  {/* Remuneración */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Remuneración en Soles *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. S/. 4,500 Soles"
                      value={editingJob.salary_text}
                      onChange={(e) => setEditingJob({ ...editingJob, salary_text: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Vacantes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Número de Vacantes *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={editingJob.vacancies_count}
                      onChange={(e) => setEditingJob({ ...editingJob, vacancies_count: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: LOGO / ISOTIPO INSTITUCIONAL COMPLETO */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon size={14} />
                      <span>02. Logo o Isotipo Institucional</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Sube el logo oficial, captúralo automáticamente del sitio web o ingresa una URL directa.
                    </p>
                  </div>

                  {/* Selector de Modos de Logo */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEditLogoMode('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        editLogoMode === 'upload'
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload size={12} />
                      <span>Subir Archivo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditLogoMode('web');
                        if (!editingJob.entity_logo && editingJob.apply_url) {
                          const captured = extractLogoFromDomain(editingJob.apply_url);
                          if (captured) setEditingJob({ ...editingJob, entity_logo: captured });
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        editLogoMode === 'web'
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Globe size={12} />
                      <span>Capturar de Web</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditLogoMode('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        editLogoMode === 'url'
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Link2 size={12} />
                      <span>Enlace URL</span>
                    </button>
                  </div>
                </div>

                {/* Controles según el Modo seleccionado */}
                {editLogoMode === 'upload' && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <Upload size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Seleccionar archivo desde tu dispositivo</h5>
                        <p className="text-[10px] text-slate-400 font-mono">PNG, JPG, WebP o SVG (Máximo 2 MB)</p>
                      </div>
                    </div>
                    <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold font-mono border border-slate-700 cursor-pointer transition-colors shrink-0">
                      <span>Explorar Imagen...</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        onChange={(e) => handleLogoFileUpload(e, (b64) => setEditingJob({ ...editingJob, entity_logo: b64 }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {editLogoMode === 'web' && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Globe size={14} className="absolute left-3.5 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder={editingJob.apply_url || "Ej: unajma.edu.pe, mef.gob.pe o bcp.com.pe"}
                        value={editCustomWebDomain}
                        onChange={(e) => setEditCustomWebDomain(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const target = editCustomWebDomain || editingJob.apply_url;
                        if (!target) {
                          alert('Ingresa una URL o dominio web para capturar el logo.');
                          return;
                        }
                        const captured = extractLogoFromDomain(target);
                        if (captured) {
                          setEditingJob({ ...editingJob, entity_logo: captured });
                        } else {
                          alert('No se pudo identificar el dominio web.');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      <Sparkles size={13} />
                      <span>Capturar Logo Web</span>
                    </button>
                  </div>
                )}

                {editLogoMode === 'url' && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <input
                      type="url"
                      placeholder="https://entidad.gob.pe/logo.png"
                      value={editingJob.entity_logo || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, entity_logo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                )}

                {/* Previsualización del Logo en Tiempo Real */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div className="flex items-center gap-3">
                    {editingJob.entity_logo ? (
                      <img
                        src={editingJob.entity_logo}
                        alt="Vista previa del logo"
                        className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-700 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                        <Building2 size={20} />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Vista Previa del Isotipo</span>
                        {editingJob.entity_logo ? (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            ✓ Logo Configurado
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                            Sin Logo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono truncate max-w-sm sm:max-w-md">
                        {editingJob.entity_logo
                          ? 'Este isotipo se mostrará en portada, buscador y Google Jobs'
                          : 'Usará escudo institucional estándar por defecto'}
                      </div>
                    </div>
                  </div>

                  {editingJob.entity_logo && (
                    <button
                      type="button"
                      onClick={() => setEditingJob({ ...editingJob, entity_logo: '' })}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Quitar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SECCIÓN 3: REQUISITOS Y DESCRIPCIÓN */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <span>03.</span> Requisitos y Descripción del Empleo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Requisitos */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Requisitos del Puesto (Un requisito por cada línea)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="- Título Profesional en la especialidad solicitada&#10;- Experiencia laboral mínima de 2 años en el sector público&#10;- Conocimientos acreditados en SIGA/SIAF"
                      value={typeof editingJob.requirements === 'string' ? editingJob.requirements : Array.isArray(editingJob.requirements) ? editingJob.requirements.join('\n') : ''}
                      onChange={(e) => setEditingJob({ ...editingJob, requirements: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Descripción y Funciones Principales
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Breve resumen del perfil requerido, funciones operativas del puesto y marco de contratación institucional..."
                      value={editingJob.description || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: ENLACES, CALENDARIO Y CONTACTO */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <span>04.</span> Enlaces Oficiales, Calendario & Contacto
                  </h4>
                  <button
                    type="button"
                    disabled={isResolvingRealBases}
                    onClick={async () => {
                      if (!editingJob) return;
                      setIsResolvingRealBases(true);
                      setRealBasesStatusMsg(null);
                      try {
                        const res = await resolveOfficialBasesAdminAction({
                          slug: editingJob.slug,
                          title: editingJob.title,
                          entityName: editingJob.entity_name,
                          region: editingJob.region,
                          salaryText: editingJob.salary_text,
                          vacanciesCount: editingJob.vacancies_count,
                          endDate: editingJob.end_date,
                          existingBasesPdfUrl: editingJob.bases_pdf_url,
                          existingApplyUrl: editingJob.apply_url
                        });
                        if (res.ok) {
                          setEditingJob({
                            ...editingJob,
                            apply_url: res.applyUrl || editingJob.apply_url,
                            bases_pdf_url: res.basesPdfUrl || editingJob.bases_pdf_url,
                            official_documents: res.officialDocuments || editingJob.official_documents,
                            requirements: res.requirements?.length ? res.requirements.join('\n') : editingJob.requirements
                          });
                        }
                        setRealBasesStatusMsg(res.message);
                      } catch {
                        setRealBasesStatusMsg('Error al conectar con el motor Scrapling.');
                      } finally {
                        setIsResolvingRealBases(false);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isResolvingRealBases ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                    <span>{isResolvingRealBases ? 'Extrayendo con Scrapling...' : 'Extraer Bases y Portal Oficial 100% Real (Scrapling)'}</span>
                  </button>
                </div>
                {realBasesStatusMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                    {realBasesStatusMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Enlace Postulación */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Enlace Oficial de Postulación (Portal Institucional) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://convocatorias.entidad.gob.pe"
                      value={editingJob.apply_url}
                      onChange={(e) => setEditingJob({ ...editingJob, apply_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Enlace Bases PDF */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Enlace a Bases Oficiales (PDF o Drive Directo)
                    </label>
                    <input
                      type="url"
                      placeholder="https://archivos.entidad.gob.pe/bases.pdf"
                      value={editingJob.bases_pdf_url || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, bases_pdf_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Fecha Inicio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Fecha de Publicación / Inicio
                    </label>
                    <input
                      type="date"
                      value={editingJob.start_date || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, start_date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Fecha Fin */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Fecha Límite de Postulación (Vigencia) *
                    </label>
                    <input
                      type="date"
                      required
                      value={editingJob.end_date}
                      onChange={(e) => setEditingJob({ ...editingJob, end_date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Estado de Publicación */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Estado de la Convocatoria
                    </label>
                    <select
                      value={editingJob.status}
                      onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as any })}
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none bg-slate-950 ${
                        editingJob.status === 'Vigente'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : editingJob.status === 'Finalizado'
                          ? 'text-rose-400 border-rose-500/40'
                          : 'text-amber-400 border-amber-500/40'
                      }`}
                    >
                      <option value="Vigente">🟢 Vigente (Visible en Chamba Pro)</option>
                      <option value="Finalizado">🔴 Finalizado (Cerrado)</option>
                      <option value="Pendiente">🟡 Pendiente (Revisión interna)</option>
                    </select>
                  </div>

                  {/* Correo Contacto */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Correo Institucional de Contacto (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="rrhh@entidad.gob.pe"
                      value={editingJob.contact_email || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, contact_email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Teléfono Contacto */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Teléfono o WhatsApp de Consultas (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="(01) 611-1234 o +51 987654321"
                      value={editingJob.contact_phone || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, contact_phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Destacado y Verificado */}
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingJob.featured || false}
                        onChange={(e) => setEditingJob({ ...editingJob, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                      <span>⭐ Destacar en la portada principal de Chamba Pro</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingJob.entity_verified || false}
                        onChange={(e) => setEditingJob({ ...editingJob, entity_verified: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                      <span>✓ Marcar como RUC y Entidad Verificada</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer de Acciones */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingJob.id);
                    setEditingJob(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Eliminar Convocatoria</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingJob(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isEditingSaving}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black font-display flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isEditingSaving ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                    <span>{isEditingSaving ? 'Guardando Cambios...' : 'Guardar Cambios'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULLSCREEN STUDIO MODAL (EXACT SAME AS ATP DEV THEME BUILDER) */}
      {/* ========================================================= */}
      {isStudioModalOpen && (
        <div className="fixed inset-0 z-[100] flex bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          
          {/* LOAD DYNAMIC FONTS FOR STUDIO */}
          <link 
            rel="stylesheet" 
            href={`https://fonts.googleapis.com/css2?family=${fontHeadline.replace(/ /g, '+')}:wght@700;900&family=${fontBody.replace(/ /g, '+')}:wght@400;500&family=${fontLabel.replace(/ /g, '+')}:wght@400;600&display=swap`} 
          />

          {/* LEFT SIDEBAR: CONTROLS */}
          <div className="w-full max-w-[420px] h-full bg-[#0B0F17] border-r border-slate-800 flex flex-col shadow-2xl relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#070A0F]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Palette size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-widest">Theme Studio Pro</h2>
                  <p className="text-[10px] text-slate-400 font-mono">Subdominio: empleos.atpdev.dev (:3005)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsStudioModalOpen(false)} 
                type="button" 
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar Diseñador"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Controls Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {/* ✨ 1. IA THEME STUDIO */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-[#0A0A0B] border border-slate-800 rounded-2xl p-3 flex flex-col items-stretch gap-2 overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Sparkles size={11} /> IA Theme Studio
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                      Gemini Pro
                    </span>
                  </div>
                  <textarea 
                    placeholder="Ej: Cyberpunk neón verde esmeralda con fondos oscuros profundos y acentos cyan..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border-0 text-xs text-white focus:ring-0 focus:outline-none placeholder-slate-500 resize-none p-1"
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
                        <div className={`block w-7 h-4 rounded-full transition-colors ${aiIncludeBackground ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${aiIncludeBackground ? 'transform translate-x-3' : ''}`}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover/toggle:text-slate-200 font-medium transition-colors">Generar fondo</span>
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        setIsAiLoading(true);
                        try {
                          const res = await suggestThemeWithAI(themeMode, aiPrompt, aiIncludeBackground);
                          if (res && res.data) {
                            setColorTheme("custom");
                            setPrimary(res.data.primary);
                            setSecondary(res.data.secondary);
                            setTertiary(res.data.tertiary);
                            setNeutral(res.data.neutral);
                            setSeedColor(res.data.primary);
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
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs py-1.5 px-3.5 rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      <span>{isAiLoading ? 'Generando...' : 'Get started'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. MODO VISUAL */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Sun size={14} className="text-amber-400" />
                    <span>Modo Visual del Portal</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {themeMode}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                      themeMode === 'dark' ? 'bg-slate-900 border-emerald-500 text-white ring-1 ring-emerald-500/40' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon size={15} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Modo Oscuro</p>
                      <p className="text-[9px] text-slate-400">Cyberpunk / Oficial</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                      themeMode === 'light' ? 'bg-slate-900 border-amber-500 text-white ring-1 ring-amber-500/40' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun size={15} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Modo Claro</p>
                      <p className="text-[9px] text-slate-400">Luminoso / Editorial</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. FONDO GLOBAL */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fondo Global (Opcional)</span>
                <button
                  type="button"
                  onClick={() => setShowGradientBuilder(true)}
                  className={`w-full flex items-center justify-between border font-bold text-xs p-2.5 rounded-xl transition-all cursor-pointer ${
                    globalBackgroundImage ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/50 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-emerald-500 to-cyan-400 shadow-inner" />
                    <span>{globalBackgroundImage ? "Fondo Animado Activo" : "Diseñar Fondo Animado"}</span>
                  </div>
                  {globalBackgroundImage ? (
                    <div onClick={(e) => { e.stopPropagation(); setGlobalBackgroundImage(""); }} className="p-1 hover:bg-white/20 rounded-md">
                      <X size={14} className="text-white" />
                    </div>
                  ) : (
                    <Sparkles size={14} className="text-slate-500" />
                  )}
                </button>
              </div>

              {/* 4. SEED COLOR & ALGORITMO MD3 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Palette size={14} className="text-emerald-400" />
                  <span>Seed Color & Algoritmo</span>
                </h4>
                <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl p-2 pr-3">
                  <input 
                    type="color" 
                    value={seedColor} 
                    onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                    className="w-7 h-7 rounded-full cursor-pointer border-0 p-0" 
                    style={{ clipPath: "circle(50%)" }}
                  />
                  <input
                    type="text" 
                    value={seedColor} 
                    onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                    className="font-mono text-white text-xs flex-1 bg-transparent border-0 p-0 focus:outline-none font-bold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(Object.entries(ACCENT_COLOR_MAP) as [SubdomainTheme['accent_name'], { hex: string; name: string; glow: string }][]).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSeedColor(val.hex);
                        if (colorTheme === 'custom') setPrimary(val.hex);
                      }}
                      className={`p-1.5 rounded-lg border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                        seedColor.toLowerCase() === val.hex.toLowerCase()
                          ? 'bg-slate-900 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-md shrink-0 border border-white/10" style={{ backgroundColor: val.hex }} />
                      <span className="text-[10px] font-bold truncate">{val.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. PALETA FINAL */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paleta Final MD3</span>
                <div className="space-y-1.5">
                  {[
                    { label: "Primary (Acento)", val: primary, setVal: setPrimary },
                    { label: "Secondary (Fondos)", val: secondary, setVal: setSecondary },
                    { label: "Tertiary (Tarjetas)", val: tertiary, setVal: setTertiary },
                    { label: "Neutral (Bordes)", val: neutral, setVal: setNeutral },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={c.val} 
                          onChange={(e) => { setColorTheme("custom"); c.setVal(e.target.value.toUpperCase()); }}
                          className="w-5 h-5 rounded-full cursor-pointer border-0 p-0" 
                          style={{ clipPath: "circle(50%)" }}
                        />
                        <span className="text-[11px] font-bold text-slate-300">{c.label}</span>
                      </div>
                      <input
                        type="text" 
                        value={c.val} 
                        onChange={(e) => { setColorTheme("custom"); c.setVal(e.target.value.toUpperCase()); }}
                        className="font-mono text-[11px] font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-700 w-20 text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. TIPOGRAFÍAS */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <FileText size={14} className="text-emerald-400" />
                  <span>Google Fonts</span>
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "Headline", val: fontHeadline, setVal: setFontHeadline, opts: ["Space Grotesk", "Hanken Grotesk", "Inter", "Outfit", "Plus Jakarta Sans", "Syne"] },
                    { label: "Body", val: fontBody, setVal: setFontBody, opts: ["Inter", "Roboto", "Open Sans", "DM Sans", "Manrope"] },
                    { label: "Label", val: fontLabel, setVal: setFontLabel, opts: ["IBM Plex Mono", "JetBrains Mono", "Fira Code", "Space Mono"] },
                  ].map((font) => (
                    <div key={font.label} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
                      <span className="text-[10px] text-slate-400 font-bold w-16">{font.label}:</span>
                      <select 
                        value={font.val} 
                        onChange={(e) => font.setVal(e.target.value)}
                        className="flex-1 bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer truncate"
                      >
                        {font.opts.map(opt => <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. RADIUS */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bordes (Radius)</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: "none", label: "0px", class: "rounded-none" },
                    { id: "small", label: "6px", class: "rounded-sm" },
                    { id: "medium", label: "16px", class: "rounded-xl" },
                    { id: "full", label: "Full", class: "rounded-full" },
                  ].map((r) => (
                    <button
                      key={r.id} 
                      type="button" 
                      onClick={() => setRadiusScale(r.id as any)}
                      className={`h-12 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        radiusScale === r.id ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <div className={`w-3 h-3 border-t-2 border-l-2 ${radiusScale === r.id ? 'border-emerald-400' : 'border-slate-500'} ${r.class}`}></div>
                      <span className="text-[8px] font-bold">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. INTERACCIÓN MOUSE & NEÓN */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Zap size={14} className="text-amber-400" />
                  <span>Laboratorio de Interacción</span>
                </h4>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  {[
                    { id: 'spotlight-border', label: 'Reflector Neón', icon: <Sparkles size={12} className="text-emerald-400" /> },
                    { id: 'full-border', label: 'Borde Neón Completo', icon: <Square size={12} className="text-teal-400" /> },
                    { id: 'spotlight-full', label: 'Relleno Neón', icon: <Sparkles size={12} className="text-cyan-400" /> },
                    { id: 'electric', label: 'Reflector Eléctrico', icon: <Zap size={12} className="text-amber-400" /> },
                    { id: 'electric-full', label: 'Borde Eléctrico Completo', icon: <Zap size={12} className="text-amber-400" /> },
                    { id: 'tilt', label: 'Inclinación 3D', icon: <div className="w-2 h-2 border border-emerald-400 transform rotate-12" /> },
                    { id: 'ripple', label: 'Ondas (Clic)', icon: <div className="w-2 h-2 rounded-full border border-cyan-400" /> },
                    { id: 'burst', label: 'Explosión (Clic)', icon: <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" /> },
                    { id: 'glitch', label: 'Texto Glitch', icon: <span className="text-red-400 font-mono text-[8px] font-bold">X</span> },
                    { id: 'magnet', label: 'Magnetismo', icon: <div className="w-2 h-2 border-2 border-indigo-400 rounded-t-full" /> },
                    { id: 'none', label: 'Ninguno', icon: <div className="w-2 h-0.5 bg-slate-500" /> }
                  ].map(effect => {
                    const isActive = mouseEffects.includes(effect.id) || (effect.id === 'none' && mouseEffects.length === 0);
                    return (
                      <button
                        key={effect.id}
                        type="button"
                        onClick={() => {
                          if (effect.id === 'none') { setMouseEffects(['none']); return; }
                          setMouseEffects(prev => {
                            let next = prev.filter(e => e !== 'none' && e !== 'neon-multi' && e !== 'neon-harmonic');
                            if (effect.id === 'spotlight-border') next = next.filter(e => e !== 'electric' && e !== 'full-border' && e !== 'electric-full');
                            else if (effect.id === 'full-border') next = next.filter(e => e !== 'electric' && e !== 'spotlight-border' && e !== 'electric-full');
                            else if (effect.id === 'electric') next = next.filter(e => e !== 'spotlight-border' && e !== 'full-border' && e !== 'electric-full');
                            else if (effect.id === 'electric-full') next = next.filter(e => e !== 'spotlight-border' && e !== 'full-border' && e !== 'electric');
                            if (next.includes(effect.id)) next = next.filter(e => e !== effect.id);
                            else next = [...next, effect.id];
                            if (prev.includes('neon-multi')) next.push('neon-multi');
                            if (prev.includes('neon-harmonic')) next.push('neon-harmonic');
                            return next.length === 0 ? ['none'] : next;
                          });
                        }}
                        className={`flex items-center gap-2.5 px-3 py-1.5 text-left border-b border-slate-800 last:border-0 cursor-pointer ${isActive ? 'bg-emerald-500/10' : 'hover:bg-slate-800/60'}`}
                      >
                        <div className={`w-3.5 h-3.5 flex items-center justify-center rounded border ${isActive ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-950 border-slate-700'}`}>
                          {isActive && <div className="w-1 h-1 bg-slate-950 rounded-sm" />}
                        </div>
                        <div className="w-4 h-4 flex items-center justify-center">{effect.icon}</div>
                        <span className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{effect.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 9. CURSOR GLOBAL */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cursor Animado Global</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'cursor-ia', label: 'Estudio IA' },
                    { id: 'cursor-dot', label: 'Punto Neón' },
                    { id: 'cursor-trail', label: 'Estela' },
                    { id: 'cursor-bubbles', label: 'Burbujas' },
                    { id: 'cursor-crosshair', label: 'Láser' },
                    { id: 'cursor-pulse', label: 'Radar' },
                    { id: 'cursor-off', label: 'Nativo (OS)' },
                  ].map((cur) => {
                    const isActive = cur.id === 'cursor-off'
                      ? mouseEffects.includes('cursor-off')
                      : (mouseEffects.includes(cur.id) || (!mouseEffects.some(e => e.startsWith('cursor-')) && cur.id === 'cursor-ia'));
                    return (
                      <button
                        key={cur.id}
                        type="button"
                        onClick={() => setMouseEffects(prev => [...prev.filter(e => !e.startsWith('cursor-')), cur.id])}
                        className={`py-1.5 px-1 rounded-xl border font-bold text-[9px] flex items-center justify-center transition-all cursor-pointer ${
                          cur.id === 'cursor-off' ? 'col-span-3' : ''
                        } ${isActive ? "bg-emerald-500/20 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}
                      >
                        {cur.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-800 bg-[#070A0F] flex items-center gap-3">
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleSaveTheme()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs font-display flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
              >
                {isSavingConfig ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
                <span>{isSavingConfig ? 'Guardando...' : 'Aplicar y Guardar Tema'}</span>
              </button>
              <button 
                onClick={() => setIsStudioModalOpen(false)} 
                type="button"
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: FULLSCREEN LIVE PREVIEW */}
          <div className="flex-1 relative bg-[#050505] hidden md:flex flex-col">
            <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Preview: <strong className="text-purple-400">empleos.atpdev.dev (:3005)</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewDevice === 'desktop' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Laptop size={13} />
                    <span>100%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewDevice === 'tablet' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Tablet size={13} />
                    <span>Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewDevice === 'mobile' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Smartphone size={13} />
                    <span>Móvil</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIframeRefreshKey(k => k + 1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800 cursor-pointer"
                  title="Recargar vista previa"
                >
                  <RefreshCw size={14} />
                </button>
                <a
                  href={chambaLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors border border-slate-800 cursor-pointer"
                  title="Abrir portal en pestaña nueva"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="flex-1 bg-[#030712] flex items-center justify-center p-4 overflow-hidden">
              <div
                className={`transition-all duration-300 bg-[#070a12] shadow-2xl relative ${
                  previewDevice === 'desktop'
                    ? 'w-full h-full rounded-xl border border-slate-800'
                    : previewDevice === 'tablet'
                    ? 'w-[768px] max-w-full h-full rounded-2xl border-4 border-slate-700 ring-2 ring-slate-900'
                    : 'w-[390px] max-w-full h-[800px] rounded-[36px] border-8 border-slate-800 ring-4 ring-slate-950 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                }`}
              >
                {previewDevice === 'mobile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-4 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700 mr-2" />
                    <div className="w-10 h-1 bg-slate-900 rounded-full" />
                  </div>
                )}

                <iframe
                  ref={modalIframeRef}
                  key={`modal-${chambaLiveUrl}-${iframeRefreshKey}`}
                  src={chambaLiveUrl}
                  className="w-full h-full border-0 bg-transparent"
                  title="Chamba Pro Fullscreen Preview"
                  onLoad={() => {
                    sendThemeToIframe(currentTheme);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GRADIENT BUILDER OVERLAY (MATCHING MAIN PORTAL) */}
      {/* ========================================================= */}
      {showGradientBuilder && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col p-4 md:p-10 backdrop-blur-md animate-in fade-in">
          <div className="flex justify-between items-center mb-6 bg-[#111] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Sparkles className="text-emerald-400" /> Diseñador de Fondo Global (Chamba Pro)
              </h3>
              <p className="text-gray-400 text-xs mt-1">Crea un fondo mágico. Cuando termines, haz clic en el botón verde <strong>"Usar como Portada"</strong> dentro del editor.</p>
            </div>
            <button 
              onClick={() => setShowGradientBuilder(false)} 
              className="bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-2.5 rounded-xl font-bold hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          
          <iframe 
            src="/gradient-builder.html" 
            className="w-full flex-1 rounded-3xl border border-gray-800 shadow-2xl bg-black" 
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
      />
    </div>
  );
}
