// app/api/download/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

function findFfmpegBinary(): string | null {
  try {
    const staticPath = require('ffmpeg-static')
    if (staticPath && fs.existsSync(staticPath)) return staticPath
  } catch {}

  const candidates = [
    path.join(process.cwd(), 'bin', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    path.join(process.cwd(), 'apps', 'subdomains', 'web-apps', 'descargador', 'bin', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    'D:\\PROYECTOS\\atpdev-web\\apps\\subdomains\\web-apps\\descargador\\bin\\ffmpeg.exe'
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return null
}

// ✅ TIMEOUTS EXTENDIDOS PARA VIDEOS GRANDES Y COMBINACIÓN
const COMBINE_TIMEOUT = 300000 // 5 minutos para combinación
const DOWNLOAD_TIMEOUT = 240000 // 4 minutos para descargas individuales
const CONNECT_TIMEOUT = 60000   // 60 segundos para conexión inicial

// ✅ FUNCIÓN PARA VALIDAR URLs DE DESCARGA
function isValidDownloadUrl(url: string): boolean {
  if (!url || !url.startsWith('http')) return false

  // Evitar páginas HTML de visualización (no son archivos de medios)
  const isWebPage = 
    url.includes('youtube.com/watch') || 
    url.includes('youtu.be/') ||
    url.includes('youtube.com/shorts') ||
    url.includes('facebook.com/watch') ||
    url.includes('fb.watch/') ||
    (url.includes('tiktok.com/@') && !url.includes('tiktokcdn.com'))

  if (isWebPage) return false

  // Permitir cualquier CDN o URL directa de medios
  const validDomains = [
    'googlevideo.com',
    'videoplayback',
    'rr',
    'fbcdn.net',
    'facebook.com',
    'fbsbx.com',
    'tiktokcdn.com',
    'tikwm.com',
    'tiktok.com',
    'cdninstagram.com',
    'instagram.com',
    'threads.net',
    'threads.com',
    'twimg.com',
    'twitter.com',
    'x.com',
    'snapcdn.app',
    'fxtwitter.com',
    'vxtwitter.com'
  ]

  return validDomains.some(domain => url.includes(domain)) || url.includes('.mp4') || url.includes('.m4a') || url.includes('.mp3') || url.includes('.webm')
}

// ✅ ENCABEZADOS ADAPTATIVOS SEGÚN PLATAFORMA (Evita bloqueos 403 Forbidden por Hotlinking/Cross-Origin)
function getPlatformHeaders(url: string, detectedIsAudio: boolean, detectedIsVideo: boolean): Record<string, string> {
  const baseHeaders: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': detectedIsAudio ? 'audio/*' : detectedIsVideo ? 'video/*,*/*' : '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'identity',
  }

  // Twitter / X (video.twimg.com)
  if (url.includes('twimg.com') || url.includes('twitter.com') || url.includes('x.com')) {
    return {
      ...baseHeaders,
      'Referer': 'https://twitter.com/',
      'Sec-Fetch-Dest': detectedIsAudio ? 'audio' : 'video',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site'
    }
  }

  // Snapcdn / SaveTwitter CDN
  if (url.includes('snapcdn.app') || url.includes('savetwitter.net')) {
    return {
      ...baseHeaders,
      'Referer': 'https://savetwitter.net/',
      'Origin': 'https://savetwitter.net'
    }
  }

  // Instagram / Meta CDN
  if (url.includes('cdninstagram.com') || url.includes('instagram.com') || url.includes('fbcdn.net') || url.includes('fbsbx.com')) {
    return {
      ...baseHeaders,
      'Referer': 'https://www.instagram.com/',
      'Sec-Fetch-Dest': detectedIsAudio ? 'audio' : 'video'
    }
  }

  // Threads
  if (url.includes('threads.net') || url.includes('threads.com') || url.includes('cdnthreads.com')) {
    return {
      ...baseHeaders,
      'Referer': url.includes('threads.com') ? 'https://www.threads.com/' : 'https://www.threads.net/'
    }
  }

  // TikTok CDN
  if (url.includes('tiktokcdn.com') || url.includes('tiktok.com') || url.includes('tikwm.com')) {
    return {
      ...baseHeaders,
      'Referer': 'https://www.tiktok.com/'
    }
  }

  // YouTube / GoogleVideo
  if (url.includes('googlevideo.com') || url.includes('youtube.com') || url.includes('youtu.be')) {
    return {
      ...baseHeaders,
      'Referer': 'https://www.youtube.com/',
      'Origin': 'https://www.youtube.com',
      'Range': 'bytes=0-',
      'Sec-Fetch-Dest': detectedIsAudio ? 'audio' : 'video'
    }
  }

  // Genérico: intentar derivar referer del host
  try {
    const parsed = new URL(url)
    baseHeaders['Referer'] = `${parsed.protocol}//${parsed.host}/`
  } catch {}

  return baseHeaders
}

function getFfmpegHeadersString(url: string): string {
  if (url.includes('twimg.com') || url.includes('twitter.com') || url.includes('x.com')) {
    return 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://twitter.com/\r\n'
  }
  if (url.includes('snapcdn.app') || url.includes('savetwitter.net')) {
    return 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://savetwitter.net/\r\nOrigin: https://savetwitter.net\r\n'
  }
  if (url.includes('cdninstagram.com') || url.includes('instagram.com') || url.includes('fbcdn.net') || url.includes('fbsbx.com')) {
    return 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.instagram.com/\r\n'
  }
  if (url.includes('threads.net') || url.includes('threads.com')) {
    return 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.threads.com/\r\n'
  }
  if (url.includes('tiktokcdn.com') || url.includes('tiktok.com') || url.includes('tikwm.com')) {
    return 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.tiktok.com/\r\n'
  }
  return 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.youtube.com/\r\n'
}

export async function POST(request: NextRequest) {
  try {
    const { url, filename, quality, isAudio, isCombined = false, video_url, audio_url, thumbnailUrl } = await request.json()

    console.log('🔧 [Proxy] Solicitud recibida:', {
      url: url?.substring(0, 100),
      filename,
      quality,
      isAudio,
      isCombined,
      hasVideoUrl: !!video_url,
      hasAudioUrl: !!audio_url,
      hasThumbnail: !!thumbnailUrl
    })

    // ✅ MANEJAR AUDIO CON MINIATURA (Nuevo Feature)
    if (isAudio && url && thumbnailUrl) {
      console.log('🎵 [Proxy] Procesando audio con miniatura...')
      return await handleAudioWithThumbnail(url, thumbnailUrl, filename)
    }

    // ✅ MANEJAR COMBINACIÓN DE AUDIO Y VIDEO (nueva estructura)
    if (isCombined && video_url && audio_url) {
      console.log('🎵 [Proxy] Iniciando combinación de audio y video...')
      // ✅ VALIDAR URLs ANTES DE PROCESAR
      if (!isValidDownloadUrl(video_url)) {
        return NextResponse.json({
          error: 'URL de video inválida para descarga directa'
        }, { status: 400 })
      }
      if (!isValidDownloadUrl(audio_url)) {
        return NextResponse.json({
          error: 'URL de audio inválida para descarga directa'
        }, { status: 400 })
      }
      return await handleCombinedDownload(video_url, audio_url, filename, quality)
    }

    // 🔥 MANEJAR DESCARGA COMBINADA (estructura antigua - para compatibilidad)
    if (isCombined && url) {
      console.log('🔄 [Proxy] Descarga combinada (estructura antigua)...')
      return await handleCombinedDownloadBase64(url, filename)
    }

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // ✅ VALIDAR URL ANTES DE DESCARGAR
    if (!isValidDownloadUrl(url)) {
      console.error('❌ [Proxy] URL inválida para descarga directa:', url.substring(0, 200))
      return NextResponse.json({
        error: 'URL inválida para descarga directa. Esta parece ser una página web, no un archivo de video/audio.'
      }, { status: 400 })
    }

    console.log('🔧 [Proxy] Descargando desde:', url.substring(0, 100) + '...')
    console.log('📋 [Proxy] Parámetros:', { filename, quality, isAudio })

    // Detectar tipo de contenido basado en parámetros y URL
    const detectedIsAudio = isAudio ||
      url.includes('mime=audio') ||
      url.includes('m4a') ||
      url.includes('webm') ||
      url.includes('audio') ||
      quality === 'audio'

    const detectedIsVideo = !detectedIsAudio && (
      url.includes('mime=video') ||
      url.includes('mp4') ||
      url.includes('video') ||
      quality !== undefined
    )

    // ✅ CONFIGURACIÓN MEJORADA: Timeouts extendidos para videos grandes
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log('⏰ [Proxy] Timeout alcanzado (4 minutos), abortando...')
      controller.abort()
    }, DOWNLOAD_TIMEOUT)

    try {
      // ✅ ESTRATEGIAS ADAPTATIVAS DE HEADERS SEGÚN LA PLATAFORMA Y RESPUESTA (Evita 403 Forbidden)
      const primaryHeaders = getPlatformHeaders(url, detectedIsAudio, detectedIsVideo)
      const cleanHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': detectedIsAudio ? 'audio/*' : detectedIsVideo ? 'video/*,*/*' : '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      }
      const mobileHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      }

      const headerStrategies = [primaryHeaders, cleanHeaders, mobileHeaders]
      let response: Response | null = null

      for (let attempt = 0; attempt < headerStrategies.length; attempt++) {
        try {
          console.log(`🔄 [Proxy] Intento ${attempt + 1} de ${headerStrategies.length} para: ${url.substring(0, 70)}...`)
          const headers = headerStrategies[attempt]

          response = await fetch(url, {
            method: 'GET',
            headers,
            redirect: 'follow',
            signal: controller.signal,
          })

          if (response.ok) {
            const contentType = response.headers.get('content-type') || ''
            if (!contentType.includes('text/html') && !contentType.includes('application/json')) {
              // ✅ Flujo multimedia válido recibido
              break
            } else {
              console.warn(`⚠️ [Proxy] Intento ${attempt + 1}: Devolvió HTML/JSON, reintentando con otra estrategia...`)
            }
          } else {
            console.warn(`⚠️ [Proxy] Intento ${attempt + 1} falló con status ${response.status} ${response.statusText}`)
            // Si el intento falló con 403 (Forbidden) o 401, el siguiente intento usará otra estrategia de headers
            if (attempt < headerStrategies.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 800))
            }
          }
        } catch (fetchError: any) {
          console.warn(`⚠️ [Proxy] Intento ${attempt + 1} arrojó error:`, fetchError.message)
          if (attempt < headerStrategies.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 800))
          }
        }
      }

      clearTimeout(timeoutId)

      if (!response || !response.ok) {
        console.error('❌ [Proxy] Todos los intentos de descarga fallaron:', response?.status, response?.statusText)
        return NextResponse.json({
          error: `No se pudo descargar el archivo del servidor de origen (${response ? response.status : 502}: ${response ? response.statusText : 'Fallo de conexión'}). El enlace puede requerir descarga directa.`,
          status: response ? response.status : 502,
          fallback_url: url
        }, { status: response ? response.status : 502 })
      }

      if (!response!.body) {
        return NextResponse.json({ error: 'No se recibió flujo de datos multimedia' }, { status: 500 })
      }

      const upstreamContentType = response!.headers.get('content-type') || ''
      const upstreamContentLength = response!.headers.get('content-length')

      // Verificar que el archivo no sea una página de error o HTML
      if (upstreamContentType.includes('text/html') || upstreamContentType.includes('application/json')) {
        console.error('❌ [Proxy] El servidor devolvió HTML/JSON, no multimedia:', upstreamContentType)
        return NextResponse.json({
          error: 'El enlace multimedia expiró o es inválido. Por favor intenta de nuevo.'
        }, { status: 400 })
      }

      // Detectar tipo de contenido y extensión
      let contentType = upstreamContentType
      let fileExtension = 'mp4'

      if (!contentType || contentType === 'application/octet-stream') {
        if (detectedIsAudio) {
          contentType = 'audio/mp4'
          fileExtension = url.includes('m4a') ? 'm4a' : 'mp3'
        } else if (detectedIsVideo) {
          contentType = 'video/mp4'
          fileExtension = 'mp4'
        } else {
          contentType = 'video/mp4'
        }
      }

      if (contentType.includes('audio/mp4') || contentType.includes('audio/m4a')) {
        fileExtension = 'm4a'
      } else if (contentType.includes('audio/mpeg')) {
        fileExtension = 'mp3'
      } else if (contentType.includes('video/mp4')) {
        fileExtension = 'mp4'
      } else if (contentType.includes('video/webm')) {
        fileExtension = 'webm'
      }

      let finalFilename = filename
      if (!finalFilename) {
        const timestamp = Date.now()
        if (detectedIsAudio) {
          finalFilename = `audio_${timestamp}.${fileExtension}`
        } else if (quality) {
          finalFilename = `video_${quality}_${timestamp}.${fileExtension}`
        } else {
          finalFilename = `download_${timestamp}.${fileExtension}`
        }
      }

      if (!finalFilename.includes('.')) {
        finalFilename += `.${fileExtension}`
      }

      const responseHeaders = new Headers()
      responseHeaders.set('Content-Type', contentType)
      responseHeaders.set('Content-Disposition', `attachment; filename="${finalFilename}"`)
      responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      if (upstreamContentLength) {
        responseHeaders.set('Content-Length', upstreamContentLength)
        responseHeaders.set('X-File-Size', upstreamContentLength)
      }
      responseHeaders.set('X-File-Type', detectedIsAudio ? 'audio' : detectedIsVideo ? 'video' : 'file')
      responseHeaders.set('X-Download-Mode', 'streaming')
      responseHeaders.set('X-Url-Validated', 'true')

      console.log(`✅ [Proxy] Transmitiendo en tiempo real hacia el cliente: ${finalFilename} (${upstreamContentLength ? (parseInt(upstreamContentLength, 10) / (1024 * 1024)).toFixed(1) + ' MB' : 'stream'})`)

      return new NextResponse(response!.body, {
        status: 200,
        headers: responseHeaders
      })

    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      console.error('❌ [Proxy] Fetch error:', fetchError)

      // ✅ MANEJO ESPECÍFICO DE TIMEOUT CON MENSAJES MEJORADOS
      if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        return NextResponse.json({
          error: 'Timeout: La descarga tomó más de 4 minutos. Para videos grandes (>90MB) recomiendo: 1) Usar WiFi, 2) Intentar calidad 720p o 480p, 3) Reintentar más tarde.'
        }, { status: 408 })
      }

      // ✅ MANEJO DE HTML/JSON INESPERADO
      if (fetchError.message.includes('HTML') || fetchError.message.includes('JSON') || fetchError.message.includes('página web')) {
        return NextResponse.json({
          error: fetchError.message
        }, { status: 400 })
      }

      // ✅ MANEJO DE OTROS ERRORES DE RED
      if (fetchError.message.includes('fetch failed') || fetchError.message.includes('network')) {
        return NextResponse.json({
          error: 'Error de red: No se pudo conectar al servidor. Verifica tu conexión a internet.'
        }, { status: 502 })
      }

      // ✅ ERROR DE SSL/CERTIFICADO
      if (fetchError.message.includes('certificate') || fetchError.message.includes('SSL')) {
        return NextResponse.json({
          error: 'Error de seguridad: No se pudo establecer conexión segura. Intenta nuevamente.'
        }, { status: 526 })
      }

      throw fetchError
    }

  } catch (error: any) {
    console.error('💥 [Proxy] Download error:', error)
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// ✅ FUNCIÓN PARA MANEJAR COMBINACIÓN DE AUDIO Y VIDEO (IMPLEMENTACIÓN REAL CON FFMPEG)
async function handleCombinedDownload(videoUrl: string, audioUrl: string, filename: string, quality?: string) {
  try {
    console.log('🎵 [Proxy] Iniciando combinación REAL con FFmpeg...')
    console.log('📹 Video URL:', videoUrl.substring(0, 100) + '...')
    console.log('🎶 Audio URL:', audioUrl.substring(0, 100) + '...')

    // Importaciones dinámicas para evitar problemas en build time si no se usan
    const ffmpeg = require('fluent-ffmpeg');
    const ffmpegPath = findFfmpegBinary();

    if (ffmpegPath) {
      ffmpeg.setFfmpegPath(ffmpegPath);
    } else {
      throw new Error('ffmpeg binary not found in system or bin directory');
    }

    const { PassThrough } = require('stream');

    // Crear streams de salida
    const outputStream = new PassThrough();

    // Promesa para manejar el proceso de ffmpeg
    const ffmpegPromise = new Promise<void>((resolve, reject) => {
      const command = ffmpeg()
        .input(videoUrl)
        .inputOptions([
          '-headers', getFfmpegHeadersString(videoUrl),
          '-re'
        ])
        .input(audioUrl)
        .inputOptions([
          '-headers', getFfmpegHeadersString(audioUrl),
          '-re'
        ])
        .outputOptions([
          '-c:v copy',
          '-c:a aac',
          '-strict experimental',
          '-movflags frag_keyframe+empty_moov'
        ])
        .format('mp4')
        .on('start', (commandLine: string) => {
          console.log('🚀 [FFmpeg] Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', (err: Error, stdout: string, stderr: string) => {
          console.error('❌ [FFmpeg] Error:', err.message);
          console.error('❌ [FFmpeg] Stderr:', stderr);
          reject(err);
        })
        .on('end', () => {
          console.log('✅ [FFmpeg] Processing finished!');
          resolve();
        });

      // Pipe to output stream
      command.pipe(outputStream, { end: true });
    });

    // Crear nombre de archivo final
    let finalFilename = filename || `youtube_${quality || 'combined'}_${Date.now()}.mp4`
    if (!finalFilename.endsWith('.mp4')) {
      finalFilename += '.mp4'
    }

    // Configurar encabezados de respuesta
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'video/mp4');
    responseHeaders.set('Content-Disposition', `attachment; filename="${finalFilename}"`);

    const webStream = new ReadableStream({
      start(controller) {
        outputStream.on('data', (chunk: any) => {
          controller.enqueue(chunk);
        });
        outputStream.on('end', () => {
          controller.close();
        });
        outputStream.on('error', (err: any) => {
          controller.error(err);
        });
      }
    });

    ffmpegPromise.catch(err => {
      console.error('💥 [Proxy] FFmpeg Background Error:', err);
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: responseHeaders
    });

  } catch (error: any) {
    console.error('💥 [Proxy] Error en combinación FFmpeg:', error)
    return NextResponse.json({
      error: 'Error combinando audio y video: ' + (error instanceof Error ? error.message : 'Unknown error'),
      details: 'El servidor no pudo procesar la combinación.',
      fallback_url: videoUrl
    }, { status: 500 })
  }
}

// ✅ FUNCIÓN PARA INCRUSTAR MINIATURA EN AUDIO (Cover Art / Portada de álbum)
async function handleAudioWithThumbnail(audioUrl: string, thumbnailUrl: string, filename: string) {
  try {
    console.log('🎨 [Proxy] Incrustando miniatura en audio con FFmpeg...')
    const ffmpeg = require('fluent-ffmpeg');
    const ffmpegPath = findFfmpegBinary();

    if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

    const { PassThrough } = require('stream');
    const outputStream = new PassThrough();

    const ffmpegPromise = new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(audioUrl)
        .inputOptions([
          '-headers', getFfmpegHeadersString(audioUrl)
        ])
        .input(thumbnailUrl)
        .inputOptions([
          '-headers', getFfmpegHeadersString(thumbnailUrl)
        ])
        .outputOptions([
          '-map 0:a',
          '-map 1:v',
          '-c:a copy',
          '-c:v mjpeg',
          '-disposition:v:0 attached_pic',
          '-movflags frag_keyframe+empty_moov'
        ])
        .format('ipod') // 'ipod' es el formato para m4a/mp4 amigable con tags y carátulas
        .on('error', (err: Error) => {
          console.error('❌ [FFmpeg/Audio] Error incrustando carátula:', err.message);
          reject(err);
        })
        .on('end', () => {
          console.log('✅ [FFmpeg/Audio] Audio con portada incrustada exitosamente!');
          resolve();
        })
        .pipe(outputStream, { end: true });
    });

    // Ajustar nombre archivo a .m4a (mucho más rápido y compatible)
    let finalFilename = filename.replace(/\.(mp3|webm)$/, '.m4a');
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
    console.error('💥 [Proxy] Error embedding thumbnail:', error);
    // Fallback a descarga normal si falla ffmpeg
    return NextResponse.json({ error: 'Thumbnail embed failed' }, { status: 500 });
  }
}

// ✅ FUNCIÓN PARA MANEJAR DESCARGA COMBINADA (estructura antigua - base64)
async function handleCombinedDownloadBase64(fileContent: string, filename: string) {
  try {
    console.log('🎯 [Proxy] Procesando archivo combinado base64...')

    if (!fileContent) {
      return NextResponse.json({ error: 'No file content provided' }, { status: 400 })
    }

    // Verificar si es base64 válido
    if (!fileContent.startsWith('data:')) {
      // Si no es base64, validar si es una URL válida
      if (isValidDownloadUrl(fileContent)) {
        console.log('🔄 [Proxy] Redirigiendo a descarga normal...')
        return NextResponse.json({
          redirect: true,
          url: fileContent,
          filename: filename
        }, { status: 200 })
      } else {
        return NextResponse.json({
          error: 'URL inválida para descarga directa'
        }, { status: 400 })
      }
    }

    // Decodificar el contenido base64
    const base64Data = fileContent.replace(/^data:video\/mp4;base64,/, '')
    const fileBuffer = Buffer.from(base64Data, 'base64')

    if (fileBuffer.length === 0) {
      return NextResponse.json({ error: 'Empty file content' }, { status: 500 })
    }

    console.log(`✅ [Proxy] Archivo combinado procesado: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`)

    // Crear nombre de archivo por defecto si no se proporciona
    let finalFilename = filename || `youtube_combined_${Date.now()}.mp4`

    // Asegurar extensión .mp4
    if (!finalFilename.endsWith('.mp4')) {
      finalFilename += '.mp4'
    }

    // Crear respuesta con el archivo
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': fileBuffer.length.toString(),
        'X-File-Size': fileBuffer.length.toString(),
        'X-File-Type': 'video',
        'X-Combined': 'true'
      }
    })

  } catch (error: any) {
    console.error('💥 [Proxy] Error procesando archivo combinado:', error)
    return NextResponse.json({
      error: 'Error processing combined file: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}