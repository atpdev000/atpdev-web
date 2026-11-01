'use server';

import { 
  getSubdomainConfig, 
  saveSubdomainConfig, 
  SubdomainConfig 
} from '@atpdev/database';
import { revalidatePath } from 'next/cache';

export async function fetchMagicConfigAction(): Promise<SubdomainConfig> {
  return getSubdomainConfig('magic');
}

export async function saveMagicConfigAction(updates: Partial<SubdomainConfig>): Promise<{ success: boolean; config: SubdomainConfig }> {
  try {
    const res = saveSubdomainConfig('magic', updates);
    revalidatePath('/dashboard/magic');
    return res;
  } catch (err: any) {
    console.error('Error saving magic config:', err);
    return { success: false, config: getSubdomainConfig('magic') };
  }
}

export async function checkMagicBackendHealthAction(url: string = 'https://s.ftydownloader.com'): Promise<{ online: boolean; statusText: string; latencyMs: number; details?: any }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    
    // Check health endpoint or root
    const targetUrl = url.includes('/api/v1/health') ? url : `${url.replace(/\/$/, '')}/api/v1/health`;
    const res = await fetch(targetUrl, { 
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
