"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const HomeHashVerifier: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setError('Por favor, ingresa un código de certificado o hash SHA-256.');
      return;
    }
    setError('');
    router.push(`/certificados/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="interactive-card w-full max-w-2xl mx-auto bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden space-y-4 text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Auditoría Pública en Tiempo Real</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white">
          Verificar Autenticidad de un Sorteo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
          Ingresa el código oficial o hash SHA-256 para comprobar que los ganadores fueron elegidos con aleatoriedad pura.
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <div className="relative flex-1">
          <label htmlFor="verify-query-input" className="sr-only">
            Código de certificado oficial o hash SHA-256
          </label>
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id="verify-query-input"
            name="query"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError('');
            }}
            placeholder={t('verify_input_placeholder')}
            aria-label={t('verify_input_placeholder')}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#d91a7a] dark:focus:border-purple-500 focus:ring-2 focus:ring-pink-50 dark:focus:ring-purple-900/30 transition-colors shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="btn-pro-primary text-sm py-3 px-6 shrink-0 cursor-pointer"
        >
          <span>{t('nav_verify_cert')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {error && (
        <p className="text-xs text-rose-600 dark:text-red-400 font-mono text-center">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500 dark:text-zinc-400 pt-1">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Web Crypto CSPRNG
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Inmutable SHA-256
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> 100% Auditable
        </span>
      </div>
    </div>
  );
};

export default HomeHashVerifier;
