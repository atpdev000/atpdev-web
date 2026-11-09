'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UtensilsCrossed, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  MenuSquare, 
  DollarSign, 
  Boxes, 
  LayoutGrid, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ShieldCheck,
  ChefHat
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('perusabor_theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('perusabor_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('perusabor_theme', 'light');
    }
  };

  const navLinks = [
    { label: 'Catálogo de Recetas', href: '/recetas', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Chef IA Perú', href: '/chef-ia', icon: <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> },
    { label: 'Escalador', href: '/escalador', icon: <Calculator className="w-4 h-4" /> },
    { label: 'Generador Menús', href: '/menus', icon: <MenuSquare className="w-4 h-4" /> },
    { label: 'Costeo & Márgenes', href: '/costeo', icon: <DollarSign className="w-4 h-4 text-emerald-600" /> },
    { label: 'Inventario', href: '/inventario', icon: <Boxes className="w-4 h-4" /> },
    { label: 'Mesas & Pedidos', href: '/restaurante', icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0c0a09]/95 backdrop-blur-md border-b-2 border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo de Marca Perú Sabor Inteligente */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#c22929] flex items-center justify-center text-white shadow-md shadow-red-900/20 border-b-2 border-[#881919] group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl text-stone-900 dark:text-stone-100 tracking-tight">
                  PERÚ SABOR
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black text-[10px] uppercase tracking-wider border border-amber-500/30">
                  INTELIGENTE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 font-medium hidden sm:block">
                Gastronomía Peruana • Chef IA • Gestión de Restaurantes
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#c22929]/10 text-[#c22929] dark:bg-red-950/40 dark:text-red-400 font-extrabold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Theme */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar tema claro y oscuro"
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/recetas"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide btn-peru-primary select-none cursor-pointer"
            >
              Explorar Platos
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0a09] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm ${
                  active
                    ? 'bg-[#c22929] text-white shadow-sm'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;

