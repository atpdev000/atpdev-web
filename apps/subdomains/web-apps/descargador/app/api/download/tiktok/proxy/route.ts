
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { url, filename, isAudio } = await request.json();

        console.log('🔧 [TikTok Proxy] Solicitud recibida:', {
            url: url?.substring(0, 100) + '...',
            filename,
            isAudio
        });

        if (!url || !url.startsWith('http')) {
            return NextResponse.json(
                { error: 'URL inválida' },
                { status: 400 }
            );
        }

        // Headers para simular un navegador real
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.tiktok.com/',
            'Range': 'bytes=0-',
        };

        console.log('⬇️ [TikTok Proxy] Iniciando descarga desde origen...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos timeout

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error('❌ [TikTok Proxy] Error en respuesta:', response.status, response.statusText);
                return NextResponse.json(
                    { error: `Error ${response.status}: ${response.statusText}` },
                    { status: response.status }
                );
            }

            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            const contentLength = response.headers.get('content-length');

            console.log('📦 [TikTok Proxy] Headers recibidos:', {
                contentType,
                contentLength,
                status: response.status
            });

            const arrayBuffer = await response.arrayBuffer();

            if (arrayBuffer.byteLength === 0) {
                throw new Error('El archivo recibido está vacío');
            }

            console.log('✅ [TikTok Proxy] Descarga exitosa:', {
                size: arrayBuffer.byteLength
            });

            // Headers de respuesta
            const responseHeaders = new Headers();
            responseHeaders.set('Content-Type', contentType);
            if (contentLength) responseHeaders.set('Content-Length', contentLength);
            responseHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);
            responseHeaders.set('Cache-Control', 'no-cache');

            return new NextResponse(arrayBuffer, {
                status: 200,
                headers: responseHeaders
            });

        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                return NextResponse.json({ error: 'Timeout en descarga' }, { status: 408 });
            }
            throw fetchError;
        }

    } catch (error: any) {
        console.error('💥 [TikTok Proxy] Error general:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor: ' + error.message },
            { status: 500 }
        );
    }
}
