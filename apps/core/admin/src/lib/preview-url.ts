'use client';

import { useEffect, useState } from 'react';

export const OFFICIAL_APP_URLS = {
  portal: 'https://atpdev.dev',
  chamba: 'https://chamba.atpdev.dev',
  sorteos: 'https://sorteos.atpdev.dev',
  descargador: 'https://descargador.atpdev.dev',
  magic: 'https://magic.atpdev.dev',
  perusabor: 'https://perusabor.atpdev.dev',
  lectorqr: 'https://lectorqr.atpdev.dev',
  dni: 'https://dni.atpdev.dev',
  pdf: 'https://pdf.atpdev.dev',
  almaniq: 'https://almaniq.atpdev.dev',
  codehistory: 'https://codehistory.atpdev.dev',
} as const;

export type PreviewSource = 'local' | 'official';

export interface ResolvedPreviewState {
  previewUrl: string;
  source: PreviewSource;
  isOnline: boolean | null;
}

function isLocalBrowserHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

async function probeUrl(url: string, timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(url, { mode: 'no-cors', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resuelve la URL de vista previa de forma automática:
 * - Si el admin corre en localhost y el puerto local responde, usa `localUrl`.
 * - Si el puerto local está apagado o el admin corre en producción (`admin.atpdev.dev`),
 *   cae automáticamente a la ruta oficial (`officialUrl`).
 */
export function useResolvedPreviewUrl(
  localUrl: string,
  officialUrl: string,
  enabled: boolean = true,
  refreshTrigger: number = 0
): ResolvedPreviewState {
  const safeOfficial = (officialUrl || localUrl).trim().replace(/\/$/, '');
  const safeLocal = (localUrl || safeOfficial).trim().replace(/\/$/, '');

  const [state, setState] = useState<ResolvedPreviewState>({
    previewUrl: safeOfficial,
    source: 'official',
    isOnline: null,
  });

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    const resolveAndCheck = async () => {
      // En producción nunca intentamos localhost: usamos la ruta oficial directo.
      if (!isLocalBrowserHost()) {
        const ok = await probeUrl(safeOfficial, 4000);
        if (active) {
          setState({
            previewUrl: safeOfficial,
            source: 'official',
            isOnline: ok,
          });
        }
        return;
      }

      // En localhost: probamos primero el puerto local y si está apagado usamos la ruta oficial.
      const localOk = await probeUrl(safeLocal, 1200);
      if (!active) return;

      if (localOk) {
        setState({
          previewUrl: safeLocal,
          source: 'local',
          isOnline: true,
        });
        return;
      }

      const officialOk = await probeUrl(safeOfficial, 4000);
      if (active) {
        setState({
          previewUrl: safeOfficial,
          source: 'official',
          isOnline: officialOk,
        });
      }
    };

    resolveAndCheck();
    const interval = setInterval(resolveAndCheck, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [safeLocal, safeOfficial, enabled, refreshTrigger]);

  return state;
}

