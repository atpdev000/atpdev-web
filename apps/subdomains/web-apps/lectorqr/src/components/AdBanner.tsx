'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

export function AdBanner({
  slot = '5414009811868137',
  format = 'horizontal',
  className = '',
}: AdBannerProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // Adsbygoogle ya inicializado o bloqueado
    }
  }, []);

  return (
    <div
      className={`w-full max-w-4xl mx-auto my-8 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-center relative overflow-hidden backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          Publicidad
        </span>
        <span className="text-[10px] text-slate-500">
          Anuncios verificados por Google
        </span>
      </div>

      {/* Contenedor del anuncio con etiqueta de política Google */}
      <div className="py-3 px-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center justify-center min-h-[90px] overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px', width: '100%' }}
          data-ad-client="ca-pub-5414009811868137"
          data-ad-slot={slot}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

export default AdBanner;

