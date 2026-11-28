"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface LanguageSelectorProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang, setLanguage, currentOption, supportedLanguages } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      data-no-translate="true"
      className={`relative inline-block text-left notranslate ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Seleccionar idioma / Select language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20"
      >
        <Globe className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 shrink-0" />
        <span className="font-mono uppercase font-bold tracking-wide">{currentOption.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-pink-600 dark:text-pink-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right backdrop-blur-xl">
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
            <Globe className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Idioma / Language
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
            {supportedLanguages.map((option) => {
              const isSelected = option.code === lang;
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleSelect(option.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 font-bold border border-pink-200/80 dark:border-pink-800/50 shadow-xs'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 font-mono text-[10px] font-extrabold uppercase text-slate-600 dark:text-zinc-200 shrink-0">
                      {option.code}
                    </span>
                    <div className="flex flex-col">
                      <span className="leading-tight">{option.nativeName}</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono uppercase">
                        {option.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
