'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  Palette,
  Sparkles,
  CreditCard,
  Compass,
  Globe,
  User,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { lang, isEn, setLang } = useLanguage();
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: isEn ? '/en' : '/', label: isEn ? 'Home' : 'Inicio', icon: Palette },
    { href: '/dibujos', label: isEn ? 'Free Sheets' : 'Dibujos Gratis', icon: Compass },
    { href: '/estudio-kdp', label: isEn ? 'KDP Studio' : 'Estudio KDP', icon: BookOpen },
    { href: '/guias', label: isEn ? 'KDP Guides' : 'Guías KDP', icon: Sparkles },
    { href: '/planes', label: isEn ? 'Pricing' : 'Planes', icon: CreditCard },
  ];

  useEffect(() => {
    const htmlDark = document.documentElement.classList.contains('dark');
    setIsDark(htmlDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('colorear_theme', next ? 'dark' : 'light');
    } catch {}
  };

  const handleToggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    if (pathname === '/' && next === 'en') {
      router.push('/en');
    } else if (pathname === '/en' && next === 'es') {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md border-b border-zinc-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href={isEn ? '/en' : '/'} className="flex items-center gap-2.5 shrink-0 group">
          <span className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-zinc-900 dark:border-blue-400 flex items-center justify-center shadow-[0_2px_0_#18181b] dark:shadow-none">
            <Palette className="w-5 h-5 text-yellow-300" />
          </span>
          <div className="leading-tight">
            <span className="font-display font-bold text-lg text-zinc-900 dark:text-white tracking-tight block">
              Colorear Pro
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-slate-400 block">
              {isEn ? 'Free 300 DPI & KDP Studio' : 'Láminas Gratis & Estudio KDP'}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active =
              item.href === '/' || item.href === '/en'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  active
                    ? 'studio-nav-active bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                    : 'text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Selector ES / EN */}
          <button
            type="button"
            onClick={handleToggleLang}
            aria-label={isEn ? 'Cambiar a Español' : 'Switch to English'}
            className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-900 text-zinc-800 dark:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-900 text-zinc-700 dark:text-amber-300 hover:bg-zinc-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cuenta / Créditos en vivo */}
          <Link
            href="/cuenta"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              user
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100'
                : 'bg-zinc-50 dark:bg-slate-900 border-zinc-200 dark:border-slate-700 text-zinc-800 dark:text-slate-200 hover:bg-zinc-100'
            }`}
          >
            {user ? (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.credits} {isEn ? 'cr' : 'créd.'}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>{isEn ? 'Account' : 'Cuenta'}</span>
              </>
            )}
          </Link>

          <Link
            href="/estudio-kdp"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold btn-studio-primary"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEn ? 'KDP Book' : 'Crear Libro'}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Abrir menú de navegación"
            className="lg:hidden w-9 h-9 rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-900 text-zinc-800 dark:text-white flex items-center justify-center cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === '/' || item.href === '/en' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                    : 'text-zinc-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/cuenta"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40"
          >
            {user ? <Zap className="w-4 h-4" /> : <User className="w-4 h-4" />}
            <span>
              {user
                ? `${user.name} (${user.credits} ${isEn ? 'credits' : 'créditos'})`
                : isEn
                  ? 'Sign in / Get 15 Free Credits'
                  : 'Mi Cuenta (+15 créditos gratis)'}
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}
