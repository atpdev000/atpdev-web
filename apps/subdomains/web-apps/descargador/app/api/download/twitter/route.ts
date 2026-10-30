// app/api/download/twitter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const maxDuration = 60;

interface TwitterFormat {
  quality: string;
  format: string;
  url: string;
  size?: string;
  isAudio?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
}

interface TwitterMediaResult {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  formats: TwitterFormat[];
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

// 1. Extractor con SaveTwitter API
async function extractSaveTwitter(url: string): Promise<TwitterMediaResult | null> {
  try {
    const form = new URLSearchParams({
      q: url,
      lang: 'en',
      cftoken: ''
    });

    const res = await fetch('https://savetwitter.net/api/ajaxSearch', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        origin: 'https://savetwitter.net',
        referer: 'https://savetwitter.net/en4',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36'
      },
      body: form.toString()
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data.status === 'ok' && typeof data.data === 'string') {
      const html = data.data;

      // Extraer thumbnail
      const thumbMatch = html.match(/class="thumbnail"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/i) ||
                         html.match(/class="download-items__thumb"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/i);
      const thumbnail = thumbMatch ? thumbMatch[1] : 'https://picsum.photos/600/400';

      // Extraer título / tweet
      const titleMatch = html.match(/class="tw-middle"[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Video de Twitter / X';

      // Extraer enlaces de descarga
      const buttonMatches = Array.from(html.matchAll(/<a[^>]*class="[^"]*tw-button-dl[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi));
      const formats: TwitterFormat[] = [];

      for (const b of (buttonMatches as any[])) {
        const href = b[1];
        const text = (b[2] || '').replace(/<[^>]+>/g, '').trim();

        if (href && (href.includes('.mp4') || href.includes('snapcdn.app') || href.includes('twimg.com'))) {
          const qualityMatch = text.match(/\((\d+p)\)/i);
          const qualityName = qualityMatch ? qualityMatch[1] : 'MP4 Video';

          formats.push({
            quality: qualityName,
            format: 'MP4',
            url: href,
            hasAudio: true,
            hasVideo: true
          });
        }
      }

      if (formats.length > 0) {
        return {
          title,
          thumbnail,
          duration: 30,
          uploader: 'Twitter / X',
          formats
        };
      }
    }
  } catch (e) {
    console.warn('⚠️ [Twitter SaveTwitter] Falló extractor:', e);
  }
  return null;
}

// 2. Extractor con FxTwitter API
async function extractFxTwitter(url: string): Promise<TwitterMediaResult | null> {
  try {
    const idMatch = url.match(/\/status\/(\d+)/);
    if (!idMatch) return null;
    const id = idMatch[1];

    const usernameMatch = url.match(/(?:twitter|x)\.com\/([^\/]+)\/status/);
    const username = usernameMatch ? usernameMatch[1] : 'i';

    const apiUrl = `https://api.fxtwitter.com/${username}/status/${id}`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data.code === 200 && data.tweet) {
      const tweet = data.tweet;
      const videos = tweet.media?.videos || [];

      if (videos.length > 0) {
        const primaryVideo = videos[0];
        const formats: TwitterFormat[] = [];

        if (primaryVideo.variants && primaryVideo.variants.length > 0) {
          const mp4Variants = primaryVideo.variants
            .filter((v: any) => v.content_type === 'video/mp4' && v.url)
            .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));

          for (const v of mp4Variants) {
            const resMatch = v.url.match(/\/(\d+x\d+)\//);
            const qualityLabel = resMatch ? `${resMatch[1].split('x')[1]}p` : 'MP4';
            formats.push({
              quality: qualityLabel,
              format: 'MP4',
              url: v.url,
              hasAudio: true,
              hasVideo: true
            });
          }
        }

        if (formats.length === 0 && primaryVideo.url) {
          formats.push({
            quality: 'HD Video',
            format: 'MP4',
            url: primaryVideo.url
          });
        }

        if (formats.length > 0) {
          return {
            title: tweet.text || 'Video de Twitter / X',
            thumbnail: primaryVideo.thumbnail_url || 'https://picsum.photos/600/400',
            duration: Math.round(primaryVideo.duration || 30),
            uploader: tweet.author?.name || 'Twitter User',
            formats
          };
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ [Twitter FxTwitter] Falló extractor:', e);
  }
  return null;
}

// 3. Extractor con yt-dlp local
async function extractTwitterWithYtDlp(url: string, binPath: string): Promise<TwitterMediaResult | null> {
  const nodeBin = process.execPath || 'node';
  return new Promise((resolve) => {
    const proc = spawn(binPath, [
      '--dump-json',
      '--js-runtimes', `node:${nodeBin}`,
      '--no-warnings',
      '--no-check-certificates',
      '--geo-bypass',
      url
    ]);

    let stdout = '';
    proc.stdout.on('data', chunk => stdout += chunk.toString());
    proc.on('close', code => {
      if (code === 0 && stdout) {
        try {
          const data = JSON.parse(stdout);
          const vFormats = (data.formats || []).filter((f: any) => f.vcodec !== 'none' && f.url);
          if (vFormats.length > 0 || data.url) {
            vFormats.sort((a: any, b: any) => (b.height || 0) - (a.height || 0));
            const formats: TwitterFormat[] = vFormats.map((f: any) => ({
              quality: f.height ? `${f.height}p` : 'Video MP4',
              format: 'MP4',
              url: f.url,
              size: f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : undefined,
              hasAudio: !(f.acodec === 'none'),
              hasVideo: true
            }));

            return resolve({
              title: data.title || 'Video de Twitter / X',
              thumbnail: data.thumbnail || 'https://picsum.photos/600/400',
              duration: Math.round(data.duration || 30),
              uploader: data.uploader || 'Twitter / X Creator',
              formats
            });
          }
        } catch { }
      }
      resolve(null);
    });
    proc.on('error', () => resolve(null));
  });
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || (!url.includes('twitter.com') && !url.includes('x.com'))) {
      return NextResponse.json(
        { error: 'URL de Twitter / X inválida. Debe ser un enlace de twitter.com o x.com' },
        { status: 400 }
      );
    }

    console.log('🐦 [Twitter / X Engine] Procesando URL:', url);

    // Intentar 1: SaveTwitter API
    let result = await extractSaveTwitter(url);

    // Intentar 2: FxTwitter API
    if (!result) {
      result = await extractFxTwitter(url);
    }

    // Intentar 3: yt-dlp local
    if (!result) {
      const bin = findYtDlpBinary();
      if (bin) {
        result = await extractTwitterWithYtDlp(url, bin);
      }
    }

    if (!result || result.formats.length === 0) {
      return NextResponse.json(
        {
          error: 'No se pudo extraer el video de Twitter / X. Asegúrate de que el Tweet contenga un video o GIF y sea público.',
          help: 'Verifica que la cuenta de Twitter no sea privada o que el Tweet no haya sido eliminado.'
        },
        { status: 404 }
      );
    }

    // Agregar opción de audio
    result.formats.push({
      quality: 'Audio M4A (Original)',
      format: 'M4A',
      url: result.formats[0].url,
      isAudio: true,
      hasAudio: true,
      hasVideo: false
    });

    return NextResponse.json({
      status: 'success',
      ...result
    });

  } catch (error: any) {
    console.error('💥 [Twitter API] Error:', error);
    return NextResponse.json(
      { error: 'Error procesando solicitud de Twitter / X: ' + error.message },
      { status: 500 }
    );
  }
}
