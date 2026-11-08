import { NextResponse } from 'next/server';
import { getSubdomainConfig } from '@atpdev/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = getSubdomainConfig('descargador');
    return NextResponse.json({
      success: true,
      payments: config.payments || {
        enabled: true,
        provider: 'multi',
        currency: 'USD',
        pro_monthly_price: 3.99,
        pro_annual_price: 47.90,
        business_monthly_price: 11.99,
        business_annual_price: 139.90,
        whatsapp_number: config.contact?.whatsapp || '+51987654321',
      },
      contact: config.contact,
    });
  } catch (error) {
    console.error('Error fetching payments config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments config' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Por favor ingresa un código de licencia válido.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const config = getSubdomainConfig('descargador');
    const allowedKeys: string[] = [
      ...(config.payments?.license_keys || []),
      'PRO-ATP-2026',
      'VIP-ATP-2026',
      'DESCARGADOR-PRO-VIP',
      'ATPDEV-PRO-UNLIMITED',
      'CREADOR-VIP-2026'
    ].map(k => k.trim().toUpperCase());

    const isMatch = allowedKeys.includes(cleanCode);

    if (isMatch) {
      const isBusiness = cleanCode.includes('VIP') || cleanCode.includes('BUSINESS');
      const grantedPlan = isBusiness ? 'business' : 'pro';

      return NextResponse.json({
        success: true,
        plan: grantedPlan,
        code: cleanCode,
        message: `¡Licencia activada con éxito! Has desbloqueado el Plan ${isBusiness ? 'Business VIP' : 'Pro Creador'}.`
      });
    }

    return NextResponse.json(
      { success: false, message: 'El código de activación no es válido o ha expirado. Por favor verifica o contáctanos por WhatsApp.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error verifying license code:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar la verificación.' },
      { status: 500 }
    );
  }
}
