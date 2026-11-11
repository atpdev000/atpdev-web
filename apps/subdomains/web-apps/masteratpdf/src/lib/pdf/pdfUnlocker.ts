'use client';

import { PDFDocument } from 'pdf-lib';

/**
 * Checks if a PDF is encrypted or requires a password
 */
export async function checkPdfEncrypted(buffer: ArrayBuffer): Promise<boolean> {
    try {
        await PDFDocument.load(buffer);
        return false;
    } catch (err: any) {
        const msg = String(err?.message || '').toLowerCase();
        if (msg.includes('encrypt') || msg.includes('password')) {
            return true;
        }
        return false;
    }
}

/**
 * Decrypts a PDF using the provided password and saves a clean, unrestricted version.
 */
export async function unlockPdf(
    buffer: ArrayBuffer,
    password?: string
): Promise<{ success: boolean; bytes?: Uint8Array; wasEncrypted: boolean; error?: string }> {
    try {
        // First try loading without password
        let isEncrypted = false;
        try {
            const testDoc = await PDFDocument.load(buffer);
            // It opened without password!
            const cleanBytes = await testDoc.save();
            return {
                success: true,
                bytes: cleanBytes,
                wasEncrypted: false,
            };
        } catch (e: any) {
            isEncrypted = true;
        }

        if (!password) {
            return {
                success: false,
                wasEncrypted: true,
                error: 'Este documento está protegido con contraseña. Por favor, ingrésala para desbloquearlo.',
            };
        }

        // Load with password
        const pdfDoc = await PDFDocument.load(buffer, {
            // @ts-expect-error pdf-lib password option
            password: password,
        });

        // Save completely unrestricted
        const cleanBytes = await pdfDoc.save();

        return {
            success: true,
            bytes: cleanBytes,
            wasEncrypted: true,
        };
    } catch (err: any) {
        const msg = String(err?.message || '').toLowerCase();
        if (msg.includes('password') || msg.includes('encrypt') || msg.includes('decrypt')) {
            return {
                success: false,
                wasEncrypted: true,
                error: 'La contraseña ingresada es incorrecta. Por favor, verifica e inténtalo de nuevo.',
            };
        }
        return {
            success: false,
            wasEncrypted: true,
            error: `Error al desbloquear el documento: ${err?.message || 'Contraseña incorrecta'}`,
        };
    }
}
