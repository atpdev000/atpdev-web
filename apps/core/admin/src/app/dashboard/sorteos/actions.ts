'use server';

import { 
  getSorteosGiveaways,
  saveSorteosGiveaway,
  updateGiveawayStatus,
  redrawGiveaway,
  deleteGiveaway,
  getSorteosUsers,
  updateUserPlan,
  toggleUserStatus,
  resetUserComments,
  getSorteosFeatureFlags,
  updateFeatureFlag,
  getSorteosMetrics,
  getSubdomainConfig,
  saveSubdomainConfig,
  GiveawayRecord,
  SorteosUserRecord,
  FeatureFlagRecord,
  SorteosMetricsRecord,
  SubdomainConfig
} from '@atpdev/database';
import { revalidatePath } from 'next/cache';

export async function fetchSorteosGiveawaysAction(): Promise<GiveawayRecord[]> {
  try {
    return await getSorteosGiveaways();
  } catch (err) {
    console.error('Error fetching giveaways:', err);
    return [];
  }
}

export async function saveSorteosGiveawayAction(data: Partial<GiveawayRecord>): Promise<{ success: boolean; giveaway?: GiveawayRecord; error?: string }> {
  try {
    const res = await saveSorteosGiveaway(data);
    revalidatePath('/dashboard/sorteos');
    return res;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar sorteo' };
  }
}

export async function updateGiveawayStatusAction(id: string, status: GiveawayRecord['status']): Promise<boolean> {
  try {
    const ok = await updateGiveawayStatus(id, status);
    revalidatePath('/dashboard/sorteos');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function redrawGiveawayAction(id: string, reason: string): Promise<{ success: boolean; newWinner?: any; error?: string }> {
  try {
    const res = await redrawGiveaway(id, reason);
    revalidatePath('/dashboard/sorteos');
    return res;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al re-sortear' };
  }
}

export async function deleteGiveawayAction(id: string): Promise<boolean> {
  try {
    const ok = await deleteGiveaway(id);
    revalidatePath('/dashboard/sorteos');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function fetchSorteosUsersAction(): Promise<SorteosUserRecord[]> {
  try {
    return await getSorteosUsers();
  } catch (err) {
    return [];
  }
}

export async function updateUserPlanAction(userId: string, plan: SorteosUserRecord['plan']): Promise<boolean> {
  try {
    const ok = await updateUserPlan(userId, plan);
    revalidatePath('/dashboard/sorteos');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function toggleUserStatusAction(userId: string, status: 'active' | 'suspended'): Promise<boolean> {
  try {
    const ok = await toggleUserStatus(userId, status);
    revalidatePath('/dashboard/sorteos');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function resetUserCommentsAction(userId: string): Promise<boolean> {
  try {
    const ok = await resetUserComments(userId);
    revalidatePath('/dashboard/sorteos');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function fetchSorteosFeatureFlagsAction(): Promise<FeatureFlagRecord[]> {
  try {
    return await getSorteosFeatureFlags();
  } catch (err) {
    return [];
  }
}

export async function updateFeatureFlagAction(id: string, updates: Partial<FeatureFlagRecord>): Promise<boolean> {
  try {
    const ok = await updateFeatureFlag(id, updates);
    revalidatePath('/dashboard/sorteos');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function fetchSorteosMetricsAction(): Promise<SorteosMetricsRecord> {
  return await getSorteosMetrics();
}

export async function fetchSorteosConfigAction(): Promise<SubdomainConfig> {
  return getSubdomainConfig('sorteos');
}

export async function updateSorteosConfigAction(updates: Partial<SubdomainConfig>): Promise<{ success: boolean; config: SubdomainConfig }> {
  const res = saveSubdomainConfig('sorteos', updates);
  revalidatePath('/dashboard/sorteos');
  return res;
}

export async function syncSorteosPaymentsFromDescargadorAction(): Promise<{
  success: boolean;
  config: SubdomainConfig;
  error?: string;
}> {
  try {
    const descargador = getSubdomainConfig('descargador');
    const sorteos = getSubdomainConfig('sorteos');
    const dp = descargador.payments || {};
    const sp = sorteos.payments || {};

    const mergedLicenseKeys = Array.from(
      new Set([
        ...(Array.isArray(sp.license_keys) ? sp.license_keys : ['SORTEOS-PRO-VIP']),
        ...(Array.isArray(dp.license_keys) ? dp.license_keys.filter((k) => k === 'VIP-ATP-2026') : []),
      ])
    );

    const res = saveSubdomainConfig('sorteos', {
      contact: {
        ...sorteos.contact,
        whatsapp: dp.whatsapp_number || descargador.contact?.whatsapp || '+51987006572',
        email: dp.notification_email || descargador.contact?.email || 'contacto@atpdev.dev',
      },
      payments: {
        ...sp,
        enabled: true,
        provider: dp.provider || 'multi',
        stripe_pro_monthly_url: dp.stripe_pro_monthly_url || sp.stripe_pro_monthly_url || '',
        stripe_pro_annual_url: dp.stripe_pro_annual_url || sp.stripe_pro_annual_url || '',
        mercadopago_pro_monthly_url: dp.mercadopago_pro_monthly_url || sp.mercadopago_pro_monthly_url || 'https://mpago.la/1HfK5w8',
        mercadopago_pro_annual_url: dp.mercadopago_pro_annual_url || sp.mercadopago_pro_annual_url || 'https://mpago.la/2EJNTrd',
        whatsapp_number: dp.whatsapp_number || descargador.contact?.whatsapp || '+51987006572',
        notification_email: dp.notification_email || descargador.contact?.email || 'contacto@atpdev.dev',
        stripe_account_email: dp.stripe_account_email || sp.stripe_account_email || '',
        mercadopago_account_email: dp.mercadopago_account_email || sp.mercadopago_account_email || '',
        license_keys: mergedLicenseKeys,
      },
    });
    revalidatePath('/dashboard/sorteos');
    return res;
  } catch (err: unknown) {
    return {
      success: false,
      config: getSubdomainConfig('sorteos'),
      error: err instanceof Error ? err.message : 'Error al sincronizar pagos',
    };
  }
}
