'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Zap,
  BookOpen,
  CreditCard,
  LogOut,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import InlineNotice from './InlineNotice';

function GoogleLogo() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.15 3.57-8.64Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.39l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.61l4 3.1c.94-2.84 3.59-4.94 6.71-4.94Z"
      />
    </svg>
  );
}

export default function CuentaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, orders, oauthProviders, loading, refresh, logout } = useAuth();
  const { isEn } = useLanguage();

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const requestedPlan = searchParams.get('plan');
  const paymentStatus = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');
  const oauthSuccess = searchParams.get('oauth');
  const oauthWelcome = searchParams.get('welcome');
  const oauthError = searchParams.get('oauth_error');

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleRedirecting, setGoogleRedirecting] = useState(false);
  const [notice, setNotice] = useState<{
    tone: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Avisos de retorno de Google OAuth
  useEffect(() => {
    if (oauthSuccess === 'google') {
      setNotice({
        tone: 'success',
        title:
          oauthWelcome === '1'
            ? isEn
              ? 'Welcome with Google! (+15 free credits)'
              : '¡Bienvenido con Google! (+15 créditos gratis)'
            : isEn
              ? 'Signed in with Google'
              : 'Sesión iniciada con Google',
        message:
          oauthWelcome === '1'
            ? isEn
              ? 'Your account is ready with 15 welcome credits linked to your profile.'
              : 'Tu cuenta ya está activa con 15 créditos de bienvenida listos para usar en el Estudio KDP.'
            : isEn
              ? 'Your credits and order history are synced.'
              : 'Tu saldo de créditos y pedidos están sincronizados.',
      });
      refresh();
      return;
    }

    if (oauthError) {
      const friendly =
        oauthError === 'access_denied'
          ? isEn
            ? 'You cancelled the Google sign-in dialog.'
            : 'Cancelaste el inicio de sesión con Google.'
          : oauthError === 'not_configured'
            ? isEn
              ? 'Google sign-in is not active on this environment yet. You can still sign in with email.'
              : 'El acceso con Google aún no está configurado en este servidor. Puedes usar tu correo mientras tanto.'
            : isEn
              ? `Could not finish Google authentication (${oauthError}). Try again or sign in with email.`
              : `No pudimos completar la autenticación con Google (${oauthError}). Intenta nuevamente o usa tu correo.`;

      setNotice({
        tone: 'warning',
        title: isEn ? 'Google Sign-In Notice' : 'Aviso de acceso con Google',
        message: friendly,
      });
    }
  }, [oauthSuccess, oauthWelcome, oauthError, isEn, refresh]);

  // Confirmar automáticamente Stripe session_id cuando regresa del checkout
  useEffect(() => {
    if (!user || paymentStatus !== 'success' || !sessionId) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/billing/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (!active) return;
        if (res.ok && data.paid) {
          await refresh();
          setNotice({
            tone: 'success',
            title: isEn ? 'Payment verified & credits added!' : '¡Pago verificado y créditos acreditados!',
            message: isEn
              ? `Order ${data.orderCode} is active. Your new balance is ${data.user?.credits ?? user.credits} credits.`
              : `Orden ${data.orderCode} confirmada. Tu nuevo saldo es de ${data.user?.credits ?? user.credits} créditos.`,
          });
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [user, paymentStatus, sessionId, refresh, isEn]);

  const handleGoogleStart = () => {
    setGoogleRedirecting(true);
    const returnTo = requestedPlan && requestedPlan !== 'free' ? '/planes' : '/cuenta';
    window.location.href = `/api/auth/oauth/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'register' ? { name, email, password } : { email, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          tone: 'error',
          title: isEn ? 'Authentication error' : 'No pudimos iniciar sesión',
          message: data.error || 'Verifica tus datos.',
        });
        return;
      }

      await refresh();
      if (requestedPlan && requestedPlan !== 'free') {
        router.push('/planes');
        return;
      }
      setNotice({
        tone: 'success',
        title:
          mode === 'register'
            ? isEn
              ? 'Account created (+15 welcome credits!)'
              : '¡Cuenta creada (+15 créditos de bienvenida)!'
            : isEn
              ? 'Welcome back!'
              : '¡Bienvenido de nuevo!',
        message: data.message || '',
      });
    } catch {
      setNotice({
        tone: 'error',
        title: isEn ? 'Connection error' : 'Error de conexión',
        message: isEn ? 'Try again in a moment.' : 'Inténtalo de nuevo en unos segundos.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-sm text-zinc-500">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>{isEn ? 'Loading your account...' : 'Cargando tu cuenta...'}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/50 text-amber-800 dark:text-yellow-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? '+15 Free Welcome Credits' : '+15 Créditos Gratis al Registrarte'}</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
            {mode === 'register'
              ? isEn
                ? 'Create your Colorear Pro account'
                : 'Crea tu cuenta en Colorear Pro'
              : isEn
                ? 'Sign in to Colorear Pro'
                : 'Inicia sesión en Colorear Pro'}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            {requestedPlan
              ? isEn
                ? 'Sign in with Google or email so your credit pack stays linked permanently.'
                : 'Entra en 1 clic con Google o correo para vincular tus créditos y pedidos de forma segura.'
              : isEn
                ? 'Manage your KDP credits, order receipts, and priority AI generations.'
                : 'Administra tus créditos IA, historial de pedidos Stripe/Yape y acceso prioritario al Estudio KDP.'}
          </p>
        </div>

        {notice && (
          <InlineNotice
            tone={notice.tone}
            title={notice.title}
            message={notice.message}
            onClose={() => setNotice(null)}
          />
        )}

        <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-5">
          {/* Botón oficial OAuth 2.0 Google */}
          {oauthProviders.google && (
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={googleRedirecting}
                onClick={handleGoogleStart}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-zinc-50 dark:hover:bg-slate-800 text-sm font-bold text-zinc-900 dark:text-white flex items-center justify-center gap-2.5 cursor-pointer transition-colors disabled:opacity-60"
              >
                {googleRedirecting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <GoogleLogo />
                )}
                <span>{isEn ? 'Continue with Google' : 'Continuar con Google'}</span>
              </button>

              <div className="relative py-1 flex items-center">
                <div className="flex-1 border-t border-zinc-200 dark:border-slate-800" />
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  {isEn ? 'or with email' : 'o con tu correo'}
                </span>
                <div className="flex-1 border-t border-zinc-200 dark:border-slate-800" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500'
              }`}
            >
              {isEn ? 'Sign In' : 'Iniciar sesión'}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-500'
              }`}
            >
              {isEn ? 'Create Free Account' : 'Crear cuenta gratis'}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
                  {isEn ? 'Your name' : 'Tu nombre'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? 'e.g. Alex Rivera' : 'Ej. María Torres'}
                  className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
                {isEn ? 'Email address' : 'Correo electrónico'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="autor@ejemplo.com"
                className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
                {isEn ? 'Password (min 6 chars)' : 'Contraseña (mín. 6 caracteres)'}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {mode === 'register'
                  ? isEn
                    ? 'Create account & claim 15 credits'
                    : 'Registrarme y recibir 15 créditos'
                  : isEn
                    ? 'Sign in'
                    : 'Entrar a mi cuenta'}
              </span>
            </button>
          </form>

          <p className="text-[11px] text-center text-zinc-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {isEn
                ? 'Google OAuth 2.0 CSRF-protected login • Zero spam'
                : 'Acceso seguro con Google OAuth 2.0 • Cero spam'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-zinc-900 dark:border-blue-400"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-yellow-300 flex items-center justify-center border-2 border-zinc-900">
              <User className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <p className="text-xs text-zinc-500 dark:text-slate-400">{user.email}</p>
              {(user.authProviders || []).map((prov) => (
                <span
                  key={prov}
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300"
                >
                  {prov}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-300 dark:border-slate-700 text-xs font-bold text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-slate-800 cursor-pointer self-start"
        >
          <LogOut className="w-4 h-4" />
          <span>{isEn ? 'Sign out' : 'Cerrar sesión'}</span>
        </button>
      </div>

      {notice && (
        <InlineNotice
          tone={notice.tone}
          title={notice.title}
          message={notice.message}
          onClose={() => setNotice(null)}
        />
      )}

      {/* Métricas de cuenta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {isEn ? 'Available AI Credits' : 'Créditos IA Disponibles'}
          </span>
          <div className="flex items-baseline gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="font-display font-bold text-4xl text-zinc-900 dark:text-white">
              {user.credits}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-slate-400">
            {isEn
              ? 'Each AI coloring page uses 1 credit and bypasses daily IP caps.'
              : 'Cada lámina IA usa 1 crédito y omite el límite diario por IP.'}
          </p>
        </div>

        <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {isEn ? 'Current Plan' : 'Plan Actual'}
          </span>
          <p className="font-display font-bold text-3xl text-blue-700 dark:text-blue-400 capitalize">
            {user.plan === 'creador'
              ? 'Pack Creador KDP'
              : user.plan === 'editorial'
                ? 'Estudio Editorial Pro'
                : isEn
                  ? 'Free Starter'
                  : 'Plan Gratuito'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-slate-400">
            {isEn
              ? `${user.totalGenerated} pages generated with this account`
              : `${user.totalGenerated} ilustraciones generadas con esta cuenta`}
          </p>
        </div>

        <div className="sheet-card rounded-3xl bg-zinc-950 text-white p-6 flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-yellow-300">
              {isEn ? 'Quick Actions' : 'Accesos Rápidos'}
            </span>
            <p className="text-sm font-semibold text-zinc-200">
              {isEn ? 'Build your next KDP book or top up credits.' : 'Compila tu próximo libro KDP o recarga créditos.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/estudio-kdp"
              className="px-4 py-2.5 rounded-xl text-xs font-bold btn-studio-sun inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'KDP Studio' : 'Estudio KDP'}</span>
            </Link>
            <Link
              href="/planes"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white inline-flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{isEn ? 'Buy Credits' : 'Recargar Créditos'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Historial de pedidos */}
      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
          {isEn ? 'Order & Payment History' : 'Historial de Pedidos y Comprobantes'}
        </h2>

        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-slate-400 py-4">
            {isEn
              ? 'No orders yet. Visit /planes whenever you want to add 120 or 400 HD credits.'
              : 'Todavía no tienes pedidos registrados. Puedes recargar 120 o 400 créditos en /planes cuando los necesites.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px] text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-slate-800 text-zinc-500 uppercase">
                  <th className="py-2.5 px-3">Orden</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Créditos</th>
                  <th className="py-2.5 px-3">Método</th>
                  <th className="py-2.5 px-3">Monto</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-white">
                      {ord.orderCode}
                    </td>
                    <td className="py-3 px-3 capitalize text-zinc-700 dark:text-slate-300">{ord.planId}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">+{ord.credits}</td>
                    <td className="py-3 px-3 uppercase text-zinc-600 dark:text-slate-400">
                      {ord.method}
                      {ord.operationCode ? ` (#${ord.operationCode})` : ''}
                    </td>
                    <td className="py-3 px-3 text-zinc-700 dark:text-slate-300">
                      {ord.method === 'stripe' ? `$${ord.amountUsd} USD` : `S/ ${ord.amountPen}`}
                    </td>
                    <td className="py-3 px-3">
                      {ord.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isEn ? 'Paid' : 'Acreditado'}</span>
                        </span>
                      ) : ord.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold">
                          <XCircle className="w-3 h-3" />
                          <span>{isEn ? 'Rejected' : 'Rechazado'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                          <Clock className="w-3 h-3" />
                          <span>{isEn ? 'Verifying' : 'En verificación'}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
