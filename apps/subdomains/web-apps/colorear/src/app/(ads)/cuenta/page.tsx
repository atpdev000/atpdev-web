import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import CuentaClient from '@/components/CuentaClient';

export const metadata: Metadata = {
  title: 'Mi Cuenta y Créditos KDP — Colorear Pro',
  description:
    'Crea tu cuenta gratis con 15 créditos de bienvenida, consulta tu saldo de generaciones IA y gestiona tus pedidos de Stripe, Yape o Plin.',
  alternates: { canonical: 'https://colorear.atpdev.dev/cuenta' },
};

export default function CuentaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <Suspense fallback={<div className="py-12 text-center text-sm text-zinc-500">Cargando cuenta...</div>}>
        <CuentaClient />
      </Suspense>
    </div>
  );
}

