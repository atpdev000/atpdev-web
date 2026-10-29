import { useEffect } from 'react'
import { useAppStore } from '@/stores/app-store'

export function useDarkMode() {
  const { darkMode } = useAppStore()

  useEffect(() => {
    const root = window.document.documentElement
    
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])
}
