import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const MYMEMORY_LANG_MAP: Record<string, string> = {
  es: 'es',
  en: 'en',
  pt: 'pt-BR',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ru: 'ru',
  zh: 'zh-CN',
  ja: 'ja',
  hi: 'hi',
  ar: 'ar',
};

const MAX_CACHE_ENTRIES = 25000;
const serverTranslationCache = new Map<string, string>();
let diskLoaded = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function getCacheFilePath(): string {
  const vpsDataDir = '/opt/atpdev-web/data';
  try {
    if (fs.existsSync(vpsDataDir)) {
      return path.join(vpsDataDir, 'sorteos-i18n-cache.json');
    }
  } catch {}
  return path.join(/*turbopackIgnore: true*/ process.cwd(), '.sorteos-i18n-cache.json');
}

function ensureDiskCacheLoaded() {
  if (diskLoaded) return;
  diskLoaded = true;
  try {
    const filePath = getCacheFilePath();
    if (!fs.existsSync(filePath)) return;
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, string>;
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string' && v.trim()) {
        serverTranslationCache.set(k, v);
      }
    }
  } catch {}
}

function scheduleDiskSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const filePath = getCacheFilePath();
      const obj: Record<string, string> = {};
      for (const [k, v] of serverTranslationCache.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(obj), 'utf8');
    } catch {}
  }, 1500);
}

function getCached(targetLang: string, text: string): string | undefined {
  ensureDiskCacheLoaded();
  return serverTranslationCache.get(`${targetLang}:::${text}`);
}

function setCached(targetLang: string, text: string, translated: string) {
  if (!translated || !text) return;
  if (serverTranslationCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = serverTranslationCache.keys().next().value;
    if (firstKey) serverTranslationCache.delete(firstKey);
  }
  serverTranslationCache.set(`${targetLang}:::${text}`, translated);
  scheduleDiskSave();
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function myMemoryTranslateChunk(chunk: string, targetLang: string): Promise<string | null> {
  const mappedTarget = MYMEMORY_LANG_MAP[targetLang];
  if (!mappedTarget) return null;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      chunk
    )}&langpair=${encodeURIComponent(`es|${mappedTarget}`)}&de=${encodeURIComponent(
      'contacto@atpdev.dev'
    )}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.quotaFinished) return null;
    if (Number(data?.responseStatus) !== 200) return null;
    const rawTr = String(data?.responseData?.translatedText || '').trim();
    if (!rawTr) return null;
    if (/MYMEMORY WARNING|INVALID LANGUAGE|QUERY LENGTH LIMIT/i.test(rawTr)) return null;
    return decodeHtmlEntities(rawTr);
  } catch {
    return null;
  }
}

async function googleTranslateFallback(text: string, targetLang: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const joined = data[0].map((item: any) => item[0] || '').join('').trim();
      return joined || null;
    }
    return null;
  } catch {
    return null;
  }
}

function splitIntoChunks(text: string, maxLen = 420): string[] {
  if (text.length <= maxLen) return [text];
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    if (current && current.length + s.length + 1 > maxLen) {
      chunks.push(current);
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current) chunks.push(current);

  // Salvaguarda si una sola oración excede maxLen
  return chunks.flatMap((c) => {
    if (c.length <= maxLen) return [c];
    const parts: string[] = [];
    for (let i = 0; i < c.length; i += maxLen) {
      parts.push(c.slice(i, i + maxLen));
    }
    return parts;
  });
}

async function translateOne(text: string, targetLang: string): Promise<string> {
  const clean = text.trim();
  if (!clean) return text;

  const cached = getCached(targetLang, clean);
  if (cached !== undefined) return cached;

  const chunks = splitIntoChunks(clean, 420);
  const translatedChunks: string[] = [];
  let succeeded = true;

  for (const chunk of chunks) {
    let tr = await myMemoryTranslateChunk(chunk, targetLang);
    if (!tr) {
      tr = await googleTranslateFallback(chunk, targetLang);
    }
    if (!tr) {
      succeeded = false;
      translatedChunks.push(chunk);
    } else {
      translatedChunks.push(tr);
    }
  }

  const finalText = translatedChunks.join(' ').trim() || clean;
  if (succeeded) {
    setCached(targetLang, clean, finalText);
  }
  return finalText;
}

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const results = new Array<string>(texts.length);
  const uniqueMissing: string[] = [];
  const missingIndexMap = new Map<string, number[]>();

  for (let i = 0; i < texts.length; i++) {
    const raw = typeof texts[i] === 'string' ? texts[i] : '';
    const trimmed = raw.trim();
    if (!trimmed) {
      results[i] = raw;
      continue;
    }
    const cached = getCached(targetLang, trimmed);
    if (cached !== undefined) {
      results[i] = cached;
      continue;
    }
    const list = missingIndexMap.get(trimmed);
    if (list) {
      list.push(i);
    } else {
      missingIndexMap.set(trimmed, [i]);
      uniqueMissing.push(trimmed);
    }
  }

  // Concurrencia acotada (6 en paralelo) para máxima velocidad sin saturar el proveedor
  const CONCURRENCY = 6;
  let cursor = 0;
  const worker = async () => {
    while (cursor < uniqueMissing.length) {
      const idx = cursor++;
      const src = uniqueMissing[idx];
      const tr = await translateOne(src, targetLang);
      const targets = missingIndexMap.get(src) || [];
      for (const pos of targets) {
        results[pos] = tr;
      }
    }
  };

  const workers = Array.from(
    { length: Math.min(CONCURRENCY, uniqueMissing.length) },
    () => worker()
  );
  await Promise.all(workers);

  return results;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, texts, targetLang } = body || {};

    if (!targetLang || typeof targetLang !== 'string' || !(targetLang in MYMEMORY_LANG_MAP)) {
      return NextResponse.json({ error: 'Invalid or unsupported targetLang' }, { status: 400 });
    }

    if (targetLang === 'es') {
      if (Array.isArray(texts)) {
        return NextResponse.json({ translations: texts });
      }
      return NextResponse.json({ translated: text || '' });
    }

    if (typeof text === 'string') {
      const translated = await translateOne(text, targetLang);
      return NextResponse.json({ translated: translated || text });
    }

    if (Array.isArray(texts)) {
      const safeList = texts
        .slice(0, 80)
        .map((item: unknown) => (typeof item === 'string' ? item : ''));
      const translations = await translateBatch(safeList, targetLang);
      return NextResponse.json({ translations });
    }

    return NextResponse.json({ error: 'Missing text or texts array' }, { status: 400 });
  } catch (err: any) {
    console.error('Translation route error:', err);
    return NextResponse.json({ error: err?.message || 'Translation failed' }, { status: 500 });
  }
}
