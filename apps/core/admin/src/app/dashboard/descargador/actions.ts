'use server';

import { 
  getSubdomainConfig, 
  saveSubdomainConfig, 
  SubdomainConfig 
} from '@atpdev/database';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function fetchDescargadorConfigAction(): Promise<SubdomainConfig> {
  return getSubdomainConfig('descargador');
}

export async function saveDescargadorConfigAction(updates: Partial<SubdomainConfig>): Promise<{ success: boolean; config: SubdomainConfig }> {
  try {
    const res = saveSubdomainConfig('descargador', updates);
    return res;
  } catch (err: any) {
    console.error('Error saving descargador config:', err);
    return { success: false, config: getSubdomainConfig('descargador') };
  }
}

export async function syncBuiltApkAction(): Promise<{ success: boolean; message: string; fileSize?: string }> {
  try {
    const candidates = [
      path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/android/app/build/outputs/apk/debug/app-debug.apk'),
      path.resolve(process.cwd(), '../../subdomains/web-apps/descargador/android/app/build/outputs/apk/debug/app-debug.apk'),
      path.resolve(process.cwd(), '../subdomains/web-apps/descargador/android/app/build/outputs/apk/debug/app-debug.apk'),
      path.resolve(process.cwd(), 'apps/subdomains/web-apps/descargador/android/app/build/outputs/apk/debug/app-debug.apk')
    ];

    let foundSrc: string | null = null;
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        foundSrc = c;
        break;
      }
    }

    if (!foundSrc) {
      return { 
        success: false, 
        message: 'No se encontró un APK compilado reciente en android/app/build/outputs/apk/debug/. Puedes compilarlo con gradlew o subir un archivo manualmente.' 
      };
    }

    const dest1 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/downloads/DescargadorPro.apk');
    const dest2 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/DescargadorPro.apk');

    const dir1 = path.dirname(dest1);
    if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });

    fs.copyFileSync(foundSrc, dest1);
    fs.copyFileSync(foundSrc, dest2);

    const stats = fs.statSync(foundSrc);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(1) + ' MB';

    const currentConfig = getSubdomainConfig('descargador');
    saveSubdomainConfig('descargador', {
      apk: {
        ...(currentConfig.apk || {}),
        enabled: true,
        file_url: '/downloads/DescargadorPro.apk',
        file_size: sizeMb
      }
    });

    revalidatePath('/dashboard/descargador');
    return { 
      success: true, 
      message: `¡APK sincronizado correctamente! Tamaño: ${sizeMb}`, 
      fileSize: sizeMb 
    };
  } catch (err: any) {
    return { success: false, message: `Error al sincronizar APK: ${err.message}` };
  }
}

export async function uploadApkFileAction(formData: FormData): Promise<{ success: boolean; message: string; fileSize?: string }> {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, message: 'No se seleccionó ningún archivo.' };
    }
    if (!file.name.toLowerCase().endsWith('.apk')) {
      return { success: false, message: 'El archivo seleccionado debe ser un archivo .apk' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dest1 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/downloads/DescargadorPro.apk');
    const dest2 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/DescargadorPro.apk');

    const dir1 = path.dirname(dest1);
    if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });

    fs.writeFileSync(dest1, buffer);
    fs.writeFileSync(dest2, buffer);

    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(1) + ' MB';
    const currentConfig = getSubdomainConfig('descargador');
    saveSubdomainConfig('descargador', {
      apk: {
        ...(currentConfig.apk || {}),
        enabled: true,
        file_url: '/downloads/DescargadorPro.apk',
        file_size: sizeMb
      }
    });

    revalidatePath('/dashboard/descargador');
    return { success: true, message: `¡Archivo APK cargado con éxito! Tamaño: ${sizeMb}`, fileSize: sizeMb };
  } catch (err: any) {
    return { success: false, message: `Error al subir archivo: ${err.message}` };
  }
}

export async function checkBackendHealthAction(url: string, timeoutMs: number = 8000): Promise<{
  online: boolean;
  statusText: string;
  latencyMs: number;
  details?: any;
  targetUrl: string;
}> {
  const start = Date.now();
  const cleanUrl = (url || '').trim().replace(/\/$/, '');
  if (!cleanUrl) {
    return { online: false, statusText: 'URL vacía o no configurada', latencyMs: 0, targetUrl: '' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    let endpointTried = '/';
    try {
      res = await fetch(`${cleanUrl}/`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'ATPDev-Admin-HealthCheck/2.0' }
      });
      endpointTried = '/';
    } catch (e: any) {
      if (e?.name === 'AbortError') throw e;
      res = await fetch(`${cleanUrl}/api/v1/health`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'ATPDev-Admin-HealthCheck/2.0' }
      });
      endpointTried = '/api/v1/health';
    }

    clearTimeout(timeout);
    const latencyMs = Date.now() - start;

    if (res.ok) {
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }
      return {
        online: true,
        statusText: `HTTP ${res.status} OK (${endpointTried})`,
        latencyMs,
        details: data,
        targetUrl: cleanUrl
      };
    }
    return {
      online: false,
      statusText: `HTTP ${res.status} ${res.statusText || ''}`.trim(),
      latencyMs,
      targetUrl: cleanUrl
    };
  } catch (err: any) {
    return {
      online: false,
      statusText: err?.name === 'AbortError' ? `Timeout (${timeoutMs / 1000}s)` : (err?.message || 'Error de conexión'),
      latencyMs: Date.now() - start,
      targetUrl: cleanUrl
    };
  }
}

export async function checkRailwayBackendHealthAction(url: string = 'https://backend-freedownloaderpro.up.railway.app') {
  return checkBackendHealthAction(url);
}

export async function checkGatewayPingAction(url: string): Promise<{
  online: boolean;
  statusText: string;
  latencyMs: number;
  statusCode?: number;
}> {
  const start = Date.now();
  const cleanUrl = (url || '').trim();
  if (!cleanUrl || !cleanUrl.startsWith('http')) {
    return { online: false, statusText: 'URL no configurada', latencyMs: 0 };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(cleanUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeout);
    const latencyMs = Date.now() - start;
    const ok = res.status < 400 || res.status === 301 || res.status === 302;
    return {
      online: ok,
      statusText: ok ? `Operativo (HTTP ${res.status})` : `HTTP ${res.status}`,
      statusCode: res.status,
      latencyMs
    };
  } catch (err: any) {
    return {
      online: false,
      statusText: err?.name === 'AbortError' ? 'Timeout (8s)' : (err?.message || 'Error de conexión'),
      latencyMs: Date.now() - start
    };
  }
}

export interface YoutubeCookieDetail {
  name: string;
  domain: string;
  expires_epoch: number;
  expires_iso: string | null;
  expired: boolean;
}

export interface YoutubeCookiesStatusResult {
  success: boolean;
  exists?: boolean;
  bytes?: number;
  is_expired?: boolean;
  valid_auth_count?: number;
  expired_auth_count?: number;
  earliest_valid_expiry?: string | null;
  checked_at?: string;
  auth_cookies?: YoutubeCookieDetail[];
  message?: string;
  error?: string;
}

function resolveYoutubeBackendUrl(overrideUrl?: string): string {
  const cfg = getSubdomainConfig('descargador');
  const candidate = (
    overrideUrl ||
    cfg?.backend?.active_url ||
    cfg?.backend?.render_url ||
    'http://127.0.0.1:8000'
  ).trim();
  return candidate.replace(/\/$/, '');
}

export async function getYoutubeCookiesStatusAction(
  backendUrl?: string
): Promise<YoutubeCookiesStatusResult> {
  const target = resolveYoutubeBackendUrl(backendUrl);
  try {
    const res = await fetch(`${target}/api/v1/cookies/status`, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.detail || `HTTP ${res.status}` };
    }
    return { success: true, ...data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.name === 'AbortError' ? 'Timeout (8s)' : (err?.message || 'No se pudo conectar al backend'),
    };
  }
}

export async function uploadYoutubeCookiesAction(
  cookiesContent: string,
  backendUrl?: string
): Promise<{ success: boolean; message?: string; status?: YoutubeCookiesStatusResult; error?: string }> {
  const target = resolveYoutubeBackendUrl(backendUrl);
  const content = (cookiesContent || '').trim();
  if (!content) {
    return { success: false, error: 'Pega o selecciona el contenido de cookies.txt antes de subir.' };
  }
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const cronSecret = process.env.CRON_SECRET_TOKEN;
    if (cronSecret) {
      headers['Authorization'] = `Bearer ${cronSecret}`;
    }
    const res = await fetch(`${target}/api/v1/cookies/upload`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ cookies_content: content }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.detail || `HTTP ${res.status}` };
    }
    revalidatePath('/dashboard/descargador');
    const rawStatus =
      typeof data?.cookies_status === 'object' && data.cookies_status !== null
        ? data.cookies_status
        : typeof data?.exists === 'boolean'
          ? data
          : undefined;
    return {
      success: true,
      message: data?.message || 'Cookies actualizadas correctamente.',
      status: rawStatus ? { success: true, ...rawStatus } : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.name === 'AbortError' ? 'Timeout (10s)' : (err?.message || 'Error al subir cookies'),
    };
  }
}

export async function testYoutubeExtractionAction(
  testUrl?: string,
  backendUrl?: string,
  proxyUrl?: string
): Promise<{
  success: boolean;
  title?: string;
  formatsCount?: number;
  duration?: number;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  const target = resolveYoutubeBackendUrl(backendUrl);
  const url = (testUrl || 'https://www.youtube.com/watch?v=RF5FQ90_FvY').trim();
  const cfg = getSubdomainConfig('descargador');
  const resolvedProxy = (proxyUrl !== undefined ? proxyUrl : cfg?.backend?.youtube_proxy_url || '').trim();

  try {
    const res = await fetch(`${target}/api/v1/youtube/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        quality: '1080p',
        format_type: 'mp4',
        ...(resolvedProxy ? { proxy_url: resolvedProxy } : {}),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json().catch(() => ({}));
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      return {
        success: false,
        latencyMs,
        error: data?.detail || data?.error || `HTTP ${res.status}`,
      };
    }
    return {
      success: true,
      title: data?.title || 'Video extraído',
      formatsCount: Array.isArray(data?.formats) ? data.formats.length : 0,
      duration: data?.duration,
      latencyMs,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      error: err?.name === 'AbortError' ? 'Timeout (30s)' : (err?.message || 'Error de conexión'),
    };
  }
}
