import Link from 'next/link'
import { blogPosts } from '@/lib/content/blog-posts'
import Image from 'next/image'

export default function BlogPreview() {
  const featuredPosts = blogPosts.slice(0, 9)

  return (
    <section className="py-8 transition-colors">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Nuestras Guías y Tutoriales
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
          Contenido especializado para que aproveches al máximo tus redes sociales.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {featuredPosts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/80 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group"
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
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{post.readTime} de lectura</span>
                <span className="text-gray-400 dark:text-slate-500">{post.date}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-xs"
              >
                Leer más →
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
          Ver todos los artículos
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}