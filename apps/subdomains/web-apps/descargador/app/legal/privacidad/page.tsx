import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | FTY Downloader Pro',
  description: 'Política de privacidad de FTY Downloader Pro. Conoce cómo protegemos tu información y tus derechos como usuario.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
      <p className="text-gray-600 mb-8">Última actualización: 1 de Enero de 2026</p>

      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 p-6 rounded-xl mb-8">
          <p className="text-blue-800 font-medium">
            En FTY Downloader Pro, nos tomamos muy en serio la privacidad de nuestros usuarios.
            Esta política describe qué información recopilamos, cómo la usamos y tus derechos sobre ella.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Información que Recopilamos</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">1.1 Información que NO recopilamos</h3>
        <p>FTY Downloader Pro está diseñado con la privacidad como máxima prioridad:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>No requerimos registro:</strong> Puedes usar nuestra plataforma libremente sin crear una cuenta.</li>
          <li><strong>No almacenamos videos en servidores:</strong> Los archivos procesados no se conservan; una vez completada la transmisión o descarga, se liberan de inmediato.</li>
          <li><strong>No vendemos datos personales:</strong> Jamás comercializamos, alquilamos ni compartimos tus datos con terceros con fines comerciales.</li>
          <li><strong>No rastreamos tu actividad personal:</strong> No guardamos perfiles de usuario ni registros asociados a tu identidad con las URLs que descargas.</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">1.2 Información que recopilamos técnicamente</h3>
        <p>Recopilamos únicamente la información técnica mínima indispensable para ofrecer un servicio estable y seguro:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>URLs públicas proporcionadas (temporal):</strong> Los enlaces que pegas para procesar videos (Facebook, TikTok, Instagram, YouTube, Threads, Twitter/𝕏 o WhatsApp) se procesan en tiempo real para resolver el flujo multimedia y no se conservan permanentemente.</li>
          <li><strong>Datos técnicos anónimos:</strong> Tipo de dispositivo, sistema operativo, resolución y navegador web con el fin de optimizar la interfaz y la compatibilidad de video.</li>
          <li><strong>Métricas de rendimiento agregadas:</strong> Estadísticas generales de tráfico para detectar fallos técnicos y mejorar los servidores.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso de la Información</h2>
        <p>Utilizamos la información recopilada exclusivamente para:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Procesar tus solicitudes de descarga y extracción de audio o video.</li>
          <li>Optimizar la velocidad de respuesta y el rendimiento de nuestros servidores.</li>
          <li>Garantizar la estabilidad técnica y prevenir abusos o ataques maliciosos a la infraestructura.</li>
          <li>Cumplir con requerimientos legales aplicables conforme al marco normativo vigente.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cookies y Tecnologías de Almacenamiento Local</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">3.1 ¿Qué son las cookies y el almacenamiento local?</h3>
        <p>
          Las cookies y el LocalStorage son pequeños fragmentos de información guardados en tu navegador o dispositivo.
          Nos permiten recordar preferencias como el tema oscuro/claro, el idioma seleccionado y el historial local de tus descargas (que vive únicamente en tu dispositivo).
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">3.2 Tipos de cookies utilizadas</h3>
        <table className="w-full border-collapse my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Tipo</th>
              <th className="border p-3 text-left">Propósito</th>
              <th className="border p-3 text-left">Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-3"><strong>Técnicas / Esenciales</strong></td>
              <td className="border p-3">Indispensables para el funcionamiento de la plataforma</td>
              <td className="border p-3">Sesión</td>
            </tr>
            <tr>
              <td className="border p-3"><strong>Preferencias</strong></td>
              <td className="border p-3">Recuerdan idioma (ES, EN, PT) y tema (claro/oscuro)</td>
              <td className="border p-3">1 año</td>
            </tr>
            <tr>
              <td className="border p-3"><strong>Historial Local</strong></td>
              <td className="border p-3">Almacena el registro de tus descargas en tu propio dispositivo</td>
              <td className="border p-3">Persistente local</td>
            </tr>
            <tr>
              <td className="border p-3"><strong>Publicidad</strong></td>
              <td className="border p-3">Redes publicitarias oficiales (Google AdMob / AdSense) para financiar el servicio</td>
              <td className="border p-3">Variable</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Servicios de Publicidad y Socios Externos</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">4.1 Google AdSense y Google AdMob</h3>
        <p>
          Utilizamos servicios publicitarios de Google (AdMob en la aplicación y AdSense en la web). Google utiliza identificadores anónimos y cookies para mostrar anuncios relevantes.
          Los usuarios pueden gestionar sus preferencias publicitarias en cualquier momento desde la{' '}
          <a href="https://adssettings.google.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Configuración de Anuncios de Google
          </a>.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">4.2 Servicios de Optimización Publicitaria Ezoic</h3>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm">
          <p className="font-semibold mb-2">Información sobre los servicios de Ezoic Inc. (“Ezoic”)</p>
          <p className="mb-4">
            Este sitio web puede utilizar los servicios de optimización publicitaria de Ezoic Inc. (“Ezoic”) para la entrega de anuncios digitales basados en intereses. Ezoic y sus socios pueden recopilar identificadores técnicos anónimos (dirección IP anonimizada, tipo de navegador, sistema operativo) para medir la efectividad de la publicidad y evitar fraudes.
          </p>
          <p className="mb-2">
            Puedes consultar más información y configurar el consentimiento publicitario en la{' '}
            <a href="https://www.ezoic.com/privacy-policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Política de Privacidad de Ezoic
            </a>.
          </p>
          <span id="ezoic-privacy-policy-embed"></span>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Seguridad de los Datos</h2>
        <p>
          Implementamos medidas técnicas y organizativas rigurosas para proteger la integridad de nuestro ecosistema:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Transmisión 100% cifrada mediante certificados SSL/TLS con HTTPS estricto.</li>
          <li>Aislamiento de procesos y memoria en servidores sin persistencia de archivos de video ajenos.</li>
          <li>Políticas de permisos de almacenamiento en Android siguiendo las directrices de Scoped Storage y MediaStore de Google Play.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Tus Derechos (RGPD, CCPA y Leyes de Protección de Datos)</h2>
        <p>Como usuario, tienes plenos derechos sobre tus datos conforme a las regulaciones internacionales:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Derecho de acceso y consulta:</strong> Conocer si procesamos alguna información técnica tuya.</li>
          <li><strong>Derecho de supresión / olvido:</strong> Solicitar la eliminación inmediata de cualquier dato o historial.</li>
          <li><strong>Derecho de oposición y limitación:</strong> Rechazar el uso de cookies no esenciales mediante la configuración de tu navegador.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, puedes escribirnos en cualquier momento a través de nuestro{' '}
          <a href="/contact" className="text-blue-600 hover:underline">formulario de contacto</a> o vía correo electrónico.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Protección de Menores de Edad</h2>
        <p>
          FTY Downloader Pro no recopila conscientemente datos de menores de 13 años. Si tienes conocimiento de que un menor ha proporcionado información personal, comunícate con nosotros para proceder a su eliminación inmediata.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cambios y Actualizaciones</h2>
        <p>
          Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente para reflejar mejoras técnicas, normativas o nuevos servicios. Cada cambio se publicará con la fecha de actualización correspondiente.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Información de Contacto</h2>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <p className="mb-4">
            Para dudas, consultas de privacidad o solicitudes sobre tus datos:
          </p>
          <ul className="space-y-2">
            <li>✉️ <strong>Correo Oficial:</strong> contacto@atpdev.dev</li>
            <li>📝 <strong>Soporte en línea:</strong> <a href="/contact" className="text-blue-600 hover:underline">Página de Contacto</a></li>
            <li>🌐 <strong>Sitio Web:</strong> descargador.atpdev.dev</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Tiempo de respuesta habitual: 24 a 48 horas hábiles.
          </p>
        </div>
      </div>
    </div>
  )
}
