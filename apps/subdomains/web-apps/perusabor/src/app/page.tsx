'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ChefHat, 
  BookOpen, 
  Calculator, 
  DollarSign, 
  MenuSquare, 
  Boxes, 
  LayoutGrid, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Compass,
  UtensilsCrossed
} from 'lucide-react';
import { PERUVIAN_RECIPES } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');

  const filteredRecipes = PERUVIAN_RECIPES.filter((recipe) => {
    const matchesQuery = 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'Todas' || recipe.region === selectedRegion;
    return matchesQuery && matchesRegion;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* ─── 1. HERO GASTRONÓMICO PERUANO ───────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-amber-500/10 via-red-500/5 to-transparent dark:from-red-950/20 dark:via-stone-900/40 dark:to-transparent border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c22929]/10 text-[#c22929] dark:bg-red-950/60 dark:text-red-400 font-extrabold text-xs uppercase tracking-wider border border-[#c22929]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Patrimonio Culinario • Inteligencia Artificial • Operación Pro</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-stone-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            La Grandeza Culinaria del Perú con <span className="text-[#c22929] dark:text-red-500">Precisión Inteligente</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-600 dark:text-stone-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Explora recetas regionales de Costa, Sierra y Selva. Obtén fichas técnicas estandarizadas, escala porciones de 4 a 100 personas y opera tu restaurante con Chef IA Perú.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por plato, ingrediente o región (ej: Ceviche, Lomo, Arequipa)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium text-sm focus:outline-none focus:border-[#c22929] dark:focus:border-red-500 shadow-md transition-all"
              />
            </div>
            
            {/* Quick Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs font-bold text-stone-500 dark:text-stone-400">
              <span>Sugerencias:</span>
              {['Ceviche', 'Lomo Saltado', 'Ají de Gallina', 'Rocoto Relleno', 'Juane', 'Pisco Sour'].map((dish) => (
                <button
                  key={dish}
                  type="button"
                  onClick={() => setSearchQuery(dish)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                >
                  {dish}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/recetas"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide btn-peru-primary flex items-center justify-center gap-2 select-none"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explorar Catálogo Regional</span>
            </Link>
            <Link
              href="/chef-ia"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide btn-peru-aji flex items-center justify-center gap-2 select-none"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consultar Chef IA Perú</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ─── 2. PILARES & STATS ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 text-center space-y-1 shadow-xs">
            <span className="text-3xl sm:text-4xl font-black text-[#c22929] dark:text-red-500 font-display">
              100%
            </span>
            <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
              Cálculos Deterministas
            </p>
            <span className="text-[10px] text-stone-400 block font-medium">Sin alucinaciones en costos ni porciones</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 text-center space-y-1 shadow-xs">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-display">
              3
            </span>
            <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
              Regiones Autóctonas
            </p>
            <span className="text-[10px] text-stone-400 block font-medium">Costa Marina, Sierra Andina y Selva</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 text-center space-y-1 shadow-xs">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-display">
              HACCP
            </span>
            <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
              Inocuidad Alimentaria
            </p>
            <span className="text-[10px] text-stone-400 block font-medium">Temperaturas críticas y alérgenos</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 text-center space-y-1 shadow-xs">
            <span className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 font-display">
              Chef IA
            </span>
            <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
              Asistente Conversacional
            </p>
            <span className="text-[10px] text-stone-400 block font-medium">Rescate de recetas y sustituciones</span>
          </div>
        </div>
      </section>

      {/* ─── 3. CATÁLOGO REGIONAL DESTACADO ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#c22929] uppercase tracking-wider">
              Explorador Geográfico
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-stone-900 dark:text-white">
              Recetas Emblemáticas del Perú
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Fichas técnicas con rendimiento exacto, mermas calculadas y alérgenos declarados.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
            {['Todas', 'Costa', 'Sierra', 'Selva'].map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-extrabold'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {region === 'Costa' ? '🌊 Costa' : region === 'Sierra' ? '⛰️ Sierra' : region === 'Selva' ? '🌴 Selva' : 'Todo'}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.slice(0, 6).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/recetas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wide border-2 border-stone-300 dark:border-stone-700 hover:border-[#c22929] text-stone-800 dark:text-stone-200 hover:text-[#c22929] transition-colors"
          >
            <span>Ver todas las recetas ({PERUVIAN_RECIPES.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

      {/* ─── 4. MÓDULOS PROFESIONALES DE RESTAURANTE ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 border-2 border-b-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] space-y-10 shadow-sm">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase text-[#c22929] tracking-wider block">
              Operación Integral
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-stone-900 dark:text-white">
              Herramientas de Cocina y Gestión de Restaurantes
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Diseñado tanto para cocineros en casa como para jefes de cocina, administradores y picanterías tradicionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tool 1 */}
            <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 hover:border-[#c22929] transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#c22929] flex items-center justify-center font-black text-xl shadow-xs">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-stone-900 dark:text-white font-display">
                  Escalador de Porciones
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                  Escala de 4 a 100 porciones de manera instantánea. Alerta automáticamente sobre ingredientes no lineales como sal, ají y especias.
                </p>
              </div>
              <Link
                href="/escalador"
                className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#c22929] hover:underline"
              >
                <span>Abrir calculadora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tool 2 */}
            <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xl shadow-xs">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-stone-900 dark:text-white font-display">
                  Costeo & Food Cost
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                  Calcula el costo real de materia prima por ración, margen de contribución y precios de venta sugeridos al 30%, 35% y 40% Food Cost.
                </p>
              </div>
              <Link
                href="/costeo"
                className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
              >
                <span>Simular rentabilidad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tool 3 */}
            <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 hover:border-purple-500 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-xl shadow-xs">
                  <MenuSquare className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-stone-900 dark:text-white font-display">
                  Menús & Lista de Compras
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                  Crea menús del día, ejecutivos y degustación. Genera listas de compras consolidadas descontando el stock disponible en almacén.
                </p>
              </div>
              <Link
                href="/menus"
                className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:underline"
              >
                <span>Diseñar menús</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. CHEF IA PERÚ HIGHLIGHT BANNER ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white border-2 border-b-6 border-[#c22929] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs uppercase border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligencia Artificial Gastronómica</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
              Chef IA Perú está listo para ayudarte en cocina
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-medium leading-relaxed">
              ¿Se te cortó la huancaína? ¿Estás fuera del Perú y no consigues ají amarillo fresco? ¿Necesitas organizar el mise en place para 50 personas? Pregúntale a Chef IA.
            </p>
            <div className="pt-2">
              <Link
                href="/chef-ia"
                className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide btn-peru-aji inline-flex items-center gap-2 select-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Conversar con Chef IA Ahora</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <div className="w-8 h-8 rounded-xl bg-[#c22929] flex items-center justify-center font-bold text-white text-xs">
                IA
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Chef IA Perú</h4>
                <span className="text-[10px] text-emerald-400 font-medium">● En línea para consultas</span>
              </div>
            </div>
            <div className="text-xs text-stone-300 bg-white/5 p-3 rounded-xl leading-relaxed">
              &quot;Hola. Para que el Lomo Saltado no bote agua, calienta el wok hasta humear y saltea solo 1 o 2 porciones a la vez. No muevas la carne en los primeros 30 segundos.&quot;
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 font-mono">Respuesta determinista verificada</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

