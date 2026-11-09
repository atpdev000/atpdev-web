import { PERUVIAN_RECIPES } from '../data/recipes';
import { scaleRecipe } from './calculator';

export interface ChefResponse {
  answer: string;
  recipeReferenced?: string;
  suggestedActions: string[];
}

export const CHEF_IA_SYSTEM_PROMPT = `
Eres Chef IA Perú, el asistente gastronómico inteligente especializado en la cocina tradicional, regional y contemporánea del Perú, así como en la operación profesional de restaurantes peruanos.

Principios rectores:
1. Hablas en español con calidez peruana, rigor técnico culinario y máxima claridad profesional.
2. Distingues siempre entre tradición documentada, variante regional y adaptación contemporánea.
3. Jamás inventas que un ingrediente está en stock o que un precio es oficial sin datos verificados.
4. Para cálculos de porciones, costos y mermas, aplicas funciones deterministas y adviertes sobre ingredientes que no escalan linealmente (sal, ajíes picantes, leudantes).
5. En inocuidad alimentaria (como ceviches de pescado crudo o aves), eres intransigente con la cadena de frío y temperaturas seguras.
`.trim();

/**
 * Procesa consultas culinarias para Chef IA Perú con lógica contextual experta.
 */
export function queryChefIAPeru(userMessage: string, currentRecipeSlug?: string): ChefResponse {
  const query = userMessage.toLowerCase().trim();

  // Contexto de receta actual si existe
  const activeRecipe = currentRecipeSlug 
    ? PERUVIAN_RECIPES.find((r) => r.slug === currentRecipeSlug)
    : undefined;

  // 1. Preguntas de Escalado de Porciones
  const portionMatch = query.match(/(\d+)\s*(porciones|personas|comensales|platos)/i);
  if (portionMatch && (activeRecipe || query.includes('ceviche') || query.includes('lomo') || query.includes('ají') || query.includes('seco'))) {
    const targetPortions = parseInt(portionMatch[1], 10);
    const recipeToScale = activeRecipe || 
      (query.includes('lomo') ? PERUVIAN_RECIPES.find(r => r.slug.includes('lomo')) : 
       query.includes('ceviche') ? PERUVIAN_RECIPES.find(r => r.slug.includes('ceviche')) :
       query.includes('ají') || query.includes('gallina') ? PERUVIAN_RECIPES.find(r => r.slug.includes('aji-de-gallina')) :
       PERUVIAN_RECIPES[0]);

    if (recipeToScale) {
      const scaled = scaleRecipe(recipeToScale, targetPortions);
      const warningsText = scaled.warnings.length > 0 ? `\n\n⚠️ **Alerta Culinaria:**\n${scaled.warnings.join('\n')}` : '';

      return {
        answer: `👨‍🍳 **Cálculo de Porciones para ${recipeToScale.name} (${targetPortions} porciones):**\n\n` +
          `La receta base rinde **${recipeToScale.baseServings} porciones**. Aplicamos un factor de escala de **${scaled.scalingFactor}x**.\n\n` +
          `**Ingredientes calculados:**\n` +
          scaled.scaledIngredients.map(ing => `• **${ing.name}:** ${ing.scaledQuantity} ${ing.unit}${ing.culinaryAdjustmentWarning ? ` *(⚠️ ${ing.culinaryAdjustmentWarning})*` : ''}`).join('\n') +
          `\n\n💰 **Costeo estimado de insumos:**\n• Costo total de materia prima: **S/ ${scaled.totalRawCostPEN.toFixed(2)} PEN**\n• Costo por porción: **S/ ${scaled.costPerPortionPEN.toFixed(2)} PEN**\n• Precio de venta sugerido (35% Food Cost estándar): **S/ ${scaled.suggestedPrices.standard35Percent.toFixed(2)} PEN**` +
          warningsText,
        recipeReferenced: recipeToScale.slug,
        suggestedActions: [
          `Ver ficha técnica de ${recipeToScale.name}`,
          `¿Cómo organizar el mise en place para ${targetPortions} personas?`,
          `Generar lista de compras para este pedido`
        ]
      };
    }
  }

  // 2. Rescate Culinario / Emergencias en Cocina
  if (query.includes('cortó') || query.includes('corta') || query.includes('separó')) {
    return {
      answer: `🚨 **Rescate Culinario de Chef IA Perú: Salsa o Crema Cortada**\n\n` +
        `Si tu salsa (crema de ají, huancaína, mayonesa o emulsión) se separó, no la descartes. Se debe a un desbalance entre la grasa y el líquido o temperatura inadecuada:\n\n` +
        `1. **Técnica de la Cuchara de Agua Tibia:** En un bowl limpio, coloca 1 cucharada sopera de agua tibia o leche tibia. Con batidor de alambre o licuadora a velocidad mínima, ve vertiendo la salsa cortada **gota a gota** en el centro hasta que la emulsión ligue de nuevo.\n` +
        `2. **Técnica de la Yema Fresca:** Si la base lleva huevo, coloca una yema fresca a temperatura ambiente y añade la salsa cortada en un hilo continuo mientras bates vigorosamente.\n` +
        `3. **En el Ají de Gallina:** Si el aderezo cortó el aceite, añade 2 cucharadas de caldo caliente y bate enérgicamente con cuchara de madera en forma de ocho.`,
      suggestedActions: [
        '¿Por qué se corta la Huancaína?',
        'Ver receta de Ají de Gallina Cremoso',
        'Tiempos y temperaturas de cocción'
      ]
    };
  }

  if (query.includes('ácido') || query.includes('acidez') || query.includes('agrio')) {
    return {
      answer: `🍋 **Equilibrio de Acidez en la Cocina Peruana:**\n\n` +
        `• **Si el Ceviche quedó muy ácido:** Añade de inmediato 2 a 3 cubos de hielo macizo y mueve por 30 segundos; el frío y la dilución controlada suavizan el ácido cítrico y emulsionan la leche de tigre. También puedes añadir un chorrito de chilcano de pescado frío sin sal.\n` +
        `• **Si el Seco de Cabrito quedó muy fuerte por la chicha:** Agrega un trozo extra de zapallo loche rallado o una pizca de azúcar rubia y deja cocer destapado 5 minutos para evaporar el ácido acético.\n` +
        `• **Regla de oro con el Limón Sutil:** Exprime siempre a mano con suavidad al 75% de su capacidad. Apretar la cáscara libera aceites amargos (limoneno) que intensifican un sabor punzante desagradable.`,
      suggestedActions: [
        'Ver receta de Ceviche Clásico',
        '¿Cómo elegir los mejores limones sutiles?',
        'Ficha técnica del Seco de Cabrito'
      ]
    };
  }

  if (query.includes('agua') || query.includes('boto agua') || query.includes('hervido') || query.includes('wok')) {
    return {
      answer: `🔥 **Clave del Lomo Saltado: ¿Por qué la carne bota agua y se hierve?**\n\n` +
        `El error más común en el Lomo Saltado es sobrecargar el sartén:\n` +
        `1. **Capacidad térmica:** Una hornilla doméstica no tiene la potencia de un fogón chifero (25,000 BTU). Saltea un máximo de **1 a 2 porciones por tanda**.\n` +
        `2. **Temperatura extrema:** El sartén o wok debe humear intensamente antes de que la carne toque el metal.\n` +
        `3. **No mover de inmediato:** Deja la carne quieta 30 a 40 segundos para que caramelice y forme costra dorada que selle sus jugos.\n` +
        `4. **El corte:** Corta en bastones gruesos (2x4 cm) y a contrafibra. Los tomates deben ir despepitados para no aportar exceso de líquido.`,
      suggestedActions: [
        'Ver ficha técnica de Lomo Saltado Criollo',
        '¿Qué sartén usar si no tengo wok?',
        'Sustituciones para el sillao tradicional'
      ]
    };
  }

  // 3. Sustituciones Culinarias en el Extranjero
  if (query.includes('extranjero') || query.includes('sustituir') || query.includes('reemplazo') || query.includes('no tengo ají')) {
    return {
      answer: `🌍 **Guía de Sustituciones Culinarias de Chef IA Perú (Para Cocinar Fuera del País):**\n\n` +
        `• **Ají Amarillo:**\n` +
        `  - *Mejor opción:* Pasta de ají amarillo peruana en frasco (disponible en tiendas latinas).\n` +
        `  - *Opción fresca:* Pimientos amarillos dulces blanqueados + 1 trocito de jalapeño o ají habanero sin semillas para dar picor.\n\n` +
        `• **Zapallo Loche (para Seco o Arroz con Pato):**\n` +
        `  - *Sustituto:* Zapallo Butternut (calabaza moscada) asada con una pizca de nuez moscada y semillas de culantro tostadas.\n\n` +
        `• **Chicha de Jora:**\n` +
        `  - *Sustituto para guisos:* Mezcla 70% cerveza rubia o artesanal de trigo + 30% sidra de manzana o vinagre de manzana suave con media cucharadita de comino tostado.\n\n` +
        `• **Papa Amarilla Peruana:**\n` +
        `  - *Sustituto:* Papa Yukon Gold o papas criollas colombianas pequeñas por su textura harinosa y mantequillosa.`,
      suggestedActions: [
        '¿Cómo conservar pasta de ají amarillo casera?',
        'Receta de Ají de Gallina adaptado',
        'Ver ingredientes de la gastronomía peruana'
      ]
    };
  }

  // 4. Consulta sobre recetas específicas
  if (query.includes('ceviche')) {
    const ceviche = PERUVIAN_RECIPES.find(r => r.slug.includes('ceviche'))!;
    return {
      answer: `🐟 **${ceviche.name} — El Secreto del Éxito:**\n\n` +
        `El secreto del ceviche peruano moderno radica en la **inmediatez**: el pescado no se "cocina" durante horas en limón como en el siglo XIX, sino que se cura al momento (30 a 60 segundos).\n\n` +
        `**Los 3 pilares del ceviche:**\n` +
        `1. **Temperatura:** El pescado debe estar a menos de 3°C. Trabaja sobre un bowl frío frotado con ají limo.\n` +
        `2. **Sal primero:** Masajea el pescado con sal marina antes del limón. La sal penetra las fibras musculares y prepara la emulsión de la leche de tigre.\n` +
        `3. **Limón sutil fresco:** Exprimido al momento y a mano con presión suave. Si exprimes la piel blanca (albedo), se liberan aceites amargos.`,
      recipeReferenced: ceviche.slug,
      suggestedActions: [
        'Escalar Ceviche para 10 personas',
        'Ver Ficha Técnica completa del Ceviche',
        '¿Qué pescados son los más recomendados?'
      ]
    };
  }

  if (query.includes('pisco sour')) {
    const pisco = PERUVIAN_RECIPES.find(r => r.slug.includes('pisco'))!;
    return {
      answer: `🍸 **Pisco Sour Clásico — La Regla de Oro 3-1-1:**\n\n` +
        `La fórmula canónica equilibrada por los grandes maestros pisqueros:\n` +
        `• **3 partes:** Pisco Puro Quebranta (aporta cuerpo y aroma sin invadir).\n` +
        `• **1 parte:** Jugo de limón sutil recién exprimido y colado.\n` +
        `• **1 parte:** Jarabe de goma simple (1 parte de agua por 1 de azúcar disuelta).\n` +
        `• **1/2 parte:** Clara de huevo fresca (aporta textura aterciopelada).\n` +
        `• **Hielo macizo:** 5 a 6 cubos para agitar con máxima fuerza (15 segundos).\n` +
        `• **Toque final:** 2 a 3 gotas de Amargo de Angostura sobre la espuma para neutralizar aromas de la clara.`,
      recipeReferenced: pisco.slug,
      suggestedActions: [
        'Ver Ficha Técnica de Pisco Sour',
        'Diferencia entre Pisco Quebranta e Italia',
        '¿Cómo preparar jarabe de goma casero?'
      ]
    };
  }

  // 5. Respuesta por defecto orientadora
  return {
    answer: `👨‍🍳 ¡Hola! Soy **Chef IA Perú**, tu asesor culinario y de gestión gastronómica.\n\n` +
      `Puedo ayudarte con:\n` +
      `• **Fichas Técnicas & Recetas:** Consultar ingredientes exactos, técnicas de sellado, fondos y secretos tradicionales.\n` +
      `• **Escalado de Porciones:** Calcular cantidades para 4, 10, 25 o 100 comensales con advertencias culinarias en sal y ajíes.\n` +
      `• **Rescate Culinario:** Solucionar salsas cortadas, exceso de acidez, lomos que botaron agua o carnes duras.\n` +
      `• **Sustituciones en el Extranjero:** Adaptar insumos tradicionales si no encuentras ají amarillo, loche o chicha de jora.\n` +
      `• **Costeo & Rentabilidad:** Calcular Food Cost, margen de contribución y precio sugerido en carta.\n\n` +
      `¿Qué plato o desafío culinario deseas consultar hoy?`,
    suggestedActions: [
      '¿Cómo preparar un Ceviche perfecto?',
      'Secreto para que el Lomo Saltado no bote agua',
      'Escalar Ají de Gallina para 20 personas',
      'Fórmula tradicional del Pisco Sour 3-1-1'
    ]
  };
}

