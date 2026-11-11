'use client';

import { useEffect, useRef, useState } from 'react';
import { useProPlan } from '@/hooks/useProPlan';

export type AdSlotType = 'leaderboard' | 'in-feed' | 'sidebar' | 'billboard';

interface AdBannerSlotProps {
  type: AdSlotType;
  slotId?: string;
  className?: string;
}

export function AdBannerSlot({ type, slotId, className = '' }: AdBannerSlotProps) {
  const { isPro } = useProPlan();
  const adRef = useRef<HTMLDivElement>(null);
  const [resolvedConfig, setResolvedConfig] = useState<{
    enabled: boolean;
    clientId: string;
    activeSlotId: string;
  }>({
    enabled: true,
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137',
    activeSlotId: slotId || '',
  });
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const globalAds = (window as any).__DESCARGADOR_ADS_CONFIG__;
    const enabled = globalAds ? globalAds.enabled !== false : true;
    const rawId =
      globalAds?.clientId ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
      'ca-pub-5414009811868137';
    const clientId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;

    // Slots por defecto de AdSense para Descargador Pro
    const defaultSlots: Record<AdSlotType, string> = {
      leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || '4095225502',
      'in-feed': process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT || '9155980495',
      sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '4095225502',
      billboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || '4095225502',
    };

    const activeSlotId = slotId || globalAds?.slots?.[type] || defaultSlots[type] || '';
    setResolvedConfig({ enabled, clientId, activeSlotId });
  }, [slotId, type]);

  useEffect(() => {
    if (isPro) return;
    if (
      resolvedConfig.enabled &&
      resolvedConfig.activeSlotId &&
      resolvedConfig.clientId &&
      typeof window !== 'undefined' &&
      !isRendered
    ) {
      try {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
        setIsRendered(true);
      } catch (err) {
        // Ignorar bloqueadores de publicidad
      }
    }
  }, [resolvedConfig, isRendered, isPro]);

  if (isPro || !resolvedConfig.enabled || !resolvedConfig.activeSlotId) {
    return null;
  }

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost) {
    return (
      <div className={`w-full my-6 sm:my-8 flex flex-col items-center justify-center ${className}`}>
        <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400 dark:text-slate-500 mb-1.5 select-none pointer-events-none">
          Publicidad
        </span>
        <div
          className="w-full p-3.5 rounded-2xl border border-dashed border-blue-500/30 bg-blue-500/5 text-center text-xs text-blue-400/80 font-mono flex items-center justify-center gap-2"
          aria-label="Espacio de anuncio oficial"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>[Google AdSense ({type}): {resolvedConfig.activeSlotId}]</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={adRef}
      className={`w-full my-6 sm:my-8 flex flex-col justify-center items-center overflow-hidden print:hidden ${className}`}
      aria-label="Espacio publicitario patrocinado"
    >
      <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400 dark:text-slate-500 mb-1.5 select-none pointer-events-none">
        Publicidad
      </span>
      <div className="w-full flex justify-center items-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            minHeight: type === 'billboard' ? '250px' : type === 'leaderboard' ? '90px' : '100px',
          }}
          data-ad-client={resolvedConfig.clientId}
          data-ad-slot={resolvedConfig.activeSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
export default AdBannerSlot;

