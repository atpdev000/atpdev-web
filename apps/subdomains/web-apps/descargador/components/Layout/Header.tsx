'use client'

import Link from 'next/link'

export default function Header() {
  const scrollToTools = () => {
    document.getElementById('herramientas')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre - CON ENLACE A HOME */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                FTYDownloader Pro
              </h1>
              <p className="text-sm text-gray-600">
                Facebook & TikTok Downloader
              </p>
            </div>
          </Link>

          {/* Navegación - CORREGIDO */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Inicio
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Blog
            </Link>
            <button
              onClick={scrollToTools}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Descargar Videos
            </button>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Badges de características - MANTENIDO */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Gratis</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">⚡ Rápido</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">🔒 Seguro</span>
            </div>

            {/* Botón Contacto - NUEVO */}
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}