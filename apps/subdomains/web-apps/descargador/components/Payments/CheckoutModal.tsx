// components/Payments/CheckoutModal.tsx
'use client'

import React, { useState } from 'react'
import {
  X,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Crown,
  Check,
  MessageCircle,
  KeyRound,
  ExternalLink,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react'
import { PlanType } from '@/hooks/useProPlan'

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
  plan: 'pro' | 'business'
  billingCycle: 'monthly' | 'annual'
  paymentConfig?: PaymentConfig | null
  onSuccess: (plan: PlanType, code?: string) => void
}

export default function CheckoutModal({
  isOpen,
  onClose,
  plan,
  billingCycle,
  paymentConfig,
  onSuccess
}: CheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'whatsapp' | 'code'>('card')
  const [licenseCode, setLicenseCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  if (!isOpen) return null

  const isPro = plan === 'pro'
  const planTitle = isPro ? 'Pro Creador' : 'Business VIP'

  // Precios
  const monthlyPrice = isPro
    ? (paymentConfig?.pro_monthly_price || 3.99)
    : (paymentConfig?.business_monthly_price || 11.99)

  const annualTotal = isPro
    ? (paymentConfig?.pro_annual_price || 47.90)
    : (paymentConfig?.business_annual_price || 139.90)

  const displayPrice = billingCycle === 'annual' ? `$${annualTotal}` : `$${monthlyPrice}`
  const displayPeriod = billingCycle === 'annual' ? '/ año completo' : '/ mes'

  // URLs de pasarela
  const stripeUrl = isPro
    ? (billingCycle === 'annual' ? paymentConfig?.stripe_pro_annual_url : paymentConfig?.stripe_pro_monthly_url)
    : (billingCycle === 'annual' ? paymentConfig?.stripe_business_annual_url : paymentConfig?.stripe_business_monthly_url)

  const paypalUrl = isPro
    ? (billingCycle === 'annual' ? paymentConfig?.paypal_pro_annual_url : paymentConfig?.paypal_pro_monthly_url)
    : (billingCycle === 'annual' ? paymentConfig?.paypal_business_annual_url : paymentConfig?.paypal_business_monthly_url)

  // WhatsApp
  const phone = (paymentConfig?.whatsapp_number || '+51987654321').replace(/[^0-9]/g, '')
  const orderRef = `ATP-${plan.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
  const defaultMsg = isPro
    ? `Hola ATP Dev 👋, quiero activar el Plan Pro Creador (${billingCycle === 'annual' ? 'Facturación Anual $47.90' : 'Mensual $3.99'}). Orden: #${orderRef}. ¿Me brindas los datos de pago por Yape, Plin o Transferencia?`
    : `Hola ATP Dev 👋, quiero activar el Plan Business VIP (${billingCycle === 'annual' ? 'Facturación Anual $139.90' : 'Mensual $11.99'}). Orden: #${orderRef}. ¿Me brindas la información de pago y activación?`

  const customMsg = isPro
    ? (paymentConfig?.whatsapp_message_pro || defaultMsg)
    : (paymentConfig?.whatsapp_message_business || defaultMsg)

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
      setErrorCode('Error al conectar con el servidor. Intenta de nuevo.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 animate-scale-in">
        {/* Cabecera del modal */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {isPro ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Activar {planTitle}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">
                  {billingCycle === 'annual' ? 'Anual -20%' : 'Mensual'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Total a pagar: <strong className="text-amber-400 text-sm">{displayPrice}</strong> {displayPeriod}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del modal */}
        <div className="p-6 space-y-5">
          {/* Selector de Métodos de Pago */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Selecciona tu método de pago preferido:</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {/* Tarjeta */}
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'card'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] font-bold">Tarjeta / Stripe</span>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setSelectedMethod('paypal')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="font-extrabold text-blue-400 text-sm">P</span>
                <span className="text-[11px] font-bold">PayPal</span>
              </button>

              {/* Yape / WhatsApp */}
              <button
                type="button"
                onClick={() => setSelectedMethod('whatsapp')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-[11px] font-bold">Yape / WhatsApp</span>
              </button>

              {/* Código Licencia */}
              <button
                type="button"
                onClick={() => setSelectedMethod('code')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'code'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-5 h-5 text-purple-400" />
                <span className="text-[11px] font-bold">Canjear Código</span>
              </button>
            </div>
          </div>

          {/* Vistas según método seleccionado */}
          {selectedMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Pago Seguro 256-bit SSL con Stripe
                </span>
                <span>Visa • Mastercard • Amex</span>
              </div>

              {stripeUrl ? (
                <a
                  href={stripeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-center text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                >
                  <span>Pagar {displayPrice} con Tarjeta</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Puedes procesar tu pago de inmediato contactando a nuestro equipo de ventas automatizado por WhatsApp o canjeando tu código de activación.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs text-center text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Pagar con Tarjeta por WhatsApp (Asistente VIP)</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'paypal' && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Checkout Internacional PayPal
                </span>
                <span>Saldo o Tarjeta</span>
              </div>

              {paypalUrl ? (
                <a
                  href={paypalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-center text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition"
                >
                  <span>Pagar {displayPrice} con PayPal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Solicita tu link de PayPal directo o cuenta comercial escribiéndonos por WhatsApp.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs text-center text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Solicitar Link PayPal por WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'whatsapp' && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Pago Inmediato con Yape, Plin o Transferencia (Perú y Latam)
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Realiza el pago por tu app bancaria favorita y te enviaremos tu <strong>Código de Licencia PRO</strong> para activación instantánea.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan Seleccionado:</span>
                  <span className="font-semibold text-white">{planTitle} ({billingCycle === 'annual' ? 'Anual' : 'Mensual'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Importe:</span>
                  <span className="font-bold text-emerald-400">{displayPrice} {displayPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Referencia de Orden:</span>
                  <span className="font-mono text-amber-400">#{orderRef}</span>
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-center text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp y Coordinar Pago</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}

          {selectedMethod === 'code' && (
            <form onSubmit={handleVerifyCode} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-purple-400" />
                  ¿Ya tienes un Código de Activación o Licencia?
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ingresa tu código de licencia obtenido por WhatsApp, promoción o compra directa para desbloquear las funciones PRO inmediatamente.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Ej: PRO-ATP-2026"
                  value={licenseCode}
                  onChange={(e) => {
                    setLicenseCode(e.target.value)
                    setErrorCode(null)
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm tracking-wider uppercase focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                />

                {errorCode && (
                  <p className="text-xs text-red-400 font-medium">
                    {errorCode}
                  </p>
                )}
                
                <p className="text-[10px] text-slate-500">
                  Tip de prueba rápida: Puedes usar el código de prueba <code className="text-purple-400">PRO-ATP-2026</code> o <code className="text-purple-400">VIP-ATP-2026</code>.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || !licenseCode.trim()}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando licencia...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Activar Licencia Ahora</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Garantía */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Garantía de satisfacción total 7 días o te devolvemos el 100% de tu dinero.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
