import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog de FTY Downloader - Guías de Descarga y Seguridad Digital',
  description: 'Aprende a descargar videos de Facebook y TikTok sin marca de agua, optimizar tus archivos multimedia y proteger tu privacidad digital con nuestras guías expertas.',
}
import { blogPosts } from '@/lib/content/blog-posts'
import Image from 'next/image'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Blog Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-24 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-400/30">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            Centro de Aprendizaje Pro
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Guías y Tutoriales para <span className="text-blue-400">Creadores Digitales</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Profundiza en estrategias de monetización, seguridad digital y optimización multimedia con nuestras guías maestras de 2026.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <article key={post.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {post.image && (
                <div className="h-56 relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-400 font-medium">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm"
                >
                  Leer Guía Completa
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
