import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se envió ningún archivo para extraer.' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    let extractedText = '';

    if (fileName.endsWith('.txt')) {
      extractedText = await file.text();
    } else if (fileName.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || '';
    } else if (fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      // @ts-expect-error pdf.worker.mjs lacks type declarations in pdfjs-dist
      await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
        disableFontFace: true,
      });
      const doc = await loadingTask.promise;
      const pagesText: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const pageStr = textContent.items
          .map((item: unknown) =>
            item && typeof item === 'object' && 'str' in item && typeof item.str === 'string'
              ? item.str
              : ''
          )
          .join(' ');
        if (pageStr.trim()) {
          pagesText.push(pageStr.trim());
        }
      }
      extractedText = pagesText.join('\n\n');
    } else if (fileName.endsWith('.doc')) {
      return NextResponse.json(
        {
          success: false,
          error: 'El formato .doc es heredado (antiguo). Por favor guárdalo como archivo .docx o .pdf, o pega el texto directamente.',
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Formato de archivo no soportado (${file.name}). Sube un archivo en formato PDF, Word (.docx) o Texto (.txt).`,
        },
        { status: 400 }
      );
    }

    // Limpieza y normalización de texto extraído
    const cleaned = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleaned || cleaned.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error:
            'No se pudo extraer texto legible del documento. Si es un PDF escaneado (imagen), por favor copia y pega el texto directamente en el recuadro.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      text: cleaned,
      charCount: cleaned.length,
    });
  } catch (err: unknown) {
    console.error('Error al extraer texto del CV:', err);
    const message =
      err instanceof Error ? err.message : 'Error interno al procesar el archivo.';
    return NextResponse.json(
      {
        success: false,
        error: `No se pudo procesar el archivo: ${message}. Puedes copiar y pegar el contenido directamente.`,
      },
      { status: 500 }
    );
  }
}
