import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | FTY Downloader Pro',
  description: 'Conoce cómo FTY Downloader Pro utiliza cookies técnicas y de preferencias para garantizar la mejor experiencia de usuario.',
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-sm text-gray-500 mb-8 italic">Última actualización: 1 de Enero de 2026</p>

        <p>
          En <strong>FTY Downloader Pro</strong>, utilizamos cookies y tecnologías de almacenamiento local para garantizar el funcionamiento fluido de la herramienta, recordar tus elecciones de configuración y optimizar la experiencia de navegación. Esta política explica qué son las cookies, con qué finalidad se emplean y cómo puedes gestionarlas.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. ¿Qué son las cookies y el almacenamiento local?</h2>
        <p>
          Las cookies son pequeños ficheros de datos que los sitios web depositan en tu navegador al visitarlos. El almacenamiento local (LocalStorage / IndexedDB) es una tecnología moderna similar que permite que tu navegador retenga información útil en tu propio equipo (como tu lista de historial o el tema visual) sin transmitirla a servidores remotos.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. ¿Qué tipos de cookies y datos almacenamos?</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Cookies Técnicas y Esenciales:</strong> Son indispensables para la operativa básica de la aplicación, como la gestión de sesiones, la seguridad de las peticiones API y la navegación entre pantallas.
          </li>
          <li>
            <strong>Cookies de Preferencias:</strong> Nos permiten memorizar parámetros elegidos por el usuario, como el idioma de la interfaz (español, inglés o portugués) y la paleta visual (modo oscuro o modo claro).
          </li>
          <li>
            <strong>Historial de Descargas Local:</strong> Tu historial de descargas se guarda estrictamente en el almacenamiento local de tu dispositivo para que puedas reproducir tus videos sin conexión. Esta información no se sube a bases de datos en la nube.
          </li>
          <li>
            <strong>Publicidad y Medición (Terceros):</strong> Servicios asociados como Google AdSense, AdMob o Ezoic pueden emplear cookies para mostrar anuncios contextuales y medir la efectividad de campañas publicitarias.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Servicios de Terceros</h2>
        <p>
          En nuestra plataforma colaboramos con proveedores técnicos de confianza que pueden gestionar cookies propias:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google AdSense / Google AdMob:</strong> Muestran anuncios relevantes y evitan la repetición excesiva de la misma publicidad.</li>
          <li><strong>Google Analytics:</strong> Recopila datos métricos consolidados y totalmente anonimizados sobre visitas y tiempos de carga.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. ¿Cómo puedes controlar o desactivar las cookies?</h2>
        <p>
          Tienes el derecho y la libertad de aceptar, rechazar o eliminar las cookies en cualquier momento desde los ajustes de privacidad de tu navegador (Chrome, Firefox, Safari, Edge, etc.).
        </p>
        <p className="mt-4">
          Ten presente que deshabilitar cookies esenciales puede ocasionar que ciertas funciones (como recordar tu idioma o el tema oscuro) deban seleccionarse nuevamente en cada visita.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Actualizaciones de esta Política</h2>
        <p>
          Podemos modificar esta Política de Cookies en función de nuevas exigencias legales o mejoras en nuestra arquitectura tecnológica. Te recomendamos revisarla periódicamente para mantenerte informado.
        </p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-12">
          <h3 className="text-xl font-bold mb-3 text-gray-900">Canal de Contacto</h3>
          <p className="text-sm">Si tienes inquietudes respecto al tratamiento de cookies en nuestra web, puedes escribirnos a: <strong>contacto@atpdev.dev</strong></p>
        </div>
      </div>
    </div>
  )
}
