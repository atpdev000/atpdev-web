'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ArrowLeft, 
  TrendingUp, 
  PieChart, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Sliders,
  ChefHat
} from 'lucide-react';
import { PERUVIAN_RECIPES } from '@/data/recipes';

export default function CosteoPage() {
  const [targetFoodCost, setTargetFoodCost] = useState<number>(33); // 33% Food Cost estándar

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
          Costeo & Rentabilidad de Restaurante
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
          Control de Food Cost, márgenes de contribución unitarios y fijación estratégica de precios en carta.
        </p>
      </div>

      {/* Food Cost Slider Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
              Simulador de Objetivo de Food Cost (% Costo de Alimentos)
            </h3>
            <p className="text-xs text-stone-500">
              Ajusta el porcentaje objetivo para recalcular instantáneamente los precios de venta sugeridos.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-[#c22929] dark:text-red-500 font-display">
              {targetFoodCost}%
            </span>
            <span className="text-[11px] font-bold text-stone-400 block uppercase">
              {targetFoodCost <= 30 ? 'Alta Rentabilidad (Gourmet)' : targetFoodCost <= 35 ? 'Estándar Gastronómico' : 'Menú Económico / Batalla'}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="20"
          max="50"
          value={targetFoodCost}
          onChange={(e) => setTargetFoodCost(parseInt(e.target.value))}
          className="w-full accent-[#c22929] cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-bold text-stone-400">
          <span>20% (Máxima ganancia)</span>
          <span>35% (Punto de equilibrio habitual)</span>
          <span>50% (Bajo margen)</span>
        </div>
      </div>

      {/* Table of all recipes and their financial breakdown */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
              Matriz de Escandallo por Plato
            </h3>
            <p className="text-xs text-stone-500">
              Costos por ración individual y margen de contribución generado.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-stone-400 font-black uppercase">
                <th className="py-3 px-3">Plato</th>
                <th className="py-3 px-3">Región</th>
                <th className="py-3 px-3">Costo Materia Prima</th>
                <th className="py-3 px-3 text-[#c22929]">Precio Sugerido ({targetFoodCost}%)</th>
                <th className="py-3 px-3 text-emerald-600">Margen Contribución</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
              {PERUVIAN_RECIPES.map((recipe) => {
                const costPerPortion = recipe.baseRawCostPEN / recipe.baseServings;
                const dynamicSuggestedPrice = costPerPortion / (targetFoodCost / 100);
                const marginPEN = dynamicSuggestedPrice - costPerPortion;

                return (
                  <tr key={recipe.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3.5 px-3 font-bold text-stone-800 dark:text-stone-200">
                      {recipe.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-semibold text-[11px]">
                        {recipe.region}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                      S/ {costPerPortion.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 font-black text-sm text-[#c22929] dark:text-red-400">
                      S/ {dynamicSuggestedPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      + S/ {marginPEN.toFixed(2)} / plato
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/recetas/${recipe.slug}`}
                        className="text-[#c22929] hover:underline font-bold text-[11px]"
                      >
                        Ver Ficha →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engineering Menu Classification Box */}
      <div className="rounded-3xl p-8 bg-stone-900 text-white space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase">
            <PieChart className="w-3.5 h-3.5" />
            <span>Ingeniería de Menú (Matriz Boston Consulting Group / Miller)</span>
          </div>
          <h3 className="text-2xl font-black font-display text-white">
            Clasificación Estratégica de Platos en Carta
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xl">⭐</span>
            <h4 className="font-bold text-sm text-white">Platos Estrella</h4>
            <p className="text-xs text-stone-400">
              Alta rentabilidad y alta demanda (ej: <strong>Ceviche Clásico, Pisco Sour</strong>). Mantener estándar inalterable y ubicar en zona caliente de la carta.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xl">🐴</span>
            <h4 className="font-bold text-sm text-white">Caballos de Batalla</h4>
            <p className="text-xs text-stone-400">
              Alta demanda pero margen ajustado por el costo de insumo (ej: <strong>Lomo Saltado</strong> por el lomo fino). Optimizar mermas o aumentar suavemente el precio.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xl">🧩</span>
            <h4 className="font-bold text-sm text-white">Rompecabezas</h4>
            <p className="text-xs text-stone-400">
              Altísima rentabilidad pero menor rotación (ej: <strong>Suspiro a la Limeña, Causa</strong>). Impulsar mediante recomendación de mozos y maridajes sugeridos.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xl">🐕</span>
            <h4 className="font-bold text-sm text-white">Perros</h4>
            <p className="text-xs text-stone-400">
              Baja demanda y bajo margen. Rediseñar la receta, sustituir por una variante regional más atractiva o retirar de la carta.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

