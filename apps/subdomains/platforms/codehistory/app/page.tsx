import Link from 'next/link';
import ProgrammingEphemerisClient from '@/components/ProgrammingEphemerisClient';

export const revalidate = 3600;

const COMPUTING_MILESTONES = [
  {
    era: '1843 · Fundamentos Algorítmicos',
    title: 'Ada Lovelace y el primer algoritmo publicado para una máquina',
    summary:
      'En sus extensas notas sobre la Máquina Analítica de Charles Babbage, Ada Lovelace formuló una secuencia paso a paso para calcular los números de Bernoulli e intuyó por primera vez que una máquina simbólica podía manipular música, lógica y texto más allá de la aritmética pura.',
  },
  {
    era: '1936 · Teoría de la Computación',
    title: 'La Máquina de Turing y el concepto formal de algoritmo',
    summary:
      'Alan Turing demostró en "On Computable Numbers" que un autómata abstracto de cinta infinita podía simular cualquier procedimiento mecánico de cómputo, sentando las bases teóricas de la arquitectura de almacenamiento de programas y la informática moderna.',
  },
  {
    era: '1957 · Compiladores de Alto Nivel',
    title: 'Grace Hopper, FORTRAN y el salto fuera del código ensamblador',
    summary:
      'El equipo liderado por John Backus en IBM lanzó FORTRAN mientras Grace Hopper consolidaba los primeros compiladores y el lenguaje FLOW-MATIC (precursor de COBOL), demostrando que escribir lógica legible para humanos podía traducirse automáticamente a código máquina eficiente.',
  },
  {
    era: '1969–1972 · Sistemas Modernos',
    title: 'UNIX en Bell Labs y el nacimiento del lenguaje C',
    summary:
      'Ken Thompson y Dennis Ritchie reescribieron UNIX en lenguaje C, permitiendo portar un sistema operativo completo entre arquitecturas distintas sin reescribir decenas de miles de líneas en ensamblador. Su modelo de procesos, tuberías y archivos sigue vivo en Linux, macOS y Android.',
  },
  {
    era: '1989–1991 · La Web Abierta y Software Libre',
    title: 'World Wide Web (HTTP/HTML) y el núcleo Linux',
    summary:
      'Tim Berners-Lee propuso el sistema de hipertexto distribuido en el CERN unificando URI, HTTP y HTML, mientras Linus Torvalds publicaba la primera versión del kernel Linux bajo licencia libre GNU GPL, detonando el desarrollo colaborativo global a gran escala.',
  },
  {
    era: '2005–2026 · Control Distribuido y Tipado Estricto',
    title: 'De Git a WebAssembly, TypeScript e ingeniería asistida',
    summary:
      'Git descentralizó la colaboración del código fuente mediante árboles criptográficos inmutables; más tarde, TypeScript, Rust y los estándares web modernos elevaron la seguridad de memoria y el tipado estático en aplicaciones web y móviles de producción.',
  },
];

const FAQ_ITEMS = [
  {
    question: '¿Cómo funciona el archivo diario de efemérides de Code History?',
    answer:
      'Cada jornada muestra un acontecimiento histórico relevante sobre lenguajes de programación, sistemas operativos, estándares de red, hardware o pioneros del software consultado dinámicamente desde nuestra base cronológica en PostgreSQL.',
  },
  {
    question: '¿Qué fuentes se utilizan para verificar las fechas técnicas?',
    answer:
      'Cada entrada contrasta archivos académicos de universidades, notas técnicas RFC, actas históricas del Computer History Museum, registros oficiales de lanzamientos (como listas de correo de Linux o notas del CERN) y repositorios fundacionales de código abierto.',
  },
  {
    question: '¿Se recopilan datos personales o comandos escritos en el terminal?',
    answer:
      'No. La consola interactiva y las preferencias visuales operan completamente en tu navegador. Consulta los detalles completos en nuestra Política de Privacidad y Términos de Servicio.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#05080d] text-slate-200">
      <ProgrammingEphemerisClient />

      <section
        aria-label="Archivo Editorial e Historia de la Computación"
        className="border-t border-emerald-500/20 bg-[#070b12] px-4 py-16 text-slate-200"
      >
        <div className="mx-auto max-w-4xl space-y-12">
          <header className="space-y-4">
            <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Enciclopedia &amp; Archivo Histórico
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Historia de la Programación: Efemérides, Pioneros y Evolución del Software
            </h1>
            <p className="text-base leading-relaxed text-slate-300">
              <strong>Code History Daily</strong> (<code>codehistory.atpdev.dev</code>) es un proyecto de
              divulgación informática diseñado por <strong>ATP Dev</strong> para recordar, día tras día,
              las decisiones técnicas, compiladores, protocolos abiertos y lanzamientos que dieron forma
              a la ingeniería de software contemporánea. Comprender de dónde vienen herramientas como
              UNIX, TCP/IP, HTML, Linux o Git permite tomar mejores decisiones arquitectónicas hoy.
            </p>
          </header>

          <article className="space-y-6">
            <h2 className="border-b border-emerald-500/20 pb-3 text-2xl font-bold text-white">
              Hitos fundamentales de la ingeniería de software (1843–2026)
            </h2>
            <p className="leading-relaxed text-slate-300">
              Mucho antes de que existieran las nubes públicas o los entornos de desarrollo modernos, la
              computación atravesó transiciones radicales en cómo representamos instrucciones y datos. A
              continuación reunimos seis etapas esenciales documentadas en nuestro índice cronológico:
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {COMPUTING_MILESTONES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-800 bg-[#0b111c] p-5 transition-colors hover:border-emerald-500/30"
                >
                  <p className="font-mono text-xs font-semibold text-emerald-300">{item.era}</p>
                  <h3 className="mt-1.5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.summary}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="space-y-4 rounded-2xl border border-slate-800 bg-[#0b111c] p-6">
            <h2 className="text-xl font-bold text-white">
              Metodología de verificación y criterio editorial
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              En internet abundan las fechas erróneas repetidas sin verificación primaria —como confundir la
              fecha de propuesta de un proyecto con su primera compilación funcional o su publicación
              oficial—. Para mantener el rigor divulgativo, cada efeméride diaria clasifica eventos en tres
              categorías explícitas:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
              <li>
                <strong className="text-white">Lanzamientos y versiones fundacionales:</strong> primer anuncio
                en listas de correo históricas (ejemplo: Linus Torvalds en <code>comp.os.minix</code> en
                1991 o Guido van Rossum con Python 0.9.0).
              </li>
              <li>
                <strong className="text-white">Estándares y especificaciones RFC/W3C:</strong> fechas
                exactas de adopción o publicación de especificaciones técnicas que sostienen el tráfico de
                red, la web semántica y la criptografía moderna.
              </li>
              <li>
                <strong className="text-white">Contribuciones humanas y patentes abiertas:</strong>{' '}
                reconocimiento a inventoras, matemáticos y equipos que crearon compiladores, sistemas
                operativos en tiempo real y bases de datos relacionales.
              </li>
            </ul>
          </article>

          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-white">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-slate-800 bg-[#0b111c] p-5">
                  <h3 className="text-base font-semibold text-emerald-300">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center">
            <div>
              © 2026 Code History Daily · Proyecto educativo de{' '}
              <a
                href="https://www.atpdev.dev"
                className="font-semibold text-emerald-300 underline decoration-emerald-500/40 hover:text-emerald-200"
              >
                ATP Dev
              </a>
            </div>
            <nav aria-label="Enlaces legales y editoriales" className="flex flex-wrap gap-5">
              <Link href="/privacy" className="text-slate-300 hover:text-emerald-300">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-slate-300 hover:text-emerald-300">
                Términos de Servicio
              </Link>
              <a href="https://www.atpdev.dev/blog" className="text-slate-300 hover:text-emerald-300">
                Blog de Ingeniería
              </a>
            </nav>
          </footer>
        </div>
      </section>
    </div>
  );
}
