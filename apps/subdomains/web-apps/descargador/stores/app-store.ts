import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VideoFormat {
  quality: string
  format: string
  resolution: string
  size: string
  url: string
}

export interface VideoInfo {
  title: string
  thumbnail: string
  duration: string
  uploader: string
  formats: VideoFormat[]
}

interface AppState {
  // Estado de la aplicación
  currentVideo: VideoInfo | null
  isLoading: boolean
  error: string | null
  darkMode: boolean
  downloadHistory: string[]
  
  // Actions
  setCurrentVideo: (video: VideoInfo | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleDarkMode: () => void
  addToHistory: (url: string) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentVideo: null,
      isLoading: false,
      error: null,
      darkMode: false,
      downloadHistory: [],

      // Actions
      setCurrentVideo: (video) => set({ currentVideo: video }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      addToHistory: (url) => 
        set((state) => ({ 
          downloadHistory: [url, ...state.downloadHistory.slice(0, 9)] 
        })),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        downloadHistory: state.downloadHistory 
      }),
    }
  )
)
