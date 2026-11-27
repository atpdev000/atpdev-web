export interface ColoringSheet {
  id: string;
  title: string;
  category: string;
  ageRange: string;
  difficulty: 'Fácil' | 'Media' | 'Detallada';
  tags: string[];
  description: string;
  svg: string;
}

export interface ColoringCategory {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  metaDescription: string;
  accentBg: string;
  accentText: string;
  intro: string;
  educationalBenefit: string;
  printingTip: string;
  faqs: Array<{ question: string; answer: string }>;
}

const wrapSvg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100"><rect width="850" height="1100" fill="#FFFFFF"/><rect x="44" y="44" width="762" height="1012" rx="26" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>${body}</svg>`;

export const COLORING_CATEGORIES: ColoringCategory[] = [
  {
    slug: 'dinosaurios',
    name: 'Dinosaurios para Colorear',
    shortName: 'Dinosaurios',
    headline: 'Dibujos de dinosaurios para colorear e imprimir en PDF gratis',
    metaDescription:
      'Descarga gratis dibujos de dinosaurios para colorear en PDF de alta resolución (300 DPI): T-Rex, Brontosaurio y Triceratops listos para imprimir o pintar online.',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    accentText: 'text-emerald-800 dark:text-emerald-300',
    intro:
      'Los dinosaurios despiertan la curiosidad científica desde los 3 años. Esta colección reúne láminas con contornos gruesos y limpios pensadas tanto para crayolas gruesas en educación inicial como para lápices de colores en primaria.',
    educationalBenefit:
      'Pintar dinosaurios estimula la coordinación visomotora, la diferenciación de formas geométricas (escamas, placas dorsales, huellas) y el vocabulario básico sobre especies prehistóricas y hábitats naturales.',
    printingTip:
      'Imprime en papel bond de 90 g a 120 g en tamaño Carta o A4. Si los niños usarán plumones de agua, coloca una hoja protectora debajo para evitar traspasos.',
    faqs: [
      {
        question: '¿Los dibujos de dinosaurios se descargan en PDF de alta calidad?',
        answer:
          'Sí. Cada lámina se rasteriza a 300 DPI reales (2550×3300 píxeles en Carta o tamaño A4) con trazos negros puros sobre fondo blanco para que no consuma tinta gris innecesaria.',
      },
      {
        question: '¿Puedo usar estas hojas de dinosaurios en clases o talleres escolares?',
        answer:
          'Sí, padres y docentes pueden imprimirlas libremente para aula, tareas o fiestas infantiles sin registro ni marcas de agua molestas.',
      },
    ],
  },
  {
    slug: 'animales-tiernos',
    name: 'Animales Tiernos Kawaii',
    shortName: 'Animales Tiernos',
    headline: 'Dibujos de animales tiernos kawaii para colorear en PDF',
    metaDescription:
      'Láminas imprimibles de animales tiernos estilo kawaii (gatito, osito, perrito y conejito) con trazos gruesos Bold & Easy para niños y principiantes.',
    accentBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    accentText: 'text-amber-800 dark:text-amber-300',
    intro:
      'El estilo Bold & Easy de animales tiernos es el favorito actual tanto en cuadernos infantiles como en libros relajantes para jóvenes. Cada ilustración mantiene espacios amplios y líneas definidas para pintar sin estrés.',
    educationalBenefit:
      'Ayuda a reconocer rasgos animales, emociones básicas y combinaciones armónicas de tonos pastel o vibrantes. Es ideal para desarrollar confianza en niños que recién aprenden a respetar bordes.',
    printingTip:
      'Funciona excelente en impresoras domésticas de inyección o láser en modo blanco y negro estándar. Selecciona "Ajustar a página" en tu visor PDF.',
    faqs: [
      {
        question: '¿Qué significa el estilo Bold & Easy en libros para colorear?',
        answer:
          'Consiste en contornos negros gruesos y zonas amplias sin sombreados grises complejos, facilitando el coloreado con plumones de alcohol, crayolas o lápices de colores.',
      },
      {
        question: '¿Puedo generar más animales tiernos personalizados con IA?',
        answer:
          'Sí. En la portada y en el Estudio KDP puedes escribir cualquier animal y escenario para generar nuevas láminas en segundos.',
      },
    ],
  },
  {
    slug: 'mandalas',
    name: 'Mandalas Fáciles y Relajantes',
    shortName: 'Mandalas',
    headline: 'Mandalas fáciles para colorear e imprimir gratis en PDF',
    metaDescription:
      'Descarga mandalas geométricos y florales para colorear en PDF 300 DPI. Ideales para reducir el estrés, trabajar concentración infantil y sesiones de arte terapia.',
    accentBg: 'bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800',
    accentText: 'text-violet-800 dark:text-violet-300',
    intro:
      'Los mandalas simétricos invitan a desconectar de las pantallas y entrenar la atención plena. Hemos diseñado patrones radiales con trazos nítidos que van desde pétalos amplios hasta estrellas concéntricas.',
    educationalBenefit:
      'Colorear figuras simétricas refuerza la percepción espacial, el ritmo visual, la paciencia y la regulación emocional tanto en escolares como en adultos.',
    printingTip:
      'Para técnicas con plumones o acuarelables, imprime sobre cartulina opalina de 180 g. Para lápices de madera, el papel bond de 90 g ofrece excelente agarre.',
    faqs: [
      {
        question: '¿Estos mandalas sirven para niños y adultos?',
        answer:
          'Sí. Incluimos mandalas de pétalos amplios aptos desde los 6 años y patrones geométricos con más secciones para jóvenes y adultos.',
      },
      {
        question: '¿Puedo colorear un mandala directamente en la pantalla?',
        answer:
          'Sí, pulsa "Colorear online" en cualquier diseño para rellenar cada pétalo y anillo con un clic y descargar tu obra terminada.',
      },
    ],
  },
  {
    slug: 'unicornios',
    name: 'Unicornios y Fantasía',
    shortName: 'Unicornios',
    headline: 'Dibujos de unicornios y mundos mágicos para colorear PDF',
    metaDescription:
      'Láminas de unicornios, castillos y arcoíris para colorear e imprimir gratis en PDF HD. Diseños claros para pintar online o en papel.',
    accentBg: 'bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-800',
    accentText: 'text-pink-800 dark:text-pink-300',
    intro:
      'Unicornios, nubes, castillos encantados y estrellas conforman una de las temáticas más pedidas por familias y docentes para actividades creativas y cuadernos de regalo.',
    educationalBenefit:
      'Fomenta la narrativa libre: tras pintar la escena, puedes pedir al niño que invente el nombre del personaje y cuente qué ocurre en el paisaje.',
    printingTip:
      'Los lápices metálicos y brillantinas en gel resaltan muy bien en arcoíris y estrellas cuando imprimes en papel blanco mate de 120 g.',
    faqs: [
      {
        question: '¿Necesito registrarme para descargar las hojas de unicornios?',
        answer:
          'No. Todas las láminas de la biblioteca pública se descargan en PDF 300 DPI en un clic y sin registro.',
      },
    ],
  },
  {
    slug: 'espacio',
    name: 'Espacio, Planetas y Cohetes',
    shortName: 'Espacio',
    headline: 'Dibujos del espacio, cohetes y planetas para colorear en PDF',
    metaDescription:
      'Imprime gratis dibujos de cohetes, planetas, astronautas y ovnis para colorear en PDF 300 DPI. Ideal para proyectos escolares del sistema solar.',
    accentBg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    accentText: 'text-blue-800 dark:text-blue-300',
    intro:
      'Desde cohetes despegando hasta planetas con anillos y amistosos visitantes espaciales, esta colección apoya proyectos escolares de ciencia y tardes creativas en casa.',
    educationalBenefit:
      'Permite introducir conceptos de astronomía básica (órbitas, satélites, estrellas, gravedad) mientras los niños experimentan contrastes entre fondos oscuros y elementos luminosos.',
    printingTip:
      'Puedes imprimir dos páginas por hoja si necesitas fichas pequeñas para pegar en el cuaderno escolar de ciencia.',
    faqs: [
      {
        question: '¿Sirven para tareas escolares sobre el sistema solar?',
        answer:
          'Sí, incluyen siluetas claras de planetas, estrellas, cohetes y naves que se imprimen con bordes definidos listos para recortar o pegar.',
      },
    ],
  },
  {
    slug: 'vehiculos',
    name: 'Autos, Trenes y Barcos',
    shortName: 'Vehículos',
    headline: 'Dibujos de autos, trenes y barcos para colorear gratis PDF',
    metaDescription:
      'Descarga dibujos para colorear de vehículos (auto de carreras, tren de vapor y barco velero) listos para imprimir en A4 y Carta.',
    accentBg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800',
    accentText: 'text-sky-800 dark:text-sky-300',
    intro:
      'Medios de transporte terrestres y marítimos con formas geométricas claras: ruedas, ventanas, chimeneas y velas grandes ideales para educación inicial y primaria.',
    educationalBenefit:
      'Refuerza el reconocimiento de medios de transporte (tierra, agua y aire), conteo de ruedas o vagones y seguridad vial básica.',
    printingTip:
      'Para niños de 3 a 5 años imprime al 100% en tamaño Carta o A4 para aprovechar las áreas amplias de coloreado.',
    faqs: [
      {
        question: '¿Puedo crear un libro completo de vehículos para Amazon KDP?',
        answer:
          'Sí. Desde el Estudio KDP puedes combinar páginas generadas por IA o subidas desde tu equipo y exportar el PDF interior 8.5×11" con reversos en blanco automáticos.',
      },
    ],
  },
  {
    slug: 'cultura-peruana',
    name: 'Perú y Cultura Andina',
    shortName: 'Cultura Peruana',
    headline: 'Dibujos del Perú para colorear: llama andina, montañas y tradiciones PDF',
    metaDescription:
      'Colección original de dibujos peruanos para colorear gratis en PDF: llama andina con chullo, montañas de Machu Picchu y naturaleza del Perú para escolares.',
    accentBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
    accentText: 'text-rose-800 dark:text-rose-300',
    intro:
      'Una serie pensada especialmente para colegios, Fiestas Patrias y familias en Perú y Latinoamérica: fauna andina, textiles geométricos y paisajes icónicos listos para imprimir.',
    educationalBenefit:
      'Acerca a los estudiantes a la identidad cultural, los pisos ecológicos andinos y la simbología geométrica textil mediante el arte práctico.',
    printingTip:
      'Ideal para murales escolares de julio o cuadernillos culturales; cada lámina mantiene márgenes amplios para anillar o encuadernar.',
    faqs: [
      {
        question: '¿Es un buen subnicho para publicar libros culturales en Amazon KDP?',
        answer:
          'Sí. A diferencia de temas saturados como "animales genéricos", los cuadernos educativos culturales y bilingües español-inglés tienen competencia mucho menor y alta valoración familiar.',
      },
    ],
  },
];

export const COLORING_SHEETS: ColoringSheet[] = [
  // 1. DINOSAURIOS
  {
    id: 'dino-brontosaurio',
    title: 'Brontosaurio Feliz en el Valle',
    category: 'dinosaurios',
    ageRange: '3–7 años',
    difficulty: 'Fácil',
    tags: ['dinosaurio', 'brontosaurio', 'infantil', 'fácil'],
    description: 'Tierno dinosaurio de cuello largo entre colinas, nubes y un sol sonriente.',
    svg: wrapSvg(`
      <circle cx="670" cy="180" r="62" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <line x1="670" y1="88" x2="670" y2="108" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <line x1="670" y1="252" x2="670" y2="272" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <line x1="578" y1="180" x2="598" y2="180" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <line x1="742" y1="180" x2="762" y2="180" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <path d="M130 220 C130 185 165 170 195 182 C210 155 258 155 275 184 C308 178 335 200 330 225 C325 250 155 252 130 220 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M44 820 Q230 740 430 810 T806 800 L806 1056 L44 1056 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M590 770 L660 570 L730 770 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M625 670 Q660 645 695 670" fill="none" stroke="#111111" stroke-width="5"/>
      <path d="M235 840 L235 675 C235 585 320 520 420 535 C470 542 505 568 525 535 C548 495 540 365 560 325 C580 285 655 280 675 325 C692 365 660 405 612 405 C592 405 595 510 580 575 C565 640 535 690 535 765 L535 845 L465 845 L465 760 L355 760 L355 845 L285 845 L285 755 C230 770 150 795 115 760 C95 740 120 715 160 720 C190 724 215 715 235 695" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="628" cy="336" r="10" fill="#111111"/>
      <path d="M628 368 Q650 380 668 366" fill="none" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
      <circle cx="385" cy="610" r="28" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="460" cy="645" r="22" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="320" cy="655" r="18" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <path d="M135 920 C155 880 185 880 205 920 C180 935 160 935 135 920 Z" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <path d="M640 935 C660 895 700 895 720 935 C690 950 670 950 640 935 Z" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
    `),
  },
  {
    id: 'dino-huevo',
    title: 'Bebé Dinosaurio Saliendo del Huevo',
    category: 'dinosaurios',
    ageRange: '3–6 años',
    difficulty: 'Fácil',
    tags: ['dinosaurio bebé', 'huevo', 'preescolar'],
    description: 'Pequeño dino curioso rompiendo su cascarón entre hojas prehistóricas.',
    svg: wrapSvg(`
      <path d="M44 860 Q425 810 806 860 L806 1056 L44 1056 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M250 560 C250 390 325 270 425 270 C525 270 600 390 600 560 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="370" cy="405" r="18" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="370" cy="405" r="8" fill="#111111"/>
      <circle cx="480" cy="405" r="18" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="480" cy="405" r="8" fill="#111111"/>
      <path d="M390 460 Q425 492 460 460" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <polygon points="400,272 425,215 450,272" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="330,305 340,248 378,284" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="520,305 510,248 472,284" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M210 580 L270 540 L330 595 L395 535 L455 595 L520 535 L580 590 L640 555 C655 740 570 890 425 890 C280 890 195 740 210 580 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="320" cy="700" r="34" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="515" cy="735" r="42" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="410" cy="805" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="155" cy="210" r="46" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="690" cy="210" r="32" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
    `),
  },
  {
    id: 'dino-estegosaurio',
    title: 'Estegosaurio con Placas Geométricas',
    category: 'dinosaurios',
    ageRange: '5–9 años',
    difficulty: 'Media',
    tags: ['estegosaurio', 'placas', 'prehistoria'],
    description: 'Estegosaurio amigable con grandes placas triangulares y helechos.',
    svg: wrapSvg(`
      <path d="M44 830 Q260 790 460 825 T806 815 L806 1056 L44 1056 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="315,430 355,340 400,425" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="400,415 450,320 495,420" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="495,435 550,355 585,465" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="240,485 268,405 315,465" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M125 655 C120 605 170 570 218 585 C255 480 350 420 455 425 C560 430 620 515 650 615 C695 625 745 615 765 585 C775 640 725 695 645 690 L645 835 L565 835 L565 725 L365 725 L365 835 L285 835 L285 705 C235 710 140 715 125 655 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="176" cy="628" r="9" fill="#111111"/>
      <path d="M148 666 Q175 680 198 665" fill="none" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
      <circle cx="420" cy="560" r="34" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="515" cy="595" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="335" cy="600" r="20" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="195" cy="185" r="56" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M555 215 C555 182 595 172 622 184 C640 154 690 156 705 186 C738 184 762 204 756 230 C748 256 575 254 555 215 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
    `),
  },

  // 2. ANIMALES TIERNOS KAWAII
  {
    id: 'kawaii-gatito-ovillo',
    title: 'Gatito Kawaii con Ovillo de Lana',
    category: 'animales-tiernos',
    ageRange: '3–8 años',
    difficulty: 'Fácil',
    tags: ['gatito', 'kawaii', 'bold and easy', 'mascota'],
    description: 'Gatito tierno de trazos gruesos jugando con un gran ovillo de lana y estrellas.',
    svg: wrapSvg(`
      <path d="M235 315 L205 175 L340 250 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <path d="M615 315 L645 175 L510 250 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <path d="M245 280 L230 212 L305 256 Z" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <path d="M605 280 L620 212 L545 256 Z" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <ellipse cx="425" cy="410" rx="215" ry="175" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="425" cy="705" rx="185" ry="165" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="425" cy="715" rx="95" ry="105" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="340" cy="400" r="24" fill="#111111"/>
      <circle cx="348" cy="392" r="8" fill="#FFFFFF"/>
      <circle cx="510" cy="400" r="24" fill="#111111"/>
      <circle cx="518" cy="392" r="8" fill="#FFFFFF"/>
      <ellipse cx="290" cy="445" rx="24" ry="14" fill="#FFFFFF" stroke="#111111" stroke-width="4"/>
      <ellipse cx="560" cy="445" rx="24" ry="14" fill="#FFFFFF" stroke="#111111" stroke-width="4"/>
      <polygon points="410,432 440,432 425,452" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <path d="M390 468 Q408 485 425 466 Q442 485 460 468" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <line x1="175" y1="400" x2="255" y2="412" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <line x1="168" y1="442" x2="252" y2="442" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <line x1="675" y1="400" x2="595" y2="412" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <line x1="682" y1="442" x2="598" y2="442" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <circle cx="625" cy="835" r="88" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M555 785 Q625 835 695 785 M545 835 Q625 885 705 835 M575 755 Q615 835 585 910 M665 755 Q635 835 665 910" fill="none" stroke="#111111" stroke-width="5"/>
      <ellipse cx="325" cy="855" rx="48" ry="34" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="485" cy="855" rx="48" ry="34" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
    `),
  },
  {
    id: 'kawaii-osito-miel',
    title: 'Osito Tierno con Tarro de Miel',
    category: 'animales-tiernos',
    ageRange: '3–8 años',
    difficulty: 'Fácil',
    tags: ['osito', 'miel', 'kawaii', 'infantil'],
    description: 'Osito alegre abrazando su tarro de miel rodeado de flores.',
    svg: wrapSvg(`
      <circle cx="255" cy="245" r="72" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="255" cy="245" r="38" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="595" cy="245" r="72" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="595" cy="245" r="38" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="425" cy="395" r="195" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="425" cy="445" rx="76" ry="58" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="348" cy="370" r="18" fill="#111111"/>
      <circle cx="502" cy="370" r="18" fill="#111111"/>
      <ellipse cx="425" cy="425" rx="22" ry="15" fill="#111111"/>
      <path d="M398 462 Q425 486 452 462" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="425" cy="730" rx="195" ry="185" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="335" y="640" width="180" height="175" rx="45" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="355" y="608" width="140" height="36" rx="14" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M342 688 Q372 722 400 692 Q425 732 452 692 Q482 720 510 688" fill="none" stroke="#111111" stroke-width="5"/>
      <ellipse cx="290" cy="715" rx="56" ry="40" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="560" cy="715" rx="56" ry="40" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="155" cy="875" r="32" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="695" cy="875" r="32" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
    `),
  },
  {
    id: 'kawaii-conejito-zanahoria',
    title: 'Conejito Alegre con Zanahoria Gigante',
    category: 'animales-tiernos',
    ageRange: '3–7 años',
    difficulty: 'Fácil',
    tags: ['conejo', 'zanahoria', 'tierno'],
    description: 'Conejito orejón sosteniendo una gran zanahoria en un jardín de primavera.',
    svg: wrapSvg(`
      <ellipse cx="345" cy="235" rx="48" ry="145" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="345" cy="245" rx="22" ry="98" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <ellipse cx="505" cy="235" rx="48" ry="145" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="505" cy="245" rx="22" ry="98" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="425" cy="445" r="158" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="362" cy="435" r="18" fill="#111111"/>
      <circle cx="488" cy="435" r="18" fill="#111111"/>
      <ellipse cx="425" cy="472" rx="16" ry="11" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <path d="M395 498 Q425 522 455 498" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="425" cy="740" rx="165" ry="155" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M350 675 L500 675 L425 915 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <path d="M425 675 L390 612 M425 675 L425 602 M425 675 L460 612" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
      <line x1="378" y1="735" x2="452" y2="735" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
      <line x1="396" y1="790" x2="450" y2="790" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="320" cy="740" rx="46" ry="34" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="530" cy="740" rx="46" ry="34" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
    `),
  },

  // 3. MANDALAS
  {
    id: 'mandala-flor-sol',
    title: 'Mandala Flor de Sol Simétrica',
    category: 'mandalas',
    ageRange: '6+ años y adultos',
    difficulty: 'Media',
    tags: ['mandala', 'flor', 'relajación', 'simetría'],
    description: 'Mandala circular de 12 pétalos amplios y anillos concéntricos para pintar con calma.',
    svg: wrapSvg(`
      <g transform="translate(425 550)">
        <circle r="330" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
        <circle r="295" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
        ${Array.from({ length: 12 }, (_, i) => `<g transform="rotate(${i * 30})"><path d="M0 -295 C48 -230 48 -175 0 -135 C-48 -175 -48 -230 0 -295 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/><circle cx="0" cy="-225" r="18" fill="#FFFFFF" stroke="#111111" stroke-width="5"/></g>`).join('')}
        <circle r="145" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
        ${Array.from({ length: 8 }, (_, i) => `<g transform="rotate(${i * 45})"><ellipse cx="0" cy="-95" rx="28" ry="48" fill="#FFFFFF" stroke="#111111" stroke-width="5"/></g>`).join('')}
        <circle r="54" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
        <circle r="24" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      </g>
    `),
  },
  {
    id: 'mandala-estrella-armonia',
    title: 'Mandala Estrella de Armonía',
    category: 'mandalas',
    ageRange: '8+ años y adultos',
    difficulty: 'Detallada',
    tags: ['mandala', 'estrella', 'geometría', 'antiestrés'],
    description: 'Diseño geométrico de 16 puntas radiales ideal para marcadores finos o lápices.',
    svg: wrapSvg(`
      <g transform="translate(425 550)">
        <circle r="335" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
        ${Array.from({ length: 16 }, (_, i) => `<g transform="rotate(${i * 22.5})"><polygon points="0,-325 30,-230 0,-185 -30,-230" fill="#FFFFFF" stroke="#111111" stroke-width="5"/></g>`).join('')}
        <circle r="195" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
        ${Array.from({ length: 8 }, (_, i) => `<g transform="rotate(${i * 45})"><polygon points="0,-190 42,-105 0,-55 -42,-105" fill="#FFFFFF" stroke="#111111" stroke-width="5"/><circle cx="0" cy="-125" r="16" fill="#FFFFFF" stroke="#111111" stroke-width="4"/></g>`).join('')}
        <circle r="62" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
        <polygon points="0,-46 14,-14 46,0 14,14 0,46 -14,14 -46,0 -14,-14" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      </g>
    `),
  },
  {
    id: 'mandala-jardin-facil',
    title: 'Mandala Jardín Fácil para Niños',
    category: 'mandalas',
    ageRange: '4–8 años',
    difficulty: 'Fácil',
    tags: ['mandala fácil', 'niños', 'pétalos grandes'],
    description: 'Mandala de secciones grandes y abiertas diseñado especialmente para manos pequeñas.',
    svg: wrapSvg(`
      <g transform="translate(425 550)">
        <circle r="320" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
        ${Array.from({ length: 8 }, (_, i) => `<g transform="rotate(${i * 45})"><circle cx="0" cy="-215" r="78" fill="#FFFFFF" stroke="#111111" stroke-width="7"/><circle cx="0" cy="-215" r="32" fill="#FFFFFF" stroke="#111111" stroke-width="5"/></g>`).join('')}
        <circle r="135" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
        <circle r="68" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      </g>
    `),
  },

  // 4. UNICORNIOS
  {
    id: 'unicornio-arcoiris',
    title: 'Unicornio Mágico bajo el Arcoíris',
    category: 'unicornios',
    ageRange: '4–9 años',
    difficulty: 'Fácil',
    tags: ['unicornio', 'arcoíris', 'nubes', 'fantasía'],
    description: 'Retrato tierno de unicornio con cuerno rayado, nubes esponjosas y arcoíris gigante.',
    svg: wrapSvg(`
      <path d="M120 420 A305 305 0 0 1 730 420" fill="none" stroke="#111111" stroke-width="7"/>
      <path d="M165 420 A260 260 0 0 1 685 420" fill="none" stroke="#111111" stroke-width="6"/>
      <path d="M210 420 A215 215 0 0 1 640 420" fill="none" stroke="#111111" stroke-width="6"/>
      <path d="M90 470 C90 420 140 400 175 420 C205 385 265 405 265 450 C295 455 295 500 250 505 L125 505 C88 505 80 485 90 470 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M585 470 C585 420 635 400 670 420 C700 385 760 405 760 450 C790 455 790 500 745 505 L620 505 C583 505 575 485 585 470 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="392,435 425,250 458,435" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <line x1="406" y1="365" x2="444" y2="352" stroke="#111111" stroke-width="5"/>
      <line x1="398" y1="405" x2="452" y2="392" stroke="#111111" stroke-width="5"/>
      <path d="M285 475 L250 365 L350 420 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M565 475 L600 365 L500 420 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="425" cy="600" rx="175" ry="165" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="425" cy="680" rx="135" ry="92" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M335 555 Q360 528 385 555" fill="none" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
      <path d="M465 555 Q490 528 515 555" fill="none" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
      <circle cx="385" cy="665" r="10" fill="#111111"/>
      <circle cx="465" cy="665" r="10" fill="#111111"/>
      <path d="M385 715 Q425 745 465 715" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <path d="M335 760 L335 940 L515 940 L515 760 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="180,835 196,872 236,875 205,900 215,938 180,916 145,938 155,900 124,875 164,872" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <polygon points="670,835 686,872 726,875 695,900 705,938 670,916 635,938 645,900 614,875 654,872" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
    `),
  },
  {
    id: 'unicornio-castillo',
    title: 'Castillo Encantado en las Nubes',
    category: 'unicornios',
    ageRange: '4–9 años',
    difficulty: 'Media',
    tags: ['castillo', 'fantasía', 'torres', 'princesas'],
    description: 'Castillo de cuento con torres, banderines, puerta arqueada y estrellas.',
    svg: wrapSvg(`
      <path d="M44 885 Q425 830 806 885 L806 1056 L44 1056 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <rect x="245" y="490" width="360" height="395" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="145" y="420" width="120" height="465" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="585" y="420" width="120" height="465" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="355" y="300" width="140" height="200" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="125,420 205,270 285,420" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="565,420 645,270 725,420" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="335,300 425,145 515,300" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M355 885 L355 710 A70 70 0 0 1 495 710 L495 885 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="180" y="510" width="50" height="80" rx="25" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <rect x="620" y="510" width="50" height="80" rx="25" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <rect x="395" y="365" width="60" height="85" rx="30" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="425,145 485,165 425,185" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="170" cy="175" r="42" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="695" cy="195" r="26" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
    `),
  },
  {
    id: 'unicornio-estrella-fuga',
    title: 'Corona Mágica y Varita de Estrellas',
    category: 'unicornios',
    ageRange: '3–7 años',
    difficulty: 'Fácil',
    tags: ['corona', 'estrella', 'fantasía', 'fácil'],
    description: 'Gran corona real con gemas y estrellas brillantes listas para colorear.',
    svg: wrapSvg(`
      <path d="M165 730 L125 360 L295 510 L425 275 L555 510 L725 360 L685 730 Z" fill="#FFFFFF" stroke="#111111" stroke-width="8" stroke-linejoin="round"/>
      <rect x="165" y="730" width="520" height="85" rx="24" fill="#FFFFFF" stroke="#111111" stroke-width="8"/>
      <circle cx="125" cy="340" r="26" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="425" cy="252" r="32" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="725" cy="340" r="26" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="425,525 468,590 425,655 382,590" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="285" cy="615" r="34" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="565" cy="615" r="34" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="265" cy="772" r="20" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="425" cy="772" r="20" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="585" cy="772" r="20" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
    `),
  },

  // 5. ESPACIO
  {
    id: 'espacio-cohete',
    title: 'Cohete Espacial rumbo a Saturno',
    category: 'espacio',
    ageRange: '4–9 años',
    difficulty: 'Fácil',
    tags: ['cohete', 'planetas', 'espacio', 'ciencia'],
    description: 'Cohete clásico surcando el espacio entre estrellas, la luna y un planeta con anillos.',
    svg: wrapSvg(`
      <path d="M425 170 C525 275 545 450 520 690 L330 690 C305 450 325 275 425 170 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M352 330 L498 330" stroke="#111111" stroke-width="7"/>
      <circle cx="425" cy="465" r="68" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="425" cy="465" r="42" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <path d="M330 560 L225 715 L335 690 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <path d="M520 560 L625 715 L515 690 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <path d="M360 690 L490 690 L465 895 L425 835 L385 895 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="675" cy="245" r="64" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <ellipse cx="675" cy="245" rx="110" ry="26" transform="rotate(-18 675 245)" fill="none" stroke="#111111" stroke-width="6"/>
      <circle cx="175" cy="255" r="54" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="158" cy="240" r="12" fill="#FFFFFF" stroke="#111111" stroke-width="4"/>
      <circle cx="194" cy="272" r="9" fill="#FFFFFF" stroke="#111111" stroke-width="4"/>
      <polygon points="180,825 194,860 232,864 202,888 212,925 180,904 148,925 158,888 128,864 166,860" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <polygon points="665,830 679,865 717,869 687,893 697,930 665,909 633,930 643,893 613,869 651,865" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
    `),
  },
  {
    id: 'espacio-sistema-solar',
    title: 'Planetas del Sistema Solar',
    category: 'espacio',
    ageRange: '6–10 años',
    difficulty: 'Media',
    tags: ['sistema solar', 'planetas', 'escolar'],
    description: 'El Sol y planetas orbitando en círculos perfectos para proyectos escolares.',
    svg: wrapSvg(`
      <circle cx="425" cy="550" r="118" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="425" cy="550" r="195" fill="none" stroke="#111111" stroke-width="4" stroke-dasharray="14 12"/>
      <circle cx="425" cy="550" r="280" fill="none" stroke="#111111" stroke-width="4" stroke-dasharray="14 12"/>
      <circle cx="425" cy="550" r="350" fill="none" stroke="#111111" stroke-width="4" stroke-dasharray="14 12"/>
      <circle cx="425" cy="355" r="36" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="675" cy="435" r="52" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="170" cy="655" r="64" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <ellipse cx="170" cy="655" rx="108" ry="26" transform="rotate(-22 170 655)" fill="none" stroke="#111111" stroke-width="6"/>
      <circle cx="490" cy="895" r="46" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="210" cy="260" r="42" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M395 540 Q425 575 455 540" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
      <circle cx="388" cy="512" r="9" fill="#111111"/>
      <circle cx="462" cy="512" r="9" fill="#111111"/>
    `),
  },
  {
    id: 'espacio-ovni',
    title: 'Platillo Volador Amistoso',
    category: 'espacio',
    ageRange: '4–8 años',
    difficulty: 'Fácil',
    tags: ['ovni', 'alien', 'nave', 'espacio'],
    description: 'Divertida nave espacial con cúpula transparente y rayo de luz sobre las estrellas.',
    svg: wrapSvg(`
      <polygon points="325,595 525,595 660,960 190,960" fill="#FFFFFF" stroke="#111111" stroke-width="6" stroke-dasharray="16 12"/>
      <path d="M275 455 A150 140 0 0 1 575 455 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="425" cy="415" r="54" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="404" cy="408" r="9" fill="#111111"/>
      <circle cx="446" cy="408" r="9" fill="#111111"/>
      <path d="M402 435 Q425 452 448 435" fill="none" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="425" cy="510" rx="285" ry="92" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="245" cy="510" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="365" cy="532" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="485" cy="532" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="605" cy="510" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="170" cy="220" r="38" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="685" cy="240" r="46" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
    `),
  },

  // 6. VEHÍCULOS
  {
    id: 'vehiculo-auto-carreras',
    title: 'Auto Deportivo en la Pista',
    category: 'vehiculos',
    ageRange: '3–8 años',
    difficulty: 'Fácil',
    tags: ['auto', 'carro', 'carreras', 'transporte'],
    description: 'Auto clásico de carreras con grandes ruedas, número en la puerta y paisaje.',
    svg: wrapSvg(`
      <line x1="44" y1="815" x2="806" y2="815" stroke="#111111" stroke-width="7"/>
      <line x1="100" y1="900" x2="230" y2="900" stroke="#111111" stroke-width="8" stroke-linecap="round"/>
      <line x1="350" y1="900" x2="495" y2="900" stroke="#111111" stroke-width="8" stroke-linecap="round"/>
      <line x1="610" y1="900" x2="740" y2="900" stroke="#111111" stroke-width="8" stroke-linecap="round"/>
      <path d="M120 715 L155 575 L275 560 L365 445 L565 445 L640 565 L735 595 L745 715 Z" fill="#FFFFFF" stroke="#111111" stroke-width="8" stroke-linejoin="round"/>
      <path d="M378 475 L548 475 L605 562 L305 562 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <line x1="455" y1="475" x2="455" y2="562" stroke="#111111" stroke-width="6"/>
      <circle cx="435" cy="645" r="42" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="255" cy="730" r="82" fill="#FFFFFF" stroke="#111111" stroke-width="8"/>
      <circle cx="255" cy="730" r="40" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="605" cy="730" r="82" fill="#FFFFFF" stroke="#111111" stroke-width="8"/>
      <circle cx="605" cy="730" r="40" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="680" cy="195" r="56" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M140 230 C140 195 178 182 208 194 C225 164 275 164 292 194 C326 190 350 212 344 238 C338 264 162 264 140 230 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
    `),
  },
  {
    id: 'vehiculo-tren',
    title: 'Tren de Vapor por las Montañas',
    category: 'vehiculos',
    ageRange: '3–8 años',
    difficulty: 'Fácil',
    tags: ['tren', 'locomotora', 'niños'],
    description: 'Locomotora clásica echando nubes de humo sobre las vías del tren.',
    svg: wrapSvg(`
      <line x1="44" y1="845" x2="806" y2="845" stroke="#111111" stroke-width="8"/>
      <circle cx="595" cy="270" r="44" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="520" cy="210" r="58" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="425" cy="175" r="48" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <rect x="550" y="340" width="84" height="165" rx="16" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="170" y="385" width="215" height="350" rx="18" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="148" y="348" width="260" height="44" rx="14" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="215" y="438" width="125" height="125" rx="16" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <rect x="385" y="495" width="305" height="240" rx="22" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="690,625 765,735 690,735" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <circle cx="265" cy="765" r="78" fill="#FFFFFF" stroke="#111111" stroke-width="8"/>
      <circle cx="265" cy="765" r="34" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="455" cy="785" r="58" fill="#FFFFFF" stroke="#111111" stroke-width="8"/>
      <circle cx="455" cy="785" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="605" cy="785" r="58" fill="#FFFFFF" stroke="#111111" stroke-width="8"/>
      <circle cx="605" cy="785" r="24" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
    `),
  },
  {
    id: 'vehiculo-barco',
    title: 'Velero Navegando en el Mar',
    category: 'vehiculos',
    ageRange: '3–8 años',
    difficulty: 'Fácil',
    tags: ['barco', 'velero', 'mar', 'verano'],
    description: 'Velero de dos velas grandes navegando sobre olas suaves con el sol brillante.',
    svg: wrapSvg(`
      <circle cx="660" cy="195" r="62" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="414" y="210" width="22" height="430" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="414,230 190,605 414,605" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <polygon points="436,275 640,605 436,605" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <polygon points="425,210 515,236 425,262" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M150 640 L700 640 L635 790 L215 790 Z" fill="#FFFFFF" stroke="#111111" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="315" cy="712" r="26" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="425" cy="712" r="26" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="535" cy="712" r="26" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M44 790 Q140 745 235 790 T425 790 T615 790 T806 790 L806 1056 L44 1056 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M90 895 Q185 860 280 895 T470 895 T660 895" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
    `),
  },

  // 7. CULTURA PERUANA
  {
    id: 'peru-llama-andina',
    title: 'Llama Andina con Manta Tradicional',
    category: 'cultura-peruana',
    ageRange: '4–10 años',
    difficulty: 'Media',
    tags: ['perú', 'llama', 'andes', 'fiestas patrias'],
    description: 'Simpática llama peruana con chullo, manta geométrica andina y cordillera al fondo.',
    svg: wrapSvg(`
      <polygon points="44,780 230,450 420,780" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="340,780 570,390 806,780" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <circle cx="170" cy="195" r="54" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M44 780 L806 780 L806 1056 L44 1056 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <ellipse cx="320" cy="300" rx="22" ry="72" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <ellipse cx="400" cy="300" rx="22" ry="72" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M265 890 L265 565 L295 360 C295 320 425 320 435 375 C445 430 420 535 450 560 L585 560 C645 560 660 620 650 695 L635 890 L570 890 L570 735 L395 735 L395 890 L330 890 L330 735 L265 735 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
      <rect x="425" y="560" width="165" height="125" rx="16" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <polygon points="460,622 485,590 510,622 485,654" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <polygon points="515,622 540,590 565,622 540,654" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <circle cx="342" cy="405" r="10" fill="#111111"/>
      <path d="M312 438 Q336 456 360 438" fill="none" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
    `),
  },
  {
    id: 'peru-machu-picchu',
    title: 'Montaña Huayna Picchu y Andenes',
    category: 'cultura-peruana',
    ageRange: '6–11 años',
    difficulty: 'Media',
    tags: ['machu picchu', 'cusco', 'perú', 'escolar'],
    description: 'Paisaje simplificado de andenes incas y la montaña sagrada bajo el sol andino.',
    svg: wrapSvg(`
      <circle cx="670" cy="185" r="64" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M165 740 C260 440 340 275 425 260 C510 275 585 460 685 740 Z" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M44 740 L806 740 L806 820 L44 820 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M44 820 L806 820 L806 900 L44 900 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M44 900 L806 900 L806 980 L44 980 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M44 980 L806 980 L806 1056 L44 1056 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <rect x="255" y="615" width="120" height="125" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="235,615 315,540 395,615" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <rect x="295" y="665" width="40" height="75" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
      <rect x="465" y="635" width="110" height="105" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <polygon points="445,635 520,565 595,635" fill="#FFFFFF" stroke="#111111" stroke-width="7"/>
      <path d="M115 245 C115 212 152 200 182 212 C198 184 248 184 265 214 C295 210 320 232 314 256 C308 282 135 282 115 245 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
    `),
  },
  {
    id: 'peru-sol-inti',
    title: 'Sol Andino Inti Geométrico',
    category: 'cultura-peruana',
    ageRange: '5–10 años',
    difficulty: 'Fácil',
    tags: ['inti', 'sol', 'cultura inca', 'perú'],
    description: 'Emblema tradicional del sol andino con rayos alternos y rostro sereno para pintar.',
    svg: wrapSvg(`
      <g transform="translate(425 550)">
        ${Array.from({ length: 12 }, (_, i) => `<g transform="rotate(${i * 30})"><polygon points="0,-325 36,-200 -36,-200" fill="#FFFFFF" stroke="#111111" stroke-width="7" stroke-linejoin="round"/></g>`).join('')}
        <circle r="195" fill="#FFFFFF" stroke="#111111" stroke-width="8"/>
        <circle r="158" fill="#FFFFFF" stroke="#111111" stroke-width="5"/>
        <path d="M-85 -22 Q-52 -52 -20 -22" fill="none" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
        <path d="M20 -22 Q52 -52 85 -22" fill="none" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
        <circle cx="-52" cy="2" r="11" fill="#111111"/>
        <circle cx="52" cy="2" r="11" fill="#111111"/>
        <path d="M-45 64 Q0 96 45 64" fill="none" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
      </g>
    `),
  },
];

export function getCategoryBySlug(slug: string): ColoringCategory | undefined {
  return COLORING_CATEGORIES.find((c) => c.slug === slug);
}

export function getSheetsByCategory(slug: string): ColoringSheet[] {
  return COLORING_SHEETS.filter((s) => s.category === slug);
}

export function svgToDataUrl(svg: string): string {
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf-8').toString('base64')}`;
}

