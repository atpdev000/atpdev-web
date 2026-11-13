import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Code2, UserCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { BLOG_POSTS, getLocalizedBlogPost } from '@/data/blog-posts';

export const revalidate = 3600;
export const dynamicParams = true;

const BASE_URL = 'https://www.atpdev.dev';

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang !== 'es' && lang !== 'pt';
  const title = isEn
    ? 'Engineering Articles & Technical Guides'
    : 'Artículos Técnicos y Guías de Ingeniería';
  const description = isEn
    ? 'Deep engineering guides on Android Offline-First (Kotlin, Room FTS4), Edge AI with TensorFlow Lite, Next.js Core Web Vitals, WebAssembly Privacy, and Technical SEO by Percy Acha Taipe.'
    : 'Guías técnicas prácticas sobre arquitectura Android Offline-First (Kotlin, Room FTS4), Edge AI con TensorFlow Lite, Core Web Vitals en Next.js, WebAssembly y SEO Técnico por Percy Acha Taipe.';
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const canonical = `${BASE_URL}${prefix}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'x-default': `${BASE_URL}/blog`,
        es: `${BASE_URL}/blog`,
        en: `${BASE_URL}/en/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEn = lang !== 'es' && lang !== 'pt';
  const prefix = lang === 'es' ? '' : `/${lang}`;

  const posts = BLOG_POSTS.map((post) => getLocalizedBlogPost(post, lang));
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)' }}>
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
            <Link href={`${prefix}/`} className="hover:underline" style={{ color: 'var(--accent-text)' }}>
              {isEn ? 'Home' : 'Inicio'}
            </Link>
            <span>/</span>
            <span className="font-semibold" style={{ color: 'var(--text-color)' }}>
              {isEn ? 'Engineering Blog' : 'Artículos Técnicos'}
            </span>
          </nav>

          {/* Hero Section */}
          <header
            className="p-7 sm:p-10 rounded-3xl border mb-10 shadow-xl"
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border" style={{ borderColor: 'var(--glass-border)', color: 'var(--accent-text)' }}>
              <BookOpen size={14} />
              <span>{isEn ? 'ATP Dev Engineering Journal' : 'Publicaciones Técnicas ATP Dev'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              {isEn ? 'Engineering Articles & Architecture Guides' : 'Artículos Técnicos y Guías de Arquitectura'}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-3xl mb-6" style={{ color: 'var(--text-muted)' }}>
              {isEn
                ? 'Original technical notes written from real production work by Percy Acha Taipe: offline-first Android databases, TensorFlow Lite edge inference, Next.js Core Web Vitals optimization, client-side WebAssembly privacy, and data-driven SEO.'
                : 'Documentación de ingeniería original escrita desde experiencia real en producción por Percy Acha Taipe: bases de datos offline en Android, inferencia Edge AI con TensorFlow Lite, optimización Core Web Vitals en Next.js, privacidad documental con WebAssembly y SEO técnico.'}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </header>

          {/* Editorial Pillar Note */}
          <section
            className="p-6 rounded-2xl border mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
          >
            <div className="flex items-start gap-3">
              <UserCheck size={22} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-text)' }} />
              <div>
                <h2 className="text-base font-bold mb-1">
                  {isEn ? 'Written by Percy Acha Taipe — Systems Engineer (UNAJMA)' : 'Escrito por Percy Acha Taipe — Ingeniero de Sistemas (UNAJMA)'}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {isEn
                    ? 'Every guide documents patterns actively running across our public web platforms and Google Play Android applications.'
                    : 'Cada guía documenta arquitecturas implementadas directamente en nuestras aplicaciones Android publicadas y plataformas web en producción.'}
                </p>
              </div>
            </div>
            <Link
              href={`${prefix}/sobre-mi`}
              className="px-4 py-2 rounded-xl text-xs font-bold border whitespace-nowrap hover:opacity-80 transition-opacity"
              style={{ borderColor: 'var(--accent-text)', color: 'var(--accent-text)' }}
            >
              {isEn ? 'Author Profile →' : 'Perfil del Autor →'}
            </Link>
          </section>

          {/* Articles Grid */}
          <section aria-label={isEn ? 'Published Articles' : 'Artículos Publicados'} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all hover:shadow-xl"
                style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-semibold">
                    <span className="px-2.5 py-1 rounded-lg border" style={{ borderColor: 'var(--glass-border)', color: 'var(--accent-text)' }}>
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={13} />
                      <span>
                        {post.readingTimeMinutes} min · {post.publishedAt}
                      </span>
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold leading-snug mb-3">
                    <Link href={`${prefix}/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md border"
                        style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <Link
                      href={`${prefix}/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--accent-text)' }}
                    >
                      <span>{isEn ? 'Read full guide' : 'Leer guía completa'}</span>
                      <ArrowRight size={15} />
                    </Link>

                    <Link
                      href={`${prefix}/apps/${post.relatedProjectSlug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Code2 size={13} />
                      <span>{post.relatedProjectName}</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      <footer className="border-t py-8 px-4 sm:px-6 text-sm" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATP Dev — Percy Acha Taipe.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href={`${prefix}/`} className="hover:underline">{isEn ? 'Home' : 'Inicio'}</Link>
            <Link href={`${prefix}/sobre-mi`} className="hover:underline">{isEn ? 'About' : 'Sobre Mí'}</Link>
            <Link href={`${prefix}/privacy`} className="hover:underline">{isEn ? 'Privacy' : 'Privacidad'}</Link>
            <Link href={`${prefix}/terms`} className="hover:underline">{isEn ? 'Terms' : 'Términos'}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

