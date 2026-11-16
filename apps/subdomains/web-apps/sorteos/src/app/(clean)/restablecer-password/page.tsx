"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

function ResetContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api('/api/v1/auth/reset', { method: 'POST', body: { token, password }, auth: false });
      setDone(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <span className="text-xl font-black font-display text-white">sorteos <span className="text-purple-400">pro</span></span>
          </Link>
          <h1 className="text-2xl font-black font-display text-white">Nueva Contraseña</h1>
        </div>
        <div className="glass-card rounded-3xl p-7 border border-white/10">
          {done ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">¡Contraseña actualizada!</p>
              <p className="text-xs text-zinc-400">Redirigiendo al login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">{error}</div>}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Token de recuperación:</label>
                <input type="text" required value={token} onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Nueva contraseña (mín. 8):</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-2">
                <span>{loading ? 'Guardando...' : 'Restablecer Contraseña'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RestablecerPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-zinc-500 text-xs font-mono">Cargando…</div>}>
      <ResetContent />
    </React.Suspense>
  );
}
