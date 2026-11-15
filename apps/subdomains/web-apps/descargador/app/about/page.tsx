import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Target, Rocket, Shield, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Descargador Pro — ATP DEV (Ing. Percy Acha Taipe)',
  description: 'Conoce la visión técnica, equipo de ingeniería y compromiso de privacidad detrás de Descargador Pro, desarrollado por ATP DEV (Ing. Percy Acha Taipe).',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Botón Volver */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Descargador</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-700 text-white py-12 sm:py-16 px-6 sm:px-10 rounded-3xl mb-12 shadow-xl shadow-blue-500/10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Identidad & Propósito</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            Preservación y Respaldo de Contenidos Digitales
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl mx-auto opacity-95">
            Descargador Pro es una plataforma técnica creada para creadores, educadores y usuarios que buscan respaldar su contenido multimedia con la máxima fidelidad y velocidad.
          </p>
        </div>
      </section>

      {/* Grid de Misión y Visión */}
      <div className="space-y-12">
        <section className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Nuestra Misión</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Empoderar a los usuarios dotándolos de herramientas directas de extracción para recuperar el control de su contenido multimedia, garantizando integridad de formatos y acceso offline permanente.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Nuestra Visión</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Consolidarnos como el centro de herramientas multimedia más confiable y rápido, liderando en privacidad del usuario, diseño accesible y compatibilidad universal entre dispositivos.
            </p>
          </div>
        </section>

        {/* Pilares */}
        <section className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Nuestros Pilares Técnicos
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Soberanía de Datos</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tu contenido es tuyo: facilidades para respaldar tus publicaciones de redes en tu propio disco o teléfono.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Calidad Original 1080p</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Extracción limpia sin recodificación destructiva ni pérdida de bitrate o fotogramas.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Privacidad Rigurosa</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sin registros obligatorios, sin rastreo de actividad y con historial guardado exclusivamente en tu equipo.
              </p>
            </div>
          </div>
        </section>

        {/* Responsable Editorial y Dirección de Ingeniería */}
        <section className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Transparencia Institucional & Autoría</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Desarrollado y Operado por ATP DEV — Ing. Percy Acha Taipe
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Descargador Pro</strong> (<code className="text-xs">descargador.atpdev.dev</code>) es un producto de ingeniería web y móvil desarrollado por <strong>ATP DEV</strong> bajo la dirección técnica del <strong>Ing. Percy Acha Taipe</strong>, Ingeniero de Sistemas y Desarrollador Fullstack &amp; Mobile con sede en Perú (<a href="https://www.atpdev.dev/sobre-mi" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">ver perfil profesional verificado en atpdev.dev</a>).
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <strong className="block text-slate-900 dark:text-white mb-1">Titular y Editor Responsable</strong>
              ATP DEV — Percy Acha Taipe (Ingeniería de Sistemas y Software).
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <strong className="block text-slate-900 dark:text-white mb-1">Contacto Oficial y Soporte</strong>
              <a href="mailto:soporte@atpdev.dev" className="text-blue-600 dark:text-blue-400 underline">soporte@atpdev.dev</a> / <a href="mailto:contacto@atpdev.dev" className="text-blue-600 dark:text-blue-400 underline">contacto@atpdev.dev</a>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <strong className="block text-slate-900 dark:text-white mb-1">Jurisdicción y Cumplimiento</strong>
              Operación desde Perú bajo Ley N.° 29733 de Protección de Datos Personales y estándares internacionales GDPR / DMCA.
            </div>
          </div>
        </section>

        {/* CTA Contacto */}
        <div className="text-center p-8 rounded-2xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            ¿Tienes sugerencias o deseas colaborar?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Estamos abiertos a retroalimentación continua para añadir nuevas plataformas y optimizar las herramientas existentes.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>Ir a la Página de Contacto</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
