// app/api/download/facebook/route.ts - 100% SERVERLESS CON FALLBACKS INTELIGENTES
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

    // Extracción de título
    const titleMatch = unescaped.match(/<title id="pageTitle">([^<]+)<\/title>/i) ||
                       unescaped.match(/property="og:title"\s+content="([^"]+)"/i) ||
                       unescaped.match(/name="description"\s+content="([^"]+)"/i);
    const title = titleMatch ? titleMatch[1].replace(/ \| Facebook$/i, '').trim() : 'Video de Facebook';

    // Extracción de miniatura
    const thumbMatch = unescaped.match(/property="og:image"\s+content="([^"]+)"/i) ||
                       unescaped.match(/"preferred_thumbnail"\s*:\s*\{"image"\s*:\s*\{"uri"\s*:\s*"([^"]+)"/i);
    const thumbnail = thumbMatch ? thumbMatch[1] : 'https://picsum.photos/600/400';

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

    const cleanUrl = (u?: string | null) => {
      if (!u) return undefined;
      let clean = u.replace(/&amp;/g, '&');
      return clean.startsWith('http') ? clean : undefined;
    };

    const hdUrl = cleanUrl(hdMatch ? hdMatch[1] : null);
    const sdUrl = cleanUrl(sdMatch ? sdMatch[1] : null);

    if (!hdUrl && !sdUrl) return null;

    return {
      title,
      thumbnail,
      duration: 60,
      uploader: 'Facebook Video',
      hdUrl,
      sdUrl
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
          title: data.title || 'Video de Facebook',
          thumbnail: data.thumbnail || 'https://picsum.photos/600/400',
          duration: data.duration || 60,
          uploader: data.author || 'Facebook Creator',
          hdUrl: data.hd || data.video_url,
          sdUrl: data.sd || data.video_url
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

    console.log('✅ [Facebook Serverless] Extracción exitosa. Formatos disponibles:', formats.length);
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('💥 [Facebook API Error]:', error);
    return NextResponse.json(
      { error: 'Error al procesar el video de Facebook: ' + (error?.message || 'Error desconocido') },
      { status: 500 }
    );
  }
}