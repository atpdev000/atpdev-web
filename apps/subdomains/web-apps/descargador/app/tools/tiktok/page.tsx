import TiktokDownloader from '@/components/platforms/TiktokDownloader'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Descargar Videos de TikTok Sin Marca de Agua | Online Gratis',
    description: 'Descarga videos de TikTok en HD sin marcas de agua ni logos. Rápido, fácil y totalmente online. Guarda tus TikToks favoritos en MP4 o MP3.',
}

export default function TiktokToolPage() {
    return (
        <div className="container mx-auto px-4 max-w-5xl">
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

            <div className="text-center mb-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TikTok HD Sin Marca</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    Descargador de TikTok Sin Marca de Agua
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    Obtén videos limpios de TikTok en alta definición y sin logos molestos, listo para editar o compartir.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
                <TiktokDownloader />
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        ¿Cómo descargar videos de TikTok sin marca de agua?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Con <strong>FTY Downloader Pro</strong>, puedes remover automáticamente la marca de agua flotante de TikTok para obtener el video original en la máxima resolución posible.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Instrucciones rápidas:
                    </h3>
                    <ul className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>1. Copia el enlace:</strong> En TikTok, pulsa Compartir y selecciona "Copiar enlace".
                        </li>
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>2. Pega en el descargador:</strong> Pega la URL en la barra y presiona Buscar Video.
                        </li>
                        <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong>3. Bájalo sin marca:</strong> Selecciona "Sin Marca de Agua - HD" o "Solo Audio (.mp3)".
                        </li>
                    </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">💎 Calidad Original</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Stream puro directamente de los servidores de TikTok.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">🎵 Extraer Audio MP3</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Guarda audios y pistas virales directamente.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">⚡ Rápido y Seguro</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Sin extensiones dudosas ni registros obligatorios.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
