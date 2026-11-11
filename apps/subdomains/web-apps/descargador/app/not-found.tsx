import type { Metadata } from 'next'
import Link from 'next/link'
import MainHeader from '@/components/Layout/MainHeader'
import Footer from '@/components/Layout/Footer'
import { Search, Home, BookOpen, Download, HelpCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Página no encontrada (404) - Descargador Pro',
  description: 'La página o recurso que buscas no existe o ha sido movido. Explora nuestras herramientas de descarga de video y guías oficiales.',
}

export default function NotFound() {
  const popularTools = [
    { name: 'Facebook HD', href: '/tools/facebook', color: 'from-blue-600 to-blue-500' },
    { name: 'TikTok Sin Marca', href: '/tools/tiktok', color: 'from-pink-500 to-rose-600' },
    { name: 'Instagram 4K', href: '/tools/instagram', color: 'from-purple-600 to-pink-500' },
    { name: 'Twitter / X', href: '/tools/twitter', color: 'from-slate-700 to-slate-900' },
    { name: 'WhatsApp Status', href: '/tools/whatsapp', color: 'from-emerald-600 to-green-500' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <MainHeader />

      <main className="container mx-auto px-4 py-16 sm:py-24 max-w-3xl text-center my-auto">
        {/* Glow & 404 Emblem */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150" />
          <div className="relative w-20 h-20 mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Search className="w-9 h-9" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold border border-blue-200 dark:border-blue-800/60 mb-4">
          <span>ERROR 404 • ENLACE NO DISPONIBLE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Esta página no fue encontrada
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto mb-8">
          La dirección web que ingresaste puede estar desactualizada, haber cambiado de ubicación o el archivo fue archivado. No te preocupes, puedes volver al descargador o explorar nuestros recursos.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Descargador Principal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Explorar Guías y Blog</span>
          </Link>
          <Link
            href="/faq"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Preguntas Frecuentes</span>
          </Link>
        </div>

        {/* Popular Tools Pills */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-4 font-semibold">
            Herramientas Rápidas de Descarga
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {popularTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-slate-700 dark:text-slate-300 text-xs font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3 h-3 text-blue-500" />
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
