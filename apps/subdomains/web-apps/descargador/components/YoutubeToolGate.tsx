'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { isPlayStoreBuild } from '@/lib/featureFlags'

interface YoutubeToolGateProps {
  serverEnabled: boolean
  children: React.ReactNode
}

/**
 * Allows /tools/youtube on web only when enabled on the server, while always
 * allowing non-PlayStore native Capacitor builds (which extract on-device).
 */
export default function YoutubeToolGate({ serverEnabled, children }: YoutubeToolGateProps) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean>(serverEnabled)

  useEffect(() => {
    if (serverEnabled) {
      setAllowed(true)
      return
    }
    const cap = (window as any).Capacitor
    const isNative = Boolean(
      Capacitor.isNativePlatform() ||
        cap?.isNativePlatform?.() ||
        cap?.getPlatform?.() === 'android' ||
        cap?.getPlatform?.() === 'ios'
    )
    if (isNative && !isPlayStoreBuild()) {
      setAllowed(true)
    } else {
      router.replace('/')
    }
  }, [serverEnabled, router])

  if (!allowed) {
    return null
  }

  return <>{children}</>
}

