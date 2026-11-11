/**
 * Midudev's runonweb AI Integration
 * Runs state-of-the-art neural models 100% locally in the browser with WebGPU & WASM.
 * Zero external servers, zero API costs, zero data leak.
 */

let removerInstance = null;
let ocrInstance = null;

export async function isWebGPUSupported() {
    return typeof navigator !== 'undefined' && Boolean(navigator.gpu);
}

/**
 * Remove background with runonweb (BEN2 neural network)
 * @param {string | Blob} imageSource 
 * @param {(progress: { status: string, progress?: number, file?: string, loaded?: number, total?: number }) => void} onProgress 
 * @returns {Promise<string>} Base64 data URL with transparent background
 */
export async function removeBackgroundRunOnWeb(imageSource, onProgress) {
    console.log("🚀 Initializing runonweb BEN2 background remover...");

    const { RemoveBackground } = await import('runonweb/remove-bg');

    if (!removerInstance) {
        removerInstance = new RemoveBackground({
            onProgress: (info) => {
                if (onProgress) onProgress(info);
            }
        });
        await removerInstance.load();
    }

    let input = imageSource;
    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
        const res = await fetch(imageSource);
        input = await res.blob();
    }

    const outputBlob = await removerInstance.remove(input);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(outputBlob);
    });
}

/**
 * Local OCR text extraction using runonweb (PaddleOCR PP-OCRv6)
 * @param {string | Blob} imageSource 
 * @param {(progress: any) => void} onProgress 
 * @returns {Promise<{ fullText: string, dniNumber?: string, lines: any[] }>}
 */
export async function extractDniTextRunOnWeb(imageSource, onProgress) {
    console.log("🔍 Initializing runonweb OCR engine...");

    const { OCR } = await import('runonweb/ocr');

    if (!ocrInstance) {
        ocrInstance = new OCR({
            size: 'tiny', // Fast & lightweight (~10MB)
            onProgress: (info) => {
                if (onProgress) onProgress(info);
            }
        });
        await ocrInstance.load();
    }

    let input = imageSource;
    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
        const res = await fetch(imageSource);
        input = await res.blob();
    }

    const result = await ocrInstance.read(input);
    const fullText = result.text || '';

    // Extract potential 8-digit DNI number (Peru / standard ID)
    const dniMatch = fullText.match(/\b\d{8}\b/);
    const dniNumber = dniMatch ? dniMatch[0] : null;

    return {
        fullText,
        dniNumber,
        lines: result.lines || [],
        confidence: result.confidence || 0
    };
}
