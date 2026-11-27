'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  XCircle,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Loader2,
  ChevronDown,
  X,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { COLOREAR_PLANS, ColorearPlan } from '@/lib/plans';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import InlineNotice from './InlineNotice';

export default function PlanesClient() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const { isEn } = useLanguage();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<ColorearPlan | null>(null);
  const [payMethod, setPayMethod] = useState<'stripe' | 'yape'>('stripe');
  const [yapeApp, setYapeApp] = useState<'yape' | 'plin'>('yape');
  const [operationCode, setOperationCode] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{
    tone: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSelectPlan = (plan: ColorearPlan) => {
    setNotice(null);
    if (plan.id === 'free') {
      router.push(user ? '/estudio-kdp' : '/cuenta?mode=register');
      return;
    }
    if (!user) {
      router.push(`/cuenta?mode=register&plan=${plan.id}&cycle=${billingCycle}`);
      return;
    }
    setSelectedPlan(plan);
    setPayMethod(isEn ? 'stripe' : 'yape');
  };

  const handleStripeCheckout = async () => {
    if (!selectedPlan) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await fetch('/api/billing/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle: selectedPlan.mode === 'payment' ? 'one_time' : billingCycle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          tone: 'error',
          title: isEn ? 'Checkout error' : 'Error al iniciar pago',
          message: data.error || (isEn ? 'Please try again.' : 'Inténtalo nuevamente.'),
        });
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      // Si STRIPE_SECRET_KEY aún no está activo, cambia limpiamente a pestaña Yape/Plin con aviso claro
      setPayMethod('yape');
      setNotice({
        tone: 'info',
        title: isEn ? 'Stripe card checkout pending activation' : 'Pago con tarjeta en configuración',
        message:
          data.message ||
          (isEn
            ? 'Card checkout activates once STRIPE_SECRET_KEY is enabled. You can complete activation via Yape/Plin or contact support.'
            : 'Puedes completar tu activación inmediata mediante Yape o Plin aquí mismo.'),
      });
    } catch {
      setNotice({
        tone: 'error',
        title: isEn ? 'Connection error' : 'Error de conexión',
        message: isEn ? 'Could not contact checkout server.' : 'No pudimos conectar con el servidor de pagos.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleYapeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await fetch('/api/billing/yape-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          method: yapeApp,
          billingCycle: selectedPlan.mode === 'payment' ? 'one_time' : billingCycle,
          operationCode: operationCode.trim(),
          payerPhone: payerPhone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          tone: 'warning',
          title: isEn ? 'Check voucher details' : 'Revisa los datos del comprobante',
          message: data.error || 'Ingresa el número de operación.',
        });
        return;
      }

      await refresh();
      setOperationCode('');
      setPayerPhone('');
      setSelectedPlan(null);
      setNotice({
        tone: 'success',
        title: isEn ? `Order ${data.order?.orderCode} submitted` : `Orden ${data.order?.orderCode} registrada`,
        message: data.message,
      });
    } catch {
      setNotice({
        tone: 'error',
        title: isEn ? 'Error' : 'Error al registrar orden',
        message: isEn ? 'Could not submit order.' : 'Inténtalo nuevamente en unos segundos.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const comparisonRows = isEn
    ? [
        { name: 'Free 300 DPI PDF library & online coloring', free: true, creador: true, editorial: true },
        { name: 'AI illustrations included', free: '15 signup + daily fair quota', creador: '120 non-expiring', editorial: '400 / month' },
        { name: 'Bypass daily IP limit', free: false, creador: true, editorial: true },
        { name: 'Bulk upload own ChatGPT/Canva drawings', free: 'Up to 60/book', creador: 'Up to 60/book', editorial: 'Up to 60/book' },
        { name: '300 DPI Interior PDF + blank verso pages', free: true, creador: true, editorial: true },
        { name: 'KDP Spine Calculator & Full-Wrap Cover PDF', free: true, creador: true, editorial: true },
        { name: 'Priority HD image engine (when enabled)', free: false, creador: true, editorial: true },
        { name: 'Direct KDP trim & margin support', free: 'Guides', creador: 'Email / WhatsApp', editorial: 'Priority VIP' },
      ]
    : [
        { name: 'Biblioteca 300 DPI PDF y coloreador online', free: true, creador: true, editorial: true },
        { name: 'Créditos IA incluidos', free: '15 al crear cuenta + cuota diaria', creador: '120 sin caducidad', editorial: '400 cada mes' },
        { name: 'Sin tope diario por IP', free: false, creador: true, editorial: true },
        { name: 'Carga masiva de dibujos propios (ChatGPT/Canva)', free: 'Hasta 60/libro', creador: 'Hasta 60/libro', editorial: 'Hasta 60/libro' },
        { name: 'Compilador PDF Interior 300 DPI + reversos', free: true, creador: true, editorial: true },
        { name: 'Calculadora de lomo + Portada completa KDP', free: true, creador: true, editorial: true },
        { name: 'Motor de ilustración HD prioritario', free: false, creador: true, editorial: true },
        { name: 'Soporte técnico de márgenes y KDP', free: 'Guías', creador: 'Correo / WhatsApp', editorial: 'Prioritario VIP' },
      ];

  const faqs = isEn
    ? [
        {
          q: 'Do Creator Pack credits expire?',
          a: 'Never. One-time credit packs stay in your account permanently until you use them across as many coloring books as you want.',
        },
        {
          q: 'Can I still compile books for free using my own ChatGPT or Midjourney art?',
          a: 'Yes! Uploading your own images (up to 60 per book), cleaning them to pure B&W 300 DPI, adding blank verso pages, and exporting both Interior and Full-Wrap Cover PDFs is 100% free.',
        },
        {
          q: 'How do payments work internationally and in Peru?',
          a: 'International buyers can pay in USD via Stripe Checkout (Visa, Mastercard, Apple Pay). Users in Peru can pay in Soles via Yape or Plin with instant order tracking inside /cuenta.',
        },
      ]
    : [
        {
          q: '¿Los créditos del Pack Creador KDP caducan?',
          a: 'Nunca. El Pack Creador (S/ 29 / $9) es un pago único y tus 120 créditos permanecen en tu cuenta sin fecha de vencimiento.',
        },
        {
          q: '¿Puedo armar libros gratis subiendo mis propios dibujos de ChatGPT o Midjourney?',
          a: 'Sí. Subir tus propias imágenes (hasta 60 por libro), limpiarlas a blanco y negro puro 300 DPI, agregar reversos anti-traspaso y exportar el interior y la portada con lomo es totalmente gratuito.',
        },
        {
          q: '¿Cómo funcionan los pagos por Yape/Plin y con tarjeta Stripe?',
          a: 'Igual que en Sorteos Pro: puedes pagar con tarjeta internacional vía Stripe Checkout (USD) con acreditación automática o pagar en soles con Yape/Plin registrando tu número de operación para acreditar tus créditos en minutos.',
        },
      ];

  const selectedAmountUsd = selectedPlan
    ? selectedPlan.mode === 'subscription' && billingCycle === 'annual'
      ? selectedPlan.priceUsdAnnual
      : selectedPlan.priceUsdMonthly
    : 0;
  const selectedAmountPen = selectedPlan
    ? selectedPlan.mode === 'subscription' && billingCycle === 'annual'
      ? selectedPlan.pricePenAnnual
      : selectedPlan.pricePenMonthly
    : 0;

  return (
    <div className="space-y-14">
      <header className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isEn ? 'Colorear Pro • Transparent KDP Credits' : 'Colorear Pro • Créditos y Membresías KDP'}</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-zinc-900 dark:text-white tracking-tight">
          {isEn
            ? 'Start free and scale when you publish on Amazon KDP'
            : 'Empieza gratis y escala cuando publiques en Amazon KDP'}
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-300 leading-relaxed">
          {isEn
            ? 'The printable library and 300 DPI PDF KDP compiler are free. Credit packs power high-volume AI page generation with zero hidden subscriptions.'
            : 'La biblioteca pública y el compilador PDF 300 DPI son gratis. Los paquetes de créditos desbloquean generación IA prioritaria sin límites diarios por IP.'}
        </p>

        {/* Billing Cycle Toggle (Estilo Sorteos Pro) */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-200/80 dark:bg-slate-900 border border-zinc-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-slate-400'
              }`}
            >
              {isEn ? 'Monthly billing' : 'Pago Mensual'}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-slate-400'
              }`}
            >
              <span>{isEn ? 'Annual billing' : 'Pago Anual'}</span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-300 text-zinc-950 text-[10px] font-black">
                -20%
              </span>
            </button>
          </div>
          {user && (
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? `Signed in as ${user.email} • Current balance: ${user.credits} credits`
                  : `Conectado como ${user.email} • Saldo actual: ${user.credits} créditos`}
              </span>
            </p>
          )}
        </div>
      </header>

      {notice && (
        <div className="max-w-3xl mx-auto">
          <InlineNotice
            tone={notice.tone}
            title={notice.title}
            message={notice.message}
            onClose={() => setNotice(null)}
          />
        </div>
      )}

      {/* 3 Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {COLOREAR_PLANS.map((plan) => {
          const copy = isEn ? plan.en : plan.es;
          const isAnnualSub = plan.mode === 'subscription' && billingCycle === 'annual';
          const displayUsd = isAnnualSub ? Math.round((plan.priceUsdAnnual / 12) * 10) / 10 : plan.priceUsdMonthly;
          const displayPen = isAnnualSub ? Math.round(plan.pricePenAnnual / 12) : plan.pricePenMonthly;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 ${
                plan.highlight
                  ? 'bg-zinc-950 text-white border-2 border-yellow-300 shadow-xl'
                  : 'sheet-card bg-white dark:bg-slate-900 text-zinc-900 dark:text-white'
              }`}
            >
              <div className="space-y-4">
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                    plan.highlight
                      ? 'bg-yellow-300 text-zinc-950'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {copy.badge}
                </span>

                <div>
                  <h2 className="font-display font-bold text-2xl">{copy.name}</h2>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-bold text-3xl sm:text-4xl">
                      {plan.id === 'free'
                        ? isEn
                          ? '$0'
                          : 'S/ 0 / $0'
                        : isEn
                          ? `$${displayUsd}`
                          : `S/ ${displayPen} / $${displayUsd}`}
                    </span>
                    {plan.mode === 'subscription' && (
                      <span className={`text-xs font-semibold ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        /{isEn ? 'mo' : 'mes'}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500 dark:text-slate-400'}`}>
                    {isAnnualSub
                      ? isEn
                        ? `Billed $${plan.priceUsdAnnual}/yr (save 20%)`
                        : `Facturado S/ ${plan.pricePenAnnual} / $${plan.priceUsdAnnual} al año (ahorras 20%)`
                      : copy.periodLabel}
                  </p>
                </div>

                <p className={`text-xs leading-relaxed ${plan.highlight ? 'text-zinc-300' : 'text-zinc-600 dark:text-slate-300'}`}>
                  {copy.tagline}
                </p>

                <ul className="space-y-2.5 text-xs pt-2">
                  {copy.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.highlight ? 'text-yellow-300' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-center inline-flex items-center justify-center gap-2 cursor-pointer ${
                  plan.highlight ? 'btn-studio-sun' : 'btn-studio-primary'
                }`}
              >
                {plan.highlight ? <Sparkles className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                <span>{copy.ctaLabel}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix (Estilo Sorteos Pro) */}
      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 overflow-hidden">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
            {isEn ? 'Compare all features side by side' : 'Compara todas las funciones frente a frente'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-slate-400">
            {isEn
              ? 'Every plan outputs clean 300 DPI PDFs with zero watermarks.'
              : 'Todos los planes exportan PDFs limpios de 300 DPI sin marca de agua.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-slate-800">
                <th className="py-3 px-3 font-bold text-zinc-500 uppercase">{isEn ? 'Feature' : 'Característica'}</th>
                <th className="py-3 px-3 text-center font-bold text-zinc-700 dark:text-slate-300">Free</th>
                <th className="py-3 px-3 text-center font-bold text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/30 rounded-t-xl">
                  {isEn ? 'Creator Pack' : 'Pack Creador'}
                </th>
                <th className="py-3 px-3 text-center font-bold text-zinc-700 dark:text-slate-300">
                  {isEn ? 'Studio Pro' : 'Estudio Pro'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-slate-800/70">
              {comparisonRows.map((row) => (
                <tr key={row.name}>
                  <td className="py-3.5 px-3 font-semibold text-zinc-800 dark:text-slate-200">{row.name}</td>
                  {[row.free, row.creador, row.editorial].map((val, idx) => (
                    <td
                      key={idx}
                      className={`py-3.5 px-3 text-center font-semibold ${
                        idx === 1 ? 'bg-blue-50/40 dark:bg-blue-950/20 text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-slate-400'
                      }`}
                    >
                      {typeof val === 'boolean' ? (
                        val ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-zinc-300 dark:text-slate-700 mx-auto" />
                        )
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto space-y-4">
        <h2 className="font-display font-bold text-2xl text-center text-zinc-900 dark:text-white">
          {isEn ? 'Frequently Asked Questions' : 'Preguntas Frecuentes sobre Pagos y Créditos'}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="sheet-card rounded-2xl bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer"
                >
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-600 dark:text-slate-300 leading-relaxed border-t border-zinc-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
              {isEn ? 'Flexible global & Peru payments' : 'Pagos flexibles para Perú, LATAM y mercado global'}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {isEn
                ? 'Pay securely in USD via Stripe Checkout or in PEN via Yape/Plin. Track every order and credit balance in real time from your account dashboard.'
                : 'Paga con tarjeta en USD mediante Stripe Checkout (mismo motor seguro de Sorteos Pro) o en soles con Yape/Plin y consulta el estado de tus créditos desde /cuenta.'}
            </p>
          </div>
        </div>
        <Link
          href="/cuenta"
          className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-slate-700 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-slate-800 shrink-0"
        >
          {isEn ? 'Open my account' : 'Ir a mi cuenta'}
        </Link>
      </section>

      {/* CHECKOUT MODAL (Stripe + Yape/Plin) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-zinc-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-2 border-zinc-900 dark:border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-yellow-300">
                  {isEn ? 'Secure Checkout' : 'Activar Créditos Pro'}
                </p>
                <h3 className="font-display font-bold text-lg">
                  {isEn ? selectedPlan.en.name : selectedPlan.es.name} (+{selectedPlan.credits}{' '}
                  {isEn ? 'credits' : 'créditos'})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                aria-label="Cerrar"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Método selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('stripe')}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    payMethod === 'stripe'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-slate-700 text-zinc-600 dark:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isEn ? `Card / Stripe ($${selectedAmountUsd})` : `Tarjeta Stripe ($${selectedAmountUsd})`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('yape')}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    payMethod === 'yape'
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                      : 'border-zinc-200 dark:border-slate-700 text-zinc-600 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Yape / Plin (S/ {selectedAmountPen})</span>
                </button>
              </div>

              {payMethod === 'stripe' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{isEn ? 'Account' : 'Cuenta'}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{isEn ? 'Credits to add' : 'Créditos a acreditar'}</span>
                      <span className="font-bold text-emerald-600">+{selectedPlan.credits}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-slate-800 text-sm">
                      <span className="font-bold text-zinc-900 dark:text-white">Total USD</span>
                      <span className="font-display font-bold text-zinc-900 dark:text-white">${selectedAmountUsd} USD</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleStripeCheckout}
                    className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    <span>{isEn ? 'Continue to Stripe Checkout' : 'Continuar a pago seguro Stripe'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleYapeOrder} className="space-y-4">
                  <div className="rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-900 dark:text-violet-200">
                        {isEn ? 'Step 1: Send exact amount' : 'Paso 1: Transfiere el monto exacto'}
                      </span>
                      <span className="font-display font-bold text-base text-violet-900 dark:text-white">
                        S/ {selectedAmountPen}.00
                      </span>
                    </div>
                    <p className="text-violet-800 dark:text-violet-300 leading-relaxed">
                      Titular: <strong>Percy Acha Taipe (ATP Dev Perú)</strong> • Concepto:{' '}
                      <strong>Colorear Pro ({user?.email})</strong>. Luego registra abajo tu número de operación
                      para acreditar tus <strong>+{selectedPlan.credits} créditos</strong> en tu cuenta.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setYapeApp('yape')}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        yapeApp === 'yape'
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-300'
                      }`}
                    >
                      Yape
                    </button>
                    <button
                      type="button"
                      onClick={() => setYapeApp('plin')}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        yapeApp === 'plin'
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-300'
                      }`}
                    >
                      Plin
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
                        N° de operación *
                      </label>
                      <input
                        type="text"
                        required
                        minLength={4}
                        value={operationCode}
                        onChange={(e) => setOperationCode(e.target.value)}
                        placeholder="Ej. 08451923"
                        className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
                        Tu celular / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        placeholder="Ej. 987 654 321"
                        className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold btn-studio-sun flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Registrar comprobante y activar créditos</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

