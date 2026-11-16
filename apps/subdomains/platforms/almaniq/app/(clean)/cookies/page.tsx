import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/cookies' },
  title: 'Política de Cookies — Almaniq Web',
  description:
    'Política oficial de cookies de Almaniq Web: cookies técnicas, preferencias del lector, Google Consent Mode v2 y cookies publicitarias de Google AdSense.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
            ← Volver al inicio
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-3">Política de Cookies</h1>
        <p className="text-white/40 text-sm mb-10">
          Última actualización: 16 de noviembre de 2026 · Almaniq Web (almaniq.atpdev.dev)
        </p>

        <div className="prose prose-invert max-w-none space-y-8 text-white/75 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Uso de Cookies en Almaniq Web</h2>
            <p>
              Almaniq Web emplea cookies técnicas y almacenamiento local en el navegador para recordar tu elección en el banner de consentimiento (Google Consent Mode v2) y mejorar la lectura del archivo cronológico sin exigir registro de usuario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Categorías de Cookies</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">Cookies técnicas necesarias:</strong> almacenan el estado de consentimiento (<code>denied</code> o <code>granted</code>) y preferencias locales de interfaz.
              </li>
              <li>
                <strong className="text-white">Cookies publicitarias de Google AdSense:</strong> Google y sus socios utilizan cookies para mostrar anuncios personalizados o no personalizados según tu consentimiento y financiar la conservación gratuita del archivo histórico.
              </li>
              <li>
                <strong className="text-white">Cookies de medición:</strong> sujetas a aceptación previa, ayudan a detectar errores HTTP o páginas lentas para optimizar el rendimiento editorial.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Control, Desactivación en Navegadores y Exclusión Voluntaria</h2>
            <p className="mb-3">
              Almaniq Web opera por defecto con señales restrictivas bajo Google Consent Mode v2 hasta tu autorización explícita. En todo momento puedes restringir, bloquear o eliminar cookies directamente desde la configuración de tu navegador web:
            </p>
            <ul className="list-disc list-inside space-y-1.5 mb-3">
              <li><strong className="text-white">Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros y datos de sitios.</li>
              <li><strong className="text-white">Mozilla Firefox:</strong> Ajustes &gt; Privacidad y seguridad &gt; Protección contra rastreo y cookies.</li>
              <li><strong className="text-white">Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear cookies y gestionar datos de sitios web.</li>
              <li><strong className="text-white">Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</li>
            </ul>
            <p>
              Asimismo, puedes revisar cómo emplea Google los datos de los sitios que utilizan sus servicios en{' '}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">
                policies.google.com/technologies/partner-sites
              </a>
              , ajustar la personalización de anuncios en{' '}
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">
                adssettings.google.com
              </a>{' '}
              o gestionar exclusiones globales mediante{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">
                www.aboutads.info/choices/
              </a>
              . Ten en cuenta que deshabilitar las cookies técnicas puede impedir recordar tu preferencia de consentimiento entre visitas. Más información sobre protección de datos en nuestra{' '}
              <Link href="/privacy" className="text-violet-400 underline">
                Política de Privacidad
              </Link>
              , nuestros{' '}
              <Link href="/terms" className="text-violet-400 underline">
                Términos de Servicio
              </Link>{' '}
              o escribiendo a{' '}
              <a href="mailto:contacto@atpdev.dev" className="text-violet-400 underline">
                contacto@atpdev.dev
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

