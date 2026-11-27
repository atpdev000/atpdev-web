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

export async function GET() {
  const sorteosCfg = getSubdomainConfig('sorteos');
  const descargadorCfg = getSubdomainConfig('descargador');
  const pay = sorteosCfg.payments || descargadorCfg.payments || {};
  const rawPhone = pay.whatsapp_number || descargadorCfg.payments?.whatsapp_number || '+51987006572';
  const digits = rawPhone.replace(/[^\d]/g, '');
  const whatsappNumber = digits.startsWith('51') ? digits : `51${digits}`;

  return NextResponse.json({
    ok: true,
    stripeApiConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    whatsappNumber,
    yapePhoneDisplay: formatPeruPhone(rawPhone),
    yapeHolder: 'Percy Acha Taipe (ATP Dev Perú)',
    stripeMonthlyUrl:
      pay.stripe_pro_monthly_url ||
      descargadorCfg.payments?.stripe_pro_monthly_url ||
      'https://buy.stripe.com/test_5kQdR94GigfOeqxgJ51kA01',
    stripeAnnualUrl:
      pay.stripe_pro_annual_url ||
      descargadorCfg.payments?.stripe_pro_annual_url ||
      'https://buy.stripe.com/test_dRm8wPa0Cd3C2HPakH1kA00',
    mercadopagoMonthlyUrl:
      pay.mercadopago_pro_monthly_url ||
      descargadorCfg.payments?.mercadopago_pro_monthly_url ||
      'https://mpago.la/1HfK5w8',
    mercadopagoAnnualUrl:
      pay.mercadopago_pro_annual_url ||
      descargadorCfg.payments?.mercadopago_pro_annual_url ||
      'https://mpago.la/2EJNTrd',
  });
}

