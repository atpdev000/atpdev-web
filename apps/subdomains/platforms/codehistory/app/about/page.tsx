import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Metodología Editorial — Code History Daily',
  description: 'Conoce el equipo editorial, las fuentes documentales primarias y los estándares de verificación de Code History Daily (codehistory.atpdev.dev), proyecto de ATP DEV.',
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
          <h1 className="text-3xl sm:text-4xl font-bold">Sobre Nosotros — Code History Daily</h1>
          <p className="text-slate-400 text-sm">
            Publicación divulgativa y archivo cronológico operado por Percy Acha Taipe (ATP DEV)
          </p>
        </header>
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">1. Propósito Editorial</h2>
            <p>
              <strong>Code History Daily</strong> es una plataforma digital dedicada a documentar y contextualizar hitos históricos de la ingeniería de software, sistemas operativos, estándares RFC/W3C y pioneros de la computación. Nuestro objetivo es ofrecer crónicas rigurosas, libres de sensacionalismo y verificadas contra archivos históricos, publicaciones académicas y repositorios oficiales.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">2. Proceso de Verificación Documental</h2>
            <p>
              Cada entrada publicada pasa por tres controles editoriales: contraste de fecha exacta frente a fuentes primarias, redacción de contexto técnico/histórico en español claro y exclusión estricta de rumores o contenido automatizado sin supervisión humana.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">3. Autoría y Transparencia (E-E-A-T)</h2>
            <p>
              Este sitio forma parte del ecosistema de proyectos de ingeniería y divulgación de <strong>ATP DEV</strong> (<a href="https://www.atpdev.dev" className="text-emerald-400 underline">www.atpdev.dev</a>), dirigido por el Ing. <strong>Percy Acha Taipe</strong> desde Lima, Perú. Para consultas editoriales o correcciones históricas puedes escribirnos desde nuestra página de <a href="/contact" className="text-emerald-400 underline">Contacto</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
