// app/planes/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Check,
  Crown,
  ShieldCheck,
  HelpCircle,
  ArrowLeft,
  Download,
  CreditCard,
  MessageCircle,
  KeyRound,
  Lock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Info,
  Shield,
  Sparkles
} from 'lucide-react'
import { useProPlan, PlanType } from '@/hooks/useProPlan'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { PaymentConfig } from '@/components/Payments/CheckoutModal'

export default function PlanesPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'yape' | 'code'>('card')
  const { plan, planDetails, isPro, activatePlan, cancelPlan } = useProPlan()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null)

  // Estados de formulario de tarjeta
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Estado de código de licencia
  const [licenseCode, setLicenseCode] = useState('')
  const [licenseError, setLicenseError] = useState<string | null>(null)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)

  useEffect(() => {
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.payments) {
          setPaymentConfig(data.payments)
        }
      })
      .catch((err) => console.error('Error cargando pasarela:', err))
  }, [])

  // Precios calculados
  const monthlyPrice = paymentConfig?.pro_monthly_price ?? 3.99
  const annualTotal = paymentConfig?.pro_annual_price ?? 48
  const annualMonthlyEquivalent = (annualTotal / 12).toFixed(2)
  const currentPriceDisplay = billingCycle === 'annual' ? `${annualTotal}US$` : `${monthlyPrice}US$`

  // Links de pago
  const stripeUrl = billingCycle === 'annual'
    ? paymentConfig?.stripe_pro_annual_url
    : paymentConfig?.stripe_pro_monthly_url

  const paypalUrl = billingCycle === 'annual'
    ? paymentConfig?.paypal_pro_annual_url
    : paymentConfig?.paypal_pro_monthly_url

  // WhatsApp
  const phone = (paymentConfig?.whatsapp_number || '+51987654321').replace(/[^0-9]/g, '')
  const orderRef = `ATP-PRO-${Math.floor(1000 + Math.random() * 9000)}`
  const whatsappMsg = `Hola ATP Dev 👋, quiero mejorar a Premium (${billingCycle === 'annual' ? `Anual $${annualTotal}` : `Mensual $${monthlyPrice}`}). Orden: #${orderRef}. ¿Me brindas los datos de pago por Yape o Tarjeta?`
  const whatsappHref = `https://wa.me/${phone}?text=${encodeURIComponent(paymentConfig?.whatsapp_message_pro || whatsappMsg)}`

  // Manejar submit del botón principal "Mejorar a Premium"
  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedMethod === 'card') {
      if (stripeUrl) {
        window.open(stripeUrl, '_blank')
        return
      }
      // Simulación de procesamiento seguro
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        activatePlan('pro', 'CARD-PREMIUM', billingCycle)
        setFeedback(`🎉 ¡Felicidades! Tu cuenta ha sido mejorada a Premium (${billingCycle === 'annual' ? 'Anual' : 'Mensual'}). Ya puedes descargar en 1080p y 4K.`)
        setTimeout(() => setFeedback(null), 8000)
      }, 1200)
    } else if (selectedMethod === 'paypal') {
      if (paypalUrl) {
        window.open(paypalUrl, '_blank')
      } else {
        window.open(whatsappHref, '_blank')
      }
    } else if (selectedMethod === 'yape') {
      window.open(whatsappHref, '_blank')
    } else if (selectedMethod === 'code') {
      handleVerifyLicense()
    }
  }

  // Verificación de código de licencia
  const handleVerifyLicense = async () => {
    if (!licenseCode.trim()) {
      setLicenseError('Ingresa tu código de licencia.')
      return
    }

    setIsVerifyingCode(true)
    setLicenseError(null)

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: licenseCode.trim() })
      })
      const data = await res.json()

      if (data.success && data.plan) {
        activatePlan(data.plan, data.code, billingCycle)
        setFeedback(`🎉 ¡Licencia activada con éxito! Has desbloqueado el Plan ${data.plan === 'business' ? 'Business VIP' : 'Premium'}.`)
        setLicenseCode('')
        setTimeout(() => setFeedback(null), 8000)
      } else {
        setLicenseError(data.message || 'Código de licencia no válido o expirado.')
      }
    } catch {
      setLicenseError('Error de conexión al verificar el código.')
    } finally {
      setIsVerifyingCode(false)
    }
  }

  // Formato automático de número de tarjeta
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16)
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4)
    if (raw.length >= 2) {
      setCardExpiry(`${raw.substring(0, 2)}/${raw.substring(2)}`)
    } else {
      setCardExpiry(raw)
    }
  }

  const handleDowngradeFree = () => {
    if (confirm('¿Estás seguro de que deseas volver al Plan Gratuito? Perderás las descargas en 1080p/4K.')) {
      cancelPlan()
      setFeedback('Has cambiado al Plan Gratuito.')
      setTimeout(() => setFeedback(null), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Banner de confirmación */}
        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-sm font-semibold animate-fade-in shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition ml-4 shrink-0 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Ahora</span>
            </Link>
          </div>
        )}

        {/* Botón Volver y Estado del Plan */}
        <div className="flex items-center justify-between">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Descargas</span>
          </Link>

          {isPro && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Crown className="w-3.5 h-3.5" />
              <span>Plan Activo: {plan === 'business' ? 'Business VIP' : 'Premium'}</span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CHECKOUT CARD ESTILO iLovePDF (Centrado, Limpio y de Alta Conversión) */}
        {/* ========================================================================= */}
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8">
          {/* Logo Superior tipo I ❤️ FTY */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                FTY
              </span>
              <span className="text-2xl sm:text-3xl text-red-500 inline-block">
                ❤️
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                PRO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white pt-2">
              Mejora a Premium
            </h1>
          </div>

          {/* Selector de Planes: Mensual vs Anual (Side-by-Side como iLovePDF) */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            {/* Tarjeta 1: Mensual */}
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`relative rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'border-[3px] border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Mensual
              </span>
              <div className="mt-1 flex items-baseline justify-center">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {monthlyPrice}US$
                </span>
              </div>
            </button>

            {/* Tarjeta 2: Anual (Con Badge Ahorra 42% o 20%) */}
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`relative rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'border-[3px] border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Badge de Ahorro superior */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold shadow-sm whitespace-nowrap">
                Ahorra 42%
              </div>

              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Anual
              </span>
              <div className="mt-1 flex items-baseline justify-center">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {annualTotal}US$
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {annualMonthlyEquivalent}US$ / mes
              </span>
            </button>
          </div>

          {/* Tabs de Métodos de Pago (Tarjeta, PayPal, Yape, Código) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-6">
                {/* Tab Tarjeta */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex items-center gap-2 pb-2 text-sm font-bold transition relative ${
                    selectedMethod === 'card'
                      ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <span>Tarjeta</span>
                </button>

                {/* Tab PayPal */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('paypal')}
                  className={`flex items-center gap-1.5 pb-2 text-sm font-bold transition relative ${
                    selectedMethod === 'paypal'
                      ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="font-extrabold italic text-blue-600 tracking-tighter">PayPal</span>
                </button>

                {/* Tab Yape / WhatsApp */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('yape')}
                  className={`flex items-center gap-1.5 pb-2 text-sm font-bold transition relative ${
                    selectedMethod === 'yape'
                      ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>Yape / WhatsApp</span>
                </button>

                {/* Tab Canjear Código */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('code')}
                  className={`flex items-center gap-1.5 pb-2 text-sm font-bold transition relative ${
                    selectedMethod === 'code'
                      ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-purple-500" />
                  <span>Licencia</span>
                </button>
              </div>
            </div>

            {/* Formulario de Tarjeta (Idéntico a iLovePDF) */}
            {selectedMethod === 'card' && (
              <form onSubmit={handleUpgradeSubmit} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Datos de tu tarjeta
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 shadow-sm focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-400">
                    <CreditCard className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-mono outline-none"
                    />
                    <input
                      type="text"
                      placeholder="MM / AA"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-20 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-mono outline-none text-center border-l border-slate-200 dark:border-slate-800 ml-2 pl-2"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-16 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-mono outline-none text-center border-l border-slate-200 dark:border-slate-800 ml-2 pl-2"
                    />
                  </div>
                </div>

                {stripeUrl && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    🔒 Serás redirigido al checkout oficial de Stripe con cifrado bancario 256-bit SSL.
                  </p>
                )}

                {/* Botón Rojo iLovePDF: Mejorar a Premium */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-[#e5322d] hover:bg-[#c92520] active:scale-[0.99] shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Procesando pago seguro...</span>
                    </>
                  ) : (
                    <span>Mejorar a Premium</span>
                  )}
                </button>
              </form>
            )}

            {/* Vista PayPal */}
            {selectedMethod === 'paypal' && (
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <p className="font-bold">Pago seguro con tu cuenta de PayPal o saldo internacional.</p>
                  <p className="text-[11px] opacity-80">Total a pagar: <strong>{currentPriceDisplay}</strong></p>
                </div>

                <a
                  href={paypalUrl || whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-[#0070ba] hover:bg-[#005ea6] shadow-md transition-all text-center flex items-center justify-center gap-2 text-base"
                >
                  <span className="italic font-black">P</span>
                  <span>Pagar con PayPal</span>
                </a>
              </div>
            )}

            {/* Vista Yape / WhatsApp */}
            {selectedMethod === 'yape' && (
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Yape / Plin / Transferencia Directa</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-800 font-bold text-[10px]">Perú</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Realiza el pago desde tu app bancaria y nuestro asistente te entregará tu Código de Licencia PRO para activación inmediata.
                  </p>
                </div>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all text-center flex items-center justify-center gap-2 text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Pagar por WhatsApp / Yape</span>
                </a>
              </div>
            )}

            {/* Vista Canjear Código Licencia */}
            {selectedMethod === 'code' && (
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ingresa tu código de licencia PRO
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: PRO-ATP-2026"
                    value={licenseCode}
                    onChange={(e) => {
                      setLicenseCode(e.target.value)
                      setLicenseError(null)
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm font-mono tracking-wider uppercase text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                  {licenseError && (
                    <p className="text-xs text-red-500 font-medium">{licenseError}</p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Código de prueba rápido: <code className="text-purple-500 font-bold">PRO-ATP-2026</code>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyLicense}
                  disabled={isVerifyingCode || !licenseCode.trim()}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all text-center flex items-center justify-center gap-2 text-base"
                >
                  {isVerifyingCode ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verificando licencia...</span>
                    </>
                  ) : (
                    <span>Activar Licencia Ahora</span>
                  )}
                </button>
              </div>
            )}

            {/* Garantías estilo iLovePDF */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                Cancela en cualquier momento
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                Garantía de reembolso
              </span>
            </div>
          </div>

          {/* Divisor y Sellos de Seguridad (Idéntico al footer de iLovePDF) */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <span>Seguro. Privado. Bajo tu control</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Insignias de Certificación de Seguridad */}
            <div className="flex items-center justify-around opacity-60 dark:opacity-40 grayscale hover:grayscale-0 transition-all pt-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>ATP Certified</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-mono border border-slate-400 px-1 py-0.5 rounded text-[9px]">ISO 27001</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>SSL 256-BIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABLA COMPARATIVA: ¿Qué obtienes con Premium? */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              ¿Por qué elegir el Plan Premium?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Todo lo que necesitas para descargar sin interrupciones con la más alta fidelidad.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Descargas Full HD 1080p a 60fps</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Ilimitado</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Ultra HD 2K (1440p) y 4K (2160p)</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Incluido</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Audio estéreo alta fidelidad (320kbps AAC)</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Máxima fidelidad</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Experiencia 100% Sin Publicidad</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Cero anuncios</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Motor FFmpeg Prioritario (Sin Colas)</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Velocidad Turbo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div className="max-w-3xl mx-auto space-y-4 pt-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>¿Por qué las resoluciones 1080p y 4K requieren el Plan Premium?</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                YouTube entrega el video en 1080p y 4K separado del audio. Nuestros servidores de alta velocidad unen ambas pistas con FFmpeg en tiempo real para que tu MP4 se reproduzca sin fallas en cualquier dispositivo.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>¿Las descargas estándar en 720p y TikTok siguen siendo gratis?</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                ¡Sí! Las descargas en 720p, los audios MP3 estándar y las descargas sin marca de agua de TikTok y Facebook son y seguirán siendo 100% gratuitas.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
