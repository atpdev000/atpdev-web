'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedPath = useRef<string>('');

  useEffect(() => {
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;

    if (typeof window !== 'undefined') {
      const domain = window.location.hostname;
      const path = pathname;

      fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          path,
        }),
      }).catch((err) => console.error('Sorteos analytics tracking failed:', err));
    }
  }, [pathname]);

  return null;
}

