import { NextRequest, NextResponse } from 'next/server';
import { getSubdomainConfig } from '@atpdev/database';
import { isPlayStoreRequest } from '@/lib/server/channelGuard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const config = getSubdomainConfig('descargador');
    const playStore = isPlayStoreRequest(request);
    const { license_keys: _hiddenKeys, ...publicPayments } = (config.payments || {}) as Record<string, any>;
    return NextResponse.json({
      success: true,
      theme: config.theme,
      branding: config.branding,
      seo: config.seo,
      modules: playStore
        ? { ...(config.modules || {}), youtube_enabled: false }
        : config.modules,
      contact: config.contact,
      apk: playStore
        ? { ...(config.apk || {}), enabled: false }
        : config.apk,
      monetization: config.monetization,
      backend: config.backend,
      payments: publicPayments,
      updated_at: config.updated_at,
    });
  } catch (error) {
    console.error('Error fetching descargador theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}
