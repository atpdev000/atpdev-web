'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/types/blog'
import { ArrowLeft, BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { getLocalizedPost } from '@/lib/content/blog-translations'

export default function BlogListingClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { t, locale } = useI18n()
  const posts = initialPosts.map(p => getLocalizedPost(p, locale))

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200" suppressHydrationWarning>
      {/* Blog Hero Section */}
      <section className="bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 text-white py-16 sm:py-20 px-4 border-b border-slate-800">
        <div className="container mx-auto max-w-5xl text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
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
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.blog?.heroSubtitle || 'Aprende sobre calidad 1080p, extracción de audio MP3, derechos de autor y preservación de contenidos multimedia.'}
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="group bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col"
            >
              {post.image && (
                <div className="h-48 sm:h-52 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-blue-600 dark:text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs border border-slate-200/60 dark:border-slate-700/60">
                      {post.category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
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
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 text-xs sm:text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs pt-2 group/btn"
                >
                  <span>{t.blog?.readFullGuide || 'Leer Guía Completa'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
