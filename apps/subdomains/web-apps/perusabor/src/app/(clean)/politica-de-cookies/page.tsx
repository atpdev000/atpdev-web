import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies — Perú Sabor Inteligente',
  description:
    'Política oficial de cookies de Perú Sabor Inteligente: cookies técnicas, almacenamiento de recetas en el navegador, Consent Mode v2 y Google AdSense.',
  alternates: { canonical: '/politica-de-cookies' },
  robots: { index: true, follow: true },
};

export default function PoliticaCookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c22929] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a Perú Sabor Inteligente
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          Política de Cookies
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Última actualización: 16 de noviembre de 2026 · Titular: ATP DEV (perusabor.atpdev.dev)
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <Cookie className="w-4 h-4 text-[#c22929]" />
            <h2>1. ¿Qué son las cookies y cómo funcionan en Perú Sabor?</h2>
          </div>
          <p>
            Las cookies son pequeños archivos que el navegador almacena para recordar preferencias técnicas de uso (como tema claro/oscuro, escala de porciones en tus fichas culinarias e estado del banner de consentimiento). Todas nuestras calculadoras gastronómicas (costeo, escalador, inventario y menús) procesan datos directamente en tu navegador sin exigir registro previo.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#c22929]" />
            <h2>2. Tipos de cookies utilizadas</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Cookies técnicas necesarias:</strong> conservan tu elección bajo Google Consent Mode v2 y preferencias locales de interfaz.
            </li>
            <li>
              <strong>Cookies de Google AdSense:</strong> Google y sus socios pueden usar cookies para mostrar anuncios relevantes o no personalizados según tu consentimiento y visitas previas, ayudando a mantener gratuito el recetario y sus herramientas de restaurante.
            </li>
            <li>
              <strong>Cookies analíticas opcionales:</strong> solo se activan si aceptas su uso, permitiéndonos detectar páginas lentas y mejorar la estabilidad del catálogo culinario.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <Settings className="w-4 h-4 text-[#c22929]" />
            <h2>3. Cómo desactivar cookies y ejercer tus derechos</h2>
          </div>
          <p>
            Nuestro banner de consentimiento mantiene por defecto bloqueadas las cookies publicitarias personalizadas y analíticas hasta tu confirmación expresa. Puedes modificar la configuración en cualquier momento desde tu navegador:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros y datos de sitios.</li>
            <li><strong>Mozilla Firefox:</strong> Ajustes &gt; Privacidad y seguridad &gt; Cookies y datos del sitio.</li>
            <li><strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies y gestionar datos web.</li>
            <li><strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</li>
          </ul>
          <p>
            Adicionalmente, puedes administrar la personalización de anuncios de Google desde{' '}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#c22929] font-semibold underline">
              Configuración de anuncios de Google
            </a>
            , revisar cómo utiliza Google los datos cuando visitas sitios de socios en{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-[#c22929] font-semibold underline">
              policies.google.com/technologies/partner-sites
            </a>{' '}
            o gestionar preferencias globales en{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#c22929] font-semibold underline">
              www.aboutads.info/choices/
            </a>
            . Ten presente que deshabilitar cookies esenciales puede restablecer tus escalas de porciones o tema oscuro. Puedes revocar o actualizar tu preferencia de Google Consent Mode v2 (`ad_storage`, `ad_user_data`, `ad_personalization` y `analytics_storage`) eliminando el almacenamiento local del sitio en cualquier momento. Consulta también nuestra{' '}
            <Link href="/privacidad" className="text-[#c22929] font-semibold underline">
              Política de Privacidad
            </Link>{' '}
            o escríbenos a{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-[#c22929] font-semibold underline">
              contacto@atpdev.dev
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

