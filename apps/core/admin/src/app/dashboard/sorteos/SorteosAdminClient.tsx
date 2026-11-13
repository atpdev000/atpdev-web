'use client';

import UnifiedThemeStudio from "@/components/theme/UnifiedThemeStudio";
import { OFFICIAL_APP_URLS, useResolvedPreviewUrl } from "@/lib/preview-url";
import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  GiveawayRecord,
  SorteosUserRecord,
  FeatureFlagRecord,
  SorteosMetricsRecord,
  SubdomainConfig,
  SubdomainTheme,
  ACCENT_COLOR_MAP,
  DEFAULT_SORTEOS_CONFIG
} from '@atpdev/database';
import { 
  Gift, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Check, 
  LayoutGrid, 
  Radio, 
  Clock, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Globe, 
  Copy,
  Sliders,
  Palette, 
  Settings2, 
  SlidersHorizontal,
  Laptop, 
  Tablet, 
  Smartphone, 
  TrendingUp, 
  Users, 
  RotateCcw,
  Instagram,
  Facebook,
  Youtube,
  Dices,
  Lock,
  Unlock,
  Key,
  Flame,
  Award,
  Sun,
  Moon,
  Monitor,
  Wand2,
  Square,
  Zap,
  Loader2,
  ChevronDown,
  Maximize2,
  Layers,
  X
} from 'lucide-react';
import { suggestThemeWithAI } from '../settings/actions';
import { 
  fetchSorteosGiveawaysAction,
  saveSorteosGiveawayAction,
  updateGiveawayStatusAction,
  redrawGiveawayAction,
  deleteGiveawayAction,
  fetchSorteosUsersAction,
  updateUserPlanAction,
  toggleUserStatusAction,
  resetUserCommentsAction,
  updateFeatureFlagAction,
  updateSorteosConfigAction
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
    sec = HSLToHex((h + 330) % 360, Math.min(s * 0.9, 1), isDark ? 0.6 : 0.45); // Pink/Rose cyber accent
    ter = HSLToHex((h + 40) % 360, s * 0.8, isDark ? 0.6 : 0.4);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  } else if (theme === "monochrome") {
    p = seedHex;
    sec = HSLToHex(h, s * 0.2, isDark ? 0.2 : 0.9);
    ter = HSLToHex(h, s * 0.3, isDark ? 0.3 : 0.8);
    neu = HSLToHex(h, 0, isDark ? 0.5 : 0.6);
  } else if (theme === "analogous") {
    p = seedHex;
    sec = HSLToHex((h + 30) % 360, s * 0.7, isDark ? 0.55 : 0.45);
    ter = HSLToHex((h + 60) % 360, s, isDark ? 0.6 : 0.4);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  } else {
    p = seedHex;
    sec = HSLToHex((h + 320) % 360, 0.8, isDark ? 0.55 : 0.45);
    ter = HSLToHex((h + 45) % 360, 0.7, isDark ? 0.55 : 0.45);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  }

  return { primary: p, secondary: sec, tertiary: ter, neutral: neu };
}

interface SorteosAdminClientProps {
  initialGiveaways: GiveawayRecord[];
  initialUsers: SorteosUserRecord[];
  initialFeatureFlags: FeatureFlagRecord[];
  initialMetrics: SorteosMetricsRecord;
  initialConfig?: SubdomainConfig;
}

export default function SorteosAdminClient({
  initialGiveaways,
  initialUsers,
  initialFeatureFlags,
  initialMetrics,
  initialConfig
}: SorteosAdminClientProps) {
  const [giveaways, setGiveaways] = useState<GiveawayRecord[]>(initialGiveaways);
  const [users, setUsers] = useState<SorteosUserRecord[]>(initialUsers);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagRecord[]>(initialFeatureFlags);
  const [metrics] = useState<SorteosMetricsRecord>(initialMetrics);
  const [siteConfig, setSiteConfig] = useState<SubdomainConfig>(initialConfig || DEFAULT_SORTEOS_CONFIG);

  const [activeTab, setActiveTab] = useState<'giveaways' | 'users' | 'create' | 'theme' | 'settings' | 'flags' | 'metrics'>('giveaways');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Live preview iframe reference
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Filter states for Giveaways
  const [searchGiveaway, setSearchGiveaway] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter states for Users
  const [searchUser, setSearchUser] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');

  // Redraw modal state (RF-024)
  const [redrawModalOpen, setRedrawModalOpen] = useState(false);
  const [redrawingGiveaway, setRedrawingGiveaway] = useState<GiveawayRecord | null>(null);
  const [redrawReason, setRedrawReason] = useState('');
  const [isRedrawing, setIsRedrawing] = useState(false);

  // Details drawer
  const [inspectGiveaway, setInspectGiveaway] = useState<GiveawayRecord | null>(null);

  // New Giveaway Form State
  const [newGiveaway, setNewGiveaway] = useState<Partial<GiveawayRecord>>({
    title: '',
    platform: 'instagram',
    postUrl: '',
    authorUsername: '',
    totalCommentsCount: 500,
    status: 'completed',
    rules: {
      excludeDuplicates: true,
      minMentions: 1,
      requiredHashtag: '',
      blockedUsers: [],
      winnersCount: 1,
      substitutesCount: 1
    }
  });
  const [isCreating, setIsCreating] = useState(false);

  // Theme Studio Full Suite (100% Parity with Chamba Pro)
  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'iframe' | 'components'>('iframe');
  const [iframeRefreshKey, setIframeRefreshKey] = useState(0);
  const { previewUrl: sorteosLiveUrl } = useResolvedPreviewUrl(
    'http://localhost:3006',
    OFFICIAL_APP_URLS.sorteos,
    true,
    iframeRefreshKey
  );

  const initialTheme = siteConfig.theme || ({} as any);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(initialTheme.theme_mode === 'light' ? 'light' : 'dark');
  const [seedColor, setSeedColor] = useState(initialTheme.seed_color || initialTheme.accent_color || '#8b5cf6');
  const [colorTheme, setColorTheme] = useState<string>(initialTheme.color_theme || 'vibrant');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiIncludeBackground, setAiIncludeBackground] = useState(false);

  const [primary, setPrimary] = useState(initialTheme.primary_color || initialTheme.accent_color || '#8b5cf6');
  const [secondary, setSecondary] = useState(initialTheme.secondary_color || '#ec4899');
  const [tertiary, setTertiary] = useState(initialTheme.tertiary_color || '#f59e0b');
  const [neutral, setNeutral] = useState(initialTheme.neutral_color || '#070a12');

  const [fontHeadline, setFontHeadline] = useState(initialTheme.font_headline || 'Space Grotesk');
  const [fontBody, setFontBody] = useState(initialTheme.font_body || 'Inter');
  const [fontLabel, setFontLabel] = useState(initialTheme.font_label || 'IBM Plex Mono');
  const [radiusScale, setRadiusScale] = useState<'none' | 'small' | 'medium' | 'full'>(initialTheme.radius_scale || 'full');
  const [mouseEffects, setMouseEffects] = useState<string[]>(() => {
    if (!initialTheme.glow_style) return ['spotlight-border'];
    const arr = initialTheme.glow_style.split(',').map((s: string) => s.trim()).filter(Boolean);
    return arr.map((s: string) => (s === 'spotlight' ? 'spotlight-border' : s));
  });
  const [neonThickness, setNeonThickness] = useState(initialTheme.neon_thickness || '4px');
  const [globalBackgroundImage, setGlobalBackgroundImage] = useState(initialTheme.global_background_image || '');
  const [showGradientBuilder, setShowGradientBuilder] = useState(false);
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

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

  const handleResetToDefault = (targetMode: 'default' | 'monochrome' = 'default') => {
    if (targetMode === 'monochrome') {
      setThemeMode('dark');
      setSeedColor('#FFFFFF');
      setColorTheme('monochrome');
      setPrimary('#FFFFFF');
      setSecondary('#27272A');
      setTertiary('#3F3F46');
      setNeutral('#09090B');
      setGlobalBackgroundImage('');
      sendThemeToIframe({
        accent_color: '#FFFFFF',
        accent_name: 'monochrome',
        theme_mode: 'dark',
        radius_style: 'rounded-3xl',
        radius_scale: 'full',
        seed_color: '#FFFFFF',
        color_theme: 'monochrome',
        primary_color: '#FFFFFF',
        secondary_color: '#27272A',
        tertiary_color: '#3F3F46',
        neutral_color: '#09090B',
        font_headline: 'Space Grotesk',
        font_body: 'Inter',
        font_label: 'IBM Plex Mono',
        glow_style: 'spotlight-border',
        neon_thickness: '4px',
        cursor_effect: 'cursor-ia',
        global_background_image: ''
      });
      setFeedbackMsg({ text: 'Tema aplicado: Blanco y Negro (Minimalista / High-Contrast)', type: 'success' });
    } else {
      const def = DEFAULT_SORTEOS_CONFIG.theme;
      setThemeMode('dark');
      setSeedColor(def.seed_color || '#8b5cf6');
      setColorTheme(def.color_theme || 'neon');
      setPrimary(def.primary_color || '#8b5cf6');
      setSecondary(def.secondary_color || '#ec4899');
      setTertiary(def.tertiary_color || '#f59e0b');
      setNeutral(def.neutral_color || '#070a12');
      setFontHeadline(def.font_headline || 'Space Grotesk');
      setFontBody(def.font_body || 'Inter');
      setFontLabel(def.font_label || 'IBM Plex Mono');
      setRadiusScale((def.radius_scale as any) || 'full');
      setNeonThickness(def.neon_thickness || '4px');
      setGlobalBackgroundImage('');
      const glow = def.glow_style || 'full-border,ripple,burst,glitch,cursor-trail';
      setMouseEffects(glow.split(',').map((s: string) => s.trim()).filter(Boolean));
      sendThemeToIframe({
        ...def,
        accent_color: def.primary_color || '#8b5cf6',
        global_background_image: ''
      });
      setFeedbackMsg({ text: 'Tema restablecido a valores por defecto (Oficial)', type: 'success' });
    }
  };

  // Compute live current theme object
  const currentTheme: SubdomainTheme = useMemo(() => ({
    accent_color: primary,
    accent_name: ((Object.keys(ACCENT_COLOR_MAP) as SubdomainTheme['accent_name'][]).find(
      k => ACCENT_COLOR_MAP[k]?.hex.toLowerCase() === primary.toLowerCase()
    )) || 'custom',
    theme_mode: themeMode,
    radius_scale: radiusScale,
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
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_SORTEOS_THEME', payload }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME_PREVIEW', payload }, '*');
    }
    if (modalIframeRef.current && modalIframeRef.current.contentWindow) {
      modalIframeRef.current.contentWindow.postMessage({ type: 'UPDATE_SORTEOS_THEME', payload }, '*');
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

  // Listen to theme mode changes originated from inside the preview iframe
  useEffect(() => {
    const handleMessageFromPreview = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SORTEOS_THEME_MODE_CHANGED' && (e.data.mode === 'light' || e.data.mode === 'dark')) {
        setThemeMode(e.data.mode);
      }
    };
    window.addEventListener('message', handleMessageFromPreview);
    return () => window.removeEventListener('message', handleMessageFromPreview);
  }, []);

  // Sync to iframe whenever currentTheme changes or activeTab/modal changes
  useEffect(() => {
    if (activeTab === 'theme' || isStudioModalOpen) {
      sendThemeToIframe(currentTheme);
    }
  }, [currentTheme, activeTab, isStudioModalOpen]);

  // Notification helper
  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Copy hash helper
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    notify('Hash criptográfico SHA-256 copiado al portapapeles');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [freshGiveaways, freshUsers] = await Promise.all([
        fetchSorteosGiveawaysAction(),
        fetchSorteosUsersAction()
      ]);
      setGiveaways(freshGiveaways);
      setUsers(freshUsers);
      notify('Datos de Sorteos Pro sincronizados');
    } catch {
      notify('Error al sincronizar datos', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filtered Giveaways
  const filteredGiveaways = useMemo(() => {
    return giveaways.filter(g => {
      const q = searchGiveaway.toLowerCase();
      const matchSearch = !q || 
        g.title.toLowerCase().includes(q) || 
        (g.authorUsername && g.authorUsername.toLowerCase().includes(q)) ||
        (g.verificationHash && g.verificationHash.toLowerCase().includes(q)) ||
        g.id.toLowerCase().includes(q);
      
      const matchPlatform = selectedPlatform === 'all' || g.platform === selectedPlatform;
      const matchStatus = selectedStatus === 'all' || g.status === selectedStatus;

      return matchSearch && matchPlatform && matchStatus;
    });
  }, [giveaways, searchGiveaway, selectedPlatform, selectedStatus]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchUser.toLowerCase();
      const matchSearch = !q || 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      
      const matchPlan = selectedPlan === 'all' || u.plan === selectedPlan;
      return matchSearch && matchPlan;
    });
  }, [users, searchUser, selectedPlan]);

  // Actions for Giveaways
  const handleToggleStatus = async (id: string, current: GiveawayRecord['status']) => {
    const next: GiveawayRecord['status'] = current === 'completed' ? 'cancelled' : current === 'cancelled' ? 'running' : 'completed';
    setGiveaways(prev => prev.map(g => g.id === id ? { ...g, status: next } : g));
    const ok = await updateGiveawayStatusAction(id, next);
    if (ok) notify(`Estado de sorteo actualizado a ${next}`);
    else notify('Error al actualizar estado', 'error');
  };

  const handleDeleteGiveaway = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este sorteo? Esta acción es irreversible.')) return;
    setGiveaways(prev => prev.filter(g => g.id !== id));
    const ok = await deleteGiveawayAction(id);
    if (ok) notify('Sorteo eliminado');
    else notify('Error al eliminar', 'error');
  };

  const handleOpenRedraw = (giveaway: GiveawayRecord) => {
    setRedrawingGiveaway(giveaway);
    setRedrawReason('');
    setRedrawModalOpen(true);
  };

  const handleExecuteRedraw = async () => {
    if (!redrawingGiveaway) return;
    if (!redrawReason.trim()) {
      alert('Debes ingresar el motivo de descalificación o sustitución (ej. "No cumplió menciones requeridas").');
      return;
    }
    setIsRedrawing(true);
    try {
      const res = await redrawGiveawayAction(redrawingGiveaway.id, redrawReason.trim());
      if (res.success && res.newWinner) {
        setGiveaways(prev => prev.map(g => {
          if (g.id === redrawingGiveaway.id) {
            return {
              ...g,
              winners: [res.newWinner, ...g.winners.slice(1)],
              redrawReason: redrawReason.trim(),
              verificationHash: `sha256-redraw-${Date.now().toString(16)}`
            };
          }
          return g;
        }));
        notify(`¡Re-sorteo ejecutado! Nuevo ganador: ${res.newWinner.participant.username}`);
        setRedrawModalOpen(false);
      } else {
        notify(res.error || 'Error al ejecutar re-sorteo', 'error');
      }
    } catch {
      notify('Error en re-sorteo', 'error');
    } finally {
      setIsRedrawing(false);
    }
  };

  // Actions for Users
  const handleUpdatePlan = async (userId: string, newPlan: SorteosUserRecord['plan']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
    const ok = await updateUserPlanAction(userId, newPlan);
    if (ok) notify(`Plan de usuario actualizado a ${newPlan.toUpperCase()}`);
    else notify('Error al actualizar plan', 'error');
  };

  const handleToggleUserStatus = async (userId: string, current: 'active' | 'suspended') => {
    const next = current === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: next } : u));
    const ok = await toggleUserStatusAction(userId, next);
    if (ok) notify(`Usuario marcado como ${next}`);
    else notify('Error al cambiar estado de usuario', 'error');
  };

  const handleResetUserComments = async (userId: string) => {
    if (!confirm('¿Deseas reiniciar a 0 el consumo de comentarios de este usuario?')) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, commentsConsumed: 0 } : u));
    const ok = await resetUserCommentsAction(userId);
    if (ok) notify('Cuota de comentarios restablecida a 0');
    else notify('Error al resetear cuota', 'error');
  };

  // Actions for Feature Flags
  const handleToggleFeatureFlag = async (flagId: string, tier: 'Free' | 'Pro' | 'Business') => {
    const flag = featureFlags.find(f => f.id === flagId);
    if (!flag) return;
    const key = `enabledIn${tier}` as keyof FeatureFlagRecord;
    const nextVal = !flag[key];

    setFeatureFlags(prev => prev.map(f => f.id === flagId ? { ...f, [key]: nextVal } : f));
    const ok = await updateFeatureFlagAction(flagId, { [key]: nextVal });
    if (ok) notify(`Bandera "${flag.name}" actualizada para plan ${tier}`);
  };

  // Actions for Creating Giveaway
  const handleCreateGiveaway = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiveaway.title) {
      alert('Ingresa el título del sorteo');
      return;
    }
    setIsCreating(true);
    try {
      const res = await saveSorteosGiveawayAction({
        ...newGiveaway,
        status: 'completed',
        winners: [
          {
            id: `w-${Date.now()}`,
            position: 1,
            type: 'winner',
            selectedAt: new Date().toISOString(),
            participant: {
              id: `part-${Date.now()}`,
              username: `ganador_express_${Math.floor(Math.random() * 899 + 100)}`,
              name: 'Participante Certificado',
              avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
              commentText: 'Comentario verificado en tiempo real con CSPRNG!',
              isEligible: true
            }
          }
        ],
        substitutes: [
          {
            id: `s-${Date.now()}`,
            position: 1,
            type: 'substitute',
            selectedAt: new Date().toISOString(),
            participant: {
              id: `part-sub-${Date.now()}`,
              username: `suplente_oficial_${Math.floor(Math.random() * 899 + 100)}`,
              name: 'Suplente Registrado',
              isEligible: true
            }
          }
        ]
      });

      if (res.success && res.giveaway) {
        setGiveaways(prev => [res.giveaway!, ...prev]);
        notify(`¡Sorteo "${res.giveaway.title}" creado y certificado exitosamente!`);
        setActiveTab('giveaways');
        setNewGiveaway({
          title: '',
          platform: 'instagram',
          postUrl: '',
          authorUsername: '',
          totalCommentsCount: 500,
          status: 'completed',
          rules: {
            excludeDuplicates: true,
            minMentions: 1,
            requiredHashtag: '',
            blockedUsers: [],
            winnersCount: 1,
            substitutesCount: 1
          }
        });
      } else {
        notify(res.error || 'Error al crear', 'error');
      }
    } catch {
      notify('Error de conexión', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Actions for Theme and Config
  const handleSaveTheme = async (themeToSave?: SubdomainTheme) => {
    const target = themeToSave || currentTheme;
    setIsSavingConfig(true);
    try {
      const res = await updateSorteosConfigAction({ theme: target });
      if (res.success) {
        setSiteConfig(res.config);
        sendThemeToIframe(target);
        notify('¡Tema visual de Sorteos Pro guardado y publicado con éxito!');
      } else {
        notify('Error al guardar tema visual', 'error');
      }
    } catch {
      notify('Error al guardar tema', 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveBranding = async () => {
    setIsSavingConfig(true);
    try {
      const res = await updateSorteosConfigAction({
        branding: siteConfig.branding,
        seo: siteConfig.seo,
        contact: siteConfig.contact
      });
      if (res.success) {
        setSiteConfig(res.config);
        notify('¡Configuración de marca y SEO actualizada!');
      }
    } catch {
      notify('Error al guardar configuración', 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-950 border-emerald-500/40 text-emerald-200 shadow-emerald-900/30' 
            : 'bg-rose-950 border-rose-500/40 text-rose-200 shadow-rose-900/30'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertTriangle size={16} className="text-rose-400" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/20 to-slate-900 border border-violet-500/30 shadow-2xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-mono font-bold border border-violet-500/30">
            <ShieldCheck size={13} />
            <span>SORTEOS PRO CMS — SORTEOS.ATPDEV.DEV • PUERTO 3006</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Centro de Control Global de Sorteos & Certificaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Control de sorteos multi-red (Instagram, Facebook, YouTube), motor criptográfico SHA-256 CSPRNG, administración de cuotas de comentarios y Theme Studio en vivo.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={sorteosLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs border border-white/10 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Ver Sorteos Pro</span>
          </a>
          <button
            onClick={() => setActiveTab('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs transition-all shadow-lg shadow-violet-500/25"
          >
            <Plus size={15} />
            <span>Crear Sorteo Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('giveaways')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'giveaways' 
                ? 'bg-violet-500/15 text-violet-300 border border-violet-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={15} />
            <span>Sorteos ({giveaways.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'users' 
                ? 'bg-violet-500/15 text-violet-300 border border-violet-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={15} />
            <span>Usuarios & Cuotas ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'create' 
                ? 'bg-violet-500/15 text-violet-300 border border-violet-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus size={15} />
            <span>Nuevo Sorteo</span>
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
            <span>Theme Studio Sorteos</span>
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
            <span>Configuración & SEO</span>
          </button>

          <button
            onClick={() => setActiveTab('flags')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'flags' 
                ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={15} className="text-fuchsia-400" />
            <span>Feature Flags ({featureFlags.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'metrics' 
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp size={15} className="text-emerald-400" />
            <span>Métricas & MRR</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
          title="Sincronizar sorteos y estados en tiempo real"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-violet-400' : ''} />
          <span>{isRefreshing ? 'Sincronizando...' : 'Sincronizar'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GIVEAWAYS & AUDITORIA */}
      {/* ========================================================= */}
      {activeTab === 'giveaways' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative md:col-span-2">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por título, cuenta (@usuario) o hash SHA-256..."
                value={searchGiveaway}
                onChange={e => setSearchGiveaway(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div>
              <select
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500/50"
              >
                <option value="all">Todas las plataformas</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="standalone">Standalone / Herramientas</option>
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500/50"
              >
                <option value="all">Todos los estados</option>
                <option value="completed">Completado</option>
                <option value="running">En Ejecución</option>
                <option value="scheduled">Programado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Giveaways Table */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Sorteo & Plataforma</th>
                    <th className="py-3 px-4">Organizador</th>
                    <th className="py-3 px-4">Participantes</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Certificación SHA-256</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredGiveaways.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No se encontraron sorteos con los filtros actuales.
                      </td>
                    </tr>
                  ) : (
                    filteredGiveaways.map((g) => {
                      const platformIcon = g.platform === 'instagram' ? <Instagram size={13} className="text-pink-400" />
                        : g.platform === 'youtube' ? <Youtube size={13} className="text-red-400" />
                        : g.platform === 'facebook' ? <Facebook size={13} className="text-blue-400" />
                        : <Dices size={13} className="text-violet-400" />;

                      const statusBadge = g.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : g.status === 'running' 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : g.status === 'scheduled'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                      return (
                        <tr key={g.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-md bg-slate-800 border border-slate-700">
                                  {platformIcon}
                                </span>
                                <span className="font-bold text-white max-w-xs truncate block" title={g.title}>
                                  {g.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                <span>ID: {g.id}</span>
                                {g.postUrl && (
                                  <a href={g.postUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline flex items-center gap-0.5">
                                    <span>Post</span>
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-200">
                              {g.authorUsername || '@anonimo'}
                            </div>
                            <div suppressHydrationWarning className="text-[10px] text-slate-500">
                              {new Date(g.createdAt).toLocaleDateString()}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <div suppressHydrationWarning className="text-slate-200 font-semibold">
                              {(g.totalCommentsCount || 0).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {g.winners.length} ganadores • {g.substitutes?.length || 0} suplentes
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {g.status.toUpperCase()}
                            </span>
                            {g.redrawReason && (
                              <div className="text-[9px] text-amber-400 mt-1 max-w-[140px] truncate" title={`Re-sorteado: ${g.redrawReason}`}>
                                ⚠️ {g.redrawReason}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {g.verificationHash ? (
                              <div className="flex items-center gap-1.5">
                                <code className="text-[11px] font-mono bg-slate-950 px-2 py-1 rounded text-violet-300 border border-violet-500/20 max-w-[120px] truncate">
                                  {g.verificationHash.slice(0, 12)}...
                                </code>
                                <button
                                  onClick={() => handleCopyHash(g.verificationHash!)}
                                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                                  title="Copiar Hash Completo SHA-256"
                                >
                                  {copiedHash === g.verificationHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-600 text-[10px]">Sin hash generado</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open Landing */}
                              <a
                                href={`${sorteosLiveUrl}/sorteo/${g.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Ver Landing Pública del Sorteo"
                              >
                                <ExternalLink size={13} />
                              </a>

                              {/* Open Certificate */}
                              <a
                                href={`${sorteosLiveUrl}/certificados/${g.certificateId || g.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-violet-950 hover:bg-violet-900 text-violet-300 hover:text-white border border-violet-500/30 transition-colors"
                                title="Ver Certificado Oficial SHA-256"
                              >
                                <Award size={13} />
                              </a>

                              {/* Redraw Button */}
                              {g.status === 'completed' && (
                                <button
                                  onClick={() => handleOpenRedraw(g)}
                                  className="p-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 hover:text-white border border-amber-500/30 transition-colors"
                                  title="Re-sortear / Sustituir Ganador (RF-024)"
                                >
                                  <RotateCcw size={13} />
                                </button>
                              )}

                              {/* Toggle Status */}
                              <button
                                onClick={() => handleToggleStatus(g.id, g.status)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                                title="Alternar Estado"
                              >
                                {g.status === 'completed' ? <XCircle size={13} /> : <CheckCircle size={13} />}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteGiveaway(g.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition-colors"
                                title="Eliminar Sorteo"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: USUARIOS & CUOTAS */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Metrics Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 text-xs font-medium">Total Creadores Registrados</p>
              <p className="text-2xl font-black text-white mt-1">{users.length}</p>
              <p className="text-[11px] text-emerald-400 font-mono mt-1">+12% este mes</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 text-xs font-medium">Planes Pro / Business / Ent.</p>
              <p className="text-2xl font-black text-violet-400 mt-1">
                {users.filter(u => u.plan !== 'free').length}
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">60% tasa de conversión</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 text-xs font-medium">Alerta Cuota (+80% Consumo)</p>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {users.filter(u => (u.commentsConsumed / u.commentsLimit) >= 0.8).length}
              </p>
              <p className="text-[11px] text-amber-400/80 font-mono mt-1">RF-030 Umbral activo</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 text-xs font-medium">Usuarios Suspendidos</p>
              <p className="text-2xl font-black text-rose-400 mt-1">
                {users.filter(u => u.status === 'suspended').length}
              </p>
              <p className="text-[11px] text-rose-400/80 font-mono mt-1">RF-031 Control anti-fraude</p>
            </div>
          </div>

          {/* User Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative md:col-span-2">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar usuario por nombre o correo electrónico..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div>
              <select
                value={selectedPlan}
                onChange={e => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500/50"
              >
                <option value="all">Todos los planes</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">Plan Actual (RF-032)</th>
                    <th className="py-3 px-4">Consumo de Comentarios (RF-030)</th>
                    <th className="py-3 px-4">Sorteos</th>
                    <th className="py-3 px-4">Estado (RF-031)</th>
                    <th className="py-3 px-4 text-right">Acciones Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map(u => {
                    const usagePercent = Math.min(100, Math.round((u.commentsConsumed / u.commentsLimit) * 100));
                    const isNearLimit = usagePercent >= 80;

                    return (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                            <span>{u.name}</span>
                            {(u.email.includes('atp.dev') || u.email.includes('achataipepercy')) && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                                REAL / OFICIAL
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                          <div className="text-[10px] text-slate-600 font-mono">Reg: {u.joinedAt}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={u.plan}
                            onChange={e => handleUpdatePlan(u.id, e.target.value as any)}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-violet-500"
                          >
                            <option value="free">FREE</option>
                            <option value="pro">PRO (10k)</option>
                            <option value="business">BUSINESS (50k)</option>
                            <option value="enterprise">ENTERPRISE (500k)</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="w-48 space-y-1">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span suppressHydrationWarning className="text-slate-300 font-semibold">{u.commentsConsumed.toLocaleString()} / {u.commentsLimit.toLocaleString()}</span>
                              <span className={isNearLimit ? 'text-amber-400 font-bold' : 'text-slate-500'}>{usagePercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  usagePercent >= 95 ? 'bg-rose-500' : isNearLimit ? 'bg-amber-400' : 'bg-violet-500'
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              ></div>
                            </div>
                            {isNearLimit && (
                              <p className="text-[9px] text-amber-400 font-medium">⚠️ 80%+ cuota alcanzada</p>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                          {u.giveawaysCount}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {u.status === 'active' ? 'ACTIVO' : 'SUSPENDIDO'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleResetUserComments(u.id)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 hover:text-white transition-colors"
                              title="Reiniciar consumo a 0"
                            >
                              Reset Cuota
                            </button>

                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                                u.status === 'active'
                                  ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40'
                                  : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40'
                              }`}
                            >
                              {u.status === 'active' ? 'Suspender' : 'Reactivar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CREAR SORTEO EXPRESS (ADMIN) */}
      {/* ========================================================= */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles size={20} className="text-violet-400" />
              <span>Crear y Certificar Sorteo Express</span>
            </h2>
            <p className="text-xs text-slate-400">
              Genera un sorteo oficial de administración con verificación criptográfica SHA-256 instantánea y landing pública.
            </p>
          </div>

          <form onSubmit={handleCreateGiveaway} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Título del Sorteo</label>
              <input
                type="text"
                required
                placeholder="Ej. Sorteo Oficial de Aniversario — Laptop Gamer"
                value={newGiveaway.title}
                onChange={e => setNewGiveaway({ ...newGiveaway, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Plataforma / Red</label>
                <select
                  value={newGiveaway.platform}
                  onChange={e => setNewGiveaway({ ...newGiveaway, platform: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="standalone">Standalone (Ruleta / Dados)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cuenta Organizadora</label>
                <input
                  type="text"
                  placeholder="@miempresa.pe"
                  value={newGiveaway.authorUsername}
                  onChange={e => setNewGiveaway({ ...newGiveaway, authorUsername: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">URL de la Publicación (Opcional)</label>
              <input
                type="url"
                placeholder="https://instagram.com/p/..."
                value={newGiveaway.postUrl}
                onChange={e => setNewGiveaway({ ...newGiveaway, postUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ganadores</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newGiveaway.rules?.winnersCount || 1}
                  onChange={e => setNewGiveaway({
                    ...newGiveaway,
                    rules: { ...newGiveaway.rules!, winnersCount: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Suplentes</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={newGiveaway.rules?.substitutesCount || 1}
                  onChange={e => setNewGiveaway({
                    ...newGiveaway,
                    rules: { ...newGiveaway.rules!, substitutesCount: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Total Comentarios</label>
                <input
                  type="number"
                  value={newGiveaway.totalCommentsCount || 500}
                  onChange={e => setNewGiveaway({ ...newGiveaway, totalCommentsCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('giveaways')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all flex items-center gap-2"
              >
                {isCreating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{isCreating ? 'Generando Sorteo...' : 'Generar y Certificar'}</span>
              </button>
            </div>
          </form>
        </div>
      )}


          {/* ========================================================= */}
      {/* TAB 4: THEME STUDIO SORTEOS PRO (UNIFICADO NIVEL DIOS) */}
      {activeTab === 'theme' && (
        <UnifiedThemeStudio
          subdomain="sorteos"
          subdomainTitle="Sorteos Pro"
          port="3006"
          localUrl="http://localhost:3006"
          productionUrl={OFFICIAL_APP_URLS.sorteos}
          theme={siteConfig.theme}
          presets={[
            { name: 'Púrpura Neón (Oficial)', hex: '#8b5cf6' },
            { name: 'Azul Eléctrico', hex: '#3b82f6' },
            { name: 'Verde Esmeralda', hex: '#10b981' },
            { name: 'Rosa Neón', hex: '#ec4899' },
            { name: 'Ámbar Dorado', hex: '#f59e0b' },
            { name: 'Cyan Eléctrico', hex: '#06b6d4' }
          ]}
          onSaveTheme={async (newTheme: SubdomainTheme) => {
            setIsSavingConfig(true);
            try {
              const res = await updateSorteosConfigAction({ theme: newTheme });
              if (res.success) {
                setSiteConfig(res.config);
                notify('¡Tema visual de Sorteos Pro guardado y publicado con éxito!');
                return true;
              }
              return false;
            } catch {
              notify('Error al guardar tema', 'error');
              return false;
            } finally {
              setIsSavingConfig(false);
            }
          }}
          saving={isSavingConfig}
        />
      )}

            {/* ========================================================= */}
      {/* TAB 5: CONFIGURACIÓN & SEO */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Settings2 size={18} className="text-blue-400" />
                <span>Textos de Marca & Barra de Anuncios</span>
              </h2>
              <p className="text-xs text-slate-400">
                Ajusta el copy central y anuncios que ven los creadores en la landing y dashboard de Sorteos Pro.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Título del Sitio</label>
                <input
                  type="text"
                  value={siteConfig.branding?.site_title || ''}
                  onChange={e => setSiteConfig({
                    ...siteConfig,
                    branding: { ...siteConfig.branding, site_title: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={siteConfig.branding?.site_tagline || ''}
                  onChange={e => setSiteConfig({
                    ...siteConfig,
                    branding: { ...siteConfig.branding, site_tagline: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Hero Badge</label>
              <input
                type="text"
                value={siteConfig.branding?.hero_badge || ''}
                onChange={e => setSiteConfig({
                  ...siteConfig,
                  branding: { ...siteConfig.branding, hero_badge: e.target.value }
                })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Barra de Anuncios (Banner Superior)</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={siteConfig.branding?.announcement_text || ''}
                  onChange={e => setSiteConfig({
                    ...siteConfig,
                    branding: { ...siteConfig.branding, announcement_text: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={siteConfig.branding?.announcement_enabled ?? true}
                    onChange={e => setSiteConfig({
                      ...siteConfig,
                      branding: { ...siteConfig.branding, announcement_enabled: e.target.checked }
                    })}
                    className="rounded bg-slate-950 border-slate-800 text-violet-600 focus:ring-0"
                  />
                  <span>Mostrar barra de anuncios en portada</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Metadatos de Posicionamiento (SEO)</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Meta Título (Google Search)</label>
                <input
                  type="text"
                  value={siteConfig.seo?.meta_title || ''}
                  onChange={e => setSiteConfig({
                    ...siteConfig,
                    seo: { ...siteConfig.seo, meta_title: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Meta Descripción</label>
                <textarea
                  rows={3}
                  value={siteConfig.seo?.meta_description || ''}
                  onChange={e => setSiteConfig({
                    ...siteConfig,
                    seo: { ...siteConfig.seo, meta_description: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSaveBranding}
                disabled={isSavingConfig}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                {isSavingConfig ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                <span>Guardar Configuración General</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: FEATURE FLAGS & MODULOS (RF-034) */}
      {/* ========================================================= */}
      {activeTab === 'flags' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sliders size={18} className="text-fuchsia-400" />
                <span>Matriz de Banderas de Funcionalidad (Feature Flags)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Habilita o deshabilita integraciones y módulos según el plan del creador en tiempo real (RF-034).
              </p>
            </div>

            <div className="divide-y divide-slate-800/80">
              {featureFlags.map(flag => (
                <div key={flag.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-md">
                    <p className="font-bold text-white text-xs">{flag.name}</p>
                    <p className="text-[11px] text-slate-400">{flag.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatureFlag(flag.id, 'Free')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                        flag.enabledInFree 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      FREE: {flag.enabledInFree ? 'ON' : 'OFF'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatureFlag(flag.id, 'Pro')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                        flag.enabledInPro 
                          ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' 
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      PRO: {flag.enabledInPro ? 'ON' : 'OFF'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatureFlag(flag.id, 'Business')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                        flag.enabledInBusiness 
                          ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' 
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      BIZ: {flag.enabledInBusiness ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: METRICAS & MRR (RF-033) */}
      {/* ========================================================= */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* Top Big KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-950/40 to-slate-900 border border-violet-500/20">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">MRR (Ingresos Recurrentes)</p>
              <p suppressHydrationWarning className="text-3xl font-black text-white mt-2">${metrics.mrr.toLocaleString()} USD</p>
              <p className="text-xs text-emerald-400 font-mono mt-1">+18.4% vs mes anterior</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-950/40 to-slate-900 border border-fuchsia-500/20">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">ARR Proyectado</p>
              <p suppressHydrationWarning className="text-3xl font-black text-white mt-2">${metrics.arr.toLocaleString()} USD</p>
              <p className="text-xs text-fuchsia-400 font-mono mt-1">Run-rate anualizado</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Suscriptores Activos</p>
              <p className="text-3xl font-black text-white mt-2">{metrics.activeSubscribers}</p>
              <p className="text-xs text-slate-400 font-mono mt-1">Churn: {metrics.churnRate}</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/20">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Comentarios Procesados</p>
              <p suppressHydrationWarning className="text-3xl font-black text-white mt-2">{metrics.totalCommentsScraped.toLocaleString()}</p>
              <p className="text-xs text-cyan-400 font-mono mt-1">Latencia: {metrics.apiResponseTime}</p>
            </div>
          </div>

          {/* Social Network Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm">Distribución de Sorteos por Red Social</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-pink-400 flex items-center gap-1.5"><Instagram size={13} /> Instagram</span>
                    <span className="text-white font-bold">62% (2,380 sorteos)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full w-[62%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-red-400 flex items-center gap-1.5"><Youtube size={13} /> YouTube</span>
                    <span className="text-white font-bold">23% (880 sorteos)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full w-[23%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-blue-400 flex items-center gap-1.5"><Facebook size={13} /> Facebook</span>
                    <span className="text-white font-bold">11% (420 sorteos)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[11%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-violet-400 flex items-center gap-1.5"><Dices size={13} /> Standalone (Ruleta/Dados)</span>
                    <span className="text-white font-bold">4% (160 sorteos)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full w-[4%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm">Distribución de Planes de Suscripción</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Plan Free</span>
                    <span className="text-white font-bold">58% (362 usuarios)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full w-[58%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-violet-400">Plan Creador / Pro</span>
                    <span className="text-white font-bold">26% (162 usuarios)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full w-[26%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-fuchsia-400">Plan Business / Agencia</span>
                    <span className="text-white font-bold">12% (75 usuarios)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-500 rounded-full w-[12%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400">Plan Enterprise</span>
                    <span className="text-white font-bold">4% (25 usuarios)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[4%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REDRAW MODAL (RF-024) */}
      {/* ========================================================= */}
      {redrawModalOpen && redrawingGiveaway && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw size={16} className="text-amber-400" />
                <span>Re-sorteo / Sustitución de Ganador (RF-024)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Sorteo: <strong className="text-white">{redrawingGiveaway.title}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Motivo de descalificación o re-sorteo <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ej. El ganador no respondió en 24h o no cumplió con las 2 menciones requeridas en las bases."
                value={redrawReason}
                onChange={e => setRedrawReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-500">
                Este motivo quedará auditado criptográficamente en el certificado oficial SHA-256.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRedrawModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteRedraw}
                disabled={isRedrawing}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                {isRedrawing ? <RefreshCw size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                <span>{isRedrawing ? 'Re-sorteando...' : 'Confirmar y Seleccionar Suplente'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULLSCREEN STUDIO MODAL (EXACT SAME AS CHAMBA PRO) */}
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
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                  <Palette size={18} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-widest">Theme Studio Pro</h2>
                  <p className="text-[10px] text-slate-400 font-mono">Subdominio: sorteos.atpdev.dev (:3006)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResetToDefault('default')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                  title="Restablecer tema oficial por defecto"
                >
                  <RotateCcw size={12} className="text-violet-400" />
                  <span>Reset Default</span>
                </button>
                <button 
                  onClick={() => setIsStudioModalOpen(false)} 
                  type="button" 
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Cerrar Diseñador"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Controls Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {/* ✨ 1. IA THEME STUDIO */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-[#0A0A0B] border border-slate-800 rounded-2xl p-3 flex flex-col items-stretch gap-2 overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Sparkles size={11} /> IA Theme Studio
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-violet-950/60 text-violet-400 border border-violet-500/20">
                      Gemini Pro
                    </span>
                  </div>
                  <textarea 
                    placeholder="Ej: Cyberpunk neón violeta eléctrico con fondos oscuros profundos y acentos fucsia..."
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
                        <div className={`block w-7 h-4 rounded-full transition-colors ${aiIncludeBackground ? 'bg-violet-500' : 'bg-slate-700'}`}></div>
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
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 text-white font-bold text-xs py-1.5 px-3.5 rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-violet-500/20"
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
                      themeMode === 'dark' ? 'bg-slate-900 border-violet-500 text-white ring-1 ring-violet-500/40' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon size={15} className="text-violet-400 shrink-0" />
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
                {globalBackgroundImage ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/50">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-violet-500 to-fuchsia-400 shadow-inner shrink-0" />
                        <span className="text-[11px] font-bold text-white">Fondo Animado Activo</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowGradientBuilder(true)}
                        className="text-[10px] text-violet-400 hover:text-white font-bold underline cursor-pointer"
                      >
                        Editar
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGlobalBackgroundImage("")}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                      title="Quitar fondo animado y regresar al fondo limpio"
                    >
                      <Trash2 size={12} />
                      <span>Quitar Fondo (Volver al Fondo Limpio)</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowGradientBuilder(true)}
                    className="w-full flex items-center justify-between border font-bold text-xs p-2.5 rounded-xl bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-violet-500 to-fuchsia-400 shadow-inner" />
                      <span>Diseñar Fondo Animado</span>
                    </div>
                    <Sparkles size={14} className="text-slate-500" />
                  </button>
                )}
              </div>

              {/* 4. SEED COLOR & ALGORITMO MD3 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Palette size={14} className="text-violet-400" />
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                  {(Object.entries(ACCENT_COLOR_MAP) as [SubdomainTheme['accent_name'], { hex: string; name: string; glow: string }][]).map(([key, val]) => {
                    const isSelected = key === 'monochrome'
                      ? colorTheme === 'monochrome' && seedColor.toLowerCase() === '#ffffff'
                      : seedColor.toLowerCase() === val.hex.toLowerCase();
                    const displayName = key === 'monochrome' ? 'Blanco y Negro' : key === 'purple' ? 'Púrpura Neón' : val.name.split(' ')[0];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === 'monochrome') {
                            handleResetToDefault('monochrome');
                          } else if (key === 'purple') {
                            handleResetToDefault('default');
                          } else {
                            setSeedColor(val.hex);
                            if (colorTheme === 'custom') setPrimary(val.hex);
                          }
                        }}
                        className={`p-1.5 rounded-lg border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 border-violet-500 text-white shadow-sm ring-1 ring-violet-500/40'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-md shrink-0 border border-white/10" style={{ backgroundColor: val.hex }} />
                        <span className="text-[10px] font-bold truncate">{displayName}</span>
                      </button>
                    );
                  })}
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
                  <FileText size={14} className="text-violet-400" />
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
                        radiusScale === r.id ? 'border-violet-500 bg-violet-500/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <div className={`w-3 h-3 border-t-2 border-l-2 ${radiusScale === r.id ? 'border-violet-400' : 'border-slate-500'} ${r.class}`}></div>
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
                    { id: 'spotlight-border', label: 'Reflector Neón', icon: <Sparkles size={12} className="text-violet-400" /> },
                    { id: 'full-border', label: 'Borde Neón Completo', icon: <Square size={12} className="text-fuchsia-400" /> },
                    { id: 'spotlight-full', label: 'Relleno Neón', icon: <Sparkles size={12} className="text-pink-400" /> },
                    { id: 'electric', label: 'Reflector Eléctrico', icon: <Zap size={12} className="text-amber-400" /> },
                    { id: 'electric-full', label: 'Borde Eléctrico Completo', icon: <Zap size={12} className="text-amber-400" /> },
                    { id: 'tilt', label: 'Inclinación 3D', icon: <div className="w-2 h-2 border border-violet-400 transform rotate-12" /> },
                    { id: 'ripple', label: 'Ondas (Clic)', icon: <div className="w-2 h-2 rounded-full border border-pink-400" /> },
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
                        className={`flex items-center gap-2.5 px-3 py-1.5 text-left border-b border-slate-800 last:border-0 cursor-pointer ${isActive ? 'bg-violet-500/10' : 'hover:bg-slate-800/60'}`}
                      >
                        <div className={`w-3.5 h-3.5 flex items-center justify-center rounded border ${isActive ? 'bg-violet-500 border-violet-400' : 'bg-slate-950 border-slate-700'}`}>
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
                        } ${isActive ? "bg-violet-500/20 border-violet-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}
                      >
                        {cur.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-800 bg-[#070A0F] space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleResetToDefault('default')}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Restablece todos los colores, fondo limpio y efectos oficiales por defecto"
                >
                  <RotateCcw size={12} className="text-violet-400" />
                  <span>Restablecer Defecto</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResetToDefault('monochrome')}
                  className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-zinc-500"
                  title="Aplica estilo Blanco y Negro elegante de alto contraste con fondo limpio"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-900 inline-block shadow-sm" />
                  <span>Blanco y Negro</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSavingConfig}
                  onClick={() => handleSaveTheme()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-black text-xs font-display flex items-center justify-center gap-2 transition-all shadow-xl shadow-violet-500/25 cursor-pointer disabled:opacity-50"
                >
                  {isSavingConfig ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
                  <span>{isSavingConfig ? 'Guardando...' : 'Aplicar y Guardar Tema'}</span>
                </button>
                <button 
                  onClick={() => setIsStudioModalOpen(false)} 
                  type="button"
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: FULLSCREEN LIVE PREVIEW */}
          <div className="flex-1 relative bg-[#050505] hidden md:flex flex-col">
            <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Preview: <strong className="text-violet-400">sorteos.atpdev.dev (:3006)</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewDevice === 'desktop' ? 'bg-violet-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Laptop size={13} />
                    <span>100%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewDevice === 'tablet' ? 'bg-violet-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Tablet size={13} />
                    <span>Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${previewDevice === 'mobile' ? 'bg-violet-600 text-white font-black shadow' : 'text-slate-400 hover:text-white'}`}
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
                  href={sorteosLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors border border-slate-800 cursor-pointer"
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
                  key={`modal-${sorteosLiveUrl}-${iframeRefreshKey}`}
                  src={sorteosLiveUrl}
                  className="w-full h-full border-0 bg-transparent"
                  title="Sorteos Pro Fullscreen Preview"
                  onLoad={() => {
                    sendThemeToIframe(currentTheme);
                    setTimeout(() => sendThemeToIframe(currentTheme), 300);
                    setTimeout(() => sendThemeToIframe(currentTheme), 800);
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
                <Sparkles className="text-violet-400" /> Diseñador de Fondo Global (Sorteos Pro)
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
