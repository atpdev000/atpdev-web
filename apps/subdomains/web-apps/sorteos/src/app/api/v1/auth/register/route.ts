import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { hashPassword, signJwt } from '@/lib/server/crypto';
import { audit, clientKey, fail, logEvent, ok, rateLimit } from '@/lib/server/http';
import { cleanStr, isEmail, isStrongPassword } from '@/lib/server/validators';

/** POST /api/v1/auth/register — RF-001 (siempre registra en plan 'free'; upgrades requieren pago o licencia válida) */
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

  if (!isEmail(email)) return fail('Email inválido.', 400);
  if (!isStrongPassword(password)) return fail('La contraseña debe tener al menos 8 caracteres.', 400);
  if (db.usersByEmail.has(email)) return fail('Este email ya está registrado.', 409);

  // Seguridad de cobros: toda cuenta nueva inicia en 'free' hasta pagar o canjear licencia verificada
  const initialPlan: 'free' = 'free';

  const { hash, salt } = hashPassword(password);
  const id = uid('usr');
  const now = new Date().toISOString();
  db.users.set({
    id,
    name,
    email,
    passwordHash: hash,
    salt,
    role: 'user',
    status: 'active',
    plan: initialPlan,
    language,
    createdAt: now,
    updatedAt: now,
  });
  db.usersByEmail.set(email, id);

  try {
    const { syncRealSorteosUser } = await import('@atpdev/database');
    await syncRealSorteosUser({ id, name, email, plan: initialPlan, status: 'active' });
  } catch {}

  audit(id, 'user.register', 'user', id, { plan: initialPlan, requestedPlan });
  logEvent('auth.register', { userId: id, plan: initialPlan });

  return ok({
    message: 'Usuario registrado exitosamente.',
    user: { id, name, email, plan: initialPlan, status: 'active' },
    requestedPlan: ['pro', 'business', 'enterprise'].includes(requestedPlan) ? requestedPlan : null,
    token: signJwt(id, email, 'user'),
  });
}
