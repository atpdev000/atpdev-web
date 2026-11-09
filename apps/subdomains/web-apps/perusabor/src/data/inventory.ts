import { InventoryItem } from '../types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-pescado-blanco',
    name: 'Filete de Corvina / Lenguado',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 12.5,
    minStock: 5.0,
    costPerUnitPEN: 38.00,
    supplier: 'Terminal Pesquero de Villa María / Chorrillos',
    lastRestockDate: '2026-11-08',
    expirationDate: '2026-11-11'
  },
  {
    id: 'inv-lomo-fino',
    name: 'Lomo fino de res (Corte limpio)',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 18.0,
    minStock: 8.0,
    costPerUnitPEN: 58.00,
    supplier: 'Camal Frigorífico de Yerbateros',
    lastRestockDate: '2026-11-07',
    expirationDate: '2026-11-14'
  },
  {
    id: 'inv-gallina-chacra',
    name: 'Pechuga de gallina / Gallina entera',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 15.0,
    minStock: 6.0,
    costPerUnitPEN: 18.00,
    supplier: 'Distribuidora Avícola San Fernando',
    lastRestockDate: '2026-11-08'
  },
  {
    id: 'inv-cabrito-lechal',
    name: 'Cabrito lechal norteño trozado',
    category: 'Carnes y Pescados',
    unit: 'kg',
    currentStock: 6.0,
    minStock: 8.0, // Alert: Low Stock!
    costPerUnitPEN: 36.00,
    supplier: 'Criaderos de Olmos / Chiclayo',
    lastRestockDate: '2026-11-04'
  },
  {
    id: 'inv-limon-sutil',
    name: 'Limón sutil norteño verde',
    category: 'Verduras y Frutas',
    unit: 'kg',
    currentStock: 25.0,
    minStock: 10.0,
    costPerUnitPEN: 5.50,
    supplier: 'Mercado Mayorista de Santa Anita (Pabellón C)',
    lastRestockDate: '2026-11-08'
  },
  {
    id: 'inv-cebolla-roja',
    name: 'Cebolla roja arequipeña de exportación',
    category: 'Verduras y Frutas',
    unit: 'kg',
    currentStock: 35.0,
    minStock: 12.0,
    costPerUnitPEN: 4.50,
    supplier: 'Mercado Mayorista de Santa Anita',
    lastRestockDate: '2026-11-06'
  },
  {
    id: 'inv-aji-amarillo',
    name: 'Ají amarillo fresco seleccionado',
    category: 'Especias y Ajíes',
    unit: 'kg',
    currentStock: 8.0,
    minStock: 4.0,
    costPerUnitPEN: 6.50,
    supplier: 'Productores de Huacho y Chancay',
    lastRestockDate: '2026-11-07'
  },
  {
    id: 'inv-aji-limo',
    name: 'Ají limo rojo y amarillo norteño',
    category: 'Especias y Ajíes',
    unit: 'kg',
    currentStock: 2.2,
    minStock: 3.0, // Alert: Low Stock!
    costPerUnitPEN: 9.00,
    supplier: 'Productores de Casma',
    lastRestockDate: '2026-11-06'
  },
  {
    id: 'inv-papa-amarilla',
    name: 'Papa amarilla Tumbay seleccionada',
    category: 'Verduras y Frutas',
    unit: 'kg',
    currentStock: 45.0,
    minStock: 15.0,
    costPerUnitPEN: 5.50,
    supplier: 'Comunidades Agrícolas de Huánuco',
    lastRestockDate: '2026-11-07'
  },
  {
    id: 'inv-zapallo-loche',
    name: 'Zapallo loche lambayecano auténtico',
    category: 'Verduras y Frutas',
    unit: 'kg',
    currentStock: 1.5,
    minStock: 3.0, // Alert: Low Stock!
    costPerUnitPEN: 22.00,
    supplier: 'Cooperativa Agraria de Túcume (Lambayeque)',
    lastRestockDate: '2026-11-02'
  },
  {
    id: 'inv-pisco-quebranta',
    name: 'Pisco Puro Quebranta D.O. (Botella 750ml)',
    category: 'Bebidas',
    unit: 'unidad',
    currentStock: 24,
    minStock: 10,
    costPerUnitPEN: 55.00,
    supplier: 'Bodega Pisquera Tradicional de Ica',
    lastRestockDate: '2026-11-01'
  },
  {
    id: 'inv-chicha-jora',
    name: 'Chicha de jora norteña artesanal',
    category: 'Bebidas',
    unit: 'l',
    currentStock: 10.0,
    minStock: 5.0,
    costPerUnitPEN: 6.00,
    supplier: 'Picantería El Cántaro (Chiclayo)',
    lastRestockDate: '2026-11-07'
  },
  {
    id: 'inv-leche-evaporada',
    name: 'Leche evaporada entera (Lata 400g)',
    category: 'Lácteos',
    unit: 'unidad',
    currentStock: 48,
    minStock: 12,
    costPerUnitPEN: 4.80,
    supplier: 'Distribuidora Mayorista Almacenes Gloria',
    lastRestockDate: '2026-11-05'
  },
  {
    id: 'inv-queso-paria',
    name: 'Queso Paria arequipeño madurado',
    category: 'Lácteos',
    unit: 'kg',
    currentStock: 7.5,
    minStock: 4.0,
    costPerUnitPEN: 28.00,
    supplier: 'Lácteos Majes / Arequipa',
    lastRestockDate: '2026-11-06'
  }
];

