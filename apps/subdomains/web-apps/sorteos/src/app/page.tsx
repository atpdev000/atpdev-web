"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Gift, ShieldCheck, ArrowRight, 
  ListOrdered, Disc, Dices, CircleDollarSign, 
  Hash, Users2, Zap, Check, HelpCircle
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';
import { HomeHashVerifier } from '@/components/HomeHashVerifier';
import { PRICING_PLANS } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';

export default function HomePage() {
  const { t } = useLanguage();

  const standaloneTools = [
    {
      title: t('tool_names'),
      desc: t('tool_names_desc'),
      href: '/herramientas/lista',
      icon: ListOrdered,
      color: 'from-amber-400 to-amber-600',
      badge: 'Top',
      action: t('names_btn_draw')
    },
    {
      title: t('tool_roulette'),
      desc: t('tool_roulette_desc'),
      href: '/herramientas/ruleta',
      icon: Disc,
      color: 'from-pink-500 to-rose-600',
      badge: 'Top',
      action: t('roulette_btn_spin')
    },
    {
      title: t('tool_dice'),
      desc: t('tool_dice_desc'),
      href: '/herramientas/dados',
      icon: Dices,
      color: 'from-amber-500 to-orange-600',
      badge: 'Top',
      action: t('dice_btn_roll')
    },
    {
      title: t('tool_coin'),
      desc: t('tool_coin_desc'),
      href: '/herramientas/moneda',
      icon: CircleDollarSign,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Top',
      action: t('coin_btn_flip')
    },
    {
      title: t('tool_numbers'),
      desc: t('tool_numbers_desc'),
      href: '/herramientas/numeros',
      icon: Hash,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Top',
      action: t('numbers_btn_generate')
    },
    {
      title: t('tool_teams'),
      desc: t('tool_teams_desc'),
      href: '/herramientas/equipos',
      icon: Users2,
      color: 'from-indigo-500 to-violet-600',
      badge: 'Top',
      action: t('teams_btn_generate')
    },
    {
      title: t('tool_secret_santa'),
      desc: t('tool_secret_santa_desc'),
      href: '/herramientas/amigo-invisible',
      icon: Gift,
      color: 'from-rose-500 to-pink-600',
      badge: 'Top',
      action: t('secret_santa_btn_generate')
    },
  ];

  return (
    <div className="space-y-20 pb-24 overflow-hidden">
      
      {/* ─── HERO SECTION CENTRADO ───────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-7">
        
        {/* Glowing Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 text-xs font-semibold uppercase tracking-wider text-pink-700 dark:text-pink-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          <span>{t('home_hero_badge')}</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {t('home_hero_title_1')} <br />
            <span className="title-neon-glow">{t('home_hero_title_2')}</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t('home_hero_desc')}
          </p>
        </div>

        {/* Big Pro CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/sorteos/nuevo"
            className="btn-pro-primary w-full sm:w-auto text-base sm:text-lg py-4 px-8 cursor-pointer"
          >
            <Gift className="w-5 h-5" />
            <span>{t('home_hero_cta_social')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/herramientas/lista"
            className="btn-pro-secondary w-full sm:w-auto text-base sm:text-lg py-4 px-8 cursor-pointer"
          >
            <ListOrdered className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span>{t('home_hero_cta_free')}</span>
          </Link>
        </div>

        {/* Quick Access Tools Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mr-2">{t('home_tools_instant')}</span>
          {standaloneTools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="tool-switcher-pill hover:scale-105 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>{t.title.split(' ')[0]} {t.title.split(' ')[1] || ''}</span>
              </Link>
            );
          })}
        </div>

        {/* Trust Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-zinc-300 font-medium">
          <Link href="/apps/sorteo-instagram" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs hover:border-pink-300 hover:text-pink-600 transition-colors">
            <InstagramIcon className="w-4 h-4 text-pink-600" /> Instagram Posts & Reels
          </Link>
          <Link href="/sorteos/nuevo?platform=facebook" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-300 hover:text-blue-600 transition-colors">
            <FacebookIcon className="w-4 h-4 text-blue-600" /> {t('home_trust_fb')}
          </Link>
          <Link href="/sorteos/nuevo?platform=youtube" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs hover:border-red-300 hover:text-red-600 transition-colors">
            <YoutubeIcon className="w-4 h-4 text-red-600" /> {t('home_trust_yt')}
          </Link>
          <Link href="/verificar" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 shadow-xs hover:bg-emerald-100 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {t('home_trust_sha')}
          </Link>
        </div>
      </section>

      {/* ─── LIVE STATS BAR ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">+150,000</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('home_stat_draws')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-[#d91a7a]">+4.8M</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('home_stat_comments')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">100%</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('home_stat_random')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-cyan-600 dark:text-cyan-400">&lt; 3 min</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{t('home_stat_time')}</p>
          </div>
        </div>
      </section>

      {/* ─── PUBLIC HASH VERIFIER WIDGET ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeHashVerifier />
      </section>

      {/* ─── STANDALONE TOOLS GRID ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>{t('home_tools_badge')}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            {t('home_tools_title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            {t('home_tools_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standaloneTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.href}
                className="interactive-card bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <Link
                  href={tool.href}
                  className="w-full py-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-[#d91a7a] dark:hover:bg-purple-600 hover:text-white border border-slate-200 dark:border-white/10 hover:border-transparent text-slate-800 dark:text-zinc-200 font-bold font-display text-xs text-center flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>{tool.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            {t('home_step_badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            {t('home_why_title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            {t('home_why_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="interactive-card bg-white dark:bg-[#0f172a] rounded-3xl p-8 space-y-4 text-center border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t('home_step1_title')}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {t('home_step1_desc')}
            </p>
          </div>

          <div className="interactive-card bg-white dark:bg-[#0f172a] rounded-3xl p-8 space-y-4 text-center border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 font-bold text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t('home_step2_title')}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {t('home_step2_desc')}
            </p>
          </div>

          <div className="interactive-card bg-white dark:bg-[#0f172a] rounded-3xl p-8 space-y-4 text-center border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t('home_step3_title')}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {t('home_step3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── PRICING TABLE SECTION ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-pink-600 dark:text-purple-400 uppercase tracking-wider">
            {t('home_pricing_badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            {t('home_pricing_title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            {t('home_pricing_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`interactive-card rounded-3xl p-7 flex flex-col justify-between gap-6 border transition-all ${
                plan.isPopular
                  ? 'bg-white dark:bg-[#0f172a] border-[#d91a7a] dark:border-purple-500 shadow-xl shadow-pink-500/10 scale-105 relative'
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#d91a7a] text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {t('home_plan_popular')}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                    {plan.priceMonthly === 0 ? '0€' : `${plan.priceMonthly}€`}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{t('home_plan_per_month')}</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2.5 text-xs text-slate-600 dark:text-zinc-300">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-pink-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.id === 'free' ? '/sorteos/nuevo' : '/planes'}
                className={`w-full py-3.5 rounded-xl font-bold font-display text-xs text-center transition-all cursor-pointer ${
                  plan.isPopular
                    ? 'btn-pro-primary py-3.5 w-full text-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-slate-200 dark:border-white/10'
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ SECTION ───────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>{t('home_faq_badge')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">{t('home_faq_title')}</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 space-y-2 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{t('home_faq1_q')}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              {t('home_faq1_a')}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 space-y-2 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{t('home_faq2_q')}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              {t('home_faq2_a')}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 space-y-2 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{t('home_faq3_q')}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              {t('home_faq3_a')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── ADSENSE BANNER ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner format="horizontal" />
      </section>

    </div>
  );
}
