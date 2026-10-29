import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogPosts } from '@/lib/content/blog-posts'
import { BlogPost } from '@/types/blog'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'

// ✅ GENERAR PARAMS COMO PROMISE
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// ✅ METADATA
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return {
      title: 'Artículo No Encontrado - FTYDownloader Pro',
    }
  }

  return {
    title: `${post.title} - FTYDownloader Pro`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  }
}

// ✅ COMPONENTE PRINCIPAL CON PARAMS COMO PROMISE
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Inyectar IDs en los H2 dinámicamente para que el TOC funcione
  const contentWithIds = post.content.replace(/<h2>(.*?)<\/h2>/g, (match, title) => {
    const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    return `<h2 id="${id}">${title}</h2>`
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Article content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/blog" className="text-blue-600 hover:text-blue-700 mb-8 inline-flex items-center gap-2 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.date}</span>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{post.readTime} de lectura</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-blue-200 pl-6">
            {post.excerpt}
          </p>
        </header>

        {post.image && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <TableOfContents content={post.content} />

            <div
              className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed 
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />
          </div>

          {/* Sidebar / Extra info (Optional) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Sobre esta guía</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Esta es una guía pilar redactada por nuestro equipo de expertos en tecnología multimedia para asegurar la mejor calidad de información en 2026.
              </p>
            </div>
          </aside>
        </div>

        {/* Artículos Relacionados */}
        <RelatedPosts currentPost={post} />

        <div className="mt-20 pt-10 border-t border-gray-100 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-black transition-all font-bold">
            Ver todas las guías y tutoriales
          </Link>
        </div>
      </article>
    </div>
  )
}
