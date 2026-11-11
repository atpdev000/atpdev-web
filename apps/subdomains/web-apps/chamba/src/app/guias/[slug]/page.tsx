import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowLeft, 
  HelpCircle, 
  Wrench, 
  CheckCircle2
} from 'lucide-react';
import { getGuiaBySlug, getAllGuias } from '@/data/guias';
import { SITE_URL } from '@/lib/siteConfig';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guias = getAllGuias();
  return guias.map((guia) => ({
    slug: guia.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guia = getGuiaBySlug(slug);

  if (!guia) {
    return {
      title: 'Guía no encontrada | Chamba Pro',
    };
  }

  const pageUrl = `${SITE_URL}/guias/${guia.slug}`;

  return {
    title: `${guia.metaTitle}`,
    description: guia.description,
    keywords: guia.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: guia.title,
      description: guia.description,
      url: pageUrl,
      siteName: 'chamba pro',
      type: 'article',
      publishedTime: guia.publishedAt,
      modifiedTime: guia.updatedAt,
      authors: [guia.author.name],
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: guia.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guia.title,
      description: guia.description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function GuiaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guia = getGuiaBySlug(slug);

  if (!guia) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/guias/${guia.slug}`;

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guia.title,
    description: guia.description,
    image: `${SITE_URL}/opengraph-image`,
    datePublished: guia.publishedAt,
    dateModified: guia.updatedAt,
    author: {
      '@type': 'Organization',
      name: guia.author.name,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'chamba pro',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };

  // FAQPage JSON-LD Schema
  const faqSchema = guia.faqs && guia.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guia.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guías Laborales',
        item: `${SITE_URL}/guias`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guia.title,
        item: pageUrl,
      },
    ],
  };

  // Convert basic markdown format in guia.content into semantic HTML
  const formatMarkdown = (text: string) => {
    return text
      .split('\n\n')
      .map((block, idx) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
              <span className="text-emerald-600 dark:text-emerald-400">#</span>
              <span>{trimmed.replace('## ', '')}</span>
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold font-display text-emerald-700 dark:text-emerald-300 mt-6 mb-3">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }
        if (trimmed.startsWith('---')) {
          return <hr key={idx} className="my-8 border-slate-200 dark:border-white/10" />;
        }
        if (trimmed.includes('| :---') || trimmed.startsWith('|')) {
          const rows = trimmed.split('\n').filter(r => !r.includes('| :---'));
          return (
            <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <tbody>
                  {rows.map((row, rIdx) => {
                    const cells = row.split('|').filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                    const isHeader = rIdx === 0;
                    return (
                      <tr key={rIdx} className={isHeader ? 'bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10' : 'border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'}>
                        {cells.map((cell, cIdx) => {
                          const Tag = isHeader ? 'th' : 'td';
                          return (
                            <Tag key={cIdx} className="p-3 whitespace-pre-wrap">
                              {cell.trim().replace(/\*\*(.*?)\*\*/g, '$1')}
                            </Tag>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n');
          return (
            <ul key={idx} className="space-y-2 my-4 pl-2 font-sans text-sm sm:text-base text-slate-700 dark:text-slate-300">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                  <span dangerouslySetInnerHTML={{
                    __html: item
                      .replace(/^[\*\-\d\.]+\s+/, '')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-semibold">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="text-slate-600 dark:text-slate-200 italic">$1</em>')
                  }} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={idx}
            className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-sans my-4"
            dangerouslySetInnerHTML={{
              __html: trimmed
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-semibold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="text-slate-600 dark:text-slate-200 italic">$1</em>')
            }}
          />
        );
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header Container */}
      <header className="relative border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/60 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
            <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
            <Link href="/guias" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Guías Laborales</Link>
            <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
            <span className="text-emerald-600 dark:text-emerald-400 truncate max-w-[200px] sm:max-w-none">{guia.category}</span>
          </nav>

          {/* Category & Read Time */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
              {guia.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Clock size={13} />
              {guia.readTime}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
            {guia.title}
          </h1>

          {/* Summary */}
          <p className="mt-4 text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-sans p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
            {guia.summary}
          </p>

          {/* Author & Timestamp */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                <UserCheck size={18} />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{guia.author.name}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{guia.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                Actualizado: {guia.updatedAt}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Article Body */}
        <article className="max-w-none">
          {formatMarkdown(guia.content)}
        </article>

        {/* FAQs Section if available */}
        {guia.faqs && guia.faqs.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                Preguntas Frecuentes Relacionadas
              </h2>
            </div>

            <div className="space-y-4">
              {guia.faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm"
                >
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 font-display">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Tools Recommendation */}
        {guia.relatedTools && guia.relatedTools.length > 0 && (
          <section className="mt-12 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <Wrench className="text-emerald-600 dark:text-emerald-400" size={20} />
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
                Herramientas Gratuitas de Chamba Pro Recomendadas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              Complementa tu postulación utilizando nuestras herramientas especializadas para convocatorias del Estado:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guia.relatedTools.map((tool, tIdx) => (
                <Link
                  key={tIdx}
                  href={tool.href}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/60 hover:border-emerald-500/60 dark:hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-950/90 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    <span className="font-bold font-display text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block mb-1">
                      {tool.label}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {tool.description}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Acceder a la herramienta</span>
                    <ChevronRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back and Share Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <Link
            href="/guias"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver a todas las guías</span>
          </Link>

          <Link
            href="/empleos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-display transition-all shadow-sm"
          >
            <span>Ver Convocatorias Abiertas</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
