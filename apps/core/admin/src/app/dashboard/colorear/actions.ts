'use server';

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { revalidatePath } from 'next/cache';
import {
  getSubdomainConfig,
  saveSubdomainConfig,
  SubdomainConfig,
} from '@atpdev/database';

export type ColorearPlanId = 'free' | 'pack_kdp' | 'editorial';

export interface ColorearAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: ColorearPlanId;
  credits: number;
  totalGenerated: number;
  avatarUrl: string | null;
  authProviders: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ColorearAdminOrder {
  id: string;
  orderCode: string;
  userId: string;
  userEmail: string;
  planId: ColorearPlanId;
  billingCycle: 'one_time' | 'monthly' | 'annual';
  credits: number;
  amountUsd: number;
  amountPen: number;
  method: 'stripe' | 'yape' | 'plin';
  status: 'pending' | 'paid' | 'rejected';
  stripeSessionId?: string;
  operationCode?: string;
  payerPhone?: string;
  notes?: string;
  createdAt: string;
  paidAt?: string;
}

interface StoredUserRaw {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'admin';
  plan: ColorearPlanId;
  credits: number;
  totalGenerated: number;
  avatarUrl?: string;
  authProviders?: string[];
  providerIds?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface AuditEntryRaw {
  id: string;
  userId: string;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

interface BillingDbRaw {
  users: StoredUserRaw[];
  orders: ColorearAdminOrder[];
  audit: AuditEntryRaw[];
}

export interface ColorearBillingSnapshot {
  users: ColorearAdminUser[];
  orders: ColorearAdminOrder[];
  stats: {
    totalUsers: number;
    paidUsers: number;
    totalCreditsInCirculation: number;
    totalGenerated: number;
    pendingOrders: number;
    paidOrders: number;
    revenueUsd: number;
    revenuePen: number;
  };
  dataFileFound: boolean;
}

function resolveBillingDataPath(): string {
  if (process.env.COLOREAR_DATA_PATH) {
    return process.env.COLOREAR_DATA_PATH;
  }

  const vpsPath = '/opt/atpdev-web/data/colorear-billing.json';
  if (fs.existsSync(vpsPath) || fs.existsSync('/opt/atpdev-web/data')) {
    return vpsPath;
  }

  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, '../../subdomains/web-apps/colorear/.data/colorear-billing.json'),
    path.resolve(cwd, '../../../apps/subdomains/web-apps/colorear/.data/colorear-billing.json'),
    path.resolve(cwd, 'apps/subdomains/web-apps/colorear/.data/colorear-billing.json'),
    path.resolve(cwd, '../../../data/colorear-billing.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

function readBillingDb(): { db: BillingDbRaw; fileFound: boolean; filePath: string } {
  const filePath = resolveBillingDataPath();
  try {
    if (!fs.existsSync(filePath)) {
      return {
        db: { users: [], orders: [], audit: [] },
        fileFound: false,
        filePath,
      };
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<BillingDbRaw>;
    return {
      db: {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        audit: Array.isArray(parsed.audit) ? parsed.audit : [],
      },
      fileFound: true,
      filePath,
    };
  } catch {
    return {
      db: { users: [], orders: [], audit: [] },
      fileFound: false,
      filePath,
    };
  }
}

function writeBillingDb(filePath: string, db: BillingDbRaw): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = `${filePath}.admin.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

function buildSnapshot(db: BillingDbRaw, fileFound: boolean): ColorearBillingSnapshot {
  const users: ColorearAdminUser[] = db.users
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'user',
      plan: u.plan || 'free',
      credits: typeof u.credits === 'number' ? u.credits : 0,
      totalGenerated: typeof u.totalGenerated === 'number' ? u.totalGenerated : 0,
      avatarUrl: u.avatarUrl || null,
      authProviders: Array.isArray(u.authProviders) && u.authProviders.length > 0 ? u.authProviders : ['email'],
      createdAt: u.createdAt,
      updatedAt: u.updatedAt || u.createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const orders = [...db.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  return {
    users,
    orders: orders.slice(0, 150),
    stats: {
      totalUsers: users.length,
      paidUsers: users.filter((u) => u.plan !== 'free').length,
      totalCreditsInCirculation: users.reduce((sum, u) => sum + u.credits, 0),
      totalGenerated: users.reduce((sum, u) => sum + u.totalGenerated, 0),
      pendingOrders: pendingOrders.length,
      paidOrders: paidOrders.length,
      revenueUsd: paidOrders.reduce((sum, o) => sum + (Number(o.amountUsd) || 0), 0),
      revenuePen: paidOrders.reduce((sum, o) => sum + (Number(o.amountPen) || 0), 0),
    },
    dataFileFound: fileFound,
  };
}

export async function fetchColorearConfigAction(): Promise<SubdomainConfig> {
  return getSubdomainConfig('colorear');
}

export async function updateColorearConfigAction(
  updates: Partial<SubdomainConfig>
): Promise<{ success: boolean; config: SubdomainConfig }> {
  try {
    const res = saveSubdomainConfig('colorear', updates);
    revalidatePath('/dashboard/colorear');
    return res;
  } catch {
    return { success: false, config: getSubdomainConfig('colorear') };
  }
}

export async function syncColorearPaymentsFromDescargadorAction(): Promise<{
  success: boolean;
  config: SubdomainConfig;
  error?: string;
}> {
  try {
    const descargador = getSubdomainConfig('descargador');
    const colorear = getSubdomainConfig('colorear');
    const dp = descargador.payments || {};
    const cp = colorear.payments || {};

    const mergedLicenseKeys = Array.from(
      new Set([
        ...(Array.isArray(cp.license_keys) ? cp.license_keys : ['COLOREAR-KDP-120', 'COLOREAR-EDITORIAL-400']),
        ...(Array.isArray(dp.license_keys) ? dp.license_keys.filter((k) => k === 'VIP-ATP-2026') : []),
      ])
    );

    const res = saveSubdomainConfig('colorear', {
      contact: {
        ...colorear.contact,
        whatsapp: dp.whatsapp_number || descargador.contact?.whatsapp || '+51987006572',
        email: dp.notification_email || descargador.contact?.email || 'contacto@atpdev.dev',
      },
      payments: {
        ...cp,
        enabled: true,
        provider: dp.provider || 'multi',
        stripe_pro_monthly_url: dp.stripe_pro_monthly_url || cp.stripe_pro_monthly_url || '',
        stripe_pro_annual_url: dp.stripe_pro_annual_url || cp.stripe_pro_annual_url || '',
        mercadopago_pro_monthly_url: dp.mercadopago_pro_monthly_url || cp.mercadopago_pro_monthly_url || 'https://mpago.la/1HfK5w8',
        mercadopago_pro_annual_url: dp.mercadopago_pro_annual_url || cp.mercadopago_pro_annual_url || 'https://mpago.la/2EJNTrd',
        whatsapp_number: dp.whatsapp_number || descargador.contact?.whatsapp || '+51987006572',
        notification_email: dp.notification_email || descargador.contact?.email || 'contacto@atpdev.dev',
        stripe_account_email: dp.stripe_account_email || cp.stripe_account_email || '',
        mercadopago_account_email: dp.mercadopago_account_email || cp.mercadopago_account_email || '',
        license_keys: mergedLicenseKeys,
      },
    });

    revalidatePath('/dashboard/colorear');
    return res;
  } catch (err: unknown) {
    return {
      success: false,
      config: getSubdomainConfig('colorear'),
      error: err instanceof Error ? err.message : 'Error al sincronizar pagos',
    };
  }
}

export async function fetchColorearBillingDataAction(): Promise<ColorearBillingSnapshot> {
  const { db, fileFound } = readBillingDb();
  return buildSnapshot(db, fileFound);
}

export async function approveColorearOrderAction(orderCode: string): Promise<{
  success: boolean;
  message: string;
  snapshot?: ColorearBillingSnapshot;
}> {
  const cleanCode = (orderCode || '').trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, message: 'Código de orden inválido.' };
  }

  const { db, fileFound, filePath } = readBillingDb();
  const order = db.orders.find((o) => o.orderCode.toUpperCase() === cleanCode);
  if (!order) {
    return { success: false, message: `No se encontró la orden ${cleanCode}.` };
  }
  if (order.status === 'paid') {
    return {
      success: true,
      message: `La orden ${cleanCode} ya había sido acreditada anteriormente.`,
      snapshot: buildSnapshot(db, fileFound),
    };
  }

  const user = db.users.find((u) => u.id === order.userId);
  if (!user) {
    return { success: false, message: 'No se encontró el usuario dueño de esta orden.' };
  }

  const now = new Date().toISOString();
  order.status = 'paid';
  order.paidAt = now;
  user.credits += Number(order.credits) || 0;
  if (order.planId === 'editorial' || user.plan === 'free') {
    user.plan = order.planId;
  }
  user.updatedAt = now;

  db.audit.push({
    id: `aud_${crypto.randomBytes(6).toString('hex')}`,
    userId: user.id,
    action: 'admin.order_approved',
    meta: { orderCode: order.orderCode, creditsAdded: order.credits, source: 'admin.atpdev.dev' },
    createdAt: now,
  });

  writeBillingDb(filePath, db);
  revalidatePath('/dashboard/colorear');

  return {
    success: true,
    message: `Orden ${order.orderCode} aprobada (+${order.credits} créditos a ${user.email}).`,
    snapshot: buildSnapshot(db, true),
  };
}

export async function rejectColorearOrderAction(
  orderCode: string,
  reason = 'Rechazada desde Panel Admin'
): Promise<{
  success: boolean;
  message: string;
  snapshot?: ColorearBillingSnapshot;
}> {
  const cleanCode = (orderCode || '').trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, message: 'Código de orden inválido.' };
  }

  const { db, filePath } = readBillingDb();
  const order = db.orders.find((o) => o.orderCode.toUpperCase() === cleanCode);
  if (!order) {
    return { success: false, message: `No se encontró la orden ${cleanCode}.` };
  }
  if (order.status === 'paid') {
    return { success: false, message: 'No se puede rechazar una orden que ya fue pagada.' };
  }

  const now = new Date().toISOString();
  order.status = 'rejected';
  order.notes = reason;

  db.audit.push({
    id: `aud_${crypto.randomBytes(6).toString('hex')}`,
    userId: order.userId,
    action: 'admin.order_rejected',
    meta: { orderCode: order.orderCode, reason, source: 'admin.atpdev.dev' },
    createdAt: now,
  });

  writeBillingDb(filePath, db);
  revalidatePath('/dashboard/colorear');

  return {
    success: true,
    message: `Orden ${order.orderCode} marcada como rechazada.`,
    snapshot: buildSnapshot(db, true),
  };
}

export async function adjustColorearUserCreditsAction(
  userId: string,
  delta: number,
  newPlan?: ColorearPlanId
): Promise<{
  success: boolean;
  message: string;
  snapshot?: ColorearBillingSnapshot;
}> {
  if (!userId || !Number.isFinite(delta)) {
    return { success: false, message: 'Parámetros inválidos.' };
  }

  const { db, filePath } = readBillingDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, message: 'Usuario no encontrado.' };
  }

  const now = new Date().toISOString();
  user.credits = Math.max(0, (Number(user.credits) || 0) + Math.trunc(delta));
  if (newPlan) {
    user.plan = newPlan;
  }
  user.updatedAt = now;

  db.audit.push({
    id: `aud_${crypto.randomBytes(6).toString('hex')}`,
    userId: user.id,
    action: 'admin.credits_adjusted',
    meta: { delta: Math.trunc(delta), newCredits: user.credits, newPlan: user.plan, source: 'admin.atpdev.dev' },
    createdAt: now,
  });

  writeBillingDb(filePath, db);
  revalidatePath('/dashboard/colorear');

  return {
    success: true,
    message: `Saldo de ${user.email} actualizado a ${user.credits} créditos (${user.plan.toUpperCase()}).`,
    snapshot: buildSnapshot(db, true),
  };
}

