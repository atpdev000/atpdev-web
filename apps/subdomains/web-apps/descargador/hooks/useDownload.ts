import { useState } from 'react'
import { downloadVideo as fetchVideo } from '@/lib/video-service'
import { isValidFacebookUrl } from '@/lib/validators'
import { useAppStore, VideoInfo } from '@/stores/app-store'

export function useDownload() {
  const [isLoading, setIsLoading] = useState(false)
  const { setCurrentVideo, setError, addToHistory } = useAppStore()

  const downloadVideo = async (url: string) => {
    if (!isValidFacebookUrl(url)) {
      setError('URL de Facebook inválida')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Obtener info del video desde el servicio
      const videoInfoFromService = await fetchVideo(url)

      // Convertir duration a string para que coincida con el store
      const videoInfo: VideoInfo = {
        ...videoInfoFromService,
        duration: videoInfoFromService.duration.toString()
      }

      // Guardar en el store
      setCurrentVideo(videoInfo)
      addToHistory(url)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el video')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    downloadVideo,
    isLoading
  }
}
