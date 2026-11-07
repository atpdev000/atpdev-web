import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft, AlertCircle, Scale, ShieldAlert, CheckCircle, Mail } from 'lucide-react'
import { getSubdomainConfig } from '@atpdev/database'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'FTY Downloader Pro'
  return {
    title: `Términos de Servicio | ${siteTitle}`,
    description: `Términos y condiciones de uso de ${siteTitle}. Normas de uso aceptable, limitaciones de responsabilidad y doctrina de uso justo.`,
  }
}

export default function TermsPage() {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'FTY Downloader Pro'
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
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Términos de Servicio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Última actualización: 1 de Enero de 2026 • Condiciones Generales de Uso
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Aviso Importante */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
              <p className="font-bold text-sm sm:text-base">Aviso Legal Importante:</p>
              <p>
                Al acceder y utilizar <strong>{siteTitle}</strong> (en su versión web o aplicación móvil Android), confirmas que has leído, entendido y aceptado cumplir estos Términos de Servicio y todas las normativas legales aplicables.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 1: Naturaleza del servicio */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            1. Naturaleza y Propósito del Servicio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {siteTitle} es una herramienta tecnológica independiente diseñada para facilitar la descarga, conversión técnica (format-shifting) y respaldo de contenidos multimedia de plataformas públicas (Facebook, TikTok, Instagram, Threads, Twitter/𝕏, YouTube y WhatsApp). Nuestro software actúa exclusivamente como intermediario técnico de transmisión y no almacena copias de videos ajenos en sus servidores.
          </p>
        </div>

        {/* Sección 2: Uso Aceptable */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            2. Uso Aceptable y Legítimo
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Nuestras herramientas deben ser utilizadas únicamente para fines éticos y legales, incluyendo:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Contenido Propio:</strong> Copias de seguridad de videos creados o publicados por ti.</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Uso Personal Privado:</strong> Visualización sin conexión en dispositivos personales.</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Docencia e Investigación:</strong> Citas y análisis con la debida atribución al autor original.</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Dominio Público:</strong> Obras bajo licencias libres o Creative Commons.</span>
            </li>
          </ul>
        </div>

        {/* Sección 3: Usos Prohibidos */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>3. Usos Prohibidos</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>Queda terminantemente prohibido hacer uso de esta plataforma para:</p>
            <ul className="list-disc pl-5 space-y-2 text-red-600 dark:text-red-400">
              <li>Descargar, duplicar o comercializar contenido protegido por derechos de autor con fines lucrativos sin autorización.</li>
              <li>Apropiarse de la autoría de creaciones intelectuales ajenas.</li>
              <li>Difundir contenidos con fines de acoso, difamación, vulneración de intimidad o actividades ilícitas.</li>
              <li>Ejecutar ataques de denegación de servicio (DDoS) o sobrecargar deliberadamente la infraestructura del servidor.</li>
            </ul>
          </div>
        </div>

        {/* Sección 4: Exención de Responsabilidad */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            4. Limitación de Responsabilidad ("Tal cual")
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              El servicio se provee "tal cual" y según disponibilidad. FTY Downloader Pro no ofrece garantías explícitas de disponibilidad ininterrumpida ante cambios imprevistos en las plataformas de origen y no se hace responsable del uso final ni la redistribución que los usuarios realicen con los archivos obtenidos.
            </p>
          </div>
        </div>

        {/* Sección 5: Marcas Registradas */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            5. Marcas Registradas de Terceros
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Facebook, TikTok, Instagram, Threads, YouTube, Twitter/𝕏 y WhatsApp son marcas registradas propiedad de sus correspondientes titulares (Meta Platforms, Inc., ByteDance Ltd., Google LLC, X Corp. y WhatsApp LLC). {siteTitle} es una aplicación técnica independiente sin relación corporativa, patrocinio ni afiliación oficial con ninguna de dichas empresas.
          </p>
        </div>

        {/* Sección 6: Contacto */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            6. Consultas sobre los Términos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Para inquietudes respecto a estos términos o peticiones legales:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a 
              href={`mailto:${contactEmail}`} 
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{contactEmail}</span>
            </a>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs"
            >
              <span>Mesa de Ayuda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
