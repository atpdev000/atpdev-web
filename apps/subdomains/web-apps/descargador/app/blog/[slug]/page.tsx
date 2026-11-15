import { notFound, permanentRedirect } from 'next/navigation'
import { blogPosts } from '@/lib/content/blog-posts'
import BlogPostClient from '@/components/blog/BlogPostClient'

const legacySlugMap: Record<string, string> = {
  'mega-guia-post-7': 'derechos-autor-digitales-guia-2026',
  'mega-guia-post-9': 'solucion-problemas-descarga-video',
  'mega-guia-post-10': 'streaming-vs-descarga-local',
  'mega-guia-post-12': 'comparativa-codecs-av1-hevc-h264',
  'mega-guia-post-13': 'gestion-colecciones-multimedia',
  'post-14': 'editar-reels-capcut-profesional-2026',
  'post-21': 'automatizacion-descargas-y-productividad',
  'post-22': 'seguridad-cloud-y-privacidad-archivos',
  'post-23': 'edicion-movil-vs-escritorio-2026',
}

function resolvePost(slug: string) {
  const direct = blogPosts.find(p => p.slug === slug)
  if (direct) return direct
  const targetSlug = legacySlugMap[slug]
  if (targetSlug) {
    return blogPosts.find(p => p.slug === targetSlug)
  }
  return undefined
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = resolvePost(slug)

  if (!post) {
    return {
      title: 'Artículo No Encontrado - Descargador Pro',
    }
  }

  return {
    title: `${post.title} - Descargador Pro`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://descargador.atpdev.dev/blog/${post.slug}`,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mappedTarget = legacySlugMap[slug]
  if (mappedTarget && mappedTarget !== slug) {
    permanentRedirect(`/blog/${mappedTarget}`)
  }

  const post = resolvePost(slug)

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
      "@type": "Person",
      "name": "Percy Acha Taipe",
      "url": "https://www.atpdev.dev/sobre-mi"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ATP DEV — Descargador Pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://descargador.atpdev.dev/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://descargador.atpdev.dev/blog/${post.slug}`
    }
  }

  return (
    <>
      <script
        id={`blog-post-schema-${post.slug}`}
        key={`blog-post-schema-${post.slug}`}
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />
      <BlogPostClient initialPost={post} />
    </>
  )
}
