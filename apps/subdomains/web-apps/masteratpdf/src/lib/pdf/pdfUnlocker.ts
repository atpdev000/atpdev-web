'use client';

import { PDFDocument } from 'pdf-lib';
import { getBackendUrl } from './backendClient';

export async function checkPdfEncrypted(buffer: ArrayBuffer, file?: File): Promise<boolean> {
    // Check locally with pdf-lib first (instant)
    try {
        await PDFDocument.load(buffer);
        // Also check via backend if available to detect permission-locked / AES-256 PDFs accurately
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch(`${getBackendUrl()}/api/convert/check-encryption`, {
                    method: 'POST',
                    body: formData,
                });
                if (res.ok) {
                    const data = await res.json();
                    return Boolean(data.is_encrypted || data.needs_password);
                }
            } catch {
                // ignore when offline
            }
        }
        return false;
    } catch (err: unknown) {
        const msg = (err instanceof Error ? err.message : String(err || '')).toLowerCase();
        if (msg.includes('encrypt') || msg.includes('password')) {
            return true;
        }
        return false;
    }
}

export async function unlockPdf(
    buffer: ArrayBuffer,
    password?: string,
    file?: File
): Promise<{ success: boolean; bytes?: Uint8Array; wasEncrypted: boolean; error?: string }> {
    // 1. Prefer backend PyMuPDF decryption (supports AES-256, AES-128, RC4, user & owner passwords)
    if (file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (password) formData.append('password', password);

            const res = await fetch(`${getBackendUrl()}/api/convert/unlock`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const blob = await res.blob();
                const outBuf = await blob.arrayBuffer();
                return {
                    success: true,
                    bytes: new Uint8Array(outBuf),
                    wasEncrypted: true,
                };
            }

            const errJson = await res.json().catch(() => ({}));
            return {
                success: false,
                wasEncrypted: true,
                error: errJson?.detail || 'La contraseña ingresada es incorrecta.',
            };
        } catch {
            // Backend offline -> evaluate local capabilities honestly
        }
    }

    // 2. Local pdf-lib: only works if PDF has no open-password encryption (e.g. unencrypted or readable without password)
    try {
        const testDoc = await PDFDocument.load(buffer);
        const cleanBytes = await testDoc.save();
        return {
            success: true,
            bytes: cleanBytes,
            wasEncrypted: false,
        };
    } catch (err: unknown) {
        const rawMsg = err instanceof Error ? err.message : String(err || '');
        const msg = rawMsg.toLowerCase();
        if (msg.includes('encrypt') || msg.includes('password')) {
            return {
                success: false,
                wasEncrypted: true,
                error:
                    'Este PDF usa cifrado con contraseña (AES/RC4). Para descifrarlo de forma segura se requiere que el motor de conversión esté activo.',
            };
        }
        return {
            success: false,
            wasEncrypted: true,
            error: `No se pudo abrir el PDF: ${rawMsg || 'Error desconocido'}`,
        };
    }
}
