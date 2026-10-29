import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { FEATURES } from '@/lib/featureFlags'

export const metadata: Metadata = {
    title: 'Respaldo de Video Digital | Herramienta de Gestión Multimedia ✅',
    description: 'Gestiona y respalda tus videos personales en la mejor calidad disponible. Rápido, seguro y profesional.',
}

import YoutubeDownloader from '@/components/platforms/YoutubeDownloader'

export default function YoutubeToolPage() {
    if (!FEATURES.YOUTUBE_ENABLED) {
        redirect('/')
    }
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Gestor de Respaldo Multimedia
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    La forma más potente de guardar y organizar tu contenido digital en alta definición.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                <YoutubeDownloader />
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-bold">Cómo guardar videos de Redes Sociales en HD y 4K</h2>
                <p>
                    Las plataformas digitales son la biblioteca de video más grande del planeta. Ya sea que necesites un tutorial para estudiar,
                    música para un evento o documentales para un viaje, <strong>FTY Downloader Pro</strong> te permite gestionar
                    tu contenido de forma eficiente y gratuita.
                </p>

                <h3 className="text-2xl font-semibold mt-8 mb-4">Tutorial Paso a Paso</h3>
                <ul className="space-y-4">
                    <li><strong>Copia la URL:</strong> En tu aplicación social, presiona "Compartir" y copia el enlace del video o usa la URL de la barra del navegador.</li>
                    <li><strong>Pega y Analiza:</strong> Coloca el enlace arriba. Nuestro motor especializado analizará todas las resoluciones disponibles del video (desde 144p hasta 4K).</li>
                    <li><strong>Elige el Formato:</strong> Puedes guardar el video completo en MP4 o solo el audio en MP3 de alta calidad.</li>
                </ul>

                <div className="bg-red-50 p-6 rounded-xl my-8 border-l-4 border-red-500">
                    <h4 className="font-bold text-red-800 mb-2">🚀 Soporte para Videos 4K</h4>
                    <p className="text-red-700 text-sm">
                        Nuestra herramienta soporta la tecnología DASH, permitiéndote gestionar videos en 1080p, 1440p y 4K.
                        Muchos otros gestores solo llegan a 720p; nosotros te damos la resolución máxima real del video original.
                    </p>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-bold">Por qué somos la mejor opción para Multimedia HD</h2>
                <div className="grid md:grid-cols-2 gap-8 not-prose">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🔊 Audio 320kbps</h4>
                        <p className="text-gray-600">Si buscas fidelidad de sonido, nuestro extractor de MP3 mantiene la mayor calidad de audio disponible en el origen.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🎞️ Múltiples Formatos</h4>
                        <p className="text-gray-600">Compatible con MP4, WEBM y MP3. Elige el que mejor se adapte a tu reproductor o dispositivo.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🚫 Sin Software Adicional</h4>
                        <p className="text-gray-600">No necesitas instalar plugins pesados ni software sospechoso. Todo ocurre en la nube de forma segura.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🌍 Soporte Global</h4>
                        <p className="text-gray-600">Nuestros servidores distribuidos garantizan una conexión rápida desde cualquier parte del mundo.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-12 mb-6 font-bold">FAQ sobre gestión multimedia</h2>
                <div className="space-y-6">
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Puedo gestionar listas de reproducción (Playlists)?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            Actualmente procesamos archivos de forma individual para garantizar la máxima velocidad. Estamos trabajando para implementar la gestión de listas completas próximamente.
                        </p>
                    </details>
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Es necesario registrarse?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            Absolutamente no. Queremos que la experiencia sea libre y abierta. No recopilamos correos electrónicos ni información privada.
                        </p>
                    </details>
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Por qué algunos archivos no cargan?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            Algunos contenidos pueden tener restricciones de derechos de autor muy estrictas o estar bloqueados regionalmente.
                            Si un archivo no procesa, intenta con otro enlace o verifica que sea público.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    )
}
