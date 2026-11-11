'use client';

import { useCallback, useState } from 'react';
import { saveAs } from 'file-saver';

export type FlowStage = 'edit' | 'processing' | 'done';

export interface ToolResult {
    blob: Blob;
    fileName: string;
    /** Optional extra data a tool wants to show on the download screen. */
    meta?: Record<string, unknown>;
}

type ProgressFn = (percent: number, message?: string) => void;

/**
 * iLovePDF-style flow: edit → processing → done (download screen).
 * Each tool hands `run` an async task; the hook handles progress,
 * the automatic download, errors and going back to edit.
 */
export function useToolFlow() {
    const [stage, setStage] = useState<FlowStage>('edit');
    const [progress, setProgressValue] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [result, setResult] = useState<ToolResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const setProgress: ProgressFn = useCallback((percent, msg) => {
        setProgressValue(Math.max(0, Math.min(100, Math.round(percent))));
        if (msg !== undefined) setMessage(msg);
    }, []);

    const run = useCallback(async (task: (progress: ProgressFn) => Promise<ToolResult>) => {
        setError(null);
        setProgressValue(null);
        setMessage('');
        setStage('processing');
        window.scrollTo({ top: 0 });
        try {
            const r = await task(setProgress);
            setResult(r);
            saveAs(r.blob, r.fileName);
            setStage('done');
        } catch (e: unknown) {
            console.error(e);
            const msg = e instanceof Error ? e.message : 'No se pudo completar la operación.';
            setError(msg);
            setStage('edit');
        }
    }, [setProgress]);

    const download = useCallback(() => {
        if (result) saveAs(result.blob, result.fileName);
    }, [result]);

    const backToEdit = useCallback(() => {
        setStage('edit');
        setError(null);
    }, []);

    const reset = useCallback(() => {
        setStage('edit');
        setResult(null);
        setError(null);
        setProgressValue(null);
    }, []);

    return { stage, progress, message, result, error, setError, run, download, backToEdit, reset };
}
