import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/content/blog-posts'
import BlogPostClient from '@/components/blog/BlogPostClient'

const legacySlugMap: Record<string, string> = {
  'mega-guia-post-7': 'derechos-autor-digitales-guia-2026',
  'mega-guia-post-9': 'solucion-problemas-descarga-video',
  'mega-guia-post-10': 'streaming-vs-descarga-local',
  'mega-guia-post-12': 'comparativa-codecs-av1-hevc-h264',
  'mega-guia-post-13': 'gestion-colecciones-multimedia',
  'post-14': 'editar-reels-capcut-profesional-2026',
  'futuro-descarga-videos-tendencias-2026-2030': 'ciberseguridad-descargas-guia-seguridad-2026',
  'guia-meta-facebook-ads-negocios-2026': 'estrategias-monetizacion-tiktok-2026-guia-completa',
  'futuro-video-corto-2026': 'tiktok-sin-marca-de-agua',
  'post-21': 'estrategias-monetizacion-tiktok-2026-guia-completa',
  'post-22': 'ciberseguridad-descargas-guia-seguridad-2026',
  'post-23': 'guia-audio-mp3-hd',
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

// ✅ GENERAR PARAMS COMO PROMISE (Directos + Aliases heredados)
export async function generateStaticParams() {
  const directSlugs = blogPosts.map((post) => ({ slug: post.slug }))
  const legacySlugs = Object.keys(legacySlugMap).map((slug) => ({ slug }))
  return [...directSlugs, ...legacySlugs]
}

// ✅ METADATA
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
