"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Disc, 
  ListOrdered, 
  Dices, 
  CircleDollarSign, 
  Hash, 
  Users2,
  Gift,
  FileText,
  Sparkles,
  HelpCircle,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ToolItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const TOOLS: ToolItem[] = [
  { label: 'Nombres', href: '/herramientas/lista', icon: ListOrdered },
  { label: 'Ruleta', href: '/herramientas/ruleta', icon: Disc },
  { label: 'Raspa y Gana', href: '/herramientas/raspa-gana', icon: Sparkles, tag: 'Nuevo' },
  { label: 'Dados 3D', href: '/herramientas/dados', icon: Dices },
  { label: 'Moneda', href: '/herramientas/moneda', icon: CircleDollarSign },
  { label: 'Números', href: '/herramientas/numeros', icon: Hash },
  { label: 'Equipos', href: '/herramientas/equipos', icon: Users2 },
  { label: 'Amigo Secreto', href: '/herramientas/amigo-invisible', icon: Gift },
  { label: 'Bases Legales', href: '/herramientas/bases-legales', icon: FileText },
  { label: 'Trivia', href: '/herramientas/trivia', icon: HelpCircle },
  { label: 'Engagement', href: '/herramientas/engagement', icon: Heart },
  { label: 'Hashtags', href: '/herramientas/hashtags', icon: Hash },
];

export const ToolSwitcher: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    // Auto-scroll to active item on mount / pathname change
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }

    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    el.addEventListener('scroll', checkScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      el.removeEventListener('scroll', checkScroll);
    };
  }, [pathname, checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = Math.max(260, el.clientWidth * 0.6);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-2 group/switcher">
      {/* Left Chevron Button */}
      {canScrollLeft && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center pl-1 sm:pl-2 pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Desplazar herramientas a la izquierda"
            className="pointer-events-auto p-2 rounded-full bg-white/95 dark:bg-[#0f172a]/95 text-slate-700 dark:text-zinc-200 shadow-md hover:shadow-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Left Gradient Fade Mask */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 dark:from-[#0b0f19] to-transparent z-10 pointer-events-none" />
      )}

      {/* Scrollable Container with Safe Centering */}
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-none py-1.5 px-3 sm:px-6 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex w-max mx-auto p-1">
          <nav 
            aria-label="Herramientas de sorteo"
            className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 border border-slate-200 dark:border-white/10 shadow-xs backdrop-blur-md"
          >
            {TOOLS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  ref={isActive ? activeItemRef : undefined}
                  href={item.href}
                  className={`tool-switcher-pill shrink-0 relative ${isActive ? 'active' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-pink-600 dark:text-white scale-110' : 'text-slate-400 dark:text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-300 uppercase tracking-wider scale-90">
                      {item.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Right Gradient Fade Mask */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 dark:from-[#0b0f19] to-transparent z-10 pointer-events-none" />
      )}

      {/* Right Chevron Button */}
      {canScrollRight && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center pr-1 sm:pr-2 pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Desplazar herramientas a la derecha"
            className="pointer-events-auto p-2 rounded-full bg-white/95 dark:bg-[#0f172a]/95 text-slate-700 dark:text-zinc-200 shadow-md hover:shadow-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolSwitcher;
