// app/api/download/instagram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const maxDuration = 60;

interface InstagramFormat {
  quality: string;
  format: string;
  url: string;
  size?: string;
  isAudio?: boolean;
}

interface InstagramMediaResult {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  formats: InstagramFormat[];
}

function findYtDlpBinary(): string | null {
  const possiblePaths = [
    path.join(process.cwd(), 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'),
    path.join(process.cwd(), 'apps', 'subdomains', 'web-apps', 'descargador', 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'),
    process.platform === 'win32'
      ? 'D:\\PROYECTOS\\atpdev-web\\apps\\subdomains\\web-apps\\descargador\\bin\\yt-dlp.exe'
      : '/usr/local/bin/yt-dlp'
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// 1. Extractor con yt-dlp local
async function extractInstagramWithYtDlp(url: string, binPath: string): Promise<InstagramMediaResult | null> {
  const nodeBin = process.execPath || 'node';
  return new Promise((resolve) => {
    const args = [
      '--dump-json',
      '--js-runtimes', `node:${nodeBin}`,
      '--no-warnings',
      '--no-check-certificates',
      '--geo-bypass',
      url
    ];

    const proc = spawn(binPath, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', chunk => stdout += chunk.toString());
    proc.stderr.on('data', chunk => stderr += chunk.toString());

    proc.on('close', code => {
      if (code === 0 && stdout) {
        try {
          const data = JSON.parse(stdout);
          const formats: InstagramFormat[] = [];

          // Video formats
          const vFormats = (data.formats || []).filter((f: any) => f.vcodec !== 'none' && f.url);
          if (vFormats.length > 0) {
            vFormats.sort((a: any, b: any) => (b.height || 0) - (a.height || 0));
            const best = vFormats[0];
            formats.push({
              quality: best.height ? `${best.height}p HD` : 'HD Video',
              format: 'MP4',
              url: best.url,
              size: best.filesize ? `${(best.filesize / (1024 * 1024)).toFixed(1)} MB` : undefined
            });
            if (vFormats.length > 1) {
              const sd = vFormats[vFormats.length - 1];
              if (sd.url !== best.url) {
                formats.push({
                  quality: sd.height ? `${sd.height}p SD` : 'SD Video',
                  format: 'MP4',
                  url: sd.url,
                  size: sd.filesize ? `${(sd.filesize / (1024 * 1024)).toFixed(1)} MB` : undefined
                });
              }
            }
          } else if (data.url) {
            formats.push({
              quality: 'HD Video',
              format: 'MP4',
              url: data.url
            });
          }

          if (formats.length > 0) {
            return resolve({
              title: data.title || data.description?.slice(0, 80) || 'Video de Instagram',
              thumbnail: data.thumbnail || 'https://picsum.photos/600/800',
              duration: Math.round(data.duration || 30),
              uploader: data.uploader || data.channel || 'Instagram User',
              formats
            });
          }
        } catch {
          // parse error
        }
      }
      resolve(null);
    });

    proc.on('error', () => resolve(null));
  });
}

// 2. Extractor Directo de Instagram (Embed OpenGraph y metadatos)
async function extractDirectInstagram(url: string): Promise<InstagramMediaResult | null> {
  try {
    const match = url.match(/\/(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const shortcode = match[1];

    const embedUrl = `https://www.instagram.com/reel/${shortcode}/embed/captioned/`;
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Desescapar barras
    const unescaped = html.replace(/\\u00252F/g, '/').replace(/\\u002F/g, '/').replace(/\\\//g, '/').replace(/\\u0026/g, '&');

    // Buscar streams de video en el payload de Instagram
    const videoMatches = [
      ...Array.from(unescaped.matchAll(/"video_url":"([^"]+)"/g)),
      ...Array.from(unescaped.matchAll(/playable_url(?:_quality_hd)?["']?\s*:\s*["']([^"']+)["']/g)),
      ...Array.from(unescaped.matchAll(/browser_native_hd_url["']?\s*:\s*["']([^"']+)["']/g))
    ];

    const videoUrls = videoMatches
      .map((m: any) => (m[1] as string)?.replace(/&amp;/g, '&'))
      .filter((u): u is string => Boolean(u && u.startsWith('http') && (u.includes('cdninstagram.com') || u.includes('fbcdn.net') || u.includes('.mp4'))));

    // Buscar miniatura
    const thumbMatch = unescaped.match(/"display_url":"([^"]+)"/) ||
                       unescaped.match(/property="og:image"\s+content="([^"]+)"/i) ||
                       unescaped.match(/<img[^>]*class="[^"]*EmbeddedMediaImage[^"]*"[^>]*src="([^"]+)"/i);
    const thumbnail = thumbMatch ? thumbMatch[1].replace(/&amp;/g, '&') : 'https://picsum.photos/600/800';

    // Buscar caption/título
    const captionMatch = unescaped.match(/<div class="Caption">([\s\S]*?)<\/div>/i) ||
                         unescaped.match(/<title>([^<]+)<\/title>/i);
    const title = captionMatch ? captionMatch[1].replace(/<[^>]+>/g, '').trim() : 'Reel de Instagram';

    if (videoUrls.length > 0) {
      const uniqueUrls = Array.from(new Set(videoUrls));
      const formats: InstagramFormat[] = [
        {
          quality: 'HD 1080p',
          format: 'MP4',
          url: uniqueUrls[0]
        }
      ];

      if (uniqueUrls.length > 1) {
        formats.push({
          quality: 'SD 720p',
          format: 'MP4',
          url: uniqueUrls[1]
        });
      }

      return {
        title: title || 'Video de Instagram',
        thumbnail,
        duration: 30,
        uploader: 'Instagram Creator',
        formats
      };
    }
  } catch (e) {
    console.warn('⚠️ [Instagram Direct] Falló extracción directa:', e);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || (!url.includes('instagram.com') && !url.includes('instagr.am'))) {
      return NextResponse.json(
        { error: 'URL de Instagram inválida. Debe ser un Reel, Post o Video de instagram.com' },
        { status: 400 }
      );
    }

    console.log('📸 [Instagram Engine] Procesando URL:', url);

    // Intentar 1: Directo con OpenGraph / Embed
    let result = await extractDirectInstagram(url);

    // Intentar 2: yt-dlp local
    if (!result) {
      const bin = findYtDlpBinary();
      if (bin) {
        console.log('🔄 [Instagram Engine] Probando extractor local yt-dlp...');
        result = await extractInstagramWithYtDlp(url, bin);
      }
    }

    if (!result || result.formats.length === 0) {
      return NextResponse.json(
        {
          error: 'No se pudo extraer el video de Instagram. Asegúrate de que el Reel o Post sea público.',
          help: 'Verifica que la cuenta no sea privada y que el video esté disponible.'
        },
        { status: 404 }
      );
    }

    // Agregar opción de audio si hay video
    if (result.formats.length > 0 && !result.formats.some(f => f.isAudio)) {
      result.formats.push({
        quality: 'Audio M4A (Original)',
        format: 'M4A',
        url: result.formats[0].url,
        isAudio: true
      });
    }

    return NextResponse.json({
      status: 'success',
      ...result
    });

  } catch (error: any) {
    console.error('💥 [Instagram API] Error:', error);
    return NextResponse.json(
      { error: 'Error procesando solicitud de Instagram: ' + error.message },
      { status: 500 }
    );
  }
}
