import Link from 'next/link';
import type { Metadata } from 'next';
import { ChefHat, BookOpen, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Receta o página no encontrada | Perú Sabor',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#c22929]/10 text-[#c22929] flex items-center justify-center">
          <ChefHat className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-stone-900 dark:text-white">
            Receta o sección no encontrada
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            La ficha técnica o herramienta gastronómica solicitada no existe o fue movida.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#c22929] hover:bg-red-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </Link>
          <Link
            href="/recetas"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorar Recetario</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

