import { NextRequest, NextResponse } from 'next/server';

interface OutlinePage {
  pageNumber: number;
  title: string;
  prompt: string;
}

interface OutlineResponse {
  bookTitle: string;
  subtitle: string;
  backBlurb: string;
  keywords: string[];
  pages: OutlinePage[];
  provider: string;
}

function buildFallbackOutline(topic: string, ageGroup: string, style: string, count: number): OutlineResponse {
  const cleanTopic = topic.trim() || 'Animales Tiernos del Bosque';
  const scenes = [
    'jugando alegremente en un prado con flores grandes',
    'durmiendo tranquilo bajo la luna y estrellas',
    'celebrando con un pastel de cumpleaños y globos',
    'leyendo un libro gigante sentado en un cojín',
    'navegando en un pequeño bote de papel por un río',
    'cocinando galletas con un gorro de chef',
    'regando macetas en un jardín soleado',
    'haciendo un picnic con frutas y canasta',
    'volando una cometa en una colina con nubes',
    'tocando música con instrumentos sencillos',
    'construyendo un castillo de bloques de madera',
    'pintando un cuadro en un caballete',
    'observando mariposas grandes en el parque',
    'paseando en bicicleta con una canasta llena de flores',
    'armando un muñeco de nieve con bufanda',
    'explorando con una lupa hojas y caracoles',
    'tomando chocolate caliente junto a una ventana acogedora',
    'saltando en charcos con botas de lluvia',
    'mirando las estrellas con un telescopio',
    'abrazando un peluche gigante sobre una alfombra',
  ];

  const pages: OutlinePage[] = Array.from({ length: count }, (_, i) => {
    const scene = scenes[i % scenes.length];
    return {
      pageNumber: i + 1,
      title: `${cleanTopic} #${i + 1}`,
      prompt: `Coloring book page in ${style} style for ${ageGroup}: ${cleanTopic} ${scene}, pure black clean thick ink outlines, pure white background, no gray shading, no gradients, centered composition.`,
    };
  });

  return {
    bookTitle: `${cleanTopic}: Libro para Colorear`,
    subtitle: `${count} Ilustraciones ${style} para ${ageGroup} • Hojas Grandes sin Traspaso`,
    backBlurb: `Descubre ${count} ilustraciones originales sobre ${cleanTopic} diseñadas en estilo ${style} para ${ageGroup}. Cada dibujo presenta trazos gruesos, espacios amplios para colorear con plumones o lápices y reverso en blanco para proteger tus creaciones.`,
    keywords: [
      `libro para colorear ${cleanTopic.toLowerCase()}`,
      'dibujos para colorear infantiles',
      'bold and easy coloring book',
      'cuaderno de actividades niños',
      'regalo creativo para colorear',
      'ilustraciones grandes trazos gruesos',
      'colorear sin traspaso kdp',
    ],
    pages,
    provider: 'planificador-local',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const topic = String(body.topic || '').trim().slice(0, 120);
    const ageGroup = String(body.ageGroup || 'Niños de 4 a 8 años').trim().slice(0, 60);
    const style = String(body.style || 'Kawaii Bold & Easy').trim().slice(0, 60);
    const language = String(body.language || 'Español').trim().slice(0, 30);
    const count = Math.max(4, Math.min(40, Number(body.pageCount) || 12));

    if (!topic) {
      return NextResponse.json(
        { error: 'Escribe una temática o nicho para planificar tu libro.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash';

    if (apiKey) {
      try {
        const promptText = `Actúa como editor experto de libros para colorear en Amazon KDP.
Crea la estructura comercial de un libro para colorear sobre: "${topic}".
Público objetivo: ${ageGroup}.
Estilo visual: ${style}.
Idioma del título, subtítulo, descripción y títulos de página: ${language}.
Cantidad exacta de páginas a generar: ${count}.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones) con esta estructura exacta:
{
  "bookTitle": "Título atractivo y vendible",
  "subtitle": "Subtítulo optimizado para Amazon KDP",
  "backBlurb": "Descripción de contraportada de 45-70 palabras clara y persuasiva",
  "keywords": ["7 palabras clave long-tail para KDP"],
  "pages": [
    {
      "pageNumber": 1,
      "title": "Nombre corto de la escena en ${language}",
      "prompt": "Prompt en inglés conciso y visual para generar la ilustración en blanco y negro estilo ${style}, thick clean black outlines, pure white background, no shading, no text"
    }
  ]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.75,
                responseMimeType: 'application/json',
              },
            }),
            signal: AbortSignal.timeout(25000),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
          const parsed = JSON.parse(cleaned);
          if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
            return NextResponse.json({
              bookTitle: String(parsed.bookTitle || `${topic}: Libro para Colorear`),
              subtitle: String(parsed.subtitle || `${count} Ilustraciones ${style}`),
              backBlurb: String(parsed.backBlurb || ''),
              keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 7).map(String) : [],
              pages: parsed.pages.slice(0, count).map((p: any, idx: number) => ({
                pageNumber: idx + 1,
                title: String(p.title || `Ilustración ${idx + 1}`),
                prompt: String(p.prompt || `${topic} scene ${idx + 1}`),
              })),
              provider: model,
            });
          }
        }
      } catch (err) {
        console.warn('[generate-outline] Fallback activado:', err);
      }
    }

    return NextResponse.json(buildFallbackOutline(topic, ageGroup, style, count));
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error al planificar el libro.' },
      { status: 500 }
    );
  }
}

