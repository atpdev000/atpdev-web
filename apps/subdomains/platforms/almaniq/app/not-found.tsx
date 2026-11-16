import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Página no encontrada | Almaniq',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center space-y-6 rounded-2xl border border-slate-800 bg-slate-950/90 p-8">
        <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-300">
          ERROR 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Página o efeméride no encontrada
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          La dirección solicitada no existe dentro del archivo histórico de Almaniq.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-colors"
          >
            Volver al Inicio
          </Link>
          <Link
            href="/archivo"
            className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-200 transition-colors"
          >
            Explorar Archivo Anual
          </Link>
        </div>
      </div>
    </main>
  )
}

