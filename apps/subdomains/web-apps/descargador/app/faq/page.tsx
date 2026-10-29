import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes (FAQ) - FTY Downloader Pro',
  description: 'Resuelve tus dudas sobre cómo descargar videos de redes sociales, seguridad del sitio, formatos compatibles y soporte técnico de FTY Downloader Pro.',
}

export default function FAQPage() {
  const faqs = [
    {
      question: "¿Es realmente gratuito FTY Downloader Pro?",
      answer: "Sí, el servicio de FTY Downloader Pro es 100% gratuito para todos los usuarios. No existen cuotas de suscripción, funciones premium bloqueadas tras muros de pago, ni límites en el número de descargas que puedes realizar. Nuestra plataforma se financia exclusivamente a través de publicidad discreta en el sitio web, lo que nos permite mantener nuestros servidores activos y seguir mejorando la herramienta sin costo para los creadores de contenido."
    },
    {
      question: "¿Qué plataformas y redes sociales son compatibles?",
      answer: "Actualmente, nuestra herramienta es totalmente compatible con Facebook (incluyendo Reels y videos normales), TikTok (con la opción de descarga sin marca de agua) e Instagram. Estamos constantemente monitoreando los cambios en las redes sociales para asegurar que nuestro servicio nunca se interrumpa."
    },
    {
      question: "¿Cómo garantizan la calidad de los videos descargados?",
      answer: "FTY Downloader utiliza tecnología de extracción directa. Esto significa que nuestro sistema analiza los metadatos del video original y descarga directamente el archivo fuente que la plataforma utiliza para el streaming. No comprimimos ni recodificamos el video durante el proceso, por lo que recibirás exactamente la misma calidad que el video original tiene disponible, desde resoluciones estándar (480p) hasta Alta Definición (1080p Full HD)."
    },
    {
      question: "¿Puedo extraer música o audio MP3 de mis videos?",
      answer: "Absolutamente. Contamos con un motor de conversión de audio integrado. Al pegar un enlace, tienes la opción de elegir 'Sólo Audio'. Nuestro sistema extraerá la pista de audio original y la convertirá a formato MP3 de alta compatibilidad. Dependiendo de la fuente original, ofrecemos bitrates de hasta 320kbps, lo cual es ideal para podcasts, conferencias o música que desees escuchar sin conexión en cualquier reproductor multimedia."
    },
    {
      question: "¿Es seguro para mi dispositivo usar este sitio?",
      answer: "La seguridad es nuestro pilar fundamental. A diferencia de otros descargadores que te obligan a instalar extensiones de navegador sospechosas o software ejecutable que puede contener malware, FTY Downloader Pro funciona íntegramente de forma web. Todo el procesamiento se realiza en nuestros servidores seguros. Además, utilizamos certificados SSL para cifrar tu conexión y no requerimos registro, lo que significa que no recolectamos datos personales ni correos electrónicos que puedan ser vulnerados."
    },
    {
      question: "¿Cómo descargo videos en dispositivos iPhone o Android?",
      answer: "Nuestra web es completamente 'Mobile-First'. En Android, simplemente usa el navegador Chrome; la descarga irá directamente a tu carpeta de 'Downloads'. En dispositivos Apple con iOS (iPhone/iPad), recomendamos usar el navegador Safari. Debido a las políticas de iOS, al presionar el botón de descarga, Safari te preguntará si quieres descargar el archivo. Una vez completado, podrás encontrarlo en la aplicación predeterminada 'Archivos' (Files) de Apple, desde donde podrás guardarlo en tu carrete o compartirlo."
    },
    {
      question: "¿Necesito registrarme o crear una cuenta?",
      answer: "No. Creemos que la libertad es esencial para la creatividad. Puedes usar todas las funciones de FTY Downloader Pro de forma anónima. No te pediremos tu nombre, correo electrónico, ni vinculación con cuentas de redes sociales. Esto no solo hace el proceso más rápido (pegar y descargar), sino que protege tu privacidad digital al evitar que tus hábitos de consumo de contenido sean rastreados o vendidos a terceros."
    },
    {
      question: "¿Por qué a veces recibo un mensaje de error al intentar descargar?",
      answer: "Existen tres razones principales para esto: 1) El video es Privado o Privado para amigos, por lo que nuestros servidores no pueden 'verlo'. 2) El video tiene restricciones geográficas (solo visible en ciertos países). 3) El video ha sido eliminado o la URL está mal escrita. Si estás seguro de que el video es público y accesible, intenta actualizar la página y pegar el enlace nuevamente. Si el problema persiste, puedes reportarlo a través de nuestra página de contacto."
    },
    {
      question: "¿Existe algún límite en la duración de los videos?",
      answer: "No imponemos límites técnicos estrictos en la duración del video. Sin embargo, videos extremadamente largos (por ejemplo, transmisiones en vivo de 10 horas) pueden tardar significativamente más en procesarse y descargarse debido al tamaño masivo del archivo. Para videos estándar, tutoriales y música, el procesamiento es casi instantáneo."
    },
    {
      question: "¿Puedo descargar transmisiones en vivo?",
      answer: "Puedes descargar cualquier transmisión en vivo (Live Stream) una vez que esta haya finalizado y haya sido publicada como un video permanente por el creador. No es posible realizar descargas de transmisiones que se están emitiendo en tiempo real por razones técnicas y de latencia del servidor."
    },
    {
      question: "¿Cuál es el formato de archivo final?",
      answer: "El formato estándar de salida para video es MP4, el cual es el más compatible del mercado actual (funciona en Smart TVs, móviles y todos los sistemas operativos). Para audio, el formato estándar es MP3. En algunos casos avanzados, el sistema podría ofrecer otros formatos de alta fidelidad compatibles con dispositivos modernos."
    },
    {
      question: "¿Qué debo hacer si la descarga no comienza automáticamente?",
      answer: "En el 99% de los casos, la descarga comienza tras presionar el botón de confirmación. Si por alguna razón tu navegador lo abre como una visualización en lugar de descargar (sucede a veces en navegadores móviles antiguos), simplemente mantén presionado el video y selecciona 'Guardar Video Como...' o 'Descargar Vínculo'. Así forzarás el guardado en tu almacenamiento local."
    },
    {
      question: "¿Cómo funciona la descarga de Reels de Instagram en alta calidad?",
      answer: "Nuestro sistema para Instagram Reels utiliza una API de extracción de metadatos optimizada para 2026. Al pegar la URL del Reel, FTY Downloader Pro identifica el servidor CDN de Meta que contiene el archivo original sin compresión adicional. Esto nos permite ofrecerte la descarga en la resolución nativa en la que fue subido por el creador, usualmente 1080p con un bitrate optimizado. Es el método más fiable para creadores que necesitan republicar su propio contenido en otras plataformas manteniendo la fidelidad visual que Instagram exige."
    },
    {
      question: "¿Puedo descargar videos de cuentas privadas?",
      answer: "Por razones de seguridad técnica y respeto a la privacidad de los usuarios, FTY Downloader Pro solo puede procesar contenido que esté configurado como 'Público'. Si un video está restringido a 'Amigos' o es de una cuenta privada, nuestras herramientas no pueden acceder a los servidores de la plataforma para extraer el archivo. Esto garantiza que nuestro servicio no sea utilizado de forma malintencionada para vulnerar la privacidad de las personas en las redes sociales."
    },
    {
      question: "¿Qué es FTY Downloader Pro y en qué se diferencia de otros?",
      answer: "FTY Downloader Pro es una suite de herramientas de nueva generación diseñada específicamente para la economía de los creadores en 2026. A diferencia de los descargadores genéricos que están plagados de anuncios invasivos y malware, nosotros priorizamos una experiencia de usuario 'limpia' y ultrarrápida. Utilizamos balanceadores de carga globales que aseguran que tus descargas siempre se realicen desde el servidor más cercano a tu ubicación, reduciendo la latencia y maximizando tu ancho de banda disponible."
    },
    {
      question: "¿Cómo reportar errores o sugerir nuevas plataformas?",
      answer: "Valoramos enormemente el feedback de nuestra comunidad. Si encuentras un enlace que no funciona o tienes una sugerencia para incluir plataformas como YouTube, LinkedIn o Pinterest, puedes usar nuestro formulario de contacto oficial. Nuestro equipo de ingenieros revisa los reportes diariamente y suele implementar correcciones para errores de red sociales en menos de 24 horas, asegurando que FTY Downloader Pro sea siempre la herramienta más actualizada del mercado."
    },
    {
      question: "¿Cumplen con las normativas de derechos de autor?",
      answer: "FTY Downloader Pro es una herramienta neutral diseñada para el uso personal y profesional legítimo. Alentamos a todos nuestros usuarios a respetar los derechos de propiedad intelectual de los autores originales. La descarga de contenido debe realizarse bajo el principio de 'fair use' (uso justo) o con el permiso explícito del creador de contenido. Nuestra plataforma no promueve la piratería ni la distribución ilegal de material protegido por copyright, siendo responsabilidad del usuario el uso final que se le dé a los archivos descargados."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Preguntas Frecuentes</h1>
        <p className="text-xl text-gray-600">
          Todo lo que necesitas saber sobre FTY Downloader Pro, seguridad y privacidad.
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-start">
              <span className="text-blue-500 mr-4 font-serif">Q.</span>
              {faq.question}
            </h3>
            <div className="pl-9 border-l-2 border-blue-50 ml-2">
              <p className="text-gray-700 leading-relaxed text-lg">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de contacto adicional */}
      <div className="mt-20 text-center bg-blue-600 text-white p-12 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6">¿Aún tienes dudas técnicas?</h2>
        <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
          Nuestro equipo de soporte técnico está disponible para ayudarte a resolver cualquier inconveniente con tus descargas.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="/contact"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 font-bold transition-colors shadow-lg"
          >
            Contactar Soporte
          </a>
          <a
            href="/"
            className="bg-blue-500 text-white border border-blue-400 px-8 py-4 rounded-xl hover:bg-blue-400 font-bold transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  )
}