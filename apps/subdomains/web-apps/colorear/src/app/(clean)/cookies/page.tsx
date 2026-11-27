import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre cookies técnicas, preferencias y publicidad en Colorear Pro.',
  alternates: { canonical: 'https://colorear.atpdev.dev/cookies' },
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-sm text-zinc-700 dark:text-slate-300 leading-relaxed">
      <h1 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
        Política de Cookies
      </h1>
      <p>
        Colorear Pro emplea almacenamiento local del navegador y cookies para recordar tu tema visual
        (claro/oscuro), guardar temporalmente tu cola de páginas del Estudio KDP y gestionar tu
        consentimiento de publicidad.
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        Tipos de cookies utilizadas
      </h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Técnicas y de preferencias</strong>: necesarias para recordar tu modo visual y tus
          preferencias de privacidad.
        </li>
        <li>
          <strong>Publicidad (Google AdSense)</strong>: solo se activan con personalización si aceptas
          el consentimiento mediante Google Consent Mode v2 (<code>ad_storage</code>,{' '}
          <code>ad_user_data</code>, <code>ad_personalization</code> y <code>analytics_storage</code>).
        </li>
      </ul>
      <p>
        Puedes abrir el panel de preferencias en cualquier instante pulsando{' '}
        <a href="#cookies-config" className="text-blue-600 dark:text-blue-400 font-bold underline">
          Configurar Cookies
        </a>{' '}
        o revisar nuestra{' '}
        <Link href="/privacidad" className="text-blue-600 dark:text-blue-400 underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </div>
  );
}

