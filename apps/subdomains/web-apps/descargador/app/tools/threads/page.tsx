import ThreadsDownloader from '@/components/platforms/ThreadsDownloader'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Descargar Videos de Threads de Meta en HD Online | Descargador Pro',
  description: 'Descarga videos, clips y fotos de Meta Threads en alta definición (1080p). Rápido, seguro, gratuito y sin necesidad de instalar programas adicionales.',
}

export default function ThreadsToolPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cómo descargar videos de Meta Threads en HD",
    "description": "Guía práctica para guardar videos de Threads en formato MP4 con Descargador Pro.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Copiar enlace de la publicación en Threads",
        "text": "En la aplicación o web de Threads, pulsa el icono de compartir en el post con video y selecciona 'Copiar enlace'."
      },
      {
        "@type": "HowToStep",
        "name": "Pegar en Descargador Pro",
        "text": "Pega la URL de threads.net en la herramienta especializada de Threads."
      },
      {
        "@type": "HowToStep",
        "name": "Descargar video",
        "text": "Pulsa Buscar Video y luego haz clic en Descargar MP4 para almacenarlo en tu dispositivo."
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Es compatible con los nuevos enlaces de threads.net?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, nuestro procesador está totalmente adaptado a la infraestructura de Meta Threads y analiza los enlaces de threads.net de manera nativa."
        }
      },
      {
        "@type": "Question",
        "name": "¿Se descargan los videos con audio incluido?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Por supuesto. Todos los videos de Threads se descargan como archivos MP4 completos con pista de audio estéreo perfectamente sincronizada."
        }
      }
    ]
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl py-6">
      <script
        id="threads-howto-schema"
        key="threads-howto-schema"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        id="threads-faq-schema"
        key="threads-faq-schema"
        type="application/ld+json"
        suppressHydrationWarning
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider mb-3 border border-slate-300 dark:border-slate-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Meta Threads Video</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Descargador de Videos de Threads
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Guarda videos y publicaciones multimedia de Meta Threads en formato MP4 Full HD de forma instantánea y confidencial.
        </p>
      </div>

      {/* Tool Component */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
        <ThreadsDownloader />
      </div>

      {/* Editorial Content */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Guarda contenido de Meta Threads sin complicaciones
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Threads de Instagram se ha consolidado como un canal dinámico para el intercambio de opiniones, anécdotas y videos virales. Al igual que otras plataformas del ecosistema Meta, no ofrece descarga directa de videos. <strong>Descargador Pro</strong> te brinda la herramienta ideal para respaldar contenido valioso con la mayor nitidez.
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
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Copia el enlace</strong>
              <p className="text-slate-500 dark:text-slate-400">En la app de Threads, toca Compartir en la publicación y selecciona <em>Copiar enlace</em>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Pega la URL</strong>
              <p className="text-slate-500 dark:text-slate-400">Pega el link en la casilla superior y pulsa <em>Buscar Video</em>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Descarga el MP4</strong>
              <p className="text-slate-500 dark:text-slate-400">Haz clic en Descargar y el archivo se transferirá a la memoria de tu dispositivo.</p>
            </div>
          </div>
        </div>

        {/* Ventajas */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <Zap className="w-4 h-4 text-purple-500" />
              <h4>Audio y Video Integrados</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Sincronización perfecta sin separación de pistas.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4>Privacidad Total</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">No registramos tu historial de descargas ni requerimos registro.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <h4>Optimizado para Móviles</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Descargas fluidas en navegadores Safari de iOS y Chrome en Android.</p>
          </div>
        </div>

        {/* Enlace a otras herramientas */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Descubre nuestras otras herramientas profesionales:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/tools/instagram" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-500 hover:text-white transition-colors">
              Instagram Reels
            </Link>
            <Link href="/tools/tiktok" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-600 hover:text-white transition-colors">
              TikTok Sin Marca
            </Link>
            <Link href="/tools/facebook" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
              Facebook HD
            </Link>
            <Link href="/tools/twitter" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors">
              Twitter / X Video
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

