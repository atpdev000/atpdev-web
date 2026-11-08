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
  Loader2,
  Info,
  Shield,
  Globe,
  AlertCircle
} from 'lucide-react'
import { useProPlan } from '@/hooks/useProPlan'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { PaymentConfig } from '@/components/Payments/CheckoutModal'
import {
  CurrencyConfig,
  SUPPORTED_CURRENCIES,
  detectDefaultCurrency,
  formatPrice
} from '@/lib/currency'

export default function PlanesPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'yape' | 'code'>('card')
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyConfig>(SUPPORTED_CURRENCIES.PEN)
  const { plan, isPro, activatePlan, cancelPlan } = useProPlan()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null)

  // Estados de formulario de tarjeta
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardError, setCardError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Estado de código de licencia
  const [licenseCode, setLicenseCode] = useState('')
  const [licenseError, setLicenseError] = useState<string | null>(null)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)

  useEffect(() => {
    // 1. Detectar moneda local automáticamente
    const detected = detectDefaultCurrency()
    setCurrentCurrency(detected)
    if (detected.code === 'PEN') {
      setSelectedMethod('yape')
    }

    // 2. Cargar configuración del servidor
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.payments) setPaymentConfig(data.payments)
          if (data.detectedCurrency && SUPPORTED_CURRENCIES[data.detectedCurrency]) {
            setCurrentCurrency(SUPPORTED_CURRENCIES[data.detectedCurrency])
            if (data.detectedCurrency === 'PEN') {
              setSelectedMethod('yape')
            }
          }
        }
      })
      .catch((err) => console.error('Error cargando pasarela:', err))

    // 3. Detectar confirmación de pago de Stripe en la URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('success') === 'true' || params.get('success') === 'pro' || params.get('plan') === 'pro') {
        setFeedback('🎉 ¡Pago verificado con éxito por Stripe! Tu suscripción Premium ya está activa.')
      }
    }
  }, [])

  // Precios dinámicos según moneda seleccionada
  const isPEN = currentCurrency.code === 'PEN'
  const monthlyPriceNumber = isPEN
    ? (paymentConfig?.pro_monthly_price && paymentConfig.currency === 'PEN' ? paymentConfig.pro_monthly_price : 14.90)
    : (paymentConfig?.pro_monthly_price || currentCurrency.monthlyPrice)

  const annualTotalNumber = isPEN
    ? (paymentConfig?.pro_annual_price && paymentConfig.currency === 'PEN' ? paymentConfig.pro_annual_price : 149.00)
    : (paymentConfig?.pro_annual_price || currentCurrency.annualTotal)

  const monthlyPriceDisplay = formatPrice(monthlyPriceNumber, currentCurrency)
  const annualTotalDisplay = formatPrice(annualTotalNumber, currentCurrency)
  const annualMonthlyEquivalent = formatPrice(annualTotalNumber / 12, currentCurrency)
  const currentPriceDisplay = billingCycle === 'annual' ? annualTotalDisplay : monthlyPriceDisplay

  // Links de pago
  const stripeUrl = billingCycle === 'annual'
    ? (paymentConfig?.stripe_pro_annual_url || 'https://buy.stripe.com/test_dRm8wPa0Cd3C2HPakH1kA00')
    : (paymentConfig?.stripe_pro_monthly_url || 'https://buy.stripe.com/test_5kQdR94GigfOeqxgJ51kA01')

  const paypalUrl = billingCycle === 'annual'
    ? paymentConfig?.paypal_pro_annual_url
    : paymentConfig?.paypal_pro_monthly_url

  // WhatsApp
  const phone = (paymentConfig?.whatsapp_number || '+51987654321').replace(/[^0-9]/g, '')
  const orderRef = `ATP-PRO-${Math.floor(1000 + Math.random() * 9000)}`
  const currencyNotice = isPEN ? `en Perú por Yape/Plin (${billingCycle === 'annual' ? `Anual ${annualTotalDisplay}` : `Mensual ${monthlyPriceDisplay}`})` : `(${billingCycle === 'annual' ? `Anual ${annualTotalDisplay}` : `Mensual ${monthlyPriceDisplay}`})`
  const defaultWhatsappMsg = `Hola ATP Dev 👋, quiero activar Premium en Descargador Pro ${currencyNotice}. Orden: #${orderRef}. ¿Me brindas los datos de pago?`
  const whatsappHref = `https://wa.me/${phone}?text=${encodeURIComponent(defaultWhatsappMsg)}`
  const whatsappCardMsg = `Hola ATP Dev 👋, deseo pagar mi suscripción Premium en Descargador Pro (${billingCycle === 'annual' ? `Anual ${annualTotalDisplay}` : `Mensual ${monthlyPriceDisplay}`}) con Tarjeta de Crédito/Débito. Orden: #${orderRef}. ¿Me compartes el link de pago seguro por favor?`
  const whatsappCardHref = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappCardMsg)}`

  // Manejar submit del botón principal "Mejorar a Premium"
  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCardError(null)

    if (selectedMethod === 'card') {
      // 1. Si hay link de Stripe conectado, ir directo a Stripe Checkout
      if (stripeUrl) {
        window.open(stripeUrl, '_blank')
        return
      }

      // 2. Si no hay Stripe configurado, abrir WhatsApp para link de pago seguro con tarjeta
      window.open(whatsappCardHref, '_blank')
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardError(null)
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16)
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardError(null)
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4)
    if (raw.length >= 2) {
      setCardExpiry(`${raw.substring(0, 2)}/${raw.substring(2)}`)
    } else {
      setCardExpiry(raw)
    }
  }

  const handleResetToFree = () => {
    cancelPlan()
    setFeedback('Has restablecido la cuenta a Plan Gratuito. Ya puedes probar el flujo de compra desde cero.')
    setTimeout(() => setFeedback(null), 5000)
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

        {/* Barra Superior: Volver, Moneda y Estado */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Descargas</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Selector de Moneda y País Automático */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={currentCurrency.code}
                onChange={(e) => {
                  const selected = SUPPORTED_CURRENCIES[e.target.value]
                  if (selected) {
                    setCurrentCurrency(selected)
                    if (selected.code === 'PEN') setSelectedMethod('yape')
                  }
                }}
                className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
                aria-label="Seleccionar moneda"
              >
                {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    {curr.flag} {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {isPro && (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Plan Premium Activo</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetToFree}
                  className="text-xs text-red-500 hover:text-red-700 underline font-semibold transition cursor-pointer"
                  title="Cancelar y restablecer a plan gratuito"
                >
                  (Desactivar Plan)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CHECKOUT CARD ESTILO iLovePDF (Descargador Pro Oficial) */}
        {/* ========================================================================= */}
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8">
          {/* Logo Superior: Descargador ❤️ Pro */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Descargador
              </span>
              <span className="text-2xl sm:text-3xl text-red-500 inline-block animate-pulse">
                ❤️
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                Pro
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white pt-2">
              Mejora a Premium
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Precios en tu moneda local: <strong className="text-slate-700 dark:text-slate-200">{currentCurrency.name}</strong>
            </p>
          </div>

          {/* Selector de Planes: Mensual vs Anual */}
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
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {monthlyPriceDisplay}
                </span>
              </div>
            </button>

            {/* Tarjeta 2: Anual */}
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`relative rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'border-[3px] border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold shadow-sm whitespace-nowrap">
                Ahorra 42%
              </div>

              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Anual
              </span>
              <div className="mt-1 flex items-baseline justify-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {annualTotalDisplay}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {annualMonthlyEquivalent} / mes
              </span>
            </button>
          </div>

          {/* Tabs de Métodos de Pago */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
                {/* Tab Tarjeta */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('card')
                    setCardError(null)
                  }}
                  className={`flex items-center gap-1.5 pb-2 text-xs sm:text-sm font-bold transition shrink-0 ${
                    selectedMethod === 'card'
                      ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Tarjeta</span>
                </button>

                {/* Tab Yape / WhatsApp */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('yape')
                    setCardError(null)
                  }}
                  className={`flex items-center gap-1.5 pb-2 text-xs sm:text-sm font-bold transition shrink-0 ${
                    selectedMethod === 'yape'
                      ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>{isPEN ? 'Yape / Plin' : 'WhatsApp VIP'}</span>
                </button>

                {/* Tab PayPal */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('paypal')
                    setCardError(null)
                  }}
                  className={`flex items-center gap-1 pb-2 text-xs sm:text-sm font-bold transition shrink-0 ${
                    selectedMethod === 'paypal'
                      ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="font-extrabold italic text-blue-600 tracking-tighter">PayPal</span>
                </button>

                {/* Tab Licencia */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('code')
                    setCardError(null)
                  }}
                  className={`flex items-center gap-1.5 pb-2 text-xs sm:text-sm font-bold transition shrink-0 ${
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

            {/* Vista Tarjeta */}
            {selectedMethod === 'card' && (
              <div className="space-y-4 pt-1">
                {/* Banner de seguridad y tarjetas aceptadas */}
                <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-bold text-sm">Pago Seguro con Tarjeta</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-800 font-bold text-[10px]">
                      {currentCurrency.flag} {currentCurrency.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                    Aceptamos todas las tarjetas de crédito y débito con cifrado bancario SSL de 256 bits. Al completar tu pago en la pasarela oficial, tu cuenta se mejorará a <strong>Premium</strong> automáticamente en tiempo real.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                    <span>💳 Visa</span>
                    <span>•</span>
                    <span>💳 Mastercard</span>
                    <span>•</span>
                    <span>💳 American Express</span>
                    <span>•</span>
                    <span>📱 Apple Pay / Google Pay</span>
                  </div>
                </div>

                {cardError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{cardError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleUpgradeSubmit}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-[#e5322d] hover:bg-[#c92520] active:scale-[0.99] shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Conectando pasarela...</span>
                    </>
                  ) : (
                    <span>Pagar con Tarjeta Segura ({currentPriceDisplay})</span>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  🔒 Procesado mediante pasarela bancaria certificada PCI-DSS Nivel 1.
                </p>
              </div>
            )}

            {/* Vista Yape / WhatsApp */}
            {selectedMethod === 'yape' && (
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">
                      {isPEN ? 'Pago con Yape, Plin o Transferencia (Perú)' : 'Asistente VIP por WhatsApp'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-800 font-bold text-[10px]">
                      {currentCurrency.flag} {currentCurrency.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Total a pagar: <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{currentPriceDisplay}</strong>. Te enviaremos tu Clave de Licencia PRO al confirmar tu pago en 1 minuto.
                  </p>
                </div>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all text-center flex items-center justify-center gap-2 text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isPEN ? `Pagar ${currentPriceDisplay} por Yape / WhatsApp` : `Coordinar Pago ${currentPriceDisplay}`}</span>
                </a>
              </div>
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
                  <span>Pagar con PayPal ({currentPriceDisplay})</span>
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verificando licencia...</span>
                    </>
                  ) : (
                    <span>Activar Licencia Ahora</span>
                  )}
                </button>
              </div>
            )}

            {/* Reaseguros estilo iLovePDF */}
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

          {/* Divisor y Sellos de Seguridad */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <span>Seguro. Privado. Bajo tu control</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

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

        {/* Tabla Comparativa */}
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

        {/* FAQ */}
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
