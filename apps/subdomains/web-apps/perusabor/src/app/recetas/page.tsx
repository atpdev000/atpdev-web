'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  BookOpen, 
  ChefHat, 
  Flame, 
  Clock, 
  Users, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { PERUVIAN_RECIPES } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';

export default function RecetasPage() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');

  const categories = [
    'Todas',
    'Entradas frías',
    'Platos principales',
    'Postres y dulces',
    'Bebidas'
  ];

  const filtered = PERUVIAN_RECIPES.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    const matchRegion = selectedRegion === 'Todas' || r.region === selectedRegion;
    const matchCategory = selectedCategory === 'Todas' || r.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'Todas' || r.difficulty === selectedDifficulty;

    return matchSearch && matchRegion && matchCategory && matchDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#c22929] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-stone-900 dark:text-white tracking-tight">
          Catálogo Gastronómico del Perú
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-medium">
          Fichas técnicas profesionales, rendimiento, mermas de insumos y puntos críticos de control de temperatura e inocuidad.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#13110f] border-2 border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por plato, ingrediente clave o localidad..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:border-[#c22929]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-stone-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Región:</span>
            </span>
            {['Todas', 'Costa', 'Sierra', 'Selva'].map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-[#c22929] text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400">Categoría:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-800 space-y-4">
          <ChefHat className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-bold text-lg text-stone-700 dark:text-stone-300">
            No se encontraron recetas con los filtros aplicados
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Intenta limpiando la búsqueda o seleccionando otra región natural del Perú.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedRegion('Todas');
              setSelectedCategory('Todas');
            }}
            className="px-4 py-2 rounded-xl bg-[#c22929] text-white font-bold text-xs"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

    </div>
  );
}

