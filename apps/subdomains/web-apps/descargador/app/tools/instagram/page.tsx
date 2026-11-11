import InstagramDownloader from '@/components/platforms/InstagramDownloader'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Descargar Reels y Videos de Instagram en HD Online | Descargador Pro',
  description: 'Descarga videos, Reels, Stories públicas y audios de Instagram en alta definición (1080p Full HD). Rápido, 100% gratuito y sin necesidad de instalar apps.',
}

export default function InstagramToolPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cómo descargar Reels y videos de Instagram en alta definición",
    "description": "Guía paso a paso para guardar videos y Reels de Instagram en MP4 con Descargador Pro.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Copiar enlace del Reel o Video",
        "text": "Abre la aplicación de Instagram, presiona el icono de Compartir en el Reel o video y selecciona 'Copiar enlace'."
      },
      {
        "@type": "HowToStep",
        "name": "Pegar en Descargador Pro",
        "text": "Pega el enlace en el campo de búsqueda de la herramienta para Instagram."
      },
      {
        "@type": "HowToStep",
        "name": "Descargar en alta resolución",
        "text": "Haz clic en Buscar y luego selecciona Descargar Video para guardar el archivo MP4 en tu teléfono o PC."
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Es necesario iniciar sesión con mi cuenta de Instagram?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Descargador Pro jamás solicita tus credenciales, contraseñas ni acceso a tu cuenta. Solo requieres la URL pública del contenido."
        }
      },
      {
        "@type": "Question",
        "name": "¿Se pueden descargar fotos y carruseles además de Reels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, nuestra herramienta es compatible con publicaciones de video, Reels interactivos y carruseles públicos de Instagram."
        }
      },
      {
        "@type": "Question",
        "name": "¿En qué calidad se descargan los videos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El video se descarga en la máxima resolución original subida por el creador, habitualmente 1080p (Full HD) a 30 o 60 fps con audio estéreo sincronizado."
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Descargador</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-3 border border-pink-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instagram Reels & Video HD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Descargador de Instagram Reels y Videos
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Guarda Reels, videos de publicaciones y audios de Instagram en formato MP4 de alta resolución (1080p Full HD) de forma instantánea y anónima.
        </p>
      </div>

      {/* Tool Component */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
        <InstagramDownloader />
      </div>

      {/* Editorial Content */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            ¿Cómo guardar videos y Reels de Instagram en tu teléfono o PC?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Instagram es la vitrina visual más popular del mundo, pero su aplicación móvil no permite almacenar los videos directamente en la galería local sin marcas ni compresiones que arruinan la calidad. Con <strong>Descargador Pro</strong>, puedes respaldar tus propios recuerdos, material educativo, recetas o tutoriales en cuestión de segundos.
          </p>
        </div>

        {/* Pasos */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Pasos sencillos para descargar:
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Copia el enlace</strong>
              <p className="text-slate-500 dark:text-slate-400">En la app de Instagram, toca el icono de enviar (avión de papel) o los tres puntos y pulsa <em>Copiar enlace</em>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Pega la URL</strong>
              <p className="text-slate-500 dark:text-slate-400">Introduce la dirección copiada en el recuadro superior y presiona el botón <em>Buscar Video</em>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Guarda en tu dispositivo</strong>
              <p className="text-slate-500 dark:text-slate-400">Selecciona la calidad deseada (1080p Full HD o MP3) y el archivo se guardará directamente en tu carpeta de descargas.</p>
            </div>
          </div>
        </div>

        {/* Ventajas */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <h4>Extracción a 1080p</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Mantiene la nitidez, tasa de bits y colores originales de Instagram.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h4>100% Anónimo y Seguro</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Sin registro, sin cookies intrusivas y sin necesidad de vincular cuentas.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <h4>Multiplataforma</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Funciona en iPhone (Safari), Android (Chrome), Mac, Windows y Linux.</p>
          </div>
        </div>

        {/* Preguntas Frecuentes */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Preguntas Frecuentes sobre Instagram</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1">
                ¿Puedo descargar contenido de cuentas privadas?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Por políticas de privacidad y seguridad de la plataforma Meta, solo es posible procesar y descargar publicaciones, Reels y fotos de cuentas con visibilidad pública.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1">
                ¿Hay límite diario de descargas?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No. En Descargador Pro las descargas de Instagram son 100% gratuitas e ilimitadas para todos los usuarios.
              </p>
            </div>
          </div>
        </div>

        {/* Enlace a otras herramientas */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">¿Buscas guardar contenido de otras redes sociales?</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/tools/tiktok" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-500 hover:text-white transition-colors">
              TikTok Sin Marca
            </Link>
            <Link href="/tools/facebook" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
              Facebook HD
            </Link>
            <Link href="/tools/twitter" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors">
              Twitter / X Video
            </Link>
            <Link href="/tools/threads" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white transition-colors">
              Meta Threads
            </Link>
            <Link href="/tools/whatsapp" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-colors">
              Estados de WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

