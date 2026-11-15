export interface ComputingEntry {
  dayLabel: string;
  year: string;
  category:
    | 'Protocolos y Web'
    | 'Sistemas Operativos'
    | 'Lenguajes y Compiladores'
    | 'Hardware y Fundamentos';
  title: string;
  summary: string;
  technicalContext: string;
  impact: string;
}

export interface ComputingMonthArchive {
  number: string;
  slug: string;
  name: string;
  subtitle: string;
  overview: string;
  focusArea: string;
  entries: ComputingEntry[];
}

export const COMPUTING_MONTHS: ComputingMonthArchive[] = [
  {
    number: '01',
    slug: 'enero',
    name: 'Enero',
    subtitle: 'Época Unix, migración a TCP/IP y ordenadores personales con interfaz gráfica',
    overview:
      'Enero reúne marcas fundacionales de la infraestructura temporal y de red del software moderno, desde el origen de los timestamps POSIX hasta el salto de ARPANET a TCP/IP y la llegada del primer Macintosh.',
    focusArea: 'Redes interconectadas, sistemas POSIX y criptografía distribuida',
    entries: [
      {
        dayLabel: '1 de enero',
        year: '1970',
        category: 'Sistemas Operativos',
        title: 'Inicio oficial de la Época Unix (Unix Epoch)',
        summary:
          'Las 00:00:00 UTC del 1 de enero de 1970 quedaron fijadas como el punto cero de tiempo para sistemas tipo Unix y el estándar POSIX (`time_t`).',
        technicalContext:
          'Los desarrolladores iniciales de Unix en Bell Labs necesitaban un origen limpio cercano al lanzamiento del sistema para almacenar marcas de tiempo como enteros simples de segundos sin desperdiciar bits.',
        impact:
          'Casi todos los lenguajes modernos, protocolos de red, sistemas de archivos y bases de datos utilizan Unix timestamps en segundos o milisegundos como base interoperable.',
      },
      {
        dayLabel: '1 de enero',
        year: '1983',
        category: 'Protocolos y Web',
        title: 'Transición operativa de ARPANET a TCP/IP (Flag Day)',
        summary:
          'ARPANET desconectó el protocolo NCP anterior y exigió que todos los anfitriones conectados utilizaran la arquitectura de paquetes TCP/IP especificada por Vinton Cerf y Bob Kahn.',
        technicalContext:
          'NCP asumía una única red homogénea confiable. TCP/IP separó el enrutamiento sin estado entre redes distintas (IP) del control de flujo y retransmisión punto a punto (TCP).',
        impact:
          'Esa arquitectura por capas permitió interconectar redes universitarias, comerciales y móviles dispares bajo un mismo direccionamiento lógico.',
      },
      {
        dayLabel: '3 de enero',
        year: '2009',
        category: 'Protocolos y Web',
        title: 'Creación del bloque génesis de Bitcoin',
        summary:
          'El software inicial publicado bajo el seudónimo Satoshi Nakamoto generó el bloque cero de una red peer-to-peer capaz de mantener consenso distribuido sin servidor central.',
        technicalContext:
          'El diseño integró firmas criptográficas de clave pública, árboles de Merkle y prueba de trabajo basada en SHA-256 para prevenir el doble gasto sin intermediarios de confianza.',
        impact:
          'Impulsó investigación aplicada en tolerancia a fallos bizantinos, criptografía verificable y estructuras de datos inmutables en sistemas distribuidos.',
      },
      {
        dayLabel: '15 de enero',
        year: '2001',
        category: 'Protocolos y Web',
        title: 'Lanzamiento público de Wikipedia sobre arquitectura Wiki',
        summary:
          'Jimmy Wales y Larry Sanger abrieron la edición colaborativa abierta de Wikipedia permitiendo a miles de colaboradores construir y revisar artículos en línea mediante software wiki.',
        technicalContext:
          'Al emplear páginas editables en navegador con historial de revisiones revertible en segundos, la plataforma demostró la resiliencia práctica de los sistemas colaborativos optimistas.',
        impact:
          'Se convirtió en el mayor repositorio enciclopédico abierto de la web y en corpus de referencia para motores de búsqueda e investigación lingüística.',
      },
      {
        dayLabel: '24 de enero',
        year: '1984',
        category: 'Hardware y Fundamentos',
        title: 'Presentación del Apple Macintosh 128K',
        summary:
          'Apple lanzó su ordenador doméstico con procesador Motorola 68000, ratón de serie e interfaz gráfica basada en ventanas, iconos, carpetas y tipografías rasterizadas.',
        technicalContext:
          'Inspirado en prototipos previos de Xerox PARC, el equipo de QuickDraw optimizó primitivas gráficas enteras en ROM para ofrecer respuesta fluida con apenas 128 KB de RAM.',
        impact:
          'Popularizó las interfaces WIMP (ventanas, iconos, menús y puntero) como paradigma dominante de interacción hombre-máquina durante décadas.',
      },
    ],
  },
  {
    number: '02',
    slug: 'febrero',
    name: 'Febrero',
    subtitle: 'ENIAC, nacimiento público de Python, Manifiesto Ágil y Open Source',
    overview:
      'Febrero marca la transición desde la computación electrónica pionera de 1946 hasta lenguajes de alto nivel como Python, la definición del término Open Source y las metodologías ágiles de ingeniería.',
    focusArea: 'Lenguajes dinámicos, ingeniería ágil e historia del software libre',
    entries: [
      {
        dayLabel: '10 de febrero',
        year: '1996',
        category: 'Hardware y Fundamentos',
        title: 'IBM Deep Blue gana su primera partida clásica frente a Garry Kasparov',
        summary:
          'En Filadelfia, el supercomputador especializado de IBM derrotó por primera vez bajo control de tiempo clásico a un campeón mundial vigente de ajedrez en partida de torneo.',
        technicalContext:
          'Combinaba algoritmos paralelos de poda alfa-beta con chips VLSI diseñados específicamente para evaluar millones de posiciones por segundo.',
        impact:
          'Marcó un punto de inflexión en búsqueda heurística distribuida y diseño de aceleradores hardware dedicados.',
      },
      {
        dayLabel: '11-13 de febrero',
        year: '2001',
        category: 'Lenguajes y Compiladores',
        title: 'Redacción del Manifiesto por el Desarrollo Ágil de Software',
        summary:
          'Diecisiete referentes de programación extrema, Scrum y arquitectura evolutiva firmaron en Snowbird cuatro valores y doce principios centrados en entregas frecuentes y retroalimentación continua.',
        technicalContext:
          'La década de los noventa mostró altos índices de fracaso en proyectos rígidos tipo cascada incapaces de adaptarse a requisitos cambiantes en entornos web.',
        impact:
          'Transformó prácticas globales de ingeniería mediante iteraciones cortas, integración continua y pruebas automatizadas cercanas al usuario.',
      },
      {
        dayLabel: '14 de febrero',
        year: '1946',
        category: 'Hardware y Fundamentos',
        title: 'Presentación pública de ENIAC en la Universidad de Pensilvania',
        summary:
          'Se exhibió públicamente el computador electrónico de propósito general basado en más de diecisiete mil tubos de vacío, programado físicamente mediante tableros por seis matemáticas pioneras.',
        technicalContext:
          'Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Wescoff, Fran Bilas y Ruth Lichterman desarrollaron subrutinas, depuración y mapeo de diagramas de cables antes de que existieran compiladores.',
        impact:
          'Demostró velocidades de cálculo numérico mil veces superiores a los relés electromecánicos previos e inauguró la programación electrónica práctica.',
      },
      {
        dayLabel: '20 de febrero',
        year: '1991',
        category: 'Lenguajes y Compiladores',
        title: 'Guido van Rossum publica Python 0.9.0 en Usenet',
        summary:
          'El creador neerlandés compartió la primera entrega pública del intérprete en alt.sources, incorporando indentación significativa, clases con herencia, módulos y manejo de excepciones.',
        technicalContext:
          'Diseñado en el CWI de Ámsterdam como sucesor accesible del lenguaje educativo ABC sin sacrificar extensibilidad directa hacia módulos nativos en C.',
        impact:
          'Décadas más tarde Python consolidó su papel en automatización de sistemas, desarrollo backend, ciencia de datos y aprendizaje automático.',
      },
      {
        dayLabel: '23 de febrero',
        year: '1998',
        category: 'Protocolos y Web',
        title: 'Acuñación institucional de Open Source y fundación de la OSI',
        summary:
          'Bruce Perens y Eric S. Raymond impulsaron la Open Source Initiative para promover licencias con código abierto accesible bajo criterios pragmáticos dirigidos al sector técnico y empresarial.',
        technicalContext:
          'La iniciativa respondió directamente al anuncio de Netscape de liberar el código fuente de su navegador comercial para aprovechar la revisión distribuida comunitaria.',
        impact:
          'Estableció la definición estándar de licencias abiertas certificadas utilizada en repositorios, auditorías de cumplimiento y ecosistemas de paquetes actuales.',
      },
    ],
  },
  {
    number: '03',
    slug: 'marzo',
    name: 'Marzo',
    subtitle: 'Propuesta hipertextual de la Web, primer dominio .com, Pentium y Mozilla',
    overview:
      'Marzo aloja momentos clave para la web abierta: el primer dominio comercial registrado bajo DNS, la propuesta original de Tim Berners-Lee en 1989, la invención del Wiki y la liberación del código de Netscape.',
    focusArea: 'Web semántica, arquitectura DNS y navegadores abiertos',
    entries: [
      {
        dayLabel: '12 de marzo',
        year: '1989',
        category: 'Protocolos y Web',
        title: 'Tim Berners-Lee entrega la propuesta fundacional de la World Wide Web',
        summary:
          'El documento "Information Management: A Proposal" describió en el CERN cómo vincular documentos heterogéneos mediante enlaces hipertextuales sin autoridad jerárquica centralizada.',
        technicalContext:
          'Su propuesta sustituyó árboles rígidos de ficheros por identificadores uniformes de recursos y una interfaz independiente de hardware o sistema operativo.',
        impact:
          'Sentó la filosofía arquitectónica de HTTP, HTML y URL sobre la que opera toda aplicación web moderna.',
      },
      {
        dayLabel: '15 de marzo',
        year: '1985',
        category: 'Protocolos y Web',
        title: 'Registro histórico de symbolics.com, primer dominio .com en DNS',
        summary:
          'La empresa fabricante de máquinas Lisp Symbolics Inc. registró el primer dominio comercial del Sistema de Nombres de Dominio poco antes de su expansión masiva en los años noventa.',
        technicalContext:
          'Previamente los administradores dependían de un archivo centralizado HOSTS.TXT distribuido periódicamente; el DNS jerárquico resolvió escalabilidad y delegación de zonas.',
        impact:
          'Abrió el direccionamiento memorable de marcas y servicios sobre direcciones IP en todo el mundo.',
      },
      {
        dayLabel: '22 de marzo',
        year: '1993',
        category: 'Hardware y Fundamentos',
        title: 'Intel lanza el procesador Pentium P5 con arquitectura superescalar',
        summary:
          'Intel introdujo la primera generación comercial x86 con doble canalización entera (pipelines U y V), predicción de saltos y cachés separadas L1 para instrucciones y datos.',
        technicalContext:
          'Superar la barrera de una instrucción por ciclo en arquitectura CISC permitió sostener compatibilidad binaria heredada ganando rendimiento cercano al mundo RISC.',
        impact:
          'Marcó una era en computación personal multimedia, juegos 3D tempranos y servidores x86 estándar.',
      },
      {
        dayLabel: '25 de marzo',
        year: '1995',
        category: 'Protocolos y Web',
        title: 'Ward Cunningham pone en marcha WikiWikiWeb',
        summary:
          'Inspirado en los autobuses rápidos "Wiki Wiki" de Hawái, Cunningham desplegó en Portland Pattern Repository la primera aplicación web editable colaborativamente por visitantes.',
        technicalContext:
          'Introdujo marcado ligero legible en texto plano, enlaces automáticos entre páginas y edición directa vía formulario HTTP sin clientes FTP externos.',
        impact:
          'Creó el modelo de base de conocimiento comunitaria sobre el que evolucionaron miles de wikis técnicas y documentación colaborativa.',
      },
      {
        dayLabel: '31 de marzo',
        year: '1998',
        category: 'Protocolos y Web',
        title: 'Liberación pública del código fuente de Netscape Communicator',
        summary:
          'Netscape publicó millones de líneas del código de su suite de navegación bajo licencia abierta, dando origen al proyecto Mozilla en mozilla.org.',
        technicalContext:
          'La base heredada requería una reescritura modular multiplataforma —materializada luego en el motor Gecko— para competir frente al dominio integrado del sistema operativo.',
        impact:
          'Aseguró la supervivencia de navegadores independientes basados en estándares W3C y originó Mozilla Firefox.',
      },
    ],
  },
  {
    number: '04',
    slug: 'abril',
    name: 'Abril',
    subtitle: 'RFC 1 de Internet, NCSA Mosaic y liberación libre de la Web',
    overview:
      'Abril marca los cimientos institucionales y técnicos del ecosistema abierto: la publicación del primer RFC de ARPANET, el nacimiento de pioneros del hardware personal y la cesión gratuita de la Web al dominio público.',
    focusArea: 'Estándares IETF, navegadores gráficos y dominio público web',
    entries: [
      {
        dayLabel: '1 de abril',
        year: '1976',
        category: 'Hardware y Fundamentos',
        title: 'Fundación de Apple Computer en California',
        summary:
          'Steve Jobs, Steve Wozniak y Ronald Wayne constituyeron la compañía para producir y comercializar la placa ensamblada Apple I diseñada por Wozniak.',
        technicalContext:
          'Integrar salida de vídeo compuesto y controlador de teclado en una sola placa redujo drásticamente el coste frente a minicomputadores ensamblados con interruptores frontales.',
        impact:
          'Contribuyó decisivamente a transformar la informática de laboratorio en ordenadores personales completos para hogares y escuelas.',
      },
      {
        dayLabel: '4 de abril',
        year: '1975',
        category: 'Lenguajes y Compiladores',
        title: 'Fundación de Microsoft y nacimiento de Altair BASIC',
        summary:
          'Bill Gates y Paul Allen fundaron Micro-Soft en Albuquerque tras escribir un intérprete de BASIC que cabía en los 4 KB de memoria del kit Altair 8800.',
        technicalContext:
          'Sin acceso físico inicial a un Altair real, escribieron un simulador del procesador Intel 8080 sobre un PDP-10 universitario para probar todo el intérprete en cinta perforada.',
        impact:
          'Inauguró la industria independiente de software empaquetado para microcomputadores.',
      },
      {
        dayLabel: '7 de abril',
        year: '1969',
        category: 'Protocolos y Web',
        title: 'Steve Crocker publica RFC 1 ("Host Software")',
        summary:
          'El primer documento de la serie Request for Comments propuso de forma abierta y no autoritaria los protocolos iniciales entre ordenadores anfitriones de ARPANET y los IMP.',
        technicalContext:
          'Crocker adoptó el tono humilde de "solicitud de comentarios" temiendo sonar prescriptivo frente a investigadores consolidados de otras universidades.',
        impact:
          'El sistema RFC continúa siendo hoy el vehículo normativo abierto que define TCP, HTTP, DNS, TLS y correo electrónico.',
      },
      {
        dayLabel: '22 de abril',
        year: '1993',
        category: 'Protocolos y Web',
        title: 'Lanzamiento público de NCSA Mosaic 1.0',
        summary:
          'El equipo dirigido por Marc Andreessen y Eric Bina en el NCSA publicó la versión estable para X Window de su navegador capaz de renderizar imágenes integradas junto al texto.',
        technicalContext:
          'Los primeros clientes solo mostraban enlaces de texto y abrían imágenes en ventanas externas; Mosaic unificó la experiencia visual e incorporó historial de navegación claro.',
        impact:
          'Desencadenó la adopción masiva de la World Wide Web fuera del ámbito académico en menos de dos años.',
      },
      {
        dayLabel: '30 de abril',
        year: '1993',
        category: 'Protocolos y Web',
        title: 'El CERN declara la tecnología World Wide Web en dominio público',
        summary:
          'La dirección del laboratorio europeo firmó la declaración oficial garantizando que cualquier persona o empresa pudiera ejecutar, modificar y distribuir el código Web sin regalías.',
        technicalContext:
          'Otros sistemas de información de red competidores como Gopher habían comenzado a anunciar modelos de licenciamiento comercial que fragmentaban la adopción universitaria.',
        impact:
          'Blindó la interoperabilidad gratuita de los estándares web básicos frente a patentes privativas.',
      },
    ],
  },
  {
    number: '05',
    slug: 'mayo',
    name: 'Mayo',
    subtitle: 'BASIC universitario, Ethernet en PARC, Java 1.0 y nacimiento de React',
    overview:
      'Mayo enlaza invenciones esenciales en programación educativa, redes locales de oficina, portabilidad entre máquinas virtuales e interfaces declarativas modernas basadas en componentes.',
    focusArea: 'Redes locales LAN, JVM portable e interfaces declarativas',
    entries: [
      {
        dayLabel: '1 de mayo',
        year: '1964',
        category: 'Lenguajes y Compiladores',
        title: 'Primera ejecución exitosa de BASIC en Dartmouth College',
        summary:
          'John G. Kemeny y Thomas E. Kurtz lograron compilar y ejecutar simultáneamente programas escritos por estudiantes en tiempo compartido utilizando un lenguaje con sintaxis legible.',
        technicalContext:
          'Hasta entonces escribir código requería lenguaje ensamblador o tarjetas Fortran procesadas por lotes con esperas de horas; BASIC introdujo compilación interactiva en terminales.',
        impact:
          'Formó a toda una generación inicial de programadores cuando variantes de BASIC llegaron posteriormente a cada microcomputador de los años ochenta.',
      },
      {
        dayLabel: '11 de mayo',
        year: '1997',
        category: 'Hardware y Fundamentos',
        title: 'Deep Blue gana el encuentro completo contra Garry Kasparov',
        summary:
          'En Nueva York, el sistema paralelo de IBM cerró el match de seis partidas con marcador de 3,5 a 2,5, evaluando hasta doscientos millones de posiciones por segundo.',
        technicalContext:
          'El enfoque demostró cómo funciones de evaluación cuidadosamente ajustadas junto con paralelismo masivo resolvían espacios de búsqueda combinatoria gigantescos.',
        impact:
          'Aceleró la investigación posterior en juegos complejos, planificación algorítmica y supercomputación especializada.',
      },
      {
        dayLabel: '22 de mayo',
        year: '1973',
        category: 'Protocolos y Web',
        title: 'Bob Metcalfe redacta el memorando original sobre Ethernet',
        summary:
          'En Xerox PARC, Metcalfe describió la arquitectura de red local compartida "Alto Aloha Network" inspirada en paquetes por radio para enlazar estaciones gráficas e impresoras láser.',
        technicalContext:
          'Propuso detección de portadora con acceso múltiple y detección de colisiones (CSMA/CD) mediante retroceso exponencial aleatorio sobre cable pasivo compartido.',
        impact:
          'Evolucionado posteriormente a par trenzado conmutado y fibra IEEE 802.3, Ethernet sigue transportando prácticamente todo tráfico LAN y centro de datos.',
      },
      {
        dayLabel: '23 de mayo',
        year: '1995',
        category: 'Lenguajes y Compiladores',
        title: 'Sun Microsystems presenta oficialmente Java en SunWorld',
        summary:
          'James Gosling y el equipo Green mostraron un lenguaje orientado a objetos compilado a bytecode independiente de arquitectura, ejecutado sobre la Java Virtual Machine (JVM).',
        technicalContext:
          'Nacido inicialmente para electrónica de consumo bajo el nombre Oak, el lenguaje eliminó punteros manuales propensos a errores e integró recolección automática de basura.',
        impact:
          'Java se convirtió en estándar de facto para sistemas empresariales, servicios web escalables y posteriormente el entorno de aplicaciones Android.',
      },
      {
        dayLabel: '29 de mayo',
        year: '2013',
        category: 'Protocolos y Web',
        title: 'React es liberado como código abierto en JSConf US',
        summary:
          'Jordan Walke y el equipo de ingeniería frontend presentaron una biblioteca enfocada en describir vistas como función pura del estado con reconciliación declarativa en memoria.',
        technicalContext:
          'Los frameworks MVC de enlace bidireccional de comienzos de década sufrían cascadas difíciles de depurar al sincronizar formularios y árboles DOM mutables complejos.',
        impact:
          'El modelo de componentes composables y flujo unidireccional de datos redefinió la arquitectura frontend moderna en web y móvil.',
      },
    ],
  },
  {
    number: '06',
    slug: 'junio',
    name: 'Junio',
    subtitle: 'Alan Turing, Apple II, HTTP/1.1 y la llegada de los smartphones web',
    overview:
      'Junio destaca por la conmemoración del nacimiento de Alan Turing y por hitos decisivos en computación gráfica doméstica, especificación HTTP persistente y acceso móvil ubicuo.',
    focusArea: 'Teoría de la computación, formatos gráficos y HTTP estándar',
    entries: [
      {
        dayLabel: '5 de junio',
        year: '1977',
        category: 'Hardware y Fundamentos',
        title: 'Salida comercial del ordenador personal Apple II',
        summary:
          'Equipado con carcasa moldeada, ranuras de expansión documentadas, gráficos en color y BASIC integrado en ROM, el Apple II llegó a escuelas, empresas y hogares.',
        technicalContext:
          'El diseño minimalista de Steve Wozniak ingeniosamente entrelazó ciclos de refresco de memoria DRAM con lectura de señal de vídeo NTSC reduciendo drásticamente chips.',
        impact:
          'Con la llegada de VisiCalc en 1979 convirtió los microcomputadores de juguete de aficionados en herramientas financieras productivas.',
      },
      {
        dayLabel: '12 de junio',
        year: '1999',
        category: 'Protocolos y Web',
        title: 'Publicación de RFC 2616 consolidando HTTP/1.1',
        summary:
          'El grupo de trabajo liderado por Roy Fielding y Tim Berners-Lee estabilizó las mejoras de HTTP/1.1 para reducir latencia TCP e introducir alojamiento virtual por cabecera Host.',
        technicalContext:
          'HTTP/1.0 abría una conexión TCP nueva por cada imagen o hoja de estilo. HTTP/1.1 permitió conexiones persistentes keep-alive, chunked encoding y caché explícita.',
        impact:
          'Hizo viable el alojamiento compartido masivo por nombre de dominio en una única IP y rigió el tráfico web durante más de quince años.',
      },
      {
        dayLabel: '15 de junio',
        year: '1987',
        category: 'Protocolos y Web',
        title: 'CompuServe introduce el formato de imagen GIF (87a)',
        summary:
          'Se especificó el formato Graphics Interchange Format con compresión sin pérdidas LZW y paletas de hasta 256 colores pensado para transferirse rápido por módems telefónicos.',
        technicalContext:
          'Años después la revisión 89a añadió transparencia por índice y secuencias animadas básicas que sobrevivirían mucho más allá de su época original.',
        impact:
          'Democratizó iconos e ilustraciones compactas en la web temprana y originó uno de los estándares visuales más perdurables de Internet.',
      },
      {
        dayLabel: '23 de junio',
        year: '1912',
        category: 'Hardware y Fundamentos',
        title: 'Nacimiento de Alan Turing en Maida Vale, Londres',
        summary:
          'El matemático definió en 1936 las máquinas abstractas de cinta que formalizaron el concepto mismo de algoritmo y demostró límites inherentes de decidibilidad formal.',
        technicalContext:
          'Su modelo de máquina universal capaz de simular cualquier otra máquina leyendo instrucciones almacenadas como datos anticipó la arquitectura moderna de programa guardado.',
        impact:
          'Es reconocido universalmente como padre teórico de la informática y da nombre al Premio Turing.',
      },
      {
        dayLabel: '29 de junio',
        year: '2007',
        category: 'Hardware y Fundamentos',
        title: 'Comercialización inicial del primer iPhone',
        summary:
          'Dispositivo portátil sin teclado físico mecánico que integró pantalla capacitiva multitáctil, sensor de proximidad, acelerómetro y un motor WebKit completo de escritorio.',
        technicalContext:
          'Previamente la navegación web en teléfonos dependía de versiones reducidas WAP. Ejecutar HTML/CSS estándar sobre ARM cambió la relación entre usuarios y aplicaciones web.',
        impact:
          'Impulsó el diseño responsive y convirtió el cómputo de bolsillo conectado en la principal puerta de entrada mundial a Internet.',
      },
    ],
  },
  {
    number: '07',
    slug: 'julio',
    name: 'Julio',
    subtitle: 'Primer libro digital, Fundación de Intel, Correo Web y Software del Apolo 11',
    overview:
      'Julio reúne hitos fundamentales de la microelectrónica y la software engineering crítica, desde la fundación de Intel hasta el software multitarea de tiempo real del módulo lunar Apolo.',
    focusArea: 'Semiconductores, tiempo real aeroespacial y web accesible',
    entries: [
      {
        dayLabel: '4 de julio',
        year: '1971',
        category: 'Protocolos y Web',
        title: 'Michael Hart crea el primer documento electrónico del Proyecto Gutenberg',
        summary:
          'Aprovechando tiempo libre asignado en un mainframe Xerox Sigma V de la Universidad de Illinois, Hart transcribió la Declaración de Independencia como archivo ASCII distribuible.',
        technicalContext:
          'Comprendió tempranamente que el verdadero potencial de las redes no estaba solo en cálculos numéricos sino en la replicación infinita sin coste marginal de libros.',
        impact:
          'Fundó la biblioteca digital pública más antigua del mundo y sentó precedentes para formatos de texto abierto sin restricciones DRM.',
      },
      {
        dayLabel: '4 de julio',
        year: '1996',
        category: 'Protocolos y Web',
        title: 'Lanzamiento de Hotmail, pionero del correo web universal',
        summary:
          'Sabeer Bhatia y Jack Smith abrieron un servicio gratuito de correo accesible íntegramente desde formularios HTTP en cualquier navegador sin configurar clientes locales POP3 ni firewalls.',
        technicalContext:
          'La independencia respecto a proveedores ISP específicos permitió conservar una dirección permanente aun cambiando de empresa, universidad o país.',
        impact:
          'Validó el modelo de aplicaciones interactivas ejecutadas dentro del navegador web años antes del término SaaS.',
      },
      {
        dayLabel: '10 de julio',
        year: '1962',
        category: 'Protocolos y Web',
        title: 'Lanzamiento de Telstar 1, primer satélite activo de comunicaciones',
        summary:
          'Desarrollado por Bell Telephone Laboratories y lanzado por la NASA, Telstar retransmitió señales amplificadas de televisión, teléfono y datos digitales entre Norteamérica y Europa.',
        technicalContext:
          'Empleó transistores alimentados por paneles solares de zafiro protector y transmisores de ondas viajeras en órbita elíptica media.',
        impact:
          'Demostró las comunicaciones satelitales de banda ancha en tiempo real que hoy enlazan continentes y redes globales.',
      },
      {
        dayLabel: '18 de julio',
        year: '1968',
        category: 'Hardware y Fundamentos',
        title: 'Robert Noyce y Gordon Moore fundan Intel Corporation',
        summary:
          'Los coinventores clave del circuito integrado fundaron en Santa Clara la compañía enfocada inicialmente en memorias semiconductoras frente a los núcleos magnéticos de ferrita.',
        technicalContext:
          'Tras diseñar memorias SRAM/DRAM en silicio, en 1971 su ingeniero Federico Faggin y Ted Hoff integrarían una CPU completa en un único chip: el Intel 4004.',
        impact:
          'La escala de integración predicha por la Ley de Moore permitió multiplicar el poder computacional disponible década tras década.',
      },
      {
        dayLabel: '20 de julio',
        year: '1969',
        category: 'Sistemas Operativos',
        title: 'El software en tiempo real del Apolo 11 ejecuta alunizaje seguro bajo carga crítica',
        summary:
          'Durante el descenso lunar de Eagle, la computadora AGC sufrió saturación de radar por interruptor desajustado y disparó alarmas de prioridad 1201/1202 recuperándose en milisegundos.',
        technicalContext:
          'Gracias al sistema operativo prioritario diseñado por J. Halcombe Laning y al equipo de ingeniería de software dirigido por Margaret Hamilton en el MIT, las tareas de vuelo tuvieron precedencia absoluta sobre lecturas secundarias.',
        impact:
          'Contribuyó a institucionalizar la disciplina formal de Ingeniería de Software enfocada en tolerancia a fallos, pruebas integradas y seguridad crítica.',
      },
    ],
  },
  {
    number: '08',
    slug: 'agosto',
    name: 'Agosto',
    subtitle: 'Publicación de la Web, IBM PC 5150, Fundación de Debian y Kernel Linux',
    overview:
      'Agosto de 1991 cambió el curso entero de la informática: en apenas diecinueve días vieron la luz pública tanto la primera invitación abierta a la World Wide Web como el anuncio inaugural del kernel Linux.',
    focusArea: 'Ecosistema PC abierto, Debian/GNU y núcleo Linux',
    entries: [
      {
        dayLabel: '6 de agosto',
        year: '1991',
        category: 'Protocolos y Web',
        title: 'Primer anuncio público de la World Wide Web en Usenet',
        summary:
          'Tim Berners-Lee publicó en alt.hypertext la invitación a descargar el código fuente del navegador en línea de comandos y el servidor HTTP desarrollado en el CERN.',
        technicalContext:
          'Al ofrecer herramientas simples compilables en múltiples estaciones Unix además de NeXTSTEP, permitió que centros externos montaran sus primeros servidores ese mismo año.',
        impact:
          'Desencadenó la transición de una red académica dispersa hacia un tejido universal de documentos enlazados.',
      },
      {
        dayLabel: '12 de agosto',
        year: '1981',
        category: 'Hardware y Fundamentos',
        title: 'IBM presenta el modelo Personal Computer 5150',
        summary:
          'Diseñado en apenas un año por un equipo compacto en Boca Ratón usando componentes estándar comerciales y especificaciones de ranura abiertas, marcó el estándar empresarial del PC.',
        technicalContext:
          'Publicar los esquemas de hardware e interrupciones BIOS facilitó una explosión de tarjetas de expansión, clones compatibles y software portátil MS-DOS.',
        impact:
          'Consolidó la arquitectura x86 en oficinas y hogares por más de cuatro décadas.',
      },
      {
        dayLabel: '16 de agosto',
        year: '1993',
        category: 'Sistemas Operativos',
        title: 'Ian Murdock publica el Manifiesto Debian',
        summary:
          'El estudiante de Purdue propuso construir una distribución Linux abierta mantenida por una comunidad organizada con sistema robusto de paquetería y contrato social explícito.',
        technicalContext:
          'Las primeras recopilaciones dependían de imágenes de disquete frágiles sin gestión confiable de dependencias ni actualizaciones limpias.',
        impact:
          'Debian y su gestor dpkg/APT sirvieron de raíz directa para Ubuntu y gran parte de la infraestructura de servidores en la nube.',
      },
      {
        dayLabel: '24 de agosto',
        year: '1995',
        category: 'Sistemas Operativos',
        title: 'Lanzamiento global de Windows 95',
        summary:
          'Introdujo el botón Inicio, barra de tareas, soporte nativo TCP/IP integrado, nombres largos en FAT (VFAT) y multitarea apropiativa para aplicaciones Win32 de 32 bits.',
        technicalContext:
          'Integrar pila TCP/IP y configuración automática Plug and Play redujo drásticamente las barreras técnicas para conectar computadores domésticos a proveedores de Internet.',
        impact:
          'Estandarizó convenciones de interfaz gráfica de escritorio presentes hasta hoy.',
      },
      {
        dayLabel: '25 de agosto',
        year: '1991',
        category: 'Sistemas Operativos',
        title: 'Linus Torvalds anuncia el proyecto embrionario del kernel Linux',
        summary:
          'En un mensaje ya clásico en comp.os.minix, Torvalds describió un núcleo libre en C para procesadores Intel 386 capaz de ejecutar bash y gcc sin fines comerciales inicialmente.',
        technicalContext:
          'Buscaba simplemente un emulador de terminal mejor para leer noticias desde casa aprovechando la unidad de paginación MMU por hardware del 386.',
        impact:
          'Integrado con herramientas GNU y miles de mantenedores globales, Linux pasó a dominar Internet, contenedores en la nube y sistemas embebidos.',
      },
    ],
  },
  {
    number: '09',
    slug: 'septiembre',
    name: 'Septiembre',
    subtitle: 'Proyecto GNU, Linux 0.01, "First Bug" de Harvard Mark II y Google',
    overview:
      'Septiembre recuerda tanto anécdotas reales de depuración electromecánica de 1947 como documentos fundacionales del software libre en 1983, la versión inicial 0.01 de Linux y los algoritmos de búsqueda por enlaces.',
    focusArea: 'Software libre GNU/Linux, recuperación de fallos y búsqueda web',
    entries: [
      {
        dayLabel: '4 de septiembre',
        year: '1998',
        category: 'Protocolos y Web',
        title: 'Constitución corporativa de Google Inc.',
        summary:
          'Larry Page y Sergey Brin formalizaron el proyecto académico nacido en Stanford tras demostrar que analizar la estructura de hipervínculos entrantes superaba los índices por palabras clave.',
        technicalContext:
          'Su modelo PageRank calculaba autovectores sobre el grafo dirigido de la web para estimar relevancia estructural resistente al spam simple de metaetiquetas.',
        impact:
          'Revolucionó la recuperación de información web e impulsó sistemas distribuidos masivos como MapReduce y Bigtable.',
      },
      {
        dayLabel: '9 de septiembre',
        year: '1947',
        category: 'Hardware y Fundamentos',
        title: 'Registro histórico de la polilla en el relé del Harvard Mark II',
        summary:
          'Ingenieros y operadoras encontraron una polilla atrapada dentro del relé n.º 70 del panel F, fijándola con cinta adhesiva en la bitácora bajo el apunte "First actual case of bug being found".',
        technicalContext:
          'Aunque los ingenieros mecánicos usaban el término "bug" desde tiempos de Edison para fallos técnicos, este registro físico inmortalizó la palabra dentro del vocabulario informático.',
        impact:
          'Dio forma visual a la cultura moderna del debugging, registros reproducibles de errores y trazabilidad de incidentes.',
      },
      {
        dayLabel: '15 de septiembre',
        year: '1997',
        category: 'Protocolos y Web',
        title: 'Registro del dominio google.com en el sistema DNS',
        summary:
          'El buscador experimental que previamente corría bajo subdominios universitarios en Stanford obtuvo su propio identificador raíz comercial mientras escalaba consultas.',
        technicalContext:
          'El volumen de indexación web había superado los límites de almacenamiento y ancho de banda aceptables para una red académica interna.',
        impact:
          'Consolidó la transición desde un prototipo de laboratorio hacia un servicio web global.',
      },
      {
        dayLabel: '17 de septiembre',
        year: '1991',
        category: 'Sistemas Operativos',
        title: 'Publicación de la versión 0.01 del kernel Linux',
        summary:
          'Con cerca de diez mil líneas de código C y ensamblador i386, Linux 0.01 apareció disponible en el servidor FTP de FUNET en Finlandia para desarrolladores experimentales.',
        technicalContext:
          'Requería inicialmente un sistema Minix previo en disco para compilarse, carecía de red TCP/IP y soportaba únicamente sistema de archivos Minix.',
        impact:
          'La decisión de distribuirlo bajo licencia libre GPL poco después detonó colaboraciones rápidas en todo el mundo.',
      },
      {
        dayLabel: '27 de septiembre',
        year: '1983',
        category: 'Sistemas Operativos',
        title: 'Richard Stallman anuncia el inicio del Proyecto GNU',
        summary:
          'Mediante un mensaje a grupos de noticias Unix, Stallman convocó a construir un sistema operativo completo compatible con Unix en el que todo usuario pudiera estudiar y compartir el código.',
        technicalContext:
          'Durante los años ochenta la privatización cerrada del software había comenzado a prohibir intercambiar utilidades entre laboratorios universitarios.',
        impact:
          'Aportó herramientas esenciales como GCC, GDB, Emacs y el marco jurídico de copyleft (Licencia Pública General GNU).',
      },
    ],
  },
  {
    number: '10',
    slug: 'octubre',
    name: 'Octubre',
    subtitle: 'Primer enlace de ARPANET, cifrado HTTPS temprano, HTML5 y TypeScript',
    overview:
      'Octubre concentra el nacimiento mismo de la conmutación de paquetes en 1969, el despliegue temprano del cifrado web SSL, la estandarización definitiva de HTML5 y el surgimiento de TypeScript.',
    focusArea: 'Conmutación de paquetes, criptografía TLS y tipado en frontend',
    entries: [
      {
        dayLabel: '1 de octubre',
        year: '2012',
        category: 'Lenguajes y Compiladores',
        title: 'Publicación inicial de TypeScript 0.8',
        summary:
          'El equipo encabezado por Anders Hejlsberg lanzó públicamente un superconjunto tipado estáticamente de JavaScript compilado a ECMAScript estándar legible sin dependencias en tiempo de ejecución.',
        technicalContext:
          'Al crecer las aplicaciones web a cientos de miles de líneas, el tipado dinámico puro dificultaba refactorizaciones seguras y autocompletado preciso en editores.',
        impact:
          'El sistema de tipos estructurales borrados al compilar se volvió pilar fundamental del desarrollo web profesional y frameworks modernos.',
      },
      {
        dayLabel: '13 de octubre',
        year: '1994',
        category: 'Protocolos y Web',
        title: 'Lanzamiento de Mosaic Netscape 0.9 e impulso al protocolo SSL',
        summary:
          'El primer navegador de Netscape introdujo carga progresiva de diseño antes de recibir todas las imágenes y estableció las bases de conexiones seguras cifradas en la web.',
        technicalContext:
          'Sin confidencialidad cifrada entre cliente y servidor resultarían imposibles transacciones bancarias, autenticación segura o privacidad básica en redes públicas.',
        impact:
          'De aquellas especificaciones SSL tempranas evolucionó el estándar criptográfico moderno TLS (HTTPS).',
      },
      {
        dayLabel: '23 de octubre',
        year: '2001',
        category: 'Hardware y Fundamentos',
        title: 'Presentación del primer iPod con disco de bolsillo y sincronización rápida',
        summary:
          'Integrando un microdisco duro Toshiba de 1,8 pulgadas con búfer de memoria de bajo consumo y transferencia FireWire IEEE 1394, almacenaba mil pistas comprimidas en bolsillo.',
        technicalContext:
          'La interfaz mecánica de rueda táctil resolvía el desplazamiento rápido lineal entre miles de archivos usando una mano sin punteros.',
        impact:
          'Demostró cómo la integración estrecha de firmware, hardware compacto y software de sincronización definía experiencias digitales de consumo.',
      },
      {
        dayLabel: '28 de octubre',
        year: '2014',
        category: 'Protocolos y Web',
        title: 'El W3C aprueba HTML5 como Recomendación oficial estándar',
        summary:
          'Tras años de colaboración conjunta entre WHATWG y W3C, HTML5 incorporó etiquetas semánticas, reproducción nativa `<audio>` y `<video>`, `<canvas>` y almacenamiento local sin plugins.',
        technicalContext:
          'Durante los años dos mil el vídeo y gráficos interactivos en la web dependían de extensiones propietarias vulnerables como Flash o Java Applets.',
        impact:
          'Consolidó la web abierta como plataforma multimedia universal compatible en escritorio y dispositivos móviles.',
      },
      {
        dayLabel: '29 de octubre',
        year: '1969',
        category: 'Protocolos y Web',
        title: 'Primera transmisión efectiva de ARPANET ("LO")',
        summary:
          'Charley Kline en UCLA envió por conmutación de paquetes la palabra "LOGIN" hacia un SDS 940 en Stanford Research Institute; el sistema remoto falló tras recibir "L" y "O", completándose tras reiniciar.',
        technicalContext:
          'Los nodos conectados mediante Interface Message Processors (IMP) probaron que la fragmentación en datagramas podía reemplazar enlaces telefónicos dedicados permanentes.',
        impact:
          'Representa el primer intercambio histórico práctico entre ordenadores geográficamente separados de lo que derivaría en Internet.',
      },
    ],
  },
  {
    number: '11',
    slug: 'noviembre',
    name: 'Noviembre',
    subtitle: 'Manual original de Unix, patente del ratón, Firefox 1.0 y nacimiento de Go',
    overview:
      'Noviembre abarca desde documentos esenciales en Bell Labs y la patente formal del ratón informático hasta la primera demostración académica de seguridad sobre virus y el nacimiento de lenguajes concurrentes.',
    focusArea: 'Filosofía Unix, interfaces de puntero y concurrencia nativa',
    entries: [
      {
        dayLabel: '3 de noviembre',
        year: '1971',
        category: 'Sistemas Operativos',
        title: 'Publicación de la primera edición del Unix Programmer’s Manual',
        summary:
          'Ken Thompson y Dennis Ritchie recopilaron las páginas de referencia del primer sistema Unix funcionando en PDP-11, documentando tuberías conceptuales iniciales, llamadas al sistema y comandos breves.',
        technicalContext:
          'Cada página (`man`) explicaba con concisión exacta parámetros, códigos de retorno y errores conocidos de cada utilidad diseñada para hacer una sola cosa bien.',
        impact:
          'Forjó la filosofía modular de composición de herramientas pequeñas y la cultura de documentación técnica directa en terminal.',
      },
      {
        dayLabel: '9 de noviembre',
        year: '2004',
        category: 'Protocolos y Web',
        title: 'Lanzamiento de Mozilla Firefox 1.0',
        summary:
          'El navegador ligero basado en Gecko ofreció navegación por pestañas, bloqueo nativo de ventanas emergentes, buscador integrado y arquitectura de extensiones en abierta competencia.',
        technicalContext:
          'A comienzos de los años dos mil un único navegador cerrado dominaba más del 90% del mercado estancando la adopción de CSS y estándares web abiertos.',
        impact:
          'Reactivó la competencia saludable entre motores de renderizado y aceleró la innovación de la web moderna.',
      },
      {
        dayLabel: '10 de noviembre',
        year: '1983',
        category: 'Sistemas Operativos',
        title: 'Fred Cohen demuestra formalmente el primer virus informático académico',
        summary:
          'En un seminario de seguridad informática en la Universidad de Lehigh, Cohen ejecutó una prueba controlada en Unix mostrando cómo código autoreplicable obtenía privilegios en minutos.',
        technicalContext:
          'Su tesis posterior demostró matemáticamente que detectar cualquier virus arbitrario de forma general es indecidible por reducción al problema de la parada de Turing.',
        impact:
          'Inauguró el estudio científico formal de seguridad de sistemas operativos, control de privilegios y defensa en profundidad.',
      },
      {
        dayLabel: '10 de noviembre',
        year: '2009',
        category: 'Lenguajes y Compiladores',
        title: 'Presentación abierta del lenguaje de programación Go',
        summary:
          'Robert Griesemer, Rob Pike y Ken Thompson anunciaron públicamente en Google un lenguaje compilado con recolector de basura rápido, formato uniforme `gofmt` y goroutines concurrentes.',
        technicalContext:
          'Servicios de red multinúcleo en C++ requerían tiempos largos de compilación mientras lenguajes dinámicos penalizaban latencia y consumo de memoria.',
        impact:
          'Go se convirtió en base predominante de herramientas de infraestructura en la nube como Docker, Kubernetes y microservicios distribuidos.',
      },
      {
        dayLabel: '17 de noviembre',
        year: '1970',
        category: 'Hardware y Fundamentos',
        title: 'Patente estadounidense otorgada a Douglas Engelbart por el ratón informático',
        summary:
          'La patente 3,541,541 describió el "indicador de posición X-Y para sistema de visualización", prototipado años antes por Bill English con dos ruedas perpendiculares en carcasa de madera.',
        technicalContext:
          'El equipo del Augmentation Research Center probó alternativas con rodilla, lápices ópticos y joysticks antes de demostrar que el desplazamiento relativo sobre mesa fatigaba menos al operador.',
        impact:
          'Junto a la navegación hipertextual transformó por completo la ergonomía de interacción en computación.',
      },
    ],
  },
  {
    number: '12',
    slug: 'diciembre',
    name: 'Diciembre',
    subtitle: 'Ada Lovelace, Mother of All Demos, primera web en CERN, Ruby y JavaScript',
    overview:
      'Diciembre condensa el nacimiento de Ada Lovelace, la demostración de 1968 que anticipó cincuenta años de computación personal, el primer sitio web operativo en el CERN y el debut de Ruby y JavaScript en 1995.',
    focusArea: 'Algoritmos históricos, interacción gráfica y lenguajes web',
    entries: [
      {
        dayLabel: '4 de diciembre',
        year: '1995',
        category: 'Lenguajes y Compiladores',
        title: 'Presentación pública de JavaScript junto a Netscape Navigator 2.0',
        summary:
          'Creado originalmente en diez días de prototipado intenso por Brendan Eich bajo el nombre Mocha/LiveScript, fue anunciado conjuntamente con Sun Microsystems como JavaScript para scripting web.',
        technicalContext:
          'Combinó funciones de primera clase inspiradas en Scheme y herencia por prototipos de Self envueltas en una sintaxis accesible con llaves tipo C.',
        impact:
          'Se transformó en el único lenguaje universal ejecutado nativamente por todo navegador web y posteriormente en servidores vía Node.js.',
      },
      {
        dayLabel: '9 de diciembre',
        year: '1968',
        category: 'Hardware y Fundamentos',
        title: 'Douglas Engelbart realiza "The Mother of All Demos"',
        summary:
          'Ante mil asistentes en la Fall Joint Computer Conference de San Francisco, el sistema NLS demostró en pantalla gigante edición colaborativa remota, hipertexto, ventanas gráficas y ratón.',
        technicalContext:
          'Mientras la industria trabajaba aún en tarjetas perforadas o teleimpresoras de papel, su equipo utilizó enlaces de microondas en vivo entre Menlo Park y el auditorio.',
        impact:
          'El video completo de aquellos noventa minutos delineó la hoja de ruta exacta de estaciones personales, GUIs modernas y herramientas colaborativas.',
      },
      {
        dayLabel: '10 de diciembre',
        year: '1815',
        category: 'Hardware y Fundamentos',
        title: 'Nacimiento de Ada Lovelace en Londres',
        summary:
          'La matemática Augusta Ada King estudió la Máquina Analítica mecánica proyectada por Charles Babbage y redactó en 1843 sus célebres Notas describiendo paso a paso un algoritmo para números de Bernoulli.',
        technicalContext:
          'Comprendió más allá del cálculo aritmético que cualquier entidad manipulable simbólicamente mediante reglas —música, texto o álgebra— podía procesarse en una máquina universal.',
        impact:
          'Es reconocida históricamente como la primera programadora conceptual antes de la existencia física de ordenadores electrónicos.',
      },
      {
        dayLabel: '20 de diciembre',
        year: '1990',
        category: 'Protocolos y Web',
        title: 'Primera puesta en marcha de la página y servidor web en el CERN',
        summary:
          'Sobre su estación de trabajo NeXTcube etiquetada con un adhesivo que advertía "This machine is a server. DO NOT POWER IT DOWN!!", Tim Berners-Lee sirvió la primera página web en info.cern.ch.',
        technicalContext:
          'El documento original explicaba de forma práctica qué era el proyecto hipertextual World Wide Web, cómo buscar documentos y cómo escribir un propio servidor.',
        impact:
          'Señaló el instante operativo inicial en que servidor HTTP, protocolo y documento HTML funcionaron de extremo a extremo.',
      },
      {
        dayLabel: '21 de diciembre',
        year: '1995',
        category: 'Lenguajes y Compiladores',
        title: 'Publicación pública de Ruby 0.95 por Yukihiro Matsumoto',
        summary:
          '"Matz" lanzó en listas de discusión japonesas la primera versión pública de Ruby, diseñada para equilibrar programación funcional y orientación a objetos pura priorizando claridad humana.',
        technicalContext:
          'Mientras Perl priorizaba texto rápido y Python legibilidad estructurada, Ruby trató incluso enteros y clases como objetos con bloques de clausura integrados.',
        impact:
          'Una década después, unido a Ruby on Rails, impulsó convenciones de productividad y arquitectura MVC que influyeron en decenas de frameworks web.',
      },
    ],
  },
];

export function getComputingMonth(slug: string): ComputingMonthArchive | undefined {
  return COMPUTING_MONTHS.find((month) => month.slug === slug.toLowerCase());
}

