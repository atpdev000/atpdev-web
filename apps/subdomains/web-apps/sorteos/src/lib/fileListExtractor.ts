/**
 * Extractor inteligente de listas de participantes desde archivos, capturas (OCR) y portapapeles:
 * - Capturas pegadas con Ctrl+V o imágenes (.png, .jpg, .jpeg, .webp, .bmp) con preprocesado de tablas
 * - Texto pegado directamente desde Excel / Google Sheets (TSV con numeración y "APELLIDOS, Nombres")
 * - Excel (.xlsx, .xls)
 * - CSV / TSV / TXT (.csv, .txt, .tsv)
 * - Word (.docx)
 * - PDF (.pdf)
 *
 * Carga bibliotecas pesadas bajo demanda (lazy-loading por CDN) para no sobrecargar el bundle.
 */

declare global {
  interface Window {
    XLSX?: any;
    mammoth?: any;
    pdfjsLib?: any;
    Tesseract?: any;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('Document not available'));
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Error al cargar el script desde ${src}`));
    document.head.appendChild(script);
  });
}

const COMMON_HEADERS = new Set([
  'nombre',
  'nombres',
  'apellido',
  'apellidos',
  'nombre y apellido',
  'nombres y apellidos',
  'apellido y nombre',
  'apellidos y nombres',
  'nombre completo',
  'participante',
  'participantes',
  'alumno',
  'alumnos',
  'estudiante',
  'estudiantes',
  'lista',
  'integrante',
  'integrantes',
  'persona',
  'personas',
  'ganador',
  'ganadores',
  'premio',
  'premios',
  'item',
  'ítem',
  'nro',
  'nro.',
  'n°',
  'nº',
  'no',
  'no.',
  'num',
  'número',
  'numero',
  'orden',
  'id',
  'dni',
  'codigo',
  'código',
  'correo',
  'email',
  'teléfono',
  'telefono',
  'celular',
  'estado',
  'nota',
  'notas',
  'name',
  'names',
  'full name',
  'first name',
  'last name',
  'players',
  'teams',
]);

const NON_NAME_STATUS_WORDS = new Set([
  'si',
  'sí',
  'no',
  'ok',
  'activo',
  'activa',
  'inactivo',
  'inactiva',
  'presente',
  'ausente',
  'asistio',
  'asistió',
  'falta',
  'falto',
  'faltó',
  'pagado',
  'pendiente',
  'aprobado',
  'desaprobado',
  'confirmado',
  'registrado',
  'habilitado',
  'true',
  'false',
  'yes',
  'x',
  '✓',
  '✔',
]);

function normalizeWhitespace(value: string): string {
  return value
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isPureIndexOrNumeric(cell: string): boolean {
  const s = cell.trim();
  if (!s) return true;
  if (/^#?\d{1,6}[\.\)\-\:\|\º\°]?$/.test(s)) return true;
  if (/^\d+([.,]\d+)?$/.test(s)) return true;
  if (/^[\|\[\]\(\)\{\}\\\/\!\¡\_\-\=\+\~\•\–\—\*\:\;#]+$/.test(s)) return true;
  return false;
}

function isNonNameMetadata(cell: string): boolean {
  const s = cell.trim();
  if (!s) return true;
  const lower = s.toLowerCase();
  if (COMMON_HEADERS.has(lower) || NON_NAME_STATUS_WORDS.has(lower)) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return true; // email
  if (/^https?:\/\//i.test(s) || /^www\./i.test(s)) return true; // URL
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(s)) return true; // fecha
  if (/^\+?\d[\d\s\-]{5,}$/.test(s)) return true; // teléfono / DNI / código numérico
  if (/^[A-Z0-9\-_]{5,}$/.test(s) && /\d/.test(s)) return true; // código alfanumérico ej. U20241234
  return false;
}

function looksLikeNameSegment(cell: string): boolean {
  const s = cell.trim();
  if (s.length < 2 || s.length > 42) return false;
  if (/\d/.test(s)) return false;
  if (isNonNameMetadata(s)) return false;
  return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ'\-\.\s]+$/.test(s);
}

/**
 * Selecciona la mejor columna (o par Apellidos + Nombres) de una fila tabular (Excel, TSV o CSV).
 */
export function pickNameFromRowCells(rawCells: Array<string | number | null | undefined>): string {
  const cells = rawCells
    .map((c) => normalizeWhitespace(String(c ?? '').replace(/^["']|["']$/g, '')))
    .filter((c) => c.length > 0 && !isPureIndexOrNumeric(c));

  if (cells.length === 0) return '';

  // Si todas las celdas de la fila son encabezados, omitir la fila completa
  if (cells.every((c) => COMMON_HEADERS.has(c.toLowerCase()))) {
    return '';
  }

  const alphaCells = cells.filter(
    (c) => /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]{2,}/.test(c) && !isNonNameMetadata(c)
  );

  if (alphaCells.length === 0) {
    return '';
  }

  const first = alphaCells[0];

  // Si la primera columna alfabética ya contiene coma ("APELLIDOS, Nombres") o 2+ palabras,
  // ya representa el nombre completo; no concatenamos carreras/áreas/estados.
  if (first.includes(',') || first.split(/\s+/).length >= 2) {
    // Excepción útil: si la celda 0 es solo 1-2 apellidos en MAYÚSCULAS SIN coma
    // y la celda 1 son nombres con capitalización normal (ej: "ALVARADO MONTOYA" | "Fransua Duban")
    if (
      !first.includes(',') &&
      alphaCells.length >= 2 &&
      looksLikeNameSegment(first) &&
      looksLikeNameSegment(alphaCells[1]) &&
      first === first.toUpperCase() &&
      alphaCells[1] !== alphaCells[1].toUpperCase() &&
      first.split(/\s+/).length <= 3 &&
      alphaCells[1].split(/\s+/).length <= 3
    ) {
      return `${first}, ${alphaCells[1]}`;
    }
    return first;
  }

  // Si son 2 columnas consecutivas de nombre y apellido (ej: "Juan" | "Pérez" o "ALVARADO" | "Fransua")
  if (
    alphaCells.length >= 2 &&
    looksLikeNameSegment(first) &&
    looksLikeNameSegment(alphaCells[1]) &&
    alphaCells[1].split(/\s+/).length <= 2
  ) {
    return `${first} ${alphaCells[1]}`;
  }

  return first;
}

/**
 * Limpia una sola línea proveniente de texto plano, lista numerada o salida OCR de una tabla.
 */
function cleanSingleParticipantLine(line: string): string {
  let clean = normalizeWhitespace(line);
  if (!clean) return '';

  // Si contiene barras verticales internas propias de bordes de tabla OCR (ej. "| 1 | ALVARADO MONTOYA, Fransua |")
  if (clean.includes('|')) {
    const pipeParts = clean
      .split('|')
      .map((p) => normalizeWhitespace(p))
      .filter((p) => p.length > 0);
    if (pipeParts.length >= 2) {
      clean = pickNameFromRowCells(pipeParts);
      if (!clean) return '';
    }
  }

  // Limpieza iterativa de bordes OCR, numeración inicial y viñetas
  for (let pass = 0; pass < 3; pass++) {
    const prev = clean;

    // Bordes y símbolos de tabla al inicio o final
    clean = clean.replace(/^[\|\[\]\(\)\{\}\\\/\!\¡\_\-\=\+\~\•\–\—\*\:\;#]+\s*/, '').trim();
    clean = clean.replace(/\s*[\|\[\]\(\)\{\}\\\/\!\¡\_\-\=\+\~\:\;]+$/, '').trim();

    // Prefijos de numeración: "1.", "1)", "1.-", "01 -", "[1]", "1|", "1 ALVARADO..."
    clean = clean
      .replace(
        /^(?:\[\d{1,5}\]|\(\d{1,5}\)|#?\d{1,5}\s*(?:[\.\)\-\:\|\[\]\/\\º°]+\s*|\s+(?=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ])))\s*/,
        ''
      )
      .trim();

    // Artefacto común de OCR donde la línea vertical "|" se lee como "I", "l" o "!" antes del apellido/número
    clean = clean
      .replace(/^[Il!¡]\s+(?=(?:[A-ZÁÉÍÓÚÜÑ]{3,}|\d{1,4}\b))/, '')
      .trim();

    // Sufijos de OCR rotos entre corchetes al final (ej. "[OC", "[-")
    clean = clean.replace(/\s*(?:\[[^\]]*\]?|[\|\[\]\_\=\+\~]+)$/, '').trim();

    if (clean === prev) break;
  }

  // Normalizar espacios alrededor de comas: "ALVARADO MONTOYA ,  Fransua" -> "ALVARADO MONTOYA, Fransua"
  clean = clean.replace(/\s*,\s*/g, ', ').replace(/\s+/g, ' ').trim();
  // Quitar comas huérfanas al inicio o al final
  clean = clean.replace(/^,\s*|\s*,$/g, '').trim();

  return clean;
}

/**
 * Divide una línea CSV respetando comillas dobles (RFC-4180) para NO romper "APELLIDOS, Nombres".
 */
export function splitDelimitedLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Limpia y normaliza texto crudo (Excel TSV, listas numeradas, OCR de tablas, Word/PDF)
 * en una lista limpia y ordenada de nombres (1 por entrada).
 * Conserva intacto el formato "APELLIDOS, Nombres" sin partir por la coma interna.
 */
export function cleanExtractedNames(
  rawText: string,
  options: { dedupe?: boolean } = {}
): string[] {
  const { dedupe = true } = options;
  if (!rawText || !rawText.trim()) return [];

  const rawLines = rawText.split(/\r?\n/);
  const nonEmptyRawLines = rawLines.map((l) => l.trim()).filter(Boolean);
  const isSingleLineInput = nonEmptyRawLines.length === 1;

  const result: string[] = [];
  const seen = new Set<string>();

  const pushIfValid = (candidate: string) => {
    const clean = cleanSingleParticipantLine(candidate);
    if (!clean) return;
    if (COMMON_HEADERS.has(clean.toLowerCase())) return;
    if (/^\d+$/.test(clean) || clean.length < 2) return;
    if (!/[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]{2}/.test(clean)) return;
    if (!/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(clean) && clean.length < 3) return;

    const key = clean.toLowerCase();
    if (dedupe) {
      if (seen.has(key)) return;
      seen.add(key);
    }
    result.push(clean);
  };

  for (const rawLine of rawLines) {
    if (!rawLine || !rawLine.trim()) continue;

    // Caso 1: Fila copiada de Excel / Google Sheets separada por tabuladores (\t)
    if (rawLine.includes('\t')) {
      const cells = rawLine.split('\t');
      const picked = pickNameFromRowCells(cells);
      if (picked) {
        pushIfValid(picked);
      }
      continue;
    }

    const trimmed = normalizeWhitespace(rawLine);

    // Caso 2: Lista en una sola línea separada por punto y coma (ej: "Carlos; Lucía; Andrés")
    if (isSingleLineInput && trimmed.includes(';')) {
      for (const part of trimmed.split(';')) {
        pushIfValid(part);
      }
      continue;
    }

    // Caso 3: Lista en una sola línea separada por comas (ej: "Carlos, Juan, Pedro" o "Carlos,Juan")
    // IMPORTANTE: Si solo hay 1 coma con espacios (ej: "ALVARADO MONTOYA, Fransua Duban"),
    // se trata de UNA sola persona en formato "APELLIDOS, Nombres" y NO se divide.
    if (isSingleLineInput && trimmed.includes(',')) {
      const commaCount = (trimmed.match(/,/g) || []).length;
      const hasSpaces = trimmed.includes(' ');
      if (commaCount >= 2 || (commaCount === 1 && !hasSpaces && trimmed.length > 3)) {
        for (const part of trimmed.split(',')) {
          pushIfValid(part);
        }
        continue;
      }
    }

    pushIfValid(trimmed);
  }

  return result;
}

/**
 * Analiza texto pegado desde el portapapeles para decidir si debe importarse automáticamente
 * como lista estructurada (Excel, varias líneas, lista numerada o lista separada por comas/;)
 * o dejarse como entrada normal de un solo nombre.
 */
export function parsePastedParticipantText(rawText: string): {
  names: string[];
  isBulkPaste: boolean;
} {
  if (!rawText || !rawText.trim()) {
    return { names: [], isBulkPaste: false };
  }

  const trimmed = rawText.trim();
  const hasNewline = /\r?\n/.test(trimmed);
  const hasTab = trimmed.includes('\t');
  const hasSemicolon = trimmed.includes(';');
  const commaCount = (trimmed.match(/,/g) || []).length;
  const hasCommaList = commaCount >= 2 || (commaCount === 1 && !trimmed.includes(' '));
  const hasLeadingListNumber = /^(?:\[\d{1,5}\]|\d{1,5}[\.\)\-\|]\s*|\d{1,5}\s+[A-ZÁÉÍÓÚÜÑ]{2,})/.test(
    trimmed
  );

  const names = cleanExtractedNames(rawText);
  const isBulkPaste =
    names.length > 1 ||
    (names.length >= 1 && (hasNewline || hasTab || hasSemicolon || hasCommaList || hasLeadingListNumber));

  return { names, isBulkPaste };
}

/**
 * Parsea texto CSV/TSV respetando comillas y preservando el orden original.
 */
export function parseDelimitedText(text: string): string[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const hasTabs = lines.some((l) => l.includes('\t'));
  const hasSemicolons = lines.some((l) => l.includes(';'));

  if (hasTabs) {
    return cleanExtractedNames(text);
  }

  if (hasSemicolons) {
    const pickedLines = lines
      .map((line) => pickNameFromRowCells(splitDelimitedLine(line, ';')))
      .filter(Boolean);
    return cleanExtractedNames(pickedLines.join('\n'));
  }

  // Detectar si realmente es un CSV multi-columna (y no líneas tipo "APELLIDOS, Nombres")
  const hasQuotedCommas = lines.some((l) => /"[^"]*,[^"]*"/.test(l));
  const commaCounts = lines.map((l) => splitDelimitedLine(l, ',').length);
  const looksLikeIndexedCsv = lines.some((l) => /^\s*\d+\s*,/.test(l));

  if (hasQuotedCommas || looksLikeIndexedCsv || commaCounts.some((c) => c >= 3)) {
    const pickedLines = lines
      .map((line) => pickNameFromRowCells(splitDelimitedLine(line, ',')))
      .filter(Boolean);
    return cleanExtractedNames(pickedLines.join('\n'));
  }

  return cleanExtractedNames(text);
}

/**
 * Preprocesa una captura o foto en un <canvas> offscreen para mejorar drásticamente el OCR:
 * - Invierte automáticamente capturas en modo oscuro para que el texto sea oscuro sobre fondo blanco.
 * - Escala imágenes pequeñas (ej. capturas de Excel) a ~2x–3x con margen blanco limpio.
 * - Detecta y elimina líneas negras de cuadrícula de tablas (horizontales y verticales)
 *   sin dañar las letras, evitando caracteres fantasma "|" o "I".
 */
async function preprocessImageForOcr(file: File | Blob): Promise<string | File | Blob> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('No se pudo decodificar la imagen'));
      image.src = objectUrl;
    });

    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;
    if (!srcW || !srcH) return file;

    // Escalar capturas pequeñas para mejor lectura de acentos, "Ñ" y números
    const targetScale =
      srcW < 650 ? 3 : srcW < 1100 ? 2 : 1;
    const maxDim = 2400;
    const scale = Math.min(targetScale, maxDim / Math.max(srcW, srcH));
    const drawW = Math.max(1, Math.round(srcW * scale));
    const drawH = Math.max(1, Math.round(srcH * scale));
    const pad = 28;

    const canvas = document.createElement('canvas');
    canvas.width = drawW + pad * 2;
    canvas.height = drawH + pad * 2;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return file;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, pad, pad, drawW, drawH);

    const imageData = ctx.getImageData(pad, pad, drawW, drawH);
    const data = imageData.data;
    const totalPixels = drawW * drawH;

    // Paso 1: Convertir a luminancia y detectar si la captura está en modo oscuro
    const luma = new Uint8Array(totalPixels);
    let lumaSum = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const g = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      luma[p] = g;
      lumaSum += g;
    }

    const avgLuma = lumaSum / Math.max(1, totalPixels);
    const isDarkMode = avgLuma < 115;

    // Paso 2: Normalizar contraste suave (texto negro nítido sobre blanco puro)
    for (let p = 0; p < totalPixels; p++) {
      let v = isDarkMode ? 255 - luma[p] : luma[p];
      // Empujar fondos claros (celdas celestes/grises de Excel) hacia blanco puro
      if (v > 205) {
        v = 255;
      } else if (v < 95) {
        v = Math.max(0, Math.round(v * 0.55));
      } else {
        v = Math.round(((v - 95) / 110) * 255);
      }
      luma[p] = v;
    }

    // Paso 3: Detectar y borrar bordes continuos de tabla Excel (horizontales y verticales)
    if (drawW >= 180 && drawH >= 90) {
      const darkThreshold = 155;
      const hRowsToErase: number[] = [];
      for (let y = 0; y < drawH; y++) {
        let darkCount = 0;
        const rowOffset = y * drawW;
        for (let x = 0; x < drawW; x++) {
          if (luma[rowOffset + x] < darkThreshold) darkCount++;
        }
        if (darkCount / drawW >= 0.72) {
          hRowsToErase.push(y);
        }
      }

      const vColsToErase: number[] = [];
      for (let x = 0; x < drawW; x++) {
        let darkCount = 0;
        for (let y = 0; y < drawH; y++) {
          if (luma[y * drawW + x] < darkThreshold) darkCount++;
        }
        if (darkCount / drawH >= 0.72) {
          vColsToErase.push(x);
        }
      }

      for (const y of hRowsToErase) {
        for (let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= drawH) continue;
          const rowOffset = ny * drawW;
          for (let x = 0; x < drawW; x++) {
            luma[rowOffset + x] = 255;
          }
        }
      }

      for (const x of vColsToErase) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= drawW) continue;
          for (let y = 0; y < drawH; y++) {
            luma[y * drawW + nx] = 255;
          }
        }
      }
    }

    // Escribir imagen mejorada de vuelta al canvas
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const v = luma[p];
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, pad, pad);

    return canvas.toDataURL('image/png');
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Procesa cualquier archivo soportado (o captura pegada del portapapeles) y retorna
 * la lista limpia y ordenada de participantes.
 */
export async function extractParticipantsFromFile(
  file: File,
  onProgress?: (status: string) => void
): Promise<string[]> {
  const name = (file.name || '').toLowerCase();

  // 1. Archivos de texto plano (.txt, .csv, .tsv)
  if (name.endsWith('.txt') || name.endsWith('.csv') || name.endsWith('.tsv')) {
    onProgress?.('Leyendo archivo de texto...');
    const text = await file.text();
    if (name.endsWith('.csv') || name.endsWith('.tsv') || text.includes('\t') || text.includes(';')) {
      return parseDelimitedText(text);
    }
    return cleanExtractedNames(text);
  }

  // 2. Archivos de Excel (.xlsx, .xls)
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    onProgress?.('Cargando motor de Excel...');
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
    onProgress?.('Procesando hoja de cálculo...');
    const buffer = await file.arrayBuffer();
    const wb = window.XLSX.read(buffer, { type: 'array' });
    const firstSheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[firstSheetName];
    const rows: any[][] = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const rawNames: string[] = [];
    for (const row of rows) {
      if (!Array.isArray(row) || row.length === 0) continue;
      const picked = pickNameFromRowCells(row);
      if (picked) {
        rawNames.push(picked);
      }
    }
    return cleanExtractedNames(rawNames.join('\n'));
  }

  // 3. Documentos de Word (.docx)
  if (name.endsWith('.docx')) {
    onProgress?.('Cargando lector de Word (.docx)...');
    if (!window.mammoth) {
      await loadScript('https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js');
    }
    onProgress?.('Extrayendo texto del documento Word...');
    const buffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
    return cleanExtractedNames(result.value || '');
  }

  // 4. Documentos PDF (.pdf)
  if (name.endsWith('.pdf')) {
    onProgress?.('Cargando lector PDF...');
    if (!window.pdfjsLib) {
      await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      }
    }
    onProgress?.('Extrayendo páginas del PDF...');
    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str || '');
      fullText += strings.join('\n') + '\n';
    }
    return cleanExtractedNames(fullText);
  }

  // 5. Imágenes y capturas pegadas (OCR mediante Tesseract.js con preprocesado de tablas)
  if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp|gif)$/i.test(name)) {
    onProgress?.('Optimizando captura para lectura OCR...');
    const preparedImage = await preprocessImageForOcr(file);

    onProgress?.('Iniciando motor OCR de reconocimiento visual...');
    if (!window.Tesseract) {
      await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    }

    onProgress?.('Reconociendo nombres de la captura...');
    const { data } = await window.Tesseract.recognize(preparedImage, 'spa+eng', {
      logger: (m: any) => {
        if (m.status === 'recognizing text') {
          onProgress?.(`Extrayendo texto de la captura: ${Math.round((m.progress || 0) * 100)}%`);
        }
      },
    });
    return cleanExtractedNames(data.text || '');
  }

  throw new Error(
    `Formato no soportado (.${name.split('.').pop() || 'desconocido'}). Usa Word (.docx), Excel (.xlsx, .csv), PDF o Capturas/Imágenes (.png, .jpg).`
  );
}
