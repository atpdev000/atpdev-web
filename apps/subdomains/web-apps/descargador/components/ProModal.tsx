// components/ProModal.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Crown, Check, X, Shield, Zap } from 'lucide-react'
import { useProPlan } from '@/hooks/useProPlan'

interface ProModalProps {
  isOpen: boolean
  onClose: () => void
  targetQuality?: string
  onDownloadFallback?: () => void
}

export default function ProModal({
  isOpen,
  onClose,
  targetQuality = '1080p',
  onDownloadFallback
}: ProModalProps) {
  const { activatePlan } = useProPlan()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner superior dorado */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-100" />
            <h3 className="font-extrabold text-lg tracking-wide uppercase">
              Descargas PRO en Alta Definición
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/20 text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resolución {targetQuality} Reservada para Suscriptores PRO</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              Lleva tus descargas al siguiente nivel
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Las descargas combinadas en <strong className="text-amber-600 dark:text-amber-400">1080p Full HD y 4K</strong> combinan pistas de video de alta tasa de bits y audio estéreo de 320kbps mediante servidores dedicados con FFmpeg.
            </p>
          </div>

          {/* Lista de beneficios */}
          <div className="bg-amber-50/60 dark:bg-slate-800/60 rounded-xl p-4 border border-amber-200/60 dark:border-slate-700 space-y-2.5 text-sm text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-green-500 text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>Resoluciones 1080p, 1440p (2K) y 2160p (4K Ultra HD)</strong> sin límites.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-green-500 text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>Pistas combinadas con audio AAC a 320kbps</strong> 100% compatibles con Windows, Mac, Android y iPhone.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-green-500 text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>100% Sin Anuncios</strong> y ancho de banda turbo sin tiempos de espera.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-green-500 text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Soporte prioritario y descargas ilimitadas en todo el ecosistema ATP.</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-2">
            <Link
              href="/planes"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/25 transition-all text-center"
            >
              <Crown className="w-5 h-5" />
              <span>Ver Planes PRO y Suscribirme</span>
            </Link>

            {onDownloadFallback && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onDownloadFallback()
                }}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm"
              >
                Descargar en 720p Estándar (Gratis)
              </button>
            )}

            {/* Acceso directo de prueba para testing del usuario */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  activatePlan('pro')
                  onClose()
                }}
                className="text-xs text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <Zap className="w-3 h-3" />
                <span>¿Tienes cuenta PRO? Activar sesión PRO en este navegador</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer pequeño */}
        <div className="bg-gray-50 dark:bg-slate-800/40 px-6 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-green-600" />
            Garantía de satisfacción
          </span>
          <span>Cancela en cualquier momento</span>
        </div>
      </div>
    </div>
  )
}
