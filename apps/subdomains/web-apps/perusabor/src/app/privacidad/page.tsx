import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cookie, Database, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Perú Sabor Inteligente',
  description:
    'Política de privacidad, uso de almacenamiento local, cookies publicitarias de Google AdSense y protección de datos en Perú Sabor Inteligente.',
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
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
          Política de Privacidad
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Última actualización: Noviembre 2026 • Titular: ATP DEV (perusabor.atpdev.dev)
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <Database className="w-4 h-4 text-[#c22929]" />
            <h2>1. Datos y almacenamiento local</h2>
          </div>
          <p>
            Perú Sabor Inteligente ofrece calculadoras gastronómicas, escalador de porciones, costeo de recetas, gestión de menús y recetarios peruanos de acceso directo. Los cálculos e insumos que registras en las herramientas operan en tu sesión y almacenamiento local del navegador sin requerir registro obligatorio.
          </p>
          <p>
            Cuando utilizas el asistente culinario interactivo, la consulta enviada se procesa únicamente para generar la respuesta técnica solicitada y no se comercializa ni comparte con terceros con fines publicitarios propios.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <Cookie className="w-4 h-4 text-[#c22929]" />
            <h2>2. Cookies y Google AdSense</h2>
          </div>
          <p>
            Este sitio puede mostrar anuncios gestionados mediante Google AdSense. Proveedores externos, incluido Google, utilizan cookies para publicar anuncios basados en visitas anteriores del usuario a este sitio web o a otros sitios web.
          </p>
          <p>
            Puedes administrar o desactivar la publicidad personalizada en cualquier momento desde{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c22929] font-semibold underline"
            >
              Configuración de anuncios de Google
            </a>{' '}
            o consultar las{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c22929] font-semibold underline"
            >
              políticas de publicidad de Google
            </a>
            .
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#c22929]" />
            <h2>3. Derechos y contacto del titular</h2>
          </div>
          <p>
            Si tienes preguntas sobre esta política de privacidad o deseas solicitar aclaraciones sobre tus datos, puedes escribirnos a{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-[#c22929] font-semibold underline">
              contacto@atpdev.dev
            </a>{' '}
            o mediante el portal oficial en{' '}
            <a
              href="https://www.atpdev.dev/contacto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c22929] font-semibold underline"
            >
              www.atpdev.dev/contacto
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
