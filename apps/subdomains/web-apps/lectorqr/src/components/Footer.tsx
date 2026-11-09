import React from 'react';
import Link from 'next/link';
import { QrCode, ShieldCheck, Lock, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1d] py-10 transition-colors mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
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
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Escáner y generador de códigos QR y códigos de barras de alta velocidad. 100% procesado en tu navegador: tus fotos y cámara nunca se suben a ningún servidor externo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacidad Total (Client-Side)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Detección 60 FPS</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 Lector QR Pro Web. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-500 transition-colors">Escanear</Link>
            <Link href="/generar" className="hover:text-blue-500 transition-colors">Generador</Link>
            <Link href="/historial" className="hover:text-blue-500 transition-colors">Historial</Link>
            <Link href="/ajustes" className="hover:text-blue-500 transition-colors">Ajustes</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
