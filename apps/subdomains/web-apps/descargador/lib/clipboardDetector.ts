import { Platform } from '@/components/PlatformTabs'

export interface DetectedUrlInfo {
  url: string
  platform: Platform
  platformName: string
}

/**
 * Extrae una URL limpia desde un texto que puede contener frases, hashtags o emojis
 * (ej., desde el menú compartir de TikTok, Instagram, Threads o Twitter/X).
 */
export function extractUrlFromText(text: string): string | null {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()

  // Match para cualquier enlace http / https
  const urlRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+)/gi
  const matches = trimmed.match(urlRegex)
  if (matches && matches.length > 0) {
    // Limpiar puntuación final común adherida al texto (.,;:) y paréntesis/corchetes de cierre
    let clean = matches[0].replace(/[.,;:!?)\]"'\s]+$/, '')
    return clean
  }
  return null
}

/**
 * Determina a qué red social pertenece una URL dada y retorna su información limpia.
 */
export function detectPlatformFromUrl(inputUrl: string): DetectedUrlInfo | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null
  const cleanUrl = extractUrlFromText(inputUrl) || inputUrl.trim()
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    // Si el usuario ingresó sin http (ej: tiktok.com/@user/...)
    if (/^(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i.test(cleanUrl)) {
      return detectPlatformFromUrl('https://' + cleanUrl)
    }
    if (/^(www\.)?(threads\.(net|com))/i.test(cleanUrl)) {
      return detectPlatformFromUrl('https://' + cleanUrl)
    }
    if (/^(www\.)?(instagram\.com|instagr\.am)/i.test(cleanUrl)) {
      return detectPlatformFromUrl('https://' + cleanUrl)
    }
    if (/^(www\.)?(twitter\.com|x\.com|t\.co)/i.test(cleanUrl)) {
      return detectPlatformFromUrl('https://' + cleanUrl)
    }
    if (/^(www\.)?(facebook\.com|fb\.watch|fb\.me)/i.test(cleanUrl)) {
      return detectPlatformFromUrl('https://' + cleanUrl)
    }
    if (/^(www\.)?(youtube\.com|youtu\.be)/i.test(cleanUrl)) {
      return detectPlatformFromUrl('https://' + cleanUrl)
    }
    return null
  }

  const lower = cleanUrl.toLowerCase()

  // 1. TikTok (tiktok.com, vm.tiktok.com, vt.tiktok.com, m.tiktok.com, etc.)
  if (
    lower.includes('tiktok.com') ||
    lower.includes('vm.tiktok.com') ||
    lower.includes('vt.tiktok.com')
  ) {
    return {
      url: cleanUrl,
      platform: 'tiktok',
      platformName: 'TikTok'
    }
  }

  // 2. Threads (threads.net o threads.com)
  if (
    lower.includes('threads.net') ||
    lower.includes('threads.com')
  ) {
    return {
      url: cleanUrl,
      platform: 'threads',
      platformName: 'Threads'
    }
  }

  // 3. Instagram (instagram.com, instagr.am, reels, posts, share links)
  if (
    lower.includes('instagram.com') ||
    lower.includes('instagr.am')
  ) {
    return {
      url: cleanUrl,
      platform: 'instagram',
      platformName: 'Instagram'
    }
  }

  // 4. Twitter / X (twitter.com, x.com, t.co enlaces cortos del botón compartir)
  if (
    lower.includes('twitter.com') ||
    lower.includes('x.com') ||
    lower.includes('t.co/') ||
    /(^|\.)t\.co\//.test(lower)
  ) {
    return {
      url: cleanUrl,
      platform: 'twitter',
      platformName: 'Twitter / 𝕏'
    }
  }

  // 5. Facebook (facebook.com, fb.watch, fb.me, m.facebook.com)
  if (
    lower.includes('facebook.com') ||
    lower.includes('fb.watch') ||
    lower.includes('fb.me')
  ) {
    return {
      url: cleanUrl,
      platform: 'facebook',
      platformName: 'Facebook'
    }
  }

  // 6. YouTube (youtube.com, youtu.be, shorts, live)
  if (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be')
  ) {
    return {
      url: cleanUrl,
      platform: 'youtube',
      platformName: 'YouTube'
    }
  }

  return null
}
