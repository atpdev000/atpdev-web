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

      fetch('https://www.atpdev.dev/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          path,
        }),
      }).catch(err => console.error('Analytics tracking failed:', err));
    }
  }, [pathname]);

  return null;
}
