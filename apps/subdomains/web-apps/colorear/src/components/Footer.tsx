import React from 'react';
import Link from 'next/link';
import { Palette } from 'lucide-react';
import { COLORING_CATEGORIES } from '@/data/catalog';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-slate-800 bg-white dark:bg-[#080d1a] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 border-2 border-zinc-900 dark:border-blue-400 flex items-center justify-center">
              <Palette className="w-4 h-4 text-yellow-300" />
            </span>
            <span className="font-display font-bold text-base text-zinc-900 dark:text-white">
              Colorear Pro
            </span>
          </Link>
          <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
            Biblioteca gratuita de láminas para colorear en PDF (300 DPI) y Estudio Amazon KDP para
            creadores independientes. Parte del ecosistema ATP Dev.
          </p>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Dibujos Gratis</h3>
          <ul className="space-y-1.5 text-xs">
            {COLORING_CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/dibujos/${cat.slug}`} className="hover:underline">
                  {cat.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Herramientas KDP</h3>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/estudio-kdp" className="hover:underline">Estudio de Libros KDP</Link></li>
            <li><Link href="/guias" className="hover:underline">Guía de 300 DPI y Márgenes</Link></li>
            <li><Link href="/planes" className="hover:underline">Planes y Paquetes de Créditos</Link></li>
            <li><a href="https://masteratpdf.atpdev.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">MasterATPDF (Utilidades PDF)</a></li>
            <li><a href="https://lectorqr.atpdev.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">Lector QR Pro</a></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Legal y Privacidad</h3>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/sobre-nosotros" className="hover:underline">Sobre Nosotros</Link></li>
            <li><Link href="/privacidad" className="hover:underline">Política de Privacidad</Link></li>
            <li><Link href="/terminos" className="hover:underline">Términos de Uso</Link></li>
            <li><Link href="/cookies" className="hover:underline">Política de Cookies</Link></li>
            <li><a href="#cookies-config" className="hover:underline">Configurar Cookies</a></li>
            <li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-slate-800/80 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 dark:text-slate-400">
          <span>© {new Date().getFullYear()} ATP Dev Perú — Colorear Pro (colorear.atpdev.dev)</span>
          <span>Procesamiento PDF 300 DPI en navegador • Sin marca de agua en tus libros</span>
        </div>
      </div>
    </footer>
  );
}

