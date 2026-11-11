import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { FEATURES } from '@/lib/featureFlags'
import YoutubeDownloader from '@/components/platforms/YoutubeDownloader'
import { getSubdomainConfig } from '@atpdev/database'

export const metadata: Metadata = {
    title: 'Descargar Videos de YouTube en HD y MP3 | Descargador Pro',
    description: 'Gestiona y respalda videos de YouTube en la mejor calidad disponible (1080p, 4K y MP3). Rápido, seguro y profesional.',
}

export default function YoutubeToolPage() {
    let isEnabled = false
    try {
        const config = getSubdomainConfig('descargador')
        isEnabled = config?.modules?.youtube_enabled ?? FEATURES.YOUTUBE_ENABLED
    } catch {
        isEnabled = FEATURES.YOUTUBE_ENABLED
    }

    if (!isEnabled) {
        redirect('/')
    }

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Cómo descargar videos y audios de YouTube en HD y MP3",
        "description": "Pasos para descargar videos de YouTube en 1080p Full HD o extraer música en MP3 con Descargador Pro.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Copiar URL del video",
                "text": "Abre YouTube, ve al video y copia la URL desde la barra de direcciones o el botón Compartir."
            },
            {
                "@type": "HowToStep",
                "name": "Pegar en Descargador Pro",
                "text": "Pega la URL en la barra de búsqueda de la herramienta de YouTube."
            },
            {
                "@type": "HowToStep",
                "name": "Elegir formato y guardar",
                "text": "Selecciona si deseas descargar el video en HD (MP4) o solo la pista de audio (MP3)."
            }
        ]
    }

    return (
        <div className="container mx-auto px-4 max-w-5xl">
            <script
                id="youtube-howto-schema"
                key="youtube-howto-schema"
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            {/* Botón Volver */}
            <div className="mb-6">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver al Descargador</span>
                </Link>
            </div>

            <div className="text-center mb-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>YouTube HD & MP3</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    Descargador de Videos de YouTube
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    Guarda videos de YouTube en MP4 de alta resolución (1080p y 4K) o extrae el audio en formato MP3 de alta fidelidad.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
                <YoutubeDownloader />
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        ¿Cómo descargar videos de YouTube en HD?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Con <strong>Descargador Pro</strong>, puedes procesar enlaces de videos largos, Shorts y transmisiones finalizadas para verlos sin conexión en cualquier dispositivo.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Pasos para descargar:
                    </h3>
                    <ul className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>1. Copia el enlace:</strong> Presiona Compartir en YouTube y copia el link del video.
                        </li>
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>2. Pega y procesa:</strong> Pega la URL en el buscador y pulsa Buscar Video.
                        </li>
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>3. Elige formato:</strong> Selecciona 1080p, 720p o Audio MP3 para descargar.
                        </li>
                    </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">🔊 Audio MP3 320kbps</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Excelente fidelidad para música, podcasts y audiolibros.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">📺 1080p y 4K</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Soporte con combinador nativo MediaMuxer en móvil.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">📱 Visualizador Integrado</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Reproduce tus descargas directamente desde el historial.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

