import TiktokDownloader from '@/components/platforms/TiktokDownloader'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Descargar Videos de TikTok Sin Marca de Agua | Online Gratis',
    description: 'Descarga videos de TikTok en HD sin marcas de agua. Rápido, fácil y totalmente online. Guarda tus TikToks favoritos en MP4 sin logos.',
}

export default function TiktokToolPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Descargador de TikTok Sin Marca de Agua
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Obtén videos limpios de TikTok en alta definición y sin los molestos logos.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                <TiktokDownloader />
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-bold">Cómo descargar de TikTok sin logo en 3 pasos</h2>
                <p>
                    TikTok es la red social del momento para contenido creativo, pero si quieres resubir tus propios videos o simplemente guardarlos
                    sin la marca de agua que se mueve por la pantalla, necesitas una herramienta especializada. <strong>FTY Downloader Pro</strong>
                    es la solución más confiable para obtener el video original.
                </p>

                <h3 className="text-2xl font-semibold mt-8 mb-4">Instrucciones Detalladas</h3>
                <ol className="space-y-4">
                    <li><strong>Consigue el enlace:</strong> Abre TikTok, ve al video, presiona el botón "Compartir" (la flecha) y selecciona "Copiar enlace".</li>
                    <li><strong>Procesa el video:</strong> Pega el enlace en la parte superior de esta página y presiona el botón de descarga.</li>
                    <li><strong>Bájalo a tu móvil/PC:</strong> Elige la opción "Sin Marca de Agua" y el archivo se guardará automáticamente en tu dispositivo.</li>
                </ol>

                <div className="bg-pink-50 p-6 rounded-xl my-8 border-l-4 border-pink-500">
                    <h4 className="font-bold text-pink-800 mb-2">✨ ¿Por qué descargar sin marca de agua?</h4>
                    <p className="text-pink-700 text-sm">
                        La marca de agua de TikTok oculta partes del video y puede ser una distracción. Al descargar el video "limpio",
                        obtienes una mejor visualización y es ideal para presentaciones o colecciones personales de mayor calidad.
                    </p>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-bold">Ventajas de usar FTY Downloader para TikTok</h2>
                <div className="grid md:grid-cols-2 gap-8 not-prose">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">💎 Calidad Original</h4>
                        <p className="text-gray-600">No recomprimimos el video. Te entregamos exactamente el mismo archivo que el creador subió a la plataforma.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🎵 Extracción de Audio MP3</h4>
                        <p className="text-gray-600">¿Solo te gusta la música o el audio viral? También puedes elegir bajar solo la pista de sonido en MP3.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">🆓 100% Gratuito siempre</h4>
                        <p className="text-gray-600">Nada de suscripciones ni pagos ocultos. Nuestra herramienta se mantiene gracias a anuncios discretos.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">⚡ Proceso en segundos</h4>
                        <p className="text-gray-600">Nuestra infraestructura escalable permite que el análisis y la descarga sean casi instantáneos.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-12 mb-6">Preguntas frecuentes - TikTok Downloader</h2>
                <div className="space-y-6">
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Funciona en iPhone (iOS)?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            Sí, pero por políticas de Apple debes usar <strong>Safari</strong>. Al presionar descargar, Safari te preguntará y el archivo irá a tu carpeta de "Descargas" en la app Files.
                        </p>
                    </details>
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Tengo que instalar alguna App?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            No es necesario. Todo el proceso es basado en web, lo que significa que ahorras espacio en tu memoria y proteges tu seguridad.
                        </p>
                    </details>
                    <details className="group border-b pb-4">
                        <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                            ¿Es legal descargar videos de TikTok?
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-600">
                            Es legal para uso personal, educativo o bajo licencias de Creative Commons. Siempre recomendamos dar crédito al autor original si decides compartir el contenido.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    )
}
