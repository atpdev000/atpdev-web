import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

function getJwtSecret(): string {
  const secret =
    process.env.COLOREAR_JWT_SECRET ||
    process.env.SORTEOS_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET;
  if (secret && secret.length >= 12) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[colorear] Falta COLOREAR_JWT_SECRET en producción.');
  }
  return 'dev-only-colorear-jwt-secret-change-in-prod';
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || randomBytes(16).toString('hex');
  const hash = scryptSync(password, s, 64).toString('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const { hash } = hashPassword(password, salt);
    const a = Buffer.from(hash, 'hex');
    const b = Buffer.from(expectedHash, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(input: string): Buffer {
  const p = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(p + '='.repeat((4 - (p.length % 4)) % 4), 'base64');
}

export function signJwt(userId: string, email: string, role: 'user' | 'admin' = 'user', ttlHours = 168): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = { sub: userId, email, role, iat: now, exp: now + ttlHours * 3600 };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac('sha256', getJwtSecret()).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const [h, b, s] = token.split('.');
    if (!h || !b || !s) return null;
    const expected = b64url(createHmac('sha256', getJwtSecret()).update(`${h}.${b}`).digest());
    const a = Buffer.from(s);
    const c = Buffer.from(expected);
    if (a.length !== c.length || !timingSafeEqual(a, c)) return null;
    const payload = JSON.parse(unb64url(b).toString('utf8')) as JwtPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyStripeWebhookSignature(rawBody: string, sigHeader: string, webhookSecret: string): boolean {
  try {
    const m = sigHeader.match(/t=(\d+),.*v1=([a-f0-9]+)/);
    if (!m) return false;
    const [, ts, v1] = m;
    if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
    const expected = createHmac('sha256', webhookSecret).update(`${ts}.${rawBody}`).digest('hex');
    const a = Buffer.from(v1);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`;
}

export function generateOrderCode(): string {
  return `COL-${randomBytes(3).toString('hex').toUpperCase()}`;
}

