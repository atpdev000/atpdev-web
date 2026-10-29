export const APP_CONFIG = {
  name: 'FDownloader Pro',
  version: '1.0.0',
  description: 'Descargador de videos de Facebook',
  author: 'FDownloader Team',
  website: 'https://fdownloader.net'
} as const

export const VIDEO_FORMATS = {
  MP4: 'mp4',
  WEBM: 'webm',
  MP3: 'mp3',
  M4A: 'm4a'
} as const

export const VIDEO_QUALITIES = {
  HD: '1080p',
  SD: '720p',
  LOW: '480p'
} as const
