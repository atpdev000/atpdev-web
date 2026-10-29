import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TÃ©rminos de Servicio | FTY Downloader Pro',
  description: 'TÃ©rminos y condiciones de uso de FTY Downloader Pro. Lee nuestras polÃ­ticas de uso aceptable y limitaciones del servicio.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">TÃ©rminos de Servicio</h1>
      <p className="text-gray-600 mb-8">Ãšltima actualizaciÃ³n: 1 de Enero de 2026</p>

      <div className="prose prose-lg max-w-none">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
          <p className="text-amber-800">
            <strong>Importante:</strong> Al utilizar FTY Downloader Pro, aceptas estos tÃ©rminos de servicio.
            Por favor, lÃ©elos cuidadosamente antes de usar nuestra plataforma.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. AceptaciÃ³n de los TÃ©rminos</h2>
        <p>
          Al acceder y utilizar FTY Downloader Pro (en adelante "el Servicio"), ubicado en descargador.atpdev.dev,
          aceptas cumplir con estos TÃ©rminos de Servicio y todas las leyes y regulaciones aplicables.
          Si no estÃ¡s de acuerdo con alguno de estos tÃ©rminos, no debes utilizar el Servicio.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. DescripciÃ³n del Servicio</h2>
        <p>
          FTY Downloader Pro es una herramienta web gratuita que permite a los usuarios descargar videos
          de plataformas pÃºblicas de video y redes sociales. El Servicio estÃ¡ diseÃ±ado para uso
          personal y educativo legÃ­timo.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Uso Aceptable</h2>
        <p>Nuestras herramientas estÃ¡n diseÃ±adas exclusivamente para:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Respaldo de contenido propio:</strong> Descargar videos que tÃº mismo has creado y subido a las plataformas</li>
          <li><strong>Uso personal:</strong> Descargar contenido para visualizaciÃ³n offline personal</li>
          <li><strong>Fines educativos:</strong> Material para proyectos educativos con atribuciÃ³n adecuada</li>
          <li><strong>Contenido con licencia:</strong> Descargar videos cuyo autor ha dado permiso explÃ­cito</li>
          <li><strong>Contenido de dominio pÃºblico:</strong> Material sin restricciones de derechos de autor</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Uso Prohibido</h2>
        <p>Queda estrictamente prohibido utilizar el Servicio para:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>âŒ Descargar contenido protegido por derechos de autor sin la autorizaciÃ³n del titular</li>
          <li>âŒ Redistribuir, vender o comercializar contenido descargado sin autorizaciÃ³n</li>
          <li>âŒ Modificar contenido de terceros y reclamarlo como propio</li>
          <li>âŒ Descargar contenido para actividades ilegales, difamatorias o daÃ±inas</li>
          <li>âŒ Realizar ataques de denegaciÃ³n de servicio o intentar vulnerar la seguridad</li>
          <li>âŒ Utilizar el Servicio de manera automatizada sin autorizaciÃ³n (bots, scrapers)</li>
          <li>âŒ Eludir medidas de protecciÃ³n implementadas por las plataformas de origen</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Derechos de Autor y Fair Use</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">5.1 Respeto a los Derechos de Autor</h3>
        <p>
          FTY Downloader Pro respeta los derechos de propiedad intelectual de terceros. El usuario es
          el Ãºnico responsable de asegurarse de que tiene derecho legal para descargar cualquier contenido.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">5.2 Doctrina del Uso Justo (Fair Use)</h3>
        <p>
          Reconocemos que existen usos legÃ­timos de contenido protegido bajo la doctrina del "Fair Use"
          (Uso Justo), que incluye:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>CrÃ­tica y comentario</li>
          <li>EducaciÃ³n e investigaciÃ³n</li>
          <li>Reportajes de noticias</li>
          <li>Parodia</li>
        </ul>
        <p>
          Sin embargo, la determinaciÃ³n de si un uso especÃ­fico califica como "Fair Use" es responsabilidad
          exclusiva del usuario.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. LimitaciÃ³n de Responsabilidad</h2>
        <div className="bg-gray-50 p-6 rounded-xl my-4">
          <p>
            <strong>EL SERVICIO SE PROPORCIONA "TAL CUAL" Y "SEGÃšN DISPONIBILIDAD".</strong> FTY Downloader Pro:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>No garantiza la disponibilidad continua e ininterrumpida del Servicio</li>
            <li>No se hace responsable del uso que los usuarios den al contenido descargado</li>
            <li>No almacena ni es responsable del contenido procesado</li>
            <li>No garantiza la compatibilidad con todos los dispositivos o navegadores</li>
            <li>No se responsabiliza por daÃ±os derivados del uso del Servicio</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. IndemnizaciÃ³n</h2>
        <p>
          El usuario acepta indemnizar y mantener indemne a FTY Downloader Pro, sus operadores,
          directivos y empleados, de cualquier reclamaciÃ³n, demanda, pÃ©rdida o daÃ±o (incluyendo
          honorarios legales) que surjan del uso del Servicio o de la violaciÃ³n de estos TÃ©rminos.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Propiedad Intelectual del Servicio</h2>
        <p>
          El diseÃ±o, cÃ³digo, logotipos y contenido original de FTY Downloader Pro son propiedad de
          sus creadores y estÃ¡n protegidos por leyes de propiedad intelectual. No estÃ¡ permitido copiar,
          modificar o redistribuir elementos del Servicio sin autorizaciÃ³n escrita.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Enlaces a Terceros</h2>
        <p>
          El Servicio puede contener enlaces a sitios web de terceros. No somos responsables del
          contenido, polÃ­ticas de privacidad o prÃ¡cticas de estos sitios externos. Te recomendamos
          leer los tÃ©rminos de cada sitio que visites.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Modificaciones del Servicio</h2>
        <p>
          Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio (o cualquier
          parte del mismo) en cualquier momento, con o sin previo aviso. No seremos responsables
          ante ti ni ante terceros por cualquier modificaciÃ³n, suspensiÃ³n o discontinuaciÃ³n.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Modificaciones de los TÃ©rminos</h2>
        <p>
          Podemos revisar estos TÃ©rminos de Servicio en cualquier momento. Los cambios entrarÃ¡n en
          vigor inmediatamente despuÃ©s de su publicaciÃ³n. El uso continuado del Servicio despuÃ©s de
          cualquier cambio constituye tu aceptaciÃ³n de los nuevos tÃ©rminos.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Ley Aplicable y JurisdicciÃ³n</h2>
        <p>
          Estos TÃ©rminos se regirÃ¡n e interpretarÃ¡n de acuerdo con las leyes aplicables, sin tener
          en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa serÃ¡ sometida
          a la jurisdicciÃ³n exclusiva de los tribunales competentes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contacto</h2>
        <div className="bg-blue-50 p-6 rounded-xl">
          <p>Si tienes preguntas sobre estos TÃ©rminos de Servicio, contÃ¡ctanos:</p>
          <ul className="mt-4 space-y-2">
            <li>ðŸ“§ <strong>Email:</strong> contacto@atpdev.dev</li>
            <li>ðŸ“ <strong>Formulario:</strong> <a href="/contact" className="text-blue-600 hover:underline">PÃ¡gina de Contacto</a></li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>
            Al utilizar FTY Downloader Pro, confirmas que has leÃ­do, entendido y aceptado estos
            TÃ©rminos de Servicio en su totalidad.
          </p>
        </div>
      </div>
    </div>
  )
}
