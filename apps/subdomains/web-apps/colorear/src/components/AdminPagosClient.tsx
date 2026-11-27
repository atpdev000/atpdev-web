'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, Loader2, Lock } from 'lucide-react';
import InlineNotice from './InlineNotice';

interface AdminOrder {
  id: string;
  orderCode: string;
  userEmail: string;
  planId: string;
  credits: number;
  amountPen: number;
  amountUsd: number;
  method: string;
  status: 'pending' | 'paid' | 'rejected';
  operationCode?: string;
  payerPhone?: string;
  createdAt: string;
}

export default function AdminPagosClient() {
  const [secret, setSecret] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'paid' | 'all'>('pending');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionOrder, setActionOrder] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    tone: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const loadOrders = async (adminKey: string, nextFilter: 'pending' | 'paid' | 'all' = filter) => {
    setLoading(true);
    setNotice(null);
    try {
      const qs = nextFilter === 'all' ? '' : `?status=${nextFilter}`;
      const res = await fetch(`/api/billing/admin-approve${qs}`, {
        headers: { 'x-admin-secret': adminKey.trim() },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setUnlocked(false);
        setNotice({
          tone: 'error',
          title: 'Clave administrativa incorrecta',
          message: data.error || 'Verifica COLOREAR_ADMIN_SECRET en el servidor.',
        });
        return;
      }
      setUnlocked(true);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setNotice({
        tone: 'error',
        title: 'Error de red',
        message: 'No se pudo consultar el listado de órdenes.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderCode: string, action: 'approve' | 'reject') => {
    setActionOrder(orderCode);
    setNotice(null);
    try {
      const res = await fetch('/api/billing/admin-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret.trim(),
        },
        body: JSON.stringify({ orderCode, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          tone: 'error',
          title: `No se pudo procesar ${orderCode}`,
          message: data.error || 'Intenta nuevamente.',
        });
        return;
      }

      setNotice({
        tone: 'success',
        title:
          action === 'approve'
            ? `Orden ${orderCode} acreditada`
            : `Orden ${orderCode} rechazada`,
        message:
          action === 'approve'
            ? `Nuevo saldo de ${data.user?.email || 'usuario'}: ${data.user?.credits ?? '?'} créditos.`
            : 'La orden quedó marcada como rechazada.',
      });
      await loadOrders(secret, filter);
    } finally {
      setActionOrder(null);
    }
  };

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-yellow-300 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
            Panel de Aprobación Yape / Plin
          </h1>
          <p className="text-xs text-zinc-500 dark:text-slate-400">
            Ingresa tu clave privada <code>COLOREAR_ADMIN_SECRET</code> para aprobar pagos y acreditar
            créditos en 1 clic.
          </p>
        </div>

        {notice && (
          <InlineNotice
            tone={notice.tone}
            title={notice.title}
            message={notice.message}
            onClose={() => setNotice(null)}
          />
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadOrders(secret, filter);
          }}
          className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
              Clave Admin
            </label>
            <input
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl text-sm font-bold btn-studio-primary flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Entrar al panel</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
            Órdenes de Créditos — Colorear Pro
          </h1>
          <p className="text-xs text-zinc-500 dark:text-slate-400">
            Verifica comprobantes Yape/Plin y acredita créditos al instante.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['pending', 'paid', 'all'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setFilter(tab);
                loadOrders(secret, tab);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                filter === tab
                  ? 'bg-zinc-900 dark:bg-blue-600 text-white border-zinc-900'
                  : 'border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-300'
              }`}
            >
              {tab === 'pending' ? 'Pendientes' : tab === 'paid' ? 'Acreditadas' : 'Todas'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => loadOrders(secret, filter)}
            aria-label="Actualizar"
            className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {notice && (
        <InlineNotice
          tone={notice.tone}
          title={notice.title}
          message={notice.message}
          onClose={() => setNotice(null)}
        />
      )}

      {orders.length === 0 ? (
        <div className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-10 text-center text-sm text-zinc-500">
          No hay órdenes en esta vista.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="sheet-card rounded-2xl bg-white dark:bg-slate-900 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
                    {ord.orderCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold uppercase">
                    {ord.method}
                  </span>
                  <span className="font-bold text-emerald-600">+{ord.credits} créditos</span>
                  <span className="font-bold text-zinc-700 dark:text-slate-300">
                    S/ {ord.amountPen} (${ord.amountUsd})
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-slate-400">
                  Usuario: <strong>{ord.userEmail}</strong>
                  {ord.operationCode ? ` • N° Operación: ${ord.operationCode}` : ''}
                  {ord.payerPhone ? ` • Tel: ${ord.payerPhone}` : ''}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {new Date(ord.createdAt).toLocaleString('es-PE')}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ord.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      disabled={actionOrder === ord.orderCode}
                      onClick={() => handleOrderAction(ord.orderCode, 'approve')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {actionOrder === ord.orderCode ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Aprobar y acreditar</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionOrder === ord.orderCode}
                      onClick={() => handleOrderAction(ord.orderCode, 'reject')}
                      className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rechazar</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ord.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {ord.status === 'paid' ? 'Acreditada' : 'Rechazada'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

