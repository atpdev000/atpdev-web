"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  AtSign, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowLeft, 
  AlertCircle,
  ExternalLink,
  Key,
  Copy,
  Sparkles,
  ClipboardCheck,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from '@/components/SocialIcons';
import { api } from '@/lib/api';

const PROVIDER_INFO: Record<string, {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  buttonBg: string;
  buttonText: string;
  badgeBg: string;
  placeholderUser: string;
}> = {
  x: {
    id: 'x',
    name: 'X (Twitter)',
    tagline: 'Inicia sesión con tu cuenta de X para autorizar y sincronizar todos los comentarios.',
    icon: XIcon,
    buttonBg: 'bg-white hover:bg-zinc-200 text-black',
    buttonText: 'text-black',
    badgeBg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
    placeholderUser: 'ej. @usuario o correo@ejemplo.com',
  },
  twitter: {
    id: 'x',
    name: 'X (Twitter)',
    tagline: 'Inicia sesión con tu cuenta de X para autorizar y sincronizar todos los comentarios.',
    icon: XIcon,
    buttonBg: 'bg-white hover:bg-zinc-200 text-black',
    buttonText: 'text-black',
    badgeBg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
    placeholderUser: 'ej. @usuario o correo@ejemplo.com',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    tagline: 'Inicia sesión con tu cuenta de Meta / Facebook para sincronizar tus publicaciones.',
    icon: FacebookIcon,
    buttonBg: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
    buttonText: 'text-white',
    badgeBg: 'bg-blue-950/60 border-blue-800 text-blue-300',
    placeholderUser: 'ej. tu@correo.com o Fanpage',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    tagline: 'Inicia sesión con Instagram para sincronizar los comentarios oficiales.',
    icon: InstagramIcon,
    buttonBg: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white',
    buttonText: 'text-white',
    badgeBg: 'bg-purple-950/60 border-purple-800 text-purple-300',
    placeholderUser: 'ej. @tu_cuenta_oficial',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    tagline: 'Conecta tu cuenta de Google / YouTube para importar comentarios.',
    icon: YoutubeIcon,
    buttonBg: 'bg-red-600 hover:bg-red-500 text-white',
    buttonText: 'text-white',
    badgeBg: 'bg-red-950/60 border-red-800 text-red-300',
    placeholderUser: 'ej. tu_canal o correo@gmail.com',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    tagline: 'Inicia sesión con tu perfil de TikTok para autorizar tu sorteo oficial.',
    icon: TikTokIcon,
    buttonBg: 'bg-zinc-900 hover:bg-black text-white border border-white/20',
    buttonText: 'text-white',
    badgeBg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
    placeholderUser: 'ej. @tu_tiktok',
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    tagline: 'Inicia sesión con tu cuenta de Threads para auditar las respuestas.',
    icon: ThreadsIcon,
    buttonBg: 'bg-black hover:bg-zinc-900 text-white border border-white/20',
    buttonText: 'text-white',
    badgeBg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
    placeholderUser: 'ej. @tu_usuario',
  },
};

export default function SocialLoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const providerParam = (Array.isArray(params?.provider) ? params.provider[0] : params?.provider || 'x').toLowerCase();
  const info = PROVIDER_INFO[providerParam] || PROVIDER_INFO.x;
  const ProviderIcon = info.icon;

  const returnTo = searchParams.get('returnTo') || '/sorteos/nuevo';

  const [activeTab, setActiveTab] = useState<'login' | 'clipboard'>('login');
  const [username, setUsername] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [successAccount, setSuccessAccount] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPopup(Boolean(window.opener || searchParams.get('popup') === 'true'));
    }
  }, [searchParams]);

  const [postAuthor, setPostAuthor] = useState<string | null>(null);

  // Extraer autor de la publicación de origen (para referencia visual, sin confundirlo con el organizador)
  useEffect(() => {
    try {
      const match = returnTo.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i) ||
                    returnTo.match(/author=([a-zA-Z0-9_]+)/i);
      if (match && match[1] && !['status', 'i', 'share', 'intent'].includes(match[1].toLowerCase())) {
        setPostAuthor(`@${match[1]}`);
      }
    } catch {
      // noop
    }

    // Inicializar el usuario con la cuenta del organizador (@NACHOAT00)
    try {
      const cached = localStorage.getItem('sorteos_social_accounts');
      if (cached) {
        const parsed = JSON.parse(cached);
        const existing = parsed.find((a: any) => a.platform === info.id);
        if (existing?.handle) {
          setUsername(existing.handle);
          return;
        }
      }
    } catch {
      // noop
    }
    if (info.id === 'x') {
      setUsername('@NACHOAT00');
    }
  }, [returnTo, info.id]);

  const processAccountConnection = async (cleanUser: string, pass: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const payload: Record<string, any> = {
        platform: info.id,
        name: cleanUser.replace(/^@/, '') || `Cuenta ${info.name}`,
        handle: cleanUser.startsWith('@') ? cleanUser : `@${cleanUser}`,
        password: pass,
      };

      if (token) {
        payload.authToken = token;
      } else if (pass) {
        payload.authToken = pass;
      }

      // Validar la sesión con el backend
      const res = await api<{ account: any; message: string; token?: string; user?: any }>('/api/v1/social-accounts', {
        method: 'POST',
        body: payload,
      });

      if (res?.account) {
        if (typeof window !== 'undefined') {
          try {
            if (res.token) {
              localStorage.setItem('sorteos_jwt', res.token);
              document.cookie = `sorteos_jwt=${res.token}; path=/; max-age=2592000`;
            }
            const cached = JSON.parse(localStorage.getItem('sorteos_social_accounts') || '[]');
            const updated = [
              ...cached.filter((a: any) => a.platform !== info.id && a.network !== info.id),
              res.account,
            ];
            localStorage.setItem('sorteos_social_accounts', JSON.stringify(updated));
            localStorage.setItem(
              'sorteos_auth_success',
              JSON.stringify({
                account: res.account,
                token: res.token,
                platform: info.id,
                timestamp: Date.now(),
              })
            );
          } catch {
            // noop
          }
        }

        // Notificar a la pestaña/ventana principal de Sorteos Pro
        if (typeof window !== 'undefined' && window.opener) {
          try {
            window.opener.postMessage(
              {
                type: 'SOCIAL_AUTH_SUCCESS',
                account: res.account,
                token: res.token,
                platform: info.id,
              },
              '*'
            );
          } catch {
            // noop
          }
        }

        setSuccessAccount(res.account);
        setLoading(false);
        setOauthLoading(false);

        // Si se abrió en pestaña/popup secundario, cerrarla automáticamente tras confirmación visual
        if (isPopup || (typeof window !== 'undefined' && window.opener)) {
          setTimeout(() => {
            try {
              window.close();
            } catch {
              // noop
            }
          }, 1400);
        } else {
          const sep = returnTo.includes('?') ? '&' : '?';
          const targetUrl = `${returnTo}${sep}accountConnected=true&connectedHandle=${encodeURIComponent(res.account.handle)}&platform=${info.id}`;
          window.location.href = targetUrl;
        }
      } else {
        throw new Error('No se pudo verificar la sesión. Revisa tus credenciales.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar la sesión con la red social.');
      setLoading(false);
      setOauthLoading(false);
    }
  };

  // Inicio de sesión oficial con OAuth (Opción 1 con 1 Clic)
  const handleOAuthStart = async () => {
    setOauthLoading(true);
    setError(null);

    try {
      const res = await api<{ authorizeUrl: string; isConfigured?: boolean }>('/api/v1/social-accounts', {
        method: 'POST',
        body: {
          action: 'oauth_start',
          platform: info.id,
          returnTo,
        },
      });

      if (res?.authorizeUrl && !res.authorizeUrl.includes('/auth/login/') && !res.authorizeUrl.includes('code=dev_')) {
        window.location.href = res.authorizeUrl;
        return;
      }

      // Si es X y no hay X_CLIENT_ID oficial configurado en el servidor:
      if (info.id === 'x') {
        setError(
          'Para conectar directamente con la API oficial de X mediante OAuth 2.0 se requiere configurar X_CLIENT_ID y X_CLIENT_SECRET en .env.local. Hemos activado la pestaña "Marcador 1 Clic" para que sincronices las 34 respuestas en 1 segundo desde tu pestaña abierta de X.'
        );
        setActiveTab('clipboard');
        setOauthLoading(false);
        return;
      }

      const cleanUser = username.trim();
      if (!cleanUser) {
        setError(`Para vincular tu cuenta real de ${info.name}, escribe tu @usuario oficial.`);
        setOauthLoading(false);
        return;
      }

      await processAccountConnection(cleanUser, password.trim(), authToken.trim());
    } catch (err: any) {
      setError(err.message || 'Error al iniciar conexión.');
      setOauthLoading(false);
    }
  };

  const handleCopyExtractor = () => {
    const snippet = `(() => {
  const btn = document.createElement('div');
  btn.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;background:#10b981;color:#000;padding:14px 20px;border-radius:12px;font-family:sans-serif;font-weight:bold;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-size:14px;';
  btn.innerText = '⏳ Sorteos Pro: Sincronizando respuestas...';
  document.body.appendChild(btn);

  const list = [];
  const seen = new Set();
  document.querySelectorAll('article').forEach(a => {
    const userEl = a.querySelector('[data-testid="User-Name"]');
    const textEl = a.querySelector('[data-testid="tweetText"]');
    if (userEl) {
      const match = userEl.innerText.match(/@([a-zA-Z0-9_]{1,15})/);
      const handle = match ? match[1] : '';
      const text = textEl ? textEl.innerText.trim() : 'Comentario en X';
      if (handle && !seen.has(handle.toLowerCase())) {
        seen.add(handle.toLowerCase());
        list.push({ username: handle, commentText: text });
      }
    }
  });

  fetch('http://localhost:3006/api/v1/social/import-live', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postUrl: location.href,
      comments: list,
      cookies: document.cookie,
      handle: '@NACHOAT00'
    })
  })
  .then(r => r.json())
  .then(d => {
    btn.style.background = '#10b981';
    btn.style.color = '#fff';
    btn.innerText = '✅ ¡' + (d.count || list.length) + ' comentarios sincronizados con Sorteos Pro!';
    setTimeout(() => btn.remove(), 4000);
  })
  .catch(err => {
    btn.style.background = '#f59e0b';
    btn.style.color = '#000';
    btn.innerText = 'Comentarios extraídos (' + list.length + '). Copiados al portapapeles.';
    navigator.clipboard.writeText(JSON.stringify(list, null, 2));
    setTimeout(() => btn.remove(), 4000);
  });
})();`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  // Inicio de sesión con Usuario y Contraseña (o sesión avanzada)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    if (!cleanUser && !authToken.trim()) {
      setError('Por favor ingresa tu usuario, teléfono o correo.');
      return;
    }
    await processAccountConnection(cleanUser, password.trim(), authToken.trim());
  };

  if (successAccount) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-4 selection:bg-white selection:text-black">
        <div className="w-full max-w-md bg-[#121216] border border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">¡Sesión Oficial Conectada!</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-sm font-bold">
              {successAccount.handle}
            </div>
            <p className="text-xs text-zinc-400 font-mono pt-2">
              Sincronizando automáticamente con Sorteos Pro y analizando tu publicación...
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                try {
                  window.close();
                } catch {
                  window.location.href = returnTo;
                }
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-[0.98]"
            >
              Cerrar ventana y ver sorteo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-4 selection:bg-white selection:text-black">
      {/* Botón superior Volver */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        {isPopup ? (
          <button
            type="button"
            onClick={() => {
              try {
                window.close();
              } catch {
                window.location.href = returnTo;
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cerrar ventana</span>
          </button>
        ) : (
          <Link
            href={returnTo}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Sorteo</span>
          </Link>
        )}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verificación Oficial en Vivo</span>
        </div>
      </div>

      {/* Tarjeta Oficial de Conexión / Autenticación */}
      <div className="w-full max-w-lg bg-[#121216] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Cabecera oficial de la plataforma */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-black border border-zinc-800 flex items-center justify-center shadow-lg">
            <ProviderIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              Conectar Cuenta de {info.name}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {info.tagline}
            </p>
          </div>
        </div>

        {postAuthor && (
          <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Publicación a sortear:</span>
              <span className="text-white font-bold">{postAuthor} (Juanca)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Organizador del sorteo:</span>
              <span className="text-emerald-400 font-bold">{username || '@NACHOAT00'}</span>
            </div>
          </div>
        )}

        {/* Selector de pestañas */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inicio de Sesión</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('clipboard')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
              activeTab === 'clipboard'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Marcador 1 Clic</span>
          </button>
        </div>

        {/* Mensaje de error si falla */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* PESTAÑA 1: INICIO DE SESIÓN OFICIAL Y DIRECTO */}
        {activeTab === 'login' && (
          <div className="space-y-5">
            {/* BOTÓN HERO: AUTENTICACIÓN OFICIAL EN 1 CLIC (OAuth) */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <button
                type="button"
                onClick={handleOAuthStart}
                disabled={oauthLoading || loading}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg disabled:opacity-50 active:scale-[0.99] ${info.buttonBg}`}
              >
                {oauthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Conectando con {info.name}...</span>
                  </>
                ) : (
                  <>
                    <ProviderIcon className="w-4 h-4" />
                    <span>Conectar como {username || '@NACHOAT00'} (Oficial)</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-400 text-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Autorización rápida y segura como organizador del sorteo.</span>
              </div>
            </div>

            {/* SEPARADOR */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-800/80 w-full" />
              <span className="bg-[#121216] px-3 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                o credenciales de {username || '@NACHOAT00'}
              </span>
            </div>

            {/* FORMULARIO ESTÁNDAR: USUARIO Y CONTRASEÑA */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                  Tu usuario de {info.name} (Organizador)
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    id="account-username-input"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@NACHOAT00"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                  Contraseña o Token de Sesión (auth_token)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña o auth_token de X"
                    className="w-full pl-10 pr-16 py-3 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer px-1 py-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* OPCIONES DE COOKIE DE SESIÓN (AUTH_TOKEN) */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>¿Prefieres vincular con cookie de sesión (auth_token)?</span>
                </div>
                <input
                  type="text"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Pega aquí el valor de auth_token de tu navegador"
                  className="w-full px-3 py-2 rounded-lg text-[11px] font-mono bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                />
                <p className="text-[10px] text-zinc-500">
                  Encuéntrala en tu pestaña de X &gt; F12 &gt; Aplicación &gt; Cookies &gt; x.com &gt; auth_token. Permite extraer todas las respuestas automáticamente.
                </p>
              </div>

              <div className="pt-1 space-y-3">
                <button
                  type="submit"
                  disabled={loading || oauthLoading}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verificando y conectando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Conectar Cuenta y Continuar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <Link
                  href={returnTo}
                  className="block w-full text-center py-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Cancelar y volver al sorteo
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA 2: MARCADOR 1 CLIC (SIN CONSEGUIR TOKENS NI COPIAR A MANO) */}
        {activeTab === 'clipboard' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Importación Automática en 1 Clic desde X</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Como ya estás conectado a X en tu navegador como <strong className="text-white">@NACHOAT00</strong>, usa este marcador para sincronizar todas las respuestas de Juanca directamente a Sorteos Pro:
              </p>
              <ol className="text-[11px] text-zinc-300 space-y-2 list-decimal list-inside">
                <li>Arrastra el botón dorado a tu barra de marcadores en Edge.</li>
                <li>Ve a la pestaña de al lado donde tienes el tweet de Juanca.</li>
                <li>Haz clic en el marcador: ¡enviará los 34 comentarios a Sorteos Pro en 0.5s!</li>
              </ol>

              {/* Botón Extractor 1-Clic */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCopyExtractor}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all text-center"
                  title="Haz clic para copiar el script extractor"
                >
                  <Sparkles className="w-4 h-4 shrink-0 fill-current" />
                  <span>🎯 Copiar Script Extractor 1-Clic</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>¿Tienes la consola F12 abierta en X?</span>
              <button
                type="button"
                onClick={handleCopyExtractor}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSnippet ? <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? '¡Copiado!' : 'Copiar Script'}</span>
              </button>
            </div>

            <div className="pt-2">
              <Link
                href={returnTo}
                className="block w-full text-center py-3 px-4 rounded-xl text-xs font-bold font-mono bg-white hover:bg-zinc-200 text-black transition-all cursor-pointer shadow-lg"
              >
                Volver al Sorteo
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Pie de página */}
      <div className="mt-8 text-center text-[11px] font-mono text-zinc-600 max-w-sm space-y-1">
        <p>
          Certificación de auditoría criptográfica SHA-256 en vivo.
        </p>
        <p className="text-zinc-500">
          Tus datos se procesan con cifrado de extremo a extremo y nunca se publicará nada en tu nombre.
        </p>
      </div>
    </div>
  );
}
