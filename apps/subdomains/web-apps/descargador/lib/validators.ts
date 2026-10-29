// Validadores para todas las plataformas
export function isValidFacebookUrl(url: string): boolean {
  const facebookPatterns = [
    /https?:\/\/(www\.)?facebook\.com\/share\/v\/[a-zA-Z0-9]+\//,
    /https?:\/\/(www\.)?facebook\.com\/.+\/videos\/.+/,
    /https?:\/\/(www\.)?facebook\.com\/watch\/\?v=.+/,
    /https?:\/\/(www\.)?fb\.watch\/.+/,
    /https?:\/\/(www\.)?facebook\.com\/.+\/video\/.+/,
    /https?:\/\/(www\.)?facebook\.com\/video\.php\?v=.+/
  ]
  
  return facebookPatterns.some(pattern => pattern.test(url))
}

export function isValidYoutubeUrl(url: string): boolean {
  const youtubePatterns = [
    /https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/,
    /https?:\/\/(www\.)?youtu\.be\/[a-zA-Z0-9_-]+/,
    /https?:\/\/(www\.)?youtube\.com\/shorts\/[a-zA-Z0-9_-]+/,
    /https?:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+/,
    /https?:\/\/(www\.)?m\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/
  ]
  
  return youtubePatterns.some(pattern => pattern.test(url))
}

export function isValidTiktokUrl(url: string): boolean {
  const tiktokPatterns = [
    /https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.-]+\/video\/[0-9]+/,
    /https?:\/\/(www\.)?vm\.tiktok\.com\/[a-zA-Z0-9]+\//,
    /https?:\/\/(www\.)?vt\.tiktok\.com\/[a-zA-Z0-9]+\//,
    /https?:\/\/(www\.)?tiktok\.com\/t\/[a-zA-Z0-9]+\//,
    /https?:\/\/(www\.)?tiktok\.com\/v\/[0-9]+/
  ]
  
  return tiktokPatterns.some(pattern => pattern.test(url))
}

// Validador universal para cualquier plataforma
export function isValidVideoUrl(url: string): { isValid: boolean; platform?: string } {
  if (isValidFacebookUrl(url)) return { isValid: true, platform: 'facebook' }
  if (isValidYoutubeUrl(url)) return { isValid: true, platform: 'youtube' }
  if (isValidTiktokUrl(url)) return { isValid: true, platform: 'tiktok' }
  
  return { isValid: false }
}

// Extraer IDs de videos
export function extractVideoId(url: string, platform: string): string | null {
  switch (platform) {
    case 'facebook':
      return extractFacebookId(url)
    case 'youtube':
      return extractYoutubeId(url)
    case 'tiktok':
      return extractTiktokId(url)
    default:
      return null
  }
}

function extractFacebookId(url: string): string | null {
  const patterns = [
    /facebook\.com\/share\/v\/([a-zA-Z0-9]+)/,
    /facebook\.com\/watch\/\?v=([0-9]+)/,
    /fb\.watch\/([a-zA-Z0-9_-]+)/,
    /facebook\.com\/.*\/videos\/([0-9]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

function extractTiktokId(url: string): string | null {
  const patterns = [
    /tiktok\.com\/@[^\/]+\/video\/([0-9]+)/,
    /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
    /vt\.tiktok\.com\/([a-zA-Z0-9]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

export function sanitizeUrl(url: string): string {
  return url.trim().replace(/\s/g, '')
}