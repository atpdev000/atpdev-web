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
      title: 'Artículo No Encontrado - Descargador Pro',
    }
  }

  return {
    title: `${post.title} - Descargador Pro`,
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

  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image ? [post.image.startsWith('http') ? post.image : `https://descargador.atpdev.dev${post.image}`] : [],
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "ATP DEV",
      "url": "https://atpdev.dev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Descargador Pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://descargador.atpdev.dev/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://descargador.atpdev.dev/blog/${slug}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />
      <BlogPostClient initialPost={post} />
    </>
  )
}
