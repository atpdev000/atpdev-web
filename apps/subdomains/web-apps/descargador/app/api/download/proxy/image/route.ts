import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTNAMES = [
  'fbcdn.net',
  'facebook.com',
  'cdninstagram.com',
  'instagram.com',
  'twimg.com',
  'twitter.com',
  'tiktokcdn.com',
  'tiktok.com',
  'byteoversea.com',
  'ibytedtos.com',
  'ytimg.com',
  'ggpht.com',
  'googleusercontent.com'
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl || !imageUrl.startsWith('http')) {
      return new NextResponse('URL de imagen requerida', { status: 400 });
    }

    const parsed = new URL(imageUrl);
    const isAllowed = ALLOWED_HOSTNAMES.some(h => parsed.hostname.endsWith(h));
    if (!isAllowed) {
      return new NextResponse('Dominio no permitido', { status: 403 });
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors'
      }
    });

    if (!response.ok) {
      return new NextResponse(`Error al obtener imagen: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new NextResponse(`Error proxy imagen: ${error?.message || 'Error'}`, { status: 500 });
  }
}
