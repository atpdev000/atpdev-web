import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | FTY Downloader Pro - Nuestra Misión y Equipo',
  description: 'Conoce la visión de FTY Downloader Pro. Somos un equipo de especialistas en procesamiento multimedia dedicados a democratizar el acceso al contenido digital.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-8 rounded-[2.5rem] mb-20 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-400/30 text-blue-100 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-300/20">
            Nuestra Identidad
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight">
            Liderando la Preservación de <br />
            <span className="text-blue-200">Activos Digitales</span>
          </h1>
          <p className="text-xl text-blue-50 leading-relaxed max-w-3xl mx-auto opacity-90">
            Desde 2022, FTYDownloader Pro se ha consolidado como la plataforma técnica de referencia para creadores que buscan proteger su propiedad intelectual y su historial multimedia con calidad 4K.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="space-y-24">
        {/* Misión y Visión Section */}
        <section className="grid md:grid-cols-2 gap-10">
          <div className="group bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-gray-600 leading-relaxed">
              Empoderar a los usuarios dotándolos de las herramientas de extracción más potentes del mercado para recuperar el control sobre su contenido multimedia, garantizando integridad y accesibilidad offline permanente.
            </p>
          </div>
          <div className="group bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
            <p className="text-gray-600 leading-relaxed">
              Convertirnos en el centro de recursos multimedia más confiable del mundo de habla hispana, liderando en ciberseguridad, soberanía digital y gestión de datos de alto rendimiento.
            </p>
          </div>
        </section>

        {/* Historia y Propósito */}
        <section className="bg-gray-50 rounded-[3rem] p-12 md:p-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-l-4 border-blue-600 pl-6">Nuestra Historia</h2>
            <div className="prose prose-lg text-gray-600 space-y-6">
              <p>
                FTY Downloader Pro nació de una observación simple pero alarmante: internet es la biblioteca más grande de la historia, pero su arquitectura es volátil. El contenido que hoy es vital para tu educación o negocio puede desaparecer mañana por cambios en algoritmos o cierres de plataformas.
              </p>
              <p>
                Lo que comenzó como un script de ingeniería para procesar flujos de datos HD, evolucionó rápidamente en un ecosistema profesional. Hoy, servimos a una comunidad global de creadores que exigen una alternativa segura, sin malware y orientada a la máxima fidelidad técnica.
              </p>
            </div>
          </div>
        </section>

        {/* El Equipo */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Mentes Detrás del Código</h2>
            <p className="text-gray-600 text-lg">Especialistas dedicados a la excelencia técnica y la seguridad digital.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Alex T.P.', role: 'Arquitecto Principal', icon: '💻' },
              { name: 'M. García', role: 'Seguridad FIDO2', icon: '🛡️' },
              { name: 'L. Mendez', role: 'Editora de Blog', icon: '✍️' },
              { name: 'P. Rojas', role: 'Infraestructura Dev', icon: '⚡' },
            ].map((member) => (
              <div key={member.name} className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                <div className="text-4xl mb-4">{member.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section className="space-y-12">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">Nuestras Columnas Vertebrales</h2>
          <div className="grid gap-6">
            {[
              { title: 'Soberanía Digital', desc: 'Tu contenido es tuyo. Te damos la llave para sacarlo de la nube y guardarlo en tu propia infraestructura.' },
              { title: 'Calidad 1:1', desc: 'No escalamos video; extraemos el stream original sin pérdida de frames ni bitrates, tal como fue subido.' },
              { title: 'Higiene de Datos', desc: 'Privacidad absoluta. No rastreamos tus descargas ni almacenamos historiales de tus sesiones.' },
            ].map((value, index) => (
              <div key={value.title} className="flex flex-col md:flex-row gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-blue-600 text-3xl font-black">0{index + 1}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white p-12 md:p-20 rounded-[3rem] text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">¿Tienes un Proyecto o Duda Técnica?</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
              Nuestro equipo de soporte humano está listo para asistirte en colaboraciones, reportes de errores o consultas legales sobre copyright.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40 text-lg"
              >
                Inicia una Conversación
              </Link>
              <Link
                href="/blog"
                className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all text-lg"
              >
                Explora nuestras Guías
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}