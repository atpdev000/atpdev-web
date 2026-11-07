import { Metadata } from 'next'
import { blogPosts } from '@/lib/content/blog-posts'
import BlogListingClient from '@/components/blog/BlogListingClient'

export const metadata: Metadata = {
  title: 'Blog de FTY Downloader - Guías de Descarga y Seguridad Digital',
  description: 'Aprende a descargar videos de Facebook, TikTok, YouTube, Instagram y Threads, optimizar tus archivos multimedia y proteger tu privacidad digital con nuestras guías expertas.',
}

export default function BlogPage() {
  return <BlogListingClient initialPosts={blogPosts} />
}
