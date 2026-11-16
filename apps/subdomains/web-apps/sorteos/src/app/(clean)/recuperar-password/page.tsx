"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, ArrowLeft, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ resetToken?: string }>('/api/v1/auth/recover', {
        method: 'POST',
        body: { email },
        auth: false,
      });
      if (data.resetToken) setDevToken(data.resetToken);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
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
            Recuperar Contraseña
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Ingresa tu email registrado para recibir el enlace de restablecimiento
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-7 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">¡Enlace Enviado!</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Hemos enviado las instrucciones para restablecer tu contraseña a <strong className="text-slate-900 dark:text-white font-mono">{email}</strong>.
              </p>
              {devToken && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left">
                  <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-500 mb-1">Modo desarrollo — token de recuperación:</p>
                  <p className="text-[11px] font-mono text-amber-700 dark:text-amber-300 break-all">{devToken}</p>
                  <Link
                    href={`/restablecer-password?token=${devToken}`}
                    className="text-[11px] font-mono text-pink-600 dark:text-purple-400 hover:underline font-bold"
                  >
                    Restablecer ahora →
                  </Link>
                </div>
              )}
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-mono text-pink-600 dark:text-purple-400 hover:underline font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al inicio de sesión</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/20 text-rose-700 dark:text-red-300 text-xs font-mono">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">Correo Electrónico:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl btn-pro-primary text-xs font-bold font-display shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancelar y regresar</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
