'use client'

import { useState } from 'react'
import { Metadata } from 'next'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'soporte',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Formulario enviado:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: 'soporte', message: '' })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-4 text-center">Contacto</h1>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para asistirte.
        Completa el formulario o usa nuestros canales directos de contacto.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Información de Contacto */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>

          <div className="space-y-6">
            {/* Email Principal */}
            <div className="bg-blue-50 p-5 rounded-xl">
              <div className="flex items-start">
                <span className="text-2xl mr-4">📧</span>
                <div>
                  <h3 className="font-semibold text-lg text-blue-800">Email General</h3>
                  <a href="mailto:atp.dev000@gmail.com" className="text-blue-600 hover:underline">
                    atp.dev000@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Respuesta en 24-48 horas</p>
                </div>
              </div>
            </div>

            {/* Soporte Técnico */}
            <div className="bg-green-50 p-5 rounded-xl">
              <div className="flex items-start">
                <span className="text-2xl mr-4">🛠️</span>
                <div>
                  <h3 className="font-semibold text-lg text-green-800">Soporte Técnico</h3>
                  <a href="mailto:s.atpdev000@gmail.com" className="text-green-600 hover:underline">
                    s.atpdev000@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Ayuda con problemas técnicos</p>
                </div>
              </div>
            </div>

            {/* Colaboraciones */}
            <div className="bg-purple-50 p-5 rounded-xl">
              <div className="flex items-start">
                <span className="text-2xl mr-4">🤝</span>
                <div>
                  <h3 className="font-semibold text-lg text-purple-800">Colaboraciones y Negocios</h3>
                  <a href="mailto:atp.dev000@gmail.com" className="text-purple-600 hover:underline">
                    atp.dev000@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Propuestas comerciales o de partnership</p>
                </div>
              </div>
            </div>

            {/* Reportar Problemas */}
            <div className="bg-red-50 p-5 rounded-xl">
              <div className="flex items-start">
                <span className="text-2xl mr-4">🐛</span>
                <div>
                  <h3 className="font-semibold text-lg text-red-800">Reportar Errores</h3>
                  <a href="mailto:s.atpdev000@gmail.com" className="text-red-600 hover:underline">
                    s.atpdev000@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Informa sobre bugs o mejoras</p>
                </div>
              </div>
            </div>
          </div>

          {/* Horario de Atención */}
          <div className="mt-8 p-5 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-lg mb-3">⏰ Horario de Atención</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span className="font-medium">9:00 AM - 6:00 PM (GMT-5)</span>
              </li>
              <li className="flex justify-between">
                <span>Sábados:</span>
                <span className="font-medium">10:00 AM - 2:00 PM (GMT-5)</span>
              </li>
              <li className="flex justify-between">
                <span>Domingos:</span>
                <span className="text-gray-500">Cerrado</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Formulario de Contacto */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <span className="text-5xl mb-4 block">✅</span>
              <h3 className="text-xl font-bold text-green-800 mb-2">¡Mensaje Enviado!</h3>
              <p className="text-green-700 mb-4">
                Hemos recibido tu mensaje. Te responderemos en un plazo de 24-48 horas hábiles.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-green-600 hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="soporte">Soporte Técnico</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="error">Reportar un Error</option>
                  <option value="colaboracion">Colaboración / Negocios</option>
                  <option value="legal">Consulta Legal</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Describe tu consulta con el mayor detalle posible..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  '📤 Enviar Mensaje'
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Al enviar este formulario, aceptas nuestra{' '}
                <a href="/legal/privacidad" className="text-blue-600 hover:underline">
                  Política de Privacidad
                </a>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Link */}
      <div className="mt-12 text-center bg-gray-50 p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-3">¿Tienes una pregunta frecuente?</h3>
        <p className="text-gray-600 mb-4">
          Antes de contactarnos, revisa nuestras Preguntas Frecuentes. Quizás ya tenemos la respuesta.
        </p>
        <a
          href="/faq"
          className="inline-block bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          📋 Ver Preguntas Frecuentes
        </a>
      </div>
    </div>
  )
}