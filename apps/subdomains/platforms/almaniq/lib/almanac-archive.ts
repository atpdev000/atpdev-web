export interface AlmanacEntry {
  dayLabel: string;
  year: string;
  category: 'Ciencia y Tecnología' | 'Historia Universal' | 'Cultura y Sociedad' | 'América y Mundo';
  title: string;
  summary: string;
  context: string;
  legacy: string;
}

export interface AlmanacMonthArchive {
  number: string;
  slug: string;
  name: string;
  subtitle: string;
  overview: string;
  historicalTheme: string;
  entries: AlmanacEntry[];
}

export const ALMANAC_MONTHS: AlmanacMonthArchive[] = [
  {
    number: '01',
    slug: 'enero',
    name: 'Enero',
    subtitle: 'Inicio de era astronómica, redes modernas y fundaciones urbanas',
    overview:
      'El primer mes del calendario gregoriano reúne hitos que marcaron transiciones estructurales: desde observaciones telescópicas que desmontaron el geocentrismo hasta el cambio de protocolo que dio forma operativa a Internet.',
    historicalTheme: 'Astronomía observacional, arquitectura de red e historia institucional',
    entries: [
      {
        dayLabel: '1 de enero',
        year: '1983',
        category: 'Ciencia y Tecnología',
        title: 'ARPANET adopta oficialmente el conjunto de protocolos TCP/IP',
        summary:
          'Durante el llamado Flag Day técnico, la red ARPANET completó la migración desde el antiguo Network Control Protocol (NCP) hacia TCP/IP, diseñado por Vinton Cerf y Bob Kahn.',
        context:
          'Antes de 1983 coexistían redes experimentales incompatibles entre sí. Un protocolo común capaz de enrutar paquetes entre redes heterogéneas resultó indispensable para conectar universidades, laboratorios y sistemas civiles sin depender de una única red central.',
        legacy:
          'La adopción generalizada de TCP/IP permitió que múltiples redes autónomas se interconectaran como una red de redes, base técnica directa de la Internet contemporánea.',
      },
      {
        dayLabel: '7 de enero',
        year: '1610',
        category: 'Ciencia y Tecnología',
        title: 'Galileo Galilei observa los primeros satélites naturales de Júpiter',
        summary:
          'Desde Padua, utilizando un telescopio refractor perfeccionado por él mismo, Galileo registró tres astros alineados junto a Júpiter (y un cuarto pocos días después) que orbitaban alrededor del planeta gigante.',
        context:
          'Hasta entonces, la cosmología aristotélica dominante sostenía que absolutamente todos los cuerpos celestes giraban en torno a la Tierra. Observar lunas orbitando otro planeta demostró empíricamente que existían múltiples centros de movimiento orbital.',
        legacy:
          'El hallazgo de los llamados satélites galileanos (Ío, Europa, Ganímedes y Calisto) consolidó la astronomía observacional moderna y aceleró el debate científico a favor del modelo heliocéntrico.',
      },
      {
        dayLabel: '18 de enero',
        year: '1535',
        category: 'América y Mundo',
        title: 'Fundación de la Ciudad de los Reyes (Lima) en el valle del Rímac',
        summary:
          'El conquistador Francisco Pizarro estableció formalmente la nueva capital administrativa junto a asentamientos costeros prehispánicos estratégicos cerca del océano Pacífico.',
        context:
          'Tras descartar asentamientos serranos más distantes del litoral como Jauja por dificultades logísticas, la corona buscó un emplazamiento con puerto cercano y valle agrícola fértil para articular rutas comerciales marítimas y terrestres.',
        legacy:
          'Lima evolucionó durante cinco siglos desde centro administrativo virreinal hasta metrópoli multicultural y eje institucional, académico y económico del Perú contemporáneo.',
      },
      {
        dayLabel: '27 de enero',
        year: '1945',
        category: 'Historia Universal',
        title: 'Liberación del complejo de Auschwitz-Birkenau',
        summary:
          'Tropas del Ejército Rojo liberaron a los prisioneros supervivientes del mayor complejo de campos de concentración y exterminio operado por el régimen nacionalsocialista en territorio ocupado de Polonia.',
        context:
          'El hallazgo directo de las instalaciones y testimonios documentados expuso ante el mundo la escala industrial de la persecución y exterminio perpetrada contra millones de personas, principalmente judíos europeos, además de otros grupos perseguidos.',
        legacy:
          'En 2005 la Asamblea General de la ONU instauró el 27 de enero como Día Internacional de Conmemoración en Memoria de las Víctimas del Holocausto para preservar la memoria histórica y combatir el negacionismo.',
      },
      {
        dayLabel: '29 de enero',
        year: '1886',
        category: 'Ciencia y Tecnología',
        title: 'Karl Benz solicita la patente del primer automóvil con motor de combustión',
        summary:
          'Karl Friedrich Benz presentó ante la Oficina Imperial de Patentes de Alemania la solicitud DRP n.º 37435 para su vehículo triciclo propulsado por motor de gasolina de cuatro tiempos.',
        context:
          'Mientras varios contemporáneos adaptaban motores a carruajes tirados por caballos, Benz diseñó el chasis tubular, la dirección, el encendido eléctrico y el sistema de refrigeración como una máquina unitaria pensada desde cero.',
        legacy:
          'El Benz Patent-Motorwagen inauguró la industria automotriz moderna y reconfiguró la infraestructura vial, urbana y energética del siglo XX.',
      },
    ],
  },
  {
    number: '02',
    slug: 'febrero',
    name: 'Febrero',
    subtitle: 'Física fundamental, biología molecular y reforma del calendario',
    overview:
      'Aunque es el mes más corto del año, febrero concentra avances decisivos en la comprensión física del universo, el desciframiento del código genético y la estandarización mundial del tiempo civil.',
    historicalTheme: 'Relatividad experimental, genética y medición del tiempo',
    entries: [
      {
        dayLabel: '4 de febrero',
        year: '2004',
        category: 'Cultura y Sociedad',
        title: 'Lanzamiento inicial de la plataforma universitaria TheFacebook',
        summary:
          'Un proyecto originalmente diseñado para directorios estudiantiles en la Universidad de Harvard abrió su primer servidor en línea, expandiéndose rápidamente hacia campus de América del Norte y luego al público general.',
        context:
          'La década de 2000 estuvo marcada por el paso de comunidades anónimas en foros hacia identidades digitales vinculadas a redes sociales reales y perfiles multimedia.',
        legacy:
          'Su expansión global transformó el consumo informativo, los modelos de publicidad digital y los debates jurídicos contemporáneos sobre privacidad y moderación de plataformas.',
      },
      {
        dayLabel: '11 de febrero',
        year: '2016',
        category: 'Ciencia y Tecnología',
        title: 'Anuncio histórico de la primera detección directa de ondas gravitacionales',
        summary:
          'Las colaboraciones científicas LIGO y Virgo confirmaron en conferencia simultánea la observación de ondulaciones en el tejido del espaciotiempo originadas por la fusión de dos agujeros negros.',
        context:
          'Albert Einstein había deducido la existencia de estas ondas en 1916 dentro de la relatividad general, aunque dudó durante décadas que algún instrumento humano alcanzara la sensibilidad necesaria para medir variaciones menores al diámetro de un protón.',
        legacy:
          'La señal GW150914 abrió la astronomía de ondas gravitacionales, permitiendo estudiar fenómenos cósmicos invisibles para telescopios ópticos o de radio.',
      },
      {
        dayLabel: '15 de febrero',
        year: '1564',
        category: 'Ciencia y Tecnología',
        title: 'Nacimiento de Galileo Galilei en Pisa',
        summary:
          'Nació el astrónomo, físico y matemático italiano cuyas leyes sobre caída libre, movimiento pendular y observación celeste sentaron las bases del método científico moderno.',
        context:
          'En una Europa renacentista dominada por el comentario filosófico de textos clásicos, Galileo insistió en redactar la naturaleza en lenguaje matemático y contrastar hipótesis mediante experimentos reproducibles.',
        legacy:
          'Su defensa metodológica del diálogo entre teoría matemática y medición empírica continúa siendo pilar esencial de toda disciplina física.',
      },
      {
        dayLabel: '21 de febrero',
        year: '1953',
        category: 'Ciencia y Tecnología',
        title: 'Deducción de la estructura de doble hélice del ADN en Cambridge',
        summary:
          'Francis Crick y James Watson completaron el modelo tridimensional de emparejamiento complementario de bases del ácido desoxirribonucleico en el Laboratorio Cavendish.',
        context:
          'El modelo se apoyó decisivamente en la famosa fotografía 51 y los datos cuantitativos de difracción de rayos X logrados por Rosalind Franklin y Maurice Wilkins en el King’s College de Londres.',
        legacy:
          'Comprender cómo las dos cadenas complementarias permiten la replicación fiel del material hereditario dio nacimiento a la biología molecular, la genómica y la medicina personalizada.',
      },
      {
        dayLabel: '24 de febrero',
        year: '1582',
        category: 'Historia Universal',
        title: 'Promulgación de la bula Inter gravissimas del calendario gregoriano',
        summary:
          'El papa Gregorio XIII firmó la reforma astronómica preparada por Aloysius Lilius y Christopher Clavius para alinear el año civil con el año trópico solar.',
        context:
          'El calendario juliano anterior acumulaba un error aproximado de once minutos por año, lo que había desplazado los equinoccios diez días respecto al calendario litúrgico y agrícola.',
        legacy:
          'La regla revisada de años bisiestos dio origen al calendario internacional que rige hoy la cronología civil, financiera y científica en casi todo el planeta.',
      },
    ],
  },
  {
    number: '03',
    slug: 'marzo',
    name: 'Marzo',
    subtitle: 'Propuesta de la Web, derechos civiles y grandes mentes de la física',
    overview:
      'Marzo coincide con el equinoccio y concentra documentos transformadores tanto en derechos sociales como en el nacimiento conceptual de la World Wide Web en el CERN.',
    historicalTheme: 'Arquitectura web, igualdad de derechos y física teórica',
    entries: [
      {
        dayLabel: '8 de marzo',
        year: '1975',
        category: 'Cultura y Sociedad',
        title: 'Institucionalización internacional del Día Internacional de la Mujer',
        summary:
          'Las Naciones Unidas comenzaron a conmemorar oficialmente el 8 de marzo recogiendo décadas de movimientos laborales, cívicos y sufragistas iniciados a inicios del siglo XX.',
        context:
          'Las marchas de trabajadoras textiles, las reivindicaciones salariales y las campañas por el derecho al voto en Europa y América moldearon la agenda de derechos civiles durante todo el siglo.',
        legacy:
          'Cada año la fecha sirve para evaluar avances en igualdad educativa, representación pública, ciencia y brechas laborales documentadas globalmente.',
      },
      {
        dayLabel: '12 de marzo',
        year: '1989',
        category: 'Ciencia y Tecnología',
        title: 'Tim Berners-Lee presenta la propuesta fundacional de la World Wide Web',
        summary:
          'El investigador británico redactó en el CERN el documento "Information Management: A Proposal", planteando un sistema distribuido de documentos enlazados mediante hipertexto.',
        context:
          'En un centro con miles de científicos visitantes usando computadores incompatibles, la información técnica y los organigramas solían perderse cuando terminaban las estancias temporales.',
        legacy:
          'Su superior Mike Sendall anotó en la portada "Vague, but exciting"; de aquella propuesta surgirían HTTP, HTML, el primer servidor web y la web abierta moderna.',
      },
      {
        dayLabel: '14 de marzo',
        year: '1879',
        category: 'Ciencia y Tecnología',
        title: 'Nacimiento de Albert Einstein en Ulm',
        summary:
          'Nació el físico teórico cuyos cuatro artículos de 1905 —sobre el efecto fotoeléctrico, el movimiento browniano, la relatividad especial y la equivalencia masa-energía— revolucionaron la ciencia.',
        context:
          'Al finalizar el siglo XIX existían contradicciones profundas entre las ecuaciones del electromagnetismo de Maxwell y la mecánica clásica newtoniana respecto a la velocidad de la luz.',
        legacy:
          'La relatividad general y sus contribuciones a la teoría cuántica continúan siendo indispensables en cosmología, GPS satelital, energía y tecnología óptica.',
      },
      {
        dayLabel: '25 de marzo',
        year: '1655',
        category: 'Ciencia y Tecnología',
        title: 'Christiaan Huygens descubre Titán, el mayor satélite de Saturno',
        summary:
          'Con lentes talladas junto a su hermano Constantijn, el astrónomo neerlandés identificó un satélite orbital claro alrededor de Saturno y explicó el aspecto cambiante de sus anillos.',
        context:
          'Durante décadas los observadores tempranos no lograban distinguir si Saturno presentaba orejas rígidas, dos lunas inmóviles o una estructura rodeándolo sin tocarlo.',
        legacy:
          'Titán resultó ser la única luna del sistema solar con atmósfera densa y lagos superficiales de hidrocarburos, investigada siglos después por la sonda europea Huygens.',
      },
      {
        dayLabel: '28 de marzo',
        year: '1930',
        category: 'Historia Universal',
        title: 'Adopción internacional oficial de los nombres Estambul y Ankara',
        summary:
          'El servicio postal y diplomático turco formalizó que las ciudades históricamente llamadas Constantinopla y Angora fueran designadas únicamente por sus nombres nacionales modernos.',
        context:
          'Tras la proclamación de la República de Turquía en 1923 y la reforma del alfabeto, la nueva administración estandarizó topónimos y trasladó el centro político hacia Anatolia.',
        legacy:
          'La medida consolidó la toponimia internacional vigente de la mayor metrópoli euroasiática y de la capital administrativa turca.',
      },
    ],
  },
  {
    number: '04',
    slug: 'abril',
    name: 'Abril',
    subtitle: 'Exploración orbital humana, telescopios espaciales y literatura universal',
    overview:
      'Abril condensa hitos esenciales de la era espacial y del patrimonio cultural impreso: el primer ser humano en órbita, el despliegue del telescopio Hubble y el homenaje mundial al libro.',
    historicalTheme: 'Astronáutica, genética clásica y patrimonio literario',
    entries: [
      {
        dayLabel: '12 de abril',
        year: '1961',
        category: 'Ciencia y Tecnología',
        title: 'Yuri Gagarin realiza el primer vuelo espacial tripulado de la historia',
        summary:
          'A bordo de la cápsula Vostok 1 lanzada desde Baikonur, el cosmonauta soviético completó una órbita completa alrededor de la Tierra en 108 minutos.',
        context:
          'Apenas cuatro años después del lanzamiento del satélite Sputnik 1, la ingeniería de cohetes permitió superar las aceleraciones de lanzamiento y la reentrada térmica manteniendo vivo a un tripulante.',
        legacy:
          'El vuelo de Gagarin inauguró la astronáutica tripulada y la observación directa del planeta Tierra desde el espacio.',
      },
      {
        dayLabel: '23 de abril',
        year: '1616',
        category: 'Cultura y Sociedad',
        title: 'Conmemoración universal de Cervantes, Shakespeare y el libro',
        summary:
          'En abril de 1616 fallecieron figuras cumbre de la literatura española e inglesa —Cervantes enterrado el 23 de abril en Madrid y Shakespeare fallecido el 23 de abril del calendario juliano— junto con el Inca Garcilaso de la Vega.',
        context:
          'Ambos escritores consolidaron el castellano y el inglés modernos mediante obras que exploraron las tensiones humanas, la ironía y la modernidad temprana.',
        legacy:
          'La UNESCO proclamó el 23 de abril como Día Mundial del Libro y del Derecho de Autor para fomentar la lectura, la traducción y la preservación editorial.',
      },
      {
        dayLabel: '24 de abril',
        year: '1990',
        category: 'Ciencia y Tecnología',
        title: 'Puesta en órbita del Telescopio Espacial Hubble',
        summary:
          'El transbordador espacial Discovery (misión STS-31) desplegó el observatorio orbital conjunto de la NASA y la Agencia Espacial Europea a unos 550 kilómetros de altura.',
        context:
          'Los telescopios terrestres sufren la turbulencia atmosférica y la absorción de radiación ultravioleta e infrarroja; situar un espejo de 2,4 metros en órbita prometía nitidez sin precedentes.',
        legacy:
          'Tras corregirse su óptica inicial en 1993, el Hubble permitió precisar la edad del universo, fotografiar campos profundos con miles de galaxias y caracterizar exoplanetas.',
      },
      {
        dayLabel: '25 de abril',
        year: '1953',
        category: 'Ciencia y Tecnología',
        title: 'Publicación en Nature del trío de artículos sobre la estructura del ADN',
        summary:
          'La revista científica británica difundió simultáneamente las investigaciones de Watson y Crick, el grupo de Maurice Wilkins y los resultados cristalográficos de Rosalind Franklin y Raymond Gosling.',
        context:
          'La publicación conjunta mostró tanto la elegancia teórica del apareamiento adenina-timina y guanina-citosina como su confirmación experimental mediante patrones de rayos X.',
        legacy:
          'Esa fecha es celebrada internacionalmente como el Día del ADN y marcó el punto de partida de la biotecnología moderna.',
      },
      {
        dayLabel: '26 de abril',
        year: '1986',
        category: 'Historia Universal',
        title: 'Accidente en la central nuclear de Chernóbil',
        summary:
          'Durante una prueba de seguridad eléctrica mal ejecutada, el reactor número 4 de la central cercana a Prípiat sufrió una explosión térmica y dispersión radiactiva de alcance continental.',
        context:
          'Defectos de diseño en las barras de control del reactor RBMK se combinaron con omisiones operativas y retrasos iniciales en la evacuación y comunicación pública.',
        legacy:
          'La tragedia impulsó organismos internacionales independientes de supervisión nuclear, mejoras en cultura de seguridad industrial y tratados de notificación temprana.',
      },
    ],
  },
  {
    number: '05',
    slug: 'mayo',
    name: 'Mayo',
    subtitle: 'Inmunología, revolución copernicana, relatividad y derechos laborales',
    overview:
      'Mayo enlaza la consolidación científica del heliocentrismo y la primera vacuna experimental con grandes avances en derechos sociales y geografía de alta montaña.',
    historicalTheme: 'Medicina preventiva, astronomía matemática y trabajo digno',
    entries: [
      {
        dayLabel: '1 de mayo',
        year: '1886',
        category: 'Cultura y Sociedad',
        title: 'Movilizaciones obreras en Estados Unidos por la jornada de ocho horas',
        summary:
          'Cientos de miles de trabajadores iniciaron paros pacíficos encabezados por Chicago para reclamar ocho horas de trabajo, ocho de descanso y ocho de formación personal.',
        context:
          'Durante la segunda Revolución Industrial eran habituales jornadas de doce a dieciséis horas seis días por semana sin límites estatutarios ni protecciones básicas.',
        legacy:
          'El 1 de mayo quedó instituido en la mayoría de países como el Día Internacional de los Trabajadores y base de la legislación laboral moderna.',
      },
      {
        dayLabel: '14 de mayo',
        year: '1796',
        category: 'Ciencia y Tecnología',
        title: 'Edward Jenner aplica la primera inoculación sistemática contra la viruela',
        summary:
          'El médico rural británico inoculó en el niño James Phipps fluido procedente de una pústula de viruela bovina leve, comprobando semanas después su inmunidad frente a la viruela humana.',
        context:
          'La viruela causaba epidemias devastadoras con altísima mortalidad. Jenner convirtió observaciones empíricas de lecheras rurales en un protocolo médico verificable y seguro.',
        legacy:
          'El método dio origen al término vacunación y culminó casi dos siglos después, en 1980, con la erradicación global oficial de la viruela.',
      },
      {
        dayLabel: '24 de mayo',
        year: '1543',
        category: 'Ciencia y Tecnología',
        title: 'Publicación de De revolutionibus orbium coelestium de Copérnico',
        summary:
          'La imprenta de Johannes Petreius en Núremberg entregó el tratado astronómico en el que Nicolás Copérnico situaba al Sol cerca del centro de las órbitas planetarias.',
        context:
          'Durante más de catorce siglos el modelo ptolemaico exigía complejos epiciclos matemáticos para explicar retrogradaciones aparentes sin cuestionar la inmovilidad terrestre.',
        legacy:
          'La obra inauguró el giro heliocéntrico desarrollado luego por Tycho Brahe, Johannes Kepler, Galileo y Newton.',
      },
      {
        dayLabel: '29 de mayo',
        year: '1919',
        category: 'Ciencia y Tecnología',
        title: 'Eclipse solar total confirma la relatividad general de Einstein',
        summary:
          'Las expediciones dirigidas por Arthur Eddington en la isla de Príncipe y Sobral (Brasil) midieron el desplazamiento aparente de estrellas cercanas al limbo solar oscurecido.',
        context:
          'La relatividad general predecía una curvatura gravitacional de la luz exactamente el doble de la estimada mediante física newtoniana clásica.',
        legacy:
          'La confirmación experimental convirtió la relatividad en marco estándar de la física gravitacional y consolidó la observación de lentes gravitacionales.',
      },
      {
        dayLabel: '29 de mayo',
        year: '1953',
        category: 'América y Mundo',
        title: 'Primer ascenso confirmado a la cumbre del monte Everest',
        summary:
          'El alpinista neozelandés Edmund Hillary y el sherpa nepalí Tenzing Norgay alcanzaron los 8848 metros del pico más alto de la Tierra en una expedición británica.',
        context:
          'Numerosos intentos previos desde la década de 1920 habían chocado con tormentas extremas, hipoxia severa y límites del equipamiento de altura.',
        legacy:
          'Su hazaña demostró el valor de la planificación logística, la tecnología de oxígeno suplementario y la cooperación estrecha entre guías locales y expedicionarios.',
      },
    ],
  },
  {
    number: '06',
    slug: 'junio',
    name: 'Junio',
    subtitle: 'Ciencias de la computación, cooperación multilateral y exploración espacial',
    overview:
      'Junio marca hitos cruciales del siglo XX: el nacimiento de Alan Turing, la firma de la Carta de la ONU y el primer viaje espacial realizado por una mujer.',
    historicalTheme: 'Informática teórica, derecho internacional y astronáutica',
    entries: [
      {
        dayLabel: '6 de junio',
        year: '1944',
        category: 'Historia Universal',
        title: 'Desembarco aliado en las playas de Normandía (Operación Overlord)',
        summary:
          'Más de 150 000 soldados británicos, estadounidenses, canadienses y aliados iniciaron el asalto anfibio y aerotransportado en el norte de Francia ocupado.',
        context:
          'Abrir un segundo frente occidental resultaba indispensable junto al avance en el frente oriental para liberar Europa continental de la ocupación nazi.',
        legacy:
          'La operación cambió el equilibrio estratégico europeo en menos de un año y aceleró el desenlace de la Segunda Guerra Mundial.',
      },
      {
        dayLabel: '16 de junio',
        year: '1963',
        category: 'Ciencia y Tecnología',
        title: 'Valentina Tereshkova se convierte en la primera mujer en el espacio',
        summary:
          'La cosmonauta despegó en la nave Vostok 6 y completó 48 órbitas terrestres en cerca de setenta horas realizando mediciones biomédicas y fotografía atmosférica.',
        context:
          'En plena competencia espacial de la Guerra Fría, el programa exploró la fisiología humana en microgravedad sin restringir la experiencia exclusivamente a pilotos militares masculinos.',
        legacy:
          'Tereshkova demostró plena capacidad de operación orbital femenina y abrió camino a generaciones posteriores de astronautas e ingenieras espaciales.',
      },
      {
        dayLabel: '23 de junio',
        year: '1912',
        category: 'Ciencia y Tecnología',
        title: 'Nacimiento de Alan Turing, pionero de la computabilidad moderna',
        summary:
          'Nació en Londres el matemático que formalizó el concepto de algoritmo mediante la máquina universal de Turing y lideró el descifrado de comunicaciones Enigma durante la guerra.',
        context:
          'En los años treinta los matemáticos intentaban resolver el problema de decisión planteado por David Hilbert sobre los límites formales de la demostración mecánica.',
        legacy:
          'Su modelo teórico sostiene la arquitectura lógica de los computadores programables, el análisis criptográfico y la investigación temprana en inteligencia artificial.',
      },
      {
        dayLabel: '26 de junio',
        year: '1945',
        category: 'Historia Universal',
        title: 'Firma de la Carta de las Naciones Unidas en San Francisco',
        summary:
          'Representantes de cincuenta naciones suscribieron el tratado constitutivo destinado a preservar la paz internacional, promover el desarrollo y proteger derechos fundamentales.',
        context:
          'Tras el fracaso de la Sociedad de Naciones y la devastación mundial de dos guerras totales, las potencias y países participantes diseñaron un foro permanente de derecho internacional.',
        legacy:
          'El documento dio soporte jurídico a organismos especializados como UNESCO, OMS, UNICEF y la Corte Internacional de Justicia.',
      },
      {
        dayLabel: '28 de junio',
        year: '1919',
        category: 'Historia Universal',
        title: 'Firma del Tratado de Versalles en París',
        summary:
          'Los aliados y Alemania suscribieron formalmente en el Palacio de Versalles el acuerdo de paz posterior al armisticio de la Primera Guerra Mundial.',
        context:
          'Las negociaciones buscaron redefinir fronteras europeas, repartir mandatos coloniales y establecer compensaciones económicas en un clima político polarizado.',
        legacy:
          'Las tensiones derivadas de sus cláusulas económicas y territoriales constituyeron objeto central de estudio para entender la diplomacia del siglo XX.',
      },
    ],
  },
  {
    number: '07',
    slug: 'julio',
    name: 'Julio',
    subtitle: 'Emancipaciones históricas, patrimonio andino y la llegada a la Luna',
    overview:
      'Julio ocupa un lugar singular tanto en la historia política de las Américas y Europa como en la historia tecnológica de la humanidad con el alunizaje del Apolo 11.',
    historicalTheme: 'Independencias americanas, patrimonio andino y conquista lunar',
    entries: [
      {
        dayLabel: '4 de julio',
        year: '1776',
        category: 'América y Mundo',
        title: 'Adopción de la Declaración de Independencia de los Estados Unidos',
        summary:
          'El Congreso Continental reunido en Filadelfia aprobó el documento redactado en gran medida por Thomas Jefferson enunciando derechos individuales inalienables y soberanía popular.',
        context:
          'Las tensiones fiscales y jurídicas entre las trece colonias y la Corona británica escalaron desde protestas comerciales hasta conflictos armados desde 1775.',
        legacy:
          'Sus principios filosóficos ilustrados influyeron directamente en constituciones republicanas tanto europeas como latinoamericanas.',
      },
      {
        dayLabel: '14 de julio',
        year: '1789',
        category: 'Historia Universal',
        title: 'Toma de la Bastilla e impulso decisivo de la Revolución francesa',
        summary:
          'Ciudadanos parisinos y milicias locales tomaron la fortaleza real de la Bastilla buscando municiones y desafiando la autoridad absolutista en plena crisis alimentaria y política.',
        context:
          'La convocatoria de los Estados Generales había puesto de relieve la incapacidad fiscal del Antiguo Régimen para sostener privilegios feudales frente al Tercer Estado.',
        legacy:
          'La fecha simboliza el tránsito hacia los Estados constitucionales basados en ciudadanía, separación de poderes y códigos civiles.',
      },
      {
        dayLabel: '20 de julio',
        year: '1969',
        category: 'Ciencia y Tecnología',
        title: 'Apolo 11 logra el primer alunizaje tripulado en la historia',
        summary:
          'El módulo lunar Eagle descendió en el Mar de la Tranquilidad, permitiendo a Neil Armstrong y Buzz Aldrin caminar sobre la Luna mientras Michael Collins orbitaba en el módulo Columbia.',
        context:
          'Cientos de miles de ingenieras, científicos y técnicos —incluidos equipos clave de computación en tiempo real— desarrollaron cohetes Saturno V, navegación inercial y trajes espaciales en menos de diez años.',
        legacy:
          'La misión demostró que la especie humana podía trasladarse a otro cuerpo celeste, recolectar muestras geológicas y regresar de forma segura.',
      },
      {
        dayLabel: '24 de julio',
        year: '1911',
        category: 'América y Mundo',
        title: 'Llegada de Hiram Bingham al santuario inca de Machu Picchu',
        summary:
          'Guiado por pobladores de la región del Urubamba como Melchor Arteaga, el investigador estadounidense documentó por primera vez ante revistas internacionales la ciudadela inca cubierta por vegetación.',
        context:
          'Construida en el siglo XV bajo el gobierno del inca Pachacútec, la ciudadela combinaba ingeniería hidráulica, terrazas antisísmicas y alineamientos astronómicos de precisión.',
        legacy:
          'Declarada Patrimonio Mundial por la UNESCO, Machu Picchu es emblema del ingenio arquitectónico andino y eje cultural de Sudamérica.',
      },
      {
        dayLabel: '28 de julio',
        year: '1821',
        category: 'América y Mundo',
        title: 'Proclamación de la Independencia del Perú en Lima',
        summary:
          'El general José de San Martín declaró públicamente la independencia peruana en cuatro plazas de Lima tras el repliegue realista hacia la sierra central.',
        context:
          'La emancipación combinó campañas libertadoras continentales desde el sur y el norte con levantamientos indígenas, criollos y populares previos iniciados desde el siglo XVIII.',
        legacy:
          'El proceso fundacional culminó militarmente en 1824 en Junín y Ayacucho, dando nacimiento a la República del Perú.',
      },
    ],
  },
  {
    number: '08',
    slug: 'agosto',
    name: 'Agosto',
    subtitle: 'Derechos humanos, canales interoceánicos y software libre fundacional',
    overview:
      'Agosto conecta grandes obras de ingeniería marítima, declaraciones fundamentales de ciudadanía y dos anuncios públicos de agosto de 1991 que moldearon la web y el software abierto.',
    historicalTheme: 'Web abierta, software libre e infraestructura global',
    entries: [
      {
        dayLabel: '6 de agosto',
        year: '1991',
        category: 'Ciencia y Tecnología',
        title: 'Apertura pública del proyecto World Wide Web en Internet',
        summary:
          'Tim Berners-Lee publicó en el grupo de noticias Usenet alt.hypertext la primera invitación abierta al público para descargar su navegador-editor y probar páginas web desde el CERN.',
        context:
          'Hasta entonces el sistema hipertextual había permanecido restringido dentro de laboratorios de física de altas energías y servidores internos europeos.',
        legacy:
          'Al liberarse las especificaciones sin regalías ni patentes cerradas en 1993, la web creció exponencialmente como bien público de comunicación global.',
      },
      {
        dayLabel: '15 de agosto',
        year: '1914',
        category: 'América y Mundo',
        title: 'Inauguración oficial al tránsito marítimo del Canal de Panamá',
        summary:
          'El buque SS Ancon realizó la primera travesía comercial completa entre los océanos Atlántico y Pacífico a través del sistema de esclusas del istmo panameño.',
        context:
          'La obra requirió excavaciones monumentales, control sanitario frente a fiebre amarilla y malaria liderado por equipos médicos y sistemas hidráulicos aprovechando el lago Gatún.',
        legacy:
          'Acortó miles de millas náuticas evitando rodear el cabo de Hornos y redefinió las cadenas logísticas marítimas mundiales.',
      },
      {
        dayLabel: '25 de agosto',
        year: '1991',
        category: 'Ciencia y Tecnología',
        title: 'Linus Torvalds anuncia el desarrollo temprano del núcleo Linux',
        summary:
          'El estudiante finlandés escribió un mensaje célebre en comp.os.minix describiendo un sistema operativo libre en construcción para procesadores 386/486 "solo como pasatiempo".',
        context:
          'Las estaciones Unix comerciales resultaban costosas para estudiantes e investigadores, mientras el proyecto GNU acumulaba compiladores y utilidades esperando un núcleo estable abierto.',
        legacy:
          'Combinado con herramientas GNU bajo licencia abierta, Linux pasó a impulsar la mayoría de servidores web, supercomputadoras y dispositivos móviles actuales.',
      },
      {
        dayLabel: '26 de agosto',
        year: '1789',
        category: 'Historia Universal',
        title: 'Aprobación de la Declaración de los Derechos del Hombre y del Ciudadano',
        summary:
          'La Asamblea Nacional Constituyente francesa definió los derechos naturales de libertad, igualdad jurídica, libertad de expresión y presunción de inocencia.',
        context:
          'El texto sintetizó la filosofía jurídica de la Ilustración europea en diecisiete artículos breves pensados con vocación universal.',
        legacy:
          'Sigue integrando el bloque constitucional francés vigente y sirvió de precedente directo para cartas modernas de derechos humanos.',
      },
      {
        dayLabel: '28 de agosto',
        year: '1963',
        category: 'Cultura y Sociedad',
        title: 'Marcha sobre Washington y el discurso "I Have a Dream"',
        summary:
          'Más de doscientos mil manifestantes se reunieron frente al Monumento a Lincoln para exigir derechos civiles y equidad económica, culminando con las palabras de Martin Luther King Jr.',
        context:
          'A casi un siglo de la abolición legal de la esclavitud, leyes discriminatorias y barreras de voto mantenían segregada a la población afroestadounidense en múltiples estados.',
        legacy:
          'La presión cívica pacífica aceleró la aprobación de la Ley de Derechos Civiles de 1964 y la Ley de Derecho al Voto de 1965.',
      },
    ],
  },
  {
    number: '09',
    slug: 'septiembre',
    name: 'Septiembre',
    subtitle: 'Primera circunnavegación, antibióticos, física de partículas y astronomía matemática',
    overview:
      'Septiembre reúne hazañas de navegación oceánica, predicciones matemáticas planetarias, medicina antibiótica y el arranque del mayor experimento de física de altas energías.',
    historicalTheme: 'Medicina moderna, física de partículas y exploración marítima',
    entries: [
      {
        dayLabel: '2 de septiembre',
        year: '1945',
        category: 'Historia Universal',
        title: 'Fin oficial de la Segunda Guerra Mundial en el frente del Pacífico',
        summary:
          'Representantes japoneses y aliados firmaron el acta formal de capitulación a bordo del acorazado USS Missouri en la bahía de Tokio, cerrando seis años de conflicto global.',
        context:
          'Entre 1939 y 1945 la guerra dejó decenas de millones de víctimas civiles y militares en Europa, Asia, África y el Pacífico, transformando fronteras e imperios.',
        legacy:
          'Su cierre dio paso a juicios penales internacionales, reconstrucción económica multilateral y al orden geopolítico de la posguerra.',
      },
      {
        dayLabel: '8 de septiembre',
        year: '1522',
        category: 'Historia Universal',
        title: 'Regreso de la nao Victoria a Sevilla tras dar la primera vuelta al mundo',
        summary:
          'Juan Sebastián Elcano y diecisiete navegantes supervivientes completaron la expedición iniciada por Fernando de Magallanes tres años antes, probando empíricamente la continuidad oceánica.',
        context:
          'Cinco naves habían partido en busca de una ruta occidental hacia las islas de las especias atravesando el estrecho austral de América y el vasto océano Pacífico.',
        legacy:
          'La travesía obligó incluso a descubrir la paradoja del día calendario ganado o perdido al circunnavegar longitudes terrestres.',
      },
      {
        dayLabel: '10 de septiembre',
        year: '2008',
        category: 'Ciencia y Tecnología',
        title: 'Circula el primer haz completo de protones en el Gran Colisionador de Hadrones',
        summary:
          'El anillo superconductor de 27 kilómetros del CERN bajo Ginebra completó con éxito las pruebas de circulación inicial de haces subatómicos a velocidades cercanas a la luz.',
        context:
          'Miles de físicos de más de cien países colaboraron en imanes criogénicos y detectores subterráneos como ATLAS y CMS para explorar escalas energéticas inéditas.',
        legacy:
          'Cuatro años después, los experimentos del LHC anunciaron el descubrimiento del bosón de Higgs, pieza clave del Modelo Estándar de partículas.',
      },
      {
        dayLabel: '23 de septiembre',
        year: '1846',
        category: 'Ciencia y Tecnología',
        title: 'Descubrimiento observado de Neptuno por cálculo matemático previo',
        summary:
          'Johann Gottfried Galle localizó el octavo planeta del sistema solar en menos de una hora apuntando exactamente al grado celeste predicho por el matemático Urbain Le Verrier.',
        context:
          'Urano mostraba anomalías orbitales que no encajaban con las perturbaciones de planetas conocidos; tanto John Couch Adams como Le Verrier dedujeron un cuerpo exterior invisible.',
        legacy:
          'Se convirtió en el triunfo paradigmático de la mecánica gravitacional predictiva: encontrar un mundo nuevo antes con papel y ecuaciones que con un telescopio.',
      },
      {
        dayLabel: '28 de septiembre',
        year: '1928',
        category: 'Ciencia y Tecnología',
        title: 'Alexander Fleming descubre el efecto antibacteriano de la penicilina',
        summary:
          'Al revisar placas de cultivo olvidadas en su laboratorio londinense, Fleming advirtió que un hongo del género Penicillium destruía colonias circundantes de estafilococos.',
        context:
          'Una infección bacteriana banal tras una herida o cirugía resultaba frecuentemente mortal al carecer la medicina de agentes selectivos internos eficaces.',
        legacy:
          'Aislada y purificada industrialmente en la década de 1940 por Howard Florey, Ernst Chain y equipos farmacéuticos, salvó cientos de millones de vidas.',
      },
    ],
  },
  {
    number: '10',
    slug: 'octubre',
    name: 'Octubre',
    subtitle: 'Satélites orbitales, vuelo supersónico y el primer enlace de Internet',
    overview:
      'Octubre inauguró en 1957 la era espacial con el Sputnik 1, vio nacer el primer mensaje entre nodos de ARPANET en 1969 y celebra cada 24 el vigor de la Carta de la ONU.',
    historicalTheme: 'Era espacial, redes de paquetes y encuentro entre continentes',
    entries: [
      {
        dayLabel: '4 de octubre',
        year: '1957',
        category: 'Ciencia y Tecnología',
        title: 'Lanzamiento del Sputnik 1, primer satélite artificial terrestre',
        summary:
          'La esfera metálica de 58 centímetros transmitió señales de radio audibles desde órbita elíptica alrededor de la Tierra durante tres semanas gracias a sus cuatro antenas.',
        context:
          'En el marco del Año Geofísico Internacional, ingenieros liderados por Serguéi Koroliov utilizaron un cohete R-7 adaptado para superar la velocidad orbital.',
        legacy:
          'Las señales captadas por radioaficionados de todo el mundo abrieron la ciencia espacial, las telecomunicaciones por satélite y la meteorología orbital.',
      },
      {
        dayLabel: '12 de octubre',
        year: '1492',
        category: 'América y Mundo',
        title: 'Llegada de la expedición de Cristóbal Colón a América',
        summary:
          'Las tres embarcaciones capitaneadas por Colón avistaron tierra en el archipiélago de las Bahamas tras más de dos meses de travesía atlántica buscando Asia por occidente.',
        context:
          'Diversas civilizaciones americanas desarrollaban complejos sistemas agrícolas, urbanos, astronómicos y estatales propios mucho antes del contacto transatlántico.',
        legacy:
          'El encuentro alteró de manera irreversible la demografía, ecología, lenguas, economía e historia política de todos los continentes.',
      },
      {
        dayLabel: '14 de octubre',
        year: '1947',
        category: 'Ciencia y Tecnología',
        title: 'Chuck Yeager supera por primera vez la barrera del sonido en vuelo nivelado',
        summary:
          'El piloto de pruebas alcanzó Mach 1,06 a gran altitud en California piloteando el avión experimental propulsado por cohete Bell X-1.',
        context:
          'Durante años numerosos aviadores temieron que la compresibilidad aerodinámica cerca de la velocidad del sonido desintegrara cualquier aeronave convencional.',
        legacy:
          'El empleo de un estabilizador horizontal totalmente móvil validó diseños aerodinámicos seguros para toda la aviación supersónica moderna.',
      },
      {
        dayLabel: '24 de octubre',
        year: '1945',
        category: 'Historia Universal',
        title: 'Entrada oficial en vigor de la Carta de las Naciones Unidas',
        summary:
          'Tras completarse las ratificaciones estatales exigidas por el tratado de San Francisco, la Organización de las Naciones Unidas quedó legalmente establecida.',
        context:
          'Las principales capitales buscaban mecanismos permanentes de mediación diplomática, cooperación técnica y reconstrucción humanitaria posbélica.',
        legacy:
          'El 24 de octubre se celebra anualmente en todo el mundo como Día de las Naciones Unidas.',
      },
      {
        dayLabel: '29 de octubre',
        year: '1969',
        category: 'Ciencia y Tecnología',
        title: 'Transmisión del primer mensaje entre computadoras en ARPANET',
        summary:
          'Estudiantes del equipo de Leonard Kleinrock en UCLA intentaron iniciar sesión remota hacia Stanford; el enlace envió las letras "LO" antes de reiniciar el sistema y completarse minutos después.',
        context:
          'A diferencia de las llamadas telefónicas de circuito dedicado, ARPANET dividía información digital en paquetes independientes reensamblados en destino.',
        legacy:
          'Ese intercambio experimental de dos letras inauguró las comunicaciones por conmutación de paquetes entre redes geográficamente distantes.',
      },
    ],
  },
  {
    number: '11',
    slug: 'noviembre',
    name: 'Noviembre',
    subtitle: 'Evolución biológica, radiactividad, estación orbital y caída del Muro de Berlín',
    overview:
      'Noviembre enlaza grandes síntesis científicas —desde El origen de las especies hasta Marie Curie y la Estación Espacial Internacional— con cierres históricos de guerras mundiales y bloques políticos.',
    historicalTheme: 'Ciencias de la vida, física nuclear y transformación geopolítica',
    entries: [
      {
        dayLabel: '7 de noviembre',
        year: '1867',
        category: 'Ciencia y Tecnología',
        title: 'Nacimiento de Marie Skłodowska-Curie en Varsovia',
        summary:
          'Nació la física y química pionera que acuñó el término radiactividad, descubrió los elementos polonio y radio junto a Pierre Curie y obtuvo dos premios Nobel en Física y Química.',
        context:
          'Ante las restricciones educativas de Polonia bajo dominio imperial, estudió clandestinamente antes de graduarse con honores en París.',
        legacy:
          'Sus investigaciones sentaron las bases de la física nuclear, la medicina radioterápica y abrieron paso a mujeres científicas en academias internacionales.',
      },
      {
        dayLabel: '9 de noviembre',
        year: '1989',
        category: 'Historia Universal',
        title: 'Apertura y caída del Muro de Berlín',
        summary:
          'Miles de ciudadanos cruzaron pacíficamente los puestos fronterizos berlineses tras veintiocho años de división física de la ciudad, desmantelando el símbolo más visible de la Guerra Fría.',
        context:
          'Semanas de manifestaciones masivas no violentas en Leipzig y Berlín Este, junto a reformas en Europa del Este, habían erosionado el control autoritario sobre la movilidad ciudadana.',
        legacy:
          'El acontecimiento precipitó la reunificación alemana en 1990 y la apertura política y económica de Europa Central y Oriental.',
      },
      {
        dayLabel: '11 de noviembre',
        year: '1918',
        category: 'Historia Universal',
        title: 'Entrada en vigor del armisticio que detuvo la Primera Guerra Mundial',
        summary:
          'A la undécima hora del undécimo día del undécimo mes cesaron oficialmente los combates en el frente occidental tras firmarse el armisticio en un vagón ferroviario en Compiègne.',
        context:
          'Cuatro años de guerra industrial de trincheras habían agotado recursos humanos y materiales de imperios enteros en Europa y Oriente Próximo.',
        legacy:
          'La fecha se recuerda anualmente como Día del Armisticio o Remembrance Day en homenaje a las víctimas de los conflictos armados.',
      },
      {
        dayLabel: '20 de noviembre',
        year: '1998',
        category: 'Ciencia y Tecnología',
        title: 'Lanzamiento de Zaryá, primer módulo de la Estación Espacial Internacional',
        summary:
          'Un cohete Protón lanzó desde Baikonur el primer bloque energético y propulsor de un laboratorio modular ensamblado en órbita por cinco agencias espaciales asociadas.',
        context:
          'La cooperación entre Estados Unidos, Rusia, Europa, Japón y Canadá superó programas separados previos para mantener presencia humana científica continua en órbita baja.',
        legacy:
          'Desde noviembre de 2000 la estación ha albergado tripulaciones ininterrumpidas realizando miles de experimentos médicos, biológicos y de materiales.',
      },
      {
        dayLabel: '24 de noviembre',
        year: '1859',
        category: 'Ciencia y Tecnología',
        title: 'Publicación de Sobre el origen de las especies de Charles Darwin',
        summary:
          'La editorial John Murray publicó en Londres los primeros 1250 ejemplares de la obra en la que Darwin exponía la evolución de la vida mediante selección natural.',
        context:
          'Observaciones recopiladas durante el viaje del HMS Beagle —en Sudamérica y las islas Galápagos— junto con aportes paralelos de Alfred Russel Wallace fundamentaron el argumento.',
        legacy:
          'Integrada más tarde con la genética mendeliana y molecular, constituye el marco unificador central de la biología contemporánea.',
      },
    ],
  },
  {
    number: '12',
    slug: 'diciembre',
    name: 'Diciembre',
    subtitle: 'Aviación propulsada, derechos humanos universales e interfaces gráficas',
    overview:
      'El cierre del año reúne invenciones que acortaron distancias globales —desde el primer vuelo de los hermanos Wright hasta la demostración de la interfaz gráfica moderna— y la carta ética universal de 1948.',
    historicalTheme: 'Aviación, computación interactiva y derechos humanos',
    entries: [
      {
        dayLabel: '2 de diciembre',
        year: '1942',
        category: 'Ciencia y Tecnología',
        title: 'Primera reacción nuclear en cadena autosostenida en Chicago Pile-1',
        summary:
          'Bajo las gradas de un estadio universitario en Chicago, Enrico Fermi y decenas de físicos demostraron la primera fisión controlada continua con bloques de grafito y uranio.',
        context:
          'El experimento buscaba validar cálculos teóricos sobre la liberación y moderación de neutrones térmicos bajo estricta vigilancia de seguridad experimental.',
        legacy:
          'Abrió tanto el uso de reactores para investigación médica y generación eléctrica como las complejas responsabilidades geopolíticas de la era atómica.',
      },
      {
        dayLabel: '9 de diciembre',
        year: '1968',
        category: 'Ciencia y Tecnología',
        title: 'Douglas Engelbart realiza "The Mother of All Demos" en San Francisco',
        summary:
          'Ante mil ingenieros e investigadores, Engelbart presentó en directo un prototipo operativo con ratón informático, videoconferencia, ventanas múltiples, hipertexto y edición compartida.',
        context:
          'En 1968 casi toda la computación dependía de tarjetas perforadas o terminales de texto línea por línea, haciendo difícil imaginar la interacción gráfica directa.',
        legacy:
          'Las ideas exhibidas en esa única conferencia de noventa minutos inspiraron directamente el desarrollo posterior de estaciones personales, sistemas de ventanas e interfaces web.',
      },
      {
        dayLabel: '10 de diciembre',
        year: '1948',
        category: 'Cultura y Sociedad',
        title: 'Proclamación de la Declaración Universal de los Derechos Humanos',
        summary:
          'La Asamblea General de la ONU reunida en el Palacio de Chaillot de París adoptó los treinta artículos que reconocen dignidad, igualdad jurídica y libertades básicas a toda persona.',
        context:
          'Redactada por un comité multicultural presidido por Eleanor Roosevelt con contribuciones clave de juristas de todos los continentes, buscó impedir que se repitieran atrocidades pasadas.',
        legacy:
          'Traducida a más de quinientos idiomas, sirve de referente moral y normativo para constituciones nacionales y tratados internacionales vinculantes.',
      },
      {
        dayLabel: '17 de diciembre',
        year: '1903',
        category: 'Ciencia y Tecnología',
        title: 'Primer vuelo controlado y propulsado de los hermanos Wright',
        summary:
          'Orville y Wilbur Wright lograron cuatro vuelos sucesivos en las dunas de Kitty Hawk, culminando el cuarto con 260 metros recorridos en 59 segundos contra viento frontal.',
        context:
          'A diferencia de pioneros que descuidaron la maniobrabilidad, los Wright construyeron un túnel de viento propio para diseñar perfiles alares y controles en tres ejes.',
        legacy:
          'Inauguraron la aviación práctica, conectando continentes mediante transporte aéreo civil y ciencia aeronáutica en cuestión de décadas.',
      },
      {
        dayLabel: '21 de diciembre',
        year: '1968',
        category: 'Ciencia y Tecnología',
        title: 'Despegue de Apolo 8, primer viaje humano alrededor de la Luna',
        summary:
          'Frank Borman, Jim Lovell y William Anders dejaron atrás la órbita terrestre baja y orbitaron la Luna diez veces antes de regresar intactos al océano Pacífico.',
        context:
          'Tras adelantar el vuelo para validar navegación lunar y comunicaciones espaciales profundas, la tripulación capturó por primera vez la icónica fotografía Earthrise.',
        legacy:
          'Ver la Tierra entera suspendida sobre el horizonte lunar impulsó una nueva conciencia ambiental planetaria y despejó la ruta para Apolo 11.',
      },
    ],
  },
];

export function getAlmanacMonth(slug: string): AlmanacMonthArchive | undefined {
  return ALMANAC_MONTHS.find((month) => month.slug === slug.toLowerCase());
}

