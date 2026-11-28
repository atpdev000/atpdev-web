import { NextResponse } from 'next/server';
import { translateText } from '@atpdev/database';

const ALLOWED_LANGS = new Set(['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'hi', 'ar']);
const MAX_CACHE_ENTRIES = 12000;
const serverTranslationCache = new Map<string, string>();

function getCached(targetLang: string, text: string): string | undefined {
  return serverTranslationCache.get(`${targetLang}:::${text}`);
}

function setCached(targetLang: string, text: string, translated: string) {
  if (!translated || !text) return;
  if (serverTranslationCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = serverTranslationCache.keys().next().value;
    if (firstKey) serverTranslationCache.delete(firstKey);
  }
  serverTranslationCache.set(`${targetLang}:::${text}`, translated);
}

async function googleTranslateSingle(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      cache: 'force-cache',
    });

    if (!res.ok) return text;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const joined = data[0].map((item: any) => item[0] || '').join('').trim();
      return joined || text;
    }
    return text;
  } catch {
    return text;
  }
}

/**
 * Traduce un lote de textos en una sola llamada HTTP usando un separador numérico único,
 * con fallback automático por elemento si el proveedor altera el delimitador.
 */
async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const results = new Array<string>(texts.length);
  const missingIndices: number[] = [];
  const missingTexts: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    const raw = typeof texts[i] === 'string' ? texts[i] : '';
    if (!raw.trim()) {
      results[i] = raw;
      continue;
    }
    const cached = getCached(targetLang, raw);
    if (cached !== undefined) {
      results[i] = cached;
    } else {
      missingIndices.push(i);
      missingTexts.push(raw);
    }
  }

  if (missingTexts.length === 0) {
    return results;
  }

  // Agrupar en bloques de hasta ~2800 caracteres para respetar límites de query string
  const chunks: { indices: number[]; items: string[] }[] = [];
  let curIndices: number[] = [];
  let curItems: string[] = [];
  let curLen = 0;

  for (let j = 0; j < missingTexts.length; j++) {
    const item = missingTexts[j].slice(0, 1200);
    if (curItems.length > 0 && (curLen + item.length > 2600 || curItems.length >= 22)) {
      chunks.push({ indices: curIndices, items: curItems });
      curIndices = [];
      curItems = [];
      curLen = 0;
    }
    curIndices.push(missingIndices[j]);
    curItems.push(item);
    curLen += item.length + 14;
  }
  if (curItems.length > 0) {
    chunks.push({ indices: curIndices, items: curItems });
  }

  const SEP = '\n[[[99417]]]\n';

  await Promise.all(
    chunks.map(async (chunk) => {
      if (chunk.items.length === 1) {
        const src = chunk.items[0];
        let tr = '';
        try {
          tr = await translateText(src, targetLang);
        } catch {}
        if (!tr || tr === src) {
          tr = await googleTranslateSingle(src, targetLang);
        }
        const finalTr = tr || src;
        setCached(targetLang, src, finalTr);
        results[chunk.indices[0]] = finalTr;
        return;
      }

      const combined = chunk.items.join(SEP);
      const translatedCombined = await googleTranslateSingle(combined, targetLang);
      const parts = translatedCombined.split(/\s*\[\[\[\s*99417\s*\]\]\]\s*/);

      if (parts.length === chunk.items.length) {
        for (let k = 0; k < chunk.items.length; k++) {
          const finalTr = (parts[k] || '').trim() || chunk.items[k];
          setCached(targetLang, chunk.items[k], finalTr);
          results[chunk.indices[k]] = finalTr;
        }
      } else {
        // Fallback seguro elemento a elemento (en paralelo acotado)
        await Promise.all(
          chunk.items.map(async (src, k) => {
            const tr = await googleTranslateSingle(src, targetLang);
            const finalTr = tr || src;
            setCached(targetLang, src, finalTr);
            results[chunk.indices[k]] = finalTr;
          })
        );
      }
    })
  );

  return results;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, texts, targetLang } = body || {};

    if (!targetLang || typeof targetLang !== 'string' || !ALLOWED_LANGS.has(targetLang)) {
      return NextResponse.json({ error: 'Invalid or unsupported targetLang' }, { status: 400 });
    }

    if (targetLang === 'es') {
      if (Array.isArray(texts)) {
        return NextResponse.json({ translations: texts });
      }
      return NextResponse.json({ translated: text || '' });
    }

    if (typeof text === 'string') {
      const [translated] = await translateBatch([text], targetLang);
      return NextResponse.json({ translated: translated || text });
    }

    if (Array.isArray(texts)) {
      const safeList = texts.slice(0, 80).map((item: unknown) => (typeof item === 'string' ? item : ''));
      const translations = await translateBatch(safeList, targetLang);
      return NextResponse.json({ translations });
    }

    return NextResponse.json({ error: 'Missing text or texts array' }, { status: 400 });
  } catch (err: any) {
    console.error('Translation route error:', err);
    return NextResponse.json({ error: err?.message || 'Translation failed' }, { status: 500 });
  }
}
