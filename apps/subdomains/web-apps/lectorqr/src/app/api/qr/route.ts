import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  return handleQRRequest(req);
}

export async function POST(req: NextRequest) {
  return handleQRRequest(req);
}

async function handleQRRequest(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let params: Record<string, string> = {};

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        params = { ...body };
      } catch {
        // Fallback to URL search params
      }
    }

    url.searchParams.forEach((val, key) => {
      params[key] = val;
    });

    const data = params.data || 'https://atpdev.pe';
    const transparent = params.transparent === 'on' || params.transparent === 'true';
    const backcolor = transparent ? '#00000000' : (params.backcolor || '#FFFFFF');
    const frontcolor = params.frontcolor || '#000000';
    const errorCorrection = (params.error_correction || 'H') as 'L' | 'M' | 'Q' | 'H';
    const margin = params.margin ? parseInt(params.margin, 10) : 2;
    const format = params.format || 'svg'; // svg or json

    // Generar SVG con QRCode
    const svgString = await QRCode.toString(data, {
      type: 'svg',
      margin: margin,
      color: {
        dark: frontcolor,
        light: backcolor,
      },
      errorCorrectionLevel: errorCorrection,
    });

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: data,
        svg: svgString,
        params: params,
      });
    }

    return new NextResponse(svgString, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error generating QR Code' },
      { status: 500 }
    );
  }
}

