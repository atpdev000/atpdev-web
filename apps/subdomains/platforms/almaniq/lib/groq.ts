import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_groq_key_for_build',
})

export interface Frame {
  frame_prompt: string
  animation_prompt: string
}

export interface Scene {
  time_range: string
  title: string
  narration: string
  frames?: Frame[]
  // Fallback para tipos antiguos
  image_prompt?: string
  animation_prompt?: string
  image_url?: string
}

export interface VideoScript {
  format: string
  duration_seconds: number
  tone: string
}

export interface GeneratedContent {
  video_script: VideoScript
  character_anchor: string
  copilot_cover_prompt?: string
  social_media_post?: string
  scenes: Scene[]
}

/**
 * Genera el guion de video completo, prompts de imagen y prompts de animación
 * para una noticia viral o efeméride usando Groq (Llama).
 */
export async function generateDailyContent(topicText: string, type: 'trend' | 'ephemeris', duration: 'corta' | 'larga' = 'larga', category?: string): Promise<GeneratedContent> {
  let dateInstructions = '';
  let contentIdentity = '';
  
  if (type === 'ephemeris') {
    const allDates = [...topicText.matchAll(/(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})/gi)]
    const fechaExplicita = allDates.length > 0 ? allDates[0][1] : ''
    const todasFechas = allDates.map(m => m[1]).join(', ')
    
    contentIdentity = 'Eres guionista y director de arte de un canal de curiosidades, historia mundial y eventos fascinantes para TikTok/YouTube Shorts llamado "Almaniq". Tu objetivo es contar un acontecimiento histórico impactante como si fuera una película de suspenso o un documental atrapante.';
    
    if (fechaExplicita) {
      dateInstructions = `
⚠️ INSTRUCCIÓN CRÍTICA SOBRE FECHAS:
La efeméride menciona estas fechas: ${todasFechas}
La fecha PRINCIPAL del evento es: "${fechaExplicita}" (la PRIMERA fecha mencionada)
DEBES usar "${fechaExplicita}" en el social_media_post y en copilot_cover_prompt.
Si la historia menciona múltiples eventos con distintas fechas, el evento PRINCIPAL es el que ocurrió el ${fechaExplicita}.
NO uses ninguna otra fecha del texto. NO uses la fecha de hoy.
`;
    }
  } else {
    // Es una tendencia o noticia actual
    contentIdentity = 'Eres un periodista viral y creador de contenido dinámico para un canal de curiosidades y tendencias de última hora llamado "Almaniq". Tu objetivo es contar una noticia actual o tendencia global de forma urgente, interesante y con un ritmo rápido para retener la atención.';
    dateInstructions = `
⚠️ INSTRUCCIÓN CRÍTICA:
Esto es una NOTICIA ACTUAL o TENDENCIA. No es un evento del pasado remoto.
En el "copilot_cover_prompt", para el campo 'fecha_historica' pon la palabra "ÚLTIMA HORA" o "TENDENCIA".
En el social_media_post NO inventes una fecha histórica. Escribe "🚨 TENDENCIA ACTUAL".
`;
  }

    if (category) {
      contentIdentity += ` ENFOCA ESTA NOTICIA O EFEMÉRIDE EXCLUSIVAMENTE DESDE EL ÁNGULO DE LA CATEGORÍA: "${category.toUpperCase()}". Si el tema no parece encajar a primera vista, encuentra la conexión oculta (ej. si el tema es fútbol y la categoría es tecnología, habla de la tecnología detrás de los estadios o balones).`;
    }

  const targetScenes = duration === 'corta' ? 3 : 5;
  const targetDurationText = duration === 'corta' ? "1 minuto (60 segundos)" : "2 minutos y 5 segundos (125 segundos)";
  const narrationLength = duration === 'corta' ? "55 y 65" : "70 y 85";
  const framesPerScene = duration === 'corta' ? 4 : 5;
  const totalFrames = duration === 'corta' ? 12 : 25;

  const prompt = `${contentIdentity}

Tema de hoy:
"${topicText}"
${dateInstructions}
Genera la siguiente estructura EXACTA en JSON (sin texto adicional fuera del JSON):

{
  "video_script": {
    "format": "9:16",
    "duration_seconds": ${duration === 'corta' ? 60 : 125},
    "tone": "descripción del tono general (misterioso, urgente, documental, etc)"
  },
  "character_anchor": "Descripción muy detallada del personaje principal o el entorno principal (ej: Un periodista de investigación en una redacción oscura iluminada por monitores, o un entorno cinemático relevante a la noticia). ESTO ES CRUCIAL PARA LA COHERENCIA VISUAL.",
  "copilot_cover_prompt": "Rellena SOLO las cuatro partes variables de la plantilla maestra de portada. CRÍTICO: devuelve un JSON dentro de este campo con esta forma exacta: { fecha_historica: '[FECHA_O_TENDENCIA]', titulo_principal: '[TÍTULO CORTO Y VIRAL, máx 70 caracteres]', subtitulo: '[DESCRIPCIÓN BREVE DEL IMPACTO, máx 120 caracteres]', elemento_visual: '[PERSONA, LUGAR, OBJETO O SUCESO representativo]' }. Usa comillas simples dentro del JSON para evitar conflictos.",
  "social_media_post": "Actúa como Director de Contenido de Almaniq. Crea TRES (3) versiones de publicación. REGLAS CRÍTICAS: ES ESTRICTAMENTE OBLIGATORIO USAR UN MÁXIMO DE 5 HASHTAGS POR RED SOCIAL. ESTRUCTURA OBLIGATORIA EXACTA (respeta los saltos de línea):\\n=== 📱 FACEBOOK ===\\n🚀 Almaniq | Lo que está en boca de todos\\n📅 [FECHA O TENDENCIA]\\n[Texto de 1 o 2 párrafos máximo con gancho]\\n🌍 Más historias fascinantes: https://almaniq.atpdev.dev\\n[MÁXIMO 5 HASHTAGS (ej: #Almaniq #Tendencias + 3)]\\n=== 🎵 TIKTOK ===\\nTítulos:\\n[3 ideas de títulos SEO virales separados por comas, ej: SEO fácil, Descubre el secreto]\\nHashtags:\\n[MÁXIMO 5 HASHTAGS VIRALES (ej: #fyp #viral #Almaniq + 2)]\\nGancho:\\n[Pregunta o frase muy corta y brutal para captar la atención los primeros 3 segundos]\\nGuion:\\nIntroducción:\\n	Captura atención desde el principio.\\n	Guion: \\"[Primera línea muy atractiva y enganchadora que resume el video]\\"\\n=== ▶️ YOUTUBE COMMUNITY ===\\n🚀 Almaniq | Dato Impactante\\n📅 [FECHA O TENDENCIA]\\n[Curiosidad rápida]\\n📺 ¡No te pierdas los nuevos videos en el canal!\\n🌐 Visita: https://almaniq.atpdev.dev\\n[MÁXIMO 5 HASHTAGS]",
  "scenes": [
    {
      "time_range": "0:00-0:20",
      "title": "nombre de la escena 1",
      "narration": "texto exacto que dirá el narrador durante esta escena",
      "frames": [
        {
          "frame_prompt": "prompt específico para el fotograma 1. DEBE incluir siempre al 'character_anchor' haciendo una acción específica. Formato vertical 9:16. Sin texto.",
          "animation_prompt": "prompt de movimiento para animar en Kling/Meta AI (movimiento de cámara, gestos suaves)"
        }
        // ... DEBES generar exactamente ${framesPerScene} objetos en 'frames' para cada escena
      ]
    }
    // ... DEBES generar exactamente ${targetScenes} escenas
  ]
}

Reglas:
- Genera EXACTAMENTE ${targetScenes} escenas.
- Cada escena DEBE tener EXACTAMENTE ${framesPerScene} objetos en la lista "frames". (Total: ${totalFrames} fotogramas, ${targetDurationText} de duración).
- MUY IMPORTANTE: La "narration" de CADA escena DEBE tener EXACTAMENTE entre ${narrationLength} palabras para garantizar la duración correcta. ESTO ES CRÍTICO.
- El hook de la escena 1 NO debe ser aburrido. Arranca con una frase impactante, urgente o un misterio.
- Cierra la última escena con una pregunta para generar comentarios.
- Los frame_prompt deben ser altamente descriptivos e INCLUIR SIEMPRE los rasgos visuales del character_anchor para mantener la coherencia.`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 8192,
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('Groq returned empty response')
  }

  const parsed = JSON.parse(content) as GeneratedContent

  if (!parsed.video_script || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error('Invalid response structure from Groq')
  }

  return parsed
}

/**
 * Genera una efeméride histórica MUNDIAL (cualquier tema importante) para una fecha específica
 * cuando no existe en la base de datos o se fuerza como post principal.
 */
export async function generateMissingEphemeris(dateString: string): Promise<{ event: string, historical_year: number }> {
  const dateObj = new Date(`${dateString}T12:00:00`);
  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = dateObj.getDate();
  const month = monthNames[dateObj.getMonth()];
  
  const prompt = `Actúa como un erudito de la historia universal y la cultura pop.
Dime el acontecimiento histórico más impactante, curioso o importante de toda la historia mundial que haya ocurrido un ${day} de ${month} (en cualquier año del pasado).
Puede ser de política, ciencia, crímenes históricos, misterios, exploración espacial, desastres, nacimientos de genios, o cultura pop que cambió el mundo.
Debe ser una historia sumamente interesante para un video viral.

Devuelve EXACTAMENTE un JSON con este formato (sin texto extra):
{
  "historical_year": AÑO_EN_QUE_OCURRIÓ (en formato número de 4 dígitos),
  "event": "Descripción detallada del evento, el impacto masivo que tuvo en el mundo y el detalle más curioso o desconocido de la historia. (Máximo 2 párrafos)"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 1024,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Groq returned empty response for missing ephemeris');
  
  const parsed = JSON.parse(content);
  return {
    event: parsed.event,
    historical_year: parsed.historical_year
  };
}
