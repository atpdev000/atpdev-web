import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowLeft, Mail } from 'lucide-react'
import { getSubdomainConfig } from '@atpdev/database'

export function generateMetadata(): Metadata {
  const config = getSubdomainConfig('descargador')
  const siteTitle = config?.branding?.site_title || 'FTY Downloader Pro'
  return {
    title: `Política de Privacidad | ${siteTitle}`,
    description: `Conoce cómo protegemos tu privacidad, nuestra política de cookies y el tratamiento seguro de datos en ${siteTitle} conforme a RGPD y Google AdSense.`,
  }
}

export default function PrivacyPage() {
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
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Última actualización: 1 de Enero de 2026 • Cumplimiento RGPD, CCPA y Google AdSense
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Tarjeta de Resumen Clave */}
        <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 shadow-xs">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed space-y-2">
              <p className="font-bold text-sm sm:text-base">Tu privacidad está garantizada al 100%:</p>
              <p>
                En <strong>{siteTitle}</strong>, la privacidad es un pilar fundamental. Nuestra herramienta funciona de forma totalmente libre, sin requerir registro de cuenta, sin almacenar videos ajenos en nuestros servidores y sin recopilar datos personales identificables.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 1: Información que procesamos */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>1. Información que Recopilamos y Procesamos</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">1.1 Lo que NUNCA recopilamos</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Sin Cuentas:</strong> No solicitamos nombre, correo, contraseñas ni registro de perfiles.</span>
              </li>
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Sin Almacenamiento Permanente:</strong> Los videos se procesan al vuelo y se transmiten directamente al usuario.</span>
              </li>
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No Vendemos Datos:</strong> Jamás comercializamos información de usuarios a agencias o intermediarios.</span>
              </li>
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Historial en Dispositivo:</strong> Las descargas guardadas viven únicamente en tu navegador o teléfono.</span>
              </li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">1.2 Información técnica procesada en tiempo real</h3>
            <p>
              Para garantizar que el convertidor de video y el proxy de descarga funcionen adecuadamente en todas las plataformas (Facebook, TikTok, YouTube, Instagram, Threads, Twitter/𝕏 y WhatsApp), nuestro sistema procesa de forma transitoria:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>URL pública solicitada:</strong> El enlace público pegado por el usuario se utiliza exclusivamente para consultar los metadatos y enlaces de streaming del video en la red social de origen.</li>
              <li><strong>Datos técnicos del agente de usuario (User-Agent):</strong> Tipo de navegador y sistema operativo (Android, iOS, Windows, Mac) para servir el formato de archivo y reproductor óptimo.</li>
              <li><strong>Dirección IP anonimizada:</strong> Requerida por motivos de seguridad técnica, prevención de abusos por bots (rate limiting) y balanceo de carga.</li>
            </ul>
          </div>
        </div>

        {/* Sección 2: Google AdSense y Publicidad de Terceros */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            2. Google AdSense, AdMob y Cookies Publicitarias
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Para mantener nuestra plataforma 100% gratuita para creadores y usuarios de todo el mundo, mostramos publicidad a través de <strong>Google AdSense</strong> y <strong>Google AdMob</strong>.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Políticas sobre la cookie de DART de Google:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Google, como proveedor asociado externo, utiliza cookies para publicar anuncios en nuestro sitio web.</li>
                <li>El uso de cookies de publicidad permite a Google y a sus socios presentar anuncios basados en las visitas previas a este o a otros sitios de Internet.</li>
                <li>
                  Puedes inhabilitar en cualquier momento la publicidad personalizada accediendo a la{' '}
                  <a 
                    href="https://adssettings.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Configuración de Anuncios de Google
                  </a>.
                </li>
                <li>
                  Asimismo, puedes informarte sobre cómo gestionar cookies publicitarias globales visitando{' '}
                  <a 
                    href="https://www.aboutads.info/choices/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    www.aboutads.info
                  </a>.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sección 3: Tabla de Cookies y Almacenamiento Local */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            3. Tecnologías de Almacenamiento y Cookies Utilizadas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                  <th className="p-3 font-bold text-slate-900 dark:text-white">Categoría</th>
                  <th className="p-3 font-bold text-slate-900 dark:text-white">Propósito</th>
                  <th className="p-3 font-bold text-slate-900 dark:text-white">Tipo / Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">Técnicas / Esenciales</td>
                  <td className="p-3">Garantizan la entrega fluida de la interfaz y la comunicación con las APIs de descarga.</td>
                  <td className="p-3">Sesión técnica</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">Preferencias de Usuario</td>
                  <td className="p-3">Recuerdan tu idioma preferido (ES, EN, PT) y la activación del Modo Oscuro / Claro.</td>
                  <td className="p-3">LocalStorage (1 año)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">Historial de Descargas</td>
                  <td className="p-3">Permite visualizar tus videos descargados y reproducirlos sin conexión en el teléfono.</td>
                  <td className="p-3">Almacenamiento Local Privado</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">Publicitarias (Google AdSense)</td>
                  <td className="p-3">Medición de impresiones y prevención de fraudes publicitarios conforme a políticas de Google.</td>
                  <td className="p-3">Variable por proveedor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección 4: Derechos RGPD y CCPA */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            4. Tus Derechos de Protección de Datos (RGPD y CCPA)
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              De conformidad con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley de Privacidad del Consumidor de California (CCPA), cuentas con los siguientes derechos garantizados:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Derecho de Acceso y Consulta</h4>
                <p className="text-xs">Solicitar confirmación de si tus datos están siendo procesados.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Derecho de Supresión (Olvido)</h4>
                <p className="text-xs">Solicitar la eliminación de cualquier dato residual en nuestros servidores.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Derecho de Oposición</h4>
                <p className="text-xs">Rechazar el uso de cookies publicitarias y tecnologías de seguimiento.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Limpieza Local Inmediata</h4>
                <p className="text-xs">Puedes borrar todo tu historial con un solo clic desde el modal de Historial.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 5: Contacto Oficial */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>5. Contacto y Consultas sobre Privacidad</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Si tienes dudas o inquietudes sobre esta Política de Privacidad o requieres asistencia técnica, puedes comunicarte con nuestro equipo oficial:
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <a 
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>{contactEmail}</span>
            </a>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Formulario de Contacto</span>
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            Plazo de respuesta estimado: 24 a 48 horas hábiles.
          </p>
        </div>
      </div>
    </div>
  )
}
