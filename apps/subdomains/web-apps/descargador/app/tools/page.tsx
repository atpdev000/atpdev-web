'use client'

import { useState } from 'react'
import { FEATURES } from '@/lib/featureFlags'
import PlatformTabs, { Platform } from '@/components/PlatformTabs'
import FacebookDownloader from '@/components/platforms/FacebookDownloader'
import YoutubeDownloader from '@/components/platforms/YoutubeDownloader'
import TiktokDownloader from '@/components/platforms/TiktokDownloader'
import InstagramDownloader from '@/components/platforms/InstagramDownloader'
import ThreadsDownloader from '@/components/platforms/ThreadsDownloader'
import TwitterDownloader from '@/components/platforms/TwitterDownloader'

export default function ToolsPage() {
  const [activePlatform, setActivePlatform] = useState<Platform>('facebook')

  const renderPlatform = () => {
    switch (activePlatform) {
      case 'facebook':
        return <FacebookDownloader />
      case 'youtube':
        return <YoutubeDownloader />
      case 'tiktok':
        return <TiktokDownloader />
      case 'instagram':
        return <InstagramDownloader />
      case 'threads':
        return <ThreadsDownloader />
      case 'twitter':
        return <TwitterDownloader />
      default:
        return <FacebookDownloader />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header de la página */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Herramientas de Descarga
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descarga videos de tus plataformas favoritas de forma rápida, segura y gratuita.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">100%</div>
          <div className="text-gray-700">Gratuito</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">6+</div>
          <div className="text-gray-700">Plataformas</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">HD</div>
          <div className="text-gray-700">Calidad Máxima</div>
        </div>
      </div>

      {/* Descargador principal */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <PlatformTabs activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
          <div className="mt-8">
            {renderPlatform()}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-4">
            <a href="/tools/facebook" className="text-sm font-medium text-blue-600 hover:underline">Ver Guía Facebook HD →</a>
            <a href="/tools/tiktok" className="text-sm font-medium text-pink-600 hover:underline">Ver Guía TikTok Sin Logo →</a>
            {FEATURES.YOUTUBE_ENABLED && <a href="/tools/youtube" className="text-sm font-medium text-red-600 hover:underline">Ver Guía YouTube 4K →</a>}
          </div>
        </div>
      </div>

      {/* Instrucciones de uso */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">¿Cómo descargar videos?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Copia el enlace</h3>
            <p className="text-gray-600 text-sm">
              Copia la URL del video que quieres descargar desde Facebook o TikTok.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Pega y elige calidad</h3>
            <p className="text-gray-600 text-sm">
              Pega el enlace en nuestro descargador y selecciona la calidad deseada.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Descarga y disfruta</h3>
            <p className="text-gray-600 text-sm">
              Haz clic en descargar y en segundos tendrás tu video listo para ver.
            </p>
          </div>
        </div>
      </div>

      {/* Sección Detallada de Herramientas (SEO & AdSense Value) */}
      <div className="max-w-4xl mx-auto mt-20 space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </div>
            Descarga de Videos de Facebook en HD y 4K
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nuestra herramienta de descarga para Facebook ha sido diseñada para ofrecer la máxima fidelidad visual posible en 2026. A diferencia de otros servicios que comprimen el video, FTY Downloader Pro accede directamente a los servidores de Meta para extraer el archivo original. Esto es fundamental para profesionales del marketing digital que necesitan reutilizar contenido de campañas exitosas sin perder ni un solo píxel de resolución.
          </p>
          <ul className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <li className="flex items-center gap-2">✅ Compatible con Facebook Reels y Watch</li>
            <li className="flex items-center gap-2">✅ Descarga de audio independiente en MP3 320kbps</li>
            <li className="flex items-center gap-2">✅ Sin necesidad de iniciar sesión o compartir contraseñas</li>
            <li className="flex items-center gap-2">✅ Procesamiento instantáneo de enlaces de grupos públicos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.13 8.13 0 0 1-1.89-1.41v6.2c0 1.38-.27 2.75-.82 4.02-.55 1.27-1.4 2.45-2.52 3.4a8.13 8.13 0 0 1-4.04 1.98c-1.39.14-2.8-.02-4.14-.52-1.34-.5-2.58-1.35-3.55-2.43a8.13 8.13 0 0 1-1.98-4.04 8.13 8.13 0 0 1 .52-4.14 8.13 8.13 0 0 1 2.43-3.55 8.13 8.13 0 0 1 4.04-1.98 8.13 8.13 0 0 1 1.93.02V8.29a4.13 4.13 0 0 0-2.31 1.57c-.77.94-.97 2.19-.74 3.32s.97 2.19 2.12 2.72c1.15.53 2.5.53 3.65 0 1.15-.53 2.12-1.59 2.35-2.72.23-1.13.03-2.38-.74-3.32-.38-.47-.85-.85-1.38-1.12V.02z" /></svg>
            </div>
            TikTok Downloader: Sin Marca de Agua Profesional
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            El auge del video vertical ha convertido a TikTok en la fuente principal de tendencias. Con FTY Downloader Pro, puedes obtener el video "limpio", eliminando por completo la marca de agua y el logo flotante. Esto es una herramienta esencial para editores que trabajan en la curaduría de contenido para YouTube Shorts o Instagram Reels, permitiendo una transición fluida entre plataformas sin distracciones visuales innecesarias.
          </p>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2">Casos de Uso Reales:</h4>
            <p className="text-sm text-gray-600">
              Ideal para analistas de tendencias, educadores que necesitan clips rápidos para sus clases digitales y creadores que desean respaldar su propio catálogo de videos frente a posibles cierres de cuenta o cambios en las políticas de la plataforma original.
            </p>
          </div>
        </section>

        <section className="bg-blue-600 rounded-3xl p-10 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Ventajas Técnicas de Nuestra Suite</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-3">Velocidad de Respuesta 6G</h4>
              <p className="text-blue-100 leading-relaxed">
                Nuestra infraestructura está optimizada para las redes de baja latencia del 2026. Los tiempos de espera son prácticamente inexistentes, permitiendo descargas múltiples simultáneas sin degradación del rendimiento.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-3">Seguridad y Confidencialidad</h4>
              <p className="text-blue-100 leading-relaxed">
                No rastreamos tus descargas ni almacenamos historiales de búsqueda. Tu privacidad es un derecho, no una opción. Utilizamos protocolos de limpieza automática de búfer para asegurar que no quede huella digital de tus archivos en nuestros servidores.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Aviso legal */}
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
        <p className="text-sm text-yellow-800 text-center leading-relaxed">
          <strong>Compromiso Ético y Aviso Legal:</strong> FTYDownloader Pro es una plataforma independiente.
          Alentamos el uso de nuestras herramientas para la descarga de contenido propio, material con licencia
          Creative Commons o con permiso explícito del autor. Respeta siempre los derechos de propiedad
          intelectual para mantener un ecosistema digital justo y creativo en este 2026.
        </p>
      </div>
    </div>
  )
}