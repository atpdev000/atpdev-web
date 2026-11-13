export interface BlogLocaleContent {
  title: string;
  excerpt: string;
  category: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  tags: string[];
  relatedProjectSlug: string;
  relatedProjectName: string;
  es: BlogLocaleContent;
  en: BlogLocaleContent;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'arquitectura-offline-android-kotlin-room-fts4',
    publishedAt: '2026-10-14',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 9,
    tags: ['Android', 'Kotlin', 'Room', 'FTS4', 'Clean Architecture'],
    relatedProjectSlug: 'buscador-clinico-cie-10-pro',
    relatedProjectName: 'Buscador Clínico CIE-10 Pro',
    es: {
      title: 'Arquitectura Offline-First en Android con Kotlin, Room FTS4 y Búsqueda en Sub-10 ms',
      category: 'Ingeniería Mobile',
      excerpt:
        'Cómo diseñar catálogos médicos o técnicos en Android capaces de consultar más de 14,000 registros sin conexión a internet utilizando SQLite FTS4, corrutinas y Jetpack Compose.',
      content: `## El problema real de depender de la red en aplicaciones críticas

En entornos clínicos, agrícolas y de trabajo en campo en Perú y Latinoamérica, asumir que el usuario tendrá cobertura 4G o Wi-Fi estable es un error de diseño grave. Cuando un médico necesita verificar un código diagnóstico CIE-10 durante una guardia rural, o un técnico de campo consulta especificaciones normativas sin señal móvil, una pantalla bloqueada por un indicador de carga inutiliza por completo la herramienta.

Una estrategia **Offline-First** invierte esa dependencia clásica: la base de datos local SQLite administrada mediante **Room** se convierte en la única fuente de verdad (*Single Source of Truth*) para la interfaz declarativa en **Jetpack Compose**. La conectividad a internet pasa a ser un canal opcional para sincronización diferida o telemetría anónima, nunca un requisito bloqueante en la ruta crítica del usuario.

## Por qué \`LIKE '%termino%'\` colapsa la fluidez de la interfaz

El primer tropiezo habitual al construir un buscador local en Android consiste en reutilizar consultas SQL convencionales con comodines al inicio y al final de la cadena:

~~~sql
SELECT * FROM cie10_codes
WHERE description LIKE '%' || :query || '%'
   OR code LIKE '%' || :query || '%'
~~~

En catálogos pequeños de cien o doscientos elementos esa consulta parece suficientemente veloz. Sin embargo, cuando el conjunto crece por encima de los **14,000 códigos diagnósticos** acompañados de sinónimos, notas de inclusión, capítulos anatómicos y exclusiones clínicas, el operador \`LIKE '%...'\` impide utilizar índices B-Tree convencionales y fuerza un escaneo secuencial completo (*Full Table Scan*). En teléfonos Android de gama de entrada con almacenamiento eMMC lento, cada tecla presionada tarda entre 90 y 240 milisegundos, generando tirones visibles (*frame drops*) al escribir rápido.

La alternativa nativa integrada dentro de SQLite en Android es **Full-Text Search (FTS4)**. Room soporta tablas virtuales indexadas por tokens declarando la anotación \`@Fts4\`:

~~~kotlin
@Entity(tableName = "cie10_entries")
data class Cie10Entity(
    @PrimaryKey val code: String,
    val title: String,
    val titleNormalized: String,
    val chapter: String,
    val notes: String
)

@Fts4(contentEntity = Cie10Entity::class)
@Entity(tableName = "cie10_fts")
data class Cie10FtsEntity(
    val code: String,
    val titleNormalized: String,
    val notes: String
)
~~~

Al enlazar \`contentEntity = Cie10Entity::class\`, Room crea un índice invertido de palabras y prefijos sincronizado automáticamente con la tabla principal sin duplicar innecesariamente todo el texto almacenado en disco.

## Consultas reactivas con Kotlin Flow, debounce y normalización sin tildes

En español, la mayoría de las búsquedas rápidas desde teclado móvil omiten diacríticos: los profesionales teclean \`hipertension\`, \`neumonia\`, \`apendicitis\` o \`diabetes tipo 2\`. Si las descripciones médicas oficiales conservan ortografía clínica estricta (\`Hipertensión esencial\`), una búsqueda exacta perderá resultados esenciales salvo que normalicemos el texto de indexación y la consulta de entrada a una forma ASCII estable mediante \`Normalizer.Form.NFD\`.

En la capa de presentación y dominio, encadenamos operadores reactivos de **Kotlin Coroutines** dentro del \`ViewModel\` para evitar saturar el hilo principal y cancelar consultas obsoletas en vuelo:

~~~kotlin
@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
val searchResults: StateFlow<List<ClinicalSummary>> = searchQuery
    .debounce(75)
    .map { sanitizeAndNormalize(it) }
    .distinctUntilChanged()
    .flatMapLatest { tokens ->
        if (tokens.isEmpty()) {
            repository.observeRecentAndBookmarks()
        } else {
            val ftsExpression = tokens.joinToString(" ") { "$it*" }
            repository.searchByFts(ftsExpression)
        }
    }
    .flowOn(Dispatchers.IO)
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
~~~

Dos detalles marcan la diferencia en producción:

1. **Sanitización de tokens:** caracteres como guiones (\`-\`), comillas (\`"\`), asteriscos o paréntesis tienen significado booleano dentro de la sintaxis \`MATCH\` de FTS4. Si un usuario escribe \`E11-9\` y pasamos el guion sin limpiar o sin comillas, SQLite interpreta una exclusión sintáctica y puede lanzar \`SQLiteException\`. Tokenizar estrictamente caracteres alfanuméricos evita cierres inesperados.
2. **Proyecciones livianas para listas:** el \`DAO\` de búsqueda debe proyectar únicamente los campos necesarios para la tarjeta de \`LazyColumn\` (\`code\`, \`title\`, \`chapter\`), difiriendo la lectura de \`notes\` extensas hasta que el usuario abre la vista de detalle.

## Empaquetado pre-poblado, arranque en frío y migraciones seguras

Si la aplicación intenta descargar o parsear un JSON de varios megabytes durante el primer lanzamiento, el tiempo hasta la primera interacción se dispara y eleva el abandono. Una práctica mucho más sólida consiste en compilar el archivo \`.db\` durante la integración continua, ejecutar \`VACUUM\` y \`ANALYZE\` sobre él, y empaquetarlo dentro de \`assets/databases/\`:

~~~kotlin
Room.databaseBuilder(context, ClinicalDatabase::class.java, "clinical_catalog_v4.db")
    .createFromAsset("databases/clinical_catalog_v4.db")
    .fallbackToDestructiveMigrationOnDowngrade()
    .build()
~~~

Separar el catálogo de solo lectura (actualizable en bloque con cada release) en una instancia Room distinta respecto a la base de datos de usuario (favoritos, notas propias e historial reciente) permite reemplazar el catálogo clínico completo sin riesgo alguno de perder datos personales mediante una migración destructiva accidental.

## Verificación de latencia y lista de control para producción

- **Benchmark con \`Macrobenchmark\` y \`Perfetto\`:** valida tanto el tiempo de *cold start* (\`< 450 ms\`) como el percentil 95 de consulta FTS4 en dispositivos reales con Android 8 a Android 15.
- **Pruebas unitarias de tokenización:** cubre consultas con tildes, códigos mixtos con punto (\`J06.9\`), espacios múltiples y cadenas con símbolos especiales.
- **Modo avión completo en QA:** ejecuta todo el flujo de búsqueda, filtrado por capítulo y copia rápida al portapapeles con todas las interfaces de red deshabilitadas.

Con esta arquitectura implementada en \`Buscador Clínico CIE-10 Pro\`, cada consulta se resuelve en **menos de 10 milisegundos** de manera consistente y predecible, sin consumo de datos móviles ni dependencia de servidores externos.`
    },
    en: {
      title: 'Offline-First Android Architecture with Kotlin, Room FTS4, and Sub-10ms Search',
      category: 'Mobile Engineering',
      excerpt:
        'How to design medical and technical Android catalogs capable of querying 14,000+ records completely offline using SQLite FTS4, Coroutines, and Jetpack Compose.',
      content: `## Why offline reliability is a non-negotiable requirement

In clinical wards, rural clinics, and field inspections across Latin America, assuming uninterrupted 4G coverage creates brittle mobile products. When a physician checks an ICD-10 diagnostic code during a night shift or an agronomist inspects technical reference notes outdoors, blocking UI flows behind loading spinners renders the application unusable.

An **Offline-First** architecture reverses that dependency: the local SQLite database orchestrated via **Room** serves as the single source of truth for **Jetpack Compose** screens. Network requests remain strictly background-optional for telemetry or deferred catalog updates rather than blocking day-to-day workflows.

## Why \`LIKE '%term%'\` causes dropped frames during typing

Naive queries using leading wildcards prevent SQLite B-Tree indexes from kicking in, forcing full sequential table scans on every keystroke. Across **14,000+ clinical entries** containing notes, inclusion rules, and synonyms, each keystroke easily takes 90 to 240 milliseconds on entry-level devices with slower eMMC flash storage—producing visible scroll and typing jank.

SQLite natively solves this with **Full-Text Search (FTS4)**. Declaring an \`@Fts4(contentEntity = ...)\` virtual entity in Room builds a synchronized inverted prefix and token index without duplicating bulky text payloads across disk pages.

## Reactive Flow pipelines, accent folding, and query sanitization

Spanish and Portuguese users rarely type diacritics on mobile keyboards during hurried lookups (\`hipertension\` instead of \`Hipertensión\`). Folding both indexed fields and incoming search queries into normalized ASCII via \`Normalizer.Form.NFD\` lets FTS4 prefix expressions (\`token*\`) match accurately across accents.

Inside the \`ViewModel\`, combining \`debounce(75)\`, \`distinctUntilChanged()\`, \`flatMapLatest\`, and \`flowOn(Dispatchers.IO)\` ensures stale queries are cancelled immediately when a user keeps typing, keeping the main UI thread completely clear. Stripping FTS4 syntax operators such as hyphens, quotes, or colons prior to constructing the \`MATCH\` argument also eliminates \`SQLiteException\` crashes on medical codes like \`E11-9\`.

## Pre-populated assets and dual-database separation

Compiling, vacuuming, and packing a ready-to-query \`.db\` inside \`assets/databases/\` via \`.createFromAsset(...)\` skips heavy first-launch JSON parsing and keeps cold startup under **450 ms**. Storing read-only clinical tables in a separate Room instance from user-owned bookmarks and history ensures future catalog updates never risk losing saved user state.`
    }
  },
  {
    slug: 'optimizar-core-web-vitals-nextjs-app-router',
    publishedAt: '2026-10-20',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 9,
    tags: ['Next.js', 'Core Web Vitals', 'Performance', 'Lighthouse', 'Caddy'],
    relatedProjectSlug: 'chamba-pro',
    relatedProjectName: 'Chamba.pe — Empleos y Convocatorias',
    es: {
      title: 'Optimización Real de Core Web Vitals en Next.js App Router: De 80 a 95+ en Lighthouse',
      category: 'Arquitectura Web',
      excerpt:
        'Guía de diagnóstico basada en producción: cómo eliminar imágenes base64 del HTML SSR, diferir scripts de terceros, optimizar fuentes con next/font y reducir el TTFB detrás de Caddy.',
      content: `## Por qué la velocidad real define SEO, retención y monetización

Un puntaje de PageSpeed Insights estancado en 80 puntos en escritorio o 65 en móvil casi nunca responde a un único fallo evidente. Suele ser la acumulación silenciosa de pequeñas decisiones tomadas por conveniencia: capturas guardadas como cadenas Base64 dentro de la base de datos, fuentes web solicitadas mediante hojas externas bloqueantes y scripts de terceros ejecutándose al mismo tiempo que React hidrata el árbol DOM.

Durante la auditoría técnica continua del ecosistema **atpdev.dev** y **chamba.atpdev.dev**, atacamos sistemáticamente los cuatro indicadores que determinan la experiencia percibida y la salud técnica ante Google: **TTFB (Time to First Byte)**, **FCP (First Contentful Paint)**, **LCP (Largest Contentful Paint)** y **CLS (Cumulative Layout Shift)**.

## 1. Erradicar payloads Base64 ocultos en el HTML y RSC

Uno de los errores más costosos cuando se combina Next.js App Router con editores ricos o campos Markdown en PostgreSQL consiste en almacenar imágenes en formato \`data:image/webp;base64,...\` dentro del contenido de proyectos o artículos.

Cada vez que el servidor renderiza la ruta, esa imagen codificada viaja duplicada: primero dentro del HTML inicial renderizado y por segunda vez dentro del payload de hidratación de **React Server Components** (\`self.__next_f.push\`). En un caso real observado en producción, apenas cuatro capturas incrustadas inflaron una ficha técnica a **más de 2 MB de HTML**, disparando la latencia de descarga y congelando el hilo principal durante el parseo.

La arquitectura correcta exige:
- Extraer toda imagen embebida hacia almacenamiento de objetos con CDN (Supabase Storage o S3) en formato \`.webp\` optimizado.
- Referenciar únicamente la URL pública con dimensiones explícitas (\`width\`, \`height\`) para reservar el espacio geométrico antes de que decodifique la imagen, manteniendo el **CLS por debajo de 0.01**.
- Aplicar compresión y tamaño máximo acorde al ancho real del contenedor editorial (\`max-w-4xl\`).

## 2. Romper cadenas de bloqueo en Google Fonts con \`next/font\`

El árbol de dependencias de red de Lighthouse suele señalar peticiones críticas a \`fonts.googleapis.com\` seguidas de \`fonts.gstatic.com\`. Incluso cuando se añaden etiquetas \`<link rel="preconnect">\`, solicitar la hoja CSS externa obliga al navegador a completar ida y vuelta de red para descubrir recién los archivos \`.woff2\`, retrasando el primer pintado útil en 150 a 300 milisegundos.

Sustituir la hoja externa por \`next/font/google\` dentro de \`app/layout.tsx\` aporta tres beneficios inmediatos:

1. **Descarga en build:** Next.js empaqueta las fuentes en \`_next/static/media/\` y las sirve desde tu propio dominio por la misma conexión HTTP/2 o HTTP/3 ya abierta.
2. **Cero cascada de red:** el navegador conoce la URL final desde el CSS en línea o chunk local inicial.
3. **Ajuste métrico automático (\`size-adjust\`):** genera métricas de fuente alternativa equivalentes para que los títulos del hero no salten ni provoquen CLS al intercambiarse la tipografía.

## 3. Diferir analítica, Clarity y etiquetas publicitarias correctamente

Cargar analítica, mapas de calor o librerías de anuncios con prioridad síncrona compite directamente por tiempo de CPU contra la hidratación de componentes interactivos. En Next.js, utilizar \`next/script\` con \`strategy="afterInteractive"\` o \`lazyOnload\` garantiza que el contenido principal sea visible e interactivo primero, manteniendo el **Total Blocking Time (TBT)** cercano a cero.

Adicionalmente, separar mediante ruta dónde se inyectan scripts publicitarias —evitando cargar scripts de monetización en vistas estrictamente legales (\`/privacy\`, \`/terms\`) o en páginas de error— reduce bytes innecesarios y mantiene total coherencia con las políticas de calidad editorial.

## 4. Reducir la latencia de respuesta del servidor (TTFB)

Cuando Lighthouse advierte *"El servidor ha respondido lentamente"*, rara vez el problema está en el navegador del cliente:

- **Evita \`force-dynamic\` salvo estricta necesidad:** las rutas de portafolio, artículos técnicos y fichas detalladas funcionan mucho mejor con **ISR (\`export const revalidate = 3600\`)**, sirviendo HTML pregenerado desde memoria/disco en menos de 25 ms.
- **No ejecutes llamadas externas secuenciales por cada visitante:** si tu aplicación traduce contenido dinámico en tiempo real llamando a APIs remotas en el Server Component, cachea en memoria/disco o precomputa los idiomas principales (\`es\`, \`en\`) estáticamente para evitar latencias acumuladas de 600–900 ms.
- **Proxy inverso limpio y compresión Zstd/Gzip en Caddy:** configura el dominio raíz con una redirección **301 directa de un solo salto** hacia el host canónico (\`https://www.atpdev.dev\`) y habilita \`encode zstd gzip\` junto con cabeceras \`Cache-Control: public, max-age=31536000, immutable\` para todos los assets inmutables de \`/_next/static/\`.

## Verificación repetible tras cada despliegue

Antes de dar por cerrada una optimización, valida siempre desde consola y con PageSpeed Insights:
- Inspecciona con \`curl -sIL\` que no existan dobles redirecciones.
- Confirma que el peso comprimido del HTML inicial no supere 40–60 KB.
- Revisa en mobile throttled que **LCP** esté bajo 2.5 s, **CLS** por debajo de 0.05 y no aparezcan alertas de recursos bloqueantes externos.`
    },
    en: {
      title: 'Production Core Web Vitals Optimization in Next.js App Router: Moving from 80 to 95+ in Lighthouse',
      category: 'Web Architecture',
      excerpt:
        'A field-tested checklist: eliminating inline base64 payloads from SSR HTML, self-hosting fonts with next/font, deferring third-party scripts, and cutting TTFB behind Caddy.',
      content: `## Why measurable speed defines SEO, retention, and ad readiness

A Lighthouse performance score stuck around 80 rarely comes from a single dramatic failure. More often it stems from accumulated everyday shortcuts: screenshots serialized as Base64 data URIs inside PostgreSQL Markdown columns, render-blocking external CSS requests to Google Fonts, and third-party scripts fighting React hydration for main-thread CPU time.

During systematic audits of **atpdev.dev** and **chamba.atpdev.dev**, fixing four structural causes drove major gains across **TTFB**, **FCP**, **LCP**, and **CLS**:

## 1. Remove hidden Base64 payloads from SSR and RSC flight data

When rich text fields embed \`data:image/webp;base64,...\` directly inside article bodies, Next.js App Router ships the entire image string twice—once inside rendered HTML and again inside React Server Component payloads (\`self.__next_f\`). Migrating those inline images to CDN object storage as optimized \`.webp\` files with explicit width and height attributes dropped page weight from multi-megabyte HTML down to lightweight markup and stabilized CLS near zero.

## 2. Eliminate external font waterfalls with \`next/font\`

Manual \`fonts.googleapis.com\` stylesheets block initial rendering while the browser discovers downstream \`.woff2\` files. Switching to \`next/font/google\` downloads font files at build time, serves them from the primary HTTP/2 origin, and generates automatic \`size-adjust\` fallback metrics to keep typography crisp without layout shifts.

## 3. Defer analytics and ad tags off the critical path

Using \`next/script\` with \`strategy="afterInteractive"\` and restricting ad script injection away from legal or thin utility routes protects hydration speed and keeps **Total Blocking Time (TBT)** consistently low.

## 4. Cut TTFB with ISR, parallel fetches, and Caddy Zstd compression

Replacing unnecessary \`force-dynamic\` flags with Incremental Static Regeneration (\`revalidate\`), running database calls via \`Promise.allSettled\`, enforcing a single-hop 301 canonical redirect, and enabling \`encode zstd gzip\` in Caddy allows pages to respond rapidly even under throttled mobile emulation.`
    }
  },
  {
    slug: 'edge-ai-android-tensorflow-lite-grad-cam',
    publishedAt: '2026-10-25',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 10,
    tags: ['Edge AI', 'TensorFlow Lite', 'Android', 'CameraX', 'Grad-CAM'],
    relatedProjectSlug: 'paltoscan-ia-agricola-offline',
    relatedProjectName: 'PaltoScan IA Agrícola Offline',
    es: {
      title: 'Inteligencia Artificial en el Borde (Edge AI) con TensorFlow Lite y Explicabilidad Grad-CAM en Android',
      category: 'Inteligencia Artificial',
      excerpt:
        'Cómo ejecutar modelos CNN de visión computacional directamente en el teléfono sin internet, optimizar latencia con cuantización INT8 y renderizar mapas de calor Grad-CAM comprensibles en campo.',
      content: `## Por qué la visión por computadora en agricultura exige Edge AI real

Enviar fotografías de alta resolución a una API en la nube para detectar deficiencias nutricionales o plagas foliares funciona bien en el laboratorio universitario o sobre Wi-Fi de oficina, pero se rompe por completo en la realidad del campo agrícola andino. En zonas productoras de palto (*Persea americana*) en Apurímac y valles interandinos del Perú, muchas parcelas carecen de cobertura de datos móviles estable, y subir decenas de capturas por lote resultaría lento, costoso e impracticable.

La arquitectura **Edge AI** traslada la inferencia neuronal directamente al procesador del dispositivo Android mediante **TensorFlow Lite (LiteRT)**. De ese modo, el análisis tarda entre **45 y 120 milisegundos** de forma completamente local, no genera costos recurrentes por llamada en servidor y protege la privacidad de los registros agrícolas del productor.

## Pipeline técnico: de CameraX al tensor de entrada sin pérdida de precisión

En despliegues reales, la mayoría de las caídas de precisión entre el entrenamiento en Python (PyTorch o TensorFlow/Keras) y la aplicación Android no provienen de los pesos de la red, sino de discrepancias sutiles en el preprocesamiento de la imagen:

1. **Captura estable con CameraX:** configuramos \`ImageAnalysis\` con resolución objetivo moderada (\`640x480\` o \`1280x720\`) y \`BackpressureStrategy.STRATEGY_KEEP_ONLY_LATEST\` para evitar colas de fotogramas y presión innecesaria de memoria.
2. **Conversión cromática y rotación EXIF:** las cámaras entregan buffers \`YUV_420_888\` cuya orientación física viene reportada en \`imageProxy.imageInfo.rotationDegrees\`. Aplicar la rotación antes del recorte central cuadrado y transformar estrictamente al espacio **RGB** (nunca BGR) es vital para no destruir la discriminación cromática entre clorosis férrica, deficiencia de nitrógeno y tejido sano.
3. **Normalización idéntica al entrenamiento:** si la red convolucional (como MobileNetV3 o EfficientNet-Lite) entrenó escalando píxeles al rango \`[-1, 1]\` o \`[0, 1]\` con media/desviación de ImageNet, exactamente la misma operación debe ejecutarse al llenar el \`ByteBuffer\` directo en Kotlin.

~~~kotlin
val inputBuffer = ByteBuffer.allocateDirect(4 * inputSize * inputSize * 3)
    .order(ByteOrder.nativeOrder())

for (pixel in pixels) {
    val r = ((pixel shr 16 and 0xFF) / 127.5f) - 1.0f
    val g = ((pixel shr 8 and 0xFF) / 127.5f) - 1.0f
    val b = ((pixel and 0xFF) / 127.5f) - 1.0f
    inputBuffer.putFloat(r)
    inputBuffer.putFloat(g)
    inputBuffer.putFloat(b)
}
~~~

## Cuantización Post-Entrenamiento y delegados de hardware

Un modelo en punto flotante \`FP32\` suele ocupar entre 15 MB y 45 MB en APK y consumir batería aceleradamente durante recorridos largos en campo. Aplicar **Full Integer Quantization (INT8)** calibrada con un subconjunto representativo de fotografías reales tomadas bajo luz solar natural y sombra parcial reduce el peso del modelo \`.tflite\` alrededor de un **75 %** conservando más del 95 % de la exactitud original.

En tiempo de ejecución en Android conviene activar **XNNPACK** para CPU multinúcleo como camino predeterminado altamente estable, reservando el **GPU Delegate** o **NNAPI** únicamente tras validar estabilidad térmica y compatibilidad en los chipsets objetivo.

## Explicabilidad visual con Grad-CAM: construyendo confianza técnica

Mostrar en pantalla únicamente un texto como *"Deficiencia probable: Magnesio — 89 %"* suele generar escepticismo legítimo en ingenieros agrónomos y productores experimentados. Un modelo mal regularizado puede aprender atajos visuales espurios, como el color de la tierra al fondo o el tono del cielo en días nublados, en lugar de observar las nervaduras y necrosis de la hoja.

Para auditar cada diagnóstico en tiempo real incorporamos **Grad-CAM (Gradient-weighted Class Activation Mapping)** optimizado para inferencia móvil:

- Durante la exportación del modelo se expone un segundo tensor de salida con los mapas de activación espaciales de la última capa convolucional (por ejemplo \`7 × 7 × C\`) junto al vector de clasificación y los pesos de la capa densa final.
- En Kotlin calculamos la combinación lineal ponderada para la clase ganadora, aplicamos \`ReLU\` (\`max(0f, valor)\`), normalizamos al rango \`[0, 1]\`, reescalamos suavemente mediante interpolación bilineal al tamaño del recuadre analizado y dibujamos una paleta de calor semitransparente sobre la captura.

Cuando el mapa ilumina con claridad el halo amarillento o las manchas foliares necróticas, el usuario técnico confirma visualmente que la red analizó el síntoma agronómico correcto.

## Controles de calidad obligatorios en campo

1. **Detección previa de desenfoque:** evaluar la varianza del filtro Laplaciano antes de inferir evita emitir diagnósticos falsos sobre tomas movidas por el viento.
2. **Umbral de abstención calibrado:** si la probabilidad softmax máxima cae debajo de un umbral validado (por ejemplo \`0.65\`), la app solicita reencuadrar la hoja con iluminación difusa en lugar de forzar una etiqueta poco confiable.
3. **Auditoría de trazabilidad:** cada evaluación guardada localmente en SQLite registra versión del modelo, nivel de confianza y timestamp GPS opcional para seguimiento histórico del cultivo.`
    },
    en: {
      title: 'Edge AI on Android with TensorFlow Lite and Grad-CAM Visual Explainability',
      category: 'Artificial Intelligence',
      excerpt:
        'Running offline computer-vision CNNs directly on mobile devices using CameraX, INT8 quantization, and Grad-CAM activation overlays for field reliability.',
      content: `## Why agricultural vision cannot rely on cloud-only inference

Cloud vision APIs look effortless on office Wi-Fi, yet break down immediately in remote orchard valleys across Apurimac and the Peruvian Andes lacking consistent cellular coverage. Shifting neural inference onto the handset with **TensorFlow Lite (LiteRT)** completes diagnosis locally in **45 to 120 milliseconds**, eliminates per-call backend fees, and protects farm data privacy.

## Preventing preprocessing drift between Python and Kotlin

Most real-world accuracy drops in mobile computer vision happen before the neural network even runs: reversed BGR/RGB channels, ignored EXIF rotation metadata on CameraX \`YUV_420_888\` buffers, or scaling pixel intensities differently from training normalization. Aligning exact crop dimensions, rotation compensation, and float scaling in Kotlin keeps field metrics faithful to validation benchmarks.

## INT8 quantization, delegates, and Grad-CAM overlays

Applying representative **INT8 post-training quantization** cuts \`.tflite\` size by roughly **75%** while keeping classification performance intact. Pairing **XNNPACK** multi-threaded CPU execution with selective GPU delegation prevents thermal throttling on mid-range handsets.

To earn genuine trust from agronomists, exporting the final convolutional activation feature map alongside class weights lets Kotlin synthesize a real-time **Grad-CAM** heatmap overlay. By visibly highlighting leaf chlorosis or necrotic lesions instead of soil background clutter, users confirm that model predictions rest on sound visual evidence.`
    }
  },
  {
    slug: 'procesar-pdf-navegador-webassembly-privacidad',
    publishedAt: '2026-10-29',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 9,
    tags: ['WebAssembly', 'PDF', 'Privacidad', 'TypeScript', 'Next.js'],
    relatedProjectSlug: 'masteratpdf-pro',
    relatedProjectName: 'MasterATPDF Suite',
    es: {
      title: 'Manipulación de Documentos PDF 100% Client-Side con WebAssembly y Zero-Upload Privacy',
      category: 'Ingeniería Frontend',
      excerpt:
        'Cómo unir, dividir, reordenar páginas y comprimir archivos PDF confidenciales directamente en la memoria del navegador sin enviar documentos a servidores remotos.',
      content: `## El riesgo oculto de las utilidades gratuitas de PDF basadas en servidor

Contratos laborales, historias clínicas, expedientes judiciales, boletas de pago, actas notariales y tesis universitarias contienen información personal y corporativa altamente sensible. Pese a ello, la mayoría de los convertidores web tradicionales obliga al usuario a cargar el documento íntegro hacia servidores remotos para ejecutar operaciones simples como unir dos archivos, girar una página escaneada de cabeza o extraer un rango específico de hojas.

Ese modelo clásico presenta dos desventajas críticas: expone documentos privados a almacenamiento temporal o logs en terceros y dispara los costos operativos de infraestructura del desarrollador (ancho de banda bidireccional, almacenamiento cifrado temporal, limpieza programada y trabajadores pesados ejecutando \`Ghostscript\` o \`qpdf\` en backend).

La alternativa moderna consiste en trasladar todo el flujo binario al navegador del usuario mediante **JavaScript moderno, Web Workers y WebAssembly**, construyendo herramientas con garantía demostrable de **Zero-Upload**: al inspeccionar la pestaña *Network* de DevTools no existe ni una sola petición saliente que transporte bytes del documento.

## Arquitectura dual con \`pdfjs-dist\` y \`pdf-lib\`

Para combinar previsualización visual instantánea con ensamblaje binario fiel al estándar ISO 32000 del formato PDF, dividimos la responsabilidad entre dos motores complementarios ejecutados íntegramente en cliente:

1. **\`pdfjs-dist\` para renderizado visual seguro:** decodifica cada hoja seleccionada y la dibuja sobre elementos \`<canvas>\` optimizados con *Device Pixel Ratio*, permitiendo al usuario previsualizar miniaturas nítidas, verificar orientaciones reales y reordenar arrastrando tarjetas en la interfaz.
2. **\`pdf-lib\` para manipulación estructural sin pérdida:** lee los bytes originales (\`ArrayBuffer\`), clona selectivamente páginas mediante \`copyPages\`, conserva fuentes vectoriales e hipervínculos internos intactos, aplica rotaciones múltiples de 90 grados, limpia metadatos personales si el usuario lo desea y serializa un archivo PDF válido en memoria local.

~~~ts
import { PDFDocument, degrees } from 'pdf-lib';

export interface PageOperation {
  bytes: ArrayBuffer;
  pageIndexes: number[];
  rotateDelta?: number;
}

export async function buildMergedPdf(operations: PageOperation[]): Promise<Uint8Array> {
  const output = await PDFDocument.create();

  for (const op of operations) {
    const source = await PDFDocument.load(op.bytes, { ignoreEncryption: false });
    const copied = await output.copyPages(source, op.pageIndexes);

    for (const page of copied) {
      if (op.rotateDelta) {
        const nextAngle = (page.getRotation().angle + op.rotateDelta) % 360;
        page.setRotation(degrees(nextAngle));
      }
      output.addPage(page);
    }
  }

  return output.save({ useObjectStreams: true });
}
~~~

## Manejo de archivos cifrados, fuentes incrustadas y errores reales

En producción real con usuarios de oficina, los PDFs rara vez llegan tan limpios como los archivos de prueba:

- **PDFs protegidos con contraseña de propietario:** muchos documentos administrativos restringen edición manteniendo lectura abierta. Detectar el error de cifrado de forma amigable permite informar exactamente al usuario qué archivo requiere desbloqueo previo sin romper toda la cola de trabajo.
- **Compresión selectiva sin destruir texto vectorial:** cuando un usuario solicita reducir tamaño de un expediente escaneado, recomprimir el documento entero como imágenes planas destruiría la capacidad de seleccionar texto y haría borrosas las letras pequeñas. La estrategia correcta inspecciona los flujos rasterizados de gran tamaño, reduce su resolución excedente a 150 DPI legibles y deja intactos los objetos de texto vectorial.
- **Validación de índices de página:** al dividir por rangos (\`1-5, 8, 12-15\`), un parser tolerante a espacios y rangos invertidos previene excepciones fuera de límites cuando el documento tiene menos páginas de las escritas.

## Control estricto de memoria y Web Workers en documentos grandes

Manipular PDFs de 40 o 100 MB dentro de navegadores móviles con poca RAM exige disciplina explícita de memoria para evitar cierres repentinos de pestaña:

- **Renderizado perezoso (*Lazy Viewport Rendering*):** si el usuario abre un expediente de 250 páginas, nunca decodificamos 250 lienzos simultáneamente; un \`IntersectionObserver\` renderiza bajo demanda únicamente las vistas previas cercanas al viewport visible y limpia cachés fuera de rango.
- **Transferencia *Zero-Copy* hacia Web Workers:** al delegar compresión o ensamblaje pesado a un Worker en segundo plano para no congelar animaciones CSS ni el scroll, pasamos el \`ArrayBuffer\` en la lista de objetos transferibles (\`worker.postMessage({ buffer }, [buffer])\`), moviendo la referencia sin clonar decenas de megabytes.
- **Revocación inmediata de \`Blob URL\`:** cada enlace temporal creado mediante \`URL.createObjectURL\` para descargar el PDF final debe liberarse con \`URL.revokeObjectURL\` en cuanto se dispara la descarga o se limpia la bandeja de archivos.

## Ventajas técnicas de escalado y cumplimiento

Una suite diseñada con procesamiento local escala horizontalmente hasta el infinito: mil usuarios procesando contratos al mismo tiempo consumen únicamente los recursos estáticos servidos desde caché global, manteniendo costos de CPU en servidor prácticamente en cero y garantizando privacidad absoluta para entornos educativos, legales y corporativos.`
    },
    en: {
      title: '100% Client-Side PDF Processing with WebAssembly and Zero-Upload Privacy',
      category: 'Frontend Engineering',
      excerpt:
        'How to merge, split, rotate, and reorder confidential PDF files directly inside browser memory without ever uploading user documents to a remote backend.',
      content: `## Removing remote server exposure from everyday PDF workflows

Contracts, medical records, payroll slips, and academic submissions routinely carry private information. Traditional web converters upload entire files to remote servers just to extract three pages or fix an upside-down scan, exposing sensitive documents while requiring costly backend compute clusters running \`Ghostscript\` or \`qpdf\`.

A **Zero-Upload** browser architecture delegates everything directly into local RAM via **Web Workers**, **pdfjs-dist**, and **pdf-lib**—verifiable right in browser DevTools showing zero outbound document bytes.

## Splitting visual preview and lossless binary assembly

1. **\`pdfjs-dist\` for crisp thumbnails:** Rendering pages onto HiDPI \`<canvas>\` nodes allows smooth drag-and-drop reordering and rotation checks.
2. **\`pdf-lib\` for ISO-compliant output:** Copying selected pages across \`PDFDocument\` instances preserves searchable vector text, internal links, and crisp typography cleanly without rasterizing every page.

## Memory hygiene on constrained mobile browsers

Handling 50+ MB files safely inside browser tabs requires **lazy rendering** via \`IntersectionObserver\` on long documents, **zero-copy transferable \`ArrayBuffer\`** handoffs into Web Workers, graceful password-encryption checks, and immediate \`URL.revokeObjectURL\` cleanup after download triggers.`
    }
  },
  {
    slug: 'correccion-homografica-documentos-canvas-android',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 8,
    tags: ['Visión Computacional', 'Canvas', 'TypeScript', 'Homografía', 'PDF'],
    relatedProjectSlug: 'dni-scanner-pro',
    relatedProjectName: 'DNI & Document Scanner Pro',
    es: {
      title: 'Digitalización Documental en el Navegador: Corrección de Perspectiva Homográfica y Exportación A4',
      category: 'Visión y Gráficos Web',
      excerpt:
        'Fundamento matemático y práctico para transformar fotografías inclinadas de documentos o carnés en rectángulos ortogonales listos para impresión en formato A4.',
      content: `## El desafío de fotografiar documentos físicos sin escáner plano

En trámites administrativos cotidianos en Perú y América Latina —desde postulaciones laborales CAS hasta matrículas universitarias y trámites bancarios— los usuarios suelen fotografiar su Documento Nacional de Identidad (DNI), recibos de servicios o constancias desde la cámara de su teléfono móvil. Como resulta casi imposible sostener el teléfono completamente paralelo al papel y evitar sombras o perspectivas inclinadas, la fotografía resultante luce trapezoidal y rodeada de fondo de mesa.

Para transformar esa fotografía oblicua en una copia nítida equivalente a un escáner plano profesional, necesitamos aplicar una **transformación homográfica proyectiva** que mapee cuatro esquinas marcadas sobre la imagen hacia un rectángulo destino ortogonal de proporciones exactas (por ejemplo, el estándar internacional **ISO/IEC 7810 ID-1** de \`85.60 × 53.98 mm\`).

## Resolución de la matriz de homografía 3×3 en TypeScript puro

Muchos ejemplos en la web sugieren importar el paquete completo de \`OpenCV.js\` (varios megabytes de JavaScript y WebAssembly) exclusivamente para llamar a \`getPerspectiveTransform\`. Para una herramienta web enfocada en rapidez instantánea en conexiones móviles y Core Web Vitals sobresalientes, descargar varios megabytes de WASM penaliza gravemente el *First Load JS* y el *Time to Interactive*.

La alternativa elegante consiste en resolver directamente en **TypeScript puro** el sistema lineal de **8 incógnitas** que define la transformación proyectiva \\(H\\) de 3×3 mediante eliminación gaussiana con pivoteo parcial:

1. Cada par de esquinas entre imagen origen y lienzo rectificado \\((x_i, y_i) \\leftrightarrow (u_i, v_i)\\) aporta dos ecuaciones lineales respecto a los coeficientes \\(h_1 \\dots h_8\\) fijando la escala proyectiva en \\(h_9 = 1\\).
2. Construir y resolver esa matriz de \\(8 \\times 8\\) toma menos de **0.2 milisegundos** en cualquier dispositivo moderno sin librerías externas.
3. Aplicamos **mapeo inverso (*Inverse Warping*)** en lugar de proyección directa: calculamos la inversa \\(H^{-1}\\) para recorrer ordenadamente cada píxel entero \\((u, v)\\) del rectángulo destino y consultar la coordenada continua correspondiente en la fotografía original, evitando por completo huecos negros debidos al redondeo discreto.

## Interpolación bilineal y realce legible de texto fino

Cuando la coordenada proyectada en la foto original cae entre cuatro píxeles vecinos, usar el vecino más cercano (*nearest-neighbor*) produce bordes dentados que deterioran dígitos pequeños o códigos de barra. En su lugar, implementar **interpolación bilineal** ponderando los cuatro píxeles adyacentes mantiene trazos continuos y firmas completamente legibles.

Una vez poblado el \`ImageData\` rectificado dentro de un \`<canvas>\` fuera de pantalla (*offscreen*), aplicamos mejoras rápidas opcionales por canal de luminancia:

- **Color original equilibrado:** ideal para trámites que exigen conservar el color azul del DNI, fotografías biométricas o sellos húmedos de color.
- **Escala de grises de alto contraste:** normaliza el rango dinámico mediante estiramiento de histograma para reducir el sombreado de luz artificial irregular.
- **Modo documento limpio:** aplica ajuste local de umbral y contraste para boletas impresas o recibos térmicos con tinta pálida sin engrosar artificialmente las letras.

## Escala milimétrica A4 exacta con \`jsPDF\` y privacidad garantizada

Un fallo clásico en escáneres improvisados consiste en exportar la imagen rectificada dentro de un PDF de dimensiones arbitrarias en píxeles, provocando que al enviar el archivo a imprimir salga recortado o ampliado fuera de escala. Usando **jsPDF**, creamos un pliego estándar **A4 (\`210 × 297 mm\`)**, colocamos el anverso y el reverso centrados con márgenes simétricos y respetamos proporciones físicas reales para facilitar lectura inmediata en pantalla o impresión directa.

## Control de errores, orientación EXIF y rendimiento móvil

En dispositivos reales, fotografías verticales capturadas desde celulares modernos incorporan orientación en metadatos EXIF en lugar de rotar físicamente los píxeles JPEG. Cargar la imagen mediante \`createImageBitmap(file, { imageOrientation: 'from-image' })\` asegura que la orientación visible en el canvas coincida exactamente con la vista previa del usuario antes de arrastrar las cuatro esquinas. Limitando adicionalmente el lado mayor de trabajo a 2,200 píxeles antes de calcular la homografía garantizamos memoria controlada sin perder nitidez impresa.

Al ejecutarse íntegramente mediante \`Canvas 2D\` en memoria del navegador, ni una sola imagen del documento de identidad abandona el dispositivo del usuario: la privacidad documental y biométrica es total desde el primer segundo.`
    },
    en: {
      title: 'In-Browser Document Scanning: Homography Perspective Rectification and A4 Export',
      category: 'Computer Vision & Web Canvas',
      excerpt:
        'Turning tilted mobile camera snapshots of IDs or receipts into crisp rectangular scans mapped to exact A4 printable layouts using pure TypeScript.',
      content: `## Rectifying camera perspective without heavy OpenCV bundles

Importing full WebAssembly builds of OpenCV solely to dewarp a snapshot hurts initial load budgets and Core Web Vitals on mobile networks. Solving the 8-degree-of-freedom projective homography system directly via Gaussian elimination with partial pivoting in pure TypeScript takes less than 0.2 milliseconds with zero runtime weight.

## Inverse warping, bilinear sampling, and tonal enhancement

Forward pixel mapping leaves missing pixel holes whenever decimal destination positions round unevenly. Using **inverse warping** to loop smoothly over every integer destination coordinate and reading continuous source coordinates via **bilinear interpolation** preserves sharp barcode bars, fine microprint, and clean signatures.

From the resulting \`ImageData\` canvas buffer, lightweight luminance normalization fixes uneven desk shadows while preserving stamp colors when needed. Exporting centered front-and-back scans onto calibrated **210 × 297 mm A4 pages** using \`jsPDF\` produces print-ready PDFs completely client-side with zero image uploads.`
    }
  },
  {
    slug: 'sorteos-verificables-web-crypto-api-javascript',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 8,
    tags: ['Seguridad', 'Web Crypto API', 'JavaScript', 'Estadística'],
    relatedProjectSlug: 'sorteos-pro',
    relatedProjectName: 'Sorteos Pro Verificables',
    es: {
      title: 'Por qué Math.random() no sirve para sorteos justos y cómo implementar Fisher-Yates con Web Crypto API',
      category: 'Seguridad y Algoritmos',
      excerpt:
        'Análisis técnico sobre sesgo módulo, entropía criptográfica con crypto.getRandomValues y generación de actas con huella digital verificable en el navegador.',
      content: `## Dos fallos clásicos ocultos tras sorteos aparentemente aleatorios

Al implementar ruletas, asignación aleatoria de equipos de trabajo o sorteos comunitarios en JavaScript, existe una tentación muy extendida en tutoriales rápidos: escribir \`array.sort(() => Math.random() - 0.5)\`. Aunque a primera vista parece mezclar los nombres durante una prueba informal, esa técnica combina dos defectos matemáticos documentados desde hace años:

1. **Generador no diseñado para equidad auditable:** \`Math.random()\` está optimizado para velocidad en videojuegos y simulaciones visuales (basado típicamente en variantes de \`xorshift128+\`), careciendo de garantías criptográficas de impredecibilidad frente a análisis de estado interno.
2. **Distribución fuertemente sesgada al usar \`sort()\`:** la especificación del método \`Array.prototype.sort\` exige que la función comparadora establezca un orden total consistente y transitivo. Al responder valores positivos o negativos al azar durante comparaciones sucesivas dentro de algoritmos como TimSort, ciertos participantes conservan probabilidades estadísticas reales muy distintas respecto a quedar elegidos en primer o último lugar.

## Implementación matemáticamente uniforme: Fisher-Yates + Rejection Sampling

Para garantizar rigor estadístico real —donde cada participante en una lista de \\(N\\) elementos tenga exactamente probabilidad \\(1 / N\\) de ocupar cualquier posición— se deben unir dos mecanismos complementarios:

- El algoritmo **Fisher-Yates (Knuth Shuffle)** recorriendo una copia del arreglo desde el último índice hacia el primero.
- Enteros aleatorios provenientes de **Web Crypto API** (\`window.crypto.getRandomValues\`) protegidos explícitamente contra **sesgo módulo** (*modulo bias*).

¿En qué consiste el sesgo módulo? Un entero de 32 bits sin signo (\`Uint32Array\`) produce valores uniformes entre \`0\` y \\(2^{32} - 1 = 4,294,967,295\\). Si tomamos ese valor y aplicamos directamente \`randomInt % N\` cuando \\(N\\) no divide exactamente a \\(2^{32}\\), los primeros residuos aparecen con una frecuencia ligeramente superior al resto. El patrón criptográfico estándar aplica *rejection sampling*, descartando los números dentro del bloque residual incompleto:

~~~ts
function secureRandomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error('maxExclusive debe ser un entero positivo');
  }
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  const buffer = new Uint32Array(1);

  while (true) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) {
      return buffer[0] % maxExclusive;
    }
  }
}

export function fairShuffle<T>(entries: readonly T[]): T[] {
  const copy = [...entries];
  for (let i = copy.length - 1; i > 0; i--) {
    const swapIndex = secureRandomInt(i + 1);
    [copy[i], copy[swapIndex]] = [copy[swapIndex], copy[i]];
  }
  return copy;
}
~~~

## Limpieza de datos de entrada y transparencia con huella SHA-256

En escenarios reales —como listas copiadas desde WhatsApp, hojas de cálculo o formularios web— los usuarios suelen pegar líneas vacías, espacios invisibles al final o nombres duplicados por error. Sanitizar previamente con deduplicación explícita y mostrar el conteo exacto de participantes válidos antes de ejecutar evita impugnaciones innecesarias.

Para auditoría en vivo en transmisiones, sorteos escolares o comités internos, la aplicación genera además una **acta descargable** con:
- Cantidad total de participantes válidos ingresados y cantidad de ganadores principales y suplentes seleccionados.
- Marca temporal exacta en UTC e identificador único de ejecución generado localmente.
- Resumen criptográfico **SHA-256** calculado con \`crypto.subtle.digest\` sobre la lista canonizada antes de mezclar.

Con ello, cualquier participante puede validar la integridad de entrada sin depender de un servidor central ni compartir datos personales hacia terceros.`
    },
    en: {
      title: 'Why Math.random() Fails Fair Draws and How to Build Bias-Free Shuffles with Web Crypto API',
      category: 'Security & Algorithms',
      excerpt:
        'Avoiding modulo bias and V8 comparator distortion using Fisher-Yates shuffling paired with crypto.getRandomValues and SHA-256 audit hashes.',
      content: `## Two subtle flaws hidden inside naive JavaScript giveaways

Reaching for \`array.sort(() => Math.random() - 0.5)\` remains one of the most widespread bugs in casual giveaway widgets. Sorting algorithms depend on strict weak ordering; returning erratic comparator signs breaks transitivity inside TimSort and introduces measurable positional bias across participant lists, while \`Math.random()\` optimizes simulation speed over cryptographic entropy.

## Uniformity with Fisher-Yates, Web Crypto API, and rejection sampling

Achieving true mathematical uniformity (\`1 / N\` odds per candidate) requires **Fisher-Yates shuffling** paired with \`window.crypto.getRandomValues(new Uint32Array(1))\`. To avoid **modulo bias** whenever \`2^32\` is not evenly divisible by the candidate range, rejection sampling discards values above the highest exact multiple before computing the remainder.

Clean input deduplication, configurable alternate winners, and a client-computed **SHA-256** integrity digest via \`crypto.subtle.digest\` give organizers transparent proof of input integrity without storing participant names on any remote server.`
    }
  },
  {
    slug: 'escaneo-qr-seguro-camerax-android-hilt',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 8,
    tags: ['Android', 'CameraX', 'Seguridad', 'Hilt', 'QR'],
    relatedProjectSlug: 'lectorqr-pro',
    relatedProjectName: 'LectorQR Pro',
    es: {
      title: 'Escaneo QR Seguro en Android: CameraX, Inyección con Hilt y Protección frente a URLs Maliciosas',
      category: 'Seguridad Mobile',
      excerpt:
        'Cómo construir un lector y generador de códigos QR moderno libre de rastreadores invasivos, validando esquemas de enlace y advertencias de phishing antes de abrir el navegador.',
      content: `## Por qué un lector QR aparentemente simple necesita arquitectura de seguridad

En las tiendas móviles abundan lectores gratuitos de códigos QR que solicitan permisos desproporcionados —ubicación exacta en segundo plano, lectura de lista de contactos o acceso al almacenamiento completo— para cumplir una función que requiere únicamente acceso puntual a la cámara. Más grave aún: muchos redirigen automáticamente cualquier URL decodificada directamente hacia el navegador del teléfono sin mostrar siquiera el destino real, facilitando ataques de **Quishing** (*QR phishing*) mediante adhesivos maliciosos pegados encima de afiches legítimos o terminales de pago.

Diseñar una aplicación moderna con **Kotlin, Jetpack Compose, CameraX y Dagger Hilt** exige cuidar simultáneamente la fluidez de lectura, el consumo de batería y la seguridad preventiva del usuario antes de lanzar cualquier \`Intent\`.

## Pipeline reactivo con CameraX ligado al Lifecycle

Frente a implementaciones complejas con \`Camera2\`, **CameraX** abstrae diferencias entre fabricantes Android y vincula automáticamente el ciclo de vida del sensor a la pantalla activa mediante \`LifecycleOwner\`:

- **Estrategia sin acumulación de frames:** configuramos \`ImageAnalysis\` con \`BackpressureStrategy.STRATEGY_KEEP_ONLY_LATEST\`, garantizando que mientras el decodificador analiza un fotograma nunca se encolen buffers obsoletos en memoria.
- **Control térmico y región de interés:** recortar y analizar prioritariamente la zona central delimitada por el visor visual en Compose acelera la detección en tiempo real, mejora la respuesta bajo poca luz con soporte de linterna y evita calentamiento innecesario del procesador.
- **Inyección de dependencias con Hilt:** separar la captura de cámara del motor de decodificación, el analizador heurístico de enlaces y el repositorio local en **Room** permite verificar todas las reglas de seguridad con pruebas unitarias rápidas sobre JVM sin requerir emulador físico.

## Inspección preventiva de payloads y defensa contra Quishing

Un código QR puede encapsular texto plano, credenciales Wi-Fi (\`WIFI:T:WPA;S:...;;\`), tarjetas vCard, enlaces telefónicos o direcciones web complejas. Antes de ofrecer el botón de apertura automática aplicamos tres barreras claras:

1. **Lista blanca estricta de esquemas:** únicamente \`https://\` y \`http://\` permiten navegación web previa confirmación explícita; esquemas riesgosos como \`javascript:\`, \`data:\`, \`file://\` o intentos de instalación oculta quedan neutralizados mostrando el texto crudo de forma inofensiva.
2. **Desenmascarado visual del host real:** cuando un enlace intenta imitar marcas mediante subdominios engañosos (por ejemplo \`banca-digital.verificacion-segura.ejemplo.net\`) o caracteres homógrafos Unicode (Punycode \`xn--\`), la ficha muestra destacado el dominio registrable real junto con alertas claras si detecta acortadores opacos o direcciones IP numéricas directas.
3. **Generación vectorial privada sin red:** cuando el usuario crea nuevos códigos QR para redes Wi-Fi del hogar, enlaces de menú o tarjetas digitales, la matriz generada con **ZXing** se exporta localmente a **SVG** vectorial o **PNG** de alta nitidez sin enviar jamás los datos ingresados hacia servidores externos.

## Historial offline en Room y accesibilidad en exteriores

El último componente clave en campo es un historial local persistente construido con **Room** que guarda fecha de lectura, tipo detectado (URL, Wi-Fi, texto o vCard) y bandera de alerta de seguridad, todo almacenado únicamente en el teléfono sin cuentas ni sincronización en la nube. Combinando modo alto contraste bajo luz solar directa, control táctil de linterna en CameraX y lectura por TalkBack con etiquetas descriptivas claras, tanto leer como emitir códigos QR ofrece rapidez inmediata y respeto total por la privacidad del usuario.`
    },
    en: {
      title: 'Secure QR Scanning on Android: CameraX, Hilt DI, and Pre-Launch URL Inspection',
      category: 'Mobile Security',
      excerpt:
        'Building a zero-tracker QR scanner and vector generator with CameraX lifecycle binding, strict scheme validation, and anti-quishing domain warnings.',
      content: `## Why everyday QR apps still require security-first architecture

Too many free mobile QR utilities over-request permissions—location, contacts, background storage—and blindly pass decoded payloads directly into an Android browser \`Intent\`. That leaves users vulnerable to **quishing** (QR phishing stickers placed over public signs or merchant stands) and hidden download redirects.

## Lifecycle-safe CameraX capture and Dagger Hilt separation

Binding **CameraX** \`Preview\` and \`ImageAnalysis\` (\`STRATEGY_KEEP_ONLY_LATEST\`) directly to Jetpack Compose lifecycle state frees camera hardware reliably and avoids frame queue memory buildup. Using **Dagger Hilt** to decouple frame decoding, URL safety heuristics, and Room scan history lets core inspection logic stay covered by fast JVM unit tests.

## Pre-launch payload validation and private vector export

Before allowing navigation, strict URI inspection neutralizes \`javascript:\` or \`data:\` schemes, reveals true registrable root domains against misleading subdomains or Punycode tricks, flags opaque shorteners, and lets users generate crisp local **SVG** and **PNG** QR exports via ZXing completely offline.`
    }
  },
  {
    slug: 'seo-tecnico-agregadores-empleo-nextjs-supabase',
    publishedAt: '2026-11-10',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 9,
    tags: ['SEO Técnico', 'Next.js', 'Supabase', 'JSON-LD', 'Programmatic SEO'],
    relatedProjectSlug: 'chamba-pro',
    relatedProjectName: 'Chamba.pe — Buscador de Empleos Perú',
    es: {
      title: 'SEO Técnico para Agregadores de Empleo y Convocatorias Públicas con Next.js, Supabase y JSON-LD',
      category: 'SEO e Ingeniería de Datos',
      excerpt:
        'Cómo estructurar miles de convocatorias CAS y ofertas laborales sin generar páginas vacías, optimizando sitemaps dinámicos, canonicals y marcado Schema JobPosting.',
      content: `## El mayor peligro del SEO programático en portales de empleo

Construir rutas dinámicas segmentadas por región geográfica, especialidad profesional o modalidad contractual (\`/empleos/en/[region]\`, \`/empleos/[slug]\`) resulta muy natural en **Next.js App Router**. Sin embargo, gran parte de los agregadores sufre desplomes de indexación en Search Console o rechazos publicitarios en Google AdSense por caer en dos errores estructurales frecuentes:

1. **Páginas vacías indexadas (*Soft 404* / *Thin Content*):** publicar en el \`sitemap.xml\` cientos de combinaciones región-puesto donde temporalmente existen cero convocatorias vigentes, devolviendo código HTTP \`200 OK\` acompañado únicamente de un aviso genérico sin valor informativo.
2. **Inventario vencido sin diferenciación ni salida útil:** mantener avisos cerrados hace meses compitiendo por las mismas búsquedas sin indicar claramente su estado finalizado ni sugerir vacantes vigentes equivalentes dentro de la misma jurisdicción.

En la ingeniería continua de **chamba.atpdev.dev** implementamos reglas determinísticas de datos para que tanto Googlebot como los postulantes peruanos recorran exclusivamente páginas vigentes, informativas y técnicamente consistentes.

## Indexación selectiva guiada por inventario vivo en PostgreSQL

Cada vista regional consulta directamente en servidor la disponibilidad real de vacantes activas dentro de **Supabase PostgreSQL**:

- Cuando existen ofertas vigentes en el departamento o categoría solicitada, \`generateMetadata\` emite \`robots: { index: true, follow: true }\`, fija una URL \`canonical\` limpia libre de parámetros duplicados de paginación o ordenamiento y renderiza las fichas con remuneración referencial, entidad convocante (como sectores adscritos a **SERVIR**, municipalidades, gobiernos regionales o empresas privadas) y fecha límite real.
- Si una provincia concreta no registra avisos abiertos durante una semana puntual, la ruta conmuta automáticamente a \`robots: { index: false, follow: true }\`, queda excluida del \`sitemap.xml\` activo y presenta convocatorias recientes de respaldo o guías regionales para ofrecer utilidad real al visitante humano sin desperdiciar presupuesto de rastreo (*crawl budget*).

## Datos estructurados Schema.org \`JobPosting\` auditables y consistentes

Para aspirar a resultados enriquecidos en Google Jobs y evitar advertencias manuales por discrepancia de marcado, cada ficha de convocatoria emite un bloque JSON-LD \`JobPosting\` generado estrictamente desde campos sanitizados presentes en la misma página:

- \`title\`, \`description\` en texto limpio sin etiquetas HTML truncadas y \`datePosted\` en formato ISO 8601 completo con zona horaria.
- \`validThrough\` sincronizado exactamente con la fecha real de cierre publicada en las bases oficiales, evitando conservar oportunidades expiradas en resultados destacados.
- \`hiringOrganization\` con el nombre verificado de la institución contratante y \`jobLocation\` normalizado por departamento y país (\`PE\`), omitiendo propiedades salariales inventadas cuando la fuente oficial pública no declara monto específico.

## Índices compuestos y regeneración incremental bajo picos nacionales

Las campañas masivas de convocatorias CAS en el sector público peruano concentran miles de consultas simultáneas en ventanas horarias concretas tras cada publicación oficial. Combinando índices compuestos sobre \`(status, region, deadline)\` en PostgreSQL, consultas paralelas mediante \`Promise.allSettled\` y **ISR (\`revalidate\`)**, cada ruta mantiene tiempos de respuesta predecibles y estables sin saturar conexiones a base de datos ni penalizar Core Web Vitals.

## Verificación en Search Console antes de escalar nuevas rutas

Antes de liberar nuevas taxonomías o filtros de búsqueda hacia indexación pública conviene auditar periódicamente en Google Search Console el reporte de páginas excluidas por *Soft 404* o *Rastreada: actualmente sin indexar*. Mantener URLs paramétricas de ordenamiento fuera de enlaces rastreables, validar que todo enlace interno apunte al formato canónico sin barra final duplicada y verificar la frescura del \`sitemap.xml\` consolida autoridad orgánica sostenible sin desperdiciar recursos de rastreo.`
    },
    en: {
      title: 'Technical SEO for Job Aggregators and Public Tenders Using Next.js, Supabase, and JSON-LD',
      category: 'Technical SEO & Data',
      excerpt:
        'Preventing thin soft-404 taxonomy pages with dynamic index/noindex rules, active-inventory sitemaps, and clean Schema.org JobPosting markup.',
      content: `## Avoiding programmatic SEO pitfalls in public tender portals

Generating dynamic city and category routes in **Next.js App Router** makes scaling regional landing pages effortless—yet easily backfires into *thin content* rejections whenever regional inventories drop to zero while pages still return \`200 OK\` inside \`sitemap.xml\`.

## Inventory-driven indexing rules with Supabase PostgreSQL

In **chamba.atpdev.dev**, server components query active open tenders before emitting metadata:

- Regions with live postings emit \`robots: { index: true, follow: true }\`, clean query-free canonical links, and remain listed in \`sitemap.xml\`.
- Temporarily empty regional categories automatically emit \`noindex, follow\` and fall back to relevant nearby active tenders for human visitors, protecting crawl budget across search engines.

## Clean Schema.org \`JobPosting\` JSON-LD and peak load caching

Every job page serializes strictly sanitized \`JobPosting\` structured data matching visible entity names, normalized Peruvian regions, and exact \`validThrough\` deadlines. Composite indexes across \`(status, region, deadline)\` paired with ISR keep **TTFB** consistently low even during peak civil-service announcement surges.`
    }
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getLocalizedBlogPost(post: BlogPost, lang: string) {
  const isEnglishLike = lang !== 'es' && lang !== 'pt';
  const localized = isEnglishLike ? post.en : post.es;
  return {
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTimeMinutes: post.readingTimeMinutes,
    tags: post.tags,
    relatedProjectSlug: post.relatedProjectSlug,
    relatedProjectName: post.relatedProjectName,
    ...localized,
  };
}
