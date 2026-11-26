import React from 'react';
import Link from 'next/link';
import { QrCode, Lock, Zap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] py-12 transition-colors mt-16 text-slate-600 dark:text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <QrCode className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-display font-black text-base text-slate-900 dark:text-white">
                LECTOR QR PRO WEB
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Escáner y generador profesional de códigos QR y códigos de barras de alta velocidad. 100% procesado en tu navegador: tus fotos y cámara nunca se envían a ningún servidor externo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-700 dark:text-blue-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacidad Total (Client-Side)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Detección 60 FPS</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 dark:text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Estándares Web &amp; SEO</span>
            </div>
          </div>
        </div>

        {/* Navigation & Legal Links */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold">
            <Link href="/" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Escanear</Link>
            <Link href="/generar" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Generador QR</Link>
            <Link href="/guias" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Guías QR</Link>
            <Link href="/historial" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Historial</Link>
            <Link href="/ajustes" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Ajustes</Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <Link href="/sobre-nosotros" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Sobre Nosotros</Link>
            <Link href="/politica-de-privacidad" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Política de Privacidad</Link>
            <Link href="/terminos-y-condiciones" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Términos de Uso</Link>
            <Link href="/politica-de-cookies" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Cookies</Link>
            <a href="#cookies-config" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Configurar Cookies</a>
            <Link href="/contacto" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Contacto</Link>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            © 2026 ATP DEV Perú. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
