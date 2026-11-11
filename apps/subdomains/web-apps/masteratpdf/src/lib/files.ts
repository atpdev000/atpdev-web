/** Shared helpers for file validation and naming across all tools. */

export const MAX_FILE_MB = 250;

export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(bytes < 10 * 1024 * 1024 ? 2 : 1)} MB`;
}

export function baseName(fileName: string): string {
    return fileName.replace(/\.[^.]+$/, '') || 'documento';
}

export interface ValidateOptions {
    accept?: string | string[];
    maxMB?: number;
    maxFiles?: number;
}

export interface ValidationErrorItem {
    file: File;
    error: string;
}

export interface ValidationResult {
    valid: File[];
    error: string | null;
    errors: ValidationErrorItem[];
}

/**
 * Validates files against an accept list (".pdf" or ".jpg,.png") and the size limit.
 * Supports both string accept and options object.
 */
export function validateFiles(
    input: FileList | File[],
    acceptOrOptions?: string | ValidateOptions,
    maxMBParam: number = MAX_FILE_MB
): ValidationResult {
    let acceptList: string[] = [];
    let maxMB = maxMBParam;
    let maxFiles: number | undefined = undefined;

    if (typeof acceptOrOptions === 'string') {
        acceptList = acceptOrOptions
            .split(',')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);
    } else if (acceptOrOptions && typeof acceptOrOptions === 'object') {
        if (typeof acceptOrOptions.accept === 'string') {
            acceptList = acceptOrOptions.accept
                .split(',')
                .map((e) => e.trim().toLowerCase())
                .filter(Boolean);
        } else if (Array.isArray(acceptOrOptions.accept)) {
            acceptList = acceptOrOptions.accept.map((e) => e.trim().toLowerCase());
        }
        if (typeof acceptOrOptions.maxMB === 'number') {
            maxMB = acceptOrOptions.maxMB;
        }
        if (typeof acceptOrOptions.maxFiles === 'number') {
            maxFiles = acceptOrOptions.maxFiles;
        }
    }

    const filesArray = Array.from(input);
    const valid: File[] = [];
    const errors: ValidationErrorItem[] = [];
    const wrongType: string[] = [];
    const tooBig: string[] = [];

    for (const file of filesArray) {
        const name = file.name.toLowerCase();
        const mime = (file.type || '').toLowerCase();

        const okType =
            acceptList.length === 0 ||
            acceptList.some((ext) => {
                if (ext.startsWith('.')) return name.endsWith(ext);
                return mime.includes(ext);
            });

        if (!okType) {
            wrongType.push(file.name);
            errors.push({
                file,
                error: `Formato no admitido. Formatos permitidos: ${acceptList.join(', ')}`,
            });
            continue;
        }

        if (file.size > maxMB * 1024 * 1024) {
            tooBig.push(file.name);
            errors.push({
                file,
                error: `Supera el límite de ${maxMB} MB (${formatBytes(file.size)})`,
            });
            continue;
        }

        if (typeof maxFiles === 'number' && valid.length >= maxFiles) {
            errors.push({
                file,
                error: `Solo se permite un máximo de ${maxFiles} archivo(s)`,
            });
            continue;
        }

        valid.push(file);
    }

    let error: string | null = null;
    if (wrongType.length) {
        error = `${wrongType.length === 1 ? `"${wrongType[0]}" no es` : `${wrongType.length} archivos no son`} un formato válido. Formatos admitidos: ${acceptList.join(', ')}.`;
    } else if (tooBig.length) {
        error = `${tooBig.length === 1 ? `"${tooBig[0]}" supera` : `${tooBig.length} archivos superan`} el límite de ${maxMB} MB.`;
    } else if (errors.length > 0) {
        error = errors[0].error;
    }

    return { valid, error, errors };
}

export const uid = () => Math.random().toString(36).slice(2, 11);
