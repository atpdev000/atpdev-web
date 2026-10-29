import Link from 'next/link'
import { blogPosts } from '@/lib/content/blog-posts'
import { BlogPost } from '@/types/blog'

export default function RelatedPosts({ currentPost }: { currentPost: BlogPost }) {
    // Encontrar posts de la misma categoría, excluyendo el actual
    const related = blogPosts
        .filter(p => p.category === currentPost.category && p.id !== currentPost.id)
        .slice(0, 3)

    if (related.length === 0) return null

    return (
        <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Artículos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                        {post.image && (
                            <div className="mb-4 overflow-hidden rounded-xl aspect-video bg-gray-100">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                {post.category}
                            </span>
                        </div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                        </h4>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
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
