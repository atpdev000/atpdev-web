'use client'

import { useEffect } from 'react'
import { useProPlan } from '@/hooks/useProPlan'

interface EzoicAdProps {
  placeholderId: number
  className?: string
}

declare global {
  interface Window {
    ezstandalone?: {
      cmd: any[]
      showAds: (...ids: number[]) => void
      define: (...ids: number[]) => void
      enable: () => void
      display: () => void
      isEzoicActive: () => boolean
    }
  }
}

export default function EzoicAd({ placeholderId, className = "" }: EzoicAdProps) {
  const { isPro } = useProPlan()

  useEffect(() => {
    if (isPro) return
    if (typeof window !== 'undefined') {
      if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
        return
      }
      const ez = window.ezstandalone
      if (ez) {
        ez.cmd = ez.cmd || []
        ez.cmd.push(function () {
          if (ez.showAds) {
            ez.showAds(placeholderId)
          }
        })
      }
    }
  }, [placeholderId, isPro])

  // Si el usuario es PRO, no mostrar anuncios de Ezoic
  if (isPro) return null

  return (
    <div className={`ezoic-ad-container ${className}`}>
      <div id={`ezoic-pub-ad-placeholder-${placeholderId}`}></div>
    </div>
  )
}
