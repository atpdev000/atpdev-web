import type { Metadata } from 'next';
import Link from 'next/link';
import { ALMANAC_MONTHS } from '@/lib/almanac-archive';

export const metadata: Metadata = {
  title: 'Archivo Histórico Anual — Almaniq Web',
  description:
    'Índice anual de efemérides históricas verificadas mes a mes: ciencia, tecnología, cultura, derechos humanos e historia universal curada por ATP Dev.',
  alternates: { canonical: '/archivo' },
};

export default function ArchivoIndexPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto max-w-5xl px-6 py-14 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <Link href="/" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
            ← Volver a la edición de hoy
          </Link>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <Link href="/about" className="hover:text-emerald-300">
              Metodología Editorial
            </Link>
            <Link href="/contact" className="hover:text-emerald-300">
              Contacto
            </Link>
            <Link href="/privacy" className="hover:text-emerald-300">
              Privacidad
            </Link>
          </div>
        </div>

        <header className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Dossiers Mensuales Verificados · 60 Hitos Históricos
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Archivo Histórico Anual de Almaniq
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-300">
            Recorre los doce meses del calendario gregoriano a través de dossiers documentales
            organizados por contexto causal y legado científico o cultural. Cada entrega mensual
            reúne hechos contrastados contra archivos académicos, efemérides de América Latina e
            hitos universales pensados para lectura educativa en español.
          </p>
        </header>

        <section aria-label="Índice mensual de efemérides" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALMANAC_MONTHS.map((month) => (
            <Link
              key={month.slug}
              href={`/archivo/${month.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/50 hover:bg-slate-900/90"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">MES {month.number}</span>
                  <span className="text-slate-400">{month.entries.length} hitos documentados</span>
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {month.name}
                </h2>
                <p className="text-xs font-medium text-emerald-300/80">{month.subtitle}</p>
                <p className="text-sm leading-relaxed text-slate-300">{month.overview}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{month.historicalTheme}</span>
                <span className="font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Leer →
                </span>
              </div>
            </Link>
          ))}
        </section>

        <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white">Criterios de Archivo y Uso Educativo</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Todas las reseñas del archivo distinguen explícitamente entre fechas julianas previas a
            1582 y cronología gregoriana moderna, sitúan cada invención o evento cívico dentro de su
            contexto social e institucional y evitan mitos populares sin respaldo documental.
            Docentes y estudiantes pueden explorar cualquier mes o revisar nuestra{' '}
            <Link href="/about" className="text-emerald-400 underline">
              metodología completa de verificación
            </Link>
            .
          </p>
        </article>
      </div>
    </main>
  );
}

