import fs from 'node:fs';
import path from 'node:path';

export interface EcosystemPaymentsConfig {
  whatsappNumber: string;
  yapePhoneDisplay: string;
  yapeHolder: string;
  stripeMonthlyUrl: string;
  stripeAnnualUrl: string;
  mercadopagoMonthlyUrl: string;
  mercadopagoAnnualUrl: string;
  licenseKeys: string[];
  stripeApiConfigured: boolean;
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
    : ['VIP-ATP-2026', 'COLOREAR-KDP-120', 'COLOREAR-EDITORIAL-400'];

  return {
    whatsappNumber: fullWhatsapp,
    yapePhoneDisplay: formatPeruPhone(rawWhatsapp),
    yapeHolder: (process.env.YAPE_HOLDER || 'Percy Acha Taipe (ATP Dev Perú)').trim(),
    stripeMonthlyUrl:
      process.env.STRIPE_LINK_MONTHLY ||
      colorearPay.stripe_pro_monthly_url ||
      descargadorPay.stripe_pro_monthly_url ||
      'https://buy.stripe.com/test_5kQdR94GigfOeqxgJ51kA01',
    stripeAnnualUrl:
      process.env.STRIPE_LINK_ANNUAL ||
      colorearPay.stripe_pro_annual_url ||
      descargadorPay.stripe_pro_annual_url ||
      'https://buy.stripe.com/test_dRm8wPa0Cd3C2HPakH1kA00',
    mercadopagoMonthlyUrl:
      process.env.MERCADOPAGO_LINK_MONTHLY ||
      colorearPay.mercadopago_pro_monthly_url ||
      descargadorPay.mercadopago_pro_monthly_url ||
      'https://mpago.la/1HfK5w8',
    mercadopagoAnnualUrl:
      process.env.MERCADOPAGO_LINK_ANNUAL ||
      colorearPay.mercadopago_pro_annual_url ||
      descargadorPay.mercadopago_pro_annual_url ||
      'https://mpago.la/2EJNTrd',
    licenseKeys: Array.from(new Set([...jsonKeys, ...envKeys])),
    stripeApiConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
  };
}

