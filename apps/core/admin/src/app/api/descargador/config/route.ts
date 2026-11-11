import { NextRequest, NextResponse } from 'next/server';
import { getSubdomainConfig, saveSubdomainConfig } from '@atpdev/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getSubdomainConfig('descargador');
    return NextResponse.json({ success: true, config });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();
    const result = saveSubdomainConfig('descargador', updates);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error al guardar configuración' },
      { status: 500 }
    );
  }
}
