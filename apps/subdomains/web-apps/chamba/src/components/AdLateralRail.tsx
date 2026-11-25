'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdLateralRailProps {
  leftSlotId?: string;
  rightSlotId?: string;
}

const EXCLUDED_AD_ROUTES = /^\/(?:politica-de-privacidad|terminos-y-condiciones|cookies|politica-de-cookies|admin|contacto|publicar-empleo|login|auth)(?:\/|$)/i;

export function AdLateralRail({ leftSlotId, rightSlotId }: AdLateralRailProps) {
  const pathname = usePathname() || '';
  const isExcludedRoute = EXCLUDED_AD_ROUTES.test(pathname);
  const [railState, setRailState] = useState<{
    show: boolean;
    clientId: string;
    left: string;
    right: string;
  }>({
    show: false,
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137',
    left: leftSlotId || '',
    right: rightSlotId || '',
  });
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const globalAds = (window as any).__CHAMBA_ADS_CONFIG__;
    const enabled = globalAds ? globalAds.enabled !== false : true;
    const rawId =
      globalAds?.clientId ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
      'ca-pub-5414009811868137';
    const clientId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;
    const resolvedLeft = leftSlotId || globalAds?.slots?.sidebar || '';
    const resolvedRight = rightSlotId || globalAds?.slots?.sidebar || '';

    if (enabled && clientId && (resolvedLeft || resolvedRight)) {
      setRailState({
        show: true,
        clientId,
        left: resolvedLeft,
        right: resolvedRight,
      });
    }
  }, [leftSlotId, rightSlotId]);

  useEffect(() => {
    if (isExcludedRoute || !railState.show || pushed || typeof window === 'undefined') return;
    try {
      if (railState.left) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
      if (railState.right) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
      setPushed(true);
    } catch {
      // Ignorar bloqueadores de anuncios
    }
  }, [isExcludedRoute, railState.show, railState.left, railState.right, pushed]);

  if (isExcludedRoute || !railState.show || (!railState.left && !railState.right)) {
    return null;
  }

  return (
    <>
      {railState.left && (
        <aside
          aria-label="Anuncios"
          className="fixed left-2 top-28 z-30 hidden min-[1440px]:block w-[120px] print:hidden text-center"
        >
          <span className="text-[9px] tracking-widest uppercase font-mono text-slate-400 dark:text-slate-500 mb-1 block select-none pointer-events-none">
            Anuncios
          </span>
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '120px', height: '600px' }}
            data-ad-client={railState.clientId}
            data-ad-slot={railState.left}
          />
        </aside>
      )}

      {railState.right && (
        <aside
          aria-label="Anuncios"
          className="fixed right-2 top-28 z-30 hidden min-[1440px]:block w-[120px] print:hidden text-center"
        >
          <span className="text-[9px] tracking-widest uppercase font-mono text-slate-400 dark:text-slate-500 mb-1 block select-none pointer-events-none">
            Anuncios
          </span>
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '120px', height: '600px' }}
            data-ad-client={railState.clientId}
            data-ad-slot={railState.right}
          />
        </aside>
      )}
    </>
  );
}
