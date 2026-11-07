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
    revalidatePath('/dashboard/descargador');
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

    const dest1 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/downloads/FTYdownloaderPro.apk');
    const dest2 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/FTYdownloaderPro.apk');

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
        file_url: '/downloads/FTYdownloaderPro.apk',
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
    const dest1 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/downloads/FTYdownloaderPro.apk');
    const dest2 = path.resolve('d:/PROYECTOS/atpdev-web/apps/subdomains/web-apps/descargador/public/FTYdownloaderPro.apk');

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
        file_url: '/downloads/FTYdownloaderPro.apk',
        file_size: sizeMb
      }
    });

    revalidatePath('/dashboard/descargador');
    return { success: true, message: `¡Archivo APK cargado con éxito! Tamaño: ${sizeMb}`, fileSize: sizeMb };
  } catch (err: any) {
    return { success: false, message: `Error al subir archivo: ${err.message}` };
  }
}

export async function checkRailwayBackendHealthAction(url: string = 'https://backend-freedownloaderpro.up.railway.app'): Promise<{ online: boolean; statusText: string; latencyMs: number; details?: any }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    
    // Check root or docs or health
    const res = await fetch(`${url.replace(/\/$/, '')}/`, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'ATPDev-Admin-HealthCheck/1.0' }
    });
    clearTimeout(timeout);
    const latencyMs = Date.now() - start;

    if (res.ok) {
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }
      return { online: true, statusText: `HTTP ${res.status} OK`, latencyMs, details: data };
    }
    return { online: false, statusText: `HTTP ${res.status}`, latencyMs };
  } catch (err: any) {
    return { 
      online: false, 
      statusText: err?.name === 'AbortError' ? 'Tiempo de espera agotado (Timeout 6s)' : (err?.message || 'Error de conexión'),
      latencyMs: Date.now() - start 
    };
  }
}
