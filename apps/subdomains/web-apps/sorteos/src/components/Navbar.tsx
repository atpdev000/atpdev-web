"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  ChevronDown, 
  ListOrdered, 
  Disc, 
  Dices, 
  CircleDollarSign, 
  Hash, 
  Users2, 
  Menu, 
  X, 
  ShieldCheck,
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  User, 
  CreditCard, 
  Check,
  LayoutGrid,
  HelpCircle,
  Scale,
  Heart,
  Download,
  Calendar,
  Radio,
  Lock,
  BookOpen,
  FileText
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from './SocialIcons';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { api, getToken, removeToken } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  plan?: string;
  avatarUrl?: string;
}

interface NavAppItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  isNew?: boolean;
}

export const Navbar: React.FC = () => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'sorteos' | 'promociones' | 'otras' | 'utilidades'>('sorteos');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const helpDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const loadUser = async () => {
    const token = getToken();
    const logged = Boolean(token);
    setIsLoggedIn(logged);
    if (logged) {
      try {
        const res = await api<{ user: UserProfile }>('/api/v1/auth/me');
        if (res?.user) {
          setUserProfile(res.user);
        }
      } catch {
        // fallback silencioso
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    loadUser();
    const handleAuthEvent = () => loadUser();
    window.addEventListener('storage', handleAuthEvent);
    window.addEventListener('auth-changed', handleAuthEvent);

    return () => {
      window.removeEventListener('storage', handleAuthEvent);
      window.removeEventListener('auth-changed', handleAuthEvent);
    };
  }, []);

  // Cerrar dropdowns al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        toolsBtnRef.current && !toolsBtnRef.current.contains(target) &&
        toolsMenuRef.current && !toolsMenuRef.current.contains(target)
      ) {
        setToolsOpen(false);
      }
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(target)) {
        setHelpOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserDropdownOpen(false);
    window.location.href = '/login';
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'US';
  };

  // ─── 4 COLUMNAS DEL MEGA-MENÚ ESTILO APPSORTEOS ─────────────────────────
  const megaColSorteos: NavAppItem[] = [
    { name: 'Sorteo en Instagram', href: '/apps/sorteo-instagram', icon: InstagramIcon, iconBg: 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white' },
    { name: 'Sorteo en Facebook', href: '/sorteos/nuevo?platform=facebook', icon: FacebookIcon, iconBg: 'bg-blue-600 text-white' },
    { name: 'Listado de Nombres', href: '/herramientas/lista', icon: ListOrdered, iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
    { name: 'Sorteo en Twitter (X)', href: '/sorteos/nuevo?platform=x', icon: XIcon, iconBg: 'bg-slate-900 dark:bg-white text-white dark:text-black' },
    { name: 'Sorteo Multi-Red', href: '/sorteos/nuevo?mode=multi', icon: Sparkles, iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400', isNew: true },
    { name: 'Sorteo en TikTok', href: '/sorteos/nuevo?platform=tiktok', icon: TikTokIcon, iconBg: 'bg-slate-950 text-cyan-400 border border-cyan-400/40' },
    { name: 'Sorteo en YouTube', href: '/sorteos/nuevo?platform=youtube', icon: YoutubeIcon, iconBg: 'bg-red-600 text-white' },
    { name: 'Sorteo en Threads', href: '/sorteos/nuevo?platform=threads', icon: ThreadsIcon, iconBg: 'bg-purple-900 text-white' },
  ];

  const megaColPromociones: NavAppItem[] = [
    { name: 'La Ruleta Aleatoria', href: '/herramientas/ruleta', icon: Disc, iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400' },
    { name: 'Trivia', href: '/herramientas/trivia', icon: HelpCircle, iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400', isNew: true },
    { name: 'Raspa y Gana', href: '/herramientas/raspa-gana', icon: Sparkles, iconBg: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400', isNew: true },
    { name: 'Amigo Secreto', href: '/herramientas/amigo-invisible', icon: Gift, iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' },
    { name: 'Certificados Verificables', href: '/verificar', icon: ShieldCheck, iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { name: 'Transmisión en Vivo', href: '/sorteos/nuevo?mode=live', icon: Radio, iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' },
  ];

  const megaColOtras: NavAppItem[] = [
    { name: 'Dados Virtuales 3D', href: '/herramientas/dados', icon: Dices, iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
    { name: 'Generador de Equipos', href: '/herramientas/equipos', icon: Users2, iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { name: 'Números Aleatorios', href: '/herramientas/numeros', icon: Hash, iconBg: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' },
    { name: 'Lanza una Moneda', href: '/herramientas/moneda', icon: CircleDollarSign, iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
    { name: 'Verificador SHA-256', href: '/verificar', icon: Lock, iconBg: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-300' },
  ];

  const megaColUtilidades: NavAppItem[] = [
    { name: 'Generador de Bases Legales', href: '/herramientas/bases-legales', icon: Scale, iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400', isNew: true },
    { name: 'Calculadora de Engagement', href: '/herramientas/engagement', icon: Heart, iconBg: 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400', isNew: true },
    { name: 'Exportar Comentarios', href: '/sorteos/nuevo?action=export', icon: Download, iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { name: 'Generador de Hashtags', href: '/herramientas/hashtags', icon: Hash, iconBg: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400', isNew: true },
    { name: 'Directorio de Sorteos', href: '/dashboard', icon: Calendar, iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400' },
  ];

  const planLabel = (userProfile?.plan || 'pro').toUpperCase();

  const renderAppItem = (item: NavAppItem) => (
    <Link
      key={item.name}
      href={item.href}
      onClick={() => setToolsOpen(false)}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-white/5 transition-all group cursor-pointer"
    >
      <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs`}>
        <item.icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
        <span className="text-[13px] font-medium text-slate-700 dark:text-zinc-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors truncate">
          {item.name}
        </span>
        {item.isNew && (
          <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 shrink-0">
            NEW
          </span>
        )}
      </div>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070a12]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo Brand Sorteos Pro */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">
              sorteos <span className="text-pink-600 dark:text-purple-400">pro</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* ─── APLICACIONES MEGA-MENU TRIGGER ───────────────────────── */}
            <button
              id="nav-btn-aplicaciones"
              ref={toolsBtnRef}
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                toolsOpen 
                  ? 'text-pink-600 dark:text-pink-400 bg-pink-50/80 dark:bg-pink-500/10' 
                  : 'text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5'
              }`}
              aria-expanded={toolsOpen}
            >
              <LayoutGrid className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>{t('nav_apps') || 'Aplicaciones'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-pink-600' : 'text-slate-400'}`} />
            </button>

            {/* Automation New Badge Link */}
            <Link 
              href="/sorteos/nuevo?mode=multi" 
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              <span>Automation</span>
              <span className="text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Link>

            {/* Precios */}
            <Link 
              href="/planes" 
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              {t('nav_pricing') || 'Precios'}
            </Link>

            {/* Ayuda Dropdown */}
            <div className="relative" ref={helpDropdownRef}>
              <button
                type="button"
                onClick={() => setHelpOpen(!helpOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span>{t('nav_help') || 'Ayuda'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${helpOpen ? 'rotate-180 text-pink-600' : 'text-slate-400'}`} />
              </button>

              {helpOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/blog"
                    onClick={() => setHelpOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <BookOpen className="w-4 h-4 text-pink-600" />
                    <span>Blog y Guías</span>
                  </Link>
                  <Link
                    href="/quienes-somos"
                    onClick={() => setHelpOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Quiénes Somos & E-E-A-T</span>
                  </Link>
                  <Link
                    href="/contacto"
                    onClick={() => setHelpOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Contacto y Soporte</span>
                  </Link>
                  <Link
                    href="/verificar"
                    onClick={() => setHelpOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>Verificador Oficial</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions (Auth Buttons, Theme, Lang) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Language Selector Dropdown */}
            <LanguageSelector />

            {isLoggedIn ? (
              <div className="relative" ref={userDropdownRef}>
                {/* User Profile Chip Button */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0">
                    {getInitials(userProfile?.name, userProfile?.email)}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[130px]">
                      {userProfile?.name || 'Mi Cuenta'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 line-clamp-1 max-w-[130px]">
                      {userProfile?.email || 'Sesión Activa'}
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-purple-500/20 text-pink-700 dark:text-purple-300 text-[9px] font-mono font-black">
                    {planLabel}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                          {getInitials(userProfile?.name, userProfile?.email)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {userProfile?.name || 'Usuario'}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                            {userProfile?.email || 'usuario@sorteos.pro'}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono border-t border-slate-200/50 dark:border-white/5">
                        <span className="text-slate-500 dark:text-zinc-400">Plan:</span>
                        <span className="font-bold text-pink-600 dark:text-purple-400 uppercase">
                          Plan {userProfile?.plan || 'pro'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                        <span>{t('nav_dashboard') || 'Dashboard'}</span>
                      </Link>

                      <Link
                        href="/sorteos/nuevo"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                        <span>Crear Sorteo</span>
                      </Link>

                      <Link
                        href="/planes"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                        <span>Planes y Facturación</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-white/5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav_logout') || 'Cerrar Sesión'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white px-2 py-1 transition-colors"
                >
                  {t('nav_login') || 'Ingresar'}
                </Link>

                <Link
                  href="/registro"
                  className="btn-pro-primary text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                >
                  <span>Crear cuenta</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ─── 4-COLUMN MEGA-DROPDOWN FLOATING OVERLAY ─────────────────── */}
        {toolsOpen && (
          <div 
            ref={toolsMenuRef}
            id="mega-menu-aplicaciones"
            className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[940px] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0b0f19] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 z-50 animate-in fade-in duration-150"
          >
            <div className="grid grid-cols-4 gap-5">
              {/* Columna 1: Sorteos */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3 px-2">
                  Sorteos
                </h4>
                <div className="space-y-0.5">
                  {megaColSorteos.map(renderAppItem)}
                </div>
              </div>

              {/* Columna 2: Promociones */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3 px-2">
                  Promociones
                </h4>
                <div className="space-y-0.5">
                  {megaColPromociones.map(renderAppItem)}
                </div>
              </div>

              {/* Columna 3: Otras Apps */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3 px-2">
                  Otras Apps
                </h4>
                <div className="space-y-0.5">
                  {megaColOtras.map(renderAppItem)}
                </div>
              </div>

              {/* Columna 4: Utilidades */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3 px-2">
                  Utilidades
                </h4>
                <div className="space-y-0.5">
                  {megaColUtilidades.map(renderAppItem)}
                </div>
              </div>
            </div>

            {/* Bottom Footer Info Strip */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Todos los sorteos y herramientas cuentan con certificación criptográfica inmutable SHA-256.</span>
              </div>
              <Link
                href="/verificar"
                onClick={() => setToolsOpen(false)}
                className="font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
              >
                <span>Verificar Certificado</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─── MOBILE DRAWER MENU ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {/* User Card on Mobile */}
          {isLoggedIn && userProfile && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0">
                  {getInitials(userProfile.name, userProfile.email)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">{userProfile.email}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-purple-500/20 text-pink-700 dark:text-purple-300 text-[10px] font-mono font-bold uppercase shrink-0">
                {userProfile.plan || 'pro'}
              </span>
            </div>
          )}

          {/* Mobile Category Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-zinc-400 px-1">
              <span>APLICACIONES & HERRAMIENTAS</span>
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setMobileTab('sorteos')}
                className={`py-1.5 rounded-xl transition-all ${mobileTab === 'sorteos' ? 'bg-white dark:bg-[#1e293b] text-pink-600 shadow-xs' : 'text-slate-600 dark:text-zinc-400'}`}
              >
                Sorteos
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('promociones')}
                className={`py-1.5 rounded-xl transition-all ${mobileTab === 'promociones' ? 'bg-white dark:bg-[#1e293b] text-pink-600 shadow-xs' : 'text-slate-600 dark:text-zinc-400'}`}
              >
                Promos
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('otras')}
                className={`py-1.5 rounded-xl transition-all ${mobileTab === 'otras' ? 'bg-white dark:bg-[#1e293b] text-pink-600 shadow-xs' : 'text-slate-600 dark:text-zinc-400'}`}
              >
                Otras
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('utilidades')}
                className={`py-1.5 rounded-xl transition-all ${mobileTab === 'utilidades' ? 'bg-white dark:bg-[#1e293b] text-pink-600 shadow-xs' : 'text-slate-600 dark:text-zinc-400'}`}
              >
                Utilidades
              </button>
            </div>

            {/* Tab content */}
            <div className="grid grid-cols-1 gap-1 pt-1">
              {mobileTab === 'sorteos' && megaColSorteos.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                >
                  <div className={`w-6 h-6 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              ))}

              {mobileTab === 'promociones' && megaColPromociones.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                >
                  <div className={`w-6 h-6 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              ))}

              {mobileTab === 'otras' && megaColOtras.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                >
                  <div className={`w-6 h-6 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              ))}

              {mobileTab === 'utilidades' && megaColUtilidades.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                >
                  <div className={`w-6 h-6 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links generales */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1.5 text-xs font-semibold">
            <Link
              href="/sorteos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-slate-800 dark:text-white hover:text-pink-600"
            >
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Crear Sorteo en Redes</span>
            </Link>

            <Link
              href="/verificar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-slate-800 dark:text-white hover:text-emerald-600"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verificar Certificados</span>
            </Link>

            <Link
              href="/planes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-slate-700 dark:text-zinc-300 hover:text-slate-900"
            >
              {t('nav_pricing') || 'Precios'}
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-slate-700 dark:text-zinc-300 hover:text-slate-900"
            >
              Blog y Guías
            </Link>

            <Link
              href="/quienes-somos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-slate-700 dark:text-zinc-300 hover:text-slate-900"
            >
              Quiénes Somos
            </Link>

            <Link
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-slate-700 dark:text-zinc-300 hover:text-slate-900"
            >
              Contacto y Soporte
            </Link>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-pro-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav_dashboard') || 'Dashboard'}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav_logout') || 'Cerrar Sesión'}</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-white/5 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav_login') || 'Ingresar'}</span>
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-pro-primary w-full text-center py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2"
                >
                  <span>Crear cuenta</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
