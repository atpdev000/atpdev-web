import TwitterDownloader from '@/components/platforms/TwitterDownloader'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Descargar Videos de Twitter / X en MP4 y GIF Online | Descargador Pro',
  description: 'Descarga videos de Twitter (X) y convierte GIFs a MP4 en alta resolución. Compatible con calidades 1080p, 720p y 480p. Rápido, gratis y sin registro.',
}

export default function TwitterToolPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cómo descargar videos de Twitter (X) en MP4",
    "description": "Pasos para guardar videos y clips de la red social X (Twitter) en alta definición con Descargador Pro.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Copiar URL del Tweet",
        "text": "Abre el tweet con el video o GIF en la app o web de X, toca el botón de compartir y selecciona 'Copiar enlace'."
      },
      {
        "@type": "HowToStep",
        "name": "Pegar en el analizador",
        "text": "Pega el enlace en el campo de búsqueda de Descargador Pro."
      },
      {
        "@type": "HowToStep",
        "name": "Seleccionar resolución y descargar",
        "text": "Elige la calidad deseada (1080p, 720p o 480p) y haz clic en Descargar MP4."
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Se pueden descargar los GIFs animados de Twitter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí. En Twitter los GIFs se reproducen técnicamente como bucles de video MP4. Nuestra herramienta los extrae en formato MP4 ligero y optimizado."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es compatible con enlaces de x.com y twitter.com?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, nuestro motor reconoce automáticamente tanto los enlaces antiguos con dominio twitter.com como los nuevos enlaces de x.com."
        }
      }
    ]
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Botón Volver */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Descargador</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-300 dark:border-slate-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Twitter / X Video & GIF</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Descargador de Videos de Twitter (X)
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Convierte y descarga videos de tweets, clips y animaciones de X en formato MP4 de alta velocidad y libre de marcas.
        </p>
      </div>

      {/* Tool Component */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
        <TwitterDownloader />
      </div>

      {/* Editorial Content */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            ¿Por qué usar Descargador Pro para videos de X (Twitter)?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            La plataforma X publica diariamente millones de noticias de última hora, conferencias y contenido audiovisual exclusivo. Sin embargo, no ofrece una opción de descarga directa en sus aplicaciones nativas. <strong>Descargador Pro</strong> te permite guardar estos archivos en su calidad nativa para reproducirlos sin conexión o mantener una copia de respaldo segura.
          </p>
        </div>

        {/* Pasos */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Pasos sencillos para descargar:
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Copia el Tweet</strong>
              <p className="text-slate-500 dark:text-slate-400">Presiona el botón de compartir del tweet y selecciona <em>Copiar enlace</em>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Pega en el buscador</strong>
              <p className="text-slate-500 dark:text-slate-400">Pega la URL de x.com o twitter.com en la caja de texto y pulsa <em>Buscar Video</em>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Guarda en MP4</strong>
              <p className="text-slate-500 dark:text-slate-400">Escoge tu resolución (HD 1080p, 720p o SD) y el video se descargará al instante.</p>
            </div>
          </div>
        </div>

        {/* Ventajas */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <Zap className="w-4 h-4 text-blue-500" />
              <h4>Procesamiento en Milisegundos</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Detección instantánea de múltiples tasas de bits.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4>Sin Software Adicional</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">No requiere instalar extensiones dudosas en tu navegador.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              <h4>Conversión de GIF</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Convierte bucles GIF de Twitter en MP4 compatibles con cualquier reproductor.</p>
          </div>
        </div>

        {/* Preguntas Frecuentes */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Preguntas Frecuentes sobre Twitter / X</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1">
                ¿Puedo descargar videos de cuentas protegidas / privadas de X?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No. Solo se pueden descargar contenidos de tweets públicos conforme a las políticas de seguridad de la API de X.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1">
                ¿El servicio guarda copias de mis descargas?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No. Nuestro motor procesa los flujos en tiempo real y el archivo se transmite directamente de los servidores de origen a tu navegador sin persistencia en nuestros discos.
              </p>
            </div>
          </div>
        </div>

        {/* Enlace a otras herramientas */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Explora otras redes sociales soportadas:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/tools/facebook" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
              Facebook HD
            </Link>
            <Link href="/tools/tiktok" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-500 hover:text-white transition-colors">
              TikTok Sin Marca
            </Link>
            <Link href="/tools/instagram" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white transition-colors">
              Instagram Reels
            </Link>
            <Link href="/tools/threads" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors">
              Meta Threads
            </Link>
            <Link href="/tools/whatsapp" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-colors">
              WhatsApp Estados
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

