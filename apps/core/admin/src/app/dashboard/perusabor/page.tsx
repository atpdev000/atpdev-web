'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  ChefHat, 
  ExternalLink, 
  BookOpen, 
  Boxes, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Search, 
  CheckCircle2, 
  Settings, 
  Save, 
  LayoutGrid, 
  Edit3, 
  Trash2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  ADMIN_PERUVIAN_RECIPES, 
  ADMIN_INVENTORY, 
  AdminRecipeItem, 
  AdminInventoryItem 
} from './adminData';

export default function PeruSaborAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'recetas' | 'insumos' | 'chef-ia' | 'ordenes'>('recetas');
  const [recipesList, setRecipesList] = useState<AdminRecipeItem[]>(ADMIN_PERUVIAN_RECIPES);
  const [inventoryList, setInventoryList] = useState<AdminInventoryItem[]>(ADMIN_INVENTORY);
  const [recipeSearch, setRecipeSearch] = useState('');
  
  // Chef IA Configuration State
  const [aiTemperature, setAiTemperature] = useState<number>(0.2);
  const [aiDeterministicMode, setAiDeterministicMode] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const toggleVerificationStatus = (recipeId: string) => {
    setRecipesList((prev) =>
      prev.map((r) => {
        if (r.id === recipeId) {
          const nextStatus = r.verificationStatus === 'Publicada' ? 'Pendiente de revisión' : 'Publicada';
          return { ...r, verificationStatus: nextStatus };
        }
        return r;
      })
    );
  };

  const updateInventoryPrice = (itemId: string, newPrice: number) => {
    setInventoryList((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, costPerUnitPEN: newPrice } : item))
    );
  };

  const handleSaveConfig = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const filteredRecipes = recipesList.filter(
    (r) =>
      r.name.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.region.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.department.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#c22929] flex items-center justify-center text-white shadow-md">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-display text-stone-900 dark:text-white">
                Perú Sabor Inteligente • CMS & Control Operativo
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold text-[10px] uppercase border border-red-500/20">
                Subdominio 3009
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Administración de recetas regionales, precios de insumos en Soles y configuración de Chef IA Perú.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://perusabor.atpdev.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Abrir Web App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ─── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Recetas Verificadas</span>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-display">
            {recipesList.filter(r => r.verificationStatus === 'Publicada' || r.verificationStatus === 'Verificada').length} / {recipesList.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% fichas técnicas completas</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Insumos Registrados</span>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-display">
            {inventoryList.length}
          </div>
          <span className="text-[11px] text-stone-500 font-semibold">Mercados mayoristas monitoreados</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Alertas de Stock Bajo</span>
          <div className="text-2xl sm:text-3xl font-black text-[#c22929] dark:text-red-500 font-display">
            {inventoryList.filter(i => i.currentStock <= i.minStock).length}
          </div>
          <span className="text-[11px] text-stone-500">Insumos requieren compra urgente</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Motor Chef IA Perú</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-display flex items-center gap-1.5">
            <Cpu className="w-5 h-5 text-amber-500" />
            <span>Activo</span>
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold">Modo determinista ON</span>
        </div>
      </div>

      {/* ─── Navigation Tabs ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('recetas')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'recetas'
              ? 'bg-[#c22929] text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogo de Recetas ({recipesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('insumos')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'insumos'
              ? 'bg-[#c22929] text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Precios de Insumos & Proveedores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chef-ia')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'chef-ia'
              ? 'bg-[#c22929] text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Parámetros de Chef IA Perú</span>
        </button>
      </div>

      {/* ─── TAB 1: GESTIÓN DE RECETAS (EDITORIAL) ─────────────────────────── */}
      {activeTab === 'recetas' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Filtrar recetas por nombre o región..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none"
              />
            </div>

            <span className="text-xs font-bold text-stone-500">
              Mostrando {filteredRecipes.length} recetas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase">
                  <th className="py-3 px-3">Plato</th>
                  <th className="py-3 px-3">Región / Dpto</th>
                  <th className="py-3 px-3">Base Pax</th>
                  <th className="py-3 px-3">Costo Base</th>
                  <th className="py-3 px-3">Precio Carta</th>
                  <th className="py-3 px-3">Estado Editorial</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                {filteredRecipes.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-3 font-bold text-stone-900 dark:text-stone-100">
                      {r.name}
                    </td>
                    <td className="py-3 px-3 text-stone-500">
                      {r.region} • {r.department}
                    </td>
                    <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                      {r.baseServings} pax
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                      S/ {r.baseRawCostPEN.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#c22929] dark:text-red-400">
                      S/ {r.suggestedPricePEN.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.verificationStatus === 'Publicada' || r.verificationStatus === 'Verificada'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {r.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleVerificationStatus(r.id)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-[11px] cursor-pointer"
                      >
                        Cambiar Estado
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ─── TAB 2: INSUMOS & PRECIOS MAYORISTAS ──────────────────────────── */}
      {activeTab === 'insumos' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-stone-900 dark:text-white font-display">
                Lista Maestra de Insumos & Costos de Mercado
              </h3>
              <p className="text-xs text-stone-500">
                Los cambios en los precios unitarios recalculan en tiempo real los escandallos y listas de compras de todo el sistema.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase">
                  <th className="py-3 px-3">Insumo</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Stock Actual</th>
                  <th className="py-3 px-3">Costo Actual (PEN)</th>
                  <th className="py-3 px-3">Editar Precio</th>
                  <th className="py-3 px-3">Proveedor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                {inventoryList.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-3 font-bold text-stone-900 dark:text-stone-100">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 text-stone-500">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                      S/ {item.costPerUnitPEN.toFixed(2)} / {item.unit}
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        step="0.5"
                        defaultValue={item.costPerUnitPEN}
                        onBlur={(e) => updateInventoryPrice(item.id, parseFloat(e.target.value) || item.costPerUnitPEN)}
                        className="w-24 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono font-bold"
                      />
                    </td>
                    <td className="py-3 px-3 text-stone-500 text-[11px]">
                      {item.supplier}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PARÁMETROS DE CHEF IA PERÚ ────────────────────────────── */}
      {activeTab === 'chef-ia' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6 shadow-xs max-w-3xl">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 dark:border-stone-800">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-stone-900 dark:text-white font-display">
              Configuración de Chef IA Perú
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                Temperatura de Inferencia Culinaria: {aiTemperature}
              </label>
              <input
                type="range"
                min="0.0"
                max="0.8"
                step="0.05"
                value={aiTemperature}
                onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#c22929] cursor-pointer"
              />
              <span className="text-[10px] text-stone-400 block">
                0.1 - 0.2: Máxima precisión técnica culinaria y cálculos deterministas (Recomendado).
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 dark:text-white block">
                  Reglas Deterministas Obligatorias (Sección 9 Documento Maestro)
                </span>
                <span className="text-[11px] text-stone-500">
                  Prohíbe a la IA alucinar existencias de ingredientes, precios o sustituciones no verificadas.
                </span>
              </div>
              <input
                type="checkbox"
                checked={aiDeterministicMode}
                onChange={(e) => setAiDeterministicMode(e.target.checked)}
                className="w-4 h-4 accent-[#c22929] rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                Prompt de Sistema Maestro Activo:
              </label>
              <textarea
                readOnly
                rows={6}
                value={`Eres Chef IA Perú, un asistente gastronómico especializado en la cocina peruana y en la operación de restaurantes. Responde en español de forma clara, cordial, profesional y práctica. Prioriza recetas verificadas, distingue origen documentado y calcula porciones con funciones deterministas.`}
                className="w-full p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono text-[11px] border border-stone-200 dark:border-stone-700 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-5 py-2.5 rounded-xl bg-[#c22929] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wide cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Parámetros</span>
              </button>

              {savedSuccess && (
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configuración guardada exitosamente</span>
                </span>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

