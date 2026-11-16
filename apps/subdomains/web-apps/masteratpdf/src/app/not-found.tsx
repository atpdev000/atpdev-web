import Link from 'next/link';
import type { Metadata } from 'next';
import { FileQuestion, Home, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Página no encontrada | MasterAtPDF Pro',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-surface border border-line shadow-card">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
          <FileQuestion className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">
            Herramienta o página no encontrada
          </h1>
          <p className="text-sm text-ink-2 leading-relaxed">
            La ruta solicitada no existe o cambió de dirección dentro de MasterAtPDF Pro.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand text-white text-xs font-bold inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
          >
            <Home className="w-4 h-4" />
            <span>Todas las herramientas PDF</span>
          </Link>
          <Link
            href="/tools/merge"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-canvas border border-line text-ink text-xs font-bold inline-flex items-center justify-center gap-2 hover:border-line-strong transition-colors"
          >
            <span>Unir PDF</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

