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

export async function GET() {
  const sorteosCfg = getSubdomainConfig('sorteos');
  const descargadorCfg = getSubdomainConfig('descargador');
  const pay = sorteosCfg.payments || {};
  const fallbackPay = descargadorCfg.payments || {};

  const rawPhone = pay.whatsapp_number || fallbackPay.whatsapp_number || '+51987006572';
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

  const stripeMonthlyUrl =
    pay.stripe_pro_monthly_url ||
    fallbackPay.stripe_pro_monthly_url ||
    'https://buy.stripe.com/test_5kQdR94GigfOeqxgJ51kA01';
  const stripeAnnualUrl =
    pay.stripe_pro_annual_url ||
    fallbackPay.stripe_pro_annual_url ||
    'https://buy.stripe.com/test_dRm8wPa0Cd3C2HPakH1kA00';
  const mercadopagoMonthlyUrl =
    pay.mercadopago_pro_monthly_url ||
    fallbackPay.mercadopago_pro_monthly_url ||
    'https://mpago.la/1HfK5w8';
  const mercadopagoAnnualUrl =
    pay.mercadopago_pro_annual_url ||
    fallbackPay.mercadopago_pro_annual_url ||
    'https://mpago.la/2EJNTrd';

  return NextResponse.json({
    ok: true,
    stripeApiConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    whatsappNumber,
    yapePhoneDisplay: formatPeruPhone(rawPhone),
    yapeHolder: (pay.yape_holder || 'Percy Acha Taipe (ATP Dev Perú)').trim(),
    stripeMonthlyUrl,
    stripeAnnualUrl,
    stripeBusinessMonthlyUrl: pay.stripe_business_monthly_url || stripeMonthlyUrl,
    stripeBusinessAnnualUrl: pay.stripe_business_annual_url || stripeAnnualUrl,
    mercadopagoMonthlyUrl,
    mercadopagoAnnualUrl,
    mercadopagoBusinessMonthlyUrl: pay.mercadopago_business_monthly_url || mercadopagoMonthlyUrl,
    mercadopagoBusinessAnnualUrl: pay.mercadopago_business_annual_url || mercadopagoAnnualUrl,
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
    annualDiscountPercent,
  });
}
