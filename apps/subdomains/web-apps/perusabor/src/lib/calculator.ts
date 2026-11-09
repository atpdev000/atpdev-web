import { Recipe, ScaledIngredient, InventoryItem } from '../types';

export interface ScalingResult {
  recipe: Recipe;
  targetPortions: number;
  scalingFactor: number;
  scaledIngredients: ScaledIngredient[];
  totalRawCostPEN: number;
  costPerPortionPEN: number;
  suggestedPrices: {
    recommended30Percent: number; // 30% Food Cost (Alta rentabilidad restaurante)
    standard35Percent: number;    // 35% Food Cost (Estándar de mercado gastronómico)
    economic40Percent: number;    // 40% Food Cost (Menú ejecutivo / menú diario)
  };
  warnings: string[];
}

/**
 * Escala una receta de forma determinista y culinariamente responsable.
 * Distingue entre ingredientes lineales (proteínas, vegetales base) e ingredientes
 * que requieren calibración sensorial en cocina (sal, ají, especias y hierbas).
 */
export function scaleRecipe(recipe: Recipe, targetPortions: number): ScalingResult {
  if (targetPortions <= 0) targetPortions = 1;
  const factor = targetPortions / recipe.baseServings;
  const warnings: string[] = [];

  if (targetPortions > 15) {
    warnings.push(
      `Escalado para producción por lotes (${targetPortions} porciones): Verifique la capacidad de sus woks u ollas. En gastronomía peruana (especialmente salteados como el Lomo Saltado), cocine en tandas máximas de 3 a 4 porciones por sartén para no perder temperatura ni hervir la carne.`
    );
  }

  let totalRawCostPEN = 0;

  const scaledIngredients: ScaledIngredient[] = recipe.ingredients.map((ing) => {
    let scaledQuantity = ing.quantity * factor;
    let culinaryWarning: string | undefined = undefined;

    // Reglas de atenuación culinaria para ingredientes no puramente lineales
    if (!ing.isScalableLinearly) {
      if (ing.name.toLowerCase().includes('sal')) {
        // La sal en lotes grandes no escala linealmente debido a la evaporación y concentración
        if (factor > 2) {
          const adjustedSal = ing.quantity * (factor * 0.85);
          culinaryWarning = `Sal ajustada al 85% de la escala lineal (${adjustedSal.toFixed(1)} ${ing.unit}). Calibre sazón gradualmente en cocina.`;
          scaledQuantity = adjustedSal;
        }
      } else if (
        ing.name.toLowerCase().includes('ají limo') ||
        ing.name.toLowerCase().includes('rocoto') ||
        ing.name.toLowerCase().includes('pimienta')
      ) {
        if (factor > 3) {
          const adjustedSpicy = ing.quantity * (factor * 0.8);
          culinaryWarning = `Picor concentrado: se recomienda dosificar al 80% inicial (${adjustedSpicy.toFixed(1)} ${ing.unit}) para no abrumar al comensal.`;
          scaledQuantity = adjustedSpicy;
        }
      } else {
        culinaryWarning = ing.scalingNote || 'Ingrediente aromático: dosificar y ajustar según prueba organoléptica.';
      }
    }

    // Calcular costo según unidad
    let itemCost = 0;
    if (ing.unit === 'g') {
      itemCost = (scaledQuantity / 1000) * ing.costPerUnitPEN;
    } else if (ing.unit === 'kg' || ing.unit === 'l') {
      itemCost = scaledQuantity * ing.costPerUnitPEN;
    } else if (ing.unit === 'ml') {
      itemCost = (scaledQuantity / 1000) * ing.costPerUnitPEN;
    } else {
      // unidad, cucharada, atado
      itemCost = scaledQuantity * ing.costPerUnitPEN;
    }

    totalRawCostPEN += itemCost;

    return {
      ...ing,
      scaledQuantity: Number(scaledQuantity.toFixed(2)),
      scaledCostPEN: Number(itemCost.toFixed(2)),
      culinaryAdjustmentWarning: culinaryWarning,
    };
  });

  const costPerPortion = totalRawCostPEN / targetPortions;

  return {
    recipe,
    targetPortions,
    scalingFactor: Number(factor.toFixed(2)),
    scaledIngredients,
    totalRawCostPEN: Number(totalRawCostPEN.toFixed(2)),
    costPerPortionPEN: Number(costPerPortion.toFixed(2)),
    suggestedPrices: {
      recommended30Percent: Number((costPerPortion / 0.30).toFixed(2)),
      standard35Percent: Number((costPerPortion / 0.35).toFixed(2)),
      economic40Percent: Number((costPerPortion / 0.40).toFixed(2)),
    },
    warnings,
  };
}

/**
 * Consolida listas de compras para un menú o plan de producción,
 * cruzando contra el inventario disponible para calcular solo el faltante neto.
 */
export interface ShoppingItem {
  ingredientName: string;
  unit: string;
  requiredAmount: number;
  availableStock: number;
  toPurchaseAmount: number;
  estimatedCostPEN: number;
  supplier?: string;
}

export function generateConsolidatedShoppingList(
  selections: { recipe: Recipe; portions: number }[],
  inventory: InventoryItem[]
): ShoppingItem[] {
  const consolidatedMap: Record<
    string,
    {
      unit: string;
      required: number;
      costPerUnit: number;
    }
  > = {};

  // Acumular cantidades de todas las recetas seleccionadas
  for (const { recipe, portions } of selections) {
    const factor = portions / recipe.baseServings;
    for (const ing of recipe.ingredients) {
      const key = ing.name.trim().toLowerCase();
      const amount = ing.quantity * factor;
      if (!consolidatedMap[key]) {
        consolidatedMap[key] = {
          unit: ing.unit,
          required: 0,
          costPerUnit: ing.costPerUnitPEN,
        };
      }
      consolidatedMap[key].required += amount;
    }
  }

  // Cruzar con existencias de inventario
  const shoppingList: ShoppingItem[] = [];

  for (const [key, data] of Object.entries(consolidatedMap)) {
    // Buscar en inventario por coincidencia aproximada
    const matchedItem = inventory.find(
      (inv) =>
        key.includes(inv.name.toLowerCase()) || inv.name.toLowerCase().includes(key)
    );

    const available = matchedItem ? matchedItem.currentStock : 0;
    // Si la unidad es gramo pero el inventario está en kg, convertir
    let normalizedRequired = data.required;
    let unitLabel = data.unit;

    if (data.unit === 'g' && (!matchedItem || matchedItem.unit === 'kg')) {
      normalizedRequired = data.required / 1000;
      unitLabel = 'kg';
    }

    const toBuy = Math.max(0, normalizedRequired - available);
    const cost = toBuy * (matchedItem ? matchedItem.costPerUnitPEN : data.costPerUnit);

    shoppingList.push({
      ingredientName: key.charAt(0).toUpperCase() + key.slice(1),
      unit: unitLabel,
      requiredAmount: Number(normalizedRequired.toFixed(2)),
      availableStock: Number(available.toFixed(2)),
      toPurchaseAmount: Number(toBuy.toFixed(2)),
      estimatedCostPEN: Number(cost.toFixed(2)),
      supplier: matchedItem ? matchedItem.supplier : 'Mercado Mayorista',
    });
  }

  return shoppingList.sort((a, b) => b.estimatedCostPEN - a.estimatedCostPEN);
}

