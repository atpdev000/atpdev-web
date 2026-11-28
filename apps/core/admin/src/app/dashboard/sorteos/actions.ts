'use server';

import fs from 'node:fs';
import path from 'node:path';
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
  syncRealSorteosUser,
  GiveawayRecord,
  SorteosUserRecord,
  FeatureFlagRecord,
  SorteosMetricsRecord,
  SubdomainConfig
} from '@atpdev/database';
import { revalidatePath } from 'next/cache';

export interface SorteosAdminOrder {
  id: string;
  orderCode: string;
  userId: string;
  userEmail: string;
  planId: 'pro' | 'business' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  amountUsd: number;
  amountPen: number;
  method: 'yape' | 'plin' | 'stripe';
  status: 'pending' | 'paid' | 'rejected';
  operationCode?: string;
  payerPhone?: string;
  notes?: string;
  createdAt: string;
  paidAt?: string;
}

function resolveSorteosDbPath(): string {
  if (process.env.SORTEOS_DATA_PATH) return process.env.SORTEOS_DATA_PATH;
  const vpsPath = '/opt/atpdev-web/data/sorteos-db.json';
  if (fs.existsSync(vpsPath) || fs.existsSync('/opt/atpdev-web/data')) return vpsPath;
  const cwd = process.cwd();
  const candidates = [
    path.resolve(/*turbopackIgnore: true*/ cwd, '../../subdomains/web-apps/sorteos/data/sorteos-db.json'),
    path.resolve(/*turbopackIgnore: true*/ cwd, '../../../apps/subdomains/web-apps/sorteos/data/sorteos-db.json'),
    path.resolve(/*turbopackIgnore: true*/ cwd, 'apps/subdomains/web-apps/sorteos/data/sorteos-db.json'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function readSorteosDiskDb(): { data: any; filePath: string } {
  const filePath = resolveSorteosDbPath();
  try {
    if (!fs.existsSync(filePath)) return { data: { users: [], orders: [] }, filePath };
    return { data: JSON.parse(fs.readFileSync(filePath, 'utf8')) || {}, filePath };
  } catch {
    return { data: { users: [], orders: [] }, filePath };
  }
}

function writeSorteosDiskDb(filePath: string, data: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.admin.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}

export async function fetchSorteosOrdersAction(): Promise<SorteosAdminOrder[]> {
  const { data } = readSorteosDiskDb();
  const list: SorteosAdminOrder[] = Array.isArray(data.orders) ? data.orders : [];
  return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function approveSorteosOrderAction(orderCode: string): Promise<{
  success: boolean;
  message: string;
  orders?: SorteosAdminOrder[];
}> {
  const clean = (orderCode || '').trim().toUpperCase();
  const { data, filePath } = readSorteosDiskDb();
  const orders: SorteosAdminOrder[] = Array.isArray(data.orders) ? data.orders : [];
  const order = orders.find((o) => o.orderCode.toUpperCase() === clean);
  if (!order) return { success: false, message: `Orden ${clean} no encontrada.` };
  if (order.status === 'paid') {
    return { success: true, message: `La orden ${clean} ya fue aprobada anteriormente.`, orders };
  }

  const now = new Date().toISOString();
  order.status = 'paid';
  order.paidAt = now;

  const users: any[] = Array.isArray(data.users) ? data.users : [];
  const user = users.find((u) => u.id === order.userId || (u.email || '').toLowerCase() === order.userEmail.toLowerCase());
  if (user) {
    user.plan = order.planId;
    user.updatedAt = now;
    try {
      await syncRealSorteosUser({
        id: user.id,
        name: user.name || order.userEmail,
        email: user.email || order.userEmail,
        plan: order.planId as any,
        status: user.status || 'active',
      });
    } catch {}
  }

  data.orders = orders;
  data.users = users;
  writeSorteosDiskDb(filePath, data);
  revalidatePath('/dashboard/sorteos');
  return {
    success: true,
    message: `Orden ${order.orderCode} aprobada — Plan ${order.planId.toUpperCase()} activo para ${order.userEmail}.`,
    orders: [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

export async function rejectSorteosOrderAction(orderCode: string): Promise<{
  success: boolean;
  message: string;
  orders?: SorteosAdminOrder[];
}> {
  const clean = (orderCode || '').trim().toUpperCase();
  const { data, filePath } = readSorteosDiskDb();
  const orders: SorteosAdminOrder[] = Array.isArray(data.orders) ? data.orders : [];
  const order = orders.find((o) => o.orderCode.toUpperCase() === clean);
  if (!order) return { success: false, message: `Orden ${clean} no encontrada.` };
  if (order.status === 'paid') return { success: false, message: 'No se puede rechazar una orden ya pagada.' };
  order.status = 'rejected';
  order.notes = 'Rechazada desde Panel Admin';
  data.orders = orders;
  writeSorteosDiskDb(filePath, data);
  revalidatePath('/dashboard/sorteos');
  return {
    success: true,
    message: `Orden ${order.orderCode} marcada como rechazada.`,
    orders: [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

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
