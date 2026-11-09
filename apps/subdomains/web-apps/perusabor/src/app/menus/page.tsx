'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MenuSquare, 
  ArrowLeft, 
  Boxes, 
  ShoppingCart, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  Plus, 
  ChefHat,
  DollarSign
} from 'lucide-react';
import { PERUVIAN_RECIPES } from '@/data/recipes';
import { INITIAL_INVENTORY } from '@/data/inventory';
import { generateConsolidatedShoppingList, ShoppingItem } from '@/lib/calculator';

export default function MenusPage() {
  const [guestCount, setGuestCount] = useState<number>(20);
  const [selectedStarterSlug, setSelectedStarterSlug] = useState<string>('ceviche-clasico-pescado');
  const [selectedMainSlug, setSelectedMainSlug] = useState<string>('lomo-saltado-criollo');
  const [selectedDessertSlug, setSelectedDessertSlug] = useState<string>('suspiro-a-la-limena');
  const [selectedDrinkSlug, setSelectedDrinkSlug] = useState<string>('pisco-sour-clasico');

  const starter = PERUVIAN_RECIPES.find((r) => r.slug === selectedStarterSlug) || PERUVIAN_RECIPES[0];
  const main = PERUVIAN_RECIPES.find((r) => r.slug === selectedMainSlug) || PERUVIAN_RECIPES[1];
  const dessert = PERUVIAN_RECIPES.find((r) => r.slug === selectedDessertSlug) || PERUVIAN_RECIPES[6];
  const drink = PERUVIAN_RECIPES.find((r) => r.slug === selectedDrinkSlug) || PERUVIAN_RECIPES[7];

  // Generar lista de compras consolidada cruzando recetas y existencias en almacén
  const shoppingList = generateConsolidatedShoppingList(
    [
      { recipe: starter, portions: guestCount },
      { recipe: main, portions: guestCount },
      { recipe: dessert, portions: guestCount },
      { recipe: drink, portions: guestCount },
    ],
    INITIAL_INVENTORY
  );

  const totalPurchaseCost = shoppingList.reduce((acc, item) => acc + item.estimatedCostPEN, 0);

  const applyPreset = (presetName: string) => {
    if (presetName === 'marino') {
      setSelectedStarterSlug('ceviche-clasico-pescado');
      setSelectedMainSlug('lomo-saltado-criollo');
      setSelectedDessertSlug('suspiro-a-la-limena');
      setSelectedDrinkSlug('pisco-sour-clasico');
    } else if (presetName === 'arequipeno') {
      setSelectedStarterSlug('rocoto-relleno-arequipeno');
      setSelectedMainSlug('rocoto-relleno-arequipeno');
      setSelectedDessertSlug('suspiro-a-la-limena');
      setSelectedDrinkSlug('pisco-sour-clasico');
    } else if (presetName === 'norteno') {
      setSelectedStarterSlug('ceviche-clasico-pescado');
      setSelectedMainSlug('seco-de-cabrito-nortena');
      setSelectedDessertSlug('suspiro-a-la-limena');
      setSelectedDrinkSlug('pisco-sour-clasico');
    } else if (presetName === 'amazonico') {
      setSelectedStarterSlug('ceviche-clasico-pescado');
      setSelectedMainSlug('juane-de-gallina-amazonico');
      setSelectedDessertSlug('suspiro-a-la-limena');
      setSelectedDrinkSlug('pisco-sour-clasico');
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
          Generador de Menús & Compras
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
          Planifica banquetes y menús de servicio. Consolida ingredientes de varios platos y descuenta automáticamente el stock disponible en almacén.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-bold text-stone-400 mr-2">Plantillas sugeridas:</span>
        <button
          type="button"
          onClick={() => applyPreset('marino')}
          className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold hover:bg-blue-500/20 cursor-pointer"
        >
          🌊 Menú Marino Criollo
        </button>
        <button
          type="button"
          onClick={() => applyPreset('norteno')}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 cursor-pointer"
        >
          🌾 Menú Norteño Lambayecano
        </button>
        <button
          type="button"
          onClick={() => applyPreset('arequipeno')}
          className="px-3.5 py-1.5 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/20 cursor-pointer"
        >
          ⛰️ Menú Picantero Characato
        </button>
        <button
          type="button"
          onClick={() => applyPreset('amazonico')}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 cursor-pointer"
        >
          🌴 Menú Selva Amazónica
        </button>
      </div>

      {/* Menu Composition Grid */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
              Composición del Menú
            </h3>
            <p className="text-xs text-stone-500">
              Selecciona los platos para cada tiempo del servicio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
              Comensales:
            </span>
            <input
              type="number"
              min="1"
              max="500"
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center font-black text-lg py-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Starter */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-black text-[#c22929] block">1. Entrada</span>
            <select
              value={selectedStarterSlug}
              onChange={(e) => setSelectedStarterSlug(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2 text-stone-900 dark:text-white"
            >
              {PERUVIAN_RECIPES.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 line-clamp-2">{starter.tagline}</p>
          </div>

          {/* Main */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-black text-amber-600 block">2. Plato de Fondo</span>
            <select
              value={selectedMainSlug}
              onChange={(e) => setSelectedMainSlug(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2 text-stone-900 dark:text-white"
            >
              {PERUVIAN_RECIPES.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 line-clamp-2">{main.tagline}</p>
          </div>

          {/* Dessert */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-black text-purple-600 block">3. Postre Tradicional</span>
            <select
              value={selectedDessertSlug}
              onChange={(e) => setSelectedDessertSlug(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2 text-stone-900 dark:text-white"
            >
              {PERUVIAN_RECIPES.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 line-clamp-2">{dessert.tagline}</p>
          </div>

          {/* Drink */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-black text-emerald-600 block">4. Bebida de Bandera</span>
            <select
              value={selectedDrinkSlug}
              onChange={(e) => setSelectedDrinkSlug(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2 text-stone-900 dark:text-white"
            >
              {PERUVIAN_RECIPES.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 line-clamp-2">{drink.tagline}</p>
          </div>

        </div>

      </div>

      {/* Consolidated Shopping List */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#c22929]" />
              <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
                Lista de Compras Consolidada (Descontando Stock en Almacén)
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Cálculo de insumos netos necesarios para {guestCount} servicios completos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 flex items-center gap-2 cursor-pointer no-print self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Orden de Compra</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-stone-400 font-black uppercase">
                <th className="py-3 px-3">Insumo Requerido</th>
                <th className="py-3 px-3">Cantidad Total</th>
                <th className="py-3 px-3">Stock en Almacén</th>
                <th className="py-3 px-3 text-[#c22929]">A Comprar (Neto)</th>
                <th className="py-3 px-3">Proveedor Asignado</th>
                <th className="py-3 px-3 text-right">Costo Estimado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
              {shoppingList.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                  <td className="py-3.5 px-3 font-bold text-stone-800 dark:text-stone-200">
                    {item.ingredientName}
                  </td>
                  <td className="py-3.5 px-3 text-stone-600 dark:text-stone-400">
                    {item.requiredAmount} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 text-stone-500 font-mono">
                    {item.availableStock > 0 ? `${item.availableStock} ${item.unit}` : '0'}
                  </td>
                  <td className="py-3.5 px-3 font-black text-sm text-[#c22929] dark:text-red-400">
                    {item.toPurchaseAmount > 0 ? (
                      `${item.toPurchaseAmount} ${item.unit}`
                    ) : (
                      <span className="text-emerald-600 font-bold text-xs">✓ Stock cubierto</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                    {item.supplier}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-stone-900 dark:text-stone-100 text-right">
                    S/ {item.estimatedCostPEN.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Budget Footer */}
        <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-stone-400 block">
              Inversión Total en Compras para este Menú:
            </span>
            <div className="text-3xl font-black text-stone-900 dark:text-white font-display">
              S/ {totalPurchaseCost.toFixed(2)} PEN
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-bold text-stone-400 block">
              Costo de Insumos por Comensal:
            </span>
            <div className="text-2xl font-black text-[#c22929] dark:text-red-500 font-display">
              S/ {(totalPurchaseCost / guestCount).toFixed(2)} PEN
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

