/**
 * Extractor inteligente de listas de participantes desde archivos locales:
 * - Excel (.xlsx, .xls)
 * - CSV / TSV / TXT (.csv, .txt, .tsv)
 * - Word (.docx)
 * - PDF (.pdf)
 * - Imágenes con nombres mediante OCR (.png, .jpg, .jpeg, .webp)
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

/**
 * Limpia y normaliza texto crudo en una lista limpia de nombres (1 por línea).
 * Remueve numeraciones (1., 2), viñetas (•, -, *), encabezados comunes y espacios vacíos.
 */
export function cleanExtractedNames(rawText: string): string[] {
  const commonHeaders = new Set([
    'nombre', 'nombres', 'nombre y apellido', 'apellidos y nombres', 'participante',
    'participantes', 'lista', 'integrante', 'integrantes', 'persona', 'personas',
    'item', 'nro', 'n°', 'no', 'id', 'dni', 'name', 'names', 'players', 'teams'
  ]);

  const lines = rawText.split(/\r?\n/);
  const result: string[] = [];

  for (let line of lines) {
    let clean = line.trim();
    if (!clean) continue;

    // Remover prefijos de lista como "1.", "1)", "1.-", "01.", "[1]", "-", "*", "•"
    clean = clean.replace(/^(\d+[\.\)\-\s]+|\[\d+\]\s*|[\-\*\•\–\—]\s*)/, '').trim();

    // Limpieza inteligente para OCR: remover artefactos de escaneo como "|", "]", "[", "/", ":" o letras sueltas de casillas
    clean = clean.replace(/^([\|\\\/\]\[\)\(\>\<\:\;\_\+\~]\s*)+/, '').trim();
    clean = clean.replace(/^[a-zA-Z0-9]\s+(?=[a-zA-ZáéíóúñÁÉÍÓÚÑ]{2,})/, '').trim();

    // Remover sufijos de OCR o anotaciones entre corchetes tipo "[OC", "[-", "]"
    clean = clean.replace(/\s*(\[.*?\]?|[\-\]\;\|\:\*]+)$/, '').trim();

    // Si tiene comas o punto y coma y parece una lista en una sola línea (ej. Carlos, Juan, Pedro)
    if (clean.includes(',') && !clean.includes(' ') && clean.length > 3) {
      const parts = clean.split(',');
      for (const p of parts) {
        const pt = p.trim();
        if (pt && !commonHeaders.has(pt.toLowerCase())) {
          result.push(pt);
        }
      }
      continue;
    }

    // Omitir si es un encabezado común de tabla
    if (commonHeaders.has(clean.toLowerCase())) {
      continue;
    }

    // Omitir si solo son números o caracteres no válidos
    if (/^\d+$/.test(clean) || clean.length < 2) {
      continue;
    }

    result.push(clean);
  }

  // Deduplicar manteniendo orden o permitir duplicados si son personas con mismo nombre
  return result;
}

/**
 * Procesa cualquier archivo soportado y retorna la lista limpia de participantes.
 */
export async function extractParticipantsFromFile(
  file: File,
  onProgress?: (status: string) => void
): Promise<string[]> {
  const name = file.name.toLowerCase();

  // 1. Archivos de texto plano (.txt, .csv, .tsv)
  if (name.endsWith('.txt') || name.endsWith('.csv') || name.endsWith('.tsv')) {
    onProgress?.('Leyendo archivo de texto plano...');
    const text = await file.text();

    // Si es CSV o TSV, intentar detectar si es una tabla delimitada
    if (name.endsWith('.csv') || name.endsWith('.tsv') || text.includes(';') || text.includes(',')) {
      const delimiter = text.includes(';') ? ';' : text.includes('\t') ? '\t' : ',';
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      
      // Buscar la columna con mayor probabilidad de contener nombres
      const candidateLines: string[] = [];
      for (const line of lines) {
        const cols = line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());
        // Tomar la primera columna con texto alfabético no vacío
        const bestCol = cols.find((c) => c.length > 1 && /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(c)) || cols[0];
        if (bestCol) candidateLines.push(bestCol);
      }
      return cleanExtractedNames(candidateLines.join('\n'));
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
      // Buscar la primera celda con texto tipo nombre
      const nameCell = row.find((cell) => typeof cell === 'string' && cell.trim().length > 1);
      if (nameCell) {
        rawNames.push(String(nameCell).trim());
      } else if (row[0] !== undefined && row[0] !== null && String(row[0]).trim().length > 1) {
        rawNames.push(String(row[0]).trim());
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

  // 5. Imágenes (OCR mediante Tesseract.js)
  if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(name)) {
    onProgress?.('Iniciando motor OCR de reconocimiento visual...');
    if (!window.Tesseract) {
      await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    }
    onProgress?.('Analizando imagen y reconociendo texto (OCR)...');
    const { data } = await window.Tesseract.recognize(file, 'spa+eng', {
      logger: (m: any) => {
        if (m.status === 'recognizing text') {
          onProgress?.(`Reconociendo texto: ${Math.round((m.progress || 0) * 100)}%`);
        }
      }
    });
    return cleanExtractedNames(data.text || '');
  }

  throw new Error(
    `Formato no soportado (.${name.split('.').pop()}). Usa Word (.docx), Excel (.xlsx, .csv), PDF o Imágenes (.png, .jpg).`
  );
}

