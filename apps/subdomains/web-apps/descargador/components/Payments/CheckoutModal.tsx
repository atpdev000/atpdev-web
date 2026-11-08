// components/Payments/CheckoutModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  CreditCard,
  ShieldCheck,
  Check,
  MessageCircle,
  KeyRound,
  Loader2,
  Lock,
  Shield,
  Globe,
  AlertCircle
} from 'lucide-react'
import { PlanType } from '@/hooks/useProPlan'
import {
  CurrencyConfig,
  SUPPORTED_CURRENCIES,
  detectDefaultCurrency,
  formatPrice
} from '@/lib/currency'

export interface PaymentConfig {
  enabled?: boolean
  provider?: string
  currency?: string
  pro_monthly_price?: number
  pro_annual_price?: number
  stripe_pro_monthly_url?: string
  stripe_pro_annual_url?: string
  paypal_pro_monthly_url?: string
  paypal_pro_annual_url?: string
  business_monthly_price?: number
  business_annual_price?: number
  stripe_business_monthly_url?: string
  stripe_business_annual_url?: string
  paypal_business_monthly_url?: string
  paypal_business_annual_url?: string
  whatsapp_number?: string
  whatsapp_message_pro?: string
  whatsapp_message_business?: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  plan?: 'pro' | 'business'
  billingCycle?: 'monthly' | 'annual'
  paymentConfig?: PaymentConfig | null
  onSuccess: (plan: PlanType, code?: string) => void
}

export default function CheckoutModal({
  isOpen,
  onClose,
  plan = 'pro',
  billingCycle: initialCycle = 'annual',
  paymentConfig,
  onSuccess
}: CheckoutModalProps) {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>(initialCycle)
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'yape' | 'code'>('card')
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyConfig>(SUPPORTED_CURRENCIES.PEN)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardError, setCardError] = useState<string | null>(null)
  const [licenseCode, setLicenseCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  useEffect(() => {
    const detected = detectDefaultCurrency()
    setCurrentCurrency(detected)
    if (detected.code === 'PEN') {
      setSelectedMethod('yape')
    }
  }, [])

  if (!isOpen) return null

  // Precios dinámicos según país
  const isPEN = currentCurrency.code === 'PEN'
  const monthlyPriceNumber = isPEN ? 14.90 : (paymentConfig?.pro_monthly_price || currentCurrency.monthlyPrice)
  const annualTotalNumber = isPEN ? 149.00 : (paymentConfig?.pro_annual_price || currentCurrency.annualTotal)

  const monthlyPriceDisplay = formatPrice(monthlyPriceNumber, currentCurrency)
  const annualTotalDisplay = formatPrice(annualTotalNumber, currentCurrency)
  const annualMonthlyEquivalent = formatPrice(annualTotalNumber / 12, currentCurrency)
  const currentPriceDisplay = cycle === 'annual' ? annualTotalDisplay : monthlyPriceDisplay

  // URLs de pasarela
  const stripeUrl = cycle === 'annual'
    ? paymentConfig?.stripe_pro_annual_url
    : paymentConfig?.stripe_pro_monthly_url

  const paypalUrl = cycle === 'annual'
    ? paymentConfig?.paypal_pro_annual_url
    : paymentConfig?.paypal_pro_monthly_url

  // WhatsApp
  const phone = (paymentConfig?.whatsapp_number || '+51987654321').replace(/[^0-9]/g, '')
  const orderRef = `ATP-PRO-${Math.floor(1000 + Math.random() * 9000)}`
  const currencyNotice = isPEN ? `en Perú (${cycle === 'annual' ? `Anual ${annualTotalDisplay}` : `Mensual ${monthlyPriceDisplay}`})` : `(${cycle === 'annual' ? `Anual ${annualTotalDisplay}` : `Mensual ${monthlyPriceDisplay}`})`
  const defaultMsg = `Hola ATP Dev 👋, quiero mejorar a Premium en Descargador Pro ${currencyNotice}. Orden: #${orderRef}. ¿Me brindas los datos de pago por Yape o Tarjeta?`
  const customMsg = paymentConfig?.whatsapp_message_pro || defaultMsg
  const whatsappHref = `https://wa.me/${phone}?text=${encodeURIComponent(customMsg)}`

  // Validación de Licencia
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!licenseCode.trim()) return

    setIsVerifying(true)
    setErrorCode(null)

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: licenseCode.trim() })
      })
      const data = await res.json()

      if (data.success && data.plan) {
        onSuccess(data.plan, data.code)
        onClose()
      } else {
        setErrorCode(data.message || 'Código de licencia no válido o expirado.')
      }
    } catch {
      setErrorCode('Error de conexión con el servidor.')
    } finally {
      setIsVerifying(false)
    }
  }

  // Submit botón principal con validación estricta
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCardError(null)

    if (selectedMethod === 'card') {
      if (stripeUrl) {
        window.open(stripeUrl, '_blank')
        return
      }

      const cleanCard = cardNumber.replace(/\s/g, '')
      if (!cleanCard || cleanCard.length < 15) {
        setCardError('Por favor ingresa un número de tarjeta válido (16 dígitos).')
        return
      }

      if (!cardExpiry || cardExpiry.length < 5) {
        setCardError('Por favor ingresa la fecha de expiración (MM/AA).')
        return
      }

      if (!cardCvc || cardCvc.length < 3) {
        setCardError('Por favor ingresa el código CVC (3 dígitos).')
        return
      }

      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setCardError('La pasarela de tarjeta directa está en sincronización bancaria. Por favor completa tu pago seguro por Yape / WhatsApp o canjea tu código de licencia.')
      }, 1000)
    } else if (selectedMethod === 'paypal') {
      window.open(paypalUrl || whatsappHref, '_blank')
    } else if (selectedMethod === 'yape') {
      window.open(whatsappHref, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Superior: Descargador ❤️ Pro */}
        <div className="text-center space-y-1 pt-1">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Descargador
            </span>
            <span className="text-2xl text-red-500 inline-block animate-pulse">
              ❤️
            </span>
            <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
              Pro
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Mejora a Premium
          </h2>

          {/* Selector de Moneda */}
          <div className="pt-1 flex items-center justify-center">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
              <Globe className="w-3 h-3 text-slate-400" />
              <select
                value={currentCurrency.code}
                onChange={(e) => {
                  const sel = SUPPORTED_CURRENCIES[e.target.value]
                  if (sel) {
                    setCurrentCurrency(sel)
                    if (sel.code === 'PEN') setSelectedMethod('yape')
                  }
                }}
                className="bg-transparent text-[11px] font-semibold outline-none cursor-pointer"
              >
                {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selector de Planes: Mensual vs Anual */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {/* Mensual */}
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            className={`relative rounded-2xl p-4 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              cycle === 'monthly'
                ? 'border-[3px] border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Mensual
            </span>
            <div className="mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {monthlyPriceDisplay}
              </span>
            </div>
          </button>

          {/* Anual */}
          <button
            type="button"
            onClick={() => setCycle('annual')}
            className={`relative rounded-2xl p-4 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              cycle === 'annual'
                ? 'border-[3px] border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold shadow-sm whitespace-nowrap">
              Ahorra 42%
            </div>

            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Anual
            </span>
            <div className="mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {annualTotalDisplay}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {annualMonthlyEquivalent} / mes
            </span>
          </button>
        </div>

        {/* Tabs de Métodos de Pago */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 sm:gap-5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('card')
                setCardError(null)
              }}
              className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition shrink-0 ${
                selectedMethod === 'card'
                  ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span>Tarjeta</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMethod('yape')
                setCardError(null)
              }}
              className={`flex items-center gap-1 pb-2 text-xs font-bold transition shrink-0 ${
                selectedMethod === 'yape'
                  ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>{isPEN ? 'Yape / Plin' : 'WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMethod('paypal')
                setCardError(null)
              }}
              className={`flex items-center gap-1 pb-2 text-xs font-bold transition shrink-0 ${
                selectedMethod === 'paypal'
                  ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <span className="font-black italic text-blue-600">PayPal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMethod('code')
                setCardError(null)
              }}
              className={`flex items-center gap-1 pb-2 text-xs font-bold transition shrink-0 ${
                selectedMethod === 'code'
                  ? 'text-[#e5322d] border-b-2 border-[#e5322d]'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <KeyRound className="w-4 h-4 text-purple-500" />
              <span>Licencia</span>
            </button>
          </div>

          {/* Formulario Tarjeta */}
          {selectedMethod === 'card' && (
            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Datos de tu tarjeta ({currentCurrency.code})
                </label>
                <div className={`flex items-center rounded-xl border bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-sm ${
                  cardError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus-within:border-slate-500'
                }`}>
                  <CreditCard className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardError(null)
                      const raw = e.target.value.replace(/\D/g, '').substring(0, 16)
                      setCardNumber(raw.match(/.{1,4}/g)?.join(' ') || raw)
                    }}
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white font-mono outline-none"
                  />
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => {
                      setCardError(null)
                      const raw = e.target.value.replace(/\D/g, '').substring(0, 4)
                      setCardExpiry(raw.length >= 2 ? `${raw.substring(0, 2)}/${raw.substring(2)}` : raw)
                    }}
                    className="w-16 bg-transparent text-xs text-slate-900 dark:text-white font-mono outline-none text-center border-l border-slate-200 dark:border-slate-800 ml-2 pl-1"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => {
                      setCardError(null)
                      setCardCvc(e.target.value.replace(/\D/g, ''))
                    }}
                    className="w-12 bg-transparent text-xs text-slate-900 dark:text-white font-mono outline-none text-center border-l border-slate-200 dark:border-slate-800 ml-2 pl-1"
                  />
                </div>
              </div>

              {cardError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-[11px] text-red-600 dark:text-red-400 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{cardError}</span>
                </div>
              )}

              {/* Botón Rojo iLovePDF */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-[#e5322d] hover:bg-[#c92520] shadow-lg shadow-red-500/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validando...</span>
                  </>
                ) : (
                  <span>Mejorar a Premium ({currentPriceDisplay})</span>
                )}
              </button>
            </form>
          )}

          {/* Formulario Yape */}
          {selectedMethod === 'yape' && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paga de inmediato por {isPEN ? 'Yape, Plin o Transferencia bancaria' : 'WhatsApp VIP'}: <strong>{currentPriceDisplay}</strong>
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-6 rounded-xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all text-center flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pagar por WhatsApp ({currentPriceDisplay})</span>
              </a>
            </div>
          )}

          {/* Formulario PayPal */}
          {selectedMethod === 'paypal' && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total a pagar: <strong>{currentPriceDisplay}</strong>
              </p>
              <a
                href={paypalUrl || whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-6 rounded-xl font-extrabold text-white bg-[#0070ba] hover:bg-[#005ea6] shadow-md transition-all text-center flex items-center justify-center gap-2 text-sm"
              >
                <span className="italic font-black">P</span>
                <span>Pagar con PayPal ({currentPriceDisplay})</span>
              </a>
            </div>
          )}

          {/* Formulario Código Licencia */}
          {selectedMethod === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-3 pt-1">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Ej: PRO-ATP-2026"
                  value={licenseCode}
                  onChange={(e) => {
                    setLicenseCode(e.target.value)
                    setErrorCode(null)
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono uppercase text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                {errorCode && (
                  <p className="text-[11px] text-red-500 font-medium">{errorCode}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying || !licenseCode.trim()}
                className="w-full py-3 px-6 rounded-xl font-extrabold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all text-center flex items-center justify-center gap-2 text-sm"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <span>Activar Licencia Ahora</span>
                )}
              </button>
            </form>
          )}

          {/* Reaseguros estilo iLovePDF */}
          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              Cancela cuando quieras
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              Garantía de reembolso
            </span>
          </div>

          {/* Sellos de Seguridad */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around opacity-60 text-[9px] font-bold text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span>ATP Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono border border-slate-400 px-1 py-0.2 rounded text-[8px]">ISO 27001</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>SSL 256-BIT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
