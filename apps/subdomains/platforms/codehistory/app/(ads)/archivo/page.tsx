import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPUTING_MONTHS } from '@/lib/computing-archive';

export const metadata: Metadata = {
  title: 'Archivo Cronológico de Computación — Code History Daily',
  description:
    'Índice anual con doce dossiers mensuales y 60 hitos verificados de programación, Unix, protocolos RFC, compiladores, software libre y arquitectura web.',
  alternates: { canonical: '/archivo' },
};

export default function ArchivoComputacionPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto max-w-5xl px-6 py-14 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <Link href="/" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
            ← Volver a la crónica del día
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
            Archivo Técnico Verificado · 60 Hitos de Ingeniería de Software
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Archivo Cronológico de Computación e Internet
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-300">
            Recorre mes a mes la evolución documentada de sistemas operativos, protocolos RFC del
            IETF, compiladores, navegadores abiertos e invenciones de hardware. Cada dossier
            contrasta las decisiones de diseño frente al contexto técnico real de su época y su
            impacto en el desarrollo de software moderno.
          </p>
        </header>

        <section aria-label="Índice mensual de historia computacional" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COMPUTING_MONTHS.map((month) => (
            <Link
              key={month.slug}
              href={`/archivo/${month.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/50 hover:bg-slate-900/90"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-400">MES {month.number}</span>
                  <span className="text-slate-400">{month.entries.length} hitos técnicos</span>
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {month.name}
                </h2>
                <p className="text-xs font-medium text-emerald-300/80">{month.subtitle}</p>
                <p className="text-sm leading-relaxed text-slate-300">{month.overview}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{month.focusArea}</span>
                <span className="font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Leer →
                </span>
              </div>
            </Link>
          ))}
        </section>

        <article className="rounded-2xl border border-slate-800 bg-[#0b111c] p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white">Rigor Documental en Fuentes Primarias</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Todas las fechas distinguen claramente entre prototipos internos, memorandos técnicos
            tempranos, lanzamientos 0.x en listas Usenet y recomendaciones definitivas de organismos
            como IETF o W3C. Consulta detalles sobre nuestros estándares de verificación en{' '}
            <Link href="/about" className="text-emerald-400 underline">
              Sobre Nosotros y Metodología Editorial
            </Link>
            .
          </p>
        </article>
      </div>
    </main>
  );
}

