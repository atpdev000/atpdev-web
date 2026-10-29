export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">PolÃ­tica de Cookies</h1>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-sm text-gray-500 mb-8 italic">Ãšltima actualizaciÃ³n: 1 de Enero de 2026</p>

        <p>
          En <strong>FTY Downloader Pro</strong>, utilizamos cookies y tecnologÃ­as similares para mejorar tu experiencia de navegaciÃ³n,
          analizar el trÃ¡fico del sitio y personalizar el contenido. Esta polÃ­tica explica quÃ© son las cookies, cÃ³mo las usamos y tus opciones para controlarlas.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Â¿QuÃ© son las cookies?</h2>
        <p>
          Las cookies son pequeÃ±os archivos de texto que los sitios web almacenan en tu computadora o dispositivo mÃ³vil cuando los visitas.
          Permiten que el sitio web "recuerde" tus acciones o preferencias (como el idioma, el tamaÃ±o de la fuente y otras preferencias de visualizaciÃ³n)
          durante un perÃ­odo de tiempo, para que no tengas que volver a introducirlas cada vez que regresas al sitio o navegas de una pÃ¡gina a otra.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Â¿CÃ³mo utilizamos las cookies?</h2>
        <p>Utilizamos cookies por varias razones tÃ©cnicas y de experiencia de usuario:</p>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Cookies Esenciales:</strong> Son necesarias para el funcionamiento bÃ¡sico del sitio, como la navegaciÃ³n por las pÃ¡ginas y el acceso a Ã¡reas seguras. El sitio no puede funcionar correctamente sin estas cookies.</li>
          <li><strong>Cookies de Preferencia:</strong> Nos permiten recordar informaciÃ³n que cambia la forma en que el sitio se comporta o se ve, como tu idioma preferido o la regiÃ³n en la que te encuentras.</li>
          <li><strong>Cookies de EstadÃ­stica (AnalÃ­ticas):</strong> Nos ayudan a comprender cÃ³mo interactÃºan los visitantes con el sitio al recopilar y reportar informaciÃ³n de forma anÃ³nima a travÃ©s de herramientas como Google Analytics.</li>
          <li><strong>Cookies de Marketing (Publicidad):</strong> Se utilizan para rastrear a los visitantes a travÃ©s de las webs. La intenciÃ³n es mostrar anuncios que sean relevantes y atractivos para el usuario individual, como los proporcionados por la red de Google AdSense.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cookies de Terceros</h2>
        <p>
          AdemÃ¡s de nuestras propias cookies, tambiÃ©n utilizamos varias cookies de terceros para informar sobre las estadÃ­sticas de uso del sitio,
          entregar anuncios en y a travÃ©s del sitio, y asÃ­ sucesivamente:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google Analytics:</strong> Para medir el trÃ¡fico y el comportamiento de los usuarios en la web de forma agregada.</li>
          <li><strong>Google AdSense:</strong> Para mostrar anuncios relevantes basados en tus intereses y navegaciÃ³n previa.</li>
          <li><strong>Redes Sociales:</strong> Cookies integradas de Facebook y TikTok para permitir la carga correcta de contenidos externos.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Â¿CÃ³mo puedes controlar las cookies?</h2>
        <p>
          Puedes controlar y/o eliminar las cookies como desees; para mÃ¡s detalles, consulta <strong>aboutcookies.org</strong>.
          Puedes eliminar todas las cookies que ya estÃ¡n en tu computadora y puedes configurar la mayorÃ­a de los navegadores para evitar que se coloquen.
        </p>
        <p className="mt-4">
          Sin embargo, si haces esto, es posible que tengas que ajustar manualmente algunas preferencias cada vez que visites un sitio y que algunos servicios y funcionalidades no funcionen.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Actualizaciones de esta polÃ­tica</h2>
        <p>
          Es posible que actualicemos nuestra PolÃ­tica de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos
          o por otras razones operativas, legales o reglamentarias. Por lo tanto, te rogamos que visites esta PolÃ­tica de Cookies regularmente para
          mantenerte informado sobre nuestro uso de las mismas.
        </p>

        <div className="bg-gray-50 p-6 rounded-xl border mt-12">
          <h3 className="text-xl font-bold mb-3">Contacto</h3>
          <p>Si tienes alguna pregunta sobre nuestro uso de las cookies, envÃ­anos un correo electrÃ³nico a: <strong>contacto@atpdev.dev</strong></p>
        </div>
      </div>
    </div>
  )
}
