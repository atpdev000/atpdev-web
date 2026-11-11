import { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, ArrowLeft, MessageSquare, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes (FAQ) - Descargador Pro',
  description: 'Resuelve tus dudas sobre cómo descargar videos de redes sociales, formatos compatibles, calidad 1080p, audio MP3 y seguridad.',
}

export default function FAQPage() {
  const faqs = [
    {
      question: "¿Es realmente gratuito Descargador Pro?",
      answer: "Sí, el servicio de Descargador Pro ofrece descargas gratuitas ilimitadas. Nuestra plataforma se financia a través de publicidad no intrusiva y planes opcionales Premium para quienes desean descargas por lotes, velocidad prioritaria y 100% sin anuncios."
    },
    {
      question: "¿Qué plataformas y redes sociales son compatibles?",
      answer: "Nuestra suite es totalmente compatible con Facebook (incluyendo Reels y videos 1080p), TikTok (sin marca de agua y audio MP3), YouTube (video HD y extracción de música), Instagram (Reels y videos), Threads, Twitter / 𝕏 y estados de WhatsApp. Monitoreamos continuamente las plataformas para que las descargas nunca se interrumpan."
    },
    {
      question: "¿Cómo garantizan la calidad de los videos descargados?",
      answer: "Descargador Pro utiliza tecnología de extracción directa de flujo. Analizamos los metadatos de la publicación y conectamos directamente con el flujo fuente original que la red social utiliza para el streaming, entregando la máxima resolución disponible (720p, 1080p Full HD y calidades superiores sin compresión destructiva)."
    },
    {
      question: "¿Puedo extraer audio MP3 de cualquier video?",
      answer: "Sí. Contamos con un motor nativo de extracción de audio. Al procesar un enlace en YouTube, TikTok o Facebook, puedes seleccionar 'Sólo Audio' para obtener el archivo MP3 o M4A directamente en tu biblioteca de música."
    },
    {
      question: "¿Es seguro para mi dispositivo usar este sitio o la app?",
      answer: "Totalmente seguro. No requerimos que instales extensiones sospechosas ni software con publicidad invasiva. Toda la transmisión está cifrada bajo HTTPS con certificados SSL y seguimos las directrices de privacidad más estrictas: no recopilamos datos personales ni vendemos tu información a terceros."
    },
    {
      question: "¿Cómo descargo en teléfonos Android o iPhone?",
      answer: "En Android (web o app), la descarga se guarda automáticamente en tu Galería de videos o en la carpeta Downloads/DescargadorPro. En dispositivos Apple con iOS (iPhone/iPad), Safari te preguntará si deseas descargar el archivo, guardándose de inmediato en la aplicación predeterminada 'Archivos' (Files), desde donde podrás compartirlo a WhatsApp o guardarlo en tu Carrete."
    },
    {
      question: "¿Necesito registrarme o crear una cuenta?",
      answer: "No. Puedes usar todas las funciones básicas de Descargador Pro de forma completamente anónima. No solicitamos correos electrónicos obligatorios, contraseñas ni vinculación con tus cuentas de redes sociales."
    },
    {
      question: "¿Por qué a veces recibo un error al intentar procesar un enlace?",
      answer: "Las causas más frecuentes son: 1) El video es Privado o solo para amigos. 2) El video tiene restricciones de edad o geográficas. 3) El enlace fue borrado o copiado de forma incompleta. Asegúrate de que el video sea público y que el enlace esté completo."
    },
    {
      question: "¿Puedo reproducir mis videos descargados dentro de la app?",
      answer: "¡Sí! En el botón del reloj (Historial) encontrarás un reproductor integrado a pantalla completa similar al visor de WhatsApp, con opciones para ver el video, escuchar el audio, compartirlo directamente o abrirlo en reproductores externos (VLC, Google Fotos, etc.)."
    },
    {
      question: "¿Cumplen con las normativas de derechos de autor?",
      answer: "Descargador Pro es una herramienta neutral diseñada para la gestión y copia de seguridad de contenido propio o bajo excepciones de Uso Justo (Fair Use) para fines educativos, de crítica o comentario. Respetamos rigurosamente los derechos de propiedad intelectual y contamos con un procedimiento ágil de notificación DMCA."
    }
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Schema.org FAQPage para Rich Snippets en Google */}
      <script
        id="faq-page-schema"
        key="faq-page-schema"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Encabezado */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Descargador</span>
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Preguntas Frecuentes
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Todo lo que necesitas saber sobre descargas, formatos compatibles, calidad y seguridad en Descargador Pro.
        </p>
      </div>

      {/* Lista de FAQs */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40 transition-colors"
          >
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2.5">
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">Q.</span>
              <span>{faq.question}</span>
            </h3>
            <div className="pl-6 border-l-2 border-blue-500/20 dark:border-blue-500/30 ml-1">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjeta de soporte final */}
      <div className="mt-12 text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/10 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">¿Tienes alguna duda técnica puntual?</h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto opacity-90 leading-relaxed">
          Nuestro equipo de soporte técnico responde a tus consultas sobre enlaces o compatibilidad en menos de 24 horas hábiles.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-colors"
          >
            Contactar a Soporte
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-blue-500/40 border border-white/20 text-white font-bold text-xs sm:text-sm hover:bg-blue-500/60 transition-colors"
          >
            Ir al Descargador
          </Link>
        </div>
      </div>
    </div>
  )
}
