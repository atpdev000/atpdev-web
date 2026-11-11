'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Lets the user drop files anywhere on the window (like iLovePDF).
 * Returns whether files are currently being dragged over the page.
 */
export function useWindowFileDrop(onFiles: (files: File[]) => void, enabled = true) {
    const [isDragging, setIsDragging] = useState(false);
    const counter = useRef(0);
    const handlerRef = useRef(onFiles);
    handlerRef.current = onFiles;

    useEffect(() => {
        if (!enabled) {
            setIsDragging(false);
            return;
        }

        const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');

        const onEnter = (e: DragEvent) => {
            if (!hasFiles(e)) return;
            e.preventDefault();
            counter.current += 1;
            setIsDragging(true);
        };
        const onOver = (e: DragEvent) => {
            if (!hasFiles(e)) return;
            e.preventDefault();
        };
        const onLeave = (e: DragEvent) => {
            if (!hasFiles(e)) return;
            counter.current = Math.max(0, counter.current - 1);
            if (counter.current === 0) setIsDragging(false);
        };
        const onDrop = (e: DragEvent) => {
            if (!hasFiles(e)) return;
            e.preventDefault();
            counter.current = 0;
            setIsDragging(false);
            const files = Array.from(e.dataTransfer?.files ?? []);
            if (files.length) handlerRef.current(files);
        };

        window.addEventListener('dragenter', onEnter);
        window.addEventListener('dragover', onOver);
        window.addEventListener('dragleave', onLeave);
        window.addEventListener('drop', onDrop);
        return () => {
            window.removeEventListener('dragenter', onEnter);
            window.removeEventListener('dragover', onOver);
            window.removeEventListener('dragleave', onLeave);
            window.removeEventListener('drop', onDrop);
        };
    }, [enabled]);

    return isDragging;
}
