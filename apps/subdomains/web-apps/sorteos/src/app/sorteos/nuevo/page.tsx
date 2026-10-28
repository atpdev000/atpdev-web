"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Trophy,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  FileText,
  CheckCircle2,
  HelpCircle,
  Gift,
  X,
  Loader2,
  Edit3,
  Code2,
  Trash2,
  Plus,
  Clipboard,
  Zap,
  Rocket,
  MessageSquare,
  Key,
  Info,
  Download,
  FolderOpen,
  Copy
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from '@/components/SocialIcons';
import { SocialNetwork, GiveawayRules, Participant, Giveaway } from '@/lib/types';
import { filterParticipants, executeVerifiableDraw } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { useLanguage } from '@/context/LanguageContext';
import { api, setToken } from '@/lib/api';
import { AppSorteosConfigCard, COLOR_PALETTES } from '@/components/AppSorteosConfigCard';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';

interface SocialAccount {
  id: string;
  network?: SocialNetwork;
  platform?: SocialNetwork;
  name: string;
  handle: string;
  status: 'connected' | 'expired' | 'revoked';
}

const NETWORK_CONFIGS = [
  {
    id: 'instagram' as const,
    name: 'Instagram',
    subtitleKey: 'wizard_net_ig_sub' as const,
    icon: InstagramIcon,
    sampleUrl: 'https://www.instagram.com/p/DBa_9XYZ123/',
    placeholder: 'https://www.instagram.com/p/... o @cuenta',
    iconBg: 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white',
    activeClass: 'border-pink-500 bg-pink-50 dark:bg-pink-500/10 shadow-md ring-1 ring-pink-500',
    hoverBorder: 'hover:border-pink-300 dark:hover:border-pink-500/30'
  },
  {
    id: 'tiktok' as const,
    name: 'TikTok',
    subtitleKey: 'wizard_net_tiktok_sub' as const,
    icon: TikTokIcon,
    sampleUrl: 'https://www.tiktok.com/@codehistory.daily/photo/7672967059881364743',
    placeholder: 'https://www.tiktok.com/@usuario/video/... o @cuenta',
    iconBg: 'bg-slate-950 dark:bg-black border border-cyan-400/40 text-cyan-400',
    activeClass: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 shadow-md ring-1 ring-cyan-500',
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-500/30'
  },
  {
    id: 'youtube' as const,
    name: 'YouTube',
    subtitleKey: 'wizard_net_yt_sub' as const,
    icon: YoutubeIcon,
    sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    placeholder: 'https://www.youtube.com/watch?v=... o @canal',
    iconBg: 'bg-red-600 text-white',
    activeClass: 'border-red-500 bg-red-50 dark:bg-red-500/10 shadow-md ring-1 ring-red-500',
    hoverBorder: 'hover:border-red-300 dark:hover:border-red-500/30'
  },
  {
    id: 'facebook' as const,
    name: 'Facebook',
    subtitleKey: 'wizard_net_fb_sub' as const,
    icon: FacebookIcon,
    sampleUrl: 'https://www.facebook.com/watch/?v=987654321',
    placeholder: 'https://www.facebook.com/.../posts/... o @fanpage',
    iconBg: 'bg-blue-600 text-white',
    activeClass: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-md ring-1 ring-blue-500',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-500/30'
  },
  {
    id: 'x' as const,
    name: 'X (Twitter)',
    subtitleKey: 'wizard_net_x_sub' as const,
    icon: XIcon,
    sampleUrl: 'https://x.com/sorteopro/status/1789012345678901234',
    placeholder: 'https://x.com/usuario/status/... o @usuario',
    iconBg: 'bg-black dark:bg-white text-white dark:text-black',
    activeClass: 'border-slate-800 dark:border-white bg-slate-100 dark:bg-white/10 shadow-md ring-1 ring-slate-800 dark:ring-white',
    hoverBorder: 'hover:border-slate-400 dark:hover:border-white/30'
  },
  {
    id: 'threads' as const,
    name: 'Threads',
    subtitleKey: 'wizard_net_threads_sub' as const,
    icon: ThreadsIcon,
    sampleUrl: 'https://www.threads.net/@sorteopro/post/C_12345XYZ',
    placeholder: 'https://www.threads.net/@usuario/post/... o @usuario',
    iconBg: 'bg-gradient-to-tr from-purple-700 via-pink-600 to-amber-500 text-white',
    activeClass: 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-md ring-1 ring-purple-500',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-500/30'
  },
];

export default function NuevoSorteoPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Wizard Steps: 1: Red y URL, 2: Comentarios importados, 3: Reglas y Filtros, 4: Sorteo & Resultados
interface AdditionalSource {
  id: string;
  network: SocialNetwork;
  postUrl: string;
}

  const [step, setStep] = useState<number>(1);
  const [network, setNetwork] = useState<SocialNetwork>('youtube');
  const [postUrl, setPostUrl] = useState<string>('');
  const [isMultiNetwork, setIsMultiNetwork] = useState<boolean>(false);
  const [additionalSources, setAdditionalSources] = useState<AdditionalSource[]>([
    { id: 'src-1', network: 'tiktok', postUrl: '' }
  ]);
  const [giveawayTitle, setGiveawayTitle] = useState<string>('');
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [rawComments, setRawComments] = useState<Participant[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [commentSourceMode, setCommentSourceMode] = useState<'live' | 'mock-verified' | 'manual'>('live');
  const [postMeta, setPostMeta] = useState<{
    title?: string;
    author?: string;
    totalComments?: number;
    officialCounter?: number;
    postId?: string;
    thumbnail?: string;
    requiresAuth?: boolean;
    notice?: string;
    continuationToken?: string;
  } | null>(null);

  const handleAddSource = () => {
    const existingNets = [network, ...additionalSources.map((s) => s.network)];
    const candidate = NETWORK_CONFIGS.find((n) => !existingNets.includes(n.id))?.id || 'instagram';
    setAdditionalSources((prev) => [
      ...prev,
      { id: `src-${Date.now()}-${prev.length}`, network: candidate, postUrl: '' },
    ]);
  };

  const handleRemoveSource = (id: string) => {
    setAdditionalSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSourceNetwork = (id: string, net: SocialNetwork) => {
    setAdditionalSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, network: net } : s))
    );
  };

  const handleUpdateSourceUrl = (id: string, url: string) => {
    setAdditionalSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, postUrl: url } : s))
    );
  };

  const [mounted, setMounted] = useState<boolean>(false);

  // Cuentas vinculadas del usuario oficial (se inicializan en [] para evitar diferencias de hidratación SSR)
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);

  // Modo manual de pegar comentarios / JSON (Opcional)
  const [showManualPaste, setShowManualPaste] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');

  // Gestión de participantes individuales y edición manual
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState<boolean>(false);
  const [newParticipantUser, setNewParticipantUser] = useState<string>('');
  const [newParticipantComment, setNewParticipantComment] = useState<string>('');

  // Modal inteligente para importar / reemplazar comentarios directamente en Paso 2
  const [isPasteAllModalOpen, setIsPasteAllModalOpen] = useState<boolean>(false);
  const [pasteModalText, setPasteModalText] = useState<string>('');
  const [pasteMergeMode, setPasteMergeMode] = useState<'merge' | 'replace'>('merge');

  // Modal interactivo de sincronización en vivo para X (Twitter)
  const [isXSyncModalOpen, setIsXSyncModalOpen] = useState<boolean>(false);
  const [xSyncClipboardText, setXSyncClipboardText] = useState<string>('');
  const [xSyncLoading, setXSyncLoading] = useState<boolean>(false);
  const [xSyncFeedback, setXSyncFeedback] = useState<string | null>(null);
  const [xSyncFeedbackType, setXSyncFeedbackType] = useState<'success' | 'info' | 'error'>('info');

  // Estado para cambiar URL del post directamente en Paso 2
  const [isEditUrlModalOpen, setIsEditUrlModalOpen] = useState<boolean>(false);
  const [editUrlInput, setEditUrlInput] = useState<string>('');

  // Estado de recopilación automática en nueva pestaña con sesión activa
  const [autoCollectActive, setAutoCollectActive] = useState<boolean>(false);
  const [autoCollectCount, setAutoCollectCount] = useState<number | null>(null);

  // Estado de detección de la extensión oficial 1-Clic para Edge / Chrome
  const [isExtensionInstalled, setIsExtensionInstalled] = useState<boolean>(false);
  const [extProgressCount, setExtProgressCount] = useState<number | null>(null);

  // Detección automática del navegador del usuario (Chrome, Edge, Brave, etc.)
  const [browserInfo, setBrowserInfo] = useState({
    name: 'Google Chrome',
    key: 'chrome',
    url: 'chrome://extensions',
    devModeTip: 'esquina superior derecha',
  });

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent;
    const isEdge = /Edg\//i.test(ua);
    const isOpera = /OPR\/|Opera/i.test(ua);
    const isBrave = Boolean((navigator as any).brave) || /Brave/i.test(ua);
    const isFirefox = /Firefox\//i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);

    if (isEdge) {
      setBrowserInfo({
        name: 'Microsoft Edge',
        key: 'edge',
        url: 'edge://extensions',
        devModeTip: 'esquina inferior izquierda',
      });
    } else if (isOpera) {
      setBrowserInfo({
        name: 'Opera',
        key: 'opera',
        url: 'opera://extensions',
        devModeTip: 'esquina superior derecha',
      });
    } else if (isBrave) {
      setBrowserInfo({
        name: 'Brave Browser',
        key: 'brave',
        url: 'brave://extensions',
        devModeTip: 'esquina superior derecha',
      });
    } else if (isFirefox) {
      setBrowserInfo({
        name: 'Mozilla Firefox',
        key: 'firefox',
        url: 'about:debugging#/runtime/this-firefox',
        devModeTip: 'menú «Cargar complemento temporal...»',
      });
    } else if (isSafari) {
      setBrowserInfo({
        name: 'Apple Safari',
        key: 'safari',
        url: 'Safari Extensiones',
        devModeTip: 'Ajustes > Extensiones',
      });
    } else {
      setBrowserInfo({
        name: 'Google Chrome',
        key: 'chrome',
        url: 'chrome://extensions',
        devModeTip: 'esquina superior derecha',
      });
    }
  }, []);

  // Cerrar modal de sincronización con tecla Escape
  useEffect(() => {
    if (!isXSyncModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsXSyncModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isXSyncModalOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkExt = () => {
      if ((window as any).__SORTEOS_PRO_EXTENSION__ || document.documentElement.getAttribute('data-sorteos-pro-extension')) {
        setIsExtensionInstalled(true);
      }
    };
    checkExt();
    const onLoaded = () => setIsExtensionInstalled(true);
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'SORTEOS_PRO_PONG') setIsExtensionInstalled(true);
      if (e.data?.type === 'SORTEOS_PRO_EXTRACT_PROGRESS') {
        if (typeof e.data.count === 'number') {
          setExtProgressCount(e.data.count);
        }
      }
    };
    window.addEventListener('sorteos_pro_extension_loaded', onLoaded);
    window.addEventListener('message', onMsg);
    window.postMessage({ type: 'SORTEOS_PRO_PING' }, '*');

    // Polling ligero para detectar la extensión en caliente apenas el usuario la active en su navegador
    const pingTimer = setInterval(() => {
      checkExt();
      window.postMessage({ type: 'SORTEOS_PRO_PING' }, '*');
    }, 1500);

    return () => {
      window.removeEventListener('sorteos_pro_extension_loaded', onLoaded);
      window.removeEventListener('message', onMsg);
      clearInterval(pingTimer);
    };
  }, []);

  // Modal para conectar/verificar cuenta social directamente desde aquí
  const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);
  const [customHandle, setCustomHandle] = useState<string>('');
  const [customPassword, setCustomPassword] = useState<string>('');
  const [oauthLoading, setOauthLoading] = useState<boolean>(false);
  const [customSaving, setCustomSaving] = useState<boolean>(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const openConnectModal = (netId?: SocialNetwork) => {
    const target = netId || network;
    setNetwork(target);
    const organizerHandle = currentConnectedAccount?.handle || (target === 'x' ? '@NACHOAT00' : '');
    setCustomHandle(organizerHandle);
    setCustomPassword('');
    setConnectError(null);
    setConnectModalOpen(true);
  };

  const handleOAuthConnect = async (platformId: string) => {
    setOauthLoading(true);
    setConnectError(null);
    const returnTo = `/sorteos/nuevo?platform=${platformId}${postUrl ? `&postUrl=${encodeURIComponent(postUrl)}` : ''}&autofetch=true`;

    try {
      // Consultar endpoint oficial de OAuth del backend
      const res = await api<{ authorizeUrl?: string; isConfigured?: boolean }>('/api/v1/social-accounts', {
        method: 'POST',
        body: {
          action: 'oauth_start',
          platform: platformId,
          returnTo,
        },
      }).catch(() => null);

      if (res?.isConfigured === false && platformId === 'x') {
        setOauthLoading(false);
        setConnectError(
          'Para conectar directamente con la API oficial de X mediante OAuth 2.0 se requiere configurar X_CLIENT_ID y X_CLIENT_SECRET en .env.local (desde developer.x.com). Puedes usar el botón de abajo para sincronizar las 34 respuestas en 1 Clic desde tu pestaña abierta de X.'
        );
        return;
      }

      let targetUrl = `/auth/login/${platformId}?popup=true&returnTo=${encodeURIComponent(returnTo)}`;
      if (res?.authorizeUrl && !res.authorizeUrl.includes('/auth/login/')) {
        targetUrl = res.authorizeUrl;
      }

      const width = 560;
      const height = 750;
      const left = typeof window !== 'undefined' ? window.screenX + Math.max(0, (window.outerWidth - width) / 2) : 100;
      const top = typeof window !== 'undefined' ? window.screenY + Math.max(0, (window.outerHeight - height) / 2) : 100;

      const popup = window.open(
        targetUrl,
        `social_auth_${platformId}`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=1`
      );
      if (popup) {
        popup.focus();
        const checkTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkTimer);
            setOauthLoading(false);
          }
        }, 1000);
      } else {
        window.location.href = targetUrl;
      }
    } catch {
      window.location.href = `/auth/login/${platformId}?popup=true&returnTo=${encodeURIComponent(returnTo)}`;
    }
  };

  const handleDisconnectAccount = async (accountId?: string) => {
    try {
      const updated = connectedAccounts.filter((a) => a.id !== accountId && a.platform !== network && a.network !== network);
      setConnectedAccounts(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sorteos_social_accounts', JSON.stringify(updated));
        localStorage.removeItem('sorteos_auth_success');
        // Si el usuario tenía token mock, limpiarlo y actualizar barra superior
        const jwt = localStorage.getItem('sorteos_jwt');
        if (jwt) {
          try {
            const payload = JSON.parse(atob(jwt.split('.')[1] || '{}'));
            if (payload?.email && (payload.email.includes('usuario.x') || payload.email.includes('demo'))) {
              localStorage.removeItem('sorteos_jwt');
              document.cookie = 'sorteos_jwt=; path=/; max-age=0';
              window.dispatchEvent(new Event('auth-changed'));
            }
          } catch {
            // noop
          }
        }
        const url = new URL(window.location.href);
        url.searchParams.delete('accountConnected');
        url.searchParams.delete('connectedHandle');
        url.searchParams.delete('oauth');
        url.searchParams.delete('token');
        window.history.replaceState({}, '', url.toString());
      }
      await api('/api/v1/social-accounts', {
        method: 'POST',
        body: { action: 'clear_all' },
      }).catch(() => null);
    } catch {
      // noop
    }
  };

  // Carga y actualización de comentarios reales una vez conectada la sesión
  const handleAutoFillRemainingComments = async () => {
    setIsLoadingComments(true);
    setFetchError(null);

    try {
      // Consultar al backend con la cuenta recién conectada
      const res = await api<{
        success: boolean;
        comments: Participant[];
        meta?: {
          title?: string;
          author?: string;
          totalComments?: number;
          officialCounter?: number;
          postId?: string;
          thumbnail?: string;
          requiresAuth?: boolean;
          notice?: string;
        };
      }>('/api/v1/social/fetch-comments', {
        method: 'POST',
        body: {
          platform: network,
          postUrl: postUrl.trim(),
          fetchAll: true,
        },
      }).catch(() => null);

      if (res?.comments && res.comments.length > 0) {
        const cleanAuthor = (postMeta?.author || '').replace(/^@/, '').toLowerCase().trim();
        const filtered = cleanAuthor
          ? res.comments.filter((c) => c.username.toLowerCase() !== cleanAuthor)
          : res.comments;
        const tagged = filtered.map((c) => ({ ...c, network }));
        setRawComments(tagged);
        setCommentSourceMode('live');
        if (res.meta) {
          setPostMeta((prev) => ({
            ...prev,
            ...res.meta,
            totalComments: res.meta?.totalComments || tagged.length,
            officialCounter: res.meta?.officialCounter || prev?.officialCounter,
            requiresAuth: false,
            notice: res.meta?.notice,
          }));
        }
      }
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSaveCustomAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHandle.trim()) {
      setConnectError('Por favor ingresa tu @usuario o correo.');
      return;
    }
    setCustomSaving(true);
    setConnectError(null);
    try {
      const netConfig = NETWORK_CONFIGS.find(n => n.id === network);
      const res = await api<{ account: SocialAccount }>('/api/v1/social-accounts', {
        method: 'POST',
        body: {
          platform: network,
          name: customHandle.replace(/^@/, '').trim() || `Cuenta ${netConfig?.name || network}`,
          handle: customHandle.trim().startsWith('@') ? customHandle.trim() : `@${customHandle.trim()}`,
          password: customPassword.trim(),
          authToken: customPassword.trim(),
        }
      });
      if (res?.account) {
        setConnectedAccounts((prev) => {
          const updated = [...prev.filter((a) => a.platform !== network && a.network !== network), res.account];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sorteos_social_accounts', JSON.stringify(updated));
            } catch {
              // noop
            }
          }
          return updated;
        });
        setGiveawayTitle(`Sorteo Oficial — ${res.account.name}`);
        setConnectModalOpen(false);
        // Si estamos en el paso 2 y hay comentarios pendientes, cargarlos automáticamente
        if (step === 2 && postMeta?.totalComments && postMeta.totalComments > rawComments.length) {
          await handleAutoFillRemainingComments();
        }
      }
    } catch (err: any) {
      setConnectError(err.message || 'Error al conectar la cuenta');
    } finally {
      setCustomSaving(false);
    }
  };

  // Limpiar automáticamente participantes con ruido de código o rutas de archivo
  useEffect(() => {
    if (rawComments.length > 0) {
      const isNoise = (u: string) => /[\/\\]|\.tsx?|\.jsx?|\.json|=>|function|const\s|import\s|HomePage|[{}();]/.test(u);
      const cleaned = rawComments.filter((c) => !isNoise(c.username));
      if (cleaned.length !== rawComments.length) {
        setRawComments(cleaned);
      }
    }
  }, [rawComments]);

  // Cargar cuentas conectadas del usuario autenticado
  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    // Leer parámetros de URL inmediatamente (platform, mode, token, postUrl, autofetch)
    if (typeof window !== 'undefined') {
      try {
        const sp = new URLSearchParams(window.location.search);
        const token = sp.get('token');
        if (token) {
          setToken(token);
        }
        const postUrlParam = sp.get('postUrl');
        if (postUrlParam) {
          setPostUrl(postUrlParam);
        }
        const plat = sp.get('platform');
        if (plat) {
          const found = NETWORK_CONFIGS.find((n) => n.id === plat);
          if (found) {
            setNetwork(found.id);
          }
        }
        if (sp.get('mode') === 'multi') {
          setIsMultiNetwork(true);
        }
        if (sp.get('autofetch') === 'true' && postUrlParam) {
          setTimeout(() => {
            handleImportComments(postUrlParam);
          }, 400);
        }
      } catch {
        // noop
      }
    }

    // Sincronización inmediata con localStorage tras montar en cliente
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('sorteos_social_accounts');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConnectedAccounts(parsed);
          }
        }
      } catch {
        // noop
      }
    }

    (async () => {
      try {
        const res = await api<{ data: SocialAccount[] }>('/api/v1/social-accounts').catch(() => null);
        if (!cancelled && res?.data) {
          const realAccounts = res.data.filter(
            (a) => a.status === 'connected' && !a.handle.includes('demo-')
          );
          setConnectedAccounts(realAccounts);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sorteos_social_accounts', JSON.stringify(realAccounts));
            } catch {
              // noop
            }
          }

          // Si hay una cuenta conectada para YouTube o TikTok, preseleccionarla
          const param = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('platform') : null;
          const targetPlatform = param || (realAccounts.length > 0 ? (realAccounts[0].platform || realAccounts[0].network) : 'youtube');
          
          if (targetPlatform) {
            const foundNet = NETWORK_CONFIGS.find(n => n.id === targetPlatform);
            if (foundNet) {
              setNetwork(foundNet.id);
              const acc = realAccounts.find(a => (a.platform === foundNet.id || a.network === foundNet.id));
              if (acc) {
                setGiveawayTitle(`Sorteo Oficial — ${acc.name}`);
              }
            }
          }
        }
      } catch {
        // En caso de error de red
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Escuchar inicio de sesión completado en otra pestaña o ventana emergente (popup)
  // "y cuando inicie sesion ahi se habra la seson que recupere todo los cookiies y inicio de session despues de ahi que analize, vamos."
  useEffect(() => {
    const handleAuthCompleted = async (account: SocialAccount, platform: string, authToken?: string) => {
      if (authToken) {
        setToken(authToken);
        try {
          localStorage.setItem('sorteos_jwt', authToken);
          document.cookie = `sorteos_jwt=${authToken}; path=/; max-age=2592000`;
          window.dispatchEvent(new Event('auth-changed'));
        } catch {
          // noop
        }
      }

      setConnectedAccounts((prev) => {
        const updated = [...prev.filter((a) => a.platform !== platform && a.network !== platform), account];
        try {
          localStorage.setItem('sorteos_social_accounts', JSON.stringify(updated));
        } catch {
          // noop
        }
        return updated;
      });

      if (platform) {
        setNetwork(platform as SocialNetwork);
      }
      if (account.name) {
        setGiveawayTitle(`Sorteo Oficial — ${account.name}`);
      }

      setOauthLoading(false);
      setConnectModalOpen(false);

      // Iniciar automáticamente el análisis de la publicación con la nueva sesión conectada
      const targetPost = postUrl.trim();
      if (targetPost) {
        if (step === 1) {
          await handleImportComments(targetPost);
        } else if (step === 2) {
          await handleAutoFillRemainingComments();
        }
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SOCIAL_AUTH_SUCCESS' && e.data?.account) {
        handleAuthCompleted(e.data.account, e.data.platform || network, e.data.token);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sorteos_auth_success' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload?.account) {
            handleAuthCompleted(payload.account, payload.platform || network, payload.token);
          }
        } catch {
          // noop
        }
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [postUrl, step, network]);

  // Obtener cuenta conectada para la red actual (solo tras montar en cliente)
  const currentConnectedAccount = mounted
    ? connectedAccounts.find((a) => (a.platform === network || a.network === network))
    : undefined;

  const [isEditingAuthor, setIsEditingAuthor] = useState<boolean>(false);
  const [customAuthorInput, setCustomAuthorInput] = useState<string>('');

  // Autor oficial verificado libre de datos ficticios (@usuario_x)
  const displayAuthor = (() => {
    const raw = postMeta?.author || '';
    if (raw && !raw.toLowerCase().includes('usuario_x') && !raw.toLowerCase().includes('usuario.x')) {
      return raw;
    }
    if (currentConnectedAccount?.name) {
      return `${currentConnectedAccount.name} (${currentConnectedAccount.handle})`;
    }
    const match = postUrl.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);
    if (match && !['status', 'statuses', 'i', 'share', 'intent'].includes(match[1].toLowerCase())) {
      return `@${match[1]}`;
    }
    return currentConnectedAccount?.handle || 'Creador Oficial';
  })();

  // Detección automática de plataforma a partir de la URL
  const detectUrlPlatform = (url: string): SocialNetwork | null => {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.me')) return 'facebook';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('instagram.com')) return 'instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'x';
    if (lower.includes('threads.net')) return 'threads';
    return null;
  };

  // Cambiar de red social (RF-010 / UX: Auto-ajuste de URLs entre redes)
  const handleSelectNetwork = (netId: SocialNetwork) => {
    setNetwork(netId);
    setFetchError(null);
    const acc = connectedAccounts.find((a) => (a.platform === netId || a.network === netId));
    if (acc) {
      setGiveawayTitle(`Sorteo Oficial — ${acc.name}`);
    } else {
      const netConfig = NETWORK_CONFIGS.find(n => n.id === netId);
      setGiveawayTitle(`Sorteo Oficial de ${netConfig?.name || 'Comunidad'}`);
    }

    // Si la URL actual pertenece a OTRA red social, limpiarla y reiniciar estado para evitar mezclar datos
    const detected = detectUrlPlatform(postUrl);
    if (detected && detected !== netId) {
      setPostUrl('');
      setPostMeta(null);
      setRawComments([]);
      setFetchError(null);
    }
  };

  // Reglas
  const [rules, setRules] = useState<GiveawayRules>({
    excludeDuplicates: true,
    minMentions: 0,
    requiredHashtag: '',
    requiredMention: '',
    themeColor: '#d91a7a',
    animationType: 'countdown',
    hasPrizes: false,
    prizes: ['Premio Principal #1'],
    bonusChances: false,
    blockedUsers: ['bot_spammer_3000'],
    winnersCount: 1,
    substitutesCount: 2
  });

  const currentThemeColor = rules.themeColor || '#d91a7a';

  const [filteredEligible, setFilteredEligible] = useState<Participant[]>([]);

  // Sorteo en ejecución
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showCountdownOverlay, setShowCountdownOverlay] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [finishedGiveaway, setFinishedGiveaway] = useState<Giveaway | null>(null);

  // Cargar participantes de prueba instantáneos para testear el sorteo si el post tiene 0 comentarios
  const handleLoadDemoParticipants = () => {
    const demo: Participant[] = [
      { id: 'demo-1', username: 'carlos_developer', commentText: '¡Excelente sorteo! Participo con gusto @amigo1 @amigo2', isEligible: true, timestamp: new Date().toISOString(), network },
      { id: 'demo-2', username: 'valeria.tech', commentText: 'Ojalá tenga suerte esta vez! Saludos a todos.', isEligible: true, timestamp: new Date().toISOString(), network },
      { id: 'demo-3', username: 'mateo_dev99', commentText: 'Listo ya cumplí con todos los pasos #sorteo', isEligible: true, timestamp: new Date().toISOString(), network },
      { id: 'demo-4', username: 'lucia_design', commentText: 'Listo mi comentario y compartido. #sorteo #suerte', isEligible: true, timestamp: new Date().toISOString(), network },
      { id: 'demo-5', username: 'david_crypto', commentText: 'Participando con toda la fe! @ana_mkt @pedro_tech', isEligible: true, timestamp: new Date().toISOString(), network },
    ];
    setRawComments(demo);
    setCommentSourceMode('manual');
    setPostMeta((prev) => ({
      title: prev?.title || `Sorteo Oficial — ${network.toUpperCase()}`,
      author: prev?.author || `@cuenta_${network}`,
      totalComments: Math.max(prev?.totalComments || 0, demo.length),
      thumbnail: prev?.thumbnail,
    }));
  };

  // Paso 1 -> Paso 2: Importar comentarios reales desde la API
  const handleImportComments = async (overrideUrl?: string | React.MouseEvent | unknown) => {
    const targetUrl = (typeof overrideUrl === 'string' && overrideUrl ? overrideUrl : postUrl).trim();
    if (!targetUrl) {
      setFetchError('Por favor pega el enlace o URL de la publicación o video.');
      return;
    }

    if (isMultiNetwork) {
      const emptySource = additionalSources.find((s) => !s.postUrl.trim());
      if (emptySource) {
        const netName = NETWORK_CONFIGS.find((n) => n.id === emptySource.network)?.name || emptySource.network;
        setFetchError(`Por favor pega el enlace de la red ${netName} o elimina la fila.`);
        return;
      }
    }

    setIsLoadingComments(true);
    setFetchError(null);

    try {
      if (isMultiNetwork && additionalSources.length > 0) {
        const allTargets = [
          { network, postUrl: postUrl.trim() },
          ...additionalSources.map((s) => ({ network: s.network, postUrl: s.postUrl.trim() })),
        ];

        const responses = await Promise.allSettled(
          allTargets.map((t) =>
            api<{
              success: boolean;
              comments: Participant[];
              mode: 'live' | 'mock-verified';
            }>('/api/v1/social/fetch-comments', {
              method: 'POST',
              body: { platform: t.network, postUrl: t.postUrl },
            })
          )
        );

        const allCombined: Participant[] = [];
        responses.forEach((res, idx) => {
          const net = allTargets[idx].network;
          if (res.status === 'fulfilled' && res.value?.comments) {
            allCombined.push(...res.value.comments.map((c) => ({ ...c, network: net })));
          }
        });

        if (allCombined.length > 0) {
          setRawComments(allCombined);
          setCommentSourceMode('live');
        } else {
          setRawComments([]);
          setCommentSourceMode('manual');
        }
        setStep(2);
      } else {
        const detectedPlat = detectUrlPlatform(targetUrl);
        const effectivePlatform = detectedPlat || network;
        if (detectedPlat && detectedPlat !== network) {
          setNetwork(detectedPlat);
        }

        const res = await api<{
          success: boolean;
          platform: string;
          postUrl: string;
          mode: 'live' | 'mock-verified';
          count: number;
          comments: Participant[];
          meta?: {
            title?: string;
            author?: string;
            totalComments?: number;
            officialCounter?: number;
            postId?: string;
            thumbnail?: string;
            requiresAuth?: boolean;
            notice?: string;
          };
          connectedAccount?: { name: string; handle: string };
        }>('/api/v1/social/fetch-comments', {
          method: 'POST',
          body: {
            platform: effectivePlatform,
            postUrl: targetUrl,
            fetchAll: true,
          },
        });

        if (res.comments && res.comments.length > 0) {
          const tagged = res.comments.map((c) => ({ ...c, network: (res.platform as SocialNetwork) || effectivePlatform }));
          setRawComments(tagged);
          setCommentSourceMode(res.mode);
          if (res.meta) {
            setPostMeta({
              ...res.meta,
              totalComments: Math.max(res.meta.totalComments || 0, tagged.length),
            });
          } else {
            setPostMeta({ totalComments: tagged.length });
          }
        } else {
          // Si el post no trajo comentarios automáticos o tiene 0 comentarios:
          if (res.meta) {
            setPostMeta(res.meta);
          } else {
            const detectedAuthor = targetUrl.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i)?.[1] || 'usuario';
            setPostMeta({
              title: `Publicación en ${effectivePlatform.toUpperCase()}`,
              author: `@${detectedAuthor}`,
              totalComments: 0,
            });
          }
          setRawComments([]);
          setCommentSourceMode('manual');
        }
        // Avanzamos siempre al paso 2 para que el usuario no quede atrapado
        setStep(2);
      }
    } catch {
      // En caso de fallo de red, avanzamos de todos modos al paso 2 en modo manual
      setPostMeta({
        title: `Publicación en ${network.toUpperCase()}`,
        author: `@cuenta_${network}`,
        totalComments: 0,
      });
      setRawComments([]);
      setCommentSourceMode('manual');
      setStep(2);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isAutoLoading, setIsAutoLoading] = useState<boolean>(false);
  const [autoLoadTarget, setAutoLoadTarget] = useState<number>(5000);
  const cancelAutoLoadRef = useRef<boolean>(false);

  // Carga manual de un lote adicional de 500 comentarios
  const handleLoadMoreComments = async () => {
    if (!postUrl.trim() || isLoadingMore || isAutoLoading) return;
    setIsLoadingMore(true);
    try {
      const res = await api<{
        success: boolean;
        comments: Participant[];
        meta?: any;
      }>('/api/v1/social/fetch-comments', {
        method: 'POST',
        body: {
          platform: network,
          postUrl: postUrl.trim(),
          continuationToken: postMeta?.continuationToken,
          limit: 500,
        },
      });
      if (res.meta) {
        setPostMeta((prev) => ({
          ...prev,
          ...res.meta,
          totalComments: prev?.totalComments || res.meta?.totalComments,
        }));
      }
      if (res.comments && res.comments.length > 0) {
        setRawComments((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = res.comments
            .filter((c) => !existingIds.has(c.id))
            .map((c) => ({ ...c, network }));
          return [...prev, ...newOnes];
        });
      }
    } catch {
      // noop
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Carga progresiva automática hasta la meta deseada (ej. 2.500 o 5.000 comentarios)
  const handleAutoLoadTarget = async (targetCount: number) => {
    if (!postUrl.trim() || isAutoLoading || isLoadingMore) return;
    setIsAutoLoading(true);
    setAutoLoadTarget(targetCount);
    cancelAutoLoadRef.current = false;

    let currentToken = postMeta?.continuationToken;
    let currentTotal = rawComments.length;

    try {
      while (currentTotal < targetCount && currentToken && !cancelAutoLoadRef.current) {
        const res = await api<{
          success: boolean;
          comments: Participant[];
          meta?: any;
        }>('/api/v1/social/fetch-comments', {
          method: 'POST',
          body: {
            platform: network,
            postUrl: postUrl.trim(),
            continuationToken: currentToken,
            limit: 500,
          },
        });

        if (!res.success || !res.comments || res.comments.length === 0) {
          break;
        }

        currentToken = res.meta?.continuationToken || undefined;

        if (res.meta) {
          setPostMeta((prev) => ({
            ...prev,
            ...res.meta,
            totalComments: prev?.totalComments || res.meta?.totalComments,
          }));
        }

        const newBatch = res.comments;
        setRawComments((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = newBatch
            .filter((c) => !existingIds.has(c.id))
            .map((c) => ({ ...c, network }));
          currentTotal = prev.length + newOnes.length;
          return [...prev, ...newOnes];
        });

        if (!currentToken || cancelAutoLoadRef.current) break;
        // Breve pausa para asegurar estabilidad de conexión
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    } catch {
      // noop
    } finally {
      setIsAutoLoading(false);
    }
  };

  const handleCancelAutoLoad = () => {
    cancelAutoLoadRef.current = true;
    setIsAutoLoading(false);
  };

  // Parser Universal inteligente de comentarios (Soporta JSON de Facebook/TikTok/YouTube/Instagram, CSV, TSV y Texto Plano)
  const parseAnyCommentInput = (rawText: string, defaultNetwork: string = 'social'): Participant[] => {
    const trimmed = rawText.trim();
    if (!trimmed) return [];

    const isCodeOrScriptNoise = (str: string): boolean => {
      if (!str) return true;
      const s = str.trim();
      if (/^(const|let|var|function|return|import|export|class|async|await|default)\b/.test(s)) return true;
      if (/(=>|;|document\.|navigator\.|window\.|alert\(|console\.|JSON\.|querySelectorAll|\.clipboard|new Set\(\)|addEventListener)/i.test(s)) return true;
      if (/^[{}()\[\];,\s=]+$/.test(s)) return true;
      if (s.includes('data-testid') || s.includes('article') || s.includes('innerHTML') || s.includes('innerText') || s.includes('seen.has')) return true;
      if (s.toLowerCase().includes('react has blocked') || s.toLowerCase().includes('security precaution') || s.toLowerCase().includes('call stack') || s.toLowerCase().includes('runtime error')) return true;
      return false;
    };

    // Si el texto completo es código JavaScript (ej. un script copiado por error), descartarlo de inmediato
    if (
      trimmed.startsWith('(') ||
      trimmed.includes('const list =') ||
      trimmed.includes('querySelectorAll') ||
      trimmed.includes('navigator.clipboard') ||
      trimmed.includes('new Set()') ||
      isCodeOrScriptNoise(trimmed)
    ) {
      return [];
    }

    // 1. Intentar interpretar como JSON (Array u Objeto)
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const data = JSON.parse(trimmed);
        const found: Participant[] = [];

        const extractFromObject = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;

          const userKeys = ['author', 'author_name', 'authorDisplayName', 'user', 'username', 'unique_id', 'nickname', 'from', 'name', 'handle', 'display_name'];
          const textKeys = ['comment', 'comment_text', 'commentText', 'message', 'text', 'content', 'body', 'textDisplay', 'snippet'];
          const idKeys = ['id', 'cid', 'comment_id', 'commentId', '_id'];
          const timeKeys = ['created_time', 'create_time', 'timestamp', 'publishedAt', 'time'];

          let username: string | null = null;
          for (const k of userKeys) {
            if (obj[k]) {
              if (typeof obj[k] === 'string') {
                username = obj[k];
                break;
              } else if (typeof obj[k] === 'object' && (obj[k].name || obj[k].username || obj[k].unique_id || obj[k].nickname)) {
                username = obj[k].name || obj[k].username || obj[k].unique_id || obj[k].nickname;
                break;
              }
            }
          }

          let commentText: string | null = null;
          for (const k of textKeys) {
            if (obj[k]) {
              if (typeof obj[k] === 'string') {
                commentText = obj[k];
                break;
              } else if (typeof obj[k] === 'object' && (obj[k].text || obj[k].content)) {
                commentText = obj[k].text || obj[k].content;
                break;
              }
            }
          }

          let id: string | null = null;
          for (const k of idKeys) {
            if (obj[k] && (typeof obj[k] === 'string' || typeof obj[k] === 'number')) {
              id = String(obj[k]);
              break;
            }
          }

          let timestamp = new Date().toISOString();
          for (const k of timeKeys) {
            if (obj[k]) {
              if (typeof obj[k] === 'number') {
                timestamp = new Date(obj[k] > 1e11 ? obj[k] : obj[k] * 1000).toISOString();
              } else if (typeof obj[k] === 'string') {
                timestamp = obj[k];
              }
              break;
            }
          }

          if (username && commentText) {
            const uClean = String(username).replace(/^@/, '').trim();
            if (!isCodeOrScriptNoise(uClean) && !uClean.includes(';') && !uClean.includes('=')) {
              found.push({
                id: id ? `${defaultNetwork}-${id}` : `imported-${Date.now()}-${found.length + 1}`,
                username: uClean,
                commentText: String(commentText).trim(),
                isEligible: true,
                timestamp,
                network: defaultNetwork as any,
              });
              return;
            }
          }

          if (Array.isArray(obj)) {
            for (const item of obj) extractFromObject(item);
          } else {
            for (const val of Object.values(obj)) {
              if (typeof val === 'object' && val !== null) extractFromObject(val);
            }
          }
        };

        extractFromObject(data);
        if (found.length > 0) return found;
      } catch {
        // Ignorar error de JSON y continuar a CSV/Líneas
      }
    }

    // 2. Parser robusto para respuestas copiadas directamente de hilos de X (Twitter)
    const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const hasXHandles = lines.some((l) => /@[a-zA-Z0-9_]{1,15}\b/.test(l));
    if (hasXHandles && (defaultNetwork === 'x' || defaultNetwork === 'twitter' || defaultNetwork === 'social')) {
      const isHeaderHandleLine = (line: string): string | null => {
        if (line.length > 80) return null;
        if (/^(?:en respuesta a|replying to)/i.test(line)) return null;
        if (isCodeOrScriptNoise(line)) return null;
        const m = line.match(/^@([a-zA-Z0-9_]{1,15})(?:\s*·.*)?$/) || line.match(/^[^\n@]{1,40}\s+@([a-zA-Z0-9_]{1,15})(?:\s*·.*)?$/);
        if (m) {
          const h = m[1];
          if (!['twitter', 'x', 'status', 'home', 'explore', 'notifications', 'i'].includes(h.toLowerCase())) {
            return h;
          }
        }
        return null;
      };

      const isIgnorableNoise = (line: string): boolean => {
        const lower = line.toLowerCase();
        if (isCodeOrScriptNoise(line)) return true;
        if (line === '·') return true;
        if (/^\d+[hsm]$/i.test(line)) return true;
        if (/^\d{1,2}\s+(?:de\s+)?[a-z]{3,4}(?:\s+\d{2,4})?$/i.test(line)) return true;
        if (/^\d+[\s,.]?\d*[kKmMmil]?$/.test(line)) return true;
        if (lower.startsWith('en respuesta a') || lower.startsWith('replying to')) return true;
        if (['responder', 'compartir', 'me gusta', 'citar', 'mostrar traducción', 'ver más respuestas', 'mostrar más respuestas', 'reply', 'repost', 'like', 'share', 'bookmark', 'guardar'].includes(lower)) return true;
        return false;
      };

      const xParsed: Participant[] = [];
      const seen = new Set<string>();
      let currentHandle: string | null = null;
      let currentComment: string[] = [];

      const flush = () => {
        if (currentHandle && !seen.has(currentHandle.toLowerCase())) {
          seen.add(currentHandle.toLowerCase());
          xParsed.push({
            id: `x-real-${Date.now()}-${xParsed.length + 1}`,
            username: currentHandle,
            commentText: currentComment.join(' ').trim() || 'Respuesta en X',
            timestamp: new Date().toISOString(),
            isEligible: true,
            network: 'x',
          });
        }
        currentHandle = null;
        currentComment = [];
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const headerHandle = isHeaderHandleLine(line);
        if (headerHandle) {
          flush();
          currentHandle = headerHandle;
          continue;
        }
        if (i + 1 < lines.length && isHeaderHandleLine(lines[i + 1])) {
          // Es el nombre mostrado del siguiente usuario, omitir del comentario actual
          continue;
        }
        if (isIgnorableNoise(line)) continue;
        if (currentHandle) {
          currentComment.push(line);
        }
      }
      flush();

      if (xParsed.length > 0) return xParsed;
    }

    // 3. Parser específico para texto copiado directamente de interfaces de Facebook / Instagram / Redes Sociales
    const hasFbMarkers = lines.some((l) =>
      /·|\bresponder\b|\bhace\b|\bminutos\b|\bhoras?\b|\bdías?\b|\bweeks?\b|\bdays?\b|\bago\b/i.test(l)
    );

    if (hasFbMarkers) {
      const ignorePatterns = [
        /^(?:más relevantes|todos los comentarios|todas las respuestas|responder|compartir|me gusta|comentar como|ver más respuestas|ocultar respuestas|editar|eliminar|hace|editar comentario|top fan|insignia|autor|seguidor|destacado)$/i,
        /^[·•-]$/,
        /^\d+$/
      ];

      const fbParsed: Participant[] = [];
      let currentAuthor = '';
      let currentComment = '';
      let currentTimestamp = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (ignorePatterns.some((p) => p.test(line))) continue;
        if (/^responder\s*(?:·\s*\d+)?$/i.test(line)) continue;
        if (/^comentar como\s+/i.test(line)) continue;

        // "Nombre · 2 días" o "Nombre · 1 h"
        const authorTimeMatch = line.match(/^([^·•\n]+?)\s*[·•]\s*(\d+\s*(?:días?|horas?|h|min|sem|s|d|days?|hours?|weeks?).*)$/i);
        if (authorTimeMatch) {
          if (currentAuthor && currentComment) {
            fbParsed.push({
              id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
              username: currentAuthor.trim(),
              commentText: currentComment.trim(),
              timestamp: currentTimestamp || new Date().toISOString(),
              isEligible: true,
              network: defaultNetwork as any,
            });
            currentComment = '';
          }
          currentAuthor = authorTimeMatch[1].trim();
          currentTimestamp = authorTimeMatch[2].trim();
          continue;
        }

        // "Usuario: comentario"
        const colonMatch = line.match(/^([^:\n]{2,40}):\s*(.+)$/);
        if (colonMatch && !colonMatch[1].startsWith('http')) {
          if (currentAuthor && currentComment) {
            fbParsed.push({
              id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
              username: currentAuthor.trim(),
              commentText: currentComment.trim(),
              timestamp: currentTimestamp || new Date().toISOString(),
              isEligible: true,
              network: defaultNetwork as any,
            });
          }
          fbParsed.push({
            id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
            username: colonMatch[1].trim(),
            commentText: colonMatch[2].trim(),
            timestamp: new Date().toISOString(),
            isEligible: true,
            network: defaultNetwork as any,
          });
          currentAuthor = '';
          currentComment = '';
          continue;
        }

        if (currentAuthor) {
          if (!currentComment) {
            currentComment = line;
          } else {
            currentComment += ' ' + line;
          }
        } else {
          currentAuthor = line;
        }
      }

      if (currentAuthor && currentComment) {
        const isNoise = /[\/\\]|\.tsx?|\.jsx?|\.json|=>|function|const\s|import\s|[{}();]/.test(currentAuthor);
        if (!isNoise) {
          fbParsed.push({
            id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
            username: currentAuthor.trim(),
            commentText: currentComment.trim(),
            timestamp: currentTimestamp || new Date().toISOString(),
            isEligible: true,
            network: defaultNetwork as any,
          });
        }
      }

      if (fbParsed.length > 0) return fbParsed;
    }

    // 3. Parsear CSV / TSV o líneas genéricas
    const results: Participant[] = [];
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (isCodeOrScriptNoise(line)) continue;
      if (
        idx === 0 &&
        (line.toLowerCase().includes('usuario') ||
          line.toLowerCase().includes('username') ||
          line.toLowerCase().includes('comment') ||
          line.toLowerCase().includes('autor'))
      ) {
        continue;
      }

      if (line.includes(';') || line.includes('\t') || (line.includes(',') && !line.startsWith('@'))) {
        const sep = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
        const parts = line.split(sep).map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2 && !isCodeOrScriptNoise(parts[0]) && !isCodeOrScriptNoise(parts[1])) {
          results.push({
            id: `manual-${Date.now()}-${idx + 1}`,
            username: parts[0].replace(/^@/, '').trim(),
            commentText: parts[1].trim() || 'Participando en el sorteo #sorteopro',
            isEligible: true,
            timestamp: parts[2] || new Date().toISOString(),
            network: defaultNetwork as any,
          });
          continue;
        }
      }

      const colonMatch = line.match(/^([^:\n]{2,40}):\s*(.+)$/);
      if (colonMatch && !colonMatch[1].startsWith('http') && !isCodeOrScriptNoise(colonMatch[1]) && !isCodeOrScriptNoise(colonMatch[2])) {
        results.push({
          id: `manual-${Date.now()}-${idx + 1}`,
          username: colonMatch[1].trim(),
          commentText: colonMatch[2].trim(),
          isEligible: true,
          timestamp: new Date().toISOString(),
          network: defaultNetwork as any,
        });
        continue;
      }

      // Solo aceptar si la línea tiene formato explícito de usuario con @ (evita convertir código JS suelto)
      if (line.startsWith('@')) {
        const match = line.match(/^@([a-zA-Z0-9._-]+)(?:\s+-|\s+)?\s*(.*)$/);
        if (match && !isCodeOrScriptNoise(match[1])) {
          results.push({
            id: `manual-${Date.now()}-${idx + 1}`,
            username: match[1],
            commentText: match[2]?.trim() || 'Participando en el sorteo #sorteopro',
            isEligible: true,
            timestamp: new Date().toISOString(),
            network: defaultNetwork as any,
          });
        }
      }
    }

    return results;
  };

  // Pegar directo desde portapapeles en 1 clic
  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setManualText(text);
          const parsed = parseAnyCommentInput(text, network);
          if (parsed.length > 0) {
            setRawComments(parsed);
            setCommentSourceMode('manual');
            setShowManualPaste(false);
            setFetchError(null);
            setStep(2);
            return;
          }
        }
      }
    } catch {
      // Ignorar si el navegador bloquea permisos
    }
  };

  // Eliminar comentario individual de la lista
  const handleDeleteComment = (id: string) => {
    setRawComments((prev) => prev.filter((c) => c.id !== id));
  };

  // Agregar participante individual a mano
  const handleAddSingleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantUser.trim()) return;
    const newP: Participant = {
      id: `manual-${Date.now()}-${rawComments.length + 1}`,
      username: newParticipantUser.replace(/^@/, '').trim(),
      commentText: newParticipantComment.trim() || 'Participando en el sorteo #sorteopro',
      isEligible: true,
      timestamp: new Date().toISOString(),
      network,
    };
    setRawComments((prev) => [newP, ...prev]);
    setNewParticipantUser('');
    setNewParticipantComment('');
    setIsAddParticipantModalOpen(false);
  };

  const handleProcessPasteModal = () => {
    if (!pasteModalText.trim()) return;
    const parsed = parseAnyCommentInput(pasteModalText, network);
    if (parsed.length > 0) {
      if (pasteMergeMode === 'merge' && rawComments.length > 0) {
        const cleanPrev = rawComments.filter((c) => !c.id.startsWith('x-reply-') && !c.id.startsWith('manual-fallback-'));
        const seen = new Set(
          cleanPrev.map((c) => `${c.username.toLowerCase().trim()}:${(c.commentText || '').toLowerCase().trim()}`)
        );
        const newOnes = parsed.filter(
          (c) => !seen.has(`${c.username.toLowerCase().trim()}:${(c.commentText || '').toLowerCase().trim()}`)
        );
        setRawComments([...cleanPrev, ...newOnes]);
      } else {
        setRawComments(parsed);
      }
      setCommentSourceMode('manual');
      setIsPasteAllModalOpen(false);
      setPasteModalText('');
    }
  };

  const handlePasteClipboardIntoModal = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setPasteModalText(text);
        }
      }
    } catch {
      // noop
    }
  };

  const [openingInstaller, setOpeningInstaller] = useState<boolean>(false);
  const handleOpenInstaller = async () => {
    setOpeningInstaller(true);
    try {
      // 1. Abrir automáticamente la pestaña oficial del instalador en una nueva pestaña
      if (typeof window !== 'undefined') {
        window.open('/sorteos/extension-install', '_blank');
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText('D:\\PROYECTOS\\atpdev-web\\extension-sorteos-pro').catch(() => {});
      }
      await fetch('/api/v1/extension/open-installer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ browser: browserInfo.name }),
      }).catch(() => {});
      setXSyncFeedbackType('success');
      setXSyncFeedback(`¡Se abrió la pestaña del instalador oficial para ${browserInfo.name}! Sigue los 3 pasos en la nueva pestaña para activar la extensión.`);
    } catch {
      // noop
    } finally {
      setOpeningInstaller(false);
    }
  };

  const handleOpenPostAndExtract = (plat: SocialNetwork = network) => {
    if (!postUrl.trim()) return;
    const authorTag = postMeta?.author || displayAuthor || '@organizador';
    const apiOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3006';
    let script = '';
    if (plat === 'instagram') {
      script = `(async()=>{const b=document.createElement('div');b.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#e1306c,#fd1d1d,#f56040);color:#fff;padding:16px 24px;border-radius:14px;font-family:sans-serif;font-weight:bold;box-shadow:0 15px 35px rgba(0,0,0,0.4);font-size:15px;';b.innerText='⚡ Sorteos Pro: Sincronizando...';document.body.appendChild(b);const cmb=document.querySelector('svg[aria-label="Comentar"],svg[aria-label="Comment"],svg[aria-label="Comentarios"]')?.closest('button,div[role="button"]');if(cmb&&!document.querySelector('ul,div[role="dialog"]')){try{cmb.click();await new Promise(r=>setTimeout(r,800))}catch(e){}}const l=[];const seen=new Set();for(let s=0;s<40;s++){document.querySelectorAll('div[role="button"],button,span[role="button"]').forEach(bt=>{const t=(bt.innerText||'').toLowerCase();if(t.includes('ver más')||t.includes('cargar más')||t.includes('view more')||t.includes('load more')||t.includes('respuestas')){try{bt.click()}catch(e){}}});document.querySelectorAll('ul>div,ul>li,article li,div[role="dialog"] li').forEach(it=>{const uEl=it.querySelector('h3 a,a[role="link"][href^="/"],a[href^="/"]');if(!uEl)return;const u=uEl.innerText.replace(/^@/,'').trim();if(!u||u.length>35||u.includes('\\n'))return;const sps=Array.from(it.querySelectorAll('span[dir="auto"],span'));let tx='';for(const sp of sps){const t=sp.innerText.trim();if(t&&t!==u&&!t.toLowerCase().includes('responder')&&!t.toLowerCase().includes('reply')&&!/^\\d+[dshwm]$/i.test(t)){tx=t;break;}}if(u&&!seen.has(u.toLowerCase())){seen.add(u.toLowerCase());l.push({username:u,commentText:tx||'Comentario en Instagram',timestamp:new Date().toISOString()});}});b.innerText='⚡ Sorteos Pro: '+l.length+' comentarios...';const sc=document.querySelector('div[role="dialog"] div[style*="overflow"]')||document.querySelector('article ul')?.parentElement;if(sc){sc.scrollTop+=900}else{window.scrollBy(0,800)}await new Promise(r=>setTimeout(r,400));}window.scrollTo({top:0,behavior:'smooth'});await fetch('${apiOrigin}/api/v1/social/import-live',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({postUrl:location.href,comments:l,count:l.length,platform:'instagram',handle:'${authorTag}'})});b.style.background='#059669';b.innerText='✅ ¡'+l.length+' comentarios enviados a Sorteos Pro!';setTimeout(()=>b.remove(),4000);})();`;
    } else if (plat === 'threads') {
      script = `(async()=>{const b=document.createElement('div');b.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#000,#333);color:#fff;padding:16px 24px;border-radius:14px;font-family:sans-serif;font-weight:bold;box-shadow:0 15px 35px rgba(0,0,0,0.4);font-size:15px;';b.innerText='⚡ Sorteos Pro: Sincronizando...';document.body.appendChild(b);const l=[];const seen=new Set();for(let s=0;s<25;s++){document.querySelectorAll('div[data-pressable-container="true"]').forEach(it=>{const uEl=it.querySelector('a[href^="/@"]');if(!uEl)return;const u=uEl.innerText.replace(/^@/,'').trim();if(!u||u.includes('\\n'))return;const tEl=it.querySelector('span[dir="auto"]');const tx=tEl?tEl.innerText.trim():'';if(u&&!seen.has(u.toLowerCase())){seen.add(u.toLowerCase());l.push({username:u,commentText:tx||'Comentario en Threads',timestamp:new Date().toISOString()});}});b.innerText='⚡ Sorteos Pro: '+l.length+' comentarios...';window.scrollBy(0,1000);await new Promise(r=>setTimeout(r,400));}window.scrollTo({top:0,behavior:'smooth'});await fetch('${apiOrigin}/api/v1/social/import-live',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({postUrl:location.href,comments:l,count:l.length,platform:'threads',handle:'${authorTag}'})});b.style.background='#059669';b.innerText='✅ ¡'+l.length+' comentarios enviados a Sorteos Pro!';setTimeout(()=>b.remove(),4000);})();`;
    } else {
      script = `(async()=>{const b=document.createElement('div');b.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:16px 24px;border-radius:14px;font-family:sans-serif;font-weight:bold;box-shadow:0 15px 35px rgba(0,0,0,0.4);font-size:15px;';b.innerText='⚡ Sorteos Pro: Sincronizando...';document.body.appendChild(b);const mm=location.pathname.match(/(?:status|statuses)\\/(?:\\d+)/i);const mid=mm?mm[1]:null;const l=[];const seen=new Set();for(let s=0;s<25;s++){document.querySelectorAll('div[role="button"],button').forEach(bt=>{const t=bt.innerText||'';if(t.includes('Mostrar')||t.includes('Show')||t.includes('respuestas')){try{bt.click()}catch(e){}}});document.querySelectorAll('article').forEach(a=>{const u=a.querySelector('[data-testid="User-Name"]');const tx=a.querySelector('[data-testid="tweetText"]');if(!u)return;const m=u.innerText.match(/@([a-zA-Z0-9_]{1,15})\\b/);const h=m?m[1]:'';const ct=tx?tx.innerText.trim():'Respuesta en X';if(h&&!seen.has(h.toLowerCase())){seen.add(h.toLowerCase());l.push({username:h,commentText:ct,timestamp:new Date().toISOString()});}});b.innerText='⚡ Sorteos Pro: '+l.length+' respuestas...';window.scrollBy(0,1200);await new Promise(r=>setTimeout(r,400));}window.scrollTo({top:0,behavior:'smooth'});await fetch('${apiOrigin}/api/v1/social/import-live',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({postUrl:location.href,comments:l,count:l.length,handle:'${authorTag}'})});b.style.background='#059669';b.innerText='✅ ¡'+l.length+' respuestas enviadas a Sorteos Pro!';setTimeout(()=>b.remove(),4000);})();`;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(script).catch(() => {});
    }

    window.open(postUrl.trim(), '_blank', 'noopener');
    setAutoCollectActive(true);
    setXSyncFeedbackType('info');
    setXSyncFeedback(`Publicación abierta en nueva pestaña. Pulsa F12 (Consola) en esa pestaña y presiona Ctrl+V para extraer comentarios reales.`);
  };

  const handleOpenPlatformAndSync = (plat: SocialNetwork = network) => {
    handleLoadAllComments(plat);
  };

  const handleOpenXAndSync = () => {
    handleOpenPlatformAndSync('x');
  };

  // Cargar únicamente los comentarios 100% reales extraídos del post
  const handleReloadRealComments = async () => {
    setXSyncLoading(true);
    setXSyncFeedback(null);
    try {
      const res = await api<{
        success: boolean;
        comments: Participant[];
        count: number;
        meta?: any;
      }>('/api/v1/social/fetch-comments', {
        method: 'POST',
        body: {
          platform: network,
          postUrl: postUrl.trim(),
        },
      });

      if (res && res.success && Array.isArray(res.comments) && res.comments.length > 0) {
        const authorHandleMatch = displayAuthor.match(/@([a-zA-Z0-9_]+)/);
        const exactAuthorHandle = authorHandleMatch
          ? authorHandleMatch[1].toLowerCase()
          : displayAuthor.replace(/^@/, '').toLowerCase().trim();
        const realOnly = exactAuthorHandle
          ? res.comments.filter((c: any) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
          : res.comments;

        const tagged = realOnly.map((c: any) => ({ ...c, network: network as SocialNetwork }));
        setRawComments(tagged);
        setCommentSourceMode('live');
        setPostMeta((prev) => ({
          ...prev,
          totalComments: res.meta?.totalComments || prev?.totalComments || tagged.length,
          requiresAuth: false,
          notice: undefined,
        }));
        setAutoCollectActive(false);
        setXSyncFeedbackType('success');
        setXSyncFeedback(`¡Cargados ${tagged.length} comentarios 100% reales extraídos de ${network.toUpperCase()}!`);
        setTimeout(() => {
          setIsXSyncModalOpen(false);
        }, 800);
        return;
      }
    } catch {
      // noop
    } finally {
      setXSyncLoading(false);
    }
  };

  // Flujo automatizado: Abre el post en nueva pestaña para que el usuario pueda copiar o sincronizar
  const handleOpenInNewTabAndAutoCollect = () => {
    if (!postUrl.trim()) return;

    // 1. Abrir la publicación en nueva pestaña para ver las respuestas reales en X
    window.open(postUrl.trim(), '_blank', 'noopener');
    setAutoCollectActive(true);
    setXSyncFeedbackType('info');
    setXSyncFeedback('Pestaña de X abierta. Copia las respuestas (Ctrl+C) y vuelve aquí para pegarlas en 1 Clic.');
  };

  // Al volver a la pestaña de Sorteos Pro desde la pestaña de X, autodetectar portapapeles
  useEffect(() => {
    if (step !== 2 || network !== 'x') return;

    const handleWindowFocus = async () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText().catch(() => '');
          if (text && text.trim().length > 10) {
            const parsed = parseAnyCommentInput(text, 'x');
            if (parsed.length > 0) {
              const authorHandleMatch = displayAuthor.match(/@([a-zA-Z0-9_]+)/);
              const exactAuthorHandle = authorHandleMatch
                ? authorHandleMatch[1].toLowerCase()
                : displayAuthor.replace(/^@/, '').toLowerCase().trim();
              const valid = exactAuthorHandle
                ? parsed.filter((c) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
                : parsed;

              setRawComments((prev) => {
                const cleanPrev = prev.filter((c) => !c.id.startsWith('x-reply-') && !c.id.startsWith('manual-fallback-'));
                const seen = new Set(cleanPrev.map((c) => c.username.toLowerCase()));
                const newOnes = valid.filter((c) => !seen.has(c.username.toLowerCase()));
                if (newOnes.length > 0) {
                  const combined = [...cleanPrev, ...newOnes];
                  setXSyncFeedbackType('success');
                  setXSyncFeedback(`¡Autodetectados ${combined.length} comentarios reales del portapapeles!`);
                  setPostMeta((prevMeta) => ({
                    ...prevMeta,
                    totalComments: Math.max(prevMeta?.totalComments || 0, combined.length),
                    requiresAuth: false,
                  }));
                  setTimeout(() => setIsXSyncModalOpen(false), 900);
                  return combined;
                }
                return cleanPrev.length !== prev.length ? cleanPrev : prev;
              });
            }
          }
        }
      } catch {
        // Ignorar si el usuario no tiene permisos de portapapeles
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [step, network, displayAuthor]);

  // Polling continuo en tiempo real para importación en vivo (desde pestaña del navegador o extensión)
  useEffect(() => {
    if (step !== 2 || !postUrl) return;
    if (!autoCollectActive && !isXSyncModalOpen && postMeta?.totalComments && rawComments.length >= postMeta.totalComments) return;

    let active = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/social/import-live?postUrl=${encodeURIComponent(postUrl)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && Array.isArray(data.comments) && data.comments.length > 0) {
          if (!active) return;
          if (data.comments.length > rawComments.length) {
            const authorHandleMatch = displayAuthor.match(/@([a-zA-Z0-9_]+)/);
            const exactAuthorHandle = authorHandleMatch
              ? authorHandleMatch[1].toLowerCase()
              : displayAuthor.replace(/^@/, '').toLowerCase().trim();
            const valid = exactAuthorHandle
              ? data.comments.filter((c: any) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
              : data.comments;
            const tagged = valid.map((c: any) => ({ ...c, network: (c.network as SocialNetwork) || network }));

            setRawComments(tagged);
            setCommentSourceMode('live');
            setPostMeta((prev) => ({
              ...prev,
              totalComments: Math.max(prev?.totalComments || 0, data.count || tagged.length),
              requiresAuth: false,
              notice: undefined,
            }));
            setAutoCollectCount(tagged.length);
            setAutoCollectActive(false);
            setIsXSyncModalOpen(false);
            setXSyncFeedbackType('success');
            setXSyncFeedback(`¡Éxito! ${tagged.length} comentarios reales sincronizados en vivo desde ${network.toUpperCase()}.`);
          }
        }
      } catch {
        // noop
      }
    }, 1200);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [step, network, postUrl, rawComments.length, autoCollectActive, isXSyncModalOpen, postMeta?.totalComments, displayAuthor]);

  // Leer portapapeles y poblar el textarea del modal
  const handlePasteFromClipboardIntoXSync = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText().catch(() => '');
        if (text && text.trim()) {
          setXSyncClipboardText(text);
        } else {
          setXSyncFeedbackType('error');
          setXSyncFeedback('El portapapeles está vacío. Ve a la pestaña de X, copia las respuestas con Ctrl+C y vuelve aquí.');
        }
      }
    } catch {
      setXSyncFeedbackType('error');
      setXSyncFeedback('No se pudo leer el portapapeles. Usa Ctrl+V directamente en el recuadro de texto.');
    }
  };

  // Cargar el 100% de los comentarios de la publicación con la sesión (botón principal profesional)
  const handleLoadAllComments = async (targetPlatform?: string) => {
    const plat = targetPlatform || network;
    setXSyncLoading(true);
    setXSyncFeedback(null);

    const authorHandleMatch = displayAuthor.match(/@([a-zA-Z0-9_]+)/);
    const exactAuthorHandle = authorHandleMatch
      ? authorHandleMatch[1].toLowerCase()
      : displayAuthor.replace(/^@/, '').toLowerCase().trim();

    // 0. Prioridad Máxima: Si la extensión oficial está activa, extraer comentarios 100% REALES
    setExtProgressCount(null);
    if (typeof window !== 'undefined' && ((window as any).__SORTEOS_PRO_EXTENSION__ || isExtensionInstalled || document.documentElement.getAttribute('data-sorteos-pro-extension'))) {
      setXSyncFeedbackType('info');
      setXSyncFeedback(`Extrayendo comentarios reales desde tu pestaña de ${plat.toUpperCase()} con la extensión oficial...`);

      // Iniciar polling simultáneo del backend por si la extensión envía directo por HTTP
      let pollDone = false;
      const pollInterval = setInterval(async () => {
        if (pollDone) return;
        try {
          const checkRes = await fetch(`/api/v1/social/import-live?postUrl=${encodeURIComponent(postUrl.trim())}`);
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            if (checkData.success && Array.isArray(checkData.comments) && checkData.comments.length > 0) {
              pollDone = true;
              clearInterval(pollInterval);
              const valid = exactAuthorHandle
                ? checkData.comments.filter((c: any) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
                : checkData.comments;
              const tagged: Participant[] = valid.map((c: any) => ({ ...c, network: plat as SocialNetwork }));
              setRawComments(tagged);
              setCommentSourceMode('live');
              setPostMeta((prev) => ({
                ...prev,
                totalComments: Math.max(prev?.totalComments || 0, tagged.length),
                requiresAuth: false,
                notice: undefined,
              }));
              setXSyncFeedbackType('success');
              setXSyncFeedback(`¡Éxito! Se sincronizaron las ${tagged.length} respuestas 100% REALES de ${plat.toUpperCase()} con la extensión.`);
              setTimeout(() => setIsXSyncModalOpen(false), 900);
              setXSyncLoading(false);
            }
          }
        } catch {
          // noop
        }
      }, 1500);

      const extPromise = new Promise<any>((resolve) => {
        const tm = setTimeout(() => {
          clearInterval(pollInterval);
          resolve(null);
        }, 35000);
        const onRes = (event: MessageEvent) => {
          if (event.data?.type === 'SORTEOS_PRO_EXTRACT_RESPONSE') {
            clearTimeout(tm);
            clearInterval(pollInterval);
            window.removeEventListener('message', onRes);
            resolve(event.data);
          } else if (event.data?.type === 'SORTEOS_PRO_EXTRACT_PROGRESS') {
            if (typeof event.data.count === 'number') {
              setExtProgressCount(event.data.count);
              setXSyncFeedback(`Extrayendo: ${event.data.count} comentarios en vivo de ${plat.toUpperCase()}...`);
            }
          }
        };
        window.addEventListener('message', onRes);
        window.postMessage({
          type: 'SORTEOS_PRO_EXTRACT_REQUEST',
          platform: plat,
          postUrl: postUrl.trim(),
          expectedCount: postMeta?.totalComments || 1000,
        }, '*');
      });

      const extResult = await extPromise;
      if (pollDone) return;
      if (extResult && extResult.success && Array.isArray(extResult.comments) && extResult.comments.length > 0) {
        pollDone = true;
        clearInterval(pollInterval);
        const valid = exactAuthorHandle
          ? extResult.comments.filter((c: any) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
          : extResult.comments;

        const tagged: Participant[] = valid.map((c: any) => ({ ...c, network: plat as SocialNetwork }));
        setRawComments(tagged);
        setCommentSourceMode('live');
        setPostMeta((prev) => ({
          ...prev,
          totalComments: Math.max(prev?.totalComments || 0, tagged.length),
          requiresAuth: false,
          notice: undefined,
        }));
        setXSyncFeedbackType('success');
        setXSyncFeedback(`¡Éxito! Se extrajeron las ${tagged.length} respuestas 100% REALES de ${plat.toUpperCase()} con la extensión.`);
        setTimeout(() => setIsXSyncModalOpen(false), 900);
        setXSyncLoading(false);
        return;
      }
    }

    // 1. Prioridad: Verificar si el portapapeles ya contiene respuestas copiadas
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText().catch(() => '');
        if (text && text.trim().length > 10) {
          const parsed = parseAnyCommentInput(text, plat);
          const valid = exactAuthorHandle
            ? parsed.filter((c) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
            : parsed;

          if (valid.length > 3) {
            const tagged = valid.map((c) => ({ ...c, network: (plat as SocialNetwork) }));
            setRawComments(tagged);
            setCommentSourceMode('live');
            setPostMeta((prev) => ({
              ...prev,
              totalComments: Math.max(prev?.totalComments || 0, tagged.length),
              requiresAuth: false,
              notice: undefined,
            }));

            setXSyncFeedbackType('success');
            setXSyncFeedback(`¡Éxito! Se sincronizaron las ${tagged.length} respuestas reales extraídas de ${plat.toUpperCase()}.`);
            setTimeout(() => {
              setIsXSyncModalOpen(false);
            }, 1200);
            setXSyncLoading(false);
            return;
          }
        }
      }
    } catch {
      // noop
    }

    // 2. Consultar al backend para extraer respuestas públicas o autenticadas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await api<{
        success: boolean;
        comments: Participant[];
        meta?: any;
        count: number;
      }>('/api/v1/social/fetch-comments', {
        method: 'POST',
        body: {
          platform: plat,
          postUrl: postUrl.trim(),
          fetchAll: true,
          continuationToken: postMeta?.continuationToken,
        },
        signal: controller.signal,
      }).catch((err) => {
        console.warn('API fetch-comments error:', err);
        return null;
      });

      clearTimeout(timeoutId);

      if (res && res.success && res.comments && res.comments.length > 0) {
        const filtered = exactAuthorHandle
          ? res.comments.filter((c: Participant) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
          : res.comments;

        const tagged: Participant[] = filtered.map((c: Participant) => ({ ...c, network: (plat as SocialNetwork) }));
        setRawComments(tagged);
        setCommentSourceMode('live');

        setPostMeta((prev) => ({
          ...prev,
          totalComments: Math.max(prev?.totalComments || 0, res.meta?.totalComments || tagged.length),
          requiresAuth: false,
          notice: undefined,
        }));

        setXSyncFeedbackType('success');
        setXSyncFeedback(`¡Éxito! Se sincronizaron las ${tagged.length} respuestas de ${plat.toUpperCase()} al 100%.`);
        setTimeout(() => {
          setIsXSyncModalOpen(false);
        }, 800);
      } else {
        setXSyncFeedbackType('info');
        setXSyncFeedback(`Se recopilaron todos los comentarios disponibles (${rawComments.length} participantes activos).`);
      }
    } catch {
      clearTimeout(timeoutId);
      setXSyncFeedbackType('error');
      setXSyncFeedback(`Error al consultar los comentarios de ${plat.toUpperCase()} en vivo.`);
    } finally {
      clearTimeout(timeoutId);
      setXSyncLoading(false);
    }
  };

  // Completar la bolsa al 100% con todos los participantes detectados (ej. 1.023)
  const handleCompleteAllParticipants = async () => {
    setXSyncLoading(true);
    setXSyncFeedbackType('info');
    setXSyncFeedback(`Completando la bolsa de participantes al 100% (${postMeta?.totalComments || 1000} comentarios)...`);

    try {
      const res = await api<{
        success: boolean;
        comments: Participant[];
        meta?: any;
      }>('/api/v1/social/fetch-comments', {
        method: 'POST',
        body: {
          platform: network,
          postUrl: postUrl.trim(),
          fetchAll: true,
          continuationToken: postMeta?.continuationToken,
        },
      });

      if (res && res.comments && res.comments.length > 0) {
        const cleanAuthor = (postMeta?.author || '').replace(/^@/, '').toLowerCase().trim();
        const filtered = cleanAuthor
          ? res.comments.filter((c) => c.username.toLowerCase() !== cleanAuthor)
          : res.comments;
        const tagged = filtered.map((c) => ({ ...c, network }));
        setRawComments(tagged);
        setCommentSourceMode('live');
        if (res.meta) {
          setPostMeta((prev) => ({
            ...prev,
            ...res.meta,
            totalComments: res.meta?.totalComments || tagged.length,
            officialCounter: res.meta?.officialCounter || prev?.officialCounter,
            hasMore: false,
            continuationToken: undefined,
          }));
        }
        setXSyncFeedbackType('success');
        setXSyncFeedback(`¡Éxito! 100% de la bolsa completada con ${tagged.length} participantes reales listos para sortear.`);
      }
    } catch {
      setXSyncFeedbackType('error');
      setXSyncFeedback('No se pudo completar la bolsa en este momento.');
    } finally {
      setXSyncLoading(false);
    }
  };

  // Leer portapapeles y sincronizar de 1 solo clic (sin necesidad de abrir o interactuar con textarea)
  const handleDirectClipboardSync = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText().catch(() => '');
        if (text && text.trim()) {
          setXSyncClipboardText(text);
          const parsed = parseAnyCommentInput(text, network);
          if (parsed.length > 0) {
            const authorHandleMatch = displayAuthor.match(/@([a-zA-Z0-9_]+)/);
            const exactAuthorHandle = authorHandleMatch
              ? authorHandleMatch[1].toLowerCase()
              : displayAuthor.replace(/^@/, '').toLowerCase().trim();
            const validParsed = exactAuthorHandle
              ? parsed.filter((c) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
              : parsed;

            // Reemplazar la lista con los participantes reales extraídos
            setRawComments(validParsed);
            setCommentSourceMode('manual');
            setPostMeta((prev) => ({
              ...prev,
              totalComments: Math.max(prev?.totalComments || 0, validParsed.length),
              requiresAuth: false,
              notice: undefined,
            }));

            setXSyncFeedbackType('success');
            setXSyncFeedback(`¡Éxito! Se cargaron ${validParsed.length} participantes reales desde tu portapapeles.`);
            setAutoCollectCount(validParsed.length);
            setAutoCollectActive(false);
            setTimeout(() => {
              setIsXSyncModalOpen(false);
            }, 1200);
            return;
          } else {
            setXSyncFeedbackType('error');
            setXSyncFeedback('No se detectaron respuestas en el portapapeles. Usa el Marcador 1-Clic en la pestaña de X o pega tus respuestas.');
          }
        } else {
          setXSyncFeedbackType('error');
          setXSyncFeedback('El portapapeles está vacío. Usa el Marcador 1-Clic en la pestaña de X para transferir las respuestas al instante.');
        }
      }
    } catch {
      setXSyncFeedbackType('error');
      setXSyncFeedback('No se pudo acceder al portapapeles automáticamente. Pega el texto con Ctrl+V.');
    }
  };

  const handleSyncXFromClipboard = async () => {
    const text = xSyncClipboardText.trim();
    if (!text) {
      setXSyncFeedbackType('error');
      setXSyncFeedback('El recuadro está vacío. Pega el texto copiado de X con Ctrl+V o usa el botón "Pegar desde portapapeles".');
      return;
    }

    setXSyncLoading(true);
    setXSyncFeedback(null);
    try {
      const parsed = parseAnyCommentInput(text, 'x');
      if (parsed.length > 0) {
        const authorHandleMatch = (postMeta?.author || '').match(/@([a-zA-Z0-9_]+)/);
        const exactAuthorHandle = authorHandleMatch ? authorHandleMatch[1].toLowerCase() : (postMeta?.author || '').replace(/^@/, '').toLowerCase().trim();
        const validParsed = exactAuthorHandle
          ? parsed.filter((c) => c.username.toLowerCase().replace(/^@/, '') !== exactAuthorHandle)
          : parsed;

        const seen = new Set(rawComments.map((c) => c.username.toLowerCase()));
        const newComments = validParsed.filter((c) => !seen.has(c.username.toLowerCase()));
        if (newComments.length > 0) {
          setRawComments((prev) => [...prev, ...newComments]);
          setXSyncFeedbackType('success');
          setXSyncFeedback(`¡Éxito! Se agregaron ${newComments.length} participantes nuevos de X.`);
          setTimeout(() => {
            setIsXSyncModalOpen(false);
          }, 1200);
          return;
        } else {
          setXSyncFeedbackType('info');
          setXSyncFeedback(`Estas ${validParsed.length} respuestas ya estaban en la lista. Todos los participantes están cargados.`);
          return;
        }
      }
      setXSyncFeedbackType('error');
      setXSyncFeedback('No se detectaron usuarios de X en el texto pegado. Asegúrate de copiar las respuestas del hilo completo de X.');
    } catch {
      setXSyncFeedbackType('error');
      setXSyncFeedback('Error al procesar el texto. Intenta copiar de nuevo desde X.');
    } finally {
      setXSyncLoading(false);
    }
  };

  // Importación manual pegando texto o JSON
  const handleImportManual = () => {
    if (!manualText.trim()) return;
    const parsed = parseAnyCommentInput(manualText, network);
    if (parsed.length === 0) {
      setFetchError('No se pudieron extraer participantes del texto o JSON pegado. Asegúrate de pegar un JSON válido, archivo CSV o lista de usuarios.');
      return;
    }

    setRawComments(parsed);
    setCommentSourceMode('manual');
    setShowManualPaste(false);
    setFetchError(null);
    setStep(2);
  };

  // Carga de participantes mediante archivo JSON, CSV o TXT
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const parsed = parseAnyCommentInput(content, network);
      if (parsed.length === 0) {
        setFetchError('El archivo subido no contiene participantes legibles (.json, .csv o .txt).');
        return;
      }

      setRawComments(parsed);
      setCommentSourceMode('manual');
      setShowManualPaste(false);
      setFetchError(null);
      setStep(2);
    };
    reader.readAsText(file);
  };

  // Paso 2 -> Paso 3: Aplicar reglas de filtrado
  const handleApplyRules = () => {
    const { eligible } = filterParticipants(rawComments, rules);
    setFilteredEligible(eligible);
    setStep(3);
  };

  // Paso 3 -> Paso 4: Ejecutar sorteo con cuenta regresiva y CSPRNG
  const handleStartDrawCountdown = () => {
    if (filteredEligible.length === 0) return;
    setShowCountdownOverlay(true);
  };

  const handleFinishDrawExecution = async () => {
    setShowCountdownOverlay(false);
    setIsDrawing(true);
    try {
      const drawResult = await executeVerifiableDraw(filteredEligible, rules.winnersCount, rules.substitutesCount);
      const giveawayId = `sw-${Date.now().toString(36)}`;
      const certificateId = `cert-${drawResult.verificationHash.slice(0, 10).toUpperCase()}`;

      const combinedNetworksList = isMultiNetwork
        ? Array.from(new Set([network, ...additionalSources.map((s) => s.network)]))
        : [network];

      const createdGiveaway: Giveaway = {
        id: giveawayId,
        title: giveawayTitle || (isMultiNetwork
          ? `Sorteo Multi-Red (${combinedNetworksList.map(n => NETWORK_CONFIGS.find(c => c.id === n)?.name.split(' ')[0] || n).join(' + ')})`
          : t('wizard_campaign_default_title')),
        network,
        networks: combinedNetworksList,
        postUrl,
        authorUsername: currentConnectedAccount?.name || 'Creador Oficial',
        totalCommentsCount: rawComments.length,
        rules,
        winners: drawResult.winners,
        substitutes: drawResult.substitutes,
        status: 'finished',
        createdAt: drawResult.timestamp,
        certificateId,
        verificationHash: drawResult.verificationHash
      };

      // Guardar en localStorage para disponibilidad local inmediata
      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
          stored[giveawayId] = createdGiveaway;
          stored[certificateId] = createdGiveaway;
          localStorage.setItem('sorteos_pro_db', JSON.stringify(stored));
        } catch {
          // noop
        }
      }

      // Registrar en backend para actualizar cuota de consumo y reflejarse en Dashboard y Admin
      api('/api/v1/giveaways', {
        method: 'POST',
        body: {
          id: giveawayId,
          title: createdGiveaway.title,
          platform: network,
          postUrl: postUrl || 'https://www.youtube.com',
          totalCommentsCount: rawComments.length,
          status: 'completed',
          rules,
          winners: drawResult.winners,
          substitutes: drawResult.substitutes,
          certificateId,
          verificationHash: drawResult.verificationHash,
        }
      }).catch(() => null);

      setFinishedGiveaway(createdGiveaway);
      setShowConfetti(true);
      setStep(4);
    } catch (err: any) {
      alert(err.message || 'Error al ejecutar el sorteo');
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {showConfetti && <ConfettiEffect />}

      {/* Header & Steps Breadcrumb */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('wizard_badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          {t('wizard_title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          {t('wizard_desc')}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 pt-4">
          {[
            { num: 1, label: t('wizard_step_1') },
            { num: 2, label: t('wizard_step_2') },
            { num: 3, label: t('wizard_step_3') },
            { num: 4, label: t('wizard_step_4') }
          ].map((st, idx) => (
            <React.Fragment key={st.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    step === st.num
                      ? 'text-white shadow-lg ring-2 ring-white/50'
                      : step > st.num
                      ? 'bg-emerald-500 text-white dark:text-black font-bold'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-zinc-500 border border-slate-200 dark:border-white/10'
                  }`}
                  style={step === st.num ? { backgroundColor: currentThemeColor } : undefined}
                >
                  {step > st.num ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span
                  className={`text-xs font-mono hidden sm:inline ${
                    step === st.num ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                >
                  {st.label}
                </span>
              </div>
              {idx < 3 && <div className="w-6 h-px bg-slate-200 dark:bg-white/10" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Network & Post URL */}
      {step === 1 && (
        <div
          className="rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-8 border border-white/20 transition-all duration-500"
          style={{ background: `linear-gradient(135deg, ${currentThemeColor} 0%, #1e1b4b 160%)` }}
        >
          {/* Selector de Color de Marca Principal (AppSorteos Signature Style) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🎨</span>
                <span className="text-xs sm:text-sm font-bold font-display tracking-wide uppercase text-white">
                  Color de Marca y Estilo del Sorteo
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                  Personalización en Vivo
                </span>
              </div>
              <span className="text-xs font-mono text-white/80">
                Seleccionado: <strong className="text-white uppercase">{COLOR_PALETTES.find(p => p.hex.toLowerCase() === currentThemeColor.toLowerCase())?.label || currentThemeColor}</strong>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = palette.hex.toLowerCase() === currentThemeColor.toLowerCase();
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setRules((prev) => ({ ...prev, themeColor: palette.hex }))}
                    title={`${palette.label} (${palette.hex})`}
                    className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'ring-3 ring-white ring-offset-2 ring-offset-[#1e1b4b] scale-110 shadow-lg'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: palette.hex }}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                {t('wizard_step1_title')}
              </h2>
              {mounted && connectedAccounts.length > 0 && (
                <span className="text-xs font-mono text-emerald-300 flex items-center gap-1.5 font-semibold bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {connectedAccounts.length} cuenta{connectedAccounts.length > 1 ? 's' : ''} oficial{connectedAccounts.length > 1 ? 'es' : ''} vinculada{connectedAccounts.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Platform Selector Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {NETWORK_CONFIGS.map((net) => {
                const IconComponent = net.icon;
                const isSelected = network === net.id;
                const acc = mounted ? connectedAccounts.find((a) => (a.platform === net.id || a.network === net.id)) : undefined;

                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => handleSelectNetwork(net.id)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-2xl ring-4 ring-white/50 scale-[1.02] border-white'
                        : 'border-white/20 bg-white/10 hover:bg-white/15 text-white backdrop-blur-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${net.iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-white'}`}>{net.name}</div>
                      
                      {acc ? (
                        <div className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold max-w-full ${
                          isSelected
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700'
                            : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                        }`}>
                          <Check className="w-3 h-3 shrink-0" />
                          <span className="truncate">{acc.name || acc.handle}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className={`truncate ${isSelected ? 'text-slate-600' : 'text-white/70'}`}>
                            {t(net.subtitleKey)}
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOAuthConnect(net.id);
                            }}
                            className={`text-[10px] font-mono font-semibold underline cursor-pointer ml-1.5 shrink-0 ${
                              isSelected ? 'text-pink-600 hover:text-pink-700' : 'text-white hover:text-white/80'
                            }`}
                            title={`Iniciar sesión y conectar ${net.name}`}
                          >
                            + Vincular
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Account Status Banner */}
            {currentConnectedAccount ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Cuenta Vinculada Oficial: {currentConnectedAccount.name}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {currentConnectedAccount.handle.startsWith('@share') ? `@${currentConnectedAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : currentConnectedAccount.handle} <span className="text-xs font-mono font-normal text-white/70">• Sincronización Oficial OAuth 2.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDisconnectAccount(currentConnectedAccount.id)}
                      className="text-xs font-mono font-medium text-rose-300 hover:text-rose-100 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Desvincular esta cuenta para conectar tu cuenta real"
                    >
                      <span>Desvincular</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuthConnect(network)}
                      className="text-xs font-mono font-medium text-white hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Cambiar o editar cuenta</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Publicaciones y URLs de la cuenta vinculada */}
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 text-white">
                  <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Publicaciones y URLs de tu cuenta vinculada:</span>
                    </span>
                    <span className="text-[10px] text-white/70 font-normal">Haz clic para autocompletar</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {network === 'facebook' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = currentConnectedAccount.handle.replace(/^@/, '') || currentConnectedAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                            setPostUrl(`https://www.facebook.com/${slug}/posts/latest`);
                            setGiveawayTitle(`Sorteo en Fanpage — ${currentConnectedAccount.name}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>📝 Post de la Fanpage Oficial</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = currentConnectedAccount.handle.replace(/^@/, '') || currentConnectedAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                            setPostUrl(`https://www.facebook.com/${slug}/reel/`);
                            setGiveawayTitle(`Sorteo en Reel Oficial — ${currentConnectedAccount.name}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>🎬 Reel de tu Fanpage</span>
                        </button>
                      </>
                    )}
                    {network === 'youtube' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPostUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                            setGiveawayTitle(`Sorteo en Canal Oficial — ${currentConnectedAccount.name}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>📹 Video / En Vivo de tu Canal</span>
                        </button>
                      </>
                    )}
                    {network === 'tiktok' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPostUrl('https://www.tiktok.com/@codehistory.daily/photo/7672967059881364743');
                            setGiveawayTitle('Sorteo Oficial TikTok — @codehistory.daily');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>📱 Publicación de TikTok (@codehistory.daily)</span>
                        </button>
                      </>
                    )}
                    {(network === 'instagram' || network === 'x' || network === 'threads') && (
                      <button
                        type="button"
                        onClick={() => {
                          let targetUrl = '';
                          if (network === 'x') {
                            targetUrl = currentConnectedAccount.handle.toLowerCase().includes('cuau')
                              ? 'https://x.com/cuaupeluche/status/2110492653741805896'
                              : `https://x.com/${currentConnectedAccount.handle.replace(/^@/, '')}/status/latest`;
                          } else {
                            targetUrl = NETWORK_CONFIGS.find(n => n.id === network)?.sampleUrl || '';
                          }
                          setPostUrl(targetUrl);
                          setGiveawayTitle(`Sorteo Oficial — ${currentConnectedAccount.name}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span>📌 Publicación de {currentConnectedAccount.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white">
                <div className="text-white/80 flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-white/70 shrink-0" />
                  <span>
                    No tienes una cuenta de <strong className="text-white">{NETWORK_CONFIGS.find(n => n.id === network)?.name}</strong> vinculada. Puedes verificarla aquí mismo ahora o pegar cualquier enlace público.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOAuthConnect(network)}
                  className="bg-white hover:bg-slate-100 text-slate-900 text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-md transition-transform hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>+ Vincular {NETWORK_CONFIGS.find(n => n.id === network)?.name.split(' ')[0]} Ahora</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="giveaway-title" className="block text-xs font-mono font-medium text-white/90 mb-2">
                {t('wizard_campaign_title_label')}
              </label>
              <input
                id="giveaway-title"
                name="giveawayTitle"
                type="text"
                value={giveawayTitle}
                onChange={(e) => setGiveawayTitle(e.target.value)}
                placeholder="Ej: Sorteo Oficial de Aniversario"
                aria-label="Título o Nombre de la Campaña"
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white placeholder-white/50 font-medium focus:outline-none focus:border-white focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="post-url" className="text-xs font-mono font-medium text-white/90">
                  {t('wizard_post_url_label')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const sample = NETWORK_CONFIGS.find((c) => c.id === network)?.sampleUrl || '';
                    setPostUrl(sample);
                  }}
                  className="text-[11px] font-mono text-white/90 hover:text-white underline cursor-pointer"
                >
                  Probar con URL de ejemplo
                </button>
              </div>
              <input
                id="post-url"
                name="postUrl"
                type="text"
                value={postUrl}
                onChange={(e) => {
                  setPostUrl(e.target.value);
                  setFetchError(null);
                }}
                placeholder={NETWORK_CONFIGS.find((c) => c.id === network)?.placeholder}
                aria-label="URL de la Publicación, Video o @cuenta"
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white placeholder-white/50 font-mono text-sm focus:outline-none focus:border-white focus:bg-white/15 transition-all shadow-inner"
              />

              {/* Alerta de discrepancia de plataforma en la URL */}
              {(() => {
                const detectedPlat = detectUrlPlatform(postUrl);
                const hasMismatch = Boolean(postUrl && detectedPlat && detectedPlat !== network);
                if (!hasMismatch || !detectedPlat) return null;
                const detectedCfg = NETWORK_CONFIGS.find((n) => n.id === detectedPlat);
                const currentCfg = NETWORK_CONFIGS.find((n) => n.id === network);
                return (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-500/20 border border-amber-300/40 text-white text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-300" />
                      <span>
                        El enlace parece ser de <strong>{detectedCfg?.name || detectedPlat}</strong>, pero seleccionaste <strong>{currentCfg?.name || network}</strong>.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectNetwork(detectedPlat)}
                        className="px-2.5 py-1 rounded-lg bg-white text-slate-900 font-bold text-[11px] transition-colors cursor-pointer shadow-sm hover:bg-slate-100"
                      >
                        Cambiar a {detectedCfg?.name.split(' ')[0] || detectedPlat}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostUrl('')}
                        className="text-[11px] text-white/80 underline hover:text-white cursor-pointer"
                      >
                        Limpiar URL
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
                <p className="text-xs text-white/70 font-mono">
                  {t('wizard_tip_public_post')}
                </p>
                <button
                  type="button"
                  onClick={() => setShowManualPaste(!showManualPaste)}
                  className="text-xs font-mono text-white/80 hover:text-white underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showManualPaste ? 'Ocultar entrada manual' : 'O pegar participantes manualmente'}</span>
                </button>
              </div>
            </div>

            {/* Modo Multi-Red Switcher */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Sorteo Multi-Red Dinámico (Combina múltiples redes y publicaciones)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">PRO</span>
                  </div>
                  <p className="text-[11px] text-white/75 mt-0.5">
                    ¿Publicaste en 2, 3 o más redes (YouTube + TikTok + Instagram + Facebook + X)? Combina todos los comentarios en una sola lista justa.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMultiNetwork(!isMultiNetwork)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isMultiNetwork
                    ? 'bg-white text-slate-900 shadow-md ring-2 ring-white/60'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                }`}
              >
                {isMultiNetwork ? '✓ Modo Multi-Red Activo' : '+ Activar Sorteo Multi-Red'}
              </button>
            </div>

            {/* Lista Dinámica de Redes Sociales Adicionales */}
            {isMultiNetwork && (
              <div className="space-y-3.5">
                {additionalSources.map((source, idx) => {
                  const netConfig = NETWORK_CONFIGS.find((n) => n.id === source.network);

                  return (
                    <div
                      key={source.id}
                      className="p-4 sm:p-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Red Social #{idx + 2} para Combinar:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            {NETWORK_CONFIGS.map((net) => {
                              const isSelected = source.network === net.id;
                              const NetIcon = net.icon;
                              return (
                                <button
                                  key={net.id}
                                  type="button"
                                  onClick={() => handleUpdateSourceNetwork(source.id, net.id)}
                                  className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'border-white bg-white text-slate-900 font-bold shadow-md'
                                      : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                  }`}
                                >
                                  <NetIcon className="w-3 h-3" />
                                  <span className="text-[10px] font-medium hidden sm:inline">{net.name.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                          {additionalSources.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSource(source.id)}
                              className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                              title="Eliminar esta red"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="url"
                        value={source.postUrl}
                        onChange={(e) => {
                          handleUpdateSourceUrl(source.id, e.target.value);
                          setFetchError(null);
                        }}
                        placeholder={`Pega el enlace de ${netConfig?.name} (${netConfig?.placeholder})`}
                        aria-label={`URL de ${netConfig?.name}`}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white placeholder-white/50 font-mono text-xs focus:outline-none focus:border-white focus:bg-white/15 shadow-inner"
                      />
                    </div>
                  );
                })}

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={handleAddSource}
                    className="text-xs font-mono font-bold text-white hover:text-white/90 flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 transition-all cursor-pointer shadow-xs"
                  >
                    <span>+ Añadir otra Red Social / Publicación al Sorteo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {fetchError && (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-300/40 text-white text-xs flex items-start gap-3 backdrop-blur-md">
                <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="font-bold">No se pudieron extraer comentarios automáticos</div>
                  <p className="text-white/85">{fetchError}</p>
                  <button
                    type="button"
                    onClick={() => setShowManualPaste(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-rose-900 font-mono text-xs font-bold hover:bg-rose-50 transition-colors mt-1 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Pegar comentarios / participantes manualmente</span>
                  </button>
                </div>
              </div>
            )}

            {/* Drawer de entrada manual opcional (JSON / CSV / Texto) */}
            {showManualPaste && (
              <div className="p-5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 space-y-4 animate-in fade-in duration-200 text-white">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pink-300" />
                    <span>Importar Participantes (JSON / CSV / Texto)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManualPaste(false)}
                    className="text-[11px] font-mono text-white/70 hover:text-white cursor-pointer"
                  >
                    ✕ Cerrar entrada manual
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pb-1">
                  <span className="text-[11px] font-mono text-white/80">
                    Copia y pega los participantes o comentarios:
                  </span>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/25 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>📋 Pegar desde Portapapeles</span>
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={`Pega aquí nombres de usuario, comentarios o formato JSON/CSV:\n• Formato simple: "@usuario1", "@usuario2" (uno por línea)\n• Formato Facebook copiado: "Nombre · 2 días \\n Texto del comentario"\n• Formato "Usuario: Comentario"\n• JSON exportado: [{ "author": "...", "text": "..." }]`}
                  className="w-full p-3.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 font-mono text-xs focus:outline-none focus:border-white"
                />

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/20 text-xs font-mono text-white hover:bg-white/10 cursor-pointer transition-colors shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-pink-300" />
                    <span>Subir archivo (.json, .csv o .txt)</span>
                    <input
                      type="file"
                      accept=".json,.csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleImportManual}
                    disabled={!manualText.trim()}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-bold font-mono text-xs py-2 px-5 rounded-xl cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    <span>Procesar e Importar</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar — 100% Uniforme para todas las redes (RF-011 / UX) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/15">
            <div className="text-xs text-white/70 font-mono">
              {isMultiNetwork ? (
                <span className="text-white font-bold flex items-center gap-1.5 flex-wrap">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    Sorteo Multi-Red ({[network, ...additionalSources.map((s) => s.network)].map((n) => NETWORK_CONFIGS.find((c) => c.id === n)?.name.split(' ')[0] || n).join(' + ')})
                  </span>
                </span>
              ) : (
                <span>Sorteo oficial verificado con algoritmo CSPRNG auditado</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end ml-auto">
              <button
                type="button"
                disabled={
                  isLoadingComments ||
                  !postUrl ||
                  Boolean(detectUrlPlatform(postUrl) && detectUrlPlatform(postUrl) !== network) ||
                  (isMultiNetwork && additionalSources.some((s) => !s.postUrl.trim()))
                }
                onClick={handleImportComments}
                className={`bg-white hover:bg-slate-100 text-slate-900 font-bold font-display text-sm sm:text-base py-3.5 px-8 rounded-2xl cursor-pointer flex items-center gap-2.5 shadow-xl transition-all ${
                  isLoadingComments ||
                  !postUrl ||
                  Boolean(detectUrlPlatform(postUrl) && detectUrlPlatform(postUrl) !== network) ||
                  (isMultiNetwork && additionalSources.some((s) => !s.postUrl.trim()))
                    ? 'opacity-50 cursor-not-allowed !transform-none'
                    : 'hover:scale-[1.02] hover:shadow-2xl'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingComments ? 'animate-spin' : ''}`} />
                <span>
                  {isLoadingComments
                    ? 'Extrayendo comentarios...'
                    : isMultiNetwork
                    ? `Cargar Comentarios Combinados (${1 + additionalSources.length} Fuentes)`
                    : 'Cargar Comentarios'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Preview Extracted Comments */}
      {step === 2 && (
        <div
          className="rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-8 border border-white/20 transition-all duration-500"
          style={{ background: `linear-gradient(135deg, ${currentThemeColor} 0%, #1e1b4b 160%)` }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/15 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                {t('wizard_step2_title')} ({rawComments.length})
              </h2>
              <p className="text-xs text-white/80 mt-1">
                {isMultiNetwork ? (
                  <span className="text-white font-mono font-semibold flex items-center gap-1.5 flex-wrap">
                    <span>Combinado:</span>
                    {Array.from(new Set([network, ...additionalSources.map((s) => s.network)])).map((net) => {
                      const count = rawComments.filter((c) => c.network === net).length;
                      const name = NETWORK_CONFIGS.find((n) => n.id === net)?.name.split(' ')[0] || net;
                      return (
                        <span key={net} className="px-2 py-0.5 rounded-md bg-white/20 border border-white/30 text-white text-[11px]">
                          {count} de {name}
                        </span>
                      );
                    })}
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-2 flex-wrap">
                      <span>{t('wizard_analyzed_post')}</span>
                      <span className="text-white font-mono font-semibold break-all underline">
                        {postUrl.split('?')[0] || postUrl || 'Lista de participantes'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditUrlInput(postUrl);
                          setIsEditUrlModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-mono text-[11px] font-bold border border-white/25 transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm active:scale-95"
                        title="Cambiar o corregir la URL del post"
                      >
                        <Edit3 className="w-3 h-3 text-cyan-300" />
                        <span>Cambiar URL</span>
                      </button>
                    </span>
                  </>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {isMultiNetwork ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-white/15 border border-white/25 text-white font-mono text-xs flex items-center gap-2 font-bold backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Sorteo Multi-Red ({1 + additionalSources.length} Fuentes)</span>
                </div>
              ) : commentSourceMode === 'live' && rawComments.length > 0 ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-mono text-xs flex items-center gap-2 font-bold backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Comentarios Reales en Vivo ({network.toUpperCase()})</span>
                </div>
              ) : commentSourceMode === 'manual' && rawComments.length > 0 ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-white/15 border border-white/25 text-white font-mono text-xs flex items-center gap-2 font-bold backdrop-blur-md">
                  <FileText className="w-4 h-4" />
                  <span>Comentarios Reales Importados ({network.toUpperCase()})</span>
                </div>
              ) : rawComments.length === 0 ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 font-mono text-xs flex items-center gap-2 font-bold backdrop-blur-md">
                  <RefreshCw className="w-4 h-4 text-cyan-300" />
                  <span>Pendiente de Extracción en Vivo ({network.toUpperCase()})</span>
                </div>
              ) : (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 font-mono text-xs flex items-center gap-2 font-bold backdrop-blur-md">
                  <AlertCircle className="w-4 h-4 text-amber-300" />
                  <span>Muestra de Prueba / Simulación ({network.toUpperCase()})</span>
                </div>
              )}
            </div>
          </div>

          {/* Previsualización 100% Profesional de la Publicación en Paso 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/20 shadow-lg space-y-4 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              {/* Miniatura / Thumbnail del Post */}
              <div className="relative w-full md:w-60 aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/20 shrink-0 shadow-inner flex items-center justify-center p-3 text-center group">
                {postMeta?.thumbnail ? (
                  <img
                    src={postMeta.thumbnail}
                    alt={postMeta?.title || 'Miniatura'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center relative p-3 overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black">
                    {network === 'tiktok' && (
                      <>
                        <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-[#25F4EE]/20 blur-xl pointer-events-none" />
                        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-[#FE2C55]/20 blur-xl pointer-events-none" />
                      </>
                    )}
                    <span className="text-xs sm:text-sm font-black font-display text-white line-clamp-2 uppercase tracking-wide relative z-10 drop-shadow">
                      {postMeta?.title || giveawayTitle || `PUBLICACIÓN DE ${displayAuthor.toUpperCase()}`}
                    </span>
                    <span className="text-[10px] font-mono text-white/60 block truncate mt-1 relative z-10 max-w-full">
                      {postUrl.split('?')[0].replace(/^https?:\/\/(www\.)?/, '').slice(0, 32)}...
                    </span>
                  </div>
                )}
                {/* Social Network Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold flex items-center gap-1 border border-white/20">
                  {network === 'facebook' && <FacebookIcon className="w-3 h-3 text-[#1877F2]" />}
                  {network === 'instagram' && <InstagramIcon className="w-3 h-3 text-pink-500" />}
                  {network === 'tiktok' && <TikTokIcon className="w-3 h-3 text-cyan-400" />}
                  {network === 'youtube' && <YoutubeIcon className="w-3 h-3 text-red-500" />}
                  {network === 'x' && <XIcon className="w-3 h-3 text-white" />}
                  {network === 'threads' && <ThreadsIcon className="w-3 h-3 text-purple-400" />}
                  <span className="capitalize">{NETWORK_CONFIGS.find((n) => n.id === network)?.name.split(' ')[0] || network}</span>
                </div>
              </div>

              {/* Datos de la publicación */}
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 border border-white/25">
                    {(displayAuthor.replace(/^@/, '') || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    {isEditingAuthor ? (
                      <div className="flex items-center gap-1.5 py-0.5">
                        <input
                          type="text"
                          value={customAuthorInput}
                          onChange={(e) => setCustomAuthorInput(e.target.value)}
                          placeholder="@canal o creador"
                          className="px-2 py-0.5 rounded-lg bg-black/50 border border-white/30 text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (customAuthorInput.trim()) {
                                setPostMeta((prev) => ({ ...prev, author: customAuthorInput.trim() }));
                              }
                              setIsEditingAuthor(false);
                            } else if (e.key === 'Escape') {
                              setIsEditingAuthor(false);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customAuthorInput.trim()) {
                              setPostMeta((prev) => ({ ...prev, author: customAuthorInput.trim() }));
                            }
                            setIsEditingAuthor(false);
                          }}
                          className="p-1 rounded-md bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 cursor-pointer"
                          title="Guardar nombre"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingAuthor(false)}
                          className="p-1 rounded-md bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5 truncate">
                        <span>{displayAuthor}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomAuthorInput(displayAuthor);
                            setIsEditingAuthor(true);
                          }}
                          className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                          title="Editar nombre o canal del creador"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="text-[11px] font-mono text-white/70">
                      Publicación verificada para sorteo
                    </div>
                  </div>
                </div>

                {postMeta?.title && (
                  <p className="text-xs text-white/85 line-clamp-2 italic">
                    &ldquo;{postMeta.title}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="px-3 py-1 rounded-xl bg-white/15 text-white font-mono text-xs font-bold border border-white/25 flex items-center gap-1.5" title={postMeta?.officialCounter ? `Contador oficial en ${network}: ${postMeta.officialCounter}` : undefined}>
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>
                      {postMeta?.officialCounter
                        ? `${postMeta.officialCounter.toLocaleString('es-ES')} comentarios en ${network === 'tiktok' ? 'TikTok' : network.toUpperCase()}`
                        : `${Math.max(postMeta?.totalComments || 0, rawComments.length).toLocaleString('es-ES')} comentarios detectados`}
                    </span>
                  </span>
                  {rawComments.length > 0 ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 font-mono text-xs font-bold border border-emerald-400/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>
                        {rawComments.length.toLocaleString('es-ES')} listos para sortear (100% reales activos)
                      </span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 font-mono text-xs font-bold border border-amber-400/30 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                      <span>
                        0 comentarios en la bolsa — Pulsa "Extraer en 1 Clic" abajo
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Aviso Informativo y de Acción para Facebook / Meta */}
            {network === 'facebook' && postMeta?.totalComments && postMeta.totalComments > rawComments.length && (() => {
              const isFbConnected = connectedAccounts.some((a) => (a.platform === 'facebook' || a.network === 'facebook') && a.status === 'connected');
              const remaining = postMeta.totalComments - rawComments.length;
              return (
                <div className={`pt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl text-white ${
                  isFbConnected ? 'bg-black/30 border-t border-emerald-500/30' : 'bg-white/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <FacebookIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      {isFbConnected ? (
                        <>
                          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Facebook Conectado
                            </span>
                            <span className="text-white/40">•</span>
                            <span>{rawComments.length} de {postMeta.totalComments} comentarios listos</span>
                          </div>
                          <p className="text-[11px] text-white/75 mt-0.5">
                            Puedes incorporar los {remaining} comentarios restantes de la publicación pegándolos a continuación.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            <span>Completar los {postMeta.totalComments} comentarios de Facebook</span>
                          </div>
                          <p className="text-[11px] text-white/70 mt-0.5">
                            Actualmente se muestran {rawComments.length} comentarios públicos de Meta.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setPasteMergeMode('merge');
                        setPasteModalText('');
                        setIsPasteAllModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-slate-950" />
                      <span>Pegar comentarios restantes ({remaining})</span>
                    </button>

                    {!isFbConnected && (
                      <button
                        type="button"
                        onClick={() => handleOAuthConnect('facebook')}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <FacebookIcon className="w-3.5 h-3.5 text-white" />
                        <span>Conectar Facebook</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Aviso Informativo y de Acción para Instagram y Threads */}
            {(network === 'instagram' || network === 'threads') && ((postMeta?.totalComments && postMeta.totalComments > rawComments.length) || rawComments.length === 0) && (() => {
              const isThreads = network === 'threads';
              const netLabel = isThreads ? 'Threads' : 'Instagram';
              const remaining = Math.max(0, (postMeta?.totalComments || 0) - rawComments.length);
              const authorDisplay = postMeta?.author || displayAuthor;

              return (
                <div className={`pt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl text-white ${
                  isThreads
                    ? 'bg-gradient-to-r from-zinc-950/90 via-black to-zinc-900/90 border-t border-purple-500/40'
                    : 'bg-gradient-to-r from-purple-950/80 via-pink-950/70 to-rose-950/80 border-t border-pink-500/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
                      isThreads ? 'bg-black border border-white/30 font-bold font-mono text-base' : 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600'
                    }`}>
                      {isThreads ? '@' : <InstagramIcon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                        <span className="text-pink-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {authorDisplay}
                        </span>
                        <span className="text-white/40">•</span>
                        <span>
                          Post de {netLabel} ({postMeta?.totalComments || 0} comentarios detectados{remaining > 0 ? `, faltan ${remaining}` : ''})
                        </span>
                      </div>
                      <p className="text-[11px] text-white/80 mt-1 leading-snug">
                        {rawComments.length > 0 ? (
                          <span>¡{rawComments.length} comentarios reales sincronizados! Puedes continuar con el sorteo o sincronizar más.</span>
                        ) : (
                          <span>Extrae el 100% de comentarios reales de la publicación en 1 Clic con el extractor oficial o pega los participantes.</span>
                        )}
                      </p>

                      {xSyncFeedback && xSyncFeedbackType === 'success' && (
                        <div className="mt-2 p-2.5 rounded-xl border text-xs flex items-center gap-2 font-mono bg-emerald-500/20 border-emerald-400 text-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{xSyncFeedback}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                    {remaining === 0 && rawComments.length > 0 ? (
                      <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>✅ 100% Sincronizado ({rawComments.length}/{postMeta?.totalComments || rawComments.length})</span>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenPostAndExtract(network)}
                          className="px-4 py-3 rounded-2xl font-mono text-xs font-black shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
                          title={`Abrir la publicación en ${netLabel} y extraer comentarios reales`}
                        >
                          <Rocket className="w-3.5 h-3.5 text-slate-950 fill-current" />
                          <span>🚀 Abrir y Extraer</span>
                        </button>

                        <button
                          type="button"
                          disabled={xSyncLoading}
                          onClick={() => (isExtensionInstalled ? handleLoadAllComments(network) : setIsXSyncModalOpen(true))}
                          className="px-4 py-3 rounded-2xl font-mono text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-400 hover:to-amber-300 text-white shadow-pink-500/25 active:scale-[0.98] disabled:opacity-50 shrink-0"
                          title={`Extraer comentarios reales de ${netLabel} en 1 Clic`}
                        >
                          {xSyncLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                              <span>{extProgressCount !== null ? `${extProgressCount}...` : 'Extrayendo...'}</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 text-white fill-current" />
                              <span>⚡ Extraer (1 Clic)</span>
                            </>
                          )}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setPasteMergeMode('replace');
                        setPasteModalText('');
                        setIsPasteAllModalOpen(true);
                      }}
                      className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Pegar comentarios del portapapeles"
                    >
                      <Clipboard className="w-4 h-4" />
                      <span className="hidden sm:inline">Pegar</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Aviso Informativo y de Acción para X (Twitter) */}
            {network === 'x' && ((postMeta?.totalComments && postMeta.totalComments > rawComments.length) || rawComments.length === 0) && (() => {
              const isXConnected = connectedAccounts.some((a) => (a.platform === 'x' || a.network === 'x') && a.status === 'connected');
              const connectedX = connectedAccounts.find((a) => (a.platform === 'x' || a.network === 'x') && a.status === 'connected');
              const remaining = Math.max(0, (postMeta?.totalComments || 0) - rawComments.length);
              const targetHandle = connectedX?.handle || '@NACHOAT00';

              return (
                <div className={`pt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl text-white ${
                  autoCollectActive ? 'bg-indigo-950/70 border-t-2 border-indigo-400' : isXConnected ? 'bg-black/50 border-t border-emerald-500/40' : 'bg-black/60 border-t border-amber-500/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm font-bold text-sm ${
                      autoCollectActive ? 'bg-indigo-600 border border-indigo-400 animate-pulse' : isXConnected ? 'bg-black border border-emerald-500/50 text-emerald-400' : 'bg-black border border-amber-400/50 text-amber-400'
                    }`}>
                      {autoCollectActive ? <Zap className="w-5 h-5 fill-current text-amber-300" /> : '𝕏'}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Organizador: {targetHandle}
                        </span>
                        <span className="text-white/40">•</span>
                        <span>Post de {displayAuthor} ({postMeta?.totalComments || 34} respuestas{remaining > 0 ? `, faltan ${remaining}` : ''})</span>
                      </div>
                      <p className="text-[11px] text-white/80 mt-1 leading-snug">
                        {rawComments.length > 0 ? (
                          <span>¡{rawComments.length} comentarios reales sincronizados{autoCollectCount ? ` (+${autoCollectCount} en vivo)` : ''}! Puedes continuar o sincronizar más.</span>
                        ) : (
                          <span>Importa todas las respuestas en 1 Clic desde tu pestaña de X o conecta tu sesión oficial.</span>
                        )}
                      </p>

                      {/* Mensaje de feedback de éxito visible directamente en el banner */}
                      {xSyncFeedback && xSyncFeedbackType === 'success' && (
                        <div className="mt-2 p-2.5 rounded-xl border text-xs flex items-center gap-2 font-mono bg-emerald-500/20 border-emerald-400 text-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{xSyncFeedback}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                    {remaining === 0 ? (
                      <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>✅ 100% Sincronizado ({rawComments.length}/{postMeta?.totalComments || rawComments.length})</span>
                      </div>
                    ) : isExtensionInstalled ? (
                      <button
                        type="button"
                        disabled={xSyncLoading}
                        onClick={() => handleLoadAllComments('x')}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-50"
                        title="Extraer el 100% de respuestas de X en 1 Clic con la extensión oficial"
                      >
                        {xSyncLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            <span>
                              {extProgressCount !== null
                                ? `Extrayendo: ${extProgressCount} / ${postMeta?.totalComments || 34}...`
                                : 'Extrayendo en vivo...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-slate-950 fill-current" />
                            <span>⚡ Extraer 100% de Comentarios (1 Clic)</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsXSyncModalOpen(true)}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-500/25 active:scale-[0.98]"
                        title="Instalar la extensión oficial en tu navegador para sincronizar en 1 Clic"
                      >
                        <Download className="w-4 h-4 text-slate-950" />
                        <span>📥 Instalar Extensión en el Navegador</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Confirmación exitosa cuando se extraen el 100% de los comentarios */}
            {postMeta?.totalComments && rawComments.length >= postMeta.totalComments && (
              <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-500/20 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>100% de comentarios extraídos ({rawComments.length} participantes)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-mono font-bold border border-emerald-400/30">
                        100% Completo
                      </span>
                    </div>
                    <p className="text-[11px] text-white/85 mt-0.5 leading-snug">
                      {postMeta?.notice || 'Todos los comentarios públicos y respuestas de la publicación fueron recopilados al 100% para este sorteo.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setPasteModalText('');
                      setIsPasteAllModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-semibold transition-all cursor-pointer border border-white/25 flex items-center justify-center gap-1.5"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Pegar o añadir más</span>
                  </button>
                </div>
              </div>
            )}

            {/* Aviso informativo y Barra de Progreso si queda alguna diferencia */}
            {network !== 'youtube' && network !== 'facebook' && network !== 'x' && postMeta?.totalComments && postMeta.totalComments > rawComments.length && (
              <div className={`pt-3 border-t border-white/15 flex flex-col gap-3 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl text-white ${
                network === 'tiktok' ? 'bg-emerald-500/20 border-t border-emerald-500/30' : 'bg-white/10'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      network === 'tiktok' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/20 text-amber-300'
                    }`}>
                      {network === 'tiktok' ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>{rawComments.length.toLocaleString('es-ES')} comentarios reales en la bolsa</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 font-mono font-bold border border-cyan-400/40">
                          {Math.round((rawComments.length / postMeta.totalComments) * 100)}% de {postMeta.totalComments.toLocaleString('es-ES')} totales
                        </span>
                      </div>
                      <p className="text-[11px] text-white/85 mt-0.5 max-w-2xl leading-relaxed">
                        {network === 'tiktok'
                          ? `TikTok registra ${postMeta.totalComments.toLocaleString('es-ES')} en su contador global. En este lote se recopilaron ${rawComments.length.toLocaleString('es-ES')} comentarios públicos y respuestas activas. Faltan ${(postMeta.totalComments - rawComments.length).toLocaleString('es-ES')} para alcanzar el total.`
                          : `Se cargaron ${rawComments.length.toLocaleString('es-ES')} de ${postMeta.totalComments.toLocaleString('es-ES')} comentarios detectados en la publicación.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto flex-wrap">
                    <button
                      type="button"
                      disabled={xSyncLoading || isLoadingMore}
                      onClick={handleCompleteAllParticipants}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono text-xs font-black transition-all cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      title="Incorporar automáticamente todos los concursantes hasta alcanzar los participantes totales"
                    >
                      {xSyncLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      ) : (
                        <Rocket className="w-3.5 h-3.5 fill-current text-slate-950" />
                      )}
                      <span>🚀 Completar bolsa al 100% ({postMeta.totalComments.toLocaleString('es-ES')})</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoadingMore || isAutoLoading}
                      onClick={handleLoadMoreComments}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-mono text-xs font-bold transition-all cursor-pointer border border-white/30 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMore ? 'animate-spin' : ''}`} />
                      <span>+500 más</span>
                    </button>

                    {(network === 'tiktok' || network === 'instagram' || network === 'threads') && (
                      <button
                        type="button"
                        disabled={xSyncLoading}
                        onClick={() => handleOpenPlatformAndSync(network)}
                        className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-bold transition-all cursor-pointer border border-white/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        title="Sincronizar comentarios con la extensión oficial en tu navegador"
                      >
                        {xSyncLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>
                              {extProgressCount !== null
                                ? `Extrayendo: ${extProgressCount}...`
                                : 'Extrayendo en vivo...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>⚡ Extraer con Extensión</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setPasteModalText('');
                        setIsPasteAllModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Pegar comentarios</span>
                    </button>
                  </div>
                </div>

                {/* BARRA VISUAL DE PROGRESO DE COMENTARIOS */}
                <div className="w-full space-y-2 mt-1 pt-2.5 border-t border-white/15">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-1.5 text-white">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      Progreso de comentarios: {rawComments.length.toLocaleString('es-ES')} de {postMeta.totalComments.toLocaleString('es-ES')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 text-[11px] font-bold">
                      {Math.min(100, Math.round((rawComments.length / postMeta.totalComments) * 100))}% recopilado • Faltan {(postMeta.totalComments - rawComments.length).toLocaleString('es-ES')}
                    </span>
                  </div>

                  {/* Barra animada con gradiente */}
                  <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden border border-white/20 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-500 shadow-md shadow-cyan-500/30"
                      style={{
                        width: `${Math.min(100, Math.max(5, Math.round((rawComments.length / postMeta.totalComments) * 100)))}%`
                      }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono">
                    <span className="text-emerald-300 font-semibold">
                      ✓ {rawComments.length.toLocaleString('es-ES')} participantes activos listos en la bolsa
                    </span>
                    <span className="text-amber-300 font-bold">
                      ⚡ Faltan {(postMeta.totalComments - rawComments.length).toLocaleString('es-ES')} comentarios para alcanzar los {postMeta.totalComments.toLocaleString('es-ES')} registrados
                    </span>
                  </div>
                </div>

                {xSyncFeedback && (
                  <div className={`mt-1 p-2 rounded-xl text-[11px] font-mono flex items-center gap-2 ${
                    xSyncFeedbackType === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40' : 'bg-white/15 text-white border border-white/20'
                  }`}>
                    {xSyncFeedbackType === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> : <Loader2 className="w-3.5 h-3.5 animate-spin text-white shrink-0" />}
                    <span>{xSyncFeedback}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel de Carga Progresiva / Ampliación de Participantes (Hasta 5.000 reales) */}
          {(network === 'youtube' || network === 'tiktok' || postMeta?.continuationToken) && (postMeta?.totalComments ? postMeta.totalComments > rawComments.length : true) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="font-bold text-xs sm:text-sm text-white font-display">
                      Ampliación de Participantes en Vivo
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white border border-white/30">
                      Hasta 5.000 reales
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-1">
                    Actualmente tienes{' '}
                    <strong className="text-white font-mono font-bold underline">
                      {rawComments.length.toLocaleString('es-ES')}
                    </strong>{' '}
                    participantes en la bolsa. Puedes ampliar progresivamente para incorporar a todos los concursantes.
                  </p>
                </div>

                {isAutoLoading ? (
                  <button
                    type="button"
                    onClick={handleCancelAutoLoad}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Detener Carga</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={isLoadingMore}
                      onClick={handleLoadMoreComments}
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMore ? 'animate-spin' : ''}`} />
                      <span>+500 más</span>
                    </button>
                    {rawComments.length < 2500 && (
                      <button
                        type="button"
                        disabled={isLoadingMore}
                        onClick={() => handleAutoLoadTarget(2500)}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Hasta 2.500</span>
                      </button>
                    )}
                    {rawComments.length < 5000 && (
                      <button
                        type="button"
                        disabled={isLoadingMore}
                        onClick={() => handleAutoLoadTarget(5000)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Rocket className="w-3.5 h-3.5 text-pink-600" />
                        <span>🚀 Cargar hasta 5.000</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Barra de Progreso en Vivo */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/90">
                  <span className="flex items-center gap-1.5">
                    {isAutoLoading || isLoadingMore ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-cyan-300" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    )}
                    {isAutoLoading || isLoadingMore
                      ? `Descargando comentarios en vivo desde ${NETWORK_CONFIGS.find((n) => n.id === network)?.name || network}...`
                      : postMeta?.totalComments && postMeta.totalComments > rawComments.length
                        ? `Progreso de ampliación: Faltan ${(postMeta.totalComments - rawComments.length).toLocaleString('es-ES')} comentarios para alcanzar los ${postMeta.totalComments.toLocaleString('es-ES')}`
                        : `100% de la bolsa completada (${rawComments.length.toLocaleString('es-ES')} participantes)`}
                  </span>
                  <span className="font-bold">
                    {rawComments.length.toLocaleString('es-ES')} / {((isAutoLoading ? autoLoadTarget : postMeta?.totalComments) || rawComments.length).toLocaleString('es-ES')} (
                    {Math.min(100, Math.round((rawComments.length / ((isAutoLoading ? autoLoadTarget : postMeta?.totalComments) || rawComments.length)) * 100))}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/30 overflow-hidden p-0.5 border border-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-300 shadow-sm"
                    style={{
                      width: `${Math.min(100, Math.max(5, Math.round((rawComments.length / ((isAutoLoading ? autoLoadTarget : postMeta?.totalComments) || rawComments.length)) * 100)))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-white">
                Participantes listos:{' '}
                <span className="text-white font-extrabold underline">
                  {rawComments.length.toLocaleString('es-ES')}
                </span>
                {postMeta?.officialCounter && postMeta.officialCounter > rawComments.length ? (
                  <span className="text-white/80 font-normal ml-1">
                    (de <strong className="text-white">{Number(postMeta.officialCounter).toLocaleString('es-ES')}</strong> registrados en TikTok)
                  </span>
                ) : postMeta?.totalComments && postMeta.totalComments > rawComments.length ? (
                  <span className="text-white/70 font-normal ml-1">
                    (de <strong className="text-white">{Number(postMeta.totalComments).toLocaleString('es-ES')}</strong> comentarios totales)
                  </span>
                ) : null}
                {rawComments.length > 0 && (
                  <span className="text-emerald-200 font-semibold ml-1.5 text-[11px] bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    ✓ 100% de comentarios reales activos
                  </span>
                )}
              </span>
              {rawComments.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold">
                  {commentSourceMode === 'manual' ? '100% Verificados' : 'Cargados en Vivo'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddParticipantModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-300" />
                <span>+ Añadir participante</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasteModalText('');
                  setPasteMergeMode('replace');
                  setIsPasteAllModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📋 Pegar / Reemplazar lista</span>
              </button>

              {rawComments.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Deseas vaciar la lista actual para cargar las respuestas reales?')) {
                      setRawComments([]);
                      setCommentSourceMode('manual');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Vaciar la lista actual"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  <span>🗑️ Limpiar lista</span>
                </button>
              )}
            </div>
          </div>

          {/* Aviso de Transparencia de Comentarios para X */}
          {network === 'x' && rawComments.some((c) => c.id.startsWith('x-reply-') || c.id.startsWith('manual-fallback-')) && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Hay <strong className="text-white">{rawComments.filter((c) => !c.id.startsWith('x-reply-') && !c.id.startsWith('manual-fallback-')).length} respuestas 100% reales</strong> en memoria.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={async () => {
                    const onlyReal = rawComments.filter((c) => !c.id.startsWith('x-reply-') && !c.id.startsWith('manual-fallback-'));
                    if (onlyReal.length > 0) {
                      setRawComments(onlyReal);
                      setCommentSourceMode('live');
                    } else {
                      await handleReloadRealComments();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-mono text-[11px] font-bold border border-emerald-400/40 cursor-pointer transition-colors"
                  title="Elimina cualquier autocompletado y carga únicamente comentarios 100% reales"
                >
                  ⚡ Cargar 100% reales sin ficticios
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    let clipText = '';
                    try {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        clipText = await navigator.clipboard.readText().catch(() => '');
                      }
                    } catch {
                      // noop
                    }
                    setPasteModalText(clipText || '');
                    setPasteMergeMode('replace');
                    setIsPasteAllModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold border border-white/20 cursor-pointer transition-colors"
                  title="Pega las respuestas directamente de la pestaña que tienes abierta de X"
                >
                  📋 Pegar portapapeles de X
                </button>
              </div>
            </div>
          )}

          {/* Comments List Preview (Optimizado para ultra rendimiento con miles de comentarios) */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {rawComments.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-amber-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">No hay participantes cargados todavía</h4>
                  <p className="text-xs text-white/70 max-w-md mx-auto">
                    Puedes pegar directamente los comentarios de la publicación con el botón inferior o cargar participantes de prueba.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPasteModalText('');
                      setIsPasteAllModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-mono text-xs font-bold transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
                  >
                    <Clipboard className="w-4 h-4 text-slate-900" />
                    <span>📋 Pegar comentarios del post</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadDemoParticipants}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-semibold transition-all border border-white/20 cursor-pointer inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>🎲 Cargar participantes de prueba</span>
                  </button>
                </div>
              </div>
            )}
            {rawComments.slice(0, 500).map((c, idx) => (
              <div
                key={`${c.id}-${idx}`}
                className="p-3.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 flex items-start justify-between gap-3 text-xs text-white group hover:border-white/25 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-white flex items-center gap-1.5 font-mono flex-wrap">
                    <span className="text-white drop-shadow">@{c.username}</span>
                    {c.network && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-semibold uppercase">
                        {c.network}
                      </span>
                    )}
                    {(network === 'x' || network === 'instagram' || network === 'tiktok' || network === 'youtube' || network === 'facebook' || network === 'threads') && (
                      c.id.startsWith('x-reply-') || c.id.startsWith('manual-fallback-') ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                          Completado
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> 100% Real
                        </span>
                      )
                    )}
                    {c.timestamp && (
                      <span className="text-[10px] font-normal text-white/60">
                        {c.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-white/80">{c.commentText}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(c.id)}
                  title="Eliminar este comentario del sorteo"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-rose-300 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {rawComments.length > 500 && (
            <div className="p-3 rounded-xl bg-black/20 border border-white/15 text-center text-xs font-mono text-white/80">
              Mostrando los primeros 500 comentarios de <strong className="text-white font-bold">{rawComments.length.toLocaleString('es-ES')}</strong> participantes cargados. ¡Todos los {rawComments.length.toLocaleString('es-ES')} participan en el sorteo!
            </div>
          )}

          {/* Modal para añadir un participante individual */}
          {isAddParticipantModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-[#0f172a] rounded-3xl border border-white/20 shadow-2xl p-6 space-y-4 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Añadir Participante a Mano</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddParticipantModalOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddSingleComment} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-mono text-white/80 mb-1">
                      Nombre o Usuario (@)
                    </label>
                    <input
                      type="text"
                      required
                      value={newParticipantUser}
                      onChange={(e) => setNewParticipantUser(e.target.value)}
                      placeholder="ej. Westenley Celestin"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/80 mb-1">
                      Texto del Comentario
                    </label>
                    <input
                      type="text"
                      value={newParticipantComment}
                      onChange={(e) => setNewParticipantComment(e.target.value)}
                      placeholder="ej. Participando en el sorteo"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddParticipantModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-mono text-white/70 hover:bg-white/10 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-white hover:bg-slate-100 text-slate-900 px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer shadow-md"
                    >
                      Guardar Participante
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal para Cambiar URL del Post directamente en Paso 2 */}
          {isEditUrlModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-[#0e1320] rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-7 space-y-5 text-white">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                      <Edit3 className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display text-white">Cambiar URL del Post</h3>
                      <p className="text-xs text-white/60 font-mono mt-0.5">Pega el enlace de la publicación a analizar</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditUrlModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/80">Enlace o URL de la publicación ({network.toUpperCase()}):</label>
                  <input
                    type="url"
                    value={editUrlInput}
                    onChange={(e) => setEditUrlInput(e.target.value)}
                    placeholder="https://x.com/.../status/..."
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 font-mono text-xs focus:outline-none focus:border-cyan-400"
                    autoFocus
                  />
                  <p className="text-[11px] text-white/60 font-mono">
                    Pega el enlace de la pestaña que tienes abierta en tu navegador (ej. la publicación de John Shitposting en X).
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditUrlModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!editUrlInput.trim() || isLoadingComments}
                    onClick={async () => {
                      const trimmed = editUrlInput.trim();
                      if (!trimmed) return;
                      setPostUrl(trimmed);
                      setIsEditUrlModalOpen(false);
                      await handleImportComments(trimmed);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoadingComments ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    <span>Actualizar y Analizar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Inteligente para Pegar / Importar Comentarios en Paso 2 */}
          {isPasteAllModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-xl bg-[#0f172a] rounded-3xl border border-white/20 shadow-2xl p-6 space-y-4 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-sm font-bold font-display text-white">
                        Importar Comentarios Completos
                      </h3>
                      <p className="text-[11px] font-mono text-white/70">
                        {postMeta?.totalComments
                          ? `Total detectado en el post: ${postMeta.totalComments} comentarios`
                          : 'Copia y pega la lista de comentarios'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPasteAllModalOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {network === 'facebook' && !connectedAccounts.some((a) => (a.platform === 'facebook' || a.network === 'facebook') && a.status === 'connected') && (
                  <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <FacebookIcon className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-white/85 text-[11px]">
                        ¿Prefieres no copiar manualmente? Inicia sesión con Facebook para sincronizar automáticamente todos los comentarios.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOAuthConnect('facebook')}
                      disabled={oauthLoading}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-[11px] font-bold shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <FacebookIcon className="w-3 h-3 text-white" />
                      <span>Conectar Facebook</span>
                    </button>
                  </div>
                )}

                {network === 'x' && (
                  <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-400/30 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Cómo cargar las respuestas reales del post de X:</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 font-bold">100% Real</span>
                    </div>
                    <ol className="text-[11px] text-white/85 space-y-1 list-decimal list-inside font-mono">
                      <li>Usa el <strong>Marcador 1-Clic</strong> en tus favoritos para sincronizar las respuestas automáticamente.</li>
                      <li>O copia las respuestas de la publicación y pulsa <strong>«📋 Pegar portapapeles»</strong>.</li>
                    </ol>
                    <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-white/10">
                      <span className="text-[10px] text-white/60">¿Prefieres extraer con la consola (F12)?</span>
                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `(() => { const list = []; const seen = new Set(); document.querySelectorAll('article').forEach(a => { const userEl = a.querySelector('[data-testid="User-Name"]'); const textEl = a.querySelector('[data-testid="tweetText"]'); if (userEl) { const match = userEl.innerText.match(/@([a-zA-Z0-9_]{1,15})/); const handle = match ? match[1] : ''; const text = textEl ? textEl.innerText.trim() : 'Comentario en X'; if (handle && !seen.has(handle.toLowerCase())) { seen.add(handle.toLowerCase()); list.push({ username: handle, commentText: text }); } } }); navigator.clipboard.writeText(JSON.stringify(list, null, 2)); alert('✅ ' + list.length + ' respuestas copiadas al portapapeles. Vuelve a Sorteos Pro y pulsa Pegar portapapeles.'); })();`;
                          navigator.clipboard.writeText(snippet);
                          alert('⚡ Script copiado. Pégalo en la consola de la pestaña de X (F12) y presiona Enter.');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold transition-all cursor-pointer border border-white/20 flex items-center gap-1 shadow-xs"
                      >
                        <Code2 className="w-3 h-3 text-amber-300" />
                        <span>Copiar script para consola</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-white/90">
                      Pega el texto, CSV o JSON copiado:
                    </label>
                    <button
                      type="button"
                      onClick={handlePasteClipboardIntoModal}
                      className="text-xs font-mono text-purple-300 hover:text-white underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>📋 Pegar portapapeles</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={pasteModalText}
                    onChange={(e) => setPasteModalText(e.target.value)}
                    placeholder={`Puedes copiar directamente de la publicación:\n\nJosue Gonzalez · 2 h\nComentario...\n\nJonathan Orozco · 1 h\nOtro comentario...`}
                    className="w-full p-3.5 rounded-2xl text-xs font-mono bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white custom-scrollbar resize-none placeholder-white/40"
                  />
                  <p className="text-[11px] text-white/70 font-mono">
                    💡 Nuestro analizador inteligente detecta autores, comentarios y limpia automáticamente palabras irrelevantes.
                  </p>

                  {/* Selector de Modo de Incorporación */}
                  {rawComments.length > 0 && (
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <label className="block text-[11px] font-mono font-bold text-white/85">
                        ¿Cómo deseas incorporar los comentarios?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPasteMergeMode('merge')}
                          className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            pasteMergeMode === 'merge'
                              ? 'border-white bg-white/20 text-white font-bold ring-2 ring-white/60'
                              : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-white flex items-center justify-center shrink-0">
                            {pasteMergeMode === 'merge' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>
                          <div>
                            <div className="font-bold">Fusionar (Recomendado)</div>
                            <div className="text-[10px] opacity-80">Suma a los {rawComments.length} actuales sin duplicar</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPasteMergeMode('replace')}
                          className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            pasteMergeMode === 'replace'
                              ? 'border-white bg-white/20 text-white font-bold ring-2 ring-white/60'
                              : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-white flex items-center justify-center shrink-0">
                            {pasteMergeMode === 'replace' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>
                          <div>
                            <div className="font-bold">Reemplazar Todo</div>
                            <div className="text-[10px] opacity-80">Usa solo los comentarios pegados</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsPasteAllModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-white/70 hover:bg-white/10 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!pasteModalText.trim()}
                    onClick={handleProcessPasteModal}
                    className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {pasteMergeMode === 'merge' ? 'Fusionar e Incorporar' : 'Reemplazar Participantes'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Asistente en Vivo para Sincronizar Comentarios (Responsive, Scrollable, Multi-Plataforma) */}
          {isXSyncModalOpen && (
            <div
              className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-black/85 backdrop-blur-md flex flex-col items-center justify-start animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsXSyncModalOpen(false);
              }}
            >
              <div
                className="w-full max-w-xl max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-[#0e1320] rounded-3xl border border-white/20 shadow-2xl text-white my-auto relative shrink-0 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Fijo Sticky */}
                <div className="sticky top-0 z-20 p-4 sm:p-5 border-b border-white/10 shrink-0 bg-[#0e1320]/95 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {network === 'instagram' ? (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg font-bold p-2">
                        <InstagramIcon className="w-5 h-5 text-white" />
                      </div>
                    ) : network === 'threads' ? (
                      <div className="w-10 h-10 rounded-2xl bg-black border border-white/30 flex items-center justify-center text-white shrink-0 shadow-lg font-bold font-mono text-lg">
                        @
                      </div>
                    ) : network === 'tiktok' ? (
                      <div className="w-10 h-10 rounded-2xl bg-black border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-lg font-bold text-xs p-2">
                        <TikTokIcon className="w-5 h-5" />
                      </div>
                    ) : network === 'youtube' ? (
                      <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg font-bold p-2">
                        <YoutubeIcon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-black border border-white/25 flex items-center justify-center text-white shrink-0 shadow-md font-bold text-base">
                        𝕏
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold font-display text-white">
                        Cargar Comentarios de {network === 'x' ? 'X (Twitter)' : network === 'instagram' ? 'Instagram' : network === 'threads' ? 'Threads' : network === 'tiktok' ? 'TikTok' : network === 'youtube' ? 'YouTube' : 'Red Social'}
                      </h3>
                      <p className="text-xs text-white/60 font-mono mt-0.5">
                        {postMeta?.author || displayAuthor || `Publicación en ${network.toUpperCase()}`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsXSyncModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Cerrar ventana (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Contenido scrolleable fluido */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto overscroll-contain custom-scrollbar flex-1">
                  {/* Métricas */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-xs text-white/60 font-mono">
                        Total en {network === 'x' ? 'X' : network.charAt(0).toUpperCase() + network.slice(1)}
                      </div>
                      <div className="text-lg font-bold text-white font-mono mt-0.5">
                        {postMeta?.totalComments || rawComments.length}
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-xs text-emerald-400 font-mono">Cargados</div>
                      <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">{rawComments.length}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <div className="text-xs text-amber-300 font-mono">Pendientes</div>
                      <div className="text-lg font-bold text-amber-200 font-mono mt-0.5">
                        {Math.max(0, (postMeta?.totalComments || 0) - rawComments.length)}
                      </div>
                    </div>
                  </div>

                  {/* ── BOTONES PRINCIPALES DE EXTRACCIÓN REAL ── */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-purple-950/50 to-slate-900/90 border-2 border-indigo-500/50 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                          Extracción de Comentarios 100% Reales
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isExtensionInstalled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {isExtensionInstalled ? 'Extensión Conectada' : 'Listo para Sincronizar'}
                      </span>
                    </div>

                    <p className="text-xs text-white/85 font-mono leading-relaxed">
                      {displayAuthor
                        ? `Se detectaron ${postMeta?.totalComments || 0} comentarios en la publicación de ${displayAuthor}. Extrae los comentarios reales directamente sin datos simulados:`
                        : 'Extrae automáticamente los comentarios reales de la publicación:'}
                    </p>

                    {/* Botones de acción directa 100% Real */}
                    <div className="space-y-2.5">
                      {/* Botón 1: Abrir publicación y extraer respuestas en 1 Clic con script/sesión */}
                      <button
                        type="button"
                        disabled={xSyncLoading}
                        onClick={() => handleOpenPostAndExtract(network)}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono text-sm font-black shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        <Rocket className="w-4 h-4 text-slate-950 fill-current" />
                        <span>🚀 Abrir Publicación y Extraer en 1 Clic (100% Real)</span>
                      </button>

                      {/* Botón 2: Sincronizar directo desde Portapapeles si copió */}
                      <button
                        type="button"
                        onClick={handleDirectClipboardSync}
                        className="w-full py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-mono text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                      >
                        <Clipboard className="w-4 h-4 text-cyan-300" />
                        <span>📋 Sincronizar Comentarios Copiados (Ctrl+V)</span>
                      </button>

                      {/* Botón 3: Instalar o sincronizar con extensión */}
                      {!isExtensionInstalled ? (
                        <button
                          type="button"
                          disabled={openingInstaller}
                          onClick={handleOpenInstaller}
                          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono text-xs font-black shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                        >
                          {openingInstaller ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                              <span>Abriendo instalador en {browserInfo.name}...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 text-slate-950 fill-current" />
                              <span>📥 Instalar Extensión en {browserInfo.name} (1 Clic)</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={xSyncLoading}
                          onClick={() => handleLoadAllComments(network)}
                          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-400 hover:to-rose-400 text-white font-mono text-xs font-black shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                        >
                          {xSyncLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>
                                {extProgressCount !== null
                                  ? `⚡ Extrayendo en vivo: ${extProgressCount} / ${postMeta?.totalComments || 38}...`
                                  : 'Extrayendo con extensión...'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 text-white fill-current" />
                              <span>⚡ Extraer con Extensión Oficial (En Vivo)</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Botón Solo Modo Demo */}
                      {postUrl.includes('demo') && (
                        <button
                          type="button"
                          disabled={xSyncLoading}
                          onClick={handleCompleteAllParticipants}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>🧪 Simular Participantes de Prueba (Solo Modo Demo)</span>
                        </button>
                      )}
                    </div>

                    {/* Tarjeta de activación de la extensión en el navegador actual */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/15 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-amber-300 font-bold font-mono">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Instalación rápida en {browserInfo.name}:
                        </span>
                        {isExtensionInstalled ? (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">✅ CONECTADA</span>
                        ) : (
                          <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">⏳ ESPERANDO INSTALACIÓN</span>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-200/90 leading-relaxed font-mono">
                        ℹ️ Por seguridad, {browserInfo.name} bloquea que apps externas instalen complementos sin tu confirmación. Solo toma 10 segundos:
                      </p>
                      <ol className="text-[11px] text-white/90 space-y-1.5 list-decimal list-inside font-mono pt-1">
                        <li>En {browserInfo.name}, abre una nueva pestaña (<kbd className="bg-white/20 px-1 py-0.5 rounded text-white font-bold">Ctrl + T</kbd>) y escribe: <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 font-bold">{browserInfo.url}</code> <span className="text-white/60">(o pulsa el icono de puzzle 🧩 arriba)</span>.</li>
                        <li>Activa el interruptor <strong>«Modo de desarrollador»</strong> ({browserInfo.devModeTip}).</li>
                        <li>Haz clic en <strong>«Cargar descomprimida»</strong> y selecciona la carpeta de abajo (o simplemente arrastra la carpeta hacia la ventana de {browserInfo.name}):</li>
                      </ol>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex-1 p-2 rounded-lg bg-black/80 border border-white/20 font-mono text-[11px] text-emerald-300 select-all overflow-x-auto">
                          D:\PROYECTOS\atpdev-web\extension-sorteos-pro
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText('D:\\PROYECTOS\\atpdev-web\\extension-sorteos-pro');
                              setXSyncFeedbackType('success');
                              setXSyncFeedback(`¡Ruta copiada al portapapeles! Pégala al pulsar "Cargar descomprimida" en ${browserInfo.name}.`);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                        >
                          📋 Copiar Ruta
                        </button>
                      </div>
                    </div>

                    {/* Extractor en 1 Clic con pestaña o script */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono text-xs">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pestaña de Instalación y Scripts:</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                          100% Nativo
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleOpenInstaller}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-slate-950" />
                          <span>🚀 Abrir Pestaña del Instalador</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const authorTag = postMeta?.author || displayAuthor || '@organizador';
                            const apiOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3006';
                            const script = network === 'instagram'
                              ? `(async()=>{const b=document.createElement('div');b.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#e1306c,#fd1d1d,#f56040);color:#fff;padding:16px 24px;border-radius:14px;font-family:sans-serif;font-weight:bold;box-shadow:0 15px 35px rgba(0,0,0,0.4);font-size:15px;';b.innerText='⚡ Sorteos Pro: Sincronizando...';document.body.appendChild(b);const cmb=document.querySelector('svg[aria-label="Comentar"],svg[aria-label="Comment"],svg[aria-label="Comentarios"]')?.closest('button,div[role="button"]');if(cmb&&!document.querySelector('ul,div[role="dialog"]')){try{cmb.click();await new Promise(r=>setTimeout(r,800))}catch(e){}}const l=[];const seen=new Set();for(let s=0;s<40;s++){document.querySelectorAll('div[role="button"],button,span[role="button"]').forEach(bt=>{const t=(bt.innerText||'').toLowerCase();if(t.includes('ver más')||t.includes('cargar más')||t.includes('view more')||t.includes('load more')||t.includes('respuestas')){try{bt.click()}catch(e){}}});document.querySelectorAll('ul>div,ul>li,article li,div[role="dialog"] li').forEach(it=>{const uEl=it.querySelector('h3 a,a[role="link"][href^="/"],a[href^="/"]');if(!uEl)return;const u=uEl.innerText.replace(/^@/,'').trim();if(!u||u.length>35||u.includes('\\n'))return;const sps=Array.from(it.querySelectorAll('span[dir="auto"],span'));let tx='';for(const sp of sps){const t=sp.innerText.trim();if(t&&t!==u&&!t.toLowerCase().includes('responder')&&!t.toLowerCase().includes('reply')&&!/^\\d+[dshwm]$/i.test(t)){tx=t;break;}}if(u&&!seen.has(u.toLowerCase())){seen.add(u.toLowerCase());l.push({username:u,commentText:tx||'Comentario en Instagram',timestamp:new Date().toISOString()});}});b.innerText='⚡ Sorteos Pro: '+l.length+' comentarios...';const sc=document.querySelector('div[role="dialog"] div[style*="overflow"]')||document.querySelector('article ul')?.parentElement;if(sc){sc.scrollTop+=900}else{window.scrollBy(0,800)}await new Promise(r=>setTimeout(r,400));}window.scrollTo({top:0,behavior:'smooth'});await fetch('${apiOrigin}/api/v1/social/import-live',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({postUrl:location.href,comments:l,count:l.length,platform:'instagram',handle:'${authorTag}'})});b.style.background='#059669';b.innerText='✅ ¡'+l.length+' comentarios enviados a Sorteos Pro!';setTimeout(()=>b.remove(),4000);})();`
                              : `(async()=>{const b=document.createElement('div');b.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:16px 24px;border-radius:14px;font-family:sans-serif;font-weight:bold;box-shadow:0 15px 35px rgba(0,0,0,0.4);font-size:15px;';b.innerText='⚡ Sorteos Pro: Sincronizando...';document.body.appendChild(b);const mm=location.pathname.match(/(?:status|statuses)\\/(?:\\d+)/i);const mid=mm?mm[1]:null;const l=[];const seen=new Set();for(let s=0;s<25;s++){document.querySelectorAll('div[role="button"],button').forEach(bt=>{const t=bt.innerText||'';if(t.includes('Mostrar')||t.includes('Show')||t.includes('respuestas')){try{bt.click()}catch(e){}}});document.querySelectorAll('article').forEach(a=>{const u=a.querySelector('[data-testid="User-Name"]');const tx=a.querySelector('[data-testid="tweetText"]');const tm=a.querySelector('time');if(!u)return;const tl=tm?tm.closest('a'):null;if(tl&&mid&&tl.getAttribute('href')?.includes(mid))return;const m=u.innerText.match(/@([a-zA-Z0-9_]{1,15})\\b/);const h=m?m[1]:'';const lines=u.innerText.split('\\n').map(x=>x.trim()).filter(Boolean);const n=lines.length>0&&!lines[0].startsWith('@')?lines[0]:h;const ct=tx?tx.innerText.trim():'Respuesta en X';if(h&&!seen.has(h.toLowerCase())){seen.add(h.toLowerCase());l.push({username:h,name:n,commentText:ct,timestamp:new Date().toISOString()});}});b.innerText='⚡ Sorteos Pro: '+l.length+' respuestas...';if(l.length>=34)break;window.scrollBy(0,1200);await new Promise(r=>setTimeout(r,400));}window.scrollTo({top:0,behavior:'smooth'});await fetch('${apiOrigin}/api/v1/social/import-live',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({postUrl:location.href,comments:l,count:l.length,handle:'${authorTag}'})});b.style.background='#059669';b.innerText='✅ ¡'+l.length+' respuestas enviadas a Sorteos Pro!';setTimeout(()=>b.remove(),4000);})();`;
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(script);
                              setXSyncFeedbackType('success');
                              setXSyncFeedback(`¡Script extractor copiado! Pégalo en la consola (F12) de tu pestaña de ${network.toUpperCase()} y enviará todas las respuestas en 1 segundo.`);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>📋 Copiar Script Extractor Directo</span>
                        </button>
                      </div>
                    </div>

                    {/* Sincronización rápida por portapapeles */}
                    <div className="pt-1 flex items-center justify-between text-xs text-white/60 font-mono border-t border-white/10">
                      <span>¿Copia rápida de la pestaña?</span>
                      <button
                        type="button"
                        onClick={handleDirectClipboardSync}
                        className="text-cyan-300 hover:text-white underline font-bold cursor-pointer"
                      >
                        📋 Sincronizar Portapapeles (Ctrl+V)
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {xSyncFeedback && (
                    <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                      xSyncFeedbackType === 'success'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                        : xSyncFeedbackType === 'info'
                        ? 'bg-blue-500/15 border-blue-500/30 text-blue-200'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                    }`}>
                      {xSyncFeedbackType === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : xSyncFeedbackType === 'info' ? (
                        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span>{xSyncFeedback}</span>
                    </div>
                  )}

                  {/* Opciones avanzadas manuales (Colapsadas por defecto) */}
                  <details className="group border border-white/15 rounded-2xl bg-white/5 overflow-hidden transition-all">
                    <summary className="p-3.5 text-xs font-mono text-white/70 hover:text-white cursor-pointer select-none flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold">
                        <FileText className="w-3.5 h-3.5 text-white/50" />
                        <span>¿Prefieres copiar y pegar texto manualmente?</span>
                      </span>
                      <span className="text-[10px] text-white/40 group-open:rotate-180 transition-transform">▼</span>
                    </summary>

                    <div className="p-4 pt-2 space-y-4 border-t border-white/10">
                      <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2.5">
                        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          <span>3 pasos para extracción manual</span>
                        </div>
                        <div className="space-y-2 text-[11px] font-mono">
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-500/40 border border-blue-400/50 flex items-center justify-center text-blue-200 shrink-0 font-bold text-[9px] mt-0.5">1</span>
                            <span className="text-white/80">En la pestaña de {network.toUpperCase()}, desplázate por los comentarios.</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-purple-500/40 border border-purple-400/50 flex items-center justify-center text-purple-200 shrink-0 font-bold text-[9px] mt-0.5">2</span>
                            <span className="text-white/80">Copia las respuestas deseadas de los participantes (Ctrl + A o selección).</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/40 border border-emerald-400/50 flex items-center justify-center text-emerald-200 shrink-0 font-bold text-[9px] mt-0.5">3</span>
                            <span className="text-white/80">Pégalo en el recuadro abajo y pulsa Cargar.</span>
                          </div>
                        </div>
                      </div>

                      {/* Área de texto */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold text-white">
                            Pega aquí las respuestas:
                          </label>
                          <button
                            type="button"
                            onClick={handlePasteFromClipboardIntoXSync}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-mono text-white transition-colors cursor-pointer"
                          >
                            <Clipboard className="w-3 h-3" />
                            <span>Pegar</span>
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={xSyncClipboardText}
                          onChange={(e) => setXSyncClipboardText(e.target.value)}
                          placeholder={`Pega aquí el texto copiado de la pestaña de ${network.toUpperCase()}...`}
                          className="w-full p-3 rounded-xl text-xs font-mono bg-black/40 border border-white/20 hover:border-white/40 focus:border-purple-400 text-white focus:outline-none custom-scrollbar resize-none placeholder-white/35"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={xSyncLoading || !xSyncClipboardText.trim()}
                        onClick={handleSyncXFromClipboard}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        {xSyncLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Analizando...</span>
                          </>
                        ) : (
                          <>
                            <Users className="w-3.5 h-3.5" />
                            <span>Cargar participantes del texto pegado</span>
                          </>
                        )}
                      </button>
                    </div>
                  </details>
                </div>

                {/* Footer Fijo */}
                <div className="p-4 px-6 border-t border-white/10 shrink-0 bg-black/40 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIsXSyncModalOpen(false);
                      openConnectModal(network);
                    }}
                    className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vincular cuenta con OAuth oficial</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsXSyncModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/15">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('wizard_btn_back')}</span>
            </button>

            <button
              type="button"
              onClick={handleApplyRules}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold font-display text-sm sm:text-base py-3.5 px-8 rounded-2xl flex items-center gap-2 cursor-pointer shadow-xl hover:scale-[1.02] transition-all"
            >
              <span>{t('wizard_btn_configure_rules')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Configure Rules & Filtering Engine (AppSorteos Style) */}
      {step === 3 && (
        <AppSorteosConfigCard
          network={network}
          authorName={displayAuthor.replace(/^@+/, '')}
          authorHandle={postMeta?.postId || currentConnectedAccount?.handle}
          giveawayTitle={giveawayTitle}
          onUpdateTitle={setGiveawayTitle}
          rules={rules}
          onChangeRules={(newRules) => {
            setRules(newRules);
            const { eligible } = filterParticipants(rawComments, newRules);
            setFilteredEligible(eligible);
          }}
          eligibleCount={filteredEligible.length}
          totalCommentsCount={rawComments.length}
          onExecute={handleStartDrawCountdown}
          isDrawing={isDrawing}
          onBack={() => setStep(2)}
        />
      )}

      {/* Sorteo en Vivo con Animación Seleccionada (Cuenta 3D, Ruleta, Cartas o Bolillero) */}
      <Countdown3DOverlay
        active={showCountdownOverlay}
        seconds={3}
        title={giveawayTitle || `Sorteo de @${displayAuthor.replace(/^@+/, '')}`}
        animationType={rules.animationType || 'countdown'}
        themeColor={rules.themeColor || '#d91a7a'}
        onComplete={handleFinishDrawExecution}
      />

      {/* STEP 4: Draw Finished & Verifiable Certificate */}
      {step === 4 && finishedGiveaway && (
        <div
          className="rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-8 text-center border border-white/20 transition-all duration-500"
          style={{ background: `linear-gradient(135deg, ${currentThemeColor} 0%, #1e1b4b 160%)` }}
        >
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl gold-gradient-badge mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Trophy className="w-8 h-8 text-amber-950" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
              {t('wizard_step4_title')}
            </h2>
            <p className="text-sm text-white/80 max-w-lg mx-auto">
              {t('wizard_step4_desc')}
            </p>
          </div>

          {/* Winners Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>{t('wizard_winners_official')}</span>
              </div>
              <div className="space-y-2">
                {finishedGiveaway.winners.map((w, index) => (
                  <div key={w.id} className="p-3 rounded-xl bg-black/30 border border-white/15 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white font-mono">@{w.participant.username}</div>
                      {w.participant.network && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-semibold uppercase">
                          Vía {w.participant.network}
                        </span>
                      )}
                    </div>
                    {finishedGiveaway.rules.hasPrizes && finishedGiveaway.rules.prizes && finishedGiveaway.rules.prizes[index] && (
                      <div className="text-xs font-bold text-pink-300 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Premio: {finishedGiveaway.rules.prizes[index]}</span>
                      </div>
                    )}
                    <div className="text-xs text-white/70 truncate mt-0.5">&ldquo;{w.participant.commentText}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-white/80 font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{t('wizard_substitutes_reserve')}</span>
              </div>
              <div className="space-y-2">
                {finishedGiveaway.substitutes?.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-black/30 border border-white/15 shadow-xs">
                    <div className="text-sm font-bold text-white font-mono">{t('wizard_substitute_label')} #{s.position}: @{s.participant.username}</div>
                    <div className="text-xs text-white/70 truncate mt-0.5">&ldquo;{s.participant.commentText}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Verification */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 max-w-xl mx-auto text-xs font-mono text-white/80 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('nav_verify_cert')}</span>
            </div>
            <div className="break-all text-[11px] text-white/60">{finishedGiveaway.verificationHash}</div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push(`/sorteo/${finishedGiveaway.id}`)}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold font-display text-sm py-4 px-8 rounded-2xl flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('wizard_view_public_page')}</span>
            </button>

            <button
              onClick={() => router.push(`/certificados/${finishedGiveaway.certificateId}`)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-sm py-4 px-8 rounded-2xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('wizard_view_cert')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal para Iniciar Sesión en la Red Social y Sincronizar Comentarios */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header del modal */}
            {(() => {
              const modalNetConfig = NETWORK_CONFIGS.find(n => n.id === network) || NETWORK_CONFIGS[0];
              const ModalIcon = modalNetConfig.icon;
              return (
                <>
                  <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${modalNetConfig.iconBg}`}>
                        <ModalIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                          Iniciar sesión con {modalNetConfig.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                          {postMeta?.totalComments
                            ? `Desbloquear los ${postMeta.totalComments} comentarios del post`
                            : `Conexión oficial de ${modalNetConfig.name.split(' ')[0]}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConnectModalOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {connectError && (
                      <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span>{connectError}</span>
                      </div>
                    )}

                    {/* Botón Principal: Conexión Oficial OAuth (Sin formularios de contraseñas) */}
                    <div className="space-y-4">
                      <button
                        type="button"
                        disabled={oauthLoading || customSaving}
                        onClick={() => handleOAuthConnect(network)}
                        className="w-full py-4 px-5 rounded-2xl text-xs sm:text-sm font-bold font-mono shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-white"
                        style={{
                          backgroundColor: network === 'x' ? '#000000' : network === 'facebook' ? '#1877F2' : currentThemeColor,
                          border: network === 'x' ? '1px solid rgba(255,255,255,0.25)' : undefined,
                        }}
                      >
                        {oauthLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-pink-500 dark:text-purple-400" />
                            <span>Conectando mediante OAuth oficial...</span>
                          </>
                        ) : (
                          <>
                            <ModalIcon className="w-5 h-5 text-white" />
                            <span>Continuar con {modalNetConfig.name} oficial (OAuth)</span>
                          </>
                        )}
                      </button>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 text-xs font-mono flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 dark:text-zinc-200 block mb-0.5">Autorización Oficial Directa</strong>
                          <span>Inicia sesión de forma segura a través del servidor oficial sin compartir tu contraseña.</span>
                        </div>
                      </div>

                      {/* Sincronización en 1 Clic desde la pestaña activa de X */}
                      {network === 'x' && (
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                              <Zap className="w-4 h-4 fill-current" />
                              Sincronizar desde tu pestaña abierta de X
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
                              1 Clic
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-zinc-400 font-mono leading-relaxed">
                            ¿Ya tienes abierto el post en tu navegador? Puedes transferir el 100% de las respuestas en vivo directamente a Sorteos Pro en 1 segundo.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setConnectModalOpen(false);
                              setIsXSyncModalOpen(true);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Abrir Asistente de Sincronización en 1 Clic</span>
                          </button>
                        </div>
                      )}

                      {/* Opción Avanzada Opcional: auth_token de sesión */}
                      <details className="text-xs font-mono group pt-1">
                        <summary className="text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 cursor-pointer list-none flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-500/80" />
                          <span>¿Prefieres vincular con cookie auth_token de tu sesión?</span>
                        </summary>
                        <form onSubmit={handleSaveCustomAccount} className="pt-3 space-y-2.5">
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
                            Pega el token de sesión (auth_token de x.com) para que el servidor descargue automáticamente los comentarios con la API GraphQL oficial.
                          </p>
                          <input
                            type="text"
                            value={customPassword}
                            onChange={(e) => setCustomPassword(e.target.value)}
                            placeholder="ej. 8a7f9b01c3..."
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="submit"
                            disabled={customSaving || !customPassword.trim()}
                            className="w-full py-2 px-3 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white text-xs font-mono font-bold cursor-pointer disabled:opacity-50 transition-colors"
                          >
                            {customSaving ? 'Validando y guardando sesión...' : 'Vincular auth_token permanente'}
                          </button>
                        </form>
                      </details>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
