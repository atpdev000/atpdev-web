import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Layers, User, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { BlogArticleContent } from '@/components/BlogArticleContent';
import { BLOG_POSTS, getBlogPostBySlug, getLocalizedBlogPost } from '@/data/blog-posts';

export const revalidate = 3600;
export const dynamicParams = true;

const BASE_URL = 'https://www.atpdev.dev';

export async function generateStaticParams() {
  const langs = ['es', 'en'];
  return langs.flatMap((lang) =>
    BLOG_POSTS.map((post) => ({
      lang,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const rawPost = getBlogPostBySlug(slug);
  if (!rawPost) return {};

  const post = getLocalizedBlogPost(rawPost, lang);
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const canonical = `${BASE_URL}${prefix}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical,
      languages: {
        'x-default': `${BASE_URL}/blog/${slug}`,
        es: `${BASE_URL}/blog/${slug}`,
        en: `${BASE_URL}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['Percy Acha Taipe'],
      tags: post.tags,
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const rawPost = getBlogPostBySlug(slug);
  if (!rawPost) notFound();

  const isEn = lang !== 'es' && lang !== 'pt';
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const post = getLocalizedBlogPost(rawPost, lang);
  const canonicalUrl = `${BASE_URL}${prefix}/blog/${slug}`;

  const relatedArticles = BLOG_POSTS.filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => getLocalizedBlogPost(item, lang));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: isEn ? 'en' : 'es',
        mainEntityOfPage: canonicalUrl,
        image: `${BASE_URL}/og-image.png`,
        keywords: post.tags.join(', '),
        author: {
          '@type': 'Person',
          name: 'Percy Acha Taipe',
          url: `${BASE_URL}/sobre-mi`,
        },
        publisher: {
          '@type': 'Person',
          name: 'ATP Dev — Percy Acha Taipe',
          url: BASE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Inicio', item: `${BASE_URL}${prefix}/` },
          { '@type': 'ListItem', position: 2, name: isEn ? 'Blog' : 'Artículos', item: `${BASE_URL}${prefix}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)' }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6">
        <article className="max-w-4xl mx-auto">
          {/* Breadcrumb & Back */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              <Link href={`${prefix}/`} className="hover:underline" style={{ color: 'var(--primary)' }}>
                {isEn ? 'Home' : 'Inicio'}
              </Link>
              <span>/</span>
              <Link href={`${prefix}/blog`} className="hover:underline" style={{ color: 'var(--primary)' }}>
                {isEn ? 'Articles' : 'Artículos'}
              </Link>
              <span>/</span>
              <span className="truncate max-w-[200px] sm:max-w-xs" style={{ color: 'var(--text-color)' }}>
                {post.category}
              </span>
            </nav>

            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl border hover:opacity-80 transition-opacity"
              style={{ borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}
            >
              <ArrowLeft size={14} />
              <span>{isEn ? 'All Articles' : 'Todos los Artículos'}</span>
            </Link>
          </div>

          {/* Article Header */}
          <header
            className="p-7 sm:p-10 rounded-3xl border mb-10 shadow-xl"
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
          >
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mb-4">
              <span className="px-3 py-1 rounded-full border uppercase tracking-wider" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={13} />
                <time dateTime={post.updatedAt}>
                  {isEn ? `Updated ${post.updatedAt}` : `Actualizado: ${post.updatedAt}`}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Clock size={13} />
                <span>{post.readingTimeMinutes} min {isEn ? 'read' : 'de lectura'}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-5">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex items-center gap-2.5 text-sm">
                <User size={16} style={{ color: 'var(--primary)' }} />
                <span>
                  {isEn ? 'By ' : 'Por '}
                  <Link href={`${prefix}/sobre-mi`} className="font-bold hover:underline">
                    Percy Acha Taipe
                  </Link>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {isEn ? ' — Systems Engineer (UNAJMA)' : ' — Ingeniero de Sistemas (UNAJMA)'}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-0.5 rounded-md border"
                    style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Main Long-Form Technical Content */}
          <section
            className="p-6 sm:p-10 rounded-3xl border mb-10"
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
          >
            <BlogArticleContent content={post.content} />
          </section>

          {/* Related App / Implementation Card */}
          <aside
            className="p-6 sm:p-8 rounded-3xl border mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--primary)' }}>
                <Layers size={14} />
                <span>{isEn ? 'Production Implementation' : 'Implementación en Producción'}</span>
              </div>
              <h2 className="text-xl font-bold mb-1">{post.relatedProjectName}</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {isEn
                  ? 'Explore the technical architecture card, technology stack, and live documentation of this project.'
                  : 'Explora la ficha técnica completa, decisiones de arquitectura y despliegue de este proyecto.'}
              </p>
            </div>
            <Link
              href={`${prefix}/apps/${post.relatedProjectSlug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white whitespace-nowrap transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--btn-primary-bg)' }}
            >
              <span>{isEn ? 'View Project' : 'Ver Ficha Técnica'}</span>
              <ArrowRight size={16} />
            </Link>
          </aside>

          {/* More Technical Guides */}
          <section aria-label={isEn ? 'Related Guides' : 'Guías Relacionadas'}>
            <h2 className="text-2xl font-extrabold mb-5">
              {isEn ? 'Continue Reading' : 'Más Artículos de Ingeniería'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`${prefix}/blog/${rel.slug}`}
                  className="p-5 rounded-2xl border flex flex-col justify-between hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>
                      {rel.category}
                    </span>
                    <h3 className="text-base font-bold mt-2 mb-2 leading-snug">{rel.title}</h3>
                  </div>
                  <span className="text-xs font-semibold mt-3 inline-flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <span>{rel.readingTimeMinutes} min</span>
                    <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <footer className="border-t py-8 px-4 sm:px-6 text-sm" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATP Dev — Percy Acha Taipe.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href={`${prefix}/`} className="hover:underline">{isEn ? 'Home' : 'Inicio'}</Link>
            <Link href={`${prefix}/blog`} className="hover:underline">{isEn ? 'Articles' : 'Artículos'}</Link>
            <Link href={`${prefix}/sobre-mi`} className="hover:underline">{isEn ? 'About' : 'Sobre Mí'}</Link>
            <Link href={`${prefix}/privacy`} className="hover:underline">{isEn ? 'Privacy' : 'Privacidad'}</Link>
            <Link href={`${prefix}/terms`} className="hover:underline">{isEn ? 'Terms' : 'Términos'}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

