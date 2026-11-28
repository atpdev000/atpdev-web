import fs from 'node:fs';
import path from 'node:path';
import { COLOREAR_PLANS, ColorearPlan, WELCOME_FREE_CREDITS } from '../plans';

export interface EcosystemPaymentsConfig {
  whatsappNumber: string;
  yapePhoneDisplay: string;
  yapeHolder: string;
  yapeQrUrl: string;
  notificationEmail: string;
  whatsappMessagePro: string;
  whatsappMessageBusiness: string;
  stripeMonthlyUrl: string;
  stripeAnnualUrl: string;
  stripeEditorialAnnualUrl: string;
  mercadopagoMonthlyUrl: string;
  mercadopagoAnnualUrl: string;
  mercadopagoEditorialAnnualUrl: string;
  licenseKeys: string[];
  demoModeEnabled: boolean;
  demoLicenseCode: string;
  stripeApiConfigured: boolean;
  // Precios, créditos y nombres dinámicos editables desde admin.atpdev.dev
  welcomeCredits: number;
  annualBillingEnabled: boolean;
  annualDiscountPercent: number;
  kdpPlanName: string;
  kdpCredits: number;
  kdpPriceUsd: number;
  kdpPricePen: number;
  editorialPlanName: string;
  editorialCredits: number;
  editorialPriceUsdMonthly: number;
  editorialPriceUsdAnnual: number;
  editorialPricePenMonthly: number;
  editorialPricePenAnnual: number;
}

function readSharedSubdomainJson(): Record<string, any> | null {
  try {
    const cwd = process.cwd();
    const candidates = [
      path.resolve(/*turbopackIgnore: true*/ cwd, 'packages/database/src/subdomain_configs.json'),
      path.resolve(/*turbopackIgnore: true*/ cwd, '../../../../packages/database/src/subdomain_configs.json'),
      '/opt/atpdev-web/packages/database/src/subdomain_configs.json',
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    }
  } catch {}
  return null;
}

function formatPeruPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  const local9 = digits.startsWith('51') && digits.length === 11 ? digits.slice(2) : digits;
  if (local9.length === 9) {
    return `${local9.slice(0, 3)} ${local9.slice(3, 6)} ${local9.slice(6)}`;
  }
  return raw;
}

function parsePositiveNumber(val: unknown, fallback: number): number {
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function getColorearPaymentsConfig(): EcosystemPaymentsConfig {
  const all = readSharedSubdomainJson();
  const colorearPay = all?.colorear?.payments || {};
  const descargadorPay = all?.descargador?.payments || {};

  const rawWhatsapp =
    process.env.YAPE_PHONE ||
    process.env.WHATSAPP_PHONE ||
    colorearPay.whatsapp_number ||
    descargadorPay.whatsapp_number ||
    '+51987006572';

  const whatsappDigits = rawWhatsapp.replace(/[^\d]/g, '');
  const fullWhatsapp = whatsappDigits.startsWith('51') ? whatsappDigits : `51${whatsappDigits}`;

  const envKeys = (process.env.COLOREAR_LICENSE_KEYS || '')
    .split(',')
    .map((k) => k.trim().toUpperCase())
    .filter(Boolean);

  const jsonKeys = Array.isArray(colorearPay.license_keys)
    ? colorearPay.license_keys.map((k: string) => String(k).trim().toUpperCase()).filter(Boolean)
    : [];

  const demoModeEnabled = Boolean(colorearPay.demo_mode_enabled === true);
  const demoLicenseCode = String(colorearPay.demo_license_code || 'COLOREAR-DEMO-2026')
    .trim()
    .toUpperCase();
  const annualBillingEnabled = Boolean(colorearPay.annual_billing_enabled === true);

  const welcomeCredits = Math.max(0, Math.round(parsePositiveNumber(colorearPay.welcome_credits, WELCOME_FREE_CREDITS)));
  const annualDiscountPercent = Math.min(80, Math.max(0, Math.round(parsePositiveNumber(colorearPay.annual_discount_percent, 20))));

  const kdpCredits = Math.max(1, Math.round(parsePositiveNumber(colorearPay.pro_credits, 120)));
  const kdpPriceUsd = parsePositiveNumber(colorearPay.pro_monthly_price, 9);
  const kdpPricePen = parsePositiveNumber(colorearPay.pro_monthly_price_pen, 29);

  const editorialCredits = Math.max(1, Math.round(parsePositiveNumber(colorearPay.business_credits, 400)));
  const editorialPriceUsdMonthly = parsePositiveNumber(
    colorearPay.business_monthly_price ?? colorearPay.pro_annual_price,
    19
  );
  const editorialPriceUsdAnnual = parsePositiveNumber(
    colorearPay.business_annual_price,
    Math.round(editorialPriceUsdMonthly * 12 * (1 - annualDiscountPercent / 100))
  );
  const editorialPricePenMonthly = parsePositiveNumber(colorearPay.business_monthly_price_pen, 59);
  const editorialPricePenAnnual = parsePositiveNumber(
    colorearPay.business_annual_price_pen,
    Math.round(editorialPricePenMonthly * 12 * (1 - annualDiscountPercent / 100))
  );

  const stripeKdpUrl =
    process.env.STRIPE_LINK_MONTHLY ||
    colorearPay.stripe_pro_monthly_url ||
    descargadorPay.stripe_pro_monthly_url ||
    'https://buy.stripe.com/test_6oUaEX1u63t25U1gJ51kA02';

  const stripeEditorialUrl =
    process.env.STRIPE_LINK_ANNUAL ||
    colorearPay.stripe_business_monthly_url ||
    colorearPay.stripe_pro_annual_url ||
    descargadorPay.stripe_pro_annual_url ||
    'https://buy.stripe.com/test_9B69ATegS4x6fuB3Wj1kA03';

  const stripeEditorialAnnualUrl =
    colorearPay.stripe_business_annual_url || stripeEditorialUrl;

  const mpKdpUrl =
    process.env.MERCADOPAGO_LINK_MONTHLY ||
    colorearPay.mercadopago_pro_monthly_url ||
    descargadorPay.mercadopago_pro_monthly_url ||
    'https://mpago.la/32Qtynr';

  const mpEditorialUrl =
    process.env.MERCADOPAGO_LINK_ANNUAL ||
    colorearPay.mercadopago_business_monthly_url ||
    colorearPay.mercadopago_pro_annual_url ||
    descargadorPay.mercadopago_pro_annual_url ||
    'https://mpago.la/2VEfsvU';

  const mpEditorialAnnualUrl =
    colorearPay.mercadopago_business_annual_url || mpEditorialUrl;

  return {
    whatsappNumber: fullWhatsapp,
    yapePhoneDisplay: formatPeruPhone(rawWhatsapp),
    yapeHolder: (
      colorearPay.yape_holder ||
      process.env.YAPE_HOLDER ||
      'Percy Acha Taipe (ATP Dev Perú)'
    ).trim(),
    yapeQrUrl: (colorearPay.yape_qr_url || '/yape-qr.jpg').trim(),
    notificationEmail: (colorearPay.notification_email || 'contacto@atpdev.dev').trim(),
    whatsappMessagePro: (
      colorearPay.whatsapp_message_pro ||
      `Hola ATP Dev, deseo activar ${colorearPay.pro_plan_name || 'Pack Creador KDP'} (+${kdpCredits} créditos) en Colorear Pro.`
    ).trim(),
    whatsappMessageBusiness: (
      colorearPay.whatsapp_message_business ||
      `Hola ATP Dev, deseo activar ${colorearPay.business_plan_name || 'Estudio Editorial Pro'} (+${editorialCredits} créditos/mes) en Colorear Pro.`
    ).trim(),
    stripeMonthlyUrl: stripeKdpUrl,
    stripeAnnualUrl: stripeEditorialUrl,
    stripeEditorialAnnualUrl,
    mercadopagoMonthlyUrl: mpKdpUrl,
    mercadopagoAnnualUrl: mpEditorialUrl,
    mercadopagoEditorialAnnualUrl: mpEditorialAnnualUrl,
    licenseKeys: Array.from(new Set([...jsonKeys, ...envKeys])),
    demoModeEnabled,
    demoLicenseCode,
    stripeApiConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    welcomeCredits,
    annualBillingEnabled,
    annualDiscountPercent,
    kdpPlanName: String(colorearPay.pro_plan_name || 'Pack Creador KDP').trim(),
    kdpCredits,
    kdpPriceUsd,
    kdpPricePen,
    editorialPlanName: String(colorearPay.business_plan_name || 'Estudio Editorial Pro').trim(),
    editorialCredits,
    editorialPriceUsdMonthly,
    editorialPriceUsdAnnual,
    editorialPricePenMonthly,
    editorialPricePenAnnual,
  };
}

export function getDynamicColorearPlans(): ColorearPlan[] {
  const cfg = getColorearPaymentsConfig();
  return COLOREAR_PLANS.map((plan) => {
    if (plan.id === 'free') {
      return {
        ...plan,
        credits: cfg.welcomeCredits,
        es: {
          ...plan.es,
          periodLabel: `Para siempre • ${cfg.welcomeCredits} créditos al registrarte`,
          features: plan.es.features.map((f, idx) =>
            idx === 2
              ? `${cfg.welcomeCredits} créditos de bienvenida al crear cuenta + cuota gratuita diaria`
              : f
          ),
        },
        en: {
          ...plan.en,
          periodLabel: `Forever free • ${cfg.welcomeCredits} welcome credits on signup`,
          features: plan.en.features.map((f, idx) =>
            idx === 2
              ? `${cfg.welcomeCredits} welcome AI credits on signup + fair daily free quota`
              : f
          ),
        },
      };
    }

    if (plan.id === 'creador') {
      return {
        ...plan,
        credits: cfg.kdpCredits,
        priceUsdMonthly: cfg.kdpPriceUsd,
        priceUsdAnnual: cfg.kdpPriceUsd,
        pricePenMonthly: cfg.kdpPricePen,
        pricePenAnnual: cfg.kdpPricePen,
        es: {
          ...plan.es,
          name: cfg.kdpPlanName,
          periodLabel: `Pago único • ${cfg.kdpCredits} créditos IA sin caducidad`,
          features: plan.es.features.map((f, idx) => {
            if (idx === 0) return `${cfg.kdpCredits} créditos IA HD sin límite diario ni caducidad`;
            if (idx === 4) return `Pago seguro con tarjeta (Stripe $${cfg.kdpPriceUsd} USD) o Yape / Plin (S/ ${cfg.kdpPricePen})`;
            return f;
          }),
        },
        en: {
          ...plan.en,
          periodLabel: `One-time payment • ${cfg.kdpCredits} non-expiring credits`,
          features: plan.en.features.map((f, idx) => {
            if (idx === 0) return `${cfg.kdpCredits} HD AI credits that never expire (no daily cap)`;
            if (idx === 4) return `Instant Stripe card checkout ($${cfg.kdpPriceUsd} USD) or Yape / Plin (S/ ${cfg.kdpPricePen})`;
            return f;
          }),
        },
      };
    }

    if (plan.id === 'editorial') {
      return {
        ...plan,
        credits: cfg.editorialCredits,
        priceUsdMonthly: cfg.editorialPriceUsdMonthly,
        priceUsdAnnual: cfg.editorialPriceUsdAnnual,
        pricePenMonthly: cfg.editorialPricePenMonthly,
        pricePenAnnual: cfg.editorialPricePenAnnual,
        es: {
          ...plan.es,
          name: cfg.editorialPlanName,
          periodLabel: `${cfg.editorialCredits} créditos IA prioritarios cada mes`,
          features: plan.es.features.map((f, idx) => {
            if (idx === 0) return `${cfg.editorialCredits} créditos IA prioritarios recargados cada mes`;
            if (idx === 4) {
              return cfg.annualBillingEnabled
                ? `Cancela en cualquier momento • Ahorra ${cfg.annualDiscountPercent}% en plan anual`
                : 'Cancela en cualquier momento • Sin permanencia ni cobros ocultos';
            }
            return f;
          }),
        },
        en: {
          ...plan.en,
          periodLabel: `${cfg.editorialCredits} priority AI credits every month`,
          features: plan.en.features.map((f, idx) => {
            if (idx === 0) return `${cfg.editorialCredits} priority AI credits refilled every month`;
            if (idx === 4) {
              return cfg.annualBillingEnabled
                ? `Cancel anytime • Save ${cfg.annualDiscountPercent}% with annual billing`
                : 'Cancel anytime • Zero lock-in or hidden fees';
            }
            return f;
          }),
        },
      };
    }

    return plan;
  });
}

export function getDynamicPlanById(planId: string): ColorearPlan | undefined {
  return getDynamicColorearPlans().find((p) => p.id === planId);
}
