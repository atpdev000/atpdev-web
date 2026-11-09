import { Recipe } from '../types';

export const PERUVIAN_RECIPES: Recipe[] = [
  // ─── 1. CEVICHE CLÁSICO DE PESCADO (COSTA) ──────────────────────────────────
  {
    id: 'rec-ceviche-clasico',
    slug: 'ceviche-clasico-pescado',
    name: 'Ceviche Clásico de Pescado',
    alternativeNames: ['Cebiche Criollo', 'Ceviche Tradicional'],
    tagline: 'Patrimonio Cultural Inmaterial de la Humanidad (UNESCO). Frescura marina, limón sutil y ají limo en 5 minutos.',
    description: 'La máxima expresión del mar peruano. Cubos limpios de pescado blanco fresco marinados al instante con jugo de limón sutil recién exprimido sin apretar la cáscara, cebolla roja crujiente, ají limo aromático y culantro.',
    region: 'Costa',
    department: 'Lima',
    locality: 'Costa Central y Norte',
    category: 'Entradas frías',
    imageUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=1200&q=80',
    baseServings: 4,
    servingSizeGrams: 280,
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    restTimeMinutes: 3,
    difficulty: 'Media',
    ingredients: [
      {
        id: 'ing-pescado-blanco',
        name: 'Filete de pescado blanco fresco (Corvina, Lenguado o Mero)',
        quantity: 600,
        unit: 'g',
        grossWeightGrams: 750,
        netWeightGrams: 600,
        wastePercentage: 20,
        costPerUnitPEN: 38.0,
        isScalableLinearly: true,
        notes: 'Cortado en cubos de 1.5 a 2 cm, bien frío entre 0°C y 3°C'
      },
      {
        id: 'ing-limon-sutil',
        name: 'Limón sutil fresco peruano (jugo)',
        quantity: 12,
        unit: 'unidad',
        wastePercentage: 50,
        costPerUnitPEN: 0.35,
        isScalableLinearly: true,
        notes: 'Exprimir a mano suavemente a 3/4 de su capacidad para no amargar con el aceite del hollejo'
      },
      {
        id: 'ing-cebolla-roja',
        name: 'Cebolla roja en pluma fina',
        quantity: 1.5,
        unit: 'unidad',
        grossWeightGrams: 280,
        netWeightGrams: 240,
        wastePercentage: 14,
        costPerUnitPEN: 4.5,
        isScalableLinearly: true,
        notes: 'Lavada en agua helada con hielo para mantener textura crocante y eliminar exceso de azufre'
      },
      {
        id: 'ing-aji-limo',
        name: 'Ají limo finamente picado en brunoise',
        quantity: 2,
        unit: 'unidad',
        wastePercentage: 15,
        costPerUnitPEN: 0.8,
        isScalableLinearly: false,
        scalingNote: 'Ajustar al gusto; en lotes mayores a 10 porciones reducir ratio en 30% para no saturar el picor',
        notes: 'Despepitado y sin venas si se desea picor moderado'
      },
      {
        id: 'ing-culantro',
        name: 'Culantro fresco picado fino',
        quantity: 2,
        unit: 'cucharada',
        wastePercentage: 25,
        costPerUnitPEN: 2.0,
        isScalableLinearly: false,
        scalingNote: 'Agregar con moderación para aportar frescura aromática sin teñir la leche de tigre'
      },
      {
        id: 'ing-sal-marina',
        name: 'Sal marina fina',
        quantity: 1,
        unit: 'cucharadita',
        wastePercentage: 0,
        costPerUnitPEN: 0.05,
        isScalableLinearly: false,
        scalingNote: 'Salazonar el pescado primero para abrir los poros celulares antes de agregar el limón'
      },
      {
        id: 'ing-camote-glaseado',
        name: 'Camote cocido o glaseado en rodajas',
        quantity: 2,
        unit: 'unidad',
        wastePercentage: 20,
        costPerUnitPEN: 3.0,
        isScalableLinearly: true,
        notes: 'Acompañamiento clásico para amortiguar la acidez'
      },
      {
        id: 'ing-choclo-desgranado',
        name: 'Choclo tierno desgranado cocido',
        quantity: 200,
        unit: 'g',
        wastePercentage: 35,
        costPerUnitPEN: 6.0,
        isScalableLinearly: true,
        notes: 'Hervido con granos de anís y unas gotas de limón para mantener blancura'
      },
      {
        id: 'ing-cancha-serrana',
        name: 'Canchita serrana tostada crujiente',
        quantity: 100,
        unit: 'g',
        wastePercentage: 5,
        costPerUnitPEN: 7.0,
        isScalableLinearly: true
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Mise en place y curado del pescado',
        instruction: 'Colocar los cubos de pescado frío en un bowl previamente enfriado o sobre una cama de hielo. Frotar el bowl con medio ají limo. Agregar la sal marina directamente al pescado y masajear con suavidad durante 30 segundos para permitir que la proteína absorba la sal.',
        criticalControlPoint: 'Mantener cadena de frío del pescado crudo por debajo de 4°C en todo momento.',
        visualCue: 'La carne del pescado se vuelve ligeramente brillante y firme al tacto.'
      },
      {
        stepNumber: 2,
        title: 'Adición de aromáticos y ají limo',
        instruction: 'Incorporar el ají limo picado y una cucharada de culantro. Mezclar delicadamente con cuchara de acero inoxidable fría.',
        timeMinutes: 1
      },
      {
        stepNumber: 3,
        title: 'El toque maestro de limón sutil',
        instruction: 'Exprimir los limones directamente sobre el pescado a través de un colador, ejerciendo solo una presión suave al 75%. Mezclar durante 45 a 60 segundos hasta que la leche de tigre tome su color nacarado lechoso.',
        visualCue: 'El jugo del fondo se emulsifica con las proteínas del pescado adquiriendo tono blanco lechoso.',
        timeMinutes: 1
      },
      {
        stepNumber: 4,
        title: 'Emplatado y servicio inmediato',
        instruction: 'Agregar la mitad de la cebolla roja en pluma y mezclar una última vez. Servir inmediatamente en plato hondo frío coronando con el resto de la cebolla fresca por encima. Acompañar con rodajas de camote cocido, choclo tierno desgranado y canchita tostada.',
        timeMinutes: 2
      }
    ],
    equipmentNeeded: ['Bowl de acero inoxidable o vidrio enfriado', 'Cuchillo de chef afilado', 'Exprimidor manual o mano firme', 'Colador fino'],
    allergens: ['Pescado'],
    dietaryTags: ['Sin Gluten (Verificar Cancha)', 'Rico en Omega-3', 'Alto en Proteína'],
    foodSafetyWarnings: [
      'El pescado debe ser apto para consumo crudo (congelado previo a -20°C por 24h para prevención de anisakis según normativa sanitaria).',
      'El jugo de limón desnaturaliza las proteínas (curado en frío), pero NO destruye bacterias ni parásitos.',
      'Servir y consumir dentro de los primeros 15 minutos de preparado.'
    ],
    shelfLifeAndStorage: 'Consumo inmediato. No almacenar una vez adicionado el jugo de limón.',
    presentationNotes: 'Servir en plato hondo frío o copa ceviche, decorado con hoja de lechuga orgánica y rodaja de ají limo en el centro.',
    pairings: {
      sauces: ['Chilcano marino concentrado de cortesía'],
      drinks: ['Cerveza rubia peruana helada', 'Chicha morada tradicional', 'Pisco Sour clásico'],
      sides: ['Canchita serrana chulpi', 'Choclo desgranado', 'Camote glaseado'],
      desserts: ['Suspiro a la limeña', 'Queso helado arequipeño']
    },
    traditionalSource: 'Receta estándar de cevichería tradicional limeña con técnica moderna de macerado al minuto.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Chef Consultor Gastronómico APEGA',
    lastUpdated: '2026-10-24',
    regionalVariants: [
      'Ceviche Piurano (con zarandaja y chicha de jora)',
      'Ceviche Mixto (con pulpo, calamar y langostinos precocidos)',
      'Ceviche de Conchas Negras (Tumbes)'
    ],
    baseRawCostPEN: 18.50,
    suggestedPricePEN: 38.00
  },

  // ─── 2. LOMO SALTADO CRIOLLO (COSTA) ────────────────────────────────────────
  {
    id: 'rec-lomo-saltado',
    slug: 'lomo-saltado-criollo',
    name: 'Lomo Saltado Criollo Tradicional',
    alternativeNames: ['Lomo Salteado', 'Lomo al Wok'],
    tagline: 'Fusión Chino-Peruana en su máxima gloria: fuego vivo, lomo tierno, cebolla crocante y papas amarillas doradas.',
    description: 'Icono de la cocina criolla nacido del encuentro entre la técnica milenaria del salteado al wok cantonés y los ingredientes de los valles peruanos. Trozos jugosos de lomo fino salteados a fuego extremo con cebolla roja, tomate, ají amarillo y un toque de sillao y vinagre tinto.',
    region: 'Costa',
    department: 'Lima',
    locality: 'Lima Metropolitana',
    category: 'Platos principales',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    baseServings: 4,
    servingSizeGrams: 420,
    prepTimeMinutes: 20,
    cookTimeMinutes: 8,
    difficulty: 'Media',
    ingredients: [
      {
        id: 'ing-lomo-fino',
        name: 'Lomo fino de res en bastones gruesos',
        quantity: 650,
        unit: 'g',
        grossWeightGrams: 750,
        netWeightGrams: 650,
        wastePercentage: 13,
        costPerUnitPEN: 58.0,
        isScalableLinearly: true,
        notes: 'Cortado en tiras de 4x2 cm a contrafibra para máxima terneza'
      },
      {
        id: 'ing-cebolla-lomo',
        name: 'Cebolla roja cortada en gajos gruesos',
        quantity: 2,
        unit: 'unidad',
        grossWeightGrams: 350,
        netWeightGrams: 300,
        wastePercentage: 14,
        costPerUnitPEN: 4.5,
        isScalableLinearly: true,
        notes: 'Separar los pétalos para que se doren rápidamente sin soltar agua'
      },
      {
        id: 'ing-tomate-lomo',
        name: 'Tomates maduros pero firmes en gajos',
        quantity: 3,
        unit: 'unidad',
        grossWeightGrams: 400,
        netWeightGrams: 320,
        wastePercentage: 20,
        costPerUnitPEN: 5.0,
        isScalableLinearly: true,
        notes: 'Despepitados para no saturar de líquido el wok'
      },
      {
        id: 'ing-aji-amarillo-lomo',
        name: 'Ají amarillo fresco en tiras sin venas',
        quantity: 2,
        unit: 'unidad',
        wastePercentage: 15,
        costPerUnitPEN: 6.5,
        isScalableLinearly: true
      },
      {
        id: 'ing-sillao',
        name: 'Sillao (salsa de soya oscura de calidad)',
        quantity: 4,
        unit: 'cucharada',
        wastePercentage: 0,
        costPerUnitPEN: 12.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-vinagre-tinto',
        name: 'Vinagre tinto puro de vino',
        quantity: 3,
        unit: 'cucharada',
        wastePercentage: 0,
        costPerUnitPEN: 8.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-caldo-carne',
        name: 'Fondo oscuro o caldo de carne concentrado',
        quantity: 6,
        unit: 'cucharada',
        wastePercentage: 0,
        costPerUnitPEN: 4.0,
        isScalableLinearly: true,
        notes: 'Aporta el jugo brillante y suculento característico'
      },
      {
        id: 'ing-papa-amarilla',
        name: 'Papa amarilla frita en bastones gruesos',
        quantity: 600,
        unit: 'g',
        grossWeightGrams: 800,
        netWeightGrams: 600,
        wastePercentage: 25,
        costPerUnitPEN: 5.5,
        isScalableLinearly: true,
        notes: 'Frita en doble cocción: primera a 140°C para tiernizar, segunda a 180°C para dorar crocante'
      },
      {
        id: 'ing-arroz-blanco',
        name: 'Arroz con grano graneado con ajo',
        quantity: 400,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 4.8,
        isScalableLinearly: true
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Calentamiento extremo del Wok o sartén de hierro',
        instruction: 'Colocar el wok sobre la hornilla de mayor potencia hasta que humee. Salpimentar la carne justo antes de tocar el sartén.',
        visualCue: 'El metal debe humear levemente para garantizar el sellado sin soltar jugos.',
        temperature: '220°C - 250°C'
      },
      {
        stepNumber: 2,
        title: 'Sellado y flameado de la carne por tandas',
        instruction: 'Añadir 2 cucharadas de aceite vegetal neutro de alto punto de humo. Verter la mitad del lomo. Dejar 40 segundos sin mover para crear costra dorada; flamear con el fuego del quemador o inclinando ligeramente el wok. Retirar la carne a un plato y reservar los jugos.',
        timeMinutes: 2,
        criticalControlPoint: 'Cocinar en tandas para no bajar la temperatura del wok y evitar hervir la carne.'
      },
      {
        stepNumber: 3,
        title: 'Salteado de vegetales crocantes',
        instruction: 'En el mismo wok humeante, agregar otra cucharada de aceite. Saltear la cebolla y el ají amarillo durante 45 segundos. Incorporar los gajos de tomate, ajo picado y mezclar con energía.',
        timeMinutes: 1,
        visualCue: 'La cebolla debe conservar su estructura crocante y el tomate no debe deshacerse.'
      },
      {
        stepNumber: 4,
        title: 'Reintegración, desglasado y jugo criollo',
        instruction: 'Regresar la carne sellada con sus jugos al wok. Verter el vinagre por los bordes para levantar los azúcares caramelizados, seguido del sillao y el fondo de carne. Mover por 30 segundos. Apagar el fuego y espolvorear culantro y cebollita china picada.',
        timeMinutes: 1
      },
      {
        stepNumber: 5,
        title: 'Emplatado al estilo tradicional',
        instruction: 'Servir acompañado de una porción de arroz blanco graneado con ajo y las papas amarillas fritas recién salidas y crujientes (pueden servirse al lado o mezcladas al final según preferencia del cliente).',
        timeMinutes: 1
      }
    ],
    equipmentNeeded: ['Wok de acero al carbono o sartén de hierro fundido pesada', 'Espátula de wok', 'Quemador de alta potencia (ideal 25,000+ BTU)'],
    allergens: ['Soya (Sillao)', 'Gluten (en algunas marcas de sillao comercial)'],
    dietaryTags: ['Alto en Proteína', 'Sin Lácteos'],
    foodSafetyWarnings: [
      'Cuidado extremo con el flameado en campanas extractoras con grasa acumulada.',
      'La carne debe alcanzar temperatura interna segura de 60°C a 65°C para punto jugoso 3/4.'
    ],
    shelfLifeAndStorage: 'Servicio inmediato al salir del fuego. Las verduras pierden crocancia si se recalientan.',
    presentationNotes: 'Montaje en plato tendido con brillo en los jugos. El arroz moldeado en timbal y las papas doradas que contrasten con el lomo.',
    pairings: {
      sauces: ['Crema de ají huacatay', 'Salsa de rocoto carretillero'],
      drinks: ['Vino tinto Malbec o Syrah', 'Chicha morada clásica', 'Inca Kola bien helada'],
      sides: ['Papas amarillas fritas', 'Arroz con choclo'],
      desserts: ['Picarones tradicionales con miel de higo', 'Torta de chocolate peruana']
    },
    traditionalSource: 'Fusión nikkei y cantonesa criolla consolidada en las fondas y chifas limeños desde inicios del siglo XX.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Maestro Parrillero y Cocinero Criollo',
    lastUpdated: '2026-10-20',
    regionalVariants: [
      'Lomo a lo Pobre (con huevo frito y plátano frito)',
      'Tacú Tacú con Lomo Saltado',
      'Tallarín Saltado Criollo'
    ],
    baseRawCostPEN: 22.80,
    suggestedPricePEN: 46.00
  },

  // ─── 3. AJÍ DE GALLINA CREMOSO (COSTA) ──────────────────────────────────────
  {
    id: 'rec-aji-de-gallina',
    slug: 'aji-de-gallina-cremoso',
    name: 'Ají de Gallina Cremoso Tradicional',
    alternativeNames: ['Ají de Pollo Criollo', 'Manjar Criollo de Gallina'],
    tagline: 'Salsa aterciopelada de ají amarillo, nueces de pecana, queso parmesano y pechuga deshilachada.',
    description: 'Evolución virreinal del manjar blanco medieval europeo transformado con el ají amarillo peruano. Pechuga de gallina o pollo tierno deshilachado a mano envuelto en una crema untuosa y aromática ligada con pan o galleta, leche evaporada y toque de queso maduro.',
    region: 'Costa',
    department: 'Lima',
    locality: 'Lima Virreinal',
    category: 'Platos principales',
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1200&q=80',
    baseServings: 4,
    servingSizeGrams: 380,
    prepTimeMinutes: 25,
    cookTimeMinutes: 35,
    difficulty: 'Media',
    ingredients: [
      {
        id: 'ing-pechuga-gallina',
        name: 'Pechuga de gallina o pollo entero cocido y deshilachado',
        quantity: 600,
        unit: 'g',
        wastePercentage: 10,
        costPerUnitPEN: 18.0,
        isScalableLinearly: true,
        notes: 'Cocida con verduras aromáticas (apio, poro, zanahoria) para obtener un caldo sustancioso'
      },
      {
        id: 'ing-pasta-aji-amarillo',
        name: 'Pasta de ají amarillo puro blanqueado',
        quantity: 180,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 12.0,
        isScalableLinearly: true,
        notes: 'Hervido tres veces cambiando de agua para quitar el exceso de picor y concentrar color y sabor'
      },
      {
        id: 'ing-pasta-aji-mirasol',
        name: 'Pasta de ají mirasol (ají amarillo seco)',
        quantity: 2,
        unit: 'cucharada',
        wastePercentage: 0,
        costPerUnitPEN: 18.0,
        isScalableLinearly: true,
        notes: 'Aporta la nota ahumada y profundidad de sabor'
      },
      {
        id: 'ing-pan-frances',
        name: 'Pan francés remojado en caldo o leche evaporada',
        quantity: 3,
        unit: 'unidad',
        wastePercentage: 5,
        costPerUnitPEN: 0.5,
        isScalableLinearly: true
      },
      {
        id: 'ing-leche-evaporada',
        name: 'Leche evaporada entera peruana',
        quantity: 250,
        unit: 'ml',
        wastePercentage: 0,
        costPerUnitPEN: 4.8,
        isScalableLinearly: true
      },
      {
        id: 'ing-pecanas',
        name: 'Pecanas peruanas tostadas y procesadas fino',
        quantity: 60,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 42.0,
        isScalableLinearly: true,
        notes: 'Aportan untuosidad sedosa y sabor a nuez característico'
      },
      {
        id: 'ing-queso-parmesano',
        name: 'Queso tipo parmesano rallado',
        quantity: 50,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 36.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-papas-hervidas',
        name: 'Papas huayro o amarillas cocidas en rodajas',
        quantity: 4,
        unit: 'unidad',
        wastePercentage: 20,
        costPerUnitPEN: 4.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-huevos-duros',
        name: 'Huevos duros cortados en mitades',
        quantity: 2,
        unit: 'unidad',
        wastePercentage: 10,
        costPerUnitPEN: 0.7,
        isScalableLinearly: true
      },
      {
        id: 'ing-aceituna-botija',
        name: 'Aceitunas negras de botija (Ica)',
        quantity: 4,
        unit: 'unidad',
        wastePercentage: 15,
        costPerUnitPEN: 0.8,
        isScalableLinearly: true
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Cocción y deshilachado de la carne',
        instruction: 'Hervir la pechuga en agua con apio, poro y sal hasta que esté bien tierna (aprox. 25 min). Dejar entibiar y deshilachar a mano en hebras medianas. Colar y reservar el fondo concentrado.',
        timeMinutes: 25,
        criticalControlPoint: 'Alcanzar temperatura interna de 74°C en el centro del ave.'
      },
      {
        stepNumber: 2,
        title: 'Elaboración del sofrito base madre',
        instruction: 'En una olla de fondo grueso con aceite vegetal, dorar a fuego lento la cebolla roja finamente picada en brunoise con el ajo molido durante 10 minutos sin dorar. Incorporar las pastas de ají amarillo y mirasol. Sofreír pacientemente hasta que el aceite se separe de la pasta.',
        timeMinutes: 12,
        visualCue: 'El aderezo corta el aceite y tiene un color amarillo dorado brillante.'
      },
      {
        stepNumber: 3,
        title: 'Licuado y ligazón de la crema',
        instruction: 'Licuar el pan remojado en leche evaporada con las pecanas tostadas y un chorrito del caldo de gallina hasta obtener una crema lisa y densa.',
        timeMinutes: 3
      },
      {
        stepNumber: 4,
        title: 'Cocción e integración final',
        instruction: 'Verter la crema licuada sobre el aderezo en la olla a fuego suave. Mover constantemente con cuchara de madera en forma de ocho. Agregar el pollo deshilachado. Cocinar por 8 minutos ajustando la densidad con caldo. Terminar con el queso parmesano rallado.',
        timeMinutes: 8,
        visualCue: 'La crema napa la cuchara con textura aterciopelada sin grumos.'
      },
      {
        stepNumber: 5,
        title: 'Servicio',
        instruction: 'Disponer una cama de rodajas de papa cocida caliente. Bañar con generosa crema de ají de gallina. Coronar con medio huevo duro, aceituna de botija y ramita de perejil. Servir con arroz blanco graneado.',
        timeMinutes: 2
      }
    ],
    equipmentNeeded: ['Olla de fondo grueso', 'Licuadora de alta potencia', 'Cuchara de madera o silicona'],
    allergens: ['Lácteos (Leche y Queso)', 'Frutos Secos (Pecanas)', 'Gluten (Pan)', 'Huevos'],
    dietaryTags: ['Contiene Nueces'],
    foodSafetyWarnings: [
      'Al contener leche y caldo de ave, refrigerar rápidamente los remanentes por debajo de 4°C para evitar proliferación bacteriana.',
      'Al recalentar, llevar a ebullición suave (mínimo 75°C) agregando un chorrito de caldo para devolver la textura.'
    ],
    shelfLifeAndStorage: 'Hasta 48 horas en refrigeración hermética a 3°C.',
    presentationNotes: 'El contraste cromático entre la salsa amarilla dorada, la aceituna negra brillante y el huevo es la firma de la mesa criolla.',
    pairings: {
      sauces: ['Ají de pollería casero', 'Rocoto molido con huacatay'],
      drinks: ['Vino blanco Chardonnay con barrica', 'Chicha morada con piña y membrillo'],
      sides: ['Arroz blanco con choclo', 'Papa huayro o amarilla al vapor'],
      desserts: ['Mazamorra morada con arroz con leche (Clásico)', 'Suspiro a la limeña']
    },
    traditionalSource: 'Libros de cocina republicanos del siglo XIX; adaptación criolla del manjar blanco de gallina virreinal.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Comité Editorial Gastronómico',
    lastUpdated: '2026-10-18',
    regionalVariants: [
      'Ají de Gallina Arequipeño (con nueces locales y punto más picante)',
      'Ají de Pato (tradición del norte chico)'
    ],
    baseRawCostPEN: 14.20,
    suggestedPricePEN: 34.00
  },

  // ─── 4. ROCOTO RELLENO AREQUIPEÑO (SIERRA) ──────────────────────────────────
  {
    id: 'rec-rocoto-relleno',
    slug: 'rocoto-relleno-arequipeno',
    name: 'Rocoto Relleno Arequipeño',
    alternativeNames: ['Rocoto Relleno Tradicional Characato'],
    tagline: 'Orgullo de las picanterías del Misti. Picor domesticado, picadillo de carne a cuchillo y sombrero de queso gratinado.',
    description: 'Plato insignia de la Ciudad Blanca de Arequipa. Rocotos seleccionados desvenados y hervidos en agua con sal y vinagre para domesticar su bravo ardor, rellenos de un picadillo jugoso de lomo de res cortado a mano con maní, pasas, aceitunas y especias andinas, cubiertos con pastel de papa y queso paria gratinado.',
    region: 'Sierra',
    department: 'Arequipa',
    locality: 'Arequipa Tradicional (Yanahuara / Characato)',
    category: 'Platos principales',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    baseServings: 4,
    servingSizeGrams: 360,
    prepTimeMinutes: 40,
    cookTimeMinutes: 30,
    difficulty: 'Avanzada',
    ingredients: [
      {
        id: 'ing-rocoto-arequipeno',
        name: 'Rocotos arequipeños grandes y redondos',
        quantity: 4,
        unit: 'unidad',
        wastePercentage: 20,
        costPerUnitPEN: 2.5,
        isScalableLinearly: true,
        notes: 'Cortar la tapa superior y desvenar con cuchara con sumo cuidado'
      },
      {
        id: 'ing-carne-picadillo',
        name: 'Carne de res (tapapecho o cadera) picada a cuchillo en cubitos finos',
        quantity: 450,
        unit: 'g',
        wastePercentage: 10,
        costPerUnitPEN: 32.0,
        isScalableLinearly: true,
        notes: 'Nunca carne molida industrial; el picado a cuchillo es mandatorio para la textura picantera'
      },
      {
        id: 'ing-queso-paria',
        name: 'Queso Paria arequipeño o queso andino mantecoso',
        quantity: 250,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 28.0,
        isScalableLinearly: true,
        notes: 'Excelente punto de fundido sin soltar exceso de aceite'
      },
      {
        id: 'ing-mani-tostado',
        name: 'Maní tostado pelado y chancado',
        quantity: 50,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 14.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-pasas-negras',
        name: 'Pasas negras sin pepa',
        quantity: 40,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 16.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-cebolla-picadillo',
        name: 'Cebolla roja en brunoise fina',
        quantity: 2,
        unit: 'unidad',
        wastePercentage: 14,
        costPerUnitPEN: 4.5,
        isScalableLinearly: true
      },
      {
        id: 'ing-pasta-aji-panca',
        name: 'Pasta de ají panca limpio',
        quantity: 2,
        unit: 'cucharada',
        wastePercentage: 0,
        costPerUnitPEN: 10.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-leche-huevo-ligue',
        name: 'Mezcla de ligue: 1 huevo batido con 80 ml de leche evaporada',
        quantity: 1,
        unit: 'unidad',
        wastePercentage: 0,
        costPerUnitPEN: 2.0,
        isScalableLinearly: true
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Desfleme riguroso del rocoto (Tratamiento del picor)',
        instruction: 'Cortar la tapa del rocoto conservando el tallito. Retirar cuidadosamente semillas y venas interiores. Hervir los rocotos y sus tapas en agua con sal y un chorro de vinagre durante 3 minutos. Retirar, enjuagar con agua fría y repetir el hervor dos veces más con agua nueva y una cucharadita de azúcar hasta que el picor sea agradable.',
        criticalControlPoint: 'Usar guantes de látex al desvenar rocotos para proteger piel y mucosas.',
        timeMinutes: 20
      },
      {
        stepNumber: 2,
        title: 'Elaboración del picadillo tradicional',
        instruction: 'En sartén amplia, dorar la cebolla picada con ajo y pasta de ají panca hasta que esté cristalina. Agregar la carne picada a cuchillo y dorar a fuego medio-alto. Añadir orégano restregado, comino, pasas y maní chancado. Cocinar por 8 minutos dejando el relleno bien jugoso.',
        timeMinutes: 12
      },
      {
        stepNumber: 3,
        title: 'Relleno y montaje para horneado',
        instruction: 'Rellenar generosamente cada rocoto con el picadillo caliente. Colocar una lámina gruesa de queso Paria sobre el relleno y coronar con su tapa de rocoto. Disponer en una fuente refractaria engrasada.',
        timeMinutes: 5
      },
      {
        stepNumber: 4,
        title: 'Gratinado al horno',
        instruction: 'Verter la mezcla de huevo y leche evaporada batida alrededor de los rocotos para sellar la base. Hornear a 180°C durante 20 a 25 minutos hasta que el queso se funda y burbujee formando un dorado apetitoso.',
        temperature: '180°C (350°F)',
        timeMinutes: 25,
        visualCue: 'Queso fundido gratinado y piel del rocoto ligeramente arrugada pero entera.'
      }
    ],
    equipmentNeeded: ['Fuente refractaria para horno', 'Guantes para manipulación de rocoto', 'Sartén de fondo grueso'],
    allergens: ['Lácteos (Queso y Leche)', 'Huevos', 'Maní'],
    dietaryTags: ['Sin Gluten', 'Plato Autóctono Andino'],
    foodSafetyWarnings: [
      'Manipular rocotos exclusivamente con guantes y no tocarse los ojos.',
      'Asegurar cocción completa del picadillo de carne antes de rellenar los rocotos.'
    ],
    shelfLifeAndStorage: 'Consumir recién horneado. Tolera refrigeración hasta 48 horas y recalentado en horno.',
    presentationNotes: 'Se sirve indisolublemente unido a una porción cuadrada de pastel de papa arequipeño dorado.',
    pairings: {
      sauces: ['Solterito de queso arequipeño fresco'],
      drinks: ['Chicha de jora del valle de Arequipa', 'Anís Nájar tradicional de sobremesa'],
      sides: ['Pastel de papa arequipeño tradicional'],
      desserts: ['Queso helado characato', 'Buñuelos con miel']
    },
    traditionalSource: 'Recetarios picanteros de Arequipa, tradición declarada Patrimonio Cultural de la Nación.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Sociedad Picantera de Arequipa',
    lastUpdated: '2026-10-15',
    regionalVariants: [
      'Rocoto Relleno Cusqueño (con carne de cordero o alpaca)',
      'Rocoto Relleno Marino (con pulpo y langostinos en picanterías del litoral)'
    ],
    baseRawCostPEN: 16.50,
    suggestedPricePEN: 38.00
  },

  // ─── 5. JUANE DE GALLINA AMAZÓNICO (SELVA) ─────────────────────────────────
  {
    id: 'rec-juane-gallina',
    slug: 'juane-de-gallina-amazonico',
    name: 'Juane de Gallina Amazónico Tradicional',
    alternativeNames: ['Juane de San Juan', 'Juane de Arroz'],
    tagline: 'El alma de la Fiesta de San Juan en la Amazonía. Arroz sazonado con mishquina, gallina de chacra y hojas de bijao.',
    description: 'El plato ceremonial más representativo de la selva peruana. Consiste en una masa de arroz sazonada con manteca, palillo regional (cúrcuma amazónica) y mishquina, rellena con una presa tierna de gallina de chacra guisada, aceitunas negras y huevo duro, todo envuelto en hojas de bijao soasadas y amarrado en forma redonda antes de hervir.',
    region: 'Selva',
    department: 'Loreto',
    locality: 'Iquitos / Tarapoto / Pucallpa',
    category: 'Platos principales',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    baseServings: 4,
    servingSizeGrams: 450,
    prepTimeMinutes: 45,
    cookTimeMinutes: 90,
    difficulty: 'Avanzada',
    ingredients: [
      {
        id: 'ing-gallina-chacra',
        name: 'Presas de gallina de chacra de campo',
        quantity: 4,
        unit: 'unidad',
        grossWeightGrams: 800,
        netWeightGrams: 700,
        wastePercentage: 15,
        costPerUnitPEN: 26.0,
        isScalableLinearly: true,
        notes: 'Guisadas previamente con ajo, comino y sachaculantro'
      },
      {
        id: 'ing-arroz-juane',
        name: 'Arroz cocido al dente con el caldo de gallina',
        quantity: 500,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 4.5,
        isScalableLinearly: true
      },
      {
        id: 'ing-mishquina',
        name: 'Mishquina o pasta de palillo fresco y especias de la selva',
        quantity: 3,
        unit: 'cucharada',
        wastePercentage: 0,
        costPerUnitPEN: 8.0,
        isScalableLinearly: true,
        notes: 'Aporta el color amarillo dorado intenso y el aroma selvático inimitable'
      },
      {
        id: 'ing-sachaculantro',
        name: 'Sachaculantro o culantro del monte picado fino',
        quantity: 1,
        unit: 'atado',
        wastePercentage: 20,
        costPerUnitPEN: 2.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-hojas-bijao',
        name: 'Hojas de bijao grandes y frescas',
        quantity: 8,
        unit: 'unidad',
        wastePercentage: 10,
        costPerUnitPEN: 1.5,
        isScalableLinearly: true,
        notes: 'Pasadas previamente por el fuego (soasadas) para ganar flexibilidad sin romperse'
      },
      {
        id: 'ing-huevos-juane',
        name: 'Huevos frescos (2 crudos para ligar el arroz, 2 duros partidos)',
        quantity: 4,
        unit: 'unidad',
        wastePercentage: 10,
        costPerUnitPEN: 0.7,
        isScalableLinearly: true
      },
      {
        id: 'ing-aceituna-juane',
        name: 'Aceituna negra botija',
        quantity: 4,
        unit: 'unidad',
        wastePercentage: 15,
        costPerUnitPEN: 0.8,
        isScalableLinearly: true
      },
      {
        id: 'ing-pita-amarrar',
        name: 'Pita de fibra vegetal o pabilo para amarrar',
        quantity: 4,
        unit: 'unidad',
        wastePercentage: 0,
        costPerUnitPEN: 0.2,
        isScalableLinearly: true
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Guisado de la gallina de chacra',
        instruction: 'Guisar las presas de gallina con ajo, cebolla, palillo regional y sachaculantro en poco agua hasta que estén tiernas y sabrosas. Retirar las presas y colar el caldo resultante.',
        timeMinutes: 40
      },
      {
        stepNumber: 2,
        title: 'Preparación de la masa de arroz aromático',
        instruction: 'Cocinar el arroz con el caldo de gallina y la pasta de mishquina hasta que quede graneado pero suave. Dejar entibiar y mezclar vigorosamente con 2 huevos crudos batidos y manteca hasta que quede homogéneo y brillante.',
        timeMinutes: 20
      },
      {
        stepNumber: 3,
        title: 'Envoltura tradicional en hojas de bijao',
        instruction: 'Cruzar dos hojas de bijao soasadas sobre una superficie limpia. Poner una porción generosa de arroz en el centro. Colocar en medio una presa de gallina, medio huevo duro y una aceituna negra. Cubrir con más arroz dándole forma esférica.',
        timeMinutes: 10
      },
      {
        stepNumber: 4,
        title: 'Amarrado y cocción al vapor/agua',
        instruction: 'Juntar las puntas de las hojas de bijao hacia arriba apretando bien para formar una bolsa esférica hermética. Atar con pabilo con doble nudo firme. Sumergir los juanes en una olla grande con agua hirviendo durante 50 a 60 minutos.',
        timeMinutes: 55,
        criticalControlPoint: 'El agua debe cubrir los juanes y el amarre debe ser impermeable para evitar que entre agua al arroz.'
      }
    ],
    equipmentNeeded: ['Olla tamalera o vaporera profunda', 'Hojas de bijao soasadas', 'Pabilo de algodón resistente'],
    allergens: ['Huevos'],
    dietaryTags: ['Sin Gluten', 'Sin Lácteos', 'Plato Autóctono Amazónico'],
    foodSafetyWarnings: [
      'Al estar envuelto en hojas vegetales y enfriado lentamente, es vital no dejar a temperatura ambiente más de 8 horas.',
      'Para venta o transporte, enfriar a 4°C y mantener la cadena de frío.'
    ],
    shelfLifeAndStorage: 'Hasta 72 horas refrigerado en su envoltorio original sin desatar.',
    presentationNotes: 'Se abre el amarre y se despliegan las hojas de bijao en la misma mesa sirviendo de plato natural silvestre.',
    pairings: {
      sauces: ['Ají charapita cocona picante', 'Cebolla amazónica encurtida en vinagre de plátano'],
      drinks: ['Aguajina fresca', 'Jugo de camu camu concentrado', 'Refresco de cocona'],
      sides: ['Plátano maduro frito o asado', 'Yuca frita'],
      desserts: ['Mousse de copoazú', 'Helado de aguaje']
    },
    traditionalSource: 'Tradición amazónica de los pueblos ribereños de Loreto y San Martín, fiesta de San Juan Bautista.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Cocinero de Tradición Amazónica',
    lastUpdated: '2026-10-12',
    regionalVariants: [
      'Avispa Juane (con carne de cerdo picada en lugar de gallina entera)',
      'Nina Juane (con huevo batido y pollo a la brasa sin arroz)',
      'Chonta Juane (con palmito fresco)'
    ],
    baseRawCostPEN: 15.80,
    suggestedPricePEN: 36.00
  },

  // ─── 6. SECO DE CABRITO A LA NORTEÑA (COSTA NORTE) ─────────────────────────
  {
    id: 'rec-seco-cabrito',
    slug: 'seco-de-cabrito-nortena',
    name: 'Seco de Cabrito a la Norteña',
    alternativeNames: ['Seco de Chivo Norteño con Frijoles'],
    tagline: 'Fervor lambayecano: chicha de jora macerada, culantro aromático, loche rallado y frijol bayo cremoso.',
    description: 'Majestuoso guiso norteño elaborado con cabrito lechal tierno trozado y macerado en chicha de jora norteña fuerte. Se cocina a fuego lento en un aderezo generoso de culantro licuado, ají amarillo y el indispensable zapallo loche rallado que le confiere su inconfundible aroma y consistencia melosa.',
    region: 'Costa',
    department: 'Lambayeque',
    locality: 'Chiclayo / Ferreñafe / Piura',
    category: 'Platos principales',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    baseServings: 4,
    servingSizeGrams: 480,
    prepTimeMinutes: 30,
    cookTimeMinutes: 75,
    difficulty: 'Media',
    ingredients: [
      {
        id: 'ing-cabrito-lechal',
        name: 'Cabrito lechal trozado en presas con hueso',
        quantity: 1000,
        unit: 'g',
        wastePercentage: 18,
        costPerUnitPEN: 36.0,
        isScalableLinearly: true,
        notes: 'Carne magra y muy tierna, macerada previamente en chicha de jora'
      },
      {
        id: 'ing-chicha-jora-fuerte',
        name: 'Chicha de jora norteña fermentada (seca/fuerte)',
        quantity: 300,
        unit: 'ml',
        wastePercentage: 0,
        costPerUnitPEN: 6.0,
        isScalableLinearly: true,
        notes: 'No dulce; el ácido de la fermentación tierniza la carne y equilibra el culantro'
      },
      {
        id: 'ing-zapallo-loche',
        name: 'Zapallo loche lambayecano con cáscara rallado fino',
        quantity: 80,
        unit: 'g',
        wastePercentage: 5,
        costPerUnitPEN: 22.0,
        isScalableLinearly: true,
        notes: 'Ingrediente con Denominación de Origen, alma aromática del norte'
      },
      {
        id: 'ing-culantro-norteno',
        name: 'Culantro fresco licuado con una gota de chicha',
        quantity: 1,
        unit: 'taza' as any,
        wastePercentage: 15,
        costPerUnitPEN: 3.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-frijol-bayo',
        name: 'Frijoles bayos o canarios cocidos y bien melosos',
        quantity: 400,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 8.0,
        isScalableLinearly: true,
        notes: 'Guisados con aderezo criollo y un trozo de pellejo de chancho'
      },
      {
        id: 'ing-yuca-sancochada',
        name: 'Yuca amarilla harinosa sancochada',
        quantity: 400,
        unit: 'g',
        wastePercentage: 25,
        costPerUnitPEN: 4.0,
        isScalableLinearly: true
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Maceración de la carne',
        instruction: 'Macerar los trozos de cabrito en un bowl con chicha de jora, ajo molido, sal, pimienta y comino durante al menos 1 hora (idealmente toda la noche).',
        timeMinutes: 60
      },
      {
        stepNumber: 2,
        title: 'Aderezo norteño con zapallo loche',
        instruction: 'En una olla amplia de barro o hierro con manteca o aceite, sofreír la cebolla roja picada muy fino. Añadir el ají amarillo molido y el zapallo loche rallado. Dorar a fuego suave durante 12 minutos hasta que el loche se funda en la pasta.',
        timeMinutes: 12,
        visualCue: 'El aderezo despide un aroma dulzón ahumado inconfundible.'
      },
      {
        stepNumber: 3,
        title: 'Sellado y estofado prolongado',
        instruction: 'Incorporar las presas de cabrito escurridas y dorarlas en el aderezo. Agregar el líquido de la maceración y el culantro licuado. Tapar y cocinar a fuego bajo durante 55 a 65 minutos hasta que la carne esté tan tierna que se desprenda del hueso.',
        timeMinutes: 60,
        criticalControlPoint: 'Cocinar tapado a fuego suave para evitar que la carne pierda jugosidad y se reseque.'
      },
      {
        stepNumber: 4,
        title: 'Servicio festivo',
        instruction: 'Servir en plato grande con arroz blanco, una porción suculenta de frijol bayo guisado cremoso y trozos de yuca sancochada tierna bañada en el jugo verde espeso del seco.',
        timeMinutes: 3
      }
    ],
    equipmentNeeded: ['Olla de hierro o barro de fondo grueso', 'Rallador microplane para loche'],
    allergens: ['Puede contener trazas de gluten por fermentación de chicha de jora artesanal'],
    dietaryTags: ['Plato Típico de Denominación de Origen', 'Sin Lácteos'],
    foodSafetyWarnings: [
      'La carne de cabrito debe cocinarse completamente por encima de 72°C.',
      'Los frijoles deben enfriarse de inmediato si se guardan, ya que fermentan rápidamente a temperatura ambiente.'
    ],
    shelfLifeAndStorage: 'Hasta 72 horas en frío. El sabor se asienta y mejora al día siguiente.',
    presentationNotes: 'Acompañar con zarandaja o salsa criolla norteña con ají limo picado.',
    pairings: {
      sauces: ['Salsa criolla chiclayana con hierbabuena'],
      drinks: ['Chicha de jora norteña fresca', 'Cerveza negra'],
      sides: ['Frijoles bayos o canarios', 'Yucas harinosas', 'Arroz blanco'],
      desserts: ['King Kong de manjarblanco lambayecano', 'Alfajores de penco']
    },
    traditionalSource: 'Recetario emblemático de la cocina mochica y colonial de Lambayeque y Piura.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Asociación de Chefs del Norte Peruano',
    lastUpdated: '2026-10-10',
    regionalVariants: [
      'Seco de Pato a la Chiclayana',
      'Seco de Res Criollo Limeño (con cerveza rubia y zanahoria con arvejas)',
      'Seco de Chavelo (Piura, con plátano verde majado)'
    ],
    baseRawCostPEN: 21.00,
    suggestedPricePEN: 48.00
  },

  // ─── 7. SUSPIRO A LA LIMEÑA (POSTRE) ───────────────────────────────────────
  {
    id: 'rec-suspiro-limena',
    slug: 'suspiro-a-la-limena',
    name: 'Suspiro a la Limeña Tradicional',
    alternativeNames: ['Manjar Real del Perú'],
    tagline: 'Tan suave y dulce como el suspiro de una mujer: manjar blanco de yemas coronado con merengue al vino Oporto y canela.',
    description: 'Postre emblemático de Lima del siglo XIX bautizado por el poeta José Gálvez Barrenechea. Combina una base sedosa de leche condensada y evaporada cocidas pacientemente con yemas de huevo frescas, rematada con un merengue italiano batido en almíbar de vino de Oporto y espolvoreado con canela molida.',
    region: 'Costa',
    department: 'Lima',
    locality: 'Lima Tradicional',
    category: 'Postres y dulces',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    baseServings: 6,
    servingSizeGrams: 140,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    difficulty: 'Media',
    ingredients: [
      {
        id: 'ing-leche-condensada',
        name: 'Leche condensada entera',
        quantity: 395,
        unit: 'g',
        wastePercentage: 2,
        costPerUnitPEN: 6.5,
        isScalableLinearly: true
      },
      {
        id: 'ing-leche-evaporada-suspiro',
        name: 'Leche evaporada entera',
        quantity: 400,
        unit: 'ml',
        wastePercentage: 0,
        costPerUnitPEN: 5.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-yemas-huevo',
        name: 'Yemas de huevo fresco de corral',
        quantity: 5,
        unit: 'unidad',
        wastePercentage: 50,
        costPerUnitPEN: 0.7,
        isScalableLinearly: true,
        notes: 'Coladas previamente para retirar la chalaza'
      },
      {
        id: 'ing-claras-huevo',
        name: 'Claras de huevo fresco',
        quantity: 3,
        unit: 'unidad',
        wastePercentage: 0,
        costPerUnitPEN: 0.7,
        isScalableLinearly: true
      },
      {
        id: 'ing-vino-oporto',
        name: 'Vino de Oporto dulce o vino dulce de misa',
        quantity: 120,
        unit: 'ml',
        wastePercentage: 0,
        costPerUnitPEN: 28.0,
        isScalableLinearly: true
      },
      {
        id: 'ing-azucar-blanca',
        name: 'Azúcar blanca refinada para el almíbar',
        quantity: 180,
        unit: 'g',
        wastePercentage: 0,
        costPerUnitPEN: 4.2,
        isScalableLinearly: true
      },
      {
        id: 'ing-canela-polvo',
        name: 'Canela molida fina para espolvorear',
        quantity: 1,
        unit: 'cucharadita',
        wastePercentage: 0,
        costPerUnitPEN: 1.0,
        isScalableLinearly: false
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Punto de manjar de leche',
        instruction: 'En una cacerola de fondo grueso, colocar la leche condensada y la leche evaporada. Cocinar a fuego bajo moviendo constantemente con cuchara de madera en forma de ocho para evitar que se pegue. Mantener unos 25 minutos hasta que tome consistencia espesa y se vea el fondo de la olla.',
        timeMinutes: 25,
        visualCue: 'Al pasar la cuchara se ve claramente el fondo de la olla por 3 segundos (punto de manjar).'
      },
      {
        stepNumber: 2,
        title: 'Temperado e incorporación de yemas',
        instruction: 'Retirar del fuego y dejar bajar la temperatura a unos 60°C. Batir las yemas en un bowl pequeño y agregar dos cucharadas del manjar caliente para temperarlas. Reintegrar las yemas a la olla batiendo vigorosamente para que no cuajen. Cocinar 2 minutos más a fuego mínimo y colar.',
        timeMinutes: 4,
        criticalControlPoint: 'Temperar las yemas para evitar que se coagulen en forma de huevo revuelto.'
      },
      {
        stepNumber: 3,
        title: 'Almíbar de Oporto y merengue italiano',
        instruction: 'En una olla pequeña, hervir el vino Oporto con el azúcar a fuego medio sin mover hasta alcanzar punto de bola blanda o 118°C. Mientras tanto, batir las claras a punto de nieve. Verter el almíbar hirviendo en hilo constante sobre las claras mientras la batidora sigue en marcha. Continuar batiendo hasta que el merengue esté brillante, firme y frío.',
        timeMinutes: 10,
        temperature: '118°C almíbar'
      },
      {
        stepNumber: 4,
        title: 'Montaje en copas',
        instruction: 'Servir el manjar de yemas en copas de cristal individuales. Con manga pastelera con boquilla rizada, colocar un copete generoso de merengue al Oporto encima. Espolvorear suavemente con canela molida.',
        timeMinutes: 5
      }
    ],
    equipmentNeeded: ['Batidora eléctrica', 'Termómetro de azúcar o prueba de agua fría', 'Manga pastelera con boquilla rizada', 'Copas de cristal'],
    allergens: ['Lácteos', 'Huevos', 'Sulfitos (Vino Oporto)'],
    dietaryTags: ['Vegetariano'],
    foodSafetyWarnings: [
      'El almíbar a 118°C pasteuriza las claras de huevo crudas en el merengue italiano, haciéndolo seguro contra salmonella.',
      'Mantener en frío para que no baje el merengue.'
    ],
    shelfLifeAndStorage: 'Hasta 4 días en refrigeración protegida.',
    presentationNotes: 'Se sirve tradicionalmente en copas tipo martini o copas de postre de boca ancha.',
    pairings: {
      sauces: [],
      drinks: ['Café pasado de Chanchamayo o Quillabamba', 'Pisco Quebranta o Italia puro'],
      sides: [],
      desserts: []
    },
    traditionalSource: 'Dulcería conventual y señorial limeña de fines del siglo XIX.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Maestra Pastelera Tradicional',
    lastUpdated: '2026-10-08',
    regionalVariants: [
      'Suspiro de Chirimoya',
      'Suspiro de Lúcuma',
      'Suspiro de Maracuyá (versión contemporánea ácida)'
    ],
    baseRawCostPEN: 7.20,
    suggestedPricePEN: 18.00
  },

  // ─── 8. PISCO SOUR CLÁSICO (BEBIDA DE BANDERA) ──────────────────────────────
  {
    id: 'rec-pisco-sour',
    slug: 'pisco-sour-clasico',
    name: 'Pisco Sour Clásico (Fórmula 3-1-1)',
    alternativeNames: ['Cóctel Nacional del Perú', 'Pisco Sour Tradicional'],
    tagline: 'Fórmula perfecta: 3 partes de Pisco Quebranta puro, 1 parte de jugo de limón sutil fresco y 1 parte de jarabe de goma.',
    description: 'El cóctel de bandera del Perú, creado en el mítico Morris Bar y perfeccionado en el Hotel Bolívar y el Maury de Lima. El equilibrio insuperable entre el aroma de la uva Quebranta pura, la acidez vivaz del limón sutil, el dulzor neutro del jarabe de goma y la espuma aterciopelada de la clara con gotas de amargo de Angostura.',
    region: 'Costa',
    department: 'Ica',
    locality: 'Ica / Lima',
    category: 'Bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    baseServings: 1,
    servingSizeGrams: 180,
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    difficulty: 'Fácil',
    ingredients: [
      {
        id: 'ing-pisco-quebranta',
        name: 'Pisco Puro Quebranta con Denominación de Origen',
        quantity: 3,
        unit: 'cucharada' as any, // 3 oz / 90 ml
        wastePercentage: 0,
        costPerUnitPEN: 55.0,
        isScalableLinearly: true,
        notes: '3 onzas (90 ml) de pisco puro sin crianza en barrica'
      },
      {
        id: 'ing-jugo-limon-sour',
        name: 'Jugo de limón sutil recién exprimido al momento',
        quantity: 1,
        unit: 'cucharada' as any, // 1 oz / 30 ml
        wastePercentage: 40,
        costPerUnitPEN: 0.35,
        isScalableLinearly: true,
        notes: '1 onza (30 ml) colada y fría'
      },
      {
        id: 'ing-jarabe-goma',
        name: 'Jarabe de goma simple (1:1 azúcar y agua)',
        quantity: 1,
        unit: 'cucharada' as any, // 1 oz / 30 ml
        wastePercentage: 0,
        costPerUnitPEN: 6.0,
        isScalableLinearly: true,
        notes: '1 onza (30 ml) neutro'
      },
      {
        id: 'ing-clara-sour',
        name: 'Clara de huevo fresco',
        quantity: 0.5,
        unit: 'unidad',
        wastePercentage: 0,
        costPerUnitPEN: 0.7,
        isScalableLinearly: true,
        notes: '1/2 onza (15 ml) para crear la corona de espuma sedosa'
      },
      {
        id: 'ing-hielo-roca',
        name: 'Cubos de hielo macizo cristalino',
        quantity: 5,
        unit: 'unidad',
        wastePercentage: 0,
        costPerUnitPEN: 0.1,
        isScalableLinearly: true
      },
      {
        id: 'ing-amargo-angostura',
        name: 'Amargo de Angostura',
        quantity: 2,
        unit: 'pizca',
        wastePercentage: 0,
        costPerUnitPEN: 45.0,
        isScalableLinearly: false,
        notes: '2 a 3 gotas en el centro de la espuma para neutralizar el olor a huevo'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Enfriamiento del vaso',
        instruction: 'Enfriar previamente la copa o vaso old fashioned llenándolo de hielo picado o manteniéndolo en el congelador.',
        timeMinutes: 1
      },
      {
        stepNumber: 2,
        title: 'Carga de la coctelera o licuadora',
        instruction: 'Verter en la coctelera el pisco Quebranta (3 oz), el jugo de limón sutil fresco (1 oz), el jarabe de goma (1 oz), la clara de huevo y 5 cubos de hielo macizo.',
        timeMinutes: 1
      },
      {
        stepNumber: 3,
        title: 'Batido enérgico (Shake)',
        instruction: 'Cerrar la coctelera y agitar con máxima energía durante 15 a 20 segundos para emulsionar la clara y enfriar la mezcla sin sobre-diluirla de agua.',
        timeMinutes: 1,
        visualCue: 'La coctelera de metal se cubre de una escarcha blanquecina por el frío intenso.'
      },
      {
        stepNumber: 4,
        title: 'Servido y aromatización',
        instruction: 'Descartar el hielo del vaso. Servir el cóctel en dos tiempos con colador de gusanillo para permitir que la espuma blanca de 1 cm se asiente en la superficie. Dejar caer 2 a 3 gotas de amargo de Angostura justo en el centro de la espuma.',
        timeMinutes: 1
      }
    ],
    equipmentNeeded: ['Coctelera Boston o Licuadora bar', 'Jigger graduado en onzas', 'Colador oruga', 'Vasos old fashioned o copas tulipán'],
    allergens: ['Huevos (Clara)'],
    dietaryTags: ['Cóctel con Denominación de Origen', 'Sin Gluten'],
    foodSafetyWarnings: [
      'Utilizar huevos frescos y de procedencia higiénica garantizada o claras pasteurizadas para bares de alto volumen.',
      'El alcohol y la acidez del limón no sustituyen la pasteurización.'
    ],
    shelfLifeAndStorage: 'Consumo inmediato tras ser batido.',
    presentationNotes: 'Debe presentar tres capas visuales: líquido dorado pálido translúcido, espuma blanca densa de 1 cm y gotas de amargo marrones en el centro.',
    pairings: {
      sauces: [],
      drinks: [],
      sides: ['Ceviche clásico de pescado', 'Tequeños criollos con salsa guacamole', 'Anticuchos'],
      desserts: []
    },
    traditionalSource: 'Fórmula canónica oficial de la Academia Peruana del Pisco y bartenders del Hotel Bolívar.',
    verificationStatus: 'Verificada',
    reviewedBy: 'Bartender Maestro Pisquero',
    lastUpdated: '2026-10-05',
    regionalVariants: [
      'Pisco Sour Catedral (dosis doble en copa grande)',
      'Maracuyá Sour',
      'Chicha Sour',
      'Pisco Sour de Coca'
    ],
    baseRawCostPEN: 6.80,
    suggestedPricePEN: 28.00
  }
];

// Helper functions for easy querying and filtering
export function getRecipeBySlug(slug: string): Recipe | undefined {
  return PERUVIAN_RECIPES.find((r) => r.slug === slug);
}

export function getRecipesByRegion(region: string): Recipe[] {
  if (region === 'Todas') return PERUVIAN_RECIPES;
  return PERUVIAN_RECIPES.filter((r) => r.region.toLowerCase() === region.toLowerCase());
}

export function getRecipesByCategory(category: string): Recipe[] {
  if (category === 'Todas') return PERUVIAN_RECIPES;
  return PERUVIAN_RECIPES.filter((r) => r.category.toLowerCase() === category.toLowerCase());
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.toLowerCase().trim();
  if (!q) return PERUVIAN_RECIPES;
  return PERUVIAN_RECIPES.filter((r) => 
    r.name.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.department.toLowerCase().includes(q) ||
    r.region.toLowerCase().includes(q) ||
    r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
  );
}

