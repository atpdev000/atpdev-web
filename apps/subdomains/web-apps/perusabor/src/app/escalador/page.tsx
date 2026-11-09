'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  ArrowLeft, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  Printer, 
  FileSpreadsheet, 
  ChefHat,
  Sparkles
} from 'lucide-react';
import { PERUVIAN_RECIPES } from '@/data/recipes';
import { scaleRecipe } from '@/lib/calculator';

export default function EscaladorPage() {
  const [selectedRecipeSlug, setSelectedRecipeSlug] = useState<string>(PERUVIAN_RECIPES[0].slug);
  const [targetPortions, setTargetPortions] = useState<number>(10);

  const currentRecipe = PERUVIAN_RECIPES.find((r) => r.slug === selectedRecipeSlug) || PERUVIAN_RECIPES[0];
  const scaled = scaleRecipe(currentRecipe, targetPortions);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
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
          Calculadora & Escalador de Porciones
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
          Multiplicador determinista de ingredientes considerando mermas y ajustes culinarios para eventos, banquetes y servicio diario.
        </p>
      </div>

      {/* Control Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Select Recipe */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-stone-700 dark:text-stone-300">
              Seleccionar Receta:
            </label>
            <select
              value={selectedRecipeSlug}
              onChange={(e) => setSelectedRecipeSlug(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-bold text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#c22929]"
            >
              {PERUVIAN_RECIPES.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name} (Base {r.baseServings} pax)
                </option>
              ))}
            </select>
          </div>

          {/* Stepper for Servings */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-stone-700 dark:text-stone-300">
              Porciones Objetivo a Producir:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTargetPortions(Math.max(1, targetPortions - 5))}
                className="px-3.5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 font-black text-sm hover:bg-stone-200"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => setTargetPortions(Math.max(1, targetPortions - 1))}
                className="px-3.5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 font-black text-sm hover:bg-stone-200"
              >
                -1
              </button>
              <input
                type="number"
                min="1"
                max="500"
                value={targetPortions}
                onChange={(e) => setTargetPortions(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center font-black text-xl py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setTargetPortions(targetPortions + 1)}
                className="px-3.5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 font-black text-sm hover:bg-stone-200"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setTargetPortions(targetPortions + 5)}
                className="px-3.5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 font-black text-sm hover:bg-stone-200"
              >
                +5
              </button>
            </div>
          </div>

        </div>

        {/* Quick Summary Pill */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-amber-900 dark:text-amber-300">
          <span>Factor de Escala: <strong>{scaled.scalingFactor}x</strong> (de {currentRecipe.baseServings} a {targetPortions} porciones)</span>
          <span>Costo Materia Prima Total: <strong>S/ {scaled.totalRawCostPEN.toFixed(2)} PEN</strong></span>
          <span>Costo por Porción: <strong>S/ {scaled.costPerPortionPEN.toFixed(2)} PEN</strong></span>
        </div>

      </div>

      {/* Warnings */}
      {scaled.warnings.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-medium space-y-1">
          <div className="flex items-center gap-2 font-black text-sm pb-1">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Advertencias para Producción por Lotes:</span>
          </div>
          {scaled.warnings.map((w, idx) => (
            <p key={idx} className="leading-relaxed">
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* Scaled Ingredients Table */}
      <div className="rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
            Lista de Insumos Escalada
          </h3>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer no-print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Hoja de Producción</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-stone-400 font-black uppercase">
                <th className="py-3 px-3">Ingrediente</th>
                <th className="py-3 px-3">Base ({currentRecipe.baseServings} pax)</th>
                <th className="py-3 px-3 text-[#c22929]">Escalado ({targetPortions} pax)</th>
                <th className="py-3 px-3">Costo Insumo</th>
                <th className="py-3 px-3">Ajuste Culinario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
              {scaled.scaledIngredients.map((ing) => (
                <tr key={ing.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                  <td className="py-3.5 px-3 font-bold text-stone-800 dark:text-stone-200">
                    {ing.name}
                  </td>
                  <td className="py-3.5 px-3 text-stone-500">
                    {ing.quantity} {ing.unit}
                  </td>
                  <td className="py-3.5 px-3 font-black text-sm text-[#c22929] dark:text-red-400">
                    {ing.scaledQuantity} {ing.unit}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                    S/ {ing.scaledCostPEN.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                    {ing.culinaryAdjustmentWarning ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        ⚠️ {ing.culinaryAdjustmentWarning}
                      </span>
                    ) : (
                      'Escalado 1:1'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

