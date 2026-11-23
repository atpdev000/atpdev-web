'use client';

export type SummaryStyle = 'executive' | 'bullets' | 'detailed';

export interface SummaryOutput {
    title: string;
    executiveSummary: string;
    keyPoints: string[];
    topics: string[];
    readingTimeOriginalMin: number;
    readingTimeSummaryMin: number;
    totalWords: number;
    engine: string;
}

const STOPWORDS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'ante',
    'con', 'contra', 'desde', 'en', 'entre', 'hacia', 'hasta', 'para', 'por', 'sin', 'sobre',
    'y', 'o', 'u', 'e', 'ni', 'que', 'como', 'cuando', 'donde', 'quien', 'es', 'son', 'fue',
    'fueron', 'ser', 'estar', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'su', 'sus',
    'se', 'si', 'no', 'pero', 'sino', 'porque', 'ya', 'muy', 'tambien', 'también', 'todo',
    'toda', 'todos', 'todas', 'otro', 'otra', 'mismo', 'misma', 'cada', 'puede', 'pueden',
    'debe', 'deben', 'han', 'hay', 'ha', 'the', 'and', 'or', 'of', 'to', 'in', 'for', 'on',
    'with', 'at', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'that',
    'this', 'these', 'those', 'it', 'its', 'an', 'not', 'but', 'which', 'will', 'can', 'has',
    'have', 'had', 'pagina', 'página', 'page',
]);

function tokenize(text: string): string[] {
    return (text.toLowerCase().match(/[a-záéíóúñü]{4,}/gi) || []).filter((w) => !STOPWORDS.has(w));
}

function extractTopics(text: string, topK = 5): string[] {
    const tokens = tokenize(text);
    if (tokens.length === 0) return ['Documento general'];

    const freq = new Map<string, number>();
    const bigrams = new Map<string, number>();

    for (let i = 0; i < tokens.length; i++) {
        freq.set(tokens[i], (freq.get(tokens[i]) || 0) + 1);
        if (i < tokens.length - 1 && tokens[i] !== tokens[i + 1]) {
            const bg = `${tokens[i]} ${tokens[i + 1]}`;
            bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
        }
    }

    const candidates: Array<{ term: string; score: number }> = [];
    for (const [bg, count] of bigrams.entries()) {
        if (count >= 2) candidates.push({ term: bg, score: count * 1.6 });
    }
    for (const [w, count] of freq.entries()) {
        candidates.push({ term: w, score: count });
    }

    candidates.sort((a, b) => b.score - a.score);

    const selected: string[] = [];
    for (const c of candidates) {
        if (selected.some((s) => s.includes(c.term) || c.term.includes(s))) continue;
        const formatted = c.term.replace(/\b\w/g, (ch) => ch.toUpperCase());
        selected.push(formatted);
        if (selected.length >= topK) break;
    }

    return selected.length > 0 ? selected : ['Contenido general'];
}

export function summarizeTextLocal(
    fullText: string,
    fileName: string,
    style: SummaryStyle
): SummaryOutput {
    const clean = fullText.replace(/\s+/g, ' ').trim();
    const words = clean.split(/\s+/).filter(Boolean);
    const totalWords = words.length;
    const originalReadingTime = Math.max(1, Math.round(totalWords / 200));
    const docTitle = fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

    const rawSentences = clean
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 35 && s.length <= 360);

    if (rawSentences.length === 0) {
        const fallbackText = clean.slice(0, 600) || 'No se encontró texto seleccionable suficiente.';
        return {
            title: docTitle,
            executiveSummary: fallbackText,
            keyPoints: [fallbackText],
            topics: extractTopics(clean),
            readingTimeOriginalMin: originalReadingTime,
            readingTimeSummaryMin: 1,
            totalWords,
            engine: 'TextRank + TF-IDF Local',
        };
    }

    const sample = rawSentences.slice(0, 120);
    const n = sample.length;
    const sentTokens = sample.map(tokenize);

    // Calcular IDF global
    const df = new Map<string, number>();
    for (const toks of sentTokens) {
        for (const w of new Set(toks)) {
            df.set(w, (df.get(w) || 0) + 1);
        }
    }

    const tfidfVecs = sentTokens.map((toks) => {
        const vec = new Map<string, number>();
        const tf = new Map<string, number>();
        for (const w of toks) tf.set(w, (tf.get(w) || 0) + 1);
        let normSq = 0;
        for (const [w, count] of tf.entries()) {
            const idf = Math.log((n + 1) / ((df.get(w) || 0) + 1)) + 1;
            const val = count * idf;
            vec.set(w, val);
            normSq += val * val;
        }
        const norm = Math.sqrt(normSq) || 1;
        for (const [w, val] of vec.entries()) vec.set(w, val / norm);
        return vec;
    });

    const cosine = (a: Map<string, number>, b: Map<string, number>) => {
        let sum = 0;
        for (const [k, v] of a.entries()) {
            const bv = b.get(k);
            if (bv) sum += v * bv;
        }
        return sum;
    };

    // Matriz de similitud + iteración TextRank
    const sim: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const rowSums: number[] = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const s = cosine(tfidfVecs[i], tfidfVecs[j]);
            sim[i][j] = s;
            sim[j][i] = s;
            rowSums[i] += s;
            rowSums[j] += s;
        }
    }

    let scores = Array(n).fill(1 / n);
    for (let iter = 0; iter < 15; iter++) {
        const next = Array(n).fill(0.15 / n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (rowSums[j] > 0) {
                    next[i] += 0.85 * (sim[j][i] / rowSums[j]) * scores[j];
                }
            }
        }
        scores = next;
    }

    // Pequeño refuerzo a introducción y conclusiones
    for (let i = 0; i < n; i++) {
        if (i < 3 || i >= n - 2) scores[i] *= 1.15;
    }

    const rankedIndices = scores
        .map((score, idx) => ({ idx, score }))
        .sort((a, b) => b.score - a.score)
        .map((x) => x.idx);

    const summaryCount = style === 'detailed' ? Math.min(8, n) : style === 'bullets' ? Math.min(3, n) : Math.min(4, n);
    const pointsCount = style === 'bullets' ? Math.min(8, n) : style === 'detailed' ? Math.min(7, n) : Math.min(5, n);

    const summaryIndices = rankedIndices.slice(0, summaryCount).sort((a, b) => a - b);
    const executiveSummary = summaryIndices.map((i) => sample[i]).join(' ');
    const keyPoints = rankedIndices.slice(0, pointsCount).map((i) => sample[i]);

    const summaryWords = executiveSummary.split(/\s+/).length + keyPoints.join(' ').split(/\s+/).length;
    const summaryMin = Math.max(1, Math.round(summaryWords / 200));

    return {
        title: docTitle,
        executiveSummary,
        keyPoints,
        topics: extractTopics(clean, 5),
        readingTimeOriginalMin: originalReadingTime,
        readingTimeSummaryMin: summaryMin,
        totalWords,
        engine: 'TextRank + TF-IDF Local',
    };
}

