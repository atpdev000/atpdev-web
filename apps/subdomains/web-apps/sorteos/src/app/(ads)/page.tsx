"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Gift,
  ShieldCheck,
  ArrowRight,
  ListOrdered,
  Disc,
  Dices,
  CircleDollarSign,
  Hash,
  Users2,
  Zap,
  HelpCircle,
  BookOpen,
  Clock,
  Scale,
  Heart,
  ChevronDown,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  TikTokIcon,
  XIcon,
  ThreadsIcon,
} from '@/components/SocialIcons';
import { HomeHashVerifier } from '@/components/HomeHashVerifier';
import { PricingSection } from '@/components/PricingSection';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';
import { BLOG_POSTS } from '@/lib/blog-data';

type ToolCategory = 'all' | 'social' | 'games' | 'utilities';

export default function HomePage() {
  const { t } = useLanguage();
  const [toolFilter, setToolFilter] = useState<ToolCategory>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const allTools = [
    {
      title: 'Sorteo en Instagram',
      desc: 'Elige ganadores verificables entre comentarios de posts y Reels con filtros de menciones y duplicados.',
      href: '/apps/sorteo-instagram',
      icon: InstagramIcon,
      color: 'from-pink-600 via-rose-500 to-amber-500',
      badge: 'Redes',
      category: 'social' as const,
      action: 'Hacer sorteo Instagram',
    },
    {
      title: t('tool_roulette'),
      desc: t('tool_roulette_desc'),
      href: '/herramientas/ruleta',
      icon: Disc,
      color: 'from-pink-500 to-rose-600',
      badge: 'Dinámica',
      category: 'games' as const,
      action: t('roulette_btn_spin'),
    },
    {
      title: t('tool_names'),
      desc: t('tool_names_desc'),
      href: '/herramientas/lista',
      icon: ListOrdered,
      color: 'from-amber-400 to-orange-500',
      badge: 'Gratis',
      category: 'games' as const,
      action: t('names_btn_draw'),
    },
    {
      title: 'Sorteo Multi-Red',
      desc: 'Combina comentarios de Instagram, TikTok, YouTube, Facebook, X y Threads en un solo sorteo certificado.',
      href: '/sorteos/nuevo?mode=multi',
      icon: Layers,
      color: 'from-purple-600 to-indigo-600',
      badge: 'Redes',
      category: 'social' as const,
      action: 'Crear sorteo multi-red',
    },
    {
      title: 'Trivia Interactiva en Vivo',
      desc: 'Crea quizzes competitivos con PIN de sala para tus directos, eventos o dinámicas de comunidad.',
      href: '/herramientas/trivia',
      icon: HelpCircle,
      color: 'from-violet-500 to-fuchsia-600',
      badge: 'Dinámica',
      category: 'games' as const,
      action: 'Crear trivia gratis',
    },
    {
      title: 'Raspa y Gana Digital',
      desc: 'Tarjetas interactivas de raspa y gana para premiar clientes, lanzamientos y campañas virales.',
      href: '/herramientas/raspa-gana',
      icon: Sparkles,
      color: 'from-yellow-500 to-amber-600',
      badge: 'Dinámica',
      category: 'games' as const,
      action: 'Crear raspa y gana',
    },
    {
      title: t('tool_secret_santa'),
      desc: t('tool_secret_santa_desc'),
      href: '/herramientas/amigo-invisible',
      icon: Gift,
      color: 'from-rose-500 to-pink-600',
      badge: 'Dinámica',
      category: 'games' as const,
      action: t('secret_santa_btn_generate'),
    },
    {
      title: t('tool_teams'),
      desc: t('tool_teams_desc'),
      href: '/herramientas/equipos',
      icon: Users2,
      color: 'from-indigo-500 to-blue-600',
      badge: 'Utilidad',
      category: 'utilities' as const,
      action: t('teams_btn_generate'),
    },
    {
      title: t('tool_numbers'),
      desc: t('tool_numbers_desc'),
      href: '/herramientas/numeros',
      icon: Hash,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Utilidad',
      category: 'utilities' as const,
      action: t('numbers_btn_generate'),
    },
    {
      title: 'Generador de Bases Legales',
      desc: 'Redacta términos y condiciones claros para sorteos en Instagram, TikTok o Facebook en segundos.',
      href: '/herramientas/bases-legales',
      icon: Scale,
      color: 'from-slate-700 to-slate-900',
      badge: 'Utilidad Pro',
      category: 'utilities' as const,
      action: 'Generar bases legales',
    },
    {
      title: 'Calculadora de Engagement',
      desc: 'Mide la tasa real de interacción de tus perfiles y publicaciones antes de lanzar un sorteo.',
      href: '/herramientas/engagement',
      icon: Heart,
      color: 'from-pink-600 to-purple-600',
      badge: 'Utilidad Pro',
      category: 'utilities' as const,
      action: 'Calcular engagement',
    },
    {
      title: 'Generador de Hashtags',
      desc: 'Combina etiquetas de alto alcance por nicho para multiplicar la participación orgánica de tu sorteo.',
      href: '/herramientas/hashtags',
      icon: Zap,
      color: 'from-fuchsia-600 to-pink-600',
      badge: 'Redes',
      category: 'social' as const,
      action: 'Generar hashtags',
    },
  ];

  const visibleTools =
    toolFilter === 'all' ? allTools : allTools.filter((item) => item.category === toolFilter);

  const quickPills = [
    { label: 'Ruleta', href: '/herramientas/ruleta', icon: Disc },
    { label: 'Lista de Nombres', href: '/herramientas/lista', icon: ListOrdered },
    { label: 'Dados 3D', href: '/herramientas/dados', icon: Dices },
    { label: 'Cara o Cruz', href: '/herramientas/moneda', icon: CircleDollarSign },
    { label: 'Números', href: '/herramientas/numeros', icon: Hash },
    { label: 'Equipos', href: '/herramientas/equipos', icon: Users2 },
    { label: 'Amigo Secreto', href: '/herramientas/amigo-invisible', icon: Gift },
  ];

  const faqs = [
    { q: t('home_faq1_q'), a: t('home_faq1_a') },
    { q: t('home_faq2_q'), a: t('home_faq2_a') },
    { q: t('home_faq3_q'), a: t('home_faq3_a') },
  ];

  return (
    <div className="space-y-20 pb-24 overflow-hidden">
      {/* ─── HERO SECTION EDITORIAL ──────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/25 text-xs font-bold uppercase tracking-wider text-[#d91a7a] dark:text-pink-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#d91a7a] dark:text-pink-400" />
          <span>{t('home_hero_badge')}</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.06]">
            {t('home_hero_title_1')} <br />
            <span className="title-neon-glow">{t('home_hero_title_2')}</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t('home_hero_desc')}
          </p>
        </div>

        {/* CTAs Principales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/sorteos/nuevo"
            className="btn-pro-primary w-full sm:w-auto text-base sm:text-lg py-4 px-8 cursor-pointer shadow-lg shadow-pink-500/25"
          >
            <Gift className="w-5 h-5" />
            <span>{t('home_hero_cta_social')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/herramientas/ruleta"
            className="btn-pro-secondary w-full sm:w-auto text-base sm:text-lg py-4 px-8 cursor-pointer"
          >
            <Disc className="w-5 h-5 text-[#d91a7a] dark:text-pink-400" />
            <span>{t('home_hero_cta_free')}</span>
          </Link>
        </div>

        {/* Accesos Rápidos por Red Social */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold">
          <Link href="/apps/sorteo-instagram" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-pink-400 hover:text-[#d91a7a] shadow-xs transition">
            <InstagramIcon className="w-4 h-4 text-pink-600" /> Instagram
          </Link>
          <Link href="/sorteos/nuevo?platform=tiktok" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-cyan-400 hover:text-cyan-600 shadow-xs transition">
            <TikTokIcon className="w-4 h-4 text-slate-900 dark:text-cyan-400" /> TikTok
          </Link>
          <Link href="/sorteos/nuevo?platform=youtube" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-red-400 hover:text-red-600 shadow-xs transition">
            <YoutubeIcon className="w-4 h-4 text-red-600" /> YouTube
          </Link>
          <Link href="/sorteos/nuevo?platform=facebook" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-blue-400 hover:text-blue-600 shadow-xs transition">
            <FacebookIcon className="w-4 h-4 text-blue-600" /> Facebook
          </Link>
          <Link href="/sorteos/nuevo?platform=x" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-slate-500 shadow-xs transition">
            <XIcon className="w-3.5 h-3.5 text-slate-900 dark:text-white" /> X
          </Link>
          <Link href="/sorteos/nuevo?platform=threads" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-purple-400 hover:text-purple-600 shadow-xs transition">
            <ThreadsIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Threads
          </Link>
        </div>

        {/* Quick Tools Strip */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mr-1">
            {t('home_tools_instant')}
          </span>
          {quickPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <Link
                key={pill.href}
                href={pill.href}
                className="tool-switcher-pill hover:scale-105 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-[#d91a7a] dark:text-pink-400" />
                <span>{pill.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── VERIFIABLE TRUST METRICS BAR (REAL SPECS, ZERO FAKE CLAIMS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">13</p>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Herramientas Gratis
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-[#d91a7a]">6 Redes</p>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              IG, TikTok, YT, FB, X, Threads
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-emerald-600 dark:text-emerald-400">
              SHA-256
            </p>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Aleatoriedad CSPRNG
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-cyan-600 dark:text-cyan-400">
              &lt; 3 min
            </p>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Certificado Público
            </p>
          </div>
        </div>
      </section>

      {/* ─── PUBLIC HASH VERIFIER WIDGET ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeHashVerifier />
      </section>

      {/* ─── FULL 12-TOOL HUB WITH CATEGORY FILTER TABS ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#d91a7a] dark:text-pink-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>{t('home_tools_badge')}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            {t('home_tools_title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            {t('home_tools_desc')}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all' as const, label: `Todas (${allTools.length})` },
              { id: 'social' as const, label: 'Redes Sociales' },
              { id: 'games' as const, label: 'Juegos & Dinámicas' },
              { id: 'utilities' as const, label: 'Utilidades Pro' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setToolFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  toolFilter === tab.id
                    ? 'bg-[#d91a7a] text-white shadow-md shadow-pink-500/25'
                    : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:border-pink-300 hover:text-[#d91a7a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.href}
                className="interactive-card bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg hover:border-pink-300/70 dark:hover:border-pink-500/30 transition-all group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-[#d91a7a] dark:group-hover:text-pink-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <Link
                  href={tool.href}
                  className="w-full py-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-[#d91a7a] hover:text-white border border-slate-200 dark:border-white/10 hover:border-transparent text-slate-800 dark:text-zinc-200 font-bold font-display text-xs text-center flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
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
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            {t('home_why_title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            {t('home_why_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '1', bg: 'bg-pink-100 dark:bg-pink-500/20 text-[#d91a7a] dark:text-pink-300', title: t('home_step1_title'), desc: t('home_step1_desc') },
            { num: '2', bg: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300', title: t('home_step2_title'), desc: t('home_step2_desc') },
            { num: '3', bg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', title: t('home_step3_title'), desc: t('home_step3_desc') },
          ].map((step) => (
            <div
              key={step.num}
              className="interactive-card bg-white dark:bg-[#0f172a] rounded-3xl p-8 space-y-4 text-center border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-2xl ${step.bg} font-black text-xl flex items-center justify-center mx-auto`}>
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{step.title}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BLOG GUIDES PREVIEW SECTION ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-[#d91a7a] dark:text-pink-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Nuestras Guías y Tutoriales</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Aprende a Crear Sorteos Transparentes y Legales
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d91a7a] dark:text-pink-400 hover:underline"
          >
            <span>Ver todas las guías ({BLOG_POSTS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-white/10 hover:border-pink-400/50 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-500">
                  <span className="text-[#d91a7a] dark:text-pink-400 font-bold px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-500/10 text-[11px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-[#d91a7a] dark:group-hover:text-pink-400 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[11px]">{post.date}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[#d91a7a] dark:text-pink-400 group-hover:translate-x-1 font-bold flex items-center gap-1 transition-all"
                >
                  <span>Leer guía</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING TABLE SECTION ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PricingSection showTitle={true} />
      </section>

      {/* ─── INTERACTIVE FAQ ACCORDION ─────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>{t('home_faq_badge')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            {t('home_faq_title')}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between gap-3 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#d91a7a]' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verificación pública SHA-256
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#d91a7a]" /> Sin tarjetas para empezar gratis
          </span>
        </div>
      </section>

      {/* ─── ADSENSE BANNER ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <AdBanner format="horizontal" />
      </section>
    </div>
  );
}
