import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { KDP_TRIM_SPECS, KdpTrimSize, LineArtOptions, processImageToLineArt300Dpi } from './lineArtProcessor';

const PT_PER_INCH = 72;

export interface KdpInteriorConfig {
  bookTitle: string;
  subtitle: string;
  authorName: string;
  trimSize: KdpTrimSize;
  includeBleed: boolean;
  includeBlankVerso: boolean;
  includeBelongsToPage: boolean;
  includeCopyrightPage: boolean;
  aiDisclosureNote: boolean;
  lineArtOptions: LineArtOptions;
}

export interface KdpBookPageInput {
  id: string;
  title: string;
  imageSrc: string;
}

export interface KdpCoverConfig {
  bookTitle: string;
  subtitle: string;
  authorName: string;
  backBlurb: string;
  trimSize: KdpTrimSize;
  totalInteriorPages: number;
  paperType: 'white' | 'cream';
  bgColorHex: string;
  accentColorHex: string;
  frontImageSrc?: string;
}

export interface SpineDimensions {
  trimWidthIn: number;
  trimHeightIn: number;
  spineWidthIn: number;
  spineWidthMm: number;
  fullWidthIn: number;
  fullHeightIn: number;
  fullWidthPx300: number;
  fullHeightPx300: number;
  bleedIn: number;
  spineTextAllowed: boolean;
}

/**
 * Fórmula oficial de Amazon KDP para grosor de lomo en tapa blanda (Paperback):
 * - Papel blanco interior B/N: páginas × 0.002252 pulgadas
 * - Papel crema interior B/N: páginas × 0.0025 pulgadas
 * - Sangrado (bleed) exterior: 0.125" en cada borde externo
 */
export function calculateKdpSpine(
  trimSize: KdpTrimSize,
  totalInteriorPages: number,
  paperType: 'white' | 'cream'
): SpineDimensions {
  const safePages = Math.max(24, Math.min(828, Math.round(totalInteriorPages)));
  const spec = KDP_TRIM_SPECS[trimSize];
  const factor = paperType === 'cream' ? 0.0025 : 0.002252;
  const bleedIn = 0.125;
  const spineWidthIn = Number((safePages * factor).toFixed(4));
  const spineWidthMm = Number((spineWidthIn * 25.4).toFixed(2));
  const fullWidthIn = Number((bleedIn * 2 + spec.widthIn * 2 + spineWidthIn).toFixed(4));
  const fullHeightIn = Number((bleedIn * 2 + spec.heightIn).toFixed(4));

  return {
    trimWidthIn: spec.widthIn,
    trimHeightIn: spec.heightIn,
    spineWidthIn,
    spineWidthMm,
    fullWidthIn,
    fullHeightIn,
    fullWidthPx300: Math.round(fullWidthIn * 300),
    fullHeightPx300: Math.round(fullHeightIn * 300),
    bleedIn,
    spineTextAllowed: safePages >= 79,
  };
}

function hexToRgbNorm(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

function sanitizePdfText(text: string): string {
  // StandardFonts WinAnsi encoding safe normalization
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}

async function dataUrlToBytes(dataUrl: string): Promise<Uint8Array> {
  const res = await fetch(dataUrl);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

/**
 * Exporta una sola lámina a PDF de 300 DPI reales (Carta o A4) para descarga gratuita inmediata.
 */
export async function buildSingleSheetPdf(
  imageSrc: string,
  title: string,
  trimSize: KdpTrimSize = '8.5x11',
  lineArtOptions: LineArtOptions = {
    threshold: 185,
    boldness: 0,
    addFrame: false,
    pureBlackWhite: false,
  }
): Promise<Uint8Array> {
  const spec = KDP_TRIM_SPECS[trimSize];
  const pngDataUrl = await processImageToLineArt300Dpi(imageSrc, trimSize, lineArtOptions, 1);
  const pngBytes = await dataUrlToBytes(pngDataUrl);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(sanitizePdfText(title));
  pdfDoc.setCreator('Colorear Pro — colorear.atpdev.dev');

  const pageW = spec.widthIn * PT_PER_INCH;
  const pageH = spec.heightIn * PT_PER_INCH;
  const page = pdfDoc.addPage([pageW, pageH]);
  const pngImage = await pdfDoc.embedPng(pngBytes);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: pageW,
    height: pageH,
  });

  return pdfDoc.save();
}

/**
 * Compila un manuscrito PDF Interior completo listo para subir a Amazon KDP (300 DPI reales),
 * incluyendo portada interior, "Este libro pertenece a...", aviso legal y reversos en blanco automáticos.
 */
export async function buildKdpInteriorPdf(
  pages: KdpBookPageInput[],
  config: KdpInteriorConfig,
  onProgress?: (current: number, total: number, label: string) => void
): Promise<{ pdfBytes: Uint8Array; totalPages: number }> {
  const spec = KDP_TRIM_SPECS[config.trimSize];
  const bleedW = config.includeBleed ? 0.125 : 0;
  const bleedH = config.includeBleed ? 0.25 : 0;
  const pageW = (spec.widthIn + bleedW) * PT_PER_INCH;
  const pageH = (spec.heightIn + bleedH) * PT_PER_INCH;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(sanitizePdfText(config.bookTitle || 'Libro para Colorear KDP'));
  pdfDoc.setAuthor(sanitizePdfText(config.authorName || 'Autor Independiente'));
  pdfDoc.setCreator('Estudio KDP — Colorear Pro (colorear.atpdev.dev)');

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // 1. Portada interior (Página 1 - impar)
  const titlePage = pdfDoc.addPage([pageW, pageH]);
  const safeTitle = sanitizePdfText(config.bookTitle || 'Mi Libro para Colorear');
  const safeSubtitle = sanitizePdfText(config.subtitle || 'Colección de Ilustraciones Originales');
  const safeAuthor = sanitizePdfText(config.authorName || '');

  // Marco decorativo en portada interior
  const m = 48;
  titlePage.drawRectangle({
    x: m,
    y: m,
    width: pageW - m * 2,
    height: pageH - m * 2,
    borderColor: rgb(0.1, 0.1, 0.1),
    borderWidth: 2,
  });

  const titleSize = 28;
  const titleW = fontBold.widthOfTextAtSize(safeTitle.slice(0, 42), titleSize);
  titlePage.drawText(safeTitle.slice(0, 42), {
    x: Math.max(60, (pageW - titleW) / 2),
    y: pageH * 0.62,
    size: titleSize,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.08),
  });

  const subSize = 14;
  const subW = fontRegular.widthOfTextAtSize(safeSubtitle.slice(0, 68), subSize);
  titlePage.drawText(safeSubtitle.slice(0, 68), {
    x: Math.max(60, (pageW - subW) / 2),
    y: pageH * 0.56,
    size: subSize,
    font: fontRegular,
    color: rgb(0.28, 0.28, 0.28),
  });

  if (safeAuthor) {
    const authText = `Por ${safeAuthor}`;
    const authW = fontBold.widthOfTextAtSize(authText, 13);
    titlePage.drawText(authText, {
      x: Math.max(60, (pageW - authW) / 2),
      y: pageH * 0.22,
      size: 13,
      font: fontBold,
      color: rgb(0.15, 0.15, 0.15),
    });
  }

  // 2. Página de Derechos de Autor (Página 2 - par)
  if (config.includeCopyrightPage) {
    const copyPage = pdfDoc.addPage([pageW, pageH]);
    const year = new Date().getFullYear();
    const lines = [
      `Copyright (c) ${year} ${safeAuthor || 'Edición Independiente'}.`,
      'Todos los derechos reservados.',
      '',
      'Ninguna parte de esta publicación puede reproducirse, almacenarse',
      'o transmitirse con fines comerciales sin autorización escrita del autor.',
      '',
      'Impresión bajo demanda preparada en formato 300 DPI.',
      ...(config.aiDisclosureNote
        ? [
            '',
            'Nota editorial: Ilustraciones asistidas con herramientas digitales e IA,',
            'curadas y optimizadas para impresión limpia en blanco y negro.',
          ]
        : []),
    ];
    let yCursor = pageH * 0.34;
    for (const line of lines) {
      copyPage.drawText(sanitizePdfText(line), {
        x: 68,
        y: yCursor,
        size: 10,
        font: fontRegular,
        color: rgb(0.25, 0.25, 0.25),
      });
      yCursor -= 16;
    }
  } else if (config.includeBelongsToPage) {
    // Asegurar que "Este libro pertenece a" caiga en página impar (derecha)
    pdfDoc.addPage([pageW, pageH]);
  }

  // 3. Página "Este libro pertenece a..." (impar) + reverso en blanco
  if (config.includeBelongsToPage) {
    const belongsPage = pdfDoc.addPage([pageW, pageH]);
    belongsPage.drawRectangle({
      x: 72,
      y: pageH * 0.36,
      width: pageW - 144,
      height: pageH * 0.28,
      borderColor: rgb(0.1, 0.1, 0.1),
      borderWidth: 2,
    });
    const heading = 'Este libro para colorear pertenece a:';
    const hw = fontBold.widthOfTextAtSize(heading, 17);
    belongsPage.drawText(heading, {
      x: (pageW - hw) / 2,
      y: pageH * 0.56,
      size: 17,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    belongsPage.drawLine({
      start: { x: 120, y: pageH * 0.45 },
      end: { x: pageW - 120, y: pageH * 0.45 },
      thickness: 1.5,
      color: rgb(0.2, 0.2, 0.2),
    });
    // Reverso en blanco para que la primera ilustración empiece en página impar (derecha)
    pdfDoc.addPage([pageW, pageH]);
  }

  // 4. Ilustraciones a 300 DPI + reverso en blanco automático
  for (let i = 0; i < pages.length; i++) {
    const item = pages[i];
    onProgress?.(i + 1, pages.length, `Procesando página ${i + 1} de ${pages.length} a 300 DPI...`);

    const pngDataUrl = await processImageToLineArt300Dpi(
      item.imageSrc,
      config.trimSize,
      {
        ...config.lineArtOptions,
        caption: config.lineArtOptions.caption ? item.title : undefined,
      },
      1
    );
    const pngBytes = await dataUrlToBytes(pngDataUrl);
    const pngImage = await pdfDoc.embedPng(pngBytes);

    const artPage = pdfDoc.addPage([pageW, pageH]);
    // Pequeño ajuste de margen interior (gutter) hacia el lomo
    artPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
    });

    if (config.includeBlankVerso) {
      pdfDoc.addPage([pageW, pageH]);
    }
  }

  // Amazon KDP exige mínimo 24 páginas en libros de tapa blanda (Paperback)
  while (pdfDoc.getPageCount() < 24) {
    pdfDoc.addPage([pageW, pageH]);
  }

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, totalPages: pdfDoc.getPageCount() };
}

/**
 * Genera el PDF completo de Portada Tapa Blanda para Amazon KDP (Contraportada + Lomo exacto + Portada + Sangrado 0.125").
 */
export async function buildKdpFullWrapCoverPdf(config: KdpCoverConfig): Promise<Uint8Array> {
  const dims = calculateKdpSpine(config.trimSize, config.totalInteriorPages, config.paperType);
  const fullW = dims.fullWidthIn * PT_PER_INCH;
  const fullH = dims.fullHeightIn * PT_PER_INCH;
  const bleedPt = dims.bleedIn * PT_PER_INCH;
  const trimW = dims.trimWidthIn * PT_PER_INCH;
  const spineW = dims.spineWidthIn * PT_PER_INCH;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(sanitizePdfText(`Portada KDP - ${config.bookTitle}`));
  pdfDoc.setCreator('Estudio KDP — Colorear Pro (colorear.atpdev.dev)');

  const page = pdfDoc.addPage([fullW, fullH]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const bg = hexToRgbNorm(config.bgColorHex || '#2563EB');
  const accent = hexToRgbNorm(config.accentColorHex || '#FACC15');

  // Fondo completo (incluye sangrado 0.125")
  page.drawRectangle({
    x: 0,
    y: 0,
    width: fullW,
    height: fullH,
    color: rgb(bg.r, bg.g, bg.b),
  });

  // Coordenadas de los 3 paneles
  const backStartX = bleedPt;
  const spineStartX = bleedPt + trimW;
  const frontStartX = bleedPt + trimW + spineW;

  // Panel Lomo con tono ligeramente más oscuro o acento sutil
  page.drawRectangle({
    x: spineStartX,
    y: 0,
    width: spineW,
    height: fullH,
    color: rgb(Math.max(0, bg.r * 0.86), Math.max(0, bg.g * 0.86), Math.max(0, bg.b * 0.86)),
  });

  // --- PORTADA FRONTAL (derecha) ---
  const frontPad = 36;
  const frontBoxX = frontStartX + frontPad;
  const frontBoxW = trimW - frontPad * 2;

  // Banda de título superior amarilla/acento
  page.drawRectangle({
    x: frontBoxX,
    y: fullH - bleedPt - 135,
    width: frontBoxW,
    height: 98,
    color: rgb(accent.r, accent.g, accent.b),
    borderColor: rgb(0.08, 0.08, 0.08),
    borderWidth: 2.5,
  });

  const safeTitle = sanitizePdfText(config.bookTitle || 'MI LIBRO PARA COLOREAR').toUpperCase().slice(0, 34);
  const titleFontSize = safeTitle.length > 22 ? 22 : 28;
  const tWidth = fontBold.widthOfTextAtSize(safeTitle, titleFontSize);
  page.drawText(safeTitle, {
    x: frontBoxX + Math.max(12, (frontBoxW - tWidth) / 2),
    y: fullH - bleedPt - 82,
    size: titleFontSize,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.08),
  });

  const safeSub = sanitizePdfText(config.subtitle || 'Edición de Ilustraciones Bold & Easy').slice(0, 56);
  const subWidth = fontRegular.widthOfTextAtSize(safeSub, 12);
  page.drawText(safeSub, {
    x: frontBoxX + Math.max(12, (frontBoxW - subWidth) / 2),
    y: fullH - bleedPt - 114,
    size: 12,
    font: fontRegular,
    color: rgb(0.12, 0.12, 0.12),
  });

  // Ventana blanca central en portada para la ilustración destacada
  const artBoxY = bleedPt + 86;
  const artBoxH = fullH - bleedPt * 2 - 245;
  page.drawRectangle({
    x: frontBoxX,
    y: artBoxY,
    width: frontBoxW,
    height: artBoxH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.08, 0.08, 0.08),
    borderWidth: 2.5,
  });

  if (config.frontImageSrc) {
    try {
      const pngDataUrl = await processImageToLineArt300Dpi(
        config.frontImageSrc,
        config.trimSize,
        { threshold: 185, boldness: 0, addFrame: false, pureBlackWhite: false },
        0.5
      );
      const pngBytes = await dataUrlToBytes(pngDataUrl);
      const img = await pdfDoc.embedPng(pngBytes);
      const padImg = 18;
      const availW = frontBoxW - padImg * 2;
      const availH = artBoxH - padImg * 2;
      const ratio = Math.min(availW / img.width, availH / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      page.drawImage(img, {
        x: frontBoxX + (frontBoxW - dw) / 2,
        y: artBoxY + (artBoxH - dh) / 2,
        width: dw,
        height: dh,
      });
    } catch {
      // Continuar sin imagen si falla lectura
    }
  }

  // Pie de autor en portada
  const safeAuthor = sanitizePdfText(config.authorName || 'Colorear Pro Studio');
  const authW = fontBold.widthOfTextAtSize(safeAuthor, 14);
  page.drawText(safeAuthor, {
    x: frontBoxX + Math.max(12, (frontBoxW - authW) / 2),
    y: bleedPt + 44,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // --- CONTRAPORTADA (izquierda) ---
  const backPad = 42;
  const backBoxX = backStartX + backPad;
  const backBoxW = trimW - backPad * 2;

  page.drawRectangle({
    x: backBoxX,
    y: fullH * 0.44,
    width: backBoxW,
    height: fullH * 0.4,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.08, 0.08, 0.08),
    borderWidth: 2,
  });

  const backHeader = sanitizePdfText('Sobre este libro para colorear');
  page.drawText(backHeader, {
    x: backBoxX + 24,
    y: fullH * 0.79,
    size: 16,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.08),
  });

  const blurbText = sanitizePdfText(
    config.backBlurb ||
      'Disfruta horas de creatividad y relajación con ilustraciones de contornos nítidos pensadas para lápices, crayolas y plumones. Cada lámina cuenta con reverso en blanco para proteger tus obras.'
  );
  const words = blurbText.split(/\s+/);
  const wrappedLines: string[] = [];
  let currentLine = '';
  for (const w of words) {
    const test = currentLine ? `${currentLine} ${w}` : w;
    if (fontRegular.widthOfTextAtSize(test, 11.5) > backBoxW - 48) {
      wrappedLines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) wrappedLines.push(currentLine);

  let blurbY = fullH * 0.74;
  for (const line of wrappedLines.slice(0, 11)) {
    page.drawText(line, {
      x: backBoxX + 24,
      y: blurbY,
      size: 11.5,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });
    blurbY -= 17;
  }

  // Recuadro blanco reservado para código de barras ISBN de Amazon KDP (2" x 1.2" inferior derecha de contraportada)
  const barcodeW = 2.0 * PT_PER_INCH;
  const barcodeH = 1.2 * PT_PER_INCH;
  const barcodeX = spineStartX - barcodeW - 28;
  const barcodeY = bleedPt + 28;
  page.drawRectangle({
    x: barcodeX,
    y: barcodeY,
    width: barcodeW,
    height: barcodeH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  });
  page.drawText('Espacio reservado ISBN KDP', {
    x: barcodeX + 12,
    y: barcodeY + barcodeH / 2 - 4,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.45, 0.45, 0.45),
  });

  return pdfDoc.save();
}

export function triggerPdfDownload(bytes: Uint8Array, filename: string) {
  const safeBytes = new Uint8Array(bytes);
  const blob = new Blob([safeBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

