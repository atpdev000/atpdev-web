import { NextRequest, NextResponse } from 'next/server';
import { Participant } from '@/lib/types';
import { getAdapter } from '@/lib/server/socialProviders';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, platform } = body as { url: string; platform: string };

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere una URL válida de la publicación.' },
        { status: 400 }
      );
    }

    const adapter = getAdapter(platform || 'instagram');
    const result = await adapter.fetchComments(url);

    return NextResponse.json({
      success: true,
      data: {
        url,
        platform: platform || 'instagram',
        commentsCount: result.comments.length,
        comments: result.comments,
        mode: result.mode,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener comentarios de la publicación.' },
      { status: 500 }
    );
  }
}
