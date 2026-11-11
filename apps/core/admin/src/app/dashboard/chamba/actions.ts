'use server';

import crypto from 'crypto';
import { 
  getJobPostings, 
  saveJobPosting, 
  toggleJobFeatured, 
  updateJobStatus, 
  deleteJobPosting,
  invalidateJobsCache,
  getSubdomainConfig,
  resolveRealServirAndEntityBases,
  JobPosting
} from '@atpdev/database';
import { scrapeLiveConvocatoriasFeed } from '@atpdev/database/src/scraper';
import { revalidatePath } from 'next/cache';

const CHAMBA_SITE_URL = process.env.NEXT_PUBLIC_CHAMBA_SITE_URL || 'https://empleos.atpdev.dev';
const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || 'atpdevchambaindexnow2026key';

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function notifyGoogleIndexingApi(
  targetUrl: string,
  notificationType: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<{ ok: boolean; message: string }> {
  try {
    const config = getSubdomainConfig('chamba');
    const clientEmail =
      config?.seo?.google_indexing_client_email?.trim() ||
      process.env.GOOGLE_INDEXING_CLIENT_EMAIL?.trim() ||
      '';
    const rawPrivateKey =
      config?.seo?.google_indexing_private_key?.trim() ||
      process.env.GOOGLE_INDEXING_PRIVATE_KEY?.trim() ||
      '';

    if (!clientEmail || !rawPrivateKey) {
      return {
        ok: false,
        message: 'Credenciales de Google Indexing API no configuradas aún (solo se notificó vía IndexNow).',
      };
    }

    const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
    const nowSec = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claimSet = base64UrlEncode(
      JSON.stringify({
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/indexing',
        aud: 'https://oauth2.googleapis.com/token',
        exp: nowSec + 3600,
        iat: nowSec,
      })
    );

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(`${header}.${claimSet}`);
    signer.end();
    const signature = base64UrlEncode(signer.sign(privateKey));
    const jwt = `${header}.${claimSet}.${signature}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errTxt = await tokenRes.text();
      return { ok: false, message: `Error OAuth2 Google Indexing API: ${errTxt.slice(0, 160)}` };
    }

    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) {
      return { ok: false, message: 'No se recibió access_token de Google OAuth2.' };
    }

    const publishRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenJson.access_token}`,
      },
      body: JSON.stringify({
        url: targetUrl,
        type: notificationType,
      }),
    });

    if (!publishRes.ok) {
      const errBody = await publishRes.text();
      return { ok: false, message: `Google Indexing API respondió ${publishRes.status}: ${errBody.slice(0, 180)}` };
    }

    return {
      ok: true,
      message: `Google for Jobs Indexing API (${notificationType}) notificado con éxito para: ${targetUrl}`,
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Error al conectar con Google Indexing API' };
  }
}

async function notifySearchEnginesJobPublished(
  slug?: string,
  notificationType: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
) {
  try {
    const jobUrl = slug ? `${CHAMBA_SITE_URL}/empleos/${slug}` : `${CHAMBA_SITE_URL}/empleos`;
    const urls = [
      `${CHAMBA_SITE_URL}/empleos`,
      `${CHAMBA_SITE_URL}/sitemap.xml`,
      ...(slug ? [jobUrl] : []),
    ];
    const host = new URL(CHAMBA_SITE_URL).hostname;
    await Promise.all([
      fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host,
          key: INDEXNOW_KEY,
          urlList: urls,
        }),
      }).catch(() => null),
      slug ? notifyGoogleIndexingApi(jobUrl, notificationType).catch(() => null) : Promise.resolve(null),
    ]);
  } catch {
    // Non-blocking SEO notification
  }
}

export async function pingGoogleIndexingManualAction(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<{ ok: boolean; message: string }> {
  const cleanUrl = url.trim().startsWith('http')
    ? url.trim()
    : `${CHAMBA_SITE_URL}${url.trim().startsWith('/') ? '' : '/'}${url.trim()}`;
  const gRes = await notifyGoogleIndexingApi(cleanUrl, type);
  const host = new URL(CHAMBA_SITE_URL).hostname;
  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      urlList: [cleanUrl],
    }),
  }).catch(() => null);

  if (gRes.ok) {
    return gRes;
  }
  return {
    ok: true,
    message: `IndexNow (Bing/Yandex) notificado para ${cleanUrl}. (${gRes.message})`,
  };
}

export async function fetchAdminJobsAction(): Promise<JobPosting[]> {
  try {
    invalidateJobsCache();
    return await getJobPostings();
  } catch (err) {
    console.error('Error fetching admin jobs:', err);
    return [];
  }
}

export async function saveJobAction(jobData: any): Promise<{ success: boolean; error?: string }> {
  try {
    if (jobData?.title && jobData?.entity_name && (!jobData?.bases_pdf_url || !jobData?.official_documents?.length)) {
      const realResolved = await resolveRealServirAndEntityBases({
        slug: jobData.slug || `${jobData.entity_name}-${jobData.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: jobData.title,
        entityName: jobData.entity_name,
        region: jobData.region,
        basesPdfUrl: jobData.bases_pdf_url,
        applyUrl: jobData.apply_url
      }).catch(() => null);

      if (realResolved) {
        if (!jobData.bases_pdf_url && realResolved.directBasesPdfUrl) {
          jobData.bases_pdf_url = realResolved.directBasesPdfUrl;
        }
        if (!jobData.apply_url && realResolved.primaryOfficialPageUrl) {
          jobData.apply_url = realResolved.primaryOfficialPageUrl;
        }
        if (realResolved.officialDocuments?.length) {
          jobData.official_documents = realResolved.officialDocuments;
        }
      }
    }

    const res = await saveJobPosting(jobData);
    if (res.success) {
      if (jobData?.status === 'Vigente') {
        void notifySearchEnginesJobPublished(res.job?.slug || jobData?.slug);
      }
      revalidatePath('/dashboard/chamba');
      return { success: true };
    }
    return { success: false, error: res.error };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar la convocatoria' };
  }
}

export async function resolveOfficialBasesAdminAction(input: {
  slug?: string;
  title: string;
  entityName: string;
  region?: string;
  salaryText?: string;
  vacanciesCount?: number;
  endDate?: string;
  existingBasesPdfUrl?: string;
  existingApplyUrl?: string;
}): Promise<{
  ok: boolean;
  basesPdfUrl?: string;
  applyUrl?: string;
  officialDocuments?: JobPosting['official_documents'];
  requirements?: string[];
  message: string;
}> {
  try {
    const resolved = await resolveRealServirAndEntityBases({
      slug: input.slug || `${input.entityName}-${input.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: input.title,
      entityName: input.entityName,
      region: input.region,
      basesPdfUrl: input.existingBasesPdfUrl,
      applyUrl: input.existingApplyUrl,
      forceRefresh: true
    });

    const sd = resolved.servirDetail;
    const reqs = sd
      ? [
          sd.formacionAcademica ? `Formación Académica: ${sd.formacionAcademica}` : '',
          sd.experiencia ? `Experiencia: ${sd.experiencia}` : '',
          sd.especializacion ? `Especialización: ${sd.especializacion}` : '',
          sd.conocimiento ? `Conocimientos: ${sd.conocimiento}` : ''
        ].filter(Boolean)
      : undefined;

    return {
      ok: true,
      basesPdfUrl: resolved.directBasesPdfUrl,
      applyUrl: resolved.primaryOfficialPageUrl,
      officialDocuments: resolved.officialDocuments,
      requirements: reqs && reqs.length > 0 ? reqs : undefined,
      message: `Scrapling verificó ${resolved.officialDocuments.length} documento(s)/página(s) oficial(es) 100% reales.`
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || 'Error al resolver bases oficiales con Scrapling'
    };
  }
}

export async function toggleJobFeaturedAction(id: string, featured: boolean): Promise<boolean> {
  try {
    const ok = await toggleJobFeatured(id, featured);
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function updateJobStatusAction(id: string, status: 'Vigente' | 'Finalizado' | 'Pendiente'): Promise<boolean> {
  try {
    const ok = await updateJobStatus(id, status, { entity_verified: status === 'Vigente' });
    if (ok && (status === 'Vigente' || status === 'Finalizado')) {
      const jobs = await getJobPostings().catch(() => []);
      const target = jobs.find((j) => j.id === id);
      void notifySearchEnginesJobPublished(
        target?.slug,
        status === 'Finalizado' ? 'URL_DELETED' : 'URL_UPDATED'
      );
    }
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function approveJobRequestAction(id: string, logoUrl?: string): Promise<boolean> {
  try {
    const ok = await updateJobStatus(id, 'Vigente', { 
      entity_verified: true,
      ...(logoUrl ? { entity_logo: logoUrl } : {})
    });
    if (ok) {
      const jobs = await getJobPostings().catch(() => []);
      const target = jobs.find((j) => j.id === id);
      void notifySearchEnginesJobPublished(target?.slug, 'URL_UPDATED');
    }
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function updateJobLogoAction(id: string, logoUrl: string): Promise<boolean> {
  try {
    const ok = await updateJobStatus(id, 'Pendiente', { entity_logo: logoUrl });
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function deleteJobAction(id: string): Promise<boolean> {
  try {
    const ok = await deleteJobPosting(id);
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function triggerLiveScraperAction(): Promise<{ count: number; error?: string }> {
  try {
    invalidateJobsCache();
    const { scrapeConvocatoriasDeTrabajo } = await import('@atpdev/database/src/scraper');
    const [liveJobs, cdJobs] = await Promise.all([
      scrapeLiveConvocatoriasFeed().catch(() => []),
      scrapeConvocatoriasDeTrabajo().catch(() => [])
    ]);
    const totalCount = (liveJobs?.length || 0) + (cdJobs?.length || 0);
    revalidatePath('/dashboard/chamba');
    return { count: totalCount };
  } catch (err: any) {
    return { count: 0, error: err?.message || 'Error al ejecutar scraper' };
  }
}

export async function fetchChambaConfigAction(): Promise<any> {
  const { getSubdomainConfig } = await import('@atpdev/database');
  return getSubdomainConfig('chamba');
}

export async function updateChambaConfigAction(updates: any): Promise<{ success: boolean; config: any }> {
  const { saveSubdomainConfig } = await import('@atpdev/database');
  const res = saveSubdomainConfig('chamba', updates);
  revalidatePath('/dashboard/chamba');
  return res;
}
