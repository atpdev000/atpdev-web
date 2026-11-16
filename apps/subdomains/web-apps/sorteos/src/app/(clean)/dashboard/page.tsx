"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Gift, 
  Sparkles, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Plus, 
  Share2, 
  ShieldCheck, 
  Check, 
  Zap,
  Trash2,
  Shield,
  Layers,
  Calendar,
  Users,
  X,
  Loader2,
  LogOut,
  RefreshCw,
  AtSign
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from '@/components/SocialIcons';
import { AdBanner } from '@/components/AdBanner';
import { Giveaway } from '@/lib/types';
import { api, setToken, getToken, removeToken } from '@/lib/api';

interface SocialAccount {
  id: string;
  network?: 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads';
  platform?: 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads';
  name: string;
  handle: string;
  status: 'connected' | 'expired' | 'revoked';
  expiresInDays?: number;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  plan?: string;
  role?: string;
  avatarUrl?: string;
}

const SUPPORTED_PLATFORMS = [
  {
    id: 'instagram' as const,
    name: 'Instagram Business',
    desc: 'Importa comentarios de publicaciones y reels automáticamente.',
    icon: InstagramIcon,
    color: 'text-pink-500',
    btnColor: 'hover:border-pink-500 hover:text-pink-600'
  },
  {
    id: 'tiktok' as const,
    name: 'TikTok Creadores',
    desc: 'Extrae comentarios de videos virales y trends para sorteos en TikTok.',
    icon: TikTokIcon,
    color: 'text-cyan-400',
    btnColor: 'hover:border-cyan-500 hover:text-cyan-600'
  },
  {
    id: 'youtube' as const,
    name: 'Canal de YouTube',
    desc: 'Extrae comentarios en vivo o de videos publicados para certificar.',
    icon: YoutubeIcon,
    color: 'text-red-500',
    btnColor: 'hover:border-red-500 hover:text-red-600'
  },
  {
    id: 'facebook' as const,
    name: 'Página de Facebook',
    desc: 'Gestiona sorteos en posts oficiales de tu fan page o comunidad.',
    icon: FacebookIcon,
    color: 'text-blue-500',
    btnColor: 'hover:border-blue-500 hover:text-blue-600'
  },
  {
    id: 'x' as const,
    name: 'X (Twitter)',
    desc: 'Audita respuestas, menciones y reposts para sorteos transparentes.',
    icon: XIcon,
    color: 'text-slate-900 dark:text-white',
    btnColor: 'hover:border-slate-800 hover:text-slate-900 dark:hover:border-white dark:hover:text-white'
  },
  {
    id: 'threads' as const,
    name: 'Threads de Meta',
    desc: 'Conecta con tu perfil de Threads y selecciona ganadores de tus publicaciones.',
    icon: ThreadsIcon,
    color: 'text-purple-500',
    btnColor: 'hover:border-purple-500 hover:text-purple-600'
  },
];


export default function DashboardPage() {
  const router = useRouter();
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usage, setUsage] = useState({ used: 0, limit: 2500, percent: 0, warn80: false });
  const [planName, setPlanName] = useState('Pro Creador');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loadingSession, setLoadingSession] = useState(true);

  // Modal para conectar cuenta social real
  const [connectModalPlatform, setConnectModalPlatform] = useState<typeof SUPPORTED_PLATFORMS[0] | null>(null);
  const [customName, setCustomName] = useState('');
  const [customHandle, setCustomHandle] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [customSaving, setCustomSaving] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const commentLimit = usage.limit;
  const commentsUsed = usage.used;
  const isPro = currentUser?.plan !== 'free';

  // Verificar autenticación real y cargar sorteos + cuentas + cuota
  useEffect(() => {
    let cancelled = false;

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const oauthToken = params.get('token');
      if (oauthToken) {
        setToken(oauthToken);
        window.history.replaceState({}, '', window.location.pathname);
      }
      const payment = params.get('payment');
      const plan = params.get('plan');
      const sessionId = params.get('session_id');
      if (payment === 'success' && plan) {
        api('/api/v1/billing/confirm', {
          method: 'POST',
          body: { planId: plan, sessionId },
        }).catch(() => undefined);
      }
      const connected = params.get('connected');
      if (connected) {
        window.history.replaceState({}, '', window.location.pathname);
      }

      const activeToken = getToken() || oauthToken;
      if (!activeToken) {
        // Redirigir a login para que el usuario ingrese con su cuenta real
        router.push('/login?redirect=/dashboard');
        return;
      }
    }

    (async () => {
      try {
        const [meRes, gRes, sRes, uRes] = await Promise.all([
          api<{ user: CurrentUser }>('/api/v1/auth/me').catch(() => null),
          api<{ data: Giveaway[] }>('/api/v1/giveaways').catch(() => null),
          api<{ data: SocialAccount[] }>('/api/v1/social-accounts').catch(() => null),
          api<{ used: number; limit: number; percent: number; warn80: boolean }>('/api/v1/billing/usage').catch(() => null),
        ]);
        if (cancelled) return;

        // Si no hay usuario autenticado o es una sesión demo obsoleta, forzar login real
        if (!meRes?.user || meRes.user.name === 'Creador Demo' || meRes.user.email?.includes('@demo.sorteos.local')) {
          removeToken();
          router.push('/login?redirect=/dashboard');
          return;
        }

        setCurrentUser(meRes.user);
        if (meRes.user.plan) {
          const labels: Record<string, string> = { free: 'Free', pro: 'Pro Creador', business: 'Business', enterprise: 'Enterprise' };
          setPlanName(labels[meRes.user.plan] || meRes.user.plan);
        }

        if (gRes?.data) setGiveaways(gRes.data);
        if (sRes?.data) {
          // Filtrar cualquier cuenta demo obsoleta para que solo aparezcan cuentas oficiales
          const realAccounts = sRes.data.filter(
            (a) => !a.handle.includes('demo-') && !a.name.includes('Creador Demo')
          );
          setSocialAccounts(realAccounts);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sorteos_social_accounts', JSON.stringify(realAccounts));
            } catch {
              // noop
            }
          }
        }
        if (uRes) setUsage(uRes);
      } catch {
        removeToken();
        router.push('/login?redirect=/dashboard');
      } finally {
        if (!cancelled) setLoadingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleCopyLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/sorteo/${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  // Abrir modal de conexión para una plataforma específica
  const openConnectModal = (platform: typeof SUPPORTED_PLATFORMS[0]) => {
    setConnectModalPlatform(platform);
    const brandName = currentUser?.name ? `${currentUser.name} (${platform.name.split(' ')[0]})` : `Mi ${platform.name}`;
    setCustomName(brandName);
    setCustomHandle('');
    setConnectError(null);
  };

  // Conectar vía OAuth Oficial (Meta / Google)
  const handleOAuthConnect = async (platformId: string) => {
    // Para TikTok y X si no se configuraron API keys de desarrollador empresarial
    if (platformId === 'tiktok' || platformId === 'x') {
      setConnectError(`Para ${connectModalPlatform?.name || platformId}, vincula tu perfil oficial directamente abajo en la Opción 2 con tu @usuario (ej. @${currentUser?.name?.toLowerCase().replace(/\s+/g, '_') || 'cuenta'}).`);
      return;
    }

    setOauthLoading(true);
    setConnectError(null);
    try {
      const res = await api<{ authorizeUrl?: string }>(`/api/v1/social-accounts`, {
        method: 'POST',
        body: { platform: platformId, action: 'oauth_start' }
      });
      if (res?.authorizeUrl) {
        window.location.href = res.authorizeUrl;
      } else {
        throw new Error('No se pudo generar la URL de autorización oficial');
      }
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Error al iniciar autorización OAuth');
      setOauthLoading(false);
    }
  };

  // Conectar guardando el @usuario o identificador oficial real
  const handleSaveCustomAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectModalPlatform) return;
    if (!customHandle.trim()) {
      setConnectError('Por favor ingresa tu @usuario o URL oficial.');
      return;
    }

    setCustomSaving(true);
    setConnectError(null);
    try {
      const res = await api<{ account: SocialAccount }>(`/api/v1/social-accounts`, {
        method: 'POST',
        body: {
          platform: connectModalPlatform.id,
          name: customName.trim() || `Cuenta ${connectModalPlatform.name}`,
          handle: customHandle.trim(),
        }
      });
      if (res?.account) {
        setSocialAccounts((prev) => [
          ...prev.filter((a) => (a.network || a.platform) !== connectModalPlatform.id),
          res.account
        ]);
        setConnectModalPlatform(null);
      }
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Error al vincular cuenta social');
    } finally {
      setCustomSaving(false);
    }
  };

  // Desconectar cuenta social
  const handleDisconnectAccount = async (id: string) => {
    if (!confirm('¿Deseas desconectar esta cuenta social de tu panel?')) return;
    setSocialAccounts((prev) => prev.filter((a) => a.id !== id));
    try {
      await api(`/api/v1/social-accounts/${id}`, { method: 'DELETE' });
    } catch {
      // noop
    }
  };

  // Desconectar todas las cuentas y reiniciar a cero
  const handleClearAllAccounts = async () => {
    if (!confirm('¿Deseas desconectar todas las cuentas vinculadas para sincronizar tus cuentas reales?')) return;
    try {
      await api('/api/v1/social-accounts', {
        method: 'POST',
        body: { action: 'clear_all' }
      });
      setSocialAccounts([]);
    } catch {
      // noop
    }
  };

  // Duplicar sorteo como plantilla
  const handleDuplicate = async (g: Giveaway) => {
    try {
      const data = await api<{ giveaway: Giveaway }>(`/api/v1/giveaways/${g.id}/duplicate`, { method: 'POST' });
      setGiveaways([data.giveaway, ...giveaways]);
    } catch {
      const duplicated: Giveaway = {
        ...g,
        id: `sorteo-${Date.now().toString(36)}`,
        title: `${g.title} (Copia)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        winners: [],
        substitutes: [],
        verificationHash: undefined,
        certificateId: undefined
      };
      setGiveaways([duplicated, ...giveaways]);
    }
  };

  // Eliminar sorteo del historial
  const handleDeleteGiveaway = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este sorteo de tu historial?')) return;
    try {
      await api(`/api/v1/giveaways/${id}`, { method: 'DELETE' });
    } catch {
      // noop
    }
    setGiveaways((prev) => prev.filter((g) => g.id !== id));
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
        delete stored[id];
        localStorage.setItem('sorteos_pro_db', JSON.stringify(stored));
      } catch {
        // noop
      }
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600 dark:text-purple-400" />
        <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">Verificando sesión oficial del creador...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-purple-400 font-bold">
              Panel de Creador
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-purple-500/20 text-pink-700 dark:text-purple-300 text-[10px] font-mono font-bold">
              Plan {planName}
            </span>
            {currentUser?.email && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 text-[11px] font-mono border border-slate-200 dark:border-white/10 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{currentUser.email}</span>
              </span>
            )}
            {isPro && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-500/20">
                <Shield className="w-3 h-3" />
                <span>100% Sin Anuncios (Pro)</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white mt-1">
            Hola, {currentUser?.name || 'Creador Oficial'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
            Gestiona tus sorteos sociales oficiales, cuentas conectadas y certificados auditados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sorteos/nuevo"
            className="btn-pro-primary px-5 py-3 rounded-2xl text-xs font-bold font-display shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Sorteo</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors shadow-xs cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Usage & Limits Banner */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-purple-500/10 text-pink-600 dark:text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Consumo Mensual de Comentarios</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Has procesado <strong className="text-slate-900 dark:text-white font-mono">{commentsUsed}</strong> de <strong className="text-slate-700 dark:text-zinc-300 font-mono">{commentLimit}</strong> comentarios este ciclo.
              </p>
            </div>
          </div>

          <Link
            href="/planes"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-mono text-pink-600 dark:text-purple-300 border border-slate-200 dark:border-purple-500/20 transition-colors shadow-xs"
          >
            Ampliar Límite (Upgrade)
          </Link>
        </div>

        <div className="space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                (commentsUsed / commentLimit) > 0.8
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(2, (commentsUsed / commentLimit) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-500">
            <span>0</span>
            <span>{Math.round((commentsUsed / commentLimit) * 100)}% consumido</span>
            <span>{commentLimit} comentarios</span>
          </div>
        </div>
      </div>

      {/* Cuentas Sociales Conectadas (Oficiales y Reales) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
              Cuentas Sociales Vinculadas (OAuth Oficial)
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Conexión directa mediante Graph API de Meta y Google API sin compartir contraseñas.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {socialAccounts.length > 0 && (
              <button
                onClick={handleClearAllAccounts}
                className="text-xs font-mono text-slate-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                Desconectar todas
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>OAuth 2.0 Activo</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const connected = socialAccounts.find(
              (a) => (a.network || a.platform) === platform.id && a.status === 'connected'
            );

            return (
              <div
                key={platform.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  connected
                    ? 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
                    : 'bg-white dark:bg-white/[0.01] border-dashed border-slate-300 dark:border-white/10 hover:border-slate-400'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <platform.icon className={`w-5 h-5 ${platform.color}`} />
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{platform.name}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        connected
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {connected ? 'Conectada' : 'Sin vincular'}
                    </span>
                  </div>

                  {connected ? (
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{connected.name}</div>
                      <div className="text-[11px] font-mono text-pink-600 dark:text-purple-400 font-bold truncate">{connected.handle}</div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {platform.desc}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  {connected ? (
                    <>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Sincronizado</span>
                      </span>
                      <button
                        onClick={() => handleDisconnectAccount(connected.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline font-mono font-bold cursor-pointer"
                      >
                        Desconectar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openConnectModal(platform)}
                      className={`w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-700 dark:text-zinc-200 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${platform.btnColor}`}
                    >
                      <span>+ Conectar {platform.name.split(' ')[0]}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historial Oficial de Sorteos del Usuario */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-600 dark:text-purple-400" />
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
              Historial de Sorteos ({giveaways.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
            Registros oficiales e inmutables
          </span>
        </div>

        {giveaways.length === 0 ? (
          <div className="text-center py-14 px-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-50 dark:bg-purple-500/10 text-pink-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
              <Gift className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Aún no tienes sorteos registrados
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                Los sorteos que realices en redes sociales o con nuestras herramientas rápidas aparecerán aquí con su certificado oficial verificable.
              </p>
            </div>
            <Link
              href="/sorteos/nuevo"
              className="btn-pro-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear mi primer sorteo</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {giveaways.map((g) => (
              <div
                key={g.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-700 dark:text-zinc-300 uppercase">
                      {g.network || g.platform || 'Social'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        g.status === 'completed' || g.status === 'finished'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-slate-200/50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-500/20'
                      }`}
                    >
                      {g.status === 'completed' || g.status === 'finished' ? 'Finalizado' : 'Borrador'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                      {new Date(g.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display truncate">
                    {g.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-zinc-400">
                    <span>💬 {g.totalCommentsCount || 0} comentarios</span>
                    <span>🏆 {g.winners?.length || 0} ganador(es)</span>
                    {g.substitutes && g.substitutes.length > 0 && (
                      <span>👥 {g.substitutes.length} suplente(s)</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap pt-2 md:pt-0 shrink-0">
                  <button
                    onClick={() => handleCopyLink(g.id)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-mono text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 border border-slate-200 dark:border-white/5 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Copiar enlace público"
                  >
                    {copiedId === g.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    <span>Compartir</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(g)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-mono text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 border border-slate-200 dark:border-white/5 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Duplicar sorteo"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Duplicar</span>
                  </button>

                  <Link
                    href={`/sorteo/${g.id}`}
                    className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-bold font-display shadow-xs flex items-center gap-1.5"
                  >
                    <span>Ver Resultado</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDeleteGiveaway(g.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                    title="Eliminar sorteo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog para Conectar Cuenta Social Oficial */}
      {connectModalPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <connectModalPlatform.icon className={`w-6 h-6 ${connectModalPlatform.color}`} />
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                    Conectar {connectModalPlatform.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Vincula tu canal o perfil oficial para auditoría y sorteos verificados.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setConnectModalPlatform(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {connectError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs font-mono text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{connectError}</span>
              </div>
            )}

            {/* Opciones de Conexión */}
            <div className="space-y-5">
              
              {/* Opción 1: OAuth Oficial (Meta / Google) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Opción 1: OAuth 2.0 Oficial (Recomendado)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    En Vivo
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Inicia sesión de forma segura y concede permisos de lectura mediante la API oficial de {connectModalPlatform.name.split(' ')[0]}.
                </p>

                <button
                  onClick={() => handleOAuthConnect(connectModalPlatform.id)}
                  disabled={oauthLoading || customSaving}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {oauthLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Conectando con {connectModalPlatform.name.split(' ')[0]}...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Iniciar Autorización Oficial de {connectModalPlatform.name.split(' ')[0]}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Separador */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">O Vincula por @Usuario</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
              </div>

              {/* Opción 2: Formulario de Usuario Real */}
              <form onSubmit={handleSaveCustomAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">
                    Nombre público del perfil o marca
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`ej. ${currentUser?.name || 'Mi Marca'} (${connectModalPlatform.name.split(' ')[0]})`}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">
                    @Usuario o URL oficial del perfil
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={customHandle}
                      onChange={(e) => setCustomHandle(e.target.value)}
                      placeholder="ej. @mimarcareal o https://..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-mono">
                    Vincula tu identificador real para que aparezca oficialmente en tus certificados auditados.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setConnectModalPlatform(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={customSaving || oauthLoading}
                    className="btn-pro-primary px-5 py-2.5 rounded-xl text-xs font-bold font-mono shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {customSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Guardar y Sincronizar Cuenta Real</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

      {/* Bloque de Publicidad (Solo visible para usuarios FREE) */}
      <AdBanner />
    </div>
  );
}
