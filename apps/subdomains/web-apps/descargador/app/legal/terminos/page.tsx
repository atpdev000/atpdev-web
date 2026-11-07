import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Servicio | FTY Downloader Pro',
  description: 'Términos y condiciones de uso de FTY Downloader Pro. Lee nuestras políticas de uso aceptable y limitaciones del servicio.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Términos de Servicio</h1>
      <p className="text-gray-600 mb-8">Última actualización: 1 de Enero de 2026</p>

      <div className="prose prose-lg max-w-none">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
          <p className="text-amber-800">
            <strong>Importante:</strong> Al utilizar FTY Downloader Pro (en web o app móvil), aceptas cumplir estos Términos de Servicio.
            Por favor, léelos cuidadosamente antes de hacer uso de nuestra plataforma.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceptación de los Términos</h2>
        <p>
          Al acceder y utilizar FTY Downloader Pro (en adelante "el Servicio"), ubicado en descargador.atpdev.dev y a través de su aplicación móvil oficial,
          aceptas cumplir con estos Términos de Servicio y con todas las leyes y regulaciones aplicables en tu jurisdicción.
          Si no estás de acuerdo con alguno de estos términos, debes abstenerte de utilizar el Servicio.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Descripción y Naturaleza del Servicio</h2>
        <p>
          FTY Downloader Pro es una herramienta tecnológica multipropósito para la preservación, extracción y respaldo de contenidos multimedia de plataformas públicas (incluyendo Facebook, TikTok, Instagram, Threads, Twitter/𝕏, YouTube y estados de WhatsApp).
          El Servicio actúa exclusivamente como una herramienta técnica de transformación de formatos (format-shifting) para uso personal, privado y educativo legítimo.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Uso Aceptable y Responsabilidad del Usuario</h2>
        <p>Nuestras herramientas están diseñadas y habilitadas exclusivamente para:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Respaldo de contenido propio:</strong> Descargar copias de seguridad de videos y fotos creados por ti o subidos desde tus perfiles.</li>
          <li><strong>Uso personal y visualización sin conexión:</strong> Disfrutar de contenidos para reproducción personal sin conexión a internet.</li>
          <li><strong>Fines educativos y de investigación:</strong> Uso académico, citas, análisis y crítica bajo los preceptos legales del uso legítimo.</li>
          <li><strong>Contenido de dominio público o bajo licencias libres:</strong> Material con licencias Creative Commons o autorizaciones expresas del titular.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Usos Expresamente Prohibidos</h2>
        <p>Queda terminantemente prohibido utilizar el Servicio para:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Descargar, duplicar o distribuir material protegido por derechos de autor con fines de lucro o redistribución pública sin consentimiento del titular.</li>
          <li>Modificar creaciones intelectuales ajenas y reivindicar su autoría como propia.</li>
          <li>Descargar contenidos para actividades ilícitas, fraudulentas, difamatorias, de hostigamiento o lesivas contra terceros.</li>
          <li>Llevar a cabo ataques de denegación de servicio (DDoS), inyecciones o intentos deliberados de desestabilizar la infraestructura del servidor.</li>
          <li>Emplear bots, scrapers o sistemas automatizados de extracción masiva que sobrecarguen los recursos de red.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Derechos de Autor y Doctrina del Uso Justo (Fair Use)</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">5.1 Respeto a los Derechos de Propiedad Intelectual</h3>
        <p>
          FTY Downloader Pro respeta los derechos de propiedad intelectual y no alberga ningún contenido en sus servidores. El usuario asume plena y exclusiva responsabilidad legal respecto al derecho de descarga y uso final que otorgue a los archivos generados.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">5.2 Doctrina del Fair Use</h3>
        <p>
          En diversas legislaciones internacionales (como el Título 17 del Código de EE. UU. y directivas equivalentes de la UE), la utilización de fragmentos con fines de crítica, comentarios, parodia, docencia o investigación periodística se considera legalmente amparada. Corresponde exclusivamente al usuario verificar que su actividad califique en estos supuestos.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitación de Responsabilidad</h2>
        <div className="bg-gray-50 p-6 rounded-xl my-4 border border-gray-200">
          <p className="font-bold text-gray-900">
            EL SERVICIO SE SUMINISTRA "TAL CUAL" (AS IS) Y "SEGÚN DISPONIBILIDAD":
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-sm text-gray-700">
            <li>FTY Downloader Pro no garantiza la disponibilidad ininterrumpida ante eventuales modificaciones en las APIs o políticas de redes sociales terceras.</li>
            <li>No nos responsabilizamos de las decisiones, redistribuciones o usos indebidos que los usuarios realicen con los archivos descargados.</li>
            <li>No almacenamos ni somos custodios de contenidos ajenos generados por las plataformas de origen.</li>
            <li>Bajo ninguna circunstancia FTY Downloader Pro será responsable por daños incidentales, consecuentes o pérdida de datos derivados del uso del servicio.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Marcas Registradas y Enlaces a Terceros</h2>
        <p>
          Facebook, TikTok, Instagram, Threads, YouTube, Twitter/𝕏 y WhatsApp son marcas registradas de sus respectivos propietarios. FTY Downloader Pro es una plataforma independiente y no mantiene relación comercial, patrocinio ni afiliación oficial con Meta Platforms, ByteDance, Google LLC, X Corp o WhatsApp LLC.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Propiedad Intelectual del Software</h2>
        <p>
          El software, algoritmos, interfaz gráfica, diseño visual, logotipos y marca distintiva de FTY Downloader Pro son propiedad intelectual protegida. Queda prohibida la reproducción no autorizada del código o ingeniería inversa del aplicativo.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Modificaciones de los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Los cambios se harán efectivos a partir de su publicación en esta sección. El uso continuado del Servicio tras la publicación implicará la conformidad y aceptación total de los términos revisados.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contacto y Consultas Legales</h2>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <p className="font-semibold text-blue-900">¿Tienes dudas o necesitas atención sobre estos términos?</p>
          <ul className="mt-3 space-y-1 text-sm text-blue-800">
            <li>✉️ <strong>Correo Oficial:</strong> contacto@atpdev.dev</li>
            <li>📝 <strong>Mesa de Ayuda:</strong> <a href="/contact" className="text-blue-700 underline font-semibold">Página de Contacto</a></li>
            <li>🌐 <strong>Sitio Oficial:</strong> descargador.atpdev.dev</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
