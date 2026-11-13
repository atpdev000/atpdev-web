import { getSubdomainConfig } from '@atpdev/database';

export interface ResolvedBackend {
  url: string;
  provider: 'render' | 'railway' | 'custom';
  fallbackUrl?: string;
  timeoutSeconds: number;
  youtubeProxyUrl?: string;
}

/**
 * Obtiene la configuración del motor backend en tiempo real desde el CMS Admin.
 * Permite cambiar dinámicamente entre Render y Railway o ingresar un VPS sin necesidad de rebuilds.
 */
export function getBackendEndpoint(): ResolvedBackend {
  try {
    const config = getSubdomainConfig('descargador');
    const backend = config?.backend;

    const renderUrl = backend?.render_url || 'https://snapnosh-backend.onrender.com';
    const railwayUrl = backend?.railway_url || 'https://backend-freedownloaderpro.up.railway.app';
    const customUrl = backend?.custom_url || '';
    const provider = backend?.provider || 'render';

    let primaryUrl = renderUrl;
    let fallbackUrl = railwayUrl;

    if (provider === 'railway') {
      primaryUrl = railwayUrl;
      fallbackUrl = renderUrl;
    } else if (provider === 'custom' && customUrl) {
      primaryUrl = customUrl;
      fallbackUrl = renderUrl;
    } else {
      primaryUrl = renderUrl;
      fallbackUrl = railwayUrl;
    }

    if (backend?.active_url) {
      primaryUrl = backend.active_url;
    }

    // Override opcional si se pasó variable de entorno explícita y no hay active_url personalizado
    const envUrl = process.env.PYTHON_API_URL || process.env.PYTHON_BACKEND_URL;
    if (envUrl && !backend?.active_url) {
      primaryUrl = envUrl;
    }

    return {
      url: primaryUrl.replace(/\/$/, ''),
      provider,
      fallbackUrl: backend?.auto_fallback_enabled !== false ? fallbackUrl.replace(/\/$/, '') : undefined,
      timeoutSeconds: backend?.timeout_seconds || 30,
      youtubeProxyUrl: backend?.youtube_proxy_url?.trim() || undefined
    };
  } catch (err) {
    return {
      url: 'https://snapnosh-backend.onrender.com',
      provider: 'render',
      fallbackUrl: 'https://backend-freedownloaderpro.up.railway.app',
      timeoutSeconds: 30
    };
  }
}

