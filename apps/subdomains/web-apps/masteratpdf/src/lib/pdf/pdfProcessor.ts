import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getPdfJs } from './pdfHelper';

export class PDFProcessor {
    // --- Merge ---
    static async mergePDFs(files: File[]): Promise<Uint8Array> {
        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const fileBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            return await mergedPdf.save();
        } catch (error) {
            console.error('Error merging PDFs:', error);
            throw new Error('Failed to merge PDFs');
        }
    }

    // --- Split ---
    static async splitPDF(file: File, fromPage: number, toPage: number): Promise<Uint8Array> {
        try {
            const fileBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(fileBuffer);
            const newPdf = await PDFDocument.create();

            const pageCount = pdf.getPageCount();
            if (fromPage < 1 || toPage > pageCount || fromPage > toPage) {
                throw new Error(`Invalid page range. Document has ${pageCount} pages.`);
            }

            const pageIndices = [];
            for (let i = fromPage - 1; i < toPage; i++) {
                pageIndices.push(i);
            }

            const copiedPages = await newPdf.copyPages(pdf, pageIndices);
            copiedPages.forEach((page) => newPdf.addPage(page));

            return await newPdf.save();
        } catch (error: any) {
            console.error('Error splitting PDF:', error);
            throw new Error(error.message || 'Failed to split PDF');
        }
    }

    // --- Images to PDF ---
    static async imagesToPDF(files: File[]): Promise<Uint8Array> {
        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const imageBytes = await file.arrayBuffer();
                let image;

                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else {
                    continue;
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            return await pdfDoc.save();
        } catch (error) {
            console.error('Error converting images to PDF:', error);
            throw new Error('Failed to convert images to PDF');
        }
    }

    // --- Compress ---
    static async compressPDF(file: File): Promise<Uint8Array> {
        try {
            const fileBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(fileBuffer);
            return await pdf.save({ useObjectStreams: false });
        } catch (error) {
            console.error('Error compressing PDF:', error);
            throw new Error('Failed to compress PDF');
        }
    }

    // --- PDF to Word (Text Extraction) ---
    static async pdfToText(file: File): Promise<string> {
        try {
            const pdfjs = await getPdfJs();
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            return fullText;
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw new Error('Failed to extract text from PDF');
        }
    }

    // --- Word (Text) to PDF ---
    static async textToPDF(text: string): Promise<Uint8Array> {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontSize = 12;

            page.drawText(text, {
                x: 50,
                y: height - 4 * fontSize,
                size: fontSize,
                font: font,
                maxWidth: width - 100,
                lineHeight: fontSize * 1.2,
            });

            return await pdfDoc.save();
        } catch (error) {
            console.error('Error creating PDF from text:', error);
            throw new Error('Failed to create PDF from text');
        }
    }

    // --- Thumbnail Generation ---
    static async generateThumbnail(file: File): Promise<string> {
        if (typeof window === 'undefined') return ''; // Client-side only

        try {
            const pdfjs = await getPdfJs();
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);

            const viewport = page.getViewport({ scale: 0.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) throw new Error('Canvas context not available');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport,
            } as any).promise;

            return canvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
            console.error('Error generating thumbnail:', error);
            return '';
        }
    }
}
