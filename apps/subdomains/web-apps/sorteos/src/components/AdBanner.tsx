"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { api, getToken } from '@/lib/api';
import { ADSENSE_CLIENT_ID } from '@/lib/siteConfig';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

export function AdBanner({ slot = '', format = 'horizontal', className = '' }: AdBannerProps) {
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const activeSlot = (slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || '').trim();
  const hasValidSlot = Boolean(activeSlot && activeSlot !== '5414009811868137');

  useEffect(() => {
    const checkProStatus = async () => {
      const token = getToken();
      if (!token) {
        setIsPro(false);
        return;
      }
      try {
        const res = await api<{ user: { plan?: string } }>('/api/v1/auth/me');
        const plan = res?.user?.plan || 'free';
        setIsPro(plan !== 'free');
      } catch {
        setIsPro(false);
      }
    };

    checkProStatus();
    window.addEventListener('auth-changed', checkProStatus);
    return () => window.removeEventListener('auth-changed', checkProStatus);
  }, []);

  useEffect(() => {
    if (isPro === false && hasValidSlot) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch {
        // adsbygoogle already pushed or blocked
      }
    }
  }, [isPro, hasValidSlot]);

  // Si es usuario PRO, NO SE MUESTRA NINGÚN ANUNCIO (experiencia 100% limpia)
  if (isPro === true) {
    return null;
  }

  // Si aún está cargando o no hay un ID de bloque real configurado, no renderizar cajas vacías (Auto Ads opera nativamente)
  if (isPro === null || !hasValidSlot) {
    return null;
  }

  const cleanClientId = ADSENSE_CLIENT_ID.startsWith('ca-') ? ADSENSE_CLIENT_ID : `ca-${ADSENSE_CLIENT_ID}`;

  // Banner para usuarios FREE o invitados
  return (
    <div className={`w-full my-6 p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200/80 dark:border-white/10 text-center relative overflow-hidden group ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold">
          Publicidad
        </span>
        <Link
          href="/planes"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-pink-600 dark:text-purple-400 hover:underline font-bold"
        >
          <Sparkles className="w-3 h-3" />
          <span>¿Quitar anuncios? Pásate a Pro</span>
        </Link>
      </div>

      {/* Contenedor del anuncio oficial de AdSense */}
      <div className="py-4 px-2 rounded-xl bg-white dark:bg-[#070a12] border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center min-h-[100px] overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px', width: '100%' }}
          data-ad-client={cleanClientId}
          data-ad-slot={activeSlot}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

/**
 * Hook para saber si el usuario actual tiene plan PRO (sin anuncios)
 */
export function useIsPro() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = getToken();
      if (!token) {
        setIsPro(false);
        return;
      }
      try {
        const res = await api<{ user: { plan?: string } }>('/api/v1/auth/me');
        setIsPro(res?.user?.plan !== 'free');
      } catch {
        setIsPro(false);
      }
    };
    check();
    window.addEventListener('auth-changed', check);
    return () => window.removeEventListener('auth-changed', check);
  }, []);

  return isPro;
}
