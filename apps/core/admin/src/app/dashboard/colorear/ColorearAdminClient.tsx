'use client';

import { useMemo, useState } from 'react';
import { SubdomainConfig } from '@atpdev/database';
import {
  Palette,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Users,
  Sparkles,
  CreditCard,
  QrCode,
  Phone,
  Mail,
  Key,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  Settings2,
  Globe,
  Coins,
  Clock,
  ShieldCheck,
  Link2,
} from 'lucide-react';
import {
  ColorearBillingSnapshot,
  ColorearPlanId,
  approveColorearOrderAction,
  rejectColorearOrderAction,
  adjustColorearUserCreditsAction,
  fetchColorearBillingDataAction,
  updateColorearConfigAction,
  syncColorearPaymentsFromDescargadorAction,
} from './actions';

interface ColorearAdminClientProps {
  initialConfig: SubdomainConfig;
  initialBilling: ColorearBillingSnapshot;
}

export default function ColorearAdminClient({
  initialConfig,
  initialBilling,
}: ColorearAdminClientProps) {
  const [config, setConfig] = useState<SubdomainConfig>(initialConfig);
  const [billing, setBilling] = useState<ColorearBillingSnapshot>(initialBilling);
  const [activeTab, setActiveTab] = useState<'billing' | 'payments' | 'settings'>('billing');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncingPayments, setIsSyncingPayments] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'paid' | 'rejected'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // License key draft
  const [newLicenseKey, setNewLicenseKey] = useState('');

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  const payments = config.payments || {};
  const isStripeTestMode =
    (payments.stripe_pro_monthly_url || '').includes('/test_') ||
    (payments.stripe_pro_annual_url || '').includes('/test_');

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return billing.orders.filter((o) => {
      const matchStatus = orderFilter === 'all' || o.status === orderFilter;
      const matchSearch =
        !q ||
        o.orderCode.toLowerCase().includes(q) ||
        o.userEmail.toLowerCase().includes(q) ||
        (o.operationCode || '').toLowerCase().includes(q) ||
        (o.payerPhone || '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [billing.orders, orderFilter, orderSearch]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return billing.users.filter((u) => {
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.plan.toLowerCase().includes(q)
      );
    });
  }, [billing.users, userSearch]);

  const handleRefreshBilling = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await fetchColorearBillingDataAction();
      setBilling(fresh);
      notify('Datos de usuarios y órdenes sincronizados en vivo.');
    } catch {
      notify('No se pudo refrescar los datos en vivo.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleApproveOrder = async (orderCode: string) => {
    setBusyKey(`approve:${orderCode}`);
    try {
      const res = await approveColorearOrderAction(orderCode);
      if (res.snapshot) setBilling(res.snapshot);
      notify(res.message, res.success ? 'success' : 'error');
    } finally {
      setBusyKey(null);
    }
  };

  const handleRejectOrder = async (orderCode: string) => {
    setBusyKey(`reject:${orderCode}`);
    try {
      const res = await rejectColorearOrderAction(orderCode);
      if (res.snapshot) setBilling(res.snapshot);
      notify(res.message, res.success ? 'success' : 'error');
    } finally {
      setBusyKey(null);
    }
  };

  const handleAdjustCredits = async (userId: string, delta: number, newPlan?: ColorearPlanId) => {
    setBusyKey(`credit:${userId}:${delta}`);
    try {
      const res = await adjustColorearUserCreditsAction(userId, delta, newPlan);
      if (res.snapshot) setBilling(res.snapshot);
      notify(res.message, res.success ? 'success' : 'error');
    } finally {
      setBusyKey(null);
    }
  };

  const handleSavePayments = async () => {
    setIsSaving(true);
    try {
      const res = await updateColorearConfigAction({
        payments: config.payments,
        contact: {
          ...config.contact,
          whatsapp: config.payments?.whatsapp_number || config.contact?.whatsapp || '+51987006572',
          email: config.payments?.notification_email || config.contact?.email || 'contacto@atpdev.dev',
        },
      });
      if (res.success) {
        setConfig(res.config);
        notify('Pasarelas de pago, WhatsApp y licencias de Colorear Pro guardadas en vivo.');
      } else {
        notify('Error al guardar la configuración de pagos.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncFromDescargador = async () => {
    setIsSyncingPayments(true);
    try {
      const res = await syncColorearPaymentsFromDescargadorAction();
      if (res.success) {
        setConfig(res.config);
        notify('Pasarelas sincronizadas desde Descargador Pro (Stripe, MercadoPago y WhatsApp).');
      } else {
        notify(res.error || 'No se pudo sincronizar desde Descargador Pro.', 'error');
      }
    } finally {
      setIsSyncingPayments(false);
    }
  };

  const handleAddLicenseKey = () => {
    const clean = newLicenseKey.trim().toUpperCase();
    if (!clean) return;
    const existing = config.payments?.license_keys || [];
    if (existing.includes(clean)) {
      notify('Esa clave de licencia ya existe.', 'error');
      return;
    }
    setConfig({
      ...config,
      payments: {
        ...(config.payments || {}),
        license_keys: [...existing, clean],
      },
    });
    setNewLicenseKey('');
  };

  const handleRemoveLicenseKey = (keyToRemove: string) => {
    const existing = config.payments?.license_keys || [];
    setConfig({
      ...config,
      payments: {
        ...(config.payments || {}),
        license_keys: existing.filter((k) => k !== keyToRemove),
      },
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await updateColorearConfigAction({
        branding: config.branding,
        seo: config.seo,
        monetization: config.monetization,
        contact: config.contact,
      });
      if (res.success) {
        setConfig(res.config);
        notify('Branding, SEO y monetización de Colorear Pro actualizados.');
      } else {
        notify('Error al guardar configuración.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950 border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-400" />
          ) : (
            <AlertTriangle size={16} className="text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-indigo-950/30 to-slate-900 border border-pink-500/30 shadow-2xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 text-xs font-mono font-bold border border-pink-500/30">
            <Palette size={13} />
            <span>COLOREAR PRO CMS — COLOREAR.ATPDEV.DEV • PUERTO 3010</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Colorear Pro & Estudio Amazon KDP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Aprobación en 1 clic de pagos Yape/Plin, control de créditos IA, usuarios Google/Email, pasarelas Stripe & MercadoPago y SEO bilingüe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="https://colorear.atpdev.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-white/10 transition"
          >
            <ExternalLink size={14} />
            <span>Abrir Sitio</span>
          </a>
          <a
            href="https://colorear.atpdev.dev/planes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition shadow-lg shadow-pink-500/20"
          >
            <CreditCard size={14} />
            <span>Ver Planes</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-pink-500/15 text-pink-300 border border-pink-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins size={15} />
            <span>Órdenes & Créditos</span>
            {billing.stats.pendingOrders > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {billing.stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard size={15} />
            <span>Pagos, Pasarelas & Licencias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings2 size={15} />
            <span>Branding, SEO & Accesos</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleRefreshBilling}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-pink-400' : ''} />
          <span>{isRefreshing ? 'Actualizando...' : 'Refrescar Vivo'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ÓRDENES & CRÉDITOS EN VIVO */}
      {/* ========================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase">Usuarios Registrados</span>
                <Users size={15} className="text-pink-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">{billing.stats.totalUsers}</p>
              <p className="text-xs text-slate-400 mt-1">
                {billing.stats.paidUsers} con plan KDP / Editorial
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase">Órdenes Pendientes</span>
                <Clock size={15} className="text-amber-400" />
              </div>
              <p className="text-3xl font-black text-amber-300 mt-2">{billing.stats.pendingOrders}</p>
              <p className="text-xs text-slate-400 mt-1">
                {billing.stats.paidOrders} órdenes aprobadas
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase">Ingresos Aprobados</span>
                <CreditCard size={15} className="text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-300 mt-2">
                ${billing.stats.revenueUsd.toFixed(0)} USD
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Ref. S/ {billing.stats.revenuePen.toFixed(0)} PEN
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase">Créditos / Generaciones</span>
                <Sparkles size={15} className="text-indigo-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">
                {billing.stats.totalCreditsInCirculation}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {billing.stats.totalGenerated} láminas IA generadas
              </p>
            </div>
          </div>

          {/* Orders Section */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <QrCode size={16} className="text-amber-400" />
                  <span>Órdenes de Compra (Yape / Plin / Stripe / Licencias)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Aprueba pagos reportados por Yape/Plin en 1 clic: acredita automáticamente los créditos y actualiza el plan del usuario.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar orden, correo u operación..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                  />
                </div>
                {(['all', 'pending', 'paid', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      orderFilter === status
                        ? 'bg-pink-500/15 border-pink-500/40 text-pink-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {status === 'all'
                      ? 'Todas'
                      : status === 'pending'
                      ? 'Pendientes'
                      : status === 'paid'
                      ? 'Pagadas'
                      : 'Rechazadas'}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-800 rounded-xl">
                <p className="text-sm font-semibold text-slate-400">No hay órdenes en esta vista todavía.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Cuando un usuario reporte un pago por Yape/Plin o canjee una licencia en colorear.atpdev.dev/planes, aparecerá aquí al instante.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Usuario</th>
                      <th className="py-2.5 px-3">Plan / Créditos</th>
                      <th className="py-2.5 px-3">Método / Operación</th>
                      <th className="py-2.5 px-3">Monto</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-mono font-bold text-white">{order.orderCode}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-200">{order.userEmail}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(order.createdAt).toLocaleString('es-PE')}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold uppercase text-[10px]">
                            {order.planId}
                          </span>
                          <span className="ml-2 font-bold text-emerald-300">+{order.credits} cr.</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="uppercase font-bold text-slate-300">{order.method}</div>
                          {order.operationCode && (
                            <div className="font-mono text-[10px] text-cyan-300">Op: {order.operationCode}</div>
                          )}
                          {order.payerPhone && (
                            <div className="font-mono text-[10px] text-slate-400">Tel: {order.payerPhone}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-200">
                          ${order.amountUsd} / S/{order.amountPen}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              order.status === 'paid'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : order.status === 'pending'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {order.status === 'paid'
                              ? 'PAGADA'
                              : order.status === 'pending'
                              ? 'PENDIENTE'
                              : 'RECHAZADA'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {order.status === 'pending' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() => handleApproveOrder(order.orderCode)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                              >
                                <Check size={12} />
                                <span>Aprobar</span>
                              </button>
                              <button
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() => handleRejectOrder(order.orderCode)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                              >
                                <X size={12} />
                                <span>Rechazar</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">
                              {order.paidAt ? new Date(order.paidAt).toLocaleDateString('es-PE') : '—'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Users size={16} className="text-pink-400" />
                  <span>Usuarios & Gestión Rápida de Créditos ({billing.users.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Cuentas registradas con Google OAuth o Correo. Acredita bonos o activa planes KDP/Editorial directamente.
                </p>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar usuario por nombre o email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 w-64"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl">
                <p className="text-sm text-slate-400">No se encontraron usuarios registrados todavía.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Usuario</th>
                      <th className="py-2.5 px-3">Acceso</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3">Créditos</th>
                      <th className="py-2.5 px-3">Generadas</th>
                      <th className="py-2.5 px-3 text-right">Recarga Rápida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {u.authProviders.map((p) => (
                              <span
                                key={p}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${
                                  p === 'google'
                                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                u.plan === 'editorial'
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : u.plan === 'creador'
                                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {u.plan}
                            </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-black text-emerald-300 text-sm">
                          {u.credits}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">{u.totalGenerated}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={busyKey !== null}
                              onClick={() => handleAdjustCredits(u.id, 15)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                            >
                              +15 cr
                            </button>
                            <button
                              type="button"
                              disabled={busyKey !== null}
                              onClick={() => handleAdjustCredits(u.id, Number(payments.pro_credits ?? 120), 'creador')}
                              className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                            >
                              +{payments.pro_credits ?? 120} KDP
                            </button>
                            <button
                              type="button"
                              disabled={busyKey !== null}
                              onClick={() => handleAdjustCredits(u.id, Number(payments.business_credits ?? 400), 'editorial')}
                              className="px-2 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                            >
                              +{payments.business_credits ?? 400} Edit.
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PAGOS, PASARELAS & LICENCIAS (SYNC CON DESCARGADOR) */}
      {/* ========================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Sync Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <h2 className="text-sm font-black text-white">Precios, Créditos & Pasarelas en Vivo</h2>
              </div>
              <p className="text-xs text-slate-400">
                Todo cambio en precios, créditos, nombres de planes o enlaces se aplica al instante en <code className="text-emerald-300">colorear.atpdev.dev/planes</code>, órdenes Yape/Plin y Checkout sin reiniciar el servidor.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSyncFromDescargador}
              disabled={isSyncingPayments}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw size={14} className={isSyncingPayments ? 'animate-spin' : ''} />
              <span>{isSyncingPayments ? 'Sincronizando...' : 'Sincronizar Datos Base'}</span>
            </button>
          </div>

          {/* Precios, Créditos y Nombres de Planes Editables */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-pink-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Coins size={16} className="text-amber-400" />
                  <span>Precios, Créditos y Nombres de Planes (USD & PEN)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Modifica aquí tus tarifas comerciales en Dólares y Soles, créditos por paquete y bono de bienvenida.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const disc = Number(payments.annual_discount_percent ?? 20);
                  const factor = Math.max(0.2, 1 - disc / 100);
                  const usdM = Number(payments.business_monthly_price ?? 19);
                  const penM = Number(payments.business_monthly_price_pen ?? 59);
                  setConfig({
                    ...config,
                    payments: {
                      ...payments,
                      business_annual_price: Math.round(usdM * 12 * factor),
                      business_annual_price_pen: Math.round(penM * 12 * factor),
                    },
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer shrink-0"
              >
                Auto-calcular Anual (-{payments.annual_discount_percent ?? 20}%)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Plan Gratuito + Descuento Global */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <p className="text-xs font-black text-slate-300 uppercase tracking-wider">Plan Gratis & Descuento</p>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 block">Créditos de Bienvenida (Registro)</label>
                  <input
                    type="number"
                    min={0}
                    value={payments.welcome_credits ?? 15}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payments: { ...payments, welcome_credits: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 block">Descuento Facturación Anual (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    value={payments.annual_discount_percent ?? 20}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payments: { ...payments, annual_discount_percent: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs"
                  />
                </div>
                <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 block">Mostrar Ciclo Anual</span>
                    <span className="text-[10px] text-slate-500">
                      {payments.annual_billing_enabled ? 'Visible en /planes' : 'Oculto (Solo S/ 29 y S/ 59)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        payments: { ...payments, annual_billing_enabled: !payments.annual_billing_enabled },
                      })
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                      payments.annual_billing_enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {payments.annual_billing_enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Pack Creador KDP */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-3">
                <p className="text-xs font-black text-indigo-300 uppercase tracking-wider">Pack 1 — Pago Único KDP</p>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 block">Nombre del Plan</label>
                  <input
                    type="text"
                    value={payments.pro_plan_name ?? 'Pack Creador KDP'}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payments: { ...payments, pro_plan_name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Créditos</label>
                    <input
                      type="number"
                      min={1}
                      value={payments.pro_credits ?? 120}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, pro_credits: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Precio USD</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={payments.pro_monthly_price ?? 9}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, pro_monthly_price: Number(e.target.value), pro_annual_price: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Precio S/ PEN</label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      value={payments.pro_monthly_price_pen ?? 29}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, pro_monthly_price_pen: Number(e.target.value), pro_annual_price_pen: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Plan Editorial Pro */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3">
                <p className="text-xs font-black text-amber-300 uppercase tracking-wider">Pack 2 — Estudio Editorial</p>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 block">Nombre del Plan</label>
                  <input
                    type="text"
                    value={payments.business_plan_name ?? 'Estudio Editorial Pro'}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payments: { ...payments, business_plan_name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Créd./Mes</label>
                    <input
                      type="number"
                      min={1}
                      value={payments.business_credits ?? 400}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, business_credits: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Mes USD</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={payments.business_monthly_price ?? 19}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, business_monthly_price: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Mes S/ PEN</label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      value={payments.business_monthly_price_pen ?? 59}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, business_monthly_price_pen: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Anual Total USD</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={payments.business_annual_price ?? 182}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, business_annual_price: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Anual Total S/ PEN</label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      value={payments.business_annual_price_pen ?? 564}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, business_annual_price_pen: Number(e.target.value) },
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Card */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-black">
                  S
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Stripe Payment Links (Internacional)</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isStripeTestMode
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {isStripeTestMode ? 'MODO TEST (/test_)' : 'MODO LIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Reemplaza estos enlaces cuando actives tus Payment Links Live en Stripe Dashboard.
                  </p>
                </div>
              </div>
              <a
                href="https://dashboard.stripe.com/payment-links"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shrink-0"
              >
                <ExternalLink size={13} />
                <span>Stripe Dashboard</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Link Stripe — {payments.pro_plan_name ?? 'Pack KDP'} (${payments.pro_monthly_price ?? 9} USD / {payments.pro_credits ?? 120} cr.)
                </label>
                <input
                  type="text"
                  value={payments.stripe_pro_monthly_url || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, stripe_pro_monthly_url: e.target.value },
                    })
                  }
                  placeholder="https://buy.stripe.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Link Stripe — {payments.business_plan_name ?? 'Plan Editorial'} Mensual (${payments.business_monthly_price ?? 19} USD)
                </label>
                <input
                  type="text"
                  value={payments.stripe_pro_annual_url || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, stripe_pro_annual_url: e.target.value },
                    })
                  }
                  placeholder="https://buy.stripe.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-xs focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Link Stripe — Editorial Anual Opcional (${payments.business_annual_price ?? 182} USD)
                </label>
                <input
                  type="text"
                  value={payments.stripe_business_annual_url || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, stripe_business_annual_url: e.target.value },
                    })
                  }
                  placeholder="Opcional (usa el mensual si está vacío)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-xs focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* MercadoPago Card */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-black">
                  MP
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Mercado Pago Perú (Yape, Plin & PagoEfectivo)</h3>
                  <p className="text-xs text-slate-400">
                    Links oficiales de cobro en Soles conectados con tu cuenta de Mercado Pago.
                  </p>
                </div>
              </div>
              <a
                href="https://www.mercadopago.com.pe/payment-links"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#009ee3] hover:bg-[#0089c7] text-white text-xs font-bold transition shrink-0"
              >
                <ExternalLink size={13} />
                <span>Consola Mercado Pago</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Link MercadoPago QR — {payments.pro_plan_name ?? 'Pack KDP'} (S/ {payments.pro_monthly_price_pen ?? 29})
                </label>
                <input
                  type="text"
                  value={payments.mercadopago_pro_monthly_url || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, mercadopago_pro_monthly_url: e.target.value },
                    })
                  }
                  placeholder="https://mpago.la/32Qtynr"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Link MercadoPago QR — Editorial Mensual (S/ {payments.business_monthly_price_pen ?? 59})
                </label>
                <input
                  type="text"
                  value={payments.mercadopago_pro_annual_url || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, mercadopago_pro_annual_url: e.target.value },
                    })
                  }
                  placeholder="https://mpago.la/2VEfsvU"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Link MercadoPago QR — Editorial Anual Opcional (S/ {payments.business_annual_price_pen ?? 564})
                </label>
                <input
                  type="text"
                  value={payments.mercadopago_business_annual_url || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, mercadopago_business_annual_url: e.target.value },
                    })
                  }
                  placeholder="Opcional (usa el mensual si está vacío)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp / Yape Direct & License Keys */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Phone size={15} className="text-emerald-400" />
                <span>WhatsApp / Yape Directo & Notificaciones</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Titular Yape / Plin (Mostrado debajo del QR)</label>
                <input
                  type="text"
                  value={payments.yape_holder || 'Percy Acha Taipe (ATP Dev Perú)'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, yape_holder: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Imagen QR Oficial Yape / Plin (Ruta o URL)</label>
                <div className="flex items-center gap-3">
                  <img
                    src={payments.yape_qr_url || '/yape-qr.jpg'}
                    alt="Vista previa QR Yape"
                    className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-700 object-contain shrink-0"
                  />
                  <input
                    type="text"
                    value={payments.yape_qr_url || '/yape-qr.jpg'}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payments: { ...payments, yape_qr_url: e.target.value },
                      })
                    }
                    placeholder="/yape-qr.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-violet-300 font-mono text-xs focus:border-violet-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Número WhatsApp Soporte (Solo botón WhatsApp, no visible en modal)</label>
                <input
                  type="text"
                  value={payments.whatsapp_number || config.contact?.whatsapp || '+51987006572'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...payments, whatsapp_number: e.target.value },
                    })
                  }
                  placeholder="+51987006572"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Correo de Comprobantes & Soporte</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    value={payments.notification_email || config.contact?.email || 'contacto@atpdev.dev'}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payments: { ...payments, notification_email: e.target.value },
                      })
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key size={15} className="text-amber-400" />
                    <span>Licencias & Modo Pruebas</span>
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      payments.demo_mode_enabled
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {payments.demo_mode_enabled ? '🧪 Modo Pruebas (Visible en Web)' : '🔒 Producción Estricta'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const rnd = Math.random().toString(36).substring(2, 8).toUpperCase();
                      const code = `ATP-KDP-${rnd}`;
                      const existing = payments.license_keys || [];
                      setConfig({
                        ...config,
                        payments: { ...payments, license_keys: [...existing, code] },
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold cursor-pointer"
                  >
                    + Clave KDP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const rnd = Math.random().toString(36).substring(2, 8).toUpperCase();
                      const code = `ATP-EDIT-${rnd}`;
                      const existing = payments.license_keys || [];
                      setConfig({
                        ...config,
                        payments: { ...payments, license_keys: [...existing, code] },
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 text-[11px] font-bold cursor-pointer"
                  >
                    + Clave Editorial
                  </button>
                </div>
              </div>

              {/* Control de Modo Pruebas / Código Demo (igual a Descargador Pro) */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-white">Código de Prueba Rápido en /planes (Solo Testing)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {payments.demo_mode_enabled
                        ? '⚠️ ACTIVO: El código de prueba funciona y se muestra en /planes. Desactívalo al terminar tus pruebas.'
                        : '✅ DESACTIVADO (Recomendado en Producción): No se acepta ni muestra ningún código de ejemplo.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        payments: {
                          ...payments,
                          demo_mode_enabled: !payments.demo_mode_enabled,
                          demo_license_code: payments.demo_license_code || 'COLOREAR-DEMO-2026',
                        },
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
                      payments.demo_mode_enabled
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {payments.demo_mode_enabled ? 'Desactivar Modo Prueba' : 'Activar para Pruebas'}
                  </button>
                </div>
                {payments.demo_mode_enabled && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-amber-300 font-bold">Código Demo:</span>
                    <input
                      type="text"
                      value={payments.demo_license_code || 'COLOREAR-DEMO-2026'}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          payments: { ...payments, demo_license_code: e.target.value.toUpperCase() },
                        })
                      }
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase outline-none"
                    />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Claves privadas activas (nunca se muestran en la web). Claves con <code className="text-amber-300">EDIT</code> o <code className="text-amber-300">EDITORIAL</code> acreditan {payments.business_credits ?? 400} cr.; el resto {payments.pro_credits ?? 120} cr.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLicenseKey}
                  onChange={(e) => setNewLicenseKey(e.target.value.toUpperCase())}
                  placeholder="Clave privada manual (ej. ATP-KDP-9X2F)"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs focus:border-amber-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLicenseKey}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(payments.license_keys || []).length === 0 ? (
                  <span className="text-[11px] text-slate-500 italic">
                    Sin claves activas. Genera una clave única arriba cuando quieras activar un cliente manualmente.
                  </span>
                ) : (
                  (payments.license_keys || []).map((key) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold"
                    >
                      <span>{key}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLicenseKey(key)}
                        className="text-amber-400 hover:text-rose-400 cursor-pointer"
                        aria-label={`Eliminar licencia ${key}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSavePayments}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
              <span>{isSaving ? 'Guardando...' : 'Guardar Pasarelas y Licencias'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: BRANDING, SEO & ACCESOS RÁPIDOS */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Globe size={16} className="text-blue-400" />
              <span>Branding, SEO y AdSense</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de Plataforma</label>
                <input
                  type="text"
                  value={config.branding?.site_title || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      branding: { ...config.branding, site_title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Google AdSense Client ID</label>
                <input
                  type="text"
                  value={config.monetization?.adsense_client_id || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      monetization: { ...(config.monetization || {}), adsense_client_id: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Subtítulo / Tagline</label>
              <input
                type="text"
                value={config.branding?.site_tagline || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    branding: { ...config.branding, site_tagline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Barra de Anuncio Superior</label>
              <input
                type="text"
                value={config.branding?.announcement_text || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    branding: { ...config.branding, announcement_text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <label className="inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.branding?.announcement_enabled ?? true}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      branding: { ...config.branding, announcement_enabled: e.target.checked },
                    })
                  }
                  className="rounded bg-slate-950 border-slate-700"
                />
                <span>Mostrar anuncio activo</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Meta Título SEO</label>
              <input
                type="text"
                value={config.seo?.meta_title || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    seo: { ...config.seo, meta_title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Meta Descripción SEO</label>
              <textarea
                rows={3}
                value={config.seo?.meta_description || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    seo: { ...config.seo, meta_description: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                <span>Guardar Branding & SEO</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Link2 size={15} className="text-pink-400" />
              <span>Accesos Directos (Producción)</span>
            </h3>
            {[
              { label: 'Portada Español (/)', url: 'https://colorear.atpdev.dev/' },
              { label: 'English Hub (/en)', url: 'https://colorear.atpdev.dev/en' },
              { label: 'Estudio Amazon KDP', url: 'https://colorear.atpdev.dev/estudio-kdp' },
              { label: 'Planes y Pagos (/planes)', url: 'https://colorear.atpdev.dev/planes' },
              { label: 'Login Google / Cuenta (/cuenta)', url: 'https://colorear.atpdev.dev/cuenta' },
              { label: 'API Config Vivo', url: 'https://colorear.atpdev.dev/api/billing/config' },
              { label: 'Sitemap XML', url: 'https://colorear.atpdev.dev/sitemap.xml' },
              { label: 'ads.txt AdSense', url: 'https://colorear.atpdev.dev/ads.txt' },
            ].map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
              >
                <span>{item.label}</span>
                <ExternalLink size={12} className="text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
