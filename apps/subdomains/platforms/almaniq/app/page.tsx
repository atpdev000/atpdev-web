import Link from 'next/link';
import AlmaniqClient from '@/components/AlmaniqClient';

export const revalidate = 3600;

const ALMANIQ_PILLARS = [
  {
    tag: 'Historia Universal',
    title: 'Contexto cronológico más allá del dato suelto',
    description:
      'Cada efeméride histórica resume qué ocurrió en esa fecha y por qué sigue importando en la cultura, la ciencia o la geopolítica contemporánea, evitando listados superficiales sin explicación.',
  },
  {
    tag: 'Ciencia & Astronomía',
    title: 'Descubrimientos, misiones espaciales e inventos',
    description:
      'Documentamos desde hitos clásicos de la física, la medicina y la observación astronómica hasta avances recientes en telescopios orbitales, genética e ingeniería energética.',
  },
  {
    tag: 'Tendencias Verificadas',
    title: 'Curaduría editorial con filtro de seguridad y relevancia',
    description:
      'Nuestro pipeline compara señales de interés global y descarta ruido sensacionalista, rumores sin respaldo o contenido delicado, priorizando temáticas educativas, tecnológicas y culturales.',
  },
  {
    tag: 'Archivo Educativo',
    title: 'Diseñado para estudiantes, docentes y curiosos',
    description:
      'Almaniq reúne referencias rápidas en español claro para enriquecer clases, presentaciones, hilos divulgativos y lectura diaria libre de registros obligatorios.',
  },
];

const CURATION_STEPS = [
  {
    step: '01 · Contraste histórico',
    detail:
      'Cruzamos registros enciclopédicos, archivos museográficos y cronologías científicas para verificar años, nombres propios y ubicaciones geográficas antes de publicar la cápsula diaria.',
  },
  {
    step: '02 · Análisis de originalidad en tendencias',
    detail:
      'Las consultas emergentes pasan por una matriz de puntaje editorial que prioriza hallazgos científicos, efemérides culturales e innovaciones tecnológicas frente a temas efímeros sin contexto.',
  },
  {
    step: '03 · Síntesis legible en la web abierta',
    detail:
      'Tanto en el tablero interactivo como en este archivo estructurado ofrecemos explicaciones completas, accesibles desde el primer byte y optimizadas para lectura rápida en móvil y escritorio.',
  },
];

const FAQ_ITEMS = [
  {
    question: '¿Qué diferencia a Almaniq de un portal tradicional de noticias?',
    answer:
      'Almaniq no persigue la última hora policial ni el sensacionalismo. Su propósito es conectar efemérides históricas verificadas con tendencias científicas y culturales vigentes para ofrecer contexto educativo diario.',
  },
  {
    question: '¿Con qué frecuencia se actualiza el catálogo de efemérides y tendencias?',
    answer:
      'La efeméride destacada cambia cada día según el calendario histórico, mientras que el catálogo de tendencias curadas se renueva automáticamente con controles editoriales de calidad.',
  },
  {
    question: '¿Cómo gestiona Almaniq la privacidad y las cookies de publicidad?',
    answer:
      'Implementamos Consent Mode v2 y un banner transparente donde puedes aceptar o limitar preferencias en cualquier momento. Todos los detalles figuran en nuestra Política de Privacidad.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#020617] text-slate-200">
      <AlmaniqClient />

      <section
        aria-label="Guía Editorial y Enciclopedia Diaria Almaniq"
        className="border-t border-slate-800/80 bg-[#050b1a] px-4 py-16 text-slate-200 md:px-8"
      >
        <div className="mx-auto max-w-5xl space-y-12">
          <header className="space-y-4">
            <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Almanaque Digital · Divulgación &amp; Contexto
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Enciclopedia diaria de historia universal, ciencia y conocimiento verificado
            </h2>
            <p className="text-base leading-relaxed text-slate-300">
              <strong>Almaniq</strong> (<code>almaniq.atpdev.dev</code>) nace como un observatorio diario de
              memoria histórica y tendencias de interés cultural desarrollado dentro del ecosistema de{' '}
              <strong>ATP Dev</strong>. Cada jornada reunimos hechos históricos clave, avances científicos,
              hitos astronómicos y temas emergentes analizados con criterio editorial para responder no solo
              qué sucedió hoy en la historia, sino por qué sigue transformando nuestra forma de ver el mundo.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            {ALMANIQ_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 transition-colors hover:border-emerald-500/30"
              >
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {pillar.tag}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{pillar.description}</p>
              </article>
            ))}
          </div>

          <article className="space-y-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 md:p-8">
            <h2 className="text-xl font-bold text-white">
              Metodología de curaduría y filtrado responsable
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              En la web actual abundan los agregadores automáticos que replican titulares sin contexto o
              amplifican contenido sensacionalista. En Almaniq combinamos automatización estructurada con reglas
              estrictas de verificación y exclusión para mantener un entorno informativo útil y apto para todo
              público:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {CURATION_STEPS.map((item) => (
                <div key={item.step} className="rounded-xl border border-slate-800/90 bg-slate-900/50 p-4">
                  <p className="font-mono text-xs font-bold text-emerald-300">{item.step}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
                  <h3 className="text-base font-semibold text-emerald-300">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center">
            <div>
              © 2026 Almaniq · Curiosidades e Historia por{' '}
              <a
                href="https://www.atpdev.dev"
                className="font-semibold text-emerald-300 underline decoration-emerald-500/40 hover:text-emerald-200"
              >
                ATP Dev
              </a>
            </div>
            <nav aria-label="Enlaces legales y ecosistema" className="flex flex-wrap gap-5">
              <Link href="/privacy" className="text-slate-300 hover:text-emerald-300">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-slate-300 hover:text-emerald-300">
                Términos de Servicio
              </Link>
              <a href="https://codehistory.atpdev.dev" className="text-slate-300 hover:text-emerald-300">
                Code History
              </a>
              <a href="https://www.atpdev.dev/blog" className="text-slate-300 hover:text-emerald-300">
                Blog Técnico
              </a>
            </nav>
          </footer>
        </div>
      </section>
    </div>
  );
}
