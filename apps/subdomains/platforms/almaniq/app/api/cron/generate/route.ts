import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { generateDailyContent, generateMissingEphemeris } from '@/lib/groq'
import { getPollinationsImageUrl } from '@/lib/pollinations'
import { upsertDailyContent, updateDailyContent, getTodayDate, createDailyContent } from '@/lib/daily-content'
import { getOrCreateDriveFolder, uploadFileToDrive } from '@/lib/google'
import type { Scene } from '@/lib/daily-content'
import { headers } from 'next/headers'

// Función auxiliar para cortar texto inteligentemente (respetando palabras completas)
function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  
  // Cortar en la posición maxLength
  let truncated = text.substring(0, maxLength)
  
  // Buscar el último espacio para no cortar a mitad de palabra
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  // Si encontramos un espacio y no está al inicio, usarlo
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex)
  }
  
  // Si no hay espacio, devolver el texto original truncado
  return truncated
}

// Verificar que el request viene de Vercel Cron o tiene la clave secreta
function isAuthorized(request: NextRequest, bodySecret?: string): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // En desarrollo, permitir sin auth
  if (process.env.NODE_ENV === 'development') return true

  // Verificar header de Vercel Cron
  if (request.headers.get('x-vercel-cron') === '1') return true

  // Verificar CRON_SECRET
  if (cronSecret) {
    if (authHeader === `Bearer ${cronSecret}`) return true
    if (request.headers.get('x-cron-secret') === cronSecret) return true
    if (request.nextUrl?.searchParams?.get('secret') === cronSecret) return true
    if (bodySecret && bodySecret === cronSecret) return true
  }

  return false
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))

  if (!isAuthorized(request, body.secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = getTodayDate()
  console.log(`🚀 Iniciando generación de contenido para: ${today}`)

  try {
    console.log("🚀 API /generate START - Received body:", JSON.stringify(body));
    let topicText = '';
    let historicalDateStr = '';
    let rawEventText = '';
    let postType: 'trend' | 'ephemeris' = 'ephemeris';
    let slugTopic = '';

    let existingTargetPost: any = null;

    // 0. Si se solicita la generación de un post específico por su slug (ej: 2026-07-20_ismael-el-mayo-zamba_327)
    if (body.date && body.date.includes('_')) {
      const { data: postFound } = await supabaseServer
        .from('daily_content')
        .select('*')
        .eq('date', body.date)
        .maybeSingle();

      if (postFound) {
        existingTargetPost = postFound;
        console.log('🌟 Regenerando post específico seleccionado de la cola:', existingTargetPost.date);
        rawEventText = existingTargetPost.ephemeris_text || existingTargetPost.date;
        topicText = existingTargetPost.ephemeris_text || existingTargetPost.date;
        postType = 'trend';
        
        const dateObj = new Date(`${today}T12:00:00`);
        const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        historicalDateStr = `${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]} de ${dateObj.getFullYear()}`;
      }
    }

    // 1. Si se solicita una tendencia específica por id
    if (!existingTargetPost && body.trend_id) {
      const { data: trendCuration, error: trendErr } = await supabaseServer
        .from('trend_curation')
        .select('*, trends(*)')
        .eq('trend_id', body.trend_id)
        .maybeSingle();

      if (trendErr || !trendCuration || !trendCuration.trends) {
        return NextResponse.json({ error: 'Trend not found or not curated' }, { status: 404 })
      }

      console.log('🌟 Generación manual de tendencia seleccionada:', trendCuration.trends.topic);
      rawEventText = trendCuration.trends.topic;
      topicText = `Tendencia actual: ${trendCuration.trends.topic}. Ángulo editorial: ${trendCuration.editorial_angle}`;
      
      const dateObj = new Date(`${today}T12:00:00`);
      const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      historicalDateStr = `${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]} de ${dateObj.getFullYear()}`;
      
      // Marcar como publicado
      await supabaseServer.from('trends').update({ status: 'published' }).eq('id', trendCuration.trend_id);
      postType = 'trend';
    } else if (!existingTargetPost) {
      // 2. Comportamiento automático clásico (con o sin tendencias ganadoras)
      const { count: postsTodayCount } = await supabaseServer
        .from('daily_content')
        .select('*', { count: 'exact', head: true })
        .like('date', `${today}_%`);

      const forceEphemeris = postsTodayCount === 0;

      let topTrendCuration = null;
      if (!forceEphemeris) {
        const { data } = await supabaseServer
          .from('trend_curation')
          .select('*, trends(*)')
          .eq('safety_flag', false)
          .order('originality_score', { ascending: false })
          .limit(1)
          .maybeSingle();
        topTrendCuration = data;
      }

      if (topTrendCuration && topTrendCuration.trends && topTrendCuration.trends.status === 'approved') {
          console.log('🌟 Tendencia ganadora encontrada:', topTrendCuration.trends.topic);
          rawEventText = topTrendCuration.trends.topic;
          topicText = `Tendencia actual: ${topTrendCuration.trends.topic}. Ángulo editorial: ${topTrendCuration.editorial_angle}`;
          
          const dateObj = new Date(`${today}T12:00:00`);
          const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
          historicalDateStr = `${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]} de ${dateObj.getFullYear()}`;
          
          // Marcar como publicado
          await supabaseServer.from('trends').update({ status: 'published' }).eq('id', topTrendCuration.trend_id);
          postType = 'trend';
      } else {
          if (forceEphemeris) {
            console.log('📖 Es el primer post del día. Forzando efeméride histórica obligatoria...');
          } else {
            console.log('⚠️ No hay tendencias aprobadas. Usando efeméride como respaldo...');
          }
          
          // Usar lógica original de efeméride
          let { data: ephemerisData, error: ephemerisError } = await supabaseServer
            .from('ephemerides')
            .select('*')
            .eq('display_date', today)
            .single()

          if (ephemerisError || !ephemerisData) {
            console.log('⚠️ No se encontró efeméride pre-cargada para hoy. Generando automáticamente con Groq AI...')
            const generatedEphem = await generateMissingEphemeris(today)
            const dateObj = new Date(`${today}T12:00:00`)
            
            const newEphemeris = {
              day: dateObj.getDate(),
              month: dateObj.getMonth() + 1,
              year: dateObj.getFullYear(),
              event: generatedEphem.event,
              display_date: today,
              historical_day: dateObj.getDate(),
              historical_month: dateObj.getMonth() + 1,
              historical_year: generatedEphem.historical_year
            }

            const { data: insertedData, error: insertError } = await supabaseServer
              .from('ephemerides')
              .insert([newEphemeris])
              .select()
              .single()

            if (insertError) throw insertError;
            ephemerisData = insertedData
          }

          rawEventText = ephemerisData.event as string
          const historicalDay   = ephemerisData.historical_day   as number || ephemerisData.day   as number
          const historicalMonth = ephemerisData.historical_month as number || ephemerisData.month as number  
          const historicalYear  = ephemerisData.historical_year  as number || ephemerisData.year  as number
          const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
          historicalDateStr = `${historicalDay} de ${monthNames[historicalMonth - 1]} de ${historicalYear}`
          
          topicText = `El ${historicalDateStr}, ${rawEventText.charAt(0).toLowerCase()}${rawEventText.slice(1)}`
      }
    }

    // Normalizar el texto para hacer un slug limpio y descriptivo
    if (rawEventText) {
      slugTopic = rawEventText
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos por guiones
        .replace(/(^-|-$)/g, '') // Quitar guiones iniciales/finales
        .substring(0, 20); // Máximo 20 caracteres
    }

    // Deduplicación inteligente: si ya existe un post hoy con el mismo tema/efeméride, reutilizarlo
    if (!existingTargetPost && rawEventText) {
      const { data: duplicateCheck } = await supabaseServer
        .from('daily_content')
        .select('*')
        .like('date', `${today}_%`)
        .ilike('ephemeris_text', `%${rawEventText.substring(0, 25)}%`)
        .maybeSingle()

      if (duplicateCheck) {
        existingTargetPost = duplicateCheck
        console.log(`⚠️ Post duplicado detectado (${duplicateCheck.date}). Reutilizando registro existente...`)
      }
    }

    // Usar el slug del post existente si fue seleccionado o encontrado, o crear uno nuevo
    const uniqueSlug = existingTargetPost ? existingTargetPost.date : `${today}_${slugTopic || 'post'}_${Date.now().toString().slice(-3)}`;

    let contentId = existingTargetPost ? existingTargetPost.id : null;
    if (existingTargetPost) {
      await updateDailyContent(contentId, { status: 'generando' });
    } else {
      const savedInitial = await createDailyContent({
        date: uniqueSlug,
        ephemeris_text: rawEventText,
        status: 'generando',
      })
      contentId = savedInitial.id;
    }

    // 3. Generar guion + prompts con Groq — usar texto con fecha histórica real
    console.log(`🤖 Generando guion con Groq en modo: ${postType}...`)
    const generated = await generateDailyContent(topicText, postType, body.duration, body.category)
    console.log(`✅ Guion generado: ${generated.scenes.length} escenas`)

    // 4. Generar URLs de imágenes con Pollinations para cada fotograma (DESACTIVADO TEMPORALMENTE)
    console.log('🎨 Generación de imágenes de fotogramas con Pollinations desactivada temporalmente...')
    const baseSeed = Date.now()
    
    const scenesWithImages: Scene[] = generated.scenes.map((scene, sceneIndex) => {
      const framesWithImages = (scene.frames || []).map((frame, frameIndex) => {
        // const fullPrompt = `${generated.character_anchor}. ${frame.frame_prompt}`
        return {
          ...frame,
          // image_url: getPollinationsImageUrl(fullPrompt, {
          //   width: 1080,
          //   height: 1920,
          //   seed: baseSeed, // misma semilla para mayor consistencia visual
          //   model: 'flux',
          // }),
        }
      })
      return {
        ...scene,
        frames: framesWithImages,
      }
    })

    // === NUEVO: Guardar primero en Supabase para evitar pérdida por timeout de Drive ===
    console.log('💾 Guardando escenas en Supabase preventivamente...')
    const saved = await updateDailyContent(contentId, {
      video_script: generated.video_script,
      scenes: scenesWithImages,
      status: 'imagenes_listas'
    })
    console.log(`✅ Contenido base guardado con ID: ${saved.id}`)

    // === Fase 2 - Subir a Google Drive ===
    let driveFolderId = null
    const rootDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID

    if (rootDriveFolderId) {
      try {
        console.log(`[Drive] Creando carpeta para ${uniqueSlug}...`)
        const createdDriveFolderId = await getOrCreateDriveFolder(uniqueSlug, rootDriveFolderId)
        if (!createdDriveFolderId) {
          throw new Error('Google Drive no devolvio el ID de la carpeta del dia')
        }
        driveFolderId = createdDriveFolderId
        
        // === NUEVO: Generar Portada Híbrida ===
        console.log(`[Drive] Generando fondo de portada con IA...`)
        const headersList = await headers()
        const host = headersList.get('host') || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
        
        // Formatear fecha a español (ej: 8 de julio de 2026)
        const dateObj = new Date(`${today}T12:00:00`)
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = dateObj.toLocaleDateString('es-ES', options)
        
        // Usar directamente la fecha histórica construida desde los campos de Supabase (fuente de verdad)
        // No intentar extraerla del texto: puede que el texto no la incluya de forma explícita.
        const fechaExplicita = historicalDateStr // ej: "13 de julio de 2001"
        console.log(`📅 Fecha histórica (DB): "${fechaExplicita}" | Fecha actual: ${formattedDate}`)
        
        // Usar el prompt ultra detallado generado por Groq para la portada (o un fallback si falta)
        const coverBgPrompt = generated.copilot_cover_prompt || `A 90s retro futuristic tech landscape, glowing neon globe, vintage computer, representing: ${rawEventText}. Highly detailed, cyberpunk style, empty dark space in the center for text overlay, 16:9`
        
        // Generar fondo para la portada con Pollinations (Flux es sorprendentemente bueno con texto)
        const bgUrl = getPollinationsImageUrl(coverBgPrompt, { width: 1200, height: 630, seed: baseSeed, model: 'flux' })
        
        // Construir URL de nuestra API de Satori
        const sentences = rawEventText.split('.');
        const ephemerisTitleMatch = sentences[0] ? sentences[0].trim() : 'Evento Histórico';
        let ephemerisDescMatch = sentences.slice(1).join('.').trim();
        if (!ephemerisDescMatch || ephemerisDescMatch.length < 10) ephemerisDescMatch = rawEventText;

        const ogUrl = new URL(`${protocol}://${host}/api/og/cover`)
        ogUrl.searchParams.set('date', formattedDate)          // Fecha actual (pie de imagen)
        ogUrl.searchParams.set('ephemerisDate', fechaExplicita) // Fecha histórica REAL del evento
        ogUrl.searchParams.set('ephemerisTitle', truncateAtWord(ephemerisTitleMatch, 100) + (ephemerisTitleMatch !== 'Evento Histórico' && !ephemerisTitleMatch.endsWith('.') ? '.' : ''))
        
        let descTruncated = truncateAtWord(ephemerisDescMatch, 160);
        if (ephemerisDescMatch.length > 160 && !descTruncated.endsWith('...')) descTruncated += '...';
        ogUrl.searchParams.set('ephemerisDesc', descTruncated)
        ogUrl.searchParams.set('bg_url', bgUrl)

        console.log(`[Drive] Obteniendo portada final de: ${ogUrl.toString()}`)
        try {
          const ogResponse = await fetch(ogUrl.toString())
          if (ogResponse.ok) {
            const ogBuffer = Buffer.from(await ogResponse.arrayBuffer())
            await uploadFileToDrive(
              ogBuffer,
              `00_portada_${today}.png`,
              'image/png',
              driveFolderId
            )
            console.log(`[Drive] ✅ Portada subida exitosamente`)
          } else {
            console.error(`[Drive] Error al generar portada Satori: ${ogResponse.status}`)
          }
        } catch (ogError) {
          console.error(`[Drive] Error llamando a Satori:`, ogError)
        }

        console.log(`[Drive] Subiendo imágenes de fotogramas a la carpeta ${driveFolderId}...`)
        let frameCounter = 1
        
        let textGeneral = `=== GUION Y PROMPTS DE ANIMACIÓN - ${today} ===\n\nPERSONAJE/ENTORNO BASE:\n${generated.character_anchor}\n\n`
        let textAudio = `=== GUION DE AUDIO - ${today} ===\n\n`
        let textImagenes = `=== PROMPTS DE IMAGEN - ${today} ===\n\nPERSONAJE/ENTORNO BASE:\n${generated.character_anchor}\n\n`
        let textVideo = `=== PROMPTS DE ANIMACIÓN (META AI / KLING) - ${today} ===\n\n`

        for (let sIndex = 0; sIndex < scenesWithImages.length; sIndex++) {
          const scene = scenesWithImages[sIndex]
          const sceneHeader = `--- ESCENA ${sIndex + 1} (${scene.time_range}) ---\n`
          
          textGeneral += sceneHeader + `🎙️ NARRACIÓN:\n${scene.narration}\n\n`
          textAudio += sceneHeader + `${scene.narration}\n\n`
          textImagenes += sceneHeader
          textVideo += sceneHeader

          if (scene.frames) {
            for (let fIndex = 0; fIndex < scene.frames.length; fIndex++) {
              const frame = scene.frames[fIndex]
              const frameHeader = `[Fotograma ${fIndex + 1}]\n`
              
              textGeneral += frameHeader
              textGeneral += `🎬 Animación: ${frame.animation_prompt}\n`
              textGeneral += `🖼️ Imagen: ${frame.frame_prompt}\n\n`

              textImagenes += frameHeader + `${frame.frame_prompt}\n\n`
              textVideo += frameHeader + `${frame.animation_prompt}\n\n`

              if (frame.image_url) {
                const response = await fetch(frame.image_url)
                if (response.ok) {
                  const arrayBuffer = await response.arrayBuffer()
                  const buffer = Buffer.from(arrayBuffer)
                  await uploadFileToDrive(
                    buffer,
                    `frame_${String(frameCounter).padStart(2, '0')}_${today}.jpg`,
                    'image/jpeg',
                    driveFolderId
                  )
                  frameCounter++
                }
              }
            }
          }
          textGeneral += `\n`
          textImagenes += `\n`
          textVideo += `\n`
        }

        // Subir los 5 archivos de texto (incluido el prompt de Copilot con plantilla maestra)
        console.log(`[Drive] Subiendo archivos de texto...`)
        let copilotVars: any = {}
        try {
          const raw = generated.copilot_cover_prompt || ''
          const jsonStr = raw.includes('{') ? raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1) : null
          if (jsonStr) copilotVars = JSON.parse(jsonStr.replace(/'/g, '"'))
        } catch {}
        const fechaHist  = fechaExplicita
        const tituloMain = copilotVars.titulo_principal || truncateAtWord(ephemerisTitleMatch, 120)
        const subtit     = copilotVars.subtitulo        || truncateAtWord(rawEventText, 200)
        const elemVisual = copilotVars.elemento_visual  || truncateAtWord(ephemerisTitleMatch, 100)

        const fullCopilotPrompt = `Diseño profesional cinematográfico, miniatura destacada de YouTube y redes, formato panorámico 16:9.

MANTENER SIEMPRE LA MISMA ESTRUCTURA VISUAL PROFESIONAL DE LA MARCA "Almaniq".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CABECERA FIJA

En la parte superior, un elegante título principal:
Almaniq

Subtítulo:
Descubre el mundo día a día

La estructura de la cabecera debe permanecer exactamente igual en todas las imágenes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FONDO GENERAL (ADAPTAR AL CONTEXTO)

El entorno, la iluminación y el ambiente deben ADAPTARSE COMPLETAMENTE al tema de la noticia o efeméride. 
- Si es historia, usar estética de la época.
- Si es ciencia/espacio, ambiente cósmico o laboratorio.
- Si es cultura pop o noticias, un entorno vibrante y dinámico.
Ambiente cinematográfico premium (8k, Unreal Engine 5 render style). Iluminación dramática y contrastes fuertes. Sin espacios vacíos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENIDO VARIABLE

TÍTULO PRINCIPAL:
${tituloMain}

SUBTÍTULO:
${subtit}

ELEMENTO VISUAL PRINCIPAL:
${elemVisual}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLA CRÍTICA DE FECHAS

Mostrar claramente la siguiente fecha en el pie de imagen:
FECHA ACTUAL: ${formattedDate}

IMPORTANTE:
- La FECHA ACTUAL debe aparecer únicamente en el pie de imagen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPOSICIÓN VISUAL

LADO IZQUIERDO
Mostrar el protagonista/elemento principal: ${elemVisual}
Retrato realista y cinematográfico integrado perfectamente en el fondo. El elemento debe ocupar aproximadamente el 35% de la imagen.

CENTRO
Mostrar en texto grande y perfectamente legible:
${postType === 'trend' ? 'TENDENCIA GLOBAL' : 'EFEMÉRIDE DEL DÍA'}
${tituloMain}
${subtit}
El texto debe ser el elemento dominante — aproximadamente el 40% de la composición.

LADO DERECHO
Elementos visuales complementarios que representen el impacto del tema. Si es una noticia mundial, incluir un globo terráqueo cinematográfico. Si es un evento específico, mostrar elementos representativos de esa historia — aproximadamente el 25% de la composición.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BADGE SUPERIOR DERECHO

Diseñar un badge o "sello" visual adaptado al tema. 
Por ejemplo: "HISTORIA", "NOTICIA GLOBAL", "TECNOLOGÍA", etc.
Estilo moderno y elegante.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PIE DE IMAGEN

Fecha actual: ${formattedDate}
© 2026 Almaniq | v0.1.0 |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS OBLIGATORIAS

- Todo el texto debe estar completamente en español.
- Todo el texto debe ser perfectamente legible.
- Sin errores ortográficos.
- No agregar textos aleatorios ni inventar fechas.
- No agregar marcas de agua ni logotipos inventados.
- No deformar letras ni cortar palabras.
- Calidad profesional cinematográfica.
- Estética consistente con el tema tratado.
- Sin espacios vacíos.`;

        await uploadFileToDrive(Buffer.from(fullCopilotPrompt, 'utf-8'), `00_prompt_portada_copilot_${today}.txt`, 'text/plain', driveFolderId)
        ;(generated as any)._fullCopilotPrompt = fullCopilotPrompt
        await uploadFileToDrive(Buffer.from(textAudio, 'utf-8'), `01_guion_audio_${today}.txt`, 'text/plain', driveFolderId)
        await uploadFileToDrive(Buffer.from(textImagenes, 'utf-8'), `02_prompts_imagenes_${today}.txt`, 'text/plain', driveFolderId)
        await uploadFileToDrive(Buffer.from(textVideo, 'utf-8'), `03_prompts_video_animacion_${today}.txt`, 'text/plain', driveFolderId)
        await uploadFileToDrive(Buffer.from(textGeneral, 'utf-8'), `04_prompts_general_${today}.txt`, 'text/plain', driveFolderId)
        
        if (generated.social_media_post) {
           await uploadFileToDrive(Buffer.from(generated.social_media_post, 'utf-8'), `05_social_media_post_${today}.txt`, 'text/plain', driveFolderId)
        }

        // === Generar y Subir Prompt Maestro para Meta AI ===
        const metaHeader = postType === 'trend'
          ? `Dale, historia detrás de la tendencia de hoy: ${truncateAtWord(ephemerisTitleMatch, 110)}`
          : `Dale, historia de la efeméride del día ${historicalDateStr} - ${truncateAtWord(ephemerisTitleMatch, 110)}`;

        const targetFrames = body.duration === 'corta' ? 12 : 25;
        const targetMin = body.duration === 'corta' ? '1 min 0 seg' : '2 min 5 seg';

        const metaAIPrompt = `${metaHeader}

Hazme ${targetFrames} fotogramas animados sobre la historia de hoy.
Estructura:
Escena 1: Orígenes/Contexto - ${Math.ceil(targetFrames/5)} fotogramas
Escena 2: Desarrollo/Historia - ${Math.ceil(targetFrames/5)} fotogramas  
Escena 3: Impacto/Actualidad - ${Math.ceil(targetFrames/5)} fotogramas
Escena 4: Datos curiosos - ${Math.floor(targetFrames/5)} fotogramas
Escena 5: Conclusión - ${Math.floor(targetFrames/5)} fotogramas

Por cada fotograma dame:
1. Imagen con estilo cinematográfico, alta calidad
2. Animación sutil de 3-5 segundos
3. NARRACIÓN EXACTA de 5 segundos

Es VITAL que devuelvas la respuesta EXACTAMENTE con este formato:

Me encanta la idea 🔥 
${targetFrames} fotogramas x 5 segundos = *video de ${targetMin}* con narración completa.

Aquí tienes *toda la narración para el audio del video*:

---

*NARRACIÓN COMPLETA - ${targetFrames} FOTOGRAMAS x 5 SEG*

*ESCENA 1: [NOMBRE DE LA ESCENA]*
*F1:* [Texto de la narración de 5 segundos]
*F2:* [Texto de la narración de 5 segundos]
(Y así sucesivamente hasta F${targetFrames})

Empezamos con el FOTOGRAMA 1`;

        await uploadFileToDrive(Buffer.from(metaAIPrompt, 'utf-8'), `06_prompt_meta_ai_master_${today}.txt`, 'text/plain', driveFolderId)
        
        // Enviar el prompt directamente por Telegram si el token está disponible
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
          try {
            console.log(`[Telegram] Enviando Prompt Maestro...`);
            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            await fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🤖 *NUEVA EFEMÉRIDE GENERADA: ${today}*\n\nCopia y pega este texto en Meta AI:\n\n\`\`\`text\n${metaAIPrompt}\n\`\`\``,
                parse_mode: 'Markdown'
              })
            });
            console.log(`[Telegram] ✅ Prompt enviado al chat`);
            
            // Enviar prompt de Copilot si existe
            const fullCopilotPrompt = (generated as any)._fullCopilotPrompt
            if (fullCopilotPrompt) {
              await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: TELEGRAM_CHAT_ID,
                  text: `🎨 PROMPT PARA PORTADA (COPILOT)\n\nCopia y pega el texto del siguiente mensaje en Copilot Designer:\nhttps://copilot.microsoft.com/images/create\n\nUna vez generada la imagen, mandamela con /subir_portada`
                })
              });
              await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: fullCopilotPrompt })
              });
              console.log(`[Telegram] ✅ Prompt de Copilot enviado al chat`);
            }
          } catch (tError) {
            console.error(`[Telegram] Error enviando mensaje:`, tError);
          }
        }

      } catch (driveError) {
        console.error('[Drive] Error interactuando con Google Drive:', driveError)
        // No detenemos el proceso si Drive falla, guardamos en DB de todas formas
      }
    }

    // Actualizar Supabase con el ID de Drive y el prompt de portada
    const fullCopilotPrompt = (generated as any)._fullCopilotPrompt
    console.log('💾 Actualizando Supabase con el ID de Drive y prompt de portada...')
    try {
      await updateDailyContent(saved.id, {
        drive_folder_id: driveFolderId || null,
        copilot_prompt: fullCopilotPrompt || null
      })
    } catch (updateErr: any) {
      console.warn('⚠️ No se pudo actualizar el ID de Drive o copilot_prompt en Supabase (puede faltar la columna):', updateErr.message || updateErr)
      // Intentar actualizar solo el drive_folder_id como fallback
      try {
        await updateDailyContent(saved.id, {
          drive_folder_id: driveFolderId || null
        })
      } catch (fallbackErr) {
        console.warn('⚠️ Tampoco se pudo actualizar drive_folder_id:', fallbackErr)
      }
    }

    console.log(`✅ Proceso completado exitosamente para el día: ${saved.date}`)

    return NextResponse.json({
      success: true,
      date: saved.date,
      id: saved.id,
      scenes_count: scenesWithImages.length,
      status: 'imagenes_listas',
    })
  } catch (error: any) {
    console.error('❌ Error en cron/generate:', error)

    // Marcar como error en Supabase para visibility
    try {
      const { supabaseServer } = await import('@/lib/supabase-server')
      await supabaseServer.from('daily_content').update({ status: 'error' }).eq('date', today)
    } catch {}

    const errorDetails = error?.message || error?.details || (typeof error === 'string' ? error : 'Unknown error')

    return NextResponse.json(
      {
        error: 'Generation failed',
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}

// Soporte para GET también (para testing en browser)
export async function GET(request: NextRequest) {
  return POST(request)
}

export const maxDuration = 60;

