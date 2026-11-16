import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSenseInjector from '@/components/AdSenseInjector';
import { ALMANAC_MONTHS, getAlmanacMonth } from '@/lib/almanac-archive';

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-5414009811868137';

interface ArchivoMesPageProps {
  params: Promise<{ mes: string }>;
}

export async function generateStaticParams() {
  return ALMANAC_MONTHS.map((month) => ({ mes: month.slug }));
}

export async function generateMetadata({ params }: ArchivoMesPageProps): Promise<Metadata> {
  const { mes } = await params;
  const archive = getAlmanacMonth(mes);
  if (!archive) {
    return { title: 'Archivo Histórico — Almaniq Web', robots: { index: false, follow: false } };
  }

  return {
    title: `Efemérides de ${archive.name}: Hitos Históricos y Ciencia — Almaniq Web`,
    description: `${archive.subtitle}. ${archive.overview}`,
    alternates: { canonical: `/archivo/${archive.slug}` },
    other: { 'google-adsense-account': adsenseId },
  };
}

export default async function ArchivoMesPage({ params }: ArchivoMesPageProps) {
  const { mes } = await params;
  const archive = getAlmanacMonth(mes);
  if (!archive) {
    notFound();
  }

  const currentIdx = ALMANAC_MONTHS.findIndex((item) => item.slug === archive.slug);
  const prevMonth = ALMANAC_MONTHS[(currentIdx - 1 + ALMANAC_MONTHS.length) % ALMANAC_MONTHS.length];
  const nextMonth = ALMANAC_MONTHS[(currentIdx + 1) % ALMANAC_MONTHS.length];

  return (
    <>
      <AdSenseInjector adsenseId={adsenseId} />
      <main className="min-h-screen bg-[#080b12] text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto max-w-4xl px-6 py-14 space-y-10">
        <nav
          aria-label="Ruta de navegación"
          className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 text-xs text-slate-400"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/archivo" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Archivo Anual
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold">{archive.name}</span>
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-emerald-300">
              Sobre Nosotros
            </Link>
            <Link href="/contact" className="hover:text-emerald-300">
              Contacto
            </Link>
          </div>
        </nav>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-300">
              MES {archive.number} DE 12
            </span>
            <span className="text-slate-400">{archive.historicalTheme}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Efemérides Históricas de {archive.name}
          </h1>
          <p className="text-lg font-medium text-emerald-300/90">{archive.subtitle}</p>
          <p className="text-base leading-relaxed text-slate-300">{archive.overview}</p>
        </header>

        <section aria-label={`Hitos documentados de ${archive.name}`} className="space-y-6">
          {archive.entries.map((entry) => (
            <article
              key={`${entry.dayLabel}-${entry.year}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-emerald-500/15 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
                    {entry.dayLabel} · {entry.year}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{entry.category}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">{entry.title}</h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-200">{entry.summary}</p>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4 space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Contexto Histórico
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300">{entry.context}</p>
                </div>
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4 space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Impacto y Legado
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300">{entry.legacy}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="space-y-6 border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Link
              href={`/archivo/${prevMonth.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 text-sm hover:border-emerald-500/50 transition-colors"
            >
              <span className="block text-xs text-slate-400">Mes anterior</span>
              <span className="font-semibold text-emerald-300">← {prevMonth.name}</span>
            </Link>
            <Link
              href="/archivo"
              className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 text-sm font-medium text-slate-200 hover:text-emerald-300"
            >
              Ver los 12 meses del Archivo
            </Link>
            <Link
              href={`/archivo/${nextMonth.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 text-sm text-right hover:border-emerald-500/50 transition-colors"
            >
              <span className="block text-xs text-slate-400">Mes siguiente</span>
              <span className="font-semibold text-emerald-300">{nextMonth.name} →</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-between gap-4 text-xs text-slate-400">
            <span>© 2026 Almaniq Web · Operado por ATP Dev (Lima, Perú)</span>
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="hover:text-emerald-300">
                Sobre Nosotros
              </Link>
              <Link href="/contact" className="hover:text-emerald-300">
                Contacto
              </Link>
              <Link href="/privacy" className="hover:text-emerald-300">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="hover:text-emerald-300">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
    </>
  );
}

