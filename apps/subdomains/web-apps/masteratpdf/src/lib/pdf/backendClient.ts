'use client';

export function getBackendUrl(): string {
    return (process.env.NEXT_PUBLIC_PDF_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
}

export async function postToBackend(
    path: string,
    formData: FormData,
    timeoutMs: number = 120000
): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`${getBackendUrl()}${path}`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
        });

        if (!res.ok) {
            let detail = `Error del servidor (${res.status})`;
            try {
                const json = await res.json();
                if (json?.detail) detail = String(json.detail);
            } catch {
                // ignore json parse failure
            }
            const err = new Error(detail) as Error & { status?: number };
            err.status = res.status;
            throw err;
        }

        return res;
    } finally {
        clearTimeout(timer);
    }
}

export function isHttpClientError(err: unknown): err is Error & { status: number } {
    if (typeof err !== 'object' || err === null || !('status' in err)) return false;
    const status = (err as { status?: unknown }).status;
    return typeof status === 'number' && status >= 400 && status < 500;
}

