import { Platform } from '@/components/PlatformTabs'

export interface DetectedUrlInfo {
  url: string
  platform: Platform
  platformName: string
}

/**
 * Extracts a URL from a text string that might contain text and hashtags
 * (e.g., from TikTok/Instagram share sheet: "Check out this video! https://vm.tiktok.com/xyz/")
 */
export function extractUrlFromText(text: string): string | null {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()
  
  // Direct URL match
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = trimmed.match(urlRegex)
  if (matches && matches.length > 0) {
    // Strip trailing punctuation like ., ), etc.
    let clean = matches[0].replace(/[.,;:)]+$/, '')
    return clean
  }
  return null
}

/**
 * Determines which platform a URL belongs to
 */
export function detectPlatformFromUrl(inputUrl: string): DetectedUrlInfo | null {
  if (!inputUrl) return null
  const cleanUrl = extractUrlFromText(inputUrl) || inputUrl.trim()
  const lower = cleanUrl.toLowerCase()

  // TikTok
  if (lower.includes('tiktok.com') || lower.includes('vm.tiktok.com') || lower.includes('vt.tiktok.com')) {
    return {
      url: cleanUrl,
      platform: 'tiktok',
      platformName: 'TikTok'
    }
  }

  // Facebook
  if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.me') || lower.includes('m.facebook.com')) {
    return {
      url: cleanUrl,
      platform: 'facebook',
      platformName: 'Facebook'
    }
  }

  // Instagram
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    return {
      url: cleanUrl,
      platform: 'instagram',
      platformName: 'Instagram'
    }
  }

  // Twitter / X
  if (lower.includes('twitter.com') || lower.includes('x.com')) {
    return {
      url: cleanUrl,
      platform: 'twitter',
      platformName: 'Twitter / 𝕏'
    }
  }

  // Threads
  if (lower.includes('threads.net')) {
    return {
      url: cleanUrl,
      platform: 'threads',
      platformName: 'Threads'
    }
  }

  // YouTube / Multimedia
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return {
      url: cleanUrl,
      platform: 'youtube',
      platformName: 'YouTube'
    }
  }

  return null
}
