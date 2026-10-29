'use server';

import { 
  getSubdomainConfig, 
  saveSubdomainConfig, 
  SubdomainConfig 
} from '@atpdev/database';
import { revalidatePath } from 'next/cache';

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
