"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, ArrowRight, Lock, Mail, User, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/types';
import { api, setToken, getToken } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

function RegistroContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'free';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados de validación en tiempo real
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});
  const [shakeForm, setShakeForm] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.push('/dashboard');
    }
  }, [router]);

  const validateName = (val: string): string | undefined => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'El nombre o empresa es obligatorio.';
    }
    if (trimmed.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.';
    }
    return undefined;
  };

  const validateEmail = (val: string): string | undefined => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'El correo electrónico es obligatorio.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Ingresa un formato de correo válido (ej. tu@empresa.com).';
    }
    return undefined;
  };

  const validatePassword = (val: string): string | undefined => {
    if (!val) {
      return 'La contraseña es obligatoria.';
    }
    if (val.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (nameErr || emailErr || passErr) {
      setErrors({ name: nameErr, email: emailErr, password: passErr });
      setTouched({ name: true, email: true, password: true });
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api<{ token: string }>('/api/v1/auth/register', {
        method: 'POST',
        body: { name: name.trim(), email: email.trim(), password, plan: selectedPlan },
        auth: false,
      });
      setToken(data.token);
      if (selectedPlan && selectedPlan !== 'free') {
        router.push(`/planes?plan=${encodeURIComponent(selectedPlan)}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
      setLoading(false);
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
    }
  };

  const handleOAuth = async () => {
    setOauthLoading('google');
    setError(null);
    try {
      const data = await api<{ authorizeUrl: string }>('/api/v1/auth/oauth/google', { auth: false });
      if (data?.authorizeUrl) {
        window.location.href = data.authorizeUrl;
      } else {
        throw new Error('No se pudo obtener la URL de Google');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con Google');
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-white dark:bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <span className="text-xl font-black font-display text-slate-900 dark:text-white">sorteos <span className="text-pink-600 dark:text-purple-400">pro</span></span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            {t('auth_register_title')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            {t('auth_register_subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-7 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={loading || oauthLoading !== null}
              onClick={handleOAuth}
              className={`w-full py-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-2 font-bold cursor-pointer shadow-xs ${
                oauthLoading === 'google'
                  ? 'bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white opacity-80 cursor-wait'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 text-slate-700 dark:text-zinc-200 active:scale-[0.99]'
              }`}
            >
              {oauthLoading === 'google' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-pink-600 dark:text-purple-400" />
                  <span>Iniciando con Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.37 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.26C.46 8.19 0 10.04 0 12s.46 3.81 1.26 5.41l4.02-3.13z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.63 1.26 6.59l4.02 3.13c.95-2.83 3.6-4.97 6.72-4.97z"/>
                  </svg>
                  <span>{t('auth_google_continue')}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">{t('auth_or_email')}</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} noValidate className={shakeForm ? 'animate-shake space-y-4' : 'space-y-4'}>
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">{t('auth_name_label')}</label>
              <div className="relative">
                <User
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                    errors.name ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, name: true }));
                    const err = validateName(name);
                    if (err) setErrors((prev) => ({ ...prev, name: err }));
                  }}
                  placeholder={t('auth_name_placeholder')}
                  className={`w-full pl-9 pr-10 py-3 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                    errors.name
                      ? 'border-2 border-rose-500 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-500/10 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20 placeholder:text-rose-300 dark:placeholder:text-rose-400/50'
                      : 'bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-pink-500 dark:focus:border-purple-500'
                  }`}
                />
                {errors.name && (
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none animate-in fade-in" />
                )}
              </div>
              {errors.name && (
                <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">{t('auth_email_label')}</label>
              <div className="relative">
                <Mail
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                    errors.email ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, email: true }));
                    const err = validateEmail(email);
                    if (err) setErrors((prev) => ({ ...prev, email: err }));
                  }}
                  placeholder="tu@empresa.com"
                  className={`w-full pl-9 pr-10 py-3 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                    errors.email
                      ? 'border-2 border-rose-500 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-500/10 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20 placeholder:text-rose-300 dark:placeholder:text-rose-400/50'
                      : 'bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-pink-500 dark:focus:border-purple-500'
                  }`}
                />
                {errors.email && (
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none animate-in fade-in" />
                )}
              </div>
              {errors.email && (
                <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">{t('auth_password_label')}</label>
              <div className="relative">
                <Lock
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                    errors.password ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, password: true }));
                    const err = validatePassword(password);
                    if (err) setErrors((prev) => ({ ...prev, password: err }));
                  }}
                  placeholder={t('auth_password_placeholder')}
                  className={`w-full pl-9 pr-16 py-3 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                    errors.password
                      ? 'border-2 border-rose-500 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-500/10 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-pink-500 dark:focus:border-purple-500'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {errors.password && (
                    <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 pointer-events-none animate-in fade-in" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-0.5 cursor-pointer transition-colors"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-2">{t('auth_select_plan')}</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {PRICING_PLANS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPlan === p.id
                        ? 'border-pink-500 dark:border-purple-500 bg-pink-50 dark:bg-purple-500/10 text-slate-900 dark:text-white font-bold ring-1 ring-pink-500 dark:ring-purple-500'
                        : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-white/10'
                    }`}
                  >
                    <div className="capitalize">{p.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">
                      {p.priceMonthly === 0 ? 'Gratis' : `$${p.priceMonthly}${t('home_plan_per_month')}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              {error && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/20 text-rose-700 dark:text-red-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || oauthLoading !== null}
                className="w-full py-3.5 rounded-xl btn-pro-primary text-xs font-bold font-display shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('auth_register_loading')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('auth_register_btn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 dark:text-zinc-400">
          {t('auth_has_account')}{' '}
          <Link href="/login" className="text-pink-600 dark:text-purple-400 hover:underline font-bold font-mono">
            {t('auth_login_link')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <div className="space-y-10 pb-12">
      <React.Suspense
        fallback={
          <div className="min-h-[40vh] flex items-center justify-center text-slate-400 dark:text-zinc-500 font-mono text-xs">
            Cargando formulario de registro seguro...
          </div>
        }
      >
        <RegistroContent />
      </React.Suspense>

      <section className="max-w-3xl mx-auto px-4">
        <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed shadow-xs">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            Ventajas de tu Cuenta en Sorteos Pro y Uso de Herramientas 100% Gratuitas sin Registro
          </h2>
          <p>
            En <strong>Sorteos Pro</strong> todas nuestras herramientas de selección aleatoria —incluyendo la <Link href="/herramientas/ruleta" className="text-pink-600 dark:text-pink-400 underline font-semibold">Ruleta Aleatoria</Link>, <Link href="/herramientas/lista" className="text-pink-600 dark:text-pink-400 underline font-semibold">Sorteo por Lista de Nombres</Link>, <Link href="/herramientas/equipos" className="text-pink-600 dark:text-pink-400 underline font-semibold">Generador de Equipos</Link>, <Link href="/herramientas/dados" className="text-pink-600 dark:text-pink-400 underline font-semibold">Dados 3D</Link>, <Link href="/herramientas/moneda" className="text-pink-600 dark:text-pink-400 underline font-semibold">Cara o Cruz</Link>, <Link href="/herramientas/numeros" className="text-pink-600 dark:text-pink-400 underline font-semibold">Lotería de Números</Link>, <Link href="/herramientas/amigo-invisible" className="text-pink-600 dark:text-pink-400 underline font-semibold">Amigo Invisible</Link> y <Link href="/herramientas/bases-legales" className="text-pink-600 dark:text-pink-400 underline font-semibold">Redactor de Bases Legales</Link>— están disponibles de forma inmediata y gratuita sin necesidad de crear una cuenta ni vincular tarjetas bancarias.
          </p>
          <p>
            El registro opcional de una cuenta de organizador está diseñado para agencias de marketing digital, creadores de contenido, marcas comerciales e instituciones educativas que desean sincronizar su historial de sorteos multiplataforma (Instagram, TikTok, YouTube, Facebook, X y Threads) en la nube, emitir y respaldar certificados públicos de transparencia con huella criptográfica <strong>SHA-256 (FIPS 180-4)</strong> generados mediante <code>window.crypto.getRandomValues()</code> (CSPRNG), programar dinámicas recurrentes y exportar actas de auditoría en formatos PDF, Excel e imagen de alta resolución.
          </p>
          <p>
            Tus credenciales se transmiten exclusivamente bajo cifrado <strong>TLS 1.3</strong>, las contraseñas se almacenan mediante funciones de derivación criptográfica con sal única y puedes ejercer en cualquier momento tus derechos de acceso, rectificación o cancelación conforme a nuestra <Link href="/politica-de-privacidad" className="text-pink-600 dark:text-pink-400 underline font-semibold">Política de Privacidad</Link> y <Link href="/terminos-y-condiciones" className="text-pink-600 dark:text-pink-400 underline font-semibold">Términos y Condiciones</Link>.
          </p>
          <p>
            <strong>Auditoría Imparcial y Cumplimiento para Sorteos Comerciales:</strong> Al registrar una cuenta gratuita o profesional en Sorteos Pro, obtienes acceso inmediato al panel de gestión de sorteos multiplataforma donde cada evento procesado genera un identificador único de certificado (<code>CERT-SP</code>) verificable públicamente por tus seguidores. Nuestro motor aplica reglas transparentes de filtrado (menciones mínimas obligatorias, validación de hashtags oficiales, exclusión de cuentas duplicadas o listas negras de bots y selección simultánea de titulares y suplentes) utilizando muestreo de rechazo sin sesgo modular. De esta manera, tu comunidad, patrocinadores y clientes pueden comprobar matemáticamente que la elección de ganadores fue 100% aleatoria e inalterable desde el momento de su emisión.
          </p>
          <p>
            Además, podrás organizar múltiples campañas por cliente o marca, activar el escenario de transmisión en vivo con cuenta regresiva para presentaciones en directo (OBS, Twitch, YouTube Live, TikTok Live o Instagram Live) y consultar estadísticas históricas de participación sin límite de tiempo y con soporte técnico dedicado en español.
          </p>
        </div>
      </section>
    </div>
  );
}
