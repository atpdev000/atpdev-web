import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  title: 'Política de Privacidad — Almaniq Web',
  description: 'Política de privacidad y tratamiento de datos de Almaniq Web.',
}

export default function PrivacyPage() {
  const lastUpdated = '2026-07-25'

  return (
    <main className="min-h-screen bg-[#080b12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <a href="/" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
            ← Volver al inicio
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-3">Política de Privacidad</h1>
        <p className="text-white/40 text-sm mb-10">Última actualización: {lastUpdated}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable del Tratamiento</h2>
            <p>
              Almaniq Web, operado por ATP Dev, es el responsable del tratamiento de los datos
              personales. Contacto:{' '}
              <a
                href="mailto:contacto@atpdev.dev"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                contacto@atpdev.dev
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Datos que Recopilamos</h2>
            <p>
              Almaniq Web opera principalmente como una publicación histórica y educativa de acceso abierto. Al navegar por las secciones públicas no exigimos registro de cuenta ni recopilamos datos personales identificables de los lectores.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Telemetría técnica mínima de servidor (registros HTTP temporales de seguridad y prevención de abusos)</li>
              <li>Preferencias locales de interfaz y consentimiento guardadas en almacenamiento del navegador</li>
              <li>Credenciales editoriales internas bajo protocolos OAuth 2.0 exclusivamente para la distribución automatizada en canales propios del proyecto</li>
            </ul>
            <p className="mt-3">
              En ningún caso se capturan, almacenan ni comercializan datos personales de usuarios finales desde integraciones editoriales externas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Uso de Interfaces y APIs de Terceros</h2>
            <p>
              Almaniq Web utiliza conectores oficiales autorizados (Google API Services, Meta Graph API y APIs oficiales de distribución multimedia) estrictamente para publicar cápsulas educativas propias en sus cuentas verificadas. Los tokens de acceso se resguardan cifrados en entorno de servidor y jamás se comparten con terceros.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong className="text-white">Servicios de Google:</strong> Integración editorial conforme a los{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Términos de Privacidad de Google
                </a>
              </li>
              <li>
                <strong className="text-white">Distribución multimedia vertical:</strong> Publicación de cápsulas propias bajo la{' '}
                <a
                  href="https://www.tiktok.com/legal/page/global/privacy-policy/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Política de Privacidad correspondiente
                </a>
              </li>
              <li>
                <strong className="text-white">Ecosistema Meta:</strong> Difusión en páginas verificadas sujeta a la{' '}
                <a
                  href="https://www.facebook.com/policy.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Política de Datos de Meta
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Cookies y Google AdSense</h2>
            <p className="mb-3">
              Este sitio utiliza cookies técnicas estrictamente necesarias y, sujeto a tus preferencias mediante nuestro banner compatible con Google Consent Mode v2, cookies de terceros proporcionadas por <strong>Google AdSense</strong> para financiar el mantenimiento gratuito del proyecto y mostrar anuncios relevantes o no personalizados.
            </p>
            <p>
              Puedes revisar cómo utiliza Google la información en{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline"
              >
                cómo utiliza Google los datos cuando usas sitios o aplicaciones de nuestros socios
              </a>
              , ajustar la personalización publicitaria en{' '}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline"
              >
                Configuración de anuncios de Google
              </a>{' '}
              o gestionar preferencias de terceros en{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline"
              >
                aboutads.info
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Derechos del Usuario</h2>
            <p>
              De conformidad con la normativa vigente, puedes ejercer tus derechos de acceso,
              rectificación, cancelación y oposición enviando un correo a{' '}
              <a
                href="mailto:contacto@atpdev.dev"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                contacto@atpdev.dev
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cambios en esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política en cualquier momento. Te
              notificaremos de cambios significativos publicando la nueva versión en esta página.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
