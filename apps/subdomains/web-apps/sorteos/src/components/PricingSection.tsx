"use client";

import React, { useEffect, useState } from 'react';
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
  Loader2,
  Sparkles,
  CreditCard,
  Smartphone,
  KeyRound,
  MessageCircle,
  Copy,
  ExternalLink,
  X,
  Download,
  ShieldCheck
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
  const { t, tUi } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);
  const [payTab, setPayTab] = useState<'yape' | 'card' | 'license'>('yape');
  const [yapeApp, setYapeApp] = useState<'yape' | 'plin'>('yape');
  const [operationCode, setOperationCode] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [yapeSubmitting, setYapeSubmitting] = useState(false);
  const [yapeFeedback, setYapeFeedback] = useState<{ type: 'ok' | 'err'; text: string; orderCode?: string } | null>(null);
  const [licenseCode, setLicenseCode] = useState('');
  const [licenseMsg, setLicenseMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [payCfg, setPayCfg] = useState({
    stripeApiConfigured: false,
    whatsappNumber: '51987006572',
    yapePhoneDisplay: '987 006 572',
    yapeHolder: 'Percy Acha Taipe (ATP Dev Perú)',
    yapeQrUrl: '/yape-qr.jpg',
    stripeMonthlyUrl: 'https://buy.stripe.com/test_5kQdR94GigfOeqxgJ51kA01',
    stripeAnnualUrl: 'https://buy.stripe.com/test_dRm8wPa0Cd3C2HPakH1kA00',
    stripeBusinessMonthlyUrl: '',
    stripeBusinessAnnualUrl: '',
    mercadopagoMonthlyUrl: 'https://mpago.la/1HfK5w8',
    mercadopagoAnnualUrl: 'https://mpago.la/2EJNTrd',
    mercadopagoBusinessMonthlyUrl: '',
    mercadopagoBusinessAnnualUrl: '',
    proMonthlyPrice: 9.99,
    proAnnualPrice: 95.9,
    proMonthlyPricePen: 37,
    proAnnualPricePen: 355,
    businessMonthlyPrice: 24.99,
    businessAnnualPrice: 239.9,
    businessMonthlyPricePen: 92,
    businessAnnualPricePen: 890,
    enterpriseMonthlyPrice: 79.99,
    enterpriseAnnualPrice: 769.9,
    annualBillingEnabled: true,
    annualDiscountPercent: 20,
    demoModeEnabled: false,
    demoLicenseCode: null as string | null,
  });

  const dynamicPlans: PricingPlan[] = PRICING_PLANS.map((p) => {
    if (p.id === 'pro') {
      return { ...p, priceMonthly: payCfg.proMonthlyPrice, priceAnnual: payCfg.proAnnualPrice };
    }
    if (p.id === 'business') {
      return { ...p, priceMonthly: payCfg.businessMonthlyPrice, priceAnnual: payCfg.businessAnnualPrice };
    }
    if (p.id === 'enterprise') {
      return { ...p, priceMonthly: payCfg.enterpriseMonthlyPrice, priceAnnual: payCfg.enterpriseAnnualPrice };
    }
    return p;
  });

  const getCheckoutPenPrice = (plan: PricingPlan) => {
    if (plan.id === 'business') {
      return billingCycle === 'annual' ? payCfg.businessAnnualPricePen : payCfg.businessMonthlyPricePen;
    }
    return billingCycle === 'annual' ? payCfg.proAnnualPricePen : payCfg.proMonthlyPricePen;
  };

  const getCheckoutStripeUrl = (plan: PricingPlan) => {
    if (plan.id === 'business') {
      return billingCycle === 'annual'
        ? payCfg.stripeBusinessAnnualUrl || payCfg.stripeAnnualUrl
        : payCfg.stripeBusinessMonthlyUrl || payCfg.stripeMonthlyUrl;
    }
    return billingCycle === 'annual' ? payCfg.stripeAnnualUrl : payCfg.stripeMonthlyUrl;
  };

  const getCheckoutMercadoPagoUrl = (plan: PricingPlan) => {
    if (plan.id === 'business') {
      return billingCycle === 'annual'
        ? payCfg.mercadopagoBusinessAnnualUrl || payCfg.mercadopagoAnnualUrl
        : payCfg.mercadopagoBusinessMonthlyUrl || payCfg.mercadopagoMonthlyUrl;
    }
    return billingCycle === 'annual' ? payCfg.mercadopagoAnnualUrl : payCfg.mercadopagoMonthlyUrl;
  };

  useEffect(() => {
    fetch('/api/v1/billing/config', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok) {
          setPayCfg((prev) => ({ ...prev, ...d }));
          if (d.annualBillingEnabled === false) {
            setBillingCycle('monthly');
          }
        }
      })
      .catch(() => {});
  }, []);

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
      router.push(`/registro?plan=${plan.id}&cycle=${billingCycle}`);
      return;
    }

    // Si Stripe API live está activo, redirige directo a Stripe Checkout Session
    if (payCfg.stripeApiConfigured) {
      setLoadingPlan(plan.id);
      try {
        const res = await api<{ url: string }>('/api/v1/billing/checkout-session', {
          method: 'POST',
          body: { planId: plan.id, billingCycle }
        });
        if (res?.url) {
          window.location.href = res.url;
          return;
        }
      } catch {
        // continúa al modal unificado
      } finally {
        setLoadingPlan(null);
      }
    }

    // Abre el modal de pagos unificado de ATP Dev (MercadoPago Yape/Plin QR + Stripe + Comprobante + Licencia)
    setLicenseMsg(null);
    setYapeFeedback(null);
    setOperationCode('');
    setCheckoutPlan(plan);
  };

  const handleSubmitYapeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan || !operationCode.trim()) return;
    setYapeSubmitting(true);
    setYapeFeedback(null);
    try {
      const res = await api<{ order?: { orderCode?: string }; message?: string }>('/api/v1/billing/yape-order', {
        method: 'POST',
        body: {
          planId: checkoutPlan.id,
          billingCycle,
          method: yapeApp,
          operationCode: operationCode.trim(),
          payerPhone: payerPhone.trim(),
        },
      });
      setYapeFeedback({
        type: 'ok',
        text: res?.message || 'Comprobante registrado. Activaremos tu plan al instante.',
        orderCode: res?.order?.orderCode,
      });
      setOperationCode('');
    } catch (err: any) {
      setYapeFeedback({
        type: 'err',
        text: err?.message || 'No pudimos registrar el comprobante. Verifica el N° de operación.',
      });
    } finally {
      setYapeSubmitting(false);
    }
  };

  const handleRedeemLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseCode.trim()) return;
    setRedeeming(true);
    setLicenseMsg(null);
    try {
      const res = await api<{ message?: string; plan?: string }>('/api/v1/billing/redeem-license', {
        method: 'POST',
        body: { code: licenseCode.trim() },
      });
      setLicenseMsg({ type: 'ok', text: res?.message || '¡Licencia activada con éxito!' });
      setLicenseCode('');
      setTimeout(() => {
        setCheckoutPlan(null);
        router.push(`/dashboard?payment=success&plan=${res?.plan || 'pro'}`);
      }, 1200);
    } catch (err: any) {
      setLicenseMsg({ type: 'err', text: err?.message || 'Código de licencia no válido.' });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className={`space-y-10 ${className}`}>
      {/* ─── Encabezado y Toggle de Facturación ───────────────────────────── */}
      {showTitle && (
        <div data-no-translate="true" className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-pink-600 dark:text-purple-400 uppercase tracking-wider">
            {t('home_pricing_badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            {t('home_pricing_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
            {t('home_pricing_desc')}
          </p>
        </div>
      )}

      {/* Chunky Segmented Billing Switch (solo si Facturación Anual está activa en Admin) */}
      {payCfg.annualBillingEnabled && (
        <div data-no-translate="true" className="flex flex-col items-center justify-center gap-2.5">
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
              {t('pricing_monthly')}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 select-none ${
                billingCycle === 'annual'
                  ? 'bg-[#d91a7a] hover:bg-[#c2186b] text-white shadow-lg shadow-pink-500/30 border-b-2 border-[#9f1239]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{t('pricing_annual')}</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-[#d91a7a] text-[10px] font-black uppercase tracking-wider shadow-xs">
                -{payCfg.annualDiscountPercent}%
              </span>
            </button>
          </div>
          <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span>{tUi('pricing_save_note').replace('{pct}', String(payCfg.annualDiscountPercent))}</span>
          </p>
        </div>
      )}

      {/* ─── Grid de Tarjetas Táctiles 3D (Paleta de Marca Sorteos Pro) ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-2">
        {dynamicPlans.map((plan) => {
          const price = billingCycle === 'annual' 
            ? (plan.priceAnnual / 12).toFixed(2) 
            : plan.priceMonthly.toFixed(2);

          const isPro = plan.id === 'pro';
          const isBusiness = plan.id === 'business';
          const isEnterprise = plan.id === 'enterprise';
          const isLoading = loadingPlan === plan.id;

          // Estilos visuales alineados con la identidad de marca (Magenta / Hot Pink / Púrpura)
          let cardBorderClass = 'border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] shadow-sm hover:border-slate-300 dark:hover:border-slate-700';
          let buttonClass = 'bg-slate-100 hover:bg-pink-50 hover:text-[#d91a7a] text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-1';
          let accentIcon = <Star className="w-5 h-5 text-slate-400" />;

          if (isPro) {
            // Plan Estrella: Magenta oficial de Sorteos Pro (#d91a7a)
            cardBorderClass = 'border-2 border-b-6 border-[#d91a7a] dark:border-[#ec4899] bg-white dark:bg-[#0f172a] shadow-2xl shadow-pink-500/20 lg:-translate-y-2 relative z-10';
            buttonClass = 'bg-[#d91a7a] hover:bg-[#c2186b] text-white border-b-4 border-[#9f1239] active:border-b-0 active:translate-y-1 shadow-lg shadow-pink-500/35';
            accentIcon = <Crown className="w-5 h-5 text-amber-400" />;
          } else if (isBusiness) {
            // Plan Business: Púrpura elegante (#7c3aed / #8b5cf6)
            cardBorderClass = 'border-2 border-b-6 border-purple-500/80 dark:border-purple-500/60 bg-white dark:bg-[#0c1222] shadow-xl shadow-purple-500/15';
            buttonClass = 'bg-purple-600 hover:bg-purple-700 text-white border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 shadow-lg shadow-purple-500/30';
            accentIcon = <Zap className="w-5 h-5 text-purple-500" />;
          } else if (isEnterprise) {
            // Plan Enterprise: Slate corporativo / Oro
            cardBorderClass = 'border-2 border-b-6 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1222] shadow-xl shadow-slate-500/10';
            buttonClass = 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 border-b-4 border-slate-950 dark:border-slate-300 active:border-b-0 active:translate-y-1 shadow-lg shadow-slate-900/20';
            accentIcon = <Award className="w-5 h-5 text-amber-500" />;
          }

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative ${cardBorderClass}`}
            >
              {/* Badge destacado superior Magenta */}
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#d91a7a] text-white font-black text-[11px] uppercase tracking-wider shadow-lg shadow-pink-500/30 flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>MÁS RECOMENDADO • PRO</span>
                </div>
              )}
              {isBusiness && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-purple-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md whitespace-nowrap">
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
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
                    isPro 
                      ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/40' 
                      : isBusiness 
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/40'
                        : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}>
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
                    <div className="text-[11px] font-semibold text-pink-600 dark:text-pink-400 mt-1 flex items-center gap-1">
                      <span>✓ Facturado ${plan.priceAnnual}/año (ahorras {payCfg.annualDiscountPercent}%)</span>
                    </div>
                  ) : plan.priceMonthly === 0 ? (
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span>✓ Gratis sin tarjeta de crédito</span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-medium text-slate-400 mt-1">
                      Facturación mensual recurrente
                    </div>
                  )}
                </div>

                {/* Features con Checkmarks Rosados de Marca */}
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
                    Qué incluye:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="text-xs font-medium text-slate-700 dark:text-slate-200 flex items-start gap-2.5 leading-snug">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPro 
                            ? 'bg-pink-100 dark:bg-pink-950/60 text-[#d91a7a] dark:text-pink-400' 
                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-300'
                        }`}>
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

      {/* Modal Unificado de Pagos ATP Dev (Yape / Plin / MercadoPago QR + Stripe + Licencia) */}
      {checkoutPlan && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCheckoutPlan(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#d91a7a] shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-[#d91a7a] to-purple-700 text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-pink-100">
                  Pasarela Oficial ATP Dev
                </p>
                <h3 className="font-display font-black text-lg">
                  Sorteos Pro — {checkoutPlan.name} ({billingCycle === 'annual' ? `$${checkoutPlan.priceAnnual}/año` : `$${checkoutPlan.priceMonthly}/mes`})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutPlan(null)}
                aria-label="Cerrar"
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayTab('yape')}
                  className={`py-2 px-2 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                    payTab === 'yape'
                      ? 'border-[#d91a7a] bg-pink-50 dark:bg-pink-950/40 text-[#d91a7a]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Yape / Plin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayTab('card')}
                  className={`py-2 px-2 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                    payTab === 'card'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Tarjeta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayTab('license')}
                  className={`py-2 px-2 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                    payTab === 'license'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Licencia</span>
                </button>
              </div>

              {payTab === 'yape' && (
                <div className="space-y-3 text-xs">
                  <a
                    href={getCheckoutMercadoPagoUrl(checkoutPlan)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#009ee3] hover:bg-[#0089c7] text-white font-extrabold flex items-center justify-center gap-2 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Pagar S/ {getCheckoutPenPrice(checkoutPlan)} con MercadoPago QR (Yape / Plin)</span>
                  </a>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 text-center">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Escanea y paga con Yape o Plin
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 font-black text-sm">
                        S/ {getCheckoutPenPrice(checkoutPlan)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center pt-1">
                      <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-md inline-block">
                        <img
                          src={payCfg.yapeQrUrl || '/yape-qr.jpg'}
                          alt="Código QR oficial Yape / Plin"
                          className="w-40 h-40 object-contain rounded-xl"
                        />
                      </div>
                      <p className="mt-2 font-black text-xs uppercase tracking-wide text-slate-900 dark:text-white">
                        {payCfg.yapeHolder}
                      </p>
                      <a
                        href={payCfg.yapeQrUrl || '/yape-qr.jpg'}
                        download="yape-qr-sorteos-pro.jpg"
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar QR</span>
                      </a>
                    </div>
                    <div className="rounded-xl bg-amber-50/70 dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 px-3 py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tu pago está 100% protegido • Yape y Plin</span>
                    </div>
                  </div>

                  {/* Registro de Comprobante Yape / Plin para aprobación 1 clic en Admin */}
                  <form onSubmit={handleSubmitYapeOrder} className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setYapeApp('yape')}
                        className={`py-1.5 rounded-xl font-bold border cursor-pointer ${
                          yapeApp === 'yape'
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Yape
                      </button>
                      <button
                        type="button"
                        onClick={() => setYapeApp('plin')}
                        className={`py-1.5 rounded-xl font-bold border cursor-pointer ${
                          yapeApp === 'plin'
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Plin
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        minLength={4}
                        value={operationCode}
                        onChange={(e) => setOperationCode(e.target.value)}
                        placeholder="N° de operación * (Ej. 084519)"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        placeholder="Tu WhatsApp (opcional)"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    {yapeFeedback && (
                      <p className={`text-[11px] font-bold ${yapeFeedback.type === 'ok' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {yapeFeedback.text}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={yapeSubmitting || !operationCode.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] text-white font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {yapeSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Registrar comprobante y activar plan</span>
                    </button>
                  </form>

                  <a
                    href={`https://wa.me/${payCfg.whatsappNumber}?text=${encodeURIComponent(
                      `Hola ATP Dev 👋, acabo de pagar el plan ${checkoutPlan.name} (${billingCycle}, S/ ${getCheckoutPenPrice(checkoutPlan)}) en Sorteos Pro.${yapeFeedback?.orderCode ? ` Orden: ${yapeFeedback.orderCode}.` : ''} ¿Me ayudas con la activación?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar captura por WhatsApp Express</span>
                  </a>
                </div>
              )}

              {payTab === 'card' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Paga con Visa, Mastercard, Amex o Apple/Google Pay en nuestra pasarela segura de Stripe. Al confirmar, recibirás tu licencia para activar tu cuenta al instante.
                  </p>
                  <a
                    href={getCheckoutStripeUrl(checkoutPlan)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] text-white font-extrabold flex items-center justify-center gap-2 shadow-md"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Ir a pago seguro con Tarjeta (Stripe)</span>
                  </a>
                  <a
                    href={`https://wa.me/${payCfg.whatsappNumber}?text=${encodeURIComponent(
                      `Hola ATP Dev 👋, deseo pagar el plan ${checkoutPlan.name} (${billingCycle}) en Sorteos Pro con tarjeta.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    <span>Coordinar pago con tarjeta por WhatsApp</span>
                  </a>
                </div>
              )}

              {payTab === 'license' && (
                <form onSubmit={handleRedeemLicense} className="space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-300">
                    Ingresa el código privado de licencia PRO entregado por ATP Dev para activar tu plan inmediatamente:
                  </p>
                  {payCfg.demoModeEnabled && payCfg.demoLicenseCode && (
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 px-3 py-2 flex items-center justify-between gap-2">
                      <span className="text-amber-900 dark:text-amber-200 font-semibold">
                        Modo Prueba: <code className="font-mono font-bold">{payCfg.demoLicenseCode}</code>
                      </span>
                      <button
                        type="button"
                        onClick={() => setLicenseCode(payCfg.demoLicenseCode || '')}
                        className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                      >
                        Usar
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    required
                    value={licenseCode}
                    onChange={(e) => setLicenseCode(e.target.value.toUpperCase())}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 font-mono uppercase text-sm text-slate-900 dark:text-white"
                  />
                  {licenseMsg && (
                    <p className={`font-bold ${licenseMsg.type === 'ok' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {licenseMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={redeeming || !licenseCode.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {redeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Activar Licencia Ahora</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSection;
