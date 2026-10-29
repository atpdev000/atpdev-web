import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, filename, isAudio, thumbnailUrl } = await request.json();

    console.log('🔧 [Facebook Proxy] Solicitud recibida:', {
      url: url?.substring(0, 100) + '...',
      filename,
      isAudio,
      hasThumbnail: !!thumbnailUrl
    });

    if (!url || !url.startsWith('http')) {
      return NextResponse.json(
        { error: 'URL de Facebook inválida' },
        { status: 400 }
      );
    }

    // ✅ MANEJAR AUDIO CON MINIATURA (Delegar a Backend Python si existe)
    if (isAudio && thumbnailUrl) {
      console.log('🎵 [Facebook Proxy] Procesando audio con miniatura...');

      const backendUrl = process.env.BACKEND_URL;

      if (backendUrl) {
        console.log(`🚀 [Facebook Proxy] Delegando a Backend Python: ${backendUrl}`);
        return await handleAudioWithExternalBackend(url, thumbnailUrl, filename, backendUrl);
      } else {
        console.warn('⚠️ [Facebook Proxy] BACKEND_URL no configurado, usando FFmpeg local (lento)...');
        return await handleAudioWithThumbnail(url, thumbnailUrl, filename);
      }
    }

    // Headers específicos para Facebook
    const facebookHeaders = {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'identity',
      'Range': 'bytes=0-',
      'Sec-Fetch-Dest': 'video',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': 'https://www.facebook.com/',
      'Origin': 'https://www.facebook.com'
    };

    console.log('⬇️ [Facebook Proxy] Iniciando descarga desde Facebook...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 segundos timeout

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: facebookHeaders,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('❌ [Facebook Proxy] Error en respuesta:', response.status, response.statusText);
        return NextResponse.json(
          { error: `Error ${response.status}: ${response.statusText}` },
          { status: response.status }
        );
      }

      // Verificar que sea un archivo de video/audio
      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');

      console.log('📦 [Facebook Proxy] Headers recibidos:', {
        contentType,
        contentLength,
        status: response.status
      });

      // Validar tipos de contenido aceptados
      const validContentTypes = [
        'video/mp4', 'video/mp4', 'audio/mp4', 'audio/m4a',
        'application/octet-stream', 'binary/octet-stream'
      ];

      const isValidContentType = validContentTypes.some(type =>
        contentType.includes(type)
      );

      if (!isValidContentType && !contentType.includes('video') && !contentType.includes('audio')) {
        console.warn('⚠️ [Facebook Proxy] Content-Type inesperado:', contentType);
        // Continuamos de todas formas, Facebook a veces usa content-types extraños
      }

      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength === 0) {
        throw new Error('El archivo recibido está vacío');
      }

      console.log('✅ [Facebook Proxy] Descarga exitosa:', {
        size: arrayBuffer.byteLength,
        contentType
      });

      // Determinar content-type apropiado para la respuesta
      let responseContentType = contentType;
      if (filename.endsWith('.m4a')) {
        responseContentType = 'audio/mp4';
      } else if (filename.endsWith('.mp4')) {
        responseContentType = 'video/mp4';
      }

      // Crear respuesta con headers apropiados
      const headers = new Headers();
      headers.set('Content-Type', responseContentType);
      headers.set('Content-Length', arrayBuffer.byteLength.toString());
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      headers.set('Cache-Control', 'no-cache');
      headers.set('X-Content-Type-Options', 'nosniff');

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('⏰ [Facebook Proxy] Timeout en descarga');
        return NextResponse.json(
          { error: 'Timeout: La descarga tardó demasiado en responder' },
          { status: 408 }
        );
      }

      console.error('❌ [Facebook Proxy] Error de fetch:', fetchError);
      throw fetchError;
    }

  } catch (error: any) {
    console.error('💥 [Facebook Proxy] Error general:', error);

    return NextResponse.json(
      { error: 'Error interno del servidor: ' + error.message },
      { status: 500 }
    );
  }
}

// ✅ FUNCIÓN PARA DELEGAR A BACKEND EXTERNO (Python)
async function handleAudioWithExternalBackend(audioUrl: string, thumbnailUrl: string, filename: string, backendUrl: string) {
  try {
    const targetUrl = `${backendUrl.replace(/\/$/, '')}/facebook/proxy-merge`; // Ajustar según estructura real del backend

    console.log('🔗 [Proxy -> Python] Conectando a:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        thumbnail_url: thumbnailUrl,
        filename: filename
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [Python Backend] Error ${response.status}:`, errorText);
      throw new Error(`Backend Error: ${response.status} - ${errorText}`);
    }

    console.log('✅ [Python Backend] Respuesta recibida, iniciando stream...');

    // Pasar headers del backend al cliente
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'audio/mp4');
    responseHeaders.set('Content-Disposition', response.headers.get('Content-Disposition') || `attachment; filename="${filename}"`);
    responseHeaders.set('Content-Length', response.headers.get('Content-Length') || '');

    // Stream directo sin cargar en memoria
    return new NextResponse(response.body, {
      status: 200,
      headers: responseHeaders
    });

  } catch (error: any) {
    console.error('💥 [Proxy -> Python] Falló la delegación:', error);
    // Fallback silencioso a local si falla? O error?
    // Por ahora lanzamos error para que se note
    return NextResponse.json({ error: 'External Audio Processing Failed' }, { status: 502 });
  }
}

// ✅ FUNCIÓN PARA INCRUSTAR MINIATURA EN AUDIO (Copiada del proxy principal - Fallback Local)
async function handleAudioWithThumbnail(audioUrl: string, thumbnailUrl: string, filename: string) {
  try {
    console.log('🎨 [Facebook Proxy] Incrustando miniatura con FFmpeg...');
    const ffmpeg = require('fluent-ffmpeg');
    const ffmpegPath = require('ffmpeg-static');

    if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

    const { PassThrough } = require('stream');
    const outputStream = new PassThrough();

    const ffmpegPromise = new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(audioUrl)
        .input(thumbnailUrl)
        .outputOptions([
          '-map 0:0',
          '-map 1:0',
          '-c copy',
          '-disposition:v:1 attached_pic'
        ])
        .format('ipod') // Force M4A/MP4 container (fastest copy)
        .on('error', (err: Error) => {
          console.error('❌ [FFmpeg/Audio] Error:', err.message);
          reject(err);
        })
        .on('end', () => {
          console.log('✅ [FFmpeg/Audio] Finished!');
          resolve();
        })
        .pipe(outputStream, { end: true });
    });

    // Ajustar nombre archivo a .m4a
    let finalFilename = filename.replace(/\.(mp3|webm|mp4)$/, '.m4a');
    if (!finalFilename.endsWith('.m4a')) finalFilename += '.m4a';

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'audio/mp4');
    responseHeaders.set('Content-Disposition', `attachment; filename="${finalFilename}"`);

    // Stream response
    const webStream = new ReadableStream({
      start(controller) {
        outputStream.on('data', (chunk: any) => controller.enqueue(chunk));
        outputStream.on('end', () => controller.close());
        outputStream.on('error', (err: any) => controller.error(err));
      }
    });

    // Manejar errores de fondo
    ffmpegPromise.catch(err => console.error('BG Error:', err));

    return new NextResponse(webStream, {
      status: 200,
      headers: responseHeaders
    });

  } catch (error: any) {
    console.error('💥 [Facebook Proxy] Error embedding thumbnail:', error);
    return NextResponse.json({ error: 'Thumbnail embed failed' }, { status: 500 });
  }
}