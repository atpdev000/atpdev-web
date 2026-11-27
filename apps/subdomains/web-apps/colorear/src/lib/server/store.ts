import fs from 'node:fs';
import path from 'node:path';
import { ColorearPlanId, WELCOME_FREE_CREDITS } from '../plans';
import { generateId, generateOrderCode } from './crypto';

export interface StoredUser {
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
  authProviders?: Array<'email' | 'google'>;
  providerIds?: {
    google?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StoredOrder {
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

export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

interface BillingDb {
  users: StoredUser[];
  orders: StoredOrder[];
  audit: AuditEntry[];
}

function resolveDataPath(): string {
  if (process.env.COLOREAR_DATA_PATH) {
    return process.env.COLOREAR_DATA_PATH;
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), '.data', 'colorear-billing.json');
}

function readDb(): BillingDb {
  const filePath = resolveDataPath();
  try {
    if (!fs.existsSync(filePath)) {
      return { users: [], orders: [], audit: [] };
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<BillingDb>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      audit: Array.isArray(parsed.audit) ? parsed.audit : [],
    };
  } catch {
    return { users: [], orders: [], audit: [] };
  }
}

function writeDb(db: BillingDb): void {
  const filePath = resolveDataPath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

export function sanitizeUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    credits: user.credits,
    totalGenerated: user.totalGenerated,
    avatarUrl: user.avatarUrl || null,
    authProviders: user.authProviders || ['email'],
    createdAt: user.createdAt,
  };
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const clean = email.trim().toLowerCase();
  return readDb().users.find((u) => u.email.toLowerCase() === clean);
}

export function findUserById(userId: string): StoredUser | undefined {
  return readDb().users.find((u) => u.id === userId);
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
}): StoredUser {
  const db = readDb();
  const email = input.email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('EMAIL_EXISTS');
  }
  const now = new Date().toISOString();
  const user: StoredUser = {
    id: generateId('usr'),
    name: input.name.trim().slice(0, 80) || 'Creador KDP',
    email,
    passwordHash: input.passwordHash,
    salt: input.salt,
    role: 'user',
    plan: 'free',
    credits: WELCOME_FREE_CREDITS,
    totalGenerated: 0,
    authProviders: ['email'],
    createdAt: now,
    updatedAt: now,
  };
  db.users.push(user);
  db.audit.push({
    id: generateId('aud'),
    userId: user.id,
    action: 'auth.register',
    meta: { welcomeCredits: WELCOME_FREE_CREDITS },
    createdAt: now,
  });
  writeDb(db);
  return user;
}

export function upsertGoogleOAuthUser(input: {
  googleUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  passwordHash: string;
  salt: string;
}): { user: StoredUser; isNew: boolean } {
  const db = readDb();
  const cleanEmail = input.email.trim().toLowerCase();
  const now = new Date().toISOString();

  let user = db.users.find(
    (u) =>
      u.providerIds?.google === input.googleUserId ||
      u.email.toLowerCase() === cleanEmail
  );

  if (user) {
    const providers = new Set<'email' | 'google'>(
      (user.authProviders || ['email']).filter((p): p is 'email' | 'google' => p === 'email' || p === 'google')
    );
    providers.add('google');
    user.authProviders = Array.from(providers);
    user.providerIds = {
      ...(user.providerIds || {}),
      google: input.googleUserId,
    };
    if (input.name && (!user.name || user.name === 'Creador KDP')) {
      user.name = input.name.trim().slice(0, 80);
    }
    if (input.avatarUrl) {
      user.avatarUrl = input.avatarUrl;
    }
    user.updatedAt = now;

    db.audit.push({
      id: generateId('aud'),
      userId: user.id,
      action: 'auth.oauth_login.google',
      createdAt: now,
    });
    writeDb(db);
    return { user, isNew: false };
  }

  user = {
    id: generateId('usr'),
    name: input.name.trim().slice(0, 80) || 'Usuario Google',
    email: cleanEmail,
    passwordHash: input.passwordHash,
    salt: input.salt,
    role: 'user',
    plan: 'free',
    credits: WELCOME_FREE_CREDITS,
    totalGenerated: 0,
    avatarUrl: input.avatarUrl,
    authProviders: ['google'],
    providerIds: {
      google: input.googleUserId,
    },
    createdAt: now,
    updatedAt: now,
  };
  db.users.push(user);
  db.audit.push({
    id: generateId('aud'),
    userId: user.id,
    action: 'auth.oauth_register.google',
    meta: { welcomeCredits: WELCOME_FREE_CREDITS },
    createdAt: now,
  });
  writeDb(db);
  return { user, isNew: true };
}

export function consumeUserCredit(userId: string, amount = 1): StoredUser | null {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user || user.credits < amount) return null;
  user.credits -= amount;
  user.totalGenerated += 1;
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return user;
}

export function recordFreeGeneration(userId: string): void {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;
  user.totalGenerated += 1;
  user.updatedAt = new Date().toISOString();
  writeDb(db);
}

export function createOrder(input: {
  userId: string;
  userEmail: string;
  planId: ColorearPlanId;
  billingCycle: 'one_time' | 'monthly' | 'annual';
  credits: number;
  amountUsd: number;
  amountPen: number;
  method: 'stripe' | 'yape' | 'plin';
  stripeSessionId?: string;
  operationCode?: string;
  payerPhone?: string;
  notes?: string;
}): StoredOrder {
  const db = readDb();
  const now = new Date().toISOString();
  const order: StoredOrder = {
    id: generateId('ord'),
    orderCode: generateOrderCode(),
    userId: input.userId,
    userEmail: input.userEmail,
    planId: input.planId,
    billingCycle: input.billingCycle,
    credits: input.credits,
    amountUsd: input.amountUsd,
    amountPen: input.amountPen,
    method: input.method,
    status: 'pending',
    stripeSessionId: input.stripeSessionId,
    operationCode: input.operationCode,
    payerPhone: input.payerPhone,
    notes: input.notes,
    createdAt: now,
  };
  db.orders.unshift(order);
  db.audit.push({
    id: generateId('aud'),
    userId: input.userId,
    action: `billing.order_created.${input.method}`,
    meta: { orderCode: order.orderCode, planId: input.planId, credits: input.credits },
    createdAt: now,
  });
  writeDb(db);
  return order;
}

export function listOrdersByUser(userId: string): StoredOrder[] {
  return readDb().orders.filter((o) => o.userId === userId).slice(0, 30);
}

export function listAllOrders(statusFilter?: 'pending' | 'paid' | 'rejected'): StoredOrder[] {
  const orders = readDb().orders;
  if (!statusFilter) return orders.slice(0, 100);
  return orders.filter((o) => o.status === statusFilter).slice(0, 100);
}

/**
 * Marca una orden como pagada de forma idempotente (nunca duplica créditos)
 * y suma los créditos + actualiza el plan del usuario.
 */
export function markOrderPaidByMatcher(
  matcher: { orderCode?: string; stripeSessionId?: string },
  fallbackCreate?: {
    userId: string;
    planId: ColorearPlanId;
    credits: number;
    amountUsd: number;
    amountPen: number;
    billingCycle: 'one_time' | 'monthly' | 'annual';
    stripeSessionId: string;
  }
): { order: StoredOrder; user: StoredUser; alreadyPaid: boolean } | null {
  const db = readDb();
  let order = db.orders.find(
    (o) =>
      (matcher.orderCode && o.orderCode.toUpperCase() === matcher.orderCode.toUpperCase()) ||
      (matcher.stripeSessionId && o.stripeSessionId === matcher.stripeSessionId)
  );

  if (!order && fallbackCreate) {
    const u = db.users.find((x) => x.id === fallbackCreate.userId);
    if (!u) return null;
    order = {
      id: generateId('ord'),
      orderCode: generateOrderCode(),
      userId: u.id,
      userEmail: u.email,
      planId: fallbackCreate.planId,
      billingCycle: fallbackCreate.billingCycle,
      credits: fallbackCreate.credits,
      amountUsd: fallbackCreate.amountUsd,
      amountPen: fallbackCreate.amountPen,
      method: 'stripe',
      status: 'pending',
      stripeSessionId: fallbackCreate.stripeSessionId,
      createdAt: new Date().toISOString(),
    };
    db.orders.unshift(order);
  }

  if (!order) return null;

  const user = db.users.find((u) => u.id === order!.userId);
  if (!user) return null;

  if (order.status === 'paid') {
    return { order, user, alreadyPaid: true };
  }

  const now = new Date().toISOString();
  order.status = 'paid';
  order.paidAt = now;
  user.credits += order.credits;
  if (order.planId === 'editorial' || user.plan === 'free') {
    user.plan = order.planId;
  }
  user.updatedAt = now;

  db.audit.push({
    id: generateId('aud'),
    userId: user.id,
    action: 'billing.order_paid',
    meta: { orderCode: order.orderCode, creditsAdded: order.credits, method: order.method },
    createdAt: now,
  });

  writeDb(db);
  return { order, user, alreadyPaid: false };
}

export function rejectOrderByCode(orderCode: string, reason?: string): StoredOrder | null {
  const db = readDb();
  const order = db.orders.find((o) => o.orderCode.toUpperCase() === orderCode.toUpperCase());
  if (!order || order.status === 'paid') return null;
  order.status = 'rejected';
  if (reason) order.notes = reason;
  writeDb(db);
  return order;
}

export function redeemLicenseForUser(input: {
  userId: string;
  licenseCode: string;
  planId: ColorearPlanId;
  credits: number;
}): { ok: true; user: StoredUser; order: StoredOrder } | { ok: false; error: string } {
  const db = readDb();
  const user = db.users.find((u) => u.id === input.userId);
  if (!user) return { ok: false, error: 'Usuario no encontrado.' };

  const clean = input.licenseCode.trim().toUpperCase();
  const alreadyUsed = db.orders.some(
    (o) => o.userId === user.id && o.operationCode?.toUpperCase() === `LIC:${clean}` && o.status === 'paid'
  );
  if (alreadyUsed) {
    return { ok: false, error: 'Ya canjeaste este código de licencia en tu cuenta.' };
  }

  const now = new Date().toISOString();
  const order: StoredOrder = {
    id: generateId('ord'),
    orderCode: generateOrderCode(),
    userId: user.id,
    userEmail: user.email,
    planId: input.planId,
    billingCycle: input.planId === 'editorial' ? 'monthly' : 'one_time',
    credits: input.credits,
    amountUsd: input.planId === 'editorial' ? 19 : 9,
    amountPen: input.planId === 'editorial' ? 59 : 29,
    method: 'yape',
    status: 'paid',
    operationCode: `LIC:${clean}`,
    notes: 'Activación por código de licencia',
    createdAt: now,
    paidAt: now,
  };
  db.orders.unshift(order);
  user.credits += input.credits;
  if (input.planId === 'editorial' || user.plan === 'free') {
    user.plan = input.planId;
  }
  user.updatedAt = now;
  db.audit.push({
    id: generateId('aud'),
    userId: user.id,
    action: 'billing.license_redeemed',
    meta: { orderCode: order.orderCode, credits: input.credits },
    createdAt: now,
  });
  writeDb(db);
  return { ok: true, user, order };
}

