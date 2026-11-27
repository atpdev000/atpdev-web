'use client';

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  className?: string;
}

export default function AdBanner({ slot = '8741293045', className = '' }: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, []);

  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 dark:border-slate-800/80 bg-zinc-50/70 dark:bg-slate-900/40 p-2 min-h-[100px] ${className}`}
      aria-label="Espacio publicitario"
    >
      <span className="text-[10px] text-zinc-400 dark:text-slate-500 mb-1">Publicidad</span>
      <ins
        className="adsbygoogle block w-full text-center"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-5414009811868137"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

