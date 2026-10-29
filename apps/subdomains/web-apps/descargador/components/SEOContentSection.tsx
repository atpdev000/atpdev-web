
import React from 'react'

export default function SEOContentSection() {
    return (
        <div className="prose prose-lg max-w-4xl mx-auto text-gray-700 space-y-16">

            {/* SECCIÓN 1: INTRODUCCIÓN EXTENSA & AUTORIDAD */}
            <section>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                    La Solución Profesional para Descargas Multimedia
                </h2>
                <p className="text-xl leading-relaxed text-gray-600 mb-6">
                    Bienvenido a <strong>FTY Downloader Pro</strong>, la herramienta de archivado digital líder en la web.
                    En un mundo donde el contenido es efímero, nuestra misión es permitirte preservar videos educativos,
                    tutoriales técnicos, momentos inspiradores y entretenimiento de alta calidad de forma permanente en tus dispositivos.
                </p>
                <p className="mb-4">
                    A diferencia de otros descargadores básicos, FTY utiliza algoritmos de procesamiento avanzados que analizan el flujo de datos original.
                    Esto nos permite extraer el archivo "fuente" (source file) sin recodificación, garantizando que el video que guardas es bit-por-bit idéntico
                    a la máxima calidad disponible en el servidor de origen, ya sea <strong>Full HD (1080p)</strong> o incluso <strong>Ultra HD (4K)</strong>.
                </p>
            </section>

            {/* SECCIÓN 2: GUÍAS DETALLADAS POR PLATAFORMA (CONTENIDO VALIOSO) */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Guías Avanzadas de Descarga Paso a Paso</h2>

                <div className="space-y-12">
                    {/* Facebook Guide */}
                    <article>
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                            <span className="mr-2">📘</span> Cómo descargar videos de Facebook en HD
                        </h3>
                        <p className="mb-4">
                            Facebook comprime los videos para ahorrar datos, pero a menudo guarda una versión de alta definición (HD) en sus servidores.
                            Sigue estos pasos para asegurarte de obtener la mejor versión:
                        </p>
                        <ol className="list-decimal pl-6 space-y-3 marker:text-blue-600 marker:font-bold">
                            <li><strong>Localiza el video:</strong> Abre la aplicación de Facebook o navega en tu PC. Si es un Reel, ábrelo en pantalla completa.</li>
                            <li><strong>Obtén el enlace limpio:</strong> Haz clic en los tres puntos (...) o en "Compartir" y selecciona "Copiar enlace". Evita copiar la URL del navegador si tiene parámetros extraños.</li>
                            <li><strong>Procesamiento:</strong> Pega el enlace en FTY Downloader. Nuestro sistema escaneará las variantes SD y HD.</li>
                            <li><strong>Selección de Calidad:</strong> Siempre verás dos opciones principales: "Normal Quality" (ideal para móviles con poco espacio) y "HD Quality" (recomendado para PC y TV). Elige HD para mayor nitidez.</li>
                        </ol>
                    </article>

                    {/* TikTok Guide */}
                    <article>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-center">
                            <span className="mr-2">🎵</span> Guía para TikTok Sin Marca de Agua
                        </h3>
                        <p className="mb-4">
                            La marca de agua de TikTok puede ser molesta si quieres guardar un recuerdo limpio o reutilizar tu propio contenido.
                            FTY Downloader utiliza un método de "bypass" legítimo para acceder al stream original:
                        </p>
                        <ol className="list-decimal pl-6 space-y-3 marker:text-black marker:font-bold">
                            <li><strong>Encuentra tu TikTok:</strong> Abre el video deseado en la app.</li>
                            <li><strong>Copia el Link:</strong> Toca el icono de la flecha (Compartir) y busca el botón azul "Copiar enlace".</li>
                            <li><strong>Descarga Limpia:</strong> Al pegar el enlace en nuestra herramienta, nuestro script ignora la capa de superposición (overlay) que contiene el logo y el nombre de usuario, entregándote el archivo .MP4 puro.</li>
                        </ol>
                        <div className="bg-gray-50 p-4 rounded-lg mt-4 text-sm border-l-4 border-black">
                            <strong>Consejo Pro:</strong> Esta función es ideal para creadores de contenido que quieren resubir sus propios videos a múltiples redes sociales sin el logo de la competencia.
                        </div>
                    </article>

                    {/* YouTube Guide - MOVIDO AL FINAL Y SUAVIZADO */}
                    <article>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
                            <span className="mr-2">📁</span> Respaldo de Contenido Personal
                        </h3>
                        <p className="mb-4">
                            Muchas veces necesitamos una copia de seguridad local de nuestros propios videos subidos a plataformas de streaming.
                            Nuestra herramienta facilita este proceso para que nunca pierdas tu trabajo original.
                        </p>
                        <ul className="list-disc pl-6 space-y-3 marker:text-gray-500">
                            <li><strong>Compatibilidad:</strong> Soportamos una amplia gama de resoluciones para que el archivo de respaldo mantenga la fidelidad del original.</li>
                            <li><strong>Extracción de Audio:</strong> Ideal para creadores que necesitan recuperar el audio de sus propios tutoriales o conferencias pasadas.</li>
                        </ul>
                    </article>
                </div>
            </section>

            {/* SECCIÓN 3: FAQ TÉCNICO Y RESOLUCIÓN DE PROBLEMAS */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 border-l-8 border-green-500 pl-4">
                    Centro de Ayuda y Preguntas Frecuentes (FAQ)
                </h2>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">¿Por qué mi descarga falla o dice "Error"?</h4>
                        <p className="text-sm">
                            Esto suele ocurrir si el video es <strong>Privado</strong> (solo visible para amigos) o si tiene restricciones de edad/región.
                            FTY Downloader solo puede procesar videos que son 100% Públicos. Asegúrate de que el enlace sea accesible desde una ventana de incógnito.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">¿Dónde se guardan los archivos en Android/iPhone?</h4>
                        <p className="text-sm">
                            En Android, los archivos van directamente a la carpeta "Downloads" o "Descargas".
                            En iPhone (iOS), Safari te preguntará si quieres descargar; luego encontrarás el archivo en la aplicación "Archivos" (Files) de Apple, no directamente en el carrete de fotos (aunque puedes guardarlo allí después).
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">¿Puedo descargar transmisiones en vivo?</h4>
                        <p className="text-sm">
                            Solo es posible descargar transmisiones en vivo (Lives) <strong>una vez que han finalizado</strong> y se han publicado como video normal.
                            No es posible descargar un stream mientras se está emitiendo en tiempo real.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">¿FTY Downloader es gratuito de verdad?</h4>
                        <p className="text-sm">
                            Sí, es una herramienta gratuita financiada mediante publicidad discreta. No limitamos la velocidad de descarga ni el número de videos que puedes procesar por día.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 4: INFORMACIÓN TÉCNICA DE FORMATOS */}
            <section className="bg-gray-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Especificaciones Técnicas Soportadas</h2>
                <p className="mb-6 text-sm text-gray-600">
                    Nuestra infraestructura es compatible con los codecs más modernos para asegurar la compatibilidad universal en Smart TVs, consolas, móviles y PCs.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 border-b">Formato Contenedor</th>
                                <th className="px-6 py-3 border-b">Codec de Video</th>
                                <th className="px-6 py-3 border-b">Codec de Audio</th>
                                <th className="px-6 py-3 border-b">Uso Recomendado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">MP4</td>
                                <td className="px-6 py-4">H.264 (AVC)</td>
                                <td className="px-6 py-4">AAC</td>
                                <td className="px-6 py-4">Universal (WhatsApp, Instagram, TV)</td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">WEBM</td>
                                <td className="px-6 py-4">VP9 / AV1</td>
                                <td className="px-6 py-4">Opus</td>
                                <td className="px-6 py-4">Alta Calidad en Redes Sociales (HD)</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">MP3</td>
                                <td className="px-6 py-4">N/A</td>
                                <td className="px-6 py-4">MPEG Layer 3</td>
                                <td className="px-6 py-4">Solo Audio (Música, Podcasts)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* SECCIÓN 5: LEGALIDAD Y ÉTICA (IMPORTANTE PARA ADSENSE) */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Aviso Legal y Uso Ético</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                    <p className="text-sm text-yellow-800 mb-2 font-bold">Respeto a la Propiedad Intelectual</p>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                        FTY Downloader Pro no aloja ningún contenido pirata ni videos en sus servidores. Somos una herramienta de "intercambio de formato" (format-shifting).
                        Todos los videos se descargan directamente de los servidores de sus respectivas plataformas (CDN).
                    </p>
                    <p className="text-sm text-yellow-800 leading-relaxed mt-2">
                        <strong>Importante:</strong> Debes respetar los derechos de autor. Solo descarga videos para los que tengas permiso, que sean de dominio público,
                        o bajo la doctrina de "Fair Use" (Uso Justo) para fines educativos, de crítica o parodia. No toleramos la redistribución comercial de contenido protegido.
                    </p>
                </div>
            </section>

        </div>
    )
}
