"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageSquare, Share2, Users, TrendingUp, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';

export default function EngagementPage() {
  const [followers, setFollowers] = useState<number>(10000);
  const [likes, setLikes] = useState<number>(450);
  const [comments, setComments] = useState<number>(85);
  const [shares, setShares] = useState<number>(35);
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube'>('instagram');

  const totalInteractions = likes + comments + shares;
  const engagementRate = followers > 0 ? ((totalInteractions / followers) * 100).toFixed(2) : '0.00';
  const numRate = parseFloat(engagementRate);

  const getBenchmark = (rate: number) => {
    if (rate >= 5.0) return { label: 'Excelente 🚀', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30', desc: 'Tu comunidad está súper activa. Un sorteo aquí generará viralidad máxima.' };
    if (rate >= 3.0) return { label: 'Bueno y Saludable ⭐', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30', desc: 'Rendimiento superior al promedio de creadores en tu nicho.' };
    if (rate >= 1.5) return { label: 'Promedio de Mercado 📊', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30', desc: 'Tasa habitual en cuentas de marcas y empresas consolidadas.' };
    return { label: 'Bajo / Oportunidad de Mejora 💡', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30', desc: 'Un sorteo con llamada a la acción atractiva puede reactivar el alcance de tu perfil.' };
  };

  const benchmark = getBenchmark(numRate);
  const estimatedGiveawayParticipants = Math.round(followers * (Math.max(1, numRate) / 100) * 2.8);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto shadow-xs">
          <Heart className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Calculadora de Engagement
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
          Calcula la tasa de interacción de tu perfil de Instagram, TikTok o YouTube y proyecta el impacto de tu próximo sorteo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
            <TrendingUp className="w-4 h-4 text-pink-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Métricas de tu Cuenta
            </h2>
          </div>

          {/* Platform selector */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-white/5">
            {(['instagram', 'tiktok', 'youtube'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  platform === p
                    ? 'bg-white dark:bg-[#1e293b] text-pink-600 dark:text-pink-400 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Número de Seguidores / Suscriptores
              </label>
              <input
                type="number"
                value={followers}
                onChange={(e) => setFollowers(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Promedio de Likes por publicación
              </label>
              <input
                type="number"
                value={likes}
                onChange={(e) => setLikes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Promedio de Comentarios por publicación
              </label>
              <input
                type="number"
                value={comments}
                onChange={(e) => setComments(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Guardados / Compartidos promedio
              </label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Results & Insights */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Score Card */}
          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg text-center space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 font-mono">
              Tasa de Engagement Estimada
            </div>

            <div className="text-5xl sm:text-6xl font-black font-display text-pink-600 dark:text-pink-400 tracking-tight">
              {engagementRate}%
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-bold ${benchmark.bg} ${benchmark.color}`}>
              {benchmark.label}
              <div className="text-[11px] font-normal text-slate-600 dark:text-zinc-300 mt-1">
                {benchmark.desc}
              </div>
            </div>

            {/* Projection Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Proyección de tu próximo Sorteo Pro</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Con tu comunidad actual de <strong>{followers.toLocaleString()}</strong> seguidores, puedes esperar aproximadamente <strong>~{estimatedGiveawayParticipants.toLocaleString()}</strong> comentarios e interacciones en un sorteo bien estructurado.
              </p>
            </div>

            <Link
              href="/sorteos/nuevo"
              className="btn-pro-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Crear mi Sorteo Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
