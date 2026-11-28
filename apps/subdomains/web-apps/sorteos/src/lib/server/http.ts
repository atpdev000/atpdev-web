/**
 * Helpers HTTP transversales: respuestas, auth, rate-limit, logging y auditoría.
 * (SAD §23 Seguridad + §24 Observabilidad)
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './crypto';
import { db, uid } from './store';

export function ok(data: unknown, init?: number | ResponseInit) {
  const status = typeof init === 'number' ? init : init?.status ?? 200;
  return NextResponse.json({ success: true, ...(data as Record<string, unknown>) }, { status });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ success: false, error: message, ...extra }, { status });
}

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

/** Extrae y verifica `Authorization: Bearer <jwt>`. Retorna null si falta/inválido. */
export function getAuth(req: NextRequest): AuthContext | null {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  const user = db.users.get(payload.sub);
  if (!user || user.status !== 'active') return null;
  return { userId: user.id, email: user.email, role: user.role };
}

/** Para endpoints demo: acepta `x-demo-user` o crea/usa usuario demo si no hay JWT. */
export function getAuthOrDemo(req: NextRequest): AuthContext {
  const auth = getAuth(req);
  if (auth) return auth;
  // Usuario demo estable por cabecera opcional (multi-tenant por fila: cada demo es un tenant)
  const demoKey = req.headers.get('x-demo-user') || 'demo-default';
  const email = `${demoKey}@demo.sorteos.local`;
  let id = db.usersByEmail.get(email);
  if (!id) {
    id = `usr_demo_${demoKey.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'default'}`;
    db.users.set({
      id: `usr_demo_${demoKey.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'default'}`,
      name: 'Creador Demo',
      email,
      passwordHash: 'demo',
      salt: 'demo',
      role: 'user',
      status: 'active',
      plan: 'free',
      language: 'es',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.usersByEmail.set(email, id);
  }
  return { userId: id, email, role: 'user' };
}

// --- Rate limiting en memoria (ventana deslizante simple) ---
const buckets = new Map<string, number[]>();
export function rateLimit(key: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    buckets.set(key, arr);
    return false;
  }
  arr.push(now);
  buckets.set(key, arr);
  return true;
}

export function clientKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}

// --- Logging estructurado JSON (Grafana Loki-ready) + auditoría ---
export function logEvent(event: string, fields: Record<string, unknown> = {}) {
  // JSON a stdout: el colector (Loki/Promtail) lo ingiere sin cambios.
  console.log(JSON.stringify({ ts: new Date().toISOString(), service: 'sorteos-pro', event, ...fields }));
}

export function audit(actorUserId: string, action: string, entity: string, entityId: string, meta?: Record<string, unknown>) {
  const entry = {
    id: uid('aud'),
    actorUserId,
    action,
    entity,
    entityId,
    meta,
    createdAt: new Date().toISOString(),
  };
  db.audit.push(entry);
  logEvent('audit', { actorUserId, action, entity, entityId });
  return entry;
}
