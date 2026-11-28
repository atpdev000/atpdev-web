"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { TRANSLATIONS } from '@/lib/translations';
import { getKnownTranslatedValues } from '@/lib/i18nUi';

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'SVG',
  'PATH',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
  'CANVAS',
  'IFRAME',
]);

const EXACT_SKIP_TERMS = new Set([
  'sorteos pro',
  'sorteospro',
  'sorteos',
  'pro',
  'atp dev',
  'atp dev solutions',
  'instagram',
  'tiktok',
  'youtube',
  'facebook',
  'threads',
  'twitter',
  'x',
  'whatsapp',
  'yape',
  'plin',
  'stripe',
  'mercadopago',
  'paypal',
  'sha-256',
  'csprng',
  'web crypto csprng',
  'pdf',
  'csv',
  'txt',
  'csv / txt',
  'ocr',
  'excel (.xlsx)',
  'word (.docx)',
  'ctrl + v',
  'ctrl+v',
  'ig, tiktok, yt, fb, x, threads',
  'free',
  'business',
  'enterprise',
  'new',
  'colorear pro',
  'descargador pro',
  'chamba pro',
  'portal atp dev',
]);

const CACHE_PREFIX = 'sorteos_dom_i18n_v1_';
const MAX_CLIENT_CACHE = 1200;

const originalTextMap = new WeakMap<Text, string>();
const lastAppliedMap = new WeakMap<Text, string>();
const trackedNodes = new Set<Text>();
const trackedPlaceholders = new Set<HTMLInputElement | HTMLTextAreaElement>();
const memoryCaches = new Map<string, Map<string, string>>();

function getLangCache(lang: string): Map<string, string> {
  let cache = memoryCaches.get(lang);
  if (cache) return cache;

  cache = new Map<string, string>();
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${lang}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>;
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string') cache.set(k, v);
      }
    }
  } catch {}
  memoryCaches.set(lang, cache);
  return cache;
}

function persistLangCache(lang: string, cache: Map<string, string>) {
  try {
    const entries = Array.from(cache.entries()).slice(-MAX_CLIENT_CACHE);
    const obj: Record<string, string> = {};
    for (const [k, v] of entries) obj[k] = v;
    localStorage.setItem(`${CACHE_PREFIX}${lang}`, JSON.stringify(obj));
  } catch {}
}

function isInsideNoTranslate(el: Element | null): boolean {
  let curr: Element | null = el;
  while (curr) {
    if (
      SKIP_TAGS.has(curr.tagName) ||
      curr.getAttribute('data-no-translate') === 'true' ||
      curr.getAttribute('translate') === 'no' ||
      curr.classList.contains('notranslate') ||
      curr.getAttribute('contenteditable') === 'true'
    ) {
      return true;
    }
    curr = curr.parentElement;
  }
  return false;
}

function shouldSkipString(trimmed: string, knownNativeSet: Set<string>): boolean {
  if (!trimmed || trimmed.length < 2) return true;
  if (trimmed.length > 900) return true;
  if (!/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(trimmed)) return true; // números, emojis, símbolos
  if (/^(https?:\/\/|www\.|mailto:|@|#)/i.test(trimmed)) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;
  if (/^CERT-[A-Z0-9\-]+$/i.test(trimmed)) return true;
  if (/^[a-f0-9]{16,}$/i.test(trimmed)) return true; // hashes hex
  if (/^[S$\€£¥]\s*\/?\s*\d/.test(trimmed)) return true; // montos puros S/ 29, $9.99
  if (/^\d+\s*(min|seg|s|ms|%|px|kb|mb)$/i.test(trimmed)) return true;

  const lower = trimmed.toLowerCase();
  if (EXACT_SKIP_TERMS.has(lower)) return true;
  if (knownNativeSet.has(trimmed)) return true;

  return false;
}

function buildKnownNativeSet(lang: string): Set<string> {
  const set = getKnownTranslatedValues(lang);
  const dict = TRANSLATIONS[lang];
  if (dict) {
    for (const val of Object.values(dict)) {
      if (val) set.add(val.trim());
    }
  }
  return set;
}

function restoreSpanish() {
  for (const node of Array.from(trackedNodes)) {
    if (!node.isConnected) {
      trackedNodes.delete(node);
      continue;
    }
    const orig = originalTextMap.get(node);
    const lastApplied = lastAppliedMap.get(node);
    if (orig !== undefined && node.nodeValue === lastApplied) {
      node.nodeValue = orig;
      lastAppliedMap.delete(node);
    }
  }

  for (const el of Array.from(trackedPlaceholders)) {
    if (!el.isConnected) {
      trackedPlaceholders.delete(el);
      continue;
    }
    const orig = el.getAttribute('data-orig-placeholder');
    if (orig !== null) {
      el.setAttribute('placeholder', orig);
    }
  }
}

export const AutoPageTranslator: React.FC<{ lang: string }> = ({ lang }) => {
  const pathname = usePathname();
  const activeLangRef = useRef(lang);
  activeLangRef.current = lang;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (lang === 'es') {
      restoreSpanish();
      return;
    }

    let cancelled = false;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const knownNativeSet = buildKnownNativeSet(lang);
    const cache = getLangCache(lang);
    const inFlight = new Set<string>();

    const applyTranslation = (node: Text, origFull: string, translatedTrimmed: string) => {
      if (!node.isConnected || activeLangRef.current !== lang) return;
      const lead = origFull.match(/^\s*/)?.[0] || '';
      const trail = origFull.match(/\s*$/)?.[0] || '';
      const nextVal = `${lead}${translatedTrimmed}${trail}`;
      if (node.nodeValue !== nextVal) {
        node.nodeValue = nextVal;
      }
      lastAppliedMap.set(node, nextVal);
    };

    const scanAndTranslate = async () => {
      if (cancelled || activeLangRef.current !== lang) return;

      const textTargets: { node: Text; origFull: string; trimmed: string }[] = [];
      const placeholderTargets: {
        el: HTMLInputElement | HTMLTextAreaElement;
        orig: string;
      }[] = [];

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let currNode = walker.nextNode();
      while (currNode) {
        const textNode = currNode as Text;
        const parentEl = textNode.parentElement;
        if (parentEl && !isInsideNoTranslate(parentEl)) {
          const currentVal = textNode.nodeValue || '';
          const lastApplied = lastAppliedMap.get(textNode);

          // Si React actualizó el texto desde la última traducción, capturamos el nuevo original
          let origFull = originalTextMap.get(textNode);
          if (origFull === undefined || (lastApplied !== undefined && currentVal !== lastApplied)) {
            origFull = currentVal;
            originalTextMap.set(textNode, origFull);
            trackedNodes.add(textNode);
          }

          const trimmed = origFull.trim();
          if (!shouldSkipString(trimmed, knownNativeSet)) {
            const cached = cache.get(trimmed);
            if (cached) {
              applyTranslation(textNode, origFull, cached);
            } else if (!inFlight.has(trimmed)) {
              textTargets.push({ node: textNode, origFull, trimmed });
            }
          }
        }
        currNode = walker.nextNode();
      }

      // Escanear placeholders de inputs/textareas visibles
      const fields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input[placeholder], textarea[placeholder]'
      );
      fields.forEach((el) => {
        if (
          el.getAttribute('data-no-translate') === 'true' ||
          el.classList.contains('notranslate')
        ) {
          return;
        }
        const currentPh = el.getAttribute('placeholder') || '';
        const savedOrig = el.getAttribute('data-orig-placeholder');
        const orig = savedOrig !== null ? savedOrig : currentPh;
        if (savedOrig === null && orig) {
          el.setAttribute('data-orig-placeholder', orig);
          trackedPlaceholders.add(el);
        }
        const trimmed = orig.trim();
        if (!trimmed || shouldSkipString(trimmed, knownNativeSet)) return;

        const cached = cache.get(trimmed);
        if (cached) {
          if (el.getAttribute('placeholder') !== cached) {
            el.setAttribute('placeholder', cached);
          }
        } else if (!inFlight.has(trimmed)) {
          placeholderTargets.push({ el, orig: trimmed });
        }
      });

      const uniqueMissing = Array.from(
        new Set([
          ...textTargets.map((item) => item.trimmed),
          ...placeholderTargets.map((item) => item.orig),
        ])
      );

      if (uniqueMissing.length === 0) return;

      for (const s of uniqueMissing) inFlight.add(s);

      // Enviar en lotes de máximo 40 textos por petición
      for (let i = 0; i < uniqueMissing.length; i += 40) {
        if (cancelled || activeLangRef.current !== lang) break;
        const batch = uniqueMissing.slice(i, i + 40);
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: batch, targetLang: lang }),
          });
          if (!res.ok) continue;
          const data = await res.json();
          const translations: string[] = Array.isArray(data?.translations)
            ? data.translations
            : [];
          if (translations.length !== batch.length) continue;

          for (let k = 0; k < batch.length; k++) {
            const tr = (translations[k] || '').trim() || batch[k];
            cache.set(batch[k], tr);
          }
          persistLangCache(lang, cache);

          if (cancelled || activeLangRef.current !== lang) break;

          for (const target of textTargets) {
            const tr = cache.get(target.trimmed);
            if (tr) applyTranslation(target.node, target.origFull, tr);
          }
          for (const target of placeholderTargets) {
            const tr = cache.get(target.orig);
            if (tr && target.el.isConnected) {
              target.el.setAttribute('placeholder', tr);
            }
          }
        } catch {
          // fallo silencioso de red, no interrumpe la app
        } finally {
          for (const s of batch) inFlight.delete(s);
        }
      }
    };

    const scheduleScan = (delay = 140) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scanAndTranslate();
      }, delay);
    };

    // Primer escaneo rápido tras hidratar la ruta
    scheduleScan(80);

    // Observar contenido dinámico (modales, pestañas, FAQs, resultados de herramientas)
    const observer = new MutationObserver((mutations) => {
      let hasRelevantChange = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          hasRelevantChange = true;
          break;
        }
        if (m.type === 'characterData' && m.target.nodeType === Node.TEXT_NODE) {
          const tNode = m.target as Text;
          if (tNode.nodeValue !== lastAppliedMap.get(tNode)) {
            hasRelevantChange = true;
            break;
          }
        }
      }
      if (hasRelevantChange) {
        scheduleScan(160);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      cancelled = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [lang, pathname]);

  return null;
};

export default AutoPageTranslator;

