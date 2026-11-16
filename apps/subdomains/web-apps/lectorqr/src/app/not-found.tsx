import Link from 'next/link';
import type { Metadata } from 'next';
import { QrCode, Scan, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Página no encontrada | Lector QR Pro',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center">
          <QrCode className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold uppercase">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Página no encontrada
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            La ruta solicitada no existe dentro de Lector QR Pro.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Scan className="w-4 h-4" />
            <span>Ir al Escáner QR</span>
          </Link>
          <Link
            href="/guias"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ver Guías Técnicas</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

