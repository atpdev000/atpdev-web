'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Users, 
  Flame, 
  ArrowLeft, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  Calculator, 
  DollarSign, 
  Maximize2, 
  Minimize2,
  ChefHat,
  AlertTriangle,
  Info,
  Layers,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { PERUVIAN_RECIPES, getRecipeBySlug } from '@/data/recipes';
import { scaleRecipe } from '@/lib/calculator';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function RecipeDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const recipe = getRecipeBySlug(resolvedParams.slug);

  if (!recipe) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'ficha' | 'escalador' | 'costos' | 'cocina'>('ficha');
  const [portionCount, setPortionCount] = useState<number>(recipe.baseServings);

  // Timer states for Modo Cocina
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Run scaled calculations
  const scaledData = scaleRecipe(recipe, portionCount);

  // Timer tick
  React.useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const startStepTimer = (minutes?: number) => {
    if (!minutes) return;
    setTimerSeconds(minutes * 60);
    setTimerActive(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ─── Breadcrumb & Top Bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <Link
          href="/recetas"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#c22929] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>
          <Link
            href={`/chef-ia?receta=${recipe.slug}`}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Consultar con Chef IA</span>
          </Link>
        </div>
      </div>

      {/* ─── Recipe Hero Card ────────────────────────────────────────────── */}
      <div className="rounded-3xl p-6 sm:p-10 border-2 border-b-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-6 shadow-sm">
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-stone-900 text-white font-black text-xs uppercase tracking-wider">
            {recipe.region} • {recipe.department}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase">
            {recipe.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Estado: {recipe.verificationStatus}</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black font-display text-stone-900 dark:text-white tracking-tight">
            {recipe.name}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-medium leading-relaxed max-w-4xl">
            {recipe.description}
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Rendimiento Base</span>
            <span className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
              {recipe.baseServings} porciones ({recipe.servingSizeGrams}g c/u)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Tiempo Total</span>
            <span className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dificultad</span>
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
              {recipe.difficulty}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Costo Base / Porción</span>
            <span className="text-base sm:text-lg font-black text-[#c22929] dark:text-red-500">
              S/ {(recipe.baseRawCostPEN / recipe.baseServings).toFixed(2)} PEN
            </span>
          </div>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-100 dark:border-stone-800 no-print">
          <button
            type="button"
            onClick={() => setActiveTab('ficha')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'ficha'
                ? 'bg-[#c22929] text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ficha Técnica Estandarizada</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('escalador')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'escalador'
                ? 'bg-[#c22929] text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Escalador de Porciones ({portionCount} pax)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('costos')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'costos'
                ? 'bg-[#c22929] text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Costeo & Margen de Restaurante</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cocina')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'cocina'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Modo Cocina en Vivo</span>
          </button>
        </div>

      </div>

      {/* ─── TAB 1: FICHA TÉCNICA ESTANDARIZADA ──────────────────────────── */}
      {activeTab === 'ficha' && (
        <div className="space-y-8">
          
          {/* Tabla de Ingredientes con Peso Bruto, Neto y Mermas */}
          <div className="rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
                  Ingredientes & Mise en Place
                </h3>
                <p className="text-xs text-stone-500">
                  Calculado para la receta base de {recipe.baseServings} porciones.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-stone-400 font-black uppercase">
                    <th className="py-3 px-3">Ingrediente</th>
                    <th className="py-3 px-3">Cantidad Neta</th>
                    <th className="py-3 px-3">Merma %</th>
                    <th className="py-3 px-3">Peso Bruto Sugerido</th>
                    <th className="py-3 px-3">Notas Culinarias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                  {recipe.ingredients.map((ing) => (
                    <tr key={ing.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="py-3.5 px-3 font-bold text-stone-800 dark:text-stone-200">
                        {ing.name}
                      </td>
                      <td className="py-3.5 px-3 text-stone-900 dark:text-stone-100 font-bold">
                        {ing.quantity} {ing.unit}
                      </td>
                      <td className="py-3.5 px-3 text-stone-500">
                        {ing.wastePercentage}%
                      </td>
                      <td className="py-3.5 px-3 text-stone-600 dark:text-stone-400 font-mono">
                        {ing.grossWeightGrams ? `${ing.grossWeightGrams} g` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                        {ing.notes || ing.scalingNote || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Procedimiento Numerado con Puntos Críticos (PCC) */}
          <div className="rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-6">
            <div>
              <h3 className="text-xl font-black font-display text-stone-900 dark:text-white">
                Procedimiento Paso a Paso & Puntos Críticos de Control (HACCP)
              </h3>
              <p className="text-xs text-stone-500">
                Puntos de cocción, temperaturas y señales visuales de control.
              </p>
            </div>

            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div 
                  key={step.stepNumber}
                  className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-[#c22929] text-white flex items-center justify-center font-black text-xs">
                        {step.stepNumber}
                      </span>
                      <h4 className="font-black text-sm text-stone-900 dark:text-white font-display">
                        {step.title}
                      </h4>
                    </div>
                    {step.timeMinutes && (
                      <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{step.timeMinutes} min</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium pl-9">
                    {step.instruction}
                  </p>

                  {/* Critical Control Point Alert */}
                  {step.criticalControlPoint && (
                    <div className="ml-9 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <span className="uppercase text-[10px] tracking-wider block font-black">
                          Punto Crítico de Inocuidad (PCC):
                        </span>
                        <span>{step.criticalControlPoint}</span>
                      </div>
                    </div>
                  )}

                  {/* Visual Cue */}
                  {step.visualCue && (
                    <div className="ml-9 text-[11px] font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <span className="text-amber-500">👁️ Señal visual:</span>
                      <span>{step.visualCue}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Seguridad Alimentaria, Alérgenos y Maridajes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inocuidad y Alérgenos */}
            <div className="p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="w-5 h-5" />
                <h4 className="font-black text-base text-stone-900 dark:text-white font-display">
                  Inocuidad & Alérgenos Declarados
                </h4>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-stone-400 block">Alérgenos presentes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.allergens.map((alg) => (
                    <span key={alg} className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 font-bold text-xs border border-red-500/20">
                      ⚠️ {alg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-stone-400 block">Advertencias Sanitarias:</span>
                <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  {recipe.foodSafetyWarnings.map((warn, wIdx) => (
                    <li key={wIdx} className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>{warn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-xs text-stone-500">
                <strong>Conservación y Vida Útil:</strong> {recipe.shelfLifeAndStorage}
              </div>
            </div>

            {/* Servicio, Maridajes y Procedencia */}
            <div className="p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-black text-base text-stone-900 dark:text-white font-display">
                  Maridajes & Tradición Documentada
                </h4>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300 block">Bebidas sugeridas:</span>
                <p className="text-stone-500">{recipe.pairings.drinks.join(' • ')}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300 block">Guarniciones y Salsas:</span>
                <p className="text-stone-500">{[...recipe.pairings.sides, ...recipe.pairings.sauces].join(' • ')}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300 block">Variantes regionales conocidas:</span>
                <p className="text-stone-500">{recipe.regionalVariants.join(' • ')}</p>
              </div>

              <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-100 dark:border-stone-800">
                <strong>Fuente Histórica / Técnica:</strong> {recipe.traditionalSource}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── TAB 2: ESCALADOR DE PORCIONES DETERMINISTA ──────────────────── */}
      {activeTab === 'escalador' && (
        <div className="rounded-3xl p-6 sm:p-10 border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black font-display text-stone-900 dark:text-white">
                Escalador Dinámico para Cocina & Banquetes
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Multiplicador determinista de insumos con reglas de amortiguación para sal y ajíes.
              </p>
            </div>

            {/* Quick portions selector */}
            <div className="flex items-center gap-2">
              {[4, 10, 25, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPortionCount(num)}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs transition-colors cursor-pointer ${
                    portionCount === num
                      ? 'bg-[#c22929] text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {num} pax
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Input */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
              Número de porciones deseadas:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPortionCount(Math.max(1, portionCount - 1))}
                className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 font-black text-sm flex items-center justify-center hover:bg-stone-300"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="500"
                value={portionCount}
                onChange={(e) => setPortionCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-black text-lg bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg py-1 text-stone-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setPortionCount(portionCount + 1)}
                className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 font-black text-sm flex items-center justify-center hover:bg-stone-300"
              >
                +
              </button>
            </div>
            <span className="text-xs font-bold text-[#c22929]">
              ({scaledData.scalingFactor}x de la receta base)
            </span>
          </div>

          {/* Warnings */}
          {scaledData.warnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-medium space-y-1">
              {scaledData.warnings.map((w, idx) => (
                <p key={idx}>⚠️ {w}</p>
              ))}
            </div>
          )}

          {/* Scaled Ingredients Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-stone-400 font-black uppercase">
                  <th className="py-3 px-3">Ingrediente</th>
                  <th className="py-3 px-3">Base ({recipe.baseServings} pax)</th>
                  <th className="py-3 px-3 text-[#c22929]">Escalado ({portionCount} pax)</th>
                  <th className="py-3 px-3">Costo Insumo (PEN)</th>
                  <th className="py-3 px-3">Ajuste de Sazón</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                {scaledData.scaledIngredients.map((ing) => (
                  <tr key={ing.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3.5 px-3 font-bold text-stone-800 dark:text-stone-200">
                      {ing.name}
                    </td>
                    <td className="py-3.5 px-3 text-stone-500">
                      {ing.quantity} {ing.unit}
                    </td>
                    <td className="py-3.5 px-3 font-black text-base text-[#c22929] dark:text-red-400">
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
                        'Escalado lineal 1:1'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-stone-400">Total Materia Prima Necesaria:</span>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-display">
                S/ {scaledData.totalRawCostPEN.toFixed(2)} PEN
              </div>
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-stone-400">Costo Unitario por Plato:</span>
              <div className="text-2xl sm:text-3xl font-black text-[#c22929] dark:text-red-500 font-display">
                S/ {scaledData.costPerPortionPEN.toFixed(2)} PEN
              </div>
            </div>
            <Link
              href="/menus"
              className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wide btn-peru-primary select-none"
            >
              Pasar a Lista de Compras
            </Link>
          </div>

        </div>
      )}

      {/* ─── TAB 3: COSTEO & MARGEN DE RESTAURANTE ────────────────────────── */}
      {activeTab === 'costos' && (
        <div className="rounded-3xl p-6 sm:p-10 border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-8">
          <div>
            <h3 className="text-2xl font-black font-display text-stone-900 dark:text-white">
              Análisis Financiero de Receta & Escandallo
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Estructura de costos según los estándares de la industria restaurantera peruana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 30% Food Cost */}
            <div className="p-6 rounded-3xl border-2 border-emerald-500/50 bg-emerald-500/5 space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase">
                Alta Rentabilidad (30% Food Cost)
              </span>
              <div className="text-3xl font-black text-emerald-800 dark:text-emerald-400 font-display">
                S/ {scaledData.suggestedPrices.recommended30Percent}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                Precio sugerido para restaurantes gastronómicos o de mantel con alta inversión en personal y ambientación.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 border-t border-emerald-500/20">
                Margen de Contribución: S/ {(scaledData.suggestedPrices.recommended30Percent - scaledData.costPerPortionPEN).toFixed(2)} / plato
              </div>
            </div>

            {/* Card 35% Food Cost */}
            <div className="p-6 rounded-3xl border-2 border-amber-500/50 bg-amber-500/5 space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-black text-[10px] uppercase">
                Estándar de Mercado (35% Food Cost)
              </span>
              <div className="text-3xl font-black text-amber-800 dark:text-amber-400 font-display">
                S/ {scaledData.suggestedPrices.standard35Percent}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                Precio equilibrado óptimo para cevicherías y restaurantes criollos tradicionales de alto volumen.
              </p>
              <div className="pt-2 text-xs font-bold text-amber-700 dark:text-amber-400 border-t border-amber-500/20">
                Margen de Contribución: S/ {(scaledData.suggestedPrices.standard35Percent - scaledData.costPerPortionPEN).toFixed(2)} / plato
              </div>
            </div>

            {/* Card 40% Food Cost */}
            <div className="p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-stone-700 text-white font-black text-[10px] uppercase">
                Menú Ejecutivo (40% Food Cost)
              </span>
              <div className="text-3xl font-black text-stone-900 dark:text-white font-display">
                S/ {scaledData.suggestedPrices.economic40Percent}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                Precio competitivo de batalla para promociones de mediodía o menús ejecutivos con rotación rápida.
              </p>
              <div className="pt-2 text-xs font-bold text-stone-700 dark:text-stone-300 border-t border-stone-200 dark:border-stone-800">
                Margen de Contribución: S/ {(scaledData.suggestedPrices.economic40Percent - scaledData.costPerPortionPEN).toFixed(2)} / plato
              </div>
            </div>

          </div>

          {/* Breakdown Formulas */}
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-xs font-medium space-y-2 text-stone-600 dark:text-stone-400">
            <h5 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
              Fórmulas Deterministas Aplicadas:
            </h5>
            <p>• <strong>Costo por Porción</strong> = Costo Total de Materia Prima (S/ {scaledData.totalRawCostPEN.toFixed(2)}) ÷ {portionCount} porciones = <strong>S/ {scaledData.costPerPortionPEN.toFixed(2)}</strong></p>
            <p>• <strong>Margen de Contribución</strong> = Precio Neto de Venta − Costo de Materia Prima por Ración</p>
            <p>• <strong>% Food Cost</strong> = (Costo de Materia Prima ÷ Precio de Venta) × 100</p>
          </div>

        </div>
      )}

      {/* ─── TAB 4: MODO COCINA EN VIVO (Hands-Free / Pantalla Gigante) ─────── */}
      {activeTab === 'cocina' && (
        <div className="rounded-3xl p-6 sm:p-12 border-4 border-amber-500/40 bg-stone-950 text-white space-y-8 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs uppercase">
                <ChefHat className="w-4 h-4" />
                <span>Modo Cocina en Vivo • Paso {currentStepIndex + 1} de {recipe.steps.length}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-display text-white mt-1">
                {recipe.steps[currentStepIndex].title}
              </h3>
            </div>

            {/* Timer Control */}
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-4 self-start sm:self-auto">
              <div className="text-3xl font-mono font-black text-amber-400">
                {formatTime(timerSeconds)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerActive(!timerActive)}
                  className="p-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 cursor-pointer"
                >
                  {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerActive(false);
                    setTimerSeconds(0);
                  }}
                  className="p-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold hover:bg-stone-700 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Big Instruction Text */}
          <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-6">
            <p className="text-xl sm:text-3xl font-medium leading-relaxed text-stone-100">
              {recipe.steps[currentStepIndex].instruction}
            </p>

            {recipe.steps[currentStepIndex].criticalControlPoint && (
              <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-sm font-bold flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <span className="uppercase text-[11px] block font-black text-red-300">Punto Crítico HACCP:</span>
                  <span>{recipe.steps[currentStepIndex].criticalControlPoint}</span>
                </div>
              </div>
            )}

            {recipe.steps[currentStepIndex].timeMinutes && timerSeconds === 0 && (
              <button
                type="button"
                onClick={() => startStepTimer(recipe.steps[currentStepIndex].timeMinutes)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Activar temporizador para este paso ({recipe.steps[currentStepIndex].timeMinutes} min)</span>
              </button>
            )}
          </div>

          {/* Step Navigation Bar */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => {
                setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
                setTimerActive(false);
                setTimerSeconds(0);
              }}
              className="px-6 py-4 rounded-2xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm text-white cursor-pointer"
            >
              ← Paso Anterior
            </button>

            <span className="text-xs font-bold text-stone-500">
              Paso {currentStepIndex + 1} de {recipe.steps.length}
            </span>

            <button
              type="button"
              disabled={currentStepIndex === recipe.steps.length - 1}
              onClick={() => {
                setCurrentStepIndex(Math.min(recipe.steps.length - 1, currentStepIndex + 1));
                setTimerActive(false);
                setTimerSeconds(0);
              }}
              className="px-6 py-4 rounded-2xl bg-[#c22929] hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed font-black text-sm text-white cursor-pointer"
            >
              Siguiente Paso →
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

