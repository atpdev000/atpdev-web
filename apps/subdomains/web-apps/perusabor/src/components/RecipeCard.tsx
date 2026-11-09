import React from 'react';
import Link from 'next/link';
import { Clock, Users, Flame, ArrowRight, ShieldAlert, Sparkles, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const getRegionStyle = (region: string) => {
    switch (region) {
      case 'Costa':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'Sierra':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'Selva':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30';
    }
  };

  return (
    <div className="rounded-3xl border-2 border-b-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] hover:border-[#c22929] dark:hover:border-red-600 transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-xs">
      
      {/* Top Banner / Image Area */}
      <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-900 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 via-red-500/20 to-stone-900 text-stone-400">
            <ChefHat className="w-12 h-12 stroke-1" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wider border backdrop-blur-md ${getRegionStyle(recipe.region)}`}>
            {recipe.region} • {recipe.department}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-stone-900/80 text-white font-bold text-[10px] uppercase backdrop-blur-md">
            {recipe.category}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>{recipe.baseServings} porciones</span>
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              <span>{recipe.difficulty}</span>
            </span>
          </div>

          <h3 className="text-xl font-black font-display text-stone-900 dark:text-white group-hover:text-[#c22929] transition-colors leading-snug">
            {recipe.name}
          </h3>

          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium line-clamp-2 leading-relaxed">
            {recipe.tagline}
          </p>
        </div>

        {/* Cost & Action Bar */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Costo Base / Porción
            </span>
            <span className="text-sm font-black text-stone-900 dark:text-stone-100">
              S/ {(recipe.baseRawCostPEN / recipe.baseServings).toFixed(2)}
            </span>
          </div>

          <Link
            href={`/recetas/${recipe.slug}`}
            className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide btn-peru-primary flex items-center gap-1.5 select-none"
          >
            <span>Ficha Técnica</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default RecipeCard;

