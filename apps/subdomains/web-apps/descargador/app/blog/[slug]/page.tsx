import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/content/blog-posts'
import BlogPostClient from '@/components/blog/BlogPostClient'

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

  return <BlogPostClient initialPost={post} />
}
