'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedPath = useRef<string>('');

  useEffect(() => {
    // Evitar tracking doble de la misma página en React Strict Mode
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;

    // Solo rastrear si estamos en el cliente
    if (typeof window !== 'undefined') {
      const domain = window.location.hostname;
      const path = pathname;

      // No registrar localhost si no se desea, pero para pruebas es útil
      // if (domain === 'localhost') return;

      const sendTrack = () => {
        fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain,
            path,
          }),
        }).catch(err => console.error('Analytics tracking failed:', err));
      };

      const w = window as any;
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(sendTrack, { timeout: 3000 });
      } else {
        setTimeout(sendTrack, 1200);
      }
    }
  }, [pathname]);

  return null;
}
