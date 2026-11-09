export type Region = 'Costa' | 'Sierra' | 'Selva' | 'Fusión';

export type Department = 
  | 'Lima' 
  | 'Arequipa' 
  | 'Cusco' 
  | 'Piura' 
  | 'Loreto' 
  | 'Lambayeque' 
  | 'La Libertad' 
  | 'Puno' 
  | 'Junín' 
  | 'San Martín' 
  | 'Ica' 
  | 'Ancash' 
  | 'Tacna' 
  | 'Huánuco' 
  | 'Ayacucho';

export type RecipeCategory = 
  | 'Entradas frías'
  | 'Entradas calientes y piqueos'
  | 'Sopas y caldos'
  | 'Platos principales'
  | 'Guarniciones y acompañamientos'
  | 'Salsas, ajíes y cremas'
  | 'Postres y dulces'
  | 'Bebidas'
  | 'Preparaciones festivas';

export type VerificationStatus = 'Borrador' | 'Pendiente de revisión' | 'Verificada' | 'Publicada';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'unidad' | 'cucharada' | 'cucharadita' | 'atado' | 'pizca';
  grossWeightGrams?: number;
  netWeightGrams?: number;
  wastePercentage: number; // Porcentaje de merma (0-100)
  costPerUnitPEN: number;  // Costo por kg o litro o unidad
  isScalableLinearly: boolean; // false para sal, ajíes picantes, leudantes
  scalingNote?: string;
  notes?: string; // mise en place (ej: "en brunoise fina", "en juliana")
}

export interface PreparationStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timeMinutes?: number;
  temperature?: string;
  criticalControlPoint?: string; // Punto Crítico de Control (inocuidad)
  visualCue?: string; // Señal visual (ej: "hasta que tome punto de hilo", "carne sellada con costra")
}

export interface Recipe {
  id: string;
  slug: string;
  name: string;
  alternativeNames: string[];
  tagline: string;
  description: string;
  region: Region;
  department: Department;
  locality?: string;
  category: RecipeCategory;
  imageUrl?: string;
  
  // Ficha técnica operativa
  baseServings: number;
  servingSizeGrams: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  restTimeMinutes?: number;
  difficulty: 'Fácil' | 'Media' | 'Avanzada' | 'Maestro';
  
  ingredients: Ingredient[];
  steps: PreparationStep[];
  equipmentNeeded: string[];
  
  // Alérgenos y seguridad
  allergens: string[];
  dietaryTags: string[];
  foodSafetyWarnings: string[];
  shelfLifeAndStorage: string;
  
  // Servicio y presentación
  presentationNotes: string;
  pairings: {
    sauces: string[];
    drinks: string[];
    sides: string[];
    desserts: string[];
  };
  
  // Gobernanza y procedencia
  traditionalSource: string;
  verificationStatus: VerificationStatus;
  reviewedBy?: string;
  lastUpdated: string;
  regionalVariants: string[];
  
  // Costeo referencial base (Soles PEN)
  baseRawCostPEN: number;
  suggestedPricePEN: number;
  suggestedSalePricePEN?: number;
}

export interface ScaledIngredient extends Ingredient {
  scaledQuantity: number;
  scaledGrossGrams?: number;
  scaledCostPEN: number;
  culinaryAdjustmentWarning?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Carnes y Pescados' | 'Verduras y Frutas' | 'Abarrotes' | 'Lácteos' | 'Especias y Ajíes' | 'Bebidas';
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnitPEN: number;
  supplier: string;
  lastRestockDate: string;
  expirationDate?: string;
}

export interface RestaurantTable {
  id: number;
  number: string;
  capacity: number;
  location: 'Salón Principal' | 'Terraza' | 'Bar' | 'Privado VIP';
  status: 'libre' | 'ocupada' | 'comanda_activa' | 'cuenta_solicitada';
  currentOrderId?: string;
}

export interface OrderItem {
  recipeId: string;
  recipeName: string;
  quantity: number;
  unitPricePEN: number;
  notes?: string;
}

export interface RestaurantOrder {
  id: string;
  tableNumber: string;
  serverName: string;
  guestCount: number;
  items: OrderItem[];
  status: 'borrador' | 'confirmado' | 'en_cocina' | 'listo' | 'entregado' | 'cobrado';
  createdAt: string;
  totalPEN: number;
}

export interface MenuPlan {
  id: string;
  type: 'diario' | 'ejecutivo' | 'turistico' | 'degustacion' | 'economico';
  title: string;
  description: string;
  regionFocus: Region;
  dishes: {
    starter: Recipe;
    main: Recipe;
    drink: Recipe;
    dessert?: Recipe;
  };
  targetPricePEN: number;
  estimatedCostPEN: number;
  foodCostPercent: number;
  marginContributionPEN: number;
}

export interface ChefIAMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recipeContext?: string;
  suggestedActions?: string[];
}

