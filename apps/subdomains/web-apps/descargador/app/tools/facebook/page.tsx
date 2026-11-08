import FacebookDownloader from '@/components/platforms/FacebookDownloader'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Descargar Videos de Facebook HD Online | Gratis y Rápido',
    description: 'La mejor herramienta para descargar videos de Facebook, Reels y videos públicos en alta definición (1080p HD). Rápido, gratuito y sin registro.',
}

export default function FacebookToolPage() {
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Cómo descargar videos de Facebook en HD gratis",
        "description": "Pasos para descargar videos y Reels de Facebook en alta definición (1080p HD) con Descargador Pro.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Copiar enlace",
                "text": "Abre Facebook, toca Compartir en el video o Reel y selecciona 'Copiar enlace'."
            },
            {
                "@type": "HowToStep",
                "name": "Pegar URL",
                "text": "Pega el enlace en el campo de búsqueda de Descargador Pro."
            },
            {
                "@type": "HowToStep",
                "name": "Descargar video",
                "text": "Selecciona la calidad deseada (1080p HD o SD) y descarga el archivo MP4."
            }
        ]
    }

    return (
        <div className="container mx-auto px-4 max-w-5xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            {/* Botón Volver */}
            <div className="mb-6">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver al Descargador</span>
                </Link>
            </div>

            <div className="text-center mb-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Facebook HD & Reels</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    Descargador de Videos de Facebook
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    Obtén tus videos y Reels de Facebook en MP4 y alta resolución (1080p Full HD) al instante.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
                <FacebookDownloader />
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        ¿Cómo descargar videos de Facebook gratis?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Facebook es una de las mayores plataformas de video del mundo. Con <strong>Descargador Pro</strong>, puedes guardar videos y Reels para verlos sin conexión o respaldar tus publicaciones sin perder calidad.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Pasos sencillos para descargar:
                    </h3>
                    <ul className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>1. Copia la URL:</strong> Haz clic en Compartir y selecciona "Copiar enlace".
                        </li>
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>2. Pega en el buscador:</strong> Pega el enlace en la barra de arriba y pulsa Buscar.
                        </li>
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>3. Elige tu calidad:</strong> Selecciona HD (1080p), SD o Audio MP3 y guarda el archivo.
                        </li>
                    </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">🚀 Alta Velocidad</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Extracción directa sin intermediarios lentos.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">🎬 Soporte para Reels</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Descarga videos verticales con audio sincronizado.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">📱 Móvil y PC</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Compatible con Android, iPhone, Windows y Mac.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

