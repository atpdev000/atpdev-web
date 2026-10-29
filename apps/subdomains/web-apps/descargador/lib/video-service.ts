import { isValidVideoUrl } from './validators'

export interface VideoFormat {
  quality: string
  format: string
  resolution: string
  size: string
  url: string
}

export interface VideoInfo {
  status: string
  platform: string
  title: string
  thumbnail: string
  duration: number
  uploader: string
  formats: VideoFormat[]
}

// Servicio mínimo para producción
export async function downloadVideo(url: string): Promise<VideoInfo> {
  const { isValid, platform } = isValidVideoUrl(url)
  
  if (!isValid || !platform) {
    throw new Error('URL no válida para Facebook, YouTube o TikTok')
  }

  const response = await fetch(`/api/download/${platform}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error en la descarga')
  }

  return response.json()
}

// Función de simulación para pruebas (simula la info de un video)
export async function simulateVideoProcessing(url: string): Promise<VideoInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'ok',
        platform: 'facebook',
        title: 'Video de prueba',
        thumbnail: 'https://via.placeholder.com/480x360.png?text=Thumbnail',
        duration: 120,
        uploader: 'Usuario Ejemplo',
        formats: [
          { quality: '720p', format: 'mp4', resolution: '1280x720', size: '50MB', url },
          { quality: '480p', format: 'mp4', resolution: '854x480', size: '25MB', url }
        ]
      })
    }, 1000)
  })
}