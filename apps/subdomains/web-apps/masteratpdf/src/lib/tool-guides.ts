export interface ToolGuideData {
  headline: string;
  intro: string;
  steps: string[];
  tips: string[];
  faqs: { q: string; a: string }[];
}

export const TOOL_GUIDES: Record<string, ToolGuideData> = {
  merge: {
    headline: 'Cómo unir archivos PDF sin perder calidad ni privacidad',
    intro:
      'Nuestra herramienta para unir PDF combina expedientes, boletas, certificados y reportes en un solo archivo ordenado directamente en la memoria de tu navegador mediante pdf-lib. Ningún documento viaja a servidores remotos ni queda retenido en la nube.',
    steps: [
      'Selecciona o arrastra dos o más archivos PDF hacia el lienzo.',
      'Ordena los documentos visualmente en la secuencia exacta que necesitas.',
      'Haz clic en Unir PDF y descarga el documento consolidado en segundos.'
    ],
    tips: [
      'Conserva fuentes vectoriales, enlaces internos y texto seleccionable en trámites oficiales.',
      'Ideal para presentar CV documentado con constancias y anexos en un archivo único.'
    ],
    faqs: [
      {
        q: '¿Hay límite en la cantidad de archivos al unir PDF?',
        a: 'Puedes combinar múltiples documentos en la misma sesión siempre que cada archivo respete el tamaño máximo del navegador para mantener fluidez.'
      },
      {
        q: '¿Se reduce la nitidez al combinar páginas escaneadas?',
        a: 'No. Cada página mantiene su resolución original sin recomprimir las imágenes incrustadas.'
      }
    ]
  },
  split: {
    headline: 'Cómo dividir o extraer páginas específicas de un PDF',
    intro:
      'Extrae hojas firmadas, capítulos concretos o rangos exactos de expedientes voluminosos en pocos clics. El motor local procesa rangos personalizados o divide hoja por hoja sin alterar los documentos originales.',
    steps: [
      'Carga el archivo PDF extenso que deseas segmentar.',
      'Elige el modo de división por rangos exactos o separación por página.',
      'Genera y descarga el archivo o lote resultante al instante.'
    ],
    tips: [
      'Útil para extraer anexos firmados o comprobantes individuales de estados de cuenta extensos.',
      'Evita subir documentos contables o contratos privados a servidores externos.'
    ],
    faqs: [
      {
        q: '¿El archivo original se modifica al dividirlo?',
        a: 'No. Tu documento original permanece intacto en tu equipo y se genera una copia nueva con las páginas elegidas.'
      },
      {
        q: '¿Puedo indicar varios rangos discontinuos como 1-3, 8, 12-15?',
        a: 'Sí. El selector admite tanto intervalos consecutivos como números de página individuales.'
      }
    ]
  },
  organize: {
    headline: 'Cómo reordenar, rotar o eliminar páginas de un PDF visualmente',
    intro:
      'Administra cada hoja como si fuera una ficha individual gracias a las miniaturas renderizadas localmente con pdfjs-dist. Corrige páginas invertidas, elimina separadores en blanco y ajusta el orden final antes de guardar.',
    steps: [
      'Sube tu PDF y espera la generación instantánea de miniaturas por página.',
      'Arrastra cada tarjeta para cambiar el orden o usa los botones para rotar o quitar hojas.',
      'Guarda el nuevo PDF con la estructura definitiva lista para compartir.'
    ],
    tips: [
      'Revisa la orientación de escaneos antes de enviarlos a mesas de partes digitales.',
      'Elimina carátulas repetidas o hojas vacías para aligerar el tamaño final.'
    ],
    faqs: [
      {
        q: '¿Las miniaturas se procesan en mi equipo?',
        a: 'Sí. Se dibujan localmente en HTML5 Canvas sin subir el contenido de tus páginas.'
      },
      {
        q: '¿Puedo rotar solo una página dentro de un documento largo?',
        a: 'Sí, cada página dispone de controles individuales de rotación en 90 grados.'
      }
    ]
  },
  rotate: {
    headline: 'Cómo rotar páginas PDF torcidas o escaneadas al revés',
    intro:
      'Corrige de forma permanente la orientación de folios escaneados en horizontal o de cabeza. A diferencia de girar la vista en un lector temporal, esta herramienta reescribe la orientación real en el archivo PDF.',
    steps: [
      'Carga el archivo PDF con páginas mal orientadas.',
      'Aplica rotación horaria, antihoraria o de 180 grados según necesites.',
      'Descarga el archivo corregido para abrirlo derecho en cualquier dispositivo.'
    ],
    tips: [
      'Verifica la vista previa antes de exportar para asegurar lectura uniforme.',
      'Combínalo con Unir PDF si vas a integrar varias resoluciones escaneadas.'
    ],
    faqs: [
      {
        q: '¿El cambio de orientación se guarda de forma permanente?',
        a: 'Sí. El PDF descargado actualiza el atributo de rotación en la estructura interna del documento.'
      },
      {
        q: '¿Afecta al texto seleccionable del documento?',
        a: 'No, todo el texto y gráficos vectoriales permanecen intactos tras rotar.'
      }
    ]
  },
  'page-numbers': {
    headline: 'Cómo numerar páginas de un documento PDF profesionalmente',
    intro:
      'Agrega foliación automática y consistente en trabajos académicos, informes técnicos, contratos y expedientes legales con formato personalizable, márgenes equilibrados y tipografía nítida.',
    steps: [
      'Sube el PDF al que deseas añadir numeración.',
      'Selecciona posición, formato de etiqueta y rango inicial de páginas.',
      'Genera el documento numerado listo para impresión o archivo.'
    ],
    tips: [
      'Puedes omitir la portada si el reglamento de tu institución exige numerar desde la página dos.',
      'Elige el formato "Página X de Y" para expedientes administrativos que requieren control de folios.'
    ],
    faqs: [
      {
        q: '¿Puedo decidir desde qué página empieza la numeración?',
        a: 'Sí. Puedes configurar tanto la página inicial donde aparece el sello como el número desde el cual contar.'
      },
      {
        q: '¿Se superpone sobre mis encabezados existentes?',
        a: 'Puedes elegir la esquina o margen inferior con distancia personalizada para evitar colisiones.'
      }
    ]
  },
  watermark: {
    headline: 'Cómo colocar una marca de agua de texto en todas las páginas de un PDF',
    intro:
      'Protege borradores, cotizaciones y documentos confidenciales insertando una marca de agua diagonal o centrada con opacidad ajustable, color discreto y rotación exacta en todo el documento.',
    steps: [
      'Carga el archivo PDF al que aplicarás la marca identificatoria.',
      'Escribe el texto personalizado (por ejemplo "CONFIDENCIAL" o "BORRADOR") y ajusta opacidad y ángulo.',
      'Procesa el archivo en segundos y descarga la versión marcada.'
    ],
    tips: [
      'Usa una opacidad entre 15 % y 30 % para identificar el documento sin dificultar su lectura.',
      'Ideal para entregar propuestas comerciales o expedientes de consulta.'
    ],
    faqs: [
      {
        q: '¿La marca de agua se aplica a todo el PDF?',
        a: 'Sí, el sistema estampa la marca con consistencia geométrica en cada página seleccionada.'
      },
      {
        q: '¿Alguien puede quitar fácilmente la marca después?',
        a: 'Al quedar incrustada dentro del contenido de cada página dificulta la reutilización no autorizada.'
      }
    ]
  },
  compress: {
    headline: 'Cómo comprimir y reducir el peso de un PDF para trámites y correo',
    intro:
      'Muchos portales estatales, universidades y clientes de correo rechazan archivos pesados. Esta utilidad optimiza recursos redundantes, metadatos e imágenes manteniendo una lectura clara en pantalla e impresión.',
    steps: [
      'Arroja tu PDF pesado al panel principal.',
      'Elige el nivel de compresión equilibrio o máximo ahorro según el contenido.',
      'Compara el tamaño resultante antes y después de descargar.'
    ],
    tips: [
      'Para planos o firmas delicadas elige compresión estándar para preservar detalles.',
      'Revisa las tablas numéricas luego de comprimir para confirmar legibilidad perfecta.'
    ],
    faqs: [
      {
        q: '¿Cuánto peso puede reducirse en promedio?',
        a: 'Depende de cómo se generó el PDF; los documentos escaneados a alta resolución suelen lograr las mayores reducciones.'
      },
      {
        q: '¿Los archivos comprimidos funcionan en cualquier mesa de partes virtual?',
        a: 'Sí, generan un PDF estándar compatible con visores oficiales y sistemas gubernamentales.'
      }
    ]
  },
  'jpg-to-pdf': {
    headline: 'Cómo convertir fotografías JPG o PNG en un documento PDF ordenado',
    intro:
      'Reúne comprobantes de pago, fotografías de pizarra, formularios fotografiados y escaneos JPG o PNG dentro de un único PDF con orientación uniforme y márgenes adecuados.',
    steps: [
      'Selecciona las imágenes JPG o PNG desde tu ordenador o celular.',
      'Reordena las fotografías según la secuencia correcta.',
      'Ajusta márgenes y tamaño de hoja y descarga el PDF unificado.'
    ],
    tips: [
      'Ordena primero tus fotos para que actas o boletas queden cronológicas.',
      'Ideal para transformar múltiples recibos en un único archivo de rendición de gastos.'
    ],
    faqs: [
      {
        q: '¿Acepta mezcla de imágenes JPG y PNG en un mismo PDF?',
        a: 'Sí, puedes combinar ambos formatos dentro del mismo documento final.'
      },
      {
        q: '¿Las imágenes suben a algún servidor externo?',
        a: 'No, todo el ensamblaje ocurre directamente dentro de tu navegador.'
      }
    ]
  },
  'word-to-pdf': {
    headline: 'Cómo convertir documentos Word (DOCX y DOC) a PDF conservando el formato',
    intro:
      'Evita que tus currículos, oficios y tesis se descuadren al abrirse en otros equipos. La conversión a PDF fija márgenes, saltos de página, viñetas y tablas exactamente como los diseñaste.',
    steps: [
      'Sube tu archivo en formato DOCX o DOC.',
      'Espera unos instantes mientras el motor de conversión genera el PDF fiel al diseño.',
      'Descarga el documento resultante listo para firma o envío oficial.'
    ],
    tips: [
      'Usa fuentes estándar o incrustadas en tu DOCX para máxima fidelidad tipográfica.',
      'Convierte a PDF antes de imprimir o compartir currículos por portales laborales.'
    ],
    faqs: [
      {
        q: '¿Se respetan tablas e imágenes del archivo Word?',
        a: 'Sí, nuestro servicio de conversión procesa la maquetación completa preservando encabezados, tablas e ilustraciones.'
      },
      {
        q: '¿Qué formatos de Word están soportados?',
        a: 'Tanto archivos modernos .docx como documentos heredados .doc.'
      }
    ]
  },
  'pdf-to-word': {
    headline: 'Cómo convertir un PDF en un documento Word (.docx) editable',
    intro:
      'Recupera textos, párrafos y tablas contenidos en un archivo PDF para actualizar contratos, reutilizar informes o corregir erratas directamente desde Microsoft Word o LibreOffice Writer.',
    steps: [
      'Selecciona el archivo PDF que deseas volver editable.',
      'Inicia la conversión de alta fidelidad.',
      'Descarga el documento .docx generado y ábrelo en tu editor favorito.'
    ],
    tips: [
      'Para PDFs nacidos digitales con texto real el resultado conserva mejor estilos y columnas.',
      'Si tu archivo es una foto escaneada sin capa de texto, aplica primero OCR PDF.'
    ],
    faqs: [
      {
        q: '¿Funciona si el PDF es un documento escaneado como imagen?',
        a: 'Si no tiene texto incrustado conviene pasar primero por OCR PDF para obtener texto editable en Word.'
      },
      {
        q: '¿Conservará el archivo Word el mismo contenido textual?',
        a: 'Sí, reconstruye la estructura de párrafos y tablas detectadas dentro del PDF.'
      }
    ]
  },
  'pdf-to-jpg': {
    headline: 'Cómo convertir páginas de un PDF a imágenes JPG de alta nitidez',
    intro:
      'Transforma diapositivas, portadas, constancias o flyers en archivos JPG individuales listos para incrustar en presentaciones, redes sociales o aplicaciones de mensajería.',
    steps: [
      'Carga el archivo PDF desde tu dispositivo.',
      'Elige la calidad o resolución deseada para las imágenes.',
      'Descarga las imágenes generadas en segundos.'
    ],
    tips: [
      'Utiliza resolución alta cuando las páginas incluyan letra pequeña o gráficos estadísticos.',
      'Procesamiento local para no exponer documentos internos.'
    ],
    faqs: [
      {
        q: '¿Se convierte todo el PDF en imágenes separadas?',
        a: 'Sí, cada página del documento se exporta como un archivo JPG independiente.'
      },
      {
        q: '¿Las imágenes conservan proporción y nitidez original?',
        a: 'Sí, mantienen exactamente la relación de aspecto de cada hoja PDF.'
      }
    ]
  },
  'pdf-to-excel': {
    headline: 'Cómo extraer tablas y listados desde un PDF hacia Excel (.xlsx)',
    intro:
      'Olvídate de transcribir a mano cuadros numéricos, facturas o padrones publicados en PDF. Convierte filas y columnas detectadas a una hoja de cálculo XLSX manipulable para cálculos y filtros.',
    steps: [
      'Carga el PDF que contiene las tablas financieras, cuadros o listados.',
      'Ejecuta el extractor tabular.',
      'Descarga la hoja de cálculo Excel y comienza a analizar los datos.'
    ],
    tips: [
      'Verifica formatos de decimales y fechas tras importar balances o reportes de costos.',
      'Funciona mejor con tablas cuyas columnas tengan separaciones claras.'
    ],
    faqs: [
      {
        q: '¿Qué archivo genera la herramienta?',
        a: 'Genera un libro estándar .xlsx compatible con Microsoft Excel, Google Sheets y LibreOffice Calc.'
      },
      {
        q: '¿Puedo extraer múltiples páginas con tablas?',
        a: 'Sí, el conversor procesa las tablas encontradas a lo largo de las páginas del archivo.'
      }
    ]
  },
  'pdf-to-text': {
    headline: 'Cómo extraer todo el texto plano de un PDF a formato TXT',
    intro:
      'Obtén rápidamente el contenido textual limpio de artículos, resoluciones o apuntes en PDF para buscar citas, copiar bloques largos o analizarlo sin distracciones visuales ni formato pesado.',
    steps: [
      'Selecciona el PDF con texto seleccionable.',
      'Extrae instantáneamente todas las páginas en tu navegador.',
      'Copia el resultado o descárgalo en archivo .txt.'
    ],
    tips: [
      'Ideal para preparar prompts extensos o depurar listados sin saltos de línea rotos.',
      'Si el PDF fue escaneado como foto, utiliza primero la herramienta OCR PDF.'
    ],
    faqs: [
      {
        q: '¿Conserva el orden de lectura de las páginas?',
        a: 'Sí, extrae el flujo de texto de forma secuencial página por página.'
      },
      {
        q: '¿Necesito conexión veloz para usarlo?',
        a: 'No, la extracción corre localmente dentro de tu navegador.'
      }
    ]
  },
  'pdf-to-markdown': {
    headline: 'Cómo convertir un PDF a Markdown estructurado para documentación e IA',
    intro:
      'Convierte manuales técnicos, papers y especificaciones en texto Markdown con jerarquía limpia de títulos, listas y bloques, ideal para alimentar bases de conocimiento o asistentes como ChatGPT y Claude.',
    steps: [
      'Carga el documento PDF técnico o académico.',
      'Ejecuta el analizador estructural en Markdown.',
      'Copia el contenido con formato .md o descárgalo listo para tu repositorio.'
    ],
    tips: [
      'Revisa las tablas convertidas cuando existan celdas combinadas complejas.',
      'Excelente formato intermedio para publicar documentación en GitHub, Notion o blogs técnicos.'
    ],
    faqs: [
      {
        q: '¿Por qué convertir a Markdown en lugar de TXT plano?',
        a: 'Markdown conserva títulos, viñetas y tablas ligeras que ayudan a los modelos de lenguaje y editores técnicos a comprender la estructura.'
      },
      {
        q: '¿Puedo editar el archivo generado?',
        a: 'Sí, es texto plano UTF-8 editable con cualquier editor de código o notas.'
      }
    ]
  },
  'pdf-to-ppt': {
    headline: 'Cómo transformar una presentación PDF en diapositivas PowerPoint (.pptx)',
    intro:
      'Convierte decks exportados en PDF de vuelta a formato PowerPoint editable cuando necesitas actualizar cifras, reordenar láminas o corregir una diapositiva antes de exponer.',
    steps: [
      'Selecciona el archivo PDF de tu presentación.',
      'Procesa la conversión a diapositivas PPTX.',
      'Descarga y edita libremente en PowerPoint o Google Slides.'
    ],
    tips: [
      'Revisa las fuentes empleadas si tu equipo no cuenta con la tipografía original.',
      'Ahorra horas de rediseño frente a recrear láminas desde cero.'
    ],
    faqs: [
      {
        q: '¿Mantiene una diapositiva por página?',
        a: 'Sí, cada página del PDF se mapea ordenadamente a su diapositiva correspondiente.'
      },
      {
        q: '¿Es compatible con presentaciones modernas?',
        a: 'Sí, genera archivos en formato estándar .pptx.'
      }
    ]
  },
  ocr: {
    headline: 'Cómo aplicar OCR para hacer buscable y copiable un PDF escaneado',
    intro:
      'Los escáneres convencionales producen PDFs compuestos únicamente por fotografías donde no puedes seleccionar palabras ni usar Ctrl+F. El reconocimiento óptico de caracteres (OCR) añade texto buscable preservando la imagen.',
    steps: [
      'Sube tu archivo PDF escaneado o fotografiado.',
      'Ejecuta el reconocimiento óptico según el idioma del documento.',
      'Descarga el documento con capa de texto seleccionable y copiable.'
    ],
    tips: [
      'Escaneos rectos y con buen contraste logran la mayor precisión de lectura OCR.',
      'Después de aplicar OCR puedes usar PDF a Word o PDF a Texto sin problemas.'
    ],
    faqs: [
      {
        q: '¿El OCR altera visualmente mis páginas escaneadas?',
        a: 'Conserva la apariencia original mientras incorpora la capa invisible de texto seleccionable para búsquedas.'
      },
      {
        q: '¿Sirve para actas antiguas o recibos escaneados?',
        a: 'Sí, siempre que la tipografía impresa sea legible a simple vista.'
      }
    ]
  },
  protect: {
    headline: 'Cómo cifrar y proteger un archivo PDF con contraseña',
    intro:
      'Restringe la apertura no autorizada de nóminas, contratos, informes médicos y documentación corporativa estableciendo una contraseña sólida antes de compartir el archivo por correo o mensajería.',
    steps: [
      'Carga el documento PDF sensible que necesitas resguardar.',
      'Define una contraseña segura combinando letras y números.',
      'Descarga la versión protegida lista para compartir de forma segura.'
    ],
    tips: [
      'Envía la contraseña por un canal distinto al del archivo adjunto para mayor seguridad.',
      'Guarda una copia segura de la clave ya que no podrá recuperarse si se olvida.'
    ],
    faqs: [
      {
        q: '¿Quién podrá abrir el PDF protegido?',
        a: 'Únicamente las personas que dispongan de la contraseña configurada al crear la protección.'
      },
      {
        q: '¿MasterAtPDF almacena mi contraseña?',
        a: 'No. Nunca guardamos ni registramos contraseñas ni copias de tus archivos.'
      }
    ]
  },
  unlock: {
    headline: 'Cómo desbloquear o quitar la contraseña de un PDF propio',
    intro:
      'Si recibes tus boletas mensuales o estados bancarios protegidos con clave de apertura y cuentas con la contraseña autorizada, puedes generar una copia sin restricciones para archivarla o combinarla con otros PDFs.',
    steps: [
      'Selecciona el documento PDF cifrado.',
      'Introduce la contraseña actual autorizada para desencriptarlo.',
      'Descarga la copia limpia libre de contraseña.'
    ],
    tips: [
      'Utiliza esta función únicamente con documentos propios o de los que posees permiso legítimo.',
      'Muy práctico antes de unir múltiples boletas mensuales mediante Unir PDF.'
    ],
    faqs: [
      {
        q: '¿Puedo quitar la contraseña sin conocer la clave original?',
        a: 'Si el documento usa cifrado sólido de apertura necesitas ingresar su contraseña legítima para autorizar la copia desbloqueada.'
      },
      {
        q: '¿Por qué desbloquear un recibo propio?',
        a: 'Para facilitar su consolidación en expedientes digitales o impresión rápida en trámites.'
      }
    ]
  },
  'ai-summary': {
    headline: 'Cómo resumir documentos PDF largos con inteligencia artificial',
    intro:
      'Extrae conclusiones clave, puntos accionables y síntesis clara de normativas extensas, resoluciones administrativas o artículos académicos para entender lo esencial en cuestión de segundos.',
    steps: [
      'Sube el documento PDF cuyo contenido deseas sintetizar.',
      'Elige el estilo de resumen ejecutivo o listado de ideas principales.',
      'Lee, copia y reutiliza la síntesis generada.'
    ],
    tips: [
      'Contrasta siempre cifras legales o cláusulas críticas frente al texto fuente del documento.',
      'Combínalo con OCR PDF si el expediente original era una imagen escaneada.'
    ],
    faqs: [
      {
        q: '¿Qué tipo de documentos aprovechan mejor el resumen?',
        a: 'Informes técnicos, bases administrativas, manuales extensos y papers de investigación con texto claro.'
      },
      {
        q: '¿Sustituye la lectura completa en contratos legales?',
        a: 'No; funciona como apoyo rápido para ubicar secciones relevantes antes de revisar el documento oficial.'
      }
    ]
  },
  crop: {
    headline: 'Cómo recortar márgenes blancos o áreas no deseadas de un PDF',
    intro:
      'Elimina bordes amplios, encabezados repetitivos o márgenes de escaneo ajustando la caja visible de todas las páginas o de una hoja puntual sin perder nitidez.',
    steps: [
      'Carga tu documento PDF en el área de trabajo.',
      'Ajusta los porcentajes de recorte superior, inferior, izquierdo y derecho sobre la vista previa.',
      'Aplica a todo el documento o a la página actual y descarga el PDF recortado.'
    ],
    tips: [
      'Útil para adaptar documentos escaneados o tickets antes de imprimir en formato compacto.',
      'Puedes restablecer los márgenes a 0% en cualquier momento antes de exportar.'
    ],
    faqs: [
      {
        q: '¿El recorte reduce la calidad del texto?',
        a: 'No. Se actualizan las cajas CropBox y MediaBox preservando el contenido vectorial original.'
      },
      {
        q: '¿Puedo recortar solo una página?',
        a: 'Sí, selecciona la opción Solo página actual en el panel lateral.'
      }
    ]
  },
  repair: {
    headline: 'Cómo reparar un archivo PDF corrupto o dañado',
    intro:
      'Cuando una descarga se interrumpe o un software genera tablas de referencias cruzadas dañadas, el motor reconstruye los objetos recuperables en un PDF limpio.',
    steps: [
      'Selecciona el archivo PDF que presenta fallos de apertura.',
      'Inicia el proceso de reconstrucción estructural (PyMuPDF / pdf-lib).',
      'Descarga el documento recuperado y verifica las páginas restauradas.'
    ],
    tips: [
      'Conserva el archivo original como respaldo por si el daño afecta a flujos binarios irrecuperables.'
    ],
    faqs: [
      {
        q: '¿Qué tipos de errores puede corregir?',
        a: 'Tablas XRef desalineadas, streams sin comprimir o cabeceras con metadatos corruptos.'
      }
    ]
  },
  sign: {
    headline: 'Cómo firmar un PDF online dibujando o subiendo tu rúbrica',
    intro:
      'Estampa tu firma manuscrita, tipográfica o imagen PNG transparente sobre contratos, solicitudes o constancias sin necesidad de imprimir ni escanear.',
    steps: [
      'Sube el PDF que necesitas firmar.',
      'Dibuja tu firma con el mouse/dedo, escríbela o sube una imagen PNG.',
      'Haz clic sobre la página en el lugar exacto y descarga el PDF firmado.'
    ],
    tips: [
      'Puedes colocar firmas en múltiples páginas dentro de la misma sesión.',
      'Ajusta el porcentaje de ancho antes de hacer clic para adaptarlo al recuadro del contrato.'
    ],
    faqs: [
      {
        q: '¿Se borra o altera el texto existente del contrato?',
        a: 'No, la firma se incrusta como una capa gráfica independiente encima de la página.'
      }
    ]
  },
  redact: {
    headline: 'Cómo censurar y eliminar datos confidenciales de un PDF',
    intro:
      'Antes de compartir expedientes, boletas o contratos públicamente, marca los campos sensibles para purgar el texto y gráficos subyacentes de forma irreversible.',
    steps: [
      'Carga el documento PDF con información sensible.',
      'Arrastra con el cursor sobre los datos que deseas ocultar en cada página.',
      'Aplica la censura permanente y descarga el archivo limpio.'
    ],
    tips: [
      'A diferencia de tapar con un cuadro negro en un editor simple, aquí se elimina el texto real debajo del área marcada.'
    ],
    faqs: [
      {
        q: '¿Se puede recuperar o copiar el texto debajo de la zona negra?',
        a: 'No. Tanto la purga estructural en servidor como el aplanado de página eliminan los caracteres subyacentes.'
      }
    ]
  }
};

