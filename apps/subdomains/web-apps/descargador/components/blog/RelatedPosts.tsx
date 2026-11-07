'use client'

import Link from 'next/link'
import { blogPosts } from '@/lib/content/blog-posts'
import { BlogPost } from '@/types/blog'
import { useI18n } from '@/lib/i18n/context'
import { getLocalizedPost } from '@/lib/content/blog-translations'

export default function RelatedPosts({ currentPost }: { currentPost: BlogPost }) {
    const { t, locale } = useI18n()

    // Encontrar posts de la misma categoría o relacionados, excluyendo el actual
    const related = blogPosts
        .filter(p => p.id !== currentPost.id)
        .slice(0, 3)
        .map(p => getLocalizedPost(p, locale))

    if (related.length === 0) return null

    return (
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800" suppressHydrationWarning>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8">
                {t.blog?.relatedArticles || 'Artículos Relacionados'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {related.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                        {post.image && (
                            <div className="mb-4 overflow-hidden rounded-2xl aspect-video bg-slate-100 dark:bg-slate-800 shadow-sm">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                                {post.category}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug text-sm sm:text-base">
                            {post.title}
                        </h4>
                        <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
