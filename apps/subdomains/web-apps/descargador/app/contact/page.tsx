'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Send, CheckCircle2, Clock, HelpCircle, ArrowLeft, Phone } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'soporte',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [contactInfo, setContactInfo] = useState({
    email: 'contacto@atpdev.dev',
    whatsapp: '+51 987 654 321',
    support_url: 'https://descargador.atpdev.dev/contact'
  })

  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (data?.contact) {
          setContactInfo(prev => ({
            ...prev,
            ...data.contact
          }))
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Ocurrió un error al enviar el mensaje.')
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: 'soporte', message: '' })
    } catch (err: any) {
      console.error('Error al enviar formulario:', err)
      setSubmitError(err?.message || 'No se pudo conectar con el servidor. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      {/* Encabezado */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Descargador</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Contacto y Mesa de Ayuda
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          ¿Tienes preguntas sobre descargas, sugerencias o requieres asistencia técnica? Nuestro equipo está listo para ayudarte.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Información de Canales Directos */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            Canales de Atención Oficial
          </h2>

          {/* Email General */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-blue-950 dark:text-blue-200">
                  Correo Electrónico
                </h3>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline block truncate"
                >
                  {contactInfo.email}
                </a>
                <p className="text-xs text-blue-800/70 dark:text-blue-300/70 mt-1">
                  Respuesta estimada: 24 a 48 horas hábiles.
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Directo */}
          {contactInfo.whatsapp && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-200">
                    WhatsApp Oficial
                  </h3>
                  <a 
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline block truncate"
                  >
                    {contactInfo.whatsapp}
                  </a>
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 mt-1">
                    Atención rápida para consultas y soporte técnico.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Horario de Atención */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Horario de Soporte</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex justify-between">
                <span>Lunes a Viernes:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">9:00 AM - 6:00 PM (GMT-5)</span>
              </li>
              <li className="flex justify-between">
                <span>Sábados:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">10:00 AM - 2:00 PM (GMT-5)</span>
              </li>
              <li className="flex justify-between">
                <span>Domingos y Feriados:</span>
                <span className="text-slate-400">Guardia técnica automatizada</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Formulario de Contacto */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
            Envíanos un Mensaje
          </h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">¡Mensaje Enviado con Éxito!</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Hemos recibido tu solicitud. Nuestro equipo te responderá a la brevedad.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="soporte">Soporte Técnico de Descargas</option>
                  <option value="error">Reportar un Enlace o Error</option>
                  <option value="sugerencia">Sugerencia o Mejora</option>
                  <option value="colaboracion">Colaboración / Negocios</option>
                  <option value="legal">Consulta Legal o DMCA</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe tu consulta con detalle (incluye la red social o enlace si aplica)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400 resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enviando mensaje...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-1">
                Al enviar el formulario, confirmas que has leído nuestra{' '}
                <Link href="/legal/privacidad" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  Política de Privacidad
                </Link>.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Enlace de FAQ */}
      <div className="mt-12 text-center p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
          ¿Tienes dudas rápidas sobre el uso del descargador?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
          Revisa nuestras Preguntas Frecuentes para conocer resoluciones inmediatas sobre formatos compatibles, calidad y descargas en móvil.
        </p>
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
        >
          <span>Consultar Preguntas Frecuentes (FAQ)</span>
        </Link>
      </div>
    </div>
  )
}
