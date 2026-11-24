import { NextRequest, NextResponse } from 'next/server'
import { isPlayStoreBuild, isPlayStoreUserAgent } from '@/lib/featureFlags'

export function isPlayStoreRequest(request?: NextRequest | null): boolean {
  if (isPlayStoreBuild()) {
    return true
  }
  if (!request) {
    return false
  }
  const ua = request.headers.get('user-agent')
  const channel = request.headers.get('x-fty-channel')
  return isPlayStoreUserAgent(ua) || channel === 'playstore'
}

export function isYoutubeMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const lower = url.toLowerCase()
  return (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('googlevideo.com')
  )
}

export function playStoreBlockedResponse() {
  return NextResponse.json(
    { error: 'Plataforma no disponible en esta versión de la aplicación.' },
    { status: 403 }
  )
}

