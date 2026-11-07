import { Metadata } from 'next'
import Link from 'next/link'
import { Copyright, ArrowLeft, Shield, AlertTriangle, Mail } from 'lucide-react'
import { getSubdomainConfig } from '@atpdev/database'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'FTY Downloader Pro'
  return {
    title: `Política de Copyright y DMCA | ${siteTitle}`,
    description: `Información sobre derechos de autor, procedimiento de notificación DMCA y uso legítimo en ${siteTitle}.`,
  }
}

export default function CopyrightPage() {
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
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Copyright className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Política de Copyright y DMCA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Protección de Propiedad Intelectual y Procedimiento de Notificación
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Resumen */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            1. Respeto por los Derechos de Autor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            En <strong>FTY Downloader Pro</strong>, respetamos escrupulosamente los derechos de propiedad intelectual de creadores, productoras y artistas. Nuestra plataforma funciona como una herramienta neutral de procesamiento y conversión de medios (format-shifting) para uso personal privado y legítimo, sin almacenar ni hospedar archivos audiovisuales de terceros en servidores propios.
          </p>
        </div>

        {/* Uso Justo / Fair Use */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            2. Doctrina de Uso Justo (Fair Use)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Recordamos a los usuarios que la descarga de material protegido sin autorización previa puede estar amparada exclusivamente bajo las excepciones de <strong>Uso Justo (Fair Use)</strong> aplicables en su país, limitadas estrictamente a:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li>Crítica, reseñas y comentarios académicos o culturales.</li>
            <li>Reportajes periodísticos e investigación de noticias.</li>
            <li>Enseñanza y actividades educativas sin fines de lucro.</li>
            <li>Copias de respaldo de archivos propios para visualización privada offline.</li>
          </ul>
        </div>

        {/* Procedimiento DMCA */}
        <div className="p-6 sm:p-8 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-950 dark:text-purple-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>3. Procedimiento de Notificación de Infracción (DMCA)</span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-900/90 dark:text-purple-300/90 leading-relaxed">
            Si eres titular legítimo de derechos de autor (o representante acreditado) y consideras que algún contenido procesado a través de nuestra herramienta infringe tus derechos, puedes remitir una notificación con los siguientes datos:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-purple-900/80 dark:text-purple-300/80">
            <li>Identificación precisa de la obra protegida por derechos de autor supuestamente infringida.</li>
            <li>La URL exacta del contenido en la red social de origen.</li>
            <li>Información de contacto (nombre, dirección, teléfono y correo electrónico corporativo).</li>
            <li>Declaración de buena fe donde conste que el uso reclamado no está autorizado por el titular ni por la ley.</li>
            <li>Firma física o electrónica del titular o representante acreditado.</li>
          </ul>
          <div className="pt-2">
            <a 
              href={`mailto:${contactEmail}?subject=Notificacion%20DMCA`} 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Enviar Notificación DMCA ({contactEmail})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
