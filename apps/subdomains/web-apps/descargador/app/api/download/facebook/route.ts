// app/api/download/facebook/route.ts - 100% SERVERLESS CON EXTRACCIÓN ROBUSTA DE MINIATURA Y MEDIOS
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 45; // Vercel timeout

interface ExtractedFacebookVideo {
  title: string
  thumbnail: string
  duration: number
  uploader: string
  hdUrl?: string
  sdUrl?: string
}

// Decodificar entidades HTML numéricas y con nombre
function decodeHtmlEntities(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&middot;/g, '·')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// Limpiar URLs de medios (reemplazar secuencias escapadas en JSON y HTML)
function cleanMediaUrl(u?: string | null): string {
  if (!u) return '';
  let clean = u
    .replace(/\\u00252F/g, '/')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/\\u00253D/g, '=')
    .replace(/\\u002526/g, '&')
    .replace(/\\u00253A/g, ':');
  return clean.startsWith('http') ? clean : '';
}

// Extracción especializada de miniatura de video en Facebook
function extractFacebookThumbnail(html: string): string {
  try {
    // 1. Buscar en estructuras JSON conocidas (preferir URIs con 't15', que es el identificador oficial de miniatura de video en fbcdn)
    const jsonUriRegex = /"(?:preferred_thumbnail|thumbnail|video_thumbnail|image|thumbnailImage|video_preview_image)"\s*:\s*(?:\{[^}]*"uri"\s*:\s*"([^"]+)"|"([^"]+)")/gi;
    let match;
    const jsonUris: string[] = [];
    while ((match = jsonUriRegex.exec(html)) !== null) {
      const raw = match[1] || match[2];
      const cleaned = cleanMediaUrl(raw);
      if (cleaned && cleaned.includes('fbcdn.net')) {
        jsonUris.push(cleaned);
      }
    }

    // Si hay URIs con t15 (video thumbnail oficial de Meta), devolver la primera
    const t15Json = jsonUris.find(u => u.includes('t15'));
    if (t15Json) return t15Json;
    if (jsonUris.length > 0) return jsonUris[0];

    // 2. Coincidencia directa con URL t15 de fbcdn en el HTML
    const t15Match = html.match(/https:[^"'\s\\]+fbcdn\.net[^"'\s\\]*\/t15[^"'\s\\]*\.(?:jpg|png|webp)[^"'\s\\]*/i) ||
                     html.match(/https:\\\/\\\/[^"'\s]+fbcdn\.net[^"'\s]*\\\/t15[^"'\s]*\.(?:jpg|png|webp)[^"'\s]*/i);
    if (t15Match) {
      const cleaned = cleanMediaUrl(t15Match[0]);
      if (cleaned) return cleaned;
    }

    // 3. Meta etiquetas OpenGraph / Twitter (flexible en orden de atributos)
    const metaMatch = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image|thumbnail)["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image|thumbnail)["']/i) ||
                      html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
    if (metaMatch) {
      const cleaned = cleanMediaUrl(metaMatch[1]);
      if (cleaned) return cleaned;
    }

    // 4. Cualquier imagen fbcdn que termine en jpg/png/webp
    const anyFbcdnMatch = html.match(/https:[^"'\s\\]+fbcdn\.net[^"'\s\\]*\.(?:jpg|png|webp)[^"'\s\\]*/i);
    if (anyFbcdnMatch) {
      return cleanMediaUrl(anyFbcdnMatch[0]);
    }
  } catch (e) {
    console.warn('⚠️ [Facebook Thumbnail] Error al extraer miniatura:', e);
  }
  return '';
}

// 1. Extractor Nativo de Facebook (Serverless sin backend)
async function extractDirectFacebook(url: string): Promise<ExtractedFacebookVideo | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      },
      redirect: 'follow'
    });

    if (!response.ok) return null;

    let html = await response.text();

    // Desescapar entidades Unicode y barras escapadas
    const unescaped = html
      .replace(/\\u00252F/g, '/')
      .replace(/\\u002F/g, '/')
      .replace(/\\\//g, '/');

    // Extracción de título y decodificación de entidades HTML
    const titleMatch = unescaped.match(/<title id="pageTitle">([^<]+)<\/title>/i) ||
                       unescaped.match(/property="og:title"\s+content="([^"]+)"/i) ||
                       unescaped.match(/content="([^"]+)"\s+property="og:title"/i) ||
                       unescaped.match(/name="description"\s+content="([^"]+)"/i) ||
                       unescaped.match(/content="([^"]+)"\s+name="description"/i) ||
                       unescaped.match(/<title[^>]*>([^<]+)<\/title>/i);
    
    let title = titleMatch ? titleMatch[1].replace(/ \| Facebook$/i, '').trim() : 'Video de Facebook';
    title = decodeHtmlEntities(title);

    // Extracción de miniatura con extractor especializado
    const thumbnail = extractFacebookThumbnail(html) || extractFacebookThumbnail(unescaped);

    // Extracción de streams HD
    const hdMatch = unescaped.match(/browser_native_hd_url["']?\s*:\s*["']([^"']+)["']/i) ||
                    unescaped.match(/playable_url_quality_hd["']?\s*:\s*["']([^"']+)["']/i) ||
                    unescaped.match(/hd_src["']?\s*:\s*["']([^"']+)["']/i) ||
                    unescaped.match(/"hd_src_no_ratelimit"\s*:\s*["']([^"']+)["']/i);

    // Extracción de streams SD
    const sdMatch = unescaped.match(/browser_native_sd_url["']?\s*:\s*["']([^"']+)["']/i) ||
                    unescaped.match(/playable_url["']?\s*:\s*["']([^"']+)["']/i) ||
                    unescaped.match(/sd_src["']?\s*:\s*["']([^"']+)["']/i) ||
                    unescaped.match(/"sd_src_no_ratelimit"\s*:\s*["']([^"']+)["']/i);

    const hdUrl = cleanMediaUrl(hdMatch ? hdMatch[1] : null);
    const sdUrl = cleanMediaUrl(sdMatch ? sdMatch[1] : null);

    if (!hdUrl && !sdUrl) return null;

    return {
      title,
      thumbnail,
      duration: 60,
      uploader: 'Facebook Video',
      hdUrl: hdUrl || undefined,
      sdUrl: sdUrl || undefined
    };
  } catch (err) {
    console.warn('⚠️ [Facebook Direct] Falló extracción directa:', err);
    return null;
  }
}

// 2. Extractor Fallback Serverless
async function extractFallbackFacebook(url: string): Promise<ExtractedFacebookVideo | null> {
  try {
    const res = await fetch('https://api.tiklydown.com/api/download/facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && (data.hd || data.sd || data.video_url)) {
        return {
          title: decodeHtmlEntities(data.title || 'Video de Facebook'),
          thumbnail: cleanMediaUrl(data.thumbnail || ''),
          duration: data.duration || 60,
          uploader: decodeHtmlEntities(data.author || 'Facebook Creator'),
          hdUrl: cleanMediaUrl(data.hd || data.video_url),
          sdUrl: cleanMediaUrl(data.sd || data.video_url)
        };
      }
    }
  } catch (err) {
    // Ignorar fallback
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || (!url.includes('facebook.com') && !url.includes('fb.watch'))) {
      return NextResponse.json(
        { error: 'Por favor, ingresa un enlace válido de Facebook' },
        { status: 400 }
      );
    }

    console.log('📥 [Facebook Serverless] Procesando URL:', url);

    // Intentar Extractor Directo
    let extracted = await extractDirectFacebook(url);

    // Si falló, intentar fallback serverless
    if (!extracted) {
      console.log('🔄 [Facebook Serverless] Intentando fallback serverless...');
      extracted = await extractFallbackFacebook(url);
    }

    // Si ambos fallaron y hay backend configurado, probarlo como último recurso
    const pythonUrl = process.env.PYTHON_API_URL || process.env.PYTHON_BACKEND_URL;
    if (!extracted && pythonUrl) {
      try {
        console.log('🔄 [Facebook] Intentando backend externo como último recurso...');
        const pyRes = await fetch(`${pythonUrl.replace(/\/$/, '')}/api/v1/facebook/info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        if (pyRes.ok) {
          const pyData = await pyRes.json();
          if (pyData && pyData.title) {
            pyData.title = decodeHtmlEntities(pyData.title);
          }
          return NextResponse.json(pyData);
        }
      } catch (e) {
        // Ignorar
      }
    }

    if (!extracted || (!extracted.hdUrl && !extracted.sdUrl)) {
      return NextResponse.json(
        { error: 'No se pudo obtener el video de Facebook. Verifica que el video sea público y accesible.' },
        { status: 404 }
      );
    }

    const formats = [];

    if (extracted.hdUrl) {
      formats.push({
        quality: 'HD (1080p)',
        format: 'mp4',
        resolution: '1080p',
        size: 'Alta Definición',
        url: extracted.hdUrl,
        hasAudio: true,
        hasVideo: true
      });
    }

    if (extracted.sdUrl) {
      formats.push({
        quality: 'SD (480p)',
        format: 'mp4',
        resolution: '480p',
        size: 'Estándar',
        url: extracted.sdUrl,
        hasAudio: true,
        hasVideo: true
      });
    }

    // Pista de Audio
    const audioUrl = extracted.sdUrl || extracted.hdUrl;
    if (audioUrl) {
      formats.push({
        quality: 'Audio Only .m4a',
        format: 'm4a',
        resolution: 'Audio',
        size: 'Audio',
        url: audioUrl,
        hasAudio: true,
        hasVideo: false
      });
    }

    const responsePayload = {
      status: 'success',
      platform: 'facebook',
      title: extracted.title,
      thumbnail: extracted.thumbnail,
      duration: extracted.duration,
      uploader: extracted.uploader,
      formats
    };

    console.log('✅ [Facebook Serverless] Extracción exitosa. Formatos disponibles:', formats.length, 'Miniatura:', extracted.thumbnail ? 'Sí' : 'No');
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('💥 [Facebook API Error]:', error);
    return NextResponse.json(
      { error: 'Error al procesar el video de Facebook: ' + (error?.message || 'Error desconocido') },
      { status: 500 }
    );
  }
}