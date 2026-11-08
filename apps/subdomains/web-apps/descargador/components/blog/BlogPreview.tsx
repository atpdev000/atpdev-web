'use client'

import Link from 'next/link'
import { blogPosts } from '@/lib/content/blog-posts'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'
import { getLocalizedPost } from '@/lib/content/blog-translations'

export default function BlogPreview() {
  const { t, locale } = useI18n()
  const featuredPosts = blogPosts.slice(0, 9).map(p => getLocalizedPost(p, locale))

  return (
    <section className="py-8 transition-colors" suppressHydrationWarning>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.blog?.previewTitle || 'Nuestras Guías y Tutoriales'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t.blog?.previewSubtitle || 'Contenido especializado para que aproveches al máximo tus redes sociales.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {featuredPosts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group"
          >
            {post.image && (
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-center mb-3 text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{post.readTime}</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">{post.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                aria-label={`Leer artículo: ${post.title}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-xs"
              >
                {t.blog?.readMore || 'Leer más →'}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-sm"
        >
          {t.blog?.readFullGuide || 'Ver todas las guías →'}
        </Link>
      </div>
    </section>
  )
}
