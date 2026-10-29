import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PolÃ­tica de Privacidad | FTY Downloader Pro',
  description: 'PolÃ­tica de privacidad de FTY Downloader Pro. Conoce cÃ³mo protegemos tu informaciÃ³n y tus derechos como usuario.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">PolÃ­tica de Privacidad</h1>
      <p className="text-gray-600 mb-8">Ãšltima actualizaciÃ³n: 1 de Enero de 2026</p>

      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 p-6 rounded-xl mb-8">
          <p className="text-blue-800 font-medium">
            En FTY Downloader Pro, nos tomamos muy en serio la privacidad de nuestros usuarios.
            Esta polÃ­tica describe quÃ© informaciÃ³n recopilamos, cÃ³mo la usamos y tus derechos sobre ella.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. InformaciÃ³n que Recopilamos</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">1.1 InformaciÃ³n que NO recopilamos</h3>
        <p>FTY Downloader Pro estÃ¡ diseÃ±ado con la privacidad como prioridad:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>No requerimos registro:</strong> Puedes usar nuestra herramienta sin crear una cuenta</li>
          <li><strong>No almacenamos videos:</strong> Los archivos procesados se eliminan automÃ¡ticamente despuÃ©s de la descarga</li>
          <li><strong>No vendemos datos:</strong> Nunca compartimos informaciÃ³n con terceros con fines comerciales</li>
          <li><strong>No rastreamos tu actividad:</strong> No guardamos historial de las URLs que procesas</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">1.2 InformaciÃ³n que SÃ recopilamos</h3>
        <p>Recopilamos Ãºnicamente la informaciÃ³n mÃ­nima necesaria para proporcionar nuestros servicios:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>URLs de videos (temporal):</strong> Los enlaces que pegas para descargar se procesan temporalmente y se eliminan inmediatamente despuÃ©s</li>
          <li><strong>Datos tÃ©cnicos anÃ³nimos:</strong> Tipo de navegador, dispositivo y sistema operativo para optimizar la experiencia</li>
          <li><strong>Datos de uso agregados:</strong> EstadÃ­sticas anÃ³nimas sobre el uso general del sitio</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso de la InformaciÃ³n</h2>
        <p>Utilizamos la informaciÃ³n recopilada exclusivamente para:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Procesar tus solicitudes de descarga de video</li>
          <li>Mejorar la calidad y rendimiento de nuestros servicios</li>
          <li>Garantizar la seguridad y prevenir abusos de la plataforma</li>
          <li>Generar estadÃ­sticas anÃ³nimas de uso</li>
          <li>Cumplir con obligaciones legales cuando sea requerido</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cookies y TecnologÃ­as Similares</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">3.1 Â¿QuÃ© son las cookies?</h3>
        <p>
          Las cookies son pequeÃ±os archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
          Nos ayudan a recordar tus preferencias y mejorar tu experiencia.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">3.2 Tipos de cookies que utilizamos</h3>
        <table className="w-full border-collapse my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Tipo</th>
              <th className="border p-3 text-left">PropÃ³sito</th>
              <th className="border p-3 text-left">DuraciÃ³n</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-3"><strong>Esenciales</strong></td>
              <td className="border p-3">Necesarias para el funcionamiento bÃ¡sico del sitio</td>
              <td className="border p-3">SesiÃ³n</td>
            </tr>
            <tr>
              <td className="border p-3"><strong>Preferencias</strong></td>
              <td className="border p-3">Recuerdan tu configuraciÃ³n (idioma, tema)</td>
              <td className="border p-3">1 aÃ±o</td>
            </tr>
            <tr>
              <td className="border p-3"><strong>AnalÃ­ticas</strong></td>
              <td className="border p-3">Nos ayudan a entender cÃ³mo se usa el sitio</td>
              <td className="border p-3">2 aÃ±os</td>
            </tr>
            <tr>
              <td className="border p-3"><strong>Publicidad</strong></td>
              <td className="border p-3">Utilizadas por Google AdSense para mostrar anuncios relevantes</td>
              <td className="border p-3">Variable</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-medium mt-6 mb-3">3.3 GestiÃ³n de cookies</h3>
        <p>
          Puedes gestionar tus preferencias de cookies en cualquier momento a travÃ©s de la configuraciÃ³n de tu navegador.
          Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Servicios de Terceros</h2>
        <p>Utilizamos los siguientes servicios de terceros:</p>

        <h3 className="text-xl font-medium mt-6 mb-3">4.1 Google AdSense</h3>
        <p>
          Utilizamos Google AdSense para mostrar anuncios. Google, como proveedor externo, utiliza cookies para mostrar anuncios en nuestro sitio.
          El uso que hace Google de la cookie de DART le permite mostrar anuncios a nuestros usuarios en funciÃ³n de su visita a nuestro sitio y a otros sitios en Internet.
          Los usuarios pueden optar por no recibir la cookie de DART a travÃ©s de la polÃ­tica de privacidad de la red de contenido y de anuncios de Google.
          Puedes optar por no recibir publicidad personalizada visitando <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ConfiguraciÃ³n de Anuncios de Google</a>.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">4.2 Servicios de Ezoic</h3>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm">
          <p className="font-semibold mb-2">InformaciÃ³n sobre los servicios de Ezoic Inc. (â€œEzoicâ€)</p>
          <p className="mb-4">
            Este sitio web utiliza los servicios de Ezoic Inc. (â€œEzoicâ€), incluyendo la gestiÃ³n de publicidad basada en intereses de terceros. Ezoic puede emplear diversas tecnologÃ­as en este sitio web, incluyendo herramientas para servir contenido, mostrar anuncios y habilitar la publicidad para los visitantes, las cuales pueden utilizar cookies de origen y de terceros.
          </p>
          <p className="mb-4">
            Una cookie es un pequeÃ±o archivo de texto enviado a su dispositivo por un servidor web que permite al sitio web recordar informaciÃ³n sobre su actividad de navegaciÃ³n. Las cookies de origen son creadas por el sitio que estÃ¡ visitando, mientras que las cookies de terceros son establecidas por dominios distintos al que estÃ¡ visitando. Ezoic y nuestros socios pueden colocar cookies de terceros, etiquetas, balizas (beacons), pÃ­xeles y tecnologÃ­as similares para monitorear las interacciones con los anuncios y optimizar la segmentaciÃ³n publicitaria.
          </p>
          <p className="mb-4">
            La siguiente informaciÃ³n puede ser recopilada, utilizada y almacenada en una cookie al servir anuncios personalizados:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>DirecciÃ³n IP</li>
            <li>Tipo y versiÃ³n del sistema operativo</li>
            <li>Tipo de dispositivo</li>
            <li>Preferencias de idioma</li>
            <li>Tipo de navegador web</li>
            <li>Correo electrÃ³nico (en forma cifrada o hash)</li>
          </ul>
          <p className="mb-4">
            Ezoic y sus socios pueden utilizar estos datos en combinaciÃ³n con informaciÃ³n recolectada de forma independiente para ofrecer anuncios especÃ­ficos en diversas plataformas y sitios web. Puede encontrar mÃ¡s informaciÃ³n sobre la publicidad basada en intereses y cÃ³mo gestionarla <a href="https://www.ezoic.com/privacy-policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">aquÃ­</a>.
          </p>
          {/* Ezoic Privacy Policy Embed Snippet */}
          <span id="ezoic-privacy-policy-embed"></span>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">4.3 Google Analytics</h3>
        <p>
          Utilizamos Google Analytics para analizar el uso del sitio web. Esta informaciÃ³n nos ayuda a mejorar
          nuestros servicios. Google Analytics recopila informaciÃ³n de forma anÃ³nima.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Seguridad de los Datos</h2>
        <p>
          Implementamos medidas de seguridad tÃ©cnicas y organizativas para proteger tu informaciÃ³n:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Conexiones cifradas mediante HTTPS/TLS</li>
          <li>EliminaciÃ³n automÃ¡tica de archivos temporales</li>
          <li>Acceso restringido a datos solo a personal autorizado</li>
          <li>Monitoreo continuo de seguridad</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Tus Derechos (GDPR y CCPA)</h2>
        <p>Tienes los siguientes derechos sobre tus datos personales:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Derecho de acceso:</strong> Solicitar una copia de los datos que tenemos sobre ti</li>
          <li><strong>Derecho de rectificaciÃ³n:</strong> Corregir datos inexactos</li>
          <li><strong>Derecho de supresiÃ³n:</strong> Solicitar la eliminaciÃ³n de tus datos</li>
          <li><strong>Derecho de portabilidad:</strong> Recibir tus datos en formato legible</li>
          <li><strong>Derecho de oposiciÃ³n:</strong> Oponerte al procesamiento de tus datos</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, contÃ¡ctanos a travÃ©s de nuestro
          <a href="/contact" className="text-blue-600 hover:underline"> formulario de contacto</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Menores de Edad</h2>
        <p>
          FTY Downloader Pro no estÃ¡ dirigido a menores de 13 aÃ±os. No recopilamos conscientemente
          informaciÃ³n personal de niÃ±os. Si eres padre/tutor y crees que tu hijo nos ha proporcionado
          informaciÃ³n personal, contÃ¡ctanos para que podamos eliminarla.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cambios en Esta PolÃ­tica</h2>
        <p>
          Podemos actualizar esta polÃ­tica de privacidad ocasionalmente. Te notificaremos sobre cambios
          significativos publicando la nueva polÃ­tica en esta pÃ¡gina con una fecha de actualizaciÃ³n visible.
          Te recomendamos revisar esta pÃ¡gina periÃ³dicamente.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contacto</h2>
        <div className="bg-gray-50 p-6 rounded-xl">
          <p className="mb-4">
            Si tienes preguntas sobre esta polÃ­tica de privacidad o sobre cÃ³mo manejamos tus datos,
            puedes contactarnos a travÃ©s de:
          </p>
          <ul className="space-y-2">
            <li>ðŸ“§ <strong>Email:</strong> contacto@atpdev.dev</li>
            <li>ðŸ“ <strong>Formulario:</strong> <a href="/contact" className="text-blue-600 hover:underline">PÃ¡gina de Contacto</a></li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Tiempo de respuesta estimado: 24-48 horas hÃ¡biles
          </p>
        </div>
      </div>
    </div>
  )
}
