'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Boxes, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  Truck,
  Calendar
} from 'lucide-react';
import { INITIAL_INVENTORY } from '@/data/inventory';
import { InventoryItem } from '@/types';

export default function InventarioPage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [onlyAlerts, setOnlyAlerts] = useState(false);

  const categories = [
    'Todas',
    'Carnes y Pescados',
    'Verduras y Frutas',
    'Especias y Ajíes',
    'Lácteos',
    'Bebidas'
  ];

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchAlert = !onlyAlerts || item.currentStock <= item.minStock;

    return matchSearch && matchCat && matchAlert;
  });

  const lowStockCount = items.filter((i) => i.currentStock <= i.minStock).length;
  const totalStockValue = items.reduce((acc, i) => acc + i.currentStock * i.costPerUnitPEN, 0);

  const restockItem = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentStock: item.currentStock + amount } : item
      )
    );
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
          Control de Inventario & Almacén
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
          Monitoreo de existencias de insumos peruanos, alertas de punto de reorden y costos de adquisición con proveedores.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-stone-400 block uppercase">Insumos Registrados</span>
          <div className="text-3xl font-black text-stone-900 dark:text-white font-display">
            {items.length} productos
          </div>
          <span className="text-[11px] text-stone-500">Carnes, ajíes, verduras y abarrotes</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-stone-400 block uppercase">Alertas de Bajo Stock</span>
          <div className={`text-3xl font-black font-display ${lowStockCount > 0 ? 'text-[#c22929] dark:text-red-500' : 'text-emerald-600'}`}>
            {lowStockCount} alertas
          </div>
          <span className="text-[11px] text-stone-500">Insumos por debajo del stock mínimo</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-stone-400 block uppercase">Valor Total en Almacén</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">
            S/ {totalStockValue.toFixed(2)} PEN
          </div>
          <span className="text-[11px] text-stone-500">Capital inmovilizado en insumos</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar insumo o proveedor..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:border-[#c22929]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setOnlyAlerts(!onlyAlerts)}
              className={`px-3.5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                onlyAlerts
                  ? 'bg-red-500 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Solo Alertas ({lowStockCount})</span>
            </button>
          </div>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-stone-400 font-black uppercase">
                <th className="py-3 px-3">Insumo</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Stock Actual</th>
                <th className="py-3 px-3">Stock Mínimo</th>
                <th className="py-3 px-3">Costo Unitario</th>
                <th className="py-3 px-3">Proveedor Principal</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
              {filtered.map((item) => {
                const isLow = item.currentStock <= item.minStock;

                return (
                  <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3.5 px-3 font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                      {isLow && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Stock bajo" />
                      )}
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-stone-500">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-3 font-black text-sm">
                      <span className={isLow ? 'text-red-600 font-extrabold' : 'text-stone-900 dark:text-stone-100'}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-stone-400 font-mono">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                      S/ {item.costPerUnitPEN.toFixed(2)} / {item.unit}
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                      {item.supplier}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => restockItem(item.id, 5)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] cursor-pointer"
                      >
                        + Ingresar +5
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

