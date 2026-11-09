'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  QrCode, 
  Scan, 
  Sparkles, 
  History, 
  Settings, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lectorqr_theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lectorqr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lectorqr_theme', 'light');
    }
  };

  const navLinks = [
    { label: 'Escanear', href: '/', icon: <Scan className="w-4 h-4" /> },
    { label: 'Generador QR', href: '/generar', icon: <QrCode className="w-4 h-4 text-blue-500" /> },
    { label: 'Historial', href: '/historial', icon: <History className="w-4 h-4" /> },
    { label: 'Ajustes', href: '/ajustes', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 border-b-2 border-blue-800 group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  LECTOR QR
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-wider border border-blue-500/30">
                  PRO WEB
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Escáner Instantáneo • Generador HD • 100% Seguro
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-extrabold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Theme */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/generar"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide btn-qr-primary select-none cursor-pointer"
            >
              Crear QR
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1d] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
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
