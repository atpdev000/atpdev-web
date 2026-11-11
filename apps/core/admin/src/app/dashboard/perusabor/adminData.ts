export interface AdminRecipeItem {
  id: string;
  name: string;
  region: 'Costa' | 'Sierra' | 'Selva';
  department: string;
  baseServings: number;
  baseRawCostPEN: number;
  suggestedPricePEN: number;
  verificationStatus: 'Borrador' | 'Pendiente de revisión' | 'Verificada' | 'Publicada';
  category: string;
}

export interface AdminInventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnitPEN: number;
  supplier: string;
}

export const ADMIN_PERUVIAN_RECIPES: AdminRecipeItem[] = [
  {
    id: 'rec-ceviche-clasico',
    name: 'Ceviche Clásico de Pescado',
    region: 'Costa',
    department: 'Lima',
    baseServings: 4,
    baseRawCostPEN: 18.50,
    suggestedPricePEN: 38.00,
    verificationStatus: 'Publicada',
    category: 'Entradas frías'
  },
  {
    id: 'rec-lomo-saltado',
    name: 'Lomo Saltado Criollo Tradicional',
    region: 'Costa',
    department: 'Lima',
    baseServings: 4,
    baseRawCostPEN: 22.80,
    suggestedPricePEN: 46.00,
    verificationStatus: 'Publicada',
    category: 'Platos principales'
  },
  {
    id: 'rec-aji-de-gallina',
    name: 'Ají de Gallina Cremoso Tradicional',
    region: 'Costa',
    department: 'Lima',
    baseServings: 4,
    baseRawCostPEN: 14.20,
    suggestedPricePEN: 34.00,
    verificationStatus: 'Publicada',
    category: 'Platos principales'
  },
  {
    id: 'rec-rocoto-relleno',
    name: 'Rocoto Relleno Arequipeño',
    region: 'Sierra',
    department: 'Arequipa',
    baseServings: 4,
    baseRawCostPEN: 16.50,
    suggestedPricePEN: 38.00,
    verificationStatus: 'Publicada',
    category: 'Platos principales'
  },
  {
    id: 'rec-juane-gallina',
    name: 'Juane de Gallina Amazónico Tradicional',
    region: 'Selva',
    department: 'Loreto',
    baseServings: 4,
    baseRawCostPEN: 15.80,
    suggestedPricePEN: 36.00,
    verificationStatus: 'Publicada',
    category: 'Platos principales'
  },
  {
    id: 'rec-seco-cabrito',
    name: 'Seco de Cabrito a la Norteña',
    region: 'Costa',
    department: 'Lambayeque',
    baseServings: 4,
    baseRawCostPEN: 21.00,
    suggestedPricePEN: 48.00,
    verificationStatus: 'Publicada',
    category: 'Platos principales'
  },
  {
    id: 'rec-suspiro-limena',
    name: 'Suspiro a la Limeña Tradicional',
    region: 'Costa',
    department: 'Lima',
    baseServings: 6,
    baseRawCostPEN: 7.20,
    suggestedPricePEN: 18.00,
    verificationStatus: 'Publicada',
    category: 'Postres y dulces'
  },
  {
    id: 'rec-pisco-sour',
    name: 'Pisco Sour Clásico (Fórmula 3-1-1)',
    region: 'Costa',
    department: 'Ica',
    baseServings: 1,
    baseRawCostPEN: 6.80,
    suggestedPricePEN: 28.00,
    verificationStatus: 'Publicada',
    category: 'Bebidas'
  }
];

export const ADMIN_INVENTORY: AdminInventoryItem[] = [
  {
    id: 'inv-pescado-blanco',
    name: 'Filete de Corvina / Lenguado',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 12.5,
    minStock: 5.0,
    costPerUnitPEN: 38.00,
    supplier: 'Terminal Pesquero de Villa María / Chorrillos'
  },
  {
    id: 'inv-lomo-fino',
    name: 'Lomo fino de res (Corte limpio)',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 18.0,
    minStock: 8.0,
    costPerUnitPEN: 58.00,
    supplier: 'Camal Frigorífico de Yerbateros'
  },
  {
    id: 'inv-gallina-chacra',
    name: 'Pechuga de gallina / Gallina entera',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 15.0,
    minStock: 6.0,
    costPerUnitPEN: 18.00,
    supplier: 'Distribuidora Avícola San Fernando'
  },
  {
    id: 'inv-cabrito-lechal',
    name: 'Cabrito lechal norteño trozado',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 6.0,
    minStock: 8.0, // Alert: Low Stock!
    costPerUnitPEN: 36.00,
    supplier: 'Criaderos de Olmos / Chiclayo'
  },
  {
    id: 'inv-limon-sutil',
    name: 'Limón sutil norteño verde',
    category: 'Verduras y Frutas',
    unit: 'kg',
    currentStock: 25.0,
    minStock: 10.0,
    costPerUnitPEN: 5.50,
    supplier: 'Mercado Mayorista de Santa Anita'
  },
  {
    id: 'inv-cebolla-roja',
    name: 'Cebolla roja arequipeña',
    category: 'Verduras y Frutas',
    unit: 'kg',
    currentStock: 35.0,
    minStock: 12.0,
    costPerUnitPEN: 4.50,
    supplier: 'Mercado Mayorista de Santa Anita'
  },
  {
    id: 'inv-aji-amarillo',
    name: 'Ají amarillo fresco seleccionado',
    category: 'Especias y Ajíes',
    unit: 'kg',
    currentStock: 8.0,
    minStock: 4.0,
    costPerUnitPEN: 6.50,
    supplier: 'Productores de Huacho y Chancay'
  },
  {
    id: 'inv-aji-limo',
    name: 'Ají limo rojo y amarillo norteño',
    category: 'Especias y Ajíes',
    unit: 'kg',
    currentStock: 2.2,
    minStock: 3.0, // Alert: Low Stock!
    costPerUnitPEN: 9.00,
    supplier: 'Productores de Casma'
  },
  {
    id: 'inv-pisco-quebranta',
    name: 'Pisco Puro Quebranta D.O. (750ml)',
    category: 'Bebidas',
    unit: 'unidad',
    currentStock: 24,
    minStock: 10,
    costPerUnitPEN: 55.00,
    supplier: 'Bodega Pisquera Tradicional de Ica'
  }
];

