import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/terms' },
  title: 'Términos de Servicio — Code History Daily',
  description: 'Términos de uso y condiciones del servicio de Code History Daily.',
}

export default function TermsPage() {
  const lastUpdated = '2026-07-06'

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
              Al acceder y utilizar Code History Daily (en adelante, "el Servicio"), aceptas quedar
              vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguno de estos
              términos, no debes utilizar el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Descripción del Servicio</h2>
            <p>
              Code History Daily es una publicación técnica y archivo cronológico dedicado a documentar la historia de la programación, los lenguajes, las arquitecturas de hardware y los estándares abiertos de Internet. Complementariamente, parte de nuestro material divulgativo se difunde en canales audiovisuales oficiales de ATP Dev.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Uso del Contenido y Atribución Académica</h2>
            <p>
              Todo el material cronológico y técnico publicado por Code History Daily posee carácter estrictamente educativo. Se autoriza la cita de reseñas históricas con atribución expresa y enlace a codehistory.atpdev.dev; queda prohibida la copia sistemática o automatizada con fines comerciales sin autorización previa por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Integraciones Técnicas y Publicidad</h2>
            <p>
              Code History Daily emplea interfaces de programación autorizadas exclusivamente para publicar cápsulas educativas en sus cuentas oficiales, sin recolectar datos personales de terceros. El acceso libre y sin muros de pago se financia mediante publicidad responsable operada con Google AdSense bajo Consent Mode v2.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Limitación de Responsabilidad</h2>
            <p>
              Code History Daily no garantiza la disponibilidad ininterrumpida del Servicio y no
              será responsable de daños directos o indirectos derivados del uso o la imposibilidad
              de uso del mismo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Referencias Técnicas y Modificaciones</h2>
            <p className="mb-3">
              CodeHistory puede enlazar a especificaciones RFC, archivos de estándares W3C, repositorios históricos o documentales del ecosistema ATP Dev sobre cuya disponibilidad externa no ejercemos control permanente. Dichos enlaces tienen un propósito estrictamente documental y académico dentro de nuestras fichas diarias.
            </p>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento para adaptarlos a nuevas secciones del archivo cronológico o requisitos legales vigentes. Los cambios serán efectivos desde su publicación en esta página y el uso continuado del Servicio implica su aceptación.
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
