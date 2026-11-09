import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { hashPassword, signJwt } from '@/lib/server/crypto';
import { audit, clientKey, fail, logEvent, ok, rateLimit } from '@/lib/server/http';
import { cleanStr, isEmail, isStrongPassword } from '@/lib/server/validators';

/** POST /api/v1/auth/register — RF-001 */
export async function POST(req: NextRequest) {
  if (!rateLimit(`register:${clientKey(req)}`, 10, 60_000)) {
    return fail('Demasiados intentos. Espera un minuto.', 429);
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail('Cuerpo JSON inválido.', 400);
  }
  const name = cleanStr(body.name, 120) || 'Creador';
  const email = cleanStr(body.email, 254).toLowerCase();
  const password = String(body.password ?? '');
  const language = cleanStr(body.language, 8) || 'es';
  const requestedPlan = cleanStr(body.plan, 20).toLowerCase();
  const validPlan = (['free', 'pro', 'business', 'enterprise'].includes(requestedPlan) ? requestedPlan : 'free') as 'free' | 'pro' | 'business' | 'enterprise';

  if (!isEmail(email)) return fail('Email inválido.', 400);
  if (!isStrongPassword(password)) return fail('La contraseña debe tener al menos 8 caracteres.', 400);
  if (db.usersByEmail.has(email)) return fail('Este email ya está registrado.', 409);

  const { hash, salt } = hashPassword(password);
  const id = uid('usr');
  const now = new Date().toISOString();
  db.users.set({ id, name, email, passwordHash: hash, salt,
    role: 'user', status: 'active', plan: validPlan,
    language, createdAt: now, updatedAt: now,
  });
  db.usersByEmail.set(email, id);
  audit(id, 'user.register', 'user', id, { plan: validPlan });
  logEvent('auth.register', { userId: id, plan: validPlan });

  return ok({
    message: 'Usuario registrado exitosamente (RF-001).',
    user: { id, name, email, plan: validPlan, status: 'active' },
    token: signJwt(id, email, 'user'),
  });
}
