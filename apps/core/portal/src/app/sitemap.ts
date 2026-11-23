import { MetadataRoute } from 'next';
import { getProjects } from '@atpdev/database';
import { BLOG_POSTS } from '@/data/blog-posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.atpdev.dev';
    const currentDate = new Date();

    let projects: Awaited<ReturnType<typeof getProjects>> = [];
    try {
        const allProjects = await getProjects();
        projects = allProjects.filter((p) => p.status !== 'Privado' && Boolean(p.slug));
    } catch (e) {
        console.error('Sitemap: Error fetching projects', e);
    }

    // Core high-value editorial pages only (legal/utility pages excluded from sitemap inventory)
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/sobre-mi`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/en`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/en/sobre-mi`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/en/blog`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
    ];

    const esAppRoutes: MetadataRoute.Sitemap = projects.map((app) => ({
        url: `${baseUrl}/apps/${app.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
    }));

    const enAppRoutes: MetadataRoute.Sitemap = projects.map((app) => ({
        url: `${baseUrl}/en/apps/${app.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const esBlogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.85,
    }));

    const enBlogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/en/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        ...staticPages,
        ...esAppRoutes,
        ...enAppRoutes,
        ...esBlogRoutes,
        ...enBlogRoutes,
    ];
}
