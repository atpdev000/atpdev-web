'use client';

import { useEffect, useRef, useState } from 'react';

export type AdSlotType = 'leaderboard' | 'in-feed' | 'sidebar' | 'billboard';

interface AdBannerSlotProps {
  type: AdSlotType;
  slotId?: string;
  className?: string;
}

export function AdBannerSlot({ type, slotId, className = '' }: AdBannerSlotProps) {
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
    const globalAds = (window as any).__CHAMBA_ADS_CONFIG__;
    const enabled = globalAds ? globalAds.enabled !== false : true;
    const rawId =
      globalAds?.clientId ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
      'ca-pub-5414009811868137';
    const clientId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;
    const envFallbackSlot =
      type === 'leaderboard'
        ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER
        : type === 'in-feed'
        ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT
        : type === 'sidebar'
        ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR
        : process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;
    const activeSlotId = slotId || globalAds?.slots?.[type] || envFallbackSlot || '';

    setResolvedConfig({ enabled, clientId, activeSlotId });
  }, [slotId, type]);

  useEffect(() => {
    // Solo inicializar si AdSense está habilitado y se proporciona un slotId válido para evitar bloques vacíos de 250px (AdSense Policy)
    if (
      resolvedConfig.enabled &&
      resolvedConfig.activeSlotId &&
      resolvedConfig.clientId &&
      typeof window !== 'undefined' &&
      !isRendered
    ) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        setIsRendered(true);
      } catch (err) {
        // Bloqueador de publicidad activo o no disponible
      }
    }
  }, [resolvedConfig, isRendered]);

  // Si AdSense está desactivado en el Admin o no hay slotId configurado, no renderizar contenedor vacío (Auto Ads opera sin penalización de CLS)
  if (!resolvedConfig.enabled || !resolvedConfig.activeSlotId) {
    return null;
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
            minHeight: type === 'billboard' ? '250px' : type === 'leaderboard' ? '90px' : '100px'
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
