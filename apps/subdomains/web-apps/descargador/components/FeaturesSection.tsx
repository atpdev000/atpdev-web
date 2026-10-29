const features = [
  {
    title: 'Velocidad Extrema',
    description: 'Nuestros servidores optimizados garantizan descargas ultrarrápidas. Olvídate de las esperas; obtén tus videos en segundos, sin importar el tamaño.'
  },
  {
    title: '100% Seguro y Privado',
    description: 'No guardamos historial de tus descargas ni requerimos registro. Tu privacidad es nuestra prioridad; todo el procesamiento se realiza de forma anónima.'
  },
  {
    title: 'Compatible con Móviles',
    description: 'Diseño responsive que funciona perfectamente en iPhone, Android, tablets y PC. Disfruta de la misma experiencia fluida en cualquier dispositivo.'
  },
  {
    title: 'Soporte Multi-formato',
    description: 'Convierte y descarga en múltiples formatos: MP4 HD, MP3 de alta calidad (320kbps), M4A y WEBM. Adaptamos el contenido a tus necesidades.'
  },
  {
    title: 'Disponibilidad 24/7',
    description: 'Nuestra infraestructura en la nube asegura un tiempo de actividad del 99.9%. Descarga tus videos favoritos en cualquier momento, día y noche.'
  },
  {
    title: 'Totalmente Gratuito',
    description: 'Disfruta de todas las funciones premium sin pagar un centavo. FTY Downloader se mantiene gracias a anuncios no intrusivos, para ser siempre gratis para ti.'
  }
]

export default function FeaturesSection() {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        ¿Por qué elegirnos?
      </h2>
      <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
        La mejor herramienta para descargar videos de Facebook y Tiktok con la máxima calidad y velocidad
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}