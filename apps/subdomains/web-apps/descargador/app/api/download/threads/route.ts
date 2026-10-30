// app/api/download/threads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const maxDuration = 60;

interface ThreadsFormat {
  quality: string;
  format: string;
  url: string;
  size?: string;
  isAudio?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
}

interface ThreadsMediaResult {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  formats: ThreadsFormat[];
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

// 1. Extractor con LoveThreads API
async function extractLoveThreads(url: string): Promise<ThreadsMediaResult | null> {
  try {
    const form = new URLSearchParams({
      q: url,
      t: 'media',
      lang: 'en'
    });

    const res = await fetch('https://lovethreads.net/api/ajaxSearch', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://lovethreads.net',
        'referer': 'https://lovethreads.net/en',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36'
      },
      body: form.toString()
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data.status === 'ok' && typeof data.data === 'string') {
      const html = data.data;

      // Extraer videos de las etiquetas <a> con title="Download Video" o href directo
      const videoMatches = [
        ...Array.from(html.matchAll(/href="([^"]+)"[^>]*title="Download Video"/gi)),
        ...Array.from(html.matchAll(/href="([^"]+)"[^>]*class="[^"]*download-video[^"]*"/gi)),
        ...Array.from(html.matchAll(/href="(https?:\\?\/\\?[^"]+\.mp4[^"]*)"/gi))
      ];

      const thumbMatch = html.match(/class="download-items__thumb"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/i) ||
                         html.match(/<img[^>]*src="([^"]+)"/i);
      const thumbnail = thumbMatch ? thumbMatch[1].replace(/&amp;/g, '&') : 'https://picsum.photos/600/800';

      const videoUrls = Array.from(new Set(videoMatches.map((m: any) => (m[1] as string)?.replace(/&amp;/g, '&')).filter(Boolean)));

      if (videoUrls.length > 0) {
        const formats: ThreadsFormat[] = videoUrls.map((vUrl, i) => ({
          quality: i === 0 ? 'HD 1080p' : `Calidad ${i + 1}`,
          format: 'MP4',
          url: vUrl,
          hasAudio: true,
          hasVideo: true
        }));

        return {
          title: 'Video de Threads',
          thumbnail,
          duration: 30,
          uploader: 'Threads User',
          formats
        };
      }
    }
  } catch (e) {
    console.warn('⚠️ [Threads LoveThreads] Falló extractor:', e);
  }
  return null;
}

// 2. Extractor Directo de Threads HTML
async function extractDirectThreads(url: string): Promise<ThreadsMediaResult | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) return null;
    const html = await res.text();

    const videoMatch = html.match(/<meta\s+property="og:video(?::secure_url)?"\s+content="([^"]+)"/i) ||
                       html.match(/<meta\s+content="([^"]+)"\s+property="og:video(?::secure_url)?"/i) ||
                       html.match(/"video_url":"([^"]+)"/i);

    const thumbMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                       html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);

    const titleMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                       html.match(/<title>([^<]+)<\/title>/i);

    if (videoMatch && videoMatch[1]) {
      const cleanVideoUrl = videoMatch[1].replace(/&amp;/g, '&').replace(/\\\//g, '/');
      const thumbnail = thumbMatch ? thumbMatch[1].replace(/&amp;/g, '&') : 'https://picsum.photos/600/800';
      const title = titleMatch ? titleMatch[1].trim() : 'Video de Threads';

      return {
        title,
        thumbnail,
        duration: 30,
        uploader: 'Threads Creator',
        formats: [
          {
            quality: 'HD Video',
            format: 'MP4',
            url: cleanVideoUrl,
            hasAudio: true,
            hasVideo: true
          }
        ]
      };
    }
  } catch (e) {
    console.warn('⚠️ [Threads Direct] Falló extracción directa:', e);
  }
  return null;
}

// 3. Fallback con yt-dlp local
async function extractThreadsWithYtDlp(url: string, binPath: string): Promise<ThreadsMediaResult | null> {
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
            return resolve({
              title: data.title || 'Video de Threads',
              thumbnail: data.thumbnail || 'https://picsum.photos/600/800',
              duration: Math.round(data.duration || 30),
              uploader: data.uploader || 'Threads Creator',
              formats: [
                {
                  quality: 'HD Video',
                  format: 'MP4',
                  url: vFormats[0]?.url || data.url,
                  hasAudio: !(vFormats[0]?.acodec === 'none'),
                  hasVideo: true
                }
              ]
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

    if (!url || (!url.includes('threads.net') && !url.includes('threads.com'))) {
      return NextResponse.json(
        { error: 'URL de Threads inválida. Debe ser un enlace de threads.com o threads.net' },
        { status: 400 }
      );
    }

    console.log('🧵 [Threads Engine] Procesando URL original:', url);

    // Resolver redirecciones (enlaces de compartir tipo threads.com/share/... o /t/...)
    let targetUrl = url.trim();
    try {
      if (targetUrl.includes('/share/') || targetUrl.includes('/t/')) {
        const headRes = await fetch(targetUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        });
        if (headRes.url && (headRes.url.includes('threads.net') || headRes.url.includes('threads.com'))) {
          targetUrl = headRes.url;
          console.log('🧵 [Threads Engine] URL resuelta de redirección:', targetUrl);
        }
      }
    } catch (e) {
      console.warn('⚠️ [Threads Engine] No se pudo seguir redirección previa:', e);
    }

    // Intentar 1: LoveThreads API (con targetUrl y fallback alternativo)
    let result = await extractLoveThreads(targetUrl);
    if (!result && targetUrl.includes('threads.com')) {
      result = await extractLoveThreads(targetUrl.replace('threads.com', 'threads.net'));
    } else if (!result && targetUrl.includes('threads.net')) {
      result = await extractLoveThreads(targetUrl.replace('threads.net', 'threads.com'));
    }

    // Intentar 2: Extracción directa de OpenGraph
    if (!result) {
      result = await extractDirectThreads(targetUrl);
    }

    // Intentar 3: yt-dlp local
    if (!result) {
      const bin = findYtDlpBinary();
      if (bin) {
        result = await extractThreadsWithYtDlp(targetUrl, bin);
      }
    }

    if (!result || result.formats.length === 0) {
      return NextResponse.json(
        {
          error: 'No se pudo extraer el video de Threads. Asegúrate de que el post contenga un video y sea público.',
          help: 'Verifica que la cuenta de Threads no sea privada.'
        },
        { status: 404 }
      );
    }

    // Agregar audio format
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
    console.error('💥 [Threads API] Error:', error);
    return NextResponse.json(
      { error: 'Error procesando solicitud de Threads: ' + error.message },
      { status: 500 }
    );
  }
}
