import { NextRequest, NextResponse } from 'next/server';
import { signJwt, verifyPassword } from '@/lib/server/crypto';
import { findUserByEmail, sanitizeUser } from '@/lib/server/store';
import { attachSessionCookie } from '@/lib/server/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Completa correo y contraseña.' }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 });
    }

    const token = signJwt(user.id, user.email, user.role);
    const res = NextResponse.json({
      message: 'Sesión iniciada correctamente.',
      user: sanitizeUser(user),
      token,
    });
    return attachSessionCookie(res, token);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error al iniciar sesión.' },
      { status: 500 }
    );
  }
}

