import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/content/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://descargador.atpdev.dev'

    // Rutas estáticas
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/faq',
        '/blog',
        '/tools',
        '/privacy-policy',
        '/terms-of-service',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Rutas dinámicas del blog
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticRoutes, ...blogRoutes]
}
