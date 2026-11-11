import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog-data';
import { BlogPostClient } from '@/components/blog/BlogPostClient';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: `Artículo No Encontrado | ${SITE_NAME}`,
      description: 'El artículo solicitado no existe o ha sido movido.',
    };
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  // Structured Data Schema.org (BlogPosting & BreadcrumbList)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        "isPartOf": {
          "@type": "WebPage",
          "@id": postUrl,
        },
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": postUrl,
        "inLanguage": "es-ES",
        "author": {
          "@type": "Person",
          "name": post.author.name,
          "jobTitle": post.author.role,
        },
        "publisher": {
          "@type": "Organization",
          "name": SITE_NAME,
          "url": SITE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/icon.svg`,
          },
        },
        "keywords": post.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": SITE_URL,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": postUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}

