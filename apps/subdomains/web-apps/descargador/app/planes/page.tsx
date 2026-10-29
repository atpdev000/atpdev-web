// app/planes/page.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Crown, Zap, ShieldCheck, HelpCircle, ArrowLeft, Download } from 'lucide-react'
import { useProPlan } from '@/hooks/useProPlan'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

export default function PlanesPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const { plan, isPro, activatePlan, cancelPlan } = useProPlan()
  const [feedback, setFeedback] = useState<string | null>(null)

  const faqs = [
    {
      q: '¿Por qué las resoluciones 1080p y 4K requieren el Plan PRO?',
      a: 'YouTube almacena el video en 1080p, 1440p y 4K separado del audio. Para entregarte un archivo MP4 reproducible en cualquier reproductor sin errores, nuestros servidores dedicados deben descargar ambas pistas y fusionarlas con FFmpeg en tiempo real. Esta infraestructura de alta capacidad está financiada por los miembros del Plan PRO.'
    },
    {
      q: '¿Las descargas en 720p, TikTok y Facebook siguen siendo gratis?',
      a: '¡Sí! Las descargas estándar en 720p, los archivos de solo audio MP3/M4A y las descargas de TikTok y Facebook son 100% gratuitas e ilimitadas para siempre.'
    },
    {
      q: '¿Puedo cancelar mi suscripción en cualquier momento?',
      a: 'Por supuesto. Puedes cancelar o pausar tu suscripción en cualquier momento desde tu panel con un solo clic, sin preguntas ni penalizaciones.'
    },
    {
      q: '¿Qué reproductores son compatibles con los videos descargados en PRO?',
      a: 'Todos. Al combinar los flujos con códecs universales H.264/AV1 y audio AAC estéreo, los videos se abren de inmediato en el Reproductor de Windows, QuickTime (Mac), iPhone, Android, Smart TVs y reproductores como VLC.'
    },
    {
      q: '¿Cómo funciona la garantía de satisfacción?',
      a: 'Si en tus primeros 7 días el servicio no cumple tus expectativas, te reembolsamos el 100% de tu dinero inmediatamente.'
    }
  ]

  const handleSelectPlan = (selectedPlan: 'free' | 'pro' | 'business') => {
    if (selectedPlan === 'free') {
      cancelPlan()
      setFeedback('Has cambiado al Plan Gratuito.')
    } else {
      activatePlan(selectedPlan)
      setFeedback(`¡Felicidades! Se ha activado tu suscripción ${selectedPlan === 'pro' ? 'Pro Creador' : 'Business'}. Ya puedes descargar en 1080p y 4K.`)
    }
    setTimeout(() => setFeedback(null), 5000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Banner de confirmación */}
        {feedback && (
          <div className="p-4 rounded-xl bg-green-100 dark:bg-green-950/70 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-300 flex items-center justify-between text-sm font-semibold animate-fade-in">
            <span>{feedback}</span>
            <Link href="/tools" className="underline font-bold ml-4">
              Ir a Descargar Ahora →
            </Link>
          </div>
        )}

        {/* Botón Volver */}
        <div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a las Herramientas de Descarga</span>
          </Link>
        </div>

        {/* Encabezado */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Planes y Precios - Descargador PRO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Descargas en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">1080p, 4K y Sin Anuncios</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Elige el plan ideal para creadores, editores de contenido y usuarios exigentes. Descarga con video y audio combinados a máxima calidad.
          </p>

          {/* Selector Mensual / Anual */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
              Facturación Mensual
            </span>

            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 relative transition-colors focus:outline-none cursor-pointer border border-slate-300 dark:border-slate-700"
              aria-label="Alternar ciclo de facturación"
            >
              <div
                className={`w-6 h-6 rounded-full bg-amber-500 shadow-md transition-transform duration-300 ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
                Facturación Anual
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                Ahorra 20%
              </span>
            </div>
          </div>
        </div>

        {/* Tarjetas de Precios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Free */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Plan Gratuito</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Para descargas rápidas y uso ocasional</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-500">/ siempre gratis</span>
              </div>

              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Descargas TikTok sin marca de agua</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Descargas Facebook en SD y HD</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>YouTube en 360p y 720p estándar</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Solo Audio en MP3 / M4A (128kbps)</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400 line-through">
                  <span>Combinación 1080p y 4K con FFmpeg</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400 line-through">
                  <span>Experiencia libre de anuncios</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleSelectPlan('free')}
                disabled={plan === 'free'}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  plan === 'free'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200'
                }`}
              >
                {plan === 'free' ? '✓ Plan Actual' : 'Cambiar a Gratuito'}
              </button>
            </div>
          </div>

          {/* Plan 2: Pro Creador (DESTACADO) */}
          <div className="rounded-2xl border-2 border-amber-500 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-xl relative scale-105 z-10">
            {/* Badge Popular */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-extrabold uppercase tracking-wider shadow">
              ⭐ Más Popular
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Creador</h3>
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Para creadores de contenido, streamers y editores</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ${billingCycle === 'annual' ? '3.99' : '4.99'}
                </span>
                <span className="text-xs text-slate-500">
                  / mes {billingCycle === 'annual' ? '(facturado $47.90/año)' : ''}
                </span>
              </div>

              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5 font-semibold text-amber-600 dark:text-amber-400">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Descargas Combinadas 1080p Full HD a 60fps</span>
                </li>
                <li className="flex items-center gap-2.5 font-semibold text-amber-600 dark:text-amber-400">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Ultra HD 2K (1440p) y 4K (2160p)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Audio estéreo de alta fidelidad a 320kbps</span>
                </li>
                <li className="flex items-center gap-2.5 font-semibold">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>100% Sin Anuncios ni banners</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Descargas simultáneas a máxima velocidad</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Motor FFmpeg prioritario sin colas</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleSelectPlan('pro')}
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                {plan === 'pro' ? '✓ Plan Pro Activo' : 'Activar Plan Pro Creador'}
              </button>
            </div>
          </div>

          {/* Plan 3: Business / Agencia */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Business VIP</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Para agencias de marketing y productoras audiovisuales</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ${billingCycle === 'annual' ? '11.99' : '14.99'}
                </span>
                <span className="text-xs text-slate-500">
                  / mes {billingCycle === 'annual' ? '(facturado $139.90/año)' : ''}
                </span>
              </div>

              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Todo lo incluido en el Plan Pro Creador</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Descargas por lotes (listas completas)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Acceso a API para integraciones directas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Ancho de banda empresarial dedicado</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Soporte prioritario 24/7 por WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleSelectPlan('business')}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all cursor-pointer"
              >
                {plan === 'business' ? '✓ Plan Business Activo' : 'Elegir Plan Business'}
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Preguntas Frecuentes */}
        <div className="pt-8 space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Todo lo que necesitas saber sobre las descargas en alta calidad y tu suscripción.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2"
              >
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action final */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            ¿Listo para descargar videos en calidad insuperable?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Prueba hoy el descargador más rápido y potente de todo el ecosistema ATP.
          </p>
          <div className="pt-2">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-700 font-extrabold hover:bg-blue-50 shadow transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Ir al Descargador</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
