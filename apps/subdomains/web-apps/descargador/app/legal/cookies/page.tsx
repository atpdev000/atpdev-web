import { Metadata } from 'next'
import Link from 'next/link'
import { Cookie, ArrowLeft, Settings, Check, Mail } from 'lucide-react'
import { getSubdomainConfig } from '@atpdev/database'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'FTY Downloader Pro'
  return {
    title: `Política de Cookies | ${siteTitle}`,
    description: `Conoce en detalle cómo ${siteTitle} utiliza cookies técnicas y almacenamiento local para brindarte la mejor experiencia.`,
  }
}

export default function CookiesPage() {
  const config = getSubdomainConfig('descargador')
  const contactEmail = config?.contact?.email || 'contacto@atpdev.dev'
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Navegación y Encabezado */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Descargador</span>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Política de Cookies
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Última actualización: 1 de Enero de 2026 • Información de Almacenamiento Local
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Introducción */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            En <strong>FTY Downloader Pro</strong>, utilizamos cookies y tecnologías de almacenamiento local en el navegador (como LocalStorage) para que disfrutes de una navegación rápida, segura y adaptada a tus preferencias. Esta política explica qué tecnologías usamos, para qué sirven y cómo puedes configurarlas o desactivarlas.
          </p>
        </div>

        {/* Tipos de cookies */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            1. ¿Qué tipos de cookies y almacenamiento utilizamos?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Cookies Técnicas Esenciales</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Requeridas para la navegación, seguridad de peticiones API y entrega del reproductor de video.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Preferencias de Idioma y Tema</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Permiten que la web recuerde si prefieres Modo Oscuro o Claro y tu idioma (ES, EN, PT) en cada visita.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Historial Local Privado</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Almacena el registro de tus descargas únicamente en la memoria local de tu dispositivo, sin enviarlo a la nube.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Publicidad (Google AdSense)</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Google utiliza cookies para medir impresiones y presentar anuncios contextuales de forma segura.
              </p>
            </div>
          </div>
        </div>

        {/* Cómo gestionar cookies */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>2. ¿Cómo controlar o desactivar las cookies?</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
            <p>
              Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador web:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros.</li>
              <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt; Cookies y datos del sitio.</li>
              <li><strong>Apple Safari:</strong> Preferencias &gt; Privacidad.</li>
              <li><strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio.</li>
            </ul>
          </div>
        </div>

        {/* Contacto */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            ¿Preguntas sobre nuestra política de cookies?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Puedes escribirnos directamente a: <a href={`mailto:${contactEmail}`} className="text-blue-600 dark:text-blue-400 font-bold underline">{contactEmail}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
