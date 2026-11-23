'use client';

import JSZip from 'jszip';
import { loadPdfDocument, formatPdfError } from './pdfHelper';

export interface PdfToPptxOptions {
    onProgress?: (percent: number, message: string) => void;
}

/**
 * Client-side fallback: converts each PDF page into a properly proportioned PowerPoint (.pptx) slide.
 */
export async function convertPdfToPptx(
    file: File,
    options: PdfToPptxOptions = {}
): Promise<{ blob: Blob; fileName: string; totalSlides: number }> {
    const { onProgress } = options;

    try {
        onProgress?.(10, 'Cargando documento PDF para renderizado de diapositivas…');
        const buffer = await file.arrayBuffer();
        const pdfDoc = await loadPdfDocument(buffer);
        const numPages = pdfDoc.numPages;

        const zip = new JSZip();

        // Dimensionar la presentación según la primera página del PDF (1 pt = 12700 EMUs)
        const firstPage = await pdfDoc.getPage(1);
        const firstVp = firstPage.getViewport({ scale: 1 });
        const emuWidth = Math.round(firstVp.width * 12700);
        const emuHeight = Math.round(firstVp.height * 12700);

        const slideImageEntries: {
            index: number;
            dataUrl: string;
            offsetX: number;
            offsetY: number;
            picWidth: number;
            picHeight: number;
        }[] = [];

        for (let i = 1; i <= numPages; i++) {
            const percent = 15 + Math.round(((i - 0.5) / numPages) * 70);
            onProgress?.(percent, `Renderizando diapositiva ${i} de ${numPages} en alta resolución…`);

            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.75 });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                await page.render({ canvasContext: ctx, canvas, viewport }).promise;
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

                // Ajustar manteniendo proporción dentro del slide sin estirar
                const imgRatio = viewport.width / viewport.height;
                const slideRatio = emuWidth / emuHeight;
                let picWidth = emuWidth;
                let picHeight = emuHeight;
                if (imgRatio > slideRatio) {
                    picHeight = Math.round(emuWidth / imgRatio);
                } else {
                    picWidth = Math.round(emuHeight * imgRatio);
                }
                const offsetX = Math.round((emuWidth - picWidth) / 2);
                const offsetY = Math.round((emuHeight - picHeight) / 2);

                slideImageEntries.push({
                    index: i,
                    dataUrl,
                    offsetX,
                    offsetY,
                    picWidth,
                    picHeight,
                });
            }
        }

        onProgress?.(88, 'Estructurando archivo OpenXML para PowerPoint…');

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

        zip.file(
            '_rels/.rels',
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
        );

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
  <p:sldSz cx="${emuWidth}" cy="${emuHeight}" type="custom"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`
        );

        let presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n`;
        for (let i = 1; i <= numPages; i++) {
            presRels += `  <Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>\n`;
        }
        presRels += `</Relationships>`;
        zip.file('ppt/_rels/presentation.xml.rels', presRels);

        for (const slide of slideImageEntries) {
            const i = slide.index;
            const base64Data = slide.dataUrl.split(',')[1];
            zip.file(`ppt/media/image${i}.jpeg`, base64Data, { base64: true });

            zip.file(
                `ppt/slides/_rels/slide${i}.xml.rels`,
                `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i}.jpeg"/>
</Relationships>`
            );

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
            <a:off x="${slide.offsetX}" y="${slide.offsetY}"/>
            <a:ext cx="${slide.picWidth}" cy="${slide.picHeight}"/>
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
    } catch (err) {
        throw new Error(formatPdfError(err, 'No se pudo convertir el PDF a PowerPoint.'));
    }
}
