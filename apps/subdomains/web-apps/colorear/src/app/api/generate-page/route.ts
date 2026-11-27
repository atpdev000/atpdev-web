import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/session';
import { consumeUserCredit, recordFreeGeneration } from '@/lib/server/store';

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

function sanitizeAndNormalizeSvg(rawText: string, svgW: number, svgH: number): string | null {
  const match = rawText.match(/<svg[\s\S]*?<\/svg>/i);
  if (!match) return null;

  let svg = match[0]
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/(?:xlink:)?href\s*=\s*("https?:[^"]*"|'https?:[^']*')/gi, '');

  const shapeCount = (svg.match(/<(path|circle|ellipse|rect|polygon|polyline|line)\b/gi) || []).length;
  if (shapeCount < 4) return null;

  // Normaliza atributos raíz del SVG para renderizado consistente a 300 DPI
  svg = svg.replace(/<svg\b[^>]*>/i, (openTag) => {
    let tag = openTag;
    if (!/\bxmlns=/.test(tag)) {
      tag = tag.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!/\bviewBox=/.test(tag)) {
      tag = tag.replace('<svg', `<svg viewBox="0 0 ${svgW} ${svgH}"`);
    }
    tag = tag.replace(/\bwidth="[^"]*"/i, '').replace(/\bheight="[^"]*"/i, '');
    tag = tag.replace('<svg', `<svg width="${svgW}" height="${svgH}"`);
    return tag;
  });

  // Asegura fondo blanco sólido #FFFFFF para limpieza line-art y pintado online
  if (!/<rect[^>]*fill="#?fff(?:fff)?"/i.test(svg)) {
    svg = svg.replace(/(<svg\b[^>]*>)/i, `$1<rect width="${svgW}" height="${svgH}" fill="#FFFFFF"/>`);
  }

  return svg;
}

async function generateVectorSvgWithGemini(
  userPrompt: string,
  styleKey: string,
  aspect: string
): Promise<{ dataUrl: string; model: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const svgW = aspect === 'square' ? 900 : 800;
  const svgH = aspect === 'square' ? 900 : 1000;
  const styleDesc = STYLE_MODIFIERS[styleKey] || STYLE_MODIFIERS.kawaii;

  const svgPrompt = `You are a master children's coloring book vector illustrator.
Create a charming, recognizable, well-proportioned black-and-white coloring book illustration in raw SVG format for:
"${userPrompt}"

Visual style: ${styleDesc}.

STRICT TECHNICAL RULES:
1. Output ONLY raw valid XML starting with <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}"> and ending with </svg>. NO markdown fences, NO explanations.
2. Start with <rect width="${svgW}" height="${svgH}" fill="#FFFFFF"/> as the pure white page background.
3. Draw a well-centered main subject occupying ~70% of the canvas inside safe print margins (leave at least 65px margin on all 4 sides), plus 4-8 cute supporting background elements (clouds, stars, leaves, flowers, ground line, bubbles, etc.).
4. Use ONLY pure black strokes (stroke="#000000" stroke-width="7" or "8" for main outlines, "5" for small details, stroke-linecap="round" stroke-linejoin="round") and fill="#FFFFFF" on closed colorable regions (only tiny pupils/dots may use fill="#000000").
5. NO colors, NO gray fills, NO gradients, NO opacity below 1, NO text or letters anywhere in the drawing.
6. Include 20 to 40 carefully crafted closed vector shapes (<path>, <circle>, <ellipse>, <polygon>, <rect>) forming a cohesive, delightful, recognizable drawing ready to print at 300 DPI or flood-fill color.`;

  const models = Array.from(
    new Set([
      ...(process.env.GEMINI_SVG_MODEL ? [process.env.GEMINI_SVG_MODEL] : []),
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
    ])
  );

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: svgPrompt }] }],
            generationConfig: {
              temperature: 0.65,
              maxOutputTokens: 4500,
            },
          }),
          signal: AbortSignal.timeout(18000),
        }
      );

      if (!res.ok) continue;
      const data = await res.json();
      const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanSvg = sanitizeAndNormalizeSvg(rawText, svgW, svgH);
      if (cleanSvg) {
        const b64 = Buffer.from(cleanSvg, 'utf8').toString('base64');
        return {
          dataUrl: `data:image/svg+xml;base64,${b64}`,
          model: `gemini-vector (${model})`,
        };
      }
    } catch (e) {
      console.warn(`[generate-page] Gemini SVG ${model} fallback:`, e);
    }
  }

  return null;
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

    const authUser = getAuthenticatedUser(request);
    const hasProCredits = Boolean(authUser && authUser.credits > 0);

    const forwarded = request.headers.get('x-forwarded-for') || '';
    const ip = forwarded.split(',')[0].trim() || 'local';
    let remainingToday: number | undefined;

    if (!hasProCredits) {
      const quota = checkIpQuota(ip);
      if (!quota.allowed) {
        return NextResponse.json(
          {
            error:
              'Alcanzaste el límite gratuito diario de generaciones IA (25/día). Crea una cuenta gratuita para recibir 15 créditos extra o activa un Pack Creador KDP en /planes.',
          },
          { status: 429 }
        );
      }
      remainingToday = quota.remaining;
    }

    const finalizeResponse = (imageDataUrl: string, provider: string) => {
      if (authUser && hasProCredits) {
        const updated = consumeUserCredit(authUser.id, 1);
        return NextResponse.json({
          imageDataUrl,
          provider,
          usedCredit: true,
          creditsRemaining: updated ? updated.credits : Math.max(0, authUser.credits - 1),
          plan: updated?.plan || authUser.plan,
        });
      }
      if (authUser) {
        recordFreeGeneration(authUser.id);
      }
      return NextResponse.json({
        imageDataUrl,
        provider,
        usedCredit: false,
        remainingToday,
      });
    };

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
            return finalizeResponse(`data:image/png;base64,${b64}`, 'openai');
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
            return finalizeResponse(`data:${mime};base64,${imgPart.inlineData.data}`, imgModel);
          }
        }
      } catch (e) {
        console.warn('[generate-page] Gemini image fallback:', e);
      }
    }

    // 3. Motor vectorial IA en vivo con Gemini (SVG puro 300 DPI, cero marcas de agua, trazos limpios)
    const vectorResult = await generateVectorSvgWithGemini(rawPrompt, style, aspect);
    if (vectorResult) {
      return finalizeResponse(vectorResult.dataUrl, vectorResult.model);
    }

    // 4. Respaldo raster gratuito (Pollinations, si está disponible)
    try {
      const seed = Math.floor(Math.random() * 999999);
      const shortPrompt = `black and white coloring book page, ${rawPrompt}, thick clean ink outlines, pure white background, no shading`;
      const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(shortPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=false`;
      const pollRes = await fetch(pollUrl, {
        headers: {
          'User-Agent': 'ColorearProStudio/1.0 (+https://colorear.atpdev.dev)',
          Accept: 'image/*',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (pollRes.ok) {
        const contentType = pollRes.headers.get('content-type') || 'image/jpeg';
        if (contentType.startsWith('image/')) {
          const arrayBuffer = await pollRes.arrayBuffer();
          if (arrayBuffer.byteLength > 2000) {
            const b64 = Buffer.from(arrayBuffer).toString('base64');
            return finalizeResponse(`data:${contentType};base64,${b64}`, 'ia-raster');
          }
        }
      }
    } catch (e) {
      console.warn('[generate-page] Pollinations fallback:', e);
    }

    return NextResponse.json(
      {
        error:
          'El motor de generación IA estuvo saturado en este momento. Inténtalo nuevamente en unos segundos o sube tus propias ilustraciones desde el Estudio KDP.',
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

