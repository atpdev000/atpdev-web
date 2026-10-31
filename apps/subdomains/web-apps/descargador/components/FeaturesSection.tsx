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
    <div className="text-center py-8 transition-colors">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        ¿Por qué elegirnos?
      </h2>
      <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
        La mejor herramienta para descargar videos de Facebook y TikTok con la máxima calidad y velocidad.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 text-center hover:shadow-xl transition-all"
          >
            <div className="bg-blue-100 dark:bg-blue-950/60 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800/40">
              <svg className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}