import { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog-data';
import { BlogListingClient } from '@/components/blog/BlogListingClient';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `Blog y Guías Oficiales para Sorteos | ${SITE_NAME}`,
  description: 'Guías completas, tutoriales paso a paso y recursos técnicos sobre cómo realizar sorteos en Instagram, Facebook y TikTok con certificación criptográfica y cumplimiento de normas de Meta.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Blog y Guías Oficiales para Sorteos | ${SITE_NAME}`,
    description: 'Guías y recursos técnicos sobre cómo realizar sorteos en Instagram, Facebook y TikTok con certificación criptográfica y cumplimiento de normas de Meta.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default function BlogPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Blog y Guías Oficiales de ${SITE_NAME}`,
    "description": "Tutoriales, guías legales y análisis criptográficos sobre sorteos digitales y promociones en redes sociales.",
    "url": `${SITE_URL}/blog`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": BLOG_POSTS.map((post, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${SITE_URL}/blog/${post.slug}`,
        "name": post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BlogListingClient initialPosts={BLOG_POSTS} />
    </>
  );
}
