'use server';

import { saveJobPosting, resolveRealServirAndEntityBases } from '@atpdev/database';
import { revalidatePath } from 'next/cache';

export async function publishIngestaJobAction(formData: any): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    if (formData?.title && formData?.entity_name) {
      const realResolved = await resolveRealServirAndEntityBases({
        slug: formData.slug || `${formData.entity_name}-${formData.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: formData.title,
        entityName: formData.entity_name,
        region: formData.region,
        applyUrl: formData.apply_url,
        basesPdfUrl: formData.bases_pdf_url
      }).catch(() => null);

      if (realResolved) {
        if (!formData.bases_pdf_url && realResolved.directBasesPdfUrl) {
          formData.bases_pdf_url = realResolved.directBasesPdfUrl;
        }
        if ((!formData.apply_url || formData.apply_url === 'https://www.gob.pe/') && realResolved.primaryOfficialPageUrl) {
          formData.apply_url = realResolved.primaryOfficialPageUrl;
        }
        if (realResolved.officialDocuments?.length) {
          formData.official_documents = realResolved.officialDocuments;
        }
      }
    }

    const res = await saveJobPosting(formData);
    if (res.success && res.job) {
      revalidatePath('/empleos');
      revalidatePath(`/empleos/${res.job.slug}`);
      return { success: true, slug: res.job.slug };
    }
    return { success: false, error: res.error || 'No se pudo guardar la convocatoria' };
  } catch (err: any) {
    console.error('Error en publishIngestaJobAction:', err);
    return { success: false, error: err?.message || 'Error del servidor al publicar la convocatoria' };
  }
}
