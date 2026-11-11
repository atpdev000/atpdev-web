import { NextResponse } from 'next/server';
import { getJobPostings } from '@atpdev/database';
import { SITE_URL } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 minutes

function escapeXml(unsafe?: string | null): string {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const jobs = await getJobPostings();
  const baseUrl = SITE_URL;
  const todayIso = new Date().toISOString().split('T')[0];

  const activeJobs = jobs.filter((job) => {
    if (job.status !== 'Vigente') return false;
    if (job.end_date && job.end_date.trim() < todayIso) return false;
    return true;
  });

  const itemsXml = activeJobs
    .slice(0, 100)
    .map((job) => {
      const pubDate = new Date(job.created_at || Date.now()).toUTCString();
      return `
    <item>
      <title>${escapeXml(job.title)} — ${escapeXml(job.entity_name)}</title>
      <link>${baseUrl}/empleos/${job.slug}</link>
      <guid isPermaLink="true">${baseUrl}/empleos/${job.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(job.description)}</description>
      <category>${escapeXml(job.sector_type)}</category>
      <author>contacto@atpdev.dev (chamba pro)</author>
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>chamba pro — Convocatorias y Empleos Oficiales Perú 2026</title>
    <link>${baseUrl}</link>
    <description>Feed RSS oficial de convocatorias CAS 1057, D.L. 728, 276 y Sector Privado en Perú.</description>
    <language>es-PE</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate',
    },
  });
}
