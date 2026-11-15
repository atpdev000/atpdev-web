import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Metodología Editorial — Almaniq Web',
  description: 'Conoce el equipo editorial, las fuentes documentales primarias y los estándares de verificación de Almaniq Web (almaniq.atpdev.dev), proyecto de ATP DEV.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div>
          <a href="/" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
            ← Volver al inicio
          </a>
        </div>
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Sobre Nosotros — Almaniq Web</h1>
          <p className="text-slate-400 text-sm">
            Publicación divulgativa y archivo cronológico operado por Percy Acha Taipe (ATP DEV)
          </p>
        </header>
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">1. Propósito Editorial</h2>
            <p>
              <strong>Almaniq Web</strong> es una plataforma digital dedicada a documentar y contextualizar efemérides históricas verificadas, ciencia, cultura general y análisis de tendencias globales. Nuestro objetivo es ofrecer crónicas rigurosas, libres de sensacionalismo y verificadas contra archivos históricos, publicaciones académicas y repositorios oficiales.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">2. Proceso de Verificación Documental</h2>
            <p>
              Cada efeméride y dossier mensual publicado en nuestro <a href="/archivo" className="text-emerald-400 underline">Archivo Histórico Anual</a> atraviesa tres niveles de control antes de llegar a los lectores:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 mt-2">
              <li>
                <strong>Contraste cronológico primario:</strong> Validación de fechas exactas (ajustadas por transición juliano-gregoriana cuando corresponde), ubicaciones geográficas y nombres históricos frente a archivos universitarios, actas oficiales y registros enciclopédicos reconocidos.
              </li>
              <li>
                <strong>Contextualización comprensible:</strong> Cada hecho se acompaña de antecedentes causales y consecuencias verificables en la historia de la ciencia, la cultura o la sociedad, evitando titulares sensacionalistas o anacronismos.
              </li>
              <li>
                <strong>Revisión editorial continua:</strong> Ninguna síntesis automatizada se incorpora al índice permanente sin supervisión humana, curación de estilo en español neutro y trazabilidad bibliográfica.
              </li>
            </ul>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">3. Cobertura Temática y Valor Educativo</h2>
            <p>
              El almanaque organiza el conocimiento en grandes ejes transversales: descubrimientos astronómicos y físicos, avances médicos que transformaron la salud pública, hitos cívicos y derechos humanos, inventos de comunicación y patrimonio cultural iberoamericano y universal. Estudiantes de secundaria, docentes e investigadores pueden recorrer el calendario mes a mes desde el índice de{' '}
              <a href="/archivo" className="text-emerald-400 underline">efemérides mensuales</a> o consultar la edición interactiva del día en portada.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">4. Autoría, Sostenibilidad y Transparencia (E-E-A-T)</h2>
            <p>
              Este sitio forma parte del ecosistema editorial y de ingeniería de <strong>ATP DEV</strong> (<a href="https://www.atpdev.dev" className="text-emerald-400 underline">www.atpdev.dev</a>), dirigido por el Ing. <strong>Percy Acha Taipe</strong> desde Lima, Perú. Nuestro archivo prioriza fechas contrastadas en enciclopedias técnicas, archivos históricos universitarios y hemerotecas públicas para aportar contexto claro y educativo sin barreras de pago.
            </p>
            <p className="mt-2">
              La operación gratuita de Almaniq Web se sostiene de manera transparente mediante publicidad responsable y controles de privacidad compatibles con Consent Mode v2. Si detectas alguna imprecisión cronológica o deseas proponer un hito histórico documentado, escríbenos a{' '}
              <a href="mailto:contacto@atpdev.dev" className="text-emerald-400 underline">contacto@atpdev.dev</a>{' '}
              o consulta nuestras páginas de <a href="/contact" className="text-emerald-400 underline">Contacto</a>,{' '}
              <a href="/privacy" className="text-emerald-400 underline">Política de Privacidad</a> y{' '}
              <a href="/terms" className="text-emerald-400 underline">Términos de Servicio</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
