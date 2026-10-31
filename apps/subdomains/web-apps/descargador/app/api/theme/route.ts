import { NextResponse } from 'next/server';
import { getSubdomainConfig } from '@atpdev/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = getSubdomainConfig('descargador');
    return NextResponse.json({
      success: true,
      theme: config.theme,
      branding: config.branding,
      seo: config.seo,
      modules: config.modules,
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
