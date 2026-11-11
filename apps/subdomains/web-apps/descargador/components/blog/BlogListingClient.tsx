'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/types/blog'
import { 
  ArrowLeft, BookOpen, Clock, Calendar, ArrowRight, 
  Search, Sparkles, Filter, CheckCircle2 
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { getLocalizedPost } from '@/lib/content/blog-translations'

export default function BlogListingClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { t, locale } = useI18n()
  const posts = useMemo(() => initialPosts.map(p => getLocalizedPost(p, locale)), [initialPosts, locale])

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach(p => {
      if (p.category) set.add(p.category)
    })
    return ['Todos', ...Array.from(set)]
  }, [posts])

  // Filtered posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'Todos' || post.category.toLowerCase() === selectedCategory.toLowerCase()
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch = !query || 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [posts, selectedCategory, searchQuery])

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: posts.length }
    posts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [posts])

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200" suppressHydrationWarning>
      {/* Blog Hero Section */}
      <section className="bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 text-white py-16 sm:py-20 px-4 border-b border-slate-800">
        <div className="container mx-auto max-w-5xl text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:underline mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{t.blog?.backToDownloader || 'Volver al Descargador'}</span>
          </Link>
          <div className="block">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.blog?.heroBadge || 'Centro de Aprendizaje & Guías Pro'}</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {t.blog?.heroTitlePrefix || 'Guías y Tutoriales para'}{' '}
            <span className="text-blue-400">{t.blog?.heroTitleHighlight || 'Creadores Digitales'}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {t.blog?.heroSubtitle || 'Aprende sobre calidad 1080p, extracción de audio MP3, derechos de autor y preservación de contenidos multimedia.'}
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema: Facebook, TikTok, 4K, MP3, Codecs, CapCut..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 dark:bg-slate-950/70 backdrop-blur-md border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-full"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills Filter Bar */}
      <section className="container mx-auto px-4 pt-8 pb-4 max-w-6xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            Categoría:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            const count = categoryCounts[cat] || 0
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/50'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No se encontraron guías
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              No hay publicaciones que coincidan con &quot;{searchQuery}&quot; en la categoría seleccionada.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos')
                setSearchQuery('')
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col"
              >
                {post.image && (
                  <div className="h-48 sm:h-52 relative overflow-hidden bg-slate-900">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Metadata cleanly separated (Zero Image Overlap) */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 text-xs sm:text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs pt-2 group/btn border-t border-slate-100 dark:border-slate-800/60"
                  >
                    <span>{t.blog?.readFullGuide || 'Leer Guía Completa'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
