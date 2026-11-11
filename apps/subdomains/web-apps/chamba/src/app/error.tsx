'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home, Search } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in chamba pro:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle size={32} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 text-xs font-mono font-bold border border-rose-200 dark:border-rose-800/40">
            INCIDENCIA TÉCNICA TEMPORAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            Ocurrió una interrupción inesperada
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Hemos registrado la incidencia de forma automática. Puedes intentar recargar la vista o regresar a la búsqueda de convocatorias oficiales.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs font-display transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Reintentar Conexión</span>
          </button>
          <Link
            href="/empleos"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search size={15} />
            <span>Explorar Convocatorias</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Home size={15} />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

