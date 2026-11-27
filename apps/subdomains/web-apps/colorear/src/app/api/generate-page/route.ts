import { NextRequest, NextResponse } from 'next/server';

const STYLE_MODIFIERS: Record<string, string> = {
  kawaii: 'cute kawaii bold and easy style, very thick uniform black outlines, simple charming shapes, cozy storybook look',
  infantil: 'simple preschool children coloring book style, extra thick bold black outlines, large open coloring spaces, friendly characters',
  mandala: 'symmetrical circular mandala line art pattern, crisp uniform black ink lines, decorative petals and geometric harmony',
  realista: 'clean botanical and wildlife storybook line art, crisp black pen ink outlines, clear distinct regions',
  cozy: 'cozy comfy hygge aesthetic coloring book style like cozy friends, bold thick outlines, charming little objects',
};

// Cuota básica en memoria por IP para proteger el servidor contra abuso masivo
const DAILY_LIMIT_FREE = 25;
const ipHits = new Map<string, { day: string; count: number }>();

function checkIpQuota(ip: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().slice(0, 10);
  const current = ipHits.get(ip);
  if (!current || current.day !== today) {
    ipHits.set(ip, { day: today, count: 1 });
    return { allowed: true, remaining: DAILY_LIMIT_FREE - 1 };
  }
  if (current.count >= DAILY_LIMIT_FREE) {
    return { allowed: false, remaining: 0 };
  }
  current.count += 1;
  return { allowed: true, remaining: DAILY_LIMIT_FREE - current.count };
}

function buildStrictColoringPrompt(userPrompt: string, styleKey: string): string {
  const styleDesc = STYLE_MODIFIERS[styleKey] || STYLE_MODIFIERS.kawaii;
  return [
    'Black and white coloring book page illustration:',
    userPrompt.trim(),
    styleDesc,
    'STRICT REQUIREMENTS: pure black ink line art ONLY on pure solid white #FFFFFF background, NO colors, NO gray shading, NO shadows, NO gradients, NO text, NO watermark, clean closed outlines ready for printing.',
  ].join(', ');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPrompt = String(body.prompt || '').trim().slice(0, 420);
    const style = String(body.style || 'kawaii').toLowerCase();
    const aspect = String(body.aspect || 'portrait'); // 'portrait' | 'square'

    if (!rawPrompt) {
      return NextResponse.json(
        { error: 'Describe qué dibujo quieres generar (por ejemplo: "un dinosaurio comiendo helado").' },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for') || '';
    const ip = forwarded.split(',')[0].trim() || 'local';
    const quota = checkIpQuota(ip);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error:
            'Alcanzaste el límite gratuito diario de generaciones IA (25/día). Puedes seguir usando la biblioteca gratuita, subir tus propias imágenes al Estudio KDP o activar un paquete de créditos Pro.',
        },
        { status: 429 }
      );
    }

    const fullPrompt = buildStrictColoringPrompt(rawPrompt, style);
    const width = aspect === 'square' ? 1024 : 832;
    const height = aspect === 'square' ? 1024 : 1088;

    // 1. OpenAI Images (si se configura OPENAI_API_KEY en el servidor)
    if (process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
            prompt: fullPrompt,
            size: aspect === 'square' ? '1024x1024' : '1024x1536',
            n: 1,
          }),
          signal: AbortSignal.timeout(35000),
        });
        if (res.ok) {
          const data = await res.json();
          const b64 = data?.data?.[0]?.b64_json;
          if (b64) {
            return NextResponse.json({
              imageDataUrl: `data:image/png;base64,${b64}`,
              provider: 'openai',
              remainingToday: quota.remaining,
            });
          }
        }
      } catch (e) {
        console.warn('[generate-page] OpenAI fallback:', e);
      }
    }

    // 2. Gemini Image Generation (si se configura GEMINI_IMAGE_API_KEY o billing en GEMINI_API_KEY)
    const geminiImgKey = process.env.GEMINI_IMAGE_API_KEY || (process.env.GEMINI_IMAGE_ENABLED === 'true' ? process.env.GEMINI_API_KEY : '');
    if (geminiImgKey) {
      try {
        const imgModel = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${imgModel}:generateContent?key=${encodeURIComponent(geminiImgKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }],
              generationConfig: { responseModalities: ['IMAGE'] },
            }),
            signal: AbortSignal.timeout(30000),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];
          const imgPart = parts.find((p: any) => p?.inlineData?.data);
          if (imgPart?.inlineData?.data) {
            const mime = imgPart.inlineData.mimeType || 'image/png';
            return NextResponse.json({
              imageDataUrl: `data:${mime};base64,${imgPart.inlineData.data}`,
              provider: imgModel,
              remainingToday: quota.remaining,
            });
          }
        }
      } catch (e) {
        console.warn('[generate-page] Gemini image fallback:', e);
      }
    }

    // 3. Motor gratuito directo de generación de imágenes IA (Pollinations Flux/Turbo sin marca de agua)
    const seed = Math.floor(Math.random() * 999999);
    const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=false`;
    const pollRes = await fetch(pollUrl, {
      headers: {
        'User-Agent': 'ColorearProStudio/1.0 (+https://colorear.atpdev.dev)',
        Accept: 'image/*',
      },
      signal: AbortSignal.timeout(35000),
    });

    if (pollRes.ok) {
      const contentType = pollRes.headers.get('content-type') || 'image/jpeg';
      if (contentType.startsWith('image/')) {
        const arrayBuffer = await pollRes.arrayBuffer();
        if (arrayBuffer.byteLength > 2000) {
          const b64 = Buffer.from(arrayBuffer).toString('base64');
          return NextResponse.json({
            imageDataUrl: `data:${contentType};base64,${b64}`,
            provider: 'ia-gratuita',
            remainingToday: quota.remaining,
          });
        }
      }
    }

    return NextResponse.json(
      {
        error:
          'El motor de generación de imágenes tardó demasiado en responder. Inténtalo nuevamente en unos segundos o sube tus propias ilustraciones desde el Estudio KDP.',
      },
      { status: 503 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error inesperado al generar la ilustración.' },
      { status: 500 }
    );
  }
}

