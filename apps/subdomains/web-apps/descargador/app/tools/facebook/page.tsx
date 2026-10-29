import FacebookDownloader from '@/components/platforms/FacebookDownloader'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Descargar Videos de Facebook HD Online | Gratis y Rápido',
    description: 'La mejor herramienta para descargar videos de Facebook, Reels y videos privados en alta definición (HD). Rápido, gratuito y sin registro.',
}

export default function FacebookToolPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Descargador de Videos de Facebook
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Obtén tus videos favoritos de Facebook en MP4 y alta resolución al instante.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                <FacebookDownloader />
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Cómo descargar videos de Facebook gratis?</h2>
                <p>
                    Facebook se ha convertido en una de las mayores plataformas de video del mundo, con contenidos que van desde
                    tutoriales educativos hasta entretenimiento viral. Sin embargo, guardarlos para verlos sin conexión no siempre es intuitivo.
                    En <strong>FTY Downloader Pro</strong>, hemos simplificado este proceso para que puedas tener tus videos en segundos.
                </p>

                <h3 className="text-2xl font-semibold mt-8 mb-4">Pasos para descargar videos de Facebook en 2026</h3>
                <ul className="space-y-4">
                    <li><strong>Copia la URL:</strong> Ve al video de Facebook que deseas bajar. Haz clic en el botón "Compartir" y luego en "Copiar enlace".</li>
                    <li><strong>Pega en FTY:</strong> Regresa a esta página y pega la dirección en el cuadro de arriba.</li>
                    <li><strong>Analiza y Descarga:</strong> Haz clic en el botón de descarga. Nuestro sistema detectará automáticamente si hay versiones en Standard Quality (SD) o High Definition (HD).</li>
                </ul>

                <div className="bg-blue-50 p-6 rounded-xl my-8 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-800 mb-2">💡 Nota sobre la Calidad HD</h4>
                    <p className="text-blue-700 text-sm">
                        No todos los videos de Facebook están disponibles en HD. Si el creador original no subió el video en alta resolución,
                        nuestra herramienta solo podrá ofrecerte la calidad estándar disponible en los servidores de Meta.
                    </p>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-bold">Características de nuestro descargador de Facebook</h2>
                <div className="grid md:grid-cols-2 gap-8 not-prose">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🚀 Velocidad Ultrarrápida</h4>
                        <p className="text-gray-600">Nuestros servidores están optimizados para procesar los enlaces de Facebook en milisegundos, garantizando que no pierdas tiempo esperando.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🎬 Soporte para Reels</h4>
                        <p className="text-gray-600">No solo videos largos; también puedes descargar los Reels de Facebook con la misma facilidad y calidad.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">📱 Compatible con móviles</h4>
                        <p className="text-gray-600">Funciona perfectamente en Android y iOS usando tu navegador favorito (Chrome, Safari, Firefox).</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🔒 Privacidad Total</h4>
                        <p className="text-gray-600">No guardamos registro de lo que descargas ni solicitamos datos personales. Tu navegación es 100% anónima.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-12 mb-6">Preguntas frecuentes sobre descargas de Facebook</h2>
                <div className="space-y-6">
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Puedo descargar videos privados de Facebook?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            Nuestra herramienta estándar funciona con videos públicos. Para videos privados, el sistema requiere acceso a los datos de la sesión,
                            lo cual no proporcionamos actualmente para priorizar la seguridad de tu cuenta.
                        </p>
                    </details>
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿En qué formato se guardan los videos?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            Todos los videos se descargan en formato .MP4, que es el estándar de la industria y compatible con prácticamente cualquier dispositivo moderno.
                        </p>
                    </details>
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Hay algún límite diario?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            No, puedes descargar tantos videos como desees. Nuestro servicio es ilimitado y gratuito para todos los usuarios.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    )
}
