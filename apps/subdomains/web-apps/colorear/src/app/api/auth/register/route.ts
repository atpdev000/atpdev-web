import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signJwt } from '@/lib/server/crypto';
import { createUser, sanitizeUser } from '@/lib/server/store';
import { attachSessionCookie } from '@/lib/server/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || '').trim().slice(0, 80) || 'Creador KDP';
    const email = String(body.email || '').trim().toLowerCase().slice(0, 180);
    const password = String(body.password || '');

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Ingresa un correo electrónico válido.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(password);
    let user;
    try {
      user = createUser({ name, email, passwordHash: hash, salt });
    } catch (e: any) {
      if (e?.message === 'EMAIL_EXISTS') {
        return NextResponse.json(
          { error: 'Este correo ya está registrado. Inicia sesión para acceder a tus créditos.' },
          { status: 409 }
        );
      }
      throw e;
    }

    const token = signJwt(user.id, user.email, user.role);
    const res = NextResponse.json({
      message: 'Cuenta creada con 15 créditos de bienvenida.',
      user: sanitizeUser(user),
      token,
    });
    return attachSessionCookie(res, token);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error al registrar la cuenta.' },
      { status: 500 }
    );
  }
}

