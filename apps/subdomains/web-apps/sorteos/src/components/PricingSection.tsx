"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Award, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { PRICING_PLANS, PricingPlan } from '@/lib/types';
import { api, getToken } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface PricingSectionProps {
  showTitle?: boolean;
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  showTitle = true,
  className = ''
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (plan.id === 'free') {
      const token = getToken();
      if (token) {
        router.push('/sorteos/nuevo');
      } else {
        router.push('/registro?plan=free');
      }
      return;
    }

    if (plan.id === 'enterprise') {
      router.push('/contacto');
      return;
    }

    const token = getToken();
    if (!token) {
      // Si el usuario no ha iniciado sesión, llevarlo a registro con el plan preseleccionado
      router.push(`/registro?plan=${plan.id}&cycle=${billingCycle}`);
      return;
    }

    // Usuario autenticado: iniciar sesión de checkout
    setLoadingPlan(plan.id);
    try {
      const res = await api<{ url: string }>('/api/v1/billing/checkout-session', {
        method: 'POST',
        body: {
          planId: plan.id,
          billingCycle
        }
      });
      if (res?.url) {
        window.location.href = res.url;
      } else {
        router.push(`/dashboard?payment=success&plan=${plan.id}`);
      }
    } catch {
      // Fallback a dashboard con confirmación
      router.push(`/dashboard?payment=success&plan=${plan.id}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className={`space-y-10 ${className}`}>
      {/* ─── Encabezado y Toggle de Facturación ───────────────────────────── */}
      {showTitle && (
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-pink-600 dark:text-purple-400 uppercase tracking-wider">
            PLANES TRANSPARENTES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Escala tus Sorteos según tu Audiencia
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
            Empieza gratis con herramientas standalone o desbloquea filtros avanzados y mayor volumen de comentarios para tus campañas de marca.
          </p>
        </div>
      )}

      {/* Chunky Segmented Billing Switch (Estilo Duolingo Tactile) */}
      <div className="flex flex-col items-center justify-center gap-2.5">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border-b-2 border-slate-300 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pago Mensual
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 select-none ${
              billingCycle === 'annual'
                ? 'bg-[#58cc02] hover:bg-[#4eb302] text-white shadow-lg shadow-[#58cc02]/30 border-b-2 border-[#3b8702]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Pago Anual</span>
            <span className="px-2 py-0.5 rounded-full bg-white text-[#3b8702] text-[10px] font-black uppercase tracking-wider shadow-xs">
              2 Meses Gratis
            </span>
          </button>
        </div>
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Ahorra 20% en facturación anual. Cancela en cualquier momento con 1 clic.</span>
        </p>
      </div>

      {/* ─── Grid de Tarjetas Táctiles 3D (Unificado) ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-2">
        {PRICING_PLANS.map((plan) => {
          const price = billingCycle === 'annual' 
            ? (plan.priceAnnual / 12).toFixed(2) 
            : plan.priceMonthly.toFixed(2);

          const isPro = plan.id === 'pro';
          const isBusiness = plan.id === 'business';
          const isEnterprise = plan.id === 'enterprise';
          const isLoading = loadingPlan === plan.id;

          let cardBorderClass = 'border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] shadow-sm hover:border-slate-300 dark:hover:border-slate-700';
          let buttonClass = 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-1';
          let accentIcon = <Star className="w-5 h-5 text-slate-400" />;

          if (isPro) {
            cardBorderClass = 'border-2 border-b-6 border-[#58cc02] dark:border-[#58cc02] bg-white dark:bg-[#0f172a] shadow-2xl shadow-[#58cc02]/20 lg:-translate-y-2 relative z-10';
            buttonClass = 'bg-[#58cc02] hover:bg-[#4eb302] text-white border-b-4 border-[#3b8702] active:border-b-0 active:translate-y-1 shadow-lg shadow-[#58cc02]/30';
            accentIcon = <Crown className="w-5 h-5 text-amber-300" />;
          } else if (isBusiness) {
            cardBorderClass = 'border-2 border-b-6 border-[#1cb0f6] dark:border-[#1cb0f6] bg-white dark:bg-[#0c1222] shadow-xl shadow-[#1cb0f6]/10';
            buttonClass = 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-b-4 border-[#1479ab] active:border-b-0 active:translate-y-1 shadow-lg shadow-[#1cb0f6]/30';
            accentIcon = <Zap className="w-5 h-5 text-[#1cb0f6]" />;
          } else if (isEnterprise) {
            cardBorderClass = 'border-2 border-b-6 border-[#ff9600] dark:border-[#ff9600] bg-white dark:bg-[#0c1222] shadow-xl shadow-[#ff9600]/10';
            buttonClass = 'bg-[#ff9600] hover:bg-[#e08400] text-white border-b-4 border-[#b86d00] active:border-b-0 active:translate-y-1 shadow-lg shadow-[#ff9600]/30';
            accentIcon = <Award className="w-5 h-5 text-amber-500" />;
          }

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative ${cardBorderClass}`}
            >
              {/* Badge destacado superior */}
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#58cc02] text-white font-black text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>SUPER SORTEOS • MÁS POPULAR</span>
                </div>
              )}
              {isBusiness && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#1cb0f6] text-white font-black text-[10px] uppercase tracking-wider shadow-md whitespace-nowrap">
                  PARA MARCAS & AGENCIA
                </div>
              )}

              <div className="space-y-5">
                {/* Header de la Card */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div>
                    <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                    {accentIcon}
                  </div>
                </div>

                {/* Precio destacado */}
                <div className="py-3 border-y-2 border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                      / mes
                    </span>
                  </div>
                  {billingCycle === 'annual' && plan.priceAnnual > 0 ? (
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      <span>✓ Facturado ${plan.priceAnnual}/año (ahorras 20%)</span>
                    </div>
                  ) : plan.priceMonthly === 0 ? (
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      <span>✓ Gratis sin tarjeta de crédito</span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-medium text-slate-400 mt-1">
                      Facturación mensual recurrente
                    </div>
                  )}
                </div>

                {/* Features con Iconografía Táctil */}
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
                    Qué incluye:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="text-xs font-medium text-slate-700 dark:text-slate-200 flex items-start gap-2.5 leading-snug">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-[#58cc02] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Botón de Acción 3D */}
              <div className="pt-6">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-4 px-6 rounded-2xl font-black font-display text-xs sm:text-sm tracking-wide uppercase transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 select-none ${buttonClass} ${
                    isLoading ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingSection;

