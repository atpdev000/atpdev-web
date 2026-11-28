import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './siteConfig';

export interface ToolSeoConfig {
  slug: string;
  title: string; // Sin sufijo "| Sorteos Pro" porque root layout.tsx aplica template "%s | Sorteos Pro"
  shortName: string;
  description: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
  parentLabel?: string;
  parentPath?: string;
}

export function buildToolMetadata(cfg: ToolSeoConfig): Metadata {
  const fullUrl = `${SITE_URL}${cfg.slug}`;
  const fullTitle = `${cfg.title} | ${SITE_NAME}`;

  return {
    title: cfg.title,
    description: cfg.description,
    keywords: cfg.keywords,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description: cfg.description,
      url: fullUrl,
      siteName: SITE_NAME,
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: cfg.description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export function buildToolJsonLd(cfg: ToolSeoConfig) {
  const fullUrl = `${SITE_URL}${cfg.slug}`;
  const parentLabel = cfg.parentLabel || 'Herramientas';
  const parentPath = cfg.parentPath || '/#herramientas';

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'SoftwareApplication',
      '@id': `${fullUrl}#app`,
      name: `${cfg.shortName} — ${SITE_NAME}`,
      description: cfg.description,
      url: fullUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      isAccessibleForFree: true,
      inLanguage: ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'hi', 'ar'],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${fullUrl}#breadcrumb`,
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
          name: parentLabel,
          item: `${SITE_URL}${parentPath}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: cfg.shortName,
          item: fullUrl,
        },
      ],
    },
  ];

  if (cfg.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${fullUrl}#faq`,
      mainEntity: cfg.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

