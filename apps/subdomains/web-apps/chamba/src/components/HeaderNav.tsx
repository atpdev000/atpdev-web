'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase, Search, BookOpen, ChevronDown, Calculator,
  Scale, UserCheck, FileSpreadsheet, Building2, FileText,
  ShieldCheck, PlusCircle, Layers, FileCheck2, Compass, ArrowRight
} from 'lucide-react';
import { ChambaThemeToggle } from './ChambaThemeToggle';
import { MobileNavMenu } from './MobileNavMenu';

const HERRAMIENTAS = [
  {
    title: 'Evaluador Curricular',
    desc: 'Coteja tu CV con los requisitos de las bases oficiales.',
    href: '/match-cv',
    icon: FileCheck2,
    badge: 'Cotejo Oficial',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconBorder: 'border-emerald-500/30 dark:border-emerald-500/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/40',
    hoverBg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    title: 'Generador de CV CAS',
    desc: 'Formatos oficiales SERVIR y Privado en PDF y Word editable.',
    href: '/crear-cv-cas',
    icon: FileSpreadsheet,
    badge: 'Oficial',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconBorder: 'border-blue-500/30 dark:border-blue-500/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-blue-500/40',
    hoverBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-950/20',
    hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    glowColor: 'shadow-blue-500/20',
  },
  {
    title: 'Calculadora de Sueldo',
    desc: 'Calcula tu salario neto con descuentos de AFP, ONP y 5ta.',
    href: '/calculadora-sueldo',
    icon: Calculator,
    badge: 'Gratis',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
    iconBorder: 'border-teal-500/30 dark:border-teal-500/40',
    iconColor: 'text-teal-600 dark:text-teal-400',
    hoverBorder: 'hover:border-teal-500/40',
    hoverBg: 'hover:bg-teal-50/50 dark:hover:bg-teal-950/20',
    hoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    glowColor: 'shadow-teal-500/20',
  },
  {
    title: 'Comparador de Regímenes',
    desc: 'Diferencias clave: CAS 1057, D.L. 728 y D.L. 276.',
    href: '/comparador-regimenes',
    icon: Scale,
    badge: 'CAS vs 728',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconBorder: 'border-amber-500/30 dark:border-amber-500/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    hoverBorder: 'hover:border-amber-500/40',
    hoverBg: 'hover:bg-amber-50/50 dark:hover:bg-amber-950/20',
    hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    glowColor: 'shadow-amber-500/20',
  },
  {
    title: 'Simulador de Entrevista',
    desc: 'Practica preguntas y balotarios ante comités de selección.',
    href: '/simulador-entrevista-ia',
    icon: UserCheck,
    badge: 'Examen Oral',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
    iconBorder: 'border-sky-500/30 dark:border-sky-500/40',
    iconColor: 'text-sky-600 dark:text-sky-400',
    hoverBorder: 'hover:border-sky-500/40',
    hoverBg: 'hover:bg-sky-50/50 dark:hover:bg-sky-950/20',
    hoverText: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
    glowColor: 'shadow-sky-500/20',
  },
  {
    title: 'Organizaciones del Estado',
    desc: 'Directorio de ministerios, gobiernos regionales y municipios.',
    href: '/organizaciones',
    icon: Building2,
    badge: 'Directorio',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconBorder: 'border-cyan-500/30 dark:border-cyan-500/40',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    hoverBorder: 'hover:border-cyan-500/40',
    hoverBg: 'hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20',
    hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    glowColor: 'shadow-cyan-500/20',
  },
  {
    title: 'Plantillas y Anexos',
    desc: 'Descarga declaraciones juradas y anexos de postulación.',
    href: '/plantillas-anexos',
    icon: FileText,
    badge: 'Word & PDF',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconBorder: 'border-rose-500/30 dark:border-rose-500/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-500/40',
    hoverBg: 'hover:bg-rose-50/50 dark:hover:bg-rose-950/20',
    hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    glowColor: 'shadow-rose-500/20',
  },
  {
    title: 'Quiénes Somos',
    desc: 'Conoce nuestro equipo y proceso de verificación oficial.',
    href: '/quienes-somos',
    icon: ShieldCheck,
    badge: 'Verificado',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconBorder: 'border-emerald-500/30 dark:border-emerald-500/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/40',
    hoverBg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },
];

export function HeaderNav() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setToolsOpen(false);
    }
  }, [pathname]);

  const isToolActive = HERRAMIENTAS.some(h => pathname === h.href);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070a12]/90 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-3 shrink-0 cursor-pointer group hover:opacity-90 transition-opacity"
          title="Ir al inicio de Chamba Pro"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Briefcase size={20} className="text-white" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              chamba<span className="text-emerald-600 dark:text-emerald-400">pro</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                PE
              </span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-0.5 font-medium tracking-wide truncate max-w-[150px] sm:max-w-none">
              Convocatorias Oficiales del Perú
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Clear, Compact & Professional */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-display text-xs xl:text-sm font-bold">
          {/* Convocatorias */}
          <Link
            href="/empleos"
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${pathname === '/empleos' || (pathname.startsWith('/empleos') && !pathname.includes('match-cv'))
              ? 'bg-slate-100 dark:bg-white/10 text-emerald-700 dark:text-white border-slate-200 dark:border-white/20 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
          >
            <Search size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Convocatorias</span>
          </Link>

          {/* Evaluador Curricular de Bases */}
          <Link
            href="/match-cv"
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${pathname.startsWith('/match-cv')
              ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
          >
            <FileCheck2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Evaluador Curricular</span>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded text-[11px] font-mono font-bold uppercase tracking-wider shrink-0">
              Cotejo
            </span>
          </Link>

          {/* Guías CAS */}
          <Link
            href="/guias"
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${pathname.startsWith('/guias')
              ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
          >
            <BookOpen size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Guías CAS</span>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded text-[11px] font-mono font-bold uppercase tracking-wider shrink-0">
              Nuevo
            </span>
          </Link>

          {/* Herramientas Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border cursor-pointer whitespace-nowrap shrink-0 ${toolsOpen || isToolActive
                ? 'bg-slate-100 dark:bg-white/10 text-emerald-700 dark:text-white border-slate-200 dark:border-white/20 shadow-sm'
                : 'border-transparent text-slate-600 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
                }`}
            >
              <Layers size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Herramientas</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 shrink-0 ${toolsOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`}
              />
            </button>

            {/* Dropdown Mega Menu */}
            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[680px] p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl grid grid-cols-2 gap-2.5 animate-in fade-in zoom-in-95 duration-150 z-50">
                {HERRAMIENTAS.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setToolsOpen(false)}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 group text-left ${active
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-xs'
                        : `bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/80 ${item.hoverBg} ${item.hoverBorder} hover:shadow-xs`
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${item.iconBg} border ${item.iconBorder} flex items-center justify-center ${item.iconColor} shadow-xs ${item.glowColor} group-hover:scale-105 group-hover:shadow-sm transition-all duration-200 shrink-0`}>
                        <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`font-display font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white ${item.hoverText} transition-colors`}>
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 shadow-2xs ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug font-normal text-pretty">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}

                {/* Dropdown Bottom Banner */}
                <div className="col-span-2 mt-1 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <div className="flex items-center gap-1.5 font-medium text-[11px] text-slate-600 dark:text-slate-300">
                    <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Herramientas 100% gratuitas, sin costo ni registros obligatorios</span>
                  </div>
                  <Link
                    href="/guias"
                    onClick={() => setToolsOpen(false)}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 hover:translate-x-0.5 transition-transform shrink-0"
                  >
                    <span>Centro de Guías</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Actions Hub */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ChambaThemeToggle />

          {/* Publicar Convocatoria */}
          <Link
            href="/publicar-empleo"
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Publicar</span>
          </Link>

          {/* Explorar Convocatorias */}
          <Link
            href="/empleos"
            className="hidden sm:flex px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors items-center gap-1.5 shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Compass size={15} className="text-white shrink-0" />
            <span>Explorar Convocatorias</span>
          </Link>

          {/* Mobile Drawer */}
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
