import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/terms' },
  title: 'Términos de Servicio — Almaniq Web',
  description: 'Términos de uso y condiciones del servicio de Almaniq Web.',
}

export default function TermsPage() {
  const lastUpdated = '2026-07-25'

  return (
    <main className="min-h-screen bg-[#080b12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <a href="/" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
            ← Volver al inicio
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-3">Términos de Servicio</h1>
        <p className="text-white/40 text-sm mb-10">Última actualización: {lastUpdated}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar Almaniq Web (en adelante, "el Servicio"), aceptas quedar
              vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguno de estos
              términos, no debes utilizar el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Descripción del Servicio</h2>
            <p>
              Almaniq Web es una publicación digital y archivo cronológico dedicado a la divulgación histórica, científica y cultural mediante efemérides verificadas y dossiers mensuales de acceso libre. Complementariamente, parte de nuestro material divulgativo se difunde en canales audiovisuales oficiales operados por ATP Dev.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Uso del Contenido y Propiedad Intelectual</h2>
            <p>
              Las crónicas, reseñas históricas y compilaciones editoriales de Almaniq Web tienen finalidad estrictamente educativa e informativa. Puedes citar fragmentos con atribución expresa y enlace a la fuente original en almaniq.atpdev.dev; queda prohibida la redistribución masiva o automatizada con fines comerciales sin autorización previa por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Integraciones Técnicas y Publicidad</h2>
            <p>
              Almaniq Web emplea interfaces de programación autorizadas exclusivamente para la gestión y publicación de contenido editorial propio en sus cuentas oficiales, sin recolectar información personal de terceros. El sostenimiento gratuito del portal se financia mediante publicidad contextual o personalizada de Google AdSense conforme a nuestras políticas de privacidad y consentimiento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Limitación de Responsabilidad</h2>
            <p>
              Almaniq Web no garantiza la disponibilidad ininterrumpida del Servicio y no
              será responsable de daños directos o indirectos derivados del uso o la imposibilidad
              de uso del mismo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Enlaces Externos y Modificaciones</h2>
            <p className="mb-3">
              Almaniq puede incluir enlaces hacia recursos académicos, hemerotecas o portales del ecosistema ATP Dev sobre cuya disponibilidad permanente no ejercemos control editorial directo. La inclusión de referencias externas cumple fines exclusivamente informativos y bibliográficos para profundizar en cada efeméride consultada.
            </p>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento para reflejar mejoras del archivo histórico o cambios normativos aplicables. Las actualizaciones serán efectivas al ser publicadas en esta página y el uso continuado del Servicio implica su aceptación vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contacto</h2>
            <p>
              Para consultas relacionadas con estos términos, puedes escribirnos a:{' '}
              <a
                href="mailto:contacto@atpdev.dev"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                contacto@atpdev.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
