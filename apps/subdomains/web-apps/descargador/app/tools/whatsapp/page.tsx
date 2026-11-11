import WhatsappStatusDownloader from '@/components/platforms/WhatsappStatusDownloader'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, HelpCircle, Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Guardar Estados de WhatsApp en HD | Fotos y Videos | Descargador Pro',
  description: 'Guarda fotos y videos de estados de WhatsApp en alta definición sin capturas de pantalla borrosas. Guía completa y herramienta online y para app Android.',
}

export default function WhatsappToolPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cómo guardar estados de WhatsApp en alta calidad",
    "description": "Pasos para guardar estados de fotos y videos de WhatsApp en Android y PC con Descargador Pro.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Ver el estado en WhatsApp",
        "text": "Abre WhatsApp en tu teléfono y visualiza el estado completo de tu contacto (foto o video)."
      },
      {
        "@type": "HowToStep",
        "name": "Abrir Descargador Pro",
        "text": "Ingresa a Descargador Pro o usa nuestra app oficial de Android."
      },
      {
        "@type": "HowToStep",
        "name": "Guardar en la galería",
        "text": "Selecciona el estado visualizado y guárdalo en tu galería en resolución original sin compresión."
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Se entera la otra persona si guardo su estado?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Guardar el estado no envía ninguna alerta, notificación ni registro adicional a tu contacto."
        }
      },
      {
        "@type": "Question",
        "name": "¿Por qué los estados desaparecen a las 24 horas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es el ciclo de vida diseñado por WhatsApp. Descargador Pro te permite respaldar aquellos estados importantes antes de que se borren automáticamente."
        }
      }
    ]
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl py-6">
      <script
        id="whatsapp-howto-schema"
        key="whatsapp-howto-schema"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        id="whatsapp-faq-schema"
        key="whatsapp-faq-schema"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Botón Volver */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Descargador</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/20">
          <Smartphone className="w-3.5 h-3.5" />
          <span>WhatsApp Estados HD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Guardar Estados de WhatsApp
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Respalda fotos y videos de estados vistos en WhatsApp con su resolución y nitidez original sin avisos ni capturas recortadas.
        </p>
      </div>

      {/* Tool Component */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
        <WhatsappStatusDownloader />
      </div>

      {/* Editorial Content */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            ¿Cómo guardar estados de WhatsApp sin perder calidad?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Hacer captura de pantalla o grabar la pantalla del móvil destruye la resolución original del video o foto, mostrando barras negras, controles de reproducción e íconos molestos. Con <strong>Descargador Pro</strong> accedes al archivo limpio tal cual fue enviado a la red social, garantizando fidelidad total.
          </p>
        </div>

        {/* Pasos */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Métodos recomendados para guardar estados:
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Mira el estado</strong>
              <p className="text-slate-500 dark:text-slate-400">Abre WhatsApp en tu smartphone y reproduce el estado que deseas guardar para que se descargue en caché temporal.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Usa la App Android APK</strong>
              <p className="text-slate-500 dark:text-slate-400">Nuestra app oficial de Descargador Pro detecta automáticamente los estados almacenados localmente en tu móvil.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 dark:text-slate-100 font-semibold">Guarda con 1 toque</strong>
              <p className="text-slate-500 dark:text-slate-400">Presiona el botón de guardar y el video o foto pasará de inmediato a tu galería permanente.</p>
            </div>
          </div>
        </div>

        {/* Ventajas */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <h4>Cero Compresión</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Sin re-compresión de pantalla ni pérdida de colores.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h4>100% Discreto</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Nadie sabrá que guardaste su estado en tu teléfono.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <h4>Fotos y Videos</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Compatible tanto con imágenes JPEG/PNG como con videos MP4.</p>
          </div>
        </div>

        {/* Enlace a otras herramientas */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Conoce todas nuestras herramientas de descarga:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/tools/tiktok" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-500 hover:text-white transition-colors">
              TikTok Sin Marca
            </Link>
            <Link href="/tools/instagram" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white transition-colors">
              Instagram Reels
            </Link>
            <Link href="/tools/facebook" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
              Facebook HD
            </Link>
            <Link href="/tools/twitter" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors">
              Twitter / X Video
            </Link>
            <Link href="/tools/threads" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-700 hover:text-white transition-colors">
              Meta Threads
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

