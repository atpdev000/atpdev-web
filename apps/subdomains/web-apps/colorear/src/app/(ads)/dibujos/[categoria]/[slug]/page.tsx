import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  COLORING_SHEETS,
  getCategoryBySlug,
  getSheetsByCategory,
} from '@/data/catalog';
import SheetDetailClient from '@/components/SheetDetailClient';
import AdBanner from '@/components/AdBanner';

export function generateStaticParams() {
  return COLORING_SHEETS.map((sheet) => ({
    categoria: sheet.category,
    slug: sheet.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}): Promise<Metadata> {
  const { categoria, slug } = await params;
  const cat = getCategoryBySlug(categoria);
  const sheet = COLORING_SHEETS.find((s) => s.category === categoria && s.id === slug);
  if (!cat || !sheet) return {};

  const canonical = `https://colorear.atpdev.dev/dibujos/${cat.slug}/${sheet.id}`;
  return {
    title: `${sheet.title} para Colorear (PDF 300 DPI Gratis)`,
    description: `${sheet.description} Descarga gratis "${sheet.title}" en PDF Carta o A4 de 300 DPI, píntalo online o agrégalo a tu libro de Amazon KDP.`,
    keywords: [...sheet.tags, 'dibujos para colorear pdf', cat.name.toLowerCase(), 'imprimir 300 dpi'],
    alternates: { canonical },
    openGraph: {
      title: `${sheet.title} — Dibujo para Colorear Gratis en PDF 300 DPI`,
      description: sheet.description,
      url: canonical,
      images: [{ url: 'https://colorear.atpdev.dev/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function SingleSheetPage({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}) {
  const { categoria, slug } = await params;
  const cat = getCategoryBySlug(categoria);
  const sheet = COLORING_SHEETS.find((s) => s.category === categoria && s.id === slug);
  if (!cat || !sheet) notFound();

  const related = getSheetsByCategory(cat.slug)
    .filter((s) => s.id !== sheet.id)
    .concat(COLORING_SHEETS.filter((s) => s.category !== cat.slug).slice(0, 1))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: `${sheet.title} — Lámina para Colorear`,
        description: sheet.description,
        inLanguage: 'es',
        isAccessibleForFree: true,
        encodingFormat: 'application/pdf',
        url: `https://colorear.atpdev.dev/dibujos/${cat.slug}/${sheet.id}`,
        author: { '@type': 'Organization', name: 'ATP Dev' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://colorear.atpdev.dev/' },
          { '@type': 'ListItem', position: 2, name: 'Dibujos Gratis', item: 'https://colorear.atpdev.dev/dibujos' },
          { '@type': 'ListItem', position: 3, name: cat.name, item: `https://colorear.atpdev.dev/dibujos/${cat.slug}` },
          {
            '@type': 'ListItem',
            position: 4,
            name: sheet.title,
            item: `https://colorear.atpdev.dev/dibujos/${cat.slug}/${sheet.id}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SheetDetailClient sheet={sheet} category={cat} related={related} />
      <AdBanner />
    </div>
  );
}

