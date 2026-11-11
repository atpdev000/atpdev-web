'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/types/blog'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import { ArrowLeft, Clock, Calendar, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { getLocalizedPost } from '@/lib/content/blog-translations'

export default function BlogPostClient({ initialPost }: { initialPost: BlogPost }) {
  const { t, locale } = useI18n()
  const post = getLocalizedPost(initialPost, locale)
  const [imageError, setImageError] = useState(false)

  // Inyectar IDs en los H2 dinámicamente para que el TOC funcione
  const contentWithIds = post.content.replace(/<h2>(.*?)<\/h2>/g, (match, title) => {
    const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    return `<h2 id="${id}">${title}</h2>`
  })

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200" suppressHydrationWarning>
      {/* Article content */}
      <article className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <Link 
          href="/blog" 
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.blog?.backToBlog || 'Volver al blog'}</span>
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              {post.category}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
            {post.excerpt}
          </p>
        </header>

        {post.image && !imageError ? (
          <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl aspect-video bg-slate-900 border border-slate-200/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              unoptimized
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="mb-10 rounded-3xl overflow-hidden shadow-xl aspect-video bg-gradient-to-br from-blue-900/60 via-slate-900 to-indigo-950/80 border border-blue-500/20 p-8 flex flex-col justify-end">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              {post.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">{post.title}</h2>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
            <TableOfContents content={post.content} />

            <div
              className="prose prose-base sm:prose-lg max-w-none text-slate-800 dark:text-slate-200 leading-relaxed 
                prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold
                prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
                prose-strong:text-slate-900 dark:prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900/90 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-2">
                {t.blog?.aboutGuideTitle || 'Sobre esta guía'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.blog?.aboutGuideDesc || 'Esta es una guía de referencia redactada por nuestro equipo para asegurar la mejor calidad de descarga e información técnica.'}
              </p>
            </div>

            <RelatedPosts currentPost={post} />
          </aside>
        </div>
      </article>
    </div>
  )
}

