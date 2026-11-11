'use client';

import JSZip from 'jszip';
import { loadPdfDocument } from './pdfHelper';

export interface PdfToPptxOptions {
    onProgress?: (percent: number, message: string) => void;
}

/**
 * Converts a PDF document into a native Microsoft PowerPoint (.pptx) presentation.
 * Each PDF page is rendered as a full-resolution slide image embedded into an OpenXML PPTX.
 * 100% in-browser, zero external dependencies, works completely offline.
 */
export async function convertPdfToPptx(
    file: File,
    options: PdfToPptxOptions = {}
): Promise<{ blob: Blob; fileName: string; totalSlides: number }> {
    const { onProgress } = options;

    onProgress?.(10, 'Cargando documento PDF para renderizado de diapositivas…');
    const buffer = await file.arrayBuffer();
    const pdfDoc = await loadPdfDocument(buffer);
    const numPages = pdfDoc.numPages;

    const zip = new JSZip();

    // Standard 16:9 widescreen or 4:3 slide dimensions in EMUs (English Metric Units)
    // 1 pt = 12700 EMUs. A4 / Letter or Widescreen (12192000 x 6858000)
    const emuWidth = 12192000;  // 13.33 inches widescreen
    const emuHeight = 6858000;   // 7.5 inches

    // Collect slide images
    const slideImageEntries: { index: number; dataUrl: string; width: number; height: number }[] = [];

    for (let i = 1; i <= numPages; i++) {
        const percent = 15 + Math.round(((i - 0.5) / numPages) * 70);
        onProgress?.(percent, `Renderizando diapositiva ${i} de ${numPages} en alta resolución…`);

        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // High-DPI render

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            await page.render({ canvasContext: ctx, viewport } as any).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
            slideImageEntries.push({
                index: i,
                dataUrl,
                width: viewport.width,
                height: viewport.height,
            });
        }
    }

    onProgress?.(88, 'Estructurando archivo OpenXML para PowerPoint…');

    // 1. [Content_Types].xml
    let contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
`;

    for (let i = 1; i <= numPages; i++) {
        contentTypesXml += `  <Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n`;
    }
    contentTypesXml += `</Types>`;
    zip.file('[Content_Types].xml', contentTypesXml);

    // 2. _rels/.rels
    zip.file(
        '_rels/.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
    );

    // 3. ppt/presentation.xml
    let sldIdLst = '';
    for (let i = 1; i <= numPages; i++) {
        sldIdLst += `    <p:sldId id="${255 + i}" r:id="rId${i}"/>\n`;
    }

    zip.file(
        'ppt/presentation.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>
${sldIdLst}  </p:sldIdLst>
  <p:sldSz cx="${emuWidth}" cy="${emuHeight}" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`
    );

    // 4. ppt/_rels/presentation.xml.rels
    let presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n`;
    for (let i = 1; i <= numPages; i++) {
        presRels += `  <Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>\n`;
    }
    presRels += `</Relationships>`;
    zip.file('ppt/_rels/presentation.xml.rels', presRels);

    // 5. Slides and Media
    for (const slide of slideImageEntries) {
        const i = slide.index;

        // Convert base64 dataUrl to binary
        const base64Data = slide.dataUrl.split(',')[1];
        zip.file(`ppt/media/image${i}.jpeg`, base64Data, { base64: true });

        // Slide relation
        zip.file(
            `ppt/slides/_rels/slide${i}.xml.rels`,
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i}.jpeg"/>
</Relationships>`
        );

        // Slide XML with full-bleed image
        zip.file(
            `ppt/slides/slide${i}.xml`,
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="Diapositiva ${i}"/>
          <p:cNvPicPr>
            <a:picLocks noChangeAspect="1"/>
          </p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="rId1"/>
          <a:stretch>
            <a:fillRect/>
          </a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="${emuWidth}" cy="${emuHeight}"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`
        );
    }

    onProgress?.(95, 'Generando archivo final de PowerPoint (.pptx)…');
    const zipBlob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
    });

    onProgress?.(100, '¡Presentación PPTX lista!');

    const baseName = file.name.replace(/\.pdf$/i, '');
    return {
        blob: zipBlob,
        fileName: `${baseName}.pptx`,
        totalSlides: numPages,
    };
}
