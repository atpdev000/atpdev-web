'use client';

import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, FileCheck } from 'lucide-react';

interface FileUploadProps {
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    onFilesSelected: (files: File[]) => void;
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    accept = '.pdf',
    multiple = false,
    maxSize = 250,
    onFilesSelected,
    children,
    title = 'Cargar Documento PDF',
    subtitle = 'Arrastra y suelta tu archivo aquí, o haz clic para examinar',
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const validateFiles = (files: FileList): File[] => {
        const validFiles: File[] = [];
        setError(null);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check file size
            if (file.size > maxSize * 1024 * 1024) {
                setError(`El archivo "${file.name}" supera el límite de ${maxSize}MB.`);
                continue;
            }

            // Check file type
            if (accept !== '*' && !file.name.match(new RegExp(accept.replace(/\./g, '\\.').replace(/,/g, '|')))) {
                setError(`El archivo "${file.name}" no tiene un formato válido. Formatos admitidos: ${accept}`);
                continue;
            }

            validFiles.push(file);
        }

        if (!multiple && validFiles.length > 1) {
            return [validFiles[0]];
        }

        return validFiles;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const { files } = e.dataTransfer;
        if (files && files.length > 0) {
            const validFiles = validateFiles(files);
            if (validFiles.length > 0) {
                onFilesSelected(validFiles);
            }
        }
    }, [onFilesSelected, multiple, maxSize, accept]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            const validFiles = validateFiles(files);
            if (validFiles.length > 0) {
                onFilesSelected(validFiles);
            }
        }
    };

    return (
        <div className="w-full">
            <div
                className={`
                    relative border-2 border-dashed rounded-2xl p-10 md:p-14 text-center transition-all duration-200 cursor-pointer
                    ${isDragging
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 scale-[1.01] shadow-lg shadow-indigo-500/10'
                        : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/80 dark:hover:bg-slate-900/60'
                    }
                `}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="file-upload"
                />

                {children || (
                    <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 ${
                            isDragging 
                                ? 'bg-indigo-600 text-white scale-110 shadow-md' 
                                : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80'
                        }`}>
                            <Upload className="w-7 h-7" />
                        </div>

                        {/* Text */}
                        <div className="space-y-1">
                            <p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                                {isDragging ? 'Suelta tu archivo aquí' : title}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        </div>

                        {/* Specs badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            {accept !== '*' && (
                                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    Admite: {accept}
                                </span>
                            )}
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                Hasta {maxSize} MB
                            </span>
                            {multiple && (
                                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    Múltiples archivos
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl flex items-center justify-between text-sm text-red-700 dark:text-red-300">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-xs font-semibold hover:underline cursor-pointer ml-3 text-red-600 dark:text-red-400"
                    >
                        Descartar
                    </button>
                </div>
            )}
        </div>
    );
};
