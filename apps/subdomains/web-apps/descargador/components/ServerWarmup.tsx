'use client';

import { useEffect } from 'react';

/**
 * Componente silencioso de pre-calentamiento (Pre-warm).
 * Al abrir la web o app móvil, envía un ping rápido en segundo plano a /api/health.
 * Si el contenedor de Render estaba en reposo, esto inicia el encendido inmediato
 * para que cuando el usuario pegue su enlace el servidor ya esté 100% despierto.
 */
export default function ServerWarmup() {
  useEffect(() => {
    try {
      fetch('/api/health', {
        method: 'GET',
        cache: 'no-store',
        keepalive: true
      }).catch(() => {});
    } catch {}
  }, []);

  return null;
}
