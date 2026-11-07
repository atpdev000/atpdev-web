'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/Layout/ThemeToggle'
import { LanguageSelector } from '@/components/Layout/LanguageSelector'

export default function MainHeader() {
  const [siteTitle, setSiteTitle] = useState('Descargador Pro')

  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (data?.branding?.site_title) {
          setSiteTitle(data.branding.site_title)
        }
      })
      .catch(() => {})
  }, [])
  return (
    <header className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo y Nombre de Marca */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                {siteTitle}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                Descargador Multimedia Universal HD & MP3
              </p>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center space-x-5 text-xs sm:text-sm font-semibold">
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Inicio
            </Link>
            <Link href="/tools" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Herramientas
            </Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              FAQ
            </Link>
            <Link
              href="/planes"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Planes PRO</span>
            </Link>
          </nav>

          {/* Acciones: Idioma, Tema y Botón Inicio / Contacto */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageSelector />
            <ThemeToggle />

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </Link>

            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
