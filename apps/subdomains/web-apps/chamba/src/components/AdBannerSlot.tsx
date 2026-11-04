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
  const rawId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137';
  const clientPublisherId = rawId.startsWith('ca-') ? rawId : `ca-${rawId}`;
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Solo inicializar si se proporciona un slotId válido para evitar bloques vacíos de 250px (AdSense Policy)
    if (slotId && clientPublisherId && typeof window !== 'undefined' && !isRendered) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        setIsRendered(true);
      } catch (err) {
        // Bloqueador de publicidad activo o no disponible
      }
    }
  }, [clientPublisherId, slotId, isRendered]);

  // Si no hay slotId configurado, no renderizar contenedor vacío para permitir que Auto Ads opere sin errores ni penalización por CLS
  if (!slotId) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className={`w-full my-4 flex justify-center items-center overflow-hidden print:hidden ${className}`}
      aria-label="Espacio de anuncio oficial"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: type === 'billboard' ? '250px' : type === 'leaderboard' ? '90px' : '100px'
        }}
        data-ad-client={clientPublisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
