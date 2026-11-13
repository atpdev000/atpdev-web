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

SQLite natively solves this with **Full-Text Search (FTS4)**. Declaring an \`@Fts4(contentEntity = ...)\` virtual entity in Room builds a synchronized inverted prefix and token index without duplicating bulky text payloads across disk pages:

~~~kotlin
@Fts4(contentEntity = Cie10Entity::class)
@Entity(tableName = "cie10_fts")
data class Cie10FtsEntity(
    val code: String,
    val titleNormalized: String,
    val notes: String
)
~~~

## Reactive Flow pipelines, accent folding, and query sanitization

Spanish and Portuguese users rarely type diacritics on mobile keyboards during hurried lookups (\`hipertension\` instead of \`Hipertensión\`). Folding both indexed fields and incoming search queries into normalized ASCII via \`Normalizer.Form.NFD\` lets FTS4 prefix expressions (\`token*\`) match accurately across accents.

Inside the \`ViewModel\`, combining \`debounce(75)\`, \`distinctUntilChanged()\`, \`flatMapLatest\`, and \`flowOn(Dispatchers.IO)\` ensures stale queries are cancelled immediately when a user keeps typing, keeping the main UI thread completely clear:

~~~kotlin
val results: StateFlow<List<ClinicalSummary>> = query
    .debounce(75)
    .map { sanitizeAndNormalize(it) }
    .distinctUntilChanged()
    .flatMapLatest { tokens ->
        if (tokens.isEmpty()) repository.observeRecent()
        else repository.searchByFts(tokens.joinToString(" ") { "$it*" })
    }
    .flowOn(Dispatchers.IO)
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
~~~

Stripping FTS4 syntax operators such as hyphens, quotes, or colons prior to constructing the \`MATCH\` argument also eliminates \`SQLiteException\` crashes on medical codes like \`E11-9\`, while projecting only summary columns keeps \`LazyColumn\` scrolling fluid.

## Pre-populated assets and dual-database separation

Compiling, vacuuming (\`VACUUM\` + \`ANALYZE\`), and packing a ready-to-query \`.db\` inside \`assets/databases/\` via \`.createFromAsset(...)\` skips heavy first-launch JSON parsing and keeps cold startup under **450 ms**. Storing read-only clinical tables in a separate Room instance from user-owned bookmarks and history ensures future catalog updates never risk losing saved user state.

## Production verification checklist

- Benchmark cold startup and p95 FTS4 search latency with Android **Macrobenchmark** on entry-level devices.
- Unit-test accent folding, dotted medical codes (\`J06.9\`), empty inputs, and punctuation edge cases prior to release.
- Verify search, filtering, and copy actions end-to-end in complete airplane mode during QA.`
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

A Lighthouse performance score stuck around 80 rarely comes from a single dramatic bottleneck. More often it stems from accumulated everyday shortcuts: screenshots serialized as Base64 strings inside PostgreSQL Markdown columns, render-blocking external CSS requests to Google Fonts, synchronous server data waterfalls, and third-party tags competing with React hydration for main-thread CPU budget.

During systematic production audits of **atpdev.dev** and **chamba.atpdev.dev**, addressing four architectural root causes drove major, verifiable gains across **TTFB**, **FCP**, **LCP**, **TBT**, and **CLS**.

## 1. Remove hidden Base64 payloads from SSR and RSC flight data

When CMS rich-text fields store screenshots as inline Base64 data URIs inside Markdown bodies, Next.js App Router transmits every image twice—once inside rendered server HTML and again inside React Server Component flight scripts (\`self.__next_f.push\`). In one real production case observed during audit, just four inline screenshots bloated a project article past **2 MB of initial HTML**, stalling download time and main-thread parsing.

Moving every inline image into object storage CDN (Supabase Storage or S3) as an optimized \`.webp\` asset with explicit \`width\` and \`height\` attributes slashes document transfer size into tens of kilobytes while locking layout geometry so **CLS stays under 0.01**.

## 2. Eliminate external font waterfalls with \`next/font\`

Manual \`fonts.googleapis.com\` stylesheets create a critical network chain: DNS + TLS to Google Fonts, CSS download, then downstream discovery of \`.woff2\` files on \`fonts.gstatic.com\`. Even with preconnect hints, that round trip delays first text paint by 150–300 ms.

Switching to \`next/font/google\` inside \`app/layout.tsx\` downloads font weights at build time, serves static assets over your primary HTTP/2 connection, enforces \`font-display: swap\`, and applies automatic \`size-adjust\` fallback metrics so hero titles never shift after font swap.

## 3. Defer analytics and ad tags off the critical path

Third-party analytics, heatmaps, and ad libraries executed eagerly during boot compete directly against interactive hydration. Using \`next/script\` with \`strategy="afterInteractive"\` and restricting ad script injection strictly away from legal views (\`/privacy\`, \`/terms\`) or corporate homepages protects hydration responsiveness and keeps **Total Blocking Time** near zero.

## 4. Cut TTFB with ISR, parallel queries, and Caddy Zstd compression

When PageSpeed warns about slow server response time, inspect server execution patterns first:

- **Avoid unnecessary \`force-dynamic\`:** portfolio routes, articles, and product detail pages shine under Incremental Static Regeneration (\`export const revalidate = 3600\`), serving pre-rendered HTML from memory in under 25 ms.
- **Avoid per-request synchronous translation loops:** cache translated content or pre-build primary locales statically so SSR never waits 600+ ms per external translation request.
- **Single-hop canonical 301 + Zstd:** configure Caddy behind TLS with \`encode zstd gzip\`, immutable long-term caching on \`/_next/static/\`, and a direct single-hop 301 from apex to \`https://www.atpdev.dev\`.

## Repeatable verification before any release

Check \`curl -sIL\` to verify zero redirect chains, verify compressed HTML stays compact, and confirm both Desktop and throttled Mobile Lighthouse scores remain healthy after deployment.`
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

Cloud vision APIs look effortless on office Wi-Fi, yet break down immediately in remote orchard valleys across Apurimac and the Peruvian Andes lacking consistent cellular coverage. Sending dozens of high-resolution leaf snapshots per plot over patchy 3G wastes time, drains handset batteries, and blocks field engineers right when preventive action is needed. Shifting neural inference directly onto the handset with **TensorFlow Lite (LiteRT)** completes diagnosis locally in **45 to 120 milliseconds**, eliminates per-call server costs, and keeps grower records private.

## Preventing preprocessing drift between Python and Kotlin

Most real-world accuracy drops in mobile computer vision happen before the neural network even runs, caused by subtle discrepancies between Python training notebooks and Kotlin runtime pipelines:

1. **CameraX frame pressure:** configuring \`ImageAnalysis\` with \`STRATEGY_KEEP_ONLY_LATEST\` prevents stale camera frames from backing up in memory on mid-range phones.
2. **EXIF orientation & RGB alignment:** CameraX delivers \`YUV_420_888\` buffers whose sensor rotation sits in \`imageProxy.imageInfo.rotationDegrees\`. Rotating before center-cropping and strictly reading \`RGB\` channel order avoids misclassifying iron chlorosis or nitrogen deficiency.
3. **Matching float scaling:** if MobileNetV3 or EfficientNet-Lite trained on pixels normalized to \`[-1, 1]\` or \`[0, 1]\`, exact same scaling must populate the native \`ByteBuffer\` in Kotlin:

~~~kotlin
val inputBuffer = ByteBuffer.allocateDirect(4 * inputSize * inputSize * 3)
    .order(ByteOrder.nativeOrder())
for (pixel in pixels) {
    inputBuffer.putFloat(((pixel shr 16 and 0xFF) / 127.5f) - 1.0f)
    inputBuffer.putFloat(((pixel shr 8 and 0xFF) / 127.5f) - 1.0f)
    inputBuffer.putFloat(((pixel and 0xFF) / 127.5f) - 1.0f)
}
~~~

## INT8 quantization, hardware delegates, and Grad-CAM overlays

Unquantized \`FP32\` CNN checkpoints weigh 15–45 MB and warm devices rapidly during continuous parcel scouting. Applying **full integer quantization (INT8)** calibrated on real sunlit and shaded field photos cuts \`.tflite\` weight by roughly **75%** while keeping classification accuracy steady. Using **XNNPACK** multi-core CPU execution as the reliable baseline, with validated GPU delegate opt-ins, prevents crashes on older mobile GPU drivers.

To earn genuine trust from field agronomists, predictions alone ("Chlorosis — 89%") are not enough; experts need to verify the model did not overfit to soil background or sky reflections. Exposing the final convolutional activation map tensor alongside dense class weights lets Kotlin compute a fast **Grad-CAM** heatmap overlay blended cleanly over the captured leaf. When highlighted hotspots land squarely on necrotic spots or yellow leaf margins, technicians verify visually that the prediction rests on real agronomic evidence.

## Field reliability safeguards

- **Blur & exposure pre-checks:** Laplacian variance checks reject motion-blurred wind shots before running inference.
- **Calibrated abstention threshold:** below \`0.65\` confidence, prompt for a clearer capture rather than guessing an incorrect disease label.
- **Offline Room audit logs:** persist model version, confidence score, and local inspection notes completely offline.`
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

Employment contracts, medical charts, judicial filings, payroll slips, and university theses routinely carry private personal data. Yet most legacy online PDF utilities force users to upload entire multi-megabyte documents to opaque third-party servers just to merge two files, rotate an upside-down scan, or extract three signed pages.

That traditional pattern exposes confidential files to remote storage or server logs while forcing developers to finance expensive outbound bandwidth and heavy backend worker queues running \`Ghostscript\` or \`qpdf\`. A **Zero-Upload** browser architecture reverses that model using modern JavaScript, **Web Workers**, and **WebAssembly**, verifiable directly inside DevTools Network showing zero outbound document bytes.

## Splitting visual preview and lossless binary assembly

1. **\`pdfjs-dist\` for crisp interactive thumbnails:** Decodes selected pages onto HiDPI \`<canvas>\` elements so users can drag, reorder, rotate, and inspect exact layouts smoothly.
2. **\`pdf-lib\` for ISO-compliant output:** Reads raw \`ArrayBuffer\` bytes cleanly in client memory, clones chosen pages via \`copyPages\`, preserves selectable vector fonts and internal hyperlinks intact, applies exact 90-degree rotations, and serializes a clean PDF with object streams enabled:

~~~ts
import { PDFDocument, degrees } from 'pdf-lib';

export async function buildMergedPdf(
  operations: Array<{ bytes: ArrayBuffer; pageIndexes: number[]; rotateDelta?: number }>
): Promise<Uint8Array> {
  const output = await PDFDocument.create();
  for (const op of operations) {
    const source = await PDFDocument.load(op.bytes, { ignoreEncryption: false });
    const copied = await output.copyPages(source, op.pageIndexes);
    for (const page of copied) {
      if (op.rotateDelta) {
        page.setRotation(degrees((page.getRotation().angle + op.rotateDelta) % 360));
      }
      output.addPage(page);
    }
  }
  return output.save({ useObjectStreams: true });
}
~~~

## Handling encrypted PDFs, selective compression, and range validation

Real user documents rarely match tidy synthetic test files:

- **Owner-encrypted documents:** Catching encryption errors per file lets the UI alert users cleanly about which specific document requires unlocking without crashing the whole batch.
- **Vector-safe compression:** Flattening whole pages into raster JPEGs ruins selectable text. Selective compression targets oversized embedded raster image streams down to legible 150 DPI while leaving crisp vector typography untouched.
- **Strict range parsing:** Sanitizing user-typed ranges (\`1-4, 7, 10-12\`) avoids out-of-bounds exceptions across mixed page counts.

## Memory hygiene on constrained mobile browsers

Handling 50–100 MB documents reliably inside mobile tabs requires explicit cleanup:

- **Lazy rendering via \`IntersectionObserver\`:** Never render 250 thumbnail canvases simultaneously; decode pages only as they enter viewport proximity.
- **Zero-copy Worker transfers:** Pass \`ArrayBuffer\` payloads via transferable object lists (\`postMessage(data, [data.buffer])\`) to avoid duplicating gigabytes in RAM.
- **Prompt \`URL.revokeObjectURL\`:** Free temporary preview and download blobs immediately once saved or cleared.

Zero-upload processing scales horizontally across thousands of simultaneous users at nearly zero backend compute cost while guaranteeing privacy by design.`
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

In everyday administrative procedures—job applications, university enrollments, and bank filings—users routinely photograph national ID cards, receipts, and certificates with mobile phones. Holding a handset perfectly parallel to paper without casting glare or angled keystone distortion is nearly impossible.

Importing multi-megabyte WebAssembly builds of OpenCV solely to dewarp a snapshot hurts First Load JS budgets and Core Web Vitals on mobile networks. Solving the **8-degree-of-freedom projective homography** system directly via Gaussian elimination with partial pivoting in **pure TypeScript** takes less than **0.2 milliseconds** with zero runtime weight. Mapping four user-adjusted corner handles toward standardized physical proportions (such as **ISO/IEC 7810 ID-1**, \`85.60 × 53.98 mm\`) straightens angled photos immediately.

## Inverse warping, bilinear sampling, and tonal enhancement

Forward pixel mapping leaves missing pixel holes whenever decimal destination positions round unevenly. Using **inverse warping** to loop smoothly over every integer destination coordinate and sampling continuous source coordinates via **bilinear interpolation** across four neighboring pixels preserves sharp barcode bars, fine microprint, and clean signatures.

From the resulting \`ImageData\` offscreen canvas buffer, lightweight luminance adjustments fix harsh desk lighting cleanly:

- **Balanced original color:** preserves official identity hues, portraits, and ink stamps accurately for formal applications.
- **High-contrast grayscale:** applies histogram normalization to reduce uneven indoor shadow gradients.
- **Clean black-and-white document mode:** clarifies pale thermal paper receipts without thickening fine glyph strokes.

## Respecting EXIF orientation and calibrated A4 export with \`jsPDF\`

Portrait camera snapshots frequently store rotation flags inside EXIF headers rather than rotating physical JPEG pixels. Decoding inputs via \`createImageBitmap(file, { imageOrientation: 'from-image' })\` and capping working dimensions to 2,200 px keeps memory lean while aligning corner handles accurately.

Exporting centered front-and-back scans onto calibrated **210 × 297 mm A4 pages** using \`jsPDF\` produces print-ready PDFs directly inside local browser memory—ensuring sensitive identity scans never leave the user's device.`
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

Reaching for \`array.sort(() => Math.random() - 0.5)\` remains one of the most widespread anti-patterns in casual giveaway tools and classroom team pickers. Two mathematical bugs sit beneath the surface:

1. **Non-cryptographic PRNG:** \`Math.random()\` typically implements variants of \`xorshift128+\` optimized for graphics speed and physics loops rather than auditable cryptographic unpredictability.
2. **Broken sort transitivity:** Standard array sorting implementations such as TimSort assume comparator functions enforce strict weak ordering. Returning random positive or negative signs breaks transitivity, leaving early or late entries measurably more likely to settle near certain positions.

## Uniformity with Fisher-Yates, Web Crypto API, and rejection sampling

Delivering genuine \`1 / N\` statistical equality requires walking a shallow copy backwards with **Fisher-Yates (Knuth) shuffling** driven by **Web Crypto API** (\`window.crypto.getRandomValues\`). To prevent **modulo bias** whenever \`2^32\` does not divide evenly by the candidate pool size, **rejection sampling** discards integers inside the trailing partial block:

~~~ts
function secureRandomInt(maxExclusive: number): number {
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  const buffer = new Uint32Array(1);
  while (true) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % maxExclusive;
  }
}

export function fairShuffle<T>(entries: readonly T[]): T[] {
  const copy = [...entries];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
~~~

## Clean roster hygiene and SHA-256 verification receipts

In real livestreams and social campaigns, organizers copy rosters from spreadsheets or chat threads full of blank lines, trailing spaces, and accidental duplicates. Pre-normalizing whitespace, offering clear duplicate toggles, and reserving alternate winners upfront eliminates manual disputes mid-broadcast.

Computing a client-side **SHA-256** verification digest via \`crypto.subtle.digest\` over the canonical input list and UTC timestamp allows organizers to export downloadable proof sheets confirming participants were never altered or silently filtered after setup—all inside browser memory without uploading participant names to third-party servers.`
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

Too many free mobile QR utilities over-request invasive permissions—background GPS location, contact books, or full external storage—to solve a task needing only momentary camera access. Worse, many blindly pass any decoded string straight into an implicit Android browser \`Intent\`, masking the true destination host and leaving everyday users exposed to **quishing** (phishing stickers pasted over restaurant menus, public notices, or merchant payment stands).

Engineering a modern reader with **Kotlin, Jetpack Compose, CameraX, and Dagger Hilt** means pairing smooth low-light detection with strict pre-launch security inspection.

## Lifecycle-safe CameraX capture and Dagger Hilt separation

Rather than managing low-level \`Camera2\` state machines across vendor quirks, binding **CameraX** \`Preview\` and \`ImageAnalysis\` directly to the Jetpack Compose screen \`LifecycleOwner\` ensures sensor hardware powers down the millisecond users background the app:

- Setting \`BackpressureStrategy.STRATEGY_KEEP_ONLY_LATEST\` avoids frame queue pileups while decoding live video streams.
- Restricting analysis coordinates to the central reticle box lowers CPU cycles per frame and minimizes thermal throttling during repeated warehouse or store scans.
- Injecting the decoder engine, URL safety validator, and local Room history repository via **Dagger Hilt** lets security inspection rules stay verified via fast JVM unit tests without an emulator.

## Pre-launch payload inspection, vector exports, and offline history

QR payloads carry URLs, Wi-Fi credentials (\`WIFI:T:WPA;S:...;;\`), vCard contacts, phone links, or arbitrary text. Before offering an open button, a security layer enforces three checks:

1. **Strict scheme allowlist:** only \`https://\` and \`http://\` trigger external web actions after user confirmation; dangerous schemes such as \`javascript:\`, \`data:\`, or \`file://\` display strictly as inert text.
2. **Root domain unmasking:** deceptive subdomains, Punycode (\`xn--\`) lookalikes, opaque URL shorteners, and raw IP hosts trigger prominent domain warnings.
3. **Zero-server QR generation & local Room logs:** generating business or Wi-Fi QR matrices via **ZXing** exports crisp offline **SVG** and **PNG** files while keeping scan history strictly stored in local Room tables with accessible TalkBack labeling and high-contrast torch controls.`
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

Generating dynamic city, sector, and profession routes in **Next.js App Router** (\`/empleos/en/[region]\`, \`/empleos/[slug]\`) scales regional landing coverage quickly—yet routinely triggers Search Console indexing drops or AdSense *low-value content* rejections whenever portals commit two classic structural mistakes:

1. **Indexed soft-404 taxonomy shells:** exposing hundreds of regional or category combinations inside \`sitemap.xml\` that return \`200 OK\` with zero active openings and only an empty placeholder notice.
2. **Stale expired announcements:** letting months-old closed civil-service tenders compete in search snippets without clear expiration status or active regional alternatives.

Inside **chamba.atpdev.dev**, deterministic server-side rules ensure search crawlers and Peruvian applicants explore exclusively structured, active, verified listings linked to institutional public bases (\`.gob.pe\`, SERVIR, regional governments, and verified private employers).

## Inventory-driven indexing rules with Supabase PostgreSQL

Every regional route queries live open-tender counts in **Supabase PostgreSQL** prior to emitting metadata:

- Regions holding live vacancies emit \`robots: { index: true, follow: true }\`, strip redundant query strings in canonical links, remain listed in \`sitemap.xml\`, and render clear salary ranges, contract regimes (CAS D.L. 1057, D.L. 728, D.L. 276), and direct institutional application URLs.
- Temporarily empty regional categories automatically emit \`robots: { index: false, follow: true }\`, drop out of \`sitemap.xml\`, and fall back to relevant nearby active tenders for human visitors—protecting crawl budget across search engines.

## Clean Schema.org \`JobPosting\` JSON-LD and peak load caching

Every job page serializes strictly sanitized \`JobPosting\` structured data matching visible entity names word for word—including full ISO 8601 \`datePosted\` timestamps, exact official \`validThrough\` deadlines, normalized \`PE\` regions, and avoiding synthetic salary figures whenever public notices omit exact compensation.

Composite PostgreSQL indexes across \`(status, region, deadline)\`, parallel \`Promise.allSettled\` fetches, and Next.js Incremental Static Regeneration (\`revalidate\`) keep **TTFB** consistently low even during peak national civil-service announcement surges.`
    }
  },
  {
    slug: 'gastronomia-computacional-escalado-recetas-i18n',
    publishedAt: '2026-10-08',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 7,
    tags: ['Next.js', 'i18n', 'JSON-LD', 'TypeScript', 'PerúSabor'],
    relatedProjectSlug: 'perusabor-pro',
    relatedProjectName: 'PerúSabor Pro',
    es: {
      title: 'Gastronomía computacional: modelado de recetas, escalado proporcional e i18n con Next.js',
      category: 'Arquitectura Web & Datos',
      excerpt:
        'Cómo estructurar recetarios digitales de cocina peruana con proporciones dinámicas por comensal, equivalencias de medidas, Schema.org Recipe y búsqueda semántica.',
      content: `## El desafío técnico detrás de un recetario digital profesional

La mayoría de portales gastronómicos almacenan los ingredientes de una receta como texto plano en HTML (\`"2 cucharadas de ají panca"\` o \`"1/2 kg de papa amarilla"\`). Aunque resulta cómodo para publicar un blog tradicional, ese enfoque rompe cualquier funcionalidad interactiva seria: impide recalcular porciones con precisión, dificulta convertir unidades entre gramos, tazas y onzas, y vuelve impreciso el filtrado por ingredientes disponibles o restricciones alimentarias.

Al diseñar **perusabor.atpdev.dev**, decidimos tratar cada plato de la gastronomía peruana —desde un cebiche clásico hasta una carapulcra con sopa seca o un rocoto relleno arequipeño— como una estructura de datos fuertemente tipada en **TypeScript**.

## Modelo normalizado de ingredientes y escalado inteligente

Cada receta separa claramente la narrativa culinaria del grafo de cantidades:

- **Estructura atómica por insumo:** cada ingrediente declara \`cantidadBase\`, \`unidad\`, \`comportamientoEscalado\` (\`lineal\`, \`fijo\`, \`logaritmico\`) y notas regionales (por ejemplo, reemplazos cuando el usuario cocina fuera del Perú y busca alternativas al ají amarillo fresco).
- **Redondeo culinario legible:** multiplicar \`0.5\` huevo por \`3\` comensales no debería mostrar \`1.5 unidades\`, ni \`0.333333 cucharaditas\` de sal. Aplicamos reglas de redondeo fraccionario y tolerancia por familia de insumo (especias, líquidos, proteínas y piezas enteras) para conservar la usabilidad real en cocina.
- **Temporizador integrado por paso:** cada etapa de cocción expone duración estimada y alertas visuales sin abandonar la vista de preparación, evitando que el usuario tenga que desbloquear el teléfono con las manos húmedas constantemente.

## SEO técnico con \`Schema.org Recipe\` y rendimiento SSR

Un recetario público vive o muere según la calidad de su indexación y su tiempo de carga en dispositivos móviles dentro de la cocina:

1. **Datos estructurados \`Recipe\` JSON-LD:** cada ficha publica \`prepTime\`, \`cookTime\`, \`totalTime\`, \`recipeYield\`, \`recipeCuisine: "Peruvian"\`, lista limpia de \`recipeIngredient\` y pasos \`HowToStep\` sincronizados exactamente con el texto visible.
2. **Server Components con tipado estricto:** el catálogo completo se pre-renderiza en el servidor para entregar contenido HTML inmediato tanto a buscadores como a lectores con conexiones móviles lentas.
3. **Sitemaps e imágenes optimizadas:** el mapa XML expone únicamente recetas completas verificadas, acompañadas de textos alternativos descriptivos e imágenes ligeras para mantener **CLS cercano a 0**.`
    },
    en: {
      title: 'Computational Gastronomy: Modeling Recipes, Dynamic Scaling, and Structured Data in Next.js',
      category: 'Web Architecture & Data',
      excerpt:
        'Designing typed culinary data structures for Peruvian recipes with proportional serving scaling, fractional rounding rules, and validated Schema.org Recipe JSON-LD.',
      content: `## Structuring recipes beyond plain HTML paragraphs

Most food portals store ingredient lists as unstructured HTML strings (\`"2 tbsp aji panca"\`, \`"1/2 kg yellow potato"\`). While fast to author, unstructured text blocks accurate serving scaling, metric/imperial conversions, and allergen or pantry filtering. For **perusabor.atpdev.dev**, every Peruvian recipe is modeled in strongly typed **TypeScript** records.

## Smart ingredient scaling rules

Rather than naively multiplying every number linearly:

- Each ingredient defines a base quantity, canonical unit, scaling curve (\`linear\`, \`sublinear\` for aromatics/spices, or \`fixed\` for frying oil), and regional substitution hints when cooking abroad.
- A culinary fraction formatter prevents unreadable outputs like \`0.33333 tsp\`, rounding naturally to kitchen-friendly increments.
- Step-by-step timers run directly inside the cooking view so users keep hands free while preparing dishes.

## Server-side rendering and \`Recipe\` JSON-LD

Every dish route pre-renders complete editorial context on the server alongside synchronized **Schema.org \`Recipe\`** markup (\`prepTime\`, \`cookTime\`, \`recipeIngredient\`, \`HowToStep\`) and clean XML sitemaps for fast mobile discovery.`
    }
  },
  {
    slug: 'animaciones-canvas-css-60fps-capacitor-mobile',
    publishedAt: '2026-10-12',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 7,
    tags: ['Canvas 2D', 'CSS', 'Vite', 'Capacitor', 'Performance'],
    relatedProjectSlug: 'interactivo-magic',
    relatedProjectName: 'Interactivo Magic',
    es: {
      title: 'Animaciones fluidas a 60 FPS en móvil con HTML5 Canvas, CSS Compositor y Capacitor',
      category: 'Frontend & Mobile',
      excerpt:
        'Técnicas prácticas para lograr tarjetas interactivas con partículas, confeti y transiciones suaves sin provocar jank ni consumo excesivo de batería en gama media.',
      content: `## Por qué tantas animaciones web tartamudean en Android de gama media

Crear experiencias interactivas memorables —como tarjetas digitales animadas, celebraciones con confeti, fuegos artificiales o sobres virtuales que se abren al tacto— exige respetar estrictamente el *pipeline* de renderizado del navegador. Cuando una aplicación anima propiedades como \`top\`, \`left\`, \`width\` o \`box-shadow\` en cada cuadro, fuerza fases repetidas de **Layout** y **Paint**, desplomando los cuadros por segundo por debajo de **24 FPS** en teléfonos económicos.

En **magic.atpdev.dev** construimos decenas de escenas interactivas personalizadas para cumpleaños, aniversarios y fechas especiales combinando aceleración por GPU y una arquitectura híbrida ligera.

## Reglas de oro para mantener 60 FPS constantes

Aplicamos cuatro principios medibles en cada plantilla interactiva:

1. **Propiedades exclusivas del Compositor:** las animaciones CSS de tarjetas, pétalos y botones utilizan únicamente \`transform\` (\`translate3d\`, \`scale\`, \`rotate\`) y \`opacity\`, delegando el cálculo al hilo compositor de la GPU sin recalcular geometría.
2. **Pool de partículas reutilizable en HTML5 Canvas:** en lugar de crear y destruir cientos de objetos cada segundo (lo que dispara pausas del recolector de basura de JavaScript), pre-asignamos un arreglo fijo de partículas y reciclamos sus coordenadas al salir del *viewport*.
3. **Escalado responsable por \`devicePixelRatio\`:** en pantallas móviles 3x o 4x, renderizar un lienzo full-screen a resolución nativa multiplica hasta por 16 los píxeles a rellenar. Limitamos el factor DPR de efectos ambientales a \`Math.min(window.devicePixelRatio, 2)\` sin pérdida perceptible de nitidez.
4. **Respeto a \`prefers-reduced-motion\` y visibilidad:** cuando la pestaña pasa a segundo plano (\`document.hidden\`), el bucle \`requestAnimationFrame\` se pausa de inmediato para no drenar batería ni CPU innecesariamente.

## Contenido indexable junto a aplicaciones interactivas

Un aprendizaje clave al llevar experiencias interactivas a la web abierta es que los rastreadores y evaluadores automáticos necesitan contexto editorial claro alrededor del lienzo visual. Combinar la aplicación fluida con guías de uso, explicaciones técnicas, preguntas frecuentes y políticas visibles permite ofrecer tanto una experiencia lúdica de cero fricción como un sitio transparente para buscadores.`
    },
    en: {
      title: 'Sustaining 60 FPS Mobile Animations with HTML5 Canvas, CSS Compositing, and Capacitor',
      category: 'Frontend & Mobile',
      excerpt:
        'Eliminating frame drops on mid-range smartphones through compositor-only CSS transforms, object-pooled Canvas particles, DPR capping, and visibility pausing.',
      content: `## Why celebratory web animations drop frames on mid-range phones

Interactive cards, particle bursts, and animated reveals stall quickly when JavaScript or CSS mutates layout-triggering properties (\`top\`, \`left\`, \`width\`) on every animation tick. Inside **magic.atpdev.dev**, lightweight architecture keeps motion smooth even inside mobile WebViews.

## Four practices behind steady 60 FPS scenes

- **Compositor-only transforms:** UI transitions animate strictly \`transform\` and \`opacity\`, offloading work to the GPU compositor layer.
- **Object-pooled Canvas particles:** Pre-allocated particle arrays avoid continuous garbage-collection pauses during confetti or firework loops.
- **Bounded \`devicePixelRatio\`:** Clamping particle Canvas backing stores to \`Math.min(dpr, 2)\` cuts fill-rate overhead dramatically on high-density displays.
- **Lifecycle & motion awareness:** Pausing \`requestAnimationFrame\` on background tabs and honoring \`prefers-reduced-motion\` preserves battery life and accessibility.`
    }
  },
  {
    slug: 'arquitectura-multi-subdominio-nextjs-caddy-pm2',
    publishedAt: '2026-10-18',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 8,
    tags: ['Caddy', 'PM2', 'VPS', 'Next.js', 'DevOps'],
    relatedProjectSlug: 'chamba-pro',
    relatedProjectName: 'Chamba Pro',
    es: {
      title: 'Orquestación de 11 aplicaciones web en un solo VPS con Caddy, PM2 y Monorepo pnpm',
      category: 'Infraestructura & DevOps',
      excerpt:
        'Cómo desplegar múltiples aplicaciones Next.js, backends Node y SPAs en un servidor Linux económico con certificados TLS automáticos, aislamiento de puertos y despliegues sin caos.',
      content: `## Centralizar proyectos sin multiplicar costos de infraestructura

Cuando mantienes varios productos activos en producción —un portal principal, un agregador laboral, un procesador PDF, un recetario, un generador de sorteos y un panel administrativo— contratar instancias independientes en plataformas *serverless* o PaaS por cada proyecto dispara los costos mensuales y fragmenta la observabilidad.

En **ATP Dev** consolidamos todo el ecosistema sobre un monorepo estructurado con **pnpm workspaces** desplegado en un servidor VPS único administrado mediante **Caddy Server** y **PM2**.

## Separación limpia en el servidor: Caddy + PM2

Cada subdominio apunta al mismo servidor mediante DNS, pero el enrutamiento se resuelve de forma explícita y verificable:

- **TLS automático sin cronjobs frágiles:** **Caddy** gestiona la emisión y renovación automática de certificados **Let's Encrypt** para cada subdominio (\`www.atpdev.dev\`, \`chamba.atpdev.dev\`, \`pdf.atpdev.dev\`, \`sorteos.atpdev.dev\`, etc.) con HTTP/2 y HTTP/3 habilitados por defecto.
- **Aplicaciones SSR aisladas por puerto interno:** cada app Next.js corre en modo \`next start\` asignada a un puerto local distinto (\`3000\` a \`3010\`) supervisada por **PM2** con reinicio automático ante fallos y límites de memoria definidos.
- **SPAs estáticas servidas directo desde disco:** herramientas ligeras compiladas con Vite se sirven mediante \`file_server\` y \`try_files\` directamente desde Caddy, consumiendo prácticamente cero memoria RAM en reposo.

## Disciplina de despliegue y verificación post-release

Un monorepo en VPS solo es seguro si cada actualización sigue una secuencia predecible: compilar únicamente los paquetes impactados, validar códigos de estado HTTP reales (\`200 OK\`), comprobar que \`robots.txt\`, \`sitemap.xml\` y \`ads.txt\` respondan en cada host sin redirecciones rotas, y revisar métricas de consumo de memoria y tiempos de respuesta tras reiniciar los procesos en PM2.`
    },
    en: {
      title: 'Operating 11 Web Apps on One Linux VPS with Caddy, PM2, and a pnpm Monorepo',
      category: 'Infrastructure & DevOps',
      excerpt:
        'Practical production architecture using Caddy automatic TLS reverse proxying, isolated PM2 ports for Next.js servers, and zero-overhead static serving for SPAs.',
      content: `## Consolidating multiple products without cloud sprawl

Running distinct portfolios, job aggregators, utility tools, and APIs on separate paid PaaS plans quickly multiplies operational overhead. The **ATP Dev** ecosystem runs cleanly from a structured **pnpm monorepo** deployed onto a single Linux VPS.

## Reverse proxy isolation and static efficiency

- **Automatic HTTPS via Caddy:** Each subdomain terminates TLS cleanly with zero manual certificate scripts and routes either to a dedicated local Next.js port (\`3000–3010\`) or directly to static \`dist/\` bundles via \`file_server\`.
- **Process supervision with PM2:** Memory caps and per-service restarts isolate failures so rebuilding or restarting one service never interrupts sibling applications.
- **Post-deploy verification:** Automated checks confirm \`200 OK\` HTML responses, \`robots.txt\`, \`sitemap.xml\`, and asset integrity immediately after every rollout.`
    }
  },
  {
    slug: 'bases-datos-postgresql-plpgsql-consultas-cronologicas',
    publishedAt: '2026-10-24',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 7,
    tags: ['PostgreSQL', 'Supabase', 'SQL', 'SSR', 'Datos'],
    relatedProjectSlug: 'code-history-day-web',
    relatedProjectName: 'CodeHistory',
    es: {
      title: 'Consultas cronológicas, normalización histórica e ISR en PostgreSQL para efemérides técnicas',
      category: 'Bases de Datos & Backend',
      excerpt:
        'Cómo modelar efemérides por mes y día en PostgreSQL con soporte multi-año, caché incremental en Next.js y contenido editorial indexable desde el primer byte.',
      content: `## De un calendario estático a una base de conocimientos históricos

Una plataforma de efemérides sobre computación (**codehistory.atpdev.dev**) o historia universal (**almaniq.atpdev.dev**) requiere responder preguntas en fracciones de milisegundo alrededor de ejes temporales exactos: *"¿Qué hitos de la ingeniería de software ocurrieron un día como hoy?"* o *"¿Cómo se conecta este lenguaje de 1972 con los sistemas actuales?"*.

## Modelado eficiente de fechas históricas en PostgreSQL

Al almacenar eventos que abarcan siglos —desde 1843 con Ada Lovelace hasta lanzamientos de software modernos— usar comparaciones simples sobre campos \`DATE\` completos impide aprovechar índices cuando se consulta solo por mes y día (\`MM-DD\`):

- **Columnas indexadas de calendario:** almacenamos \`month_day\` normalizado o índice compuesto \`(event_month, event_day, significance_rank)\` junto al año histórico exacto en entero (\`event_year\`), evitando aplicar funciones \`EXTRACT()\` no indexables dentro de cláusulas \`WHERE\` calientes.
- **Clasificación editorial y verificación:** cada registro distingue entre fecha exacta documentada (primer *commit*, publicación académica, lanzamiento oficial) y contexto técnico explicado en prosa clara para lectores y estudiantes.
- **Respaldo tipado ante picos o mantenimiento:** el servidor combina consultas a **Supabase PostgreSQL** con catálogos curados locales de reserva y estrategias **ISR (\`revalidate\`)**, garantizando que la página jamás entregue pantallas vacías de *"Cargando..."* a visitantes ni rastreadores.

## Por qué la hidratación mixta perjudica el SEO informativo

Uno de los errores más comunes en aplicaciones educativas creadas con React consiste en renderizar un esqueleto vacío en SSR y pedir los datos históricos recién en el navegador mediante \`useEffect\`. Al mover la consulta inicial a **Server Components** e hidratar únicamente los controles interactivos (filtros de fecha, navegación entre años y búsqueda), la primera respuesta HTML ya transporta todo el valor histórico y educativo.`
    },
    en: {
      title: 'Chronological Indexing and Server-Side Ephemeris Delivery in PostgreSQL and Next.js',
      category: 'Databases & Backend',
      excerpt:
        'Designing fast month/day lookup schemas in PostgreSQL alongside Incremental Static Regeneration so educational timelines never ship empty loading shells.',
      content: `## Fast month-and-day queries across historical centuries

Historical platforms like **codehistory.atpdev.dev** and **almaniq.atpdev.dev** query events across arbitrary centuries using month-day axes rather than full timestamps.

## Schema design and zero-skeleton delivery

- **Index-friendly month/day keys:** Storing integer \`event_month\`, \`event_day\`, and \`event_year\` columns with composite indexes keeps daily lookups fast without full-table \`EXTRACT()\` scans.
- **Verified editorial depth:** Each entry pairs verified publication/release dates with accessible architectural explanations.
- **SSR first, interactive enhancement second:** Moving initial fetches from client \`useEffect\` hooks into Next.js **Server Components** with ISR ensures visitors and search crawlers receive complete HTML immediately.`
    }
  },
  {
    slug: 'clean-architecture-kotlin-jetpack-compose-hilt',
    publishedAt: '2026-10-30',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 8,
    tags: ['Kotlin', 'Jetpack Compose', 'Android', 'CameraX', 'Hilt'],
    relatedProjectSlug: 'lectorqr-pro',
    relatedProjectName: 'LectorQR Pro',
    es: {
      title: 'Clean Architecture en Android moderno con Kotlin, Jetpack Compose, CameraX y Hilt',
      category: 'Ingeniería Android',
      excerpt:
        'Cómo desacoplar el análisis de códigos QR con CameraX y ML Kit del estado de UI en Compose, reduciendo bloqueos, fugas de ciclo de vida y duplicidad de lógica.',
      content: `## Más allá del clásico patrón monolítico en \`MainActivity\`

En aplicaciones Android enfocadas en cámara y procesamiento en tiempo real —como escáneres de códigos QR y códigos de barras— el antipatrón más frecuente consiste en mezclar permisos de cámara, inicialización de \`CameraX\`, callbacks de detección y lógica de navegación dentro de un único \`Activity\` difícil de probar.

En **LectorQR Pro** (junto a su portal web en **lectorqr.atpdev.dev**) estructuramos la aplicación siguiendo **Clean Architecture + MVVM unidireccional (UDF)** optimizada para **Kotlin** y **Jetpack Compose**.

## Capas claras y ciclo de vida predecible

La separación de responsabilidades evita acoplamientos frágiles al actualizar dependencias de Google Play o cámaras de distintos fabricantes:

1. **Capa de Datos e Infraestructura (\`data\`):** encapsula Room para historial local persistente sin conexión, análisis de imagen mediante **ML Kit / ZXing** sobre \`ImageAnalysis.Analyzer\` ejecutado en un \`ExecutorService\` dedicado, y validación estricta de esquemas detectados (\`https://\`, \`WIFI:\`, \`BEGIN:VCARD\`, \`mailto:\`, EAN-13).
2. **Capa de Dominio (\`domain\`):** define casos de uso puros en Kotlin sin dependencias de Android (\`ParseQrPayloadUseCase\`, \`InspectUrlSafetyUseCase\`) verificables con pruebas unitarias instantáneas en JVM.
3. **Capa de Presentación (\`ui\`):** los \`ViewModel\` inyectados con **Hilt** exponen un único \`StateFlow<ScannerUiState>\` inmutable consumido por pantallas declarativas en **Jetpack Compose**, garantizando recomposiciones mínimas.

## Seguridad ante códigos QR maliciosos

Un lector moderno no debe abrir automáticamente cualquier URL escaneada. Antes de invocar un \`Intent\` externo, el parser clasifica el protocolo, expone de forma legible el dominio real de destino, detecta parámetros sospechosos o enlaces acortados y exige confirmación consciente del usuario —protegiendo la privacidad sin sacrificar velocidad.`
    },
    en: {
      title: 'Modern Android Clean Architecture with Kotlin, Jetpack Compose, CameraX, and Hilt',
      category: 'Android Engineering',
      excerpt:
        'Decoupling CameraX frame analyzers and QR payload parsers from Compose UI state using Hilt injection, immutable StateFlow models, and safe URI validation.',
      content: `## Keeping camera pipelines out of UI components

Real-time Android scanner apps easily collapse into unmaintainable lifecycle bugs when permissions, **CameraX** setup, frame decoding, and navigation live inside a single Activity. **LectorQR Pro** isolates these layers with **Clean Architecture + UDF**.

## Layered separation and payload safety

- **Data layer:** Runs \`ImageAnalysis.Analyzer\` on background executors with **ML Kit** and stores offline scan history inside **Room**.
- **Domain layer:** Pure Kotlin use cases validate Wi-Fi configurations, vCards, EAN barcodes, and external URLs, testable directly on the JVM.
- **Presentation layer:** **Hilt**-injected ViewModels expose immutable \`StateFlow\` models to **Jetpack Compose**.
- **Anti-phishing safeguard:** External URLs are never auto-launched blindly; the parsed host and scheme are surfaced clearly before any browser Intent fires.`
    }
  },
  {
    slug: 'consent-mode-v2-privacidad-analitica-web-nextjs',
    publishedAt: '2026-11-04',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 7,
    tags: ['Privacidad', 'Consent Mode v2', 'Core Web Vitals', 'Next.js'],
    relatedProjectSlug: 'sorteos-pro',
    relatedProjectName: 'Sorteos Pro',
    es: {
      title: 'Implementación limpia de Consent Mode v2, analítica diferida y políticas transparentes en Next.js',
      category: 'Privacidad & Rendimiento Web',
      excerpt:
        'Cómo cumplir con estándares de privacidad, evitar scripts invasivos antes de la interacción inicial y mantener Core Web Vitals excelentes sin perder métricas reales.',
      content: `## Privacidad del usuario y velocidad de carga no son objetivos opuestos

Añadir etiquetas de medición, mapas de calor o monetización directamente en el encabezado sin gobierno técnico suele producir dos problemas graves: viola expectativas de consentimiento transparente y dispara el tiempo de bloqueo total (**TBT**) en dispositivos móviles al descargar decenas de kilobytes de scripts externos antes de que el usuario siquiera vea el contenido principal.

En todo el ecosistema **atpdev.dev** adoptamos una arquitectura unificada basada en consentimiento explícito, carga diferida post-LCP y páginas legales reales accesibles desde cada vista.

## Principios técnicos de nuestra implementación

1. **Estado inicial seguro en Consent Mode v2:** antes de cargar cualquier etiqueta de medición opcional, inicializamos \`gtag('consent', 'default', ...)\` respetando valores denegados por defecto cuando corresponde y actualizando únicamente ante la acción explícita del visitante en nuestro banner ligero.
2. **Retraso inteligente tras \`Largest Contentful Paint\`:** las integraciones de telemetría no esenciales esperan a la carga completa y a una ventana de reposo o primera interacción real del usuario (\`scroll\`, \`pointerdown\`, \`keydown\`), logrando puntajes de **LCP inferiores a 1 segundo** y **Rendimiento > 90** en escritorio y móvil.
3. **Aislamiento estricto de entornos locales:** ningún rastreador de terceros debe contaminar paneles de analítica desde sesiones de desarrollo (\`localhost\`, \`127.0.0.1\`). Verificamos el \`hostname\` en tiempo de ejecución antes de inyectar cualquier identificador de proyecto.
4. **Exclusión en páginas sensibles y legales:** las rutas de política de privacidad, términos de uso y avisos de transparencia no cargan anuncios invasivos y ofrecen enlaces claros de contacto y gestión de cookies.`
    },
    en: {
      title: 'Clean Consent Mode v2, Post-LCP Analytics Deferral, and Transparent Privacy Architecture',
      category: 'Web Privacy & Performance',
      excerpt:
        'Balancing accurate telemetry, explicit cookie consent defaults, localhost exclusion, and fast Largest Contentful Paint scores across multi-app Next.js portals.',
      content: `## Protecting privacy and Core Web Vitals simultaneously

Dropping analytics and ad tags blindly into document heads slows mobile rendering and violates clear user consent expectations. Across **atpdev.dev**, telemetry follows strict lifecycle boundaries.

## Key engineering safeguards

- **Default Consent Mode v2 initialization:** Consent flags initialize safely before optional analytics fire and update upon explicit banner choice.
- **Post-LCP deferred loading:** Non-essential scripts wait for page readiness or first interaction so initial paint and **LCP** remain unaffected.
- **Localhost isolation & legal route exclusions:** Runtime hostname guards filter \`localhost\` traffic from production dashboards, while \`/privacy\` and \`/terms\` routes remain ad-free.`
    }
  },
  {
    slug: 'diseno-ui-accesible-contraste-wcag-modo-oscuro',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 6,
    tags: ['Accesibilidad', 'WCAG', 'CSS', 'Design Systems', 'Lighthouse'],
    relatedProjectSlug: 'almaniq-web',
    relatedProjectName: 'Almaniq',
    es: {
      title: 'Accesibilidad WCAG AA real: contraste en modo claro/oscuro, jerarquía semántica y Lighthouse 100',
      category: 'Diseño UI & Accesibilidad',
      excerpt:
        'Errores sutiles de contraste que penalizan sitios modernos con colores neón o pasteles y cómo resolverlos mediante tokens semánticos en CSS.',
      content: `## Por qué un acento bonito para botones falla en enlaces de texto

Al construir sistemas de diseño con soporte dual para **modo oscuro** y **modo claro**, es extremadamente común elegir un color de marca vibrante —por ejemplo, cian eléctrico o esmeralda brillante— y reutilizar exactamente el mismo código hexadecimal tanto en fondos de botones con texto blanco como en enlaces pequeños sobre fondos claros.

Durante nuestras auditorías automáticas con **Google Lighthouse**, detectamos exactamente ese patrón: un tono \`#10b981\` luce legible sobre fondo oscuro \`#0a0f18\`, pero sobre blanco puro \`#ffffff\` apenas alcanza una relación de contraste cercana a \`2.5:1\`, quedando muy por debajo del umbral **WCAG AA de \`4.5:1\`** exigido para texto normal.

## Solución mediante tokens de propósito en CSS

En lugar de asignar colores genéricos por matiz, definimos variables CSS separadas según su función óptica en ambos temas:

- **\`--accent\`:** reservado para bordes suaves, indicadores gráficos grandes y botones rellenos de alto impacto visual.
- **\`--accent-text\`:** calibrado específicamente por contraste matemático (\`#047857\` sobre fondo claro y \`#34d399\` sobre fondo oscuro) para garantizar lectura cómoda en enlaces, migas de pan, categorías y etiquetas pequeñas.
- **Orden jerárquico de encabezados (\`h1\` -> \`h2\` -> \`h3\`):** evitar saltos arbitrarios de \`<h1>\` directo a \`<h4>\` permite tanto a lectores de pantalla como a herramientas de auditoría interpretar la estructura editorial sin ambigüedades, llevando la puntuación de **Accesibilidad de Lighthouse a 100/100**.`
    },
    en: {
      title: 'Practical WCAG AA Accessibility: Dual-Theme Contrast Tokens and 100/100 Lighthouse Audits',
      category: 'UI Design & Accessibility',
      excerpt:
        'Resolving subtle contrast failures on vibrant brand accents across light and dark themes using semantic CSS tokens and strict heading hierarchies.',
      content: `## Why one brand hex color rarely works in both themes

A vivid cyan or emerald accent (\`#10b981\`) often reads clearly on dark surfaces yet drops below a \`2.6:1\` contrast ratio on white backgrounds—failing the **4.5:1 WCAG AA** requirement for body links and metadata labels.

## Purpose-driven CSS contrast tokens

- Separate **\`--accent\`** (surfaces, badges, large UI indicators) from **\`--accent-text\`** (calibrated \`>= 4.5:1\` ink for light and dark themes independently).
- Enforce sequential heading levels (\`h1 -> h2 -> h3\`) and meaningful button labels so automated **Lighthouse** audits achieve **100/100 Accessibility** alongside better human readability.`
    }
  },
  {
    slug: 'calculadora-remuneraciones-cas-dl728-peru-logica',
    publishedAt: '2026-11-12',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 8,
    tags: ['TypeScript', 'Perú', 'Legislación Laboral', 'CAS', 'Finanzas'],
    relatedProjectSlug: 'chamba-pro',
    relatedProjectName: 'Chamba Pro',
    es: {
      title: 'Ingeniería de reglas laborales en TypeScript: cálculo neto para regímenes CAS, D.L. 728 y UIT en Perú',
      category: 'Lógica de Dominio & Producto',
      excerpt:
        'Cómo modelar descuentos de AFP/ONP, impuesto a la renta de quinta categoría por tramos progresivos de UIT, EsSalud y gratificaciones de forma transparente y verificable.',
      content: `## Traducir normativa laboral compleja a software claro para postulantes

Cuando un profesional en Perú evalúa una convocatoria pública bajo régimen **CAS (D.L. 1057)** frente a una oferta privada en planilla **D.L. 728**, comparar únicamente el sueldo bruto publicado induce a errores importantes de decisión: cambian el derecho a gratificaciones de julio y diciembre, la **CTS**, los aguinaldos estatales de **S/ 300**, la bonificación extraordinaria y las retenciones previsionales o tributarias.

Dentro de las herramientas de **chamba.atpdev.dev**, modelamos estas reglas en funciones puras de **TypeScript** desglosadas paso a paso para que cualquier usuario entienda exactamente de dónde sale su sueldo neto mensual y su ingreso anualizado real.

## Desglose modular de reglas tributarias y previsionales

Nuestra lógica separa parámetros oficiales actualizables por ejercicio fiscal de las fórmulas de cálculo:

- **Parámetros anuales centralizados:** valor oficial de la **UIT** vigente, tope de **EsSalud** en contratos CAS y tasas de comisión sobre flujo / prima de seguro / aporte obligatorio (**10 %**) según sistema pensionario (**ONP 13 %** o **AFP**: Integra, Prima, Profuturo, Hábitat).
- **Tramos progresivos de Impuesto a la Renta de Quinta Categoría:** el cálculo proyecta la remuneración anual (considerando 12 sueldos en CAS frente a 14 en D.L. 728), deduce **7 UIT** fijas de inafectación legal y aplica escalonadamente las tasas de **8 %**, **14 %**, **17 %**, **20 %** y **30 %** sobre el exceso en cada tramo, dividiendo el resultado mensual de manera transparente.
- **Comparación anualizada honesta:** más allá del monto mensual en boleta, la herramienta contrasta compensación total anual incluyendo CTS y gratificaciones legales —ayudando al postulante a tomar decisiones informadas antes de postular.`
    },
    en: {
      title: 'Encoding Peruvian Payroll Rules in TypeScript: CAS, D.L. 728, AFP/ONP, and Progressive UIT Tax',
      category: 'Domain Logic & Product',
      excerpt:
        'Structuring pure TypeScript calculators for public CAS contracts vs. private D.L. 728 payrolls, pension deductions, and progressive 5ta Categoría income tax brackets.',
      content: `## Comparing public CAS offers against private payroll accurately

Comparing raw gross monthly salaries between a Peruvian public **CAS (D.L. 1057)** tender and a private **D.L. 728** role overlooks major structural differences: 12 monthly payments plus modest holiday stipends versus 14 salaries, **CTS** severance deposits, and extraordinary bonuses.

## Modular domain formulas in pure TypeScript

- **Versioned fiscal constants:** Annual **UIT** reference units, **ONP (13%)** vs. **AFP** mandatory/insurance/commission rates, and CAS EsSalud caps live in explicit config tables.
- **Progressive tax engine:** Annualized compensation deducts the statutory **7 UIT** allowance before applying progressive **8%, 14%, 17%, 20%, and 30%** brackets clearly step by step so candidates see exact monthly net take-home pay.`
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
