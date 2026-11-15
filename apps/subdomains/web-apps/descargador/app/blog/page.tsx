import { Metadata } from 'next'
import { blogPosts } from '@/lib/content/blog-posts'
import BlogListingClient from '@/components/blog/BlogListingClient'

export const metadata: Metadata = {
  title: 'Blog de Descargador Pro - Guías de Descarga y Seguridad Digital',
  description: 'Aprende a respaldar videos propios de Facebook, TikTok, Instagram, X y Threads, optimizar formatos MP4/MP3, códecs AV1/HEVC y proteger tu privacidad en línea.',
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return <BlogListingClient initialPosts={blogPosts} />
}
