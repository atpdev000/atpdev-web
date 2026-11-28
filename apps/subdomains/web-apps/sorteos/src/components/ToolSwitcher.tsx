"use client";

import React from 'react';
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
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ToolItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

export const ToolSwitcher: React.FC = () => {
  const pathname = usePathname();
  const { t, tUi } = useLanguage();

  const tools: ToolItem[] = [
    // Fila 1 (6 herramientas)
    { label: t('tool_names'), href: '/herramientas/lista', icon: ListOrdered },
    { label: t('tool_roulette'), href: '/herramientas/ruleta', icon: Disc },
    { label: tUi('item_scratch'), href: '/herramientas/raspa-gana', icon: Sparkles, tag: tUi('nav_new_tag') },
    { label: t('tool_dice'), href: '/herramientas/dados', icon: Dices },
    { label: t('tool_coin'), href: '/herramientas/moneda', icon: CircleDollarSign },
    { label: t('tool_numbers'), href: '/herramientas/numeros', icon: Hash },

    // Fila 2 (6 herramientas)
    { label: t('tool_teams'), href: '/herramientas/equipos', icon: Users2 },
    { label: t('tool_secret_santa'), href: '/herramientas/amigo-invisible', icon: Gift },
    { label: tUi('item_legal_bases'), href: '/herramientas/bases-legales', icon: FileText },
    { label: tUi('item_trivia'), href: '/herramientas/trivia', icon: HelpCircle },
    { label: tUi('item_engagement'), href: '/herramientas/engagement', icon: Heart },
    { label: tUi('item_hashtags'), href: '/herramientas/hashtags', icon: Hash },
  ];

  return (
    <div data-no-translate="true" className="w-full max-w-5xl mx-auto py-2">
      <nav
        aria-label={t('nav_apps')}
        className="p-2 sm:p-2.5 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
          {tools.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all text-center relative group border ${
                  isActive
                    ? 'bg-pink-50 border-pink-500/80 text-pink-700 dark:bg-pink-950/40 dark:border-pink-500 dark:text-pink-200 shadow-xs ring-1 ring-pink-500/30'
                    : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.tag && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-300 uppercase tracking-wider scale-90 shrink-0">
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default ToolSwitcher;
