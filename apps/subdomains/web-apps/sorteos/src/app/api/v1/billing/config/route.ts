import { NextResponse } from 'next/server';
import { getSubdomainConfig } from '@atpdev/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatPeruPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  const local9 = digits.startsWith('51') && digits.length === 11 ? digits.slice(2) : digits;
  if (local9.length === 9) {
    return `${local9.slice(0, 3)} ${local9.slice(3, 6)} ${local9.slice(6)}`;
  }
  return raw;
}

function numOr(val: unknown, fallback: number): number {
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function sanitizeStripeLink(raw: unknown, allowTest: boolean): string {
  const url = String(raw || '').trim();
  if (!url || !/^https:\/\/(buy|checkout)\.stripe\.com\//i.test(url)) return '';
  if (!allowTest && /\/test_/i.test(url)) return '';
  return url;
}

function sanitizeMpLink(raw: unknown): string {
  const url = String(raw || '').trim();
  if (!url || !/^https?:\/\//i.test(url)) return '';
  return url;
}

export async function GET() {
  const sorteosCfg = getSubdomainConfig('sorteos');
  const pay = sorteosCfg.payments || {};

  const rawPhone = pay.whatsapp_number || '+51987006572';
  const digits = rawPhone.replace(/[^\d]/g, '');
  const whatsappNumber = digits.startsWith('51') ? digits : `51${digits}`;

  const proMonthlyPrice = numOr(pay.pro_monthly_price, 9.99);
  const proAnnualPrice = numOr(pay.pro_annual_price, 95.9);
  const proMonthlyPricePen = numOr(pay.pro_monthly_price_pen, 37);
  const proAnnualPricePen = numOr(pay.pro_annual_price_pen, 355);

  const businessMonthlyPrice = numOr(pay.business_monthly_price, 24.99);
  const businessAnnualPrice = numOr(pay.business_annual_price, 239.9);
  const businessMonthlyPricePen = numOr(pay.business_monthly_price_pen, 92);
  const businessAnnualPricePen = numOr(pay.business_annual_price_pen, 890);

  const enterpriseMonthlyPrice = numOr(pay.enterprise_monthly_price, 79.99);
  const enterpriseAnnualPrice = numOr(pay.enterprise_annual_price, 769.9);
  const annualDiscountPercent = Math.min(80, Math.max(0, Math.round(numOr(pay.annual_discount_percent, 20))));
  const demoModeEnabled = Boolean(pay.demo_mode_enabled === true);

  // Nunca exponer links Stripe de prueba (/test_) a usuarios reales cuando Modo Prueba está desactivado,
  // y nunca reutilizar links de Pro para el plan Business (evita cobro con monto equivocado).
  const stripeMonthlyUrl = sanitizeStripeLink(pay.stripe_pro_monthly_url, demoModeEnabled);
  const stripeAnnualUrl = sanitizeStripeLink(pay.stripe_pro_annual_url, demoModeEnabled);
  const stripeBusinessMonthlyUrl = sanitizeStripeLink(pay.stripe_business_monthly_url, demoModeEnabled);
  const stripeBusinessAnnualUrl = sanitizeStripeLink(pay.stripe_business_annual_url, demoModeEnabled);

  const mercadopagoMonthlyUrl = sanitizeMpLink(pay.mercadopago_pro_monthly_url);
  const mercadopagoAnnualUrl = sanitizeMpLink(pay.mercadopago_pro_annual_url);
  const mercadopagoBusinessMonthlyUrl = sanitizeMpLink(pay.mercadopago_business_monthly_url);
  const mercadopagoBusinessAnnualUrl = sanitizeMpLink(pay.mercadopago_business_annual_url);

  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  const hasRealStripeKey =
    (stripeKey.startsWith('sk_live_') || (demoModeEnabled && stripeKey.startsWith('sk_test_'))) &&
    stripeKey.length > 24 &&
    !/placeholder|dummy|xxx/i.test(stripeKey);
  const proPriceId = (process.env.STRIPE_PRICE_PRO_MONTHLY || '').trim();
  const stripeApiConfigured = hasRealStripeKey && proPriceId.startsWith('price_');

  return NextResponse.json({
    ok: true,
    stripeApiConfigured,
    whatsappNumber,
    yapePhoneDisplay: formatPeruPhone(rawPhone),
    yapeHolder: (pay.yape_holder || 'Percy Acha Taipe (ATP Dev Perú)').trim(),
    yapeQrUrl: (pay.yape_qr_url || '/yape-qr.jpg').trim(),
    stripeMonthlyUrl,
    stripeAnnualUrl,
    stripeBusinessMonthlyUrl,
    stripeBusinessAnnualUrl,
    mercadopagoMonthlyUrl,
    mercadopagoAnnualUrl,
    mercadopagoBusinessMonthlyUrl,
    mercadopagoBusinessAnnualUrl,
    proMonthlyPrice,
    proAnnualPrice,
    proMonthlyPricePen,
    proAnnualPricePen,
    businessMonthlyPrice,
    businessAnnualPrice,
    businessMonthlyPricePen,
    businessAnnualPricePen,
    enterpriseMonthlyPrice,
    enterpriseAnnualPrice,
    annualBillingEnabled: pay.annual_billing_enabled !== false,
    annualDiscountPercent,
    demoModeEnabled,
    demoLicenseCode: demoModeEnabled
      ? String(pay.demo_license_code || 'SORTEOS-DEMO-2026').trim().toUpperCase()
      : null,
  });
}
