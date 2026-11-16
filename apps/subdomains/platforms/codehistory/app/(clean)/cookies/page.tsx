import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/cookies' },
  title: 'Política de Cookies — Code History Daily',
  description:
    'Política oficial de cookies de Code History Daily: cookies técnicas, Google Consent Mode v2 y cookies de publicidad de Google AdSense.',
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
          Última actualización: 16 de noviembre de 2026 · Code History Daily (codehistory.atpdev.dev)
        </p>

        <div className="prose prose-invert max-w-none space-y-8 text-white/75 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Uso de Cookies en Code History Daily</h2>
            <p>
              Code History Daily utiliza cookies técnicas y almacenamiento local del navegador únicamente para recordar preferencias visuales y tu decisión en el aviso de consentimiento bajo Google Consent Mode v2, sin exigir cuentas de lector para consultar las efemérides de ingeniería y software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Tipos de Cookies</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">Cookies técnicas necesarias:</strong> conservan tu elección de privacidad y aseguran el funcionamiento básico del sitio web.
              </li>
              <li>
                <strong className="text-white">Cookies publicitarias de Google AdSense:</strong> Google y sus socios utilizan cookies para publicar anuncios relevantes o no personalizados según tu consentimiento y financiar la documentación histórica abierta.
              </li>
              <li>
                <strong className="text-white">Cookies analíticas opcionales:</strong> condicionadas a tu aceptación explícita, permiten monitorear latencias y disponibilidad técnica del archivo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Gestión de Preferencias en Navegadores y Anuncios</h2>
            <p className="mb-3">
              Code History Daily configura Google Consent Mode v2 con valores restrictivos por defecto hasta obtener tu elección expresa. Puedes bloquear, limitar o eliminar cookies en cualquier momento desde las opciones de privacidad de tu navegador:
            </p>
            <ul className="list-disc list-inside space-y-1.5 mb-3">
              <li><strong className="text-white">Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros y datos de sitios.</li>
              <li><strong className="text-white">Mozilla Firefox:</strong> Ajustes &gt; Privacidad y seguridad &gt; Cookies y datos del sitio.</li>
              <li><strong className="text-white">Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear cookies y gestionar datos almacenados.</li>
              <li><strong className="text-white">Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</li>
            </ul>
            <p>
              Puedes conocer cómo utiliza Google los datos de los sitios asociados en{' '}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">
                policies.google.com/technologies/partner-sites
              </a>
              , configurar tus preferencias publicitarias en{' '}
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">
                adssettings.google.com
              </a>{' '}
              u optar por la exclusión global mediante{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">
                www.aboutads.info/choices/
              </a>
              . Ten en cuenta que bloquear las cookies técnicas esenciales podría mostrar el aviso de privacidad en futuras sesiones y restablecer tus preferencias locales. Para consultas sobre derechos de privacidad (ARCO / RGPD), consulta también nuestra{' '}
              <Link href="/privacy" className="text-violet-400 underline">
                Política de Privacidad
              </Link>
              , nuestros{' '}
              <Link href="/terms" className="text-violet-400 underline">
                Términos de Servicio
              </Link>{' '}
              o escríbenos a{' '}
              <a href="mailto:contacto@atpdev.dev" className="text-violet-400 underline">
                contacto@atpdev.dev
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Transparencia y Consent Mode v2</h2>
            <p>
              Operamos en cumplimiento con Google Publisher Policies y Consent Mode v2: las cookies publicitarias personalizadas y analíticas permanecen desactivadas hasta tu autorización expresa y nunca recopilamos cuentas ni contraseñas de visitantes en la edición pública del archivo.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

