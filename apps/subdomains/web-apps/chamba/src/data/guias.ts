export interface GuiaLaboral {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: 'Convocatorias CAS' | 'Regímenes Laborales' | 'Hojas de Vida' | 'Entrevistas de Trabajo' | 'Derechos Laborales' | 'Contratación Pública';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  keywords: string[];
  summary: string;
  content: string; // Markdown or HTML formatted text
  faqs: { question: string; answer: string }[];
  relatedTools: { label: string; href: string; description: string }[];
}

export const GUIAS_LABORALES: GuiaLaboral[] = [
  {
    slug: 'guia-postulacion-cas-2026',
    title: 'Guía Completa para Postular y Ganar una Convocatoria CAS en Perú (2026)',
    metaTitle: 'Cómo Postular y Ganar Convocatorias CAS 2026: Requisitos y Etapas | Chamba Pro',
    description: 'Aprende paso a paso cómo postular con éxito a una convocatoria CAS en el Estado peruano. Requisitos obligatorios, etapas del cronograma, causas de descalificación y consejos prácticos.',
    category: 'Convocatorias CAS',
    author: {
      name: 'Equipo Editorial Chamba Pro',
      role: 'Especialistas en Empleo Público y SERVIR',
      avatar: '/icon.svg',
    },
    publishedAt: '2026-01-15',
    updatedAt: '2026-09-20',
    readTime: '9 min de lectura',
    keywords: [
      'postular convocatoria cas 2026',
      'como entrar a trabajar al estado peru',
      'etapas convocatoria cas',
      'bases de convocatoria cas',
      'cronograma cas servir',
      'anexos obligatorios cas'
    ],
    summary: 'El Régimen Especial de Contratación Administrativa de Servicios (CAS - D.L. 1057) es la vía principal de ingreso al sector público en Perú. Descubre el proceso riguroso para superar la evaluación curricular, técnica y entrevista personal sin ser descalificado.',
    content: `
## 1. ¿Qué es el Contrato Administrativo de Servicios (CAS)?
El Contrato Administrativo de Servicios, reglado bajo el **Decreto Legislativo N° 1057** y modificado por la **Ley N° 31131**, es la modalidad contractual laboral predominante en ministerios, municipalidades, gobiernos regionales y organismos autónomos de Perú (como SUNAT, Poder Judicial, MINEDU y ESSALUD).

A diferencia de los contratos de locación de servicios (terceros), el personal CAS es considerado trabajador formal del Estado con derecho a seguridad social (EsSalud), vacaciones remuneradas de 30 días, aguinaldos por Fiestas Patrias y Navidad, y descanso pre y posnatal.

---

## 2. Requisitos Fundamentales antes de Postular
Antes de enviar tu expediente a cualquier entidad pública, debes asegurar el cumplimiento irrestricto de estos 5 pilares:

1. **RUC Activo y Habido en SUNAT:** Aunque estés postulando a planilla del Estado, la mayoría de entidades requiere tu número de RUC en estado activo y habido para la emisión del contrato y cruce fiscal.
2. **Registro Nacional de Proveedores (RNP):** *Solo exigible si la contratación es por Locación de Servicios.* En contratos CAS directos NO es obligatorio, salvo que las bases específicas indiquen lo contrario para puestos especializados.
3. **Declaraciones Juradas Obligatorias:** No registrar antecedentes penales, policiales ni judiciales, no estar inhabilitado en el Registro Nacional de Sanciones contra Servidores Civiles (RNSSC) y no estar en el Registro de Deudores Alimentarios Morosos (REDAM).
4. **Colegiatura y Habilitación Profesional Vigente:** Obligatoria para abogados, contadores, médicos, enfermeros, ingenieros y economistas. Debe estar vigente al momento de la postulación, no al inicio del trabajo.
5. **Acreditación de Capacitaciones:** Los cursos, diplomados y talleres deben contar con un mínimo de horas acumuladas (generalmente entre 20 y 120 horas académicas lectivas) y haberse emitido con posterioridad al grado o título si así lo exigen las bases.

---

## 3. Las Etapas de un Concurso Público CAS
Un proceso de selección bajo régimen CAS sigue un cronograma rígido normado por la Autoridad Nacional del Servicio Civil (SERVIR):

### Etapa 1: Publicación en el Portal de Talento Perú (SERVIR)
La entidad está obligada por ley a publicar las bases con un mínimo de 10 días hábiles de anticipación en el portal de SERVIR y en su propia web institucional. Durante este plazo debes descargar las **Bases Integrales**, el **Perfil del Puesto** y los **Anexos Oficiales**.

### Etapa 2: Registro de Postulación y Envío de Expediente
Puede ser virtual (a través de plataformas como el Sistema de Convocatorias de la entidad) o presencial por mesa de partes. **Importante:** La postulación se realiza en una fecha y rango de hora estrictos (por ejemplo: "Únicamente el 28 de septiembre de 08:30 a 16:30 horas"). Las postulaciones fuera de hora quedan eliminadas sin revisión.

### Etapa 3: Evaluación Curricular (Filtro Eliminatorio)
El comité calificador revisa la hoja de vida contrastándola contra los requisitos mínimos de las bases:
* Formación académica (grado de bachiller, título, maestría según corresponda).
* Experiencia laboral general (contabilizada desde la fecha de egreso universitario o técnico).
* Experiencia laboral específica (demostrada en funciones idénticas o afines en el sector público o privado).
* Cursos o capacitaciones afines.

### Etapa 4: Evaluación Técnica / Conocimientos (Opcional según la Entidad)
Consiste en una prueba escrita presencial o virtual sobre normatividad de la entidad, Ley N° 27444 (Procedimiento Administrativo General), contrataciones del Estado y conocimientos específicos del área.

### Etapa 5: Entrevista Personal
Es la etapa definitoria. Suele representar entre el 30% y el 50% del puntaje final ponderado. Aquí el jurado evalúa competencias blandas, solvencia técnica, ética pública y conocimiento de los objetivos institucionales.

### Etapa 6: Publicación del Cuadro de Méritos y Adjudicación
Se publica el resultado con la lista de postulantes "Ganador", "Accesitario" o "No Apto". El ganador dispone de hasta 5 días hábiles para suscribir el contrato e incorporarse formalmente.

---

## 4. Los 6 Errores que Causan Descalificación Inmediata
Cerca del 70% de postulantes quedan en condición de **NO APTO** por errores formales y subsanables:

1. **No foliar el expediente correctamente:** Muchas entidades exigen que cada página del expediente esté numerada de atrás hacia adelante (de la última hoja a la primera) en la esquina superior derecha con tinta azul.
2. **Presentar certificados sin fecha de inicio y fin exacta:** Los certificados de trabajo que solo indican "laboró durante el año 2024" son rechazados; deben detallar día, mes y año para el cómputo exacto de meses.
3. **Firmar anexos con firma digital no válida o imagen pegada:** Si la entidad exige firma manuscrita, debes imprimir el anexo, firmarlo a mano con lapicero azul, escanearlo y adjuntarlo. Pegar una imagen recortada de tu firma invalida el documento.
4. **No acreditar la fecha de egreso:** Si postulas a un puesto que exige "2 años de experiencia desde la condición de egresado", debes adjuntar la Constancia Oficial de Egresado emitida por tu universidad o instituto. De lo contrario, la experiencia se contabiliza recién a partir de la fecha de expedición del grado de bachiller.
5. **Omitir anexos obligatorios:** Enviar el CV sin la Declaración Jurada de Nepotismo o de No Inhabilitación conduce a descalificación automática sin derecho a subsanación.
6. **Enviar archivos pesados o enlaces rotos:** Asegúrate de que tus PDFs estén optimizados, legibles y sin contraseñas de protección.

---

## 5. Estrategias Clave para Destacar
* **Adapta tu CV al Perfil del Puesto:** Utiliza las mismas palabras clave y verbos de acción que aparecen en las funciones del término de referencia (TDR).
* **Prepara la Entrevista con el Método STAR:** Describe Situaciones, Tareas, Acciones y Resultados concretos de tu experiencia laboral previa.
* **Monitorea los Comunicados:** Las entidades publican fe de erratas, reprogramaciones de fecha y listas de aptos en sus portales; revisa la web diariamente durante todo el concurso.
`,
    faqs: [
      {
        question: '¿Puedo postular a varias convocatorias CAS al mismo tiempo?',
        answer: 'Sí. Puedes postular a múltiples concursos en distintas entidades o en la misma institución, siempre que los cronogramas de evaluación y entrevista no se crucen y no hayas firmado contrato previo.'
      },
      {
        question: '¿Qué significa quedar como Accesitario en un concurso público?',
        answer: 'Significa que aprobaste todas las etapas con puntaje aprobatorio, ubicándote inmediatamente detrás del ganador. Si el ganador renuncia, no se presenta a firmar contrato o no supera la verificación posterior, el puesto se te adjudica directamente a ti.'
      },
      {
        question: '¿El contrato CAS otorga estabilidad laboral indefinida?',
        answer: 'Conforme a la Ley N° 31131 y resoluciones del Tribunal Constitucional, los contratos CAS que desarrollan labores de carácter permanente tienen naturaleza indeterminada, salvo aquellos contratados para reemplazo temporal o proyectos específicos de inversión.'
      }
    ],
    relatedTools: [
      { label: 'Generador de CV Formato SERVIR', href: '/crear-cv-cas', description: 'Crea tu hoja de vida estandarizada con formato oficial del Estado.' },
      { label: 'Calculadora de Sueldo Neto CAS', href: '/calculadora-sueldo', description: 'Calcula cuánto recibirás en mano descontando AFP u ONP e impuesto a la renta.' },
      { label: 'Buscador de Convocatorias Vigentes', href: '/empleos', description: 'Filtra oportunidades laborales del Estado por región y entidad.' }
    ]
  },
  {
    slug: 'regimen-cas-vs-728-vs-276',
    title: 'Comparativa de Regímenes Laborales en Perú: CAS (1057), D.L. 728 y D.L. 276',
    metaTitle: 'Diferencias entre Régimen CAS 1057, 728 y 276: Beneficios y Sueldos | Chamba Pro',
    description: 'Conoce las diferencias legales, salariales, de estabilidad y beneficios sociales entre los regímenes laborales del sector público peruano: CAS (1057), D.L. 728, D.L. 276 y Ley del Servicio Civil 30057.',
    category: 'Regímenes Laborales',
    author: {
      name: 'Equipo Editorial Chamba Pro',
      role: 'Especialistas en Derecho Laboral Público',
      avatar: '/icon.svg',
    },
    publishedAt: '2026-02-01',
    updatedAt: '2026-09-22',
    readTime: '8 min de lectura',
    keywords: [
      'diferencias cas y 728',
      'regimen laboral 276 peru',
      'beneficios sociales cas vs 728',
      'gratificaciones cas peru',
      'estabilidad laboral estado peruano'
    ],
    summary: 'El Estado peruano opera con una multiplicidad de regímenes laborales. Analizamos en detalle qué beneficios otorga cada régimen, cómo impacta en tu CTS, gratificaciones, estabilidad y sueldo neto mensual.',
    content: `
## 1. El Mosaico Laboral del Estado Peruano
En la administración pública peruana conviven diferentes regímenes de contratación. Los tres más comunes son:
* **Decreto Legislativo N° 1057:** Régimen Especial de Contratación Administrativa de Servicios (CAS).
* **Decreto Legislativo N° 728:** Ley de Fomento del Empleo (Régimen de la actividad privada en el Estado).
* **Decreto Legislativo N° 276:** Ley de Bases de la Carrera Administrativa y de Remuneraciones del Sector Público.

Adicionalmente, se encuentra en implementación progresiva la **Ley N° 30057 (Ley del Servicio Civil)** impulsada por SERVIR.

---

## 2. Cuadro Comparativo de Beneficios Sociales

| Beneficio / Derecho | Régimen CAS (D.L. 1057) | Régimen Privado (D.L. 728) | Carrera Pública (D.L. 276) |
| :--- | :--- | :--- | :--- |
| **Vacaciones** | 30 días calendario anuales | 30 días calendario anuales | 30 días calendario anuales |
| **Gratificaciones (Julio / Diciembre)** | Aguinaldo fijado por Ley de Presupuesto (aprox. S/ 300 a S/ 500) | 1 Sueldo completo en Julio + 1 Sueldo completo en Diciembre | Aguinaldo fijado por Ley de Presupuesto (aprox. S/ 300 a S/ 500) |
| **Compensación por Tiempo de Servicios (CTS)** | No aplica cálculo tradicional (no tienen CTS bancaria) | 1 sueldo anual depositado semestralmente en mayo y noviembre | Se liquida al cese conforme a normas específicas |
| **Seguridad Social en Salud** | EsSalud (9% aportado por la entidad) | EsSalud (9% aportado por la entidad) | EsSalud (9% aportado por la entidad) |
| **Jornada Máxima** | 8 horas diarias / 48 semanales | 8 horas diarias / 48 semanales | 8 horas diarias / 40 a 48 semanales |
| **Asignación Familiar** | No aplica | Sí (10% de la Remuneración Mínima Vital) | A través de bonificaciones específicas de carrera |
| **Estabilidad Laboral** | Indeterminada para puestos permanentes (Ley 31131) | Indeterminada tras superar periodo de prueba (3 meses) | Estabilidad en la plaza tras concurso de carrera |

---

## 3. Análisis a Fondo por Régimen

### Régimen D.L. 728: El más codiciado
Es el régimen laboral más beneficioso económicamente. Se aplica en empresas públicas del Estado (FAL, Petroperú, Banco de la Nación, Sedapal) y en organismos reguladores y fiscalizadores (OSINERGMIN, OSIPTEL, SUNAT, INDECOPI, Poder Judicial y Ministerio Público para plazas específicas).
* **Ventaja económica:** Dos sueldos íntegros de gratificación al año y depósito semestral de CTS con libre disponibilidad según la ley vigente.
* **Indemnización:** En caso de despido arbitrario, corresponde el pago de 1.5 remuneraciones por año laborado (tope 12 sueldos).

### Régimen CAS (D.L. 1057): La realidad mayoritaria
Concentra a más del 60% de los servidores públicos en ministerios y gobiernos subnacionales.
* **Sueldo integral:** Generalmente las remuneraciones pactadas en CAS son competitivas en mano (entre S/ 2,500 y S/ 12,000 según responsabilidad), pero al no contar con gratificaciones de sueldo completo ni CTS semestral, el ingreso anualizado es inferior al del régimen 728 con igual sueldo base.
* **Protección legal:** Cuentan con derecho a sindicación, huelga y licencia por maternidad/paternidad idéntica a cualquier trabajador formal.

### Régimen D.L. 276: La carrera administrativa clásica
Es el régimen histórico de los servidores nombrados del Estado. Sus sueldos básicos son típicamente más bajos en la escala presupuestal, pero se complementan con diversos bonos (CAFAE, incentivos laborales, bonificaciones por quinquenios) y gozan de alta estabilidad institucional.

---

## 4. ¿Qué Régimen te Conviene Elegir?
* Si buscas **máximos ingresos anualizados y liquidación por CTS**: Prioriza convocatorias bajo el **D.L. 728**.
* Si buscas **acceder rápidamente al Estado con salarios mensuales atractivos**: Las convocatorias **CAS** ofrecen el mayor volumen de vacantes abiertas y procesos continuos todo el año.
`,
    faqs: [
      {
        question: '¿Los trabajadores CAS reciben gratificación completa de Fiestas Patrias?',
        answer: 'No. Los servidores CAS perciben un "Aguinaldo" cuyo monto es fijado anualmente en la Ley de Presupuesto del Sector Público (generalmente entre S/ 300 y S/ 500), independientemente de que su sueldo mensual sea mayor.'
      },
      {
        question: '¿Se puede pasar de contrato CAS a régimen 728 automáticamente?',
        answer: 'No existe pase automático por antigüedad. Para ingresar a una plaza 728 es requisito constitucional obligatorio ganar un concurso público de méritos abierto convocado específicamente bajo dicha modalidad.'
      }
    ],
    relatedTools: [
      { label: 'Comparador Interactivo de Regímenes', href: '/comparador-regimenes', description: 'Compara beneficios, descuentos y derechos lado a lado.' },
      { label: 'Calculadora de Sueldo Líquido', href: '/calculadora-sueldo', description: 'Calcula tu retención mensual de AFP/ONP e Impuesto a la Renta de 5ta categoría.' }
    ]
  },
  {
    slug: 'como-armar-cv-formato-servir',
    title: 'Cómo Elaborar una Hoja de Vida bajo Estándares de SERVIR para el Estado',
    metaTitle: 'Modelo de CV Formato SERVIR 2026: Estructura y Consejos | Chamba Pro',
    description: 'Aprende a redactar y estructurar tu Curriculum Vitae en formato SERVIR para convocatorias públicas en Perú. Orden cronológico, cálculo de experiencia y foliación correcta.',
    category: 'Hojas de Vida',
    author: {
      name: 'Equipo Editorial Chamba Pro',
      role: 'Especialistas en Talento Humano y SERVIR',
      avatar: '/icon.svg',
    },
    publishedAt: '2026-02-15',
    updatedAt: '2026-09-24',
    readTime: '7 min de lectura',
    keywords: [
      'cv formato servir 2026',
      'modelo hoja de vida estado peruano',
      'como llenar curriculum servir',
      'foliacion de expediente servir',
      'experiencia laboral especifica servir'
    ],
    summary: 'La Autoridad Nacional del Servicio Civil (SERVIR) establece directrices estrictas para la presentación de Hojas de Vida. Descubre cómo ordenar tus documentos para obtener el puntaje máximo en la evaluación curricular.',
    content: `
## 1. La Importancia del Formato Estándar SERVIR
El área de Recursos Humanos de una entidad pública no evalúa diseños vistosos ni plantillas gráficas complejas de Canva. En los concursos públicos se busca **precisión documental, trazabilidad cronológica y verificación probatoria inmediata**.

El formato oficial estandarizado por SERVIR permite a los miembros del comité calificar tu expediente de forma ágil y objetiva, evitando interpretaciones erróneas que deriven en tu descalificación.

---

## 2. Estructura Obligatoria de la Hoja de Vida

### Sección 1: Datos Personales
* Nombres y apellidos completos (tal como figuran en tu DNI).
* Número de DNI / Carné de Extranjería.
* Número de RUC (estado Activo y Habido).
* Dirección domiciliaria actual con departamento, provincia y distrito.
* Correo electrónico activo y número de teléfono celular con WhatsApp.
* Colegiatura y número de registro profesional (si aplica a tu carrera).

### Sección 2: Formación Académica
Ordenada desde el grado más reciente hacia el más antiguo:
1. Grados de Posgrado (Doctorado, Maestría - Grado o constancia de egreso).
2. Título Profesional Universitario o Técnico.
3. Grado Académico de Bachiller.
*Nota crucial:* Debes consignar la fecha exacta de expedición del diploma y la universidad de procedencia registrada en SUNEDU.

### Sección 3: Cursos y Programas de Especialización
Solo incluye aquellos directamente vinculados con el puesto convocado:
* **Diplomados o Programas de Especialización:** Mínimo de 80 a 100 horas académicas.
* **Cursos de Capacitación:** Mínimo de 12 a 24 horas académicas.
* Todos los certificados deben indicar claramente la cantidad de horas académicas lectivas y la fecha de realización.

### Sección 4: Experiencia Laboral (General y Específica)
Esta es la sección que define tu puntaje:
* **Experiencia General:** Todo el tiempo acumulado de trabajo formal acreditado con certificados, contratos o boletas de pago, contabilizado desde la condición de egresado.
* **Experiencia Específica:** Tiempo acumulado desempeñando labores directamente relacionadas al puesto convocado (ejemplo: si postulas a "Analista de Tesorería", solo cuenta el tiempo trabajado en áreas de tesorería, finanzas o contabilidad pública).
* Para cada experiencia debes detallar: Nombre de la entidad/empresa, cargo desempeñado, fecha exacta de inicio y fin (día/mes/año), principales funciones desarrolladas y motivo de cese.

---

## 3. Reglas de Oro para la Foliación del Expediente
La foliación incorrecta es la causa N° 1 de rechazo en mesa de partes:
* **Sentido de la foliación:** Se numera correlativamente de atrás hacia adelante (la última página del expediente lleva el N° 01, y la primera página o solicitud lleva el número más alto).
* **Ubicación:** En la esquina superior derecha de cada carilla.
* **Medio:** Con lapicero azul o mediante sello foliador legible. No uses lápiz ni plumones que traspasen la hoja.
* **No foliar hojas en blanco:** Si tu documento tiene una hoja en blanco de respaldo, tájala con una línea diagonal o no la incluyas.

---

## 4. Documentos de Sustento Válidos
Para que una experiencia laboral sea computada por el comité, debe estar respaldada por:
* Certificado o Constancia de Trabajo en hoja membretada, con firma y sello del área de Recursos Humanos.
* Resoluciones de designación y de cese (en el caso de cargos de confianza o directivos).
* Contratos y adendas acompañados de las correspondientes conformidades de servicio o boletas de pago.
`,
    faqs: [
      {
        question: '¿Las prácticas preprofesionales cuentan como experiencia laboral?',
        answer: 'Conforme a la Ley N° 31396, las prácticas preprofesionales realizadas durante el último año de estudios se reconocen como experiencia laboral general para el acceso al sector público, debidamente acreditadas con convenio o constancia.'
      },
      {
        question: '¿Qué hago si una empresa donde trabajé ya cerró y no tengo certificado?',
        answer: 'Puedes sustentar tu tiempo de servicio mediante contratos de trabajo firmados junto con boletas de pago selladas o tu constancia de aportes al sistema de pensiones (reporte de AFP o certificado de la ONP).'
      }
    ],
    relatedTools: [
      { label: 'Generador de CV Formato SERVIR Online', href: '/crear-cv-cas', description: 'Genera tu CV listo para descargar e imprimir en formato SERVIR oficial.' },
      { label: 'Plantillas y Anexos Oficiales', href: '/plantillas-anexos', description: 'Descarga modelos de declaraciones juradas de no antecedentes y nepotismo.' }
    ]
  },
  {
    slug: 'preguntas-psicologicas-entrevistas-estado',
    title: 'Las 15 Preguntas Clave en Entrevistas Laborales del Sector Público y el Método STAR',
    metaTitle: 'Preguntas y Respuestas para Entrevistas CAS 2026: Método STAR | Chamba Pro',
    description: 'Domina la entrevista personal en concursos públicos CAS y 728. Guía de respuestas con el Método STAR, preguntas de ética pública, integridad y manejo de conflictos.',
    category: 'Entrevistas de Trabajo',
    author: {
      name: 'Equipo Editorial Chamba Pro',
      role: 'Psicólogos Organizacionales y Evaluadores Públicos',
      avatar: '/icon.svg',
    },
    publishedAt: '2026-03-01',
    updatedAt: '2026-09-25',
    readTime: '10 min de lectura',
    keywords: [
      'preguntas entrevista cas 2026',
      'metodo star entrevista laboral',
      'entrevista personal estado peruano',
      'preguntas etica e integridad publica',
      'como responder entrevista servir'
    ],
    summary: 'La entrevista personal representa hasta el 50% de la calificación final de un concurso CAS. Aprende cómo estructurar respuestas convincentes que evidencien tus competencias técnicas, liderazgo, ética y vocación de servicio al ciudadano.',
    content: `
## 1. ¿Cómo Evalúa el Comité de Selección en el Estado?
A diferencia del sector privado, donde la química personal o afinidad cultural juega un rol determinante, en el Estado peruano los jurados deben guiarse por una **rúbrica de evaluación objetiva**.

Los miembros del comité (integrado por el jefe del área usuaria, un representante de Recursos Humanos y un veedor) asignan puntajes basados en:
1. **Solvencia Técnica:** Dominio de los procesos, sistemas (SIAF, SIGA, SEACE, SISGEDO) y leyes aplicables al puesto.
2. **Competencias por Comportamiento:** Trabajo en equipo, tolerancia a la presión, orientación a resultados y vocación de servicio.
3. **Ética e Integridad Pública:** Conocimiento de la Ley del Código de Ética de la Función Pública (Ley N° 27815) y actitud frente a dilemas de corrupción o conflicto de intereses.

---

## 2. El Método STAR: Tu Mejor Herramienta de Respuesta
El método STAR es la técnica avalada internacionalmente para responder preguntas conductuales con estructura y contundencia:
* **S (Situación):** Describe el contexto del reto laboral previo en el que te encontrabas.
* **T (Tarea):** Explica cuál era tu responsabilidad u objetivo específico ante esa situación.
* **A (Acción):** Detalla los pasos concretos que tomaste para solucionar el problema.
* **R (Resultado):** Cuantifica el logro alcanzado (ahorro de tiempo, cumplimiento de meta, mejora del servicio al usuario).

---

## 3. Las Preguntas Más Frecuentes y Cómo Responderlas

### Pregunta 1: "¿Por qué quiere trabajar en esta entidad pública?"
* **Lo que NO debes decir:** "Porque necesito trabajo", "Porque el sueldo es bueno" o "Para tener estabilidad".
* **Respuesta recomendada:** Demuestra que leíste el Plan Operativo Institucional (POI) o la misión de la entidad. *"Me apasiona contribuir con la modernización de los procesos de fiscalización de SUNAT, ya que mi experiencia previa en auditoría tributaria me permite optimizar los tiempos de respuesta y brindar un servicio transparente a los contribuyentes."*

### Pregunta 2: "¿Cómo actuaría si su superior jerárquico le ordena realizar un acto irregular o que roza la ilegalidad?"
* **Enfoque clave:** Ética pública estricta y apego a la Ley N° 27444.
* **Respuesta modelo:** *"Conforme a la Ley del Código de Ética de la Función Pública, el servidor civil tiene el deber de actuar con probidad y respeto a la legalidad. En primera instancia, pondría en conocimiento de mi superior las observaciones técnicas y legales de manera formal y por escrito. Si la orden persiste, no ejecutaría el acto y elevaría la consulta al órgano de control institucional (OCI) o a la secretaría técnica correspondiente."*

### Pregunta 3: "Cuénteme de una ocasión en que tuvo que trabajar bajo extrema presión con plazos ajustados."
* **Aplica STAR:** Describe un cierre contable, una auditoría sorpresa de Contraloría o la atención de una emergencia ciudadana, destacando cómo priorizaste tareas críticas sin descuidar la calidad.
`,
    faqs: [
      {
        question: '¿Es obligatorio vestir terno o sastre para la entrevista personal?',
        answer: 'Aunque formalmente las bases señalan "vestimenta formal o casual apropiada", en la cultura del sector público peruano la vestimenta formal de negocios (terno, sastre o camisa/blusa formal) genera una primera impresión de seriedad y respeto hacia el comité evaluador.'
      },
      {
        question: '¿Qué debo hacer si no sé la respuesta a una pregunta técnica?',
        answer: 'Nunca inventes ni adivines. Sé honesto con serenidad: "En este momento no tengo presente el número exacto del artículo reglamentario, pero el principio que aplica es la presunción de veracidad conforme a la Ley 27444, y sé dónde verificar la directiva de forma inmediata".'
      }
    ],
    relatedTools: [
      { label: 'Simulador de Entrevista Técnica CAS', href: '/simulador-entrevista-ia', description: 'Practica tu entrevista en tiempo real y recibe feedback sobre tus respuestas.' },
      { label: 'Preguntas Frecuentes de Entrevistas CAS', href: '/preguntas-entrevista-cas', description: 'Banco de más de 50 preguntas frecuentes organizadas por especialidad.' }
    ]
  },
  {
    slug: 'contratacion-locacion-de-servicios-rnp',
    title: 'Locación de Servicios en el Estado y RNP: Guía Tributaria y Legal 2026',
    metaTitle: 'Locación de Servicios en el Estado y Registro RNP: Todo lo que Debes Saber | Chamba Pro',
    description: 'Guía completa sobre la contratación de terceros por Locación de Servicios en el Estado peruano. Registro Nacional de Proveedores (RNP), Recibos por Honorarios y diferencias con planilla.',
    category: 'Contratación Pública',
    author: {
      name: 'Equipo Editorial Chamba Pro',
      role: 'Especialistas en Contrataciones del Estado (OSCE)',
      avatar: '/icon.svg',
    },
    publishedAt: '2026-03-10',
    updatedAt: '2026-09-20',
    readTime: '8 min de lectura',
    keywords: [
      'locacion de servicios estado peruano',
      'como sacar rnp personas naturales',
      'orden de servicio estado peru',
      'terceros en el estado peru',
      'recibo por honorarios locador estado'
    ],
    summary: 'La contratación por Órdenes de Servicio o Locación de Servicios es una de las puertas de entrada más comunes para profesionales independientes en el Estado. Descubre cómo tramitar tu RNP, qué impuestos pagas y cómo evitar contingencias.',
    content: `
## 1. ¿Qué es la Locación de Servicios en el Sector Público?
La contratación por Locación de Servicios (comúnmente llamada "trabajo por terceros" o "por orden de servicio") es una relación de naturaleza **civil**, regulada por el Código Civil y la Ley de Contrataciones del Estado, **no laboral**.

A través de esta figura, la entidad pública contrata los servicios especializados de una persona natural o jurídica para la realización de entregables específicos (informes técnicos, desarrollo de software, asesoría legal, mantenimiento) sin relación de subordinación.

---

## 2. Requisitos para ser Locador del Estado
Para ser contratado mediante Orden de Servicio (O/S) debes contar con:
1. **RUC Activo y Habido en SUNAT:** Inscrito en Rentas de Cuarta Categoría (trabajadores independientes).
2. **Registro Nacional de Proveedores (RNP):**
   * Es obligatorio para cualquier contratación igual o superior a 1 Unidad Impositiva Tributaria (UIT).
   * Para contrataciones menores a 1 UIT, algunas entidades exoneran el RNP, pero la mayoría lo solicita como estándar de transparencia.
   * El trámite se realiza 100% online en el portal del Organismo Supervisor de las Contrataciones del Estado (OSCE) y tiene vigencia indeterminada para personas naturales.
3. **No estar impedido para contratar con el Estado:** Según el Artículo 11° de la Ley de Contrataciones del Estado (no tener parentesco con directivos de la entidad, no ser funcionario público en ejercicio, etc.).
4. **Cuenta Bancaria para Depósito en Cuenta (CCI):** Código de Cuenta Interbancario vinculado a tu RUC en el Banco de la Nación o banca privada.

---

## 3. Emisión de Recibo por Honorarios y Retenciones SUNAT
El pago se procesa tras la emisión de la **Conformidad de Servicio** por parte del área usuaria:
* **Retención del 8% de Impuesto a la Renta:** Si tu recibo supera los S/ 1,500, la entidad retendrá el 8%, salvo que cuentes con la constancia vigente de **Suspensión de Retenciones de Cuarta Categoría** tramitada en SUNAT.
* **Seguridad Social:** Al no estar en planilla, el pago a EsSalud o EPS no corre por cuenta del Estado; cada locador debe afiliarse facultativamente a un seguro de salud (SIS Independiente o EsSalud Independiente).
`,
    faqs: [
      {
        question: '¿Un locador de servicios está sujeto a horario de trabajo o registro de asistencia?',
        answer: 'Legalmente NO. La locación de servicios es autónoma e independiente. Exigir cumplimiento de horario estricto, control biométrico o sanciones disciplinarias desnaturaliza el contrato civil, configurando una relación laboral encubierta reclamable judicialmente.'
      },
      {
        question: '¿Cuánto demora el trámite del RNP en OSCE?',
        answer: 'El trámite de inscripción en el RNP de bienes o servicios para personas naturales se aprueba automáticamente en un plazo de 24 a 48 horas hábiles tras el abono de la tasa oficial en el Banco de la Nación o Págalo.pe.'
      }
    ],
    relatedTools: [
      { label: 'Calculadora de Sueldo y Retenciones', href: '/calculadora-sueldo', description: 'Calcula tus ingresos netos y retenciones fiscales.' },
      { label: 'Plantillas y Declaraciones Juradas', href: '/plantillas-anexos', description: 'Descarga declaraciones juradas de no impedimento para contratar con el Estado.' }
    ]
  },
  {
    slug: 'derechos-laborales-cas-gratificaciones-cts',
    title: 'Derechos Laborales del Trabajador CAS en 2026: Vacaciones, Aguinaldos y Subsidios',
    metaTitle: 'Derechos del Trabajador CAS 2026: Vacaciones, Aguinaldos y CTS | Chamba Pro',
    description: 'Guía legal sobre los derechos laborales vigentes para trabajadores CAS en Perú: 30 días de vacaciones, descansos médicos, subsidios de EsSalud y liquidación de beneficios.',
    category: 'Derechos Laborales',
    author: {
      name: 'Equipo Editorial Chamba Pro',
      role: 'Abogados Laboralistas del Sector Público',
      avatar: '/icon.svg',
    },
    publishedAt: '2026-03-20',
    updatedAt: '2026-09-24',
    readTime: '7 min de lectura',
    keywords: [
      'derechos laborales cas 2026',
      'vacaciones truncas cas servir',
      'aguinaldo fiestas patrias cas',
      'licencia maternidad cas essalud',
      'liquidacion contrato cas'
    ],
    summary: 'Conoce los derechos laborales que te asisten como servidor público CAS. Cómo se calculan las vacaciones truncas, qué subsidios te corresponden por enfermedad y cómo defenderte ante despidos injustificados.',
    content: `
## 1. Marco Jurídico de los Derechos CAS
Gracias a sucesivas reformas legislativas (como la Ley N° 29849 y la Ley N° 31131), los trabajadores bajo el régimen CAS pasaron de tener derechos sumamente recortados a gozar de un catálogo de beneficios laborales fundamentales:

1. **Jornada Laboral Máxima:** 8 horas diarias o 48 horas semanales. Toda hora en exceso debe ser compensada con descansos equivalentes o pago de sobretiempo si existe disponibilidad presupuestal.
2. **Descanso Semanal Obligatorio:** Mínimo de 24 horas consecutivas de descanso por semana trabajada, preferentemente los domingos.
3. **Vacaciones Pagadas de 30 Días:** Derecho a 30 días calendario de descanso remunerado por cada año completo de servicios cumplido.
4. **Afiliación Obligatoria a EsSalud:** Cobertura de salud familiar pagada íntegramente por la entidad empleadora (tasa del 9% sobre la remuneración mensual).
5. **Afiliación al Sistema de Pensiones:** Elección libre entre el Sistema Privado (AFP Integra, Prima, Profuturo, Habitat) o el Sistema Nacional de Pensiones (ONP).

---

## 2. Cálculo y Pago de Vacaciones Truncas
Si tu contrato CAS concluye por vencimiento de plazo, renuncia voluntaria o mutuo disenso sin que hayas tomado tus vacaciones devengadas:
* Tienes derecho al pago compensatorio de **Vacaciones Truncas**.
* Se calcula de forma proporcional a los meses y días efectivamente laborados en el periodo vacacional en curso.
* El pago debe efectuarse en la liquidación de beneficios sociales dentro de los 30 días hábiles siguientes al cese laboral.

---

## 3. Subsidios y Licencias Reconocidas por Ley
* **Licencia por Maternidad:** 98 días calendario (49 días de descanso prenatal y 49 días postnatal) con subsidio pagado por EsSalud.
* **Licencia por Paternidad:** 10 días calendario consecutivos con goce de haber pagados por la entidad empleadora.
* **Licencias por Fallecimiento de Familiares Directos:** 5 días hábiles en caso de fallecimiento de cónyuge, padres, hijos o hermanos.
* **Subsidio por Incapacidad Temporal para el Trabajo:** A partir del día 21 de descanso médico continuo, EsSalud asume el pago del subsidio hasta por un máximo acumulado de 11 meses y 10 días.
`,
    faqs: [
      {
        question: '¿El trabajador CAS tiene derecho a indemnización por despido arbitrario?',
        answer: 'Sí. Si un trabajador con contrato CAS indeterminado o con contrato vigente es despedido sin causa justificada contemplada en la ley, el Tribunal Constitucional y la Corte Suprema han establecido su derecho a reincorporación o a una indemnización equivalente a las remuneraciones dejadas de percibir según los topes normativos.'
      },
      {
        question: '¿Me pueden reducir el sueldo en una adenda de contrato CAS?',
        answer: 'No. La remuneración del trabajador CAS constituye un derecho adquirido y no puede ser reducida unilateralmente por la entidad empleadora, salvo que medie consentimiento expreso e informado o cambio estructural de funciones debidamente fundamentado.'
      }
    ],
    relatedTools: [
      { label: 'Calculadora de Beneficios y Sueldo Neto', href: '/calculadora-sueldo', description: 'Revisa tus descuentos de ley y monto exacto a percibir.' },
      { label: 'Comparador de Regímenes Laborales', href: '/comparador-regimenes', description: 'Analiza las diferencias de beneficios entre CAS y otros regímenes.' }
    ]
  }
];

export function getGuiaBySlug(slug: string): GuiaLaboral | undefined {
  return GUIAS_LABORALES.find((g) => g.slug === slug);
}

export function getAllGuias(): GuiaLaboral[] {
  return GUIAS_LABORALES;
}
