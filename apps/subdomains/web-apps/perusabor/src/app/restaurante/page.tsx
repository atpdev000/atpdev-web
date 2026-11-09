'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, 
  ArrowLeft, 
  Users, 
  UtensilsCrossed, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ChefHat, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { PERUVIAN_RECIPES } from '@/data/recipes';
import { RestaurantTable, RestaurantOrder } from '@/types';

export default function RestaurantePage() {
  const [tables, setTables] = useState<RestaurantTable[]>([
    { id: 1, number: 'Mesa 01', capacity: 4, location: 'Salón Principal', status: 'comanda_activa', currentOrderId: 'ord-101' },
    { id: 2, number: 'Mesa 02', capacity: 2, location: 'Salón Principal', status: 'libre' },
    { id: 3, number: 'Mesa 03', capacity: 6, location: 'Terraza', status: 'ocupada', currentOrderId: 'ord-102' },
    { id: 4, number: 'Mesa 04', capacity: 4, location: 'Terraza', status: 'cuenta_solicitada', currentOrderId: 'ord-103' },
    { id: 5, number: 'Mesa 05', capacity: 8, location: 'Privado VIP', status: 'libre' },
    { id: 6, number: 'Bar 01', capacity: 2, location: 'Bar', status: 'comanda_activa', currentOrderId: 'ord-104' },
  ]);

  const [orders, setOrders] = useState<RestaurantOrder[]>([
    {
      id: 'ord-101',
      tableNumber: 'Mesa 01',
      serverName: 'Carlos M.',
      guestCount: 4,
      items: [
        { recipeId: 'rec-ceviche-clasico', recipeName: 'Ceviche Clásico de Pescado', quantity: 2, unitPricePEN: 38.00 },
        { recipeId: 'rec-lomo-saltado', recipeName: 'Lomo Saltado Criollo', quantity: 2, unitPricePEN: 46.00 },
        { recipeId: 'rec-pisco-sour', recipeName: 'Pisco Sour Clásico', quantity: 4, unitPricePEN: 28.00 }
      ],
      status: 'en_cocina',
      createdAt: '13:42',
      totalPEN: 280.00
    },
    {
      id: 'ord-102',
      tableNumber: 'Mesa 03',
      serverName: 'Lucía V.',
      guestCount: 6,
      items: [
        { recipeId: 'rec-seco-cabrito', recipeName: 'Seco de Cabrito a la Norteña', quantity: 3, unitPricePEN: 48.00 },
        { recipeId: 'rec-aji-de-gallina', recipeName: 'Ají de Gallina Cremoso', quantity: 3, unitPricePEN: 34.00 }
      ],
      status: 'confirmado',
      createdAt: '13:50',
      totalPEN: 246.00
    },
    {
      id: 'ord-103',
      tableNumber: 'Mesa 04',
      serverName: 'Carlos M.',
      guestCount: 3,
      items: [
        { recipeId: 'rec-rocoto-relleno', recipeName: 'Rocoto Relleno Arequipeño', quantity: 3, unitPricePEN: 38.00 },
        { recipeId: 'rec-suspiro-limena', recipeName: 'Suspiro a la Limeña', quantity: 3, unitPricePEN: 18.00 }
      ],
      status: 'listo',
      createdAt: '13:15',
      totalPEN: 168.00
    }
  ]);

  const updateOrderStatus = (orderId: string, nextStatus: RestaurantOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
  };

  const getStatusBadge = (status: RestaurantOrder['status']) => {
    switch (status) {
      case 'confirmado':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'en_cocina':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'listo':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'entregado':
        return 'bg-stone-500/10 text-stone-600 border-stone-500/20';
      case 'cobrado':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#c22929]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-stone-900 dark:text-white">
          Gestión de Salón, Mesas & Comandas
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
          Control de estados de mesas en tiempo real y flujo de tickets de cocina (KOT) para mozos y chefs.
        </p>
      </div>

      {/* Tables Grid */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
            Plano de Salón & Ocupación de Mesas
          </h3>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Libre</span>
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Comanda Activa</span>
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Cuenta Solicitada</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {tables.map((table) => {
            const isFree = table.status === 'libre';
            const isActive = table.status === 'comanda_activa';
            const isBill = table.status === 'cuenta_solicitada';

            return (
              <div
                key={table.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-32 ${
                  isFree
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : isActive
                    ? 'border-amber-500/60 bg-amber-500/10'
                    : isBill
                    ? 'border-blue-500/60 bg-blue-500/10'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-black text-sm text-stone-900 dark:text-white font-display">
                    {table.number}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400">
                    {table.capacity} pax
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    {table.location}
                  </span>
                  <span className={`text-xs font-black capitalize block ${
                    isFree ? 'text-emerald-700 dark:text-emerald-400' : isActive ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'
                  }`}>
                    {table.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kitchen Display System (KOT / Comandas en Vivo) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#c22929]" />
            <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
              Comandas Activas en Cocina (KOT)
            </h3>
          </div>
          <span className="text-xs font-bold text-stone-400">
            {orders.length} pedidos en proceso
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl border-2 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                  <div>
                    <h4 className="font-black text-base text-stone-900 dark:text-white font-display">
                      {ord.tableNumber}
                    </h4>
                    <span className="text-[11px] text-stone-500">Mozo: {ord.serverName} • {ord.createdAt}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(ord.status)}`}>
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Items */}
                <ul className="space-y-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                  {ord.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start justify-between gap-2">
                      <span><strong>{item.quantity}x</strong> {item.recipeName}</span>
                      <span className="font-mono text-stone-500">S/ {(item.quantity * item.unitPricePEN).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status Actions */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-500">Total Comanda:</span>
                  <span className="font-mono text-base font-black text-[#c22929] dark:text-red-400">
                    S/ {ord.totalPEN.toFixed(2)} PEN
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {ord.status === 'confirmado' && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(ord.id, 'en_cocina')}
                      className="col-span-2 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      Marchar a Cocina →
                    </button>
                  )}
                  {ord.status === 'en_cocina' && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(ord.id, 'listo')}
                      className="col-span-2 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      ✓ Marcar Pedido Listo
                    </button>
                  )}
                  {ord.status === 'listo' && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(ord.id, 'entregado')}
                      className="col-span-2 py-2 rounded-xl bg-stone-800 text-white font-bold text-xs"
                    >
                      Servir en Mesa →
                    </button>
                  )}
                  {ord.status === 'entregado' && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(ord.id, 'cobrado')}
                      className="col-span-2 py-2 rounded-xl bg-[#c22929] text-white font-bold text-xs"
                    >
                      Cobrar y Cerrar Mesa
                    </button>
                  )}
                  {ord.status === 'cobrado' && (
                    <span className="col-span-2 text-center text-xs font-bold text-emerald-600 py-2">
                      ✓ Comanda Finalizada
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

